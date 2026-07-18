export const DB_PATH = {
    // Root node path mapping
    ROOT: {
        STAT_DATA: '',
        ASSET_MANAGER: 'Assets',
        WAREHOUSE: 'Assets.Warehouse',
        ASSETS: 'Assets.AssetOverview',
        NPCS: 'RelationshipList',
        Inventory: 'Protagonist.Inventory',
        // Protagonist data is scattered, define specific locations
        PLAYER_BASE: 'Protagonist',
        PLAYER_SKILLS: 'Protagonist.Skills',
        PLAYER_ATTRS: 'Protagonist.Attributes',
        PLAYER_EQUIP: 'Protagonist.Equipment',     // <--- If equipment is moved to 'Character.Equipment' later, just change it here
        PLAYER_GOD: 'Protagonist.AscensionPath',
        POSITION: 'World.Location'
    },
    // Attribute key name mapping
    KEY: {
        // General?
        QUALITY: 'Quality',
        POS: 'Location',
        QTY: 'Quantity',
        TYPE: 'Type',
        Tags: 'Tags',
        DESC: 'Description',
        EFFECT: 'Effect',
        COST: 'Cost',
        SKILLS: 'Skills',
        EQUIPMENT: 'Equipment',
        Inventory: 'Inventory',
        STATUS: 'StatusEffect',
        ATTRIBUTES: 'Attributes',
        LEVEL: "Level",

        // Destined person attributes
        NPC_IS_PRESENT: 'IsPresent',
        NPC_IS_CONTRACT: 'DestinyContract',
        NPC_LIFE_LEVEL: 'LifeTier',
        NPC_LEVEL: 'Level',
        NPC_RACE: 'Race',
        NPC_IDENTITY: 'Identity',
        NPC_PROFESSION: 'Class',
        NPC_PERSONALITY: 'Personality',
        NPC_LIKES: 'Likes',
        NPC_APPEARANCE: 'Appearance',
        NPC_CLOTHING: 'Outfit',
        NPC_EQUIPMENT: 'Equipment',
        NPC_ATTRIBUTES: 'Attributes',
        NPC_GODPATH: 'AscensionStairway',
        NPC_FRIENDSHIP: 'Affection',
        NPC_COMMENT: 'InnerThoughts',
        NPC_BACKGROUNDSTORY: 'Background',
        NPC_SKILL: 'Skills',
        NPC_BACKPACK: 'Inventory',

        // Skill attributes
        SKILL_QUALITY: 'Quality',
        SKILL_TYPE: 'Type',
        SKILL_COST: 'Cost',
        SKILL_TAG: 'Tags',
        SKILL_DESC: 'Description',
        SKILL_EFFECT: 'Effect',

        // Item attributes
        //ITEM_NAME: 'Name', // Although usually used as a Key, it can also be an attribute
        ITEM_QUALITY: 'Quality',
        ITEM_QTY: 'Quantity',
        ITEM_TYPE: 'Type',
        ITEM_TAG: 'Tags',
        ITEM_DESC: 'Description',
        ITEM_EFFECT: 'Effect',
        ITEM_POS: 'Location',

        // Character attributes
        PLAYER_LEVEL: 'Level',
        PLAYER_LIFE_LEVEL: 'LifeTier',
        PLAYER_RACE: 'Race',
        PLAYER_IDENTITY: 'Identity',
        PLAYER_PROFESSION: 'Class',
        PLAYER_ATTRIBUTES: 'Attributes',
        PLAYER_MAXMP: "MaxMP",
        // ... List all strings used in the code here
    }
};
export const ChartManager = {
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

    getPlayerBase: function () {
        return this.getDataByPath(this.DB_PATH.ROOT.PLAYER_BASE);
    },

    getPlayerRuntime: function (){
        const holder = { runtime: {} };
        if(eventEmit && typeof(eventEmit) === "function"){
            eventEmit("onGetPlayerRuntime", holder);
        }
        return holder.runtime;
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
    },
};
