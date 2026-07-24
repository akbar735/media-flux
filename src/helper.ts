import { AppThemeMode, ICurrentlyPlaying, IFileDetail, IFileType, PathKey } from "./types"

export const APP_THEME_STORAGE_KEY = 'appThemeMode';

export function getFileType (mime: string){
    return mime.split('/')[0]
}

export function getSerializableFileDetail(file: IFileType){
    return {
        lastModified: file.lastModified ,
        lastModifiedDate: file.lastModifiedDate?.toString() ,
        name: file.name ,
        path: file.path ,
        size: file.size ,
        type: file.type ,
        webkitRelativePath: file.webkitRelativePath ,
    }
}

export function isFileLocatioSame(file1: IFileType, file2: IFileType){
    return file1.path === file2.path
}

export function getLoadedFile(file: File & {path?: string}, files: IFileDetail[]){
    const loadedFile = files.find(el => el.file.path === file.path)
    return loadedFile
}
export function getOptimizedEndpoint(rormattedTime: string){
    let [hr, min, sec] = rormattedTime.split(':').map(str => str.trim())
    hr = hr+':'
    min = min+':'
    return hr+min+sec
}


export function updateLocalStorage(name: PathKey, value: string){
    const itmes = localStorage.getItem(name);
    if(itmes){
        const uniqueItmes = Array.from(new Set([...itmes.split(';'), value])).join(';')
        localStorage.setItem(name, uniqueItmes)
    }else{
        localStorage.setItem(name, value)
    }
}

export function updateLocalStoragePaths(name: PathKey, value: string){
    if(!value) return;
    const items = getLocalStorageValue(name);
    const uniqueItems = Array.from(new Set([...items, value]));
    localStorage.setItem(name, uniqueItems.join(';'));
}

export function removeLocalStoragePath(name: PathKey, value: string){
    const items = getLocalStorageValue(name).filter(item => item !== value);
    if(items.length > 0){
        localStorage.setItem(name, items.join(';'));
    }else{
        localStorage.removeItem(name);
    }
}

export function getStoredAppTheme(){
    const storedTheme = localStorage.getItem(APP_THEME_STORAGE_KEY);
    if(
        storedTheme === AppThemeMode.LIGHT ||
        storedTheme === AppThemeMode.DARK ||
        storedTheme === AppThemeMode.AUTO
    ){
        return storedTheme;
    }
    return AppThemeMode.AUTO;
}

export function applyAppTheme(themeMode: AppThemeMode){
    const shouldUseDarkTheme = themeMode === AppThemeMode.DARK ||
        (themeMode === AppThemeMode.AUTO && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', shouldUseDarkTheme);
}

export function setStoredAppTheme(themeMode: AppThemeMode){
    localStorage.setItem(APP_THEME_STORAGE_KEY, themeMode);
    applyAppTheme(themeMode);
}

export function updateRecentlyPlayed(name: PathKey, value: {time: number, fileDetail: ICurrentlyPlaying}){
    const itmes = localStorage.getItem(name);
    if(itmes){
        const parsedItems: {time: number, fileDetail: ICurrentlyPlaying}[] = JSON.parse(itmes);
        if(parsedItems.length < 10){
            const exitingItemIndex = parsedItems.findIndex(pItem => pItem.fileDetail.media?.id === value.fileDetail.media?.id)
            if(exitingItemIndex > -1){
                parsedItems[exitingItemIndex] = value
            }else{
                parsedItems.push(value)
            }
            localStorage.setItem(name, JSON.stringify(parsedItems))
        }else{
            const exitingItemIndex = parsedItems.findIndex(pItem => pItem.fileDetail.media?.id === value.fileDetail.media?.id)
            if(exitingItemIndex > -1){
                parsedItems[exitingItemIndex] = value
            }else{
                parsedItems.pop()
                parsedItems.unshift(value)
            }
            localStorage.setItem(name, JSON.stringify(parsedItems))
        }
      
    }else{
        localStorage.setItem(name, JSON.stringify([value]))
    }
}
export function getRecentlyPlayed(){
    const recentlyPlayedItems = localStorage.getItem(PathKey.RECENTLY_PLAYED)
    if(recentlyPlayedItems){
        const parsedItems: {time: number, fileDetail: ICurrentlyPlaying}[] = JSON.parse(recentlyPlayedItems)
        parsedItems.sort((item1, item2) =>(item2.time - item1.time))
        const items = parsedItems.map(pI => {
            return {
                id: pI.fileDetail.media?.id,
                file: pI.fileDetail.media?.file
            }
        })
        return items
    }
    return null
}
export function getLocalStorageValue(name: PathKey){
  const items = localStorage.getItem(name);
  return items?.split(';').filter(Boolean) || []
}
