/**
 * @packageDocumentation
 *
 * [![npm version](https://badge.fury.io/js/react-distortion.svg)](https://www.npmjs.com/package/react-distortion)
 * [![react-distortion bundlejs size](https://deno.bundlejs.com/badge?q=react-distortion&badge=detailed&config={"esbuild":{"external":["react","react-dom"]}})](https://bundlejs.com/?q=react-distortion&config={"esbuild":{"external":["react","react-dom"]}})
 *
 * A React component library for adding animated procedural distortion to other components.
 *
 * ![Three distorted and animated text boxes on a blue background reading "Borders! Backgrounds! The whole dang thing"](https://github.com/cbunt/react-distortion/blob/main/example-spread.gif?raw=true)
 *
 * Pure CSS and HTML Distortion, with animations in JS. All through inline SVGs,
 * [feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)
 * and [feDisplacementMap](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap)
 * elements, and CSS filters.
 */

import type { CSSProperties, ComponentProps, ElementType, Ref } from 'react';
import { forwardRef, useEffect, useId, useImperativeHandle, useReducer } from 'react';
import { createPortal } from 'react-dom';

import type {
    DOMEventName,
    DistortDOMState,
    DistortFilterOptions,
    DistortHandle,
    DistortOptions,
    Substitute,
} from './option-types';

export * from './option-types';

const enum ActionTypes { ANIMATION, REFRESH_SEED, DOM_EVENT, UPDATE_FILTERS };

type DistortAction =
    { type: ActionTypes.ANIMATION, getDistortionSeed: () => number, steps?: number }
    | { type: ActionTypes.REFRESH_SEED, seed: number, minRefresh: number, alternate?: boolean }
    | { type: ActionTypes.DOM_EVENT, event: boolean, mask: number };

type DistortState = {
    current: number,
    activated: number,
    seed: number,
    seedOffset: number,
    seedTime: number,
    alternate: boolean,
};

type HandlerRecord = Partial<Record<DOMEventName, (...args: unknown[]) => unknown>>;

const defaultProps = {
    animationInterval: undefined,
    animationJitter: undefined,
    baseFrequency: 0.015,
    disable: false,
    numOctaves: 3,
    resetSeed: false,
    scale: 5,
} as const satisfies DistortFilterOptions;

const defaultDomStates = [
    { prop: 'hoverFilter', onMouseEnter: true, onMouseLeave: false },
    { prop: 'focusFilter', onFocus: true, onBlur: false },
    { prop: 'activeFilter', onMouseDown: true, onMouseUp: false },
] as const satisfies DistortDOMState[];

const defaultAnimationInterval = 400;
const defaultDistortionSeed = () => Math.random() * (2 ** 16) | 0;

function clampToUndefined<T>(val: T) {
    return typeof val === 'number' && val <= 0 ? undefined : val;
}

function alternateProperty(
    key: keyof Exclude<DistortFilterOptions['alternate'], boolean | undefined>,
    alternate: NonNullable<DistortFilterOptions['alternate']>,
    defaultFilter?: DistortFilterOptions,
    filter?: DistortFilterOptions,
) {
    if (typeof alternate === 'object' && alternate[key] != null) return alternate[key];
    if (!alternate && filter?.[key] != null) return filter[key];
    return defaultFilter?.[key] ?? defaultProps[key];
}

function resolveFilter(
    defaultFilter: DistortFilterOptions | undefined,
    filter: DistortFilterOptions | undefined,
    alternateCurrent: boolean,
) {
    const alternate = filter?.alternate ?? defaultFilter?.alternate ?? false;
    const animationJitter = clampToUndefined(filter?.animationJitter ?? defaultFilter?.animationJitter);
    const steps = clampToUndefined(filter?.steps ?? defaultFilter?.steps);

    let animationInterval = clampToUndefined(filter?.animationInterval ?? defaultFilter?.animationInterval);
    if (alternate || steps || animationJitter) animationInterval ??= defaultAnimationInterval;

    return {
        steps,
        animationJitter,
        animationInterval,
        resetSeed: filter?.resetSeed ?? defaultFilter?.resetSeed ?? defaultProps.resetSeed,
        disable: filter?.disable ?? defaultProps.disable,
        baseFrequency: alternateProperty('baseFrequency', alternateCurrent && alternate, defaultFilter, filter),
        scale: alternateProperty('scale', alternateCurrent && alternate, defaultFilter, filter),
        numOctaves: alternateProperty('numOctaves', alternateCurrent && alternate, defaultFilter, filter),
    };
}

function wrapHandlers(
    spec: { filter: DistortFilterOptions, events: Partial<Record<DOMEventName, boolean>> }[],
    rest: Record<string, unknown>,
    dispatch: (action: DistortAction) => void,
) {
    const handlers: HandlerRecord = {};

    for (let i = 0; i < spec.length; ++i) {
        for (const [key, event] of Object.entries(spec[i].events)) {
            const fn = typeof rest[key] === 'function'
                ? rest[key] as (...args: unknown[]) => unknown
                : undefined;

            handlers[key as DOMEventName] = (...e: unknown[]) => {
                dispatch({ type: ActionTypes.DOM_EVENT, event, mask: 1 << i });
                fn?.(...e);
            };
        }
    }

    return handlers;
}

function reducer(state: DistortState, action: DistortAction): DistortState {
    switch (action.type) {
        case ActionTypes.REFRESH_SEED: {
            if (Date.now() - state.seedTime < action.minRefresh) return state;

            return {
                ...state,
                seedTime: Date.now(),
                seed: action.seed,
                seedOffset: 0,
                alternate: action.alternate ?? state.alternate,
            };
        }
        case ActionTypes.ANIMATION: {
            return {
                ...state,
                alternate: !state.alternate,
                seed: action.steps != null
                    ? state.seed
                    : action.getDistortionSeed(),
                seedTime: action.steps != null
                    ? state.seedTime
                    : Date.now(),
                seedOffset: action.steps != null
                    ? (state.seedOffset + 1) % action.steps
                    : 0,
            };
        }
        case ActionTypes.DOM_EVENT: {
            const activated = action.event
                ? state.activated | action.mask
                : state.activated & ~action.mask;

            return {
                ...state,
                activated,
                alternate: false,
                seedOffset: 0,
                current: 31 - Math.clz32(activated),
            };
        };
    }
};

function DistortComponentInternal<E extends ElementType = 'div'>({
    cssVariable = '--distortion-filter',
    getDistortionSeed = defaultDistortionSeed,
    minRefresh = 100,
    style = {},
    as,
    baseSeed,
    domStates = defaultDomStates,
    filterId,
    forwardedRef,
    defaultFilter,
    hoverFilter,
    focusFilter,
    activeFilter,
    ref: _,
    ...rest
}: Substitute<ComponentProps<E>, DistortOptions<E>> & { style?: CSSProperties }, ref: Ref<DistortHandle>) {
    const As = as ?? 'div';
    const id = useId();
    const finalId = filterId ?? id;
    const filterURL = `url(#${finalId})`;
    const propFilters = { defaultFilter, hoverFilter, activeFilter, focusFilter };

    const [{ seed, seedOffset, current, alternate }, dispatch] = useReducer(reducer, {
        activated: 0,
        current: -1,
        seed: baseSeed ?? getDistortionSeed(),
        alternate: false,
        seedOffset: 0,
        seedTime: Date.now(),
    });

    const filteredEvents = domStates.flatMap(({ filter, prop, ...events }) => {
        const resolvedFilter = filter ?? propFilters[prop];
        return resolvedFilter == null ? [] : { filter: resolvedFilter, events };
    });

    const selectedFilter = filteredEvents[current]?.filter ?? defaultFilter;

    const {
        disable,
        baseFrequency,
        scale,
        numOctaves,
        animationInterval,
        animationJitter,
        steps,
        resetSeed,
    } = resolveFilter(defaultFilter, selectedFilter, alternate);

    const joinedStyled = {
        ...style,
        [cssVariable]: filterURL,
        filter: [
            (style as { filter?: string }).filter,
            disable ? '' : filterURL,
        ].join(' ').trim(),
    };

    useImperativeHandle(ref, () => ({
        refreshSeed: (seed = getDistortionSeed()) => {
            dispatch({ type: ActionTypes.REFRESH_SEED, alternate: false, seed, minRefresh });
        },
    }), [getDistortionSeed, minRefresh]);

    useEffect(() => {
        if (!resetSeed || baseSeed == null) return;
        dispatch({ type: ActionTypes.REFRESH_SEED, seed: baseSeed, minRefresh: 0 });
    }, [current, resetSeed, baseSeed]);

    useEffect(() => {
        if (animationInterval == null) return undefined;

        const getDelay = () => typeof animationJitter === 'function'
            ? animationInterval + animationJitter()
            : animationInterval + (animationJitter ?? 0) * Math.random();

        let timeout = setTimeout(timeoutFunction, getDelay());

        function timeoutFunction() {
            dispatch({ type: ActionTypes.ANIMATION, steps, getDistortionSeed });
            timeout = setTimeout(timeoutFunction, getDelay());
        }

        return () => { clearTimeout(timeout); };
    }, [animationInterval, animationJitter, steps, getDistortionSeed]);

    return (
        <>
            <As
                style={joinedStyled}
                ref={forwardedRef}
                {...rest as ComponentProps<E>}
                {...wrapHandlers(filteredEvents, rest, dispatch)}
            />
            {createPortal((
                <svg aria-hidden style={{ width: 0, height: 0, position: 'absolute' }}>
                    <defs>
                        <filter id={finalId}>
                            <feTurbulence
                                type="fractalNoise"
                                result="noise"
                                baseFrequency={baseFrequency}
                                numOctaves={numOctaves}
                                seed={seed + seedOffset}
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                xChannelSelector="R"
                                yChannelSelector="G"
                                scale={scale}
                            />
                        </filter>
                    </defs>
                </svg>
            ), document.body)}
        </>
    );
}

/**
 * Component that distorts itself and its children.
 *
 * @typeParam E - The base component type; inferred from {@link DistortOptions.as as}.
 *
 * @remarks
 * The type of `props` is expanded to include any additional props of the component type E.
 * For example, `<DistortComponent as="a" href="..." />`.
 *
 * Existing properties of {@link DistortOptions} are not forwarded to the underlying component.
 *
 * @category Component
 */
const DistortComponent = forwardRef(DistortComponentInternal) as <E extends ElementType = 'div'>(
    props: Substitute<ComponentProps<E>, DistortOptions<E>>,
) => ReturnType<typeof DistortComponentInternal<E>>;

export default DistortComponent;
