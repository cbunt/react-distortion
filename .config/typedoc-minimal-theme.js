// @ts-check

import { Comment, Converter, ReflectionKind } from 'typedoc';
import { MarkdownThemeContext, MarkdownTheme, MarkdownPageEvent } from 'typedoc-plugin-markdown';

/** 
 *  @param {import('typedoc').ContainerReflection} parent 
 *  @returns {import('typedoc').ContainerReflection[]}
 */
function getModules(parent) {
    if (!parent.kindOf(ReflectionKind.Module)) return [];
    if (parent.children == undefined) return [parent];
    return [parent, ...parent.children.flatMap(getModules)]
}

/** 
 *  Merges module comments into the project root.
 * 
 *  @param {import('typedoc').ProjectReflection} project 
 */
function movePackageDoc(project) {
    project.comment ??= new Comment([], []);

    for (const module of project.children?.flatMap(getModules) ?? []) {
        if (module.comment?.summary == null) continue;
        project.comment.summary.push(...module.comment.summary);
        return;
    }
}

/** Removes elements unnecessary in this package */
class MinimalMarkdownTheme extends MarkdownTheme {
    getRenderContext(page) {
        const context = new MarkdownThemeContext(this, page, this.application.options);

        /** @type {typeof context.partials.typeDeclarationTable} */
        const typeDeclarationTable = context.partials.typeDeclarationTable.bind(context);

        context.partials = {
            ...context.partials,
            // The package exports one function, and it's a component.
            signatureReturns: () => '',
            // The titles mostly reiterate the typings
            signatureTitle: () => '',
            declarationTitle: () => '',
            // Table cell-safe line breaks around Remarks headers 
            typeDeclarationTable: (model, props) => 
                typeDeclarationTable(model, props).replaceAll('**Remarks**', '<br><br>**Remarks**<br>'),
        }
        return context;
    }
}

/** @param {import('typedoc-plugin-markdown').MarkdownApplication} app */
export function load(app) {
    app.renderer.defineTheme('minimal', MinimalMarkdownTheme);
    app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (p) => movePackageDoc(p.project), 200);

    // Remove redundant file anchors.
    app.renderer.on(MarkdownPageEvent.END, (page) => {
        page.contents = page.contents?.replaceAll('README.md#','#',);
    });
}