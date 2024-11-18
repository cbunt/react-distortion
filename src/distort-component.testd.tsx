import { CSSProperties, ReactNode } from 'react';
import DistortComponent from './distort-component';

/**
 * Simple test cases for DistortComponent typing
 * Checked by tsc but otherwise ignored
 *
 * Failing as of 17-11-2024 due to 'as' not requiring
 * custom components to support children and style props.
 */

// @ts-expect-error 'as' should support children and style
<DistortComponent as="input" />;

// @ts-expect-error 'as' should support children and style
<DistortComponent as={() => <div />} />;

// @ts-expect-error should only allow properties supported by 'as'
<DistortComponent as="div" href="./" />;

// @ts-expect-error 'as' should accept custom Components that require additional props
<DistortComponent as={(props: { children?: ReactNode, style?: CSSProperties, a: number }) => <div {...props} />} />;

// should allow properties supported by 'as'
<DistortComponent as="a" href="./" />;

// 'as' should accept custom Components that support children and style
<DistortComponent as={(props: { children?: ReactNode, style?: CSSProperties }) => <div {...props} />} />;

// 'as' should accept custom Components with additional props
<DistortComponent as={(props: { children?: ReactNode, style?: CSSProperties, a?: number }) => <div {...props} />} />;
