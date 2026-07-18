/**
 * QuestTrackerWidget - Quả cầu lơ lửng Nhiệm vụ (Phiên bản tiêm Vue 3)
 */

const win = window.parent;
const doc = window.parent.document;

const DB_PATH = {
    // Ánh xạ đường dẫn node gốc
    ROOT: {
        STAT_DATA:'',
        NPCS: 'RelationshipList',
        BACKPACK: 'Protagonist.Inventory',
        // Dữ liệu Protagonist khá phân tán, xác định vị trí cụ thể
        PLAYER_BASE: 'Protagonist',
        PLAYER_SKILLS: 'Protagonist.Skills',
        PLAYER_ATTRS: 'Protagonist.Attributes',
        PLAYER_EQUIP: 'Protagonist.Equipment',     // <--- Nếu sau này trang bị chuyển sang 'Nhân Vật.Equipment', chỉ sửa ở đây là được
        PLAYER_GOD: 'Protagonist.AscensionStairway',
        POSITION: 'World.Location',
        QUEST: "Event",
    },
    // Ánh xạ tên khóa thuộc tính
    KEY: {
        // Thông dụng?
        QUALITY: 'Quality',
        POS: 'Location',
        QTY: 'Quantity',
        TYPE: 'Type',
        TAG: 'Tags',
        DESC: 'Description',
        EFFECT: 'Effect',
        COST: 'Cost',
        SKILLS: 'Skills',
        EQUIPMENT: 'Equipment',
        BACKPACK: 'Inventory',
        STATUS: 'StatusEffect',
        ATTRIBUTES: 'Attributes',
        LEVEL: "Level",

        // Thuộc tính Người được định mệnh sắp đặt (Destined One)
        NPC_IS_PRESENT:'IsPresent',
        NPC_IS_CONTRACT:'DestinyContract',
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

        // Thuộc tính Kỹ năng
        SKILL_QUALITY: 'Quality',
        SKILL_TYPE: 'Type',
        SKILL_COST: 'Cost',
        SKILL_TAG: 'Tags',
        SKILL_DESC: 'Description',
        SKILL_EFFECT: 'Effect',

        // Thuộc tính Vật phẩm
        //ITEM_NAME: 'Name', // Mặc dù thường được dùng làm Key, nhưng cũng có thể làm thuộc tính
        ITEM_QUALITY: 'Quality',
        ITEM_QTY: 'Quantity',
        ITEM_TYPE: 'Type',
        ITEM_TAG: 'Tags',
        ITEM_DESC: 'Description',
        ITEM_EFFECT: 'Effect',
        ITEM_POS: 'Location',
    }
};

const DEF_WORLDBOOK = getCharWorldbookNames("current").primary;
// ==========================================
// ⚙️ Tệp cấu hình (Có thể sửa đổi bất cứ lúc nào)
// ==========================================
const CONFIG = {
    // Đường dẫn Avatar mặc định của quả cầu lơ lửng
    AVATAR_URL: "https://files.catbox.moe/mcyy5m.jpg", // Vui lòng thay thế bằng đường dẫn hình ảnh thực tế hoặc Base64 của bạn
    AVATAR_URLS: [
        "https://files.catbox.moe/mcyy5m.jpg",
        "https://files.catbox.moe/qm4t7t.jpg",
        "https://files.catbox.moe/t2kaj6.jpg",
        "https://files.catbox.moe/ykdmu1.jpg",
        "https://files.catbox.moe/fl9evv.jpg",
        "https://files.catbox.moe/bh6yfm.jpg",
        "https://files.catbox.moe/3mhmdh.jpg",
        "https://files.catbox.moe/0yy18s.jpg",
        "https://files.catbox.moe/xmwy90.jpg",
    ],

    
    // Từ điển Nhiệm vụ: Dùng để cấu hình lời nhắc và hướng dẫn tiết lộ nội dung (spoilers) cho từng nhiệm vụ, giai đoạn
    QUEST_DICT: {
        "ch1_first_meet": {
            name: "Chương 1: Lần đầu gặp gỡ",
            stages: {
                "start": "Gợi ý: Đi dạo xung quanh hạ thành khu, cố gắng đừng giữ phong cách quá hỗn loạn.",
            },
            spoilers: "Cách mở khóa: Nhận nhiệm vụ: “Tìm kiếm danh sách hàng hóa bị mất” tại công hội mạo hiểm giả Hồng Diệp trấn. Nếu không có, hãy thử tìm “Ủy thác lợi nhuận cao hơn”. Với cấu trúc cốt truyện hiện tại, Giai Vị tương đối thấp có thể phù hợp hơn để đi theo quy trình nhiệm vụ gặp gỡ lần đầu."
        },
        "ch2_behind_halo": {
            name: "Nhiệm vụ cá nhân 1: Sức nặng của Vầng sáng",
            stages: {
                "start": "Gợi ý: Chú ý nhiều hơn đến trạng thái của cô ấy, hãy đi cùng cô ấy để tìm hiểu bản chất của Thần Dụ.",
                "under_the_sacred": "Gợi ý: Cố gắng tìm kiếm sự thật."
            },
            spoilers: "Cách mở khóa: Khi Lucille đạt Tứ Giai và Affection lớn hơn 80 sẽ xuất hiện trạng thái kỳ lạ, sau đó đi cùng cô ấy về nhà thờ, đi theo quy trình sẽ dần dần tiết lộ một phần sự thật."
        },
        "ch3_dying_light": {
            name: "Nhiệm vụ cá nhân 2: Tàn quang Lãnh nguyên",
            stages: {
                "start": "Chờ đợi lão mục sư điều tra hoàn tất",
                "trace": "Đi theo dấu vết xuống núi tìm kiếm manh mối",
                "glimmer": "Dấu ấn của sự tin tưởng tuyệt đối",
            },
            spoilers: "Cách mở khóa: Đợi kết quả điều tra của lão mục sư, sau đó tiến về núi tuyết tìm kiếm Cecilia."
        },
        "side_unfallen_afterglow": {
            name: "Tuyến phụ: Thành phố Hoàng Hôn",
            stages: {
                "start": "Gợi ý: Hãy tận hưởng lễ hội",
                "festival_end": "Gợi ý: Tìm kiếm nhà vua"
            },
            spoilers: "Cách mở khóa: Affection lớn hơn 60, sau khi gặp bão cát ở sa mạc hoặc vùng hoang dã thì tiến vào thành phố, tham gia lễ hội, theo quy trình mở khóa sự thật."
        }
    },

    // Từ điển Flag: Dùng để giải thích ý nghĩa của mỗi Flag trong trang tiết lộ nội dung
    FLAG_DICT: {
        "true_end_flag1": "Điều kiện tiên quyết True End 1: Giải mã Thánh ngôn lục của cựu Giáo hoàng (giữ chỗ)",
        "true_end_flag2": "Điều kiện tiên quyết True End 2: Lấy được bàn cờ vua ẩn chứa bí mật (giữ chỗ)",
        "dedicated_wondrous_item_afterglow": "Hoàn thành tuyến phụ, nhận vật phẩm độc quyền. Dùng để duy trì phần lớn năng lực thi triển pháp thuật sau khi từ bỏ tín ngưỡng",
        "believe_in_user": "Trong ch3 đã chọn lời lẽ khích lệ sự tự tin nhất. Trọng điểm nằm ở việc khẳng định giá trị của chính cô ấy chứ không phải ảnh hưởng của thần minh. Điều cô ấy cần hơn là sự khẳng định ý chí tự do và giá trị tồn tại của bản thân"
    },

    // ==========================================
    // 💡 Thêm mới: Khung manh mối/tin đồn nhiệm vụ có thể kích hoạt
    // ==========================================
    AVAILABLE_QUEST_HINTS: [
        {
            id: "hint_first_meet",
            hint: "Tin đồn: Công hội mạo hiểm giả Hồng Diệp trấn có một ủy thác thù lao khá cao, có muốn đi xem thử không...",
            // Hàm condition sẽ nhận toàn bộ dữ liệu của nhân vật hiện tại (charData)
            condition: (charData) => {
                // Logic ví dụ: Nếu đã hoàn thành chương mở đầu, và tuyến phụ này chưa tiến hành, cũng chưa hoàn thành, thì hiển thị manh mối này
                const notActive = !charData.active_quests?.["ch1_first_meet"];
                const notCompleted = !charData.completed_quests?.["ch1_first_meet"];
                
                return notActive && notCompleted;
            }
        },
        {
            id: "hint_ch2",
            hint: "Trạng thái gần đây của tiểu mục sư có chút không ổn, hãy chú ý đến cô ấy nhiều hơn nhé...",
            // Hàm condition sẽ nhận toàn bộ dữ liệu của nhân vật hiện tại (charData)
            condition: (charData) => {
                const notActive = !charData.active_quests?.["ch2_behind_halo"];
                const notCompleted = !charData.completed_quests?.["ch2_behind_halo"];
                const firstMeetDone = charData.completed_quests?.["ch1_first_meet"] === true;
                const enoughRelation = charData.base_stats.affection >= 80;
                
                return notActive && notCompleted && firstMeetDone && enoughRelation;
            }
        },
        {
            id: "hint_ch3",
            hint: "Chờ đợi lão mục sư điều tra hoàn tất……",
            condition: (charData) => {
                const notActive = !charData.active_quests?.["ch3_dying_light"];
                const notCompleted = !charData.completed_quests?.["ch3_dying_light"];
                const ch2Done = charData.completed_quests?.["ch2_behind_halo"] === true;
                
                return notActive && notCompleted && ch2Done;
            }
        },
        {
            id: "hint_unfallen_afterglow_side",
            hint: "Đi sa mạc xem thử, nghe nói một vài thành phố sẽ xuất hiện sau trận bão cát...",
            // Hàm condition sẽ nhận toàn bộ dữ liệu của nhân vật hiện tại (charData)
            condition: (charData) => {
                const is_present = charData.base_stats.is_present;
                const firstMeetDone = charData.completed_quests?.["ch1_first_meet"] === true;
                const notActive = !charData.active_quests?.["side_unfallen_afterglow"];
                const notCompleted = !charData.completed_quests?.["side_unfallen_afterglow"];
                const enoughRelation = charData.base_stats.affection >= 60;
                
                return is_present && firstMeetDone && notActive && notCompleted && enoughRelation;
            }
        },
        {
            id: "hint_to_be_continue",
            hint: "Chưa hoàn thành, trước khi tiến vào Lục Giai hãy tìm ra cách phá vỡ cục diện...",
            condition: (charData) => {
                const ch3Done = charData.completed_quests?.["ch3_dying_light"] === true;
                const notCompleted = charData.completed_quests?.["end"] != true;
                const notEnd = charData.base_stats.level < 21;
                return ch3Done && notCompleted && notEnd;
            }
        },
        {
            id: "hint_high_affection_ch1",
            hint: "Gợi ý: Do Affection tương đối cao, lúc này đi đến quán rượu có thể sẽ có thêm đối thoại gắn kết.",
            condition: (charData) => {
                return false;
                // 1. Kiểm tra thuộc tính cơ bản được hòa trộn vào (Affection lớn hơn 80)
                const isHighAffection = charData.base_stats.affection >= 80;
                
                // 2. Kiểm tra trạng thái nhiệm vụ (Một nhiệm vụ nào đó vừa mới bắt đầu)
                const isQuestStart = charData.active_quests?.["ch1_first_meet"]?.stage === "start";
                
                // 3. Kiểm tra Flags toàn cục
                const notTriggeredSpecial = !charData.global_flags?.["special_dialog_done"];

                // Đánh giá tổng hợp
                return isHighAffection && isQuestStart && notTriggeredSpecial;
            }
        }
        // Bạn có thể thoải mái thêm nhiều manh mối hơn vào đây sau này...
    ],
    // ==========================================
    // 📚 Thêm mới: Cấu hình bảng điều khiển Thế giới thư (Worldbook)
    // ==========================================
    WORLDBOOK_CONTROLS: [
        {
            id: "toggle_lucille_quest_main",
            label: "Tổng kiểm soát nhiệm vụ Lucille (Mô-đun tuyến chính)",
            desc: "Kiểm soát phản hồi và tạo Event của chuỗi nhiệm vụ cốt lõi Lucille.",
            actions: [
                { worldbook: DEF_WORLDBOOK, entries: ["[DLC][Nhân Vật][Lucille] Tổng Kiểm Soát Nhiệm Vụ Nhân Vật"] }
            ]
        },
        {
            id: "toggle_lucille_quest_side",
            label: "Tổng kiểm soát tuyến phụ Lucille",
            desc: "Kiểm soát phản hồi và tạo Event của chuỗi nhiệm vụ tuyến phụ Lucille. Chỉ có một cái, không muốn dùng có thể tắt. Có thể mở cùng lúc với tuyến chính, nhưng để tránh xung đột prompt tiềm ẩn, có thể tắt mô-đun tuyến chính khi chạy tuyến phụ",
            actions: [
                { worldbook: DEF_WORLDBOOK, entries: ["[DLC][Nhân Vật][Lucille] Tổng Kiểm Soát Nhiệm Vụ Phụ Tuyến Của Nhân Vật"] }
            ]
        },
        {
            id: "toggle_lucille_extra_spell",
            label: "Mở Rộng pháp thuật Lucille",
            desc: "Một số pháp thuật mục sư thực dụng bổ sung, có thể mở theo nhu cầu",
            actions: [
                { worldbook: DEF_WORLDBOOK, entries: ["[DLC][Nhân Vật][Lucille] Mở rộng pháp thuật của Lucille"] }
            ]
        },
        {
            id: "toggle_lucille_roleplay_rules",
            label: "Hướng dẫn nhập vai Lucille (Gốc)",
            desc: "Kiểm soát ranh giới đóng vai tính cách của Lucille. Nếu cảm thấy phong cách AI đóng vai không có vấn đề gì thì có thể không mở",
            exclusiveGroup: "role_play_group",
            actions: [
                { worldbook: DEF_WORLDBOOK, entries: ["[DLC][Nhân Vật][Lucille] Hướng dẫn đóng vai Lucille Vera", "[DLC][Nhân Vật][Lucille] Suy nghĩ đóng vai Lucille Vera"] }
            ]
        },        
        {
            id: "toggle_lucille_roleplay_rules_complex",
            label: "Hướng dẫn nhập vai Lucille (Bản phức tạp)",
            desc: "Kiểm soát ranh giới đóng vai tính cách của Lucille. So với bản gốc thì phức tạp hơn, tiêu tốn nhiều token hơn, áp dụng cho Nhân Vật bản phức tạp, có thể tắt",
            exclusiveGroup: "role_play_group",
            actions: [
                { worldbook: DEF_WORLDBOOK, entries: ["[DLC][Nhân Vật][Lucille] Hướng dẫn đóng vai Lucille Vera (Phức tạp)", "[DLC][Nhân Vật][Lucille] Suy nghĩ đóng vai Lucille Vera (Phức tạp)"] }
            ]
        },
        {
            id: "toggle_lucille_base",
            label: "Lucille (Gốc)",
            desc: "Thiết lập cơ bản của Lucille. Chọn mở một trong hai bản (gốc hoặc phức tạp)",
            exclusiveGroup: "lucille_base_group",
            actions: [
                { worldbook: DEF_WORLDBOOK, entries: ["[DLC][Nhân Vật][Lucille] Lucille Vera"] }
            ]
        },
        {
            id: "toggle_lucille_base_complex",
            label: "Lucille (Bản phức tạp)",
            desc: "Thiết lập cơ bản của Lucille. So với bản gốc đã Mở Rộng quy mô lớn về tính cách, tiêu tốn nhiều token hơn, chọn mở một trong hai bản",
            exclusiveGroup: "lucille_base_group",
            actions: [
                { worldbook: DEF_WORLDBOOK, entries: ["[DLC][Nhân Vật][Lucille] Lucille Vera (Phức tạp)"] }
            ]
        },
        
        /*
        {
            id: "toggle_lucille_combat",
            label: "Tiếp quản mô-đun chiến đấu",
            desc: "Sau khi bật, kích hoạt chi tiết chỉ số chiến đấu và quy tắc phán định trong nội dung chính.",
            actions: [
                { worldbook: "Hệ Thống_Quy tắc chung", entries: ["CRPG_Tiêu chuẩn phán định chiến đấu"] },
                { worldbook: "Nhân Vật Mở Rộng: Lucille·Vela", entries: ["Nhóm Kỹ Năng_Băng Sương", "AI Chiến Đấu_Lucille"] }
            ]
        }
        {
            id: "toggle_combat_turn_based",
            label: "Bật chiến đấu theo lượt",
            desc: "Sử dụng Agility quyết định thứ tự ra tay. Loại trừ lẫn nhau với chiến đấu thời gian thực.",
            exclusiveGroup: "combat_mode", // <--- Thêm mới: Định nghĩa nhóm loại trừ lẫn nhau
            actions: [
                { worldbook: "Hệ Thống_Quy tắc chung", entries: ["CRPG_Tiêu chuẩn theo lượt"] }
            ]
        },
        {
            id: "toggle_combat_realtime",
            label: "Bật chiến đấu thời gian thực",
            desc: "Sử dụng thanh thời gian quyết định thứ tự ra tay. Loại trừ lẫn nhau với chiến đấu theo lượt.",
            exclusiveGroup: "combat_mode", // <--- Thêm mới: Định nghĩa nhóm loại trừ lẫn nhau
            actions: [
                { worldbook: "Hệ Thống_Quy tắc chung", entries: ["CRPG_Tiêu chuẩn thời gian thực"] }
            ]
        }    
        */
        // Có thể tiếp tục thêm nhiều nút điều khiển vào đây bất cứ lúc nào...
    ]
};

const AssetManager = {
    mvuData: null,
    // 1. Bảng ánh xạ đường dẫn
    DB_PATH : DB_PATH,

    // 2. Trình thực thi phân tích đường dẫn
    getDataByPath: function(pathStr) {
        if (!pathStr) return this.mvuData.stat_data;
        const parts = pathStr.split('.');
        let current = this.mvuData.stat_data;
        for (const p of parts) {
            if (current[p] === undefined) current[p] = {}; 
            current = current[p];
        }
        return current;
    },
    getPresentCharactersKey: function(){
        const keys = [];
        const isPresentKey = this.DB_PATH.KEY.NPC_IS_PRESENT;
        keys.push("Protagonist");
        const npcs = this.getDataByPath(this.DB_PATH.ROOT.NPCS);
        Object.entries(npcs).forEach(([name, data]) => {
            // Logic lọc cốt lõi: Chỉ hiển thị khi "IsPresent" là true
            if (data[isPresentKey] === true || data[isPresentKey] === "true") {
                keys.push(name);
            }
        });
        return keys;
    },

    // 3. Lấy danh sách Nhân Vật có mặt theo thời gian thực
    getPresentCharacters: function() {
        const list = [];
        const isPresentKey = this.DB_PATH.KEY.NPC_IS_PRESENT;

        // Lấy dữ liệu Protagonist
        const playerBase = this.getDataByPath(this.DB_PATH.ROOT.PLAYER_BASE);
        list.push({
            key: 'Protagonist',
            displayName: 'Protagonist',
            isProtagonist: true,
            data: playerBase,
        });

        // Lấy NPC/RelationshipList
        const npcs = this.getDataByPath(this.DB_PATH.ROOT.NPCS);
        Object.entries(npcs).forEach(([name, data]) => {
            // Logic lọc cốt lõi: Chỉ hiển thị khi "IsPresent" là true
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

    init: async function() {
        const findMvu = () => {
            if (typeof window.Mvu !== 'undefined') return window.Mvu;
            if (window.parent && typeof window.parent.Mvu !== 'undefined') return window.parent.Mvu;
            return null;
        };
        // 1. Định nghĩa một hàm chờ đơn giản
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        let retries = 0;
        let mvuApi = findMvu();
        while (!mvuApi) {
            if (retries > 60) { // Kéo dài thời gian chờ lên 30 giây (60*500ms)
                alert("Hết thời gian kết nối, vui lòng kiểm tra xem script mvu có tồn tại không");
                return;
            }

            await wait(500);
            retries++;
            mvuApi = findMvu(); // Thử tìm kiếm lại
        }
        this.mvuData = mvuApi.getMvuData({ type: 'message' });
    }
};
await AssetManager.init();
// ==========================================
// 🛠️ Mô phỏng lấy dữ liệu (Thích ứng với AssetManager của bạn)
// ==========================================

const qusetKeyToCharName = {
    "Lucille": "Lucille Vera",
}
const R = DB_PATH.ROOT;
const K = DB_PATH.KEY;
const getQuestData = () => {
    // Khi sử dụng thực tế thay thế bằng: 
    const rawQuestData = AssetManager.getDataByPath(`${DB_PATH.ROOT.QUEST}.characters_quests`) || {};

    // 2. Lấy kho thuộc tính Nhân Vật toàn cục (Sử dụng DB_PATH trong code gốc của bạn)
    const rawNpcData = AssetManager.getDataByPath(AssetManager.DB_PATH.ROOT.NPCS) || {};
    const mergedQuestData = {};
    // 3. Duyệt qua các Nhân Vật có dữ liệu nhiệm vụ, tiêm thuộc tính toàn cục
    for (const [charName, qData] of Object.entries(rawQuestData)) {
        const baseStats = rawNpcData[qusetKeyToCharName[charName]] || {};

        mergedQuestData[charName] = {
            // Trải phẳng dữ liệu nhiệm vụ gốc (active_quests, completed_quests, global_flags, v.v.)
            ...qData, 
            
            // 【Thêm mới】: Tạo một namespace độc lập chứa các thuộc tính cơ bản lấy từ bên ngoài
            // Làm vậy để ngăn chặn xung đột key giữa thuộc tính bên ngoài và dữ liệu nhiệm vụ
            base_stats: {
                level: baseStats[K.NPC_LEVEL] || 1,                     // Level mặc định
                affection: baseStats[K.NPC_FRIENDSHIP] || 0,             // Affection
                is_present: baseStats[K.NPC_IS_PRESENT] || false, 
                // Dựa trên Hệ Thống game của bạn, hãy trích xuất tất cả các biến cần thiết vào đây...
            }
        };
    }
    return mergedQuestData;
    /*
    return {
        "Lucille": {
            "active_quests": {
                "ch1_first_meet": { "stage": "start", "desc": "Mới bắt đầu tiến hành" },
                "side_find_messenger": { "stage": "asking_residents", "desc": "Đang tìm manh mối từ cư dân", "local_flags": { "found_truth": false } }
            },
            "completed_quests": {
                "ch.0_prologue": true
            },
            "global_flags": {
                "true_end_flag1": false,
                "true_end_flag2": false
            },
            "counters": {
                "bond_alden": 50,
                "devotion": 90
            }
        }
    };
    */
};

// ==========================================
// 1. Trình khởi động (Sử dụng lại logic của bạn)
// ==========================================
function bootstrapQuestWidget() {
    const oldRoot = doc.getElementById('quest-widget-rc-lucille-vue-root');
    if (oldRoot) {
        oldRoot.remove(); 
        if (win.__QUEST_VUE_APP_RC_LUCILLE__) {
            win.__QUEST_VUE_APP_RC_LUCILLE__.unmount();
            delete win.__QUEST_VUE_APP_RC_LUCILLE__;
        }
    }

    let vueScript = document.getElementById('destined-vue3-script');
    if (!vueScript) {
        vueScript = document.createElement('script');
        vueScript.id = 'destined-vue3-script';
        vueScript.src = 'https://unpkg.com/vue@3/dist/vue.global.js';
        vueScript.onload = () => initVueApp();
        document.head.appendChild(vueScript);
    } else {
        if (window.Vue && window.Vue.createApp) initVueApp();
        else vueScript.addEventListener('load', () => initVueApp());
    }
}

function destroyQuestWidget() {
    const root = doc.getElementById('quest-widget-rc-lucille-vue-root');
    if (root) root.remove();
    const style = doc.getElementById('quest-widget-rc-lucille-styles');
    if (style) style.remove();
    if (win.__QUEST_VUE_APP_RC_LUCILLE__) {
        win.__QUEST_VUE_APP_RC_LUCILLE__.unmount();
        delete win.__QUEST_VUE_APP_RC_LUCILLE__;
    }
}
if (win.__QUEST_UNLOAD_HANDLER_RC_LUCILLE__) {
    window.removeEventListener('unload', win.__QUEST_UNLOAD_HANDLER_RC_LUCILLE__);
}
win.__QUEST_UNLOAD_HANDLER_RC_LUCILLE__ = destroyQuestWidget;
window.addEventListener('unload', win.__QUEST_UNLOAD_HANDLER_RC_LUCILLE__);


// ==========================================
// Tách logic: Mô-đun điều khiển Thế giới thư
// ==========================================
function useWorldbook(Vue, win, config) {
    const { ref } = Vue;
    // Ghi lại trạng thái bật tắt hiện tại của mỗi nút (Key: btn.id, Value: boolean)
    const wbStates = ref({});
    // Chống rung (debounce) và khóa tải
    const isWbLoading = ref(false);

    // Khởi tạo: Đọc trạng thái thực sự của Thế giới thư hiện tại
    const fetchWbStates = async () => {
        if (!config.WORLDBOOK_CONTROLS) return;
        
        for (const btn of config.WORLDBOOK_CONTROLS) {
            isWbLoading.value = true;
            try {
                // Đọc mục đầu tiên của Thế giới thư đầu tiên trong nhóm hành động, làm trạng thái cơ sở cho nút này
                const firstAction = btn.actions[0];
                if (!firstAction) continue;
                
                const wb = await getWorldbook(firstAction.worldbook);
                if (wb && Array.isArray(wb)) {
                    const entry = wb.find(e => firstAction.entries.includes(e.name));
                    wbStates.value[btn.id] = entry ? entry.enabled : false;
                }
            } catch (e) {
                console.warn(`[Worldbook] Đọc trạng thái thất bại [${btn.label}]:`, e);
                wbStates.value[btn.id] = false;
            } finally {
                isWbLoading.value = false;
            }
        }
    };

    // Thực thi thao tác chuyển đổi
    const toggleWbGroup = async (btn) => {
        if (isWbLoading.value) return;
        isWbLoading.value = true;
        
        try {

            const isTurningOn = !wbStates.value[btn.id];
            // ==========================================
            // 1. Giai đoạn thu thập ý định (Thu thập tất cả các trạng thái cần sửa đổi)
            // Cấu trúc: { "Thế giới thư A": { "Mục 1": true, "Mục 2": false }, "Thế giới thư B": ... }
            // ==========================================
            const pendingUpdates = {};

            // Hàm phụ trợ: Ghi lại ý định sửa đổi vào pendingUpdates
            const planUpdate = (worldbookName, entries, targetState) => {
                if (!pendingUpdates[worldbookName]) pendingUpdates[worldbookName] = {};
                entries.forEach(entryName => {
                    pendingUpdates[worldbookName][entryName] = targetState;
                });
            };
            // 2. Thu thập ý định tắt của nhóm loại trừ lẫn nhau
            if (isTurningOn && btn.exclusiveGroup) {
                const conflicts = config.WORLDBOOK_CONTROLS.filter(
                    c => c.exclusiveGroup === btn.exclusiveGroup && c.id !== btn.id && wbStates.value[c.id] === true
                );

                for (const conflictBtn of conflicts) {
                    // Ghi lại ý định sửa đổi lớp đáy
                    for (const action of conflictBtn.actions) {
                        planUpdate(action.worldbook, action.entries, false);
                    }
                    // Đồng bộ hóa trạng thái UI của mục xung đột trước
                    wbStates.value[conflictBtn.id] = false; 
                }
            }

            // 3. Thu thập ý định chuyển đổi của nút hiện tại
            for (const action of btn.actions) {
                planUpdate(action.worldbook, action.entries, isTurningOn);
            }

            // ==========================================
            // 4. Giai đoạn thực thi tập trung (Mỗi quyển Thế giới thư chỉ gọi API một lần)
            // ==========================================
            for (const [worldbookName, entryUpdates] of Object.entries(pendingUpdates)) {
                console.log(`[Worldbook] Xử lý hàng loạt Cập nhật ${worldbookName}:`, entryUpdates);
                
                await updateWorldbookWith(worldbookName, (latestWb) => {
                    return latestWb.map(entry => {
                        // Nếu chúng ta đã ghi lại ý định sửa đổi mục này trong pendingUpdates, thì áp dụng trạng thái mới
                        if (entryUpdates[entry.name] !== undefined) {
                            return { ...entry, enabled: entryUpdates[entry.name] };
                        }
                        return entry;
                    });
                }, { render: 'immediate' });
            }
            
            // 5. Cập nhật trạng thái UI của nút hiện tại
            wbStates.value[btn.id] = isTurningOn;
            
        } catch (e) {
            console.error(`[Worldbook] Chuyển đổi thất bại [${btn.label}]:`, e);
            await fetchWbStates();
        } finally {
            isWbLoading.value = false;
        }
    };

    return { wbStates, isWbLoading, fetchWbStates, toggleWbGroup };
}
// ==========================================
// 2. Cốt lõi: Khởi tạo Ứng dụng Vue
// ==========================================
function initVueApp() {
    const { createApp, ref, reactive, computed, onMounted, onUnmounted, watch } = window.Vue;
    renderVueStyles();

    const rootDiv = doc.createElement('div');
    rootDiv.id = 'quest-widget-rc-lucille-vue-root';
    doc.body.appendChild(rootDiv);

    const app = createApp({
        template: `
        <div id="quest-app-container" :class="{ 'panel-is-open': isPanelOpen }">
            <div id="quest-ball" 
                :style="{ top: ballPos.y + 'px', left: ballPos.x + 'px' }"
                @mousedown.prevent="startDrag"
                @touchstart.prevent="startDrag"
                :class="{ 'is-dragging': isDragging }">
                <img :src="currentAvatar" alt="Quest" draggable="false" />
            </div>

            <transition name="fade">
                <div id="quest-panel" 
                    v-if="isPanelOpen"
                    :style="{ top: panelPos.y + 'px', left: panelPos.x + 'px' }">
                    <div class="panel-header">
                        <div class="tabs">
                            <span :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'">Nhiệm vụ hiện tại</span>
                            <span :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">Tổng quan toàn cục</span>
                            <span :class="{ active: activeTab === 'worldbook' }" @click="activeTab = 'worldbook'">Kiểm soát Thế giới thư</span>
                        </div>
                        <div class="header-actions">
                            <button class="refresh-btn" @click="refreshData" title="Làm mới dữ liệu bảng điều khiển">↻</button>
                            <button class="close-btn" @click="togglePanel(false)">✖</button>
                        </div>
                    </div>

                    <div class="panel-content">
                        
                        <div v-if="activeTab === 'active'" class="tab-page">
                            <div v-for="(charData, charName) in questData" :key="charName" class="char-section">
                                <h3 class="char-title">👤 Nhiệm vụ của {{ charName }}</h3>
                                <div v-if="Object.keys(charData.active_quests).length === 0" class="empty-hint">Hiện tại không có nhiệm vụ đang tiến hành.</div>
                                
                                <div v-for="(qData, qId) in charData.active_quests" :key="qId" class="quest-card">
                                    <div class="quest-name">{{ getQuestName(qId) }}</div>
                                    <div class="quest-status">Trạng thái hệ thống: {{ qData.desc }} (Giai đoạn: {{ qData.stage }})</div>
                                    <div class="quest-hint">
                                        💡 <strong>Gợi ý người chơi:</strong> {{ getQuestHint(qId, qData.stage) }}
                                    </div>
                                </div>
                                <div class="available-hints-container" v-if="getAvailableHints(charData).length > 0">
                                    <h4 class="hint-section-title">✨ Manh mối / Tin đồn khả dụng</h4>
                                    <div v-for="hintObj in getAvailableHints(charData)" :key="hintObj.id" class="hint-card">
                                        🔍 {{ hintObj.hint }}
                                    </div>
                                </div>
                            </div>
                        </div>

                       <div v-if="activeTab === 'overview'" class="tab-page">
                            <div v-for="(charData, charName) in questData" :key="charName" class="char-section">
                                <h3 class="char-title">📊 Dữ liệu của {{ charName }}</h3>
                                
                                <div class="overview-box safe-box">
                                    <h4>✅ Nhiệm vụ đã hoàn thành</h4>
                                    <span class="tag" v-for="(val, qId) in charData.completed_quests" :key="qId">
                                        {{ getQuestName(qId) }} ({{ val === true ? 'Đã hoàn thành' : val }})
                                    </span>
                                    <div v-if="Object.keys(charData.completed_quests || {}).length === 0" class="empty-hint" style="font-size:12px;color:#999;">Tạm thời chưa có nhiệm vụ đã hoàn thành</div>
                                    
                                    <h4 style="margin-top:10px;">📈 Chỉ số quan hệ</h4>
                                    <div class="counter-grid">
                                        <div v-for="(val, cId) in charData.counters" :key="cId" class="counter-item">
                                            <span class="c-label">{{ cId }}</span>
                                            <span class="c-val">{{ val }}</span>
                                        </div>
                                    </div>

                                    <h4 style="margin-top:10px;">📊 Trạng thái cơ bản của Nhân Vật</h4>
                                    <div class="counter-grid">
                                        <div class="counter-item">
                                            <span class="c-label">Level</span>
                                            <span class="c-val">Lv.{{ charData.base_stats.level }}</span>
                                        </div>
                                        <div class="counter-item">
                                            <span class="c-label">Affection</span>
                                            <span class="c-val">{{ charData.base_stats.affection }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="spoiler-container">
                                    <div v-if="!unlockedSections.char" class="spoiler-overlay">
                                        <div class="warning-icon">🔍</div>
                                        <p>Bao gồm tất cả tên biến giai đoạn của nhiệm vụ hiện tại và đã hoàn thành</p>
                                        <button class="unlock-btn unlock-btn-blue" @click="unlockedSections.char = true">Mở rộng chi tiết nhiệm vụ đã biết</button>
                                    </div>
                                    
                                    <div class="overview-box danger-box info-box" :class="{ 'blurred': !unlockedSections.char }">
                                        <h4>📜 Hướng dẫn đầy đủ nhiệm vụ đã biết</h4>
                                        <div v-if="getKnownQuests(charData).length === 0" class="empty-hint">Chưa nhận bất kỳ nhiệm vụ nào</div>
                                        <div v-for="qId in getKnownQuests(charData)" :key="qId" class="guide-item">
                                            <strong>{{ getQuestName(qId) }} <span class="code-key">{{ qId }}</span></strong>
                                            <p class="spoiler-text">{{ config.QUEST_DICT[qId]?.spoilers || 'Tạm thời chưa có hướng dẫn' }}</p>
                                            <div class="stage-list">
                                                <div v-for="(desc, sKey) in config.QUEST_DICT[qId]?.stages" :key="sKey" class="stage-item">
                                                    <span class="code-key stage-key">{{ sKey }}</span>
                                                    <span class="stage-desc">{{ desc }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="spoiler-container" style="margin-top: 15px;">
                                    <div v-if="!unlockedSections.global" class="spoiler-overlay">
                                        <div class="warning-icon">⚠️</div>
                                        <p>Bao gồm tất cả nhiệm vụ <strong>chưa kích hoạt</strong>, kết cục toàn cục và điều kiện mở khóa</p>
                                        <button class="unlock-btn unlock-btn-red" @click="unlockedSections.global = true">Tôi đã hiểu, mở khóa</button>
                                    </div>
                                    
                                    <div class="overview-box danger-box" :class="{ 'blurred': !unlockedSections.global }">
                                        <h4>🚩 Trạng thái Flags toàn cục (Danh sách đầy đủ)</h4>
                                        <ul class="flag-list">
                                            <li v-for="(fDesc, fId) in config.FLAG_DICT" :key="fId">
                                                <strong :class="charData.global_flags?.[fId] ? 'text-green' : 'text-gray'">
                                                    {{ fId }}
                                                </strong> 
                                                <span :class="charData.global_flags?.[fId] ? 'text-green' : 'text-gray'">
                                                    [{{ charData.global_flags?.[fId] ? 'Đã kích hoạt' : 'Chưa kích hoạt' }}]
                                                </span>
                                                - {{ fDesc }}
                                            </li>
                                        </ul>

                                        <h4 style="margin-top:10px;">📖 Hướng dẫn nhiệm vụ chưa biết</h4>
                                        <div v-if="getUnknownQuests(charData).length === 0" class="empty-hint">Đã khám phá tất cả nhiệm vụ!</div>
                                        <div v-for="qId in getUnknownQuests(charData)" :key="qId" class="guide-item">
                                            <strong>{{ getQuestName(qId) }} <span class="code-key">{{ qId }}</span></strong>
                                            <p class="spoiler-text">{{ config.QUEST_DICT[qId]?.spoilers || 'Tạm thời chưa có hướng dẫn' }}</p>
                                            <div class="stage-list">
                                                <div v-for="(desc, sKey) in config.QUEST_DICT[qId]?.stages" :key="sKey" class="stage-item">
                                                    <span class="code-key stage-key">{{ sKey }}</span>
                                                    <span class="stage-desc">{{ desc }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div v-if="activeTab === 'worldbook'" class="tab-page">
                            <h3 class="char-title">📚 Nút Thế giới thư động</h3>
                            <p style="font-size: 12px; color: #666; margin-bottom: 15px;">
                                Tại đây tiếp quản hoặc ghi đè logic hành vi cốt lõi của nhân vật theo cách thủ công. Xin lưu ý, việc bật các mô-đun xung đột có thể khiến hành vi AI bất thường.
                            </p>
                            
                            <div class="wb-control-list">
                                <template v-for="(item, index) in groupedControls" :key="index">
                                    
                                    <div v-if="!item.isGroup" class="wb-card">
                                        <div class="wb-info">
                                            <strong>{{ item.btn.label }}</strong>
                                            <div class="wb-desc">{{ item.btn.desc }}</div>
                                        </div>
                                        <div class="wb-action">
                                            <button class="wb-switch" 
                                                :class="{ 'is-on': wbStates[item.btn.id], 'is-disabled': isWbLoading }"
                                                @click="toggleWbGroup(item.btn)" :disabled="isWbLoading">
                                                <span class="wb-switch-knob"></span>
                                            </button>
                                        </div>
                                    </div>

                                    <div v-else class="wb-exclusive-group">
                                        <div class="group-label">⚙️ Nhóm mô-đun loại trừ lẫn nhau: {{ item.groupName }}</div>
                                        
                                        <div v-for="btn in item.btns" :key="btn.id" class="wb-card grouped-card">
                                            <div class="wb-info">
                                                <strong>{{ btn.label }}</strong>
                                                <div class="wb-desc">{{ btn.desc }}</div>
                                            </div>
                                            <div class="wb-action">
                                                <button class="wb-switch" 
                                                    :class="{ 'is-on': wbStates[btn.id], 'is-disabled': isWbLoading }"
                                                    @click="toggleWbGroup(btn)" :disabled="isWbLoading">
                                                    <span class="wb-switch-knob"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </template>
                            </div>
                        </div>

                    </div>
                </div>
            </transition>
        </div>
        `,
        setup() {
            const config = CONFIG;
            const questData = ref({});

            // --- Thêm mới: Logic lưu vị trí ---
            const STORAGE_KEY = 'QuestTracker_BallPos';
            const savedPos = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            // --- Thêm mới: Biến phản ứng của Avatar hiện đang hiển thị, mặc định lấy hình đầu tiên để chống trống ---
            const currentAvatar = ref(config.AVATAR_URLS[0] || "");

            // --- Thêm mới: Hằng số kích thước bảng điều khiển (Chỉnh sửa kích thước thống nhất ở đây) ---
            const PANEL_WIDTH = 400;  // Chiều rộng bạn muốn
            const PANEL_HEIGHT = 600; // Chiều cao bạn muốn
            const BALL_SIZE = 60;     // Kích thước quả cầu lơ lửng

            // --- Phát hiện kích thước phản ứng ---
            const windowWidth = ref(win.innerWidth);
            const handleResize = () => {
                windowWidth.value = win.innerWidth;
            };
            
            // Trạng thái UI
            const isPanelOpen = ref(false);
            const activeTab = ref('active');
            const unlockedSections = reactive({ char: false, global: false }); // Thêm mới dòng này
            const isDragging = ref(false);

            // Vị trí khởi tạo: Ưu tiên đọc cache
            const ballPos = reactive(savedPos || { x: win.innerWidth - 80, y: 100 });

            const savePosition = () => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: ballPos.x, y: ballPos.y }));
            };

            // --- Sửa đổi: Tính toán vị trí tương đối sau khi sửa chữa ---
            const panelPos = computed(() => {
                // Lấy độ rộng bảng điều khiển thực tế một cách linh hoạt (Ngăn ngừa màn hình di động hẹp hơn PANEL_WIDTH)
                const actualWidth = Math.min(PANEL_WIDTH, win.innerWidth - 20);
                const actualHeight = Math.min(PANEL_HEIGHT, win.innerHeight - 20);

                // Mặc định cố gắng đặt bên trái quả cầu
                let px = ballPos.x - actualWidth - 10; 
                
                // Nếu không gian bên trái không đủ, đặt sang bên phải
                if (px < 10) {
                    px = ballPos.x + BALL_SIZE + 10;
                }
                
                // 【Thích ứng quan trọng】: Nếu đặt bên phải vượt quá mép phải màn hình, buộc phải áp sát viền phải
                if (px + actualWidth > win.innerWidth - 10) {
                    px = win.innerWidth - actualWidth - 10;
                }
                // Giải pháp cuối cùng, ngăn tràn mép trái ở màn hình cực hẹp
                if (px < 10) px = 10;
                
                // Logic dọc: Cố gắng căn chỉnh với quả cầu, nhưng thêm kiểm tra ranh giới
                let py = ballPos.y;
                const maxPy = win.innerHeight - actualHeight - 10;
                if (py > maxPy) py = maxPy;
                if (py < 10) py = 10;

                return { x: px, y: py };
            });

            // Lấy dữ liệu
            const refreshData = () => {
                const mvuApi = win.Mvu || (win.SillyTavern && win.SillyTavern.Mvu);
                if (mvuApi) AssetManager.mvuData = mvuApi.getMvuData({ type: 'message' });
                questData.value = getQuestData(); // Khi kết nối thực tế thay bằng gọi AssetManager

                if (config.AVATAR_URLS && config.AVATAR_URLS.length > 0) {
                    const randomIndex = Math.floor(Math.random() * config.AVATAR_URLS.length);
                    currentAvatar.value = config.AVATAR_URLS[randomIndex];
                }
            };

            // --- Thêm mới: Giới thiệu Thế giới thư điều khiển Hook ---
            const { wbStates, isWbLoading, fetchWbStates, toggleWbGroup } = useWorldbook(Vue, win, config);

            // Thêm một listener, khi chuyển sang tab Thế giới thư, chủ động làm mới dữ liệu một lần
            watch(activeTab, async (newTab) => {
                if (newTab === 'worldbook') {
                    console.log("[Worldbook] Phát hiện tiến vào trang điều khiển, đang đồng bộ trạng thái mới nhất...");
                    await fetchWbStates();
                }
            });

            // --- Thêm mới: Logic tái cấu trúc chế độ xem nhóm loại trừ lẫn nhau ---
            const groupedControls = computed(() => {
                const groups = [];
                const groupMap = {};

                config.WORLDBOOK_CONTROLS.forEach(btn => {
                    if (btn.exclusiveGroup) {
                        // Nếu thuộc nhóm loại trừ lẫn nhau, thì đưa nó vào container nhóm tương ứng
                        if (!groupMap[btn.exclusiveGroup]) {
                            const newGroup = { isGroup: true, groupName: btn.exclusiveGroup, btns: [] };
                            groupMap[btn.exclusiveGroup] = newGroup;
                            groups.push(newGroup);
                        }
                        groupMap[btn.exclusiveGroup].btns.push(btn);
                    } else {
                        // Nếu không có nhóm loại trừ lẫn nhau, thì đóng vai trò như nút độc lập
                        groups.push({ isGroup: false, btn: btn });
                    }
                });
                return groups;
            });

            const onMessageReceived = () => {
                // Trì hoãn thực thi một chút, đảm bảo MVU đã xử lý xong dữ liệu tin nhắn
                setTimeout(refreshData, 500);
            };

            onMounted(async () => {
                refreshData();
                await fetchWbStates();
                await waitGlobalInitialized('Mvu');
                eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, onMessageReceived);
				
				console.log(`Refesh Lucille.js`);
                // Lắng nghe thay đổi kích thước cửa sổ
                win.addEventListener('resize', handleResize);
            });
            onUnmounted(() => {
                win.removeEventListener('resize', handleResize);
            });

            // ==================
            // Hàm phụ trợ phân tích văn bản
            // ==================
            const getQuestName = (qId) => config.QUEST_DICT[qId]?.name || qId;
            const getQuestHint = (qId, stage) => {
                const q = config.QUEST_DICT[qId];
                if (!q || !q.stages || !q.stages[stage]) return "Tạm thời không có thông tin gợi ý cho giai đoạn này.";
                return q.stages[stage];
            };
            const getFlagDesc = (fId) => config.FLAG_DICT[fId] || "Cờ chưa biết";

            // --- Sửa đổi 2: Thêm mới hàm phụ trợ dùng để phân chia nhiệm vụ ---
            // Lấy danh sách ID nhiệm vụ Nhân Vật hiện tại đã nhận hoặc đã hoàn thành
            const getKnownQuests = (charData) => {
                const active = Object.keys(charData.active_quests || {});
                const completed = Object.keys(charData.completed_quests || {});
                // Sử dụng Set để loại bỏ trùng lặp và chuyển về mảng
                return [...new Set([...active, ...completed])]; 
            };

            // Lấy danh sách ID nhiệm vụ Nhân Vật hiện tại chưa nhận (có trong từ điển, nhưng không có trong active/completed)
            const getUnknownQuests = (charData) => {
                const known = getKnownQuests(charData);
                const allQuests = Object.keys(config.QUEST_DICT || {});
                return allQuests.filter(qId => !known.includes(qId));
            };
            // --- Sửa đổi 1: Đóng gói logic chuyển đổi bảng điều khiển thống nhất ---
            const togglePanel = (isOpen) => {
                isPanelOpen.value = isOpen;
                if (!isOpen) {
                    // Chỉ cần bảng điều khiển đóng (dù thông qua click quả cầu hay click X), lập tức khóa lại
                    unlockedSections.char = false;
                    unlockedSections.global = false;
                }
            };

            // --- Thêm mới: Lấy các gợi ý có thể kích hoạt thỏa mãn điều kiện ---
            const getAvailableHints = (charData) => {
                if (!config.AVAILABLE_QUEST_HINTS) return [];
                
                // Sử dụng filter lọc ra các manh mối có kết quả condition(charData) là true
                return config.AVAILABLE_QUEST_HINTS.filter(item => {
                    try {
                        // Truyền vào dữ liệu Nhân Vật hiện tại tiến hành tính toán theo thời gian thực
                        return item.condition(charData);
                    } catch (e) {
                        // Lập trình phòng thủ: Đề phòng sau này bạn cấu hình sai biến dẫn đến sập bảng điều khiển
                        console.error(`[QuestTracker] Lỗi phán định điều kiện manh mối (ID: ${item.id}):`, e);
                        return false; 
                    }
                });
            };

            // ==================
            // Logic kéo thả và click
            // ==================
            const startDrag = (e) => {
                // Xác định xem có phải sự kiện chạm (touch) không
                const isTouch = e.type.startsWith('touch');
                if (!isTouch && e.button !== 0) return; // Bỏ qua click không phải chuột trái
                
                let hasMoved = false;
                // Lấy tọa độ khởi tạo
                const startX = isTouch ? e.touches[0].clientX : e.clientX;
                const startY = isTouch ? e.touches[0].clientY : e.clientY;
                const initX = ballPos.x, initY = ballPos.y;
                isDragging.value = true;

                const onMove = (me) => {
                    const currentX = isTouch ? me.touches[0].clientX : me.clientX;
                    const currentY = isTouch ? me.touches[0].clientY : me.clientY;
                    const dx = currentX - startX;
                    const dy = currentY - startY;
                    
                    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
                    
                    win.requestAnimationFrame(() => {
                        ballPos.x = Math.max(0, Math.min(initX + dx, win.innerWidth - BALL_SIZE));
                        ballPos.y = Math.max(0, Math.min(initY + dy, win.innerHeight - BALL_SIZE));
                    });
                };

                const onUp = () => {
                    isDragging.value = false;
                    const moveEvent = isTouch ? 'touchmove' : 'mousemove';
                    const upEvent = isTouch ? 'touchend' : 'mouseup';
                    
                    win.removeEventListener(moveEvent, onMove);
                    win.removeEventListener(upEvent, onUp);
                    
                    if (!hasMoved) {
                        // Khi click vào quả cầu, chuyển đổi giá trị ngược lại của trạng thái hiện tại
                        togglePanel(!isPanelOpen.value);
                    } else {
                        savePosition();
                    }
                };

                const moveEvent = isTouch ? 'touchmove' : 'mousemove';
                const upEvent = isTouch ? 'touchend' : 'mouseup';
                win.addEventListener(moveEvent, onMove, { passive: false });
                win.addEventListener(upEvent, onUp);
            };

            return {
                config, questData,
                isPanelOpen, activeTab, isDragging,
                wbStates, isWbLoading, toggleWbGroup, // Liên quan đến Thế giới thư
                togglePanel,
                unlockedSections, // Thay thế cho showSpoilers
                getKnownQuests,
                getUnknownQuests,
                getAvailableHints,

                groupedControls, // Nhóm loại trừ lẫn nhau

                ballPos, panelPos, startDrag,
                PANEL_WIDTH,  // Bộc lộ ra template hoặc giữ lại
                PANEL_HEIGHT,
                getQuestName, getQuestHint, getFlagDesc,    
                refreshData,  
                currentAvatar,  
            };
        }
    });

    app.mount(rootDiv);
    win.__QUEST_VUE_APP_RC_LUCILLE__ = app;
}

// ==========================================
// 3. Tiêm Style (Thích ứng chủ đề retro/cổ điển)
// ==========================================
function renderVueStyles() {
    if (doc.getElementById('quest-widget-rc-lucille-styles')) return;
    const css = `
        /* Quả cầu lơ lửng */
        #quest-ball {
            position: fixed; width: 60px; height: 60px;
            border-radius: 50%; background: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer; z-index: 20000;
            border: 2px solid #dcd8d0;
            overflow: hidden; transition: transform 0.2s;
            user-select: none;
        }
        #quest-ball:hover { transform: scale(1.05); }
        #quest-ball.is-dragging { transform: scale(0.95); opacity: 0.8; }
        #quest-ball img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }

        /* Bảng điều khiển chính */
        #quest-panel {
            position: fixed; 
            /* Cho phép nó chiếm tối đa kích thước đã thiết lập, nhưng trên màn hình nhỏ sẽ bị cưỡng chế ràng buộc */
            width: 400px;    /* Bắt buộc phải giống với PANEL_WIDTH */
            max-width: calc(100vw - 20px); /* Thích ứng màn hình di động: Chống tràn */
            height: 600px;  
            max-height: calc(100vh - 20px); /* Thích ứng màn hình di động: Chống tràn */
            background: #f4f1ea; 
            border: 1px solid #dcd8d0;
            border-radius: 8px; 
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            z-index: 19999; 
            display: flex; 
            flex-direction: column;
            color: #333; 
            overflow: hidden; 
        }

        /* Hoạt ảnh */
        .fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
        .fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }

        /* Phần đầu và Tabs */
        .panel-header {
            display: flex; justify-content: space-between; align-items: center;
            background: #e8e4db; padding: 0; border-bottom: 1px solid #dcd8d0;
            border-radius: 8px 8px 0 0;
        }
        .tabs { display: flex; }
        .tabs span {
            padding: 12px 16px; font-weight: bold; cursor: pointer;
            border-right: 1px solid #dcd8d0; color: #666; font-size: 14px;
        }
        .tabs span.active { background: #f4f1ea; color: #bd637a; border-bottom: 2px solid #bd637a; margin-bottom: -1px; }
        .close-btn { 
            background: none; border: none; font-size: 16px; color: #888; 
            padding: 0 15px; cursor: pointer; 
        }
        .close-btn:hover { color: #d9534f; }

        /* Container vùng nội dung */
        .panel-content { flex: 1; overflow-y: auto; padding: 15px; }
        .panel-content::-webkit-scrollbar { width: 6px; }
        .panel-content::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }

        /* Khối Nhân Vật */
        .char-section { margin-bottom: 20px; }
        .char-title { margin: 0 0 10px 0; font-size: 16px; color: #2c3e50; border-bottom: 1px dashed #ccc; padding-bottom: 5px; }
        
        /* Thẻ nhiệm vụ (Trang 1) */
        .quest-card {
            background: #fff; border: 1px solid #eee; border-radius: 6px;
            padding: 10px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .quest-name { font-weight: bold; color: #bd637a; font-size: 14px; margin-bottom: 4px; }
        .quest-status { font-size: 12px; color: #888; margin-bottom: 8px; }
        .quest-hint { background: #fdf6e3; padding: 8px; border-radius: 4px; font-size: 13px; border-left: 3px solid #e6c27a; }

        /* Thẻ và Giá trị (Trang 2) */
        .overview-box { background: #fff; padding: 10px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #eee; }
        .tag { display: inline-block; background: #e8f4f8; color: #2980b9; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin: 2px; }
        .counter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .counter-item { background: #f9f9f9; padding: 5px 10px; border-radius: 4px; display: flex; justify-content: space-between; font-size: 13px; }
        .c-label { color: #666; } .c-val { font-weight: bold; color: #2c3e50; }

        /* Khu vực bảo vệ spoilers (tiết lộ nội dung) */
        .spoiler-container { position: relative; }
        .danger-box { border-color: #f5c6cb; }
        .danger-box h4 { color: #c82333; margin-top:0; }
        .blurred { filter: blur(6px); pointer-events: none; user-select: none; }
        
        .spoiler-overlay {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(244, 241, 234, 0.85); z-index: 10;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            border-radius: 6px; text-align: center;
        }
        .warning-icon { font-size: 32px; margin-bottom: 10px; }
        .unlock-btn {
            margin-top: 15px; padding: 8px 16px; background: #dc3545; color: white;
            border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.2s;
        }
        .unlock-btn:hover { background: #c82333; }

        /* Style danh sách */
        .flag-list { margin: 0; padding-left: 20px; font-size: 13px; }
        .flag-list li { margin-bottom: 4px; }
        .text-green { color: #28a745; } .text-gray { color: #999; }
        .guide-item { font-size: 12px; margin-bottom: 8px; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px; }
        .guide-item p { margin: 4px 0 0 0; color: #666; }

        /* --- Style được thêm/sửa đổi --- */
        
        /* Tên khóa nhiệm vụ và Tên khóa giai đoạn (Phong cách Geek/Code) */
        .code-key {
            font-family: monospace;
            background-color: #e4e7ed;
            color: #606266;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            margin-left: 4px;
            border: 1px solid #dcdfe6;
            font-weight: normal;
        }
        
        /* Thụt lề và Style danh sách giai đoạn */
        .stage-list {
            margin-top: 8px;
            padding: 6px 10px;
            background-color: #f9f7f3;
            border-left: 3px solid #bd637a;
            border-radius: 0 4px 4px 0;
            font-size: 12px;
        }
        .stage-item {
            margin-bottom: 4px;
            display: flex;
            align-items: flex-start;
        }
        .stage-item:last-child { margin-bottom: 0; }
        .stage-key { margin-left: 0; margin-right: 6px; flex-shrink: 0;}
        .stage-desc { color: #555; line-height: 1.4; }
        .spoiler-text { margin: 6px 0 0 0; color: #666; font-size: 12px;}

        /* Phân biệt màu sắc nút mở khóa */
        .unlock-btn-blue { background: #3498db; }
        .unlock-btn-blue:hover { background: #2980b9; }
        .unlock-btn-red { background: #dc3545; }
        .unlock-btn-red:hover { background: #c82333; }
        
        /* Màu viền cụ thể hộp thông tin */
        .info-box { border-color: #b8daff; }
        .info-box h4 { color: #004085; margin-top: 0; }

        /* --- Style Manh mối / Tin đồn khả dụng --- */
        .available-hints-container {
            margin-top: 15px;
        }
        .hint-section-title {
            margin: 0 0 8px 0;
            font-size: 14px;
            color: #d98328; /* Màu cam ấm */
            border-bottom: 1px dashed #e6c27a;
            padding-bottom: 4px;
        }
        .hint-card {
            background: #fdfaf2; /* Nền vàng ấm cực nhạt */
            border: 1px dashed #e6c27a;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 8px;
            font-size: 13px;
            color: #555;
            line-height: 1.4;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
            transition: transform 0.1s;
        }
        .hint-card:hover {
            transform: translateX(2px); /* Dịch sang phải một chút khi di chuột vào */
            border-color: #d98328;
        }

        /* --- Style Bảng điều khiển Thế giới thư --- */
        .wb-control-list { display: flex; flex-direction: column; gap: 10px; }
        .wb-card {
            background: #fff; border: 1px solid #dcd8d0; border-radius: 6px;
            padding: 12px; display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .wb-info { flex: 1; padding-right: 15px; }
        .wb-info strong { color: #2c3e50; font-size: 14px; }
        .wb-desc { font-size: 12px; color: #888; margin-top: 4px; line-height: 1.3; }
        
        /* Công tắc Toggle giả lập Hệ Thống gốc */
        .wb-switch {
            position: relative; width: 44px; height: 24px;
            background-color: #dcdfe6; border-radius: 12px;
            border: none; cursor: pointer; transition: background-color 0.3s;
            outline: none; flex-shrink: 0; padding: 0;
        }
        .wb-switch.is-on {
            background-color: #bd637a; /* Màu chủ đạo của bạn */
        }
        .wb-switch.is-disabled {
            opacity: 0.6; cursor: not-allowed;
        }
        .wb-switch-knob {
            position: absolute; top: 2px; left: 2px;
            width: 20px; height: 20px; border-radius: 50%;
            background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        .wb-switch.is-on .wb-switch-knob {
            transform: translateX(20px);
        }
        
        .header-actions {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .refresh-btn {
            background: none;
            border: none;
            font-size: 18px;
            color: #888;
            cursor: pointer;
            transition: color 0.2s, transform 0.2s;
            line-height: 1;
        }
        .refresh-btn:hover {
            color: #bd637a;
        }
        .refresh-btn:active {
            transform: rotate(180deg);
        }

        /* --- Style Nhóm loại trừ lẫn nhau --- */
        .wb-exclusive-group {
            border: 1px dashed #bd637a; /* Đường đứt nét màu chủ đạo */
            background-color: rgba(189, 99, 122, 0.03); /* Màu nền chủ đạo cực nhạt */
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 5px;
            display: flex;
            flex-direction: column;
            gap: 8px; /* Khoảng cách giữa các thẻ trong nhóm */
        }
        
        .group-label {
            font-size: 11px;
            color: #bd637a;
            font-weight: bold;
            margin-left: 4px;
        }

        /* Bỏ bớt một chút bóng của các thẻ trong nhóm loại trừ lẫn nhau để tạo cảm giác phân tầng tốt hơn */
        .wb-card.grouped-card {
            box-shadow: none;
            border-color: #e4e7ed;
        }
    
        @media screen and (max-width: 768px) {
        /* 1. Khi bảng điều khiển mở ra, ẩn hoàn toàn quả cầu lơ lửng để tránh che khuất */
        #quest-app-container.panel-is-open #quest-ball {
            display: none !important;
        }

        /* 2. Ép buộc bảng điều khiển trở thành ngăn kéo phía dưới, ghi đè toàn bộ tọa độ JS inline */
        #quest-panel {
            position: fixed !important;
            /* Sửa chữa cốt lõi: Tính toán trước tỷ lệ tuyệt đối của top, tránh vị trí vật lý bị sai lệch do auto */
            top: 25vh !important; /* 100vh - 75vh = 25vh, áp sát hoàn hảo đáy màn hình */
            left: 0 !important;
            /* Chú ý: Đã bỏ đi bottom: 0 và top: auto ở đây */
            
            width: 100% !important;
            max-width: 100% !important;
            height: 75vh !important; /* Chiếm 75% chiều cao màn hình */
            border-radius: 20px 20px 0 0 !important;
            border: none !important;
            border-top: 1px solid #dcd8d0 !important;
            box-shadow: 0 -4px 24px rgba(0,0,0,0.3) !important;
        }

        /* 3. Ghi đè hoạt ảnh chuyển tiếp: Thay đổi thành bật lên mượt mà từ dưới lên */
        .fade-enter-active, .fade-leave-active {
            transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s !important;
        }
        .fade-enter-from, .fade-leave-to {
            opacity: 0;
            transform: translateY(100%) !important;
        }
    }
    `;
    const style = doc.createElement('style');
    style.id = 'quest-widget-rc-lucille-styles';
    style.textContent = css;
    doc.head.appendChild(style);
}

// Khởi động!
bootstrapQuestWidget();

(async function() {
    // ==========================================
    // ⚙️ Khu vực cấu hình toàn cục
    // ==========================================
    const CONFIG = {
        // 1. Tiền tố đường dẫn node gốc biến (Có thể sửa đổi tùy theo phiên bản)
        ROOT_PATH: "Event", 
        
        // 2. Bảng ánh xạ tên chương (chapter khớp trong phần văn bản -> key thực tế chèn vào JSON)
        // Bảng ánh xạ nâng cấp: Mỗi chương độc lập cấu hình ID biến liên kết của nó và các giai đoạn cần tiếp quản
        QUEST_MAP: {
            "ch1_first_meet": {
                id: "ch1_first_meet",
                stages: {
                    "start": {
                        desc: "Mới bắt đầu tiến hành",
                        //flags: { "met_lucille_first_time": true } // flag mở khóa ngay khi nhận nhiệm vụ
                    },
                    "end": {
                        desc: ""
                    }
                }
            },
            "ch2_behind_halo": {
                id: "ch2_behind_halo",
                stages: {
                    "start": {desc: "Bắt đầu nhiệm vụ cá nhân"},
                    "under_the_sacred": {desc: "Bắt đầu tiếp cận sự thật"}, 
                    "end": ""
                }
            },
            "ch3_dying_light": {
                id: "ch3_dying_light",
                stages: {
                    "start": "Lão mục sư điều tra hoàn tất",
                    "trace": "Đã điều tra được dấu vết",
                    "glimmer": {
                        desc: "Mỏ neo nơi này",
                        flags: {
                            "believe_in_user": true
                        }
                    },
                    "end": ""

                }
            },
            "side_unfallen_afterglow": {
                id: "side_unfallen_afterglow",
                stages: {
                    "start": "Lễ hội Hoàng Hôn",
                    "festival_end": "Lễ Hội Kết Thúc",
                    "end": {
                        desc: "",
                        flags: {
                            "dedicated_wondrous_item_afterglow": true
                        }
                    },
                }
            },

            "system_end_flags": {
                id: "system_end_flags",
                is_hidden: true, // <--- Cờ định danh quan trọng: Báo cho script biết đây là nhiệm vụ "im lặng/không đầu"
                stages: {
                    "trigger_true_end": {
                        // desc có thể để trống, vì cơ bản nó sẽ không ghi vào active_quests
                        flags: { "unlocked_true_end": true, "bond_bonus": 100 }
                    },
                    "trigger_bad_end": {
                        flags: { "unlocked_bad_end": true }
                    }
                }
            }
        }
    };

    // Giữ chỗ, logic lấy dữ liệu hiện tại
    // const current_quest_data = getQuestData();
    // const Lucille_data = current_quest_data["Lucille"];

    /*function process_chapter_update(variables, commands, message_content) {
        const raw_content = message_content;

        // Regex: Khớp thẻ Lucille type="title", và thu thập giá trị của chapter và stage
        //const rawRegex = /(<Lucille\s+type="title"\s+chapter="([^"]+)"\s+stage="([^"]+)">[\s\S]*?<\/Lucille>)/g;
		const rawRegex = /<Lucille\s+([^>]+)>[\s\S]*?<\/Lucille>/gi;
		
        let match;
        const processedSet = new Set(); // Dùng để chống trùng lặp: Đảm bảo cùng một giai đoạn của cùng một chương chỉ thực thi một lần
        
        // ==========================================
        // Giai đoạn 1: Thu thập tất cả các yêu cầu cập nhật cần tiếp quản
        // ==========================================
        const pendingUpdates = [];

        while ((match = rawRegex.exec(raw_content)) !== null) {
            // \w khớp với tất cả chữ cái, chữ số và dấu gạch dưới, \u4e00-\u9fa5 khớp với tất cả chữ Hán
            // [^...] khớp với tất cả các ký tự ngoại trừ những ký tự này (tức là khoảng trắng và các loại dấu câu), và thay thế chúng thành rỗng
            const chapterName = match[2].replace(/[^\w\u4e00-\u9fa5]/g, '');
            const stageName = match[3].replace(/[^\w\u4e00-\u9fa5]/g, '');

            const questConfig = CONFIG.QUEST_MAP[chapterName];
            if (!questConfig || questConfig.stages[stageName] === undefined) {
                console.warn(`[Tiếp quản nhiệm vụ] Không tìm thấy cấu hình cho chương [${chapterName}], đã bỏ qua.`);
                toastr.warning(`[Tiếp quản nhiệm vụ] Không tìm thấy cấu hình tương ứng cho tên chương [${chapterName}], đã bỏ qua.`, '')
                continue;
            }
			else
			{
				console.log(`[Tiếp quản nhiệm vụ] Thành cồng cho chương [${chapterName}] và Stage [${stageName}]`);
			}

            const uniqueKey = `${chapterName}_${stageName}`;
            if (processedSet.has(uniqueKey)) continue;
            processedSet.add(uniqueKey);

            // Lưu tạm các cập nhật cần thực thi
            pendingUpdates.push({
                questId: questConfig.id,
                stageName: stageName,
                stageConfig: questConfig.stages[stageName],
                // 【Thêm mới】: Mang theo cờ báo hiệu xem có bị ẩn không
                isHidden: questConfig.is_hidden === true
            });
        }*/
		function process_chapter_update(variables, commands, message_content) {
			
		const raw_content = message_content;
		console.log(`[Process Chapter Update] = [${raw_content}]`);
    // Regex mới: Chỉ tìm thẻ <Lucille ...> và gom toàn bộ thuộc tính vào Group 1
    const rawRegex = /<Lucille\s+([^>]+)>[\s\S]*?<\/Lucille>/gi;

    let match;
    const processedSet = new Set(); 
    const pendingUpdates = [];

    while ((match = rawRegex.exec(raw_content)) !== null) {
        const attrString = match[1];

        // Dùng Regex phụ để quét từng thuộc tính một cách độc lập, bất chấp thứ tự
        const typeMatch = attrString.match(/type=["']([^"']+)["']/i);
        const chapterMatch = attrString.match(/chapter=["']([^"']+)["']/i);
        const stageMatch = attrString.match(/stage=["']([^"']+)["']/i);

        // Đảm bảo đây là thẻ title và có đủ chapter, stage
        if (!typeMatch || typeMatch[1] !== "title" || !chapterMatch || !stageMatch) continue;

        // Chỉ cần trim() khoảng trắng thừa, KHÔNG DÙNG REPLACE xóa chữ tiếng Việt
        const chapterName = chapterMatch[1].trim();
        const stageName = stageMatch[1].trim();

        const questConfig = CONFIG.QUEST_MAP[chapterName];
        if (!questConfig || questConfig.stages[stageName] === undefined) {
            console.warn(`[Tiếp quản nhiệm vụ] Không tìm thấy cấu hình cho chương [${chapterName}] hoặc stage [${stageName}], đã bỏ qua.`);
            // toastr.warning(...)
            continue;
        }

        console.log(`[Tiếp quản nhiệm vụ] Thành công cho chương [${chapterName}] và Stage [${stageName}]`);

        const uniqueKey = `${chapterName}_${stageName}`;
        if (processedSet.has(uniqueKey)) continue;
        processedSet.add(uniqueKey);

        pendingUpdates.push({
            questId: questConfig.id,
            stageName: stageName,
            stageConfig: questConfig.stages[stageName],
            isHidden: questConfig.is_hidden === true
        });
    }

    if (pendingUpdates.length === 0) return;

    // ... Toàn bộ logic Giai đoạn 2 và Giai đoạn 3 của bạn giữ nguyên bên dưới ...

        if (pendingUpdates.length === 0) return; // Không khớp được, thoát trực tiếp

        // ==========================================
        // Giai đoạn 2: Xóa sạch các lệnh gốc xung đột trong một lần
        // ==========================================
        // Trích xuất tất cả các questId có liên quan trong lần này
		console.log(`[Lucille] Bắt đầu Giai Đoạn 2: ${pendingUpdates}`);
        const questIdsToHandle = new Set(pendingUpdates.map(p => p.questId));
        for (let i = commands.length - 1; i >= 0; i--) {
            const cmd = commands[i];
            if (!cmd.args || !cmd.args[0]) continue;
            
            const cmdPath = cmd.args[0];
            const cmdKey = cmd.args[1] ? cmd.args[1].replace(/['"]/g, '') : null;

            let isConflict = false;
            questIdsToHandle.forEach(qId => {
                // Nếu đường dẫn hoặc tham số của lệnh gốc chạm phải ID nhiệm vụ mà chúng ta muốn tiếp quản, đánh dấu là xung đột
                if (cmdPath.includes(`active_quests.${qId}`) || 
                    cmdPath.includes(`completed_quests.${qId}`) || 
                    (cmdKey === qId && cmdPath.includes('characters_quests.Lucille'))) {
                    isConflict = true;
                }
            });

            if (isConflict) {
                console.log(`[Tiếp quản nhiệm vụ] Loại bỏ lệnh gốc xung đột:`, cmd);
                commands.splice(i, 1);
            }
        }
        // ==========================================
        // Giai đoạn 3: Tạo và tiêm vào các lệnh mới mang tính bảo hiểm kép
        // ==========================================
		console.log(`[Lucille] Bắt đầu Giai Đoạn 3:`);
        pendingUpdates.forEach(update => {
            const { questId, stageName, stageConfig, isHidden } = update;
            // --- Tương thích định dạng chuỗi và đối tượng ---
            const stageDesc = typeof stageConfig === 'object' ? stageConfig.desc : stageConfig;
            // Trích xuất cấu hình flag bổ sung: Chỉ có trong định dạng đối tượng
            const extraFlags = typeof stageConfig === 'object' ? stageConfig.flags : null;

            const activePath = `${CONFIG.ROOT_PATH}.characters_quests.Lucille.active_quests`;
            const completedPath = `${CONFIG.ROOT_PATH}.characters_quests.Lucille.completed_quests`;
            // Chuẩn bị đường dẫn của Flags toàn cục
            const flagsPath = `${CONFIG.ROOT_PATH}.characters_quests.Lucille.global_flags`;

            console.log(`[Tiếp quản nhiệm vụ] Thực thi tiêm vào: Nhiệm vụ[${questId}], Giai đoạn[${stageName}]`);

            if (!isHidden){
                // --- Cập nhật trạng thái nhiệm vụ cốt lõi ---
                if (stageName === "start") {
                    // 【Bảo hiểm kép 1】: Xóa trước chèn sau. Dọn dẹp hoàn toàn trạng thái cũ có thể bị kẹt, sau đó khởi tạo một cách sạch sẽ
                    commands.push({ 
                        type: "delete", 
                        args: [ `${activePath}.${questId}` ], 
                        reason: "script_quest_start_cleanup" 
                    });
                    const initData = JSON.stringify({ "stage": "start", "desc": stageDesc });
                    commands.push({ 
                        type: "insert", 
                        args: [ activePath, `'${questId}'`, initData ], 
                        reason: "script_quest_start" 
                    });
                } 
                else if (stageName === "end") {
                    commands.push({ 
                        type: "delete", 
                        args: [ `${activePath}.${questId}` ], 
                        reason: "script_quest_end_remove" 
                    });
                    // Tương tự xóa trước chèn sau, tránh báo lỗi hoàn thành trùng lặp
                    commands.push({ 
                        type: "delete", 
                        args: [ `${completedPath}.${questId}` ], 
                        reason: "script_quest_end_cleanup" 
                    });
                    commands.push({ 
                        type: "insert", 
                        args: [ completedPath, `'${questId}'`, "true" ], 
                        reason: "script_quest_end_complete" 
                    });
                } 
                else {
                    // Giai đoạn trung gian: Mặc định active đã tồn tại, set trực tiếp.
                    // (Nếu engine hỗ trợ, ở đây cũng có thể viết thành insert+set bắn liên tiếp như bạn nói, nhưng thông thường set là đủ rồi)
                    commands.push({ 
                        type: "set", 
                        args: [ `${activePath}.${questId}.stage`, `"${stageName}"` ], 
                        reason: "script_quest_update_stage" 
                    });
                    commands.push({ 
                        type: "set", 
                        args: [ `${activePath}.${questId}.desc`, `"${stageDesc}"` ], 
                        reason: "script_quest_update_desc" 
                    });
                }
            }else {
                console.log(`[Tiếp quản nhiệm vụ] Kích hoạt mô-đun sự kiện im lặng: [${questId}] -> Giai đoạn[${stageName}]`);
            }
            // --- Cập nhật các Flags bổ sung ---
            if (extraFlags) {
                for (const [flagKey, flagValue] of Object.entries(extraFlags)) {
                    const valStr = JSON.stringify(flagValue);
                    
                    // 【Bảo hiểm kép 2】: Đúng như bạn nói, bất kể có tồn tại hay không, chèn mù trước (tạo hố), sau đó gán giá trị (lấp đất)
                    // Bằng cách này, ngay cả khi lớp đáy không hỗ trợ replace khóa không tồn tại, thì cũng có thể lách qua báo lỗi một cách hoàn hảo
                    commands.push({ 
                        type: "insert", 
                        args: [ flagsPath, `'${flagKey}'`, valStr ], 
                        reason: `script_quest_flag_init_${flagKey}` 
                    });
                    commands.push({ 
                        type: "set", 
                        args: [ `${flagsPath}.${flagKey}`, valStr ], 
                        reason: `script_quest_flag_set_${flagKey}` 
                    });
                }
            }
        });
    };
	await waitGlobalInitialized('Mvu');
    // Ràng buộc Sự kiện Mvu
    eventOn(Mvu.events.COMMAND_PARSED, (variables, commands, message_content) => {
        // Truyền trực tiếp mảng commands vào, bên trong hàm thông qua splice và push sửa đổi trực tiếp tham chiếu của mảng này
        process_chapter_update(variables, commands, message_content);
        
        console.log("Lệnh cập nhật biến được thực thi cuối cùng:", commands);
    });

})();


//# sourceURL=my_debug_QUEST.js