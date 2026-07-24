import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { MdDelete, MdFolderOpen, MdOutlineAudioFile, MdOutlineTheaters, MdPlaylistAdd } from "react-icons/md";
import { windowObj } from "../../electrone-api";
import { applyAppTheme, getLocalStorageValue, getStoredAppTheme, removeLocalStoragePath, setStoredAppTheme, updateLocalStoragePaths } from "../../helper";
import { AppThemeMode, IOption, IPlayListDetail, PathKey } from "../../types";
import FolderPickerButton from "../../widgets/button/FolderPickerButton";
import Select from "../../widgets/select/Select";

Settings.displayName = 'Settings';
export default function Settings(){
    const [themeMode, setThemeMode] = useState<AppThemeMode>(AppThemeMode.AUTO);
    const [audioFolders, setAudioFolders] = useState<string[]>([]);
    const [videoFolders, setVideoFolders] = useState<string[]>([]);
    const [playLists, setPlayLists] = useState<IPlayListDetail[]>([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    const themeOptions = useMemo<IOption[]>(() => [
        { value: AppThemeMode.AUTO, label: 'Auto' },
        { value: AppThemeMode.LIGHT, label: 'Light' },
        { value: AppThemeMode.DARK, label: 'Dark' }
    ], []);

    const selectedThemeLabel = themeOptions.find(option => option.value === themeMode)?.label || 'Auto';

    const loadFolders = () => {
        setAudioFolders(getLocalStorageValue(PathKey.AUDIOPATH));
        setVideoFolders(getLocalStorageValue(PathKey.VIDEOPATH));
    }

    const loadPlayLists = async () => {
        const allPlayLists = await windowObj.electronAPI.getAllPlayList();
        setPlayLists(allPlayLists);
    }

    const getFolderName = (folderPath: string) => {
        return folderPath.split(/[\\/]/).filter(Boolean).pop() || folderPath;
    }

    const handleThemeChange = (option: IOption) => {
        const nextThemeMode = option.value as AppThemeMode || AppThemeMode.AUTO;
        setThemeMode(nextThemeMode);
        setStoredAppTheme(nextThemeMode);
        window.dispatchEvent(new Event('app-theme-change'));
    }

    const addMediaFolder = (pathKey: PathKey, folderPath: string) => {
        updateLocalStoragePaths(pathKey, folderPath);
        loadFolders();
    }

    const removeMediaFolder = (pathKey: PathKey, folderPath: string) => {
        removeLocalStoragePath(pathKey, folderPath);
        loadFolders();
    }

    const handleCreatePlaylist = async () => {
        const trimmedName = newPlaylistName.trim();
        if(!trimmedName) return;

        const exists = playLists.some(playList => playList.name.toLowerCase() === trimmedName.toLowerCase());
        if(exists){
            alert('Playlist already exists!');
            return;
        }

        await windowObj.electronAPI.handleCreateAlbum(trimmedName, []);
        setNewPlaylistName('');
        loadPlayLists();
    }

    const handleDeletePlaylist = async (playlistName: string) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the playlist "${playlistName}"?`);
        if(!confirmDelete) return;

        await windowObj.electronAPI.handleDeletePlayList(playlistName);
        loadPlayLists();
    }

    useEffect(() => {
        const storedTheme = getStoredAppTheme();
        setThemeMode(storedTheme);
        applyAppTheme(storedTheme);
        loadFolders();
        loadPlayLists();
    }, [])

    return (
        <div className="app-content-height overflow-auto w-full p-4">
            <div className="max-w-5xl">
                <div className="mb-5">
                    <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100">Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage appearance, media folders, and playlists.</p>
                </div>

                <section className="mb-4 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <div className="flex items-center justify-between gap-4 p-4">
                        <div>
                            <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">Appearance</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Use a fixed theme or follow the system automatically.</p>
                        </div>
                        <Select
                            name="themeMode"
                            options={themeOptions}
                            selectedValue={selectedThemeLabel}
                            onChange={handleThemeChange}
                            label="Theme"
                        />
                    </div>
                </section>

                <FolderSection
                    title="Audio Gallery"
                    description="Folders scanned for audio files."
                    folders={audioFolders}
                    emptyLabel="No audio folders added."
                    addLabel="Add Audio Folder"
                    icon={MdOutlineAudioFile}
                    onFolderSelected={(folderPath) => addMediaFolder(PathKey.AUDIOPATH, folderPath)}
                    onRemoveFolder={(folderPath) => removeMediaFolder(PathKey.AUDIOPATH, folderPath)}
                    getFolderName={getFolderName}
                />

                <FolderSection
                    title="Video Gallery"
                    description="Folders scanned for video files."
                    folders={videoFolders}
                    emptyLabel="No video folders added."
                    addLabel="Add Video Folder"
                    icon={MdOutlineTheaters}
                    onFolderSelected={(folderPath) => addMediaFolder(PathKey.VIDEOPATH, folderPath)}
                    onRemoveFolder={(folderPath) => removeMediaFolder(PathKey.VIDEOPATH, folderPath)}
                    getFolderName={getFolderName}
                />

                <section className="mb-4 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 dark:border-slate-800 p-4">
                        <div>
                            <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">Playlists</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create or remove playlists from one place.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Playlist name"
                                value={newPlaylistName}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPlaylistName(event.target.value)}
                                className="p-1.5 px-2 text-sm rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 w-[200px]"
                            />
                            <button
                                onClick={handleCreatePlaylist}
                                className="p-1.5 px-3 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center"
                            >
                                <MdPlaylistAdd className="mr-1 text-lg" />
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="p-2">
                        {playLists.length === 0 && (
                            <div className="px-2 py-6 text-sm text-slate-500 dark:text-slate-400">No playlists created.</div>
                        )}
                        {playLists.map(playList => (
                            <div key={playList.path} className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">
                                <div className="min-w-0 flex items-center">
                                    <MdPlaylistAdd className="mr-2 h-5 w-5 shrink-0 text-purple-700 dark:text-purple-300" />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{playList.name}</p>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{playList.path}</p>
                                    </div>
                                </div>
                                <button
                                    aria-label={`Remove ${playList.name}`}
                                    onClick={() => handleDeletePlaylist(playList.name)}
                                    className="rounded-md p-1.5 text-slate-600 hover:bg-slate-200 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                                >
                                    <MdDelete className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

interface IFolderSection{
    title: string;
    description: string;
    folders: string[];
    emptyLabel: string;
    addLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    onFolderSelected: (folderPath: string) => void;
    onRemoveFolder: (folderPath: string) => void;
    getFolderName: (folderPath: string) => string;
}

function FolderSection(props: IFolderSection){
    const SectionIcon = props.icon;

    return (
        <section className="mb-4 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 dark:border-slate-800 p-4">
                <div>
                    <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">{props.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{props.description}</p>
                </div>
                <FolderPickerButton
                    label={props.addLabel}
                    onFolderSlected={props.onFolderSelected}
                    icon={MdFolderOpen}
                />
            </div>
            <div className="p-2">
                {props.folders.length === 0 && (
                    <div className="px-2 py-6 text-sm text-slate-500 dark:text-slate-400">{props.emptyLabel}</div>
                )}
                {props.folders.map(folderPath => (
                    <div key={folderPath} className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-900">
                        <div className="min-w-0 flex items-center">
                            <SectionIcon className="mr-2 h-5 w-5 shrink-0 text-purple-700 dark:text-purple-300" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{props.getFolderName(folderPath)}</p>
                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{folderPath}</p>
                            </div>
                        </div>
                        <button
                            aria-label={`Remove ${props.getFolderName(folderPath)}`}
                            onClick={() => props.onRemoveFolder(folderPath)}
                            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-200 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                        >
                            <MdDelete className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}
