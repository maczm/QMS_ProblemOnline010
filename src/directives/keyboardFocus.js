// 移动端键盘遮挡处理指令
export default {
    // eslint-disable-next-line no-unused-vars
    bind(el, binding, vnode) {
        // 处理输入框聚焦事件
        const handleFocus = async (event) => {
            const element = event.target;

            // 延迟一小段时间确保键盘完全弹起
            setTimeout(() => {
                // 检查元素是否为输入框
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // 将元素滚动到视图中，偏移一定距离避免被键盘遮挡
                    const rect = element.getBoundingClientRect();
                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

                    // 计算元素底部到视窗顶部的距离
                    const elementBottom = rect.bottom;

                    // 如果元素底部在视窗的下半部分，则需要滚动
                    if (elementBottom > viewportHeight * 0.5) {
                        // 计算需要滚动的距离，使元素位于键盘上方
                        const scrollAmount = elementBottom - viewportHeight * 0.5;

                        // 平滑滚动
                        window.scrollBy({
                            top: scrollAmount,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 300); // 延迟时间，等待键盘完全弹起
        };

        // 处理失焦事件
        const handleBlur = () => {
            // 可以在这里添加键盘收起后的处理逻辑
            setTimeout(() => {
                // 滚回顶部或其他操作
                // window.scrollTo(0, 0);
            }, 100);
        };

        // 添加事件监听器
        el.addEventListener('focus', handleFocus, true);
        el.addEventListener('blur', handleBlur, true);

        // 保存事件处理函数以便解绑时使用
        el._keyboardFocusFocusHandler = handleFocus;
        el._keyboardFocusBlurHandler = handleBlur;
    },

    unbind(el) {
        // 移除事件监听器
        if (el._keyboardFocusFocusHandler) {
            el.removeEventListener('focus', el._keyboardFocusFocusHandler, true);
        }
        if (el._keyboardFocusBlurHandler) {
            el.removeEventListener('blur', el._keyboardFocusBlurHandler, true);
        }

        // 清理引用
        delete el._keyboardFocusFocusHandler;
        delete el._keyboardFocusBlurHandler;
    }
};
