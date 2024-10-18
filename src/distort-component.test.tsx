import { CSSProperties, ReactNode, Ref, forwardRef, useImperativeHandle } from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import DistortComponent, { DistortHandle } from './distort-component';

const id = 'test id';
const filterRx = /url\s*\(#.*\)/;

const getDistort = (...[props]: Parameters<typeof DistortComponent>) => {
    const result = render(<DistortComponent {...props} data-testid={id} />);
    return result.getByTestId(id);
};

type TestHandle = { check: () => boolean };
type TestProps = {
    baseSeed?: number,
    children?: ReactNode,
    style?: CSSProperties,
    'data-testid'?: string,
};

const TestComp = forwardRef(function TestComp({
    baseSeed,
    ...rest
}: TestProps, ref: Ref<TestHandle>) {
    useImperativeHandle(ref, () => ({
        check: () => true,
    }), []);

    expect(baseSeed).toBeUndefined();
    return <div {...rest} id="dummy" />;
});

describe('filter states', () => {
    test('disable', () => {
        const elm = getDistort({ hoverFilter: { disable: true } });
        let style = window.getComputedStyle(elm);
        expect(style.filter).toMatch(filterRx);

        fireEvent.mouseEnter(elm);
        style = window.getComputedStyle(elm);
        expect(style.filter).toBe('');
    });

    test('distortChildren', () => {
        const result = render(
            <DistortComponent
                defaultFilter={{ disable: true }}
                distortChildren={<div data-testid={id} />}
            />,
        );
        const child = result.getByTestId(id);
        const style = window.getComputedStyle(child);
        expect(style.filter).toMatch(filterRx);
    });

    test('fallback values', () => {
        const elm = getDistort({
            defaultFilter: { numOctaves: 1, baseFrequency: 1 },
            hoverFilter: { numOctaves: 2 },
            activeFilter: 'loop',
        });

        const feTurbulence = elm.querySelector('feTurbulence');
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('1');
        expect(feTurbulence?.getAttribute('baseFrequency')).toBe('1');

        fireEvent.mouseEnter(elm);
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('2');
        expect(feTurbulence?.getAttribute('baseFrequency')).toBe('1');

        fireEvent.mouseDown(elm);
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('1');
        expect(feTurbulence?.getAttribute('baseFrequency')).toBe('1');
    });

    test('precedence', () => {
        const elm = getDistort({
            defaultFilter: { scale: 0 },
            hoverFilter: { scale: 1 },
            focusFilter: { scale: 2 },
            activeFilter: { scale: 3 },
        });

        const feDisplacementMap = elm.querySelector('feDisplacementMap');
        expect(feDisplacementMap?.getAttribute('scale')).toBe('0');

        fireEvent.mouseEnter(elm);
        expect(feDisplacementMap?.getAttribute('scale')).toBe('1');

        fireEvent.focus(elm);
        expect(feDisplacementMap?.getAttribute('scale')).toBe('2');

        fireEvent.mouseDown(elm);
        expect(feDisplacementMap?.getAttribute('scale')).toBe('3');

        fireEvent.blur(elm);
        expect(feDisplacementMap?.getAttribute('scale')).toBe('3');

        fireEvent.mouseLeave(elm);
        expect(feDisplacementMap?.getAttribute('scale')).toBe('3');

        fireEvent.focus(elm);
        fireEvent.mouseUp(elm);
        expect(feDisplacementMap?.getAttribute('scale')).toBe('2');

        fireEvent.mouseEnter(elm);
        expect(feDisplacementMap?.getAttribute('scale')).toBe('2');

        fireEvent.blur(elm);
        expect(feDisplacementMap?.getAttribute('scale')).toBe('1');
    });

    test('alternating', () => {
        jest.useFakeTimers();

        const elm = getDistort({
            defaultFilter: {
                animation: 'alternating endless',
                animationInterval: 1,
                numOctaves: 1,
            },
            hoverFilter: {
                animation: 'alternating endless',
                animationInterval: 1,
                numOctaves: 2,
            },
        });

        const feTurbulence = elm.querySelector('feTurbulence');
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('1');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('1');

        fireEvent.mouseEnter(elm);
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('2');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('1');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('2');
    });

    test('distortChildren as component', () => {
        const elm = getDistort({ distortChildren: TestComp });
        const child = elm.querySelector('[id="dummy"]');
        expect(child).toBeDefined();

        const style = window.getComputedStyle(child as Element);
        expect(style.filter).toMatch(filterRx);
    });
});

describe('seed changes', () => {
    beforeEach(() => jest.useFakeTimers());

    test('animationInterval', () => {
        const elm = getDistort({
            defaultFilter: {
                animation: 'loop',
                animationInterval: 2,
            },
            baseSeed: 0,
        });

        const feTurbulence = elm.querySelector('feTurbulence');
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('1');
    });

    test('refreshSeed / getDistortionSeed', () => {
        const ref: Ref<DistortHandle> = { current: null };

        const elm = getDistort({
            baseSeed: 0,
            minRefresh: 0,
            ref,
            getDistortionSeed: () => 2,
        });

        const feTurbulence = elm.querySelector('feTurbulence');
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { ref.current?.refreshSeed(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('1');

        act(() => { ref.current?.refreshSeed(); });
        expect(feTurbulence?.getAttribute('seed')).toBe('2');
    });

    test('minRefresh', () => {
        let now = 0;
        Date.now = jest.fn(() => now);

        jest.setSystemTime(0);

        const ref: Ref<DistortHandle> = { current: null };

        const elm = getDistort({
            baseSeed: 0,
            minRefresh: 1,
            ref,
        });

        const feTurbulence = elm.querySelector('feTurbulence');
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => ref.current?.refreshSeed(1));
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        now = 1;
        act(() => ref.current?.refreshSeed(1));
        expect(feTurbulence?.getAttribute('seed')).toBe('1');
    });

    test('steps', () => {
        const seeds: (string | undefined | null)[] = [];

        const elm = getDistort({
            baseSeed: 0,
            minRefresh: 0,
            defaultFilter: {
                animationInterval: 1,
                animation: 'loop',
                steps: 3,
            },
        });

        const feTurbulence = elm.querySelector('feTurbulence');
        seeds.push(feTurbulence?.getAttribute('seed'));

        act(() => { jest.advanceTimersByTime(1); });
        seeds.push(feTurbulence?.getAttribute('seed'));

        act(() => { jest.advanceTimersByTime(1); });
        seeds.push(feTurbulence?.getAttribute('seed'));

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe(seeds[0]);

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe(seeds[1]);

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe(seeds[2]);
    });

    test('disabled with distortChildren', () => {
        const elm = getDistort({
            baseSeed: 0,
            minRefresh: 0,
            defaultFilter: {
                disable: true,
                animationInterval: 1,
                animation: 'loop',
            },
            distortChildren: <div />,
        });

        const feTurbulence = elm.querySelector('feTurbulence');
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('1');
    });

    test('resetSeed', () => {
        const elm = getDistort({
            defaultFilter: {
                animation: 'endless',
                resetSeed: true,
                animationInterval: 1,
            },
            hoverFilter: { resetSeed: false },
            baseSeed: 0,
            minRefresh: 0,
            getDistortionSeed: () => 1,
        });

        const feTurbulence = elm.querySelector('feTurbulence');
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('1');

        fireEvent.mouseEnter(elm);
        expect(feTurbulence?.getAttribute('seed')).toBe('1');

        fireEvent.mouseLeave(elm);
        expect(feTurbulence?.getAttribute('seed')).toBe('0');
    });

    test('static', () => {
        const elm = getDistort({
            defaultFilter: { animationInterval: 1 },
            baseSeed: 0,
            minRefresh: 0,
            getDistortionSeed: () => 1,
        });

        const feTurbulence = elm.querySelector('feTurbulence');
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('0');
    });
});

describe('prop pass through', () => {
    test('events', () => {
        let success = false;

        const elm = getDistort({
            hoverFilter: { disable: true },
            onMouseEnter: () => { success = true; },
        });

        fireEvent.mouseEnter(elm);
        expect(success).toBeTruthy();

        const style = window.getComputedStyle(elm);
        expect(style.filter).toBe('');
    });

    test('css filter', () => {
        const filter = 'brightness(90%)';

        const elm = getDistort({
            style: { filter },
            focusFilter: { disable: true },
        });

        let style = window.getComputedStyle(elm);
        expect(style.filter).toMatch(filter);
        expect(style.filter).toMatch(filterRx);

        fireEvent.focus(elm);
        style = window.getComputedStyle(elm);
        expect(style.filter).toMatch(filter);
        expect(style.filter).not.toMatch(filterRx);
    });

    test('misc style', () => {
        const color = 'red';
        const elm = getDistort({ style: { color } });
        const style = window.getComputedStyle(elm);
        expect(style.color).toMatch(color);
    });

    test('forwardRef', () => {
        const ref: { current: TestHandle | null } = { current: null };
        render(<DistortComponent as={TestComp} forwardedRef={ref} />);
        expect(ref.current?.check()).toBeTruthy();
    });

    test('as props', () => {
        const elm = getDistort({ as: 'a', href: './' });
        expect(elm.tagName).toBe('A');
        expect(elm.getAttribute('href')).toBe('./');
    });

    test('overlapping', () => {
        const ref: Ref<DistortHandle & TestHandle> = { current: null };

        getDistort({
            baseSeed: 0,
            ref,
            as: TestComp,
        });

        expect(ref.current?.refreshSeed).toBeDefined();
        expect(ref.current?.check).toBeUndefined();
    });

    test('distortChildren style', () => {
        const childComp = <TestComp style={{ color: 'red' }} />;
        const elm = getDistort({ distortChildren: childComp });
        const child = elm.querySelector('[id="dummy"]');
        expect(child).toBeDefined();

        const style = window.getComputedStyle(child as Element);
        expect(style.color).toBe('red');
    });
});
