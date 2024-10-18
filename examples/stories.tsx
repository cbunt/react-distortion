import type { StoryDefault } from '@ladle/react';

import { DistortBackground, DistortBorder } from '../src/child-elements';
import DistortComponent from '../src/distort-component';
import { DistortSlider } from './slider';

import buttonStyle from './styles/button.module.css';
import checkboxStyle from './styles/checkbox.module.css';
import textStyle from './styles/text.module.css';

export default { title: 'Examples' } satisfies StoryDefault;

export const Button = () => (
    <DistortComponent
        as="button"
        type="button"
        className={buttonStyle.dbutton}
        distortChildren={DistortBorder}
        defaultFilter={{
            disable: true,
            scale: 5,
            baseFrequency: 0.02,
            numOctaves: 1,
        }}
        hoverFilter={{
            animation: 'alternating loop',
            scale: 4,
            baseFrequency: 0.01,
        }}
        activeFilter={{
            animation: 'static',
            scale: 5,
            baseFrequency: 0.01,
        }}
    >
        Button
    </DistortComponent>
);

export const TextBackground = () => (
    <DistortComponent
        className={textStyle.dtext}
        defaultFilter={{
            scale: 10,
            disable: true,
        }}
        distortChildren={DistortBackground}
    >
        {`
The background of the
div will be distorted
but this text won't be.
`}
    </DistortComponent>
);
TextBackground.storyName = 'Text Background';

export const Checkbox = () => (
    <DistortComponent
        defaultFilter={{ scale: 6 }}
        activeFilter={{ animation: 'static' }}
        hoverFilter={{
            animation: 'alternating loop',
            scale: 4,
        }}
    >
        <input
            type="checkbox"
            className={checkboxStyle.dcheckbox}
        />
    </DistortComponent>
);

export const Slider = () => (
    <DistortSlider
        min={0}
        max={1}
        step={0.01}
        value={0.5}
    />
);
