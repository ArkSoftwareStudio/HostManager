const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload running this!');

contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
})

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
    }
})