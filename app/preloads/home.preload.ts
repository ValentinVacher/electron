import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    'ipcRendererCustom', {
        onceInitData: (travels: any) => {
            ipcRenderer.once('init-data', travels)
        },
        sendAskShowItem: (id: number) => {
            ipcRenderer.send('ask-show-item', id)
        },
        sendAskAddItem: (cb: any) => {
            ipcRenderer.send('ask-add-item', cb)
        },
        onNewItemAdded: (travel: any) => {
            ipcRenderer.on('new-item-added', travel)
        },
        onItemUpdated: (travel: any) => {
            ipcRenderer.on('item-updated', travel)
        },
        onDeletedItem: (id: any) => {
            ipcRenderer.on('deleted-item', id)
        }
    }
)