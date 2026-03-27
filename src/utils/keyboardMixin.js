// 移动端键盘遮挡处理 mixin
export default {
    data() {
        return {
            isKeyboardOpen: false, // 键盘是否打开
            originalViewport: '' // 原始 viewport 设置
        }
    },

    mounted() {
        this.originalViewport = document.querySelector('meta[name=viewport]') ?
            document.querySelector('meta[name=viewport]').getAttribute('content') : '';

        // 监听视窗高度变化，判断键盘是否弹起
        this.addKeyboardEventListeners();
    },

    beforeDestroy() {
        this.removeKeyboardEventListeners();
    },

    methods: {
        // 添加键盘事件监听器
        addKeyboardEventListeners() {
            const that = this;
            let windowHeight = window.innerHeight;

            // 记录原始窗口高度
            this.handleWindowResize = function() {
                const currentHeight = window.innerHeight;
                const heightDifference = windowHeight - currentHeight;

                // 高度差大于150像素认为是键盘弹起
                if (heightDifference > 150) {
                    that.isKeyboardOpen = true;
                    that.onKeyboardShow();
                } else if (that.isKeyboardOpen && heightDifference < 50) {
                    // 高度差小于50像素认为是键盘收起
                    that.isKeyboardOpen = false;
                    that.onKeyboardHide();
                }
            };

            window.addEventListener('resize', this.handleWindowResize);
        },

        // 移除键盘事件监听器
        removeKeyboardEventListeners() {
            window.removeEventListener('resize', this.handleWindowResize);
        },

        // 键盘显示时的处理
        onKeyboardShow() {
            // 延迟执行确保获取到正确的 activeElement
            setTimeout(() => {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    // 将输入框滚动到可视区域
                    this.scrollInputIntoView(activeElement);
                }
            }, 300);
        },

        // 键盘隐藏时的处理
        onKeyboardHide() {
            // 恢复原来的 viewport 设置
            if (this.originalViewport) {
                document.querySelector('meta[name=viewport]').setAttribute('content', this.originalViewport);
            }
        },

        // 将输入框滚动到可视区域
        scrollInputIntoView(element) {
            // 获取元素相对于视窗的位置
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const middlePosition = absoluteElementTop - (window.innerHeight / 2);

            // 添加偏移量确保元素在键盘上方可见
            const offsetPosition = middlePosition - 100;

            // 平滑滚动到指定位置
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}
