import {App, app, BrowserWindow, dialog, ipcMain} from 'electron'
import WindowManager from './WindowManager'
import windowManager, {WindowNameMapper} from './WindowManager'
import travelService from "../services/travel.service";

export default class Main {
    private app: App

    constructor() {
        this.app = app
        this.initDefaultListeners()
    }

    //init window
    private initDefaultListeners(): void {
        this.app.whenReady().then(() => {
            this.generateMainWindow()
        })

        this.app.on('activate', () => {
            if (BrowserWindow.length === 0 && process.platform === 'darwin') {
                this.generateMainWindow()
            }
        })

        this.app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                this.app.quit()
            }
        })
    }

    //generate window
    private generateMainWindow(): void {
        WindowManager.createWindow(WindowNameMapper.HOME, travelService.getAll())

        //generate show item window
        ipcMain.on('ask-show-item', (e: any, id: number) => {
            const travel = travelService.getOne(id)

            //generate new data on show item windo if exist
            if(windowManager.hasWindow(WindowNameMapper.SHOW_ITEM)){
                const window = windowManager.getWindow(WindowNameMapper.SHOW_ITEM)
                window.webContents.send('init-new-data', travel)
                window.show()
            }
            else {
                windowManager.createWindow(WindowNameMapper.SHOW_ITEM, travel)
            }
        })

        //generate add item window
        ipcMain.on('ask-add-item', (e: any) => {
            if(windowManager.hasWindow(WindowNameMapper.ADD_ITEM)){
                windowManager.getWindow(WindowNameMapper.ADD_ITEM).show()
            }
            else {
                windowManager.createWindow(WindowNameMapper.ADD_ITEM, undefined, 1000, 600)

                //add new item
                ipcMain.handle('add-new-item', (e, newTravel) => {
                    const travels = travelService.getAll()
                    newTravel.id = travels.length > 0 ? travels[travels.length - 1].id + 1 : 1

                    travelService.add(newTravel)

                    //add new item on home window
                    if (windowManager.hasWindow(WindowNameMapper.HOME)) {
                        windowManager.getWindow(WindowNameMapper.HOME).webContents.send('new-item-added', newTravel)
                    } else {
                        windowManager.createWindow(WindowNameMapper.HOME, travelService.getAll())
                    }

                    return {
                        success: true,
                        msg: 'l\'offre a été ajouté avec succès'
                    }
                })

                windowManager.getWindow(WindowNameMapper.ADD_ITEM).on('closed', () => ipcMain.removeHandler('add-new-item'))
            }
        })

        //generate update item window
        ipcMain.on('ask-update-item', (e: any, id: number) => {
            const travel = travelService.getOne(id)

            if(windowManager.hasWindow(WindowNameMapper.UPDATE_ITEM)){
                const window = windowManager.getWindow(WindowNameMapper.UPDATE_ITEM)
                window.webContents.send('init-new-data', travel)
                window.show()
            }else {
                windowManager.createWindow(WindowNameMapper.UPDATE_ITEM, travel, 1000, 600)

                //update item
                ipcMain.handle('update-item', (e, updatedTravel) => {
                    try {
                        travelService.update(updatedTravel)
                    } catch {
                        return {
                            success: false,
                            msg: 'l\'offre a n\'a pas pu être modifié'
                        }
                    }

                    //update item on home window
                    if (windowManager.hasWindow(WindowNameMapper.HOME)) {
                        windowManager.getWindow(WindowNameMapper.HOME).webContents.send('item-updated', updatedTravel)
                    } else {
                        windowManager.createWindow(WindowNameMapper.HOME, travelService.getAll())
                    }

                    //update item on show item window if exist
                    if (windowManager.hasWindow(WindowNameMapper.SHOW_ITEM)){
                        windowManager.getWindow(WindowNameMapper.SHOW_ITEM).webContents.send('init-new-data', updatedTravel)
                    }

                    return {
                        success: true,
                        msg: 'l\'offre a été modifié avec succès'
                    }
                })

                windowManager.getWindow(WindowNameMapper.UPDATE_ITEM).on('closed', () => ipcMain.removeHandler('update-item'))
            }
        })

        //delete item
        ipcMain.on('delete-item', (e: any, id: number) => {

            //generate message box
            const choice = dialog.showMessageBoxSync({
                title: 'Suppression d\'une offre',
                message: 'Etes-vous sûr de vouloir supprimer définitivement l\'offre ?',
                buttons: ['Annuler', 'Oui']
            })

            //dlete item
            if (choice) {
                travelService.delete(id)

                //delete show item window if exist
                if (windowManager.hasWindow(WindowNameMapper.SHOW_ITEM)){
                    windowManager.getWindow(WindowNameMapper.SHOW_ITEM).close()
                }

                //dletee item on home window
                if (windowManager.hasWindow(WindowNameMapper.HOME)){
                    const window = windowManager.getWindow(WindowNameMapper.HOME)
                    window.webContents.send('deleted-item', id)
                    window.show()
                } else {
                    WindowManager.createWindow(WindowNameMapper.HOME, travelService.getAll())
                }
            }
        })
    }
}