const handleKeys = (e) => {
    const key = e.key.toLowerCase();

    if (key === 'escape') {
        // 1. 抓取主法典的专属关闭按钮
        const closeBtns = Array.from(rootDiv.querySelectorAll('.bookmark-close'));
        
        // 2. 抓取其他常规关闭/取消按钮 (X 或者 包含"取消")
        const cancelBtns = Array.from(rootDiv.querySelectorAll('button')).filter(btn => {
            const text = btn.innerText ? btn.innerText.trim() : '';
            // HTML 里的 &times; 会被浏览器解析为字符 '×'
            return text === '×' || text.includes('取消') || text === '合上法典';
        });

        // 3. 去重并过滤掉 display:none 的隐藏元素
        const validBtns = [...new Set([...closeBtns, ...cancelBtns])].filter(btn => {
            return btn.offsetWidth > 0 || btn.offsetHeight > 0;
        });

        if (validBtns.length === 0) return; 

        // 4. 计算有效层级与深度 (保持你原有的优秀逻辑不变)
        const getEffectiveZIndexAndDepth = (el) => {
            let totalZ = 0;
            let depth = 0;
            let curr = el;
            while (curr && curr !== rootDiv && curr !== doc.body) {
                const style = window.parent.getComputedStyle(curr);
                if (style.zIndex && style.zIndex !== 'auto') {
                    totalZ += parseInt(style.zIndex, 10);
                }
                depth++; 
                curr = curr.parentElement;
            }
            return { totalZ, depth };
        };

        // 5. 排序逻辑：总 Z-index 优先 -> 嵌套深度其次 -> DOM 顺序最后
        const mappedBtns = validBtns.map((btn, index) => {
            const { totalZ, depth } = getEffectiveZIndexAndDepth(btn);
            return { btn, z: totalZ, depth, index };
        });
        
        mappedBtns.sort((a, b) => {
            if (a.z !== b.z) return a.z - b.z;                
            if (a.depth !== b.depth) return a.depth - b.depth; 
            return a.index - b.index;                          
        });

        // 6. 模拟点击最顶层的关闭按钮
        const topBtnInfo = mappedBtns.pop();
        topBtnInfo.btn.click();

        // 7. 拦截事件，防止触发酒馆等宿主环境的原生 Esc 功能
        e.preventDefault();
        e.stopPropagation();
        return;
    }
};