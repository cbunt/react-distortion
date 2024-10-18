import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts'

/** @type {import('rollup').RollupOptions[]} */
export default [
    {
        input: 'src/index.ts',
        external: ['react', 'react/jsx-runtime'],
        output: [
            {
                file: 'dist/index.cjs',
                format: 'cjs',
                name: 'react-distortion',
                exports: 'named'
            },
            {
                file: 'dist/index.js',
                format: 'esm',
            }
        ],
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
            css({
                modules: true,
                inject: true,
            }),
        ]
    },
    {
        input: 'src/index.ts',
        external: ['react', 'react/jsx-runtime'],
        output: [{ file: "dist/index.d.ts", format: "es" }],
        plugins: [dts()],
    }
]

