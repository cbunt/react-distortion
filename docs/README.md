**react-distortion** • **Docs**

***

**react-distortion** • **Docs**

***

# react-distortion

## Functions

### default()

> **default**\<`E`\>(`props`): `Element`

#### Type Parameters

• **E** *extends* `ElementType`

#### Parameters

• **props**: `object` & `object` & `Omit`\<`PropsWithoutRef`\<`ComponentProps`\<`E`\>\>, `"as"` \| `"baseSeed"` \| `"minRefresh"` \| `"defaultFilter"` \| `"hoverFilter"` \| `"activeFilter"` \| `"focusFilter"` \| `"getDistortionSeed"` \| `"forwardedRef"`\> & `object`

#### Returns

`Element`

#### Defined in

distort-component.tsx:331

***

### DistortBackground()

> **DistortBackground**\<`E`\>(`__namedParameters`): `Element`

A background overlay.

#### Type Parameters

• **E** *extends* `ElementType` = `"div"`

#### Parameters

• **\_\_namedParameters**: `PolymorphicProps`\<`E`, `object`\>

#### Returns

`Element`

#### Remarks

Background color can be set via `--background-color` css variable.
 The parent element's background color should be set to transparent visibility.

#### Defined in

overlays.tsx:46

***

### DistortBorder()

> **DistortBorder**\<`E`\>(`__namedParameters`): `Element`

A border overlay.

#### Type Parameters

• **E** *extends* `ElementType` = `"div"`

#### Parameters

• **\_\_namedParameters**: `PolymorphicProps`\<`E`, `object`\>

#### Returns

`Element`

#### Remarks

color can be set via a `--border-color` css variable or the parent elements's color
 border width should be set via a `--border-width` css variable, which is also used
 to calculate the element's position.

#### Defined in

overlays.tsx:37

***

### WrapOverlay()

> **WrapOverlay**\<`Base`\>(`baseClass`, `baseAs`?): \<`E`\>(`__namedParameters`) => `Element`

Wraps a polymorphic react component in the given css class

#### Type Parameters

• **Base** *extends* `ElementType` = `"div"`

#### Parameters

• **baseClass**: `string`

CSS class name to apply to all constructed components

• **baseAs?**: `Base`

The fallback component type for constructed component without `as` prop

#### Returns

`Function`

A `React.FunctionComponent` with the given class always applied

##### Type Parameters

• **E** *extends* `ElementType` = `Base`

##### Parameters

• **\_\_namedParameters**: `PolymorphicProps`\<`E`, `object`\>

##### Returns

`Element`

#### Defined in

overlays.tsx:13

## Type Aliases

### DistortComponentProps\<E\>

> **DistortComponentProps**\<`E`\>: `PolymorphicProps`\<`E`, `object`\>

#### Type Parameters

• **E** *extends* `ElementType` = `"div"`

#### Defined in

distort-component.tsx:98

***

### DistortFilterProps

> **DistortFilterProps**: `object`

Options for applied filters and animations

#### Type declaration

##### animationInterval?

> `optional` **animationInterval**: `number`

The milliseconds between animation seed changes. Unused when `mode = none | static` .

###### Default Value

`400`

##### baseFrequency?

> `optional` **baseFrequency**: `number`

The feTurbulence noise filter's
[base frequency](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)

###### Default Value

`0.015`

##### mode?

> `optional` **mode**: [`DistortMode`](README.md#distortmode)

The animation behavior of the distortion.

 none -- the filter is disabled  
 static -- the filter is applied without animation  
 endless -- the seed is refreshed every `animationInterval` milliseconds  
 loop -- every `animationInterval` the seed is incremented,   
 looping back to the original value after the given number of steps  
 alternating endless -- same as endless, expect the filter settings alternate between   
 the given ones and the default  
 alternating loop -- same as loop, but alternating

###### Default Value

```ts
'static'
```

##### numOctaves?

> `optional` **numOctaves**: `number`

The feTurbulence noise filter's
[number of octaves](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/numOctaves)

###### Default Value

`5`

##### overlay?

> `optional` **overlay**: `ReactNode`

Child elements that are distorted even when `mode = none`.

###### Remarks

Useful for statically distorted elements of components which should otherwise 
 remain legible, such as a distorted border on a text area.

 Given children are cloned via `React.cloneElement` when this state is entered.

##### resetSeed?

> `optional` **resetSeed**: `boolean`

If the send should be set to baseSeed upon entering this state.

###### Remarks

Useful for returning to deterministic sequences after random
animations. Ignored if baseSeed is undefined.

###### Default Value

`false`

##### scale?

> `optional` **scale**: `number`

The feDisplacementMap's
[scale](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/scale)

###### Default Value

`5`

##### steps?

> `optional` **steps**: `number`

The number of seed increments before returning to the start
 for loop animations

###### Default Value

`5`

#### Defined in

distort-component.tsx:33

***

### DistortHandle

> **DistortHandle**: `object`

#### Type declaration

##### refreshSeed()

> **refreshSeed**: () => `void`

###### Returns

`void`

#### Defined in

distort-component.tsx:28

***

### DistortMode

> **DistortMode**: `"none"` \| `"static"` \| `"endless"` \| `"loop"` \| `"alternating endless"` \| `"alternating loop"`

ReactDistortion animation types

#### Defined in

distort-component.tsx:26

## Variables

### DistortStyles

> `const` **DistortStyles**: `object`

The base css classnames for library provided overlays

#### Type declaration

##### background

> `readonly` **background**: `string` = `styles.background`

[DistortBackground](README.md#distortbackground)'s base css class

##### border

> `readonly` **border**: `string` = `styles.border`

[DistortBorder](README.md#distortborder)'s base css class

#### Defined in

overlays.tsx:51

## Functions

### default()

> **default**\<`E`\>(`props`): `Element`

#### Type Parameters

• **E** *extends* `ElementType`

#### Parameters

• **props**: `object` & `object` & `Omit`\<`PropsWithoutRef`\<`ComponentProps`\<`E`\>\>, `"as"` \| `"baseSeed"` \| `"minRefresh"` \| `"defaultFilter"` \| `"hoverFilter"` \| `"activeFilter"` \| `"focusFilter"` \| `"getDistortionSeed"` \| `"forwardedRef"`\> & `object`

#### Returns

`Element`

#### Defined in

distort-component.tsx:331

***

### DistortBackground()

> **DistortBackground**\<`E`\>(`__namedParameters`): `Element`

A background overlay.

#### Type Parameters

• **E** *extends* `ElementType` = `"div"`

#### Parameters

• **\_\_namedParameters**: `PolymorphicProps`\<`E`, `object`\>

#### Returns

`Element`

#### Remarks

Background color can be set via `--background-color` css variable.
 The parent element's background color should be set to transparent visibility.

#### Defined in

overlays.tsx:46

***

### DistortBorder()

> **DistortBorder**\<`E`\>(`__namedParameters`): `Element`

A border overlay.

#### Type Parameters

• **E** *extends* `ElementType` = `"div"`

#### Parameters

• **\_\_namedParameters**: `PolymorphicProps`\<`E`, `object`\>

#### Returns

`Element`

#### Remarks

color can be set via a `--border-color` css variable or the parent elements's color
 border width should be set via a `--border-width` css variable, which is also used
 to calculate the element's position.

#### Defined in

overlays.tsx:37

***

### WrapOverlay()

> **WrapOverlay**\<`Base`\>(`baseClass`, `baseAs`?): \<`E`\>(`__namedParameters`) => `Element`

Wraps a polymorphic react component in the given css class

#### Type Parameters

• **Base** *extends* `ElementType` = `"div"`

#### Parameters

• **baseClass**: `string`

CSS class name to apply to all constructed components

• **baseAs?**: `Base`

The fallback component type for constructed component without `as` prop

#### Returns

`Function`

A `React.FunctionComponent` with the given class always applied

##### Type Parameters

• **E** *extends* `ElementType` = `Base`

##### Parameters

• **\_\_namedParameters**: `PolymorphicProps`\<`E`, `object`\>

##### Returns

`Element`

#### Defined in

overlays.tsx:13

## Type Aliases

### DistortComponentProps\<E\>

> **DistortComponentProps**\<`E`\>: `PolymorphicProps`\<`E`, `object`\>

#### Type Parameters

• **E** *extends* `ElementType` = `"div"`

#### Defined in

distort-component.tsx:98

***

### DistortFilterProps

> **DistortFilterProps**: `object`

Options for applied filters and animations

#### Type declaration

##### animationInterval?

> `optional` **animationInterval**: `number`

The milliseconds between animation seed changes. Unused when `mode = none | static` .

###### Default Value

`400`

##### baseFrequency?

> `optional` **baseFrequency**: `number`

The feTurbulence noise filter's
[base frequency](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)

###### Default Value

`0.015`

##### mode?

> `optional` **mode**: [`DistortMode`](README.md#distortmode)

The animation behavior of the distortion.

 none -- the filter is disabled  
 static -- the filter is applied without animation  
 endless -- the seed is refreshed every `animationInterval` milliseconds  
 loop -- every `animationInterval` the seed is incremented,   
 looping back to the original value after the given number of steps  
 alternating endless -- same as endless, expect the filter settings alternate between   
 the given ones and the default  
 alternating loop -- same as loop, but alternating

###### Default Value

```ts
'static'
```

##### numOctaves?

> `optional` **numOctaves**: `number`

The feTurbulence noise filter's
[number of octaves](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/numOctaves)

###### Default Value

`5`

##### overlay?

> `optional` **overlay**: `ReactNode`

Child elements that are distorted even when `mode = none`.

###### Remarks

Useful for statically distorted elements of components which should otherwise 
 remain legible, such as a distorted border on a text area.

 Given children are cloned via `React.cloneElement` when this state is entered.

##### resetSeed?

> `optional` **resetSeed**: `boolean`

If the send should be set to baseSeed upon entering this state.

###### Remarks

Useful for returning to deterministic sequences after random
animations. Ignored if baseSeed is undefined.

###### Default Value

`false`

##### scale?

> `optional` **scale**: `number`

The feDisplacementMap's
[scale](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/scale)

###### Default Value

`5`

##### steps?

> `optional` **steps**: `number`

The number of seed increments before returning to the start
 for loop animations

###### Default Value

`5`

#### Defined in

distort-component.tsx:33

***

### DistortHandle

> **DistortHandle**: `object`

#### Type declaration

##### refreshSeed()

> **refreshSeed**: () => `void`

###### Returns

`void`

#### Defined in

distort-component.tsx:28

***

### DistortMode

> **DistortMode**: `"none"` \| `"static"` \| `"endless"` \| `"loop"` \| `"alternating endless"` \| `"alternating loop"`

ReactDistortion animation types

#### Defined in

distort-component.tsx:26

## Variables

### DistortStyles

> `const` **DistortStyles**: `object`

The base css classnames for library provided overlays

#### Type declaration

##### background

> `readonly` **background**: `string` = `styles.background`

[DistortBackground](README.md#distortbackground)'s base css class

##### border

> `readonly` **border**: `string` = `styles.border`

[DistortBorder](README.md#distortborder)'s base css class

#### Defined in

overlays.tsx:51
