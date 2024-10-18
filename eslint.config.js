// @ts-check

import tslint from 'typescript-eslint';
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin'

export default tslint.config(
    pluginJs.configs.recommended,
    ...tslint.configs.strictTypeChecked,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
    stylistic.configs['disable-legacy'],
    stylistic.configs.customize({
        flat: true,
        indent: 4,
        jsx: true,
        semi: true,
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
        arrowParens: true,
    }),
    {
        settings: {
            react: {
              version: 'detect',
            },
        },
        files: [
            '{src,examples}/**/*.{js,mjs,cjs,ts,jsx,tsx}',
            'test.tsx'
        ],
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaFeatures: {
                    modules: true,
                    jsx: true,
                },
            },
        },
        rules: {
            'sort-imports': ['error', { 'allowSeparatedGroups': true }],
            'no-console': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true }],
            '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
            '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
            '@stylistic/max-statements-per-line': ['error', { max: 2 }],
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/member-delimiter-style': ['error', {
                multiline: {
                    delimiter: 'comma',
                    requireLast: true
                },
                singleline: {
                    delimiter: 'comma',
                    requireLast: false
                },
                multilineDetection: 'brackets'
            }],
        },
    },
);