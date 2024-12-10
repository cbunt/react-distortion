import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts'

/** @type {import('rollup').RollupOptions[]} */
export default [
    {
        jsx: 'preserve-react',
        input: {
            'distort-component': 'src/distort-component.tsx',
        },
        output : [
                {
                    dir: 'dist',
                    entryFileNames: '[name].cjs',
                    format: 'cjs',
                    exports: 'named'
                },
                {
                    dir: 'dist',
                    entryFileNames: '[name].js',
                    format: 'esm',
                }
        ],
        external: ['react', 'react/jsx-runtime', 'react-dom'],
        plugins: [
            babel({
                babelHelpers: 'bundled',
                presets: ["@babel/preset-env"],
                extensions: ['.ts', '.tsx']
             }),
            typescript({ tsconfig: './tsconfig.json' }),
        ],
    },
    // {
    //     input: {
    //         'distort-component': 'src/distort-component.tsx',
    //     },
    //     external: ['react', 'react/jsx-runtime', 'react-dom'],
    //     output: [{ 
    //         dir: 'dist', 
    //         entryFileNames: '[name].d.ts',
    //     }],
    //     plugins: [dts({ respectExternal: true })],
    // }
]
