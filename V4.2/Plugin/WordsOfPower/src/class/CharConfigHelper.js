/**
 * 角色额外配置管理器 (基于 ST 变量系统)
 */
export class CharConfigManager {
    /**
     * @param {string} domainType - 变量存储的域，默认 'chat'，可改为 'global' 等
     */
    constructor(domainType = 'chat') {
        // 动态域配置，不硬编码
        this.domain = { type: domainType };
        
        // 基础路径
        this.basePath = 'words_of_power_dlc.additional_char_data';
        
        // 角色额外数据的默认模板
        this.defaultTemplate = {
            // ... 可以在这里扩充任何你需要的额外字段
        };
    }

    /**
     * 辅助：获取角色在数据树中的真实键名 (特判主角)
     */
    _getRealKey(charKey, isProtagonist) {
        // 统一主角的键名，配角使用原有名字
        return isProtagonist ? '主角' : charKey;
    }

    /**
     * 辅助：获取 Lodash 需要的完整路径
     */
    _getFullPath(charKey, isProtagonist) {
        const realKey = this._getRealKey(charKey, isProtagonist);
        return `${this.basePath}.${realKey}`;
    }

    /**
     * 获取指定角色的配置。如果不存在，则使用模板自动创建。
     * @returns {Object} 角色的额外配置数据
     */
    getConfig(charKey, isProtagonist = false) {
        // 1. 获取目标域下的完整变量树
        const vars = getVariables(this.domain);
        const fullPath = this._getFullPath(charKey, isProtagonist);
        
        // 2. 使用 lodash 安全地获取深层数据
        let config = _.get(vars, fullPath);

        // 3. 如果没拿到（说明是第一次读取），按照模板初始化
        if (!config) {
            // 深拷贝模板，防止引用污染
            config = _.cloneDeep(this.defaultTemplate);
            
            // 将初始化的默认数据回写到存储中
            this.setConfig(charKey, config, isProtagonist);
            console.log(`[CharConfig] 已为 ${charKey} 初始化额外数据`);
        }
        
        return config;
    }

    /**
     * 整体覆盖角色的配置数据
     */
    setConfig(charKey, newConfig, isProtagonist = false) {
        const fullPath = this._getFullPath(charKey, isProtagonist);
        
        // 使用 updateVariablesWith，它是最安全的（防止并发读写时的脏数据）
        updateVariablesWith(vars => {
            _.set(vars, fullPath, newConfig);
            return vars;
        }, this.domain);
    }

    /**
     * 仅更新/修改角色的某个特定属性 (推荐使用，性能更好，颗粒度更细)
     * @param {string} propertyPath - 例如 'customColor' 或 'stats.health'
     */
    updateProperty(charKey, propertyPath, value, isProtagonist = false) {
        const fullPath = `${this._getFullPath(charKey, isProtagonist)}.${propertyPath}`;
        
        updateVariablesWith(vars => {
            _.set(vars, fullPath, value);
            return vars;
        }, this.domain);
    }

    /**
     * 清理/删除指定角色的额外数据
     */
    deleteConfig(charKey, isProtagonist = false) {
        const fullPath = this._getFullPath(charKey, isProtagonist);
        
        // 直接调用 API 提供的删除方法
        deleteVariable(fullPath, this.domain);
        console.log(`[CharConfig] 已移除 ${charKey} 的额外数据`);
    }
}

// 实例化为全局单例，默认存放于 chat (当前聊天档)
//const ConfigDB = new CharConfigManager('chat');