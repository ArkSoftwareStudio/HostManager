const { contextBridge, ipcRenderer } = require('electron');

//#region  API EXPOSED METHODS
contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
})
//#endregion

//#region DATA EXPOSED METHODS
contextBridge.exposeInMainWorld("data", {
    getWaitersAsync: async () => {
        const result = await ipcRenderer.invoke('data', {method:'getWaiters'})
        return result;
    },

    deleteWaiterAsync: async (id) => {
        const result = await ipcRenderer.invoke('data', {method: 'deleteWaiter', id: id})
        return result;
    },

    addWaiterAsync: async (waiter) => {
        const result = await ipcRenderer.invoke('data', {method: 'addWaiter', waiter: waiter})
        return result;
    },

    getSectionsAsync: async () => {
        const result = await ipcRenderer.invoke('data', {method: 'getSections'})
        return result;
    },

    addTableAsync: async (section) => {
        const result = await ipcRenderer.invoke('data', {method: 'addTable', section: section})
        return result;
    },

    deleteTableAsync: async (info) => {
        const result = await ipcRenderer.invoke('data', {method: 'deleteTable', info: info});
        return result;
    },
    
    toggleTableAsync: async (info) => {
        const result = await ipcRenderer.invoke('data', {method: 'toggleTable', info: info});
        return result;
    },

    addSectionAsync: async (section) => {
        const result = await ipcRenderer.invoke('data', {method: 'addSection', section: section});
        return result;
    },

    deleteSectionAsync: async(sectionId) => {
        const result = await ipcRenderer.invoke('data', {method: 'deleteSection', sectionId : sectionId});
        return result;
    },

    assignWaiterAsync: async(info) => {
        const result = await ipcRenderer.invoke('data', {method: 'assignWaiter', sectionId: info.sectionId, waiter : info.waiter})
        return result;
    }
})

contextBridge.exposeInMainWorld('logs', {
    getLogsAsync : async () => {
        const result = await ipcRenderer.invoke('logs', {method:'getLogs'})
        return result;
    }
})
//#endregion