import {
    Children,
    cloneElement,
    ComponentPropsWithRef,
    ElementType,
    EventHandler,
    forwardRef,
    isValidElement,
    SyntheticEvent,
    ReactNode,
    Ref,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useState,
    useRef,
} from 'react';

import { PolymorphicProps } from './utils';

/**
 *  ReactDistortion animation types
 */
export type DistortMode = 'none' | 'static' | 'endless' | 'loop' | 'alternating endless' | 'alternating loop';

export type DistortHandle = { refreshSeed: () => void };

/**
 *  Options for applied filters and animations
 */
export type DistortFilterProps = {
    /**
     *  The animation behavior of the distortion.
     * 
     *  none -- the filter is disabled  
     *  static -- the filter is applied without animation  
     *  endless -- the seed is refreshed every `animationInterval` milliseconds  
     *  loop -- every `animationInterval` the seed is incremented,   
     *  looping back to the original value after the given number of steps  
     *  alternating endless -- same as endless, expect the filter settings alternate between   
     *  the given ones and the default  
     *  alternating loop -- same as loop, but alternating  
     *  @defaultValue 'static'
     */
    mode?: DistortMode,
    /**
     *  The number of seed increments before returning to the start
     *  for loop animations
     *  @defaultValue `5`
     */
    steps?: number,
    /**
     *  The milliseconds between animation seed changes. Unused when `mode = none | static` .
     *  @defaultValue `400`
     */
    animationInterval?: number,
    /**
     * The feTurbulence noise filter's
     * [base frequency](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)
     *  @defaultValue `0.015`
     */
    baseFrequency?: number,
    /**
     * The feTurbulence noise filter's
     * [number of octaves](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/numOctaves)
     *  @defaultValue `5`
     */
    numOctaves?: number,
    /**
     * The feDisplacementMap's
     * [scale](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/scale)
     *  @defaultValue `5`
     */
    scale?: number,
    /**
     *  Child elements that are distorted even when `mode = none`.
     *  
     *  @remarks
     *  Useful for statically distorted elements of components which should otherwise 
     *  remain legible, such as a distorted border on a text area.
     * 
     *  Given children are cloned via `React.cloneElement` when this state is entered.
     */
    overlay?: ReactNode,
    /**
     *  If the send should be set to baseSeed upon entering this state.
     *  
     * @remarks
     * Useful for returning to deterministic sequences after random
     * animations. Ignored if baseSeed is undefined.
     *  @defaultValue `false`
     */
    resetSeed?: boolean,
};

export type DistortComponentProps<E extends ElementType = 'div'> = PolymorphicProps<E, {
    /**
     *  Starting [seed](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/seed)
     *  for the feTurbulence noise filter.
     * 
     *  @remarks
     *  Loop animations increment from this value, while endless animations
     *  reset it. Entering a state with `resetSeed = true` will return to it. 
     */
    baseSeed?: number,
    /**
     *  The minimum time in milliseconds between seed refreshes.
     *  @defaultValue `100`
     */
    minRefresh?: number,
    /**
     * The default distortion filter settings for the element.
     * Also used for any unprovided settings of other modes.
     *
     * @defaultValue ```ts
     * scale:  5,
     * numOctaves: 3,
     * baseFrequency: 0.015,
     * mode: 'static',
     * animationInterval: 400,
     * steps: 5,
     * resetSeed: false,
     * ```
     */
    defaultFilter?: DistortFilterProps,
    /**
     * Distortion filter settings while the element is hovered.
     */
    hoverFilter?: DistortMode | DistortFilterProps,
    /**
     * Distortion filter settings while the element is active.
     */
    activeFilter?: DistortMode | DistortFilterProps,
    /**
     * Distortion filter settings while the element is focused.
     */
    focusFilter?: DistortMode | DistortFilterProps,
    /**
     *  A function returning an integer to pass to feTurbulence's seed
     *  @default () => Math.random() * (2 ** 16) | 0;
     */
    getDistortionSeed?: () => number,
    /**
     *  A `React.Ref` to pass to the wrapped component
     */
    forwardedRef?: ComponentPropsWithRef<E>['ref'],
}>;

function _distortComponent<E extends ElementType = 'div'>({
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
    children,
    forwardedRef,
    ...rest
}: DistortComponentProps<E>, ref: Ref<DistortHandle>) {
    const As = as ?? 'div';
    const filterId = useId();
    const filter = useMemo(() => `url(#${filterId})`, [filterId]);
    const seedTime = useRef(Date.now());

    const baseFilter = useMemo(() => ({
        scale: defaultFilter?.scale ?? 5,
        numOctaves: defaultFilter?.numOctaves ?? 3,
        baseFrequency: defaultFilter?.baseFrequency ?? 0.015,
        mode: defaultFilter?.mode ?? 'static',
        animationInterval: defaultFilter?.animationInterval ?? 400,
        steps: defaultFilter?.steps ?? 5,
        resetSeed: defaultFilter?.resetSeed ?? false,
        overlay: defaultFilter?.overlay,
    }), [defaultFilter]);

    const [filterProps, setFilterProps] = useState(baseFilter);
    const [active, setActive] = useState(baseFilter.mode !== 'none');
    const [seed, setSeed] = useState(baseSeed ?? getDistortionSeed());
    const [seedOffset, setSeedOffset] = useState(0);
    const [currentMode, setMode] = useState<'base' | 'hover' | 'focus' | 'active'>('base')
    const [state, setState] = useState({ hover: false, focus: false, active: false });

    const refreshSeed = useCallback((seed?: number) => {
        if (Date.now() - seedTime.current < minRefresh) return;
        seedTime.current = (Date.now());
        setSeed(seed ?? getDistortionSeed());
    }, [minRefresh, getDistortionSeed]);

    useImperativeHandle(ref, () => ({ refreshSeed }), [refreshSeed]);

    const updateFilter = useCallback((value?: DistortFilterProps | DistortMode) => {
        if (value == null) return;

        const newFilter = typeof value === 'string'
            ? { ...baseFilter, mode: value }
            : { ...baseFilter, ...value };

        if (newFilter.resetSeed && baseSeed != null) setSeed(baseSeed);

        switch (newFilter.mode) {
            case 'none': {
                setActive(false);
                setFilterProps(newFilter);
                return undefined;
            }
            case 'static': {
                setActive(true);
                setSeedOffset(0);
                setFilterProps(newFilter);
                return undefined;
            }
            case 'endless': {
                setSeedOffset(0);
                setActive(true);
                setFilterProps(newFilter);

                const interval = setTimeout(refreshSeed, newFilter.animationInterval);
                return () => { clearTimeout(interval); };
            }
            case 'alternating endless': {
                setActive(true);
                setSeedOffset((curr) => (curr + 1) % 2);
                setFilterProps(seedOffset % 2 === 1 ? baseFilter : newFilter);

                const interval = setTimeout(refreshSeed, newFilter.animationInterval);
                return () => { clearTimeout(interval); };
            }
            case 'alternating loop':
            case 'loop': {
                setActive(true);
                setFilterProps(newFilter.mode === 'alternating loop' && seedOffset % 2 === 1 ? baseFilter : newFilter);

                const interval = setTimeout(() => {
                    setFilterProps((curr) => (curr === baseFilter ? newFilter : baseFilter));
                    setSeedOffset((curr) => (curr + 1) % newFilter.steps);
                }, newFilter.animationInterval);

                return () => { clearTimeout(interval); };
            }
            default: return undefined;
        }
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
    }, [state]);

    useEffect(() => {
        switch (currentMode) {
            case 'active' : return updateFilter(activeFilter);
            case 'focus' : return updateFilter(focusFilter);
            case 'hover' : return updateFilter(focusFilter);
            default : return updateFilter(baseFilter);
        }
    }, [currentMode, activeFilter, focusFilter, hoverFilter, baseFilter]);

    const stateCallback = useCallback(function<E extends SyntheticEvent, T>(
        value: boolean,
        name: string,
        prop?: T,
        fn?: EventHandler<E>,
    ) {
        return prop != null
            ? (e: E) => {
                    setState((curr) => ({ ...curr, [name]: value }));
                    fn?.(e);
                }
            : fn ?? (() => {});
    }, []);

    return (
        <As
            style={{ filter: active ? filter : undefined }}
            onFocus={useCallback(stateCallback(true, 'focus', focusFilter, onFocus), [focusFilter, onFocus])}
            onBlur={useCallback(stateCallback(false, 'focus', focusFilter, onBlur), [focusFilter, onBlur])}
            onMouseEnter={useCallback(stateCallback(true, 'hover', hoverFilter, onMouseEnter), [hoverFilter, onMouseEnter])}
            onMouseLeave={useCallback(stateCallback(false, 'hover', hoverFilter, onMouseLeave), [hoverFilter, onMouseLeave])}
            onMouseDown={useCallback(stateCallback(true, 'active', activeFilter, onMouseDown), [activeFilter, onMouseDown])}
            onMouseUp={useCallback(stateCallback(false, 'active', activeFilter, onMouseUp), [activeFilter, onMouseUp])}
            ref={forwardedRef}
            {...rest}
        >
            {children}
            {Children.map(filterProps.overlay, (child) =>
                isValidElement(child) ? cloneElement(child as JSX.Element, { style: { ...child.props.style, filter } }) : child
            )}
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0" style={{ position: 'absolute' }}>
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

const DistortComponent = forwardRef(_distortComponent) as <E extends ElementType>(
    props: DistortComponentProps<E> & { ref?: Ref<DistortHandle> },
) => ReturnType<typeof _distortComponent<E>>;

export default DistortComponent;
