import { JSX, Ref, forwardRef, useImperativeHandle } from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import DistortComponent, { DistortHandle } from './distort-component';

const id = 'test id';
const filterRx = /url\s*\(#.*\)/;
const filterId = 'distort-filter';

const getDistort = (...[props]: Parameters<typeof DistortComponent>) => {
    const result = render(
        <DistortComponent filterId={filterId} {...props} data-testid={id} />,
        { container: document.body },
    );

    return {
        elm: result.getByTestId(id),
        feTurbulence: document.querySelector('feTurbulence'),
        feDisplacementMap: document.querySelector('feDisplacementMap'),
    };
};

type TestHandle = { check: () => boolean };

type TestProps = JSX.IntrinsicElements['div'] & {
    baseSeed?: number,
    ref?: TestHandle,
};

const TestComponent = forwardRef(function TestComponent({
    baseSeed,
    ...rest
}: TestProps, ref: Ref<TestHandle>) {
    useImperativeHandle(ref, () => ({
        check: () => true,
    }), []);

    // eslint-disable-next-line jest/no-standalone-expect
    expect(baseSeed).toBeUndefined();
    return <div {...rest} ref={undefined} id="dummy" />;
});

describe('filter states', () => {
    test('disable', () => {
        const { elm } = getDistort({ defaultFilter: { disable: true }, hoverFilter: { disable: false } });
        let style = window.getComputedStyle(elm);
        expect(style.filter).toBe('');

        fireEvent.mouseEnter(elm);
        style = window.getComputedStyle(elm);
        expect(style.filter).toMatch(filterRx);
    });

    test('fallback values', () => {
        const { elm, feTurbulence } = getDistort({
            defaultFilter: { numOctaves: 1, baseFrequency: 1 },
            hoverFilter: { numOctaves: 2 },
            activeFilter: { steps: 5 },
        });

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
        const { elm, feDisplacementMap } = getDistort({
            defaultFilter: { scale: 0 },
            hoverFilter: { scale: 1 },
            focusFilter: { scale: 2 },
            activeFilter: { scale: 3 },
        });

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

        const { elm, feTurbulence } = getDistort({
            defaultFilter: {
                alternate: true,
                animationInterval: 1,
                numOctaves: 1,
            },
            hoverFilter: {
                alternate: true,
                animationInterval: 1,
                numOctaves: 2,
            },
        });

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

    test('alternating properties', () => {
        jest.useFakeTimers();

        const { feTurbulence, feDisplacementMap } = getDistort({
            defaultFilter: {
                animationInterval: 1,
                baseFrequency: 1,
                scale: 1,
                alternate: {
                    baseFrequency: 2,
                },
            },
        });

        expect(feTurbulence?.getAttribute('numOctaves')).toBe('3');
        expect(feTurbulence?.getAttribute('baseFrequency')).toBe('1');
        expect(feDisplacementMap?.getAttribute('scale')).toBe('1');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('3');
        expect(feTurbulence?.getAttribute('baseFrequency')).toBe('2');
        expect(feDisplacementMap?.getAttribute('scale')).toBe('1');
    });

    test('filterId', () => {
        getDistort({ filterId: 'distortion' });
        const filter = document.querySelector('[id="distortion"]');
        expect(filter).not.toBe(null);
    });

    test('invalid value', () => {
        jest.useFakeTimers();

        const { feTurbulence } = getDistort({
            defaultFilter: {
                numOctaves: 1,
                animationInterval: 2,
                animationJitter: -1,
                alternate: {
                    numOctaves: 2,
                },
            },
        });

        expect(feTurbulence?.getAttribute('numOctaves')).toBe('1');
        act(() => { jest.advanceTimersByTime(1); });

        expect(feTurbulence?.getAttribute('numOctaves')).toBe('1');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('numOctaves')).toBe('2');
    });
});

describe('seed changes', () => {
    beforeEach(() => jest.useFakeTimers());

    test('animationInterval', () => {
        const { feTurbulence } = getDistort({
            defaultFilter: {
                steps: 5,
                animationInterval: 2,
            },
            baseSeed: 0,
        });

        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('1');
    });

    test('refreshSeed / getDistortionSeed', () => {
        const ref: Ref<DistortHandle> = { current: null };

        const { feTurbulence } = getDistort({
            baseSeed: 0,
            minRefresh: 0,
            ref,
            getDistortionSeed: () => 2,
        });

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

        const { feTurbulence } = getDistort({
            baseSeed: 0,
            minRefresh: 1,
            ref,
        });

        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => ref.current?.refreshSeed(1));
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        now = 1;
        act(() => ref.current?.refreshSeed(1));
        expect(feTurbulence?.getAttribute('seed')).toBe('1');
    });

    test('steps', () => {
        const seeds: (string | undefined | null)[] = [];

        const { feTurbulence } = getDistort({
            baseSeed: 0,
            minRefresh: 0,
            defaultFilter: {
                animationInterval: 1,
                steps: 3,
            },
        });

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

    test('resetSeed', () => {
        const { elm, feTurbulence } = getDistort({
            defaultFilter: {
                resetSeed: true,
                animationInterval: 1,
            },
            hoverFilter: { resetSeed: false },
            baseSeed: 0,
            minRefresh: 0,
            getDistortionSeed: () => 1,
        });

        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('1');

        fireEvent.mouseEnter(elm);
        expect(feTurbulence?.getAttribute('seed')).toBe('1');

        fireEvent.mouseLeave(elm);
        expect(feTurbulence?.getAttribute('seed')).toBe('0');
    });

    test('animationJitter', () => {
        Math.random = jest.fn(() => 1);

        const { elm, feTurbulence } = getDistort({
            defaultFilter: {
                steps: 5,
                animationInterval: 1,
                animationJitter: 1,
            },
            hoverFilter: {
                animationJitter: () => 2,
            },
            baseSeed: 0,
        });

        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('1');

        fireEvent.mouseEnter(elm);
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('0');

        act(() => { jest.advanceTimersByTime(1); });
        expect(feTurbulence?.getAttribute('seed')).toBe('1');
    });
});

describe('prop pass through', () => {
    test('events', () => {
        const succeed = jest.fn(() => {});

        const { elm } = getDistort({
            hoverFilter: { disable: true },
            onMouseEnter: succeed,
            onMouseLeave: succeed,
            onFocus: succeed,
            onBlur: succeed,
            onMouseDown: succeed,
            onMouseUp: succeed,
        });

        fireEvent.mouseEnter(elm);
        expect(succeed).toHaveBeenCalledTimes(1);

        const style = window.getComputedStyle(elm);
        expect(style.filter).toBe('');

        fireEvent.mouseLeave(elm);
        expect(succeed).toHaveBeenCalledTimes(2);

        fireEvent.focus(elm);
        expect(succeed).toHaveBeenCalledTimes(3);

        fireEvent.blur(elm);
        expect(succeed).toHaveBeenCalledTimes(4);

        fireEvent.mouseDown(elm);
        expect(succeed).toHaveBeenCalledTimes(5);

        fireEvent.mouseUp(elm);
        expect(succeed).toHaveBeenCalledTimes(6);
    });

    test('css filter', () => {
        const filter = 'brightness(90%)';

        const { elm } = getDistort({
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
        const { elm } = getDistort({ style: { color } });
        const style = window.getComputedStyle(elm);
        expect(style.color).toMatch(color);
    });

    test('forwardRef', () => {
        const ref: Ref<TestHandle> = { current: null };
        render(<DistortComponent as={TestComponent} forwardedRef={ref} />);
        expect(ref.current?.check()).toBeTruthy();
    });

    test('as props', () => {
        const { elm } = getDistort({ as: 'a', href: './' });
        expect(elm.tagName).toBe('A');
        expect(elm.getAttribute('href')).toBe('./');
    });

    test('overlapping', () => {
        const ref: Ref<DistortHandle & TestHandle> = { current: null };

        getDistort({
            baseSeed: 0,
            ref,
            as: TestComponent,
        });

        expect(ref.current?.refreshSeed).toBeDefined();
        expect(ref.current?.check).toBeUndefined();
    });
});
