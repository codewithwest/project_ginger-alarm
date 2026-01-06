const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => ipcRenderer.invoke('get-version'),
    showDialog: () => ipcRenderer.invoke('show-dialog'),
    platform: process.platform
});
//# sourceMappingURL=preload.js.map