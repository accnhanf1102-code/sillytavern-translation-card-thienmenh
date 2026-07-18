// ==========================================
// 1. 内部维护的通用加值类型字典 (基于 CRPG 规则)
// ==========================================
const MODIFIER_TYPE_DICT = {
    "luck": "May mắn",
    "enhancement": "Tăng cường",
    "morale": "Sĩ khí",
    "sacred": "Thần thánh",
    "profane": "Báng bổ",
    "dodge": "Né tránh",
    "armor": "Giáp trụ",
    "shield": "Khiên",
    "natural_armor": "Giáp tự nhiên",
    "deflection": "Lệch hướng",
    "insight": "Thông tuệ",
    "competence": "Năng lực",
    "alchemical": "Giả kim",
    "circumstance": "Hoàn cảnh",
    "resistance": "Kháng tính",
    "racial": "Chủng tộc",
    "trait": "Nền tảng",
    "untyped": "Không tên",
    "penalty": "Giảm trừ",
    "base": "Cơ bản",
    "dexterity": "Điều chỉnh độ nhanh nhẹn"
};

// ==========================================
// 2. 动态数据库反查函数
// ==========================================
function getSourceNameFromDB(sourceId, sourceType) {
    if (!sourceId) return "未知来源";

    let sourceName = sourceId; // 默认回退为 ID

    try {
        switch (sourceType?.toLowerCase()) {
            case "attribute": 
                sourceName = "Điều chỉnh thuộc tính";
                break;
            case "armor": 
                sourceName = "Điểm cộng giáp trụ";
                break;
            case "shield": 
                sourceName = "Điểm cộng khiên";
                break;
            case "natural": 
                sourceName = "Điểm cộng phòng thủ tự nhiên";
                break;
            case 'buff':
                sourceName = BUFF_DB[sourceId]?.name || sourceId;
                break;
            case 'spell':
                sourceName = SPELL_DB[sourceId]?.name || sourceId;
                break;
            case 'feat':
                // Tương thích với ID專长 có kiểu con, ví dụ: "feat_weapon_focus_longsword"
                const baseFeatId = sourceId.split('_').slice(0, 3).join('_'); // Trích xuất tiền tố thô
                sourceName = FEAT_DB[sourceId]?.name || FEAT_DB[baseFeatId]?.name || sourceId;
                break;
            case 'item':
                sourceName = ITEM_DB[sourceId]?.name || sourceId;
                break;
            case 'toggle':
            case 'ability':
                sourceName = ABILITY_DB[sourceId]?.name || sourceId;
                break;
            case 'class':
            case 'class_level':
                // Tương thích "fighter" hoặc "class_fighter"
                const classId = sourceId.replace('class_', '');
                sourceName = CLASS_DB[classId]?.name || sourceId;
                break;
            case "skill": 
                sourceName = 'Kỹ năng:' + (BUFF_DB[sourceId]?.name || sourceId);
                break;
            case "equipment": 
                sourceName = 'Trang bị:' + (BUFF_DB[sourceId]?.name || sourceId);
                break;
            case "bag_item": 
                sourceName = 'Vật phẩm:' + (BUFF_DB[sourceId]?.name || sourceId);
                break;
            case "custom_status": 
                sourceName = 'Trạng thái:' + (BUFF_DB[sourceId]?.name || sourceId);
            break;
            default:
                if(sourceType.startsWith("godpath_")) sourceName = `${sourceType.substring(8)}:` + (BUFF_DB[sourceId]?.name || sourceId);
                // Dự phòng: Nếu không cung cấp sourceType, thử truy xuất qua một vài thư viện thông dụng
                else if (BUFF_DB[sourceId]) sourceName = BUFF_DB[sourceId].name;
                else if (FEAT_DB[sourceId]) sourceName = FEAT_DB[sourceId].name;
                break;
        }
    } catch (error) {
        console.warn(`[UIFormat] Trích xuất tên thất bại: ID=${sourceId}, Type=${sourceType}`, error);
    }

    return sourceName;
}

// ==========================================
// 3. 核心塑形函数 (完全剥离对外部字典对象的依赖)
// ==========================================
/**
 * 将单项属性的日志转化为前端 UI 友好的结构
 * @param {number} finalValue - 引擎计算出的最终结果
 * @param {object} statLog - 该属性对应的日志对象 (statsLogs[statName])
 * @returns {object} 适合前端直接渲染的数据结构
 */
export function formatStatForUI(finalValue, statLog) {
    const uiData = {
        finalTotal: finalValue || 0,
        baseValue: 0,
        baseSources: [],
        activeModifiers: [],   
        suppressedRecords: []  
    };

    if (!statLog) return uiData;

    // 辅助函数：格式化单条记录并自动查询名字
    const formatRecord = (record, typeKey = "") => {
        // 优先展示 directSourceId（最真实的挂载物），没有则用 sourceId（触发源）
        const displayId =  record.sourceId || record.directSourceId;
        const displayType = record.sourceType || record.directSourceType;
        
        return {
            value: record.value,
            typeKey: typeKey,
            sourceId: displayId,
            sourceType: displayType,
            // 🌟 核心：自动去数据库里查中文名！
            sourceLabel: getSourceNameFromDB(displayId, displayType) 
        };
    };

    // 1. 处理基础值 (_setBase)
    if (statLog._setBase && statLog._setBase.length > 0) {
        statLog._setBase.forEach(record => {
            if (record.isActive) {
                uiData.baseValue += record.value;
                uiData.baseSources.push(formatRecord(record, "base"));
            } else {
                uiData.suppressedRecords.push(formatRecord(record, "base"));
            }
        });
    }

    // 2. 处理加/减值 (_additions)
    if (statLog._additions) {
        for (const [modifierType, group] of Object.entries(statLog._additions)) {
            const activeRecords = [];
            
            group.records.forEach(record => {
                const formattedRecord = formatRecord(record, modifierType);
                if (record.isActive) {
                    activeRecords.push(formattedRecord);
                } else {
                    uiData.suppressedRecords.push(formattedRecord);
                }
            });

            // 只要有生效的来源，就独立成一个区块
            if (activeRecords.length > 0) {
                uiData.activeModifiers.push({
                    typeKey: modifierType,
                    // 🌟 核心：自动翻译加值类型
                    typeLabel: MODIFIER_TYPE_DICT[modifierType] || modifierType, 
                    totalValue: group.activeTotal,
                    sources: activeRecords
                });
            }
        }
    }

    // 3. 排序：正面的加值区块排前面，减值排最后，按数值大小排列
    uiData.activeModifiers.sort((a, b) => b.totalValue - a.totalValue);

    return uiData;
}


/**
 * 根据 UI 数据生成紧凑的属性说明字符串
 * @param {string} statLabel - 属性显示名称，例如 "防御等级" 或 "力量"
 * @param {object} uiData - 由 formatStatForUI 生成的数据结构
 * @returns {string} 例如 "防御等级: 15(基础+10 闪避+3[闪避, 防御式攻击] 偏斜+2[虔诚护盾])"
 */
export function generateStatSummaryString(statLabel, uiData) {
    if (!uiData) return `${statLabel}: 0`;

    const parts = [];

    // 1. 处理基础值 (如果基础值为 0，可根据你的规则决定是否隐藏，这里设定为不为0才显示)
    if (uiData.baseValue !== 0) {
        const sign = uiData.baseValue > 0 ? '+' : '';
        // 也可以不写“基础”，如果 uiData.baseSources 里有具体的 label，可以提取它
        parts.push(`基础${sign}${uiData.baseValue}`);
    }

    // 2. 处理所有生效的加值区块
    if (uiData.activeModifiers && uiData.activeModifiers.length > 0) {
        uiData.activeModifiers.forEach(mod => {
            // 处理正负号，减值本身自带负号，所以只需对正数加 '+'
            const sign = mod.totalValue > 0 ? '+' : '';
            
            // 提取所有生效来源的名称，并使用 Set 去重 
            // （比如吃了3瓶相同的敏捷药水叠加，就没必要显示 [敏捷药水, 敏捷药水, 敏捷药水]，显示一个即可）
            const sourceNames = [...new Set(mod.sources.map(s => s.sourceLabel))].join(', ');
            
            // 拼接单块字符串，如：闪避+3[闪避, 防御式攻击]
            parts.push(`${mod.typeLabel}${sign}${mod.totalValue}[${sourceNames}]`);
        });
    }

    // 3. 组合最终字符串
    if (parts.length === 0) {
        // 如果完全没有任何加成和基础值，直接返回数字
        return `${statLabel}: ${uiData.finalTotal || 0}`;
    }

    // 用空格连接各部分并套上括号
    return `${statLabel}: ${uiData.finalTotal || 0}(${parts.join(' ')})`;
}


export const STATS_NAME_MAP = {
    ac: "Hạng phòng thủ",
    str: "Sức mạnh",
    dex: "Nhanh nhẹn",
    con: "Thể chất",
    int: "Trí lực",
    wis: "Tinh thần",
    attack_rolls: "Điểm cộng tấn công",
    initiative: "Tiên công",
    alchemy_rolls: 'Kiểm định giả kim',
    enchanting_rolls: 'Kiểm định ma pháp',
    smithing_rolls: 'Kiểm định rèn',
    cooking_rolls: 'Kiểm định nấu ăn',
    tailor_rolls: 'Kiểm định may mặc',
    int_rolls: "Kiểm định trí lực",
    wis_rolls: "Kiểm định tinh thần"
};

const INT_NAME_MAP = {
    'onBeforeAttackRoll': 'Trước kiểm định tấn công',
    'onAttackRoll': 'Khi kiểm định tấn công',
    'onDamageRoll': 'Khi gây sát thương',
    'onAllRolls': 'Khi thực hiện mọi kiểm định',
    'onSpellCast': 'Khi thi triển phép thuật',
};

export class BonusPromptGenerator {

    /**
     * Tạo mảng cộng dồn thuộc tính nhỏ gọn dựa trên dữ liệu
     * @param {string/array} target_stats - Mảng thuộc tính mục tiêu cần tạo cộng dồn
     * @param {object} runtimeData - Dữ liệu runtime của nhân vật
     * @returns {array} Mảng các mô tả cộng dồn cho tất cả thuộc tính mục tiêu, ví dụ ["Hạng phòng thủ: 15(Cơ bản+10 Né tránh+3[Né tránh, Tấn công phòng thủ] Lệch hướng+2[Khiên tín ngưỡng])"]
     */
    static statsPromptGenerator(target_stats, runtimeData) {
        if(!runtimeData || !runtimeData.stats) return [];
        let needStats = [];
        if(typeof target_stats === "string") needStats.push(target_stats);
        else needStats = target_stats;
        const ret_array = [];

        const charStats = runtimeData.stats;
        const charStatsLogs = runtimeData.statsLogs;

        needStats.forEach( e =>{
            const stat_name = STATS_NAME_MAP[e];
            const bonusStr = generateStatSummaryString(
                stat_name, 
                formatStatForUI(charStats[e], charStatsLogs[e])
            );
            if(bonusStr != "") ret_array.push(bonusStr);
        });

        return ret_array;
    }

    /**
     * Tạo mảng cộng dồn thuộc tính nhỏ gọn dựa trên dữ liệu
     * @param { string/array } target_ints - Mảng các bộ chặn mục tiêu cần tạo cộng dồn
     * @param { object } runtimeData  - Dữ liệu runtime của nhân vật
     * @returns { Object } Đối tượng của tất cả bộ chặn đã đánh trúng, ví dụ {"Kiểm định xx":[xx,xx]}"
     */
    static interceptorsPromptGenerator(target_ints, runtimeData) {
        if(!runtimeData || !runtimeData.stats) return [];
        let needInts = [];
        if(typeof target_ints === "string") needInts.push(target_ints);
        else needInts = target_ints;
        const interceptors = runtimeData.interceptors;
        const ret_obj = {};
        needInts.forEach( e => {
            if(interceptors[e]) {
                const tmp = [];
                interceptors[e].forEach(i => { 
                    let buffName = "Nguồn gốc không xác định";
                    if(i.context && i.context.sourceBuff){
                        buffName = i.context.sourceBuff.substring(3);
                    }
                    const buffFrom = (i.buff_from && i.buff_from!= "Không xác định") ? i.buff_from : "";
                    if(buffFrom != "") tmp.push(`Nguồn[${buffFrom}]${buffName}: ${i.desc}`);
                    else tmp.push(`${buffName}: ${i.desc}`);
                    
                });
                const t_k = INT_NAME_MAP[e] || e;
                ret_obj[t_k] = tmp;
            }
        });
        //console.log("Trả về:", ret_obj);

        return ret_obj;

    }
}