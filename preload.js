const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  getAllPlayList: () => ipcRenderer.invoke('file:getAllPlayList'),
  getFiles: (foldersArr, fileType) => ipcRenderer.invoke('file:getFiles', foldersArr, fileType),
  getAllFiles: (folder) => ipcRenderer.invoke('file:getAllFiles', folder),
  getFileMetaData: (url) => ipcRenderer.invoke('file:getFileMetaData', url),
  getFolderPath: () => ipcRenderer.invoke('folder:getFolderPath'),
  handleCreateAlbum: (albumName, formattedFiles) => ipcRenderer.invoke('file:createAlbum', albumName, formattedFiles),
  handleDeletePlayList: (playlistName) => ipcRenderer.invoke('file:deletePlayList', playlistName),
  closeWindow: () => ipcRenderer.invoke('close'),
  minimizeWindow: () => ipcRenderer.invoke('minimize'),
  maximizeWindow: () => ipcRenderer.invoke('maximize')
})