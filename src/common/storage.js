const Storage = window.localStorage;
const sessionStorage = window.sessionStorage;

const local = {
    setItem(key, value) {
        value = JSON.stringify(value);
        Storage.setItem(key, value);
    },
    getItem(key) {
        const value = Storage.getItem(key);
        return JSON.parse(value);
    },
    clear() {
        Storage.clear();
    },
    removeItem(key) {
        Storage.removeItem(key)
    },
    multiGet(keys) {
        const values = {};
        keys.forEach((key) => {
            values[key] = this.getItem(key);
        });
        return values;
    },
    multiRemove(keys) {
        keys.forEach(key => this.removeItem(key));
    },
};

const session = {
    setItem(key, value) {
        value = JSON.stringify(value);
        sessionStorage.setItem(key, value);
    },
    getItem(key) {
        const value = sessionStorage.getItem(key);
        return JSON.parse(value);
    },
    clear() {sessionStorage.clear()},
    removeItem(key) {sessionStorage.removeItem(key)},
    multiGet(keys) {
        const values = {};
        keys.forEach((key) => {
            values[key] = this.getItem(key);
        });
        return values;
    },
    multiRemove(keys) {
        keys.forEach(key => this.removeItem(key));
    },
};
export default {
    local,
    session,
}
