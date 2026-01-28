const storage = {
    primary_Key: "auth",
    // Read
    get: function (key) {
        if (!key) return null;
        try {
            const storData = JSON.parse(localStorage.getItem(this.primary_Key));
            return storData && storData[key] ? storData[key] : null;
        } catch (error) {
            console.warn("Storage get error:", error);
            return null;
        }
    },

    // Update
    set: function (key, data) {
        if (!key) return false;
        try {
            let storData = JSON.parse(localStorage.getItem(this.primary_Key)) || {};
            const updatedData = { ...storData, [key]: data };
            localStorage.setItem(this.primary_Key, JSON.stringify(updatedData));
            return true;
        } catch (error) {
            console.warn("Storage set error:", error);
            return false;
        }
    },

    // Clear all
    clear: function () {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error("Storage clear error:", error);
            return false;
        }
    },
};

export default storage;
