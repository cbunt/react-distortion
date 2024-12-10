import { CSSProperties, ReactNode } from 'react';
import DistortComponent from './distort-component';

/**
 * Simple test cases for DistortComponent typing
 * Checked by tsc but otherwise ignored
 */

// 'as' should allow components that don't support children
<DistortComponent as="input" />;

// @ts-expect-error 'as' should support style
<DistortComponent as={() => <div />} />;

// @ts-expect-error should only allow properties supported by 'as'
<DistortComponent as="div" href="./" />;

// @ts-expect-error 'as' should accept custom Components that require missing props
<DistortComponent as={(props: { children?: ReactNode, style?: CSSProperties, a: number }) => <div {...props} />} />;

// 'as' should accept custom Components that require provided props
<DistortComponent a={1} as={(props: { children?: ReactNode, style?: CSSProperties, a: number }) => <div {...props} />} />;

// should allow properties supported by 'as'
<DistortComponent as="a" href="./" />;

// 'as' should accept custom Components that support children and style
<DistortComponent as={(props: { children?: ReactNode, style?: CSSProperties }) => <div {...props} />} />;

// 'as' should accept custom Components with additional props
<DistortComponent as={(props: { children?: ReactNode, style?: CSSProperties, a?: number }) => <div {...props} />} />;
