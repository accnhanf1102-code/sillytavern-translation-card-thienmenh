/**
 * FP Shop Bubble - Hệ thống cửa hàng vật phẩm AI-driven cho SillyTavern
 * 
 * Chức năng:
 * - Tích hợp Panel mua hàng với giao diện đẹp mắt (Glassmorphism)
 * - Đọc Lorebook từ JS-Slash-Runner để AI tạo vật phẩm phù hợp bối cảnh
 * - Hỗ trợ phân loại: Trang Bị, Vật Phẩm, Kỹ Năng và Giới Thiệu của Hệ Thống
 * - Mua vật phẩm bằng FP (Destiny Points) từ MVU
 * 
 * PHỤ THUỘC:
 * - FloatingMenuManager (bubbleManager.js)
 * - ApiConfigManager (apiConfigBubble.js)
 * - JS-Slash-Runner (Extension)
 */

(function () {
    'use strict';

    console.log('[FPShopBubble] Khởi tạo...');

    // ============ CẤU HÌNH CHO DEV (SỬA Ở ĐÂY) ============
    const SHOP_CONFIG = {
        // Tên các entry Lorebook cần đọc để tạo bối cảnh (nhập chính xác tên entry)
        LOREBOOK_ENTRIES: [
            '[Trang Phục và Vật Phẩm Xa Xỉ]',
            '[Giới hạn hiệu quả phẩm chất]',
            '[Luyện Kim]',
            '[Bảng Chỉ Số Cốt Lõi]',
            '[Quy tắc tạo Kỹ năng Trang bị Đạo cụ]',
            '[Thiết lập Chủ Thế Giới]',
            '[Quy tắc Thế giới]',
            '[Quy tắc Nhiệm vụ và Ủy thác]',
            '[Tổng quan Tổ chức]',
            '[Sách Kỹ Năng và Khóa Học Kỹ Năng]',
            '[Tổng quan chủng tộc]',
            '[Chủng tộc - Ma vật]',
            '[Chủng tộc - Cổ Long]',
            '[Chủng tộc - Cấu Trang Thể]',
            '[Chủng tộc - Nguyện Linh (Trà Chanh Vui Vẻ)]',
            '[Chủng tộc - Sinh Vật Nguyên Tố]',
            '[Chủng tộc - Tộc Người Lùn]',
            '[Chủng tộc - Nhân Ngư]',
            '[Chủng tộc - Thú Tộc - Thử Tộc (Trà Chanh Vui Vẻ)]',
            '[Chủng tộc - Sinh Vật Nhân Tạo]',
            '[Chủng tộc - Quang Dực Yêu Tinh]',
            '[Chủng tộc - Vật Hồn]',
            '[Chủng tộc - Dực Nhân]',
            '[Chủng tộc - Tinh Linh]',
            '[Chủng tộc - Nhân loại]',
            '[Chủng tộc - Người Bán Thân]',
            '[Chủng tộc - Thú Tộc]',
            '[Chủng tộc - Slime]',
            '[Chủng tộc - Sinh vật dị vực]',
            '[Chủng tộc - Sinh vật Thực vật]',
            '[Chủng tộc - Long Duệ Bắc Cảnh]',
            '[Chủng tộc - Nhân Mã]',
            '[Chủng tộc - Sinh vật Bất định hình]',
            '[Chủng tộc - Huyết Tộc]',
            '[Valentia - Valentia (Trà Chanh Vui Vẻ)]',
            '[Khu vực mạo hiểm-Quần Đảo Toái Tinh]',
            '[Khu Vực Mạo Hiểm - Aelyudrem Nil]',
            '[Khu vực mạo hiểm-Dãy Núi Long Cốt]',
            '[Khu vực mạo hiểm-Đầm Lầy Bi Minh]',
            '[Khu vực mạo hiểm-Nước Biên Thùy]',
            '[Khu Vực Mạo Hiểm - Băng Nguyên Vĩnh Cửu]',
            '[Khu vực mạo hiểm-Vô Tận Thụ Hải]',
            '[Liên Bang Sahla - Alamut]',
            '[Liên Minh Northgard - Công quốc Visgrad]',
            '[Liên Minh Northgard - Công Quốc Skald]',
            '[Liên Minh Northgard - Công Quốc Ulfen]',
            '[Liên Minh Northgard - Công Quốc Nordheim]',
            '[Liên Minh Northgard - Tổng Quan]',
            '[Nước Biên Thùy - Lily]',
            '[Pháp Hoàn Borens (Tác giả Aoo)]',
            '[Saerylia - Địa Lý và Văn Hóa]',
            '[Thánh Đô Dực Nhân Vania]',
            '[Thú Tộc Liên Minh - Kalashlias]',
            '[Tín Đồ Dị Giới]',
            '[Hiệp Hội Thợ Rèn]',
            '[Công Hội Luyện Kim Thuật Sư]',
            '[Công Hội Mạo Hiểm Giả]',
            '[Văn minh Tinh Linh - Alfheim]',
            '[Vương Quốc Solentis]',
            '[Đế Quốc Augustum]'
        ],
        // Tên entry đặc biệt cho Hệ Thống Vận Mệnh
        SYSTEM_ENTRY_KEYWORD: 'Hệ Thống Vận Mệnh',
        // Số lượng sản phẩm mặc định khi call API
        COUNTS: {
            EQUIPMENT: 10,
            ITEMS: 10,
            SKILLS: 10,
            SYSTEM: 10
        }
    };

    // ============ Hằng số ============
    const parentDocument = window.parent.document;
    const STORAGE_KEY = 'fpShopBubble_state';
    const STYLE_ID = 'fp-shop-bubble-styles';
    const PANEL_ID = 'fp-shop-panel';
    const BUBBLE_ID = 'fp-shop';

    const CATEGORIES = [
        { id: 'equipment', label: 'Trang Bị', icon: '⚔️' },
        { id: 'items', label: 'Vật Phẩm', icon: '🎒' },
        { id: 'skills', label: 'Kỹ Năng', icon: '📜' },
        { id: 'system', label: 'Gợi Ý Riêng', icon: '🌌' }
    ];

    const RARITY_MAP = {
        'Thông Thường': { color: '#9ca3af', label: 'Thông Thường' },
        'Thông thường': { color: '#9ca3af', label: 'Thông Thường' },
        'Ưu Tú': { color: '#4ade80', label: 'Ưu Tú' },
        'Ưu tú': { color: '#4ade80', label: 'Ưu Tú' },
        'Hiếm': { color: '#60a5fa', label: 'Hiếm' },
        'Sử Thi': { color: '#a78bfa', label: 'Sử Thi' },
        'Sử thi': { color: '#a78bfa', label: 'Sử Thi' },
        'Truyền Thuyết': { color: '#fbbf24', label: 'Truyền Thuyết' },
        'Truyền thuyết': { color: '#fbbf24', label: 'Truyền Thuyết' },
        'Thần Thoại': { color: '#f87171', label: 'Thần Thoại' },
        'Thần thoại': { color: '#f87171', label: 'Thần Thoại' },
        'Độc Nhất': { color: '#e879f9', label: 'Độc Nhất' },
        'Độc nhất': { color: '#e879f9', label: 'Độc Nhất' }
    };


    const RARITY_ORDER = [
        'Thông Thường', 'Thông thường',
        'Ưu Tú', 'Ưu tú',
        'Hiếm', 'hiếm',
        'Sử Thi', 'Sử thi',
        'Truyền Thuyết', 'Truyền thuyết',
        'Thần Thoại', 'Thần thoại',
        'Độc Nhất', 'Độc nhất'
    ];

    function getRarityWeight(rarity) {
        if (!rarity) return 0;
        const index = RARITY_ORDER.indexOf(rarity);
        return index === -1 ? 0 : Math.floor(index / 2) + 1;
    }

    // ============ State ============
    const state = {
        isOpen: false,
        status: 'EMPTY', // EMPTY, LOADING, LOADED
        activeCategory: 'equipment',
        fpBalance: 0,
        userLifeTier: null, // Cấp độ 1-7
        rarityDist: null,   // Bảng tỷ lệ %
        items: {
            equipment: [],
            items: [],
            skills: [],
            system: []
        },
        selectedItem: null,
        lastError: null,
        panelPos: null, // { width, height }
        selectedPromptLength: 'Moderate', // Default
        selectedWorkerCount: 1,
        isGuideExpanded: false,
        searchDraft: '',
        hasCompletedWhileHidden: false,
        displayMode: 'MENU', // MENU, LOADING_SCREEN, SHOP_GRID
        markers: [],
        loadingMarkerIndex: 0,
        loadingImageIndex: 0
    };

    // ============ Utils ============
    // Helper: Lấy message_id mới nhất (tương thích global iframe)
    function _getLatestMessageId() {
        try {
            if (typeof window.parent.getLastMessageId === 'function') {
                return window.parent.getLastMessageId();
            }
            if (window.parent.$) {
                const lastMes = window.parent.$('#chat .mes').last();
                if (lastMes.length) return lastMes.attr('mesid') || 'latest';
            }
        } catch (e) { }
        return 'latest';
    }

    // Helper: Lấy stat_data qua Mvu (an toàn cho global iframe)
    function _getStatData() {
        try {
            const Mvu = window.parent.Mvu;
            if (Mvu && typeof Mvu.getMvuData === 'function') {
                const result = Mvu.getMvuData({ type: 'message', message_id: _getLatestMessageId() });
                if (result && result.stat_data) return result.stat_data;
            }
        } catch (e) {
            console.warn('[FPShopBubble] Mvu không khả dụng, thử fallback...', e.message);
        }

        // Fallback: getVariables nếu ko phải global iframe
        try {
            const _getVariables = window.getVariables || window.parent.getVariables;
            const _ = window._ || window.parent._;
            if (_getVariables && _) {
                // Thử chat-level variables (không cần message_id)
                const vars = _getVariables({ type: 'chat' });
                const sd = _.get(vars, 'stat_data');
                if (sd) return sd;
            }
        } catch (e) { }

        return null;
    }

    function getUserLifeTier() {
        try {
            const statData = _getStatData();
            const _ = window._ || window.parent._;

            if (statData && _) {
                const rawTier = _.get(statData, 'Protagonist.LifeTier') || _.get(statData, 'protagonist.life_tier');

                if (rawTier) {
                    const match = String(rawTier).match(/(\d+)/);
                    if (match) {
                        const tier = parseInt(match[1]);
                        if (tier >= 1 && tier <= 7) {
                            state.userLifeTier = tier;
                            return tier;
                        }
                    }
                }
            }

            if (state.isOpen && !state.userLifeTier) {
                window.parent.toastr?.error('Không thể đo lường cấp bậc sinh mệnh');
            }
            state.userLifeTier = null;
            return null;
        } catch (e) {
            console.error('[FPShopBubble] Lỗi lấy LifeTier:', e);
            return null;
        }
    }

    function calculateRarityDist(tier) {
        const rarities = [
            { id: 1, name: 'Thông Thường' },
            { id: 2, name: 'Ưu Tú' },
            { id: 3, name: 'Hiếm' },
            { id: 4, name: 'Sử Thi' },
            { id: 5, name: 'Truyền Thuyết' },
            { id: 6, name: 'Thần Thoại' },
            { id: 7, name: 'Độc Nhất' }
        ];

        // Nếu tier null (lỗi), chia đều tỷ lệ
        if (!tier || tier < 1 || tier > 7) {
            const equalProb = (100 / rarities.length).toFixed(2) + '%';
            return rarities.reduce((acc, r) => {
                acc[r.name] = equalProb;
                return acc;
            }, {});
        }

        // Tính RatioPoint: 2^(7 - |i - L|)
        const points = rarities.map(r => ({
            name: r.name,
            p: Math.pow(2, 7 - Math.abs(r.id - tier))
        }));

        const total = points.reduce((sum, p) => sum + p.p, 0);

        // Chuyển sang %
        const dist = {};
        points.forEach(p => {
            dist[p.name] = ((p.p / total) * 100).toFixed(1) + '%';
        });

        state.rarityDist = dist;
        return dist;
    }

    function getFPBalance() {
        try {
            const statData = _getStatData();
            const _ = window._ || window.parent._;

            if (statData && _) {
                const fp = _.get(statData, 'DestinyPoints') ?? 0;
                state.fpBalance = fp;

                // Đồng thời cập nhật LifeTier
                getUserLifeTier();

                return fp;
            }
        } catch (e) {
            console.error('[FPShopBubble] Lỗi lấy FP:', e);
        }
        return state.fpBalance;
    }

    /**
     * Helper to match lorebook entries against keywords.
     * Handles both exact matches and bracketed variations.
     */
    function matchKeyword(entry, keyword) {
        if (!entry || !keyword) return false;
        const entryName = (entry.name || '').trim().toLowerCase();
        const comment = (entry.comment || '').trim().toLowerCase();
        const kw = keyword.trim().toLowerCase();
        const kwNoBrackets = kw.replace(/[\[\]]/g, '');

        return entryName === kw ||
            entryName === kwNoBrackets ||
            comment === kw ||
            comment === kwNoBrackets;
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    async function loadMarkers() {
        try {
            // Lấy URL của script hiện tại để tìm file JSON cùng thư mục
            const scripts = document.getElementsByTagName('script');
            let scriptPath = 'https://testingcf.jsdelivr.net/gh/accnhanf1102-code/sillytavern-translation-card-thienmenh@main/V4.2/Plugin/';
            for (let s of scripts) {
                if (s.src.includes('fpShopBubble Codex.js')) {
                    scriptPath = s.src.substring(0, s.src.lastIndexOf('/') + 1);
                    break;
                }
            }
            if (!scriptPath) scriptPath = './'; // Fallback

            const response = await fetch(scriptPath + 'map_marker.json');
            if (response.ok) {
                state.markers = await response.json();
                console.log('[FPShopBubble] Đã tải ' + state.markers.length + ' markers cho Loading State');
            }
        } catch (e) {
            console.warn('[FPShopBubble] Không thể tải map_marker.json:', e);
        }
    }

    // ============ Inject Styles ============
    function injectStyles() {
        if (parentDocument.getElementById(STYLE_ID)) return;

        const css = `
<style id="${STYLE_ID}">
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
/* Cathedral Fantasy Theme */
:root {
    --fps-panel-bg: radial-gradient(circle at top, rgba(145, 126, 84, 0.18), transparent 34%), linear-gradient(180deg, #111722 0%, #0b1018 58%, #090d14 100%);
    --fps-panel-edge: rgba(227, 204, 154, 0.18);
    --fps-panel-line: rgba(240, 228, 203, 0.08);
    --fps-accent: #d9b56b;
    --fps-accent-strong: #f1d9a3;
    --fps-text-main: #f3ead7;
    --fps-text-muted: #b3ad9f;
    --fps-text-dim: #6f7685;
    --fps-danger: #d18b87;
    --fps-shadow: 0 28px 80px rgba(0, 0, 0, 0.6);
}

.fps-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: radial-gradient(circle at top, rgba(217, 181, 107, 0.08), transparent 30%), rgba(6, 8, 12, 0.76);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 10200;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}
.fps-overlay.show {
    opacity: 1;
    visibility: visible;
}

.fps-panel {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    width: 85vw; height: 82vh;
    min-width: 700px; min-height: 450px;
    background: var(--fps-panel-bg);
    border: 1px solid var(--fps-panel-edge);
    box-shadow: var(--fps-shadow), inset 0 1px 0 rgba(255, 248, 225, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.03);
    z-index: 10201;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: var(--fps-text-main);
    resize: both;
}

.fps-panel.show {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -50%) scale(1);
}

.fps-header {
    height: 56px;
    padding: 0 20px 0 24px;
    background: linear-gradient(180deg, rgba(255, 248, 225, 0.03), rgba(255, 248, 225, 0));
    border-bottom: 1px solid var(--fps-panel-line);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.fps-header-ornament {
    display: flex;
    align-items: center;
    gap: 12px;
}
.fps-header-ornament::before,
.fps-header-ornament::after {
    content: "";
    width: 38px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(217, 181, 107, 0.55), transparent);
}
.fps-header-dot {
    width: 7px;
    height: 7px;
    border: 1px solid rgba(241, 217, 163, 0.6);
    background: rgba(217, 181, 107, 0.22);
    transform: rotate(45deg);
    box-shadow: 0 0 14px rgba(217, 181, 107, 0.18);
}
.fps-close-btn {
    width: 34px;
    height: 34px;
    border: 1px solid rgba(255, 244, 220, 0.12);
    background: rgba(255, 244, 220, 0.04);
    color: var(--fps-text-muted);
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}
.fps-close-btn:hover {
    border-color: rgba(217, 181, 107, 0.42);
    color: var(--fps-accent-strong);
    background: rgba(217, 181, 107, 0.08);
    transform: translateY(-1px);
}

.fps-content {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.fps-left {
    flex: 1.4;
    border-right: 1px solid var(--fps-panel-line);
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
}

.fps-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: radial-gradient(circle at top, rgba(217, 181, 107, 0.1), transparent 36%), linear-gradient(180deg, rgba(255, 248, 225, 0.025), rgba(255, 248, 225, 0));
}

.fps-tabs {
    display: flex;
    gap: 20px;
    padding: 0 24px;
    min-height: 58px;
    align-items: center;
    border-bottom: 1px solid var(--fps-panel-line);
    background: rgba(7, 10, 16, 0.24);
}
.fps-tab {
    position: relative;
    padding: 18px 0 16px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.26em;
    color: var(--fps-text-dim);
    cursor: pointer;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
}
.fps-tab:hover {
    color: #d6d0c0;
}
.fps-tab::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(217, 181, 107, 0.95), transparent);
    transform: scaleX(0.2);
    opacity: 0;
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.fps-tab.active {
    color: var(--fps-accent-strong);
}
.fps-tab.active::after {
    opacity: 1;
    transform: scaleX(1);
}
.fps-tab-icon {
    opacity: 0.5;
    font-size: 11px;
}

.fps-grid-container {
    flex: 1;
    overflow-y: auto;
    padding: 18px 20px 20px;
}
.fps-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.fps-card {
    background: linear-gradient(180deg, rgba(22, 29, 43, 0.96), rgba(13, 17, 27, 0.96));
    border: 1px solid rgba(255, 244, 220, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 244, 220, 0.04), 0 14px 28px rgba(0, 0, 0, 0.26);
    padding: 18px 18px 16px;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
    min-height: 168px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.fps-card::before,
.fps-card::after {
    content: "";
    position: absolute;
    width: 22px;
    height: 22px;
    border-color: rgba(255, 244, 220, 0.14);
    pointer-events: none;
}
.fps-card::before {
    top: 8px;
    left: 8px;
    border-top: 1px solid;
    border-left: 1px solid;
}
.fps-card::after {
    right: 8px;
    bottom: 8px;
    border-right: 1px solid;
    border-bottom: 1px solid;
}
.fps-card-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top, var(--rarity-color, rgba(255,255,255,0.16)), transparent 52%);
    opacity: 0.08;
    pointer-events: none;
}
.fps-card:hover {
    transform: translateY(-3px);
    background: linear-gradient(180deg, rgba(29, 37, 54, 0.98), rgba(16, 21, 33, 0.98));
    border-color: rgba(255, 244, 220, 0.16);
    box-shadow: inset 0 1px 0 rgba(255, 244, 220, 0.05), 0 18px 32px rgba(0, 0, 0, 0.34), 0 0 0 1px rgba(255, 255, 255, 0.02);
}
.fps-card:active {
    transform: translateY(-1px);
}
.fps-card.selected {
    background: linear-gradient(180deg, rgba(36, 43, 60, 0.98), rgba(18, 23, 35, 0.98));
    border-color: var(--rarity-color, rgba(255, 244, 220, 0.2));
    box-shadow: inset 0 1px 0 rgba(255, 244, 220, 0.06), 0 0 0 1px rgba(255,255,255,0.03), 0 20px 34px rgba(0, 0, 0, 0.36);
}
.fps-card-top {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    z-index: 1;
}
.fps-card-kind {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    color: var(--fps-text-dim);
}
.fps-card-rarity {
    flex-shrink: 0;
}
.fps-card-name {
    position: relative;
    z-index: 1;
    font-family: "Lobster", Georgia, "Times New Roman", serif;
    font-weight: 700;
    font-size: 19px;
    line-height: 1.25;
    color: var(--fps-text-main);
}
.fps-card-meta {
    position: relative;
    z-index: 1;
    font-size: 12px;
    color: var(--fps-text-muted);
    line-height: 1.5;
    min-height: 36px;
}
.fps-card-tags {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.fps-chip {
    border: 1px solid rgba(255, 244, 220, 0.1);
    background: rgba(255, 244, 220, 0.04);
    color: var(--fps-text-muted);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    padding: 4px 8px;
}
.fps-card-footer {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    margin-top: auto;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 244, 220, 0.08);
}
.fps-card-price-wrap {
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.fps-card-price-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--fps-text-dim);
}
.fps-card-price {
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 700;
    color: var(--fps-accent-strong);
    font-size: 20px;
}
.fps-rarity {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 24px;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    padding: 4px 10px;
    border: 1px solid currentColor;
    background: rgba(255, 255, 255, 0.03);
}

.fps-state-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    text-align: center;
}
.fps-menu-shell {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.fps-menu-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}
.fps-state-screen.fps-empty-screen {
    justify-content: flex-start;
    padding: 32px 40px 20px;
}
.fps-state-screen h2 {
    font-family: "Lobster", Georgia, serif;
    font-size: 28px;
    color: var(--fps-accent-strong);
    margin: 0 0 10px 0;
}

.fps-icon-large {
    font-size: 60px;
    margin-bottom: 18px;
    color: rgba(217, 181, 107, 0.34);
}
.fps-state-screen h2 {
    margin: 0 0 10px;
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 700;
    font-size: 30px;
    color: var(--fps-text-main);
}
.fps-state-screen p {
    max-width: 420px;
    margin: 0;
    color: var(--fps-text-muted);
    line-height: 1.7;
}
.fps-guide-container {
    width: 100%;
    max-width: 600px;
    margin-top: 20px;
    padding: 18px 20px;
    text-align: left;
    font-size: 13px;
    line-height: 1.6;
    color: var(--fps-text-muted);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(217, 181, 107, 0.1);
}
.fps-guide-header {
    color: var(--fps-accent);
    font-weight: 700;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.1em;
}
.fps-guide-summary {
    margin: 0;
    max-width: none;
}
.fps-guide-toggle {
    margin-top: 14px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--fps-accent-strong);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
}
.fps-guide-toggle:hover {
    color: var(--fps-accent);
}
.fps-guide-content {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(217, 181, 107, 0.12);
}
.fps-guide-list {
    margin: 0;
    padding-left: 20px;
}
.fps-guide-list li {
    margin-bottom: 8px;
}
.fps-guide-note {
    opacity: 0.8;
    font-size: 12px;
    font-style: italic;
}
.fps-btn-hero {
    margin-top: 24px;
    min-height: 48px;
    padding: 0 28px;
    border: 1px solid rgba(241, 217, 163, 0.44);
    background: linear-gradient(180deg, #ecd8ab 0%, #c9a55f 100%);
    color: #17130d;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    cursor: pointer;
    box-shadow: inset 0 1px 0 rgba(255, 249, 234, 0.65), 0 16px 26px rgba(0, 0, 0, 0.24);
    transition: transform 0.2s ease, filter 0.2s ease;
}
.fps-btn-hero:hover {
    transform: translateY(-1px);
    filter: brightness(1.04);
}

.fps-fp-bar {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--fps-panel-line);
    background: rgba(255, 248, 225, 0.03);
}
.fps-info-tile {
    padding: 12px 14px;
    border: 1px solid rgba(255, 244, 220, 0.08);
    background: rgba(10, 14, 22, 0.52);
}
.fps-info-label {
    display: block;
    margin-bottom: 6px;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--fps-text-dim);
}
.fps-info-value {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 22px;
    color: var(--fps-accent-strong);
}
.fps-info-value-subtle {
    color: var(--fps-text-main);
}

.fps-detail {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}
.fps-detail-shell {
    min-height: 100%;
    border: 1px solid rgba(255, 244, 220, 0.08);
    background: radial-gradient(circle at top, rgba(217, 181, 107, 0.12), transparent 32%), linear-gradient(180deg, rgba(20, 27, 39, 0.98), rgba(10, 14, 22, 0.98));
    box-shadow: inset 0 1px 0 rgba(255, 248, 225, 0.04);
    padding: 24px;
    position: relative;
}
.fps-detail-shell::before,
.fps-detail-shell::after {
    content: "";
    position: absolute;
    width: 28px;
    height: 28px;
    border-color: rgba(241, 217, 163, 0.16);
    pointer-events: none;
}
.fps-detail-shell::before {
    top: 10px;
    left: 10px;
    border-top: 1px solid;
    border-left: 1px solid;
}
.fps-detail-shell::after {
    right: 10px;
    bottom: 10px;
    border-right: 1px solid;
    border-bottom: 1px solid;
}
.fps-detail-empty {
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--fps-text-dim);
    text-align: center;
    padding: 30px;
    line-height: 1.8;
}
.fps-detail-kicker {
    font-size: 10px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--fps-text-dim);
    text-align: center;
    margin-bottom: 10px;
}
.fps-detail-title {
    margin: 0;
    font-family: "Lobster", Georgia, "Times New Roman", serif;
    font-size: 34px;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    color: var(--fps-text-main);
}
.fps-detail-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
}
.fps-detail-cost {
    margin-top: 18px;
    text-align: center;
}
.fps-detail-cost-label {
    display: block;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--fps-text-dim);
}
.fps-detail-cost-value {
    display: block;
    margin-top: 6px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 34px;
    color: var(--fps-accent-strong);
}
.fps-detail-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    margin-top: 14px;
}
.fps-detail-divider {
    height: 1px;
    margin: 22px 0;
    background: linear-gradient(90deg, transparent, rgba(217, 181, 107, 0.38), transparent);
}
.fps-detail-section {
    margin-bottom: 18px;
    border: 1px solid rgba(255, 244, 220, 0.08);
    background: rgba(255, 248, 225, 0.02);
    padding: 16px 16px 14px;
}
.fps-detail-section-title {
    margin: 0 0 12px;
    font-size: 10px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--fps-text-dim);
}
.fps-effect-list {
    display: grid;
    gap: 8px;
}
.fps-effect-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding-bottom: 7px;
    border-bottom: 1px solid rgba(255, 244, 220, 0.06);
}
.fps-effect-row:last-child {
    padding-bottom: 0;
    border-bottom: none;
}
.fps-effect-key {
    color: var(--fps-text-main);
    font-weight: 700;
}
.fps-effect-value,
.fps-detail-copy {
    color: var(--fps-text-muted);
    line-height: 1.75;
}
.fps-comment-box {
    border: 1px solid rgba(209, 139, 135, 0.18);
    background: linear-gradient(180deg, rgba(209, 139, 135, 0.08), rgba(209, 139, 135, 0.03));
}
.fps-comment-copy {
    color: #e7c6c4;
    font-style: italic;
}

.fps-buy-footer {
    padding: 0 20px 20px;
}

.fps-buy-btn {
    width: 100%;
    min-height: 52px;
    padding: 0 18px;
    border: 1px solid rgba(241, 217, 163, 0.5);
    background: linear-gradient(180deg, #efe0b8 0%, #cba661 100%);
    color: #15120d;
    font-weight: 900;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    cursor: pointer;
    transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    box-shadow: inset 0 1px 0 rgba(255, 249, 234, 0.72), 0 16px 24px rgba(0, 0, 0, 0.25);
}
.fps-buy-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.04);
    box-shadow: inset 0 1px 0 rgba(255, 249, 234, 0.8), 0 18px 28px rgba(0, 0, 0, 0.3);
}
.fps-buy-btn:active:not(:disabled) {
    transform: translateY(0);
}
.fps-buy-btn:disabled {
    border-color: rgba(141, 150, 163, 0.16);
    background: linear-gradient(180deg, #737a85 0%, #575f69 100%);
    color: rgba(241, 245, 249, 0.74);
    cursor: not-allowed;
    box-shadow: none;
}

.fps-input-wrap {
    padding: 16px 20px 20px;
    background: rgba(9, 13, 20, 0.58);
    border-top: 1px solid var(--fps-panel-line);
    display: flex;
    gap: 12px;
}
.fps-input {
    flex: 1;
    background: rgba(255, 248, 225, 0.035);
    border: 1px solid rgba(255, 244, 220, 0.09);
    padding: 0 16px;
    min-height: 44px;
    color: var(--fps-text-main);
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease;
}
.fps-input::placeholder {
    color: var(--fps-text-dim);
}
.fps-input:focus {
    border-color: rgba(217, 181, 107, 0.45);
    background: rgba(255, 248, 225, 0.05);
}
.fps-send-btn {
    min-width: 118px;
    padding: 0 18px;
    border: 1px solid rgba(255, 244, 220, 0.12);
    background: rgba(255, 248, 225, 0.04);
    color: var(--fps-text-main);
    font-weight: 800;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.18em;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease, color 0.2s ease;
}
.fps-send-btn:hover {
    background: rgba(217, 181, 107, 0.08);
    border-color: rgba(217, 181, 107, 0.3);
    color: var(--fps-accent-strong);
    transform: translateY(-1px);
}

.fps-spinner {
    width: 50px; height: 50px;
    border: 3px solid rgba(217, 181, 107, 0.1);
    border-left-color: var(--fps-accent);
    border-radius: 50%;
    animation: fps-spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes fps-spin { to { transform: rotate(360deg); } }

.fps-panel *::-webkit-scrollbar { width: 6px; }
.fps-panel *::-webkit-scrollbar-thumb { background: rgba(255, 244, 220, 0.12); }
.fps-panel *::-webkit-scrollbar-thumb:hover { background: rgba(217, 181, 107, 0.5); }
.fps-grid-empty {
    grid-column: 1 / -1;
    padding: 34px 20px;
    text-align: center;
    border: 1px solid rgba(255, 244, 220, 0.07);
    background: rgba(255, 248, 225, 0.02);
    color: var(--fps-text-dim);
}

.fps-length-select {
    background: rgba(255, 244, 220, 0.04);
    border: 1px solid rgba(255, 244, 220, 0.12);
    color: var(--fps-text-muted);
    font-size: 11px;
    padding: 4px 8px;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
}
.fps-length-select:hover {
    border-color: rgba(217, 181, 107, 0.42);
    background: rgba(217, 181, 107, 0.08);
    color: var(--fps-accent-strong);
}
.fps-length-select option {
    background: #111722;
    color: var(--fps-text-main);
}

@media (max-width: 1080px) {
    .fps-content {
        flex-direction: column;
    }

    .fps-left {
        flex: 1;
        min-height: 48%;
        border-right: none;
        border-bottom: 1px solid var(--fps-panel-line);
    }

    .fps-right {
        min-height: 52%;
    }
}

@media (max-width: 840px) {
    .fps-panel {
        min-width: 0;
        width: 94vw;
        height: 88vh;
    }

    .fps-tabs {
        gap: 12px;
        padding: 0 16px;
        overflow-x: auto;
        justify-content: flex-start;
    }

    .fps-grid {
        grid-template-columns: 1fr;
    }

    .fps-input-wrap {
        flex-direction: column;
    }

    .fps-state-screen.fps-empty-screen {
        padding: 24px 20px 16px;
    }

    .fps-guide-container {
        padding: 16px;
    }

    .fps-send-btn {
        min-height: 44px;
        width: 100%;
    }

    .fps-fp-bar {
        grid-template-columns: 1fr;
    }
}

/* Loading State Redesign Styles */
.fps-loading-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 30px;
    background: radial-gradient(circle at top right, rgba(217, 181, 107, 0.05), transparent 40%);
    overflow: hidden;
}

.fps-marker-preview {
    flex: 1;
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 30px;
    min-height: 0;
}

.fps-marker-visual {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.fps-marker-frame {
    position: relative;
    width: 320px;
    height: 380px;
    background: #070a10;
    border: 1px solid var(--fps-panel-edge);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    overflow: hidden;
}

.fps-marker-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.fps-img-nav {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
    background: linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%);
    pointer-events: none;
}

.fps-marker-frame:hover .fps-img-nav {
    opacity: 1;
}

.fps-img-nav-btn {
    width: 32px;
    height: 32px;
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(217, 181, 107, 0.3);
    color: var(--fps-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.2s ease;
}

.fps-img-nav-btn:hover {
    background: var(--fps-accent);
    color: #111;
}

.fps-img-dots {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    pointer-events: none;
}

.fps-img-dot {
    width: 5px;
    height: 5px;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
}

.fps-img-dot.active {
    background: var(--fps-accent);
    box-shadow: 0 0 5px var(--fps-accent);
}

.fps-marker-details {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding-right: 15px;
}

.fps-marker-header {
    border-bottom: 1px solid var(--fps-panel-line);
    padding-bottom: 15px;
}

.fps-marker-name {
    font-family: "Lobster", Georgia, serif;
    font-size: 28px;
    color: var(--fps-accent-strong);
    margin: 0 0 5px 0;
}

.fps-marker-group {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--fps-text-dim);
    background: rgba(255,255,255,0.05);
    padding: 3px 8px;
    border-left: 2px solid var(--fps-accent);
}

.fps-marker-desc {
    font-size: 14px;
    line-height: 1.8;
    color: var(--fps-text-muted);
    white-space: pre-wrap;
}

.fps-loading-footer {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--fps-panel-line);
    margin-top: 20px;
}

.fps-marker-pagination {
    display: flex;
    gap: 15px;
}

.fps-p-btn {
    background: transparent;
    border: 1px solid rgba(217, 181, 107, 0.2);
    color: var(--fps-text-muted);
    padding: 8px 16px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s ease;
}

.fps-p-btn:hover {
    border-color: var(--fps-accent);
    color: var(--fps-accent);
}

.fps-status-indicator {
    display: flex;
    align-items: center;
    gap: 15px;
}

.fps-status-text {
    font-size: 12px;
    color: var(--fps-text-dim);
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.fps-ready-btn {
    padding: 12px 30px;
    background: linear-gradient(135deg, #f1d9a3, #d9b56b);
    color: #111;
    font-weight: 900;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    border: none;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(217, 181, 107, 0.2);
    transition: all 0.3s ease;
}

.fps-ready-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(217, 181, 107, 0.3);
}

.fps-ready-btn:active {
    transform: translateY(0);
}

@keyframes fps-pulse {
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
}

.fps-pulse {
    animation: fps-pulse 2s infinite;
}

@media (max-width: 900px) {
    .fps-marker-preview {
        grid-template-columns: 1fr;
    }
    .fps-marker-frame {
        width: 100%;
        height: 250px;
    }
}
</style>`;

        parentDocument.head.insertAdjacentHTML('beforeend', css);
    }

    // ============ Cấu trúc UI ============
    function createPanel() {
        if (parentDocument.getElementById(PANEL_ID)) return;

        const overlay = parentDocument.createElement('div');
        overlay.id = PANEL_ID + '-overlay';
        overlay.className = 'fps-overlay';
        overlay.onclick = togglePanel;

        const panel = parentDocument.createElement('div');
        panel.id = PANEL_ID;
        panel.className = 'fps-panel';
        panel.onclick = (e) => e.stopPropagation();

        parentDocument.body.appendChild(overlay);
        parentDocument.body.appendChild(panel);

        renderState();
    }

    function getItemTags(item) {
        return Array.isArray(item?.tag) ? item.tag.filter(Boolean).slice(0, 3) : [];
    }

    function renderEffectEntries(effect) {
        if (!effect || typeof effect !== 'object') {
            return '<div class="fps-detail-copy">Chưa ghi nhận hiệu ứng nào.</div>';
        }

        const entries = Object.entries(effect).filter(([key, value]) => key && value !== null && value !== undefined && value !== '');
        if (!entries.length) {
            return '<div class="fps-detail-copy">Chưa ghi nhận hiệu ứng nào.</div>';
        }

        return `
            <div class="fps-effect-list">
                ${entries.map(([key, value]) => `
                    <div class="fps-effect-row">
                        <span class="fps-effect-key">${key}</span>
                        <span class="fps-effect-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderDetailContent(detail) {
        if (!detail) {
            return `
                <div class="fps-detail-shell">
                    <div class="fps-detail-empty">
                        Chọn một vật phẩm để xem hồ sơ chi tiết, hiệu ứng và phán quyết của Hệ Thống.
                    </div>
                </div>
            `;
        }

        const rarity = RARITY_MAP[detail.rarity] || { color: '#9ca3af', label: detail.rarity || 'Chưa rõ' };
        const tags = getItemTags(detail);
        const description = detail.description || 'Không có mô tả cho vật phẩm này.';
        const comment = detail.comment || 'Hệ Thống tạm thời không đưa ra lời nhận xét.';

        return `
            <div class="fps-detail-shell">
                <div class="fps-detail-kicker">Hồ sơ vật phẩm</div>
                <h1 class="fps-detail-title">${detail.name || 'Vật phẩm chưa định danh'}</h1>
                <div class="fps-detail-meta">
                    <span class="fps-rarity" style="color:${rarity.color}; background:${rarity.color}1a;">${rarity.label}</span>
                    <span class="fps-chip">${detail.type || 'Chưa phân loại'}</span>
                </div>
                <div class="fps-detail-cost">
                    <span class="fps-detail-cost-label">Giá vật phẩm</span>
                    <span class="fps-detail-cost-value">${detail.cost ?? 0} FP</span>
                </div>
                ${tags.length ? `<div class="fps-detail-tags">${tags.map(tag => `<span class="fps-chip">${tag}</span>`).join('')}</div>` : ''}
                <div class="fps-detail-divider"></div>
                <div class="fps-detail-section">
                    <h3 class="fps-detail-section-title">Hiệu ứng</h3>
                    ${renderEffectEntries(detail.effect)}
                </div>
                <div class="fps-detail-section">
                    <h3 class="fps-detail-section-title">Mô tả</h3>
                    <div class="fps-detail-copy">${description}</div>
                </div>
                <div class="fps-detail-section fps-comment-box">
                    <h3 class="fps-detail-section-title">Đánh giá</h3>
                    <div class="fps-detail-copy fps-comment-copy">"${comment}"</div>
                </div>
            </div>
        `;
    }

    function extractAndRepairJson(responseText) {
        let jsonStr = (responseText || '').trim();
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');

        if (firstBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace !== -1 ? lastBrace + 1 : jsonStr.length);
        }

        jsonStr = jsonStr.split('\n').map(line => line.trim()).join(' ');
        jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, ' ');

        jsonStr = jsonStr.replace(/:(?:\s*)(})/g, ': null$1');
        jsonStr = jsonStr.replace(/:(?:\s*)(,)/g, ': null$1');
        jsonStr = jsonStr.replace(/:(?:\s*)(\])/g, ': null$1');

        jsonStr = jsonStr.replace(/}\s*{/g, '}, {');
        jsonStr = jsonStr.replace(/}\s*\[/g, '}, [');
        jsonStr = jsonStr.replace(/\]\s*{/g, '], {');

        jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

        let openBraces = (jsonStr.match(/{/g) || []).length;
        let closeBraces = (jsonStr.match(/}/g) || []).length;
        while (openBraces > closeBraces) { jsonStr += '}'; closeBraces++; }
        let openBrackets = (jsonStr.match(/\[/g) || []).length;
        let closeBrackets = (jsonStr.match(/\]/g) || []).length;
        while (openBrackets > closeBrackets) { jsonStr += ']'; closeBrackets++; }

        return jsonStr;
    }

    function normalizeWorkerData(data) {
        return {
            equipment: data['Trang Bị'] || data.equipment || data.Equipment || [],
            items: data['Items'] || data.items || data.items_list || [],
            skills: data['Skills'] || data.skills || data.skill_list || [],
            system: data['Hệ Thống'] || data.system || data.system_items || []
        };
    }

    function parseWorkerPayload(responseText, workerIndex) {
        if (!responseText) {
            throw new Error('Worker ' + workerIndex + ' không nhận được phản hồi từ AI');
        }

        // console.warn('[FPShopBubble] === RAW AI RESPONSE WORKER ' + workerIndex + ' (START) ===');
        // console.warn(responseText);
        // console.warn('[FPShopBubble] === RAW AI RESPONSE WORKER ' + workerIndex + ' (END) ===');

        const jsonStr = extractAndRepairJson(responseText);
        let data;

        try {
            data = JSON.parse(jsonStr);
        } catch (err) {
            console.error('[FPShopBubble] JSON Parse worker ' + workerIndex + ' lần 1 thất bại:', err.message);
            console.log('[FPShopBubble] Cleaned JSON worker ' + workerIndex + ' (for debug):', jsonStr);

            const lastValidEnd = Math.max(jsonStr.lastIndexOf('},'), jsonStr.lastIndexOf('}]'));
            if (lastValidEnd > 0) {
                let truncated = jsonStr.substring(0, lastValidEnd + 1);
                let openBraces = (truncated.match(/{/g) || []).length;
                let closeBraces = (truncated.match(/}/g) || []).length;
                while (openBraces > closeBraces) { truncated += '}'; closeBraces++; }
                let openBrackets = (truncated.match(/\[/g) || []).length;
                let closeBrackets = (truncated.match(/\]/g) || []).length;
                while (openBrackets > closeBrackets) { truncated += ']'; closeBrackets++; }
                data = JSON.parse(truncated);
            } else {
                throw err;
            }
        }

        return normalizeWorkerData(data);
    }

    function mergeWorkerPayloads(payloads) {
        const merged = payloads.reduce(function (acc, payload) {
            acc.equipment = acc.equipment.concat(payload.equipment || []);
            acc.items = acc.items.concat(payload.items || []);
            acc.skills = acc.skills.concat(payload.skills || []);
            acc.system = acc.system.concat(payload.system || []);
            return acc;
        }, {
            equipment: [],
            items: [],
            skills: [],
            system: []
        });

        const sortFn = (a, b) => getRarityWeight(a.rarity) - getRarityWeight(b.rarity);

        merged.equipment.sort(sortFn);
        merged.items.sort(sortFn);
        merged.skills.sort(sortFn);
        merged.system.sort(sortFn);

        return merged;
    }

    function summarizeWorkerErrors(workerErrors) {
        return workerErrors.map(function (entry) {
            return 'Worker ' + entry.worker + ': ' + entry.message;
        }).join(' | ');
    }

    function renderState() {
        const panel = parentDocument.getElementById(PANEL_ID);
        if (!panel) return;

        let content = `
            <div class="fps-header">
                <div class="fps-title"></div>
                <button onclick="window.parent.FPShopManager.toggle()" style="background:transparent;border:none;color:#aaa;cursor:pointer;font-size:18px;">✕</button>
            </div>
        `;

        if (state.status === 'EMPTY') {
            content += renderEmptyState();
        } else if (state.status === 'LOADING') {
            content += renderLoadingState();
        } else {
            content += renderLoadedState();
        }

        panel.innerHTML = content;

        // Gắn sự kiện (vì innerHTML làm mất reference)
        bindEvents();
    }

    function renderEmptyState() {
        return `
            <div class="fps-state-screen">
                <div class="fps-icon-large">📦</div>
                <h2>Chưa có vật phẩm để bán</h2>
                <p style="color:#71717a">Hãy yêu cầu hệ thống xuất vật phẩm dựa trên bối cảnh hiện tại</p>
                <button class="fps-btn-hero" id="fps-btn-fetch">TRUY XUẤT VẬT PHẨM</button>
            </div>
            <div class="fps-input-wrap">
                <input class="fps-input" id="fps-search-input" placeholder="Nhập vật phẩm cần tìm..." />
                <button class="fps-send-btn" id="fps-btn-send">GỬI</button>
            </div>
        `;
    }

    function renderLoadingState() {
        return `
            <div class="fps-state-screen">
                <div class="fps-spinner"></div>
                <h2 style="margin-top:20px;">Đang Truy Xuất Vật Phẩm...</h2>
                <p style="color:#71717a">AI đang phân tích Lorebook và kiến tạo vật phẩm</p>
            </div>
        `;
    }

    function renderLoadedState() {
        const categoriesHtml = CATEGORIES.map(cat => `
            <div class="fps-tab ${state.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                ${cat.icon} ${cat.label}
            </div>
        `).join('');

        const currentItems = state.items[state.activeCategory] || [];
        const itemsHtml = currentItems.length ? currentItems.map((item, idx) => {
            const rarity = RARITY_MAP[item.rarity] || { color: '#9ca3af', label: item.rarity };
            const isSelected = state.selectedItem === item;
            return `
                <div class="fps-card ${isSelected ? 'selected' : ''}" 
                     data-idx="${idx}" 
                     style="--rarity-color: ${rarity.color}">
                    <div class="fps-card-name">${item.name}</div>
                    <div class="fps-card-meta">${item.type}</div>
                    <div class="fps-card-footer">
                        <div class="fps-card-price">${item.cost} FP</div>
                        <div class="fps-rarity" style="color:${rarity.color}">${rarity.label}</div>
                    </div>
                </div>
            `;
        }).join('') : `<div style="grid-column: span 2; padding: 20px; color:#71717a; text-align:center;">Không có vật phẩm nào trong mục này.</div>`;

        const detail = state.selectedItem;
        const detailHtml = detail ? `
            <div style="margin-bottom:20px;">
                <h1 style="margin:0 0 8px 0; font-size:24px;">${detail.name}</h1>
                <div style="display:flex; gap:10px; align-items:center;">
                    <span class="fps-rarity" style="background:${(RARITY_MAP[detail.rarity] || { color: '#aaa' }).color}20; color:${(RARITY_MAP[detail.rarity] || { color: '#aaa' }).color}">${detail.rarity}</span>
                    <span style="color:#71717a; font-size: 13px;">${detail.type}</span>
                </div>
            </div>
            <div style="margin-bottom:20px; color:#fbbf24; font-size:20px; font-weight:800;">Giá: ${detail.cost} FP</div>
            
            <div style="margin-bottom:24px;">
                <label style="font-size:11px; color:#52525b; text-transform:uppercase; font-weight:700; margin-bottom:8px; display:block;">Hiệu Ứng</label>
                <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:0; border:1px solid rgba(255,255,255,0.05);">
                    ${Object.entries(detail.effect).map(([k, v]) => `<div style="margin-bottom:6px;"><b style="color:#eee;">${k}:</b> <span style="color:#a1a1aa;">${v}</span></div>`).join('')}
                </div>
            </div>

            <div style="margin-bottom:24px;">
                <label style="font-size:11px; color:#52525b; text-transform:uppercase; font-weight:700; margin-bottom:8px; display:block;">Mô Tả</label>
                <p style="margin:0; color:#a1a1aa; line-height:1.6; font-size:14px;">${detail.description}</p>
            </div>

            <div style="margin-bottom:24px; font-style: italic; color: #f87171; background: rgba(248, 113, 113, 0.05); padding: 12px; border-radius: 0; border-left: 3px solid #f87171;">
                <label style="font-size:10px; color:#f87171; text-transform:uppercase; font-weight:800; font-style: normal; margin-bottom:4px; display:block;">Đánh giá</label>
                "${detail.comment}"
            </div>
        ` : `<div style="height:100%; display:flex; align-items:center; justify-content:center; color:#52525b;">Chọn một vật phẩm để xem chi tiết</div>`;

        return `
            <div class="fps-content">
                <div class="fps-left">
                    <div class="fps-tabs">${categoriesHtml}</div>
                    <div class="fps-grid-container">
                        <div class="fps-grid">${itemsHtml}</div>
                    </div>
                    <div class="fps-input-wrap">
                        <input class="fps-input" id="fps-search-input" placeholder="Tìm sản phẩm..." />
                        <button class="fps-send-btn" id="fps-btn-send">GỬI</button>
                    </div>
                </div>
<div class="fps-right">
                    <div class="fps-fp-bar" style="flex-direction:column; align-items:flex-start; gap:4px; height:auto; padding:10px 20px;">
                        <div style="display:flex; justify-content:space-between; width:100%;">
                            <span>💰 Vận Mệnh Điểm:</span>
                            <span>${getFPBalance()} ⟡</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; width:100%; font-size:11px; opacity:0.8;">
                            <span>🧬 Giai vị Sinh mệnh:</span>
                            <span>${state.userLifeTier || 'Chưa rõ'}</span>
                        </div>
                    </div>
                    <div class="fps-detail">
                        ${detailHtml}
                    </div>
                    <div class="fps-buy-footer">
                        <button class="fps-buy-btn" id="fps-btn-buy" ${!detail || state.fpBalance < detail.cost ? 'disabled' : ''}>
                            ${detail ? (state.fpBalance >= detail.cost ? 'MUA VẬT PHẨM' : 'KHÔNG ĐỦ FP') : 'CHỈNH VẬT PHẨM'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderState() {
        const panel = parentDocument.getElementById(PANEL_ID);
        if (!panel) return;

        let content = `
            <div class="fps-header">
                <div class="fps-header-ornament">
                    <span class="fps-header-dot"></span>
                    <div class="fps-title" style="font-size: 14px; font-weight: 700; color: var(--fps-accent); margin-left:8px;"></div>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <select class="fps-length-select" id="fps-worker-count" title="Số worker">
                        <option value="1" ${state.selectedWorkerCount === 1 ? 'selected' : ''}>1 Linh Phục Hệ Thống</option>
                        <option value="2" ${state.selectedWorkerCount === 2 ? 'selected' : ''}>2 Linh Phục Hệ Thống</option>
                        <option value="3" ${state.selectedWorkerCount === 3 ? 'selected' : ''}>3 Linh Phục Hệ Thống</option>
                        <option value="4" ${state.selectedWorkerCount === 4 ? 'selected' : ''}>4 Linh Phục Hệ Thống</option>
                        <option value="5" ${state.selectedWorkerCount === 5 ? 'selected' : ''}>5 Linh Phục Hệ Thống</option>
                    </select>
                    <select class="fps-length-select" id="fps-prompt-length">
                        <option value="Short" ${state.selectedPromptLength === 'Short' ? 'selected' : ''}>Mô tả ngắn gọn</option>
                        <option value="Moderate" ${state.selectedPromptLength === 'Moderate' ? 'selected' : ''}>Mô tả vừa phải</option>
                        <option value="Full" ${state.selectedPromptLength === 'Full' ? 'selected' : ''}>Mô tả Đầy Đủ</option>
                    </select>
                    <button class="fps-close-btn" onclick="window.parent.FPShopManager.toggle()" aria-label="Đóng cửa hàng">×</button>
                </div>
            </div>
        `;

        if (state.displayMode === 'MENU') {
            content += renderEmptyState();
        } else if (state.displayMode === 'LOADING_SCREEN') {
            content += renderLoadingState();
        } else {
            content += renderLoadedState();
        }

        panel.innerHTML = content;
        bindEvents();
    }

    function renderEmptyState() {
        return `
            <div class="fps-menu-shell">
                <div class="fps-menu-body">
                    <div class="fps-state-screen fps-empty-screen">
                        <div class="fps-icon-large">📦</div>
                        <h2>Hệ Thống Chưa Liên Kết Với Vật Phẩm</h2>
                        <p style="color:#71717a">Hãy yêu cầu hệ thống truy xuất vật phẩm ngẫu nhiên hoặc theo yêu cầu</p>

                        <div class="fps-guide-container ${state.isGuideExpanded ? 'expanded' : 'collapsed'}">
                            <div class="fps-guide-header">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                Hướng dẫn sử dụng Cửa Hàng Hệ Thống
                            </div>
                            <p class="fps-guide-summary">Bạn có thể nhập vật phẩm muốn tìm ở ô bên dưới, rồi để hệ thống truy xuất theo đúng bối cảnh hiện tại.</p>
                            <button class="fps-guide-toggle" id="fps-guide-toggle" type="button">${state.isGuideExpanded ? 'Thu gọn' : 'Xem hướng dẫn'}</button>
                            ${state.isGuideExpanded ? `
                                <div class="fps-guide-content">
                                    <ul class="fps-guide-list">
                                        <li>Có thể <b>nhập một vật phẩm cụ thể</b> hay loại vật phẩm nào đó đang tìm kiếm ở ô nhập bên dưới.</li>
                                        <li>Có thể <b>điều chỉnh lượng từ ngữ</b> dùng để mô tả ở góc trên bên phải (Mô tả ngắn gọn/vừa phải/Đầy Đủ).</li>
                                        <li>Có thể <b>điều chỉnh Số Lượng Linh Phục Hệ Thống</b> ở góc trên bên phải. Mỗi Linh Phục Hệ Thống sẽ truy xuất được 1 số lượng nhất định Vật Phẩm/Trang Bị/Kỹ Năng. Càng nhiều thì sẽ càng có nhiều vật phẩm được bán.</li>
                                        <li>Có thể <b>tạm thời tắt bảng điều khiển</b> (Close) trong quá trình chờ truy xuất; hệ thống vẫn sẽ tiếp tục làm việc ngầm.</li>
                                        <li><b>Khuyến nghị sử dụng</b> model <b>gemini-3-flash-preview</b> hoặc các model nhẹ tương tự để có tốc độ phản hồi tối ưu.</li>
                                        <li class="fps-guide-note">Lưu ý: Đôi khi Linh Phục có thể gặp "tai nạn đáng tiếc" trong quá trình truy xuất nên việc dùng nhiều Linh Phục cũng giúp giảm tỉ lệ thất bại hoàn toàn.</li>
                                    </ul>
                                </div>
                            ` : ''}
                        </div>

                        <button class="fps-btn-hero" id="fps-btn-fetch">TRUY XUẤT VẬT PHẨM</button>
                    </div>
                </div>
                <div class="fps-input-wrap">
                    <input class="fps-input" id="fps-search-input" placeholder="Nhập vật phẩm cần tìm..." value="${escapeHtml(state.searchDraft)}" />
                    <button class="fps-send-btn" id="fps-btn-send">GỬI</button>
                </div>
            </div>
        `;
    }

    function renderLoadingState() {
        const marker = state.markers[state.loadingMarkerIndex];
        if (!marker) {
            return `
                <div class="fps-state-screen">
                    <div class="fps-spinner"></div>
                    <h2 style="margin-top:20px;">Đang chuẩn bị...</h2>
                </div>
            `;
        }

        const images = marker.imageUrls || [];
        const currentImg = images[state.loadingImageIndex] || '';
        const isReady = state.status === 'LOADED';

        return `
            <div class="fps-loading-container">
                <div class="fps-marker-preview">
                    <div class="fps-marker-visual">
                        <div class="fps-marker-frame">
                            <img src="${currentImg}" alt="${marker.name}" onerror="this.src='https://files.catbox.moe/0jb1u0.png'">
                            ${images.length > 1 ? `
                                <div class="fps-img-nav">
                                    <div class="fps-img-nav-btn" id="fps-img-prev" title="Ảnh trước">❮</div>
                                    <div class="fps-img-nav-btn" id="fps-img-next" title="Ảnh sau">❯</div>
                                </div>
                                <div class="fps-img-dots">
                                    ${images.map((_, i) => `<div class="fps-img-dot ${i === state.loadingImageIndex ? 'active' : ''}"></div>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="fps-marker-details">
                        <div class="fps-marker-header">
                            <h2 class="fps-marker-name">${marker.name}</h2>
                            <span class="fps-marker-group">${marker.group || 'Địa điểm'}</span>
                        </div>
                        <div class="fps-marker-desc">${marker.description}</div>
                    </div>
                </div>
                
                <div class="fps-loading-footer">
                    <div class="fps-marker-pagination">
                        <button class="fps-p-btn" id="fps-marker-prev">◀ Địa điểm trước</button>
                        <button class="fps-p-btn" id="fps-marker-next">Địa điểm sau ▶</button>
                    </div>
                    
                    <div class="fps-status-indicator">
                        ${isReady ? `
                            <button class="fps-ready-btn" id="fps-btn-ready">VÀO CỬA HÀNG</button>
                        ` : `
                            <span class="fps-status-text fps-pulse">Đang truy xuất dữ liệu hệ thống...</span>
                            <div class="fps-spinner" style="width:24px; height:24px; border-width:2px;"></div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    function renderLoadedState() {
        const categoriesHtml = CATEGORIES.map(cat => `
            <div class="fps-tab ${state.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                <span class="fps-tab-icon">${cat.icon}</span>
                <span>${cat.label}</span>
            </div>
        `).join('');

        const currentItems = state.items[state.activeCategory] || [];
        const itemsHtml = currentItems.length ? currentItems.map((item, idx) => {
            const rarity = RARITY_MAP[item.rarity] || { color: '#9ca3af', label: item.rarity };
            const isSelected = state.selectedItem === item;
            const tags = getItemTags(item);
            return `
                <div class="fps-card ${isSelected ? 'selected' : ''}" 
                     data-idx="${idx}" 
                     style="--rarity-color: ${rarity.color}">
                    <div class="fps-card-glow"></div>
                    <div class="fps-card-top">
                        <div class="fps-card-kind">${item.type || 'Chưa phân loại'}</div>
                        <div class="fps-card-rarity">
                            <span class="fps-rarity" style="color:${rarity.color}; background:${rarity.color}14;">${rarity.label}</span>
                        </div>
                    </div>
                    <div class="fps-card-name">${item.name || 'Vật phẩm chưa định danh'}</div>
                    <div class="fps-card-meta">${item.description || 'Không có mô tả cho vật phẩm này.'}</div>
                    ${tags.length ? `<div class="fps-card-tags">${tags.map(tag => `<span class="fps-chip">${tag}</span>`).join('')}</div>` : ''}
                    <div class="fps-card-footer">
                        <div class="fps-card-price-wrap">
                            <div class="fps-card-price-label">Giá vật phẩm</div>
                            <div class="fps-card-price">${item.cost ?? 0} FP</div>
                        </div>
                        <div class="fps-card-kind">Xem chi tiết</div>
                    </div>
                </div>
            `;
        }).join('') : `<div class="fps-grid-empty">Không có vật phẩm nào trong mục này.</div>`;

        const detail = state.selectedItem;
        const detailHtml = renderDetailContent(detail);

        return `
            <div class="fps-content">
                <div class="fps-left">
                    <div class="fps-tabs">${categoriesHtml}</div>
                    <div class="fps-grid-container">
                        <div class="fps-grid">${itemsHtml}</div>
                    </div>
                    <div class="fps-input-wrap">
                        <input class="fps-input" id="fps-search-input" placeholder="Tìm vật phẩm..." />
                        <button class="fps-send-btn" id="fps-btn-send">GỬI</button>
                    </div>
                </div>
                <div class="fps-right">
                    <div class="fps-fp-bar">
                        <div class="fps-info-tile">
                            <span class="fps-info-label">Vận mệnh điểm</span>
                            <span class="fps-info-value">${getFPBalance()} FP</span>
                        </div>
                        <div class="fps-info-tile">
                            <span class="fps-info-label">Giai vị sinh mệnh</span>
                            <span class="fps-info-value fps-info-value-subtle">${state.userLifeTier || 'Chưa rõ'}</span>
                        </div>
                    </div>
                    <div class="fps-detail">
                        ${detailHtml}
                    </div>
                    <div class="fps-buy-footer">
                        <button class="fps-buy-btn" id="fps-btn-buy" ${!detail || state.fpBalance < detail.cost ? 'disabled' : ''}>
                            ${detail ? (state.fpBalance >= detail.cost ? 'MUA VẬT PHẨM' : 'KHÔNG ĐỦ FP') : 'CHỌN VẬT PHẨM'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ============ Phase 2: AI & Lorebook Logic ============

    async function fetchLorebookContext() {
        try {
            const _getST = () => typeof window !== 'undefined' && window.SillyTavern ? window.SillyTavern : (window.parent && window.parent.SillyTavern);
            const _getTH = () => typeof window !== 'undefined' && window.TavernHelper ? window.TavernHelper : (window.parent && window.parent.TavernHelper);

            const ST = _getST();
            const TH = _getTH();
            const lorebookName = await TH.getCurrentCharPrimaryLorebook();
            const stContext = await TH.getWorldbook(lorebookName);
            const allEntries = stContext; // Hỗ trợ cả trường hợp trả về object hoặc mảng entries

            if (!allEntries) {
                console.warn('[FPShopBubble] Không thể lấy entries từ Worldbook - Tên:', lorebookName);
                return null;
            }

            let contextParts = [];

            // Chuyển allEntries sang mảng (robust check cho cả object UID-map và mảng cross-origin)
            const entriesList = Array.isArray(allEntries)
                ? allEntries
                : (allEntries && typeof allEntries === 'object' ? Object.values(allEntries) : []);

            // 1. Luôn tải bối cảnh từ SHOP_CONFIG.LOREBOOK_ENTRIES
            const entriesNames = SHOP_CONFIG.LOREBOOK_ENTRIES || [];
            const worldContext = entriesNames.map(name => {
                const entry = entriesList.find(e => matchKeyword(e, name) && e.enabled === true);
                if (entry) {
                    //console.log('[FPShopBubble] Khớp Lorebook (Active):', name);
                    return `### ${name}:\n${entry.content}`;
                }
                return '';
            }).filter(c => c !== '').join('\n\n');

            if (worldContext) {
                contextParts.push(worldContext);
            }

            // 2. Luôn tải bối cảnh Hệ Thống (Persona)
            const searchKeyword = SHOP_CONFIG.SYSTEM_ENTRY_KEYWORD || "Hệ Thống Vận Mệnh";
            const systemEntry = entriesList.find(e =>
                ((e.name || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    (e.comment || '').toLowerCase().includes(searchKeyword.toLowerCase())) &&
                e.enabled === true
            );

            if (systemEntry) {
                contextParts.push(`<System_Personality>### Hệ Thống Vận Mệnh Context:\n${systemEntry.content}\n</System_Personality>`);
            } else {
                console.warn('[FPShopBubble] Cảnh báo: Không tìm thấy Lorebook entry "' + searchKeyword + '" đang được kích hoạt (enabled).');
            }

            return contextParts.join('\n\n------------------\n\n') || null;
        } catch (e) {
            console.error('[FPShopBubble] fetchLorebookContext error:', e);
            return null;
        }
    }

    async function callAI(userInput = '') {
        if (!window.parent.ApiConfigManager) {
            window.parent.toastr?.error('Chưa cấu hình API. Vui lòng kiểm tra API Config Bubble.');
            return;
        }

        const context = await fetchLorebookContext();
        const counts = SHOP_CONFIG.COUNTS;
        let rule = '';

        const dist = calculateRarityDist(getUserLifeTier());
        const distText = Object.entries(dist).map(([name, prob]) => `- ${name}: ${prob}`).join('\n');

        const priceRules = `
Bắt buộc định giá vật phẩm (cost) theo phẩm chất:
- Thông Thường: 10 - 150 FP
- Ưu Tú: 200 - 500 FP
- Hiếm: 500 - 2500 FP
- Sử Thi: 2500 - 5000 FP
- Truyền Thuyết: 5000 - 50000 FP
- Thần Thoại: 50000 - 150000 FP
- Độc Nhất: 1 - 1,000,000 FP (Tự đánh giá: Độc Nhất không đồng nghĩa với mạnh hơn Thần Thoại, hãy đưa ra giá hợp lý dựa trên tính độc bản và quyền năng thực tế).`;

        rule = `<System_Core>
Bạn là "Hệ Thống Vận Mệnh" đang vận hành một cửa hàng huyền bí.
Dựa trên kiến thức từ <Lore>, hãy xác định tính cách cốt lõi hiện tại của mình (Ví dụ: Dịu dàng, Cay nghiệt, Bí ẩn, Trào phúng...).

1. Tính cách & Phản ứng:
   - Trước khi tạo vật phẩm, hãy thực hiện một bước suy luận Chain of Thought (COT) để phân tích bối cảnh và định hình tính cách/phản ứng của bạn trong phần <System_Personality>.
   - Bọc phần suy luận này trong tag <thinking_personality>.

2. Yêu cầu vật phẩm:
   - Tạo: ${counts.EQUIPMENT} Trang Bị, ${counts.ITEMS} Vật Phẩm, ${counts.SKILLS} Kỹ Năng, và ${counts.SYSTEM || 5} vật phẩm đặc biệt cho mục "Gói Đồ Riêng".
   - Mục "Gói Đồ Riêng" phải chứa những thứ độc bản, mang dấu ấn tính cách của hệ thống. Tùy theo tính cách hệ thống mà nhóm vật phẩm sẽ khác nhau.
   - Mỗi vật phẩm PHẢI có trường "comment" (đánh giá): đây không chỉ là mô tả khô mà là lời đánh giá từ vị thế của Hệ Thống.
   - Mục "Gói Đồ Riêng" luôn luôn gợi ý 1 vật phẩm Thần Thoại có giá 1 FP, có hiệu ứng xứng đáng với cấp Thần Thoại nhưng luôn có 1 điểm yếu hoặc lời nguyền cực mạnh, rõ rệt và có tác dụng vĩnh viễn.

3. Quy mô & Phẩm chất:
   - Bắt buộc tuân thủ tỉ lệ phẩm chất:
${distText}
${priceRules}

4. Mô tả vật phẩm (Description):
   - KHÔNG chỉ liệt kê công dụng. Mỗi vật phẩm cần có một câu chuyện nguồn gốc hoặc chi tiết lore sâu sắc hoặc miêu tả bề ngoài chi tiết.
   - Độ dài phần mô tả phải đạt từ 100 đến 200 từ.
</System_Core>`;

        let lengthRule = 'Độ dài phần mô tả phải đạt từ 100 đến 300 ký tự.';
        let exampleDesc = 'Câu chuyện vừa phải...';

        if (state.selectedPromptLength === 'Short') {
            lengthRule = 'Độ dài phần mô tả phải đạt từ 50 đến 100 ký tự.';
            exampleDesc = 'Mô tả ngắn gọn...';
        } else if (state.selectedPromptLength === 'Moderate') {
            lengthRule = 'Độ dài phần mô tả phải đạt từ 100 đến 300 ký tự.';
            exampleDesc = 'Mô tả vừa phải...';
        } else if (state.selectedPromptLength === 'Full') {
            lengthRule = 'Độ dài phần mô tả phải đạt từ 100 đến 200 từ.';
            exampleDesc = 'Câu chuyện dài 100-200 từ...';
        }

        const prompt = `
<Lore>
${context || 'Không có dữ liệu bối cảnh.'}
</Lore>

${rule.replace('Độ dài phần mô tả phải đạt từ 100 đến 200 từ.', lengthRule)}

<rule_output>
Bắt buộc xuất ra đúng định dạng JSON, không kèm giải thích.
Giá (cost) nên cân đối theo quy tắc đã định.

CÁC KỴ QUAN TRỌNG:
1. KHÔNG phản hồi bằng văn bản hội thoại (VD: "đây là vật phẩm của bạn...").
2. KHÔNG đặt JSON trong khối code markdown (VD: \`\`\`json ... \`\`\`).
3. CHỈ TRẢ VỀ DUY NHẤT CHUỖI JSON HỢP LỆ sau khi đã thực hiện <thinking_personality>.
4. KHÔNG giải thích gì thêm sau khối JSON.
5. KHÔNG sử dụng ký tự xuống dòng thực tế bên trong các giá trị chuỗi. Sử dụng '\\n' để xuống dòng nếu cần.
</rule_output>

<OutputFormat>
{
  "Trang Bị": [ { "name": "", "cost": 0, "type": "", "tag": [], "rarity": "Hiếm", "effect": {}, "description": "${exampleDesc}", "comment": "Lời đánh giá..." } ],
  "Items": [ { "name": "", "cost": 0, "type": "", "tag": [], "rarity": "Hiếm", "quantity": 1, "effect": {}, "description": "${exampleDesc}", "comment": "Lời đánh giá..." } ],
  "Skills": [ { "name": "", "cost": 0, "tag": [], "type": "Chủ động", "rarity": "Hiếm", "effect": {}, "description": "${exampleDesc}", "comment": "Lời đánh giá..." } ],
  "Hệ Thống": [ { "name": "", "cost": 0, "type": "Trang bị/Vật phẩm/Kỹ năng", "tag": [], "rarity": "Độc Nhất", "effect": {}, "description": "${exampleDesc}", "comment": "Lời đánh giá..." } ]
}
</OutputFormat>

<user_input>
${userInput || 'Tạo vật phẩm ngẫu nhiên phù hợp bối cảnh.'}
</user_input>
        `;

        try {

            if (typeof window.parent.ApiConfigManager.callAPIParallel !== 'function') {
                throw new Error('ApiConfigManager.callAPIParallel không sẵn sàng');
            }

            const workerCount = Math.max(1, Math.min(5, parseInt(state.selectedWorkerCount, 10) || 1));
            const messages = [
                { role: 'system', content: 'You are a professional RPG item generator. Output valid JSON only. Never include text before or after the JSON. Never use real line breaks inside string values.' },
                { role: 'user', content: prompt }
            ];
            const tasks = Array.from({ length: workerCount }, function () {
                return { messages: messages };
            });

            const parallelResult = await window.parent.ApiConfigManager.callAPIParallel(tasks, {
                maxWorkers: workerCount,
                allowPartialSuccess: true
            });

            const rawResults = Array.isArray(parallelResult) ? parallelResult : (parallelResult.results || []);
            const apiErrors = Array.isArray(parallelResult && parallelResult.errors) ? parallelResult.errors : [];
            const workerPayloads = [];
            const workerErrors = apiErrors.map(function (entry) {
                return {
                    worker: (entry.index || 0) + 1,
                    message: entry.message || 'Unknown error'
                };
            });

            rawResults.forEach(function (response, index) {
                if (!response) return;

                try {
                    workerPayloads.push(parseWorkerPayload(response, index + 1));
                } catch (parseError) {
                    console.error('[FPShopBubble] Worker ' + (index + 1) + ' parse failed:', parseError);
                    workerErrors.push({
                        worker: index + 1,
                        message: parseError.message || 'JSON parse failed'
                    });
                }
            });

            if (!workerPayloads.length) {
                throw new Error('Tất cả Linh Phục đã gặp "tai nạn đáng tiếc" vui lòng thử lại');
            }

            const mergedData = mergeWorkerPayloads(workerPayloads);
            state.items.equipment = mergedData.equipment;
            state.items.items = mergedData.items;
            state.items.skills = mergedData.skills;
            state.items.system = mergedData.system;
            state.selectedItem = null;
            state.lastError = null;
            state.status = 'LOADED';

            const totalCount = state.items.equipment.length + state.items.items.length + state.items.skills.length + state.items.system.length;
            const successCount = workerPayloads.length;
            const failedCount = workerErrors.length;

            if (!state.isOpen) {
                state.hasCompletedWhileHidden = true;
                refreshBubbleRegistration();
            }

            window.parent.toastr?.success('Đã truy xuất ' + totalCount + ' vật phẩm từ ' + successCount + '/' + workerCount + ' worker');
            if (failedCount > 0) {
                window.parent.toastr?.warning('Có ' + failedCount + ' worker lỗi/timeout và đã bỏ qua.');
            }

            renderState();
        } catch (e) {
            console.error('[FPShopBubble] AI Call Error:', e);
            state.status = 'EMPTY';
            state.displayMode = 'MENU';
            state.lastError = e.message;
            window.parent.toastr?.error(e.message);
            renderState();
        }
    }

    // ============ Events Binding ============
    function bindEvents() {
        const panel = parentDocument.getElementById(PANEL_ID);
        if (!panel) return;

        // Prompt Length selector
        const lengthSelect = panel.querySelector('#fps-prompt-length');
        if (lengthSelect) {
            lengthSelect.onchange = (e) => {
                state.selectedPromptLength = e.target.value;

            };
        }
        const workerSelect = panel.querySelector('#fps-worker-count');
        if (workerSelect) {
            workerSelect.onchange = (e) => {
                const nextValue = parseInt(e.target.value, 10);
                state.selectedWorkerCount = Math.max(1, Math.min(5, nextValue || 1));
            };
        }

        // Tab switching
        panel.querySelectorAll('.fps-tab').forEach(el => {
            el.onclick = () => {
                state.activeCategory = el.dataset.cat;
                state.selectedItem = null;
                renderState();
            };
        });

        // Item selection
        panel.querySelectorAll('.fps-card').forEach(el => {
            el.onclick = () => {
                const idx = parseInt(el.dataset.idx);
                state.selectedItem = state.items[state.activeCategory][idx];
                renderState();
            };
        });

        // Fetch / Search logic
        const fetchBtn = panel.querySelector('#fps-btn-fetch');
        const sendBtn = panel.querySelector('#fps-btn-send');
        const searchInput = panel.querySelector('#fps-search-input');
        const guideToggle = panel.querySelector('#fps-guide-toggle');

        // Loading Screen Events
        const imgPrev = panel.querySelector('#fps-img-prev');
        const imgNext = panel.querySelector('#fps-img-next');
        const markerPrev = panel.querySelector('#fps-marker-prev');
        const markerNext = panel.querySelector('#fps-marker-next');
        const readyBtn = panel.querySelector('#fps-btn-ready');

        if (imgPrev) {
            imgPrev.onclick = () => {
                const marker = state.markers[state.loadingMarkerIndex];
                const count = marker?.imageUrls?.length || 0;
                state.loadingImageIndex = (state.loadingImageIndex - 1 + count) % count;
                renderState();
            };
        }
        if (imgNext) {
            imgNext.onclick = () => {
                const marker = state.markers[state.loadingMarkerIndex];
                const count = marker?.imageUrls?.length || 0;
                state.loadingImageIndex = (state.loadingImageIndex + 1) % count;
                renderState();
            };
        }
        if (markerPrev) {
            markerPrev.onclick = () => {
                const count = state.markers.length;
                state.loadingMarkerIndex = (state.loadingMarkerIndex - 1 + count) % count;
                state.loadingImageIndex = 0;
                renderState();
            };
        }
        if (markerNext) {
            markerNext.onclick = () => {
                const count = state.markers.length;
                state.loadingMarkerIndex = (state.loadingMarkerIndex + 1) % count;
                state.loadingImageIndex = 0;
                renderState();
            };
        }
        if (readyBtn) {
            readyBtn.onclick = () => {
                state.displayMode = 'SHOP_GRID';
                renderState();
            };
        }

        const doFetch = (input) => {
            if (state.status === 'LOADING') return;
            state.searchDraft = input || '';
            state.status = 'LOADING';
            state.displayMode = 'LOADING_SCREEN';

            // Random marker mỗi khi vào Loading State
            if (state.markers.length > 0) {
                state.loadingMarkerIndex = Math.floor(Math.random() * state.markers.length);
                state.loadingImageIndex = 0;
            }

            renderState();
            callAI(input);
        };

        if (fetchBtn) fetchBtn.onclick = () => doFetch('');
        if (sendBtn) sendBtn.onclick = () => doFetch(searchInput?.value || '');
        if (guideToggle) {
            guideToggle.onclick = () => {
                state.searchDraft = searchInput?.value || '';
                state.isGuideExpanded = !state.isGuideExpanded;
                renderState();
            };
        }
        if (searchInput) {
            searchInput.oninput = () => {
                state.searchDraft = searchInput.value;
            };
            searchInput.onkeydown = (e) => {
                if (e.key === 'Enter') doFetch(searchInput.value);
            };
        }

        // Buy button
        const buyBtn = panel.querySelector('#fps-btn-buy');
        if (buyBtn && !buyBtn.disabled) {
            buyBtn.onclick = () => {
                purchaseItem(state.selectedItem);
            };
        }
    }

    // ============ Core Actions ============
    function togglePanel() {
        if (!state.isOpen) {
            if (state.hasCompletedWhileHidden) {
                state.hasCompletedWhileHidden = false;
                if (window.parent.FloatingMenuManager) {
                    window.parent.FloatingMenuManager.updateNotification(BUBBLE_ID, false);
                }
                refreshBubbleRegistration();
            }

            createPanel();
            state.isOpen = true;
            getFPBalance();

            // Chỉnh displayMode khớp với status hiện tại
            if (state.status === 'EMPTY') state.displayMode = 'MENU';
            else if (state.status === 'LOADING') state.displayMode = 'LOADING_SCREEN';
            else if (state.status === 'LOADED') state.displayMode = 'SHOP_GRID';

            renderState();
            setTimeout(() => {
                parentDocument.getElementById(PANEL_ID + '-overlay')?.classList.add('show');
                parentDocument.getElementById(PANEL_ID)?.classList.add('show');
            }, 10);
        } else {
            const modal = parentDocument.getElementById(PANEL_ID);
            const overlay = parentDocument.getElementById(PANEL_ID + '-overlay');
            modal?.classList.remove('show');
            overlay?.classList.remove('show');
            state.isOpen = false;
            setTimeout(() => {
                modal?.remove();
                overlay?.remove();
            }, 350);
        }
    }

    function purchaseItem(item) {
        if (!item) return;

        try {
            const text = '【Mua ' + item.name +
                ' \| Loại: ' + item.type +
                ' \| Giá: ' + item.cost + ' Điểm Vận Mệnh' +
                ' \| Độ hiếm: ' + item.rarity +
                ' \| Tags: ' + (item.tag ? item.tag.join(', ') : '') +
                ' \| Hiệu ứng: ' + JSON.stringify(item.effect) +
                ' \| Mô tả: ' + item.description +
                ' \】 Từ Cửa Hàng Vận Mệnh\n';

            const input = window.parent.document.querySelector('#send_textarea');
            if (input) {
                const cur = input.value.trim();
                input.value = cur ? cur + '\n' + text : text;

                // Cập nhật UI của SillyTavern nếu cần
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
            }

            // Trigger Slash Runner (Bỏ qua /setinput để tránh lỗi Parser làm mất ký tự đặc biệt)
            /*
            const _triggerSlash = window.triggerSlash || (window.parent && window.parent.triggerSlash);
            const scriptRunnerInput = window.parent.document.querySelector('#send_textarea');

            if (typeof _triggerSlash === 'function') {
                _triggerSlash('/setinput ' + scriptRunnerInput.value);
            } else if (window.parent.SillyTavern?.getContext) {
                const ctx = window.parent.SillyTavern.getContext();
                if (ctx.executeSlashCommands) {
                    ctx.executeSlashCommands('/setinput ' + scriptRunnerInput.value);
                }
            }
            */

            if (window.parent.toastr) {
                window.parent.toastr.success('Đã gửi yêu cầu mua ' + item.name);
            }

            // Không tự động tắt Panel nữa theo yêu cầu người dùng
            // togglePanel();

            // Cập nhật lại số dư FP và làm mới giao diện
            getFPBalance();
            renderState();
        } catch (e) {
            console.error('[FPShopBubble] Lỗi mua hàng:', e);
        }
    }

    function buildBubbleIconHtml() {
        return '<div style="position:relative; width:24px; height:24px; display:flex; align-items:center; justify-content:center;">' +
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:white"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
            '</div>';
    }

    function buildBubbleConfig() {
        return {
            id: BUBBLE_ID,
            icon: buildBubbleIconHtml(),
            label: 'Cửa hàng FP',
            onClick: function () { togglePanel(); },
            color: 'linear-gradient(135deg, #f0b232 0%, #e67e22 100%)',
            order: 3
        };
    }

    function refreshBubbleRegistration() {
        if (!window.parent.FloatingMenuManager) return false;
        try {
            const config = buildBubbleConfig();
            window.parent.FloatingMenuManager.registerButton(config);
            // Đồng bộ trạng thái thông báo
            window.parent.FloatingMenuManager.updateNotification(BUBBLE_ID, state.hasCompletedWhileHidden);
            return true;
        } catch (e) {
            console.warn('[FPShopBubble] Cập nhật bubble thất bại:', e);
            return false;
        }
    }

    // ============ Đăng ký Bubble ============
    function _tryRegister() {
        if (!window.parent.FloatingMenuManager) return false;
        try {
            window.parent.FloatingMenuManager.registerButton(buildBubbleConfig());
            console.log('[FPShopBubble] Đã đăng ký thành công');
            return true;
        } catch (e) {
            console.warn('[FPShopBubble] Đăng ký thất bại:', e);
            return false;
        }
    }

    // ============ Khởi tạo ============
    async function init() {
        injectStyles();
        await loadMarkers();

        // Thử đăng ký ngay hoặc đợi FMM
        if (!_tryRegister()) {
            const retryTimer = setInterval(() => {
                if (_tryRegister()) clearInterval(retryTimer);
            }, 500);
        }
    }

    // Global Manager
    window.parent.FPShopManager = {
        toggle: togglePanel,
        refreshFP: getFPBalance,
        state: state
    };

    init();

    // Cleanup
    $(window).on('pagehide', function () {
        if (window.parent.FloatingMenuManager) {
            window.parent.FloatingMenuManager.unregisterButton(BUBBLE_ID);
        }
        const style = parentDocument.getElementById(STYLE_ID);
        if (style) style.remove();
    });

})();
