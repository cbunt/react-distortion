import type {
    CSSProperties,
    ComponentRef,
    DOMAttributes,
    ElementType,
    JSX,
    Ref,
} from 'react';

/**
 * The intersection of Other & Base, with Base's properties taking precedence.
 *
 * @category Utility Types
 */
export type Substitute<Other extends object, Base extends object> = {
    [K in keyof Other as K extends keyof Base ? never : K]: Other[K];
} & Base;

/**
 * A union of the names of all DOM Events react exposes.
 * @category Utility Types
 */
export type DOMEventName = keyof Omit<DOMAttributes<unknown>, 'children' | 'dangerouslySetInnerHTML'>;

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
 * @category Options
 */
export type DistortOptions<E extends ElementType = 'div'> = {
    /**
     * The react component for this to wrap.
     * @defaultValue
     * ```ts
     * 'div'
     * ```
     */
    as?: DistortSupportedAs<E>,
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
     * Name for the css variable to access the distortion filter.
     *
     * @defaultValue
     * ```ts
     * `--distortion-filter`
     * ```
     *
     * @remarks
     * Used as: `filter: var(--${cssVariable})`.
     */
    cssVariable?: `--${string}`,
    /**
     * A CSS ID to use for the distortion filter.
     * @defaultValue {@link React.useId | useId()}
     */
    filterId?: string,
    /**
     * Minimum milliseconds between seed refreshes.
     * @defaultValue
     * ```ts
     * 100
     * ```
     */
    minRefresh?: number,
    /**
     * A function returning an integer to pass to feTurbulence's seed
     * @defaultValue
     * ```ts
     * () => Math.random() * (2 ** 16) | 0;
     * ```
     */
    getDistortionSeed?: () => number,
    /**
     * The default distortion filter settings for the element.
     *
     * @remarks
     * Undefined properties are replaced with their default values.
     *
     * @defaultValue
     * ```ts
     * {
     *   baseFrequency: 0.015,
     *   disable: false,
     *   numOctaves: 3,
     *   resetSeed: false,
     *   scale: 5,
     * }
     * ```
     */
    defaultFilter?: DistortFilterOptions,
    /**
     * Distortion filter settings while the element is hovered.
     */
    hoverFilter?: DistortFilterOptions,
    /**
     * Distortion filter settings while the element is active.
     */
    activeFilter?: DistortFilterOptions,
    /**
     * Distortion filter settings while the element is focused.
     */
    focusFilter?: DistortFilterOptions,
    /**
     * Filters and the DOM events associated with them, in ascending order of precedence.
     *
     * @defaultValue
     * ```ts
     * [
     *   {
     *     prop: 'hoverFilter',
     *     onMouseEnter: true,
     *     onMouseLeave: false,
     *   },
     *   {
     *     prop: 'focusFilter',
     *     onFocus: true,
     *     onBlur: false,
     *   },
     *   {
     *     prop: 'activeFilter',
     *     onMouseDown: true,
     *     onMouseUp: false,
     *   }
     * ]
     * ```
     *
     * @remarks
     * Handlers for all DOM events defined in this prop are passed to the wrapped component.
     * As such, the component should accept props from them, even though the typing of
     * DistortComponent does not required that.
     *
     * There is a maximum of 32 states supported, with any additional states being ignored.
     */
    domStates?: Array<DistortDOMState>,
    /**
     * Component's imperative handle.
     */
    ref?: Ref<DistortHandle>,
    /**
    * A {@link Ref} to pass to the wrapped component.
    */
    forwardedRef?: Ref<ComponentRef<E>>,
};

/**
 * Properties which a provided 'as' component must support
 *
 * @remarks
 * DistortComponent works by passing additional style and children
 * to the wrapped component, and will break if they are not supported.
 * For example `<DistortComponent as="input" />` would throw a runtime
 * error, as `input` elements cannot have children.
 *
 * @category Options
 */
export type DistortRequiredAsProps = { style?: CSSProperties };

/**
 * A wrapper which checks the passed type is a component which accepts
 * {@link DistortRequiredAsProps}. Returns `never` if it does not.
 *
 * @typeParam T - The component type to check. Inferred from {@link DistortOptions.as as}.
 *
 * @category Options
 */
export type DistortSupportedAs<T> =
    T extends keyof JSX.IntrinsicElements
        ? T
        : T extends ElementType<infer P>
            ? P extends DistortRequiredAsProps
                ? T
                : never
            : never;

/**
 * Options for applied filters and animations.
 * @category Options
 */
export type DistortFilterOptions = {
    /**
     * The milliseconds between animation seed changes.
     *
     * @remarks
     * If undefined, the distortion is static.
     *
     * If any other animation property--{@link DistortFilterOptions.animationJitter | animationJitter},
     * {@link DistortFilterOptions.steps | steps}, or {@link DistortFilterOptions.alternate}--
     * are defined, this is set to `400`.
     */
    animationInterval?: number,
    /**
     * Milliseconds to randomly vary animationInterval by, or a function
     * that returns that value.
     */
    animationJitter?: number | (() => number),
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
     * for loop animations. If undefined, the animation never loops.
     */
    steps?: number,
    /**
     * Filter options to use on odd animation steps.
     *
     * @remarks
     * If true, all values are taken from {@link DistortOptions.defaultFilter defaultFilter}.
     *
     * Undefined values don't alternate.
     */
    alternate?: boolean | { scale?: number, numOctaves?: number, baseFrequency?: number },
};

/**
 * A filter and the DOM events associated with it.
 *
 * @remarks
 * Filters can either be explicitly defined or reference one of the built in prop filters.
 * Filters which reference to an undefined prop are ignored.
 *
 * DOM events are specified as `key: boolean` pairs, where 'true' means the state is entered
 * on the given event, and 'false'. If multiple states specify the same event, the highest
 * precedence state overrides all previous ones.
 *
 * Typing allows explicitly setting events as undefined, e.g. 'onFocus: undefined',
 * which is evaluated identically to 'onFocus: false'.
 *
 * @category Options
 */
export type DistortDOMState = (
    { prop: 'activeFilter' | 'hoverFilter' | 'focusFilter' | 'defaultFilter', filter?: undefined }
    | { prop?: undefined, filter: DistortFilterOptions }
) & Partial<Record<DOMEventName, boolean>>;

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
