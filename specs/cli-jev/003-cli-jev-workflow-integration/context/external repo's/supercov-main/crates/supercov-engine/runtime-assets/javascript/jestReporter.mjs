import { createHash } from "node:crypto";
import { relative, resolve, sep } from "node:path";
import { inferTestProvenance } from "./provenance.mjs";
import { appendEvidenceRecord } from "./atomic.mjs";
function digest(value) {
    return createHash("sha256").update(value).digest("hex").slice(0, 24);
}
function localFile(path) {
    return relative(process.cwd(), path).split(sep).join("/");
}
function attemptStatus(status) {
    switch (status) {
        case "passed":
        case "failed":
            return status;
        case "pending":
        case "skipped":
        case "todo":
        case "disabled":
            return "skipped";
        default:
            return "unknown";
    }
}
/**
 * Records each Jest attempt's outcome, which the test environment never
 * learns: a test that times out, one skipped before its hooks, one that
 * failed after its last hook. The test id formula must match jest.cjs, whose
 * record carries the attempt's coverage; the report joins the two.
 */
export default class SupercovJestReporter {
    onTestResult(test, fileResult) {
        // Jest's final array follows declaration order, including skipped cases.
        // Completion order does not: retries can finish after a namesake test.
        const occurrences = new Map();
        for (const result of fileResult.testResults ?? []) {
            const occurrence = occurrences.get(result.fullName) ?? 0;
            occurrences.set(result.fullName, occurrence + 1);
            this.recordResult(test, result, occurrence);
        }
    }
    recordResult(test, result, occurrence) {
        const evidenceDirectory = process.env["SUPERCOV_EVIDENCE_DIR"];
        if (!evidenceDirectory)
            return;
        const testFile = localFile(test.path);
        const identity = `${testFile}\0${result.fullName}${occurrence ? `\0${occurrence}` : ""}`;
        const testId = `jest:${digest(identity)}`;
        const retry = Math.max((result.invocations ?? 1) - 1, 0);
        const status = attemptStatus(result.status);
        const provenance = inferTestProvenance({
            runner: "jest",
            file: testFile,
            explicitKind: process.env["SUPERCOV_TEST_KIND"],
        });
        const record = (attempt, attemptStatus, flaky) => {
            const payload = {
                testId,
                test: result.fullName,
                testFile,
                title: result.title,
                retry: attempt,
                status: attemptStatus,
                expectedStatus: "passed",
                flaky,
                provenance,
                runtime: [],
                browser: [],
                server: [],
            };
            appendEvidenceRecord(resolve(process.cwd(), evidenceDirectory), "jest-status", payload);
        };
        // `jest.retryTimes` reports one result after the last attempt; every
        // attempt before it failed, or there would have been no retry. The
        // adapter wrote each attempt's coverage without an outcome.
        for (let attempt = 0; attempt < retry; attempt += 1)
            record(attempt, "failed", false);
        record(retry, status, retry > 0 && status === "passed");
    }
    // Jest calls these on every reporter.
    onRunComplete() { }
    getLastError() {
        return undefined;
    }
}
