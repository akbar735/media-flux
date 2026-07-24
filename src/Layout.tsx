import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SideBar from "./components/SideBar/SideBar";
import { useAppSelector, useAppDispatch } from "./hooks";
import { ICurrentlyPlaying, MediaLocation, PathKey } from "./types";
import { getLocalStorageValue, getRecentlyPlayed, updateRecentlyPlayed } from "./helper";
import { addItemsToPlayList, initMediaState } from "./slices/MediaSclice";
import { windowObj } from "./electrone-api";

export default function Layout(){
    const currentlyOnTrack = useAppSelector(state => state.media.currentlyOnTrack)
    const dispatch = useAppDispatch();
    const isMac = windowObj.electronAPI.platform === 'darwin';
    const [isFullScreen, setIsFullScreen] = useState(false);
    const hideHeader = isMac && isFullScreen;

    useEffect(() => {
        windowObj.electronAPI.getIsFullScreen().then(setIsFullScreen);
        return windowObj.electronAPI.onFullScreenChange(setIsFullScreen);
    }, []);
    
    useEffect(() => {
        if(currentlyOnTrack.isPlaying){
            updateRecentlyPlayed(PathKey.RECENTLY_PLAYED, {
                time: new Date().getTime(),
                fileDetail: currentlyOnTrack
            })
            const recentlyPlayed = getRecentlyPlayed()
            if(recentlyPlayed){
                dispatch(initMediaState({
                    location: MediaLocation.HOME,
                    data: {
                        autoPlay: false,
                        playListLoop: false,
                        playLists: recentlyPlayed
                    }
                }))
            }
        }
    }, [currentlyOnTrack.media?.id])
    return (
        <div className={hideHeader ? 'mac-fullscreen-layout' : ''}>
            {!hideHeader && <Header />}
            <div className='flex'>
                <SideBar />
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}
