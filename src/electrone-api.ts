import { IFileType, IMetaData, IPlayListDetail } from "./types";

export const windowObj = window as typeof window & {
    electronAPI: { 
        getFiles: (arg0: string[], arg1: string) => IFileType[],
        getFileMetaData: (url: string) => IMetaData,
        closeWindow: VoidFunction,
        minimizeWindow: VoidFunction,
        maximizeWindow: VoidFunction,
        getFolderPath: () => string,
        getAllPlayList: () => IPlayListDetail[],
        getAllFiles: (arg0: string) => IFileType[],
        handleCreateAlbum: (albumName: string, formattedFiles: { name: string, src: string }[]) => Promise<string>,
        handleDeletePlayList: (playlistName: string) => Promise<string>,
        platform: string
    }
};