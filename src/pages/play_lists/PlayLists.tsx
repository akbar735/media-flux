import React, { ChangeEvent, useEffect, useState } from "react";
import { windowObj } from "../../electrone-api";
import Select from "../../widgets/select/Select";
import { IFileDetail, IOption, IPlayListDetail, MediaLocation } from "../../types";
import FilePickerButton from "../../widgets/button/FilePickerButton";
import { MdAddCircleOutline, MdDelete } from "react-icons/md";
import AudioWrapper from "../../components/audio/components/AudioWrapper/AudioWrapper";
import VideoWrapper from "../../components/audio/components/VideoWrapper/VideoWrapper";
import UnsupportedWrapper from "../../components/audio/components/UnsupportedWrapper/UnsupportedWrapper";
import { getFileType, getSerializableFileDetail } from "../../helper";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addItemsToPlayList, initMediaState, togglePlayListLoop } from "../../slices/MediaSclice";
import IconButton from "../../components/IconButton/IconButton";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";

PlayLists.displayName = 'PlayLists';
export default function PlayLists(){
    const loadedFiles = useAppSelector(state => state.media[MediaLocation.PLAYLIST].playLists)
    const [playList, setPlaists] = useState<IOption[]>([]);
    const playListLoop = useAppSelector(state => state.media[MediaLocation.PLAYLIST].playListLoop)
    const [selectedPlayList, setSelectedPlaylist] = useState('');
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const dispatch = useAppDispatch();

    const onPlayListChange = (option: IOption) => {
        setSelectedPlaylist(option.label);
    }

    const loadPlayList = async () => {
        const playLists = await windowObj.electronAPI.getAllPlayList()
        setPlaists(playLists.map((item => ({
            value: item.name,
            label: item.name
        }))))
        if (playLists.length > 0) {
            setSelectedPlaylist(playLists[0].name)
        }
    }

    const handleFileSelection = async (selectedFiles: FileList | null) => {
        if (!selectedFiles || !selectedPlayList) return;
        const formattedFiles = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i] as File & { path?: string };
            if (file.path) {
                formattedFiles.push({
                    name: file.name,
                    src: file.path
                });
            }
        }
        if (formattedFiles.length > 0) {
            await windowObj.electronAPI.handleCreateAlbum(selectedPlayList, formattedFiles);
            getAllAlbums(selectedPlayList);
        }
    }

    const handleCreatePlaylist = async () => {
        const trimmed = newPlaylistName.trim();
        if (!trimmed) return;

        const exists = playList.some(item => item.label.toLowerCase() === trimmed.toLowerCase());
        if (exists) {
            alert('Playlist already exists!');
            return;
        }

        try {
            await windowObj.electronAPI.handleCreateAlbum(trimmed, []);
            setNewPlaylistName('');
            const playLists = await windowObj.electronAPI.getAllPlayList();
            setPlaists(playLists.map((item => ({
                value: item.name,
                label: item.name
            }))));
            setSelectedPlaylist(trimmed);
        } catch (error) {
            console.error('Failed to create playlist:', error);
        }
    }

    const handleDeletePlaylist = async () => {
        if (!selectedPlayList) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete the playlist "${selectedPlayList}"?`);
        if (!confirmDelete) return;

        try {
            await windowObj.electronAPI.handleDeletePlayList(selectedPlayList);
            
            // Reload playlists
            const playLists = await windowObj.electronAPI.getAllPlayList();
            const formattedPlaylists = playLists.map((item => ({
                value: item.name,
                label: item.name
            })))
            setPlaists(formattedPlaylists);
            
            // Select the first playlist if available, otherwise empty
            if (formattedPlaylists.length > 0) {
                setSelectedPlaylist(formattedPlaylists[0].label);
            } else {
                setSelectedPlaylist('');
            }
        } catch (error) {
            console.error('Failed to delete playlist:', error);
            alert('Failed to delete playlist.');
        }
    }

    const getAllAlbums = async (selectedPlayList: string) => {
        const files = await windowObj.electronAPI.getAllFiles(selectedPlayList)
  
        let fileDetailArr = files.map((file) => {
            return {
                id: file.path,
                file: getSerializableFileDetail(file)
            }
        })
        
        dispatch(initMediaState({
            location: MediaLocation.PLAYLIST,
            data: {
                playListLoop: playListLoop,
                playLists: fileDetailArr
            }
        }))
    }
    useEffect(() => {
        if(selectedPlayList){
            getAllAlbums(selectedPlayList)
        }else{
            dispatch(initMediaState({
                location: MediaLocation.PLAYLIST,
                data: {
                    playListLoop: playListLoop,
                    playLists: []
                }
            }))
        }
    }, [selectedPlayList])

    const handleTogglePlayListLoop = () => {
        dispatch(togglePlayListLoop({
            location: MediaLocation.PLAYLIST,
        }))
    }
    
    useEffect(() => {
        loadPlayList()
    }, [])
    return (
        <div className="app-content-height overflow-auto w-full p-1">
            <div className="flex justify-between items-center mb-2 px-2"> 
                {/* Left side: Add New Playlist */}
                <div className="flex items-center space-x-2">
                    <input 
                        type="text" 
                        placeholder="New Playlist Name" 
                        value={newPlaylistName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPlaylistName(e.target.value)}
                        className="p-1 px-2 text-sm rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 w-[180px]"
                    />
                    <button 
                        onClick={handleCreatePlaylist}
                        className="p-1 px-3 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center"
                    >
                        <MdAddCircleOutline className="mr-1 text-base" /> Create
                    </button>
                </div>

                {/* Right side: Loop, Delete, Open Media, Select Playlist */}
                <div className="flex items-center">
                    <IconButton style = {{alignSelf: 'center', marginRight: '10px'}} onCLick={handleTogglePlayListLoop} >
                        {playListLoop ? <TbRepeat className="h-6 w-6" />: <TbRepeatOff className="h-6 w-6"/>}
                    </IconButton>
                    {selectedPlayList && (
                        <IconButton 
                            style={{ alignSelf: 'center', marginRight: '10px' }} 
                            onCLick={handleDeletePlaylist}
                            variant="close"
                        >
                            <MdDelete className="h-6 w-6" />
                        </IconButton>
                    )}
                    {selectedPlayList && <FilePickerButton 
                        label="Open Media" 
                        onFilesSlected={handleFileSelection} 
                        multiple
                        icon = {MdAddCircleOutline}        
                    />}
                    <div className="ml-3">
                        <Select name={"playlistOptions"} 
                            options={playList} 
                            selectedValue={selectedPlayList} 
                            onChange={onPlayListChange} 
                            label="Select Album"
                        />
                    </div>
                </div>
            </div>
            <div className="media-container-height overflow-auto">
                <div className="">
                    {loadedFiles.map((fileDetail: IFileDetail) => {
                        if(getFileType(fileDetail.file.type) === 'audio'){
                            return <AudioWrapper  fileDetail = {fileDetail} location = {MediaLocation.PLAYLIST} />
                        }else if(getFileType(fileDetail.file.type) === 'video'){
                            return <VideoWrapper  fileDetail = {fileDetail} location = {MediaLocation.PLAYLIST} />
                        }else{
                            return <UnsupportedWrapper />
                        }
                    })}
                </div>
            </div>
        </div>
    )
}