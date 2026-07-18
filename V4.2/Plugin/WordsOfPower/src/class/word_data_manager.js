/**
 * 咒字数据解析与标准化工具
 */
export class WordParser {
    /**
     * 解析效果咒字
     * @param {string} keyName - 中文键名 (如 "火焰爆破")
     * @param {Object} rawData - 原始对象
     */
    static parseEffectWord(keyName, rawData = {}) {
        // 1. 初始化标准结构 (带默认值兜底)
        const parsedData = {
            uid: rawData.uid || `effect_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: keyName,
            quality: rawData['Phẩm chất'] || 'Thông thường',
            type: rawData['Loại hình'] || 'Chủ động',
            tags: [],
            damage: null,
            action_cost: { standard: 0, move: 0, swift: 0, free: 0, raw: '' },
            extra_cost: { hp: 0, mp: 0, sp: 0 },
            save_type: { type: 'Không', on_save: 'Không' },
            target_limit: ['Tự do'],
            duration: { raw: 'Ngay lập tức' }, // Dự phòng cấu trúc đối tượng, hiện tại lưu vào raw trước
            boost: { total_level: 0 },
            overall_desc: "",
            effect_desc: {},
            effect: {}
        };

        // 2. Trích xuất nhãn và uy lực (sát thương)
        const rawTags = Array.isArray(rawData['Nhãn']) ? rawData['Nhãn'] : [];
        rawTags.forEach(tag => {
            if (typeof tag === 'string') {
                if (tag.startsWith('Uy lực:')) {
                    parsedData.damage = tag.substring(7).trim(); // Trích xuất "xxx"
                }
                parsedData.tags.push(tag); // Vẫn giữ lại trong tags để truy xuất nhanh
            }
        });

        // 3. Phân tích tiêu hao (ví dụ: "Hành động:500mp")
        const rawCostStr = String(rawData['Tiêu hao'] || '');
        parsedData.action_cost.raw = rawCostStr;
        
        // Trích xuất loại hành động
        if (rawCostStr.includes('Tốc độ')) parsedData.action_cost.swift = 1;
        else if (rawCostStr.includes('Hành động')) parsedData.action_cost.move = 1;
        else if (rawCostStr.includes('Tự do')) parsedData.action_cost.free = 1;
        else if (rawCostStr.includes('Tấn công')) parsedData.action_cost.standard = 1;
        
        // 消耗数值提取 (正则匹配数字 + hp/mp/sp)
        const mpMatch = rawCostStr.match(/(\d+)\s*mp/i);
        const hpMatch = rawCostStr.match(/(\d+)\s*hp/i);
        const spMatch = rawCostStr.match(/(\d+)\s*sp/i);
        if (mpMatch) parsedData.extra_cost.mp = parseInt(mpMatch[1], 10);
        if (hpMatch) parsedData.extra_cost.hp = parseInt(hpMatch[1], 10);
        if (spMatch) parsedData.extra_cost.sp = parseInt(spMatch[1], 10);

        // 4. 解析效果对象 (核心分类逻辑)
        const rawEffects = rawData['Hiệu ứng'] || {};
        for (const [eName, eDesc] of Object.entries(rawEffects)) {
            const valStr = String(eDesc).trim();

            // Khớp các khóa đặc biệt đã thiết lập sẵn: xử lý lỗi "Tăng cường cực hạn", "Tăng cường-2", "Tăng cường(Cực hạn)" v.v.
            const boostMatch = eName.match(/^(?:Cực hạn\s*Tăng cường|Tăng cường[\s\-\(]*(\d+|Cực hạn)?[\)]*)$/);
            
            if (boostMatch) {
                let levelKey = 1; // Mặc định là tăng cường 1 tầng
                
                // Chỉ cần tên khóa chứa "Cực hạn" thì thống nhất quy về đột phá cực hạn
                if (eName.includes('Cực hạn')) {
                    levelKey = 'limit';
                } else if (boostMatch[1]) {
                    levelKey = parseInt(boostMatch[1], 10);
                }
                
                parsedData.boost[levelKey] = { add_desc: valStr };
                
                // Cập nhật ghi chép tầng cao nhất
                if (levelKey !== 'limit') {
                    parsedData.boost.total_level = Math.max(parsedData.boost.total_level, levelKey);
                } else if (parsedData.boost.total_level === 0) {
                    parsedData.boost.total_level = 1; // Khi tồn tại đột phá cực hạn, ghi chép bảo đảm tối thiểu là 1 tầng
                }
            }
            else if (eName === 'Miễn nhiễm') {
                // Tương thích phân tách dấu phẩy cả Trung và Anh, ví dụ: "Ý chí, nếu vượt qua thì vô hiệu"
                const parts = valStr.split(/[,，]/);
                parsedData.save_type.type = parts[0]?.trim() || 'Không';
                parsedData.save_type.on_save = parts[1]?.trim() || 'Không';
            } 
            else if (eName === 'Giới hạn mục tiêu') {
                // Tách thành mảng, ví dụ: "Cá nhân, lựa chọn" -> ['Cá nhân', 'Lựa chọn']
                parsedData.target_limit = valStr.split(/[,，]/).map(s => s.trim()).filter(Boolean);
            } 
            else if (eName === 'Thời gian duy trì') {
                parsedData.duration.raw = valStr;
            } 
            else {
                // Các trường còn lại đều là hiệu ứng chú tự thực tế, đặt vào điểm gắn kết độc lập
                parsedData.effect_desc[eName] = valStr;
                parsedData.effect[eName] = null; // Để trống chỗ cho các thao tác ràng buộc tập lệnh JS sau này
            }
        }

        // Mô tả dự phòng, tránh việc LLM đọc phải đối tượng rỗng
        if (Object.keys(parsedData.effect_desc).length === 0) {
            parsedData.effect_desc['Hiệu ứng mặc định'] = "Không có mô tả";
        }

        return parsedData;
    }

    /**
     * 解析超魔咒字 (同步适配最新需求)
     */
    static parseMetaWord(keyName, rawData = {}) {
        let parsedMp = 0;
        const rawCostStr = String(rawData['Tiêu hao'] || rawData['Tiêu hao bổ sung'] || '');
        const match = rawCostStr.match(/(\d+)\s*mp/i);
        if (match) parsedMp = parseInt(match[1], 10);

        let modTarget = [];
        const rawEffects = rawData["Hiệu ứng"] || {};
        const rawTarget = rawEffects['Điều chỉnh'] || rawData['mod_target'];
        if (typeof rawTarget === 'string') {
            modTarget = rawTarget.split(/[\s,，]+/).filter(Boolean);
        } else if (Array.isArray(rawTarget)) {
            modTarget = rawTarget;
        }

        return {
            uid: rawData.uid || `meta_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: keyName,
            quality_limit: rawData['Vị trí vòng'] || rawData['Phẩm chất'] || 'Thông thường', // Trích xuất trực tiếp tên phẩm chất
            mod_target: modTarget.length > 0 ? modTarget : ['Phép thuật'],
            extra_cost: { hp: 0, mp: parsedMp, sp: 0 },
            overall_desc: "",
            effect_desc: { [keyName]: rawData['Mô tả'] || 'Không có mô tả' },
            effect: { [keyName]: null } 
        };
    }
}

// 假设在文件顶部已经导入了标准化的自带数据
// import { EFFECT_WORDS_DB } from './Database/effect_words_db.js';
// import { META_WORDS_DB } from './Database/meta_words_db.js';
// import { TARGET_WORDS_DB } from './Database/target_words_db.js';

export class WordDataManager {
    constructor(domainType = 'chat') {
        this.domain = { type: domainType };
        this.basePath = 'words_of_power_dlc.words_of_power_db';
        
        // 数据池分层管理，包含目标、效果、超魔三类
        this.cache = {
            builtIn: { effect_words: {}, meta_words: {}, target_words: {} },
            custom: { effect_words: {}, meta_words: {}, target_words: {} }
        };
        
        // 给系统其余部分使用的高速只读视图
        this.activeDictionary = { effect_words: {}, meta_words: {}, target_words: {} };
        
        // 性能优化：脏标记
        this.isDirty = false;
    }

    /**
     * 游戏加载时调用一次：直接装载标准数据，无解析损耗
     * @param {Object} builtInEffects 导入的自带效果咒字
     * @param {Object} builtInMetas   导入的自带超魔咒字
     * @param {Object} builtInTargets 导入的自带目标咒字
     */
    init(builtInEffects = {}, builtInMetas = {}, builtInTargets = {}) {
        // 1. 直接挂载标准化的自带数据
        this.cache.builtIn.effect_words = builtInEffects;
        this.cache.builtIn.meta_words = builtInMetas;
        this.cache.builtIn.target_words = builtInTargets;

        // 2. 从 ST 获取玩家自定义数据，假设已经是标准格式，直接挂载
        const vars = getVariables(this.domain);
        const stData = _.get(vars, this.basePath) || {};
        
        this.cache.custom.effect_words = stData.effect_words || {};
        this.cache.custom.meta_words = stData.meta_words || {};
        this.cache.custom.target_words = stData.target_words || {};

        this._rebuildActiveDictionary();
        this.isDirty = false;
        console.log("[WordManager] 数据池初始化完毕，标准数据已就绪。");
    }

    /**
     * 重建高速缓存视图 (浅拷贝合并)
     */
    _rebuildActiveDictionary() {
        this.activeDictionary.effect_words = { 
            ...this.cache.builtIn.effect_words, 
            ...this.cache.custom.effect_words 
        };
        this.activeDictionary.meta_words = { 
            ...this.cache.builtIn.meta_words, 
            ...this.cache.custom.meta_words 
        };
        this.activeDictionary.target_words = { 
            ...this.cache.builtIn.target_words, 
            ...this.cache.custom.target_words 
        };
    }

    /**
     * 仅在提取外部/非标准数据时调用：解析并混入内存
     */
    parseAndAddCustomWord(type, keyName, rawData) {
        let standardizedData;
        
        // 调用 WordParser 清洗数据
        if (type === 'effect_words') {
            standardizedData = WordParser.parseEffectWord(keyName, rawData);
        } else if (type === 'meta_words') {
            standardizedData = WordParser.parseMetaWord(keyName, rawData);
        } else if (type === 'target_words') {
            // 视需求扩展 parseTargetWord，如果没有则暂且假设传入的是标准数据
            standardizedData = rawData; 
        }

        // 以 uid (或 fallback 为 keyName) 作为键存入自定义缓存
        const storageKey = standardizedData.uid || keyName;
        this.cache.custom[type][storageKey] = standardizedData;
        
        this.isDirty = true;
        this._rebuildActiveDictionary();
        
        return standardizedData;
    }

    /**
     * 直接添加已经标准化的自定义数据 (跳过解析)
     */
    addStandardCustomWord(type, standardData) {
        if (!standardData || !standardData.uid) return;
        this.cache.custom[type][standardData.uid] = standardData;
        this.isDirty = true;
        this._rebuildActiveDictionary();
    }

    deleteCustomWord(type, uid) {
        if(this.cache.custom[type] && this.cache.custom[type][uid]) {
            delete this.cache.custom[type][uid];
            this.isDirty = true;
            this._rebuildActiveDictionary();
        }
    }

    /**
     * 检测是不是自定义数据
     * @param {Object} type 
     * @param {Object} uid 
     */
    isCustomData(type, uid){
        if(this.cache.custom[type] && this.cache.custom[type][uid]) {
            return true;
        }
        return false;
    }

    /**
     * 批量持久化到底层存储 (仅当发生修改时执行)
     */
    commit() {
        if (!this.isDirty) return;

        updateVariablesWith(vars => {
            _.set(vars, this.basePath, this.cache.custom);
            return vars;
        }, this.domain);

        this.isDirty = false;
        console.log("[WordManager] 自定义咒字数据已批量持久化。");
    }
}

// 导出单例
// export const wordDB = new WordDataManager();

export class mockWordDataManager {
            constructor(domainType = 'chat') {
                this.domain = { type: domainType };
                this.basePath = 'words_of_power_dlc.words_of_power_db';
                
                // 数据池分层管理，包含目标、效果、超魔三类
                this.cache = {
                    builtIn: { effect_words: {}, meta_words: {}, target_words: {} },
                    custom: { effect_words: {}, meta_words: {}, target_words: {} }
                };
                
                // 给系统其余部分使用的高速只读视图
                this.activeDictionary = { effect_words: {}, meta_words: {}, target_words: {} };
                
                // 性能优化：脏标记
                this.isDirty = false;
                
            }

            loadFromLocal() {
                const stored = localStorage.getItem('starry_custom_words_db');
                if (stored) {
                    try { this.cache.custom = JSON.parse(stored); this._rebuildActiveDictionary(); } 
                    catch(e) { console.error("Load custom DB failed", e); }
                }
            }

            /**
             * 游戏加载时调用一次：直接装载标准数据，无解析损耗
             * @param {Object} builtInEffects 导入的自带效果咒字
             * @param {Object} builtInMetas   导入的自带超魔咒字
             * @param {Object} builtInTargets 导入的自带目标咒字
             */
            init(builtInEffects = {}, builtInMetas = {}, builtInTargets = {}) {
                // 1. 直接挂载标准化的自带数据
                this.cache.builtIn.effect_words = builtInEffects;
                this.cache.builtIn.meta_words = builtInMetas;
                this.cache.builtIn.target_words = builtInTargets;

                // 2. 从 ST 获取玩家自定义数据，假设已经是标准格式，直接挂载
                const vars = {};
                const stData = {};
                /*
                const stData = {
                    effect_words: {
                        "effect_fire": { uid: "effect_fire", name: "火焰爆破", quality: "稀有", type: "主动", tags: ["塑能"], action_cost: { raw: "动作" }, extra_cost: {mp: 1500}, effect_desc: { "描述": "造成火焰伤害" }, boost: { total_level: 1, 1: { add_desc: "双倍伤害" } } },
                        "effect_cold": { uid: "effect_fire", name: "寒冰爆破", quality: "普通", type: "主动", tags: ["塑能"], action_cost: { raw: "动作" }, extra_cost: {mp: 500}, effect_desc: { "描述": "造成寒冰伤害" }, boost: { total_level: 1, 1: { add_desc: "一半倍伤害" } } },
                        "effect_air": { uid: "effect_fire", name: "大气爆破", quality: "史诗", type: "主动", tags: ["塑能"], action_cost: { raw: "动作" }, extra_cost: {mp: 4000}, effect_desc: { "描述": "造成大气伤害" }, boost: { total_level: 1, 1: { add_desc: "一半倍伤害" } } },
                        "effect_holy": { uid: "effect_fire", name: "圣光爆破", quality: "传说", type: "主动", tags: ["塑能"], action_cost: { raw: "动作" }, extra_cost: {mp: 10000}, effect_desc: { "描述": "造成圣光伤害" }, boost: { total_level: 1, 1: { add_desc: "一半倍伤害" } } },
                        "effect_death": { uid: "effect_fire", name: "死亡爆破", quality: "神话", type: "主动", tags: ["塑能"], action_cost: { raw: "动作" }, extra_cost: {mp: 10000}, effect_desc: { "描述": "造成死亡伤害" }, boost: { 
                            total_level: 2, 1: { add_desc: "一半倍伤害" } ,
                            2: { add_desc: "伤害吸血" } ,
                        
                        } },
                    },
                };
                */
                
                
                this.cache.custom.effect_words = stData.effect_words || {};
                this.cache.custom.meta_words = stData.meta_words || {};
                this.cache.custom.target_words = stData.target_words || {};
                this.loadFromLocal();

                this._rebuildActiveDictionary();
                this.isDirty = false;
                console.log("[WordManager] 数据池初始化完毕，标准数据已就绪。");
            }

            /**
             * 重建高速缓存视图 (浅拷贝合并)
             */
            _rebuildActiveDictionary() {
                this.activeDictionary.effect_words = { 
                    ...this.cache.builtIn.effect_words, 
                    ...this.cache.custom.effect_words 
                };
                this.activeDictionary.meta_words = { 
                    ...this.cache.builtIn.meta_words, 
                    ...this.cache.custom.meta_words 
                };
                this.activeDictionary.target_words = { 
                    ...this.cache.builtIn.target_words, 
                    ...this.cache.custom.target_words 
                };
            }

            /**
             * 仅在提取外部/非标准数据时调用：解析并混入内存
             */
            parseAndAddCustomWord(type, keyName, rawData) {
                let standardizedData;
                
                // 调用 WordParser 清洗数据
                if (type === 'effect_words') {
                    standardizedData = WordParser.parseEffectWord(keyName, rawData);
                } else if (type === 'meta_words') {
                    standardizedData = WordParser.parseMetaWord(keyName, rawData);
                } else if (type === 'target_words') {
                    // 视需求扩展 parseTargetWord，如果没有则暂且假设传入的是标准数据
                    standardizedData = rawData; 
                }

                // 以 uid (或 fallback 为 keyName) 作为键存入自定义缓存
                const storageKey = standardizedData.uid || keyName;
                this.cache.custom[type][storageKey] = standardizedData;
                
                this.isDirty = true;
                this._rebuildActiveDictionary();
                
                return standardizedData;
            }

            /**
             * 直接添加已经标准化的自定义数据 (跳过解析)
             */
            addStandardCustomWord(type, standardData) {
                if (!standardData || !standardData.uid) return;
                this.cache.custom[type][standardData.uid] = standardData;
                this.isDirty = true;
                this._rebuildActiveDictionary();
            }

            deleteCustomWord(type, uid) {
                if(this.cache.custom[type] && this.cache.custom[type][uid]) {
                    delete this.cache.custom[type][uid];
                    this.isDirty = true;
                    this._rebuildActiveDictionary();
                }
            }

                /**
                 * 检测是不是自定义数据
                 * @param {Object} type 
                 * @param {Object} uid 
                 */
                isCustomData(type, uid){
                    if(this.cache.custom[type] && this.cache.custom[type][uid]) {
                        return true;
                    }
                    return false;
                }

            /**
             * 批量持久化到底层存储 (仅当发生修改时执行)
             */
            commit() {
                if (!this.isDirty) return;

                localStorage.setItem('starry_custom_words_db', JSON.stringify(this.cache.custom));

                this.isDirty = false;
                console.log("[WordManager] 自定义咒字数据已批量持久化。", this.cache.custom);
            }
        }


