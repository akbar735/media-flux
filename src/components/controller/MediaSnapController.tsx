import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {useAppDispatch, useAppSelector } from "../../hooks";
import { IMetaData } from "../../types";
import Controllers from "./Controllers";
import './MediaController.css'
import IconButton from "../IconButton/IconButton";
import { TbRepeat, TbRepeatOff, TbVolume, TbVolume2, TbVolume3 } from "react-icons/tb";
import { toggleLoop } from "../../slices/MediaSclice";

export interface IMediaSnapController{
    getFirsEndPoint: string;
    currentTime:  number | null;
    totalDuration:  number | null;
    volume: number | null;
    updateCurrentTime:  (event: ChangeEvent<HTMLInputElement>) => void;
    updateMediaVolume: (event: ChangeEvent<HTMLInputElement>) => void;
    rewindFiveSeconds: VoidFunction;
    forwardFiveSeconds: VoidFunction;
    toggleVolume: VoidFunction;
    metaData: IMetaData | undefined;
    getLastEndPoint: string;
    toggleVideoPlayBack: VoidFunction;
    isVideoInFullScreen: () => boolean;
    playPrevious: VoidFunction;
    playNext: VoidFunction;
}
MediaSnapController.displayName = 'MediaSnapController';
export default function MediaSnapController(props: IMediaSnapController){
    const dispatch = useAppDispatch();
    const file =  useAppSelector(state => state.media.currentlyOnTrack.media?.file);
    const [cpbWidth, setCpbWidth] = useState(0);
    const loop = useAppSelector(state => state.media.currentlyOnTrack.loop)
    const [onePixelRateInSec, setOnePixelRateInSec] = useState(0);
    const [pbWidth, setPbWidth] = useState(0)
    const pbRef = useRef(null);

    const updatePbWidth = useCallback(() =>{
        const ele = pbRef.current
        if(ele){
            const widthInPx: string = window.getComputedStyle(ele).getPropertyValue('width');
            const width = Number(widthInPx.substring(0, widthInPx.length-2))
            setPbWidth(width);
        }

    }, [pbRef, setPbWidth])
    
    
    const handleToggleLoop = () => {
        dispatch(toggleLoop())
    }
    useEffect(() => {
        if(props.currentTime) {
            setCpbWidth(onePixelRateInSec * props.currentTime)
        }else{
            setCpbWidth(0)
        }
    }, [props.currentTime, onePixelRateInSec])
    

    useEffect(() => {
        if(pbRef.current){
            updatePbWidth()
        }
    }, [pbRef, updatePbWidth])

    useEffect(() => {
        window.addEventListener('resize', updatePbWidth);
        return () => {
            window.removeEventListener('resize', updatePbWidth);
        }
    }, [pbRef])

    useEffect(() => {
        if(props.totalDuration && pbWidth){
            setOnePixelRateInSec(pbWidth / props.totalDuration);
        }
    },[pbWidth, props.totalDuration])
    
    return (
        <div className='h-89 media-tranparency'>
            <div className="flex mt-3" >
                <div className="ml-2 mr-2 text-white">{props.getFirsEndPoint}</div>
                <div className="w-full relative h-[3px] mt-[11px] bg-slate-800/50">
                <div className="absolute h-[3px] bg-white" style={{width: cpbWidth}}></div>
                    <input 
                        ref={pbRef}
                        className="brogress-bar brogress-bar-snap absolute" 
                        type="range" 
                        value={props.currentTime || 0}
                        min={0}
                        step={0.1}
                        max={props.totalDuration || 0}
                        onChange={props.updateCurrentTime}
                    />
                </div>
                
                <div className="ml-2 mr-2 text-white">{props.getLastEndPoint}</div>
            </div>
            <div className="flex justify-center">
                <div className={`min-w-[120px] w-full ml-2 flex items-center ${!props.isVideoInFullScreen() ? 'cursor-pointer': 'cursor-default'}`}>   
                    <div 
                        onClick={props.toggleVideoPlayBack}
                        className="text-white max-w-[420px] ml-2 mr-2 h-full leading-[320%] px-1 overflow-hidden text-ellipsis whitespace-nowrap hover:bg-slate-900/75 rounded-md" 
                        title={props.metaData?.title ? props.metaData?.title : file?.name}>{props.metaData?.title ? props.metaData?.title : file?.name}
                    </div>
                </div>
                <div className="flex justify-center">
                    <Controllers buttonVariant="snap"
                        rewindFiveSeconds={props.rewindFiveSeconds}
                        forwardFiveSeconds={props.forwardFiveSeconds} 
                        playPrevious={props.playPrevious} 
                        playNext={props.playNext}                    
                    />
                </div>
                <div className="w-full flex justify-between items-center">  
                    <IconButton style = {{alignSelf: 'center', marginLeft: '30px'}} variant="snap"  onClick={handleToggleLoop} >
                        {loop ? <TbRepeat className="h-6 w-6" />: <TbRepeatOff className="h-6 w-6"/>}
                    </IconButton>
                    <div className="flex justify-between items-center">
                        <IconButton  style = {{alignSelf: 'center', marginRight: '10px'}} variant="snap" onClick={props.toggleVolume} >
                            <div>
                                {(props.volume?? 0) === 0 ? <TbVolume3 className="h-6 w-6" />: ''}
                                {(props.volume?? 0) > 0 && (props.volume?? 0) <= 0.5 ? <TbVolume2 className="h-6 w-6" />: ''}
                                {(props.volume?? 0) > 0.5 ? <TbVolume className="h-6 w-6" />: ''}
                            </div>
                        </IconButton>
                        <div className="w-16 relative h-[3px] bg-slate-800/50 mr-3">
                            <div className="absolute h-[3px] bg-white" style={{width: (props.volume??0) * 64}}></div>
                                <input 
                                    className="brogress-bar brogress-bar-snap absolute" 
                                    type="range" 
                                    value={props.volume || 0}
                                    min={0}
                                    step={0.01}
                                    max={1}
                                    onChange={props.updateMediaVolume}
                                />
                            </div>
                        </div>
                    
                </div>
            </div>
        </div>
    )
}