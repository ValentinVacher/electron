import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    'ipcRendererCustom', {
        onceInitData: (travel: any) => {
            ipcRenderer.once('init-data', travel)
        },
        onInitNewData: (travel: any) => {
            ipcRenderer.on('init-new-data', travel)
        },
        sendAskUpdateItem: (id: number) => {
            ipcRenderer.send('ask-update-item', id)
        },
        sendAskDeleteItem: (id: number) => {
            ipcRenderer.send('delete-item', id)
        },
    }
)