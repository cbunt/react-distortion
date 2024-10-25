# react-distortion

A React component library for adding animated procedural distortion to other components.

![Three distorted and animated text boxes on a blue background reading "Borders! Backgrounds! The whole dang thing"](https://github.com/cbunt/react-distortion/blob/main/example-spread.gif?raw=true)

Pure CSS and HTML Distortion, with animations in JS. All through inline SVGs,
[feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)
and [feDisplacementMap](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap)
elements, and CSS filters.

***

|module|minified size|gzipped|
|------|-------------|-------|
|react-distortion|11.8 kB|4.52 kB|
|react-distortion/child-elements|9.6 kB|3.59 kB|

## Component

### DistortComponent()

Component that distorts itself and its children.

#### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `E` *extends* [`ElementType`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L89) | `"div"` | The base component type; inferred from [as](README.md#as). |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `Substitute`\<[`ComponentProps`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L1660)\<`E`\>, [`DistortOptions`](README.md#distortoptionse)\<`E`\>\> |

#### Remarks

The type of `props` is expanded to include any additional props of the component type E.
For example, `<DistortComponent as="a" href="..." />`.

Existing properties of [DistortOptions](README.md#distortoptionse) are not forwarded to the underlying component.

## Options

### DistortOptions\<E\>

Options for [DistortComponent](README.md#distortcomponent).

#### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `E` *extends* [`ElementType`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L89) | `"div"` | The base component type. Inferred from [as](README.md#as). |

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `as`? | `E` | The react component for this to wrap. |
| `defaultFilter`? | [`DistortFilterOptions`](README.md#distortfilteroptions) | The default distortion filter settings for the element. <br><br>**Remarks**<br> Undefined properties are replaced with their default values. |
| `hoverFilter`? | \`$\{DistortAnimation\}\` \| [`DistortFilterOptions`](README.md#distortfilteroptions) | Distortion filter settings while the element is hovered. |
| `activeFilter`? | \`$\{DistortAnimation\}\` \| [`DistortFilterOptions`](README.md#distortfilteroptions) | Distortion filter settings while the element is active. |
| `focusFilter`? | \`$\{DistortAnimation\}\` \| [`DistortFilterOptions`](README.md#distortfilteroptions) | Distortion filter settings while the element is focused. |
| `baseSeed`? | `number` | Starting [seed](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/seed) for the feTurbulence noise filter. <br><br>**Remarks**<br> Loop animations increment from this value, while endless animations reset it. Entering a state with `resetSeed = true` will return to it. |
| `minRefresh`? | `number` | Minimum milliseconds between seed refreshes. |
| `getDistortionSeed`? | () => `number` | A function returning an integer to pass to feTurbulence's seed |
| `distortChildren`? | [`ComponentType`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L105)\<\{`style`: [`CSSProperties`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L2586); \}\> \| [`ReactElement`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L328)\<\{`style`: [`CSSProperties`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L2586); \}\> \| [`ReactElement`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L328)\<\{`style`: [`CSSProperties`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L2586); \}\>[] | Child elements that are distorted even when [disable](README.md#disable) = true. <br><br>**Remarks**<br> Useful for distorted elements of components which should otherwise remain legible, such as a distorted border on a text area. If given ReactElements, children are cloned via `React.cloneElement`, with the distortion filter added to `style.filter`. If passed as a Component, it's created as `<distortChildren style={{ filter }} />`. |
| `ref`? | [`Ref`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L190)\<[`DistortHandle`](README.md#distorthandle)\> | Component's imperative handle. |
| `forwardedRef`? | [`ComponentPropsWithRef`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L1688)\<`E`\>\[`"ref"`\] | A [Ref](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/95fdfc3494c/types/react/index.d.ts#L190) to pass to the wrapped component. |

#### Remarks

The precedence of filters in descending order is: active, focus, hover, default.
Undefined filters are skipped

Any missing properties of filters will be inherited from [defaultFilter](README.md#defaultfilter),
expect for [disable](README.md#disable), which always defaults to `false`.

Non-default filters can also be just an animation, as a shorthand for `filter: { animation: "..." }`.

***

### DistortFilterOptions

Options for applied filters and animations.

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `animation`? | \`$\{DistortAnimation\}\` | The animation behavior of the distortion. |
| `animationInterval`? | `number` | The milliseconds between animation seed changes. Unused when [animation](README.md#animation) = 'static'. |
| `baseFrequency`? | `number` | The feTurbulence noise filter's [base frequency](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence). |
| `disable`? | `boolean` | Disables the filter. |
| `numOctaves`? | `number` | The feTurbulence noise filter's [number of octaves](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/numOctaves). |
| `resetSeed`? | `boolean` | If the seed should be set to baseSeed upon entering this state. <br><br>**Remarks**<br> Allows returning to deterministic sequences after random animations. Ignored if baseSeed is undefined. |
| `scale`? | `number` | The feDisplacementMap's [scale](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/scale). |
| `steps`? | `number` | The number of seed increments before returning to the start for loop animations. |

***

### DistortAnimation

ReactDistortion animation types.

#### Remarks

This enum is provided for convenience and documentation,
but the values may also be passed as strings.

#### Enumeration Members

| Enumeration Member | Value | Description |
| ------ | ------ | ------ |
| `Static` | `"static"` | Filter is applied without animation. |
| `Endless` | `"endless"` | Seed is refreshed every [animationInterval](README.md#animationinterval) milliseconds. |
| `Loop` | `"loop"` | Seed is incremented every [animationInterval](README.md#animationinterval) milliseconds, looping back to the original value after the given number of steps. |
| `AlternatingEndless` | `"alternating endless"` | Seed is refreshed every [animationInterval](README.md#animationinterval) milliseconds while alternating between the given filter settings and the base filter. |
| `AlternatingLoop` | `"alternating loop"` | Seed is incremented every [animationInterval](README.md#animationinterval) milliseconds while alternating between the given filter settings and the base filter, looping back to the original seed after the given number of steps. |

***

### DistortHandle

[DistortComponent](README.md#distortcomponent)'s imperative handle.

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `refreshSeed` | (`seed`?) => `void` | Refreshes the filter seed. <br><br>**Remarks**<br> Useful for situational animations, such as animating a range on input. Ignored if the last seed refresh was less than [minRefresh](README.md#minrefresh) milliseconds ago, including automatic animation seed refreshes. |

## child-elements

A submodule of utility elements covering common use cases of
[DistortOptions.distortChildren](README.md#distortchildren). Imported from
`react-distortion/child-elements`.

Its elements are simple divs with classes pre-applied.
Importing the module will inject its CSS into the head
of the document. The CSS source can be found at
[src/child-elements.module.css](https://github.com/cbunt/react-distortion/blob/main/src/child-elements.module.css).

### DistortBackground

A background overlay, for use with
[distortChildren](README.md#distortchildren).

#### Remarks

Background color can be set via the parent's background color
or a `--background-color` css variable.

The parent element's background should be transparent, either with
`background: none` or `background-color: #0000`.

***

### DistortBorder

A border overlay, for use with
[distortChildren](README.md#distortchildren).

#### Remarks

Color can be set via the `--border-color` css variable or the parent element's currentcolor.

Border width should be set via a `--border-width` css variable, which is also used
to calculate the element's position. `border-width: inherit` is used as a fallback, but
may result in incorrect positioning.

***

### DistortStyles

The css classnames for this module's elements.

#### Type declaration

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `border` | `string` | styles.border | [DistortBorder](README.md#distortborder)'s base css class. |
| `background` | `string` | styles.background | [DistortBackground](README.md#distortbackground)'s base css class. |
