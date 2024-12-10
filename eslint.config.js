// @ts-check
import tslint from 'typescript-eslint';
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import jestPlugin from 'eslint-plugin-jest';
import stylistic from '@stylistic/eslint-plugin'


const base = [
    ...tslint.configs.strictTypeChecked,
    pluginJs.configs.recommended,
    // @ts-expect-error
    pluginReact.configs.flat.recommended,
    // @ts-expect-error
    pluginReact.configs.flat['jsx-runtime'],
    stylistic.configs['disable-legacy'],
    stylistic.configs.customize({
        indent: 4,
        semi: true,
        jsx: false,
        braceStyle: '1tbs',
        arrowParens: true,
    }),
    {
        plugins: {
            "react-hooks": hooksPlugin,
        },
        rules: hooksPlugin.configs.recommended.rules,
    },
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: {
                    modules: true,
                    jsx: true,
                },
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'sort-imports': ['error', { 'allowSeparatedGroups': true }],
            'no-console': 'warn',
            'no-unused-vars': 'off',
            'react-hooks/exhaustive-deps': ['error', {}],
            '@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true }],
            '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
            '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
            // '@stylistic/jsx-function-call-newline': ["error", "multiline"],
            // '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],
            // '@stylistic/jsx-closing-tag-location': ['error', 'line-aligned'],
            '@stylistic/max-statements-per-line': ['error', { max: 2 }],
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
            '@stylistic/function-call-argument-newline': ['error', 'consistent'],
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
];

export default tslint.config(
    {
        // @ts-expect-error
        extends: [...base],
        files: [
            'examples/**/*.ts',
            'examples/**/*.tsx',
            'src/**/*.ts',
            'src/**/*.tsx',
        ],
    },
    {
        extends: [...base, jestPlugin.configs['flat/recommended']],
        files:  [
            '**/*.test.ts',
            '**/*.test.tsx',
        ],
    }
);