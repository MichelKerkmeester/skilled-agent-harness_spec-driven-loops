var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import { createHash, randomBytes } from "node:crypto";
import childProcess from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { syncBuiltinESMExports } from "node:module";
import { relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import * as standardPlaywright from "@playwright/test";
import * as coverageRuntime from "./runtime.mjs";
import { inferTestProvenance } from "./provenance.mjs";
import { appendJsonLineDurableSync, appendJsonLineSync } from "./atomic.mjs";
import { COVERAGE_PHASE_HEADER, COVERAGE_PHASE_COOKIE, COVERAGE_SCOPE_COOKIE, COVERAGE_SCOPE_HEADER, COVERAGE_CARRIER_ENV, encodeCoverageCarrier, encodeCoverageScope, serverEvidenceDirectory, serverEvidencePath, } from "./transport.mjs";
export * from "@playwright/test";
const generatedTargetModule = "__SUPERCOV_PLAYWRIGHT_MODULE__";
const targetModule = process.env["SUPERCOV_PLAYWRIGHT_MODULE"] ??
    (generatedTargetModule.startsWith("__")
        ? "@playwright/test"
        : generatedTargetModule);
const generatedTestExport = "__SUPERCOV_PLAYWRIGHT_TEST_EXPORT__";
const targetTestExport = process.env["SUPERCOV_PLAYWRIGHT_TEST_EXPORT"] ??
    (generatedTestExport.startsWith("__") ? "test" : generatedTestExport);
const adapter = (targetModule === "@playwright/test"
    ? standardPlaywright
    : await import(__rewriteRelativeImportExtension(targetModule)));
// A page that loads the application as plain `<script>` files, from a static
// server, has no bundler to import the runtime the way a module graph would,
// and instrumented classic scripts read it from a global. Install the same
// self-contained runtime in every document before any of the page's scripts
// run. Every copy keys its state on the page's global, so this copy and one a
// bundler imports record into the same place. Its locals stay inside a
// function, out of the page's global scope.
const browserRuntimeSource = readFileSync(new URL("./runtime.mjs", import.meta.url), "utf8");
const browserRuntimeExport = browserRuntimeSource.lastIndexOf("\nexport {");
if (/^import\s/m.test(browserRuntimeSource) || browserRuntimeExport < 0)
    throw new Error("Supercov's browser runtime must stay self-contained");
const browserRuntimePrelude = `(() => { if (globalThis.__SUPERCOV_DIRECT_RUNTIME__) return;\n${browserRuntimeSource.slice(0, browserRuntimeExport)}\n})();`;
// A worker blocked in `Atomics.wait` runs no evaluation until the page wakes
// it, and the page action that wakes it comes after Supercov's own call: an
// awaited evaluation deadlocked Actual's suite. Every worker evaluation is
// bounded; one that does not answer in time is left queued, and a test whose
// worker evidence could not be read is recorded as partial, never as complete.
const WORKER_ACTIVATION_WAIT_MS = 250;
const WORKER_SNAPSHOT_WAIT_MS = 5000;
const WORKER_TIMED_OUT = Symbol("worker did not answer");
function bounded(promise, milliseconds) {
    let timer;
    return Promise.race([
        promise,
        new Promise((resolve) => {
            timer = setTimeout(() => resolve(WORKER_TIMED_OUT), milliseconds);
        }),
    ]).finally(() => clearTimeout(timer));
}
const base = (adapter[targetTestExport] ?? adapter.test);
const baseExpect = adapter.expect;
const GENERATED_EVIDENCE_DIRECTORY = "__SUPERCOV_EVIDENCE_DIRECTORY__";
// A pid is not an identity. Pool runners restore several VMs from one
// snapshot and re-execute tests in fresh workers that all carry the same
// pid; without a per-process token their attempts hash to one identity and
// their journals land in one file. The token mixes time with randomness
// because restored clones may also share entropy state.
const processInstanceToken = (() => {
    let random = "";
    try {
        random = randomBytes(3).toString("hex");
    }
    catch {
        random = Math.floor(Math.random() * 16777215).toString(16);
    }
    return `${random}${process.hrtime.bigint().toString(36).slice(-5)}`;
})();
const evidenceWriterIdentity = () => (process.env.SUPERCOV_EXECUTION_LOG_SHARD ?? `pid-${process.pid}-${processInstanceToken}`)
    .replace(/[^A-Za-z0-9_-]/g, "_");
const GENERATED_RUN_ID = "__SUPERCOV_RUN_ID__";
const PHASE_STORAGE_KEY = "__supercov_phase";
// Wall-clock accounting for every browser round-trip this shim performs,
// enabled by SUPERCOV_PHASE_TIMING=1. One summary line per test on stderr;
// a single boolean check when disabled.
const generatedPhaseTiming = "__SUPERCOV_PHASE_TIMING__";
const PHASE_TIMING = process.env["SUPERCOV_PHASE_TIMING"] === "1" || generatedPhaseTiming === "1";
const timingBuckets = PHASE_TIMING ? new Map() : undefined;
function timingCount(bucket, milliseconds = 0) {
    if (!timingBuckets)
        return;
    const entry = timingBuckets.get(bucket) ?? { calls: 0, ms: 0 };
    entry.calls += 1;
    entry.ms += milliseconds;
    timingBuckets.set(bucket, entry);
}
async function timed(bucket, work) {
    if (!timingBuckets)
        return work();
    const started = performance.now();
    try {
        return await work();
    }
    finally {
        timingCount(bucket, performance.now() - started);
    }
}
function timingReport(label) {
    if (!timingBuckets)
        return;
    const summary = Object.fromEntries([...timingBuckets.entries()].map(([bucket, entry]) => [bucket, { calls: entry.calls, ms: Math.round(entry.ms) }]));
    const line = JSON.stringify({ label, summary });
    console.error(`[supercov-timing] ${line}`);
    // Pooled runners swallow worker stderr for passing tests, so the report
    // also lands as a file beside the evidence, which rides the workspace
    // mount back to the host.
    try {
        const resolved = resolve(process.cwd(), ".supercov/phase-timing");
        mkdirSync(resolved, { recursive: true });
        appendJsonLineSync(resolve(resolved, `phase-timing-${process.pid}.jsonl`), `${line}\n`);
    }
    catch {
        // Timing must never affect the run.
    }
    timingBuckets.clear();
}
const ACTION_METHODS = new Set([
    "blur",
    "check",
    "click",
    "dblclick",
    "dispatchEvent",
    "dragTo",
    "evaluate",
    "evaluateHandle",
    "fill",
    "focus",
    "goBack",
    "goForward",
    "goto",
    "hover",
    "press",
    "reload",
    "selectOption",
    "setInputFiles",
    "tap",
    "type",
    "uncheck",
]);
const REQUEST_METHODS = new Set([
    "delete",
    "fetch",
    "get",
    "head",
    "patch",
    "post",
    "put",
]);
function isApiRequestContext(value) {
    const candidate = value;
    return (typeof candidate["fetch"] === "function" &&
        typeof candidate["get"] === "function" &&
        typeof candidate["post"] === "function");
}
function callerSource() {
    const stack = new Error().stack?.split("\n").slice(2) ?? [];
    const candidate = stack.find((line) => /[/\\]tests[/\\]/.test(line) &&
        !line.includes(".supercov") &&
        !line.includes("node_modules"));
    if (!candidate)
        return undefined;
    const normalized = candidate.trim().replace(/^at\s+/, "");
    const projectRoot = process.env["SUPERCOV_PROJECT_ROOT"]
        ?.replaceAll("\\", "/")
        .replace(/\/$/, "");
    if (!projectRoot)
        return normalized;
    // A stack frame's URL is what Node's pathToFileURL produces -- on Windows
    // `file:///C:/...`, never a hand-built `file://C:/...` -- so strip the
    // prefix derived the same way, then the bare path for frames without one.
    return normalized
        .replace(`${pathToFileURL(projectRoot).href}/`, "")
        .replace(`${projectRoot}/`, "");
}
class CoveragePhaseController {
    scope;
    configuredHeaders;
    phases = [];
    counter = 0;
    lastActionId;
    activePhaseId;
    pages = new Set();
    workers = new Set();
    contexts = new Set();
    contextConfiguredHeaders = new Map();
    cdpSessions = new Map();
    newDocumentScriptIds = new Map();
    pendingRegistrations = new Set();
    scriptUpdate = Promise.resolve();
    proxyCache = new WeakMap();
    runtimeSnapshots;
    // Contexts whose creation the collector did not observe: it does not know
    // what `extraHTTPHeaders` their owner configured, so it must not rewrite
    // them (the scope cookie and the fetch patch still carry attribution).
    // A worker-scoped context launched through a patched BrowserType is found
    // later but is not opaque: its original headers were captured at launch.
    adoptedContexts = new Set();
    // Listeners installed on contexts that outlive this test, removed on
    // dispose so a worker-scoped context does not keep registering pages with
    // controllers of tests that already finished.
    contextListeners = new Map();
    // Snapshots read from pages the suite closed before teardown. A `page`
    // fixture override tears down before the collector's own fixture, and a
    // closed page cannot be evaluated, so the evidence is taken on the way out.
    earlySnapshots = [];
    snapshottedPages = new WeakSet();
    snapshottedWorkers = new WeakSet();
    // Workers that did not answer an evaluation in time. They are not waited
    // for again until one answers.
    unresponsiveWorkers = new WeakSet();
    // Set when a worker's evidence could not be read: the test's coverage is
    // then a lower bound.
    workerEvidenceMissing = false;
    disposed = false;
    // Parameter properties are stateful despite the base ESLint rule treating
    // this as an empty constructor.
    // eslint-disable-next-line no-useless-constructor
    constructor(scope, configuredHeaders = {}) {
        this.scope = scope;
        this.configuredHeaders = configuredHeaders;
    }
    allPages() {
        return [...this.pages];
    }
    allWorkers() {
        return [...this.workers];
    }
    async collectRuntimeSnapshots() {
        if (this.runtimeSnapshots)
            return this.runtimeSnapshots;
        timingCount("collectRuntimeSnapshots.cold");
        // Contexts the suite created without going through any fixture the
        // collector wraps (a raw `browser.newContext()` mid-test) are found
        // through their browser now, so their still-open pages are read too.
        await this.adoptTrackedContexts().catch(() => undefined);
        const snapshots = [...this.earlySnapshots];
        for (const page of this.allPages()) {
            if (this.snapshottedPages.has(page))
                continue;
            snapshots.push(...(await this.snapshotPage(page)));
        }
        for (const worker of this.allWorkers()) {
            if (this.snapshottedWorkers.has(worker))
                continue;
            const snapshot = await this.snapshotWorker(worker);
            if (snapshot)
                snapshots.push(snapshot);
        }
        this.runtimeSnapshots = snapshots;
        return snapshots;
    }
    /**
     * A worker's evidence, or nothing when it cannot be read. A worker that
     * closed with its page has nothing left to read; one that did not answer
     * in time is still running and its evidence is missing from this test.
     */
    async snapshotWorker(worker) {
        const answer = await bounded(worker
            .evaluate(() => {
            const getSnapshot = globalThis.__SUPERCOV_COVERAGE_SNAPSHOT__;
            return getSnapshot?.() ?? { decisions: [], hits: [], events: [] };
        })
            .catch(() => undefined), WORKER_SNAPSHOT_WAIT_MS);
        if (answer === WORKER_TIMED_OUT) {
            this.unresponsiveWorkers.add(worker);
            this.workerEvidenceMissing = true;
            return undefined;
        }
        this.snapshottedWorkers.add(worker);
        return answer;
    }
    async snapshotPage(page) {
        const snapshots = [];
        for (const frame of page.frames()) {
            snapshots.push(await frame
                .evaluate(() => {
                const getSnapshot = globalThis.__SUPERCOV_COVERAGE_SNAPSHOT__;
                return getSnapshot?.() ?? { decisions: [], hits: [], events: [] };
            })
                .catch(() => ({
                decisions: [],
                hits: [],
                events: [],
            })));
        }
        return snapshots;
    }
    /** Read a registered page's evidence while it can still be evaluated. */
    async snapshotBeforeClose(page) {
        if (!this.pages.has(page) || this.snapshottedPages.has(page) || this.runtimeSnapshots)
            return;
        this.snapshottedPages.add(page);
        this.earlySnapshots.push(...(await this.snapshotPage(page)));
        // A dedicated worker ends with the page that owns it, so it is read
        // now; read after the page closed, a worker that ran the test's code
        // reported nothing.
        for (const worker of page.workers()) {
            if (this.snapshottedWorkers.has(worker))
                continue;
            const snapshot = await this.snapshotWorker(worker);
            if (snapshot)
                this.earlySnapshots.push(snapshot);
        }
    }
    /**
     * Register every live context the process created outside the wrapped
     * fixtures: contexts launched directly (`launchPersistentContext`) and
     * every context of every browser launched or connected directly.
     */
    async adoptTrackedContexts() {
        if (this.disposed)
            return;
        for (const context of liveTrackedContexts()) {
            if (!this.contexts.has(context)) {
                const headersKnown = trackedContextConfiguredHeaders.has(context);
                await this.registerContext(context, trackedContextConfiguredHeaders.get(context) ?? this.configuredHeaders, { adopted: !headersKnown }).catch(() => undefined);
            }
        }
    }
    async registerPage(page) {
        if (this.pages.has(page) || this.disposed)
            return;
        timingCount("registerPage");
        this.pages.add(page);
        const context = page.context();
        const tracked = liveTrackedContexts().has(context);
        const headersKnown = trackedContextConfiguredHeaders.has(context);
        await this.registerContext(context, trackedContextConfiguredHeaders.get(context) ?? this.configuredHeaders, {
            adopted: !this.contexts.has(context) && tracked && !headersKnown,
        });
        const cdp = await page.context().newCDPSession(page).catch(() => undefined);
        if (cdp)
            this.cdpSessions.set(page, cdp);
        const phaseId = this.requestPhaseId();
        if (phaseId)
            await this.activatePage(page, phaseId);
        page.on("worker", (worker) => {
            void this.registerWorker(worker);
        });
        for (const worker of page.workers())
            void this.registerWorker(worker);
    }
    async registerContext(context, configuredHeaders = this.configuredHeaders, { adopted = false } = {}) {
        if (this.contexts.has(context) || this.disposed)
            return;
        this.contexts.add(context);
        this.contextConfiguredHeaders.set(context, configuredHeaders);
        if (adopted)
            this.adoptedContexts.add(context);
        await context.addInitScript({ content: browserRuntimePrelude }).catch(() => undefined);
        // A context that outlives its test (a worker-scoped browser fixture)
        // is registered again by every later test, so this script accumulates
        // on it and each new document runs every copy in registration order.
        // That is made harmless rather than avoided: every copy publishes its
        // own attempt, so the newest wins; the fetch patch is installed once
        // and reads the attempt at call time, so a stale copy can never pin an
        // old scope onto a request the way nested wrappers would.
        await context.addInitScript(({ attemptId, scopeHeader, scopeValue, scopeCookie }) => {
            const coverageGlobal = globalThis;
            coverageGlobal.__SUPERCOV_ATTEMPT__ = { attemptId, scopeValue };
            coverageGlobal.__SUPERCOV_MCDC_TEST_ID__ = attemptId;
            try {
                document.cookie = `${scopeCookie}=${encodeURIComponent(scopeValue)}; Path=/; SameSite=Lax`;
                if (!coverageGlobal.__SUPERCOV_BROWSER_FETCH_PATCHED__) {
                    const originalFetch = globalThis.fetch?.bind(globalThis);
                    if (originalFetch) {
                        coverageGlobal.__SUPERCOV_BROWSER_FETCH_PATCHED__ = true;
                        globalThis.fetch = ((input, init) => {
                            const headers = new Headers(init?.headers ??
                                (input instanceof Request ? input.headers : undefined));
                            headers.set(scopeHeader, coverageGlobal.__SUPERCOV_ATTEMPT__?.scopeValue ?? scopeValue);
                            const phase = coverageGlobal.__SUPERCOV_PHASE_ID__;
                            if (phase)
                                headers.set("x-supercov-phase", phase);
                            return originalFetch(input, { ...init, headers });
                        });
                    }
                }
            }
            catch {
                // Browser instrumentation must not change application behavior.
            }
        }, {
            attemptId: this.scope.attemptId,
            scopeHeader: COVERAGE_SCOPE_HEADER,
            scopeValue: encodeCoverageScope(this.scope),
            scopeCookie: COVERAGE_SCOPE_COOKIE,
        }).catch(() => undefined);
        const register = (page) => {
            const pending = this.registerPage(page).finally(() => this.pendingRegistrations.delete(pending));
            this.pendingRegistrations.add(pending);
        };
        const registerServiceWorker = (worker) => {
            void this.registerWorker(worker);
        };
        context.on("page", register);
        context.on("serviceworker", registerServiceWorker);
        this.contextListeners.set(context, [["page", register], ["serviceworker", registerServiceWorker]]);
        for (const worker of context.serviceWorkers())
            void this.registerWorker(worker);
        if (!adopted)
            await this.updateContextHeaders(context, this.requestPhaseId());
        for (const page of context.pages())
            register(page);
    }
    async registerWorker(worker) {
        if (this.workers.has(worker))
            return;
        this.workers.add(worker);
        const phaseId = this.requestPhaseId();
        await worker
            .evaluate(({ attemptId, scopeHeader, scopeValue, phaseHeader, phase }) => {
            globalThis.__SUPERCOV_MCDC_TEST_ID__ = attemptId;
            if (phase)
                globalThis.__SUPERCOV_PHASE_ID__ = phase;
            globalThis.__SUPERCOV_ACTIVATE_PROBE_CONTEXT__?.(attemptId, phase);
            const originalFetch = globalThis.fetch?.bind(globalThis);
            if (!originalFetch)
                return;
            globalThis.fetch = ((input, init) => {
                const headers = new Headers(init?.headers ??
                    (input instanceof Request ? input.headers : undefined));
                headers.set(scopeHeader, scopeValue);
                if (phase)
                    headers.set(phaseHeader, phase);
                return originalFetch(input, { ...init, headers });
            });
        }, {
            attemptId: this.scope.attemptId,
            scopeHeader: COVERAGE_SCOPE_HEADER,
            scopeValue: encodeCoverageScope(this.scope),
            phaseHeader: COVERAGE_PHASE_HEADER,
            phase: phaseId,
        })
            .catch(() => undefined);
    }
    async beginAction(operation) {
        timingCount("beginAction");
        const phase = this.createPhase("action", operation);
        this.lastActionId = phase.id;
        this.activePhaseId = phase.id;
        await timed("action.activateInBrowser", () => this.activateInBrowser(phase.id));
        return phase;
    }
    beginAssertion(operation, source = callerSource()) {
        timingCount("beginAssertion");
        const phase = this.createPhase("assertion", operation, this.lastActionId, source);
        this.activePhaseId = phase.id;
        // Playwright queues browser protocol commands in order. Starting this
        // evaluation before an async locator assertion is sufficient to tag its
        // polling work without turning synchronous expect matchers into promises.
        void timed("assertion.activateInBrowser", () => this.activateInBrowser(phase.id));
        return phase;
    }
    requestPhaseId() {
        return this.activePhaseId;
    }
    async dispose() {
        this.disposed = true;
        await Promise.all([...this.pendingRegistrations]);
        await this.scriptUpdate;
        // A worker-scoped context survives this test. Remove its test scope
        // while preserving the exact headers supplied by the suite so work
        // between tests cannot be charged to the attempt that just ended.
        await Promise.all([...this.contexts]
            .filter((context) => !this.adoptedContexts.has(context))
            .map((context) => context
            .setExtraHTTPHeaders(this.contextConfiguredHeaders.get(context) ?? {})
            .catch(() => undefined)));
        for (const [context, listeners] of this.contextListeners) {
            for (const [event, listener] of listeners)
                context.off?.(event, listener);
        }
        this.contextListeners.clear();
        for (const [page, cdp] of this.cdpSessions) {
            const identifier = this.newDocumentScriptIds.get(page);
            if (identifier)
                await cdp
                    .send("Page.removeScriptToEvaluateOnNewDocument", {
                    identifier,
                })
                    .catch(() => undefined);
            await cdp.detach().catch(() => undefined);
        }
    }
    finish(phase, error) {
        phase.endedAtMs = Date.now();
        phase.status = error === undefined ? "passed" : "failed";
        if (error !== undefined)
            phase.error = error instanceof Error ? error.message : String(error);
    }
    wrap(target) {
        const cached = this.proxyCache.get(target);
        if (cached)
            return cached;
        const proxy = new Proxy(target, {
            get: (object, property, receiver) => {
                if (property === "then")
                    return undefined;
                // Playwright's locator matchers validate `receiver.constructor.name`.
                // Preserve the native constructor rather than wrapping it as a method.
                if (property === "constructor")
                    return object.constructor;
                const value = Reflect.get(object, property, receiver);
                if (typeof value !== "function")
                    return value;
                const method = String(property);
                return (...args) => {
                    const isRequest = REQUEST_METHODS.has(method) &&
                        isApiRequestContext(object);
                    if (ACTION_METHODS.has(method) || isRequest) {
                        return (async () => {
                            const operation = `${object.constructor?.name ?? "Playwright"}.${method}`;
                            const phase = await this.beginAction(operation);
                            try {
                                const result = await Reflect.apply(value, object, isRequest ? this.scopeApiRequest(args) : args);
                                this.finish(phase);
                                return this.prepareResult(result);
                            }
                            catch (error) {
                                this.finish(phase, error);
                                throw error;
                            }
                        })();
                    }
                    const invokedArgs = method === "newContext" && object.constructor?.name === "Browser"
                        ? this.scopeBrowserContext(args)
                        : args;
                    const result = Reflect.apply(value, object, invokedArgs);
                    return this.wrapResult(result, method === "newContext" ? invokedArgs : undefined);
                };
            },
        });
        this.proxyCache.set(target, proxy);
        // Playwright's built-in `page` fixture is created through the wrapped
        // worker-scoped browser. The test-scoped fixture sees that proxy again;
        // treating our own proxy as a fresh target would nest wrappers, emit two
        // phases for one operation, and perform every browser activation twice.
        this.proxyCache.set(proxy, proxy);
        return proxy;
    }
    createPhase(kind, operation, causedByPhaseId, source = callerSource()) {
        const phase = {
            id: `${this.scope.attemptId}:phase:${++this.counter}`,
            kind,
            operation,
            ...(source ? { source } : {}),
            ...(causedByPhaseId ? { causedByPhaseId } : {}),
            startedAtMs: Date.now(),
        };
        this.phases.push(phase);
        return phase;
    }
    wrapResult(result, sourceArgs) {
        if (result instanceof Promise)
            return result.then((resolved) => this.prepareResult(resolved, sourceArgs));
        if (result === null ||
            typeof result !== "object" ||
            Array.isArray(result) ||
            ArrayBuffer.isView(result))
            return result;
        return this.wrap(result);
    }
    async prepareResult(result, sourceArgs) {
        if (!result ||
            typeof result !== "object" ||
            Array.isArray(result) ||
            ArrayBuffer.isView(result))
            return result;
        const candidate = result;
        if (typeof candidate["contexts"] === "function" &&
            typeof candidate["newContext"] === "function")
            trackBrowser(result);
        if (typeof candidate["pages"] === "function" &&
            typeof candidate["route"] === "function") {
            const configuredHeaders = sourceArgs?.[0]
                ?.extraHTTPHeaders ?? this.configuredHeaders;
            trackContext(result, configuredHeaders);
            await this.registerContext(result, configuredHeaders);
        }
        if (typeof candidate["frames"] === "function" &&
            typeof candidate["context"] === "function")
            await this.registerPage(result);
        return this.wrap(result);
    }
    scopeApiRequest(args) {
        const scoped = [...args];
        const optionIndex = 1;
        const phaseId = this.requestPhaseId();
        const coverageHeaders = {
            [COVERAGE_SCOPE_HEADER]: encodeCoverageScope(this.scope),
            ...(phaseId ? { [COVERAGE_PHASE_HEADER]: phaseId } : {}),
        };
        const options = scoped[optionIndex] && typeof scoped[optionIndex] === "object"
            ? scoped[optionIndex]
            : {};
        scoped[optionIndex] = {
            ...options,
            headers: mergeRequestHeaders(options.headers, coverageHeaders),
        };
        return scoped;
    }
    scopeBrowserContext(args) {
        const scoped = [...args];
        const options = scoped[0] && typeof scoped[0] === "object"
            ? scoped[0]
            : {};
        scoped[0] = {
            ...options,
            extraHTTPHeaders: {
                ...(options.extraHTTPHeaders ?? {}),
                ...(activeCoverageHeaders() ?? {}),
            },
        };
        return scoped;
    }
    async activateInBrowser(phaseId) {
        await timed("activate.contextHeaders", () => Promise.all([...this.contexts]
            .filter((context) => !this.adoptedContexts.has(context))
            .map((context) => this.updateContextHeaders(context, phaseId))));
        await timed("activate.frameEvaluate", () => Promise.all([...this.pages].flatMap((page) => page.frames()).map((frame) => frame
            .evaluate(({ id, attemptId, storageKey, scopeCookie, scopeValue, phaseCookie }) => {
            globalThis.__SUPERCOV_PHASE_ID__ = id;
            const coverageGlobal = globalThis;
            // A document that loaded under an earlier test's attempt (a page
            // adopted mid-life from a shared context) follows the current one.
            coverageGlobal.__SUPERCOV_ATTEMPT__ = { attemptId, scopeValue };
            coverageGlobal.__SUPERCOV_MCDC_TEST_ID__ = attemptId;
            coverageGlobal.__SUPERCOV_ACTIVATE_PROBE_CONTEXT__?.(attemptId, id);
            try {
                localStorage.setItem(storageKey, id);
                document.cookie = `${scopeCookie}=${encodeURIComponent(scopeValue)}; Path=/; SameSite=Lax`;
                document.cookie = `${phaseCookie}=${encodeURIComponent(id)}; Path=/; SameSite=Lax`;
            }
            catch {
                // Sandboxed/cross-origin frames may not expose localStorage.
            }
        }, {
            id: phaseId,
            attemptId: this.scope.attemptId,
            storageKey: PHASE_STORAGE_KEY,
            scopeCookie: COVERAGE_SCOPE_COOKIE,
            scopeValue: encodeCoverageScope(this.scope),
            phaseCookie: COVERAGE_PHASE_COOKIE,
        })
            .catch(() => undefined))));
        await timed("activate.workerEvaluate", () => Promise.all([...this.workers].map(async (worker) => {
            const activation = worker
                .evaluate((id) => {
                const coverageGlobal = globalThis;
                coverageGlobal.__SUPERCOV_PHASE_ID__ = id;
                coverageGlobal.__SUPERCOV_ACTIVATE_PROBE_CONTEXT__?.(coverageGlobal.__SUPERCOV_MCDC_TEST_ID__ ?? "unscoped", id);
            }, phaseId)
                .then(() => this.unresponsiveWorkers.delete(worker))
                .catch(() => undefined);
            // Evaluations run in order, so one left queued still applies this
            // phase before any later one; it is only not waited for.
            if (this.unresponsiveWorkers.has(worker))
                return;
            if ((await bounded(activation, WORKER_ACTIVATION_WAIT_MS)) === WORKER_TIMED_OUT)
                this.unresponsiveWorkers.add(worker);
        })));
        await timed("activate.pageScript", () => Promise.all([...this.pages].map((page) => this.activatePage(page, phaseId))));
    }
    async updateContextHeaders(context, phaseId) {
        await context
            .setExtraHTTPHeaders({
            ...(this.contextConfiguredHeaders.get(context) ?? this.configuredHeaders),
            [COVERAGE_SCOPE_HEADER]: encodeCoverageScope(this.scope),
            ...(phaseId ? { [COVERAGE_PHASE_HEADER]: phaseId } : {}),
        })
            .catch(() => undefined);
    }
    async activatePage(page, phaseId) {
        const cdp = this.cdpSessions.get(page);
        if (!cdp)
            return;
        this.scriptUpdate = this.scriptUpdate.then(async () => {
            const previous = this.newDocumentScriptIds.get(page);
            if (previous) {
                await cdp.send("Page.removeScriptToEvaluateOnNewDocument", {
                    identifier: previous,
                }).catch(() => undefined);
            }
            const installed = (await cdp
                .send("Page.addScriptToEvaluateOnNewDocument", {
                source: `globalThis.__SUPERCOV_PHASE_ID__=${JSON.stringify(phaseId)};globalThis.__SUPERCOV_ACTIVATE_PROBE_CONTEXT__?.(globalThis.__SUPERCOV_MCDC_TEST_ID__??"unscoped",${JSON.stringify(phaseId)});`,
                runImmediately: true,
            })
                .catch(() => undefined));
            if (installed?.identifier)
                this.newDocumentScriptIds.set(page, installed.identifier);
        });
        await this.scriptUpdate.catch(() => undefined);
    }
}
let activeController;
let bridgedAssertionDepth = 0;
const controllers = new Map();
// Browsers and contexts the process created without any fixture the collector
// wraps. Test harnesses routinely launch their own browser in a worker-scoped
// fixture (`chromium.launchPersistentContext` for a shared profile,
// `chromium.launch`/`connect` plus `browser.newContext()` per test) and
// override `page` on top; those objects never pass through the `browser`/`page`
// fixtures, and imports made from inside node_modules are never redirected to
// this shim, so wrapping exports would not see them either. Every page they
// opened ran unmeasured. The Playwright classes are patched below so such
// launches are recorded here, and each test's controller adopts what is live.
const trackedBrowsers = new Set();
const trackedContexts = new Set();
// Creation-time headers for contexts launched through patched Playwright
// methods. Capturing an explicit empty object matters: it proves replacing
// the headers later is safe, unlike a context discovered only by enumeration.
const trackedContextConfiguredHeaders = new WeakMap();
const patchedPrototypes = new WeakSet();
function trackBrowser(browser) {
    if (!browser || typeof browser !== "object" || trackedBrowsers.has(browser))
        return;
    trackedBrowsers.add(browser);
    browser.once?.("disconnected", () => trackedBrowsers.delete(browser));
    patchBrowserPrototype(browser);
}
function trackContext(context, configuredHeaders) {
    if (!context || typeof context !== "object")
        return;
    if (configuredHeaders !== undefined)
        trackedContextConfiguredHeaders.set(context, configuredHeaders);
    if (trackedContexts.has(context))
        return;
    trackedContexts.add(context);
    context.once?.("close", () => trackedContexts.delete(context));
    patchContextPrototype(context);
}
function liveTrackedContexts() {
    const contexts = new Set(trackedContexts);
    for (const browser of trackedBrowsers) {
        try {
            for (const context of browser.contexts())
                contexts.add(context);
        }
        catch {
            // A browser that disconnected between the event and this sweep.
        }
    }
    return contexts;
}
/** The controller that registered `page`, whichever test it belongs to. */
function controllerOwning(page) {
    if (activeController?.pages.has(page))
        return activeController;
    for (const controller of controllers.values())
        if (controller.pages.has(page))
            return controller;
    return undefined;
}
function patchOnce(target, method, replace) {
    const prototype = target && Object.getPrototypeOf(target);
    if (!prototype || typeof prototype[method] !== "function")
        return;
    const marker = `__SUPERCOV_PATCHED_${method}__`;
    if (prototype[marker])
        return;
    Object.defineProperty(prototype, marker, { value: true });
    prototype[method] = replace(prototype[method]);
}
/** Record every context a directly launched or connected browser creates. */
function patchBrowserPrototype(browser) {
    const prototype = Object.getPrototypeOf(browser);
    if (!prototype || patchedPrototypes.has(prototype))
        return;
    patchedPrototypes.add(prototype);
    patchOnce(browser, "newContext", (original) => async function (...args) {
        const context = await original.apply(this, args);
        const configuredHeaders = args[0]?.extraHTTPHeaders ?? {};
        trackContext(context, configuredHeaders);
        const controller = activeController;
        if (controller && !controller.contexts.has(context))
            await controller.registerContext(context, configuredHeaders).catch(() => undefined);
        return context;
    });
}
/**
 * Read a page's evidence before the suite closes it. A `page` fixture defined
 * downstream of this shim tears down before the collector's own fixture, and
 * a customer context opened mid-test is usually closed in a `finally`; either
 * way the page is gone by the time the test's snapshots are collected.
 */
function patchContextPrototype(context) {
    patchOnce(context, "close", (original) => async function (...args) {
        for (const page of this.pages()) {
            await controllerOwning(page)?.snapshotBeforeClose(page).catch(() => undefined);
        }
        return original.apply(this, args);
    });
    for (const page of context.pages())
        patchPagePrototype(page);
    context.on?.("page", patchPagePrototype);
}
function patchPagePrototype(page) {
    patchOnce(page, "close", (original) => async function (...args) {
        await controllerOwning(this)?.snapshotBeforeClose(this).catch(() => undefined);
        return original.apply(this, args);
    });
}
/**
 * Patch the browser types' launch and connect paths on their shared prototype
 * so every browser or context the process creates is tracked, whichever module
 * path imported them. When a test is running its controller registers the new
 * object at once; otherwise the next controller adopts it.
 */
function installBrowserLaunchTracking() {
    const browserType = standardPlaywright.chromium ?? standardPlaywright.firefox ?? standardPlaywright.webkit;
    if (!browserType)
        return;
    for (const method of ["launch", "connect", "connectOverCDP"]) {
        patchOnce(browserType, method, (original) => async function (...args) {
            const browser = await original.apply(this, args);
            trackBrowser(browser);
            return browser;
        });
    }
    patchOnce(browserType, "launchPersistentContext", (original) => async function (...args) {
        const context = await original.apply(this, args);
        const configuredHeaders = args[1]?.extraHTTPHeaders ?? {};
        trackContext(context, configuredHeaders);
        const controller = activeController;
        if (controller)
            await controller.registerContext(context, configuredHeaders).catch(() => undefined);
        return context;
    });
}
installBrowserLaunchTracking();
const directRuntime = () => globalThis.__SUPERCOV_DIRECT_RUNTIME__ ?? coverageRuntime;
globalThis.__SUPERCOV_ASSERTION_PHASE_BRIDGE__ = (operation, source, callback) => {
    const controller = activeController;
    const runtime = directRuntime();
    if (!controller || !runtime)
        return { handled: false };
    const phase = controller.beginAssertion(operation, source);
    bridgedAssertionDepth += 1;
    try {
        const value = runtime.withCoverageCarrier({ version: 1, scope: controller.scope, phaseId: phase.id }, callback);
        bridgedAssertionDepth -= 1;
        if (value &&
            typeof value.then === "function")
            return {
                handled: true,
                value: Promise.resolve(value).then((resolved) => {
                    controller.finish(phase);
                    return resolved;
                }, (error) => {
                    controller.finish(phase, error);
                    throw error;
                }),
            };
        controller.finish(phase);
        return { handled: true, value };
    }
    catch (error) {
        bridgedAssertionDepth -= 1;
        controller.finish(phase, error);
        throw error;
    }
};
// The same bridge for an assertion that runs in place: the runtime enters the
// carrier and calls release when the call returns, finish when it settles.
globalThis.__SUPERCOV_ASSERTION_PHASE_OPENER__ = (operation, source) => {
    const controller = activeController;
    if (!controller || !directRuntime())
        return undefined;
    const phase = controller.beginAssertion(operation, source);
    bridgedAssertionDepth += 1;
    let held = true;
    const release = () => {
        if (held) {
            held = false;
            bridgedAssertionDepth -= 1;
        }
    };
    return {
        carrier: { version: 1, scope: controller.scope, phaseId: phase.id },
        release,
        finish: (error) => {
            release();
            controller.finish(phase, error);
        },
    };
};
function activeCoverageHeaders() {
    const controller = activeController;
    if (!controller)
        return undefined;
    const phaseId = controller.requestPhaseId();
    return {
        [COVERAGE_SCOPE_HEADER]: encodeCoverageScope(controller.scope),
        ...(phaseId ? { [COVERAGE_PHASE_HEADER]: phaseId } : {}),
    };
}
function mergeRequestHeaders(existing, coverage) {
    if (existing instanceof Headers) {
        return { ...Object.fromEntries(existing.entries()), ...coverage };
    }
    if (Array.isArray(existing)) {
        const normalized = {};
        for (let index = 0; index + 1 < existing.length; index += 2) {
            normalized[String(existing[index])] = existing[index + 1];
        }
        return { ...normalized, ...coverage };
    }
    return {
        ...(existing && typeof existing === "object" ? existing : {}),
        ...coverage,
    };
}
function scopedNodeRequestArguments(args) {
    const coverage = activeCoverageHeaders();
    if (!coverage || args.length === 0)
        return args;
    const scoped = [...args];
    const first = scoped[0];
    const startsWithUrl = typeof first === "string" || first instanceof URL;
    const candidate = startsWithUrl ? scoped[1] : first;
    const hasOptions = candidate !== null &&
        typeof candidate === "object" &&
        !(candidate instanceof URL);
    if (hasOptions) {
        const index = startsWithUrl ? 1 : 0;
        const options = candidate;
        scoped[index] = {
            ...options,
            headers: mergeRequestHeaders(options.headers, coverage),
        };
    }
    else if (startsWithUrl) {
        scoped.splice(1, 0, { headers: coverage });
    }
    return scoped;
}
function installNodeRequestScopePropagation() {
    const originalHttpRequest = http.request;
    const originalHttpGet = http.get;
    const originalHttpsRequest = https.request;
    const originalHttpsGet = https.get;
    http.request = ((...args) => Reflect.apply(originalHttpRequest, http, scopedNodeRequestArguments(args)));
    http.get = ((...args) => Reflect.apply(originalHttpGet, http, scopedNodeRequestArguments(args)));
    https.request = ((...args) => Reflect.apply(originalHttpsRequest, https, scopedNodeRequestArguments(args)));
    https.get = ((...args) => Reflect.apply(originalHttpsGet, https, scopedNodeRequestArguments(args)));
    // Existing ESM named imports such as `import { request } from "node:http"`
    // must observe the patched CommonJS-compatible builtin exports too.
    syncBuiltinESMExports();
    if (typeof globalThis.fetch === "function") {
        const originalFetch = globalThis.fetch.bind(globalThis);
        globalThis.fetch = ((input, init) => {
            const coverage = activeCoverageHeaders();
            if (!coverage)
                return originalFetch(input, init);
            const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
            for (const [name, value] of Object.entries(coverage))
                headers.set(name, value);
            return originalFetch(input, { ...init, headers });
        });
    }
}
installNodeRequestScopePropagation();
function scopedChildOptions(args, optionIndex) {
    const controller = activeController;
    if (!controller)
        return args;
    const scoped = [...args];
    const existing = scoped[optionIndex] && typeof scoped[optionIndex] === "object"
        ? scoped[optionIndex]
        : {};
    const options = {
        ...existing,
        // An env the caller passed is the child's whole environment; only
        // Supercov's own variables join it. Without one, it inherits ours.
        env: {
            ...(existing.env ?? process.env),
            SUPERCOV_RUN_ID: controller.scope.runId,
            [COVERAGE_CARRIER_ENV]: encodeCoverageCarrier({
                version: 1,
                scope: controller.scope,
                ...(controller.requestPhaseId()
                    ? { phaseId: controller.requestPhaseId() }
                    : {}),
            }),
        },
    };
    if (typeof scoped[optionIndex] === "function")
        scoped.splice(optionIndex, 0, options);
    else
        scoped[optionIndex] = options;
    return scoped;
}
// spawn, fork and execFile take (file, args?, options?, callback?): options
// follow an argument list, or an explicit null or undefined in its place.
function childOptionIndex(method, args) {
    if (method === "spawn" ||
        method === "spawnSync" ||
        method === "fork" ||
        method === "execFile" ||
        method === "execFileSync")
        return Array.isArray(args[1]) || (args[1] == null && args.length > 2) ? 2 : 1;
    return 1;
}
// util.promisify(exec) and util.promisify(execFile) resolve { stdout, stderr }
// through a function Node keeps on the original, and that function calls the
// original. A wrapper carries its own, which calls the wrapper, or a promisified
// call resolves the bare stdout string and skips the wrapper.
const promisifyCustom = Symbol.for("nodejs.util.promisify.custom");
function keepPromisifiedShape(original, wrapper) {
    if (typeof original[promisifyCustom] !== "function")
        return wrapper;
    Object.defineProperty(wrapper, promisifyCustom, {
        configurable: true,
        value: (...args) => {
            let settle;
            let reject;
            const promise = new Promise((ok, fail) => {
                settle = ok;
                reject = fail;
            });
            promise.child = wrapper(...args, (error, stdout, stderr) => {
                if (error !== null) {
                    error.stdout = stdout;
                    error.stderr = stderr;
                    reject(error);
                }
                else
                    settle({ stdout, stderr });
            });
            return promise;
        },
    });
    return wrapper;
}
function installChildProcessScopePropagation() {
    for (const method of [
        "exec",
        "execFile",
        "execFileSync",
        "execSync",
        "fork",
        "spawn",
        "spawnSync",
    ]) {
        const original = childProcess[method];
        childProcess[method] = keepPromisifiedShape(original, function (...args) {
            return Reflect.apply(original, childProcess, scopedChildOptions(args, childOptionIndex(method, args)));
        });
    }
    syncBuiltinESMExports();
}
installChildProcessScopePropagation();
function wrapMatchers(matchers, path = "expect") {
    return new Proxy(matchers, {
        get(target, property) {
            // Matcher objects and built-ins can expose getters whose internal slots
            // require the original receiver (for example RegExp.prototype.dotAll).
            // Passing this proxy as the receiver changes observable behaviour.
            const value = Reflect.get(target, property, target);
            const name = String(property);
            if (value &&
                typeof value === "object" &&
                (name === "not" || name === "resolves" || name === "rejects"))
                return wrapMatchers(value, `${path}.${name}`);
            if (typeof value !== "function")
                return value;
            return (...args) => {
                const controller = activeController;
                const phase = bridgedAssertionDepth === 0
                    ? controller?.beginAssertion(`${path}.${name}`)
                    : undefined;
                try {
                    const result = Reflect.apply(value, target, args);
                    if (result instanceof Promise) {
                        return result.then((resolved) => {
                            if (phase && controller)
                                controller.finish(phase);
                            return resolved;
                        }, (error) => {
                            if (phase && controller)
                                controller.finish(phase, error);
                            throw coverageRuntime.cleanInstrumentationStack(error);
                        });
                    }
                    if (phase && controller)
                        controller.finish(phase);
                    return result;
                }
                catch (error) {
                    if (phase && controller)
                        controller.finish(phase, error);
                    throw coverageRuntime.cleanInstrumentationStack(error);
                }
            };
        },
    });
}
function wrapExpectCallable(callable) {
    return new Proxy(callable, {
        apply(target, thisArg, argumentsList) {
            const result = Reflect.apply(target, thisArg, argumentsList);
            if (typeof result === "function")
                return wrapExpectCallable(result);
            if (result && typeof result === "object")
                return wrapMatchers(result);
            return result;
        },
        get(target, property, receiver) {
            const value = Reflect.get(target, property, receiver);
            if (typeof value !== "function")
                return value;
            return wrapExpectCallable(value.bind(target));
        },
    });
}
export const expect = wrapExpectCallable(baseExpect);
function currentRunId() {
    return (process.env["SUPERCOV_RUN_ID"] ??
        (GENERATED_RUN_ID.startsWith("__") ? "unscoped" : GENERATED_RUN_ID));
}
function executionScope(testInfo) {
    const runId = currentRunId();
    const workerId = `pid-${process.pid}-${processInstanceToken}-worker-${testInfo.workerIndex}`;
    const testKey = createHash("sha256")
        .update(testInfo.testId)
        .digest("hex")
        .slice(0, 24);
    const attemptId = createHash("sha256")
        .update(`${runId}\0${workerId}\0${testInfo.testId}\0${testInfo.retry}`)
        .digest("hex")
        .slice(0, 24);
    return {
        version: 1,
        runId,
        workerId,
        testId: testInfo.testId,
        testKey,
        retry: testInfo.retry,
        attemptId,
    };
}
function readServerRecords(scope) {
    try {
        return readFileSync(serverEvidencePath(scope), "utf8")
            .split("\n")
            .filter(Boolean)
            .flatMap((line) => {
            try {
                const record = JSON.parse(line);
                return record.scope?.attemptId === scope.attemptId ? [record] : [];
            }
            catch {
                // Ignore a final partial line if the server was writing during collection.
                return [];
            }
        });
    }
    catch {
        return [];
    }
}
function phaseSourceLine(source) {
    return source?.replace(/:\d+$/, "");
}
/**
 * Playwright's redirected `expect` is the preferred assertion boundary, but
 * its transform loader can bypass Node's resolve hook for project-owned
 * fixture modules. The ahead-of-run frontend therefore keeps a lexical
 * fallback. If both paths observe the same assertion, retain the richer
 * Playwright phase (including action causality) exactly once.
 */
function mergeCollectedPhases(controllerPhases, fallbackPhases) {
    const observed = new Map();
    for (const phase of controllerPhases) {
        if (phase.kind !== "assertion")
            continue;
        const key = `${phase.operation}\0${phaseSourceLine(phase.source) ?? ""}`;
        observed.set(key, (observed.get(key) ?? 0) + 1);
    }
    const remaining = fallbackPhases.filter((phase) => {
        if (phase.kind !== "assertion")
            return true;
        const key = `${phase.operation}\0${phaseSourceLine(phase.source) ?? ""}`;
        const count = observed.get(key) ?? 0;
        if (count === 0)
            return true;
        observed.set(key, count - 1);
        return false;
    });
    return [...controllerPhases, ...remaining];
}
const instrumentedFixtures = {
    page: async ({ page }, use, testInfo) => {
        const scope = executionScope(testInfo);
        const controller = controllers.get(scope.attemptId);
        if (!controller)
            throw new Error(`Supercov's automatic Playwright collector was not initialized for ${scope.attemptId}`);
        await controller.registerPage(page);
        try {
            await use(controller.wrap(page));
        }
        finally {
            // This fixture still owns a live page. The automatic test fixture tears
            // down after page dependencies and therefore cannot reliably evaluate
            // frames on every Playwright version.
            await controller.collectRuntimeSnapshots();
        }
    },
    browser: [
        async ({ browser }, use) => {
            await use(new Proxy(browser, {
                get(target, property, receiver) {
                    const controller = activeController;
                    return controller
                        ? Reflect.get(controller.wrap(target), property, receiver)
                        : Reflect.get(target, property, receiver);
                },
            }));
        },
        { scope: "worker" },
    ],
    request: async ({ request }, use) => {
        await use(new Proxy(request, {
            get(target, property, receiver) {
                const controller = activeController;
                return controller
                    ? Reflect.get(controller.wrap(target), property, receiver)
                    : Reflect.get(target, property, receiver);
            },
        }));
    },
    mcdcAutoCollect: [
        async ({}, use, testInfo) => {
            const scope = executionScope(testInfo);
            const configuredHeaders = Object.fromEntries(Object.entries(testInfo.project.use.extraHTTPHeaders ?? {}).map(([name, value]) => [name, String(value)]));
            const controller = new CoveragePhaseController(scope, configuredHeaders);
            controllers.set(scope.attemptId, controller);
            activeController = controller;
            directRuntime()?.activateCoverageScope(scope);
            await controller.adoptTrackedContexts().catch(() => undefined);
            const serverOutput = serverEvidencePath(scope);
            mkdirSync(serverEvidenceDirectory(scope), { recursive: true });
            rmSync(serverOutput, { force: true });
            try {
                await use();
            }
            finally {
                try {
                    const browser = await controller.collectRuntimeSnapshots();
                    const server = readServerRecords(scope);
                    // Emit an artifact even when this test touched no application source.
                    // A complete test-to-coverage matrix must also identify tests that are
                    // removable without changing coverage.
                    const testFile = relative(process.cwd(), testInfo.file)
                        .split(sep)
                        .join("/");
                    const payload = {
                        testId: testInfo.testId,
                        scope,
                        test: testInfo.titlePath.join(" > "),
                        testFile,
                        title: testInfo.title,
                        retry: testInfo.retry,
                        status: testInfo.status ?? "unknown",
                        expectedStatus: testInfo.expectedStatus,
                        provenance: inferTestProvenance({
                            runner: "playwright",
                            file: testFile,
                            project: testInfo.project.name,
                            explicitKind: process.env["SUPERCOV_TEST_KIND"],
                        }),
                        phases: mergeCollectedPhases(controller.phases, directRuntime()?.takeNodeAssertionPhases(scope) ?? []),
                        ...(controller.workerEvidenceMissing ? { attribution: "partial" } : {}),
                        browser,
                        server,
                    };
                    const serialized = `${JSON.stringify(payload)}\n`;
                    // Pool runners may cycle-restore a VM immediately after Playwright
                    // exits, which can discard or overwrite the normal artifact copy.
                    // Write one uniquely named, one-shot evidence file to the runner's
                    // shared directory as well. No test streams into this path.
                    const evidenceDirectory = process.env["SUPERCOV_EVIDENCE_DIR"] ??
                        (GENERATED_EVIDENCE_DIRECTORY.startsWith("__")
                            ? undefined
                            : GENERATED_EVIDENCE_DIRECTORY);
                    if (evidenceDirectory) {
                        const resolvedDirectory = resolve(process.cwd(), evidenceDirectory);
                        const append = process.env.SUPERCOV_DURABLE_EVIDENCE_EACH_TEST === "1"
                            ? appendJsonLineDurableSync
                            : appendJsonLineSync;
                        append(resolve(resolvedDirectory, `playwright-worker-${evidenceWriterIdentity()}-${process.pid}.mcdc.jsonl`), serialized);
                    }
                }
                finally {
                    await timed("controller.dispose", () => controller.dispose());
                    timingReport(testInfo.title);
                    directRuntime()?.activateCoverageScope();
                    if (activeController === controller)
                        activeController = undefined;
                    controllers.delete(scope.attemptId);
                }
            }
        },
        { auto: true },
    ],
};
const instrumentedTest = base.extend(instrumentedFixtures);
export const test = instrumentedTest;
/**
 * A Playwright `test` object: callable, and carrying the API a spec drives.
 * Facades export several -- one per fixture set -- and every one of them must
 * collect. Instrumenting only the discovered export left a real suite's
 * storefront fixture entirely unmeasured: its 20 tests ran with no controller,
 * so nothing they executed was ever read back.
 */
function isPlaywrightTest(value) {
    return typeof value === "function" &&
        typeof value.extend === "function" &&
        typeof value.describe === "function" &&
        typeof value.use === "function";
}
/**
 * Re-export one of the facade's values. A test object is extended with the
 * collector's fixtures; the overrides compose with the facade's own (`page`
 * receives the facade's page and wraps it), so a custom browser fixture keeps
 * working and is measured. Anything else passes through untouched.
 */
export function __supercovAdapterExport(value) {
    if (!isPlaywrightTest(value))
        return value;
    return value === base ? instrumentedTest : value.extend(instrumentedFixtures);
}
/*__SUPERCOV_ADAPTER_EXPORTS__*/
