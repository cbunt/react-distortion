import type { StoryDefault } from '@ladle/react';

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
        defaultFilter={{
            disable: true,
            scale: 5,
            baseFrequency: 0.02,
            numOctaves: 1,
        }}
        hoverFilter={{
            steps: 5,
            alternate: true,
            scale: 4,
            baseFrequency: 0.01,
        }}
        activeFilter={{
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
        as="input"
        type="checkbox"
        className={checkboxStyle.dcheckbox}
        defaultFilter={{ scale: 6 }}
        activeFilter={{}}
        hoverFilter={{
            steps: 5,
            alternate: true,
            scale: 4,
        }}
    />
);

export const Slider = () => (
    <DistortSlider
        min={0}
        max={1}
        step={0.01}
        value={0.5}
    />
);
