"use strict";
// Supercov Jest adapter. Jest loads it through `setupFilesAfterEnv` of the
// configuration the preload substitutes (jest.config.mjs), so it runs inside
// every test file's environment with Jest's globals in scope. It assigns each
// test attempt its exact scope before the test runs and writes the attempt's
// coverage and assertion phases after it. Jest tells the environment nothing
// about an outcome, so the reporter (jestReporter.mjs) records that; the two
// records share a test id and the report joins them. It computes no coverage.
//
// CommonJS on purpose: Jest's module system loads setup files without the
// ESM flag, and the runtime it needs is already on the sandbox global.
const { createHash, randomUUID } = require("node:crypto");
const { appendFileSync, closeSync, fsyncSync, mkdirSync, openSync, statSync, writeFileSync } = require("node:fs");
const { relative, resolve, sep } = require("node:path");
const { Buffer } = require("node:buffer");

// jest-environment-node exposes the outer process's own globals to the sandbox
// through getters, so this is the same runtime instance the instrumented
// sources under test call into.
const runtime =
    globalThis.__SUPERCOV_DIRECT_RUNTIME__ ??
    (typeof process !== "undefined" ? process.__SUPERCOV_DIRECT_RUNTIME__ : undefined);
const evidenceDirectory = process.env.SUPERCOV_EVIDENCE_DIR;

function digest(value) {
    return createHash("sha256").update(value).digest("hex").slice(0, 24);
}
function localFile(path) {
    return relative(process.cwd(), path).split(sep).join("/");
}
// Must match jestReporter.mjs: the reporter has the same file and full name.
function testIdentity(testFile, fullName, occurrence = 0) {
    return `jest:${digest(`${testFile}\0${fullName}${occurrence ? `\0${occurrence}` : ""}`)}`;
}
// Circus keeps its declaration tree on the environment global. It distinguishes
// identical titles and survives retries; expect.currentTestName alone cannot.
function currentDeclaration() {
    const symbol = Object.getOwnPropertySymbols(globalThis)
        .find(key => key.description === "JEST_STATE_SYMBOL");
    const state = symbol && globalThis[symbol];
    if (!state?.currentlyRunningTest || !state.rootDescribeBlock) return undefined;
    const names = new Map();
    let found;
    function visit(block, parents) {
        for (const child of block.children ?? []) {
            if (child.type === "describeBlock") visit(child, [...parents, child.name]);
            else if (child.type === "test") {
                const name = [...parents, child.name].join(" ");
                const occurrence = names.get(name) ?? 0;
                names.set(name, occurrence + 1);
                if (child === state.currentlyRunningTest)
                    found = {occurrence, retry: Math.max((child.invocations ?? 1) - 1, 0)};
            }
        }
    }
    visit(state.rootDescribeBlock, []);
    return found;
}
// Mirrors provenance.mjs, which is ESM and out of reach here.
const KINDS = [
    ["unit", /(^|[/_.-])unit([/_.-]|$)/i],
    ["component", /(^|[/_.-])(component|components|ct)([/_.-]|$)/i],
    ["integration", /(^|[/_.-])(integration|int)([/_.-]|$)/i],
    ["e2e", /(^|[/_.-])(e2e|end-to-end|offline|online)([/_.-]|$)/i],
];
function provenance(testFile) {
    const explicit = process.env.SUPERCOV_TEST_KIND?.trim();
    if (explicit)
        return { runner: "jest", kind: explicit.toLowerCase(), source: "explicit" };
    const kind = KINDS.find(([, pattern]) => pattern.test(testFile))?.[0];
    return kind
        ? { runner: "jest", kind, source: "path" }
        : { runner: "jest", kind: "unit", source: "runner-default" };
}
// One journal per writer, as atomic.mjs's appendEvidenceRecord keeps it: a
// file per test cost a directory, a file and a rename each. Jest gives every
// test file a fresh module registry, so a worker starts one journal per file.
let journal;
function writeEvidence(payload) {
    const line = `${JSON.stringify(payload)}\n`;
    if (journal) {
        let size = -1;
        try {
            size = statSync(journal.path).size;
        }
        catch {
            // A missing journal is started again below.
        }
        if (size !== journal.size)
            journal = undefined;
    }
    if (!journal) {
        const directory = resolve(process.cwd(), evidenceDirectory);
        mkdirSync(directory, { recursive: true });
        const writer = (process.env.SUPERCOV_EXECUTION_LOG_SHARD ?? `pid-${process.pid}`).replace(/[^A-Za-z0-9_-]/g, "_");
        journal = { path: resolve(directory, `jest-worker-${writer}-${randomUUID()}.mcdc.jsonl`), size: 0 };
    }
    if (process.env.SUPERCOV_DURABLE_EVIDENCE_EACH_TEST === "1") {
        const descriptor = openSync(journal.path, "a", 0o600);
        try {
            writeFileSync(descriptor, line);
            fsyncSync(descriptor);
        }
        finally {
            closeSync(descriptor);
        }
    }
    else {
        appendFileSync(journal.path, line, { mode: 0o600 });
    }
    journal.size += Buffer.byteLength(line);
}

if (runtime && evidenceDirectory && typeof beforeEach === "function" && typeof afterAll === "function") {
    // One in-memory snapshot per test; the server JSONL transport would be
    // redundant and unattributed, as under Vitest.
    runtime.enableRuntimeSnapshotEvidence();
    const attempts = new Map();
    const emittedSetupFiles = new Set();
    let active;
    beforeEach(() => {
        flushActive();
        const state = expect.getState();
        const testFile = localFile(state.testPath ?? "unknown");
        if (!emittedSetupFiles.has(testFile)) {
            // Code the test file ran while loading, before its first test.
            emittedSetupFiles.add(testFile);
            const setupSnapshot = runtime.coverageSnapshot();
            if (setupSnapshot.hits.length || setupSnapshot.decisions.length) {
                writeEvidence({
                    testId: `jest:${digest(testFile)}:setup`,
                    test: `${testFile} > module setup`,
                    testFile,
                    title: "module setup",
                    retry: 0,
                    status: "passed",
                    provenance: provenance(testFile),
                    role: "setup",
                    runtime: [setupSnapshot],
                    browser: [],
                    server: [],
                });
            }
        }
        const fullName = state.currentTestName ?? "test";
        const declaration = currentDeclaration();
        const testId = testIdentity(testFile, fullName, declaration?.occurrence);
        const retry = declaration?.retry ?? attempts.get(testId) ?? 0;
        attempts.set(testId, retry + 1);
        const testKey = digest(testId);
        const scope = {
            version: 1,
            runId: process.env.SUPERCOV_RUN_ID ?? "unscoped",
            workerId: `jest-${process.env.JEST_WORKER_ID ?? process.pid}`,
            testId,
            testKey,
            retry,
            attemptId: `${testKey}-${retry}`,
        };
        active = { scope, testFile, fullName, retry };
        runtime.activateCoverageScope(scope);
        runtime.resetCoverage(testId);
    });
    // Flush after all user afterEach hooks (including Testing Library cleanup).
    // Our setup registers first, so an afterEach snapshot would run too early.
    // The next beforeEach or this file's afterAll runs after test teardown.
    function flushActive() {
        const current = active;
        active = undefined;
        if (!current)
            return;
        const { scope } = current;
        writeEvidence({
            testId: scope.testId,
            scope,
            test: current.fullName,
            testFile: current.testFile,
            title: current.fullName,
            retry: current.retry,
            // The reporter's record carries the outcome.
            status: "unknown",
            provenance: provenance(current.testFile),
            phases: runtime.takeNodeAssertionPhases(scope),
            runtime: [runtime.coverageSnapshot()],
            browser: [],
            server: [],
        });
        // One runtime state serves every test file a worker runs, so what this
        // test recorded must not leak into the next file's module-setup
        // snapshot (Vitest isolates files; Jest does not).
        runtime.resetCoverage();
        runtime.activateCoverageScope();
    }
    afterAll(flushActive);
}
