/**
 * API Config Bubble - Bóng nổi cài đặt API độc lập
 *
 * Chức năng:
 * - Đăng ký bóng nổi vào FloatingMenuManager
 * - Popup modal glassmorphism để cài đặt API
 * - Storage riêng biệt (localStorage)
 * - Export global: window.parent.ApiConfigManager
 *
 * Cách dùng từ module khác:
 *   var config = window.parent.ApiConfigManager.getConfig();
 *   // config = { provider, apiUrl, apiKey, model, maxTokens, temperature }
 *
 *   var result = await window.parent.ApiConfigManager.callAPI(messages, options);
 *   var parallelResults = await window.parent.ApiConfigManager.callAPIParallel(tasks, options);
 */

(function () {
    'use strict';

    console.log('[ApiConfigBubble] Script bắt đầu tải...');

    // ============ Lấy document trang cha ============
    const parentDocument = window.parent.document;

    // ============ Hằng số ============
    const STORAGE_KEY = 'apiConfigBubble_settings';
    const STYLE_ID = 'api-config-bubble-styles';
    const MODAL_ID = 'api-config-modal';

    const DEFAULT_CONFIG = {
        provider: 'openai',
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        model: 'gpt-4o-mini',
        maxTokens: 65536,
        temperature: 0.1,
        timeout: 120,
        retries: 2,
        maxWorkers: 5,
        maxGlobalRetries: 2
    };

    const PROVIDERS = [
        { value: 'openai', label: 'Tương thích OpenAI' },
        { value: 'claude', label: 'Claude' },
        { value: 'deepseek', label: 'DeepSeek' }
    ];

    // ============ State ============
    let currentConfig = null;
    let isModalOpen = false;

    // ============ Hàm tiện ích ============
    function loadConfig() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                var parsed = JSON.parse(saved);
                currentConfig = Object.assign({}, DEFAULT_CONFIG, parsed);
            } else {
                currentConfig = Object.assign({}, DEFAULT_CONFIG);
            }
        } catch (e) {
            console.error('[ApiConfigBubble] Lỗi tải config:', e);
            currentConfig = Object.assign({}, DEFAULT_CONFIG);
        }
        return currentConfig;
    }

    function saveConfig(config) {
        currentConfig = Object.assign({}, currentConfig, config);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
            console.log('[ApiConfigBubble] Đã lưu config');
        } catch (e) {
            console.error('[ApiConfigBubble] Lỗi lưu config:', e);
        }
        return currentConfig;
    }

    function getConfig() {
        if (!currentConfig) loadConfig();
        return Object.assign({}, currentConfig);
    }

    // ============ Gọi API ============
    async function callAPI(messages, options) {
        options = options || {};
        var config = getConfig();

        if (!config.apiKey) {
            throw new Error('Chưa cấu hình API Key. Vui lòng mở cài đặt API để thiết lập.');
        }

        var apiUrl = (options.apiUrl || config.apiUrl || '').trim();
        while (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);

        if (!apiUrl.includes('/chat/completions')) {
            if (!apiUrl.includes('/v1')) apiUrl += '/v1/chat/completions';
            else apiUrl += '/chat/completions';
        }

        var maxRetries = config.retries !== undefined ? config.retries : 2;
        var timeoutSec = config.timeout !== undefined ? config.timeout : 60;
        var lastError = null;

        for (var attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeoutSec * 1000);

                var requestBody = {
                    model: options.model || config.model,
                    messages: messages,
                    max_tokens: options.maxTokens || config.maxTokens,
                    temperature: options.temperature !== undefined ? options.temperature : config.temperature,
                    stream: false
                };

                console.log('[ApiConfigBubble] ' + (attempt > 0 ? 'Thử lại lần ' + attempt + ': ' : 'Gọi API: ') + apiUrl);

                var response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + config.apiKey
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    var errorData = await response.text();
                    var errorMsg = 'HTTP ' + response.status;
                    try {
                        var parsedErr = JSON.parse(errorData);
                        if (parsedErr.error && parsedErr.error.message) {
                            errorMsg += ': ' + parsedErr.error.message;
                        }
                    } catch (e) {
                        errorMsg += ': ' + errorData.substring(0, 100);
                    }
                    throw new Error(errorMsg);
                }

                var data = await response.json();
                var choice = data.choices && data.choices[0];
                if (choice) {
                    if (choice.finish_reason) {
                        console.warn('[ApiConfigBubble] Finish Reason:', choice.finish_reason);
                        if (choice.finish_reason === 'length') {
                            console.error('[ApiConfigBubble] CẢNH BÁO: Phản hồi AI bị cắt ngắn (vượt quá maxTokens)!');
                        }
                    }
                    return choice.message ? choice.message.content : '';
                }
                return '';

            } catch (err) {
                lastError = err;
                console.error('[ApiConfigBubble] Lỗi attempt ' + attempt + ':', err.message);

                if (err.name === 'AbortError') {
                    lastError = new Error('Yêu cầu quá thời hạn (Timeout ' + timeoutSec + 's)');
                }

                // Nếu lỗi 401 (Auth) hoặc 404 (Không tồn tại) thì không cần thử lại
                if (err.message.includes('401') || err.message.includes('404')) break;

                // Nghỉ một chút trước khi thử lại (Backoff)
                if (attempt < maxRetries) {
                    await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
                }
            }
        }

        throw lastError || new Error('API Call Failed after ' + maxRetries + ' retries.');
    }

    function toPositiveInt(value, fallback) {
        var parsed = parseInt(value, 10);
        if (!Number.isFinite(parsed) || parsed < 1) return fallback;
        return parsed;
    }

    function toNonNegativeInt(value, fallback) {
        var parsed = parseInt(value, 10);
        if (!Number.isFinite(parsed) || parsed < 0) return fallback;
        return parsed;
    }

    function sleep(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    function normalizeParallelTask(task, index) {
        // Ho tro 2 dang input:
        // 1) task = [ {role, content}, ... ]
        // 2) task = { messages: [...], options: {...}, id?: any }
        if (Array.isArray(task)) {
            return {
                id: index,
                messages: task,
                options: {}
            };
        }

        if (task && typeof task === 'object' && Array.isArray(task.messages)) {
            return {
                id: task.id !== undefined ? task.id : index,
                messages: task.messages,
                options: (task.options && typeof task.options === 'object') ? task.options : {}
            };
        }

        throw new Error('Task #' + index + ' khong hop le. Can la "messages[]" hoac { messages, options }.');
    }

    function buildParallelError(failedIndexes, errorsByIndex, partialResults) {
        var err = new Error('Parallel API call failed cho ' + failedIndexes.length + ' task.');
        err.failedIndexes = failedIndexes.slice();
        err.errors = failedIndexes.map(function (idx) {
            return {
                index: idx,
                message: errorsByIndex[idx] ? (errorsByIndex[idx].message || String(errorsByIndex[idx])) : 'Unknown error'
            };
        });
        err.partialResults = partialResults.slice();
        return err;
    }

    // ============ Goi API song song bang worker pool ============
    async function callAPIParallel(tasks, options) {
        options = options || {};

        if (!Array.isArray(tasks)) {
            throw new Error('callAPIParallel yeu cau "tasks" la mot array.');
        }

        if (tasks.length === 0) return [];

        var config = getConfig();
        var normalizedTasks = tasks.map(function (task, index) {
            return normalizeParallelTask(task, index);
        });

        var maxWorkers = toPositiveInt(
            options.maxWorkers !== undefined ? options.maxWorkers : config.maxWorkers,
            DEFAULT_CONFIG.maxWorkers
        );
        var maxGlobalRetries = toNonNegativeInt(
            options.maxGlobalRetries !== undefined ? options.maxGlobalRetries : config.maxGlobalRetries,
            DEFAULT_CONFIG.maxGlobalRetries
        );
        var retryDelayMs = toPositiveInt(options.retryDelayMs, 1200);

        var results = new Array(normalizedTasks.length);
        var errorsByIndex = {};
        var pendingIndexes = normalizedTasks.map(function (_, index) { return index; });

        for (var globalAttempt = 0; globalAttempt <= maxGlobalRetries && pendingIndexes.length > 0; globalAttempt++) {
            var queue = pendingIndexes.slice();
            pendingIndexes = [];
            var cursor = 0;
            var workerCount = Math.min(maxWorkers, queue.length);
            var workers = [];

            console.log(
                '[ApiConfigBubble] Parallel batch ' +
                (globalAttempt + 1) + '/' + (maxGlobalRetries + 1) +
                ' - workers=' + workerCount + ', tasks=' + queue.length
            );

            for (var workerIndex = 0; workerIndex < workerCount; workerIndex++) {
                workers.push((async function () {
                    while (true) {
                        var queuePos = cursor++;
                        if (queuePos >= queue.length) break;

                        var taskIndex = queue[queuePos];
                        var task = normalizedTasks[taskIndex];
                        var mergedOptions = Object.assign({}, options.requestOptions || {}, task.options || {});

                        try {
                            results[taskIndex] = await callAPI(task.messages, mergedOptions);
                            delete errorsByIndex[taskIndex];
                        } catch (error) {
                            errorsByIndex[taskIndex] = error;
                            pendingIndexes.push(taskIndex);
                            console.error('[ApiConfigBubble] Parallel task failed (index ' + taskIndex + '):', error.message || error);
                        }
                    }
                })());
            }

            await Promise.all(workers);

            if (pendingIndexes.length > 0 && globalAttempt < maxGlobalRetries) {
                await sleep(retryDelayMs * (globalAttempt + 1));
            }
        }

        if (pendingIndexes.length > 0) {
            if (options.allowPartialSuccess) {
                return {
                    results: results,
                    failedIndexes: pendingIndexes.slice(),
                    errors: pendingIndexes.map(function (idx) {
                        return {
                            index: idx,
                            message: errorsByIndex[idx] ? (errorsByIndex[idx].message || String(errorsByIndex[idx])) : 'Unknown error'
                        };
                    })
                };
            }
            throw buildParallelError(pendingIndexes, errorsByIndex, results);
        }

        return results;
    }

    // ============ Inject Styles ============
    function injectStyles() {
        if (parentDocument.getElementById(STYLE_ID)) return;

        var css = `
<style id="${STYLE_ID}">
/* Overlay */
.acb-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 10100;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
}
.acb-overlay.show {
    opacity: 1;
    visibility: visible;
}

/* Modal Panel */
.acb-modal {
    position: relative;
    width: 420px;
    max-width: 100%;
    max-height: 100%;
    background: rgba(26, 26, 42, 0.96);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow:
        0 24px 80px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset,
        0 1px 0 rgba(255, 255, 255, 0.06) inset;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(0.9);
    overflow-y: auto;
    overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    color: #e4e4e7;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.15) transparent;
}
.acb-modal::-webkit-scrollbar {
    width: 5px;
}
.acb-modal::-webkit-scrollbar-track {
    background: transparent;
}
.acb-modal::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
}
.acb-modal.show {
    opacity: 1;
    transform: scale(1);
}

/* Header */
.acb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.acb-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #f4f4f5;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}
.acb-header h2 .acb-icon {
    font-size: 20px;
}
.acb-close-btn {
    width: 32px; height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    color: #a1a1aa;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s;
}
.acb-close-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
}

/* Body */
.acb-body {
    padding: 16px 24px 20px;
}

/* Form Group */
.acb-group {
    margin-bottom: 16px;
}
.acb-group:last-child {
    margin-bottom: 0;
}
.acb-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #a1a1aa;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
}

/* Inputs */
.acb-input,
.acb-select {
    width: 100%;
    height: 42px;
    padding: 0 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: #f4f4f5;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}
.acb-input:focus,
.acb-select:focus {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}
.acb-input::placeholder {
    color: #52525b;
}
.acb-select option {
    background: #1a1a2a;
    color: #e4e4e7;
}

/* Password wrapper */
.acb-password-wrap {
    position: relative;
}
.acb-password-wrap .acb-input {
    padding-right: 44px;
}
.acb-eye-btn {
    position: absolute;
    right: 4px; top: 50%;
    transform: translateY(-50%);
    width: 34px; height: 34px;
    border: none;
    background: none;
    color: #71717a;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    font-size: 16px;
}
.acb-eye-btn:hover {
    color: #d4d4d8;
    background: rgba(255, 255, 255, 0.06);
}

/* Model row */
.acb-model-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
}
.acb-model-row .acb-input {
    flex: 1;
}
.acb-fetch-btn {
    flex-shrink: 0;
    height: 42px;
    padding: 0 14px;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: 10px;
    color: #818cf8;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    white-space: nowrap;
}
.acb-fetch-btn:hover {
    background: rgba(99, 102, 241, 0.25);
    border-color: rgba(99, 102, 241, 0.4);
    color: #a5b4fc;
}
.acb-fetch-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.acb-model-select {
    display: none;
    margin-top: 8px;
}
.acb-model-select.show {
    display: block;
}



/* Divider */
.acb-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 18px 0;
}

/* Footer Buttons */
.acb-footer {
    display: flex;
    gap: 10px;
    padding: 0 24px 20px;
}
.acb-btn {
    flex: 1;
    height: 42px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
}
.acb-btn-cancel {
    background: rgba(255, 255, 255, 0.06);
    color: #a1a1aa;
    border: 1px solid rgba(255, 255, 255, 0.08);
}
.acb-btn-cancel:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #d4d4d8;
}
.acb-btn-save {
    background: linear-gradient(135deg, #6366f1, #7c3aed);
    color: #fff;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
}
.acb-btn-save:hover {
    box-shadow: 0 6px 24px rgba(99, 102, 241, 0.35);
    transform: translateY(-1px);
}
.acb-btn-save:active {
    transform: translateY(0);
}

/* Status indicator */
.acb-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #71717a;
    padding: 8px 0 0;
}
.acb-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #ef4444;
}
.acb-status-dot.connected {
    background: #22c55e;
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

/* Responsive - viewport hẹp (width) hoặc thấp (height) -> chuyển sang mobile layout (fullscreen) */
@media (max-width: 768px), (max-height: 768px) {
    .acb-overlay {
        padding: 0;
    }
    .acb-modal {
        width: 100% !important;
        max-width: 100% !important;
        height: 100%;
        max-height: 100% !important;
        border-radius: 0;
    }
    .acb-header { padding: 20px 24px 16px; }
    .acb-body { padding: 16px 24px 20px; }
    .acb-footer { padding: 0 24px 20px; }
    
    /* Touch target optimization */
    .acb-input, .acb-select { min-height: 44px; font-size: 16px; } /* font-size 16px prevents iOS zoom */
    .acb-btn { min-height: 44px; font-size: 14px; }
    .acb-group { margin-bottom: 20px; }
    .acb-label { font-size: 13px; margin-bottom: 8px; }
}
</style>`;

        parentDocument.head.insertAdjacentHTML('beforeend', css);
    }

    // ============ Tạo Modal HTML ============
    function createModal() {
        // Xóa modal cũ nếu tồn tại
        var existing = parentDocument.getElementById(MODAL_ID);
        if (existing) existing.remove();
        var existingOverlay = parentDocument.getElementById(MODAL_ID + '-overlay');
        if (existingOverlay) existingOverlay.remove();

        var config = getConfig();

        // Provider options
        var providerOptions = PROVIDERS.map(function (p) {
            var selected = p.value === config.provider ? ' selected' : '';
            return '<option value="' + p.value + '"' + selected + '>' + p.label + '</option>';
        }).join('');

        // Overlay
        var overlay = parentDocument.createElement('div');
        overlay.id = MODAL_ID + '-overlay';
        overlay.className = 'acb-overlay';

        // Modal
        var modal = parentDocument.createElement('div');
        modal.id = MODAL_ID;
        modal.className = 'acb-modal';
        modal.innerHTML =
            '<div class="acb-header">' +
            '<h2><span class="acb-icon">⚙️</span> Cài đặt API</h2>' +
            '<button class="acb-close-btn" id="acb-close" title="Đóng">✕</button>' +
            '</div>' +
            '<div class="acb-body">' +
            // Provider
            '<div class="acb-group">' +
            '<label class="acb-label">Nhà cung cấp</label>' +
            '<select class="acb-select" id="acb-provider">' + providerOptions + '</select>' +
            '</div>' +
            // API URL
            '<div class="acb-group">' +
            '<label class="acb-label">API URL</label>' +
            '<input class="acb-input" type="text" id="acb-url" placeholder="https://api.openai.com/v1/chat/completions" value="' + escapeAttr(config.apiUrl) + '">' +
            '</div>' +
            // API Key
            '<div class="acb-group">' +
            '<label class="acb-label">API Key</label>' +
            '<div class="acb-password-wrap">' +
            '<input class="acb-input" type="password" id="acb-key" placeholder="sk-..." value="' + escapeAttr(config.apiKey) + '">' +
            '<button class="acb-eye-btn" id="acb-eye" title="Hiện/Ẩn">👁</button>' +
            '</div>' +
            '</div>' +
            // Model
            '<div class="acb-group">' +
            '<label class="acb-label">Mô hình (Nhập tay hoặc Lấy DS)</label>' +
            '<div class="acb-model-row">' +
            '<input class="acb-input" type="text" id="acb-model" placeholder="gpt-4o-mini" value="' + escapeAttr(config.model) + '">' +
            '<button class="acb-fetch-btn" id="acb-fetch">Lấy DS</button>' +
            '</div>' +
            '<div id="acb-model-select-container" style="display:none; margin-top:8px;">' +
            '<label class="acb-label" style="font-size:11px; opacity:0.7;">Chọn từ danh sách đã tải:</label>' +
            '<select class="acb-select" id="acb-model-select"></select>' +
            '</div>' +
            '</div>' +

            // Status
            '<div class="acb-status">' +
            '<span class="acb-status-dot' + (config.apiKey ? ' connected' : '') + '" id="acb-status-dot"></span>' +
            '<span id="acb-status-text">' + (config.apiKey ? 'API Key đã cấu hình' : 'Chưa cấu hình API Key') + '</span>' +
            '</div>' +

            // Advanced Params Row 1 (Tokens & Temp)
            '<div style="display:flex; gap:10px; margin-top:10px;">' +
            '<div style="flex:1;">' +
            '<label class="acb-label">Max Tokens</label>' +
            '<input class="acb-input" type="number" id="acb-max-tokens" value="' + (config.maxTokens || 4096) + '">' +
            '</div>' +
            '<div style="flex:1;">' +
            '<label class="acb-label">Temperature</label>' +
            '<input class="acb-input" type="number" id="acb-temp" min="0" max="2" step="0.1" value="' + (config.temperature || 0.1) + '">' +
            '</div>' +
            '</div>' +

            // Advanced Params Row 2 (Timeout & Retries)
            '<div style="display:flex; gap:10px; margin-top:10px;">' +
            '<div style="flex:1;">' +
            '<label class="acb-label">Timeout (s)</label>' +
            '<input class="acb-input" type="number" id="acb-timeout" value="' + (config.timeout || 60) + '">' +
            '</div>' +
            '<div style="flex:1;">' +
            '<label class="acb-label">Số lần thử lại</label>' +
            '<input class="acb-input" type="number" id="acb-retries" value="' + (config.retries || 2) + '">' +
            '</div>' +
            '</div>' +

            '</div>' +
            '<div class="acb-footer">' +
            '<button class="acb-btn acb-btn-cancel" id="acb-cancel">Hủy</button>' +
            '<button class="acb-btn acb-btn-save" id="acb-save">Lưu cài đặt</button>' +
            '</div>';

        // Modal nằm BÊN TRONG overlay để flexbox centering hoạt động
        overlay.appendChild(modal);
        parentDocument.body.appendChild(overlay);

        // Bind events
        bindModalEvents(overlay, modal);
    }

    function escapeAttr(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ============ Bind Modal Events ============
    function bindModalEvents(overlay, modal) {
        // Close
        var closeBtn = parentDocument.getElementById('acb-close');
        var cancelBtn = parentDocument.getElementById('acb-cancel');

        function closeModal() {
            overlay.classList.remove('show');
            modal.classList.remove('show');
            isModalOpen = false;
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // Prevent modal click from closing
        modal.addEventListener('click', function (e) { e.stopPropagation(); });

        // Eye toggle
        var eyeBtn = parentDocument.getElementById('acb-eye');
        var keyInput = parentDocument.getElementById('acb-key');
        if (eyeBtn && keyInput) {
            eyeBtn.addEventListener('click', function () {
                if (keyInput.type === 'password') {
                    keyInput.type = 'text';
                    eyeBtn.textContent = '🙈';
                } else {
                    keyInput.type = 'password';
                    eyeBtn.textContent = '👁';
                }
            });
        }



        // Fetch models
        var fetchBtn = parentDocument.getElementById('acb-fetch');
        if (fetchBtn) {
            fetchBtn.addEventListener('click', function () {
                fetchModels();
            });
        }

        // Model select
        var modelSelect = parentDocument.getElementById('acb-model-select');
        var modelInput = parentDocument.getElementById('acb-model');
        if (modelSelect && modelInput) {
            modelSelect.addEventListener('change', function () {
                if (this.value) {
                    modelInput.value = this.value;
                }
            });
        }

        // Save
        var saveBtn = parentDocument.getElementById('acb-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                var newConfig = {
                    provider: parentDocument.getElementById('acb-provider').value,
                    apiUrl: parentDocument.getElementById('acb-url').value.trim(),
                    apiKey: parentDocument.getElementById('acb-key').value.trim(),
                    model: parentDocument.getElementById('acb-model').value.trim(),
                    maxTokens: parseInt(parentDocument.getElementById('acb-max-tokens').value) || 4096,
                    temperature: parseFloat(parentDocument.getElementById('acb-temp').value) || 0.1,
                    timeout: parseInt(parentDocument.getElementById('acb-timeout').value) || 60,
                    retries: parseInt(parentDocument.getElementById('acb-retries').value) || 2
                };

                saveConfig(newConfig);
                closeModal();

                // Toast
                try {
                    if (window.parent.toastr) {
                        window.parent.toastr.success('Đã lưu cài đặt API');
                    }
                } catch (e) { }
            });
        }

        // Provider change → auto-fill URL
        var providerSelect = parentDocument.getElementById('acb-provider');
        var urlInput = parentDocument.getElementById('acb-url');
        if (providerSelect && urlInput) {
            providerSelect.addEventListener('change', function () {
                var providerUrls = {
                    'openai': 'https://api.openai.com/v1/chat/completions',
                    'claude': 'https://api.anthropic.com/v1/messages',
                    'deepseek': 'https://api.deepseek.com/v1/chat/completions'
                };
                var suggestion = providerUrls[this.value];
                if (suggestion && (!urlInput.value.trim() || confirm('Tự động điền URL cho ' + this.options[this.selectedIndex].text + '?'))) {
                    urlInput.value = suggestion;
                }
            });
        }
    }

    // ============ Fetch Models ============
    async function fetchModels() {
        var providerEl = parentDocument.getElementById('acb-provider');
        var urlEl = parentDocument.getElementById('acb-url');
        var keyEl = parentDocument.getElementById('acb-key');
        var fetchBtn = parentDocument.getElementById('acb-fetch');
        var modelSelect = parentDocument.getElementById('acb-model-select');
        var modelInput = parentDocument.getElementById('acb-model');

        if (!providerEl || !urlEl || !keyEl || !fetchBtn) return;

        if (providerEl.value !== 'openai') {
            try { if (window.parent.toastr) window.parent.toastr.info('Chỉ hỗ trợ lấy model từ API tương thích OpenAI'); } catch (e) { }
            return;
        }

        var key = keyEl.value.trim();
        if (!key) {
            try { if (window.parent.toastr) window.parent.toastr.warning('Vui lòng điền API Key trước'); } catch (e) { }
            return;
        }

        var baseUrl = urlEl.value.trim();
        while (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

        var originalText = fetchBtn.textContent;
        fetchBtn.textContent = 'Đang lấy...';
        fetchBtn.disabled = true;

        try {
            var modelsUrl = baseUrl.indexOf('/v1') !== -1
                ? baseUrl.replace(/\/chat\/completions.*/, '') + '/models'
                : baseUrl + '/v1/models';

            // Nếu URL chứa /chat/completions, loại bỏ phần đó
            modelsUrl = modelsUrl.replace('/chat/completions', '');
            // Đảm bảo kết thúc bằng /models
            if (!modelsUrl.endsWith('/models')) {
                if (modelsUrl.includes('/v1')) {
                    modelsUrl = modelsUrl.replace(/\/v1.*/, '/v1/models');
                } else {
                    modelsUrl += '/v1/models';
                }
            }

            var res = await fetch(modelsUrl, {
                headers: {
                    'Authorization': 'Bearer ' + key,
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) throw new Error('Kết nối thất bại (' + res.status + ')');

            var data = await res.json();
            var models = [];
            if (data && data.data && Array.isArray(data.data)) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i] && data.data[i].id) {
                        models.push(data.data[i].id);
                    }
                }
            }

            if (models.length === 0) {
                try { if (window.parent.toastr) window.parent.toastr.warning('Không lấy được model nào'); } catch (e) { }
                return;
            }

            // Sort alphabetically
            models.sort();

            // Populate select
            if (modelSelect) {
                var opts = '<option value="">--- Chọn mô hình từ danh sách ---</option>' +
                    models.map(function (m) {
                        return '<option value="' + escapeAttr(m) + '">' + escapeAttr(m) + '</option>';
                    }).join('');
                modelSelect.innerHTML = opts;

                var container = parentDocument.getElementById('acb-model-select-container');
                if (container) container.style.display = 'block';
            }

            if (modelInput) {
                modelInput.value = models[0];
            }

            // Update status
            var statusDot = parentDocument.getElementById('acb-status-dot');
            var statusText = parentDocument.getElementById('acb-status-text');
            if (statusDot) statusDot.classList.add('connected');
            if (statusText) statusText.textContent = 'Đã kết nối - ' + models.length + ' model';

            try { if (window.parent.toastr) window.parent.toastr.success('Tìm thấy ' + models.length + ' model'); } catch (e) { }

        } catch (e) {
            console.error('[ApiConfigBubble] Lỗi lấy model:', e);
            try { if (window.parent.toastr) window.parent.toastr.error(e.message || 'Kết nối thất bại'); } catch (e2) { }
        } finally {
            fetchBtn.textContent = originalText;
            fetchBtn.disabled = false;
        }
    }

    // ============ Mở/Đóng Modal ============
    function openModal() {
        if (isModalOpen) return;

        // Reload config trước khi mở
        loadConfig();
        createModal();

        // Trigger show animation
        requestAnimationFrame(function () {
            var overlay = parentDocument.getElementById(MODAL_ID + '-overlay');
            var modal = parentDocument.getElementById(MODAL_ID);
            if (overlay) overlay.classList.add('show');
            if (modal) modal.classList.add('show');
            isModalOpen = true;
        });
    }

    function closeModal() {
        var overlay = parentDocument.getElementById(MODAL_ID + '-overlay');
        var modal = parentDocument.getElementById(MODAL_ID);
        if (overlay) overlay.classList.remove('show');
        if (modal) modal.classList.remove('show');
        isModalOpen = false;

        // Xóa DOM sau animation
        setTimeout(function () {
            if (overlay) overlay.remove();
            if (modal) modal.remove();
        }, 350);
    }

    // ============ Đăng ký vào FloatingMenuManager ============
    var _registered = false;
    var _bubbleConfig = {
        id: 'api-config',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:white"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        label: 'Cài đặt API',
        onClick: function () { openModal(); },
        color: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
        order: 2
    };

    function _tryRegister() {
        if (_registered) return true;
        if (!window.parent.FloatingMenuManager) return false;
        try {
            window.parent.FloatingMenuManager.registerButton(_bubbleConfig);
            _registered = true;
            console.log('[ApiConfigBubble] Đã đăng ký vào FloatingMenuManager');
            return true;
        } catch (e) {
            console.warn('[ApiConfigBubble] Đăng ký thất bại:', e);
            return false;
        }
    }

    // ============ Khởi tạo ============
    function init() {
        loadConfig();
        injectStyles();

        // Đăng ký bubble
        if (!_tryRegister()) {
            // Nếu FMM chưa có, dùng pending queue hoặc retry
            if (window.parent._fmmPendingRegistrations) {
                window.parent._fmmPendingRegistrations.push(_bubbleConfig);
                _registered = true;
                console.log('[ApiConfigBubble] Đã thêm vào hàng đợi FMM');
            } else {
                var retryCount = 0;
                var retryTimer = setInterval(function () {
                    retryCount++;
                    if (_tryRegister() || retryCount >= 20) {
                        clearInterval(retryTimer);
                        if (!_registered) {
                            console.warn('[ApiConfigBubble] Không thể đăng ký vào FloatingMenuManager sau 10s');
                        }
                    }
                }, 500);
            }
        }
    }

    // ============ Cleanup ============
    function destroy() {
        // Hủy đăng ký bubble
        if (window.parent.FloatingMenuManager) {
            try {
                window.parent.FloatingMenuManager.unregisterButton('api-config');
            } catch (e) { }
        }

        // Xóa modal
        var overlay = parentDocument.getElementById(MODAL_ID + '-overlay');
        var modal = parentDocument.getElementById(MODAL_ID);
        if (overlay) overlay.remove();
        if (modal) modal.remove();

        // Xóa styles
        var styles = parentDocument.getElementById(STYLE_ID);
        if (styles) styles.remove();

        isModalOpen = false;
        _registered = false;

        console.log('[ApiConfigBubble] Đã dọn dẹp');
    }

    // ============ Export Global API ============
    window.parent.ApiConfigManager = {
        getConfig: getConfig,
        saveConfig: saveConfig,
        callAPI: callAPI,
        callAPIParallel: callAPIParallel,
        openSettings: openModal,
        closeSettings: closeModal
    };

    // ============ Auto Init ============
    init();

    // ============ Cleanup on pagehide ============
    $(window).on('pagehide', function () {
        console.log('[ApiConfigBubble] Script bị gỡ, dọn dẹp...');
        destroy();
    });

    console.log('[ApiConfigBubble] Tải hoàn tất');
})();
