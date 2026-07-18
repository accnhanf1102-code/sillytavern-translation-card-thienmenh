
const QUALITY_SYSTEM = {
    'Common': { val: 1, baseCap: 200, totalCap: 400, dcBonus: 2, metaCostMod: 0.25},
    'Uncommon': { val: 2, baseCap: 700, totalCap: 1000, dcBonus: 3 , metaCostMod: 0.5},
    'Rare': { val: 4, baseCap: 1500, totalCap: 2000, dcBonus: 5, metaCostMod: 0.75 },
    'Epic': { val: 8, baseCap: 6000, totalCap: 8000, dcBonus: 6 , metaCostMod: 1.0},
    'Legendary': { val: 16, baseCap: 15000, totalCap: 20000, dcBonus: 7 , metaCostMod: 1.5},
    'Mythic': { val: 32, baseCap: 30000, totalCap: 50000, dcBonus: 9 , metaCostMod: 2.0},
    'Unique': { val: 999, baseCap: 30000, totalCap: 60000, dcBonus: 10, metaCostMod: 2.0 }
};

const QUALITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Unique'];
const getQualityWeight = (q) => Math.max(0, QUALITY_ORDER.indexOf(q));

export class SpellCalculator {
    /**
     * 检查是否包含“无限”超魔
     */
    static hasInfiniteMeta(spell) {
        return spell.spell_meta_words.some(m => m.word.name === '无限');
    }

    /**
     * 1. 计算最终成品品质
     */
    static calcQuality(spell) {
        if (spell.unique_effect_words.length > 0) return 'Unique';

        let sum = 0;
        spell.effect_words.forEach(item => {
            sum += QUALITY_SYSTEM[item.word.quality]?.val || 1;
        });

        if (sum >= 32) return 'Mythic';
        if (sum >= 16) return 'Legendary';
        if (sum >= 8) return 'Epic';
        if (sum >= 4) return 'Rare';
        if (sum >= 2) return 'Uncommon';
        return 'Common';
    }

    /**
     * 【新增】检测目标咒字是否允许被设置为当前法术的目标
     */
    static canSetTargetWord(spell, newTargetWord) {
        const currentQuality = this.calcQuality(spell);
        if (getQualityWeight(currentQuality) < getQualityWeight(newTargetWord.quality_limit)) {
            return { valid: false, reason: `Phẩm chất phép thuật hiện tại 【${currentQuality}】 chưa đạt yêu cầu của chú tự mục tiêu này 【${newTargetWord.quality_limit}】` };
        }
        return { valid: true };
    }

    /**
     * 计算法术 DC (难度等级) - [修改：返回包含详细计算过程的对象]
     */
    static calcDC(spell, casterStats = { statModifier: 0, dcBonus: 0, casterMainAttribute: "智力"}) {
        const qualityName = this.calcQuality(spell);
        const qualityDcBonus = QUALITY_SYSTEM[qualityName]?.dcBonus || 0;
        const statMod = casterStats.statModifier || 0;
        const extraBonus = casterStats.dcBonus || 0;
        
        const total = 10 + qualityDcBonus + statMod + extraBonus;
        
        return {
            total: total,
            base: 10,
            qualityBonus: qualityDcBonus,
            statModifier: statMod,
            extraBonus: extraBonus,
            // 拼接公式过程供展示
            detailString: `10(Cơ Bản) + ${qualityDcBonus}(Phẩm chất [${qualityName}]) + ${statMod}(Thuộc tính chính: ${casterStats.casterMainAttribute})${extraBonus === 0 ? "" : ` + ${extraBonus}(Bảng bổ sung)`}`
        };
    }

    /**
     * 计算法术豁免类型 (处理实型/虚型超魔转换及多候选)
     */
    static calcSaveType(spell) {
        const allEffects = [...spell.effect_words, ...spell.unique_effect_words];
        
        // 1. Lọc ra các chú tự hiệu ứng có yêu cầu miễn nhiễm rõ ràng
        const effectsWithSave = allEffects.filter(item => {
            const sType = item.word.save_type?.type;
            return sType && sType !== 'Không' && sType !== 'none';
        });

        // Nếu không có hiệu ứng nào cần miễn nhiễm, trả về Không trực tiếp
        if (effectsWithSave.length === 0) {
            return { type: 'Không', on_save: 'Không', options: [] };
        }

        // 2. Sắp xếp giảm dần theo trọng số phẩm chất
        effectsWithSave.sort((a, b) => {
            const qA = QUALITY_SYSTEM[a.word.quality]?.val || 0;
            const qB = QUALITY_SYSTEM[b.word.quality]?.val || 0;
            return qB - qA;
        });

        // 3. Trích xuất trọng số phẩm chất cao nhất, và tìm ra tất cả các ứng cử viên có cùng phẩm chất cao nhất
        const highestWeight = QUALITY_SYSTEM[effectsWithSave[0].word.quality]?.val || 0;
        const candidates = effectsWithSave.filter(item => 
            (QUALITY_SYSTEM[item.word.quality]?.val || 0) === highestWeight
        );

        // 4. Kiểm tra siêu ma toàn cục phép thuật, xác nhận xem có tồn tại Thực hình hay Hư hình hay không
        const hasSolid = spell.spell_meta_words.some(m => m.word.name === 'Thực hình');
        const hasEthereal = spell.spell_meta_words.some(m => m.word.name === 'Hư hình');

        // 5. Xây dựng danh sách tùy chọn và áp dụng chuyển đổi siêu ma
        const options = candidates.map(item => {
            let baseType = item.word.save_type.type;
            
            // Thực hình: Ý chí -> Cường tráng
            if (hasSolid && baseType.includes('Tinh thần')) {
                baseType = baseType.replace('Tinh thần', 'Thể chất');
            }
            // Hư hình: Cường tráng -> Ý chí
            if (hasEthereal && baseType.includes('Thể chất')) {
                baseType = baseType.replace('Thể chất', 'Tinh thần');
            }

            return {
                sourceId: item.uid,
                sourceName: item.word.name,
                type: baseType,
                on_save: item.word.save_type.on_save
            };
        });

        // Mặc định trả về ứng cử viên đầu tiên làm phán định chính, front-end có thể sử dụng mảng options để cung cấp hộp thả xuống cho người chơi tự chọn (nếu có nhiều)
        return {
            type: options[0].type,
            on_save: options[0].on_save,
            options: options 
        };
    }

    /**
     * 2. 计算动作消耗
     */
    static calcActionCost(spell) {
        let hasAttack = false;
        let multiTurnStr = null;

        const allEffects = [...spell.effect_words, ...spell.unique_effect_words];

        for (const item of allEffects) {
            const cost = item.word.action_cost;
            if (cost.multi_turn) {
                multiTurnStr = cost.multi_turn; // Nếu có thời gian thi triển, ưu tiên cao nhất
            }
            if (cost.raw && cost.raw.includes('Tấn công')) {
                hasAttack = true;
            }
        }

        if (multiTurnStr) return { type: 'multi_turn', desc: multiTurnStr };
        if (hasAttack) return { type: 'standard', desc: '[Tấn công][Hành động]' };
        return { type: 'move', desc: '[Hành động]' };
    }

    /**
     * 计算核心消耗 - [修改：增加溢出HP追踪与上限基准返回]
     * @param {Object} spell - 法术配置
     * @param {number} casterMaxMp - 施法者最大MP，用于计算50%极限超魔[cite: 5]
     */
    static calcCost(spell, casterMaxMp = 0) {
        const qualityName = this.calcQuality(spell);
        const caps = QUALITY_SYSTEM[qualityName];
        const isInfinite = this.hasInfiniteMeta(spell);

        // 【Thêm mới】Lấy hệ số thu phóng tiêu hao siêu ma của phẩm chất hiện tại, mặc định tối thiểu 1.0
        const metaCostMod = caps.metaCostMod || 1.0;

        let rawBaseMp = 0;
        let metaMp = 0;
        let extraHp = 0; 
        let uncappedMp = 0;  // Chứa các tiêu hao bổ sung bỏ qua giới hạn như tăng cường cực hạn
        let overflowHp = 0; // 【Thêm mới】Chuyên dùng để ghi lại HP tràn do siêu ma vô hạn chuyển hóa

        // 【Thêm mới】Chuyên dùng để theo dõi chi tiết tiêu hao của từng bước
        const mpDetails = [];

        // 1. Tổng hợp MP cơ bản (Chú tự hiệu ứng)
        const allEffects = [...spell.effect_words, ...spell.unique_effect_words];
        allEffects.forEach(item => {
            const mpCost = item.word.extra_cost?.mp || 0;
            rawBaseMp += mpCost;
            extraHp += item.word.extra_cost?.hp || 0; 
            if (mpCost > 0) {
                mpDetails.push(`[Hiệu ứng] ${item.word.name}: ${mpCost} MP`);
            }
        });

        // Tính toán khóa đỉnh MP cơ bản
        let actualBaseMp = rawBaseMp > caps.baseCap ? caps.baseCap : rawBaseMp;
        if(isInfinite) actualBaseMp = rawBaseMp;

        // 2. Hàm nội bộ: Phân tích tiêu hao siêu ma trên điểm gắn kết
        const evaluateHolderMeta = (holder, holderName) => {
            if (!holder || !holder.meta) return;
            holder.meta.forEach(mWrap => {
                if (mWrap.word.name === 'Tăng cường' || mWrap.word.name.includes('Tăng cường')) {
                    const bLevel = mWrap.input_args?.boost_level || 1;
                    const boostData = holder.word.boost[bLevel];
                    
                    if (boostData) {
                        if (bLevel === 'limit') {
                            const cost = Math.floor(casterMaxMp * 0.5);
                            uncappedMp += cost;
                            mpDetails.push(`[Tăng cường cực hạn] Đính kèm [${holderName}]: ${cost} MP (Bỏ qua giới hạn)`);
                        } else {
                            let specificCost = boostData.extra_cost?.mp;
                            if (specificCost === undefined || specificCost === null) {
                                const baseMetaMp = mWrap.word.extra_cost?.mp || 0;
                                specificCost = Math.floor(baseMetaMp * metaCostMod);
                                mpDetails.push(`[Tăng cường ${bLevel}] Đính kèm [${holderName}]: ${specificCost} MP (Cơ bản ${baseMetaMp} × Hệ số ${metaCostMod})`);
                            } else {
                                mpDetails.push(`[Tăng cường ${bLevel}] Đính kèm [${holderName}]: ${specificCost} MP (Tiêu hao cố hữu)`);
                            }
                            metaMp += specificCost;
                            extraHp += boostData.extra_cost?.hp || 0;
                        }
                    }
                } else {
                    const baseMetaMp = mWrap.word.extra_cost?.mp || 0;
                    const cost = Math.floor(baseMetaMp * metaCostMod);
                    metaMp += cost;
                    extraHp += mWrap.word.extra_cost?.hp || 0;
                    if (cost > 0) {
                        mpDetails.push(`[Siêu ma cục bộ] ${mWrap.word.name} Đính kèm [${holderName}]: ${cost} MP (Cơ bản ${baseMetaMp} × Hệ số ${metaCostMod})`);
                    }
                }
            });
        };

        // 3. Tính toán siêu ma ở tất cả vị trí
        spell.target_words.forEach(h => evaluateHolderMeta(h, h.word.name));
        spell.effect_words.forEach(h => evaluateHolderMeta(h, h.word.name));
        spell.unique_effect_words.forEach(h => evaluateHolderMeta(h, h.word.name));
        // Siêu ma tác dụng lên toàn bộ phép thuật (như tăng khoảng cách, kéo dài thời gian)
        spell.spell_meta_words.forEach(mWrap => {
            const baseMetaMp = mWrap.word.extra_cost?.mp || 0;
            const cost = Math.floor(baseMetaMp * metaCostMod);
            metaMp += cost;
            extraHp += mWrap.word.extra_cost?.hp || 0; 
            if (cost > 0) {
                mpDetails.push(`[Siêu ma toàn cục] ${mWrap.word.name}: ${cost} MP(Cơ bản ${baseMetaMp} × Hệ số ${metaCostMod})`);
            }
        });

        // 4. Tính toán khóa đỉnh tổng MP và phần tràn
        let totalDesiredMp = actualBaseMp + metaMp;
        let finalMp = totalDesiredMp;

        if (totalDesiredMp > caps.totalCap) {
            if (isInfinite) {
                overflowHp = totalDesiredMp - caps.totalCap; // 【Thêm mới】Ghi lại lượng chuyển hóa
                extraHp += overflowHp;
                finalMp = caps.totalCap;
            } else {
                finalMp = caps.totalCap;
            }
        }

        return {
            baseMp: actualBaseMp,
            rawBaseMp: rawBaseMp,
            metaMp: metaMp,
            uncappedMp: uncappedMp,
            finalMp: finalMp + uncappedMp,
            finalHp: extraHp,
            overflowHp: overflowHp, // 【Thêm mới】
            mpDetails: mpDetails,
            isBaseCapped: rawBaseMp > caps.baseCap,
            isTotalCapped: totalDesiredMp > caps.totalCap,
            baseCapLimit: caps.baseCap,   // 【Thêm mới】Trả về giới hạn cơ bản của phẩm chất hiện tại
            totalCapLimit: caps.totalCap  // 【Thêm mới】Trả về giới hạn tổng của phẩm chất hiện tại
        };
    }
	
    /**
     * 添加超魔前校验 (阻拦非法操作)
     * @param {Object} spell - 当前法术状态
     * @param {string} holderType - 'target', 'effect', 或 'spell'
     * @param {Object} holder - 承载该超魔的具体咒字节点 (若是 spell 则为空)
     * @param {Object} newMetaWord - 即将添加的超魔标准数据
     * @param {Object} inputArgs - 前端输入的参数，如 { boost_level: 2 }
     * @param {number} casterMaxMp - 用于沙盘推演的参数
     */
    static canAddMeta(spell, holderType, holder, newMetaWord, inputArgs = {}, casterMaxMp = 0) {
        // 1. Xác minh mục tiêu vị trí (mod_target)
        const targetMap = { 'target': 'Mục tiêu', 'effect': 'Hiệu ứng', 'spell': 'Phép thuật' };
        const requiredMod = targetMap[holderType];
        if (!newMetaWord.mod_target.includes(requiredMod)) {
            return { valid: false, reason: `Siêu ma này chỉ có thể tác dụng lên: ${newMetaWord.mod_target.join(', ')}` };
        }

        // 2. Xác minh yêu cầu phẩm chất (quality_limit)
        const currentQuality = this.calcQuality(spell);
        if (getQualityWeight(currentQuality) < getQualityWeight(newMetaWord.quality_limit)) {
            return { valid: false, reason: `Yêu cầu phẩm chất phép thuật đạt 【${newMetaWord.quality_limit}】 trở lên` };
        }

        const checkHasMeta = (meta, all_meta) =>{
            return all_meta.some( e => {
                return e.uid === meta.uid;
            });
        };
        

        if(holderType === "spell"){
            if(checkHasMeta(newMetaWord, spell.spell_meta_words)) 
                return { valid: false, reason: "Siêu ma không thể lặp lại"};
        }else{
            if(checkHasMeta(newMetaWord, holder.meta))
                return { valid: false, reason: "Siêu ma không thể lặp lại"};
        }
        // 3. Xác minh tính hợp lệ của phân cấp tăng cường
        if (newMetaWord.name === 'Tăng cường') {
            const bLvl = inputArgs.boost_level || 1;
            // Kiểm tra xem điểm gắn kết hiện tại có tồn tại dữ liệu tăng cường của cấp độ tương ứng hay không
            if (!holder.word.boost || !holder.word.boost[bLvl]) {
                return { valid: false, reason: `Chú tự này không có hiệu ứng tăng cường của cấp độ '${bLvl}'` };
            }
        }

        // 4. Diễn tập hộp cát xem MP có vượt quá giới hạn không (Sao chép sâu đối tượng nhỏ cực nhanh)
        const mockSpell = JSON.parse(JSON.stringify(spell));
        const metaPayload = { uid: newMetaWord.uid, word: newMetaWord, input_args: inputArgs };
        
        if (holderType === 'target') mockSpell.target_words[0].meta.push(metaPayload);
        else if (holderType === 'spell') mockSpell.spell_meta_words.push(metaPayload);
        else {
            // Tìm gắn kết chú tự hiệu ứng tương ứng
            const targetEffect = [...mockSpell.effect_words, ...mockSpell.unique_effect_words]
                .find(e => e.uid === holder.uid);
            if (targetEffect) targetEffect.meta.push(metaPayload);
        }

        const costInfo = this.calcCost(mockSpell, casterMaxMp);
        if (costInfo.isTotalCapped && !this.hasInfiniteMeta(mockSpell)) {
            return { valid: false, reason: "Thêm siêu ma này sẽ vượt quá giới hạn tổng tiêu hao MP của phẩm chất hiện tại, vui lòng thêm siêu ma 【Vô hạn】 trước" };
        }

        return { valid: true };
    }
	
    /**
     * 4. 新增效果咒字前的校验 (预测是否允许添加)
     */
    static canAddEffect(spell, newEffectWord) {
        const isInfinite = this.hasInfiniteMeta(spell);
        
        if (newEffectWord.quality === 'Unique') {
            if (!isInfinite && spell.unique_effect_words.length >= 1) return { valid: false, reason: "Tối đa chỉ có thể chứa 1 chú tự hiệu ứng duy nhất" };
            return { valid: true };
        }

        // Kiểm tra giới hạn số lượng
        if (!isInfinite && spell.effect_words.length >= 6) {
            return { valid: false, reason: "Chú tự hiệu ứng thông thường tối đa chỉ có thể chứa 6 cái" };
        }

        // Kiểm tra giới hạn trên phẩm chất (mô phỏng giá trị phẩm chất sau khi thêm)
        let currentQualityVal = 0;
        spell.effect_words.forEach(item => {
            currentQualityVal += QUALITY_SYSTEM[item.word.quality]?.val || 1;
        });
        const nextQualityVal = currentQualityVal + (QUALITY_SYSTEM[newEffectWord.quality]?.val || 1);

        if (!isInfinite && nextQualityVal > 32) {
            return { valid: false, reason: "Giá trị phẩm chất phép thuật tổ hợp không được vượt quá 32 (Mythic)" };
        }

        return { valid: true };
    }

    /**
     * 5. Kiểm tra tổng thể tính hợp lệ cuối cùng
     */
    static validateSpell(spell) {
        const errors = [];
        const hasInfiniteMeta = this.hasInfiniteMeta(spell);

        if (spell.target_words.length !== 1) {
            errors.push("Phép thuật bắt buộc và chỉ có thể chứa 1 chú tự mục tiêu");
        }

        const effectCount = spell.effect_words.length + spell.unique_effect_words.length;
        if (effectCount === 0) {
            errors.push("Phép thuật cần ít nhất 1 chú tự hiệu ứng");
        }

        if (!hasInfiniteMeta && spell.unique_effect_words.length > 1) {
            errors.push("Chú tự hiệu ứng duy nhất không được vượt quá 1 cái");
        }

        // Kiểm tra lại xem tiêu hao tối đa có bị tràn quá nhiều do thiếu siêu ma vô hạn hay không (cảnh báo tùy chọn)
        const costInfo = this.calcCost(spell);
        if (costInfo.isTotalCapped && !hasInfiniteMeta) {
            errors.push(`Tổng tiêu hao của cấu hình phép thuật hiện tại (${costInfo.rawBaseMp + costInfo.metaMp}) đã vượt quá giới hạn chịu tải của phép thuật cấp này một cách nghiêm trọng (${QUALITY_SYSTEM[this.calcQuality(spell)].totalCap}), phần vượt quá sẽ bị lãng phí. Vui lòng thêm siêu ma [Vô hạn] hoặc xóa bỏ một số hiệu ứng.`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}


export class PromptGenerator {
    /**
     * 辅助函数：生成带有超魔前缀的名称，例如 [增强1|安静]火焰爆破
     */
    static formatNameWithMeta(holderItem) {
        if (!holderItem || !holderItem.word) return "";
        const metas = holderItem.meta || [];
        if (metas.length === 0) return holderItem.word.name;

        const metaNames = metas.map(m => {
            if (m.word.name.includes('Tăng cường')) {
                const lvl = m.input_args?.boost_level || 1;
                return `Tăng cường${lvl === 'limit' ? 'Cực hạn' : lvl}`;
            }
            return m.word.name;
        });
        return `[${metaNames.join('|')}]${holderItem.word.name}`;
    }

    /**
     * 1. Tạo tên tổng thể của phép thuật (Định dạng: Mục tiêu|Hiệu ứng 1|Hiệu ứng 2|[Siêu ma toàn cục 1|Siêu ma toàn cục 2])
     */
    static generateSpellTitle(spell) {
        const parts = [];
        
        // Chú tự mục tiêu
        if (spell.target_words.length > 0) {
            parts.push(this.formatNameWithMeta(spell.target_words[0]));
        }
        
        // Chú tự hiệu ứng
        spell.effect_words.forEach(e => parts.push(this.formatNameWithMeta(e)));
        spell.unique_effect_words.forEach(e => parts.push(this.formatNameWithMeta(e)));
        
        // Chú tự siêu ma toàn cục (Gói gọn trong ngoặc vuông ở cuối)
        if (spell.spell_meta_words.length > 0) {
            const globalMetaNames = spell.spell_meta_words.map(m => m.word.name);
            parts.push(`[${globalMetaNames.join('|')}]`);
        }
        
        return parts.join(' | ');
    }

    /**
     * 2. Tạo module từ khóa prompt cho từng chú tự mục tiêu
     */
    static generateTargetPrompt(holder) {
        if (!holder || !holder.word) return "";
        const word = holder.word;
        const lines = [];

        lines.push(`【Chú tự mục tiêu】: ${this.formatNameWithMeta(holder)}`);
        lines.push(`- Mô tả phạm vi: ${word.range_desc}`);
        lines.push(`- Mô tả mục tiêu: ${word.target_desc}`);
        
        if (holder.input_args?.custom_desc) {
            lines.push(`- Chỉ lệnh bổ sung: ${holder.input_args.custom_desc}`);
        }

        // Xử lý siêu ma cục bộ được gắn vào
        if (holder.meta && holder.meta.length > 0) {
            holder.meta.forEach(m => {
                if (m.word.name.includes('Tăng cường')) {
                    const lvl = m.input_args?.boost_level || 1;
                    const boostData = word.boost[lvl];
                    if (boostData) {
                        const lvlName = lvl === 'limit' ? 'Cực hạn' : lvl;
                        if (boostData.rep_target_desc) lines.push(`- Siêu ma [Tăng cường ${lvlName}] Sửa đổi mục tiêu: ${boostData.rep_target_desc}`);
                        if (boostData.rep_range_desc) lines.push(`- Siêu ma [Tăng cường ${lvlName}] Sửa đổi phạm vi: ${boostData.rep_range_desc}`);
                        if (boostData.add_desc) lines.push(`- Siêu ma [Tăng cường ${lvlName}] Hiệu ứng bổ sung: ${boostData.add_desc}`);
                    }
                } else {
                    const desc = m.word.effect_desc[m.word.name] || Object.values(m.word.effect_desc)[0] || 'Không có mô tả';
                    lines.push(`- Siêu ma [${m.word.name}]: ${desc}`);
                }
            });
        }
        return lines.join('\n');
    }

    /**
     * 3. 生成单个效果咒字的提示词模块
     */
    static generateEffectPrompt(holder) {
        if (!holder || !holder.word) return "";
        const word = holder.word;
        const lines = [];

        lines.push(`【Chú tự hiệu ứng】: ${this.formatNameWithMeta(holder)}`);
        lines.push(`- Phẩm chất: ${word.quality}`);
        if (word.tags && word.tags.length > 0) lines.push(`- Nhãn: ${word.tags.join(', ')}`);
        if (word.damage) lines.push(`- Uy lực/Sát thương: ${word.damage}`);
        if (word.duration && word.duration.raw) lines.push(`- Thời gian duy trì: ${word.duration.raw}`);
        
        if (holder.input_args?.custom_desc) {
            lines.push(`- Chỉ lệnh bổ sung: ${holder.input_args.custom_desc}`);
        }

        // Tích hợp mô tả hiệu ứng
        let effectDescs = [];
        for (const [key, val] of Object.entries(word.effect_desc || {})) {
            effectDescs.push(`${key}: ${val}`);
        }

        // Trích xuất add_desc của siêu ma tăng cường và tích hợp vào hiệu ứng
        const otherMetas = [];
        if (holder.meta && holder.meta.length > 0) {
            holder.meta.forEach(m => {
                if (m.word.name.includes('Tăng cường')) {
                    const lvl = m.input_args?.boost_level || 1;
                    const boostData = word.boost[lvl];
                    if (boostData && boostData.add_desc) {
                        const lvlName = lvl === 'limit' ? 'Cực hạn' : lvl;
                        effectDescs.push(`[Hiệu ứng Tăng cường ${lvlName}]: ${boostData.add_desc}`);
                    }
                } else {
                    otherMetas.push(m);
                }
            });
        }

        lines.push(`- Mô tả hiệu ứng:\n  * ${effectDescs.join('\n  * ')}`);

        // Các siêu ma cục bộ khác không phải tăng cường
        otherMetas.forEach(m => {
            const desc = m.word.effect_desc[m.word.name] || Object.values(m.word.effect_desc)[0] || 'Không có mô tả';
            lines.push(`- Siêu ma [${m.word.name}]: ${desc}`);
        });

        return lines.join('\n');
    }

    /**
     * 4. Tạo module prompt cho chú tự siêu ma toàn cục phép thuật đơn lẻ
     */
    static generateSpellMetaPrompt(metaHolder) {
        if (!metaHolder || !metaHolder.word) return "";
        const word = metaHolder.word;
        const lines = [];
        
        const desc = word.effect_desc[word.name] || Object.values(word.effect_desc)[0] || 'Không có mô tả';
        lines.push(`【Siêu ma toàn cục】: ${word.name}`);
        lines.push(`- Mô tả: ${desc}`);
        
        if (metaHolder.input_args?.custom_desc) {
            lines.push(`- Chỉ lệnh bổ sung: ${metaHolder.input_args.custom_desc}`);
        }
        
        return lines.join('\n');
    }

   /**
     * 5. Tạo Prompt hoàn chỉnh cuối cùng để gửi cho LLM - [Sửa đổi: Thêm hiển thị quá trình]
     */
    static generateFullPrompt(spell, stats) {
        const sections = [];

        // ================= Trích xuất thông tin chi tiết về tiêu hao và DC =================
        const cost = stats.cost;
        const dc = stats.dc;
        const isInfinite = SpellCalculator.hasInfiniteMeta(spell); // Cần import hoặc gọi qua tên lớp

        // Tiêu đề và tổng kết dữ liệu tính toán
        sections.push(`================ CHI TIẾT CẤU TRÚC PHÉP THUẬT CHÚ TỰ ================`);
        if(spell.customName) sections.push(`Tên phép thuật: ${spell.customName}`);
        sections.push(`Cấu tạo phép thuật: ${this.generateSpellTitle(spell)}`);
        sections.push(`Phẩm chất cuối cùng: ${stats.quality}`);
        sections.push(`Tiêu hao hành động: ${stats.action.desc}`);
        sections.push(`Thuộc tính chính thi triển: ${stats.casterMainAttribute || "Trí lực"}`);
        
        // --- Xây dựng phân đoạn giải thích tiêu hao MP/HP chi tiết ---
        sections.push(`【Chi tiết tiêu hao】`);
        sections.push(`Tổng tiêu hao MP: ${cost.finalMp}`);
        let baseMpDesc = `  - Tiêu hao hiệu ứng cơ bản: ${cost.rawBaseMp} MP`;
        if (cost.isBaseCapped && !isInfinite) {
            baseMpDesc += ` (Vượt giới hạn hiệu ứng phẩm chất ${cost.baseCapLimit}，bị cắt giảm thành ${cost.baseMp})`;
        } else if (isInfinite) {
            baseMpDesc += ` ([Vô hạn] siêu ma gia trì, phớt lờ giới hạn cơ bản tiêu hao tổ hợp)`;
        }
        sections.push(baseMpDesc);
        
        sections.push(`  - Tiêu hao siêu ma thông thường: ${cost.metaMp} MP`);
        
        if (cost.uncappedMp > 0) {
            sections.push(`  - Tiêu hao bổ sung vượt giới hạn cực hạn: +${cost.uncappedMp} MP (Phớt lờ tổng giới hạn thông thường)`);
        }
        
        if (cost.isTotalCapped && !isInfinite) {
            sections.push(`  * Cảnh báo: Tổng mức tiêu hao tổ hợp vượt quá giới hạn cực hạn phẩm chất hiện tại (${cost.totalCapLimit})，cấu trúc phép thuật không ổn định, sẽ gây ra hậu quả không xác định!`);
        }
        
        if (cost.overflowHp > 0) {
            sections.push(`  - [Vô hạn] siêu ma chuyển hóa: ${cost.overflowHp} MP vượt quá giới hạn chịu tải của phép thuật đã được chuyển hóa thành tiêu hao HP tương ứng`);
        }
        
        if (cost.finalHp > 0) {
            sections.push(`Tổng tiêu hao HP: ${cost.finalHp}`);
        }
        // 【Thêm mới】Liệt kê chi tiết nguồn gốc tiêu hao
        if (cost.mpDetails && cost.mpDetails.length > 0) {
            sections.push(`<Truy xuất nguồn gốc tiêu hao>`);
            cost.mpDetails.forEach(detail => sections.push(`  * ${detail}`));
            sections.push(`</Truy xuất nguồn gốc tiêu hao>`);
        }

        // --- Xây dựng giải thích công thức tính toán DC chi tiết ---
        sections.push(`\n【Chi tiết kiểm định】`);
        sections.push(`DC phép thuật: ${dc.total}。DC được thiết lập trong chú tự hiệu ứng theo thiết lập, và chỉ ảnh hưởng đến chú tự hiệu ứng tương ứng`);
        sections.push(`  - Công thức tính: ${dc.detailString} = ${dc.total}`);
        if(stats.detailed_dc.length != 0){
            sections.push(`  - Chi tiết cộng thêm DC: ${stats.detailed_dc[0]}`);
        }
        
        const saveTypeStr = (stats.save.type !== 'Không' && stats.save.type != null) ? `${stats.save.type} (${stats.save.on_save})` : 'Không cần miễn nhiễm';
        sections.push(`Phán định miễn nhiễm: ${saveTypeStr}`);
        if(stats.save.type !== 'Không' && stats.save.type != null) sections.push("Phép thuật tổ hợp chỉ tiến hành miễn nhiễm một lần, kết quả có hiệu lực với tất cả các chú tự hiệu ứng phép thuật cần miễn nhiễm");
        sections.push(`--------------------------------------------------`);

        // Phân tích chú tự mục tiêu
        if (spell.target_words.length > 0) {
            sections.push(this.generateTargetPrompt(spell.target_words[0]));
            sections.push('');
        }

        sections.push("Chú tự hiệu ứng phát huy tác dụng lần lượt");

        // Phân tích chú tự hiệu ứng
        const allEffects = [...spell.effect_words, ...spell.unique_effect_words];
        allEffects.forEach(e => {
            sections.push(this.generateEffectPrompt(e));
            sections.push('');
        });

        // Phân tích siêu ma toàn cục
        if (spell.spell_meta_words.length > 0) {
            spell.spell_meta_words.forEach(m => {
                sections.push(this.generateSpellMetaPrompt(m));
            });
            sections.push('');
        }

        const kv_array = Object.entries(stats.cast_interceptors);
        if(kv_array.length != 0){
            sections.push("Hiệu ứng kích hoạt khi nhân vật chiến đấu: ");
            kv_array.forEach(([hookname, valarray]) => {
                sections.push(`*${hookname}: `);
                valarray.forEach( e => {
                    sections.push(`  -${e}`);
                });
            })
        }
    

        sections.push(`==================================================`);
        sections.push(`Chỉ lệnh hệ thống: Vui lòng dựa trên mô tả về phạm vi, hiệu ứng, điều kiện kiểm soát và chỉ lệnh bổ sung của phép thuật phía trên để tiến hành kiểm định tương ứng; đồng thời tham khảo mức tiêu hao và hiệu ứng cụ thể của phép thuật để tái hiện thanh thế và cái giá phải trả của phép thuật, sau đó tạo ra văn bản nhập vai mô tả biểu hiện của phép thuật đó.`);

        return sections.join('\n');
    }
}



