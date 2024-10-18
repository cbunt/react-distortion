import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts'

/** @type {import('rollup').RollupOptions[]} */
export default [
    {
        jsx: 'preserve-react',
        input: {
            'distort-component': 'src/distort-component.tsx',
            'child-elements': 'src/child-elements.tsx',
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
        external: ['react', 'react/jsx-runtime'],
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
            css({
                modules: true,
                inject: true,
            }),
        ]
    },
    {
        input: {
            'distort-component': 'src/distort-component.tsx',
            'child-elements': 'src/child-elements.tsx',
        },
        external: ['react', 'react/jsx-runtime'],
        output: [{ 
            dir: 'dist', 
            entryFileNames: '[name].d.ts',
        }],
        plugins: [dts()],
    }
]
