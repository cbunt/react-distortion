import { ChangeEvent, useRef, useState } from 'react';

import DistortComponent, { DistortHandle } from '../src/distort-component';
import style from './styles/slider.module.css';

export type SliderState = {
    min: number,
    max: number,
    step: number,
    value: number,
};

export type SliderProps = {
    label?: string,
    onChange?: (val: number) => void,
} & Partial<SliderState>;

export function DistortSlider({
    label,
    onChange: callback,
    min = 0,
    max = 10,
    step = 1,
    value = 5,
}: SliderProps) {
    const [sliderState, setSliderState] = useState({ min, max, step, value });
    const distortionRef = useRef<DistortHandle>(null);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        let newVal = e.target.value !== '' ? parseFloat(e.target.value) : sliderState.min;
        newVal = Math.min(Math.max(newVal, sliderState.min), sliderState.max);
        if (newVal === sliderState.value) return;
        setSliderState({ ...sliderState, value: newVal });
        callback?.(newVal);
        distortionRef.current?.refreshSeed();
    };

    return (
        <DistortComponent
            as="input"
            type="range"
            className={style.dslider}
            aria-label={label}
            onChange={onChange}
            {...sliderState}
            ref={distortionRef}
            hoverFilter={{
                steps: 5,
                alternate: true,
                baseFrequency: 0.02,
                scale: 6,
            }}
            activeFilter={{
                baseFrequency: 0.02,
                scale: 6,
            }}
        />
    );
}
