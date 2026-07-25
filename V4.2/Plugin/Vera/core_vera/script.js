
const win = window.parent ? window.parent : window;
const doc = win.document;
const path_prefix = "/core_vera/";
const IS_LOCAL = true;
const TAROT_MAX_REMAIN_FLOOR = 10;


class CreateUserMessageInputer {
    constructor() {
        // 模拟用户输入，但不点击发送
        const parentWin = typeof window.parent !== 'undefined' ? window.parent : window;

        this.jQuery_API = typeof $ !== 'undefined' ? $ : parentWin.jQuery;
    }
    sendMessage(content, send = false) {
        if (typeof content !== 'string') {
            alert("Nội dung tin nhắn phải là chuỗi ký tự");
            return false;
        }
        // 1. 获取当前输入框里已经存在的内容（如果没有内容，会返回空字符串）
        let currentContent = this.jQuery_API('#send_textarea').val() || "";
        let separator = currentContent ? "\n" : ""; // 如果原本有内容，就加个换行；如果原本是空的，就不加
        let newContent = currentContent + separator + content;
        this.jQuery_API('#send_textarea').focus();
        this.jQuery_API('#send_textarea').val(newContent);
        this.jQuery_API('#send_textarea').trigger('input').trigger('change');
        if (send) this.jQuery_API('#send_button').click();
        return true;
    }
}

const messageInputer = new CreateUserMessageInputer();


const CHILD_SLOT_ID = "rc-float-ball-manager-child-slot";
const LOCAL_VUE_PATH = './core_vera/src/vue.global.js';
const ROOT_DIV_ID = "destined-core-vera-rc-vue-root";
const APP_CONTAINER_ID = "app-container";
const STYLE_ID = "destined-core-vera-rc-style";
const VUE_SCRIPT_ID = "destined-core-vera-rc-vue-script";
const WIN_APP_ID = "__DESTINED_CORE_VERA_RC_VUE_APP__";
const WIN_UNLOAD_HANDLER = "__DES_CORE_VERA_UNLOAD_HANDLER_RC__"



function bootstrapVueWidget() {
    console.log("🚀 Chuẩn bị tải Vue 3");
    // 清理旧 DOM 和实例
    destroyCharWidget();

    // 🌟 1. 创建隔离的宿主容器与 Shadow DOM
    const rootDiv = doc.createElement('div');
    rootDiv.id = ROOT_DIV_ID;

    let managerSlot = doc.getElementById(CHILD_SLOT_ID);
    if (!managerSlot) {
        managerSlot = doc.createElement('div');
        managerSlot.id = CHILD_SLOT_ID;
        // 💡 作为一个“幽灵文件夹”，0宽高，绝对不会阻挡原网页点击，也不影响子元素的 fixed 定位
        managerSlot.style.cssText = 'position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: visible; z-index: 7999;';
        doc.body.appendChild(managerSlot);
    }
    managerSlot.appendChild(rootDiv);


    // 开启影子 DOM 黑盒，mode: 'open' 允许我们通过 JS 访问内部
    const shadowRoot = rootDiv.attachShadow({ mode: 'open' });

    // 在影子 DOM 内创建一个专门供 Vue 挂载的实际容器
    const appContainer = doc.createElement('div');
    appContainer.id = APP_CONTAINER_ID;

    shadowRoot.appendChild(appContainer);

    let resourcesLoaded = 0;
    const checkInit = () => {
        resourcesLoaded++;
        // 只有当 Vue 和 Tailwind 两个都加载完了，才初始化
        if (resourcesLoaded === 1) {
            // 🌟 核心修改：把内部容器和影子根节点传给初始化函数
            initVueApp(appContainer, shadowRoot);
        }
    };

    // 【核心修复】：为 script 标签打上专属 ID，防止重复注入
    let vueScript = document.getElementById(VUE_SCRIPT_ID);
    // 1. 加载 Vue 脚本 (逻辑保持不变)
    if (!vueScript) {
        vueScript = document.createElement('script');
        vueScript.id = VUE_SCRIPT_ID;
        vueScript.src = LOCAL_VUE_PATH;
        vueScript.onload = checkInit;
        vueScript.onerror = () => {
            console.warn('Tải Vue cục bộ thất bại, chuyển về CDN');
            vueScript.remove();
            const fallbackScript = document.createElement('script');
            fallbackScript.id = VUE_SCRIPT_ID;
            fallbackScript.src = 'https://unpkg.com/vue@3/dist/vue.global.js';
            fallbackScript.onload = checkInit;
            document.head.appendChild(fallbackScript);
        };
        document.head.appendChild(vueScript);
    } else {
        checkInit();
    }

}

function destroyCharWidget() {
    const root = doc.getElementById(ROOT_DIV_ID);
    if (root) root.remove();
    const style = doc.getElementById(STYLE_ID);
    if (style) style.remove();
    if (win[WIN_APP_ID]) {
        win[WIN_APP_ID].unmount();
        delete win[WIN_APP_ID];
    }
}

if (win[WIN_UNLOAD_HANDLER]) {
    window.removeEventListener('pagehide', win[WIN_UNLOAD_HANDLER]);
}
win[WIN_UNLOAD_HANDLER] = destroyCharWidget;
window.addEventListener('pagehide', win[WIN_UNLOAD_HANDLER]);


// ==========================================
// 新增: 塔罗牌配置与资源提供类
// ==========================================
// 定义系统支持的风格（前缀）
const stylesConfig = [
    { id: 'default', name: 'Phong Cách Kinh Điển', tag: '' },
    { id: 'alt', name: 'Phong Cách Dị Họa', tag: '-' } // 你可以将 'alt-' 替换为你实际使用的前缀，如 'special-' 或 '-' 
];
const tarotConfig = [
    {
        "number": "00",
        "name": "愚者",
        "displayName": "Kẻ Khờ",
        "variations": {
            "default": 1,
            "alt": 2
        },
        "meanings": {
            "upright": "Khởi đầu mới, ngây thơ, tự phát, phiêu lưu",
            "reversed": "Liều lĩnh, quá mạo hiểm, lỡ cơ hội"
        }
    },
    {
        "number": "01",
        "name": "魔术师",
        "displayName": "Pháp Sư",
        "variations": {
            "default": 2,
            "alt": 2
        },
        "meanings": {
            "upright": "Đầy đủ nguồn lực, hành động mạnh mẽ, biến ý tưởng thành hiện thực",
            "reversed": "Phù phiếm, lạm dụng khả năng, kế hoạch đình trệ"
        }
    },
    {
        "number": "02",
        "name": "女祭司",
        "displayName": "Nữ Tu",
        "variations": {
            "default": 3,
            "alt": 3
        },
        "meanings": {
            "upright": "Khám phá nội tâm, sự thật ẩn giấu, tĩnh lặng quan sát",
            "reversed": "Phớt lờ trực giác, cảm xúc bất ổn, nhận thức nông cạn"
        }
    },
    {
        "number": "03",
        "name": "女皇",
        "displayName": "Nữ Hoàng",
        "variations": {
            "default": 1,
            "alt": 1
        },
        "meanings": {
            "upright": "Thu hoạch vật chất, sự chăm sóc mẫu tử, tận hưởng cảm giác",
            "reversed": "Lãng phí xa xỉ, can thiệp quá mức (nuông chiều), khó tạo ra kết quả"
        }
    },
    {
        "number": "04",
        "name": "皇帝",
        "displayName": "Hoàng Đế",
        "variations": {
            "default": 2,
            "alt": 2
        },
        "meanings": {
            "upright": "Xây dựng cấu trúc, kiểm soát cục diện, uy quyền và kỷ luật",
            "reversed": "Bạo chúa và độc tài, quy tắc sụp đổ, thiếu tự luật"
        }
    },
    {
        "number": "05",
        "name": "教皇",
        "displayName": "Giáo Hoàng",
        "variations": {
            "default": 2,
            "alt": 1
        },
        "meanings": {
            "upright": "Tuân theo quy chuẩn, giáo dục chính thống, tìm kiếm chỉ dẫn tinh thần",
            "reversed": "Phá vỡ quy tắc, mù quáng tuân theo giáo điều, uy quyền bị thách thức"
        }
    },
    {
        "number": "06",
        "name": "恋人",
        "displayName": "Tình Nhân",
        "variations": {
            "default": 1,
            "alt": 2
        },
        "meanings": {
            "upright": "Kết nối sâu sắc, mối quan hệ hài hòa, quyết định quan trọng",
            "reversed": "Mối quan hệ rạn nứt, xung đột giá trị, lựa chọn sai lầm",
            "energy": "Kết hợp, lựa chọn, đồng điệu"
        }
    },
    {
        "number": "07",
        "name": "战车",
        "displayName": "Chiến Xa",
        "variations": {
            "default": 2
        },
        "meanings": {
            "upright": "Vượt qua khó khăn, tiến bước mạnh mẽ, cân bằng các lực lượng đối lập",
            "reversed": "Mất phương hướng, mất kiểm soát nội bộ, gặp trở ngại đình trệ",
            "energy": "Ý chí, điều khiển, thúc đẩy"
        }
    },
    {
        "number": "08",
        "name": "力量",
        "displayName": "Sức Mạnh",
        "variations": {
            "default": 1,
            "alt": 1
        },
        "meanings": {
            "upright": "Lấy nhu khắc cương, thuần phục dã thú nội tâm, sức chịu đựng bền bỉ",
            "reversed": "Thiếu tự tự, bị bản năng điều khiển, yếu đuối bất lực",
            "energy": "Mềm dẻo, dũng khí nội tâm"
        }
    },
    {
        "number": "09",
        "name": "隐士",
        "displayName": "Ẩn Sĩ",
        "variations": {
            "default": 1,
            "alt": 2
        },
        "meanings": {
            "upright": "Cắt đứt nhiễu loạn bên ngoài, suy nghĩ sâu sắc, tìm kiếm chân lý",
            "reversed": "Bất mãn với đời, cô lập quá mức, từ chối thực tại",
            "energy": "Nội tỉnh, cô đơn, chỉ dẫn"
        }
    },
    {
        "number": "10",
        "name": "命运之轮",
        "displayName": "Bánh Xe Số Phận",
        "variations": {
            "default": 1,
            "alt": 2
        },
        "meanings": {
            "upright": "Thuận theo tự nhiên, may mắn đến, thay đổi không thể kháng cự",
            "reversed": "Vận may kém, chu kỳ đình trệ, kháng cự lại an bài của số phận",
            "energy": "Chu kỳ, bước ngoặt, cơ hội"
        }
    },
    {
        "number": "11",
        "name": "正义",
        "displayName": "Công Lý",
        "variations": {
            "default": 2,
            "alt": 1
        },
        "meanings": {
            "upright": "Phán đoán lý trí, chịu trách nhiệm, khế ước công bằng",
            "reversed": "Thành kiến và bất công, trốn tránh trách nhiệm, tranh chấp pháp lý",
            "energy": "Cân bằng, nhân quả, phán quyết"
        }
    },
    {
        "number": "12",
        "name": "倒吊人",
        "displayName": "Người Treo Ngược",
        "variations": {
            "default": 2,
            "alt": 1
        },
        "meanings": {
            "upright": "Tự nguyện dừng lại, chuyển đổi góc nhìn, lấy lùi làm tiến",
            "reversed": "Hy sinh vô ích, bế tắc, kháng cự sự thay đổi",
            "energy": "Hy sinh, hoán vị suy nghĩ, tạm dừng"
        }
    },
    {
        "number": "13",
        "name": "死神",
        "displayName": "Tử Thần",
        "variations": {
            "default": 1,
            "alt": 2
        },
        "meanings": {
            "upright": "Kết thúc triệt để cái cũ, buông bỏ, hướng về sự sống từ cõi chết",
            "reversed": "Sợ thay đổi, chìm đắm trong quá khứ, từ chối buông tay",
            "energy": "Chấm dứt, lột xác, tất yếu"
        }
    },
    {
        "number": "14",
        "name": "节制",
        "displayName": "Tiết Chế",
        "variations": {
            "default": 1,
            "alt": 1
        },
        "meanings": {
            "upright": "Dung hợp năng lượng, tâm trạng bình hòa, vừa đúng mức",
            "reversed": "Mất cân bằng, chủ nghĩa cực đoan, tiêu hao quá độ",
            "energy": "Điều hòa, thanh lọc, trung dung"
        }
    },
    {
        "number": "15",
        "name": "魔鬼",
        "displayName": "Ác Quỷ",
        "variations": {
            "default": 2,
            "alt": 3
        },
        "meanings": {
            "upright": "Bị dục vọng điều khiển, nghiện ngập, đắm chìm trong vật chất và bản năng",
            "reversed": "Thoát khỏi gông cùm, nhìn thấu hư ảo vật chất, thoát khỏi mối quan hệ độc hại",
            "energy": "Dục vọng, trói buộc, vật chất"
        }
    },
    {
        "number": "16",
        "name": "高塔",
        "displayName": "Tòa Tháp",
        "variations": {
            "default": 2,
            "alt": 1
        },
        "meanings": {
            "upright": "Sụp đổ đột ngột, niềm tin tan vỡ, bắt buộc phá vỡ vùng an toàn",
            "reversed": "Sợ thảm họa không thể tránh, khó khăn tái thiết, cố gượng ép",
            "energy": "Đột biến, sụp đổ, bắt buộc thiết lập lại"
        }
    },
    {
        "number": "17",
        "name": "星星",
        "displayName": "Ngôi Sao",
        "variations": {
            "default": 2,
            "alt": 2
        },
        "meanings": {
            "upright": "Bình yên sau thảm họa, cảm hứng dạt dào, tràn đầy hy vọng",
            "reversed": "Tuyệt vọng, mất niềm tin, cạn kiệt cảm hứng",
            "energy": "Hy vọng, chữa lành, yên tĩnh"
        }
    },
    {
        "number": "18",
        "name": "月亮",
        "displayName": "Mặt Trăng",
        "variations": {
            "default": 2,
            "alt": 1
        },
        "meanings": {
            "upright": "Khủng hoảng tiềm ẩn, cảm xúc bất an, mọi thứ mờ mịt",
            "reversed": "Sương mù tan đi, nhìn rõ sự thật, khắc phục nỗi sợ hãi trong tiềm thức",
            "energy": "Ảo giác, tiềm thức, bất an"
        }
    },
    {
        "number": "19",
        "name": "太阳",
        "displayName": "Mặt Trời",
        "variations": {
            "default": 2,
            "alt": 2
        },
        "meanings": {
            "upright": "Thành công tuyệt đối, tràn đầy sức sống, sự thật được phơi bày",
            "reversed": "Thành công bị trì hoãn, tiêu hao tinh lực, lạc quan mù quáng",
            "energy": "Sức sống, thành công, rõ ràng"
        }
    },
    {
        "number": "20",
        "name": "审判",
        "displayName": "Phán Xét",
        "variations": {
            "default": 2,
            "alt": 2
        },
        "meanings": {
            "upright": "Lắng nghe tiếng gọi nội tâm, nghiệp cũ được thanh toán, nhận được cứu rỗi",
            "reversed": "Từ chối tự tỉnh, phớt lờ tiếng nói nội tâm, rơi vào mặc cảm tội lỗi",
            "energy": "Thức tỉnh, vẫy gọi, phục hồi"
        }
    },
    {
        "number": "21",
        "name": "世界",
        "displayName": "Thế Giới",
        "variations": {
            "default": 1,
            "alt": 2
        },
        "meanings": {
            "upright": "Kết cục hoàn mỹ, đạt được mục tiêu, bước vào giai đoạn mới",
            "reversed": "Vòng tuần hoàn chưa hoàn tất, thiếu sự khép kín, thất bại trong gang tấc",
            "energy": "Viên mãn, hợp nhất, đạt được"
        }
    },
    {
        "number": "22",
        "name": "核心",
        "displayName": "Cốt Lõi",
        "variations": {
            "default": 11
        }
    }
];



// 占卜面板背景图配置 (请替换为实际路径)
const DIVINATION_BG_URL = `${path_prefix}asset/image/divination-bg.jpg`;
const DIVINATION_BG_CONFIG = {
    "Ngân Nguyệt": ['asset/image/divination-bg.jpg', 'asset/image/divination-bg-silver-1.jpg'],
    "Hoàng Nguyệt": ['asset/image/divination-bg-yellow.png', "asset/image/divination-bg-yellow1.png"],
    "Hồng Nguyệt": ['asset/image/divination-bg-red.png', "asset/image/divination-bg-red1.png"],
};



// 提取共享的 SVG 卡背字符串 (保持原样，方便在两个组件复用)
const CARD_BACK_SVG = `
        <svg viewBox="0 0 100 150" style="width: 80%; height: auto; opacity: 0.8;">
            <rect x="5" y="5" width="90" height="140" fill="none" stroke="#d4af37" stroke-width="0.5"/>
            <rect x="8" y="8" width="84" height="134" fill="none" stroke="#d4af37" stroke-width="0.2"/>
            <path d="M50 15 A10 10 0 1 1 50 35 A12 12 0 1 0 50 15" fill="#d4af37" />
            <path d="M50 135 A10 10 0 1 0 50 115 A12 12 0 1 1 50 135" fill="#d4af37" />
            <g transform="translate(50, 75)">
            <circle cx="0" cy="0" r="28" fill="none" stroke="#d4af37" stroke-width="0.3"/>
            <circle cx="0" cy="0" r="25" fill="none" stroke="#d4af37" stroke-width="0.8"/>
            <circle cx="0" cy="0" r="18" fill="none" stroke="#d4af37" stroke-width="0.3"/>
            <path d="M0 -22 L3 -6 L22 0 L3 6 L0 22 L-3 6 L-22 0 L-3 -6 Z" fill="none" stroke="#d4af37" stroke-width="0.5"/>
            <path d="M-15 -15 L-4 -4 L0 -10 Z M15 -15 L4 -4 L0 -10 Z M15 15 L4 4 L0 10 Z M-15 15 L-4 4 L0 10 Z" fill="#d4af37" opacity="0.5"/>
            <polygon points="0,-12 12,0 0,12 -12,0" fill="none" stroke="#d4af37" stroke-width="0.5"/>
            <circle cx="0" cy="0" r="4" fill="#d4af37"/>
            </g>
            <line x1="50" y1="35" x2="50" y2="47" stroke="#d4af37" stroke-width="0.5" />
            <line x1="50" y1="103" x2="50" y2="115" stroke="#d4af37" stroke-width="0.5" />
        </svg>
        `;


class TarotImageProvider {
    constructor(basePath = 'asset/image/') {
        this.basePath = basePath;
    }

    // 生成路径规则: [标记]-序号-名称-编号.png
    getUrl(card, variantIndex, tag = '') {
        if (!card) return '';
        // 编号补零，例如 1 -> '01'
        const varStr = String(variantIndex).padStart(2, '0');
        return `${path_prefix}${this.basePath}${tag}${card.number}-${card.name}-${varStr}.png`;
    }
}

const imageProvider = new TarotImageProvider();


// ==========================================
// 新增: Vera 状态存储与Thời Chi Môn Mock 数据
// ==========================================
const VeraConfigStore = {
    state: {
        isLocked: false,
        currentForm: 'Ngân Nguyệt' // 模拟当前形态
    },
    load() {
        const saved = typeof getVariables === "function" ? getVariables({ type: 'chat' }).Vera?.state : null;
        if (saved) this.state = saved;
    },
    save() { /* 模拟保存 */ }
};

// 各种形态对应的背景图池 (请根据实际情况配置路径)
const TIMEGATE_BG_CONFIG = {
    'Ngân Nguyệt': ['asset/image/background/silver-moon-1.png', 'asset/image/background/silver-moon-2.png'],
    'Hoàng Nguyệt': ['asset/image/background/yellow-moon-1.png', 'asset/image/background/yellow-moon-2.png'],
    'Hồng Nguyệt': ['asset/image/background/red-moon-1.png', 'asset/image/background/red-moon-2.png'],
    'default': ['asset/image/background/silver-moon-1.png', 'asset/image/background/silver-moon-2.png']
};

const DB_PATH = {
    KEY: {
        EVENT: "Event"
    }
};
const K = DB_PATH.KEY;

class VeraDataManager {
    constructor() {
        this.veraData = {
            "Kết Quả Bói Toán": {},
            "Thời Chi Môn": {
                "Nút Hiện Tại": null,
                "Nút Lịch Sử": {}
            }
        };
        this.tarotPath = `stat_data.${K.EVENT}.Vera.Kết Quả Bói Toán`;
        this.timeGatePath = `stat_data.${K.EVENT}.Vera.Thời Chi Môn.Nút Lịch Sử`;
        this.veraDataPath = `stat_data.${K.EVENT}.Vera`;
    }

    async refreshData() {
        const fetch = await this.fetchData();
        if (fetch) this.veraData = fetch;
    }

    // 新增: 占卜记录删除占位函数
    deleteTarotRecord(id) {
        if (this.veraData["Kết Quả Bói Toán"][id]) {
            delete this.veraData["Kết Quả Bói Toán"][id];
            if (typeof updateVariablesWith === "function") {
                updateVariablesWith(vars => {
                    _.unset(vars, `${this.tarotPath}.${id}`);
                    return vars;
                }, { type: 'message' });
            }

            console.log(`[Dữ liệu] Đã xóa thành công khỏi bộ nhớ cục bộ Lịch sử bói toán: ${id}`);
        }
    }

    // 新增: Thời Chi MônNút Lịch Sử删除占位函数
    deleteTimeGateHistoryNode(id) {
        if (this.veraData["Thời Chi Môn"]["Nút Lịch Sử"][id]) {
            delete this.veraData["Thời Chi Môn"]["Nút Lịch Sử"][id];
            if (typeof updateVariablesWith === "function") {
                updateVariablesWith(vars => {
                    _.unset(vars, `${this.timeGatePath}.${id}`);
                    return vars;
                }, { type: 'message' });
            }
            console.log(`[Dữ liệu] Đã xóa thành công khỏi bộ nhớ cục bộ Nút Thời Chi Môn: ${id}`);
        }
    }

    // 模拟异步拉取数据
    async fetchData() {
        if (typeof getVariables === "function") {
            const vera = _.get(getVariables({ type: 'message' }), this.veraDataPath);
            if (vera) this.veraData = vera;
        }
    }
}

const veraDataAPI = new VeraDataManager();

// ==========================================
// 修改: 处理倾斜核心逻辑 (加入 3D 开关与闪卡光栅计算)
// ==========================================
function useCardTilt(options = { maxRotation: 15 }, Vue) {
    const { ref } = Vue;
    const cardRef = ref(null);
    const rotateX = ref(0);
    const rotateY = ref(0);
    const isHovering = ref(false);
    // 新增：动态效果开关
    const isDynamicEnabled = ref(true);

    // 反光层的 background-position (模拟全息闪卡在固定光源下的移动)
    const bgPosX = ref(50);
    const bgPosY = ref(50);

    // 抽离核心计算逻辑
    const calculateTilt = (clientX, clientY) => {
        if (!cardRef.value || !isDynamicEnabled.value) return;
        isHovering.value = true;

        const rect = cardRef.value.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const xRatio = (x / rect.width) - 0.5;
        const yRatio = (y / rect.height) - 0.5;

        rotateY.value = xRatio * 2 * options.maxRotation;
        rotateX.value = -yRatio * 2 * options.maxRotation;

        bgPosX.value = 50 + (rotateY.value * 3);
        bgPosY.value = 50 - (rotateX.value * 3);
    };

    const handleMouseMove = (e) => calculateTilt(e.clientX, e.clientY);

    // 新增: 处理触摸滑动
    const handleTouchMove = (e) => {
        // 阻止默认行为（防止在卡片上滑动时整个页面跟着滚）
        e.preventDefault();
        calculateTilt(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseLeave = () => {
        isHovering.value = false;
        rotateX.value = 0;
        rotateY.value = 0;
        bgPosX.value = 50;
        bgPosY.value = 50;
    };

    return {
        cardRef, rotateX, rotateY, isHovering, isDynamicEnabled,
        bgPosX, bgPosY, handleMouseMove, handleMouseLeave, handleTouchMove
    };
}

// ==========================================
// 新增: 拖拽与缩放组合式函数
// ==========================================
function usePanZoom(win, doc, Vue) {
    const { ref } = Vue;
    const scale = ref(1);
    const panX = ref(0);
    const panY = ref(0);

    let isDragging = false;
    let startX = 0, startY = 0;

    // 新增：降频控制变量
    let lastWheelTime = 0;
    // 目标帧率：30 帧/秒 (可以改为 1000/45 来达到 45 帧)
    const THROTTLE_INTERVAL = 1000 / 30;

    const onWheel = (e) => {
        e.preventDefault();

        const now = Date.now();
        // 如果距离上一次处理的时间小于我们的间隔，直接抛弃这次微小的滚动
        if (now - lastWheelTime < THROTTLE_INTERVAL) {
            return;
        }
        lastWheelTime = now;

        window.requestAnimationFrame(() => {
            // 在下一帧渲染前统一计算并更新 Vue 的响应式数据
            scale.value -= e.deltaY * 0.002;
            scale.value = Math.min(Math.max(0.5, scale.value), 4);
        });

    };

    const onPointerDown = (e) => {
        if (e.button === 1 || e.pointerType === 'touch') { // 鼠标中键按下
            // 避免在手机上点击按钮时触发拖拽
            if (e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'select') return;
            e.preventDefault();
            isDragging = true;
            startX = e.clientX - panX.value;
            startY = e.clientY - panY.value;
            document.body.style.cursor = 'grabbing';
        }
    };

    const onPointerMove = (e) => {
        if (!isDragging) return;
        panX.value = e.clientX - startX;
        panY.value = e.clientY - startY;
    };

    const onPointerUp = () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = 'default';
        }
    };

    // 全局挂载以保证拖拽流畅
    win.addEventListener('pointermove', onPointerMove);
    win.addEventListener('pointerup', onPointerUp);

    // 新增：重置视图方法
    const reset = () => {
        scale.value = 1;
        panX.value = 0;
        panY.value = 0;
    };

    return { scale, panX, panY, onWheel, onPointerDown, reset };
}

// ==========================================
// 新增: 悬浮球拖拽逻辑
// ==========================================
function useDraggableSphere(win, doc, Vue) {
    const x = Vue.ref(win.innerWidth - 80);
    const y = Vue.ref(win.innerHeight - 80);
    let startX = 0, startY = 0, initialX = 0, initialY = 0;
    let isDragging = false;
    let hasMoved = false; // 用于区分点击和拖拽

    // 读取本地存储
    const savedPos = localStorage.getItem('spherePosition');
    if (savedPos) {
        const pos = JSON.parse(savedPos);
        x.value = Math.min(pos.x, win.innerWidth - 60);
        y.value = Math.min(pos.y, win.innerHeight - 60);
    }

    const onPointerDown = (e) => {
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        initialX = x.value;
        initialY = y.value;
        doc.addEventListener('pointermove', onPointerMove);
        doc.addEventListener('pointerup', onPointerUp);
    };

    const onPointerMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

        // 边界限制
        x.value = Math.max(0, Math.min(initialX + dx, win.innerWidth - 60));
        y.value = Math.max(0, Math.min(initialY + dy, win.innerHeight - 60));
    };

    const onPointerUp = (e) => {
        isDragging = false;
        doc.removeEventListener('pointermove', onPointerMove);
        doc.removeEventListener('pointerup', onPointerUp);
        if (hasMoved) {
            localStorage.setItem('spherePosition', JSON.stringify({ x: x.value, y: y.value }));
        }
    };

    return { x, y, onPointerDown, checkClick: () => !hasMoved };
}

// ==========================================
// 修改: 全局卡片配置状态中心 (加入数据同步与容错处理)
// ==========================================
const savedConfigsString = localStorage.getItem('tarotGlobalConfigs');
const parsedConfigs = savedConfigsString ? JSON.parse(savedConfigsString) : {};

// 动态构建初始配置，以最新的 tarotConfig 长度为准
const initialConfigs = {};
tarotConfig.forEach((card, index) => {
    // 核心容错：尝试读取缓存，如果读不到 (例如新增了卡牌)，则提供 fallback 默认值
    initialConfigs[index] = parsedConfigs[index] || {
        styleId: 'default',
        variation: 1
    };
});

// 将安全合并后的配置转化为响应式对象
let globalCardConfigs;
// 1. 将状态提取到组件外部 (闭包作用域)。
// 这样每次打开/关闭主面板 (组件挂载/卸载) 时，依然操作同一份内存数据。
let divi_isDrawing, divi_selectedSpreadMode, divi_customLabels, divi_drawnCards, divi_question;

//通知函数
let sharedToastState;

// 2. 将原本在外层执行的 Vue API 逻辑，全部封入这个激活函数中
function initVeraGlobalState(SafeVue) {
    // 防止重复初始化
    if (globalCardConfigs) return;

    globalCardConfigs = SafeVue.reactive(initialConfigs);
    SafeVue.watch(globalCardConfigs, (newVal) => {
        localStorage.setItem('tarotGlobalConfigs', JSON.stringify(newVal));
    }, { deep: true });

    // --- 激活占卜面板状态 ---  
    // 1. 将状态提取到组件外部 (闭包作用域)。
    // 这样每次打开/关闭主面板 (组件挂载/卸载) 时，依然操作同一份内存数据。
    divi_isDrawing = SafeVue.ref(false);
    divi_selectedSpreadMode = SafeVue.ref('time');
    const divi_customLabels = SafeVue.ref(['Vị trí 1', 'Vị trí 2', 'Vị trí 3']);
    divi_drawnCards = SafeVue.ref([null, null, null]);
    // 记录占卜所问的事项，保证切换页面不丢失
    divi_question = SafeVue.ref('');

    //初始化通知函数
    sharedToastState = SafeVue.reactive({
        toasts: [],
        idCounter: 0,

        removeToast(id) {
            const index = this.toasts.findIndex(t => t.id === id);
            if (index > -1) this.toasts.splice(index, 1);
        },

        /**
        * @param {string} message - 提示内容
        * @param {string} type - 'info'(默认) | 'success' | 'warning' | 'error'
        * @param {number} duration - 自动消失时间(毫秒)
        */
        showToast(message, type = 'info', duration = 3000) {
            const id = this.idCounter++;
            const requireClose = type === 'error';
            this.toasts.push({ id, message, type, requireClose });
            if (!requireClose) {
                setTimeout(() => this.removeToast(id), duration);
            }
        },
        confirm(message, onConfirm, onCancel = null) {
            const id = this.idCounter++;
            this.toasts.push({
                id, message, type: 'confirm', requireClose: false, isConfirm: true,
                onConfirm: () => { if (onConfirm) onConfirm(); this.removeToast(id); },
                onCancel: () => { if (onCancel) onCancel(); this.removeToast(id); }
            });
        },
        // 【新增】基于 Promise 的异步确认机制
        confirmAsync(message) {
            return new Promise((resolve) => {
                const id = this.idCounter++;
                this.toasts.push({
                    id,
                    message,
                    type: 'confirm',
                    requireClose: false, // 强制用户点按钮
                    isConfirm: true,

                    // 用户点击确认，Promise 吐出 true
                    onConfirm: () => {
                        resolve(true);
                        this.removeToast(id);
                    },
                    // 用户点击取消，Promise 吐出 false
                    onCancel: () => {
                        resolve(false);
                        this.removeToast(id);
                    }
                });
            });
        }

    });
}
function useMessageToast() {
    return sharedToastState;
}
// ==========================================
// 模块 2: 卡片组件 (Component)
// ==========================================
const InteractiveCard = {
    // 接收外部传入的卡片 URL 属性
    props: ['imgSrc', 'isDynamic', 'zoomScale'],
    template: `
                <div 
                class="card-container" 
                ref="cardRef"
                :style="dynamicBoundsStyle"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"

                @touchmove="handleTouchMove"
                @touchend="handleMouseLeave"
                @click="toggleFlip"
                >
                <div class="card-tilt" :style="tiltStyle">
                    
                    <div class="card-flip" :class="{ 'is-flipped': isFlipped }">
                    
                    <div class="card-face face-front">
                        <img :src="imgSrc" class="card-image" @load="handleImageLoad" alt="Tarot Card Front" />
                        <div class="glare" :style="glareStyle"></div>
                    </div>
                    
                    <div class="card-face face-back">
                        <div class="glare" :style="glareStyle"></div>
                        <svg viewBox="0 0 100 150" style="width: 80%; height: auto; opacity: 0.8;">
                        <rect x="5" y="5" width="90" height="140" fill="none" stroke="#d4af37" stroke-width="0.5"/>
                        <rect x="8" y="8" width="84" height="134" fill="none" stroke="#d4af37" stroke-width="0.2"/>
                        
                        <path d="M50 15 A10 10 0 1 1 50 35 A12 12 0 1 0 50 15" fill="#d4af37" />
                        <path d="M50 135 A10 10 0 1 0 50 115 A12 12 0 1 1 50 135" fill="#d4af37" />
                        
                        <g transform="translate(50, 75)">
                            <circle cx="0" cy="0" r="28" fill="none" stroke="#d4af37" stroke-width="0.3"/>
                            <circle cx="0" cy="0" r="25" fill="none" stroke="#d4af37" stroke-width="0.8"/>
                            <circle cx="0" cy="0" r="18" fill="none" stroke="#d4af37" stroke-width="0.3"/>
                            
                            <path d="M0 -22 L3 -6 L22 0 L3 6 L0 22 L-3 6 L-22 0 L-3 -6 Z" fill="none" stroke="#d4af37" stroke-width="0.5"/>
                            <path d="M-15 -15 L-4 -4 L0 -10 Z M15 -15 L4 -4 L0 -10 Z M15 15 L4 4 L0 10 Z M-15 15 L-4 4 L0 10 Z" fill="#d4af37" opacity="0.5"/>
                            
                            <polygon points="0,-12 12,0 0,12 -12,0" fill="none" stroke="#d4af37" stroke-width="0.5"/>
                            <circle cx="0" cy="0" r="4" fill="#d4af37"/>
                        </g>
                        
                        <line x1="50" y1="35" x2="50" y2="47" stroke="#d4af37" stroke-width="0.5" />
                        <line x1="50" y1="103" x2="50" y2="115" stroke="#d4af37" stroke-width="0.5" />
                        </svg>
                    </div>

                    </div>
                </div>
                </div>
            
            `,
    setup(props) {
        // 使用抽离出的逻辑
        const {
            cardRef, rotateX, rotateY, isHovering, bgPosX, bgPosY,
            isDynamicEnabled, handleMouseMove, handleMouseLeave, handleTouchMove
        } = useCardTilt({ maxRotation: 18 }, Vue);

        // 同步外部 3D 开关状态
        Vue.watchEffect(() => { isDynamicEnabled.value = props.isDynamic; });
        // 新增：翻面逻辑
        const isFlipped = Vue.ref(false);
        const toggleFlip = () => {
            isFlipped.value = !isFlipped.value;
        };

        // 解决问题 1: 监听图片链接变化，强制翻回正面
        Vue.watch(() => props.imgSrc, () => {
            isFlipped.value = false;
        });

        // 图片自适应宽高比逻辑
        const aspectRatio = Vue.ref(null);
        const handleImageLoad = (e) => {
            const img = e.target;
            aspectRatio.value = img.naturalWidth / img.naturalHeight;
        };

        // 解决问题 2: 将 scale 乘以基础视口高度 (80vh)，抛弃 CSS Transform Scale
        const dynamicBoundsStyle = Vue.computed(() => {
            const currentScale = props.zoomScale || 1;
            const baseHeight = 80 * currentScale; // 动态计算真实布局高度

            if (!aspectRatio.value) return { height: `${baseHeight}vh`, width: '320px' };
            return {
                height: `${baseHeight}vh`,
                aspectRatio: aspectRatio.value
            };
        });

        const tiltStyle = Vue.computed(() => ({
            transform: props.isDynamic ? `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)` : 'none',
            transition: isHovering.value ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }));

        const glareStyle = Vue.computed(() => ({
            // 为了让极窄的光条能快速扫过整个卡面，我们把 bgPosX/Y 的乘数适度放大
            backgroundPosition: `${bgPosX.value}% ${bgPosY.value}%`,
            // 降低最大不透明度，让效果更加内敛
            opacity: (isHovering.value && props.isDynamic) ? 0.6 : 0
        }));
        return {
            cardRef, isFlipped, toggleFlip,
            handleTouchMove,
            handleMouseMove,
            handleMouseLeave,
            tiltStyle,
            glareStyle,
            handleImageLoad, dynamicBoundsStyle
        };
    }
};


// ==========================================
// 新增: 独立详情弹窗模块 (拆分自原 app.setup)
// ==========================================
const CardDetailModal = {
    components: { InteractiveCard },
    props: ['cardIndex', 'initialStyleId', 'initialVariation', 'initial3dEnabled'],
    emits: ['close'],
    template: `
    <div class="detail-modal">
      
      <div class="detail-controls-wrapper">
        <button class="controls-toggle-btn" @click="isControlsOpen = !isControlsOpen">
          {{ isControlsOpen ? 'Thu gọn bảng' : '⚙️ Cài đặt phong cách (Nhấn ESC để thoát)' }}
        </button>
        
        <div class="detail-controls-panel" v-show="isControlsOpen">
          <button @click="$emit('close')" style="background:rgba(0,150,255,0.2); color:#00f0ff; border:1px solid #00f0ff; padding:6px 12px; cursor:pointer; border-radius:4px;">← Về trang tổng quan</button>
          
          <label style="cursor: pointer;">
            <input type="checkbox" v-model="enable3D" /> Bật hiệu ứng 3D và thẻ lấp lánh
          </label>
          
          <label>Đổi phong cách tạm thời (Không lưu):</label>
          <select v-model="localStyleId" style="background:#222; color:#fff; border:1px solid #444; padding:4px;">
            <option v-for="style in availableStyles" :key="style.id" :value="style.id">{{ style.name }}</option>
          </select>
          
          <label>Chuyển đổi kiểu tạm thời (Không lưu):</label>
          <select v-model="localVariation" style="background:#222; color:#fff; border:1px solid #444; padding:4px;">
            <option v-for="v in currentMaxVariations" :key="v" :value="v">Kiểu {{ v }}</option>
          </select>
        </div>
      </div>

      <div class="stage" @wheel.prevent="onWheel" @pointerdown="onPointerDown" :style="stageStyle">
        <interactive-card :img-src="currentImgUrl" :is-dynamic="enable3D" :zoom-scale="scale" />
      </div>
    </div>
  `,
    setup(props, { emit }) {
        const config = tarotConfig;
        const styles = stylesConfig;
        const enable3D = Vue.ref(props.initial3dEnabled);
        // 新增: 控制面板默认折叠
        const isControlsOpen = Vue.ref(true);

        // 初始化临时状态
        const localStyleId = Vue.ref(props.initialStyleId);
        const localVariation = Vue.ref(props.initialVariation);

        const { scale, panX, panY, onWheel, onPointerDown, reset: resetPanZoom } = usePanZoom(win, doc, Vue);

        // 补充: 在 CardDetailModal 的 stage 样式中加入 touch-action: none; 
        // 这会告诉浏览器，这个区域不要进行原生的页面滚动缩放，交由 JS 处理。
        const stageStyle = Vue.computed(() => ({
            transform: `translate(${panX.value}px, ${panY.value}px)`,
            width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
            touchAction: 'none'
        }));

        const targetCard = Vue.computed(() => config[props.cardIndex]);

        // 新增: 为当前详情牌计算可用的风格列表
        const availableStyles = Vue.computed(() => {
            const cardVariations = targetCard.value.variations;
            return styles.filter(style => cardVariations[style.id] && cardVariations[style.id] > 0);
        });

        // 容错: 监听 targetCard (虽然详情页目前不涉及切牌，但保留这层响应式逻辑更健壮)
        Vue.watch(availableStyles, (newAvailable) => {
            // 如果当前选中的风格不在可用列表中，强制重置为可用的第一个风格
            if (!newAvailable.find(s => s.id === localStyleId.value)) {
                localStyleId.value = newAvailable[0].id;
            }
        });

        const currentStyleTag = Vue.computed(() => {
            const style = styles.find(s => s.id === localStyleId.value);
            return style ? style.tag : '';
        });

        const currentMaxVariations = Vue.computed(() => targetCard.value.variations[localStyleId.value] || 1);

        Vue.watch(currentMaxVariations, (newMax) => {
            if (localVariation.value > newMax) localVariation.value = 1;
        });

        const currentImgUrl = Vue.computed(() => {
            return imageProvider.getUrl(targetCard.value, localVariation.value, currentStyleTag.value);
        });

        Vue.watch(currentImgUrl, () => resetPanZoom());

        // 新增: ESC 快捷键监听
        const handleKeydown = (e) => {
            const key = e.key.toLowerCase();
            if (key === 'escape') emit('close');
            // 2. W / S 切换风格 (向下/向上遍历 availableStyles 数组)
            if (key === 'w' || key === 's') {
                if (availableStyles.value.length > 1) {
                    const currentIndex = availableStyles.value.findIndex(style => style.id === localStyleId.value);
                    let nextIndex;

                    if (key === 's') {
                        // S: 下一个风格 (超出回到底部)
                        nextIndex = (currentIndex + 1) % availableStyles.value.length;
                    } else {
                        // W: 上一个风格 (低于0回到顶部)
                        nextIndex = (currentIndex - 1 + availableStyles.value.length) % availableStyles.value.length;
                    }

                    localStyleId.value = availableStyles.value[nextIndex].id;
                }
            }

            // 3. A / D 切换Kiểu
            if (key === 'a' || key === 'd') {
                const max = currentMaxVariations.value;
                if (max > 1) {
                    if (key === 'd') {
                        // D: 增大，超出最大值重置为 1
                        localVariation.value = localVariation.value >= max ? 1 : localVariation.value + 1;
                    } else {
                        // A: 减小，低于 1 回到最大值
                        localVariation.value = localVariation.value <= 1 ? max : localVariation.value - 1;
                    }
                }
            }
        };

        Vue.onMounted(() => {
            win.addEventListener('keydown', handleKeydown);
        });

        Vue.onUnmounted(() => {
            win.removeEventListener('keydown', handleKeydown);
        });

        return {
            styles, enable3D, localStyleId, localVariation,
            availableStyles, currentMaxVariations,
            currentImgUrl, onWheel, onPointerDown, stageStyle, scale,
            isControlsOpen
        };
    }
};

// ==========================================
// 新增: 卡片总览页面模块
// ==========================================
const CardOverview = {
    // 接收外部传入的全局 3D 状态并允许双向绑定更新
    props: ['global3dEnabled'],
    emits: ['preview', 'update:global3dEnabled'],
    template: `
    <div style="height: 100%; display: flex; flex-direction: column;">
      
      <div class="overview-controls-bar">
        <label style="cursor: pointer;">
          <input type="checkbox" :checked="global3dEnabled" @change="$emit('update:global3dEnabled', $event.target.checked)" /> 
          Mặc định bật 3D / Lấp lánh khi xem chi tiết thẻ
        </label>
        <label style="cursor: pointer;">
          <input type="checkbox" v-model="showCardControls" /> 
          Hiển thị bảng cấu hình thẻ (Bật để điều chỉnh)
        </label>
      </div>

      <div class="overview-grid" ref="gridRef">
        <div class="thumbnail-card" v-for="item in pagedCards" :key="item.index">
          <img 
            :src="getThumbUrl(item.index)" 
            class="thumbnail-img" 
            loading="lazy" 
            decoding="async"
            @click="$emit('preview', item.index)" 
          />
          
          <div class="card-controls" v-show="showCardControls">
            <div style="font-size: 12px; color: #00f0ff; text-align: center;">{{ item.card.number }} - {{ item.card.displayName }}</div>
            <select v-model="globalConfigs[item.index].styleId" @change="onStyleChange(item.index)">
              <option v-for="s in getAvailableStyles(item.index)" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
            <select v-model="globalConfigs[item.index].variation">
              <option v-for="v in getMaxVar(item.index)" :value="v">Kiểu {{ v }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">Trang trước</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++">Trang sau</button>
      </div>
      
      </div>
  `,
    setup() {
        const currentPage = Vue.ref(1);
        // 修改: 将每页数量从常量改为响应式变量，默认先给个 10
        const itemsPerPage = Vue.ref(10);
        const gridRef = Vue.ref(null);
        const totalPages = Vue.computed(() => Math.ceil(tarotConfig.length / itemsPerPage.value));

        // 新增: Kiểu控制框显示状态 (默认隐藏保证美观)
        const showCardControls = Vue.ref(false);

        // 附带真实索引的卡片列表，方便分页后依然能对应全局配置的 Index
        const mappedCards = tarotConfig.map((card, index) => ({ card, index }));
        const pagedCards = Vue.computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            return mappedCards.slice(start, start + itemsPerPage.value);
        });

        // 新增: 动态计算某张牌实际可用的风格选项
        const getAvailableStyles = (idx) => {
            const cardVariations = tarotConfig[idx].variations;
            // 遍历所有注册在 stylesConfig 里的风格字典，只返回配置数量大于 0 的风格
            return stylesConfig.filter(style => cardVariations[style.id] && cardVariations[style.id] > 0);
        };

        const getMaxVar = (idx) => {
            const conf = globalCardConfigs[idx];
            return tarotConfig[idx].variations[conf.styleId] || 1;
        };

        const onStyleChange = (idx) => {
            const max = getMaxVar(idx);
            if (globalCardConfigs[idx].variation > max) {
                globalCardConfigs[idx].variation = 1;
            }
        };

        const getThumbUrl = (idx) => {
            const conf = globalCardConfigs[idx];
            const tag = stylesConfig.find(s => s.id === conf.styleId).tag;
            return imageProvider.getUrl(tarotConfig[idx], conf.variation, tag);
        };

        // ==========================================
        // 新增: 1. 动态计算每页填满两行的数量
        // ==========================================
        const calculateItemsPerPage = () => {
            if (!gridRef.value) return;
            const containerWidth = gridRef.value.clientWidth;
            // 这里的 180 是你在 CSS minmax(180px, 1fr) 中定义的最小列宽，25 是 gap 间距
            const colWidth = 200;
            const gap = 25;

            // 数学推算: N * colWidth + (N - 1) * gap <= containerWidth
            let cols = Math.floor((containerWidth + gap) / (colWidth + gap));
            if (cols < 1) cols = 1;

            // 强制每页显示 两行 的数量
            itemsPerPage.value = cols * 2;
        };

        let resizeObserver;
        Vue.onMounted(() => {
            // 使用 ResizeObserver 监听网格容器的宽度变化 (比如窗口拉伸、手机横竖屏切换)
            resizeObserver = new ResizeObserver(calculateItemsPerPage);
            if (gridRef.value) {
                resizeObserver.observe(gridRef.value);
            }
        });
        Vue.onUnmounted(() => {
            if (resizeObserver) resizeObserver.disconnect();
        });

        // 容错: 当改变窗口大小导致总页数变少时，防止当前页码越界
        Vue.watch(totalPages, (newTotal) => {
            if (currentPage.value > newTotal && newTotal > 0) {
                currentPage.value = newTotal;
            }
        });

        // ==========================================
        // 新增: 2. 预加载相邻页面的图片缓冲逻辑
        // ==========================================
        const preloadPageImages = (pageNum) => {
            if (pageNum < 1 || pageNum > totalPages.value) return;
            const start = (pageNum - 1) * itemsPerPage.value;
            const cardsToPreload = mappedCards.slice(start, start + itemsPerPage.value);

            // 偷偷在后台利用 JS 的 Image 对象发起请求，浏览器会自动将它们存入内存缓存
            cardsToPreload.forEach(item => {
                const url = getThumbUrl(item.index);
                const img = new Image();
                img.src = url;
            });
        };

        // 监听页码和每页数量的变化，自动预加载Trang trước和Trang sau
        Vue.watch([currentPage, itemsPerPage], () => {
            // 延迟一点点执行，让出主线程优先渲染当前页面的 DOM
            setTimeout(() => {
                preloadPageImages(currentPage.value + 1); // 预加载Trang sau
                preloadPageImages(currentPage.value - 1); // 预加载Trang trước
            }, 200);
        }, { immediate: true });

        return {
            // 新增: Kiểu控制框显示状态 (默认隐藏保证美观)
            gridRef,
            showCardControls,
            stylesConfig, globalConfigs: globalCardConfigs,
            currentPage, totalPages, pagedCards,
            getMaxVar, onStyleChange, getThumbUrl, getAvailableStyles
        };
    }
};


// ==========================================
// 新增: Bói Tarot模拟面板模块
// ==========================================

const DivinationBoard = {
    template: `
    <div class="divination-board">
      <div class="divination-bg" :style="{ backgroundImage: 'url(' + bgUrl + ')' }"></div>
      
      <div class="divination-controls">

        <input 
            v-model="question" 
            type="text" 
            placeholder="Nhập vào điều bạn đang băn khoăn..." 
            style="flex: 1; min-width: 170px;" 
            :disabled="isDrawing"
        />
        <select v-model="selectedSpreadMode" :disabled="isDrawing">
          <option value="time">Quá khứ - Hiện tại - Tương lai</option>
          <option value="action">Vấn đề - Trở ngại - Gợi ý</option>
          <option value="custom">Tùy chỉnh ý nghĩa...</option>
        </select>
        
        <template v-if="selectedSpreadMode === 'custom'">
          <input v-model="customLabels[0]" placeholder="Vị trí 1" style="width:70px;" :disabled="isDrawing"/>
          <input v-model="customLabels[1]" placeholder="Vị trí 2" style="width:70px;" :disabled="isDrawing"/>
          <input v-model="customLabels[2]" placeholder="Vị trí 3" style="width:70px;" :disabled="isDrawing"/>
        </template>
        
        <button class="divination-btn" @click="drawCards" :disabled="isDrawing">🔮 Rút Bài</button>
        <button class="divination-btn divination-btn-danger" @click="resetBoard" :disabled="isDrawing">↺ Xóa</button>
        <button class="divination-btn" style="border-color: #8a2be2; color: #d4af37;" @click="openHistory" :disabled="isDrawing">📜 Lịch Sử Bói Toán</button>
      </div>

      <div class="spread-slots">
        <div class="slot-container" v-for="(slot, index) in 3" :key="index">
          <div class="slot-label">{{ currentLabels[index] }}</div>
          
          <div class="slot-frame">
            <transition name="deal">
              <div 
                v-if="drawnCards[index] && drawnCards[index].show" 
                class="divi-card" 
                :class="{ 'is-flipped': drawnCards[index].flipped }"
              >
                <div class="divi-face divi-back" v-html="cardBackSvg"></div>
                
                <div class="divi-face divi-front" :class="{ 'is-reversed': drawnCards[index].isReversed }">
                  <img :src="drawnCards[index].imgUrl" />
                </div>
              </div>
            </transition>
            
            <div class="meaning-tooltip" v-if="drawnCards[index] && drawnCards[index].flipped">
              <div class="title">
                {{ drawnCards[index].card.displayName }} 
                ({{ drawnCards[index].isReversed ? 'Nghịch' : 'Thuận' }})
              </div>
              <div class="desc">
                {{ drawnCards[index].isReversed ? drawnCards[index].card.meanings.reversed : drawnCards[index].card.meanings.upright }}
              </div>
            </div>
          </div>
        </div>
      </div>

            <div class="divi-history-overlay" v-if="showHistoryModal" @click.self="showHistoryModal = false">
        <div class="divi-history-content">
          <div class="divi-history-header">
            <h3 class="divi-history-title">Hồ Sơ · Lịch Sử Bói Toán</h3>
            <div>
              <button class="tg-refresh-btn" style="margin-right: 15px;" @click="fetchHistory" :disabled="isLoadingHistory">
                {{ isLoadingHistory ? 'Đang tải...' : 'Tải lại' }}
              </button>
              <button class="tg-modal-close" style="position: relative; top: 0; right: 0;" @click="showHistoryModal = false">×</button>
            </div>
          </div>
          <div class="divi-history-body">
            <div v-if="historyRecords.length === 0 && !isLoadingHistory" style="text-align: center; color: #666; margin-top: 50px;">
              [Không có lịch sử bói toán]
            </div>
            
            <div class="divi-history-card" v-for="record in historyRecords" :key="record.id">
              <button class="divi-delete-btn" @click.stop="deleteRecord(record.id)">×</button>
              
              <div class="divi-h-question"><span>✦</span> Câu hỏi: {{ record.question }}</div>
            
              
              <div class="divi-h-cards">
                <div class="divi-h-card-item" v-for="(card, i) in record.cards" :key="i">
                  <span style="color: #00f0ff;">{{ (card.pos || '').trim() }}</span>: {{ (card.name || card.displayName || '').trim() }} 
                  <span :style="{ color: card.orientation === 'Nghịch' ? '#ff6b6b' : '#a8d5e2' }">({{ card.orientation }})</span>
                </div>
              </div>

              <div class="divi-h-tendency">Hướng đi của vận mệnh: {{ record.tendency }}</div>
              <div class="divi-h-tendency">Tầng chat: {{ record.start_floor }} </div>
              
              <div class="divi-h-interpretations">
                <div v-for="(interp, i) in record.interpretations" :key="i">{{ interp }}</div>
              </div>
              
              <div class="divi-h-overall">
                <strong>Giải mã tổng thể: </strong>{{ record.overall }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

    setup() {
        const bgUrl = Vue.ref(DIVINATION_BG_URL);
        const cardBackSvg = Vue.ref(CARD_BACK_SVG);
        const toast = useMessageToast();

        // 牌阵定义
        const selectedSpreadMode = Vue.ref('time');
        const spreadLabels = {
            time: ['Quá khứ', 'Hiện tại', 'Tương lai'],
            action: ['Vấn đề', 'Trở ngại', 'Gợi ý']
        };

        const currentLabels = Vue.computed(() => {
            return divi_selectedSpreadMode.value === 'custom'
                ? divi_customLabels.value
                : spreadLabels[divi_selectedSpreadMode.value];
        });

        const resetBoard = () => {
            divi_drawnCards.value = [null, null, null];
        };

        //抽背景
        const updateBackground = () => {
            const form = VeraConfigStore.state.currentForm || 'Ngân Nguyệt';
            const bgList = DIVINATION_BG_CONFIG[form] || DIVINATION_BG_CONFIG['Ngân Nguyệt'];
            // 随机抽取一张
            const randomBg = bgList[Math.floor(Math.random() * bgList.length)];
            bgUrl.value = `${path_prefix}${randomBg}`;
        };


        // ==========================================
        // 新增: 历史记录状态与数据抓取逻辑
        // ==========================================
        const showHistoryModal = Vue.ref(false);
        const isLoadingHistory = Vue.ref(false);
        const historyRecords = Vue.ref([]);

        const fetchHistory = async () => {
            if (isLoadingHistory.value) return;
            isLoadingHistory.value = true;
            try {
                await veraDataAPI.refreshData();
                const rawData = veraDataAPI.veraData;
                const divinationResults = rawData["Kết Quả Bói Toán"] || {};
                // 将对象转为数组以便于遍历
                historyRecords.value = Object.entries(divinationResults).map(([id, record]) => ({
                    id,
                    ...record
                }));
            } catch (err) {
                console.error("Lỗi tải lịch sử bói toán:", err);
            } finally {
                isLoadingHistory.value = false;
            }
        };
        // 新增: 删除记录函数
        const deleteRecord = async (id) => {
            const isConfirmed = await toast.confirmAsync("Bạn có chắc chắn muốn xóa bản ghi này?");
            if (!isConfirmed) {
                return;
            }
            veraDataAPI.deleteTarotRecord(id); // 调用底层删除
            historyRecords.value = historyRecords.value.filter(r => r.id !== id); // 同步刷新前端列表
        };

        const openHistory = () => {
            showHistoryModal.value = true;
            fetchHistory();
        };

        const drawCards = async () => {
            if (divi_isDrawing.value) return;
            if (divi_drawnCards.value.length > 0 && divi_drawnCards.value[0] != null) {
                // 使用 await 暂停执行，直到用户点击按钮返回 true 或 false
                const isConfirmed = await toast.confirmAsync("Đã có kết quả rút bài, bạn có muốn rút bài mới và ghi đè?");
                if (!isConfirmed) {
                    console.log("Hủy: Người dùng từ chối ghi đè bói toán.");
                    return;
                }
            }
            divi_isDrawing.value = true;
            resetBoard();

            // 1. 筛选大阿尔卡纳 (00 - 21) 并打乱
            const majorArcana = tarotConfig.filter(c => parseInt(c.number) <= 21);
            const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, 3);

            // 2. 映射结果，绑定全局Kiểu配置，并随机正逆位
            const result = selected.map((card) => {
                // 查找在总览面板中的全局配置(如果被修改过)
                const globalIdx = tarotConfig.findIndex(c => c.number === card.number);
                const config = globalCardConfigs[globalIdx];
                const tag = stylesConfig.find(s => s.id === config.styleId).tag;
                const imgUrl = imageProvider.getUrl(card, config.variation, tag);

                return {
                    card,
                    imgUrl,
                    isReversed: Math.random() > 0.65,
                    show: false,
                    flipped: false
                };
            });

            // 3. 缓动动画发牌 (间隔 300ms 出现一张牌)
            result.forEach((item, index) => {
                setTimeout(() => {
                    divi_drawnCards.value[index] = item;
                    setTimeout(() => { divi_drawnCards.value[index].show = true; }, 50);
                }, index * 300);
            });

            // 4. 缓动动画翻牌 (发完最后一张牌后，间隔 400ms 依次翻开)
            const flipStartTime = result.length * 300 + 400;
            result.forEach((_, index) => {
                setTimeout(() => {
                    divi_drawnCards.value[index].flipped = true;
                }, flipStartTime + (index * 400));
            });

            // 5. 动画完全结束后，解锁按钮并在控制台打印
            setTimeout(() => {
                divi_isDrawing.value = false;
                let content = [];
                console.log("=== Kết Quả Bói Tarot ===");
                content.push("=== Kết Quả Bói Tarot ===");
                // 新增：如果用户输入了问题，则将其打印在最前面
                if (divi_question.value.trim() !== '') {
                    console.log(`[Vấn đề tìm kiếm] - ${divi_question.value}`);
                    console.log("--------------------");
                    content.push(`[Vấn đề tìm kiếm] - ${divi_question.value}`);
                    content.push("--------------------");
                }
                result.forEach((res, i) => {
                    console.log(`[${currentLabels.value[i]}] - ${res.card.number} ${res.card.displayName} (${res.isReversed ? 'Nghịch' : 'Thuận'})`);
                    content.push(`[${currentLabels.value[i]}] - ${res.card.number} ${res.card.displayName} (${res.isReversed ? 'Nghịch' : 'Thuận'})`);
                });
                content.push("--------------------");
                content.push("Vui lòng tuân thủ nghiêm ngặt <tarot_divination_rules>, dựa vào kết quả trên để giải bài và tuân theo định dạng phản hồi yêu cầu");
                const suc = messageInputer.sendMessage(content.join('\n'), false);
                if (suc) toast.showToast('Kết quả rút bài đã được gửi vào khung chat', 'success');
                else toast.showToast("Gửi thất bại, không rõ nguyên nhân", "warning");
            }, flipStartTime + (result.length * 400));
        };

        Vue.onMounted(() => {
            updateBackground();
        });

        return {
            bgUrl, cardBackSvg,
            isDrawing: divi_isDrawing,
            selectedSpreadMode: divi_selectedSpreadMode,
            customLabels: divi_customLabels,
            drawnCards: divi_drawnCards,
            question: divi_question,
            currentLabels, drawCards, resetBoard,
            // 新增导出历史记录相关的 ref 与方法
            showHistoryModal, isLoadingHistory, historyRecords,
            fetchHistory, openHistory,

            deleteRecord
        };
    }
};


// ==========================================
// 新增: Thời Chi Môn渲染组件 (TimeGateBoard)
// ==========================================

// 局部复用的详情渲染模板 (因为当前节点和Nút Lịch Sử的详细结构一致)
const NodeDetailTemplate = `
  <div v-if="node" class="tg-node-detail">
    <div class="tg-section">
      <div class="tg-section-title">Hồ sơ cơ sở</div>
      <div class="tg-kv"><div class="tg-k">Mã hồ sơ:</div><div class="tg-v">{{ node.id }}</div></div>
      <div class="tg-kv"><div class="tg-k">Mức độ nguy hiểm:</div><div class="tg-v" style="color: #ff6b6b;">{{ node.meta_info.difficulty }}</div></div>
      <div class="tg-kv"><div class="tg-k">Người đồng hành:</div><div class="tg-v">{{ node.meta_info.participants.join(', ') }}</div></div>
    </div>
    
    <div class="tg-section">
      <div class="tg-section-title">Điểm neo không thời gian</div>
      <div class="tg-kv"><div class="tg-k">Điểm vào thực tại:</div><div class="tg-v">{{ node.timeline_info.real_world_entry_time }}</div></div>
      <div class="tg-kv"><div class="tg-k">Kỷ nguyên mục tiêu:</div><div class="tg-v" style="color: #cda776;">{{ node.timeline_info.target_historical_time }}</div></div>
      <div class="tg-kv"><div class="tg-k">Tọa độ giáng lâm:</div><div class="tg-v">{{ node.timeline_info.target_location }}</div></div>
    </div>

    <div class="tg-section">
      <div class="tg-section-title">Bối cảnh lịch sử</div>
      <div class="tg-kv"><div class="tg-k">Lát cắt thời đại:</div><div class="tg-v">{{ node.historical_context.background }}</div></div>
      <div class="tg-kv"><div class="tg-k">Xung đột cốt lõi:</div><div class="tg-v">{{ node.historical_context.core_conflict }}</div></div>
      <div class="tg-kv"><div class="tg-k">Tuyến hội tụ nguyên gốc:</div><div class="tg-v" style="color: #aaa;">{{ node.historical_context.original_trajectory }}</div></div>
    </div>

    <div class="tg-section" v-if="node.narrative_log && node.narrative_log.length > 0">
      <div class="tg-section-title">Nhật ký quan trắc và can thiệp (Đã trôi qua {{ node.exploration_state.days_elapsed }} ngày)</div>
      <div class="tg-log-day" v-for="log in node.narrative_log" :key="log.day">
        <div class="tg-log-title">Ngày thứ {{ log.day }}</div>
        <ul class="tg-list">
          <li v-for="(action, i) in log.actions_taken" :key="'a'+i">{{ action }}</li>
        </ul>
        <div class="tg-butterfly">
          <span style="color:#d4af37;">[Hiệu ứng cánh bướm]</span>
          <ul class="tg-list" style="margin-top: 5px;">
            <li v-for="(effect, i) in log.butterfly_effects" :key="'e'+i">{{ effect }}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="tg-section" v-if="node.settlement">
      <div class="tg-section-title">Tổng kết cuối cùng</div>
      <div class="tg-kv"><div class="tg-k">Vật phẩm mang về:</div>
        <div class="tg-v">
          <ul class="tg-list" style="padding-left: 0; list-style-position: inside;">
            <li v-for="(item, i) in node.settlement.items_retrieved" :key="'i'+i" style="color: #a8d5e2;">{{ item }}</li>
          </ul>
        </div>
      </div>
      <div class="tg-kv"><div class="tg-k">Độ lệch thực tại:</div>
        <div class="tg-v">
          <ul class="tg-list" style="padding-left: 0; list-style-position: inside;">
            <li v-for="(shift, i) in node.settlement.reality_shifts" :key="'s'+i" style="color: #d88c9a;">{{ shift }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
`;

const TimeGateBoard = {
    template: `
    <div class="timegate-board">
      <div class="tg-bg" :style="{ backgroundImage: 'url(' + currentBg + ')' }"></div>
      
      <div class="tg-header">
        <h2 class="tg-title">Trung tâm Thời Chi Môn</h2>
        <button class="tg-refresh-btn" @click="fetchData" :disabled="isLoading">
          {{ isLoading ? 'Đang cộng hưởng...' : 'Tải lại dữ liệu' }}
        </button>
      </div>

      <div class="tg-layout">
        <div class="tg-pane">
          <div class="tg-pane-title">Nút đang kích hoạt</div>
          <div class="tg-content-scroll">
            <template v-if="currentNode">
              <node-detail-view :node="currentNode" />
            </template>
            <div v-else style="text-align: center; color: #666; margin-top: 50px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
                <div style="font-style: italic;">[Cổng đang ở trạng thái ngủ đông, chưa có nhiệm vụ can thiệp]</div>
                
                <button 
                    class="tg-refresh-btn" 
                    style="border-color: #00f0ff; color: #00f0ff; background: rgba(0, 240, 255, 0.05); padding: 10px 25px; font-size: 15px;"
                    onmouseover="this.style.boxShadow='0 0 15px rgba(0, 240, 255, 0.4)'; this.style.background='rgba(0, 240, 255, 0.15)'"
                    onmouseout="this.style.boxShadow='none'; this.style.background='rgba(0, 240, 255, 0.05)'"
                    @click="openTimeGate"
                >
                    🌌 Mở Thời Chi Môn
                </button>
            </div>
          </div>
        </div>

        <div class="tg-pane tg-pane-right">
          <div class="tg-pane-title">Lưu trữ tàn quyển lịch sử</div>
          <div class="tg-content-scroll">
            <div v-if="historyNodes.length === 0" style="text-align: center; color: #666; margin-top: 50px;">
              [Chưa có lịch sử nào được hội tụ thành công]
            </div>
            
            <div 
            class="tg-history-card" 
                v-for="hNode in historyNodes" 
                :key="hNode.id"
                @click="selectedHistoryNode = hNode"
            >
                <button class="tg-delete-btn" @click.stop="deleteHistoryNode(hNode.id)">×</button>
                <div style="font-size: 16px; color: #cda776; margin-bottom: 8px;">
                    {{ hNode.timeline_info.target_historical_time }}
                </div>
                <div style="font-size: 13px; color: #aaa; margin-bottom: 4px;">
                    Điểm giáng lâm: {{ hNode.timeline_info.target_location }}
                </div>
                <div style="font-size: 13px; display: flex; justify-content: flex-start; gap: 30px; padding-right: 80px;">
                    <span style="color: #ff6b6b;">Độ khó: {{ hNode.meta_info.difficulty }}</span>
                    <span style="color: #8a755d;">Tham gia: {{ hNode.meta_info.participants.join(', ') }}</span>
                </div>
                
                <button 
                    class="tg-visibility-toggle" 
                    :class="{ 'is-visible': archiveVisibility[hNode.id] !== false }"
                    @click.stop="toggleVisibility(hNode.id)"
                >
                    {{ archiveVisibility[hNode.id] !== false ? '👁 Đang hiện' : 'Hiện' }}
                </button>
            </div>
          </div>
        </div>
      </div>

      <div class="tg-modal-overlay" v-if="selectedHistoryNode" @click.self="selectedHistoryNode = null">
        <div class="tg-modal-content">
          <button class="tg-modal-close" @click="selectedHistoryNode = null">×</button>
          <div class="tg-pane-title" style="border-radius: 8px 8px 0 0;">Xem chi tiết lưu trữ</div>
          <div class="tg-content-scroll">
            <node-detail-view :node="selectedHistoryNode" />
          </div>
        </div>
      </div>

    </div>
  `,
    components: {
        // 注册内部渲染组件
        'node-detail-view': {
            props: ['node'],
            template: NodeDetailTemplate
        }
    },
    setup() {
        const isLoading = Vue.ref(false);
        const currentNode = Vue.ref(null);
        const historyNodes = Vue.ref([]);
        const selectedHistoryNode = Vue.ref(null);
        const currentBg = Vue.ref('');
        const toast = useMessageToast();

        // ==========================================
        // 新增: 历史档案展示状态持久化逻辑
        // ==========================================
        const savedVisibility = localStorage.getItem('timeGate_archiveVisibility');
        // 默认状态为 true (展示)，未记录的节点也视作展示
        const archiveVisibility = Vue.reactive(savedVisibility ? JSON.parse(savedVisibility) : {});

        Vue.watch(archiveVisibility, (newVal) => {
            localStorage.setItem('timeGate_archiveVisibility', JSON.stringify(newVal));
        }, { deep: true });

        const toggleVisibility = (id) => {
            if (archiveVisibility[id] === undefined) {
                archiveVisibility[id] = false; // 首次点击，从默认 true 变为 false
            } else {
                archiveVisibility[id] = !archiveVisibility[id];
            }
        };

        // 根据 Vera 形态抽取背景
        const updateBackground = () => {
            const form = VeraConfigStore.state.currentForm || 'default';
            const bgList = TIMEGATE_BG_CONFIG[form] || TIMEGATE_BG_CONFIG['default'];
            // 随机抽取一张
            const randomBg = bgList[Math.floor(Math.random() * bgList.length)];
            currentBg.value = `${path_prefix}${randomBg}`;
        };

        const refreshLocalSave = (historyObj) => {
            Object.keys(archiveVisibility).forEach(k => {
                if (!historyObj[k]) delete archiveVisibility[k];
            });
        }

        const fetchData = async () => {
            if (isLoading.value) return;
            isLoading.value = true;
            updateBackground(); // 每次刷新数据时同步刷新背景

            try {
                await veraDataAPI.refreshData();
                const rawData = veraDataAPI.veraData;
                const gateData = rawData["Thời Chi Môn"];

                currentNode.value = gateData["Nút Hiện Tại"] || null;

                // 将Nút Lịch Sử对象转化为数组以便循环
                const historyObj = gateData["Nút Lịch Sử"] || {};
                refreshLocalSave(historyObj);
                historyNodes.value = Object.values(historyObj).sort((a, b) => {
                    // 简单的按进入时间倒序排
                    return new Date(b.timeline_info.real_world_entry_time) - new Date(a.timeline_info.real_world_entry_time);
                });

            } catch (err) {
                console.error("Lỗi lấy dữ liệu Thời Chi Môn:", err);
            } finally {
                isLoading.value = false;
            }
        };

        // 新增: 删除Nút Lịch Sử函数
        const deleteHistoryNode = async (id) => {
            const isConfirmed = await toast.confirmAsync("Bạn có chắc chắn muốn xóa không?");
            if (!isConfirmed) {
                return;
            }
            veraDataAPI.deleteTimeGateHistoryNode(id); // 调用底层删除
            historyNodes.value = historyNodes.value.filter(node => node.id !== id); // 同步刷新前端列表

            // 容错：如果当前正打开着该节点的详情弹窗，则顺便关闭弹窗
            if (selectedHistoryNode.value && selectedHistoryNode.value.id === id) {
                selectedHistoryNode.value = null;
            }
        };

        // ==========================================
        // 新增: 开启Thời Chi Môn函数
        // ==========================================
        const openTimeGate = () => {
            // 这里构造你想要发送给后端的 Prompt
            const promptPayload = {
                action: "open_gate",
                timestamp: Date.now(),
                prompt: "[SYSTEM]: Yêu cầu mở nút Thời Chi Môn mới, trừ điểm FP tùy theo cách mở, và dựa theo quy tắc <Thời Chi Môn·Tạo Phó Bản> để tạo phó bản lịch sử ngẫu nhiên hoặc chỉ định, bao gồm độ khó, cách vào, người tham gia, thời gian và vị trí lịch sử mục tiêu, bối cảnh lịch sử, cốt lõi, hướng đi, sau đó xuất dữ liệu định dạng XML và YAML theo đúng yêu cầu của quy tắc.\n"
            };

            const allTarHisTime = [];
            const timeGateData = veraDataAPI.veraData?.["Thời Chi Môn"]?.["Nút Lịch Sử"];
            if (timeGateData) {
                Object.values(timeGateData).forEach(v => {
                    if (v.timeline_info?.target_historical_time) allTarHisTime.push(v.timeline_info.target_historical_time);
                });
            }


            let finalPrompt = "";
            finalPrompt += promptPayload.prompt;
            if (allTarHisTime.length > 0) finalPrompt += `Lưu ý, dưới đây là các mốc thời gian đã trải qua, không thể tiến vào khoảng thời gian trước/sau 10 năm: ${allTarHisTime.join(", ")}`;
            // 暂时打印到控制台
            //console.log("【时空枢纽指令发送】:", JSON.stringify(promptPayload, null, 2));
            const suc = messageInputer.sendMessage(finalPrompt, false);
            if (suc) toast.showToast('Đã gửi lệnh vào khung chat', 'success');
            else toast.showToast("Gửi thất bại, không rõ nguyên nhân", "warning");
        };

        // 初始加载
        Vue.onMounted(() => {
            VeraConfigStore.load(); // 模拟加载状态
            fetchData();
        });

        return {
            isLoading, fetchData, currentBg,
            currentNode, historyNodes, selectedHistoryNode,
            archiveVisibility, toggleVisibility,
            openTimeGate,
            deleteHistoryNode
        };
    }
};



// === 2. 初始化 Vue 应用 ===
function initVueApp(appContainer, shadowRoot) {

    const { createApp, ref, computed } = window.Vue;

    // 🌟 核心修改 2：在执行 createApp 之前，先唤醒所有外层状态
    initVeraGlobalState(Vue);

    // 注入样式
    renderVueStyles(shadowRoot);

    const app = createApp({
        // 注册刚才定义的组件
        components: { CardOverview, CardDetailModal, DivinationBoard, TimeGateBoard },
        template: `

                <div class="main-backdrop" v-if="isPanelOpen" @click="isPanelOpen = false"></div>

                <div class="toast-container">
                    <transition-group name="toast">
                        <div v-for="toast in globalToast.toasts" :key="toast.id" class="toast-item" :class="'toast-' + toast.type">
                            <div class="toast-icon">
                                <span v-if="toast.type === 'info'">🌌</span>
                                <span v-if="toast.type === 'success'">✨</span>
                                <span v-if="toast.type === 'warning'">⚠️</span>
                                <span v-if="toast.type === 'error'">💥</span>
                                <span v-if="toast.type === 'confirm'">⚖️</span>
                            </div>
                            <div class="toast-content">
                                <div class="toast-msg">{{ toast.message }}</div>
                                
                                <div v-if="toast.isConfirm" class="toast-actions">
                                    <button @click.stop="toast.onCancel()" class="toast-btn toast-btn-cancel">Hủy bỏ</button>
                                    <button @click.stop="toast.onConfirm()" class="toast-btn toast-btn-confirm">
                                        <span style="margin-right:4px;">⚡</span> Xác nhận thực thi
                                    </button>
                                </div>
                            </div>
                            <button v-if="toast.requireClose" @click="globalToast.removeToast(toast.id)" class="toast-close">&times;</button>
                        </div>
                    </transition-group>
                </div>

                <div 
                    v-show="!isPanelOpen"
                    class="floating-sphere"
                    :style="{ left: sphereX + 'px', top: sphereY + 'px' }"
                    @pointerdown.stop.prevent="onSphereDown"
                    @pointerup="onSphereUp"
                    @click.stop.prevent
                >
                ☽
                </div>

                <div class="main-window" v-if="isPanelOpen">
                <div class="window-header">
                    <div class="tabs">
                    <button :class="{ active: activeTab === 'divination' }" @click="activeTab = 'divination'">Bói Tarot</button>
                    <button :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">Tổng Quan Thẻ</button>
                    <button :class="{ active: activeTab === 'timegate' }" @click="activeTab = 'timegate'">Thời Chi Môn</button>
                    <button :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">Cấu Hình</button>
                    </div>
                    <button class="close-btn" @click="isPanelOpen = false">×</button>
                </div>
                
                <div class="window-content">
                    <div v-if="activeTab === 'config'" style="color: #aaa; text-align: center; margin-top: 50px;">
                    <h2>Vị trí lõi hệ thống</h2>
                    <p>Bảng điều khiển này được dành riêng cho việc mở rộng hệ thống sau này...</p>
                    </div>

                    <div v-if="activeTab === 'divination'" style="height: 100%;">
                        <divination-board />
                    </div>
                    
                    <card-overview 
                        v-if="activeTab === 'overview'" 
                        v-model:global3dEnabled="global3dEnabled"
                        @preview="openPreview" 
                    />

                    <div v-if="activeTab === 'timegate'" style="height: 100%;">
                        <time-gate-board />
                    </div>
                </div>
                </div>

                <card-detail-modal 
                v-if="previewCardIndex !== null"
                :card-index="previewCardIndex"
                :initial-style-id="previewStyleId"
                :initial-variation="previewVariation"
                :initial-3d-enabled="global3dEnabled"
                @close="previewCardIndex = null"
                />
            `,


        setup() {

            const isPanelOpen = Vue.ref(false);
            const activeTab = Vue.ref('divination'); // 默认打开总览页
            // 新增: 全局 3D 状态持久化 (控制详情页初始是否具有 3D 效果)
            const saved3D = localStorage.getItem('tarotGlobal3D');
            const global3dEnabled = Vue.ref(saved3D !== null ? JSON.parse(saved3D) : true);
            const globalToast = useMessageToast();

            // 监听变化并存储
            Vue.watch(global3dEnabled, (val) => {
                localStorage.setItem('tarotGlobal3D', JSON.stringify(val));
            });

            // 悬浮球逻辑
            const {
                x: sphereX, y: sphereY,
                onPointerDown: onSphereDown, checkClick
            } = useDraggableSphere(win, doc, Vue);

            const onSphereUp = (e) => {
                // 只有当没有发生实质性拖拽时，才认为是点击事件，打开面板
                if (checkClick()) {
                    isPanelOpen.value = true;
                }
            };
            // 新增: 处理主面板的全局 ESC 事件 (解决层级冲突)
            const handleGlobalEsc = (e) => {
                if (e.key === 'Escape') {
                    // 【核心拦截】如果详情弹窗正在显示，说明用户是想关弹窗，主面板不作为
                    if (previewCardIndex.value !== null) {
                        return;
                    }

                    // 否则，如果主面板开着，关闭主面板
                    if (isPanelOpen.value) {
                        isPanelOpen.value = false;
                    }
                }
            };

            // 在根组件挂载时监听全局键盘事件
            Vue.onMounted(() => {
                win.addEventListener('keydown', handleGlobalEsc);
            });

            Vue.onUnmounted(() => {
                win.removeEventListener('keydown', handleGlobalEsc);
            });

            // 预览弹窗逻辑
            const previewCardIndex = Vue.ref(null);
            const previewStyleId = Vue.ref('');
            const previewVariation = Vue.ref(1);

            const openPreview = (index) => {
                previewCardIndex.value = index;
                // 提取该卡片在总览中配置的全局状态，传递给弹窗作为初始状态
                previewStyleId.value = globalCardConfigs[index].styleId;
                previewVariation.value = globalCardConfigs[index].variation;
            };

            const onMessageReceived = async () => {
                setTimeout(async () => {
                    await veraDataAPI.fetchData();
                    //console.log("历史", veraDataAPI.veraData);
                    const tarotHistory = veraDataAPI.veraData?.["Kết Quả Bói Toán"];
                    const deleteId = [];
                    if (tarotHistory) {
                        const lstFloor = getLastMessageId();
                        Object.entries(tarotHistory).forEach(([id, his]) => {
                            const startFloor = Number(his.start_floor) || -1;
                            //console.log("当前层，记录层", lstFloor, startFloor);
                            if (startFloor < 0 || (lstFloor - startFloor > TAROT_MAX_REMAIN_FLOOR)) {
                                veraDataAPI.deleteTarotRecord(id);
                                console.log(`Bói toán đã hết hạn, đã xóa ${id}`);
                            }

                        });
                    }
                }, 500);

            };

            Vue.onMounted(async () => {
                await waitGlobalInitialized('Mvu');
                eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, onMessageReceived);
            });


            return {
                isPanelOpen, activeTab,
                global3dEnabled, globalToast,
                sphereX, sphereY, onSphereDown, onSphereUp,
                previewCardIndex, previewStyleId, previewVariation, openPreview
            };
        }


    });

    // ====== 【关键修复：将实例暴露给全局】 ======
    // 将当前刚创建的 app 实例挂载到父窗口的 window 上，供下次重载脚本时寻找并销毁
    win[WIN_APP_ID] = app;
    // 挂载到我们创建的实体 DOM 上
    app.mount(appContainer);
}

function renderVueStyles(shadowRoot) {
    if (shadowRoot.getElementById(STYLE_ID)) return;
    const css = `
               /* 基础页面样式 */
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #121212;
            font-family: system-ui, -apple-system, sans-serif;
        }

        #app {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* === 卡片核心变量 === */
        :root {
            --card-width: 320px;
            --card-height: 460px;
            --primary-color: #d4af37;
            /* 卡片主题色：金色 */
        }

        /* === 3D 容器 === */
        /* 修改: 移除绝对宽高，采用自适应和最大值限制 */
        .card-container {
            /* 初始限制大小，等图片加载后会动态应用 aspect-ratio  max-width: 90vw; max-height: 85vh;*/

            perspective: 1200px;
            cursor: pointer;
            /* 居中对齐内容 */
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* === 倾斜层 (由 JS 动态控制) === */
        .card-tilt {
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            will-change: transform;
            /* 开启硬件加速，保证丝滑 */
        }

        /* 翻转层：独立于倾斜层，确保关闭 3D 时也能工作 */
        .card-flip {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
        }

        .card-flip.is-flipped {
            transform: rotateY(180deg);
        }

        /* === 卡片正反面通用样式 === */
        /* 修改: 正面与背面现在仅用于包裹图片 */
        .card-face {
            position: absolute;
            inset: 0;
            backface-visibility: hidden;
            border-radius: 12px;
            /* 塔罗牌圆角通常较小 */
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            background-color: transparent;
            background-color: #121212;
            /* 给牌面一个基础底色 */
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            /* 保证图片不畸形 */
            display: block;
        }

        /* === 正面视觉设计 === */
        .face-front {
            background: linear-gradient(135deg, #2a2a35 0%, #1a1a24 100%);
            display: flex;
            flex-direction: column;
            padding: 24px;
            box-sizing: border-box;
            color: white;
        }

        .card-header {
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 12px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 2px;
        }

        .card-type {
            font-size: 12px;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .card-image-placeholder {
            flex: 1;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border: 1px solid rgba(212, 175, 55, 0.3);
            margin-bottom: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: rgba(255, 255, 255, 0.3);
            font-size: 14px;
        }

        .card-description {
            font-size: 14px;
            line-height: 1.6;
            color: #a0a0b0;
        }

        /* 背面容器：居中显示 SVG */
        .face-back {
            transform: rotateY(180deg);
            display: flex;
            justify-content: center;
            align-items: center;
            /* 添加一些深邃的背景渐变和暗纹 */
            background: radial-gradient(circle at 50% 50%, #1a1a24 0%, #0d0d12 100%);
            border: 2px solid #d4af37;
        }

        .back-logo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 4px solid var(--primary-color);
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--primary-color);
            font-weight: bold;
            font-size: 20px;
            background-color: #121212;
        }

        /* 修改: 七彩全息反光层 (Holographic Foil Effect) */
        .glare {
            position: absolute;
            inset: 0;
            /* 七彩渐变带，模拟光栅效果 */
            /* 极窄的高光带，模拟锋利的折射光 */
            background: linear-gradient(105deg,
                    transparent 35%,
                    rgba(255, 100, 100, 0.15) 43%,
                    rgba(255, 255, 100, 0.15) 46%,
                    rgba(100, 255, 100, 0.15) 49%,
                    rgba(100, 255, 255, 0.15) 52%,
                    rgba(100, 100, 255, 0.15) 55%,
                    transparent 63%);
            /* 放大背景尺寸以便于移动 */
            background-size: 300% 300%;
            mix-blend-mode: color-dodge;
            /* 使用颜色减淡以防止覆盖原图黑色部分 */
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
            z-index: 10;
        }

        /* 外部控制面板样式 */
        .controls-panel {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(30, 30, 30, 0.8);
            padding: 15px;
            border-radius: 8px;
            color: white;
            z-index: 100;
            display: flex;
            flex-direction: column;
            gap: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* ==========================================
        新增: 悬浮球、主面板、概览视图样式
        ========================================== */
        .floating-sphere {
            position: fixed;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            /* 银灰金属质感的渐变，深邃且不刺眼 */
            background: radial-gradient(circle at 30% 30%, #e9e3e3, #4666a2, #1c2b4a);/* radial-gradient(circle at 30% 30%, #d1d5db, #6b7280, #111827);*/
            box-shadow: 0 4px 15px rgba(107, 114, 128, 0.5), inset 0 -4px 10px rgba(0, 0, 0, 0.7);
            cursor: grab;
            z-index: 20;
            display: flex;
            justify-content: center;
            align-items: center;
            /* 银色弧月图案样式 */
            color: #f3f4f6;
            text-shadow: 0 0 8px rgba(229, 231, 235, 0.8), 0 0 15px rgba(255, 255, 255, 0.4);
            font-size: 32px;
            font-weight: normal;
            user-select: none;
            touch-action: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .floating-sphere:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(156, 163, 175, 0.7), inset 0 -4px 10px rgba(0, 0, 0, 0.7);
        }
        
        .floating-sphere:active {
            cursor: grabbing;
            transform: scale(0.95);
        }

        /* 修改: 主面板边缘与阴影转为蓝色系 */
        .main-window {
            position: fixed;
            /* 移除 inset: 5vh 5vw; */
            top: 5vh;
            left: 5vw;
            width: 90vw;
            height: 90vh;
            background: rgba(10, 10, 20, 0.95);
            /* 更深的星空黑 */
            border: 1px solid rgba(0, 150, 255, 0.4);
            border-radius: 16px;
            z-index: 9000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0, 20, 50, 0.9), 0 0 20px rgba(0, 150, 255, 0.1) inset;
        }

        .window-header {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            background: rgba(0, 0, 0, 0.6);
            border-bottom: 1px solid rgba(0, 150, 255, 0.2);
        }

        .tabs button {
            background: transparent;
            color: #aaa;
            border: none;
            font-size: 16px;
            margin-right: 20px;
            cursor: pointer;
            padding-bottom: 5px;
        }

        .tabs button.active {
            color: #00f0ff;
            border-bottom: 2px solid #00f0ff;
        }

        .close-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        }

        .window-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        /* 概览网格 */
        .overview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 25px;
        }

        .thumbnail-card {
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.03);
            padding: 10px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .thumbnail-img {
            width: 100%;
            aspect-ratio: 1 / 1.5;
            object-fit: cover;
            border-radius: 4px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            background: #000;
        }

        .thumbnail-img:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 150, 255, 0.4);
        }

        .card-controls {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .card-controls select {
            background: #222;
            color: #fff;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 4px;
        }

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-top: 20px;
            color: white;
        }

        .pagination button {
            background: #333;
            color: white;
            border: none;
            padding: 5px 15px;
            border-radius: 4px;
            cursor: pointer;
        }

        .pagination button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* 详情弹窗 (接管原本的舞台全屏显示) */
        .detail-modal {
            position: fixed;
            /* 移除 inset: 0; */
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
        }

        /* ==========================================
        新增: 遮罩层与总览控制栏样式
        ========================================== */
        .main-backdrop {
            position: fixed;
            /* 移除 inset: 0; */
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 999;
            width: 100vw;
            height: 100vh;
        }

        .overview-controls-bar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            color: #fff;
            background: rgba(0, 150, 255, 0.1);
            padding: 12px 18px;
            border-radius: 8px;
            border: 1px solid rgba(0, 150, 255, 0.2);
            font-size: 14px;
        }

        /* ==========================================
   新增: 详情面板控制栏折叠样式
   ========================================== */
        .detail-controls-wrapper {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 2010;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }

        .controls-toggle-btn {
            background: rgba(0, 150, 255, 0.1);
            border: 1px solid rgba(0, 150, 255, 0.4);
            color: #00f0ff;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            backdrop-filter: blur(4px);
            transition: all 0.3s;
        }

        .controls-toggle-btn:hover {
            background: rgba(0, 150, 255, 0.3);
            box-shadow: 0 0 10px rgba(0, 150, 255, 0.4);
        }

        .detail-controls-panel {
            background: rgba(10, 10, 20, 0.9);
            border: 1px solid rgba(0, 150, 255, 0.3);
            padding: 15px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            color: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
        }

        /* ==========================================
   修改: 占卜面板响应式布局 (适配小屏)
   ========================================== */
        .divination-board {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            /* 允许在小屏幕上向下滚动，而不是隐藏截断 */
            justify-content: flex-start;
            padding-top: 30px;
            padding-bottom: 50px;
            overflow-y: auto;
        }

        /* 幽暗的背景层 */
        .divination-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            opacity: 0.5;
            /* 调低亮度作为背景 */
            z-index: 0;
            pointer-events: none;
        }

        /* 控制台栏 */
        .divination-controls {
            position: relative;
            z-index: 10;
            display: flex;
            flex-wrap: wrap;
            /* 核心：允许控制项自动换行 */
            justify-content: center;
            gap: 12px;
            margin-bottom: 30px;
            background: rgba(0, 20, 40, 0.7);
            padding: 15px;
            border-radius: 12px;
            border: 1px solid rgba(0, 150, 255, 0.4);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            width: 90%;
            /* 防止在大屏上拉得太长，在小屏上留出边距 */
            max-width: 800px;
        }

        .divination-controls select,
        .divination-controls input {
            background: rgba(10, 10, 20, 0.8);
            color: #00f0ff;
            border: 1px solid rgba(0, 150, 255, 0.5);
            border-radius: 6px;
            padding: 6px 12px;
            max-width: 100%;
            /* 防止输入框撑破屏幕 */
        }

        .divination-btn {
            background: rgba(0, 150, 255, 0.2);
            color: #fff;
            border: 1px solid #00f0ff;
            padding: 3px 10px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .divination-btn:hover {
            background: rgba(0, 150, 255, 0.5);
            box-shadow: 0 0 10px #00f0ff;
        }

        .divination-btn-danger {
            border-color: #ff4444;
            color: #ff4444;
        }

        .divination-btn-danger:hover {
            background: rgba(255, 68, 68, 0.2);
            box-shadow: 0 0 10px #ff4444;
        }

        /* ==========================================
   修改: 占卜台牌面大小样式
   ========================================== */
        .spread-slots {
            position: relative;
            z-index: 10;
            display: flex;
            gap: 5vw;
            /* 从固定的 40px 改为动态视口宽度，防止大牌重叠 */
            flex-wrap: wrap;
            /* 屏幕较窄时允许换行 */
            justify-content: center;
        }

        .slot-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        .slot-label {
            color: #00f0ff;
            font-size: 16px;
            letter-spacing: 2px;
            text-shadow: 0 0 5px rgba(0, 150, 255, 0.5);
        }

        .slot-frame {
            /* 从 180px 改为响应式大小，显著放大牌面 */
            width: 18vw;
            max-width: 280px;
            min-width: 180px;

            aspect-ratio: 1 / 1.5;
            border: 2px dashed rgba(0, 150, 255, 0.2);
            border-radius: 12px;
            position: relative;
            perspective: 1000px;
        }

        /* 抽牌与翻转动画 */
        .divi-card {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
        }

        .divi-card.is-flipped {
            transform: rotateY(180deg);
        }

        .divi-face {
            position: absolute;
            inset: 0;
            backface-visibility: hidden;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(0, 150, 255, 0.3);
            overflow: hidden;
        }

        /* 牌背复用样式 */
        .divi-back {
            background: radial-gradient(circle at 50% 50%, #1a1a24 0%, #0d0d12 100%);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* 牌面样式 (包含逆位旋转) */
        .divi-front {
            transform: rotateY(180deg);
            background: #000;
        }

        .divi-front img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .is-reversed img {
            transform: rotateZ(180deg);
        }

        /* 逆位图像翻转 */

        /* 进场动画 */
        .deal-enter-active {
            transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .deal-enter-from {
            opacity: 0;
            transform: translateY(100px) scale(0.5);
        }

        .deal-enter-to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* 美化版悬浮寓意框 */
        .meaning-tooltip {
            position: absolute;
            bottom: -90px;
            left: 50%;
            transform: translateX(-50%);
            width: 220px;
            background: rgba(5, 10, 20, 0.9);
            border: 1px solid rgba(0, 150, 255, 0.6);
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 150, 255, 0.2) inset;
            color: #ddd;
            font-size: 13px;
            line-height: 1.5;
            text-align: center;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 20;
        }

        .meaning-tooltip .title {
            color: #00f0ff;
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .slot-frame:hover .meaning-tooltip {
            opacity: 1;
        }



        /* ==========================================
           新增: 占卜历史记录模态框样式 (神秘学风格)
           ========================================== */
        .divi-history-overlay {
            position: absolute;
            inset: 0;
            background: rgba(5, 5, 15, 0.85);
            backdrop-filter: blur(8px);
            z-index: 50;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .divi-history-content {
            background: linear-gradient(180deg, rgba(15, 15, 30, 0.95), rgba(5, 5, 15, 0.95));
            border: 1px solid rgba(138, 43, 226, 0.5); /* 神秘紫边框 */
            border-radius: 12px;
            width: 100%;
            max-width: 800px;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 40px rgba(138, 43, 226, 0.2), inset 0 0 20px rgba(0, 150, 255, 0.1);
        }

        .divi-history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 25px;
            border-bottom: 1px solid rgba(138, 43, 226, 0.3);
            background: rgba(0, 0, 0, 0.4);
            border-radius: 12px 12px 0 0;
        }

        .divi-history-title {
            color: #d4af37;
            font-size: 20px;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
            margin: 0;
        }

        .divi-history-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            scrollbar-width: thin;
            scrollbar-color: rgba(138, 43, 226, 0.5) rgba(10, 10, 20, 0.3);
        }

        /* 针对 Webkit 内核的滚动条微调 */
        .divi-history-body::-webkit-scrollbar { width: 6px; }
        .divi-history-body::-webkit-scrollbar-track { background: rgba(10, 10, 20, 0.3); }
        .divi-history-body::-webkit-scrollbar-thumb { background: rgba(138, 43, 226, 0.4); border-radius: 4px; }
        
        /* 修改: 为占卜历史卡片添加相对定位，以便定位右上角删除键 */
        .divi-history-card {
            position: relative; /* 新增 */
            background: rgba(20, 20, 40, 0.6);
            border: 1px solid rgba(0, 150, 255, 0.2);
            border-left: 3px solid #8a2be2;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            transition: all 0.3s;
        }

        .divi-history-card:hover {
            box-shadow: 0 5px 15px rgba(138, 43, 226, 0.2);
            border-color: rgba(138, 43, 226, 0.5);
        }

        .divi-h-question {
            color: #00f0ff;
            font-size: 16px;
            margin-bottom: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .divi-h-cards {
            display: flex;
            gap: 10px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }

        .divi-h-card-item {
            background: rgba(0, 0, 0, 0.5);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 13px;
            color: #ddd;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .divi-h-tendency {
            color: #d4af37;
            font-size: 14px;
            margin-bottom: 10px;
            font-style: italic;
        }

        .divi-h-interpretations {
            color: #aaa;
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 12px;
            padding-left: 10px;
            border-left: 2px dashed rgba(255, 255, 255, 0.1);
        }

        .divi-h-overall {
            background: rgba(138, 43, 226, 0.1);
            padding: 12px;
            border-radius: 6px;
            color: #eee;
            font-size: 14px;
            line-height: 1.5;
            border: 1px dashed rgba(138, 43, 226, 0.3);
        }

        /* ==========================================
   新增: Thời Chi Môn (厚重、历史感) 样式
   ========================================== */
        .timegate-board {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            color: #e0d6c8;
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
            /* 古典衬线体 */
            overflow: hidden;
        }

        .tg-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            opacity: 0.75;
            z-index: 0;
            pointer-events: none;
            /* 2. 减弱复古滤镜的强度，让原图细节更清晰，稍微压暗防止刺眼 */
            filter: sepia(0.2) contrast(1.1) brightness(0.8);
        }

        .tg-header {
            position: relative;
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 30px;
            background: linear-gradient(to right, rgba(20, 15, 10, 0.9), rgba(40, 30, 20, 0.7), rgba(20, 15, 10, 0.9));
            border-bottom: 2px solid #8a755d;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.8);
        }

        .tg-title {
            font-size: 24px;
            color: #d4af37;
            letter-spacing: 4px;
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
            margin: 0;
        }

        .tg-refresh-btn {
            background: rgba(138, 117, 93, 0.2);
            color: #d4af37;
            border: 1px solid #8a755d;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            font-size: 14px;
            transition: all 0.3s;
        }

        .tg-refresh-btn:hover {
            background: rgba(212, 175, 55, 0.2);
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
        }

        .tg-refresh-btn:disabled {
            opacity: 0.5;
            cursor: wait;
        }

        /* 响应式布局：小屏上下，大屏左右 */
        .tg-layout {
            position: relative;
            z-index: 10;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px;
            overflow-y: auto;
        }

        @media (min-width: 900px) {
            .tg-layout {
                flex-direction: row;
                overflow-y: hidden;
            }
        }

        .tg-pane {
            flex: 1;
            /* 3. 降低面板自身底色的不透明度，从 0.85 降至 0.6 */
            background: rgba(20, 15, 12, 0.6);
            border: 1px solid #5c4b37;
            border-radius: 8px;
            box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8), 0 10px 20px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            overflow: hidden;

        }

        .tg-pane-right {
            flex: 0.8;
        }

        /* 历史记录稍微窄一点 */

        .tg-pane-title {
            text-align: center;
            padding: 12px;
            background: rgba(0, 0, 0, 0.6);
            border-bottom: 1px dashed #5c4b37;
            color: #cda776;
            font-size: 18px;
            letter-spacing: 2px;
        }

        .tg-content-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            scrollbar-width: thin;
            scrollbar-color: #5c4b37 #140f0c;
        }

        /* 节点详情排版 */
        .tg-section {
            margin-bottom: 25px;
        }

        .tg-section-title {
            color: #d4af37;
            font-size: 16px;
            border-left: 3px solid #d4af37;
            padding-left: 10px;
            margin-bottom: 15px;
        }

        .tg-kv {
            display: flex;
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.6;
        }

        .tg-k {
            color: #e0be98;
            width: 100px;
            flex-shrink: 0;
        }

        .tg-v {
            color: #e0d6c8;
        }

        .tg-log-day {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(138, 117, 93, 0.3);
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 4px;
        }

        .tg-log-title {
            color: #cda776;
            margin-bottom: 8px;
            font-style: italic;
        }

        .tg-list {
            margin: 0;
            padding-left: 20px;
            color: #bbb;
            font-size: 13.5px;
        }

        .tg-list li {
            margin-bottom: 5px;
        }

        .tg-butterfly {
            color: #9a8c98;
            margin-top: 8px;
            border-top: 1px dashed #444;
            padding-top: 8px;
        }

        /* Nút Lịch Sử缩略卡片 */
        .tg-history-card {
            background: linear-gradient(135deg, rgba(30, 25, 20, 0.9), rgba(15, 12, 10, 0.9));
            border: 1px solid #5c4b37;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }

        .tg-history-card:hover {
            border-color: #d4af37;
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.15);
            transform: translateX(5px);
        }

        .tg-history-card::before {
            content: '📜';
            position: absolute;
            right: 15px;
            top: 15px;
            opacity: 0.5;
            font-size: 24px;
        }

        /* 历史详情模态框 */
        .tg-modal-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(4px);
            z-index: 50;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .tg-modal-content {
            background: rgba(20, 15, 12, 0.95);
            border: 2px solid #8a755d;
            border-radius: 8px;
            width: 100%;
            max-width: 800px;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.9);
        }

        .tg-modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            color: #8a755d;
            font-size: 28px;
            cursor: pointer;
        }

        .tg-modal-close:hover {
            color: #d4af37;
        }

        /* 新增: 统一的右上角删除按钮样式 */
        .tg-delete-btn, .divi-delete-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.3);
            font-size: 18px;
            cursor: pointer;
            line-height: 1;
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s;
            z-index: 10; /* 确保层级在卡片装饰图标之上 */
        }
        .tg-delete-btn:hover, .divi-delete-btn:hover {
            color: #ff4444;
            background: rgba(255, 68, 68, 0.15);
        }

        /* ==========================================
   新增: 历史档案显隐控制按钮样式
   ========================================== */
        .tg-visibility-toggle {
            position: absolute;
            bottom: 12px;
            right: 15px;
            background: rgba(20, 15, 12, 0.8);
            border: 1px solid #5c4b37;
            color: #8a755d;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            z-index: 2;
            /* 确保层级高于卡片本身，避免被覆盖 */
            transition: all 0.3s ease;
            font-family: inherit;
        }

        .tg-visibility-toggle:hover {
            color: #d4af37;
            border-color: #d4af37;
        }

        .tg-visibility-toggle.is-visible {
            color: #d4af37;
            border-color: #d4af37;
            background: rgba(212, 175, 55, 0.1);
            box-shadow: 0 0 8px rgba(212, 175, 55, 0.2);
        }


        /* ==========================================
   新增: 全局与面板自定义滚动条 (幽蓝风格)
   ========================================== */

        /* 针对 Firefox 的标准属性 */
        .window-content,
        .divination-board {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 150, 255, 0.5) rgba(10, 10, 20, 0.3);
        }

        /* 针对 Webkit 内核 (Chrome, Safari, Edge) 的自定义样式 */
        .window-content::-webkit-scrollbar,
        .divination-board::-webkit-scrollbar {
            width: 6px;
            /* 滚动条宽度 */
            height: 6px;
            /* 横向滚动条高度（如果有） */
        }

        /* 滚动条轨道 (背景) */
        .window-content::-webkit-scrollbar-track,
        .divination-board::-webkit-scrollbar-track {
            background: rgba(10, 10, 20, 0.3);
            /* 极暗的深蓝色背景 */
            border-radius: 4px;
        }

        /* 滚动条滑块 */
        .window-content::-webkit-scrollbar-thumb,
        .divination-board::-webkit-scrollbar-thumb {
            background: rgba(0, 150, 255, 0.4);
            /* 半透明幽蓝 */
            border-radius: 4px;
            border: 1px solid rgba(0, 150, 255, 0.2);
            /* 细微的发光边框 */
        }

        /* 鼠标悬浮在滑块上的效果 */
        .window-content::-webkit-scrollbar-thumb:hover,
        .divination-board::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 150, 255, 0.8);
            /* 提亮 */
            box-shadow: 0 0 8px rgba(0, 150, 255, 0.6);
            /* 增加辉光 */
        }

                /* ==========================================
           新增: 星界提示 (Toast UI) 样式
           ========================================== */
        .toast-container {
            position: fixed;
            top: 20px;
            left: 50%; /* 核心修改: 移到屏幕水平中间 */
            transform: translateX(-50%); /* 核心修改: 往回拉自身宽度的一半，实现绝对居中 */
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center; /* 核心修改: 让内部弹出的每一条通知也居中对齐 */
            gap: 12px;
            pointer-events: none; /* 让容器不阻挡底层点击 */
        }

        .toast-item {
            pointer-events: auto; /* 恢复自身点击 */
            display: flex;
            align-items: flex-start;
            padding: 12px 16px;
            border-radius: 8px;
            backdrop-filter: blur(12px);
            border: 1px solid transparent;
            min-width: 300px;
            max-width: 32rem;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
        }

        /* 各级别主题色 */
        .toast-info { background: rgba(30, 58, 138, 0.8); border-color: #60a5fa; color: #dbeafe; box-shadow: 0 0 15px rgba(59,130,246,0.4); }
        .toast-success { background: rgba(6, 78, 59, 0.8); border-color: #34d399; color: #d1fae5; box-shadow: 0 0 15px rgba(16,185,129,0.4); }
        .toast-warning { background: rgba(120, 53, 15, 0.8); border-color: #fbbf24; color: #fef3c7; box-shadow: 0 0 15px rgba(245,158,11,0.4); }
        .toast-error { background: rgba(69, 10, 10, 0.9); border-color: #ef4444; color: #fee2e2; box-shadow: 0 0 20px rgba(239,68,68,0.7); }
        .toast-confirm { background: rgba(59, 7, 100, 0.9); border-color: #a855f7; color: #f3e8ff; box-shadow: 0 0 20px rgba(168,85,247,0.5); }

        /* 内部元素排版 */
        .toast-icon { margin-right: 12px; font-size: 1.125rem; line-height: 1; margin-top: 2px; }
        .toast-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .toast-msg { font-size: 0.875rem; font-weight: 500; line-height: 1.5; white-space: pre-wrap; }
        .toast-close { margin-left: 16px; color: rgba(255, 255, 255, 0.5); font-size: 1.5rem; background: none; border: none; cursor: pointer; line-height: 1; }
        .toast-close:hover { color: #fff; }

        /* 抉择按钮区 */
        .toast-actions { margin-top: 12px; display: flex; gap: 12px; justify-content: flex-end; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; }
        .toast-btn { padding: 6px 16px; border-radius: 6px; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .toast-btn-cancel { background: rgba(31, 41, 55, 0.8); color: #d1d5db; border-color: #4b5563; }
        .toast-btn-cancel:hover { background: rgba(55, 65, 81, 1); }
        .toast-btn-confirm { background: rgba(127, 29, 29, 0.8); color: #fee2e2; border-color: #ef4444; box-shadow: 0 0 10px rgba(239,68,68,0.5); display: flex; align-items: center; }
        .toast-btn-confirm:hover { background: rgba(185, 28, 28, 1); }

        /* 进出场动画 (改为垂直方向) */
        .toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .toast-enter-from { opacity: 0; transform: translateY(-30px) scale(0.95); } /* 从上方轻微缩放出现 */
        .toast-leave-to { opacity: 0; transform: translateY(-30px) scale(0.95); }
    
    `;
    const style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;

    // 🌟 核心修改：添加到 shadowRoot
    shadowRoot.appendChild(style);
}

$(async function () {
    bootstrapVueWidget();
});

//# sourceURL=my_debug_core_vera.js