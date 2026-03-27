// 封装localStorage，sessionStorage和cookie
function install(Vue) {
    Vue.prototype.$Cookie = {
        // 存储cookie信息
        set(key, value, days = 1) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${key}=${value};expires=${date.toUTCString()};path=/`;
        },
        get(key) {
            const name = `${key}=`;
            const decodedCookie = decodeURIComponent(document.cookie);
            const ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        },
        remove(key) {
            this.set(key, '', -1);
        },
    }
    Vue.prototype.$Local = {
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get(key) {
            return JSON.parse(localStorage.getItem(key) || 'null');
        },
        remove(key) {
            localStorage.removeItem(key);
        },
        clear() {
            localStorage.clear();
        }
    }
    Vue.prototype.$Session = {
        set(key, value) {
            sessionStorage.setItem(key, JSON.stringify(value));
        },
        get(key) {
            return JSON.parse(sessionStorage.getItem(key) || 'null');
        },
        remove(key) {
            sessionStorage.removeItem(key);
        },
        clear() {
            sessionStorage.clear();
        }
    }
}

export default {install};