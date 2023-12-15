import { BrowserWindow } from "electron"
import path from 'path'

export enum WindowNameMapper{
    HOME = 'home',
    SHOW_ITEM = 'show-item',
    ADD_ITEM = 'add-item',
    UPDATE_ITEM = 'update-item'
}

type Windows = Map<WindowNameMapper, BrowserWindow>

class windowManager{
    private windows: Windows

    constructor (){
        this.windows = new Map<WindowNameMapper, BrowserWindow>()
    }

    // get window
    getWindow (windowName: WindowNameMapper): BrowserWindow {
        if (this.hasWindow(windowName)) {
            return this.windows.get(windowName) as BrowserWindow
        }

        throw 'La vue n\'existe pas.'
    }

    //add window
    addWindow(windowName: WindowNameMapper, windowToAdd: BrowserWindow):void{
        this.windows.set(windowName, windowToAdd)
    }

    //delete window
    deleteWindow(windowName: WindowNameMapper): boolean{
        if(this.hasWindow(windowName)){
            return this.windows.delete(windowName)
        }

        throw 'La vue n\'existe pas.'
    }

    //checks if window exists
    hasWindow(windowName: WindowNameMapper):boolean {
        return this.windows.has(windowName)
    }

    //generate window
    createWindow(templateName: WindowNameMapper, templateData?: any, width = 1400, height = 1200): void{
        const win = new BrowserWindow({
            width,
            height,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, '..', 'preloads', `${templateName}.preload.js`)
            }
        })
    
        win.loadFile(path.join(__dirname, '..', '..', 'src', 'views', templateName, `${templateName}.html`)).then(() => {
            if(templateData) win.webContents.send('init-data', templateData)
        })

        win.on('closed', () => {
            this.deleteWindow(templateName)
        })

        this.addWindow(templateName, win)
    }
}

export default new windowManager()