// @ts-check

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const baseConfig = {
    entryPoints: [
        '../src/distort-component.tsx',
    ],
    plugin: [
        'typedoc-plugin-markdown',
        'typedoc-plugin-rename-defaults',
        'typedoc-plugin-dt-links',
        './typedoc-minimal-theme.js',
    ],
    tsconfig: './tsconfig.json',
    theme: 'minimal',
    out: '..',
    cleanOutputDir: false,
    disableSources: true,
    basePath: '..',
    sort: [
        'source-order'
    ],
    navigation: {
        'includeCategories': true,
        'includeGroups': false,
        'includeFolders': false
    },
    categoryOrder: [
        'Component',
        'Options',
        'Utility Types',
        'child-elements'
    ],
}

/** @type {Partial<import('typedoc-plugin-markdown').PluginOptions>} */
const markdownConfig = {
    outputFileStrategy: 'modules',
    typeDeclarationFormat: 'list',
    parametersFormat: 'table',
    enumMembersFormat: 'table',
    hidePageHeader: true,
    flattenOutputFiles: true,
    expandObjects: true,
    hideBreadcrumbs: true,
}

export default {
    ...baseConfig,
    ...markdownConfig,
}