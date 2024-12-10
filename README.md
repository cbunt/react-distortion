# react-distortion

[![npm version](https://badge.fury.io/js/react-distortion.svg)](https://www.npmjs.com/package/react-distortion)
[![react-distortion bundlejs size](https://deno.bundlejs.com/badge?q=react-distortion&badge=detailed)](https://bundlejs.com/?q=react-distortion)

A React component library for adding animated procedural distortion to other components.

![Three distorted and animated text boxes on a blue background reading "Borders! Backgrounds! The whole dang thing"](https://github.com/cbunt/react-distortion/blob/main/example-spread.gif?raw=true)

Pure CSS and HTML Distortion, with animations in JS. All through inline SVGs,
[feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)
and [feDisplacementMap](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap)
elements, and CSS filters.

## Component

### DistortComponent()

Component that distorts itself and its children.

#### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `E` *extends* [`ElementType`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L107) | `"div"` | The base component type; inferred from [as](#as). |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | [`Substitute`](#substituteother-base)\<[`ComponentProps`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L1423)\<`E`\>, [`DistortOptions`](#distortoptionse)\<`E`\>\> |

#### Remarks

The type of `props` is expanded to include any additional props of the component type E.
For example, `<DistortComponent as="a" href="..." />`.

Existing properties of [DistortOptions](#distortoptionse) are not forwarded to the underlying component.

## Options

### DistortOptions\<E\>

Options for [DistortComponent](#distortcomponent).

#### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `E` *extends* [`ElementType`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L107) | `"div"` | The base component type. Inferred from [as](#as). |

#### Type declaration

##### as?

The react component for this to wrap.

###### Default Value

```ts
'div'
```

##### baseSeed?

Starting [seed](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/seed)
for the feTurbulence noise filter.

###### Remarks

Loop animations increment from this value, while endless animations
reset it. Entering a state with `resetSeed = true` will return to it.

##### cssVariable?

Name for the css variable to access the distortion filter.

###### Default Value

```ts
`--distortion-filter`
```

###### Remarks

Used as: `filter: var(--${cssVariable})`.

##### filterId?

A CSS ID to use for the distortion filter.

###### Default Value

[useId()](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L1889)

##### minRefresh?

Minimum milliseconds between seed refreshes.

###### Default Value

```ts
100
```

##### getDistortionSeed()?

A function returning an integer to pass to feTurbulence's seed

###### Default Value

```ts
() => Math.random() * (2 ** 16) | 0;
```

##### defaultFilter?

The default distortion filter settings for the element.

###### Remarks

Undefined properties are replaced with their default values.

###### Default Value

```ts
{
  baseFrequency: 0.015,
  disable: false,
  numOctaves: 3,
  resetSeed: false,
  scale: 5,
}
```

##### hoverFilter?

Distortion filter settings while the element is hovered.

##### activeFilter?

Distortion filter settings while the element is active.

##### focusFilter?

Distortion filter settings while the element is focused.

##### domStates?

Filters and the DOM events associated with them, in ascending order of precedence.

###### Default Value

```ts
[
  {
    prop: 'hoverFilter',
    onMouseEnter: true,
    onMouseLeave: false,
  },
  {
    prop: 'focusFilter',
    onFocus: true,
    onBlur: false,
  },
  {
    prop: 'activeFilter',
    onMouseDown: true,
    onMouseUp: false,
  }
]
```

###### Remarks

Handlers for all DOM events defined in this prop are passed to the wrapped component.
As such, the component should accept props from them, even though the typing of
DistortComponent does not required that.

There is a maximum of 32 states supported, with any additional states being ignored.

##### ref?

Component's imperative handle.

##### forwardedRef?

A [Ref](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L192) to pass to the wrapped component.

#### Remarks

The precedence of filters in descending order is: active, focus, hover, default.
Undefined filters are skipped

Any missing properties of filters will be inherited from [defaultFilter](#defaultfilter),
expect for [disable](#disable), which always defaults to `false`.

***

### DistortRequiredAsProps

Properties which a provided 'as' component must support

#### Type declaration

##### style?

#### Remarks

DistortComponent works by passing additional style and children
to the wrapped component, and will break if they are not supported.
For example `<DistortComponent as="input" />` would throw a runtime
error, as `input` elements cannot have children.

***

### DistortSupportedAs\<T\>

A wrapper which checks the passed type is a component which accepts
[DistortRequiredAsProps](#distortrequiredasprops). Returns `never` if it does not.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The component type to check. Inferred from [as](#as). |

***

### DistortFilterOptions

Options for applied filters and animations.

#### Type declaration

##### animationInterval?

The milliseconds between animation seed changes.

###### Remarks

If undefined, the distortion is static.

If any other animation property--[animationJitter](#animationjitter),
[steps](#steps), or [DistortFilterOptions.alternate](#alternate)--
are defined, this is set to `400`.

##### animationJitter?

Milliseconds to randomly vary animationInterval by, or a function
that returns that value.

##### baseFrequency?

The feTurbulence noise filter's
[base frequency](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence).

##### disable?

Disables the filter.

##### numOctaves?

The feTurbulence noise filter's
[number of octaves](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/numOctaves).

##### resetSeed?

If the seed should be set to baseSeed upon entering this state.

###### Remarks

Allows returning to deterministic sequences after random animations.

Ignored if baseSeed is undefined.

##### scale?

The feDisplacementMap's
[scale](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/scale).

##### steps?

The number of seed increments before returning to the start
for loop animations. If undefined, the animation never loops.

##### alternate?

Filter options to use on odd animation steps.

###### Remarks

If true, all values are taken from [defaultFilter](#defaultfilter).

Undefined values don't alternate.

***

### DistortDOMState

A filter and the DOM events associated with it.

#### Remarks

Filters can either be explicitly defined or reference one of the built in prop filters.
Filters which reference to an undefined prop are ignored.

DOM events are specified as `key: boolean` pairs, where 'true' means the state is entered
on the given event, and 'false'. If multiple states specify the same event, the highest
precedence state overrides all previous ones.

Typing allows explicitly setting events as undefined, e.g. 'onFocus: undefined',
which is evaluated identically to 'onFocus: false'.

***

### DistortHandle

[DistortComponent](#distortcomponent)'s imperative handle.

#### Type declaration

##### refreshSeed()

Refreshes the filter seed.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `seed`? | `number` | A value to set the seed to. If undefined uses [getDistortionSeed](#getdistortionseed). |

###### Remarks

Useful for situational animations, such as animating a range on input.

Ignored if the last seed refresh was less than [minRefresh](#minrefresh)
milliseconds ago, including automatic animation seed refreshes.

## Utility Types

### Substitute\<Other, Base\>

The intersection of Other & Base, with Base's properties taking precedence.

#### Type Parameters

| Type Parameter |
| ------ |
| `Other` *extends* `object` |
| `Base` *extends* `object` |

***

### DOMEventName

A union of the names of all DOM Events react exposes.
