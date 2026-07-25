const { app, BrowserWindow, ipcMain } = require('electron')

const path = require('node:path')
const { getFiles, getAllFiles, handleGetFileMetaData } = require('./ipchandler/render.event.handler')
const { hadleGetFolderPath } = require('./ipchandler/getFolderPath')
const { handleCreateAlbum } = require('./ipchandler/createAlbum')
const { handleGetAllPlayList, handleDeletePlayList } = require('./ipchandler/getPlayList')

if (process.platform === 'win32') {
  app.setAppUserModelId('com.akbar.mediaflux')
}

let win
const appIcon = path.join(__dirname, 'build', 'icons', '512x512.png')
const createWindow = () => {
  const windowIcon = process.platform === 'win32'
    ? path.join(__dirname, 'build', 'icons', 'icon.ico')
    : appIcon

  win = new BrowserWindow({
    title: 'Media Flux',
    width: 1000,
    height: 850,
    icon: windowIcon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      hardwareAcceleration: true
    },
    frame: false,
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
  if (process.platform === 'darwin' && app.dock) {
    app.dock.setIcon(appIcon)
  }

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
