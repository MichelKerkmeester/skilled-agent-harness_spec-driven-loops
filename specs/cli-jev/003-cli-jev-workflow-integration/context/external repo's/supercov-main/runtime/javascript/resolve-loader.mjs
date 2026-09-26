import { resolve as resolvePath } from "node:path";
import { pathToFileURL } from "node:url";
const GENERATED_TARGET = "__SUPERCOV_PLAYWRIGHT_MODULE__";
const TARGET = process.env.SUPERCOV_PLAYWRIGHT_MODULE ??
    (GENERATED_TARGET.startsWith("__") ? "@playwright/test" : GENERATED_TARGET);
const REPLACEMENT = process.env.SUPERCOV_PLAYWRIGHT_WRAPPER ??
    "./.supercov/node_modules/playwright.mjs";
const PROJECT_ROOT = process.env.SUPERCOV_PROJECT_ROOT;
const ORIGINAL_CONFIG = process.env.SUPERCOV_ORIGINAL_PLAYWRIGHT_CONFIG;
function belongsToProject(parentURL) {
    if (!parentURL || parentURL.includes("/node_modules/"))
        return false;
    // Never redirect the original config while Playwright is synchronously
    // loading it. Test modules still need the ESM redirect because Playwright's
    // transform path does not consistently pass through Module._load.
    if (ORIGINAL_CONFIG &&
        parentURL === pathToFileURL(resolvePath(ORIGINAL_CONFIG)).href)
        return false;
    if (!PROJECT_ROOT)
        return parentURL.includes("/tests/");
    // Derive the URL the way Node derives parentURL, or the two never match on
    // Windows: a hand-built `file://C:/...` is not the `file:///C:/...` that
    // pathToFileURL produces, and every project module would read as foreign.
    const projectURL = pathToFileURL(PROJECT_ROOT).href.replace(/\/?$/, "/");
    const generatedURL = `${projectURL}.supercov/`;
    return (parentURL.startsWith(projectURL) && !parentURL.startsWith(generatedURL));
}
export async function resolve(specifier, context, nextResolve) {
    // Some transpilers preserve the source-relative runtime import while moving
    // only the transformed application file to an output directory. The
    // source-local copy keeps strict rootDir compilers happy; this fallback
    // resolves the emitted import to Supercov's generated runtime without
    // requiring the project's build to copy our helper directory.
    if (specifier.endsWith("/.supercov/node_modules/runtime.mjs") &&
        belongsToProject(context.parentURL)) {
        return {
            url: new URL("./runtime.mjs", import.meta.url).href,
            shortCircuit: true,
        };
    }
    if (process.env.SUPERCOV_CJS_INTERCEPT === "1" &&
        (specifier === "node:test" || specifier === "test") &&
        belongsToProject(context.parentURL)) {
        return {
            url: new URL("./nodeTest.mjs", import.meta.url).href,
            shortCircuit: true,
        };
    }
    if (process.env.SUPERCOV_CJS_INTERCEPT === "1" &&
        ["assert", "node:assert", "assert/strict", "node:assert/strict"].includes(specifier) &&
        belongsToProject(context.parentURL)) {
        return {
            url: new URL(specifier.endsWith("/strict") ? "./nodeAssertStrict.mjs" : "./nodeAssert.mjs", import.meta.url).href,
            shortCircuit: true,
        };
    }
    if (process.env.SUPERCOV_INSIDE_PLAYWRIGHT === "1" &&
        TARGET &&
        REPLACEMENT &&
        specifier === TARGET &&
        belongsToProject(context.parentURL)) {
        if (process.env.SUPERCOV_DEBUG === "1") {
            console.error(`[supercov] redirected ${specifier} for ${context.parentURL}`);
        }
        if (REPLACEMENT.startsWith("file:")) {
            return { url: REPLACEMENT, shortCircuit: true };
        }
        if (REPLACEMENT.startsWith(".")) {
            return {
                url: pathToFileURL(resolvePath(process.cwd(), REPLACEMENT)).href,
                shortCircuit: true,
            };
        }
        return nextResolve(REPLACEMENT, context);
    }
    return nextResolve(specifier, context);
}
