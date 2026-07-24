const { app, BrowserWindow, ipcMain } = require('electron')
const { enableDrag } = require('electron-drag');
const path = require('node:path')
const { getFiles, getAllFiles, handleGetFileMetaData } = require('./ipchandler/render.event.handler')
const { hadleGetFolderPath } = require('./ipchandler/getFolderPath')
const { handleCreateAlbum } = require('./ipchandler/createAlbum')
const { handleGetAllPlayList, handleDeletePlayList } = require('./ipchandler/getPlayList')

let win
const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      hardwareAcceleration: true
    },
    frame: process.platform === 'darwin' ? true : false,
    ...(process.platform === 'darwin' ? { titleBarStyle: 'hidden' } : {})
  })

  win.loadFile('build/index.html')
  win.addListener
 // enableDrag(win);
  //win.webContents.openDevTools()
}

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    ignored: [
      /node_modules|[/\\]\./,
      /([/\\]|^)data([/\\]|$)/
    ]
})
app.whenReady().then(async () => {
  ipcMain.handle('file:getAllPlayList', handleGetAllPlayList)
  ipcMain.handle('file:deletePlayList', handleDeletePlayList)
  ipcMain.handle('file:getFiles', getFiles)
  ipcMain.handle('file:getAllFiles', getAllFiles)
  ipcMain.handle('file:createAlbum', handleCreateAlbum)
  ipcMain.handle('file:getFileMetaData', handleGetFileMetaData)
  ipcMain.handle('folder:getFolderPath', () => hadleGetFolderPath(win))


  ipcMain.handle('close', () => {
    console.log("close")
    if (win) win.close();
  })
  ipcMain.handle('minimize', () => {
    if (win) win.minimize();
  })
  ipcMain.handle('maximize', () => {
    if (win) {
      win.isMaximized() ? win.unmaximize() : win.maximize();
    }
  })
  createWindow()
})