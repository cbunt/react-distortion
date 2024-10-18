import { ElementType } from "react";
import DistortComponent, { DistortComponentProps, DistortBorder } from "../src";

import buttonStyle from './styles/button.module.css';

function wrapExample<E extends ElementType>(baseClass: string, baseProps: DistortComponentProps<E>) {
    return function ({
        className,
        ...rest
    }: Omit<DistortComponentProps<E>, 'as'> ) {
        const name = typeof className === 'string' ? `${baseClass}, ${className}` : baseClass;
        return <DistortComponent<E> className={name} {...baseProps} {...rest} />
    }
}

export const DistortButton =  wrapExample(buttonStyle.dbutton, {
    as: 'button',
    type: 'button',
    defaultFilter: {
        mode: 'none',
        overlay: <DistortBorder />,
        scale: 5,
        baseFrequency: 0.02,
        numOctaves: 1,
    },
    hoverFilter: {
        mode: 'alternating loop',
        scale: 4,
        baseFrequency: 0.01,
    },
    activeFilter: {
        mode: 'static',
        scale: 5,
        baseFrequency: 0.01,
    },
});