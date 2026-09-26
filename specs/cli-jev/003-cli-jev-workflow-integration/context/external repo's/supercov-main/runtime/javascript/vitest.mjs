import { createHash } from "node:crypto";
import { relative, resolve, sep } from "node:path";
import { afterEach, beforeEach } from "vitest";
import { coverageSnapshot as localCoverageSnapshot, activateCoverageScope as localActivateCoverageScope, enableRuntimeSnapshotEvidence as localEnableRuntimeSnapshotEvidence, resetCoverage as localResetCoverage, takeNodeAssertionPhases as localTakeNodeAssertionPhases, } from "./runtime.mjs";
import { inferTestProvenance } from "./provenance.mjs";
import { appendEvidenceRecord } from "./atomic.mjs";
const evidenceDirectory = process.env["SUPERCOV_EVIDENCE_DIR"];
const emittedSetupFiles = new Set();
const attempts = new Map();
const activeScopes = new Map();
const runtimeGlobal = globalThis;
const runtime = runtimeGlobal.__SUPERCOV_DIRECT_RUNTIME__ ?? {
    activateCoverageScope: localActivateCoverageScope,
    coverageSnapshot: localCoverageSnapshot,
    enableRuntimeSnapshotEvidence: localEnableRuntimeSnapshotEvidence,
    resetCoverage: localResetCoverage,
    takeNodeAssertionPhases: localTakeNodeAssertionPhases,
};
// Vitest persists one in-memory runtime snapshot per test. Writing the same
// events through the server JSONL transport would be both redundant and
// unattributed, and turns hot unit-test loops into synchronous filesystem IO.
runtime.enableRuntimeSnapshotEvidence();
function attemptStatus(state) {
    if (state === "pass")
        return "passed";
    if (state === "fail")
        return "failed";
    if (state === "skip" || state === "todo")
        return "skipped";
    return "unknown";
}
function titlePath(task) {
    const names = [task.name];
    let suite = task.suite;
    while (suite?.name) {
        names.unshift(suite.name);
        suite = suite.suite;
    }
    return names;
}
function writeEvidence(payload) {
    if (!evidenceDirectory)
        return;
    appendEvidenceRecord(resolve(process.cwd(), evidenceDirectory), "vitest-worker", payload);
}
beforeEach((context) => {
    const task = context.task;
    const testFile = relative(process.cwd(), task.file.filepath)
        .split(sep)
        .join("/");
    if (!emittedSetupFiles.has(testFile)) {
        emittedSetupFiles.add(testFile);
        const setupSnapshot = runtime.coverageSnapshot();
        if (setupSnapshot.hits.length || setupSnapshot.decisions.length) {
            writeEvidence({
                testId: `vitest:${task.file.id}:setup`,
                test: `${testFile} > module setup`,
                testFile,
                title: "module setup",
                retry: 0,
                status: "passed",
                provenance: inferTestProvenance({
                    runner: "vitest",
                    file: testFile,
                    project: task.file.projectName,
                    explicitKind: process.env["SUPERCOV_TEST_KIND"],
                }),
                role: "setup",
                runtime: [setupSnapshot],
                browser: [],
                server: [],
            });
        }
    }
    const testId = `vitest:${task.id}`;
    const retry = attempts.get(testId) ?? 0;
    attempts.set(testId, retry + 1);
    const testKey = createHash("sha256").update(testId).digest("hex").slice(0, 24);
    const scope = {
        version: 1,
        runId: process.env["SUPERCOV_RUN_ID"] ?? "unscoped",
        workerId: `vitest-${process.env["VITEST_POOL_ID"] ?? process.pid}`,
        testId,
        testKey,
        retry,
        attemptId: `${testKey}-${retry}`,
    };
    activeScopes.set(task.id, scope);
    runtime.activateCoverageScope(scope);
    runtime.resetCoverage(testId);
});
afterEach((context) => {
    const task = context.task;
    const testFile = relative(process.cwd(), task.file.filepath)
        .split(sep)
        .join("/");
    const scope = activeScopes.get(task.id);
    const retry = scope?.retry ?? task.result?.retryCount ?? 0;
    const payload = {
        testId: scope?.testId ?? `vitest:${task.id}`,
        ...(scope ? { scope } : {}),
        test: [...titlePath(task)].join(" > "),
        testFile,
        title: task.name,
        retry,
        status: attemptStatus(task.result?.state),
        provenance: inferTestProvenance({
            runner: "vitest",
            file: testFile,
            project: task.file.projectName,
            explicitKind: process.env["SUPERCOV_TEST_KIND"],
        }),
        ...(scope ? { phases: runtime.takeNodeAssertionPhases(scope) } : {}),
        runtime: [runtime.coverageSnapshot()],
        browser: [],
        server: [],
    };
    writeEvidence(payload);
    activeScopes.delete(task.id);
    runtime.activateCoverageScope();
});
