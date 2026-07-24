export interface IMetaData{
    album: string;
    picture: {
        format: string;
        description: string;
        type: string;
        base64Image: string;
    },
    artist: string;
    title: string;
}
export interface IFileType {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    path: string;
    size: string;
    type: string;
    webkitRelativePath?: string;
}

export interface IPlayListDetail{
    name: string;
    path: string;
}

export interface ICurrentlyPlaying{
        location: MediaLocation;
        media: IFileDetail | null;
        isPlaying: boolean;
        isPlaybackOpen: boolean;
}


export interface IFileDetail{
    file: IFileType;
    id: string;
}

export enum MediaLocation{
    HOME='home',
    AUDIOGALLERY='audioGallery',
    VIDEOGALLERY='videoGallery',
    PLAYLIST='playList'
}

export enum PathKey{
    AUDIOPATH = 'audioPath',
    VIDEOPATH = 'videoPath',
    RECENTLY_PLAYED = 'recentlyPlayed'
}

export enum AppThemeMode{
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto'
}

export enum MediaMime{
    AUDIO_MIME = 'audio/*',
    VIDEO_MIME = 'video/*',
}

export enum MediaType{
    AUDIO = 'audio',
    VIDEO = 'video',
}

export interface IOption{
    value: string;
    label: string;
}

export enum KEYCODE{
    ArrowDown = 'ArrowDown',
    ArrowRight = 'ArrowRight',
    ArrowUp = 'ArrowUp',
    ArrowLeft = 'ArrowLeft',
    Space = 'Space'
}
