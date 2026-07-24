import React, { MouseEventHandler, CSSProperties } from "react";
import { Children } from "react";


export interface IIconButton {
    children: JSX.Element;
    variant?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    style?: CSSProperties;
}
export default function IconButton(props: IIconButton) {
    const element = Children.only(props.children);
    const className = `
    inline-block 
    p-1
    rounded-full
    cursor-pointer
    [-webkit-app-region:no-drag]
    ${props.variant === 'close'
            ? 'hover:bg-red-600 hover:text-white'
            : props.variant === 'snap'
                ? 'hover:bg-slate-800/75 text-white hover:text-white'
                : 'hover:bg-slate-300 dark:hover:bg-slate-800'
        }
`;
    return (

        <div onClick={props.onClick} className={className} style={props.style}>
            {element}
        </div>

    )
}