/**
 * Trình quản lý menu bóng nổi - Quản lý thống nhất nhiều chức năng bóng nổi
 *
 * Chức năng:
 * - Tạo bóng nổi chính (nút menu)
 * - Quản lý bóng nổi phụ (bóng chức năng)
 * - Hiệu ứng mở/đóng
 * - Hỗ trợ kéo thả
 * - Lưu vị trí (persistence)
 *
 * Cách sử dụng:
 * 1. Tải script này
 * 2. Gọi FloatingMenuManager.init()
 * 3. Sử dụng FloatingMenuManager.registerButton() để đăng ký bóng chức năng
 */

(function () {
    'use strict';

    console.log('[FloatingMenuManager] Script bắt đầu tải...');

    // ============ Lấy document của trang cha ============
    const parentDocument = window.parent.document;

    // ============ Hằng số cấu hình ============
    const CONFIG = {
        MAIN_SIZE: 56,           // Kích thước bóng chính
        SUB_SIZE: 48,            // Kích thước bóng phụ
        SUB_SPACING: 60,         // Khoảng cách bóng phụ
        DRAG_THRESHOLD: 5,       // Ngưỡng kéo thả (px)
        ANIMATION_DURATION: 300, // Thời lượng hiệu ứng (ms)
        Z_INDEX_MAIN: 10000,     // Layer bóng chính
        Z_INDEX_SUB: 9999,       // Layer bóng phụ
        STORAGE_KEY: 'floatingMenuManager_state'
    };

    // ============ Biểu tượng SVG ============
    const ICONS = {
        // Biểu tượng ba gạch ngang (Trạng thái đóng)
        menu: `<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
        </svg>`,
        // Biểu tượng mũi tên xuống (Trạng thái mở)
        chevronDown: `<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>`
    };

    // ============ Trạng thái toàn cục ============
    const state = {
        isExpanded: false,       // Trạng thái mở
        isDragging: false,       // Trạng thái kéo thả
        hasMoved: false,         // Đã di chuyển chưa
        buttons: [],             // Cấu hình nút đã đăng ký
        elements: {              // Tham chiếu phần tử DOM
            main: null,          // Bóng nổi chính
            subContainer: null,  // Container bóng phụ
            subs: []             // Mảng bóng phụ
        },
        notifications: {},       // Trạng thái thông báo { id: boolean }
        dragData: {              // Dữ liệu kéo thả
            startX: 0,
            startY: 0,
            initialBottom: 0,
            initialRight: 0
        },
        position: {              // Vị trí (sử dụng định vị top/left)
            top: 100,
            left: 20
        }
    };

    // ============ Chèn style ============
    function injectStyles() {
        if (parentDocument.getElementById('floating-menu-manager-styles')) return;

        const styles = `
<style id="floating-menu-manager-styles">
/* Bóng nổi chính */
.fmm-main-fab {
    position: fixed;
    width: ${CONFIG.MAIN_SIZE}px;
    height: ${CONFIG.MAIN_SIZE}px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4B5563 0%, #374151 100%);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: ${CONFIG.Z_INDEX_MAIN};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    user-select: none;
    -webkit-user-select: none;
    color: white;
}

.fmm-main-fab:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0,0,0,0.4);
}

.fmm-main-fab:active {
    transform: scale(0.95);
}

.fmm-main-fab.dragging {
    cursor: move;
    transform: scale(1.05);
}

.fmm-main-fab .icon {
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fmm-main-fab.expanded .icon {
    transform: rotate(180deg);
}

/* Container bóng phụ */
.fmm-sub-container {
    position: fixed;
    z-index: ${CONFIG.Z_INDEX_SUB};
    pointer-events: none;
}

/* Bóng nổi phụ */
.fmm-sub-fab {
    position: absolute;
    width: ${CONFIG.SUB_SIZE}px;
    height: ${CONFIG.SUB_SIZE}px;
    border-radius: 50%;
    box-shadow: 0 3px 15px rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    user-select: none;
    -webkit-user-select: none;
    pointer-events: auto;
    opacity: 0;
    transform: scale(0);
}

.fmm-sub-fab:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.35);
}

.fmm-sub-fab:active {
    transform: scale(0.9);
}

/* Hiệu ứng mở */
@keyframes fmmExpandBall {
    0% {
        opacity: 0;
        transform: translateY(0) scale(0);
    }
    100% {
        opacity: 1;
        transform: translateY(var(--offset)) scale(1);
    }
}

/* Hiệu ứng đóng */
@keyframes fmmCollapseBall {
    0% {
        opacity: 1;
        transform: translateY(var(--offset)) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(0) scale(0);
    }
}

.fmm-sub-fab.expanding {
    animation: fmmExpandBall ${CONFIG.ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.fmm-sub-fab.collapsing {
    animation: fmmCollapseBall ${CONFIG.ANIMATION_DURATION}ms ease-in forwards;
}

/* Badge thông báo */
.fmm-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: #ef4444;
    border: 2px solid white;
    border-radius: 50%;
    z-index: 2;
    display: none;
    box-shadow: 0 0 5px rgba(239, 68, 68, 0.6);
}

.fmm-badge.show {
    display: block;
}

.fmm-main-fab .fmm-badge {
    width: 14px;
    height: 14px;
    top: 4px;
    right: 4px;
}
</style>
        `;

        parentDocument.head.insertAdjacentHTML('beforeend', styles);
    }

    // ============ Tạo bóng nổi chính ============
    function createMainFab() {
        const fab = parentDocument.createElement('div');
        fab.className = 'fmm-main-fab';
        fab.innerHTML = `
            <div class="icon">${ICONS.menu}</div>
            <div class="fmm-badge" id="fmm-main-badge"></div>
        `;

        // Cài đặt vị trí ban đầu
        fab.style.top = state.position.top + 'px';
        fab.style.left = state.position.left + 'px';

        parentDocument.body.appendChild(fab);
        state.elements.main = fab;

        // Ràng buộc sự kiện
        bindMainFabEvents(fab);

        return fab;
    }

    // ============ Tạo container bóng phụ ============
    function createSubContainer() {
        const container = parentDocument.createElement('div');
        container.className = 'fmm-sub-container';
        parentDocument.body.appendChild(container);
        state.elements.subContainer = container;
        return container;
    }

    // ============ Cập nhật vị trí container bóng phụ ============
    function updateSubContainerPosition() {
        if (!state.elements.main || !state.elements.subContainer) return;

        const container = state.elements.subContainer;

        // Vị trí container bóng phụ căn chỉnh với bóng chính
        container.style.top = state.position.top + 'px';
        container.style.left = state.position.left + 'px';
        container.style.width = CONFIG.SUB_SIZE + 'px';
        container.style.height = (state.buttons.length * CONFIG.SUB_SPACING) + 'px';
    }

    // ============ Tạo bóng nổi phụ ============
    function createSubFab(config, index) {
        const fab = parentDocument.createElement('div');
        fab.className = 'fmm-sub-fab';
        fab.style.background = config.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        // Cài đặt nội dung biểu tượng
        if (typeof config.icon === 'string') {
            fab.innerHTML = config.icon;
        } else {
            fab.textContent = config.icon || '●';
        }

        // Thêm Badge nếu có thông báo
        const badge = parentDocument.createElement('div');
        badge.className = 'fmm-badge';
        if (state.notifications[config.id]) {
            badge.classList.add('show');
        }
        fab.appendChild(badge);

        // Cài đặt độ lệch vị trí
        const offset = -(index + 1) * CONFIG.SUB_SPACING;
        fab.style.setProperty('--offset', offset + 'px');
        fab.style.top = '0px';
        fab.style.left = '4px'; // Căn giữa ((56-48)/2 = 4px)

        // Ràng buộc sự kiện click
        fab.addEventListener('click', function (e) {
            e.stopPropagation();
            if (config.onClick && typeof config.onClick === 'function') {
                config.onClick();
            }
        });

        state.elements.subContainer.appendChild(fab);
        state.elements.subs.push(fab);

        return fab;
    }

    // ============ Render tất cả bóng phụ ============
    function renderSubFabs() {
        // Xóa bóng phụ hiện tại
        state.elements.subs.forEach(fab => fab.remove());
        state.elements.subs = [];

        // Tạo bóng phụ mới
        state.buttons.forEach((config, index) => {
            createSubFab(config, index);
        });

        updateSubContainerPosition();
    }

    // ============ Mở menu ============
    function expand() {
        if (state.isExpanded) return;
        state.isExpanded = true;

        // Cập nhật biểu tượng bóng chính
        const icon = state.elements.main.querySelector('.icon');
        icon.innerHTML = ICONS.chevronDown;
        state.elements.main.classList.add('expanded');

        // Mở bóng phụ
        state.elements.subs.forEach((fab, index) => {
            fab.classList.remove('collapsing');
            fab.classList.add('expanding');

            // Hiển thị có độ trễ, tạo hiệu ứng xếp tầng
            setTimeout(() => {
                fab.style.opacity = '1';
                fab.style.transform = `translateY(${-(index + 1) * CONFIG.SUB_SPACING}px) scale(1)`;
            }, index * 50);
        });
    }

    // ============ Đóng menu ============
    function collapse() {
        if (!state.isExpanded) return;
        state.isExpanded = false;

        // Cập nhật biểu tượng bóng chính
        const icon = state.elements.main.querySelector('.icon');
        icon.innerHTML = ICONS.menu;
        state.elements.main.classList.remove('expanded');

        // Đóng bóng phụ
        state.elements.subs.forEach((fab, index) => {
            fab.classList.remove('expanding');
            fab.classList.add('collapsing');

            setTimeout(() => {
                fab.style.opacity = '0';
                fab.style.transform = 'translateY(0) scale(0)';
            }, index * 30);
        });
    }

    // ============ Chuyển đổi mở/đóng ============
    function toggle() {
        if (state.isExpanded) {
            collapse();
        } else {
            expand();
        }
    }

    // ============ Sự kiện kéo thả bóng chính ============
    function bindMainFabEvents(fab) {
        let rafId = null;

        function handleStart(e) {
            const touch = e.touches ? e.touches[0] : e;
            state.isDragging = true;
            state.hasMoved = false;
            state.dragData.startX = touch.clientX;
            state.dragData.startY = touch.clientY;

            const rect = fab.getBoundingClientRect();
            state.dragData.initialTop = rect.top;
            state.dragData.initialLeft = rect.left;

            fab.classList.add('dragging');
            e.preventDefault();
        }

        function handleMove(e) {
            if (!state.isDragging) return;

            const touch = e.touches ? e.touches[0] : e;
            const deltaX = touch.clientX - state.dragData.startX;
            const deltaY = touch.clientY - state.dragData.startY;

            // Kiểm tra xem có di chuyển không
            if (Math.abs(deltaX) > CONFIG.DRAG_THRESHOLD || Math.abs(deltaY) > CONFIG.DRAG_THRESHOLD) {
                state.hasMoved = true;
            }

            // Sử dụng RAF tối ưu hiệu suất
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const newLeft = Math.max(0, Math.min(
                    state.dragData.initialLeft + deltaX,
                    window.parent.innerWidth - CONFIG.MAIN_SIZE
                ));
                const newTop = Math.max(0, Math.min(
                    state.dragData.initialTop + deltaY,
                    window.parent.innerHeight - CONFIG.MAIN_SIZE
                ));

                state.position.left = newLeft;
                state.position.top = newTop;

                fab.style.left = newLeft + 'px';
                fab.style.top = newTop + 'px';

                // Cập nhật vị trí container bóng phụ
                updateSubContainerPosition();

                rafId = null;
            });

            e.preventDefault();
        }

        function handleEnd(e) {
            if (!state.isDragging) return;
            state.isDragging = false;
            fab.classList.remove('dragging');

            // Lưu vị trí
            savePosition();

            // Nếu không di chuyển, coi như là click
            if (!state.hasMoved) {
                toggle();
            }

            state.hasMoved = false;
            e.preventDefault();
        }

        // Sự kiện chuột
        fab.addEventListener('mousedown', handleStart);
        parentDocument.addEventListener('mousemove', handleMove);
        parentDocument.addEventListener('mouseup', handleEnd);

        // Sự kiện chạm
        fab.addEventListener('touchstart', handleStart, { passive: false });
        parentDocument.addEventListener('touchmove', handleMove, { passive: false });
        parentDocument.addEventListener('touchend', handleEnd, { passive: false });
    }

    // ============ Lưu vị trí (persistence) ============
    function savePosition() {
        try {
            const data = {
                top: state.position.top,
                left: state.position.left,
                isExpanded: state.isExpanded
            };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('[FloatingMenuManager] Lưu vị trí thất bại:', e);
        }
    }

    function loadPosition() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                state.position.top = data.top || 100;
                state.position.left = data.left || 20;
                // Không khôi phục trạng thái mở, luôn bắt đầu từ trạng thái đóng
            }
        } catch (e) {
            console.error('[FloatingMenuManager] Tải vị trí thất bại:', e);
        }
    }

    // ============ Điều chỉnh vị trí vào vùng nhìn thấy ============
    function adjustPositionToViewport() {
        if (!state.elements.main) return;

        const maxLeft = window.parent.innerWidth - CONFIG.MAIN_SIZE;
        const maxTop = window.parent.innerHeight - CONFIG.MAIN_SIZE;

        // Đảm bảo bóng nổi nằm trong vùng nhìn thấy
        let adjusted = false;

        if (state.position.left > maxLeft) {
            state.position.left = Math.max(0, maxLeft);
            adjusted = true;
        }

        if (state.position.top > maxTop) {
            state.position.top = Math.max(0, maxTop);
            adjusted = true;
        }

        if (state.position.left < 0) {
            state.position.left = 0;
            adjusted = true;
        }

        if (state.position.top < 0) {
            state.position.top = 0;
            adjusted = true;
        }

        // Nếu vị trí bị điều chỉnh, cập nhật DOM và lưu lại
        if (adjusted) {
            state.elements.main.style.left = state.position.left + 'px';
            state.elements.main.style.top = state.position.top + 'px';
            updateSubContainerPosition();
            savePosition();
        }
    }

    // ============ Lắng nghe thay đổi kích thước cửa sổ ============
    function bindWindowResize() {
        let resizeTimer = null;
        window.parent.addEventListener('resize', function () {
            // Sử dụng debounce, tránh điều chỉnh liên tục
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                adjustPositionToViewport();
                resizeTimer = null;
            }, 100);
        });
    }

    // ============ API công khai ============
    const FloatingMenuManager = {
        /**
         * Đăng ký nút phụ
         * @param {Object} config - Cấu hình nút
         * @param {string} config.id - ID duy nhất của nút
         * @param {string|HTMLElement} config.icon - Biểu tượng (có thể là emoji, chuỗi SVG hoặc HTML)
         * @param {string} config.label - Nhãn nút (dùng để debug)
         * @param {Function} config.onClick - Hàm callback khi click
         * @param {string} config.color - Màu nền gradient
         * @param {number} config.order - Thứ tự sắp xếp (tùy chọn, mặc định theo thứ tự đăng ký)
         */
        registerButton: function (config) {
            if (!config || !config.id) {
                console.error('[FloatingMenuManager] Đăng ký thất bại: thiếu tham số bắt buộc id');
                return false;
            }

            // Kiểm tra xem đã đăng ký chưa
            const existingIndex = state.buttons.findIndex(btn => btn.id === config.id);
            if (existingIndex !== -1) {
                console.warn('[FloatingMenuManager] Nút đã tồn tại, sẽ cập nhật cấu hình:', config.id);
                state.buttons[existingIndex] = config;
            } else {
                state.buttons.push(config);
            }

            // Sắp xếp theo order
            state.buttons.sort((a, b) => (a.order || 99) - (b.order || 99));

            // Render lại bóng phụ
            if (state.elements.subContainer) {
                renderSubFabs();
            }

            console.log('[FloatingMenuManager] Đăng ký thành công:', config.id);
            return true;
        },

        /**
         * Hủy đăng ký nút
         * @param {string} id - ID nút
         */
        unregisterButton: function (id) {
            const index = state.buttons.findIndex(btn => btn.id === id);
            if (index !== -1) {
                state.buttons.splice(index, 1);
                if (state.elements.subContainer) {
                    renderSubFabs();
                }
                console.log('[FloatingMenuManager] Hủy đăng ký:', id);
                return true;
            }
            return false;
        },

        /**
         * Mở menu
         */
        expand: function () {
            expand();
        },

        /**
         * Đóng menu
         */
        collapse: function () {
            collapse();
        },

        /**
         * Chuyển đổi mở/đóng
         */
        toggle: function () {
            toggle();
        },

        /**
         * Cập nhật trạng thái thông báo cho một nút
         * @param {string} id - ID nút
         * @param {boolean} hasNotify - Trạng thái có thông báo hay không
         */
        updateNotification: function (id, hasNotify) {
            state.notifications[id] = !!hasNotify;

            // Cập nhật Badge trên bóng phụ nếu đang hiển thị
            state.buttons.forEach((btn, index) => {
                if (btn.id === id && state.elements.subs[index]) {
                    const badge = state.elements.subs[index].querySelector('.fmm-badge');
                    if (badge) {
                        badge.classList.toggle('show', !!hasNotify);
                    }
                }
            });

            // Cập nhật Badge trên bóng chính
            const hasAnyNotify = Object.values(state.notifications).some(v => v === true);
            const mainBadge = parentDocument.getElementById('fmm-main-badge');
            if (mainBadge) {
                mainBadge.classList.toggle('show', hasAnyNotify);
            }

            console.log('[FloatingMenuManager] Cập nhật thông báo:', id, hasNotify);
        },

        /**
         * Khởi tạo trình quản lý
         */
        init: function () {
            console.log('[FloatingMenuManager] Đang khởi tạo...');

            // Dọn dẹp instance cũ
            this.destroy();

            // Tải vị trí đã lưu
            loadPosition();

            // Chèn style
            injectStyles();

            // Tạo bóng nổi chính
            createMainFab();

            // Tạo container bóng phụ
            createSubContainer();

            // Xử lý hàng đợi chờ đăng ký khi module tải trước FMM
            var pending = window.parent._fmmPendingRegistrations;
            if (pending && pending.length) {
                pending.forEach(function (config) {
                    FloatingMenuManager.registerButton(config);
                });
                window.parent._fmmPendingRegistrations = [];
                console.log('[FloatingMenuManager] Đã xử lý ' + pending.length + ' nút chờ đăng ký');
            }

            // Render bóng phụ đã đăng ký
            renderSubFabs();

            // Điều chỉnh vị trí vào vùng nhìn thấy
            adjustPositionToViewport();

            // Ràng buộc lắng nghe thay đổi kích thước cửa sổ
            bindWindowResize();

            console.log('[FloatingMenuManager] Khởi tạo hoàn tất');
        },

        /**
         * Hủy trình quản lý
         */
        destroy: function () {
            // Xóa phần tử DOM (qua tham chiếu state)
            if (state.elements.main) {
                state.elements.main.remove();
                state.elements.main = null;
            }
            if (state.elements.subContainer) {
                state.elements.subContainer.remove();
                state.elements.subContainer = null;
            }

            // Dọn dẹp phần tử mồ côi thông qua selector (state cũ đã mất khi chạy lại script)
            parentDocument.querySelectorAll('.fmm-main-fab').forEach(function (el) { el.remove(); });
            parentDocument.querySelectorAll('.fmm-sub-container').forEach(function (el) { el.remove(); });

            // Xóa style đã chèn
            const styles = parentDocument.getElementById('floating-menu-manager-styles');
            if (styles) styles.remove();

            // Xóa mảng bóng phụ
            state.elements.subs = [];

            // Xóa nút đã đăng ký
            state.buttons = [];

            // Đặt lại trạng thái
            state.isExpanded = false;
            state.isDragging = false;
            state.hasMoved = false;

            console.log('[FloatingMenuManager] Đã hủy');
        },

        /**
         * Lấy trạng thái hiện tại
         */
        getState: function () {
            return {
                isExpanded: state.isExpanded,
                buttonCount: state.buttons.length,
                position: { ...state.position }
            };
        },

        /**
         * Lấy danh sách nút đã đăng ký
         */
        getButtons: function () {
            return state.buttons.map(btn => ({
                id: btn.id,
                label: btn.label,
                order: btn.order
            }));
        }
    };

    // ============ Xuất ra global ============
    if (typeof window !== 'undefined') {
        window.parent.FloatingMenuManager = FloatingMenuManager;
        console.log('[FloatingMenuManager] Đã tải vào window.parent.FloatingMenuManager');
    }

    // ============ Tự động khởi tạo ============
    if (parentDocument.readyState === 'loading') {
        parentDocument.addEventListener('DOMContentLoaded', function () {
            FloatingMenuManager.init();
        });
    } else {
        FloatingMenuManager.init();
    }

    // ============ Tự động dọn dẹp ============
    $(window).on('pagehide', function () {
        console.log('[FloatingMenuManager] Gỡ cài đặt script, thực hiện dọn dẹp...');
        FloatingMenuManager.destroy();
    });

})();