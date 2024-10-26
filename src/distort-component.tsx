/**
 * @packageDocumentation
 *
 * [![npm version](https://badge.fury.io/js/react-distortion.svg)](https://www.npmjs.com/package/react-distortion)
 * [![react-distortion bundlejs size](https://deno.bundlejs.com/badge?q=react-distortion&badge=detailed)](https://bundlejs.com/?q=react-distortion)
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

import {
    CSSProperties,
    Children,
    ComponentProps,
    ElementRef,
    ElementType,
    ReactElement,
    ReactHTML,
    Ref,
    cloneElement,
    forwardRef,
    isValidElement,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';

function definedProperties<T extends object>(obj: T) {
    const res = {} as T;
    for (const key of Object.keys(obj) as (keyof T)[]) {
        if (obj[key] != null) {
            res[key] = obj[key];
        }
    }
    return res as { [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] };
}

function joinFilterToStyle(filterURL: string, style?: CSSProperties): CSSProperties {
    // Explicit cast to suppress: error TS2339: Property 'filter' does not exist on type 'CSSProperties'
    // during build. No idea why it's necessary. It goes away when using import('csstype').Properties
    // directly rather than the react alias. Checked 26-10-2024.
    const cast = (style ?? {}) as CSSProperties & { filter?: string };
    return { ...cast, filter: cast.filter == null ? filterURL : `${cast.filter} ${filterURL}` };
}

/**
 * A more robust version of `Omit<Other, keyof Base> & Base`,
 * giving the intersection of Other & Base with Base's properties
 * taking precedence.
 * @category Utility Types
 */
export type Substitute<Other extends object, Base extends object> = {
    [K in keyof Other as K extends keyof Base ? never : K]: Other[K];
} & Base;

/**
 * HTML elements that don't accept children.
 * @category Utility Types
 */
export type ChildlessHTMLElements =
    'area'
    | 'base'
    | 'basefont'
    | 'bgsound'
    | 'br'
    | 'col'
    | 'command'
    | 'embed'
    | 'frame'
    | 'hr'
    | 'image'
    | 'img'
    | 'input'
    | 'isindex'
    | 'keygen'
    | 'link'
    | 'menuitem'
    | 'meta'
    | 'nextid'
    | 'param'
    | 'script'
    | 'source'
    | 'style'
    | 'template'
    | 'textarea'
    | 'title'
    | 'track'
    | 'wbr';

/**
 * A restricted ElementType which doesn't accept intrinsics that can't render children.
 * @category Utility Types
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequiredElementType = ElementType<any, keyof Omit<ReactHTML, ChildlessHTMLElements>>;

/**
 * Options for {@link DistortComponent}.
 *
 * @typeParam E - The base component type. Inferred from {@link DistortOptions.as as}.
 *
 * @remarks
 * The precedence of filters in descending order is: active, focus, hover, default.
 * Undefined filters are skipped
 *
 * Any missing properties of filters will be inherited from {@link DistortOptions.defaultFilter defaultFilter},
 * expect for {@link DistortFilterOptions.disable disable}, which always defaults to `false`.
 *
 * Non-default filters can also be just an animation, as a shorthand for `filter: { animation: "..." }`.
 *
 * @category Options
 */
export type DistortOptions<E extends RequiredElementType = 'div'> = {
    /**
     * The react component for this to wrap.
     */
    as?: E,
    /**
     * The default distortion filter settings for the element.
     *
     * @remarks
     * Undefined properties are replaced with their default values.
     *
     * @defaultValue ```ts
     * animation: 'static',
     * animationInterval: 400,
     * baseFrequency: 0.015,
     * disable: false
     * numOctaves: 3,
     * resetSeed: false,
     * scale: 5,
     * steps: 5,
     * ```
     */
    defaultFilter?: DistortFilterOptions,
    /**
     * Distortion filter settings while the element is hovered.
     */
    hoverFilter?: `${DistortAnimation}` | DistortFilterOptions,
    /**
     * Distortion filter settings while the element is active.
     */
    activeFilter?: `${DistortAnimation}` | DistortFilterOptions,
    /**
     * Distortion filter settings while the element is focused.
     */
    focusFilter?: `${DistortAnimation}` | DistortFilterOptions,
    /**
     * Starting [seed](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/seed)
     * for the feTurbulence noise filter.
     *
     * @remarks
     * Loop animations increment from this value, while endless animations
     * reset it. Entering a state with `resetSeed = true` will return to it.
     */
    baseSeed?: number,
    /**
     * Minimum milliseconds between seed refreshes.
     * @defaultValue `100`
     */
    minRefresh?: number,
    /**
     * A function returning an integer to pass to feTurbulence's seed
     * @defaultValue () => Math.random() * (2 ** 16) | 0;
     */
    getDistortionSeed?: () => number,
    /**
     * Child elements that are distorted even when
     * {@link DistortFilterOptions.disable | disable} = true.
     *
     * @remarks
     * Useful for distorted elements of components which should otherwise
     * remain legible, such as a distorted border on a text area.
     *
     * If given ReactElements, children are cloned via `React.cloneElement`,
     * with the distortion filter added to `style.filter`.
     *
     * If passed as a Component, it's created as `<distortChildren style={{ filter }} />`.
     */
    distortChildren?:
        ElementType<{ style?: CSSProperties } & Partial<Record<PropertyKey, unknown>>>
        | ReactElement<{ style?: CSSProperties }>
        | ReactElement<{ style?: CSSProperties }>[],
    /**
     * Component's imperative handle.
     */
    ref?: Ref<DistortHandle>,
    /**
    * A {@link Ref} to pass to the wrapped component.
    */
    forwardedRef?: Ref<ElementRef<E>>,
};

/**
 * Options for applied filters and animations.
 * @category Options
 */
export type DistortFilterOptions = {
    /**
     * The animation behavior of the distortion.
     */
    animation?: `${DistortAnimation}`,
    /**
     * The milliseconds between animation seed changes. Unused when
     * {@link DistortFilterOptions.animation animation} = 'static'.
     */
    animationInterval?: number,
    /**
     * The feTurbulence noise filter's
     * [base frequency](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence).
     */
    baseFrequency?: number,
    /**
     * Disables the filter.
     */
    disable?: boolean,
    /**
     * The feTurbulence noise filter's
     * [number of octaves](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/numOctaves).
     */
    numOctaves?: number,
    /**
     * If the seed should be set to baseSeed upon entering this state.
     *
     * @remarks
     * Allows returning to deterministic sequences after random animations.
     *
     * Ignored if baseSeed is undefined.
     */
    resetSeed?: boolean,
    /**
     * The feDisplacementMap's
     * [scale](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/scale).
     */
    scale?: number,
    /**
     * The number of seed increments before returning to the start
     * for loop animations.
     */
    steps?: number,
};

/**
 * ReactDistortion animation types.
 *
 * @remarks
 * This enum is provided for convenience and documentation,
 * but the values may also be passed as strings.
 *
 * @category Options
 */
export const enum DistortAnimation {
    /**
     * Filter is applied without animation.
     */
    Static = 'static',
    /**
     * Seed is refreshed every {@link DistortFilterOptions.animationInterval animationInterval}
     * milliseconds.
     */
    Endless = 'endless',
    /**
     * Seed is incremented every {@link DistortFilterOptions.animationInterval animationInterval}
     * milliseconds, looping back to the original value after the given number of steps.
     */
    Loop = 'loop',
    /**
     * Seed is refreshed every {@link DistortFilterOptions.animationInterval animationInterval}
     * milliseconds while alternating between the given filter settings and the base filter.
     */
    AlternatingEndless = 'alternating endless',
    /**
     * Seed is incremented every {@link DistortFilterOptions.animationInterval animationInterval}
     * milliseconds while alternating between the given filter settings and the base filter,
     * looping back to the original seed after the given number of steps.
     */
    AlternatingLoop = 'alternating loop',
};

/**
 * {@link DistortComponent}'s imperative handle.
 * @category Options
 */
export type DistortHandle = {
    /**
     * Refreshes the filter seed.
     *
     * @param seed - A value to set the seed to. If undefined uses
     *               {@link DistortOptions.getDistortionSeed | getDistortionSeed}.
     *
     * @remarks
     * Useful for situational animations, such as animating a range on input.
     *
     * Ignored if the last seed refresh was less than {@link DistortOptions.minRefresh minRefresh}
     * milliseconds ago, including automatic animation seed refreshes.
     */
    refreshSeed: (seed?: number) => void,
};

const defaultProps = {
    animation: 'static',
    animationInterval: 400,
    baseFrequency: 0.015,
    disable: false,
    numOctaves: 3,
    resetSeed: false,
    scale: 5,
    steps: 5,
} as const satisfies Required<DistortFilterOptions>;

function _distortComponent<E extends RequiredElementType = 'div'>({
    getDistortionSeed = () => Math.random() * (2 ** 16) | 0,
    minRefresh = 100,
    as,
    baseSeed,
    defaultFilter,
    hoverFilter,
    activeFilter,
    focusFilter,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    distortChildren,
    forwardedRef,
    children,
    style,
    ...rest
}: Substitute<ComponentProps<E>, DistortOptions<E>>, ref: Ref<DistortHandle>) {
    const As = as ?? 'div';
    const filterId = useId();
    const filter = `url(#${filterId})`;
    const finalStyle = useMemo(() => joinFilterToStyle(filter, style), [filter, style]);
    const seedTime = useRef(Date.now());

    const baseFilter = useMemo(() => defaultFilter != null
        ? { ...defaultProps, ...definedProperties(defaultFilter) }
        : defaultProps, [defaultFilter]);

    const [filterProps, setFilterProps] = useState(baseFilter);
    const [disabled, setDisabled] = useState(baseFilter.disable);
    const [seed, setSeed] = useState(baseSeed ?? getDistortionSeed());
    const [seedOffset, setSeedOffset] = useState(0);
    const [currentMode, setMode] = useState<'base' | 'hover' | 'focus' | 'active'>('base');
    const [state, setState] = useState({ hover: false, focus: false, active: false });

    const refreshSeed = useCallback((seed?: number) => {
        if (Date.now() - seedTime.current < minRefresh) return;
        seedTime.current = Date.now();
        setSeed(seed ?? getDistortionSeed());
    }, [minRefresh, getDistortionSeed]);

    useImperativeHandle(ref, () => ({ refreshSeed }), [refreshSeed]);

    const updateFilter = useCallback((value: DistortFilterOptions | `${DistortAnimation}`) => {
        let animation: `${DistortAnimation}`;
        let newFilter: Required<DistortFilterOptions>;

        if (typeof value === 'string') {
            setDisabled(false);
            newFilter = baseFilter;
            animation = value;
        } else {
            setDisabled(value.disable ?? false);
            newFilter = { ...baseFilter, ...definedProperties(value) };
            animation = newFilter.animation;
        }

        if (newFilter.resetSeed && baseSeed != null) setSeed(baseSeed);
        setSeedOffset(0);
        setFilterProps(newFilter);

        if (animation === 'static') return undefined;

        if (animation === 'endless') {
            const interval = setInterval(refreshSeed, newFilter.animationInterval);
            return () => { clearInterval(interval); };
        }

        const alternating = animation === 'alternating endless' || animation === 'alternating loop';
        const steps = animation === 'loop' || animation === 'alternating loop' ? newFilter.steps : 2;

        const interval = setInterval(() => {
            if (alternating) setFilterProps((curr) => (curr === baseFilter ? newFilter : baseFilter));
            setSeedOffset((curr) => (curr + 1) % steps);
        }, newFilter.animationInterval);

        return () => { clearInterval(interval); };
    }, [baseFilter, refreshSeed]);

    useEffect(() => {
        if (state.active && activeFilter != null) {
            setMode('active');
        } else if (state.focus && focusFilter != null) {
            setMode('focus');
        } else if (state.hover && hoverFilter != null) {
            setMode('hover');
        } else {
            setMode('base');
        }
    }, [state, activeFilter, focusFilter, hoverFilter]);

    useEffect(() => {
        switch (currentMode) {
            case 'active' : return updateFilter(activeFilter as DistortFilterOptions | `${DistortAnimation}`);
            case 'focus' : return updateFilter(focusFilter as DistortFilterOptions | `${DistortAnimation}`);
            case 'hover' : return updateFilter(hoverFilter as DistortFilterOptions | `${DistortAnimation}`);
            default : return updateFilter(baseFilter);
        }
    }, [currentMode, activeFilter, focusFilter, hoverFilter, baseFilter]);

    const overlay = useMemo(() => {
        if (distortChildren == null) return distortChildren;

        if (isValidElement(distortChildren) || distortChildren instanceof Array) {
            return Children.map(distortChildren, (child) => {
                const style = child.props.style ?? {};
                return cloneElement(child, { style: joinFilterToStyle(filter, style) });
            });
        }

        const Distort = distortChildren;
        return <Distort style={{ filter }} />;
    }, [distortChildren]);

    return (
        <As
            style={disabled ? style : finalStyle}
            // These will break if the handlers are treated as something other than functions by the
            // wrapper component. More robust typing seems to break a lot of flexibility, and given
            // the weirdness of the edge case, I'm just ignoring it.
            /* eslint-disable @typescript-eslint/no-unsafe-call */
            onFocus={(...e) => { setState((curr) => ({ ...curr, focus: true })); onFocus?.(...e); }}
            onBlur={(...e) => { setState((curr) => ({ ...curr, focus: false })); onBlur?.(...e); }}
            onMouseEnter={(...e) => { setState((curr) => ({ ...curr, hover: true })); onMouseEnter?.(...e); }}
            onMouseLeave={(...e) => { setState((curr) => ({ ...curr, hover: false })); onMouseLeave?.(...e); }}
            onMouseDown={(...e) => { setState((curr) => ({ ...curr, active: true })); onMouseDown?.(...e); }}
            onMouseUp={(...e) => { setState((curr) => ({ ...curr, active: false })); onMouseUp?.(...e); }}
            /* eslint-enable @typescript-eslint/no-unsafe-call */
            ref={forwardedRef}
            {...rest}
        >
            {children}
            {overlay}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="0"
                height="0"
            >
                <defs>
                    <filter id={filterId}>
                        <feTurbulence
                            id="turbulence"
                            type="fractalNoise"
                            result="noise"
                            baseFrequency={filterProps.baseFrequency}
                            numOctaves={filterProps.numOctaves}
                            seed={seed + seedOffset}
                        />
                        <feDisplacementMap
                            id="displacement"
                            in="SourceGraphic"
                            in2="noise"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            scale={filterProps.scale}
                        />
                    </filter>
                </defs>
            </svg>
        </As>
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
const DistortComponent = forwardRef(_distortComponent) as <E extends RequiredElementType = 'div'>(
    props: Substitute<ComponentProps<E>, DistortOptions<E>>,
) => ReturnType<typeof _distortComponent<E>>;

export default DistortComponent;
