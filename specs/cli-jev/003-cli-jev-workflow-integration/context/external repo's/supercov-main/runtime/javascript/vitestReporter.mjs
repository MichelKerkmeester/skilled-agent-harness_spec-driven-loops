import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { inferTestProvenance } from "./provenance.mjs";
import { appendEvidenceRecord } from "./atomic.mjs";
function sourcePath(moduleId) {
    const absolute = moduleId.startsWith("file:")
        ? fileURLToPath(moduleId)
        : moduleId;
    return relative(process.cwd(), absolute).split(sep).join("/");
}
function rawAttemptStatus(state, expectedFailure) {
    if (!expectedFailure)
        return state;
    // Vitest reports an already-inverted final state for `it.fails`: pass
    // means the body failed as expected, while fail means it unexpectedly
    // passed. Supercov's cross-runner contract stores actual + expected, so
    // undo Vitest's inversion at the adapter boundary.
    if (state === "passed")
        return "failed";
    if (state === "failed")
        return "passed";
    return state;
}
/** Records final runner outcomes, including tests that never execute hooks. */
export default class SupercovVitestReporter {
    reportedAttempts = new Set();
    constructor(configureProjects) {
        this.configureProjects = configureProjects;
    }
    onInit(vitest) {
        this.configureProjects?.(vitest.projects);
    }
    onBrowserInit(project) {
        this.configureProjects?.([project]);
    }
    onTestCaseResult(testCase) {
        const evidenceDirectory = process.env["SUPERCOV_EVIDENCE_DIR"];
        if (!evidenceDirectory)
            return;
        const result = testCase.result();
        if (result.state === "pending")
            return;
        const diagnostic = testCase.diagnostic();
        const testFile = sourcePath(testCase.module.moduleId);
        const retry = diagnostic?.retryCount ?? 0;
        const payload = {
            testId: `vitest:${testCase.id}`,
            test: testCase.fullName,
            testFile,
            title: testCase.name,
            retry,
            status: rawAttemptStatus(result.state, testCase.options.fails),
            expectedStatus: testCase.options.fails ? "failed" : "passed",
            flaky: diagnostic?.flaky ?? false,
            provenance: inferTestProvenance({
                runner: "vitest",
                file: testFile,
                project: testCase.project.name,
                explicitKind: process.env["SUPERCOV_TEST_KIND"],
            }),
            runtime: [],
            browser: [],
            server: [],
        };
        this.reportedAttempts.add(`${testCase.id}:${retry}`);
        appendEvidenceRecord(resolve(process.cwd(), evidenceDirectory), "vitest-status", payload);
    }
    /** Vitest 2 compatibility; Vitest 3+ uses onTestCaseResult above. */
    onFinished(files = []) {
        const evidenceDirectory = process.env["SUPERCOV_EVIDENCE_DIR"];
        if (!evidenceDirectory)
            return;
        const visit = (task, inheritedFile) => {
            const file = task.file ?? inheritedFile ?? task;
            if (task.type === "test" && task.result?.state) {
                const testFile = sourcePath(file.filepath ?? task.filepath ?? "unknown");
                const retry = task.result.retryCount ?? 0;
                if (this.reportedAttempts.has(`${task.id}:${retry}`)) {
                    return;
                }
                const names = [task.name ?? task.id ?? "test"];
                let suite = task.suite;
                while (suite?.name) {
                    names.unshift(suite.name);
                    suite = suite.suite;
                }
                const expectedFailure = Boolean(task.fails ?? task.options?.fails);
                const payload = {
                    testId: `vitest:${task.id ?? names.join(" > ")}`,
                    test: names.join(" > "),
                    testFile,
                    title: task.name ?? names.at(-1) ?? "test",
                    retry,
                    status: rawAttemptStatus(task.result.state === "pass"
                        ? "passed"
                        : task.result.state === "fail"
                            ? "failed"
                            : "skipped", expectedFailure),
                    expectedStatus: expectedFailure ? "failed" : "passed",
                    provenance: inferTestProvenance({
                        runner: "vitest",
                        file: testFile,
                        project: file.projectName,
                        explicitKind: process.env["SUPERCOV_TEST_KIND"],
                    }),
                    runtime: [],
                    browser: [],
                    server: [],
                };
                appendEvidenceRecord(resolve(process.cwd(), evidenceDirectory), "vitest-status", payload);
            }
            for (const child of task.tasks ?? [])
                visit(child, file);
        };
        for (const file of files)
            visit(file, file);
    }
}
