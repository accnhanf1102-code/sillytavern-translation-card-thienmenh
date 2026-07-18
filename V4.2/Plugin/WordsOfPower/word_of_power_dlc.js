import { EFFECT_WORDS_DB } from './src/Database/effect_words_db.js';
import { META_WORDS_DB } from './src/Database/meta_words_db.js';
import { TARGET_WORDS_DB } from './src/Database/target_words_db.js';
import { PromptGenerator } from './src/class/spell_cal.js'
import { WordDataManager } from './src/class/word_data_manager.js'
import { WordParser } from './src/class/word_data_manager.js'
import { SpellCalculator } from './src/class/spell_cal.js'
import { DB_PATH } from "./src/class/CharDataManager.js"
import { BonusPromptGenerator } from './src/class/UIFormatHelper.js'
import { CharConfigManager } from './src/class/CharConfigHelper.js'
import { ChartManager } from './src/class/CharDataManager.js'

const { createApp, ref, computed, reactive, onMounted, onUnmounted, watch, markRaw } = window.Vue;
const win = window.parent ? window.parent : window;
const doc = win.document;
const WordDataMan = new WordDataManager();
const ConfigManager = new CharConfigManager('chat');
WordDataMan.init(EFFECT_WORDS_DB, META_WORDS_DB, TARGET_WORDS_DB);
const MOCK_DB = WordDataMan.activeDictionary;
const K = DB_PATH.KEY;
const R = DB_PATH.ROOT;

const CharacterManager = {
    mvuData: null,
    // 1. 路径映射表
    DB_PATH: DB_PATH,

    // 2. 路径解析执行器
    getDataByPath: function (pathStr) {
        if (!pathStr) return this.mvuData.stat_data;
        const parts = pathStr.split('.');
        let current = this.mvuData.stat_data;
        for (const p of parts) {
            if (current[p] === undefined) current[p] = {};
            current = current[p];
        }
        return current;
    },
    getPresentCharactersKey: function () {
        const keys = [];
        const isPresentKey = this.DB_PATH.KEY.NPC_IS_PRESENT;
        keys.push("Protagonist");
        const npcs = this.getDataByPath(this.DB_PATH.ROOT.NPCS);
        Object.entries(npcs).forEach(([name, data]) => {
            // 核心过滤逻辑：只有“在场”为 true 的才显示
            if (data[isPresentKey] === true || data[isPresentKey] === "true") {
                keys.push(name);
            }
        });
        return keys;
    },

    // 3. 获取实时在场角色列表
    getPresentCharacters: function () {
        const list = [];
        const isPresentKey = this.DB_PATH.KEY.NPC_IS_PRESENT;

        // 获取主角数据
        const playerBase = this.getDataByPath(this.DB_PATH.ROOT.PLAYER_BASE);
        list.push({
            key: 'Protagonist',
            displayName: 'Protagonist',
            isProtagonist: true,
            data: playerBase,
        });

        // 获取 NPC/关系列表
        const npcs = this.getDataByPath(this.DB_PATH.ROOT.NPCS);
        Object.entries(npcs).forEach(([name, data]) => {
            // 核心过滤逻辑：只有“在场”为 true 的才显示
            if (data[isPresentKey] === true || data[isPresentKey] === "true") {
                list.push({
                    key: name,
                    displayName: name,
                    isProtagonist: false,
                    data: data,
                });
            }
        });

        return list;
    },

    getPlayerData: function () {
        const mvuPlayerBase = this.getDataByPath(this.DB_PATH.ROOT.PLAYER_BASE);
        //模拟数据获取
        const CharData = {

        }
    },

    init: async function () {
        const findMvu = () => {
            if (typeof window.Mvu !== 'undefined') return window.Mvu;
            if (window.parent && typeof window.parent.Mvu !== 'undefined') return window.parent.Mvu;
            return null;
        };
        // 1. 定义一个简单的等待函数
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        let retries = 0;
        let mvuApi = findMvu();
        while (!mvuApi) {
            if (retries > 60) { // 延长超时时间到 30秒 (60*500ms)
                alert("链接超时，请检查mvu脚本是否存在");
                return;
            }

            await wait(500);
            retries++;
            mvuApi = findMvu(); // 再次尝试查找
        }
        this.mvuData = mvuApi.getMvuData({ type: 'message' });
    }
};


class CreateUserMessageInputer {
    constructor() {
        // 模拟用户输入，但不点击发送
        const parentWin = typeof window.parent !== 'undefined' ? window.parent : window;

        this.jQuery_API = typeof $ !== 'undefined' ? $ : parentWin.jQuery;
    }
    sendMessage(content, send = false) {
        if (typeof content !== 'string') {
            alert("消息内容必须是字符串");
            return;
        }
        // 1. 获取当前输入框里已经存在的内容（如果没有内容，会返回空字符串）
        let currentContent = this.jQuery_API('#send_textarea').val() || "";
        let separator = currentContent ? "\n" : ""; // 如果原本有内容，就加个换行；如果原本是空的，就不加
        let newContent = currentContent + separator + content;
        this.jQuery_API('#send_textarea').focus();
        this.jQuery_API('#send_textarea').val(newContent);
        this.jQuery_API('#send_textarea').trigger('input').trigger('change');
        if (send) this.jQuery_API('#send_button').click();
    }
}

const messageInputer = new CreateUserMessageInputer();



const LOCAL_VUE_PATH = './WordsOfPower/imoprt_src/vue.global.js';
const LOCAL_TAILWINDCSS_PATH = './WordsOfPower/dist/output.css';
function bootstrapVueWidget() {
    console.log("🚀 准备加载 Vue 3 与 Tailwind...");
    // 清理旧 DOM 和实例
    destroyCharWidget();

    // 🌟 1. 创建隔离的宿主容器与 Shadow DOM
    const rootDiv = doc.createElement('div');
    rootDiv.id = 'words-of-power-rc-vue-root';

    // 🌟 修复：将其作为一个“占地面积为0，但允许内部元素溢出显示”的绝对定位锚点。
    // 它自己绝对不会阻挡点击，所以不需要写 pointer-events。
    rootDiv.style.cssText = 'position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: visible; z-index: 2147483647;';
    doc.body.appendChild(rootDiv);

    // 开启影子 DOM 黑盒，mode: 'open' 允许我们通过 JS 访问内部
    const shadowRoot = rootDiv.attachShadow({ mode: 'open' });

    // 在影子 DOM 内创建一个专门供 Vue 挂载的实际容器
    const appContainer = doc.createElement('div');
    appContainer.id = 'app-container';

    shadowRoot.appendChild(appContainer);

    let resourcesLoaded = 0;
    const checkInit = () => {
        resourcesLoaded++;
        // 只有当 Vue 和 Tailwind 两个都加载完了，才初始化
        if (resourcesLoaded === 2) {
            // 🌟 核心修改：把内部容器和影子根节点传给初始化函数
            initVueApp(appContainer, shadowRoot);
        }
    };

    // 【核心修复】：为 script 标签打上专属 ID，防止重复注入
    let vueScript = document.getElementById('destined-words-power-vue-script');
    // 1. 加载 Vue 脚本 (逻辑保持不变)
    if (!vueScript) {
        vueScript = document.createElement('script');
        vueScript.id = 'destined-words-power-vue-script';
        vueScript.src = LOCAL_VUE_PATH;
        vueScript.onload = checkInit;
        vueScript.onerror = () => {
            console.warn('本地 Vue 加载失败，回退到 CDN');
            vueScript.remove();
            const fallbackScript = document.createElement('script');
            fallbackScript.id = 'destined-words-power-vue-script';
            fallbackScript.src = 'https://unpkg.com/vue@3/dist/vue.global.js';
            fallbackScript.onload = checkInit;
            document.head.appendChild(fallbackScript);
        };
        document.head.appendChild(vueScript);
    } else {
        checkInit();
    }

    // 2. 🟢 核心修复：用 fetch 暴力拉取 CSS 文本并注入为 <style>
    fetch(LOCAL_TAILWINDCSS_PATH)
        .then(response => {
            if (!response.ok) throw new Error("CSS拉取失败");
            return response.text();
        })
        .then(cssText => {

            // 🌟 关键修复：将 Tailwind 的 :root 变量声明强制转换为 Shadow DOM 的 :host 声明
            const shadowDOMFriendlyCSS = cssText.replace(/:root/g, ':host');

            const style = doc.createElement('style');
            style.id = 'destined-words-power-tailwind-style';
            // 将拉取到的 CSS 内容直接塞入标签
            style.textContent = shadowDOMFriendlyCSS;
            // 注入到黑盒里，绝对不会污染外部宿主
            shadowRoot.appendChild(style);
            console.log("成功注入");
            checkInit();
        })
        .catch(err => {
            console.error('静态 Tailwind CSS 加载失败:', err);
            checkInit(); // 失败也放行，以免卡死
        });

}

function destroyCharWidget() {
    const root = doc.getElementById('words-of-power-rc-vue-root');
    if (root) root.remove();
    const style = doc.getElementById('words-of-power-rc-styles');
    if (style) style.remove();
    if (win.__DESTINED_WORDS_RC_VUE_APP__) {
        win.__DESTINED_WORDS_RC_VUE_APP__.unmount();
        delete win.__DESTINED_WORDS_RC_VUE_APP__;
    }
}
if (win.__DESTINED_WORDS_OF_POWER_UNLOAD_HANDLER__) {
    window.removeEventListener('unload', win.__DESTINED_WORDS_OF_POWER_UNLOAD_HANDLER__);
}
win.__DESTINED_WORDS_OF_POWER_UNLOAD_HANDLER__ = destroyCharWidget;
window.addEventListener('unload', win.__DESTINED_WORDS_OF_POWER_UNLOAD_HANDLER__);

// 全局样式工具方法 (混入给各个组件)
const GlobalUtils = {
    methods: {
        getQualityColor(quality) {
            const map = {
                'Common': 'text-gray-400',
                'Uncommon': 'text-emerald-400',
                'Rare': 'text-blue-400',
                'Epic': 'text-purple-400',
                'Legendary': 'text-yellow-400 drop-shadow-md',
                'Mythic': 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] font-bold',
                'Unique': 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] font-extrabold'
            };
            return map[quality] || 'text-blue-200';
        },
        // 【新增】实时计算并显示超魔缩放消耗的通用方法
        getMetaCostDisplay(word, currentQuality, boostLevel = null, holderWord = null) {
            if (!word) return 0;

            // 特殊处理：如果是“增强”超魔且选择了具体层级，优先读取宿主咒字规定的固有消耗
            if (boostLevel && holderWord && holderWord.boost && holderWord.boost[boostLevel]) {
                const boostData = holderWord.boost[boostLevel];
                if (boostLevel === 'limit') return '50% Giới Hạn Trên'; // 极限层级特殊标识
                if (boostData.extra_cost?.mp !== undefined && boostData.extra_cost?.mp !== null) {
                    return boostData.extra_cost.mp + ' MP'; // 固有消耗无需系数
                }
            }

            // 常规超魔或没有独立设定消耗的增强层级：基础消耗 * 品质系数
            const baseMp = word.extra_cost?.mp || 0;
            const META_COST_MODS = { 'Common': 0.25, 'Uncommon': 0.5, 'Rare': 0.75, 'Epic': 1.0, 'Legendary': 1.5, 'Mythic': 2.0, 'Unique': 2.0 };
            const mod = META_COST_MODS[currentQuality] || 1.0;
            return Math.floor(baseMp * mod) + ' MP';
        }
    }
};
function getQualityColor(quality) {
    const map = {
        'Common': 'text-gray-400',
        'Uncommon': 'text-emerald-400',
        'Rare': 'text-blue-400',
        'Epic': 'text-purple-400',
        'Legendary': 'text-yellow-400 drop-shadow-md',
        'Mythic': 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] font-bold',
        'Unique': 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] font-extrabold'
    };
    return map[quality] || 'text-blue-200';
}

function useMaskClose(closeAction) {
    let isMaskMousedown = false;
    const onMaskMousedown = (e) => {
        if (e.target === e.currentTarget) isMaskMousedown = true;
        else isMaskMousedown = false;
    };
    const onMaskMouseup = (e) => {
        if (e.target === e.currentTarget && isMaskMousedown) {
            if (typeof closeAction === 'function') closeAction();
        }
        isMaskMousedown = false;
    };
    return { onMaskMousedown, onMaskMouseup };
}

// ==========================================
// 交互逻辑 Hooks：拖拽与缩放
// ==========================================
function useDraggable(Vue, onClickCb = null, storageKey = null, defaultPos = { x: 50, y: 50 }, win, doc) {
    const { reactive, onMounted } = Vue;
    const pos = reactive({ x: defaultPos.x, y: defaultPos.y });

    onMounted(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                pos.x = parsed.x; pos.y = parsed.y;
            }
        }
    });

    const startDrag = (e) => {
        let hasMoved = false;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const startX = clientX - pos.x;
        const startY = clientY - pos.y;

        const onDrag = (ev) => {
            ev.preventDefault();
            hasMoved = true;
            const cX = ev.touches ? ev.touches[0].clientX : ev.clientX;
            const cY = ev.touches ? ev.touches[0].clientY : ev.clientY;
            pos.x = cX - startX;
            pos.y = cY - startY;
        };

        const stopDrag = () => {
            doc.removeEventListener('mousemove', onDrag);
            doc.removeEventListener('mouseup', stopDrag);
            doc.removeEventListener('touchmove', onDrag);
            doc.removeEventListener('touchend', stopDrag);

            if (hasMoved && storageKey) {
                localStorage.setItem(storageKey, JSON.stringify({ x: pos.x, y: pos.y }));
            }
            if (!hasMoved && onClickCb) onClickCb();
        };

        doc.addEventListener('mousemove', onDrag);
        doc.addEventListener('mouseup', stopDrag);
        doc.addEventListener('touchmove', onDrag, { passive: false });
        doc.addEventListener('touchend', stopDrag);
    };

    return { pos, startDrag };
}

function useResizable(Vue, defaultSize = { w: 1200, h: 800 }, minSize = { w: 800, h: 600 }, win, doc) {
    const { reactive } = Vue;
    const size = reactive({ w: defaultSize.w, h: defaultSize.h });

    const startResize = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.touches ? e.touches[0].clientX : e.clientX;
        const startY = e.touches ? e.touches[0].clientY : e.clientY;
        const startW = size.w;
        const startH = size.h;

        const onResize = (ev) => {
            const cX = ev.touches ? ev.touches[0].clientX : ev.clientX;
            const cY = ev.touches ? ev.touches[0].clientY : ev.clientY;
            size.w = Math.max(minSize.w, startW + (cX - startX));
            size.h = Math.max(minSize.h, startH + (cY - startY));
        };

        const stopResize = () => {
            doc.removeEventListener('mousemove', onResize);
            doc.removeEventListener('mouseup', stopResize);
            doc.removeEventListener('touchmove', onResize);
            doc.removeEventListener('touchend', stopResize);
        };

        doc.addEventListener('mousemove', onResize);
        doc.addEventListener('mouseup', stopResize);
        doc.addEventListener('touchmove', onResize, { passive: false });
        doc.addEventListener('touchend', stopResize);
    };

    return { size, startResize };
}

function useFloatingBall(Vue, onClickCallback, win, doc) {
    const { reactive, onMounted, onUnmounted } = Vue;
    const fab = reactive({
        x: win.innerWidth - 100, y: win.innerHeight - 100,
        isDragging: false, hasMoved: false, startX: 0, startY: 0
    });

    const startDrag = (e) => {
        fab.isDragging = true; fab.hasMoved = false;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        fab.startX = clientX - fab.x; fab.startY = clientY - fab.y;
        doc.addEventListener('mousemove', onDrag);
        doc.addEventListener('touchmove', onDrag, { passive: false });
        doc.addEventListener('mouseup', stopDrag);
        doc.addEventListener('touchend', stopDrag);
    };

    const onDrag = (e) => {
        if (!fab.isDragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const newX = clientX - fab.startX; const newY = clientY - fab.startY;
        if (Math.abs(newX - fab.x) > 3 || Math.abs(newY - fab.y) > 3) fab.hasMoved = true;
        fab.x = Math.max(0, Math.min(newX, win.innerWidth - 64));
        fab.y = Math.max(0, Math.min(newY, win.innerHeight - 64));
    };

    const stopDrag = () => {
        fab.isDragging = false;
        doc.removeEventListener('mousemove', onDrag);
        doc.removeEventListener('touchmove', onDrag);
        doc.removeEventListener('mouseup', stopDrag);
        doc.removeEventListener('touchend', stopDrag);
        // 【新增】如果发生了移动，则保存位置到本地；否则执行点击回调
        if (fab.hasMoved) {
            localStorage.setItem('starry_fab_pos', JSON.stringify({ x: fab.x, y: fab.y }));
        } else {
            onClickCallback();
        }
    };

    const onResize = () => {
        fab.x = Math.min(fab.x, win.innerWidth - 64);
        fab.y = Math.min(fab.y, win.innerHeight - 64);
    };

    onMounted(() => {
        // 【新增】初始化时读取本地保存的位置
        const saved = localStorage.getItem('starry_fab_pos');
        if (saved) {
            const parsed = JSON.parse(saved);
            fab.x = parsed.x; fab.y = parsed.y;
        }
        win.addEventListener('resize', onResize);
    });
    onUnmounted(() => { win.removeEventListener('resize', onResize); });

    return { fab, startDrag };
}


function useMessageToast(Vue) {
    const { reactive } = Vue;
    const toastUI = reactive({
        toasts: [],
        idCounter: 0,

        removeToast(id) {
            const index = this.toasts.findIndex(t => t.id === id);
            if (index > -1) this.toasts.splice(index, 1);
        },

        /**
         * 弹出星界提示
         * @param {string} message - 提示内容
         * @param {string} type - 'info'(默认) | 'success' | 'warning' | 'error'
         * @param {number} duration - 自动消失时间(毫秒)
         */
        showToast(message, type = 'info', duration = 3000) {
            const id = this.idCounter++;
            // error 级别强制要求手动关闭，不自动消失
            const requireClose = type === 'error';

            this.toasts.push({ id, message, type, requireClose });

            if (!requireClose) {
                setTimeout(() => this.removeToast(id), duration);
            }
        },
        // 【新增】专属的交互式抉择通知
        confirm(message, onConfirm, onCancel = null) {
            const id = this.idCounter++;
            this.toasts.push({
                id,
                message,
                type: 'confirm',
                requireClose: false, // 隐藏右上角的X，强制用户点下方按钮
                isConfirm: true,
                // 包装回调函数，点击后自动销毁 Toast
                onConfirm: () => {
                    if (onConfirm) onConfirm();
                    this.removeToast(id);
                },
                onCancel: () => {
                    if (onCancel) onCancel();
                    this.removeToast(id);
                }
            });
        }
    });

    return toastUI;
}


function useSystemUI(Vue) {
    const { reactive } = Vue;
    const ui = reactive({
        mainModalOpen: false,
        activeTab: 'spell_builder',
        enableConstellation: true, // 【新增】星轨默认开启
        tabs: [
            { id: 'spell_builder', name: 'Chú tự tổ hợp' },
            { id: 'word_forge', name: 'Trích xuất chú tự' },
            { id: 'lore_book', name: 'Xem thiết lập' },
            { id: 'other_module', name: 'Ngắm sao' },
        ]
    });


    const characterData = reactive({ protagonist: null, others: [] });

    const updateCharacterData = async () => {

        const mvuApi = win.Mvu || (win.SillyTavern && win.SillyTavern.Mvu);
        if (mvuApi) {
            const data = mvuApi.getMvuData({ type: 'message', message_id: 'latest' });
            ChartManager.mvuData = data;
        }

        return new Promise(resolve => {
            //console.log("角色数据更新");
            setTimeout(() => {
                const playerData = ChartManager.getPlayerBase();
                const runtime = ChartManager.getPlayerRuntime();
                console.log(K.PLAYER_ATTRIBUTES);
                characterData.protagonist = {
                    key: 'Protagonist', displayName: 'Protagonist', isProtagonist: true,
                    stats: {

                        statModifier: playerData[K.PLAYER_ATTRIBUTES].Intelligence || 0,
                        dcBonus: runtime?.stats?.spell_dc_all || 0,
                        maxMp: playerData[K.PLAYER_MAXMP]
                    },
                    runtime: markRaw(runtime),
                    data: playerData
                };
                console.log(characterData);
                resolve();
            }, 300);
        });
    };

    const openMainModal = async () => {
        // 仅在数据为空时做一次兜底加载
        if (!characterData.protagonist) {
            await updateCharacterData();
        }
        ui.mainModalOpen = true;
    };
    const closeMainModal = () => { ui.mainModalOpen = false; };
    const maskEvents = useMaskClose(closeMainModal);

    return { ui, characterData, updateCharacterData, openMainModal, closeMainModal, maskEvents };
}

// ================== 组件定义 ==================
const MagicInput = {
    template: `
        <div class="relative w-full">
            <input
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                :placeholder="placeholder"
                class="w-full bg-[#0a0f1d]/60 border border-blue-500/30 rounded px-3 py-1.5 text-sm text-blue-100 placeholder-blue-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all shadow-inner"
            >
        </div>
    `,
    props: ['modelValue', 'placeholder']
};

const SpellOverview = {
    template: `
        <header class="bg-[#1e293b]/90 p-4 rounded-xl shadow-lg border border-blue-400/30 relative overflow-y-auto overflow-x-hidden custom-scrollbar shrink-0 max-h-[40%] z-20"> <!--overflow-y-auto overflow-x-hidden-->
            <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div class="flex justify-between items-center mb-3 border-b border-blue-700/50 pb-2 relative z-10">
                <h1 class="text-base font-bold text-blue-100 flex items-center shrink-0">
                    <span class="mr-2">✨</span> 
                    Tổng quan chú tự tổ hợp
                </h1>
                <div class="text-xs text-gray-400 font-mono bg-[#0f172a]/50 px-2.5 py-1 rounded border border-blue-900/30 truncate max-w-[50%] sm:max-w-[65%]" :title="stats.dc.detailString">
                    Tính toán DC: {{ stats.dc.detailString }}
                </div>
            </div>
            
            <div class="flex flex-wrap gap-2 text-xs text-blue-100 relative z-10">
                
                <div class="flex-1 min-w-[160px] bg-[#0f172a]/60 p-2.5 rounded-lg border border-blue-800/40 flex flex-col justify-between">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[11px] text-blue-300/80">Phẩm chất cốt lõi/DC Kiểm định</span>
                        <span class="text-[11px] text-gray-400 font-mono">Giới hạn mp</span>
                    </div>
                    <div class="flex justify-between items-baseline mt-1">
                        <div class="flex items-baseline space-x-1.5">
                            <span :class="['font-bold text-base', getQualityColor(stats.quality)]">{{ stats.quality || 'Common' }}</span>
                            <span class="text-gray-500">/</span>
                            <span class="text-pink-400 font-bold text-base">{{ stats.dc.total || 10 }} DC</span>
                        </div>
                        <div class="text-[11px] text-blue-400/90 font-mono bg-[#1e293b]/50 px-1.5 py-0.5 rounded border border-blue-900/30">
                            Cơ bản:{{ stats.cost.baseCapLimit }} | Tổng:{{ stats.cost.totalCapLimit }}
                        </div>
                    </div>
                </div>
                
                <div class="flex-1 min-w-[160px] bg-[#0f172a]/60 p-2.5 rounded-lg border border-blue-800/40 flex flex-col justify-between">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[11px] text-blue-300/80">Miễn nhiễm tổng thể</span>
                        <span class="text-[11px] text-blue-300/80">Tiêu hao hành động</span>
                    </div>
                    <div class="flex justify-between items-center gap-2 mt-1">
                        <div class="flex-1 min-w-0">
                            <span v-if="stats.save.type === 'Không'" class="text-gray-400 font-medium">Không cần miễn nhiễm</span>
                            <span v-else-if="stats.save.options.length <= 1" class="text-orange-400 font-bold block truncate" :title="stats.save.type + '(' + stats.save.on_save + ')'"> {{ stats.save.type }}
                            </span>
                            <select v-else v-model="spell.selected_save_id" class="w-full bg-[#1f2937] border border-blue-600/50 rounded text-orange-400 px-1.5 py-0.5 outline-none text-xs truncate focus:border-blue-400">
                                <option v-for="opt in stats.save.options" :key="opt.sourceId" :value="opt.sourceId"> {{ opt.type }} 
                                </option>
                            </select>
                        </div>
                        <span class="text-blue-100 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-600/50 whitespace-nowrap shrink-0 font-medium">
                            {{ stats.action.desc }}
                        </span>
                    </div>
                </div>

                <div class="flex-1 min-w-[160px] bg-[#0f172a]/60 p-2.5 rounded-lg border border-blue-800/40 flex flex-col justify-between cursor-help hover:bg-[#1e293b]/50 transition-colors"
                    @mouseover="onMpEnter" @mousemove="onMpMove" @mouseleave="onMpLeave">
                    <div class="text-[11px] text-blue-300/80 mb-1 flex justify-between items-center">
                        <span class="border-b border-dashed border-blue-400/50 pb-[1px]">Tiêu hao mp ⓘ</span>
                        <span v-if="stats.cost.uncappedMp > 0" class="text-purple-400 font-bold text-[10px] animate-pulse bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                            ⚠️ Tăng cường cực hạn (+50% MP tối đa) {{ stats.cost.uncappedMp }}
                        </span>
                    </div>
                    <div class="grid grid-cols-3 gap-1.5 text-center font-mono">
                        <div class="bg-blue-950/40 p-1 rounded border border-blue-900/30">
                            <span class="text-gray-400 block text-[9px] mb-0.5">Cơ bản</span>
                            <span class="text-blue-300 font-bold text-xs">{{ stats.cost.baseMp }}</span>
                        </div>
                        <div class="bg-purple-950/40 p-1 rounded border border-purple-900/30">
                            <span class="text-gray-400 block text-[9px] mb-0.5">Siêu ma</span>
                            <span class="text-purple-300 font-bold text-xs">{{ stats.cost.metaMp + stats.cost.uncappedMp }}</span>
                        </div>
                        <div class="bg-emerald-950/40 p-1 rounded border border-emerald-900/30">
                            <span class="text-gray-400 block text-[9px] mb-0.5">Tổng cộng</span>
                            <span :class="['text-xs font-bold', stats.cost.isTotalCapped ? 'text-red-400' : 'text-emerald-400']">{{ stats.cost.finalMp }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="stats.cost.finalHp > 0" class="mt-3 bg-red-950/40 border border-red-900/40 p-2 rounded-lg flex items-center justify-between text-xs font-mono shadow-inner relative z-10">
                <div class="flex items-center space-x-2 text-red-400">
                    <span class="text-sm">🩸</span>
                    <span class="font-bold">Tiêu hao hp: <span class="text-red-300 text-sm font-black">{{ stats.cost.finalHp }} HP</span></span>
                </div>
                <div class="text-[11px] flex space-x-3">
                    <span v-if="stats.cost.finalHp - stats.cost.overflowHp > 0" class="text-red-300/80">
                        Tổn hao cố hữu: {{ stats.cost.finalHp - stats.cost.overflowHp }} HP
                    </span>
                    <span v-if="stats.cost.overflowHp > 0" class="text-amber-400 font-bold bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-900/30">
                        Phản phệ vô hạn: {{ stats.cost.overflowHp }} HP
                    </span>
                </div>
            </div>

            <div v-if="stats.validation && !stats.validation.isValid" class="mt-3 bg-red-900/20 border border-red-700/50 p-2 rounded-lg text-red-300 text-xs space-y-0.5 shadow-inner">
                <div v-for="(err, i) in stats.validation.errors" :key="i" class="flex items-start">
                    <span class="mr-1.5 text-red-400">⚠️</span> <span>{{ err }}</span>
                </div>
            </div>
        </header>
        <teleport :to="teleportTarget" v-if="teleportTarget"><div v-if="mpTooltip.show" 
                 class="fixed z-[9999] pointer-events-none w-max max-w-[280px] bg-[#0b1120] border border-blue-500 rounded-lg p-3 shadow-[0_0_30px_rgba(59,130,246,0.6)] flex flex-col transition-opacity duration-150"
                 :style="{ left: (mpTooltip.x + 15) + 'px', top: (mpTooltip.y + 15) + 'px' }">
                 
                <div class="text-sm font-bold text-blue-200 mb-2 border-b border-blue-800/80 pb-1 flex items-center">
                    <span class="mr-1.5">💧</span> Chi tiết tiêu hao MP
                </div>
                
                <div v-if="stats.cost.mpDetails && stats.cost.mpDetails.length > 0" class="flex flex-col space-y-1.5">
                    <div v-for="(detail, idx) in stats.cost.mpDetails" :key="idx" 
                         class="text-xs text-blue-100/90 font-mono leading-relaxed bg-[#1e293b]/40 px-2 py-1 rounded border border-blue-900/30">
                        {{ detail }}
                    </div>
                </div>
                <div v-else class="text-xs text-gray-500 italic text-center py-2">
                    Tạm thời không có ma lực lưu động...
                </div>
            </div>
        </teleport>
    `,
    props: { stats: Object, spell: Object },
    mixins: [GlobalUtils],
    data() {
        return {
            mpTooltip: { show: false, x: 0, y: 0 },
            teleportTarget: null // 新增：用于存放真实的 DOM Mục tiêu
        };
    },
    mounted() {
        // 核心破解法：this.$el.getRootNode() 能完美穿透并获取当前所在的 ShadowRoot
        const shadowRoot = this.$el.getRootNode();

        // 在 ShadowRoot 内部去 querySelector，就能找到了！
        // 如果找不到 #app-container，就保底挂载到当前 Vue 实例的最外层根元素上
        this.teleportTarget = shadowRoot.querySelector('#app-container') || this.$root.$el;
    },
    methods: {
        onMpEnter(e) {
            this.mpTooltip.show = true;
            this.mpTooltip.x = e.clientX;
            this.mpTooltip.y = e.clientY;
        },
        onMpMove(e) {
            this.mpTooltip.x = e.clientX;
            this.mpTooltip.y = e.clientY;
        },
        onMpLeave() {
            this.mpTooltip.show = false;
        }
    }
};

const WordSlot = {
    template: `
        <section class="bg-[#162032]/90 p-3 rounded-lg border border-blue-800/40 flex flex-col relative">
            <div class="flex justify-between items-center mb-2 border-b border-blue-800/50 pb-1.5">
                <h2 class="text-s font-bold text-blue-100 tracking-wide">{{ title }}</h2>
                <button @click="$emit('open-main')" :class="['px-2 py-1 rounded transition font-medium text-sm shadow', btnColor]">{{ btnText }}</button>
            </div>
            
            <div :class="['overflow-y-auto custom-scrollbar pr-1', items.length > 1 && slotType === 'effect' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' : 'space-y-2']">
                <div v-for="(holder, index) in items" :key="index" class="bg-[#1e293b]/80 p-2.5 rounded-md text-sm relative border border-blue-700/30 transition-all hover:border-blue-400/50 group flex flex-col cursor-context-menu" title="Nhấp chuột phải để xem chi tiết chú tự này" @contextmenu.prevent="$emit('show-details', holder.word)">
                    <button @click.stop="$emit('remove-word', index)" class="absolute top-1 right-1.5 text-red-400/80 hover:text-red-300 text-xl leading-none opacity-0 group-hover:opacity-100 transition z-10" title="Loại bỏ chú tự này">&times;</button>
                    
                    <div class="flex items-center justify-between mb-1.5 pr-4">
                        <div :class="['font-bold truncate max-w-[130px] text-xs', getQualityColor(holder.word.quality)]">
                            {{ holder.word.name }} 
                        </div>
                        <div class="text-[11px] text-blue-300 bg-blue-900/40 border border-blue-700/50 px-1.5 py-0.5 rounded font-mono shrink-0">
                            {{ slotType === 'spell' ? getMetaCostDisplay(holder.word, currentQuality) : (holder.word.extra_cost?.mp || 0) + ' MP' }}
                        </div>
                    </div>
                    
                    <div @contextmenu.stop> 
                        <magic-input v-model="holder.input_args.custom_desc" placeholder="Chỉ lệnh bổ sung..."></magic-input>
                    </div>
                    
                    <div v-if="slotType !== 'spell'" class="mt-2 pt-2 border-t border-indigo-800/30" @contextmenu.stop>
                        <div class="flex flex-wrap gap-1.5">
                            <div v-for="(m, mIdx) in holder.meta" :key="mIdx" class="bg-[#0f172a] px-1.5 py-1 rounded text-xs flex items-center border border-indigo-900/50 group/meta cursor-context-menu" @contextmenu.prevent="$emit('show-details', m.word)" title="Nhấp chuột phải để xem chi tiết siêu ma">
                                <span :class="['truncate max-w-[65px]', getQualityColor(m.word.quality)]">
                                    {{ m.word.name }}
                                    <span class="text-[10px] text-indigo-300 font-mono">({{ getMetaCostDisplay(m.word, currentQuality, m.input_args?.boost_level, holder.word) }})</span>
                                </span>
                                <select v-if="m.word.name.includes('Tăng cường')" v-model="m.input_args.boost_level" class="ml-1 bg-transparent text-indigo-300 outline-none w-12 text-[11px]" @click.stop>
                                    <option v-for="(lvl, key) in holder.word.boost" :key="key" v-show="key !== 'total_level'" :value="key">
                                        {{ key === 'limit' ? 'Cực hạn' : 'L'+key }}
                                    </option>
                                </select>
                                <button @click.stop="$emit('remove-meta', holder, mIdx)" class="ml-1 text-red-500/80 hover:text-red-400 opacity-0 group-hover/meta:opacity-100 transition">&times;</button>
                            </div>
                            <button @click.stop="$emit('open-meta', holder)" class="text-xs text-indigo-400/80 hover:text-indigo-200 bg-indigo-900/20 px-2 py-1 rounded border border-indigo-800/30 transition">+Siêu ma</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    components: { MagicInput },
    props: { title: String, slotType: String, btnText: String, btnColor: String, items: Array, currentQuality: String },
    emits: ['open-main', 'open-meta', 'remove-word', 'remove-meta', 'show-details'],
    mixins: [GlobalUtils]
};

const WordSelector = {
    template: `
        <div class="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/20 flex items-center justify-center z-40" 
        @mousedown="maskEvents.onMaskMousedown" 
        @mouseup="maskEvents.onMaskMouseup"> <div class="bg-[#0b1120] p-6 rounded-xl w-3/4 max-w-[60vw] max-h-[80vh] min-h-[60vh] flex flex-col shadow-[0_0_50px_rgba(30,58,138,0.5)] border border-blue-500/50">
                <div class="flex justify-between items-center mb-4 border-b border-blue-800/50 pb-3">
                    <div class="flex items-center space-x-4">
                        <h2 class="text-xl font-bold text-blue-200">
                            Chú tự tùy chọn <span class="text-sm font-normal text-blue-400/80">(Chuột phải xem chi tiết)</span>
                        </h2>
                        
                        <div class="flex items-center space-x-2 bg-[#1e293b]/60 p-1.5 rounded-lg border border-blue-800/50 shadow-inner">
                            <span class="text-xs text-blue-400 font-bold ml-1">Nguồn</span>
                            <select v-model="filters.targetType" class="bg-[#0f172a] border border-blue-600/50 rounded text-blue-300 px-2 py-0.5 outline-none text-xs focus:border-blue-400 transition cursor-pointer">
                                <option value="Tất cả">Tất cả</option>
                                <option value="Tích hợp">Tích hợp</option>
                                <option value="Tùy chỉnh">Tùy chỉnh</option>
                            </select>
                            
                            <div class="w-px h-4 bg-blue-800/50 mx-1"></div>
                            
                            <span class="text-xs text-blue-400 font-bold">Phẩm chất</span>
                            <select v-model="filters.subTargetType" class="bg-[#0f172a] border border-blue-600/50 rounded text-blue-300 px-2 py-0.5 outline-none text-xs focus:border-blue-400 transition cursor-pointer">
                                <option value="Tất cả">Tất cả</option>
                                <option value="Common" class="text-gray-400">Common</option>
                                <option value="Uncommon" class="text-emerald-400">Uncommon</option>
                                <option value="Rare" class="text-blue-400">Rare</option>
                                <option value="Epic" class="text-purple-400">Epic</option>
                                <option value="Legendary" class="text-yellow-400">Legendary</option>
                                <option value="Mythic" class="text-red-500">Mythic</option>
                                <option value="Unique" class="text-amber-500">Unique</option>
                            </select>
                        </div>
                    </div>
                    <button @click="$emit('close')" class="text-blue-500 hover:text-white text-3xl leading-none shrink-0">&times;</button>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2 relative">

                    <div v-if="list.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-blue-500/50 font-mono space-y-3 transition-opacity duration-300">
                        <div class="text-5xl opacity-50 mb-2">🌌</div>
                        <div class="text-lg tracking-widest drop-shadow">Sâu trong tinh không trống không...</div>
                        <div class="text-xs text-blue-700/60">Có lẽ nên điều chỉnh lại bộ lọc quan sát một chút</div>
                    </div>

                    <div v-else class="overflow-y-auto custom-scrollbar grid grid-cols-2 gap-4">
                        <div v-for="w in list" :key="w.uid" 
                            @click="$emit('select', w)"
                            @contextmenu.prevent="$emit('show-details', w)"
                            class="bg-[#111827] hover:bg-[#1e293b] p-4 rounded-lg cursor-pointer transition-all flex flex-col justify-between border border-blue-900/30 border-l-4 border-l-transparent hover:border-l-blue-500 shadow-md">
                            <div>
                                <div class="flex items-center space-x-2 mb-1">
                                    <span v-if="w.uid && w.uid.includes('hidden')" class="text-[10px] bg-amber-900/60 text-amber-300 border border-amber-500/50 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse shrink-0">
                                        ✦ Bí nguyên
                                    </span>
                                    <div :class="['font-bold text-lg', getQualityColor(w.quality || w.quality_limit), w.uid && w.uid.includes('hidden') ? 'drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]' : '']">
                                        {{ w.name }}
                                    </div>
                                </div>
                                <div class="text-[11px] text-blue-400/60 mb-2 font-mono flex gap-2">
                                    <span v-if="w.quality" class="bg-blue-900/30 px-1.5 rounded border border-blue-800/50">Phẩm chất: {{w.quality}}</span>
                                    <span v-if="w.quality_limit" class="bg-indigo-900/30 px-1.5 rounded border border-indigo-800/50">Giới hạn dưới: {{w.quality_limit}}</span>
                                    <span v-if="w.extra_cost && w.extra_cost.mp" class="bg-purple-900/30 px-1.5 rounded border border-purple-800/50">{{ w.uid && w.uid.startsWith('meta') ? getMetaCostDisplay(w, currentQuality) : w.extra_cost.mp + ' MP' }}</span>
                                    <span v-if="w.action_cost && w.action_cost.standard != 0" class="bg-purple-900/30 px-1.5 rounded border border-purple-800/50"> 
                                        Tấn công
                                        <span v-if="Number(w.action_cost?.standard) != 1">: {{w.action_cost?.standard}} </span>
                                    </span>
                                    <span v-if="w.action_cost && w.action_cost.move != 0" class="bg-purple-900/30 px-1.5 rounded border border-purple-800/50"> 
                                        Hành động
                                        <span v-if="Number(w.action_cost?.move) != 1">: {{w.action_cost?.move}}</span>
                                    </span>
                                </div>
                            </div>
                            <div class="text-sm text-blue-200/70 line-clamp-2 leading-relaxed">{{ getBriefDesc(w) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: { list: Array, currentQuality: String, filters: Object },
    emits: ['close', 'select', 'show-details'],
    mixins: [GlobalUtils],
    setup(props, { emit }) {
        const getBriefDesc = (w) => {
            if (w.target_desc) return w.target_desc;
            if (w.effect_desc) return Object.values(w.effect_desc)[0];
            return "未知...";
        };
        const maskEvents = useMaskClose(() => emit('close'));
        return { getBriefDesc, maskEvents };
    }
};

const WordDetail = {
    template: `
        <div class="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/40 backdrop-blur-md flex items-center justify-center z-50" 
            @mousedown="maskEvents.onMaskMousedown" 
            @mouseup="maskEvents.onMaskMouseup"> <div class="bg-[#0b1120] p-6 rounded-xl w-1/2 max-w-[550px] max-h-[80vh] overflow-y-auto custom-scrollbar border-2 border-blue-500 shadow-[0_0_60px_rgba(59,130,246,0.3)] relative text-sm">
                <button @click="$emit('close')" class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-blue-500 hover:text-white hover:bg-blue-900/60 rounded-full text-2xl transition-colors">&times;</button>
                
                <h2 :class="['text-3xl font-bold mb-3 drop-shadow-md', getQualityColor(word.quality)]">{{ word.name }}</h2>
                <div class="flex flex-wrap gap-2 mb-5 text-xs font-mono">
                    <span v-if="word.quality" class="bg-blue-900/60 border border-blue-500/50 px-2 py-1 rounded text-blue-100">Phẩm chất cốt lõi: {{ word.quality }}</span>
                    <span v-if="word.quality_limit" class="bg-indigo-900/60 border border-indigo-500/50 px-2 py-1 rounded text-indigo-100">Giới hạn tiếp nhận dưới: {{ word.quality_limit }}</span>
                    <span v-if="word.extra_cost?.mp" class="bg-blue-900/60 border border-blue-500/50 px-2 py-1 rounded text-blue-100">Tiêu hao MP: {{ word.extra_cost?.mp }}</span>
                    <span v-if="word.tags && word.tags.length" class="bg-[#1e293b] border border-gray-600/50 px-2 py-1 rounded text-gray-300">{{ word.tags.join(', ') }}</span>
                </div>

                <div class="space-y-4">
                    <template v-if="word.uid.startsWith('effect')">
                        <div class="grid grid-cols-2 gap-3 bg-[#111827]/80 p-4 rounded-lg border border-blue-900/50">
                            <div class="text-blue-100"><strong class="text-blue-400">Tiêu hao hành động:</strong> {{ word.action_cost.raw }}</div>
                            <div class="text-blue-100"><strong class="text-blue-400">Tiêu hao MP:</strong> {{ word.extra_cost.mp }} MP <span v-if="word.extra_cost.hp" class="text-red-400">/ {{ word.extra_cost.hp }} HP</span></div>
                            <div v-if="word.damage" class="text-blue-100"><strong class="text-pink-400">Uy lực:</strong> {{ word.damage }}</div>
                            <div v-if="word.save_type" class="text-blue-100"><strong class="text-orange-400">Miễn nhiễm:</strong> {{ word.save_type.type }} ({{ word.save_type.on_save }})</div>
                            <div v-if="word.duration?.raw" class="text-blue-100"><strong class="text-orange-400">Thời gian duy trì:</strong> {{ word.duration?.raw }}</div>
                        </div>
                    </template>

                    <template v-if="word.uid.startsWith('target')">
                        <div class="bg-[#111827]/80 p-4 rounded-lg border border-blue-900/50 space-y-2">
                            <div class="text-blue-100"><strong class="text-blue-400">Phạm vi thi triển:</strong> {{ word.range_desc }}</div>
                            <div class="text-blue-100"><strong class="text-blue-400">Lựa chọn mục tiêu:</strong> {{ word.target_desc }}</div>
                        </div>
                    </template>

                    <div v-if="word.overall_desc" class="bg-[#111827]/80 p-4 rounded-lg border border-blue-900/50">
                        <h3 class="text-base font-bold text-blue-500 mb-2 border-b border-blue-800/50 pb-1">Mô tả</h3>
                            <div class="text-m whitespace-pre-wrap inline-block align-top mt-1 tracking-wide">{{ word.overall_desc }}</div>
                    </div>

                    <div v-if="word.effect_desc" class="bg-[#111827]/80 p-4 rounded-lg border border-blue-900/50">
                        <h3 class="text-base font-bold text-blue-500 mb-2 border-b border-blue-800/50 pb-1">Hiệu quả thực tế</h3>
                        <div v-for="(v, k) in word.effect_desc" :key="k" class="mb-2 text-blue-100/90 leading-relaxed">
                            <div class="text-blue-300 mr-1"><strong>{{ k }}:</strong></div> 
                            <div class="text-m whitespace-pre-wrap inline-block align-top mt-1 tracking-wide">{{ v }}</div>
                        </div>
                    </div>

                    <div v-if="word.boost && word.boost.total_level > 0" class="bg-[#1e1b4b]/40 p-4 rounded-lg border border-indigo-700/50">
                        <h3 class="font-bold text-indigo-300 mb-3 flex items-center"><span class="mr-2">⚡</span> Cấp bậc siêu ma tăng cường</h3>
                        <div v-for="(lvl, key) in word.boost" :key="key" v-show="key !== 'total_level'" class="mb-3 border-l-2 border-indigo-500 pl-3">
                            <div class="text-indigo-200 font-bold mb-1">
                                {{ key === 'limit' ? 'Đột phá ngưỡng cực hạn' : "Tăng cường cấp bậc " + key }}
                                <span class="text-xs font-normal text-indigo-400/60 font-mono ml-2" v-if="lvl.extra_cost && lvl.extra_cost.mp">(Cần rút ra: {{lvl.extra_cost.mp}} MP)</span>
                            </div>
                            <div class="text-indigo-100/80 text-sm leading-relaxed">{{ lvl.rep_target_desc || lvl.rep_range_desc || lvl.add_desc }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: { word: Object },
    emits: ['close'],
    mixins: [GlobalUtils],
    setup(props, { emit }) {
        const maskEvents = useMaskClose(() => emit('close'));
        return { maskEvents };
    }
};

// ================== 管理器 ==================
function usePresetManager(Vue, composingSpell, toastUI) {
    const { ref, onMounted } = Vue;
    const spell_preset_path = "words_of_power_dlc.additional_char_data.Protagonist.spell_preset";
    const presets = ref({});
    const isPresetModalOpen = ref(false);

    const loadPresetsFromDB = () => {
        if (typeof getVariables !== 'undefined' && typeof _ !== 'undefined') {
            const vars = getVariables({ type: 'chat' });
            presets.value = _.get(vars, spell_preset_path) || {};
        } else {
            const local = localStorage.getItem('mock_spell_presets_starry');
            presets.value = local ? JSON.parse(local) : {};
        }
    };

    const saveCurrentAsPreset = () => {
        const name = composingSpell.customName || `Khắc ấn chưa biết ${Date.now()}`;
        const save = () => {
            const spellData = JSON.parse(JSON.stringify(composingSpell));
            presets.value[name] = spellData;

            if (typeof updateVariablesWith !== 'undefined' && typeof _ !== 'undefined') {
                updateVariablesWith(vars => {
                    _.set(vars, `${spell_preset_path}.${name}`, spellData);
                    return vars;
                }, { type: 'chat' });
            } else {
                localStorage.setItem('mock_spell_presets_starry', JSON.stringify(presets.value));
            }
            toastUI.showToast(`🌌 Đã lưu!`, "success");
        }
        const presetsHasName = presets.value[name] != undefined;
        if (presetsHasName) {
            toastUI.confirm(
                `Đã tồn tại preset cùng tên ${name}, có muốn ghi đè không?`,
                save
            );
            return;
        }
        save();
    };

    const loadPreset = (name) => {
        const data = presets.value[name];
        if (!data) return;
        const spellData = JSON.parse(JSON.stringify(data));
        composingSpell.customName = spellData.customName || name;
        composingSpell.target_words = spellData.target_words || [];
        composingSpell.effect_words = spellData.effect_words || [];
        composingSpell.unique_effect_words = spellData.unique_effect_words || [];
        composingSpell.spell_meta_words = spellData.spell_meta_words || [];
        composingSpell.selected_save_id = spellData.selected_save_id || null;
        isPresetModalOpen.value = false;
    };

    const deletePreset = (name) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa bỏ hoàn toàn minh văn 【${name}】 khỏi Tinh Giới không?`)) return;
        delete presets.value[name];
        if (typeof updateVariablesWith !== 'undefined' && typeof _ !== 'undefined') {
            updateVariablesWith(vars => {
                _.unset(vars, `${spell_preset_path}.${name}`);
                return vars;
            }, { type: 'chat' });
        } else {
            localStorage.setItem('mock_spell_presets_starry', JSON.stringify(presets.value));
        }
    };

    onMounted(() => { loadPresetsFromDB(); });
    const presetMaskEvents = useMaskClose(() => { isPresetModalOpen.value = false; });

    return { presets, isPresetModalOpen, saveCurrentAsPreset, loadPreset, deletePreset, loadPresetsFromDB, presetMaskEvents };
}

function useSpellBuilder(Vue, characterData, dbVersion, closeMainModal, isEasterEggUnlocked, toastUI) {
    const { reactive, computed, watch } = Vue;

    const composingSpell = reactive({
        customName: '',
        target_words: [], effect_words: [], unique_effect_words: [], spell_meta_words: [],
        selected_save_id: null
    });

    const builderUI = reactive({
        selectorOpen: false, detailOpen: false, detailWord: null,
        selectorContext: { type: null, holderType: null, holderRef: null },
        mainAttribute: 'Intelligence' // 新增：默认检定主属性
    });
    // 1. 为每个大类槽位独立保存筛选状态
    const filterStates = reactive({
        target: { targetType: 'Tất cả', subTargetType: 'Tất cả' },
        effect: { targetType: 'Tất cả', subTargetType: 'Tất cả' },
        unique: { targetType: 'Tất cả', subTargetType: 'Tất cả' },
        meta: { targetType: 'Tất cả', subTargetType: 'Tất cả' }
    });

    // 暴露给模板的动态计算属性，根据当前打开的面板返回对应的筛选状态引用
    const wordSelectStats = computed(() =>
        filterStates[builderUI.selectorContext.type]
        || filterStates.effect
    );

    // 2. 缓存结构升级：拆分 base(基础排序列表) 和 filtered(各种筛选组合后的字典)
    const resetCache = () => ({ base: null, filtered: {} });

    const listCache = {
        target: resetCache(),
        effect: resetCache(),
        unique: resetCache(),
        meta: {} // 按具体槽位名缓存，如: { "Mục tiêu": { base: null, filtered: {} } }
    };
    // 监听数据库版本号，一旦底层数据重建，立刻清空缓存
    watch([dbVersion, isEasterEggUnlocked], () => {
        listCache.target = resetCache();
        listCache.effect = resetCache();
        listCache.unique = resetCache();
        listCache.meta = {};
    });

    // 定义品质权重映射
    const qualityRank = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5, 'Mythic': 6, 'Unique': 7 };
    const getRank = (q) => qualityRank[q] || 0;
    const isHidden = (w) => w.uid && w.uid.includes('hidden');
    // 核心多级排序算法
    const sortWords = (list, type) => {
        return list.sort((a, b) => {
            // 1. 第一优先级：隐藏技能置顶
            const aHidden = isHidden(a);
            const bHidden = isHidden(b);
            if (aHidden !== bHidden) return aHidden ? -1 : 1;

            // 2. 第二优先级：按品质排序
            const rankA = getRank(a.quality || a.quality_limit);
            const rankB = getRank(b.quality || b.quality_limit);

            if (type === 'effect' || type === 'unique') {
                // 效果咒字：品质由高到低降序
                return rankB - rankA;
            } else {
                // 目标和超魔：品质由低到高升序
                return rankA - rankB;
            }
        });
    };

    const currentSelectorList = computed(() => {

        dbVersion.value;
        const unlocked = isEasterEggUnlocked.value; // 2. 声明对彩蛋状态的依赖
        const type = builderUI.selectorContext.type;
        const slot = builderUI.selectorContext.holderType;
        const slotMap = { spell: "Phép thuật", effect: "Hiệu ứng", target: "Mục tiêu" };
        if (!type) return [];

        // 3. 定义一个通用的可见性检查函数
        // 逻辑：如果已经解锁，全可见；如果未解锁，过滤掉 uid 中包含 'hidden' 的咒字
        const isVisible = (word) => {
            if (unlocked) return true;
            // 假设你的隐藏技能 ID 包含 'hidden'，请根据你的实际设定修改这里的判定
            return !(word.uid && word.uid.includes('hidden'));
        };

        // 1. 获取当前槽位的缓存桶
        let cacheBucket;
        if (type === 'meta') {
            const mappedSlot = slotMap[slot];
            if (!mappedSlot) return [];
            if (!listCache.meta[mappedSlot]) listCache.meta[mappedSlot] = resetCache();
            cacheBucket = listCache.meta[mappedSlot];
        } else {
            cacheBucket = listCache[type];
        }

        // 2. 获取当前的筛选条件并生成唯一缓存 Key
        const currentFilters = filterStates[type];
        const filterKey = `${currentFilters.targetType}_${currentFilters.subTargetType}`;

        // 【核心优化】：命中特定筛选条件的缓存，直接无脑返回！
        if (cacheBucket.filtered[filterKey]) {
            return cacheBucket.filtered[filterKey];
        }

        // 3. 如果连基础列表(base)都没有，先生成并排序基础列表
        if (!cacheBucket.base) {
            let rawList = [];
            if (type === 'target') {
                rawList = Object.values(MOCK_DB.target_words).filter(isVisible);
            } else if (type === 'effect') {
                rawList = Object.values(MOCK_DB.effect_words).filter(e => e.quality !== "Unique" && isVisible(e));
            } else if (type === 'unique') {
                rawList = Object.values(MOCK_DB.effect_words).filter(e => e.quality === "Unique" && isVisible(e));
            } else if (type === 'meta') {
                const mappedSlot = slotMap[slot];
                rawList = Object.values(MOCK_DB.meta_words).filter(e => e.mod_target.includes(mappedSlot) && isVisible(e));
            }
            cacheBucket.base = sortWords(rawList, type);
        }



        // 4. 基于基础列表进行二次筛选
        const result = cacheBucket.base.filter(w => {
            if (currentFilters.targetType !== 'Tất cả') {
                let storeType = 'effect_words';
                if (w.uid.startsWith('meta')) storeType = 'meta_words';
                else if (w.uid.startsWith('target')) storeType = 'target_words';

                const isCustom = WordDataMan.isCustomData(storeType, w.uid);
                if (currentFilters.targetType === 'Tùy chỉnh' && !isCustom) return false;
                if (currentFilters.targetType === 'Tích hợp' && isCustom) return false;
            }

            if (currentFilters.subTargetType !== 'Tất cả') {
                const wQuality = w.quality || w.quality_limit;
                if (wQuality !== currentFilters.subTargetType) return false;
            }
            return true;
        });

        // 5. 将筛选结果写入字典缓存并返回
        cacheBucket.filtered[filterKey] = result;
        return result;
    });

    const spellStats = computed(() => {
        let statMod = 0;
        const casterStats = { statModifier: 0, dcBonus: 0, maxMp: 0, casterMainAttribute: builderUI.mainAttribute };
        const runtime = characterData.protagonist.runtime || {};

        if (characterData.protagonist) {
            casterStats.dcBonus = characterData.protagonist.stats?.dcBonus || 0;
            casterStats.maxMp = characterData.protagonist.stats?.maxMp || 50000;

            // 动态读取选中的主属性值
            if (characterData.protagonist.data && characterData.protagonist.data[K.PLAYER_ATTRIBUTES]) {
                statMod = characterData.protagonist.data[K.PLAYER_ATTRIBUTES][builderUI.mainAttribute] || 0;
            } else {
                statMod = characterData.protagonist.stats?.statModifier || 0;
            }
            casterStats.statModifier = statMod;
        }

        const dc_bonus = runtime.stats?.spell_dc_all;
        let detailed_dc = [];
        if (dc_bonus) detailed_dc = BonusPromptGenerator.statsPromptGenerator("spell_dc_all", runtime);
        let atk_ints = ["onSpellCast", "onAttackRoll", 'onBeforeAttackRoll', "onDamageRoll", "onAllRolls"];
        let detail_int = BonusPromptGenerator.interceptorsPromptGenerator(atk_ints, runtime);


        return {
            quality: SpellCalculator.calcQuality(composingSpell),
            dc: SpellCalculator.calcDC(composingSpell, casterStats),
            detailed_dc: detailed_dc, //array string
            cast_interceptors: detail_int, // object, string: array
            save: SpellCalculator.calcSaveType(composingSpell),
            cost: SpellCalculator.calcCost(composingSpell, casterStats.maxMp),
            action: SpellCalculator.calcActionCost(composingSpell),
            validation: SpellCalculator.validateSpell(composingSpell),
            casterMainAttribute: builderUI.mainAttribute
        };
    });

    // 暴露给模板的实时预览文本属性
    // 新增：结构化链式推演数据生成
    // 结构化链式推演数据生成 (完整描述 + 超魔层级)
    const realtimeSteps = computed(() => {
        const steps = [];

        const getDescList = (word) => {
            const lines = [];
            if (word.effect_desc) {
                for (const [k, v] of Object.entries(word.effect_desc)) {
                    lines.push(`${k}: ${v}`);
                }
            } else if (word.target_desc) {
                lines.push(`Phạm vi: ${word.range_desc}`);
                lines.push(`Mục tiêu: ${word.target_desc}`);
            } else {
                lines.push("Dao động linh năng bí ẩn...");
            }
            return lines;
        };

        const extractMetas = (holder) => {
            if (!holder.meta || holder.meta.length === 0) return [];
            return holder.meta.map(m => {
                let metaDesc = "";
                if (m.word.name.includes('Tăng cường')) {
                    const lvl = m.input_args?.boost_level || 1;
                    const boostData = holder.word.boost?.[lvl];
                    if (boostData) {
                        metaDesc = boostData.rep_target_desc || boostData.rep_range_desc || boostData.add_desc || "Tăng cường ma lực tuôn trào...";
                    }
                } else {
                    metaDesc = m.word.effect_desc?.[m.word.name] || Object.values(m.word.effect_desc || {})[0] || "Siêu ma can thiệp...";
                }
                const lvlText = (m.word.name.includes('Tăng cường') && m.input_args?.boost_level) ?
                    (m.input_args.boost_level === 'limit' ? 'Cực hạn' : `L${m.input_args.boost_level}`) : '';

                return {
                    name: m.word.name + (lvlText ? `[${lvlText}]` : ''),
                    desc: metaDesc,
                    quality: m.word.quality
                };
            });
        };

        // 1. Mục tiêu
        if (composingSpell.target_words.length > 0) {
            const h = composingSpell.target_words[0];
            steps.push({
                type: 'target', icon: '🎯',
                name: h.word.name,
                descs: getDescList(h.word),
                quality: h.word.quality,
                metas: extractMetas(h)
            });
        }

        // 2. Hiệu ứng và duy nhất
        const allEffects = [...composingSpell.effect_words, ...composingSpell.unique_effect_words];
        allEffects.forEach(h => {
            steps.push({
                type: 'effect', icon: h.word.quality === 'Unique' ? '👑' : '🌀',
                name: h.word.name,
                descs: getDescList(h.word),
                quality: h.word.quality,
                metas: extractMetas(h)
            });
        });

        // 3. Siêu ma toàn cục
        composingSpell.spell_meta_words.forEach(h => {
            const desc = h.word.effect_desc?.[h.word.name] || Object.values(h.word.effect_desc || {})[0] || "Pháp tắc cộng hưởng...";
            steps.push({
                type: 'spell_meta', icon: '✨',
                name: `[Siêu ma toàn cục] ${h.word.name}`,
                descs: [desc],
                quality: h.word.quality,
                metas: []
            });
        });

        return steps;
    });

    const openSelector = (type, holderType = null, holderRef = null) => {
        builderUI.selectorContext.type = type;
        builderUI.selectorContext.holderType = holderType;
        builderUI.selectorContext.holderRef = holderRef;

        builderUI.selectorOpen = true;
    };

    const showDetails = (word) => { builderUI.detailWord = word; builderUI.detailOpen = true; };
    const removeWord = (listName, index) => composingSpell[listName].splice(index, 1);
    const removeMeta = (holder, mIndex) => holder.meta.splice(mIndex, 1);

    const selectWord = (word) => {
        const ctx = builderUI.selectorContext;
        if (ctx.type === 'target') {
            const check = SpellCalculator.canSetTargetWord(composingSpell, word);
            if (!check.valid) return toastUI.showToast(check.reason, 'warning');
            composingSpell.target_words = [{ uid: word.uid, word, meta: [], input_args: { custom_desc: "" } }];
        } else if (ctx.type === 'effect' || ctx.type === 'unique') {
            const check = SpellCalculator.canAddEffect(composingSpell, word);
            if (!check.valid) return toastUI.showToast(check.reason, 'warning');
            const payload = { uid: word.uid, word, meta: [], input_args: { custom_desc: "" } };
            word.quality === 'Unique' ? composingSpell.unique_effect_words.push(payload) : composingSpell.effect_words.push(payload);
        } else if (ctx.type === 'meta') {
            const inputArgs = { custom_desc: "" };
            if (word.name.includes('增强')) inputArgs.boost_level = 1;
            const check = SpellCalculator.canAddMeta(composingSpell, ctx.holderType, ctx.holderRef, word, inputArgs, 100000);
            if (!check.valid) return toastUI.showToast(check.reason, 'warning');
            const payload = { uid: word.uid, word, input_args: inputArgs };
            ctx.holderType === 'spell' ? composingSpell.spell_meta_words.push(payload) : ctx.holderRef.meta.push(payload);
        }
        builderUI.selectorOpen = false;
    };

    const generatePayload = () => {
        // 1. Đóng gói logic xuất dữ liệu thực tế thành một hàm độc lập
        const executeExport = () => {
            const finalPromptText = PromptGenerator.generateFullPrompt(composingSpell, spellStats.value);
            console.log("Văn bản prompt LLM:\n", finalPromptText);
            messageInputer.sendMessage(finalPromptText);
            toastUI.showToast("Đã gửi đến khung nhập liệu!", 'success');
            //closeMainModal();
        };

        if (!spellStats.value.validation.isValid) {
            toastUI.confirm(
                "Tồn tại cấu hình không hợp lệ:\n" + spellStats.value.validation.errors.join("\n") + "\n\nÉp buộc xuất có thể gây ra lỗi không xác định, có muốn tiếp tục không?",
                executeExport // Kích hoạt sau khi nhấp vào 【Bắt buộc thực thi】
            );
            return;
        }
        executeExport();
    };

    return {
        composingSpell, spellStats, builderUI, wordSelectStats,
        currentSelectorList, realtimeSteps,
        openSelector, selectWord, showDetails,
        removeWord, removeMeta, generatePayload,
    };
}

// ==========================================
// 星界熔炉 (Word Forge) 模块逻辑
// ==========================================
function useWordForge(Vue, characterData, uiState, dbVersion, toastUI) {
    const { reactive, computed, watch } = Vue;
    const forgeState = reactive({
        mode: 'register', // 'register' | 'manage'
        editingData: null,
        editingType: 'effect', // 'effect' | 'meta'
    });

    const forgeUI = reactive({
        skillSelectorOpen: false,
        showAllSkills: false,
        kvRows: [], // 效果字典映射
        boostRows: [] // 【新增】增强超魔层级映射
    });

    // 【新增】虚空提取检定状态
    const extractState = reactive({
        targetType: 'skill', // 'skill' | 'item'
        attribute: 'Intelligence',   // 检定主属性
        selectedName: '',
        selectedData: null,
        direction: ''        // 提取意图描述
    });
    const extractUI = reactive({
        selectorOpen: false
    });

    //提取
    // 【新增】提取目标候选列表
    const qualityRank = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5, 'Mythic': 6, 'Unique': 7 };
    const getRank = (q) => qualityRank[q] || 0;

    const extractionList = computed(() => {
        if (!characterData.protagonist || !characterData.protagonist.data) return [];
        // 获取数据源：技能或背包 (兼容键名为 'backpack' 或对应的常量)
        const dataSource = extractState.targetType === 'skill'
            ? (characterData.protagonist.data[K.SKILLS] || {})
            : (characterData.protagonist.data[K.BACKPACK] || characterData.protagonist.data['背包'] || {});

        const rawList = Object.keys(dataSource).map(key => ({ name: key, data: dataSource[key] }));

        // 执行排序逻辑 (由高到低降序)
        return rawList.sort((a, b) => {
            const rankA = qualityRank[a.data[K.QUALITY]] || 0;
            const rankB = qualityRank[b.data[K.QUALITY]] || 0;
            return rankB - rankA;
        });
    });

    const selectExtractionTarget = (name, data) => {
        extractState.selectedName = name;
        extractState.selectedData = data;
        extractUI.selectorOpen = false;
    };

    // 【新增】生成并复制提取提示词
    const generateExtractionPrompt = () => {
        if (!extractState.selectedName) return toastUI.showToast("Vui lòng chọn mục tiêu để trích xuất trước!", 'warning');
        // Trích xuất văn bản thuộc tính của vật phẩm/kỹ năng, loại bỏ các phần lồng nhau không quan trọng, đơn giản hóa để LLM xem
        //const targetStr = JSON.stringify(extractState.selectedData, null, 2);
        const quality = extractState.selectedData[K.QUALITY] || "Ngẫu nhiên";

        const statsMap = { "Intelligence": "int", "Tinh thần": "wis" };
        const cur_key = `${statsMap[extractState.attribute]}_rolls`;
        const charData = characterData.protagonist?.data || {};
        const runtime = characterData.protagonist?.runtime || {};

        const attr_rolls = runtime?.stats?.cur_key; //cur_key
        let details_bonus = [];
        if (attr_rolls) details_bonus = BonusPromptGenerator.statsPromptGenerator(cur_key, runtime);

        const target_ints = ["onAllRolls"];
        let detail_int = BonusPromptGenerator.interceptorsPromptGenerator(target_ints, runtime);

        let prompt = `【Trích xuất chú tự - Yêu cầu kiểm định】\n`;
        prompt += `> Mục tiêu trích xuất: ${extractState.selectedName} (${extractState.targetType === 'skill' ? 'Kỹ năng hiện có' : 'Vật mang'})`;
        prompt += extractState.targetType === 'skill' ? ", thất bại không tiêu hao kỹ năng\n" : ", thất bại tiêu hao vật phẩm\n"
        //prompt += `> Đặc tính mục tiêu: \n${targetStr}\n\n`;
        prompt += `> Thuộc tính kiểm định: Sử dụng [${extractState.attribute}] để phân tích. Giá trị hiện tại: ${charData[K.PLAYER_ATTRIBUTES][extractState.attribute]}. Dựa vào ${extractState.attribute === "Intelligence" ? "tư duy" : "cảm ngộ"} để trích xuất chú tự\n`;

        if (attr_rolls && attr_rolls != 0) {
            prompt += `> Giá trị cộng thêm kiểm định: ${attr_rolls}. Chi tiết: \n`;
            details_bonus.forEach(e => {
                prompt += `  * ${e}\n`;
            });
        }

        const kv_array = Object.entries(detail_int);
        if (kv_array.length != 0) {
            prompt += "Hiệu ứng kích hoạt khi kiểm định: \n";
            kv_array.forEach(([hook, valarray]) => {
                prompt += `*${hook}: \n`;
                valarray.forEach(e => {
                    prompt += (`  -${e}\n`);
                });
            });
        }


        if (extractState.direction.trim()) {
            prompt += `> Ý đồ/Hướng trích xuất chú tự: ${extractState.direction}\n`;
        }

        prompt += `> Phẩm chất chú tự mục tiêu: ${quality}\n`;

        prompt += `\nChỉ lệnh: Tiến hành kiểm định trích xuất chú tự. Dựa trên kết quả kiểm định, tạo phản hồi các chú tự tiêu chuẩn được trích xuất và tách ra từ đó (nếu thành công). Hiệu ứng của chú tự được trích xuất nên tham khảo ý đồ chủ quan, và bị giới hạn bởi phẩm chất cùng đặc tính của vật phẩm/kỹ năng gốc.`;

        console.log("Prompt trích xuất:\n", prompt);
        messageInputer.sendMessage(prompt);

        toastUI.showToast("📜 Prompt đã được tạo trong console và được gửi đến khung nhập liệu.", 'info');

    };



    // ================= 新增：延迟与强制固化逻辑 =================
    let autoSaveTimer = null;

    // 强制立即提交到底层
    const forceCommit = () => {
        console.log("Bắt buộc commit");
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = null;
        }
        // Bên trong WordDataMan có kiểm tra cờ bẩn isDirty, gọi nhiều lần vẫn an toàn
        if (WordDataMan.isDirty) {
            WordDataMan.commit();
            console.log("🌌 [Tinh Giới Dung Lô] Biến động pháp tắc đã lắng xuống, dữ liệu ấn ký đã được bắt buộc cố định nhập kho.");
        }
    };

    // 调度延迟提交 (例如 5 秒后自动保存)
    const scheduleCommit = () => {
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            forceCommit();
        }, 5000);
    };

    // 监听切页：当离开“星界熔炉”模块时，立即强制保存
    watch(() => uiState.activeTab, (newTab, oldTab) => {
        if (oldTab === 'word_forge' && WordDataMan.isDirty) {
            forceCommit();
        }
    });
    watch(() => uiState.mainModalOpen, (newVal, oldVal) => {
        if (oldVal === true && newVal === false && WordDataMan.isDirty) {
            forceCommit();
        }
    });

    // 当切换编辑对象时，同步 Key-Value 字典以便 UI 编辑
    watch(() => forgeState.editingData, (newVal) => {
        if (newVal) {
            // 同步常规效果
            if (newVal.effect_desc) {
                forgeUI.kvRows = Object.entries(newVal.effect_desc).map(([k, v]) => ({ k, v }));
            } else {
                forgeUI.kvRows = [];
            }

            // 【新增】同步增强超魔层级数据
            if (newVal.boost) {
                forgeUI.boostRows = Object.entries(newVal.boost)
                    .filter(([k, v]) => k !== 'total_level')
                    .map(([k, v]) => ({
                        // 如果底层存储的是 'limit'，在输入框里向用户展示为 'Cực Hạn'
                        level: k === 'limit' ? 'Cực Hạn' : k,
                        desc: v.add_desc || '',
                        costMp: v.extra_cost?.mp || null
                    }));
            } else {
                forgeUI.boostRows = [];
            }
        } else {
            forgeUI.kvRows = [];
            forgeUI.boostRows = [];
        }

    }, { deep: true, immediate: true });

    // 将 KV 数组同步回主数据对象
    const syncKVToData = () => {
        if (!forgeState.editingData) return;
        const obj = {};
        forgeUI.kvRows.forEach(item => { if (item.k.trim()) obj[item.k.trim()] = item.v; });
        forgeState.editingData.effect_desc = obj;
        // 【新增】同步增强超魔回主数据
        if (forgeState.editingType === 'effect') {
            const boostObj = { total_level: 0 };
            forgeUI.boostRows.forEach(item => {
                let lvl = String(item.level).trim();

                // 存入底层时，将用户的中文 'Cực Hạn' 转换回系统识别的 'limit'
                if (lvl === 'Cực Hạn') lvl = 'limit';

                if (lvl) {
                    boostObj[lvl] = { add_desc: item.desc };
                    // 仅在明确填写了固定消耗时记录
                    if (item.costMp) boostObj[lvl].extra_cost = { mp: item.costMp };

                    if (lvl !== 'limit') {
                        boostObj.total_level = Math.max(boostObj.total_level, parseInt(lvl, 10) || 1);
                    } else if (boostObj.total_level === 0) {
                        boostObj.total_level = 1;
                    }
                }
            });
            forgeState.editingData.boost = boostObj;
        }
    };


    const addEffectDescRow = () => forgeUI.kvRows.push({ k: 'Điểm mô tả mới', v: 'Giải thích hiệu ứng' });
    const removeEffectDescRow = (idx) => forgeUI.kvRows.splice(idx, 1);
    const addBoostRow = () => forgeUI.boostRows.push({ level: '', desc: '', costMp: null });
    const removeBoostRow = (idx) => forgeUI.boostRows.splice(idx, 1);

    const rawSkillsList = computed(() => {
        if (!characterData.protagonist || !characterData.protagonist.data) return [];
        const skillsObj = characterData.protagonist.data[K.SKILLS] || {};

        const rawList = Object.keys(skillsObj).map(key => ({ name: key, data: skillsObj[key] }));
        return rawList.sort((a, b) => {
            const rankA = qualityRank[a.data[K.QUALITY]] || 0;
            const rankB = qualityRank[b.data[K.QUALITY]] || 0;
            return rankB - rankA;
        });
    });
    const filteredRawSkills = computed(() => {
        if (forgeUI.showAllSkills) return rawSkillsList.value;
        return rawSkillsList.value.filter(s => {
            const type = s.data[K.SKILL_TYPE] || '';
            return type.includes('Chú tự') || type.includes('Siêu ma') || type.includes('Hiệu ứng');
        });
    });

    // Liên quan đến đăng ký
    const selectRawSkillForForge = (name, rawData) => {
        const isMeta = (rawData[K.SKILL_TYPE] && rawData[K.SKILL_TYPE].includes('Siêu ma'));
        forgeState.editingType = isMeta ? 'meta' : 'effect';
        forgeState.editingData = isMeta ? WordParser.parseMetaWord(name, rawData) : WordParser.parseEffectWord(name, rawData);
        forgeUI.skillSelectorOpen = false;
    };

    const createBlankWord = (type) => {
        forgeState.editingType = type;
        forgeState.editingData = type === 'meta' ? WordParser.parseMetaWord("Siêu ma hư không mới", {}) : WordParser.parseEffectWord("Hiệu ứng hư không mới", {});
    };

    const saveForgedWord = () => {
        if (!forgeState.editingData.name.trim()) return toastUI.showToast("Chú tự bắt buộc phải có chân danh!", 'warning');
        syncKVToData(); // Đồng bộ dữ liệu từ điển trước khi lưu

        const storeType = forgeState.editingType === 'meta' ? 'meta_words' : 'effect_words';
        WordDataMan.addStandardCustomWord(storeType, forgeState.editingData);
        scheduleCommit();

        dbVersion.value++;

        toastUI.showToast(`🌌 Ấn ký chú tự【${forgeState.editingData.name}】đã được lưu tạm!`, "success");
        forgeState.editingData = null;
        forgeState.mode = 'manage'; // Tự động chuyển về giao diện quản lý
    };

    // Liên quan đến quản lý
    const customWordsList = computed(() => {
        // Gộp hiển thị của hai loại từ điển tùy chỉnh
        dbVersion.value;
        const effects = WordDataMan.cache.custom.effect_words || {};
        const metas = WordDataMan.cache.custom.meta_words || {};
        //console.log("debug", effects, metas);
        return { ...effects, ...metas };
    });

    const loadCustomWord = (wordData) => {
        forgeState.editingType = wordData.uid.startsWith('meta') ? 'meta' : 'effect';
        forgeState.editingData = JSON.parse(JSON.stringify(wordData)); // Sao chép sâu để chỉnh sửa
        forgeState.mode = 'register'; // Chuyển sang giao diện chỉnh sửa bên phải
    };

    const deleteCustomWord = (wordData) => {
        if (!confirm(`Cảnh báo: Xác nhận xóa bỏ hoàn toàn 【${wordData.name}】 chứ?`)) return;
        const storeType = wordData.uid.startsWith('meta') ? 'meta_words' : 'effect_words';
        WordDataMan.deleteCustomWord(storeType, wordData.uid);
        scheduleCommit();
        dbVersion.value++;
    };

    const getBriefDesc = (w) => {
        if (w.effect_desc) return Object.values(w.effect_desc).join(' | ');
        return 'Dao động linh năng bí ẩn...';
    };

    // --- 动态计算属性，用于将数组优雅地绑定到文本框 (逗号分隔) ---
    const createStringArrayComputed = (dataKey, subKey) => computed({
        get: () => {
            if (!forgeState.editingData || !forgeState.editingData[dataKey]) return '';
            return subKey ? (forgeState.editingData[dataKey][subKey] || []).join(', ') : (forgeState.editingData[dataKey] || []).join(', ');
        },
        set: (val) => {
            if (!forgeState.editingData || !forgeState.editingData[dataKey]) return;
            const arr = val.split(',').map(s => s.trim()).filter(Boolean);
            if (subKey) forgeState.editingData[dataKey][subKey] = arr;
            else forgeState.editingData[dataKey] = arr;
        }
    });

    const tagsStringGeneral = createStringArrayComputed('tags');
    const tagsStringTarget = createStringArrayComputed('target_limit');
    const tagsStringModTarget = createStringArrayComputed('mod_target');

    const currentQualityField = computed({
        get: () => forgeState.editingType === 'meta' ? forgeState.editingData.quality_limit : forgeState.editingData.quality,
        set: (val) => {
            if (forgeState.editingType === 'meta') forgeState.editingData.quality_limit = val;
            else forgeState.editingData.quality = val;
        }
    });

    return {
        forgeState, forgeUI,
        filteredRawSkills, customWordsList,
        selectRawSkillForForge, createBlankWord, saveForgedWord,
        loadCustomWord, deleteCustomWord, getBriefDesc,
        addEffectDescRow, removeEffectDescRow, addBoostRow, removeBoostRow,
        tagsStringGeneral, tagsStringTarget, tagsStringModTarget, currentQualityField,
        forceCommit,
        extractState, extractUI, extractionList, selectExtractionTarget, generateExtractionPrompt
    };
}

// ==========================================
// 动态星轨背景：静谧拓扑与十字星芒
// ==========================================
function useConstellationBackground(Vue, uiState, isEasterEggUnlocked, win, doc) {
    const { ref, onMounted, onUnmounted, watch } = Vue;

    // ==========================================
    // 🌌 星座引擎全局控制面板 (随时修改测试)
    // ==========================================
    const CONFIG = {
        // 基础设置
        fps: 50,                    // 目标帧率
        globalScale: 2,           // 星座整体放大倍数
        maxConstellations: 13,      // 屏幕上同时存在的星座数量

        // 💡 视觉与亮度控制 (解决太暗的问题)
        brightnessMultiplier: 1.3,  // 全局亮度放大器 (调高它即可突破亮度衰减)
        maxGlowAlpha: 0.9,          // 发光核心的最高不透明度
        flareOpacity: 0.85,         // 十字星芒的基础亮度

        // 🚀 运动与形变控制
        maxInitSpeed: 0.7,          // 出生时的最大巡航速度
        breathSpeedMin: 0.002,      // 呼吸扩散最小频率 (越小越慢)
        breathSpeedMax: 0.007,      // 呼吸扩散最大频率
        breathAmpMin: 0.05,         // 呼吸扩散最小幅度
        breathAmpMax: 0.13,         // 呼吸扩散最大幅度

        minLifetime: 400,
        maxlifeTime: 600,

        // 🧲 鼠标交互控制 (吸引力)
        attractRadius: 250,         // 鼠标吸引半径
        attractForceStar: 0.05,    // 引力对[单颗星点]的拉扯系数 (过大会变形)
        attractForceGroup: 0.1,    // 引力对[星座整体]的拖拽系数

        // 💥 鼠标交互控制 (点击爆炸)
        explodeRadius: 300,         // 爆发冲击波半径
        explodeForce: 9,            // 爆炸击飞力度

        // ⚙️ 物理引擎底层约束
        springForce: 0.015,         // 维持形状的弹簧向心力
        damping: 0.85               // 摩擦力阻尼 (0-1，越接近1越滑行，越小越迟钝)
    };

    const attractRadiusSq = CONFIG.attractRadius * CONFIG.attractRadius;

    const bgCanvas = ref(null);
    let animationFrameId;
    let resizeObserver;
    let constellations = [];
    let explosions = []; // 【新增】存储超新星爆发的数据
    let mouse = { x: -1000, y: -1000 };
    let globalScale = 2.0; // 等比放大倍数，自行调整
    // 【新增】用于保存和清理 watch 监听器
    let unwatchState;
    //let hasTriggeredEasterEgg = localStorage.getItem('magic_book_easter_egg') === 'true';
    let hasTriggeredEasterEgg = ConfigManager.getConfig("Protagonist", true).magic_book_easter_egg;
    // 【性能优化1】预渲染生成静态贴图，彻底干掉每帧的渐变计算
    const createCachedSprite = (type) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (type === 'star') {
            canvas.width = 32; canvas.height = 32;
            const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            grad.addColorStop(0, `rgba(255, 255, 255, ${CONFIG.maxGlowAlpha})`);
            grad.addColorStop(0.2, `rgba(191, 219, 254, 0.7)`);
            grad.addColorStop(1, `rgba(147, 197, 253, 0)`);
            ctx.fillStyle = grad;
            ctx.arc(16, 16, 16, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'explosion') {
            canvas.width = 256; canvas.height = 256;
            const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
            grad.addColorStop(0, `rgba(255, 255, 255, 0.2)`);
            grad.addColorStop(0.2, `rgba(191, 219, 254, 0.2)`);
            grad.addColorStop(1, `rgba(147, 197, 253, 0)`);
            ctx.fillStyle = grad;
            ctx.arc(128, 128, 128, 0, Math.PI * 2);
            ctx.fill();
        }
        return canvas;
    };

    const starSprite = createCachedSprite('star');
    const explosionSprite = createCachedSprite('explosion');


    // 拓扑模板 (相对坐标与锚点)
    const templates = [
        // 三角形 + 中心点 (原样式)
        {
            points: [{ x: 0, y: -30 }, { x: 15, y: 10 }, { x: -15, y: 10 }, { x: 0, y: 35 }],
            edges: [[0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3]]
        },
        // 大熊座简化 (北斗七星状)
        {
            points: [
                { x: -20, y: -25 }, { x: -10, y: -15 }, { x: 0, y: -18 }, { x: 10, y: -10 },
                { x: 15, y: 0 }, { x: 5, y: 5 }, { x: 18, y: 15 }
            ],
            edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [4, 6]]
        },
        // 天鹅座 (十字形延伸)
        {
            points: [
                { x: 0, y: -35 }, { x: 0, y: -20 }, { x: -15, y: -10 }, { x: 15, y: -10 },
                { x: -25, y: 5 }, { x: 25, y: 5 }, { x: -30, y: 20 }, { x: 30, y: 20 },
                { x: 0, y: 15 }
            ],
            edges: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [1, 8], [2, 8], [3, 8]]
        },
        // 猎户座简化
        {
            points: [
                { x: 0, y: -30 }, { x: 15, y: -20 }, { x: -15, y: -20 },
                { x: 0, y: -10 }, { x: -20, y: 5 }, { x: 20, y: 5 },
                { x: -25, y: 20 }, { x: 25, y: 20 }
            ],
            edges: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 7]]
        },
        // 皇冠座 (五边形+内外点)
        {
            points: [
                { x: 0, y: -25 }, { x: 20, y: -15 }, { x: 15, y: 10 }, { x: -15, y: 10 }, { x: -20, y: -15 },
                { x: 0, y: 0 }
            ],
            edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5]]
        },
        // 蝎子座简化 (弯尾)
        {
            points: [
                { x: 0, y: -30 }, { x: 10, y: -20 }, { x: 20, y: -10 }, { x: 25, y: 0 },
                { x: 20, y: 10 }, { x: 10, y: 20 }, { x: -5, y: 25 }, { x: -15, y: 15 }
            ],
            edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [2, 0], [3, 1]]
        },
        // 仙后座 (W形加中心)
        {
            points: [
                { x: -30, y: -15 }, { x: -15, y: 10 }, { x: 0, y: -20 }, { x: 15, y: 10 }, { x: 30, y: -15 },
                { x: 0, y: 0 }
            ],
            edges: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5]]
        },
        {
            points: [
                { x: -15, y: -15 }, // 0: 左上
                { x: 15, y: -15 },  // 1: 右上
                { x: 20, y: 15 },   // 2: 右下
                { x: -10, y: 15 },  // 3: 左下
                { x: -30, y: -25 }, // 4: 左腿延伸
                { x: -25, y: -5 }   // 5: 左下腿延伸
            ],
            edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [3, 5]]
        }
    ];

    const createConstellationData = (canvas, randomLife = false) => {
        const tpl = templates[Math.floor(Math.random() * templates.length)];

        const points = tpl.points.map(p => {
            const baseX = p.x * (Math.random() * 0.8 + 0.6) * globalScale;
            const baseY = p.y * (Math.random() * 0.8 + 0.6) * globalScale;
            return {
                baseX: baseX, baseY: baseY,
                x: baseX, y: baseY,
                vx: 0, vy: 0,
                size: Math.random() * 1.2 + 0.8, // 缩小核心尺寸，使其更锐利
                phase: Math.random() * Math.PI * 2,
                glow: 0,
                // 【新增】每颗星星自己独有的极慢闪烁频率和初始相位
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
            };
        });
        const edges = tpl.edges;

        const maxLife = Math.random() * (CONFIG.maxlifeTime - CONFIG.minLifetime) + CONFIG.minLifetime; // 延长寿命，让生灭更舒缓

        // 【修改点1】生成随机的整体初始速度，并用 baseVx/baseVy 记录它
        const initVx = (Math.random() - 0.5) * CONFIG.maxInitSpeed;
        const initVy = (Math.random() - 0.5) * CONFIG.maxInitSpeed;

        // 【新增】随机选取一个星点作为扩散/收缩的中心锚点
        const focusPoint = points[Math.floor(Math.random() * points.length)];

        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: initVx, // 极度缓慢的背景漂流
            vy: initVy,
            baseVx: initVx, // 记录初始巡航速度
            baseVy: initVy,
            points: points,
            edges: edges,
            life: randomLife ? Math.random() * maxLife : 0,
            // 【新增】物理寿命（负责形变，永远向前流动）
            scaleTime: randomLife ? Math.random() * maxLife : 0,
            maxLife: maxLife,
            //记录中心锚点和呼吸缩放参数
            focusX: focusPoint.baseX,
            focusY: focusPoint.baseY,
            // 【新增】随机决定这一生是扩张还是收缩 (1 为扩张，-1 为收缩)
            direction: Math.random() > 0.5 ? 1 : -1,
            // 【修改点1】大幅降低呼吸扩散的速度 (约原来的1/4)
            breathSpeed: Math.random() * (CONFIG.breathSpeedMax - CONFIG.breathSpeedMin) + CONFIG.breathSpeedMin,
            // 【修改点1】减小基础扩散幅度，为后续的距离放大留出空间
            breathAmplitude: Math.random() * (CONFIG.breathAmpMax - CONFIG.breathAmpMin) + CONFIG.breathAmpMin,
            // 【新增】出生保护期：初始生成的无需保护,，重生出来的新星座给予 120 帧(约2秒)免疫期
            immunity: randomLife ? 0 : 120,
            // 【新增】标记是否已经被点击摧毁
            isBlownUp: false,
            isFirstFrame: true,
            baseBrightness: Math.random() * 0.2 + 0.8
        };
    };

    const initCanvas = () => {
        const canvas = bgCanvas.value;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();

        if (constellations.length === 0) {
            for (let i = 0; i < CONFIG.maxConstellations; i++) constellations.push(createConstellationData(canvas, true));
        }

        // 【性能优化】在 initCanvas 内部，draw 函数上方，新增帧率控制变量
        let lastTime = 0;
        const fpsInterval = 1000 / CONFIG.fps;

        const draw = (timestamp) => {

            if (!uiState.enableConstellation) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }

            // 【性能优化】帧率节流阀：如果距离上一帧时间不够，直接跳过不画
            const elapsed = timestamp - lastTime;
            if (elapsed < fpsInterval) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }
            // 扣除多余时间，保证平滑
            lastTime = timestamp - (elapsed % fpsInterval);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let attractedCount = 0;

            // 【新增】绘制并更新超新星爆发效果
            for (let i = explosions.length - 1; i >= 0; i--) {
                let ex = explosions[i];
                ex.life++;
                const progress = ex.life / ex.maxLife;

                if (progress >= 1) {
                    explosions.splice(i, 1);
                    continue;
                }

                // 亮度比星点最高亮略高，呈快速扩散并消散的冲击波环
                const alpha = 1 - Math.pow(progress, 1.5);
                const radius = progress * 200; // 爆发最大半径

                const drawSize = radius * 2; //去除 | 0 取整

                const renderSize = (radius * 2) | 0;
                ctx.globalAlpha = alpha; // 全局透明度控制
                ctx.drawImage(explosionSprite, ex.x - radius, ex.y - radius, drawSize, drawSize);
                ctx.globalAlpha = 1.0;   // 用完立刻重置

            }

            constellations.forEach(c => {

                let isAttracted = false;
                let totalFx = 0, totalFy = 0;

                // 背景整体漂移
                c.x += c.vx;
                c.y += c.vy;


                let fade = Math.sin((c.life / c.maxLife) * Math.PI);
                if (fade < 0) fade = 0;
                const baseAlpha = fade * 0.9; // 提升基础透明度

                if (c.immunity > 0) {
                    c.immunity--;
                }


                c.points.forEach(p => {
                    const absX = c.x + p.x;
                    const absY = c.y + p.y;

                    // 【新增分叉】如果已经被炸毁，星点仅做惯性漂移，不再有引力和弹簧束缚
                    if (c.isBlownUp) {
                        p.vx *= 0.97; // 阻尼调小，让它们飞得更远
                        p.vy *= 0.97;
                        p.x += p.vx;
                        p.y += p.vy;
                        // 【新增：余烬黯淡效果】
                        p.glow = Math.max(0, p.glow - 0.1); // 迅速熄灭高亮的十字星芒
                        p.size *= 0.98; // 体积呈指数级缩小，模拟冷却燃烧殆尽的过程

                        return;     // 跳过后续所有原有的运动逻辑
                    }

                    const dx = mouse.x - absX;
                    const dy = mouse.y - absY;
                    const distSq = dx * dx + dy * dy;
                    //const dist = Math.sqrt(dx*dx + dy*dy);

                    p.glow = 0;
                    if (c.immunity === 0 && distSq < attractRadiusSq) {
                        isAttracted = true;
                        const dist = Math.sqrt(distSq);
                        // 距离越近，引力指数级增强
                        // 设置一个极小的安全距离（比如 1），防止除以 0 的计算崩溃
                        // 当物理距离小于 1 时，按 1 来计算，这样引力和亮度都会平滑过渡到最大值并保持
                        const safeDist = Math.max(dist, 1);

                        const force = Math.pow((CONFIG.attractRadius - safeDist) / CONFIG.attractRadius, 2);
                        const fx = (dx / safeDist) * force;
                        const fy = (dy / safeDist) * force;
                        // 大部分力用于整体位移，避免形状崩塌
                        totalFx += fx * CONFIG.attractForceGroup;
                        totalFy += fy * CONFIG.attractForceGroup;

                        // 极弱的个体力，产生距离变化趋势
                        p.vx += fx * CONFIG.attractForceStar;
                        p.vy += fy * CONFIG.attractForceStar;
                        p.glow = force;
                    }

                    // 【修改点2】计算当前星点到呼吸中心点的距离
                    const dxFocus = p.baseX - c.focusX;
                    const dyFocus = p.baseY - c.focusY;
                    const distToFocus = Math.sqrt(dxFocus * dxFocus + dyFocus * dyFocus);

                    // 1. 计算形变进度 (使用 scaleTime 而不是 life)
                    const progress = c.scaleTime / c.maxLife;

                    // 2. 保证单向且不停止的波形计算
                    let baseWave;
                    if (progress <= 1) {
                        // 正常生命周期内：平滑的 S 型缓动
                        baseWave = 0.5 - 0.5 * Math.cos(progress * Math.PI);
                    } else {
                        // 超出生命周期 (被鼠标长时间吸引保活)：不再按余弦波反转收缩
                        // 而是以极其缓慢的速度继续线性延伸，保证肉眼看它还在动，但不会形变过猛
                        baseWave = 1.0 + (progress - 1.0) * 0.1;
                    }

                    // 2. 模拟引力特性的非线性指数
                    // 将距离标准化 (假设典型星座半径在 50 * globalScale 左右，限制最大值为1)
                    const normalizedDist = Math.min(distToFocus / (50 * globalScale), 1);

                    // 核心模拟逻辑：距离越近，指数越大；距离越远，指数越小。
                    // 近点指数约 2.5：挣脱引力慢，收缩快。
                    // 远点指数约 0.5：扩散初速度极大，高处回落慢。
                    const gravityExponent = 2.5 - normalizedDist * 2.0;

                    // 应用指数扭曲波形，并将 0~1 的波形重新映射回 -1~1 的双向收放区间
                    const physicalWave = Math.pow(baseWave, gravityExponent);
                    // 将 0~1 的波形拉伸到 -1~1，并乘以它的专属命运方向
                    // 如果 direction 为 1：从紧绷(-1)缓慢走向扩散(+1)
                    // 如果 direction 为 -1：从扩散(+1)缓慢走向紧绷(-1)
                    const signedWave = (physicalWave * 2 - 1) * c.direction;

                    // 3. 动态振幅：远点受约束小，不仅跑得快，最终扩散的距离也更远
                    const dynamicAmplitude = c.breathAmplitude * (1 + distToFocus * 0.04);

                    // 4. 计算该星点最终的物理缩放比例
                    const pointScale = 1 + signedWave * dynamicAmplitude;

                    // 计算物理位移后的目标坐标
                    const targetX = c.focusX + dxFocus * pointScale;
                    const targetY = c.focusY + dyFocus * pointScale;

                    // 【修改点：拦截首帧，避免弹簧猛烈拉扯】
                    if (c.isFirstFrame) {
                        // 出生第一帧：直接传送到目标位置，不积攒速度
                        p.x = targetX;
                        p.y = targetY;
                    } else {
                        // 第二帧开始：正常的弹簧力缓慢拉向动态目标位置
                        const tdx = targetX - p.x;
                        const tdy = targetY - p.y;
                        p.vx += tdx * CONFIG.springForce;
                        // (修正了你刚才提到的 Y 轴笔误)
                        p.vy += tdy * CONFIG.springForce;

                        // 摩擦力阻尼
                        p.vx *= CONFIG.damping;
                        p.vy *= CONFIG.damping;

                        p.x += p.vx;
                        p.y += p.vy;
                    }
                });

                // 【新增】循环结束，所有点都在首帧就位后，取消首帧标记
                if (c.isFirstFrame) {
                    c.isFirstFrame = false;
                }
                // 【修改点2：物理力合成】
                // 无论是否被吸引，星座始终有一种“试图恢复原始漂流速度”的底层动力
                //c.vx += (c.baseVx - c.vx) * 0.02;
                c.vx += ((c.baseVx - c.vx) > 0) ? (c.baseVx - c.vx) * 0.02 : 0;
                //c.vy += (c.baseVy - c.vy) * 0.02;
                c.vy += ((c.baseVy - c.vy) > 0) ? (c.baseVy - c.vy) * 0.02 : 0;

                // 【修改点】时钟推进与整体受力逻辑分支
                if (c.isBlownUp) {
                    // 炸毁后：加速死亡，快速让出位置给新星座，且不再受鼠标吸引影响
                    c.life += 2;
                    c.vx *= 0.95;
                    c.vy *= 0.95;
                    c.x += c.vx;
                    c.y += c.vy;
                }
                else {
                    // 【新增】形变时钟无条件向前流动，确保动画永不停止、永不倒放
                    c.scaleTime++;
                    if (isAttracted) {
                        attractedCount++;
                        const primeOfLife = c.maxLife / 2;
                        c.life += (primeOfLife - c.life) * 0.05;

                        const avgFx = totalFx / c.points.length;
                        const avgFy = totalFy / c.points.length;
                        c.vx += avgFx;
                        c.vy += avgFy;
                        c.vx *= 0.92;
                        c.vy *= 0.92;


                        // 在被拖拽的过程中，让星座的意图逐渐向当前的实际运动速度靠拢
                        c.baseVx += (c.vx - c.baseVx) * 0.05;
                        c.baseVy += (c.vy - c.baseVy) * 0.05;
                        // 【安全锁：限制巡航速度上限】
                        // 防止用户用鼠标狠狠甩一下，导致星座记住了一个极高的速度并永远高速狂奔
                        const currentBaseSpeed = Math.sqrt(c.baseVx * c.baseVx + c.baseVy * c.baseVy);
                        const maxBaseSpeed = 0.6; // 和它出生时的最大随机速度保持一致
                        if (currentBaseSpeed > maxBaseSpeed) {
                            c.baseVx = (c.baseVx / currentBaseSpeed) * maxBaseSpeed;
                            c.baseVy = (c.baseVy / currentBaseSpeed) * maxBaseSpeed;
                        }
                    }
                    else {
                        c.life++;
                        // 自由状态下：不施加全量阻尼，而是让它缓慢恢复到出生的初始随机速度，形成漂流效果
                        c.vx += (c.baseVx - c.vx) * 0.02;
                        c.vy += (c.baseVy - c.vy) * 0.02;
                    }

                }


                // 【修改点】仅当未被炸毁时，才绘制星轨连线
                if (!c.isBlownUp) {
                    // 绘制星轨连线
                    ctx.beginPath();
                    ctx.lineWidth = 0.5;
                    c.edges.forEach(([a, b]) => {
                        const p1 = c.points[a];
                        const p2 = c.points[b];
                        if (p1 && p2) {
                            ctx.moveTo(c.x + p1.x, c.y + p1.y);
                            ctx.lineTo(c.x + p2.x, c.y + p2.y);
                        }
                    });
                    const avgGlow = c.points.reduce((sum, p) => sum + p.glow, 0) / c.points.length;
                    ctx.strokeStyle = `rgba(147, 197, 253, ${(baseAlpha * 0.5 + avgGlow * 0.7)})`; //${(baseAlpha * 0.4 + avgGlow * 0.6)})
                    ctx.stroke();
                }

                // 绘制锐利星点与十字星芒
                c.points.forEach(p => {
                    const absX = c.x + p.x;
                    const absY = c.y + p.y;

                    // 【视觉优化】计算该星点专属的闪烁乘数 (在 0.7 到 1.0 之间缓慢呼吸)
                    const twinkle = 0.85 + 0.15 * Math.sin(c.scaleTime * p.twinkleSpeed + p.twinklePhase);

                    // 【视觉优化】融合：星座整体透明度 * 鼠标引力发光 * 星座基础亮度 * 单点专属闪烁
                    // 通过乘以 brightnessMultiplier 强行拉高暗淡的乘积结果，同时用 Math.min 限制在 1.0 防止爆色
                    let starAlpha = (baseAlpha + p.glow) * c.baseBrightness * twinkle * CONFIG.brightnessMultiplier;
                    starAlpha = Math.min(1.0, starAlpha);


                    const flareSize = p.size * (2 + p.glow * 6); // 受激发的星芒长度           

                    // 1. 弥散光晕 (使用内存贴图渲染)
                    const drawRadius = p.size * 3;
                    const drawSize = drawRadius * 2;

                    if (starAlpha > 0.01) {
                        ctx.globalAlpha = starAlpha;
                        ctx.drawImage(starSprite, absX - drawRadius, absY - drawRadius, drawSize, drawSize);
                        ctx.globalAlpha = 1.0; // 重置
                    }

                    // 2. 十字衍射星芒 (直线绘制性能极佳，保留原有逻辑)
                    if (p.glow > 0.1 || starAlpha > 0.6) {
                        const flareSize = p.size * (2 + p.glow * 6);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${p.glow * 0.8 + starAlpha * (CONFIG.flareOpacity - 0.5)})`;
                        ctx.lineWidth = 0.4;
                        ctx.moveTo(absX - flareSize, absY);
                        ctx.lineTo(absX + flareSize, absY);
                        ctx.moveTo(absX, absY - flareSize);
                        ctx.lineTo(absX, absY + flareSize);
                        ctx.stroke();
                    }
                });

                if (c.life >= c.maxLife) {
                    Object.assign(c, createConstellationData(canvas));
                }
            });
            animationFrameId = requestAnimationFrame(draw);
        };

        cancelAnimationFrame(animationFrameId);
        // 初次挂载时的状态判断
        if (uiState.enableConstellation) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        // 【修复点1】防止反复打开界面导致绑定几十个相同的 watch
        if (unwatchState) {
            unwatchState();
        }

        // 监听开关状态，动态控制引擎启停
        // 【修复点2】重新绑定监听器，并在任何操作前先杀掉旧动画帧
        unwatchState = watch(() => uiState.enableConstellation, (isActive) => {
            // 无论状态如何，第一步绝对是杀掉现有的循环，杜绝“帧叠加”
            cancelAnimationFrame(animationFrameId);

            if (isActive) {
                requestAnimationFrame(draw); // 安全地重新点火
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // 清理残影
            }
        });
    };

    // 全局监听鼠标，突破 pointer-events 的限制
    const onMouseMove = (e) => {
        if (!bgCanvas.value) return;
        const rect = bgCanvas.value.getBoundingClientRect();

        // 判断鼠标是否在书本(画布)范围内
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        } else {
            // 离开法典区域，清除引力
            mouse.x = -1000;
            mouse.y = -1000;
        }
    };
    // 【新增】监听点击爆发
    const onMouseClick = (e) => {
        if (!bgCanvas.value || !uiState.enableConstellation) return;
        const rect = bgCanvas.value.getBoundingClientRect();

        // 确保点击在画布区域内
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {

            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // 1. 预检：先不出手，算算这次点击范围内能捕获多少个活着的星座
            let capturedConstellations = [];
            constellations.forEach(c => {
                // 还在无敌帧或已经炸毁的忽略
                if (c.immunity > 0 || c.isBlownUp) return;

                let isCaptured = false;
                for (let p of c.points) {
                    const dist = Math.sqrt(Math.pow(clickX - (c.x + p.x), 2) + Math.pow(clickY - (c.y + p.y), 2));
                    if (dist < CONFIG.attractRadius) {
                        isCaptured = true;
                        break;
                    }
                }

                if (isCaptured) {
                    capturedConstellations.push(c);
                }
            });

            const isEasterEgg = !hasTriggeredEasterEgg && (capturedConstellations.length === CONFIG.maxConstellations);

            // 3. 视觉表现分支
            if (isEasterEgg) {
                // 【彩蛋分支】
                hasTriggeredEasterEgg = true;
                //localStorage.setItem('magic_book_easter_egg', 'true');
                ConfigManager.updateProperty("Protagonist", "magic_book_easter_egg", true, true);
                isEasterEggUnlocked.value = true;

                // 生成超大号、寿命更长的奇点爆发动画 (60帧)
                explosions.push({ x: clickX, y: clickY, life: 0, maxLife: 60 });

                // 派发事件与弹窗提醒
                window.dispatchEvent(new CustomEvent('constellation-easter-egg'));

            } else {
                // 【普通分支】生成普通爆发动画 (25帧)
                explosions.push({ x: clickX, y: clickY, life: 0, maxLife: 25 });
            }

            // 4. 结算物理力：破坏连线并炸飞星点
            capturedConstellations.forEach(c => {
                c.isBlownUp = true; // 宣告解体

                c.points.forEach(p => {
                    const dx = (c.x + p.x) - clickX;
                    const dy = (c.y + p.y) - clickY;
                    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

                    // 力的结算：
                    // 彩蛋模式：不管离中心多远，强制给予翻倍的无差别超级击飞力
                    // 普通模式：距离爆发中心越近，击飞力越大
                    const force = isEasterEgg
                        ? CONFIG.explodeForce * 2
                        : Math.pow(Math.max(CONFIG.explodeRadius - dist, 0) / CONFIG.explodeRadius, 2) * CONFIG.explodeForce;

                    p.vx = (dx / dist) * force;
                    p.vy = (dy / dist) * force;
                });
            });

        }
    };

    onMounted(() => {
        if (bgCanvas.value) {
            resizeObserver = new ResizeObserver(() => {
                if (bgCanvas.value) {
                    bgCanvas.value.width = bgCanvas.value.offsetWidth;
                    bgCanvas.value.height = bgCanvas.value.offsetHeight;
                }
            });
            resizeObserver.observe(bgCanvas.value);
        }
        // 绑定到 window 获取绝对坐标
        win.addEventListener('mousemove', onMouseMove);
        win.addEventListener('click', onMouseClick);
    });

    onUnmounted(() => {
        cancelAnimationFrame(animationFrameId);
        if (unwatchState) unwatchState(); // 【新增】卸载时清理监听器
        if (resizeObserver && bgCanvas.value) resizeObserver.unobserve(bgCanvas.value);
        win.removeEventListener('mousemove', onMouseMove);
        win.removeEventListener('click', onMouseClick);
    });

    return { bgCanvas, initCanvas };
}


// === 2. 初始化 Vue 应用 ===
function initVueApp(appContainer, shadowRoot) {
    console.log("✅ Vue 3 加载完成，开始挂载应用...");
    const { createApp, ref, computed, reactive, onMounted, onUnmounted, watch, markRaw } = window.Vue;

    // 注入样式
    //renderVueStyles(shadowRoot);

    //const rootDiv = doc.createElement('div');
    //rootDiv.id = 'words-of-power-rc-vue-root';
    //doc.body.appendChild(rootDiv);

    const app = createApp({
        // 注册刚才定义的组件
        components: {
            MagicInput, SpellOverview, WordSlot, WordSelector, WordDetail
        },
        template: `
                <div class="fixed top-8 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center space-y-3 pointer-events-none w-full px-4">
            <transition-group name="toast">
                <div v-for="toast in toastUI.toasts" :key="toast.id"
                     class="pointer-events-auto flex items-start px-4 py-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] border backdrop-blur-md min-w-[300px] max-w-lg transition-all"
                     :class="{
                         'bg-blue-900/80 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.4)]': toast.type === 'info',
                         'bg-emerald-900/80 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.4)]': toast.type === 'success',
                         'bg-amber-900/80 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.4)]': toast.type === 'warning',
                         'bg-red-950/90 border-red-500 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.7)]': toast.type === 'error',
                         'bg-purple-950/90 border-purple-500 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.5)]': toast.type === 'confirm'
                     }">
                     <div class="mr-3 text-lg leading-none mt-0.5">
                        <span v-if="toast.type === 'info'">🌌</span>
                        <span v-if="toast.type === 'success'">✨</span>
                        <span v-if="toast.type === 'warning'">⚠️</span>
                        <span v-if="toast.type === 'error'">💥</span>
                        <span v-if="toast.type === 'confirm'">⚖️</span>
                     </div>
                     <div class="flex-1 flex flex-col min-w-0">
                         <div class="text-sm font-medium leading-relaxed whitespace-pre-wrap">{{ toast.message }}</div>
                         
                         <div v-if="toast.isConfirm" class="mt-3 flex space-x-3 justify-end border-t border-white/20 pt-2 w-full">
                             <button @click.stop="toast.onCancel()" class="px-4 py-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-xs border border-gray-600 transition shadow">
                                 Từ bỏ khắc ấn
                             </button>
                             <button @click.stop="toast.onConfirm()" class="px-4 py-1.5 rounded-md bg-red-900/80 hover:bg-red-700 text-red-100 text-xs border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition flex items-center">
                                 <span class="mr-1">⚡</span> Bắt buộc thực thi
                             </button>
                         </div>
                     </div>
                     <button v-if="toast.requireClose" @click="toastUI.removeToast(toast.id)" class="ml-4 text-red-300 hover:text-white text-2xl leading-none focus:outline-none transition-colors">&times;</button>
                </div>
            </transition-group>
        </div>

        <div 
            v-show="!ui.mainModalOpen"
            class="fixed z-50 w-16 h-16 bg-blue-900 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] border-2 border-blue-400 flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-105 active:scale-95"
            :style="{ left: fab.x + 'px', top: fab.y + 'px', touchAction: 'none' }"
            @mousedown="startDrag"
            @touchstart.prevent="startDrag"
        >
            <span class="text-blue-100 font-bold text-xl drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">Tinh</span>
        </div>

        <transition name="fade">
            <div id="ui-mask-overlay" 
                v-show="ui.mainModalOpen" 
                class="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center"
                @mousedown="maskEvents.onMaskMousedown"
                @mouseup="maskEvents.onMaskMouseup">
                
                
                <transition name="book-open">
                    <div id="ui-magic-book-modal" v-if="ui.mainModalOpen" 
                         class="magic-book-container absolute flex flex-col md:flex-row max-w-[95vw] max-h-[92vh]"
                         :style="{ width: bookSize.w + 'px', height: bookSize.h + 'px', left: bookPos.x + 'px', top: bookPos.y + 'px' }">

                        <canvas ref="bgCanvas" class="absolute top-0 left-0 w-[100vw] h-[100vh] w-full h-full pointer-events-none z-0 opacity-80 rounded-[inherit]"></canvas>
                        
                        <div class="absolute top-0 left-0 w-full h-8 cursor-move z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity touch-none" @mousedown.prevent="startBookDrag" @touchstart.prevent="startBookDrag">
                             <div class="w-32 h-1 bg-blue-400/50 rounded-full mt-2"></div>
                        </div>

                        <div class="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-30 flex items-center justify-center touch-none" @mousedown.prevent.stop="startBookResize" @touchstart.prevent.stop="startBookResize">
                            <svg class="w-4 h-4 text-blue-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        </div>
                        
                        <!-- <div id="ui-bookmark-nav" class="absolute -right-[42px] top-10 flex flex-col space-y-4 z-0"> -->
                        
                        <div id="ui-bookmark-nav" 
                            class="absolute flex flex-col space-y-3 z-[60] transition-transform duration-300 pointer-events-none"
                            :style="bookSize.w < 768 
                                ? { right: '-10px', top: '20px', transform: 'scale(0.8)', transformOrigin: 'right top' } 
                                : { left: 'calc(100% - 4px)', top: '40px', transform: 'scale(' + bookScale + ')', transformOrigin: 'left top' }">

                            <div class="flex flex-col items-start mb-6 pointer-events-auto relative">
                                <button 
                                    @click="closeMainModal" 
                                    class="relative w-10 py-4 text-red-200 font-serif font-bold text-[11px] leading-tight rounded-r-xl border-y border-r border-red-600/50 shadow-[8px_5px_15px_rgba(0,0,0,0.7)] hover:brightness-125 hover:translate-x-2 transition-all flex flex-col items-center justify-center group"
                                    style="background: linear-gradient(to left, #991b1b, #450a0a);"
                                    title="Phong ấn pháp điển">
                                    <div class="absolute left-1.5 top-2 bottom-2 w-px border-l border-dashed border-red-400/40"></div>
                                    <div class="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/80 to-transparent"></div>
                                    
                                    <span class="relative z-20">Đóng</span>
                                    <span class="relative z-20">Pháp</span>
                                    <span class="relative z-20">Điển</span>
                                </button>
                                
                                <button @click="ui.enableConstellation = !ui.enableConstellation" 
                                        class="absolute -right-5 top-[105px] text-[10px] text-blue-400/80 hover:text-blue-200 font-mono transition-colors bg-[#0b1120]/90 px-1 py-1.5 rounded border border-blue-800/50 shadow-md backdrop-blur-sm pointer-events-auto mb-2 mt-2"
                                        style="writing-mode: vertical-rl;"
                                        title="Chuyển đổi hình bóng tinh không">
                                    [{{ ui.enableConstellation ? 'Quỹ đạo sao chuyển động' : 'Quỹ đạo sao tĩnh lặng' }}]
                                </button>
                            </div>

                            <button 
                                v-for="tab in ui.tabs" 
                                :key="tab.id"
                                @click="ui.activeTab = tab.id"
                                class="relative pointer-events-auto py-4 font-serif font-bold text-[11px] leading-tight rounded-r-xl border-y border-r shadow-[8px_5px_15px_rgba(0,0,0,0.7)] hover:translate-x-1.5 transition-all flex flex-col items-center justify-center overflow-hidden group"
                                :class="ui.activeTab === tab.id 
                                    ? ' text-white border-blue-400 w-11 shadow-[8px_5px_20px_rgba(37,99,235,0.4)]' 
                                    : ' text-blue-400/100 border-blue-800/50 w-9 hover:text-blue-200'"
                                :style="{ 
                                    background: ui.activeTab === tab.id ? 'linear-gradient(to left, #2563eb, #1e3a8a)' : 'linear-gradient(to left, #1e293b, #0f172a)' 
                                }"
                            >
                                <div v-if="ui.activeTab === tab.id" class="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-white/10 rounded-r-xl"></div>
                                
                                <div class="absolute left-1.5 top-2 bottom-2 w-px border-l border-dashed opacity-60" :class="ui.activeTab === tab.id ? 'border-blue-200' : 'border-blue-600'"></div>
                                
                                <div class="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/90 to-transparent z-10"></div>

                                <span v-for="word in tab.name.split(' ')" :key="word" class="relative z-20">{{ word }}</span>
                            </button>
                        </div>
                        <div id="book-page-left" class="flex-1 p-6 relative z-10 overflow-y-auto custom-scrollbar flex flex-col border-b md:border-b-0 md:border-r border-blue-900/30">
                            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 text-s text-blue-400 border-b border-blue-900/50 pb-2">
                                <span class="tracking-widest font-mono font-bold text-blue-500/50">STARRY CODEX</span>
                                <div class="flex items-center">
                                    <span class="flex flex-wrap items-center gap-x-2 gap-y-1">Người thi triển chú tự:</span>
                                    <span v-if="characterData.protagonist" class="font-bold text-blue-200">
                                        {{ characterData.protagonist.displayName }} 
                                    </span>
                                    <span v-else class="text-red-400 font-bold drop-shadow ">Chưa rõ</span>

                                    <select v-model="builderUI.mainAttribute" class="bg-[#1e293b] border border-blue-700/50 rounded text-blue-300 px-2 py-0.5 outline-none text-xs focus:border-blue-400 transition cursor-pointer shadow-sm">
                                        <option value="Intelligence">Intelligence</option>
                                        <option value="精神">Tinh thần</option>
                                    </select>

                                    <button @click="updateCharacterData" class="px-2 py-0.5 bg-[#1e293b] hover:bg-blue-800 text-blue-300 rounded border border-blue-700/50 text-xs transition flex items-center shadow-sm active:scale-95" title="Bắt buộc đồng bộ trạng thái linh thể tầng đáy">
                                        <span class="mr-1 text-[10px]">🔄</span> Đồng bộ
                                    </button>

                                </div>
                            </div>

                            <div v-show="ui.activeTab === 'spell_builder'" class="flex flex-col space-y-3 h-full">
                                <div class="flex items-center space-x-2 bg-[#1e293b]/80 p-2 rounded-lg border border-blue-400/30 shadow-inner">
                                    <magic-input v-model="composingSpell.customName" placeholder="Đặt tên cho phép thuật..."></magic-input>
                                    <button @click="saveCurrentAsPreset" class="whitespace-nowrap px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-blue-50 rounded text-xs transition shadow border border-blue-500">Lưu khắc ấn</button>
                                    <button @click="isPresetModalOpen = true" class="whitespace-nowrap px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-indigo-50 rounded text-xs transition shadow border border-indigo-500">Đọc khắc ấn</button>
                                    <button @click="generatePayload" class="whitespace-nowrap px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-emerald-50 rounded text-xs transition shadow border border-emerald-500 flex items-center">
                                        <span class="mr-1">🚀</span> Gửi thông tin
                                    </button>
                                </div>
                                
                                <spell-overview :stats="spellStats" :spell="composingSpell"></spell-overview>
                                
                                <div class="flex-1 flex flex-col overflow-hidden">
                                    <h3 class="text-sm font-bold text-blue-200 mb-2 flex items-center shrink-0">
                                        <span class="mr-1.5">📜</span> Chi tiết phép thuật tổ hợp
                                    </h3>
                                    <div class="flex-1 bg-[#0f172a]/80 border border-blue-500/30 rounded-lg p-3 overflow-y-auto custom-scrollbar shadow-inner space-y-3">
                                        <div v-if="realtimeSteps.length === 0" class="text-blue-400/60 text-xs text-center mt-4">
                                            Chưa được tổ hợp, vui lòng chọn chú tự khắc ấn ở bên phải...
                                        </div>
                                        
                                        <div v-for="(step, index) in realtimeSteps" :key="index" class="flex flex-col bg-[#1e293b]/60 p-2.5 rounded border-l-2 border-blue-500 hover:bg-[#1e293b]/80 transition">
                                            <div class="flex items-start">
                                                <span class="text-base mr-2 mt-0.5 leading-none">{{ step.icon }}</span>
                                                <div class="flex-1 min-w-0">
                                                    <div :class="['font-bold text-sm truncate', getQualityColor(step.quality)]">
                                                        {{ step.name }}
                                                    </div>
                                                    <div class="mt-1 space-y-1">
                                                        <div v-for="(line, lIdx) in step.descs" :key="lIdx" class="text-xs text-blue-100/90 leading-relaxed">
                                                            {{ line }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="step.metas && step.metas.length > 0" class="mt-2 ml-6 pl-2 border-l border-indigo-500/50 space-y-1.5">
                                                <div v-for="(m, mIdx) in step.metas" :key="mIdx" class="flex items-start">
                                                    <span class="text-[11px] mr-1 mt-0.5 text-indigo-400 font-mono">↳</span>
                                                    <div>
                                                        <span :class="['text-xs font-bold mr-1', getQualityColor(m.quality)]">[{{ m.name }}]</span>
                                                        <span class="text-xs text-indigo-200/90 leading-tight">{{ m.desc }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-show="ui.activeTab === 'word_forge'" class="flex flex-col h-full">
                                <div class="flex space-x-2 mb-4">
                                    <button @click="forgeState.mode = 'register'" :class="['flex-1 py-2 rounded-lg font-bold border transition shadow-inner', forgeState.mode === 'register' ? 'bg-indigo-800 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-[#1e293b]/60 border-blue-900/50 text-blue-400 hover:bg-[#1e293b]']">
                                        ✨ Khắc ghi hiệu ứng chú tự (Đăng ký)
                                    </button>
                                    <button @click="forgeState.mode = 'manage'" :class="['flex-1 py-2 rounded-lg font-bold border transition shadow-inner', forgeState.mode === 'manage' ? 'bg-purple-800 border-purple-400 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-[#1e293b]/60 border-blue-900/50 text-blue-400 hover:bg-[#1e293b]']">
                                        📚 Gợi nhớ chú tự (Quản lý)
                                    </button>
                                </div>

                                <div v-if="forgeState.mode === 'register'" class="space-y-4">
                                    <div class="bg-[#1e293b]/50 p-4 rounded-xl border border-blue-800/40 text-center">
                                        <p class="text-sm text-blue-300/80 mb-3">Chuyển đổi các chú tự trong kỹ năng thành các chú tự tiêu chuẩn có thể tính toán được.</p>
                                        <button @click="forgeUI.skillSelectorOpen = true" class="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold shadow-[0_0_10px_rgba(30,58,138,0.6)] border border-blue-400 transition flex justify-center items-center">
                                            <span class="mr-2">🔍</span> Quét kỹ năng hiện tại
                                        </button>
                                    </div>
                                    <div class="flex space-x-2">
                                        <button @click="createBlankWord('effect')" class="flex-1 py-2 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 rounded text-sm transition">
                                            + Tạo chú tự hiệu ứng trống
                                        </button>
                                        <button @click="createBlankWord('meta')" class="flex-1 py-2 bg-cyan-900/60 hover:bg-cyan-800/80 border border-cyan-600/50 text-cyan-200 rounded text-sm transition">
                                            + Tạo chú tự siêu ma trống
                                        </button>
                                    </div>

                                    <h4 class="font-bold text-indigo-300 mb-3 border-b border-indigo-900/50 pb-1 flex items-center">
                                        <span class="mr-2">🔮</span> Trích xuất hư không (Tạo chỉ lệnh kiểm định)
                                    </h4>
                                    
                                    <div class="space-y-3">
                                        <div class="flex items-center space-x-2">
                                            <div class="w-1/4">
                                                <label class="block text-xs text-blue-400 mb-1">Loại mục tiêu</label>
                                                <select v-model="extractState.targetType" @change="extractState.selectedName = ''" class="magic-input-base text-sm">
                                                    <option value="skill">Kỹ năng</option>
                                                    <option value="item">Vật phẩm</option>
                                                </select>
                                            </div>
                                            <div class="flex-1">
                                                <label class="block text-xs text-blue-400 mb-1">Chọn vật mang</label>
                                                <button @click="extractUI.selectorOpen = true" class="w-full text-left magic-input-base text-sm truncate hover:border-indigo-400 transition text-indigo-200 bg-[#0f172a]/80">
                                                    {{ extractState.selectedName ? "[" + (extractState.targetType === 'skill' ? 'Kỹ năng' : 'Vật phẩm') + "]" + extractState.selectedName : 'Nhấp để chọn mục tiêu trích xuất...' }}
                                                </button>
                                            </div>
                                            <div class="w-1/4">
                                                <label class="block text-xs text-blue-400 mb-1">Thuộc tính kiểm định</label>
                                                <select v-model="extractState.attribute" class="magic-input-base text-sm">
                                                    <option value="Intelligence">Intelligence (INT)</option>
                                                    <option value="精神">Tinh thần (SPR)</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-xs text-blue-400 mb-1">Ý đồ trích xuất (Kỳ vọng tách ra loại hiệu ứng chú tự nào?)</label>
                                            <textarea v-model="extractState.direction" rows="2" placeholder="Ví dụ: Cố gắng tách riêng hiệu ứng sát thương hỏa thuần túy, không giữ lại trạng thái đi kèm..." class="magic-input-base text-s flex-1 resize-y min-h-[38px] custom-scrollbar leading-relaxed"></textarea>
                                        </div>
                                        
                                        <button @click="generateExtractionPrompt" class="w-full py-2 bg-indigo-800/80 hover:bg-indigo-700 text-indigo-100 rounded text-sm transition shadow-[0_0_10px_rgba(49,46,129,0.5)] border border-indigo-500 flex justify-center items-center">
                                            <span class="mr-2">📝</span> Cấu trúc từ khóa kiểm định
                                        </button>
                                    </div>

                                </div>

                                <div v-if="forgeState.mode === 'manage'" class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                    <h3 class="text-sm font-bold text-purple-300 mb-2 border-b border-purple-900/50 pb-1">Chú tự tùy chỉnh đã khắc ấn</h3>
                                    
                                    <div v-if="Object.keys(customWordsList).length === 0" class="text-center text-blue-500/50 text-sm py-4">
                                        Trong hư không trống rỗng không có một vật...
                                    </div>

                                    <div v-for="(w, uid) in customWordsList" :key="uid" class="bg-[#0f172a]/80 p-3 rounded-lg border border-blue-800/50 hover:border-purple-500/50 transition group flex flex-col relative shadow-inner">
                                        <div class="flex justify-between items-start mb-1">
                                            <div :class="['font-bold text-sm', getQualityColor(w.quality || w.quality_limit)]">
                                                [{{ w.quality_limit ? 'Siêu ma' : 'Hiệu ứng' }}] {{ w.name }}
                                            </div>
                                            <div class="space-x-1 opacity-0 group-hover:opacity-100 transition absolute right-2 top-2">
                                                <button @click="loadCustomWord(w)" class="px-2 py-0.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs shadow">Chỉnh sửa</button>
                                                <button @click="deleteCustomWord(w)" class="px-2 py-0.5 bg-red-900 hover:bg-red-700 text-white rounded text-xs shadow">Xóa bỏ</button>
                                            </div>
                                        </div>
                                        <div class="text-xs text-blue-300/70 truncate w-[85%]">{{ getBriefDesc(w) }}</div>
                                    </div>
                                </div>
                            </div>

                            <div v-show="ui.activeTab === 'lore_book'" class="flex flex-col space-y-4 h-full animate-fadeIn">
                                <div class="flex justify-between items-center mb-2 border-b border-blue-800/50 pb-2">
                                    <h3 class="text-xl font-bold text-blue-100 flex items-center">
                                        <span class="mr-2">📖</span> Chú tự // Quyển một: Cơ bản
                                    </h3>
                                </div>

                                <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">

                                    <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner space-y-3">
                                        <h4 class="font-bold text-blue-300 border-b border-blue-900/50 pb-1">✦ Tổng quan chú tự</h4>
                                        
                                        <div class="border-indigo-500 pl-3">
                                            <h5 class="text-indigo-300 font-bold text-sm mb-1">Thiết lập cơ bản</h5>
                                            <p class="text-sm text-gray-100 leading-relaxed">
                                                Những người thi triển phép thuật truyền thống dành cả đời để học hỏi và nắm vững các loại phép thuật trong lĩnh vực của họ, nhưng đây không phải là con đường duy nhất. Có những người đã giải mã được các khối cấu trúc cơ bản của ma pháp. Những người này học được chú tự, và thông qua phương thức mới này định hình và sử dụng những ma pháp hoàn toàn khác biệt.
                                            </p>
                                            <p class="text-sm text-gray-100 leading-relaxed">
                                                Mặc dù vai trò cũng gần giống như những người thi triển phép thuật khác, nhưng người thi triển chú tự (hay chú tự sứ) có sự linh hoạt mạnh mẽ trong việc chuẩn bị và thi triển phép thuật. Mỗi chú tự sứ đều có thể, dựa trên một số giới hạn nhất định, liên kết các chú tự để tạo ra bất kỳ hiệu ứng nào họ có thể nghĩ đến.
                                            </p>
                                        </div>
                                        
                                        <div class="border-purple-500 pl-3">
                                            <h5 class="text-purple-300 font-bold text-sm mb-1"> Vị thế của chú tự </h5>
                                                                                                                                                                                                            <p class="text-sm text-gray-100 leading-relaxed">
                                                Mặc dù chú tự được (những người thi triển chú tự) coi là một sức mạnh gần gũi hơn với bản nguyên, nhưng thực tế chú tự là một dạng ma pháp nguyên thủy bắt nguồn từ thời cổ đại, việc sử dụng chú tự trong thời hiện đại là vô cùng hiếm thấy, người sử dụng thường có xu hướng trở thành những bậc thầy tinh thông kiến thức bí truyền.
                                            </p> 
                                            <p class="text-sm text-gray-100 leading-relaxed">
                                                Ma pháp đương đại được phát triển dựa trên nền tảng của ma pháp nguyên thủy và chú tự. Mặc dù chức năng mạnh mẽ, nhưng chú tự lại tụt hậu so với ma pháp đương đại ở nhiều khía cạnh. Hệ thống này tuy linh hoạt nhưng lại thiếu đi sự tinh tế của ma pháp đương đại, nó cho phép người thi triển định hình ma pháp theo những cách khó có thể đạt được trước đây, nhưng lại cản trở bản thân họ tạo ra những hiệu ứng cụ thể đáng kinh ngạc như những người thi triển phép thuật thông thường thường làm.
                                            </p>
                                                
                                            <p class="border-l-2 border-blue-500 pl-3 ml-5 text-blue-200 text-sm">
                                                Bổ sung: Một số lý thuyết ma pháp đương đại cho rằng, bản nguyên ma pháp có thể không thể chia nhỏ đơn giản thành các cấu trúc cơ bản nhất, ví dụ, cấu trúc của các chú tự cơ bản như hỏa/thủy/khí được hầu hết những người thi triển chú tự nắm vững là hoàn toàn khác nhau, rất khó để lắp ráp cấu trúc của khí thông qua sự kết hợp đơn giản của thủy và hỏa (tạo ra khí bằng cách dùng thủy trước rồi hỏa sau là khả thi, nhưng hiệu suất thấp hơn nhiều so với chú tự khí). Vì vậy, chú tự đại diện cho một loại cấu trúc cực giản có thể kết hợp mà ít gây nhiễu và bài xích lẫn nhau, nhưng hiện nay không thiếu các nghiên cứu về việc xây dựng chống nhiễu cho các module phép thuật phức tạp. (Người thi triển chú tự sẽ phản bác rằng đó chỉ là do chưa tìm thấy hình thái chú tự cơ bản hơn, tất nhiên đây là một lĩnh vực nghiên cứu khác).
                                            </p>
                                        </div>

                                        <div class="border-emerald-500 pl-3">
                                            <h5 class="text-emerald-300 font-bold text-sm mb-1">Học chú tự</h5>
                                            <p class="text-sm text-gray-100 leading-relaxed">
                                                Cách thu thập chú tự thường có những con đường sau: Thông qua việc suy ngẫm về sự vận hành của thế giới (cùng với sự dẫn dắt vô hình), khám phá những chú tự mà bạn chưa từng phát hiện ra; Phương pháp này mang quá nhiều sự không chắc chắn, vì vậy một cách phổ biến hơn là trích xuất từ những thứ hiện có. 
                                                <span class="text-indigo-300 font-bold text-sm mb-1">Vật phẩm/Cuộn giấy/Đũa phép/Phép thuật bạn biết</span>
                                                để tháo dỡ ra chú tự. Đây là một loại nghiên cứu mang tính phá hủy, do đó bất kể thành công hay thất bại đều sẽ làm hỏng vật phẩm, và gây ra phản phệ (dẫn đến những hậu quả không thể lường trước). Nếu việc phân tách từ các phép thuật bạn đã học thất bại, bạn sẽ không quên đi phép thuật đó, nhưng phản phệ vẫn xảy ra bình thường.
                                            </p>
                                        </div>
                                    </div>

                                    <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner space-y-3">
                                        <h4 class="font-bold text-blue-300 border-b border-blue-900/50 pb-1">✦ Phân tích loại chú tự</h4>

                                        <p class="text-sm text-gray-200 leading-relaxed mb-2">Chú tự được chia thành ba loại lớn: <span class="text-indigo-300 font-bold text-sm mb-1">Chú tự mục tiêu</span>, <span class="text-purple-300 font-bold text-sm mb-1">Chú tự hiệu ứng</span> và <span class="text-emerald-300 font-bold text-sm mb-1">Chú tự siêu ma</span>. Người thi triển chú tự kết hợp những chú tự này để thi triển những câu thần chú mạnh mẽ và đa dạng, được gọi là phép thuật chú tự.</p>
                                        
                                        <div class="border-l-2 border-indigo-500 pl-3">
                                            <h5 class="text-indigo-300 font-bold text-sm mb-1">🎯 Chú tự mục tiêu (Target Word)</h5>
                                            <p class="text-sm text-gray-100 leading-relaxed">Quyết định <span class="text-blue-200 font-bold">hình thái, khoảng cách thi triển, phương thức thi triển và đối tượng chịu tác động</span> của phép thuật. Ảnh hưởng đến tất cả chú tự hiệu ứng. Nếu có mang theo khu vực, thì sẽ ảnh hưởng đến tất cả mục tiêu trong khu vực đó. Một phép thuật chú tự <span class="text-red-300 font-bold">chỉ có thể chứa 1</span> chú tự mục tiêu.</p>
                                        </div>
                                        
                                        <div class="border-l-2 border-purple-500 pl-3">
                                            <h5 class="text-purple-300 font-bold text-sm mb-1">🌀 Chú tự hiệu ứng (Effect Word)</h5>
                                            <p class="text-sm text-gray-100 leading-relaxed">Quyết định 
                                                <span class="text-blue-200 font-bold">hiệu ứng thực tế, học phái, thời gian duy trì và kháng tính miễn nhiễm</span>
                                                sau khi thi triển. Có thể chứa nhiều hiệu ứng từ các học phái khác nhau (tối đa <span class="text-orange-200 font-bold">6 thông thường + 1 duy nhất </span>). Thứ tự phát huy tác dụng của các chú tự hiệu ứng trong cùng một phép thuật tổ hợp được quyết định bởi thứ tự giải phóng, trong cùng một chú tự tổ hợp, chú tự phát huy tác dụng sau có thể được hưởng lợi từ ảnh hưởng của chú tự phát huy tác dụng trước đó. Ví dụ:  
                                                <span class="text-blue-200 font-bold">Lựa chọn | </span> 
                                                <span class="text-green-200 font-bold">Tê liệt con người | </span>
                                                <span class="text-red-200 font-bold">Xung kích ngọn lửa </span>
                                                chú tự tổ hợp, sau khi tê liệt phát huy tác dụng, sát thương ngọn lửa có thể ngay lập tức được hưởng lợi từ việc tự động thất bại miễn nhiễm nhanh nhẹn do tê liệt mang lại.
                                            </p>
                                        </div>

                                        <div class="border-l-2 border-emerald-500 pl-3">
                                            <h5 class="text-emerald-300 font-bold text-sm mb-1">✨ Chú tự siêu ma (Meta Word)</h5>
                                            <p class="text-sm text-gray-100 leading-relaxed">Dùng để cường hóa các chỉ số của phép thuật (khoảng cách, thời gian duy trì, v.v.). Có thể tác động lên mục tiêu, chú tự hiệu ứng hoặc toàn bộ phép thuật. Phép thuật có thể chứa nhiều siêu ma, nhưng <span class="text-red-300 font-bold">một chú tự đơn lẻ không thể bị điều chỉnh nhiều lần bởi cùng một siêu ma</span>.</p>
                                        </div>
                                    </div>
                                    
                                    <div class="bg-blue-900/20 border border-blue-800/50 p-3 rounded-lg text-sm text-blue-100/90 leading-relaxed">
                                        <strong class="text-blue-300">Kỷ luật cấu trúc thép: </strong>Mỗi phép thuật phải bao gồm ít nhất <span class="text-indigo-300 font-bold">1 chú tự mục tiêu</span> và <span class="text-purple-300 font-bold">1 chú tự hiệu ứng</span> kết hợp lại. Mục tiêu đơn thuần không làm tăng tiêu hao ma lực cơ bản, chỉ có siêu ma mới gây ra tiêu hao thêm.
                                    </div>

                                    <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner">
                                        <h4 class="font-bold text-blue-300 mb-2 border-b border-blue-900/50 pb-1">✦ Cấp bậc phẩm chất chú tự</h4>
                                        <p class="text-sm text-gray-200 leading-relaxed mb-2">Phép thuật và chú tự hiệu ứng có sự phân chia cấp bậc nghiêm ngặt, từ dưới lên trên là:</p>
                                        <div class="flex flex-wrap gap-2 text-sm font-bold bg-[#0f172a]/50 p-2 rounded">
                                            <span class="text-gray-400">Common</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-emerald-400">Uncommon</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-blue-400">Rare</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-purple-400">Epic</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-yellow-400 drop-shadow">Legendary</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">Mythic</span>
                                        </div>
                                        <p class="text-xs text-amber-500/90 mt-2 italic">* Ngoài ra: Tồn tại phẩm chất siêu việt hệ thống thông thường là <strong class="font-bold drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]">「Unique」</strong></p>
                                        <p class="text-sm text-gray-200 leading-relaxed mb-2 mt-2">Tác dụng của phẩm chất thể hiện ở "Độ ưu tiên", 
                                            chỉ tác dụng lên <strong class="font-bold drop-shadow-[0_0_5px_rgba(245,158,11,0.6)]">loại quy tắc</strong> của hiệu ứng như<span class="text-purple-200"> Miễn dịch/Kháng </span>và<span class="text-purple-200"> Xuyên thủng miễn dịch </span>khi có xung đột. Cả miễn dịch và xuyên thủng đều thể hiện sức mạnh bản chất, nếu không có xung đột, 
                                            ngay cả là phẩm chất <span class="text-blue-400">Rare</span> của <span class="text-purple-200"> Miễn dịch </span>hỏa diễm cũng có thể miễn dịch phép thuật hỏa diễm cấp <span class="text-yellow-400 drop-shadow">Legendary</span></p>
                                        <p class="text-sm text-gray-200 leading-relaxed mb-2 mt-2">
                                            Nhưng khi bên tấn công sở hữu hiệu ứng <span class="text-purple-200">xuyên thủng miễn dịch</span>, phán định xuyên thủng được quyết định theo độ ưu tiên.
                                            Hiệu ứng có độ ưu tiên cao hơn sẽ phát huy tác dụng. Bên tấn công sở hữu hiệu ứng trở lên của <span class="text-purple-400">Epic</span> <span class="text-purple-200">bỏ qua</span> miễn dịch hỏa diễm là có thể xuyên thủng miễn dịch hỏa diễm cấp <span class="text-blue-400">Rare</span>. Khi độ ưu tiên như nhau, bên có cấp độ người thi triển phép thuật cao hơn sẽ phát huy tác dụng. Nếu cấp độ cũng như nhau thì hoàn toàn ngẫu nhiên.   
                                        </p>
                                        <p class="text-sm text-gray-200 leading-relaxed mb-2">Thứ tự ưu tiên hoàn chỉnh (từ thấp đến cao) là:</p>
                                        <div class="flex flex-wrap gap-1 text-sm font-bold bg-[#0f172a]/50 p-2 rounded">
                                            <span class="text-gray-400">Common</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-emerald-400">Uncommon</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-blue-400">Rare</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-purple-300">Epic</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-purple-300">[Yếu tố]</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-yellow-300 drop-shadow">Legendary</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-yellow-400 drop-shadow">[Quyền năng]</span> <span class="text-blue-800/50">/</span>
                                            <span class="text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">Mythic</span><span class="text-blue-800/50">/</span>
                                            <span class="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">[Pháp tắc]</span><span class="text-white-800/50">=</span>
                                            <span class="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] font-extrabold">Unique</span><span class="text-blue-800/50">/</span>
                                            <span class="text-amber-700 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] font-extrabold">Mythic</span>
                                        </div>
                                        <p class="text-xs text-amber-500/90 mt-2 italic">* Ngoại lệ: Thần linh trong lĩnh vực bổn phận của Ngài có độ ưu tiên cao nhất vô điều kiện, ngay cả khi không thuộc lĩnh vực của Ngài, cũng có thể tùy ý phớt lờ phần lớn hiệu ứng của thế gian</p>
                                    </div>

                                </div>
                            </div>
                        
                        </div>

                        <div id="book-page-right" class="flex-1 p-3 md:p-6 pr-10 relative z-10 md:pr-6 overflow-y-auto custom-scrollbar">
                            
                            <div v-show="ui.activeTab === 'spell_builder'" id="module-spell-builder" class="space-y-4 pb-10">
                                <h3 class="text-xl font-bold mb-4 text-blue-100 border-b border-blue-800/50 pb-2 flex items-center">
                                    <span class="mr-2">🌌</span> Ô chứa chú tự
                                </h3>
                                
                                <word-slot 
                                    title="🎯 Chú tự mục tiêu (Giới hạn 1)" 
                                    slot-type="target" 
                                    btn-text="✦ Khắc ghi mục tiêu" 
                                    btn-color="bg-blue-800 hover:bg-blue-700 text-blue-100 border border-blue-600 shadow-[0_0_10px_rgba(30,58,138,0.5)]"
                                    :items="composingSpell.target_words"
                                    :current-quality="spellStats.quality"
                                    @open-main="openSelector('target', 'spell')"
                                    @open-meta="(holder) => openSelector('meta', 'target', holder)"
                                    @remove-word="(idx) => removeWord('target_words', idx)"
                                    @remove-meta="removeMeta"
                                    @show-details="showDetails">
                                </word-slot>

                                <word-slot 
                                    title="🌀 Chú tự hiệu ứng (Giới hạn 6)" 
                                    slot-type="effect" 
                                    btn-text="✦ Truyền hiệu ứng" 
                                    btn-color="bg-indigo-800 hover:bg-indigo-700 text-indigo-100 border border-indigo-600 shadow-[0_0_10px_rgba(49,46,129,0.5)]"
                                    :items="composingSpell.effect_words"
                                    :current-quality="spellStats.quality"
                                    @open-main="openSelector('effect', 'spell')"
                                    @open-meta="(holder) => openSelector('meta', 'effect', holder)"
                                    @remove-word="(idx) => removeWord('effect_words', idx)"
                                    @remove-meta="removeMeta"
                                    @show-details="showDetails">
                                </word-slot>

                                <word-slot 
                                    title="👑 Chú tự duy nhất (Giới hạn 1)" 
                                    slot-type="unique" 
                                    btn-text="✦ Truyền duy nhất" 
                                    btn-color="bg-purple-800 hover:bg-purple-700 text-purple-100 border border-purple-600 shadow-[0_0_10px_rgba(88,28,135,0.5)]"
                                    :items="composingSpell.unique_effect_words"
                                    :current-quality="spellStats.quality"
                                    @open-main="openSelector('unique', 'spell')"
                                    @open-meta="(holder) => openSelector('meta', 'effect', holder)"
                                    @remove-word="(idx) => removeWord('unique_effect_words', idx)"
                                    @remove-meta="removeMeta"
                                    @show-details="showDetails">
                                </word-slot>

                                <word-slot 
                                    title="✨ Siêu ma toàn cục phép thuật" 
                                    slot-type="spell" 
                                    btn-text="✦ Đính kèm siêu ma" 
                                    btn-color="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600 shadow-[0_0_10px_rgba(6,78,59,0.5)]"
                                    :items="composingSpell.spell_meta_words"
                                    :current-quality="spellStats.quality"
                                    @open-main="openSelector('meta', 'spell')"
                                    @remove-word="(idx) => removeWord('spell_meta_words', idx)"
                                    @show-details="showDetails">
                                </word-slot>
                            </div>

                            <div v-show="ui.activeTab === 'word_forge'" class="pb-10">
                                <h3 class="text-xl font-bold mb-4 text-blue-100 border-b border-blue-800/50 pb-2 flex items-center">
                                    <span class="mr-2">✍️</span> Soạn thảo chú tự
                                </h3>

                                <div v-if="!forgeState.editingData" class="h-64 flex items-center justify-center border-2 border-dashed border-blue-900/50 rounded-xl text-blue-500/50">
                                    Vui lòng chọn khắc ấn ở bên trái, hoặc tạo một mẫu trống...
                                </div>

                                <div v-else class="space-y-4 animate-fadeIn">
                                    <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner space-y-3">
                                        <div class="flex items-center space-x-2">
                                            <div class="w-2/3">
                                                <label class="block text-xs text-blue-400 mb-1">Tên (Name)</label>
                                                <input v-model="forgeState.editingData.name" class="magic-input-base text-lg font-bold text-white">
                                            </div>
                                            <div class="w-1/3">
                                                <label class="block text-xs text-blue-400 mb-1">Phẩm chất</label>
                                                <select v-model="currentQualityField" class="magic-input-base">
                                                    <option v-for="q in ['Common','Uncommon','Rare','Epic','Legendary','Mythic','Unique']" :value="q">{{q}}</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div class="flex items-center space-x-2">
                                            <div class="w-1/2">
                                                <label class="block text-xs text-blue-400 mb-1">Ấn ký duy nhất (UID - Hệ thống tạo)</label>
                                                <input :value="forgeState.editingData.uid" readonly class="magic-input-base opacity-70 bg-black/40 text-gray-500 text-xs">
                                            </div>
                                            <div class="w-1/2">
                                                <label class="block text-xs text-blue-400 mb-1">Loại chú tự</label>
                                                <select v-model="forgeState.editingType" class="magic-input-base text-amber-300 bg-amber-900/20 border-amber-700/40" disabled>
                                                    <option value="effect">Chú tự hiệu ứng (Effect)</option>
                                                    <option value="meta">Chú tự siêu ma (Meta)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner space-y-3">
                                        <h4 class="text-sm font-bold text-blue-200 border-b border-blue-900/50 pb-1">Tiêu hao 3D</h4>
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs text-purple-400 mb-1">Rút ma lực (MP)</label>
                                                <input type="number" v-model.number="forgeState.editingData.extra_cost.mp" class="magic-input-base">
                                            </div>
                                            <div>
                                                <label class="block text-xs text-red-400 mb-1">Tiêu hao sinh mệnh (HP)</label>
                                                <input type="number" v-model.number="forgeState.editingData.extra_cost.hp" class="magic-input-base">
                                            </div>
                                        </div>
                                        
                                        <div v-if="forgeState.editingType === 'effect'">
                                            <label class="block text-xs text-blue-400 mb-1">Mô tả tiêu hao điểm hành động</label>
                                            <input v-model="forgeState.editingData.action_cost.raw" placeholder="Ví dụ: Hành động, Tấn công..." class="magic-input-base">
                                        </div>
                                    </div>

                                    <div v-if="forgeState.editingType === 'effect'" class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner space-y-3">
                                        <h4 class="text-sm font-bold text-blue-200 border-b border-blue-900/50 pb-1">Thiết lập chi tiết</h4>
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs text-pink-400 mb-1">Uy lực nguyên thủy (Damage)</label>
                                                <input v-model="forgeState.editingData.damage" placeholder="Để trống hoặc điền số..." class="magic-input-base">
                                            </div>
                                            <div>
                                                <label class="block text-xs text-orange-400 mb-1">Thời gian duy trì (Duration)</label>
                                                <input v-model="forgeState.editingData.duration.raw" placeholder="Ví dụ: Ngay lập tức, 1 hiệp/cấp" class="magic-input-base">
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs text-blue-400 mb-1">Giới hạn mục tiêu đã lỗi thời (Ngăn cách bằng dấu phẩy)</label>
                                                <input v-model="tagsStringTarget" placeholder="Ví dụ: Tự do, Đơn thể" class="magic-input-base">
                                            </div>
                                            <div class="flex space-x-2">
                                                <div class="w-1/2">
                                                    <label class="block text-xs text-blue-400 mb-1">Thuộc tính miễn nhiễm</label>
                                                    <input v-model="forgeState.editingData.save_type.type" placeholder="Ví dụ: Ý chí" class="magic-input-base">
                                                </div>
                                                <div class="w-1/2">
                                                    <label class="block text-xs text-blue-400 mb-1">Kết quả miễn nhiễm</label>
                                                    <input v-model="forgeState.editingData.save_type.on_save" placeholder="Ví dụ: Giảm nửa" class="magic-input-base">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="forgeState.editingType === 'meta'" class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner space-y-3">
                                        <label class="block text-xs text-blue-400 mb-1">Mục tiêu điều chỉnh (Ngăn cách bằng dấu phẩy)</label>
                                        <input v-model="tagsStringModTarget" placeholder="Ví dụ: Phép thuật, Hiệu ứng" class="magic-input-base">
                                    </div>

                                    <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner space-y-3">
                                        <label class="text-sm font-bold text-blue-200 border-b border-blue-900/50 pb-1">Mô tả tổng thể</label>
                                        <textarea rows="2" v-model="forgeState.editingData.overall_desc" placeholder="Mô tả về chú tự" class="magic-input-base"></textarea>
                                    </div>

                                    <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner space-y-3">
                                        <label class="block text-xs text-blue-400 mb-1">Nhãn (Tags - Ngăn cách bằng dấu phẩy)</label>
                                        <input v-model="tagsStringGeneral" placeholder="Ví dụ: Học phái tố năng, Buff..." class="magic-input-base">

                                        <div class="mt-5 border-t border-indigo-800/50 pt-3">
                                            <div v-if="forgeState.editingType === 'effect'" class="flex justify-between items-center mb-2">
                                                <label class="block text-sm font-bold text-indigo-300 flex items-center">
                                                    <span class="mr-1">⚡</span> Cài đặt siêu ma tăng cường (Boosts)
                                                </label>
                                                <button @click="addBoostRow" class="text-xs bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 px-2 py-1 rounded border border-indigo-700/50 transition">
                                                    + Thêm cấp bậc
                                                </button>
                                            </div>
                                            
                                            <div v-for="(item, idx) in forgeUI.boostRows" :key="idx" class="flex flex-col space-y-1.5 mb-3 p-2.5 bg-indigo-950/40 border border-indigo-800/50 rounded-lg group relative">
                                                <button @click="removeBoostRow(idx)" class="absolute top-1 right-2 text-red-500/50 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition text-lg leading-none" title="Xóa cấp bậc này">&times;</button>
                                                <div class="flex space-x-2 pr-6">
                                                    <div class="w-1/3">
                                                        <input 
                                                            :value="item.level" 
                                                            @input="item.level = $event.target.value.replace(/[^\dCực Hạn]/g, '')"
                                                            placeholder="Chỉ số hoặc 'Cực Hạn'" 
                                                            class="magic-input-base w-full font-bold text-indigo-200 h-[30px] text-xs"
                                                        >
                                                    </div>
                                                    <div class="w-2/3">
                                                        <input type="number" v-model.number="item.costMp" placeholder="Rút MP cố định (Tùy chọn, để trống sẽ thu phóng động)" class="magic-input-base w-full text-purple-300 h-[30px] text-xs">
                                                    </div>
                                                </div>
                                                <textarea v-model="item.desc" placeholder="Mô tả chi tiết hiệu ứng tăng cường..." rows="1" class="magic-input-base w-full resize-y min-h-[34px] text-xs custom-scrollbar leading-relaxed"></textarea>
                                            </div>
                                            <div v-if="forgeState.editingType === 'effect' && forgeUI.boostRows.length === 0" class="text-xs text-indigo-500/50 italic py-1 text-center">
                                                Tạm thời chưa có cài đặt cấp bậc siêu ma tăng cường nào...
                                            </div>
                                        </div>
                                        
                                        <div class="mt-4 border-t border-blue-800/50 pt-3">
                                            <div class="flex justify-between items-center mb-2">
                                                <label class="block text-sm font-bold text-indigo-300">Ánh xạ hiệu ứng (Key-Value)</label>
                                                <button @click="addEffectDescRow" class="text-xs bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 px-2 py-1 rounded border border-indigo-700/50 transition">+ Thêm mục mới</button>
                                            </div>
                                            
                                            <div v-for="(item, idx) in forgeUI.kvRows" :key="idx" class="flex space-x-2 mb-2 items-start group">
                                                <input v-model="item.k" placeholder="Tên khóa (Ví dụ: Bạo liệt)" class="magic-input-base w-1/4 font-bold text-indigo-200 h-[38px]">
                                                <textarea v-model="item.v" placeholder="Nội dung mô tả chi tiết..." rows="2" class="magic-input-base flex-1 resize-y min-h-[38px] custom-scrollbar leading-relaxed"></textarea>
                                                <button @click="removeEffectDescRow(idx)" class="text-red-500/50 hover:text-red-400 p-1.5 opacity-0 group-hover:opacity-100 transition text-lg leading-none mt-1">&times;</button>
                                            </div>
                                            <div v-if="forgeUI.kvRows.length === 0" class="text-xs text-blue-500/50 italic py-2 text-center">
                                                Tạm thời chưa có mô tả hiệu ứng...
                                            </div>
                                        </div>
                                    </div>

                                    <div class="pt-4 flex justify-end space-x-3">
                                        <button @click="forgeState.editingData = null" class="px-5 py-2 rounded-lg font-bold border border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300 transition">Hủy soạn thảo</button>
                                        <button @click="saveForgedWord" class="px-6 py-2 rounded-lg font-bold border border-blue-400 bg-blue-700 hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] transition flex items-center">
                                            <span class="mr-2">💾</span> Khắc ấn nhập kho
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-show="ui.activeTab === 'lore_book'" class="pb-10 space-y-4 animate-fadeIn">
                                <div class="flex justify-between items-center mb-2 border-b border-blue-800/50 pb-2">
                                    <h3 class="text-xl font-bold text-blue-100 flex items-center">
                                        <span class="mr-2">🌌</span> Chú tự // Quyển hai: Quy tắc chú tự tổ hợp
                                    </h3>
                                </div>

                                <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner">
                                    <h4 class="font-bold text-purple-300 mb-2 border-b border-purple-900/50 pb-1 flex items-center">
                                        <span class="mr-2">🔥</span> Cộng dồn hiệu ứng và Nâng cấp phẩm chất
                                    </h4>
                                    <p class="text-sm text-gray-200 leading-relaxed mb-3">Phẩm chất của chú tự tổ hợp do chú tự hiệu ứng quyết định duy nhất. Việc cộng dồn các chú tự hiệu ứng sẽ nâng cao phẩm chất tổng thể của phép thuật tổ hợp. Quy tắc cơ bản là <strong class="text-amber-400">cứ hai tiến một</strong>:</p>
                                    <div class="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                                        <div class="bg-[#0f172a] p-2 rounded border border-blue-900/50"><span class="text-gray-400">Common(1)</span> ×2 ➔ <span class="text-emerald-400">Uncommon(2)</span></div>
                                        <div class="bg-[#0f172a] p-2 rounded border border-blue-900/50"><span class="text-emerald-400">Uncommon(2)</span> ×2 ➔ <span class="text-blue-400">Rare(4)</span></div>
                                        <div class="bg-[#0f172a] p-2 rounded border border-blue-900/50"><span class="text-blue-400">Rare(4)</span> ×2 ➔ <span class="text-purple-400">Epic(8)</span></div>
                                        <div class="bg-[#0f172a] p-2 rounded border border-blue-900/50"><span class="text-purple-400">Epic(8)</span> ×2 ➔ <span class="text-yellow-400">Legendary(16)</span></div>
                                    </div>
                                    <p class="text-xs text-blue-200/80 bg-blue-900/30 p-2 rounded">
                                        * <strong class="text-red-400">Ngưỡng thần thoại (=32)</strong> là giới hạn cộng dồn thông thường (tối đa 2 Legendary/4 Epic).<br>
                                        * Chú tự hiệu ứng có phẩm chất <strong class="text-amber-500">Unique</strong>, mỗi chú tự tổ hợp chỉ có thể thêm một cái, việc thêm vào sẽ khiến phẩm chất chú tự tổ hợp bị bắt buộc ghi đè thành Unique.
                                    </p>
                                </div>

                                <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner">
                                    <h4 class="font-bold text-blue-300 mb-2 border-b border-blue-900/50 pb-1 flex items-center">
                                        <span class="mr-2">💧</span> Ngưỡng giới hạn trên tiêu hao Ma lực (MP)
                                    </h4>
                                    <div class="overflow-x-auto">
                                        <table class="w-full text-xs text-left">
                                            <thead>
                                                <tr class="text-blue-400/80 border-b border-blue-800/50">
                                                    <th class="py-1.5 font-normal">Phẩm chất phép thuật</th>
                                                    <th class="py-1.5 font-normal text-purple-300">Giới hạn chú tự hiệu ứng</th>
                                                    <th class="py-1.5 font-normal text-emerald-300">Giới hạn thêm siêu ma</th>
                                                    <th class="py-1.5 font-normal text-orange-300">Hệ số tiêu hao siêu ma</th>
                                                </tr>
                                            </thead>
                                            <tbody class="text-gray-200 font-mono">
                                                <tr class="border-b border-blue-900/30"><td class="py-1 text-gray-400">Common</td><td>200 MP</td><td>400 MP</td><td>0.25</td></tr>
                                                <tr class="border-b border-blue-900/30"><td class="py-1 text-emerald-400">Uncommon</td><td>700 MP</td><td>1,000 MP</td><td>0.5</td></tr>
                                                <tr class="border-b border-blue-900/30"><td class="py-1 text-blue-400">Rare</td><td>1,500 MP</td><td>2,000 MP</td><td>0.75</td></tr>
                                                <tr class="border-b border-blue-900/30"><td class="py-1 text-purple-400">Epic</td><td>6,000 MP</td><td>8,000 MP</td><td>1.0</td></tr>
                                                <tr class="border-b border-blue-900/30"><td class="py-1 text-yellow-400 drop-shadow">Legendary</td><td>15,000 MP</td><td>20,000 MP</td><td>1.5</td></tr>
                                                <tr class="border-b border-blue-900/30"><td class="py-1 text-red-400 drop-shadow">Mythic</td><td>30,000 MP</td><td>50,000 MP</td><td>2.0</td></tr>
                                                <tr><td class="py-1 text-amber-500 drop-shadow font-bold">Unique</td><td>30,000 MP</td><td>60,000 MP</td><td>2.0</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p class="text-xs text-gray-200 mt-2 leading-relaxed">
                                        <strong class="text-orange-300">Giải thích: </strong>Trong trường hợp phẩm chất phép thuật tổ hợp đã được xác định: Tiêu hao tổ hợp của chú tự hiệu ứng có giới hạn trên, khi vượt quá giới hạn sẽ bị khóa ở mức giới hạn đó. Giới hạn siêu ma có nghĩa là tổng giá trị tiêu hao của chú tự tổ hợp không được vượt quá giới hạn trên. Hệ số tiêu hao có nghĩa là tiêu hao thực tế của siêu ma = Tiêu hao cơ bản x Hệ số cố định
                                    </p>
                                    <p class="text-[11px] text-gray-400 mt-2 leading-relaxed">
                                        <strong class="text-red-300">Đột phá giới hạn: </strong>Siêu ma tăng cường cấp [Cực Hạn] không được tính vào tổng tiêu hao và không bị ảnh hưởng bởi thu phóng, nhưng cần phải trả thêm MP bằng 50% giới hạn trên. Một số siêu ma tăng cường của chú tự có quy định tiêu hao cố định, không bị ảnh hưởng bởi hệ số. Siêu ma [Vô hạn] có thể phớt lờ cấu trúc và ràng buộc tiêu hao, nhưng phần dư thừa sẽ chuyển hóa thành lượng phản phệ sinh mệnh (HP) tương đương.
                                    </p>
                                </div>

                                <div class="bg-[#1e293b]/60 p-4 rounded-xl border border-blue-700/40 shadow-inner space-y-2">
                                    <h4 class="font-bold text-orange-300 mb-2 border-b border-orange-900/50 pb-1 flex items-center">
                                        <span class="mr-2">🎲</span> Tính toán DC Phép thuật và Miễn nhiễm
                                    </h4>
                                    
                                    <div class="text-sm text-gray-200">
                                        <strong class="text-blue-300 block mb-1">Nguyên tắc phán định miễn nhiễm:</strong>
                                        Loại miễn nhiễm được quyết định bởi chú tự hiệu ứng có <strong class="text-orange-400">phẩm chất cao nhất và cần miễn nhiễm</strong> trong phép thuật. Mỗi phép thuật chú tự tổ hợp chỉ tiến hành kiểm định miễn nhiễm một lần, kết quả miễn nhiễm có tác dụng với tất cả các chú tự hiệu ứng cần miễn nhiễm, nhưng những hiệu ứng miễn nhiễm thành công (giảm nửa sát thương hoặc hoàn toàn miễn dịch) sẽ được tính riêng.
                                    </div>
                                    <div class="text-sm text-gray-200">
                                        <strong class="text-blue-300 block mb-1">Quy tắc thời gian duy trì:</strong>
                                        Mỗi chú tự hiệu ứng tính toán thời gian duy trì độc lập
                                    </div>

                                    <div class="bg-[#0f172a]/80 p-3 rounded border border-blue-800/50 text-sm mt-2">
                                        <div class="text-emerald-300 font-mono text-xs mb-2 pb-1 border-b border-blue-900/50">
                                            DC Cuối cùng = 10 + Buff phẩm chất + Hệ số điều chỉnh thuộc tính + Các giá trị cộng thêm khác
                                        </div>
                                        <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-300 font-mono">
                                            <span>Common: +2</span>
                                            <span>Uncommon: +3</span>
                                            <span>Rare: +5</span>
                                            <span>Epic: +6</span>
                                            <span>Legendary: +7</span>
                                            <span>Mythic: +9</span>
                                            <span class="text-amber-400">Unique: +10</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </transition>
            </div>
        </transition>

        <word-selector 
            v-if="builderUI.selectorOpen" 
            :list="currentSelectorList"
            :current-quality="spellStats.quality"
            :filters="wordSelectStats"
            @close="builderUI.selectorOpen = false"
            @select="selectWord"
            @show-details="showDetails">
        </word-selector>

        <word-detail 
            v-if="builderUI.detailOpen && builderUI.detailWord" 
            :word="builderUI.detailWord"
            @close="builderUI.detailOpen = false">
        </word-detail>

        <div v-if="isPresetModalOpen" class="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/30 flex items-center justify-center z-[80]" 
            @mousedown="presetMaskEvents.onMaskMousedown" 
            @mouseup="presetMaskEvents.onMaskMouseup"> <!-- bg-black/90 backdrop-blur-sm -->
            <div class="bg-[#0b1120] p-6 rounded-xl w-1/2 max-h-[80vh] flex flex-col shadow-[0_0_40px_rgba(30,58,138,0.4)] border border-blue-500/50 relative">
                <div class="flex justify-between items-center mb-4 border-b border-blue-800/50 pb-3">
                    <h2 class="text-xl font-bold text-blue-300 flex items-center"><span class="mr-2">💾</span> Preset chú tự đã lưu</h2>
                    <button @click="isPresetModalOpen = false" class="text-blue-500 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                    <div v-if="Object.keys(presets).length === 0" class="text-blue-700 text-center py-8 font-mono">
                        Chưa lưu lại...
                    </div>
                    
                    <div v-for="(spellData, name) in presets" :key="name" 
                        class="bg-[#111827] p-4 rounded-lg flex justify-between items-center border-l-4 border-blue-800 hover:border-blue-400 transition group shadow-md">
                        <div>
                            <h3 class="font-bold text-lg text-blue-100">{{ name }}</h3>
                            <div class="text-xs text-blue-400 mt-1">
                                Vật mang cấu trúc: {{ spellData.target_words.length }} Mục tiêu / 
                                {{ spellData.effect_words.length + spellData.unique_effect_words.length }} Hiệu ứng / 
                                {{ spellData.spell_meta_words.length }} Siêu ma
                            </div>
                        </div>
                        <div class="space-x-2 opacity-0 group-hover:opacity-100 transition">
                            <button @click="loadPreset(name)" class="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-1.5 rounded text-sm shadow">Tải</button>
                            <button @click="deletePreset(name)" class="bg-red-900 hover:bg-red-800 text-red-200 px-4 py-1.5 rounded text-sm shadow border border-red-700">Xóa bỏ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="forgeUI.skillSelectorOpen" class="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/30 flex items-center justify-center z-50">
            <div class="bg-[#0b1120] p-6 rounded-xl w-3/4 max-w-[60vw] max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(30,58,138,0.5)] border border-blue-500/50 relative">
                <div class="flex justify-between items-center mb-4 border-b border-blue-800/50 pb-3">
                    <h2 class="text-xl font-bold text-blue-200 flex items-center">
                        <span class="mr-2">🌌</span> Chọn kỹ năng chú tự để chuyển đổi
                    </h2>
                    <div class="flex items-center space-x-3">
                        <label class="flex items-center space-x-1 text-sm text-blue-300 cursor-pointer">
                            <input type="checkbox" v-model="forgeUI.showAllSkills" class="accent-blue-500">
                            <span>Hiển thị tất cả kỹ năng (Không lọc chú tự)</span>
                        </label>
                        <button @click="forgeUI.skillSelectorOpen = false" class="text-blue-500 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                </div>
                
                <div class="overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2 pb-2">
                    <div v-if="filteredRawSkills.length === 0" class="col-span-2 text-center py-10 text-blue-500/50 font-mono">
                        Chưa khai quật được bất kỳ kỹ năng nào có thể sử dụng...
                    </div>
                    
                    <div v-for="s in filteredRawSkills" :key="s.name" 
                         @click="selectRawSkillForForge(s.name, s.data)"
                         @contextmenu.prevent="alert(JSON.stringify(s.data, null, 2))"
                         class="bg-[#111827] hover:bg-[#1e293b] p-4 rounded-lg cursor-pointer transition-all flex flex-col border border-blue-900/30 hover:border-blue-400 shadow-md">
                        <div class="flex justify-between items-center mb-2">
                            <span :class="['font-bold text-lg', getQualityColor(s.data[K.SKILL_QUALITY])]">{{ s.name }}</span>
                            <span class="text-xs bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/50">
                                {{ s.data[K.SKILL_TYPE] || 'Loại chưa biết' }}
                            </span>
                        </div>
                        <div class="text-xs text-blue-200/70 line-clamp-2 leading-relaxed">
                            {{ s.data[K.DESC] || Object.values(s.data['Effect'] || {})[0] || 'Thiếu mô tả...' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="extractUI.selectorOpen" class="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]" @mousedown="extractUI.selectorOpen = false">
            <div @mousedown.stop class="bg-[#0b1120] p-6 rounded-xl w-3/4 max-w-[60vw] max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(49,46,129,0.5)] border border-indigo-500/50 relative">
                <div class="flex justify-between items-center mb-4 border-b border-indigo-800/50 pb-3">
                    <h2 class="text-xl font-bold text-indigo-200 flex items-center">
                        <span class="mr-2">🔍</span> Chọn vật mang trích xuất ({{ extractState.targetType === 'skill' ? 'Kỹ năng nhân vật' : 'Vật phẩm trong ba lô' }})
                    </h2>
                    <button @click="extractUI.selectorOpen = false" class="text-indigo-500 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                <div class="overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2 pb-2">
                    <div v-if="extractionList.length === 0" class="col-span-2 text-center py-10 text-indigo-500/50 font-mono">
                        Chưa phát hiện được vật mang nào khả dụng...
                    </div>
                    
                    <div v-for="s in extractionList" :key="s.name" 
                         @click="selectExtractionTarget(s.name, s.data)"
                         class="bg-[#111827] hover:bg-[#1e293b] p-4 rounded-lg cursor-pointer transition-all flex flex-col border border-indigo-900/30 hover:border-indigo-400 shadow-md">
                        <div class="flex justify-between items-center mb-2">
                            <span :class="['font-bold text-lg', getQualityColor(s.data['Phẩm chất'])]">{{ s.name }}</span>
                            <span class="text-[11px] bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/50">
                                {{ s.data['Loại hình'] || s.data['Thể loại'] || 'Chưa biết' }}
                            </span>
                        </div>
                        <div class="text-xs text-indigo-200/70 line-clamp-3 leading-relaxed mt-1">
                            {{ s.data['Mô tả'] || Object.values(s.data['Hiệu ứng'] || {})[0] || 'Thiếu mô tả...' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <transition name="fade">
            <div v-if="showEasterEggAnimation" class="fixed top-0 left-0 w-[100vw] h-[100vh] z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
                <div class="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black/70 backdrop-blur-md transition-opacity"></div>
                <div class="absolute top-0 left-0 w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_60%)] animate-pulse"></div>
                <div class="relative flex flex-col items-center justify-center transform animate-[bookOpen_1.5s_cubic-bezier(0.25,1,0.5,1)_forwards]">
                    <div class="text-7xl mb-6 drop-shadow-[0_0_30px_rgba(245,158,11,1)] animate-bounce">🌌</div>
                    <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] tracking-[0.2em] mb-3">
                        ✨ Thành tựu ẩn: Sự cộng hưởng của các vì sao!
                    </h1>
                    <p class="text-amber-200/80 text-lg tracking-widest font-mono">Điểm kỳ dị của lực hấp dẫn đã thâu tóm mọi vì sao. Những chú tự bí mật ẩn sâu trong pháp điển nay đã mở ra trước mắt bạn...</p>
                </div>
            </div>
        </transition>
    `,

        setup() {

            const toastUI = useMessageToast(Vue);

            const { ui, characterData, updateCharacterData, openMainModal, closeMainModal, maskEvents } = useSystemUI(Vue);
            // 1. 创建共享的数据库版本号
            const dbVersion = ref(0);

            // 1. 创建响应式的彩蛋状态
            const isEasterEggUnlocked = ref(false);
            const showEasterEggAnimation = ref(false);

            // 【修改】传入 ui，让内部感知开关状态
            const { bgCanvas, initCanvas } = useConstellationBackground(Vue, ui, isEasterEggUnlocked, win, doc);

            watch(() => ui.mainModalOpen, (isOpen) => {
                if (isOpen) {
                    // 【修复3】每次打开时做一次越界检查（应对手机横竖屏切换或浏览器窗口缩放）
                    const screenW = win.innerWidth;
                    const screenH = win.innerHeight;

                    if (bookSize.w > screenW * 0.95) bookSize.w = screenW * 0.95;
                    if (bookSize.h > screenH * 0.92) bookSize.h = screenH * 0.92;

                    // 如果坐标飞出屏幕（小于0，或者右边缘超出屏幕），强制重新居中
                    if (bookPos.x < 0 || bookPos.x + bookSize.w > screenW) {
                        bookPos.x = Math.max(0, (screenW - bookSize.w) / 2);
                    }
                    if (bookPos.y < 0 || bookPos.y + bookSize.h > screenH) {
                        bookPos.y = Math.max(0, (screenH - bookSize.h) / 2);
                    }
                    Vue.nextTick(() => initCanvas());
                }
            }, { immediate: true });

            // 3. 保留给法典主窗口使用的拖拽与无极缩放 (不存档)
            const { fab, startDrag } = useFloatingBall(Vue, openMainModal, win, doc);
            // 【修复1】动态计算初始大小，适配手机小屏幕
            const initW = Math.min(1200, win.innerWidth * 0.95);
            const initH = Math.min(800, win.innerHeight * 0.92);

            // 动态居中，防止坐标出现负数导致飞出屏幕左上角
            const defaultBookPos = {
                x: Math.max(0, (win.innerWidth - initW) / 2),
                y: Math.max(0, (win.innerHeight - initH) / 2)
            };
            const { pos: bookPos, startDrag: startBookDrag } = useDraggable(Vue, null, null, defaultBookPos, win, doc);

            // 【修复2】动态设置最小尺寸，防止手机端被强制锁在 800x600 导致撑爆
            const minW = Math.min(800, win.innerWidth * 0.9);
            const minH = Math.min(600, win.innerHeight * 0.8);
            const { size: bookSize, startResize: startBookResize } = useResizable(Vue, { w: initW, h: initH }, { w: minW, h: minH }, win, doc);

            const bookScale = computed(() => Math.min(bookSize.w / 1200, bookSize.h / 800));


            // 2. 将 dbVersion 传递给咒字构建器和熔炉
            const builderSetup = useSpellBuilder(window.Vue, characterData, dbVersion, closeMainModal, isEasterEggUnlocked, toastUI);
            const forgeSetup = useWordForge(window.Vue, characterData, ui, dbVersion, toastUI);
            const presetManager = usePresetManager(window.Vue, builderSetup.composingSpell, toastUI);


            const handleKeys = (e) => {
                const key = e.key.toLowerCase();

                if (key === 'escape') {
                    // 🌟 核心修改 1：获取 Shadow DOM 的根节点
                    const rootDiv = doc.getElementById('words-of-power-rc-vue-root');
                    if (!rootDiv || !rootDiv.shadowRoot) return;
                    const shadowRoot = rootDiv.shadowRoot;

                    // 1. 抓取主法典的专属关闭按钮
                    const closeBtns = Array.from(shadowRoot.querySelectorAll('.bookmark-close'));

                    // 2. 抓取其他常规关闭/取消按钮 (X 或者 包含"取消")
                    const cancelBtns = Array.from(shadowRoot.querySelectorAll('button')).filter(btn => {
                        const text = btn.innerText ? btn.innerText.trim() : '';
                        // HTML 里的 &times; 会被浏览器解析为字符 '×'
                        return text === '×' || text.includes('取消') || text === '合上法典';
                    });

                    // 3. 去重并过滤掉 display:none 的隐藏元素
                    const validBtns = [...new Set([...closeBtns, ...cancelBtns])].filter(btn => {
                        return btn.offsetWidth > 0 || btn.offsetHeight > 0;
                    });

                    if (validBtns.length === 0) return;

                    // 3. 计算真实的 Z-index 累加值
                    const getEffectiveZIndex = (el) => {
                        let totalZ = 0;
                        let curr = el;

                        // 往上遍历直到影子边界
                        while (curr && curr !== shadowRoot && curr !== shadowRoot.host) {
                            // 🌟 修复点 1：移除 window.parent，直接在当前环境获取样式
                            const style = window.getComputedStyle(curr);
                            if (style.zIndex && style.zIndex !== 'auto') {
                                totalZ += parseInt(style.zIndex, 10);
                            }
                            curr = curr.parentElement;
                        }
                        return totalZ;
                    };

                    // 5. 排序逻辑：总 Z-index 优先 -> 嵌套深度其次 -> DOM 顺序最后
                    const mappedBtns = validBtns.map((btn, index) => {
                        let z = getEffectiveZIndex(btn);

                        // 🌟 Điểm sửa đổi 2: Bảng điều khiển chính luôn nằm ở dưới cùng!
                        // Tạo một trọng số âm cực lớn cho nút đóng của bảng điều khiển chính, chỉ cần trên màn hình có bất kỳ cửa sổ bật lên nào khác, bảng điều khiển chính tuyệt đối sẽ không được chọn
                        if (btn.classList.contains('bookmark-close') || btn.innerText.includes('Đóng pháp điển')) {
                            z -= 1000;
                        }
                        return { btn, z, index };
                    });

                    mappedBtns.sort((a, b) => {
                        if (a.z !== b.z) return a.z - b.z;
                        return a.index - b.index;
                    });

                    // 6. 模拟点击最顶层的关闭按钮
                    const topBtnInfo = mappedBtns.pop();
                    topBtnInfo.btn.click();

                    // 7. 拦截事件，防止触发酒馆等宿主环境的原生 Esc 功能
                    e.preventDefault();
                    e.stopPropagation();

                    e.stopImmediatePropagation();
                    return;
                }
            };


            const onMessageReceived = () => {
                setTimeout(updateCharacterData, 500);
                console.log("Cập nhật biến");
            };

            // 2. 在挂载时读取本地存储
            onMounted(async () => {
                //isEasterEggUnlocked.value = localStorage.getItem('magic_book_easter_egg') === "true";

                // 可选：如果你有一个在页面内触发彩蛋的机制，
                // 可以在触发时执行：isEasterEggUnlocked.value = true; 
                // 并在那时调用 localStorage.setItem('magic_book_easter_egg', 'true');

                // 监听来自 useConstellationBackground 的引爆事件

                await waitGlobalInitialized('Mvu');
                eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, onMessageReceived);
                win.addEventListener('keydown', handleKeys);

                await ChartManager.init();
                let unlockEasterEgg = ConfigManager.getConfig("Protagonist", true).magic_book_easter_egg;
                if (unlockEasterEgg === undefined) {
                    unlockEasterEgg = false;
                    ConfigManager.updateProperty("Protagonist", "magic_book_easter_egg", false, true);
                }
                isEasterEggUnlocked.value = unlockEasterEgg;

                window.addEventListener('constellation-easter-egg', () => {
                    // 触发震撼的解禁动画
                    showEasterEggAnimation.value = true;
                    setTimeout(() => {
                        showEasterEggAnimation.value = false;
                    }, 3500); // 3.5秒后自动隐去

                });
            });
            onUnmounted(() => {
                win.removeEventListener('keydown', handleKeys);
            });



            return {
                toastUI,
                fab, startDrag,
                bookPos, startBookDrag, bookSize, startBookResize, //面板位置
                ui, characterData, updateCharacterData, closeMainModal, maskEvents, bookScale,
                ...builderSetup,
                ...presetManager,
                getQualityColor,
                ...forgeSetup,
                bgCanvas,
                K, R, DB_PATH,
                showEasterEggAnimation

            };
        }


    });

    // ====== 【关键修复：将实例暴露给全局】 ======
    // 将当前刚创建的 app 实例挂载到父窗口的 window 上，供下次重载脚本时寻找并销毁
    win.__DESTINED_WORDS_RC_VUE_APP__ = app;
    // 挂载到我们创建的实体 DOM 上
    app.mount(appContainer);
}

function renderVueStyles(shadowRoot) {
    if (shadowRoot.getElementById('words-of-power-rc-styles')) return;
    const css = ``;
    const style = doc.createElement('style');
    style.id = 'words-of-power-rc-styles';
    style.textContent = css;

    // 🌟 核心修改：添加到 shadowRoot
    shadowRoot.appendChild(style);
}

$(async function () {
    bootstrapVueWidget();
});

//# sourceURL=my_debug_WOEDS_POWER.js