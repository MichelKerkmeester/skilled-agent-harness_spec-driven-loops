export const COVERAGE_SCOPE_HEADER = "x-supercov-scope";
export const COVERAGE_PHASE_HEADER = "x-supercov-phase";
export const COVERAGE_SCOPE_COOKIE = "__supercov_scope";
export const COVERAGE_PHASE_COOKIE = "__supercov_phase";
export const COVERAGE_CARRIER_ENV = "SUPERCOV_CONTEXT";
export const DEFAULT_SERVER_EVIDENCE_ROOT = "/tmp/supercov-server-evidence";
// Buffer as it was when Supercov loaded. Tests replace globals -- axios's set
// `globalThis.Buffer = undefined` to check it copes -- and the runtime runs
// inside those tests; it must not fail where the application does not.
var capturedBuffer = typeof Buffer === "undefined" ? void 0 : Buffer;

function configuredServerEvidenceRoot() {
    return typeof process !== "undefined" &&
        process.env?.["SUPERCOV_SERVER_EVIDENCE_ROOT"]
        ? process.env["SUPERCOV_SERVER_EVIDENCE_ROOT"]
        : DEFAULT_SERVER_EVIDENCE_ROOT;
}
function nonEmpty(value) {
    return typeof value === "string" && value.length > 0;
}
function safeKey(value) {
    return /^[a-zA-Z0-9_-]+$/.test(value);
}
function pathComponent(value) {
    const safe = value.replace(/[^a-zA-Z0-9_-]/g, "_");
    return safe || "unscoped";
}
export function encodeCoverageScope(scope) {
    return new URLSearchParams({
        v: String(scope.version),
        r: scope.runId,
        w: scope.workerId,
        t: scope.testId,
        k: scope.testKey,
        a: String(scope.retry),
        i: scope.attemptId,
    }).toString();
}
export function decodeCoverageScope(encoded) {
    if (!encoded)
        return undefined;
    try {
        const values = new URLSearchParams(encoded);
        const runId = values.get("r");
        const workerId = values.get("w");
        const testId = values.get("t");
        const testKey = values.get("k");
        const attemptId = values.get("i");
        const retry = Number(values.get("a"));
        if (values.get("v") !== "1" ||
            !nonEmpty(runId) ||
            !nonEmpty(workerId) ||
            !nonEmpty(testId) ||
            !nonEmpty(testKey) ||
            !safeKey(testKey) ||
            !nonEmpty(attemptId) ||
            !safeKey(attemptId) ||
            !Number.isSafeInteger(retry) ||
            retry < 0)
            return undefined;
        return {
            version: 1,
            runId,
            workerId,
            testId,
            testKey,
            retry,
            attemptId,
        };
    }
    catch {
        return undefined;
    }
}
export function encodeCoverageCarrier(carrier) {
    return capturedBuffer.from(JSON.stringify(carrier), "utf8").toString("base64url");
}
export function decodeCoverageCarrier(encoded) {
    if (!encoded)
        return undefined;
    try {
        const value = JSON.parse(capturedBuffer.from(encoded, "base64url").toString("utf8"));
        if (value.version !== 1)
            return undefined;
        if (value.scope) {
            const roundTrip = decodeCoverageScope(encodeCoverageScope(value.scope));
            if (!roundTrip)
                return undefined;
        }
        if (value.phaseId !== undefined && value.phaseId.length === 0)
            return undefined;
        return value;
    }
    catch {
        return undefined;
    }
}
export function serverRunEvidenceDirectory(runId, root = configuredServerEvidenceRoot()) {
    return `${root.replace(/\/+$/, "")}/${pathComponent(runId)}`;
}
export function serverEvidenceDirectory(scope, root = configuredServerEvidenceRoot()) {
    return `${serverRunEvidenceDirectory(scope.runId, root)}/attempts`;
}
export function serverEvidencePath(scope, root = configuredServerEvidenceRoot()) {
    return `${serverEvidenceDirectory(scope, root)}/${pathComponent(scope.attemptId)}.jsonl`;
}
export function backgroundEvidenceDirectory(runId, root = configuredServerEvidenceRoot()) {
    return `${serverRunEvidenceDirectory(runId, root)}/background`;
}
export function backgroundEvidencePath(runId, processId = typeof process === "undefined" ? "unknown" : String(process.pid), root = configuredServerEvidenceRoot()) {
    return `${backgroundEvidenceDirectory(runId, root)}/${pathComponent(processId)}.jsonl`;
}
