var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import Module, { register, syncBuiltinESMExports } from "node:module";
import fs, { closeSync, openSync, readFileSync, realpathSync, unlinkSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { installLaunchSupervisor, wrapImportedCapability } from "./launchSupervisor.mjs";
import { __supercovBindCapabilityWrapper } from "./capability.mjs";
installLaunchSupervisor();
// Instrumented sources import the browser-safe capability seam; bind the
// real supervisor implementation before any user module evaluates.
__supercovBindCapabilityWrapper(wrapImportedCapability);
// Long-running commands are diagnosed without changing their runner's exit
// semantics. The first preloaded Node process atomically elects itself for the
// run and periodically reports public active-resource types. This deliberately
// uses no Unix signal: a launch tree may contain uninstrumented Node children,
// and signalling one would terminate a healthy command by default.
const verboseDiagnostics = [process.env.SUPERCOV_VERBOSE, process.env.SUPERCOV_DEBUG]
    .some(value => value === "1" || value === "true" || value === "yes");
if (verboseDiagnostics && !process.__SUPERCOV_DIAGNOSTIC_REPORTER__) {
    process.__SUPERCOV_DIAGNOSTIC_REPORTER__ = true;
    const ownerFile = process.env.SUPERCOV_DIAGNOSTIC_OWNER_FILE;
    let ownerDescriptor;
    try {
        if (ownerFile)
            ownerDescriptor = openSync(ownerFile, "wx");
    }
    catch {
        // Another preloaded process owns diagnostics for this run.
    }
    if (ownerDescriptor !== undefined) {
        const configuredInterval = Number(process.env.SUPERCOV_DIAGNOSTIC_INTERVAL_MS ?? 60_000);
        const intervalMs = Number.isSafeInteger(configuredInterval) && configuredInterval > 0
            ? configuredInterval
            : 60_000;
        const reportResources = () => {
            const resources = typeof process.getActiveResourcesInfo === "function"
                ? process.getActiveResourcesInfo()
                : [];
            const counts = Object.fromEntries([...new Set(resources)].sort().map(resource => [
                resource,
                resources.filter(candidate => candidate === resource).length,
            ]));
            console.error(`[supercov:active-resources] ${JSON.stringify({
                pid: process.pid,
                ppid: process.ppid,
                uptimeMs: Math.round(process.uptime() * 1000),
                resources: counts,
            })}`);
        };
        const diagnosticTimer = setInterval(reportResources, intervalMs);
        diagnosticTimer.unref();
        process.once("exit", () => {
            clearInterval(diagnosticTimer);
            try {
                closeSync(ownerDescriptor);
            }
            catch { }
            try {
                unlinkSync(ownerFile);
            }
            catch { }
        });
    }
}
// Direct instrumentation must initialize the collector before script files
// with no import boundary evaluate. Other modes let the runner adapter or an
// instrumented module load it, except when durable remote evidence requires it.
if (process.env.SUPERCOV_DURABLE_EVIDENCE_EACH_TEST === "1" ||
    process.env.SUPERCOV_DIRECT_INSTRUMENTATION === "1") {
    // A translated remote/VM command can execute an ahead-of-run transformed
    // test through an opaque runner that bypasses the ordinary Playwright or
    // node:test import boundary. The remote-launch adapter marks that process;
    // initialize the runtime before its transformed module can evaluate.
    globalThis.__SUPERCOV_DIRECT_RUNTIME__ ??= await import("./runtime.mjs");
    process.__SUPERCOV_DIRECT_RUNTIME__ ??= globalThis.__SUPERCOV_DIRECT_RUNTIME__;
    // Generic builds can contain script files with no import/export syntax.
    // They cannot import the collector without changing their module semantics,
    // and may evaluate before any ESM instrumented file imports it.
    globalThis.__supercovRuntime ??= globalThis.__SUPERCOV_DIRECT_RUNTIME__;
}
// Workers are independent Node processes and an explicit `execArgv: []`
// otherwise strips the preload that supplies the isolated runtime. Preserve
// every user option while adding exactly one Supercov import.
const workerThreads = Module._load("node:worker_threads", undefined, false);
const NativeWorker = workerThreads.Worker;
const registerArgument = `--import=${new URL("./register.mjs", import.meta.url).href}`;
const appendRegister = values => values.some(value => value === registerArgument || value.includes("/.supercov/node_modules/register.mjs"))
    ? values
    : [...values, registerArgument];
workerThreads.Worker = class SupercovWorker extends NativeWorker {
    constructor(filename, options = {}) {
        const workerOptions = { ...options };
        let workerEntrypoint = filename;
        // Node currently records --import in an eval Worker's process.execArgv but
        // does not execute the preload. Bootstrap the unchanged source after the
        // register promise instead so eval workers receive the same runtime.
        if (options.eval === true && typeof filename === "string") {
            workerEntrypoint = `import(${JSON.stringify(new URL("./register.mjs", import.meta.url).href)}).then(() => {\n${filename}\n}).catch(error => queueMicrotask(() => { throw error; }));`;
        }
        // Omitted execArgv already inherits Node's internally validated parent
        // flags. Only an explicit override needs the Supercov import restored.
        if (options.eval !== true && options.execArgv !== undefined)
            workerOptions.execArgv = appendRegister(options.execArgv);
        super(workerEntrypoint, {
            ...workerOptions,
        });
    }
};
syncBuiltinESMExports();
// NODE_OPTIONS reaches commands launched through npm scripts. When that child
// is Vitest, replace its config with our generated merging config before the
// CLI parses argv. This is what makes `supercov -- npm test` work
// without editing package scripts, Vitest configs, setup files, or test imports.
const generatedVitestConfig = process.env.SUPERCOV_GENERATED_VITEST_CONFIG;
const generatedPlaywrightConfig = process.env.SUPERCOV_GENERATED_PLAYWRIGHT_CONFIG;
const entrypoint = process.argv[1]?.replaceAll("\\", "/") ?? "";
const playwrightTarget = process.env.SUPERCOV_PLAYWRIGHT_MODULE;
const projectRoot = process.env.SUPERCOV_PROJECT_ROOT?.replaceAll("\\", "/").replace(/\/$/, "");
const nodeTestWrapper = new URL("./nodeTest.mjs", import.meta.url).href;
const nodeAssertWrapper = new URL("./nodeAssert.mjs", import.meta.url).href;
const nodeAssertStrictWrapper = new URL("./nodeAssertStrict.mjs", import.meta.url).href;
const isPlaywrightEntrypoint = /\/(?:node_modules\/\.bin\/playwright|node_modules\/(?:@playwright\/test|playwright)\/(?:cli\.js|.*\/program\.js))$/.test(entrypoint);
const isJestEntrypoint = /\/node_modules\/(?:\.bin\/jest|(?:jest|jest-cli)\/bin\/jest\.js)$/.test(entrypoint);
if (generatedPlaywrightConfig && isPlaywrightEntrypoint)
    process.env.SUPERCOV_INSIDE_PLAYWRIGHT = "1";
// Linters, formatters and type checks read the project to judge it, not to
// run it. The workspace holds rewritten copies, and ESLint failed semver,
// js-yaml and picomatch on code nobody wrote ("Strings must use singlequote",
// "'globalThis' is not defined"), Supercov's own .supercov/*.mjs included.
// Such a process reads every rewritten file as its author wrote it, and no
// directory listing in the workspace shows .supercov.
const analysisTools = "eslint|eslint_d|prettier|standard|semistandard|ts-standard|xo|jshint|tslint";
const isAnalysisEntrypoint = new RegExp(`/node_modules/(?:\\.bin/(?:${analysisTools})$|(?:${analysisTools})/)`).test(entrypoint) ||
    (/\/node_modules\/(?:\.bin\/(?:tsc|vue-tsc)$|(?:typescript|vue-tsc)\/bin\/)/.test(entrypoint) &&
        process.argv.includes("--noEmit"));
if (isAnalysisEntrypoint)
    installAuthoredSourceView();
function installAuthoredSourceView() {
    let authored;
    try {
        authored = new Set(JSON.parse(readFileSync(new URL("./authored-sources.json", import.meta.url), "utf8")));
    }
    catch {
        authored = new Set();
    }
    const authoredRoot = fileURLToPath(new URL("./.authored/", import.meta.url));
    const workspace = fileURLToPath(new URL("../../", import.meta.url));
    const roots = [...new Set([workspace, (() => {
                try {
                    return realpathSync(workspace);
                }
                catch {
                    return workspace;
                }
            })()])];
    const inside = (path) => {
        if (typeof path !== "string" && !(path instanceof URL))
            return undefined;
        let absolute;
        try {
            absolute = resolve(path instanceof URL ? fileURLToPath(path) : path);
        }
        catch {
            return undefined;
        }
        for (const root of roots) {
            const local = relative(root, absolute);
            if (local !== ".." && !local.startsWith(`..${sep}`) && !isAbsolute(local))
                return local.split(sep).join("/");
        }
        return undefined;
    };
    const authoredPath = (path) => {
        const local = inside(path);
        return local !== undefined && authored.has(local) ? resolve(authoredRoot, local) : path;
    };
    // A recursive listing names nested entries by relative path, or as
    // entries whose parent is inside .supercov.
    const supercovPath = (path) => typeof path === "string" && path.split(/[\\/]/).includes(".supercov");
    const hidden = (entry) => {
        if (typeof entry === "string")
            return supercovPath(entry);
        if (entry instanceof Uint8Array)
            return supercovPath(new TextDecoder().decode(entry));
        const parent = inside(entry?.parentPath ?? entry?.path ?? "");
        return entry?.name === ".supercov" || supercovPath(parent);
    };
    const listed = (path, entries) => inside(path) === undefined || !Array.isArray(entries)
        ? entries
        : entries.filter((entry) => !hidden(entry));
    const { readFileSync: readSync, readFile: readCallback, readdirSync: listSync, readdir: listCallback } = fs;
    const { readFile: readPromise, readdir: listPromise } = fs.promises;
    fs.readFileSync = function readFileSync(path, ...rest) {
        return Reflect.apply(readSync, this, [authoredPath(path), ...rest]);
    };
    fs.readFile = function readFile(path, ...rest) {
        return Reflect.apply(readCallback, this, [authoredPath(path), ...rest]);
    };
    fs.promises.readFile = function readFile(path, ...rest) {
        return Reflect.apply(readPromise, this, [authoredPath(path), ...rest]);
    };
    fs.readdirSync = function readdirSync(path, ...rest) {
        return listed(path, Reflect.apply(listSync, this, [path, ...rest]));
    };
    fs.readdir = function readdir(path, ...rest) {
        const callback = rest.at(-1);
        if (typeof callback !== "function")
            return Reflect.apply(listCallback, this, [path, ...rest]);
        return Reflect.apply(listCallback, this, [path, ...rest.slice(0, -1), (error, entries) => callback(error, error ? entries : listed(path, entries))]);
    };
    fs.promises.readdir = async function readdir(path, ...rest) {
        return listed(path, await Reflect.apply(listPromise, this, [path, ...rest]));
    };
    syncBuiltinESMExports();
}
register(new URL("./resolve-loader.mjs", import.meta.url));
if (process.env.SUPERCOV_DEBUG === "1") {
    console.error("[supercov] preload", { entrypoint });
}
if (generatedVitestConfig && /\/vitest(?:\.m?js)?$/.test(entrypoint)) {
    // Worker processes inherit this marker. In particular, do not eagerly load
    // Playwright's expect implementation in a Vitest worker: both runners use
    // the Jest matcher registry symbol and intentionally cannot coexist there.
    process.env.SUPERCOV_INSIDE_VITEST = "1";
    let originalConfig;
    for (let index = 2; index < process.argv.length; index += 1) {
        const argument = process.argv[index];
        if (argument === "--config" || argument === "-c") {
            const configured = process.argv[index + 1];
            const resolvedConfig = configured
                ? resolve(process.cwd(), configured)
                : undefined;
            if (resolvedConfig && resolvedConfig !== resolve(generatedVitestConfig)) {
                originalConfig = resolvedConfig;
            }
            process.argv.splice(index, configured ? 2 : 1);
            index -= 1;
        }
        else if (argument?.startsWith("--config=")) {
            const resolvedConfig = resolve(process.cwd(), argument.slice("--config=".length));
            if (resolvedConfig !== resolve(generatedVitestConfig)) {
                originalConfig = resolvedConfig;
            }
            process.argv.splice(index, 1);
            index -= 1;
        }
    }
    if (originalConfig) {
        process.env.SUPERCOV_ORIGINAL_VITEST_CONFIG = originalConfig;
    }
    process.argv.push("--config", generatedVitestConfig);
    if (process.env.SUPERCOV_DEBUG === "1") {
        console.error("[supercov] Vitest argv configured", {
            entrypoint,
            originalConfig,
            generatedVitestConfig,
            argv: process.argv.slice(2),
        });
    }
}
if ((isJestEntrypoint || process.env.JEST_WORKER_ID) && process.env.SUPERCOV_EVIDENCE_DIR) {
    // Jest evaluates instrumented modules in its own module system, past the
    // loader hook that imports the runtime on first use elsewhere, and
    // jest-environment-node exposes to each test's sandbox only the globals
    // the outer process held when that class loaded. The Jest process and
    // each of its workers (JEST_WORKER_ID) therefore load the runtime first;
    // without this, a suite with more than one test file failed on every
    // instrumented module's first line inside the workers.
    globalThis.__SUPERCOV_DIRECT_RUNTIME__ ??= await import("./runtime.mjs");
    process.__SUPERCOV_DIRECT_RUNTIME__ ??= globalThis.__SUPERCOV_DIRECT_RUNTIME__;
}
if (isJestEntrypoint && process.env.SUPERCOV_EVIDENCE_DIR) {
    // Jest reads one configuration. Ours (jest.config.mjs) reads the user's
    // the way Jest would and adds the adapter and reporter; an explicit
    // --config on the command line reaches it through the environment.
    const generatedJestConfig = fileURLToPath(new URL("./jest.config.mjs", import.meta.url));
    for (let index = 2; index < process.argv.length; index += 1) {
        const argument = process.argv[index];
        if (argument === "--config" || argument === "-c") {
            const value = process.argv[index + 1];
            // Expo's Jest executable forwards argv to the real Jest process.
            // Preserve the original config across that second preload; reading
            // our own config as the user's would recurse until the heap fills.
            if (value && resolve(value) !== resolve(generatedJestConfig))
                process.env.SUPERCOV_ORIGINAL_JEST_CONFIG = resolve(value);
            process.argv.splice(index, value ? 2 : 1);
            index -= 1;
        }
        else if (argument?.startsWith("--config=")) {
            const value = resolve(argument.slice("--config=".length));
            if (value !== resolve(generatedJestConfig))
                process.env.SUPERCOV_ORIGINAL_JEST_CONFIG = value;
            process.argv.splice(index, 1);
            index -= 1;
        }
    }
    process.argv.push("--config", generatedJestConfig);
}
if (generatedPlaywrightConfig &&
    isPlaywrightEntrypoint) {
    for (let index = 2; index < process.argv.length; index += 1) {
        const argument = process.argv[index];
        if (argument === "--config" || argument === "-c") {
            process.argv.splice(index, process.argv[index + 1] ? 2 : 1);
            index -= 1;
        }
        else if (argument?.startsWith("--config=")) {
            process.argv.splice(index, 1);
            index -= 1;
        }
    }
    process.argv.push("--config", generatedPlaywrightConfig);
}
if (process.env.SUPERCOV_CJS_INTERCEPT === "1" &&
    process.env.SUPERCOV_INSIDE_PLAYWRIGHT === "1" &&
    !isPlaywrightEntrypoint &&
    process.env.SUPERCOV_INSIDE_VITEST !== "1" &&
    process.env.VITEST !== "true") {
    const target = playwrightTarget ?? "@playwright/test";
    const projectRoot = process.env.SUPERCOV_PROJECT_ROOT;
    const originalPlaywrightConfig = process.env.SUPERCOV_ORIGINAL_PLAYWRIGHT_CONFIG
        ?.replaceAll("\\", "/");
    const wrapper = await import(__rewriteRelativeImportExtension(new URL("./playwright.mjs", import.meta.url)));
    const originalLoad = Module._load;
    Module._load = function supercovLoad(request, parent, isMain) {
        const parentFile = parent?.filename?.replaceAll("\\", "/");
        const normalizedRoot = projectRoot
            ?.replaceAll("\\", "/")
            .replace(/\/$/, "");
        const generatedRoot = normalizedRoot
            ? `${normalizedRoot}/.supercov/`
            : undefined;
        const belongsToProject = Boolean(parentFile) &&
            !parentFile.includes("/node_modules/") &&
            parentFile !== originalPlaywrightConfig &&
            (!generatedRoot || !parentFile.startsWith(generatedRoot)) &&
            (normalizedRoot
                ? parentFile.startsWith(`${normalizedRoot}/`)
                : parentFile.includes("/tests/"));
        if (request === target && belongsToProject)
            return wrapper;
        return originalLoad.call(this, request, parent, isMain);
    };
}
// CJS test files receive the same node:test adapter as ESM files. The adapter
// itself imports the native built-in from Supercov's generated directory, so
// only first-party callers are redirected and recursion is impossible.
if (process.env.SUPERCOV_CJS_INTERCEPT === "1") {
    const entrypointBelongsToProject = Boolean(projectRoot && entrypoint.startsWith(`${projectRoot}/`));
    const runnerCanLoadProjectCode = entrypointBelongsToProject ||
        entrypoint === "" ||
        process.env.SUPERCOV_INSIDE_VITEST === "1" ||
        (process.env.SUPERCOV_INSIDE_PLAYWRIGHT === "1" && !isPlaywrightEntrypoint);
    if (!runnerCanLoadProjectCode) {
        // Package-manager and Playwright coordinator processes propagate the
        // preload to their children but never evaluate project test modules.
        // Their worker/child entrypoints install these synchronous CJS hooks.
        // Avoid paying to import three runner adapters in every launcher.
    }
    else {
    const nodeTestAdapter = await import(__rewriteRelativeImportExtension(nodeTestWrapper));
    const cjsNodeTestAdapter = Object.assign(nodeTestAdapter.test, nodeTestAdapter);
    const nodeAssertAdapter = await import(__rewriteRelativeImportExtension(nodeAssertWrapper));
    const cjsNodeAssertAdapter = Object.assign(nodeAssertAdapter.default, nodeAssertAdapter);
    const nodeAssertStrictAdapter = await import(__rewriteRelativeImportExtension(nodeAssertStrictWrapper));
    const cjsNodeAssertStrictAdapter = Object.assign(nodeAssertStrictAdapter.default, nodeAssertStrictAdapter);
    const originalLoad = Module._load;
    Module._load = function supercovNodeTestLoad(request, parent, isMain) {
        const parentFile = parent?.filename?.replaceAll("\\", "/");
        const belongsToProject = Boolean(projectRoot &&
            parentFile?.startsWith(`${projectRoot}/`) &&
            !parentFile.includes("/node_modules/") &&
            !parentFile.startsWith(`${projectRoot}/.supercov/`));
        if (process.env.SUPERCOV_DEBUG === "1" &&
            (request === "node:test" || request === "test"))
            console.error("[supercov] node:test CJS request", { parentFile, projectRoot, belongsToProject });
        if ((request === "node:test" || request === "test") && belongsToProject)
            return cjsNodeTestAdapter;
        if (["assert", "node:assert", "assert/strict", "node:assert/strict"].includes(request) &&
            belongsToProject)
            return request.endsWith("/strict")
                ? cjsNodeAssertStrictAdapter
                : cjsNodeAssertAdapter;
        return originalLoad.call(this, request, parent, isMain);
    };
    }
}
