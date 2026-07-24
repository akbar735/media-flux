import React, { useEffect } from "react";
import IconButton from "../IconButton/IconButton";
import { MdForward5, MdNavigateBefore, MdNavigateNext, MdPauseCircleOutline, MdPlayCircleOutline, MdReplay5 } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setIsPlaying } from "../../slices/MediaSclice";
import { KEYCODE } from "../../types";

export interface IControllers{
    buttonVariant?: string;
    playPrevious: VoidFunction;
    playNext: VoidFunction;
    rewindFiveSeconds: VoidFunction;
    forwardFiveSeconds: VoidFunction;
}
export default function Controllers(props: IControllers){

    const isPlaying =  useAppSelector(state => state.media.currentlyOnTrack.isPlaying);
  
    const dispatch = useAppDispatch();
    
    const playMedia = () => {
        dispatch(setIsPlaying({
            isPlaying: true
        }))
    }
    const pauseMedia = () => {
        dispatch(setIsPlaying({
            isPlaying: false
        }))
    }
    
    const HandleOnKeyDown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }
        if(event.ctrlKey){
           if(event.code === KEYCODE.ArrowLeft){
                props.playPrevious();
           }else if(event.code === KEYCODE.ArrowRight){
                props.playNext();
           }
        }else{
            if(event.code === KEYCODE.ArrowLeft){
                props.rewindFiveSeconds();
            }else if(event.code === KEYCODE.ArrowRight){
                props.forwardFiveSeconds();
            }else if(event.code === KEYCODE.Space){
                if(isPlaying){
                    pauseMedia()
                }else{
                    playMedia()
                }
            }
        }
    }
   
    useEffect(() => {
        window.addEventListener('keydown', HandleOnKeyDown)
        return () => {
            window.removeEventListener('keydown', HandleOnKeyDown)
        }
    }, [HandleOnKeyDown]);

    return <div className="flex">
            <IconButton style = {{alignSelf: 'center'}} variant={props.buttonVariant} onCLick={props.rewindFiveSeconds} >
                <MdReplay5 className="h-6 w-6" />
            </IconButton>
            <IconButton style = {{alignSelf: 'center'}} variant={props.buttonVariant} onCLick={props.playPrevious}>
                <MdNavigateBefore className="h-6 w-6" />
            </IconButton>
            <IconButton variant={props.buttonVariant}>
                {!isPlaying ? <MdPlayCircleOutline onClick={playMedia} className="h-11 w-11 block" />:
                    <MdPauseCircleOutline onClick={pauseMedia} className="h-11 w-11 block" />}
            </IconButton>
            <IconButton style = {{alignSelf: 'center'}} variant={props.buttonVariant} onCLick={props.playNext}>
                <MdNavigateNext className="h-6 w-6" />
            </IconButton>
            <IconButton style = {{alignSelf: 'center'}} variant={props.buttonVariant} onCLick={props.forwardFiveSeconds}>
                <MdForward5 className="h-6 w-6" />
            </IconButton>
    </div>
}