import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
    'ipcRendererCustom', {
        invokeAddNewItem: (newItem: any, cb:any) => {
            ipcRenderer.invoke('add-new-item', newItem).then(cb)
        }
    }
)