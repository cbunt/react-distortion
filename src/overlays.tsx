import { ElementType } from "react";
import { PolymorphicProps } from "./utils";

import styles from './overlays.module.css'; 

/**
 * Wraps a polymorphic react component in the given css class
 * 
 * @param baseClass CSS class name to apply to all constructed components
 * @param baseAs The fallback component type for constructed component without `as` prop
 * @returns A `React.FunctionComponent` with the given class always applied
 */
export function WrapOverlay<Base extends ElementType = 'div'>(
    baseClass: string, 
    baseAs?: Base,
) {
    const _base = baseAs ?? 'div';
    return function<E extends ElementType = Base>({
        as,
        className,
        ...rest
    }: PolymorphicProps<E, { className?: string }>) {
        const As = (as ?? _base) as ElementType;
        const name = typeof className === 'string' ? `${baseClass}, ${className}` : baseClass;
        return <As className={name} {...rest} /> 
    }
}

/**
 *  A border overlay.
 * 
 *  @remarks
 *  color can be set via a `--border-color` css variable or the parent elements's color
 *  border width should be set via a `--border-width` css variable, which is also used
 *  to calculate the element's position.
 */
export const DistortBorder = WrapOverlay(styles.border);

/**
 *  A background overlay. 
 * 
 *  @remarks
 *  Background color can be set via `--background-color` css variable.
 *  The parent element's background color should be set to transparent visibility.
 */
export const DistortBackground = WrapOverlay(styles.background);

/**
 *   The base css classnames for library provided overlays
 */
export const DistortStyles = { 
    /**
     * {@link DistortBorder}'s base css class
     */
    border: styles.border, 
    /**
     *  {@link DistortBackground}'s base css class
     */
    background: styles.background,
} as const;
