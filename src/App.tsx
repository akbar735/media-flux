import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import { pagePath } from "./contants/page";
import AudioGallery from "./pages/audio_gallery/AudioGallery";
import VideoGallery from "./pages/video_gallery/VideoGallery";
import Settings from "./pages/settings/Settings";
import { useAppSelector } from "./hooks";
import PlayLists from "./pages/play_lists/PlayLists";
import { applyAppTheme, getStoredAppTheme } from "./helper";

App.displayName = 'App';
export default function App(){
    const state = useAppSelector(state => state)
    console.log("state:::", state)

    useEffect(() => {
        const syncTheme = () => applyAppTheme(getStoredAppTheme());
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        syncTheme();
        mediaQuery.addEventListener('change', syncTheme);
        window.addEventListener('app-theme-change', syncTheme);

        return () => {
            mediaQuery.removeEventListener('change', syncTheme);
            window.removeEventListener('app-theme-change', syncTheme);
        }
    }, [])

    return (
        <div className="bg-slate-100 dark:bg-gray-950 dark:text-white h-screen">
            <HashRouter>
                <Routes>
                    <Route path={pagePath.HOME} element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path={pagePath.AUDIOGALLERY} element={<AudioGallery />} />
                        <Route path={pagePath.VIDEOGALLERY} element={<VideoGallery />} />
                        <Route path={pagePath.PLAYLIST} element={<PlayLists />} />
                        <Route path={pagePath.SETTINGS} element={<Settings />} />
                    </Route>
                </Routes>
            </HashRouter>
        </div>
    )
}
