import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    'ipcRendererCustom', {
        onceInitData: (travel: any) => {
            ipcRenderer.once('init-data', travel)
        },
        onInitNewData: (travel: any) => {
            ipcRenderer.on('init-new-data', travel)
        },
        invokeUpdateItem: (updateItem: any, cb:any) => {
            ipcRenderer.invoke('update-item', updateItem).then(cb)
        }
    }
)