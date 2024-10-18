// @ts-check

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const baseConfig = {
    entryPoints: [
        "../src/distort-component.tsx",
        "../src/child-elements.tsx"
    ],
    plugin: [
        "typedoc-plugin-dt-links",
        "typedoc-plugin-merge-modules",
        "typedoc-plugin-markdown",
        "./typedoc-minimal-theme.js",
    ],
    theme: "minimal",
    out: "..",
    cleanOutputDir: false,
    disableSources: true,
    basePath: '..',
    sort: [
        "source-order"
    ],
    navigation: {
        "includeCategories": true,
        "includeGroups": false,
        "includeFolders": false
    },
    categoryOrder: [
        "Component",
        "Options",
        "child-elements"
    ],
}

/** @type {Partial<import('typedoc-plugin-markdown').PluginOptions>} */
const markdownConfig = {
    outputFileStrategy: "modules",
    typeDeclarationFormat: "table",
    parametersFormat: "table",
    enumMembersFormat: "table",
    hidePageHeader: true,
    flattenOutputFiles: true,
    expandObjects: true,
    hideBreadcrumbs: true,
}

export default {
    ...baseConfig,
    ...markdownConfig,
}