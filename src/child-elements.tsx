/**
 * @categoryDescription child-elements
 *
 * [![react-distortion/child-elements bundlejs size](https://deno.bundlejs.com/badge?q=react-distortion/child-elements&badge=detailed)](https://bundlejs.com/?q=react-distortion/child-elements)
 *
 * A submodule of utility elements covering common use cases of
 * {@link DistortOptions.distortChildren}. Imported from
 * `react-distortion/child-elements`.
 *
 * Its elements are simple divs with classes pre-applied.
 * Importing the module will inject its CSS into the head
 * of the document. The CSS source can be found at
 * [src/child-elements.module.css](https://github.com/cbunt/react-distortion/blob/main/src/child-elements.module.css).
 *
 * @module
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DistortOptions } from './distort-component';
import styles from './child-elements.module.css';

/**
 * A background overlay, for use with
 * {@link DistortOptions.distortChildren distortChildren}.
 *
 * @remarks
 * Background color can be set via the parent's background color
 * or a `--background-color` css variable.
 *
 * The parent element's background should be transparent, either with
 * `background: none` or `background-color: #0000`.
 *
 * @category child-elements
 */
export const DistortBackground = <div className={styles.background} />;

/**
 * A border overlay, for use with
 * {@link DistortOptions.distortChildren distortChildren}.
 *
 * @remarks
 * Color can be set via the `--border-color` css variable or the parent element's currentcolor.
 *
 * Border width should be set via a `--border-width` css variable, which is also used
 * to calculate the element's position. `border-width: inherit` is used as a fallback, but
 * may result in incorrect positioning.
 *
 * @category child-elements
 */
export const DistortBorder = <div className={styles.border} />;

/**
 * The css classnames for this module's elements.
 *
 * @category child-elements
 */
export const DistortStyles = {
    /**
     * {@link DistortBorder}'s base css class.
     */
    border: styles.border,
    /**
     * {@link DistortBackground}'s base css class.
     */
    background: styles.background,
} as const;
