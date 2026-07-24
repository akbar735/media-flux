const { app, BrowserWindow, ipcMain } = require('electron')
const enableDrag = require('electron-drag');
const path = require('node:path')
const { getFiles, getAllFiles, handleGetFileMetaData } = require('./ipchandler/render.event.handler')
const { hadleGetFolderPath } = require('./ipchandler/getFolderPath')
const { handleCreateAlbum } = require('./ipchandler/createAlbum')
const { handleGetAllPlayList, handleDeletePlayList } = require('./ipchandler/getPlayList')

const drag = require('electron-drag');
console.log(drag);
let win
const createWindow = () => {
  win = new BrowserWindow({
    title: 'Media Flux',
    width: 1000,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      hardwareAcceleration: true
    },
    frame: process.platform === 'darwin' ? true : false,
    ...(process.platform === 'darwin' ? { titleBarStyle: 'hidden' } : {})
  })

  win.on('enter-full-screen', () => {
    win.webContents.send('window:fullscreen-change', true)
  })

  win.on('leave-full-screen', () => {
    win.webContents.send('window:fullscreen-change', false)
  })

  win.loadFile(path.join(__dirname, 'build', 'index.html'))
  win.addListener
  //enableDrag(win);
  //win.webContents.openDevTools()
}

if (!app.isPackaged) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    ignored: [
      /node_modules|[/\\]\./,
      /([/\\]|^)data([/\\]|$)/
    ]
  })
}

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
  ipcMain.handle('window:isFullScreen', () => {
    return win ? win.isFullScreen() : false;
  })
  createWindow()
})
