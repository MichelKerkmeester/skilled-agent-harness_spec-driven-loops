import * as native from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { beginBufferedServerEvidence, flushBufferedServerEvidence, takeNodeAssertionPhases, withCoverageCarrier, } from "./runtime.mjs";
import { callerLocation, runnerExecutionScope, runnerTestId, writeRunnerEvidence, } from "./runnerEvidence.mjs";
function callbackIndex(args) {
    for (let index = args.length - 1; index >= 0; index -= 1)
        if (typeof args[index] === "function")
            return index;
    return -1;
}
function testName(args, callback) {
    return typeof args[0] === "string" ? args[0] : callback.name || "anonymous test";
}
function testOptions(args, index) {
    const candidate = args.slice(0, index).find((value) => value && typeof value === "object" && !Array.isArray(value));
    return candidate;
}
// node:test derives a test's reported location from the direct caller of the
// registration call, and the adapter is that caller: every failing test
// reported "test at .../nodeTest.mjs". A compiled trampoline carrying the
// user's call site as its script origin registers the test instead, so the
// runner sees the location a direct call would have produced. The padded
// second line puts the call expression at the user's exact line and column.
const registrationSites = new Map();
function registrationAt(location) {
    if (!location.file ||
        location.line === undefined ||
        location.column === undefined ||
        location.line < 2)
        return undefined;
    const key = `${location.file}:${location.line}:${location.column}`;
    let site = registrationSites.get(key);
    if (site === undefined) {
        try {
            const filename = location.file.startsWith("file://")
                ? fileURLToPath(location.file)
                : location.file;
            site = vm.compileFunction(`return (\n${" ".repeat(Math.max(0, location.column - 1))}original(...args));`, ["original", "args"], { filename, lineOffset: location.line - 2 });
        }
        catch {
            site = null;
        }
        registrationSites.set(key, site);
    }
    return site ?? undefined;
}
// A failing test's stack was captured while Supercov's wrappers were on the
// call path and while the code ran inside the mirrored workspace. Neither is
// part of the user's program: drop adapter frames and map workspace paths
// back to the source project so the report matches an uninstrumented run.
const restoredErrors = new WeakSet();
function restoreUserError(error, depth = 0) {
    if (depth > 4 ||
        !error ||
        typeof error !== "object" ||
        restoredErrors.has(error))
        return error;
    restoredErrors.add(error);
    const workspaceRoot = process.env["SUPERCOV_PROJECT_ROOT"];
    const sourceRoot = process.env["SUPERCOV_SOURCE_PROJECT_ROOT"];
    const remap = (text) => workspaceRoot && sourceRoot && workspaceRoot !== sourceRoot
        ? text.split(workspaceRoot).join(sourceRoot)
        : text;
    try {
        if (typeof error.stack === "string")
            error.stack = remap(error.stack
                .split("\n")
                .filter((line) => !(line.trimStart().startsWith("at ") &&
                line.includes("/.supercov/")))
                .join("\n"));
        if (typeof error.message === "string")
            error.message = remap(error.message);
    }
    catch {
        // Frozen or accessor-backed errors keep their original form.
    }
    try {
        restoreUserError(error.cause, depth + 1);
        if (Array.isArray(error.errors))
            for (const aggregated of error.errors)
                restoreUserError(aggregated, depth + 1);
    }
    catch {
        // A throwing accessor never replaces the user's error.
    }
    return error;
}
const registrationCounts = new Map();
function wrappedRegistration(original, parentTestId, forcedStatus) {
    const wrapped = function supercovNodeTest(...args) {
        const index = callbackIndex(args);
        if (index < 0)
            return Reflect.apply(original, this, args);
        const callback = args[index];
        const location = callerLocation(supercovNodeTest);
        const identity = {
            runner: "node:test",
            name: testName(args, callback),
            ...(parentTestId ? { parentTestId } : {}),
            ...location,
            // Source-map producers disagree about whether a call expression maps to
            // its first token or the first token on its source line. The line and
            // dynamic test name are stable across ahead-of-run and build-tool
            // transforms; the mapped column is not. Canonicalize it so the same test
            // keeps one identity when esbuild, Babel, SWC, or TypeScript rewrites it.
            ...(location.line === undefined ? {} : { column: 1 }),
        };
        // Allocate at registration, never callback completion: concurrent tests
        // can finish in any order. Count each source/name within its parent.
        const registrationKey = runnerTestId(identity);
        const registrationOrdinal = registrationCounts.get(registrationKey) ?? 0;
        registrationCounts.set(registrationKey, registrationOrdinal + 1);
        identity.registrationOrdinal = registrationOrdinal;
        const scope = runnerExecutionScope(identity);
        const options = testOptions(args, index);
        const evidenceDirectory = process.env["SUPERCOV_EVIDENCE_DIR"];
        if (options?.skip || options?.todo || forcedStatus)
            writeRunnerEvidence(identity, "skipped", scope, evidenceDirectory);
        const next = [...args];
        const execute = (callbackThis, context, done) => {
            // A test or its hooks may intentionally modify Supercov's public
            // environment while testing integrations. Keep this attempt's transport
            // destination fixed to the value present when the test was registered.
            beginBufferedServerEvidence(scope);
            let status = options?.skip || options?.todo || forcedStatus
                ? "skipped"
                : "passed";
            const contextProxy = new Proxy(context, {
                get(target, property) {
                    // Read with the real context as receiver: TestContext accessors
                    // (t.assert, t.mock, ...) touch private fields that only exist on
                    // the target, never on the proxy.
                    const value = Reflect.get(target, property, target);
                    if ((property === "skip" || property === "todo") && typeof value === "function") {
                        return (...callArgs) => {
                            status = "skipped";
                            return Reflect.apply(value, target, callArgs);
                        };
                    }
                    if (property === "test" && typeof value === "function")
                        return wrappedRegistration(value.bind(target), scope.testId);
                    if (["after", "before", "afterEach", "beforeEach"].includes(property) && typeof value === "function")
                        return restoringHook(value.bind(target), scope);
                    return typeof value === "function" ? value.bind(target) : value;
                },
            });
            let emitted = false;
            const emit = (nextStatus = status) => {
                if (emitted)
                    return;
                emitted = true;
                const flushedServerEvidence = flushBufferedServerEvidence(scope);
                writeRunnerEvidence(identity, nextStatus, scope, evidenceDirectory, takeNodeAssertionPhases(scope), flushedServerEvidence);
            };
            const finishBody = () => {
                // User t.after callbacks run after the body. Register last so
                // their assertions and cleanup probes are part of this attempt.
                context.after(() => emit());
            };
            try {
                if (callback.length >= 2) {
                    const callbackDone = (error) => {
                        if (error) {
                            status = "failed";
                            restoreUserError(error);
                        }
                        finishBody();
                        done?.(error);
                    };
                    return withCoverageCarrier({ version: 1, scope }, () => Reflect.apply(callback, callbackThis, [contextProxy, callbackDone]));
                }
                const result = withCoverageCarrier({ version: 1, scope }, () => Reflect.apply(callback, callbackThis, [contextProxy]));
                if (result && typeof result.then === "function")
                    return Promise.resolve(result).then((value) => {
                        finishBody();
                        return value;
                    }, (error) => {
                        status = "failed";
                        finishBody();
                        throw restoreUserError(error);
                    });
                finishBody();
                return result;
            }
            catch (error) {
                status = "failed";
                finishBody();
                throw restoreUserError(error);
            }
        };
        // node:test uses callback arity to distinguish promise/synchronous tests
        // from the legacy done-callback form. Preserve it exactly.
        next[index] = callback.length >= 2
            ? function supercovNodeTestDoneCallback(context, done) {
                return execute(this, context, done);
            }
            : function supercovNodeTestCallback(context) {
                return execute(this, context);
            };
        const registration = registrationAt(location);
        if (registration)
            return registration(this === undefined ? original : original.bind(this), next);
        return Reflect.apply(original, this, next);
    };
    for (const property of ["skip", "todo", "only"]) {
        const member = original[property];
        if (typeof member === "function")
            Object.defineProperty(wrapped, property, {
                configurable: true,
                enumerable: true,
                value: wrappedRegistration(member, parentTestId, property === "only" ? undefined : "skipped"),
            });
    }
    return wrapped;
}
// Shared hooks get their own setup scope. Their execution is visible but is
// never silently copied into every test. t.after and other per-test hooks keep
// the exact owning attempt supplied by the TestContext proxy.
function restoringHook(original, scope, hookName = "hook") {
    return function supercovNodeTestHook(...args) {
        const index = callbackIndex(args);
        if (index < 0) return Reflect.apply(original, this, args);
        const callback = args[index];
        const location = callerLocation(supercovNodeTestHook);
        let invocation = 0;
        const execute = (receiver, context, done) => {
            const identity = { runner: "node:test", role: "setup", name: `[${hookName}] ${callback.name || "anonymous"}`,
                ...location, registrationOrdinal: invocation++ };
            const owner = scope ?? runnerExecutionScope(identity);
            const evidenceDirectory = process.env["SUPERCOV_EVIDENCE_DIR"];
            if (!scope) beginBufferedServerEvidence(owner);
            let emitted = false;
            const finish = error => {
                if (scope || emitted) return;
                emitted = true;
                writeRunnerEvidence(identity, error ? "failed" : "passed", owner, evidenceDirectory,
                    takeNodeAssertionPhases(owner), flushBufferedServerEvidence(owner));
            };
            try {
                const result = withCoverageCarrier({ version: 1, scope: owner }, () =>
                    callback.length >= 2 ? callback.call(receiver, context, error => {
                        finish(error);
                        done?.(error ? restoreUserError(error) : undefined);
                    }) : callback.call(receiver, context));
                if (callback.length >= 2) return result;
                if (result && typeof result.then === "function")
                    return Promise.resolve(result).then(value => { finish(); return value; },
                        error => { finish(error); throw restoreUserError(error); });
                finish();
                return result;
            } catch (error) { finish(error); throw restoreUserError(error); }
        };
        const next = [...args];
        next[index] = callback.length >= 2
            ? function supercovNodeTestHookDoneCallback(context, done) { return execute(this, context, done); }
            : function supercovNodeTestHookCallback(context) { return execute(this, context); };
        return Reflect.apply(original, this, next);
    };
}
export const test = wrappedRegistration(native.test);
export const it = wrappedRegistration(native.it);
export const suite = native.suite;
export const describe = native.describe;
export const before = restoringHook(native.before, undefined, "before");
export const after = restoringHook(native.after, undefined, "after");
export const beforeEach = restoringHook(native.beforeEach, undefined, "beforeEach");
export const afterEach = restoringHook(native.afterEach, undefined, "afterEach");
export const mock = native.mock;
export const snapshot = native.snapshot;
export const run = native.run;
export const assert = native.assert;
export default test;
