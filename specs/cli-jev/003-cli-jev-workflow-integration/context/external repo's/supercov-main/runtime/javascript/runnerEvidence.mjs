import { createHash, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { appendEvidenceRecord } from "./atomic.mjs";
import { inferTestProvenance } from "./provenance.mjs";
import { serverEvidencePath } from "./transport.mjs";

let cachedProcessInstanceToken;
function processInstanceToken() {
    if (cachedProcessInstanceToken)
        return cachedProcessInstanceToken;
    let random = "";
    try {
        random = randomBytes(3).toString("hex");
    }
    catch {
        random = Math.floor(Math.random() * 16777215).toString(16);
    }
    cachedProcessInstanceToken = `${random}${process.hrtime.bigint().toString(36).slice(-5)}`;
    return cachedProcessInstanceToken;
}
function localFile(file) {
    if (!file)
        return undefined;
    const absolute = file.startsWith("file:") ? fileURLToPath(file) : file;
    return relative(process.cwd(), absolute).split(sep).join("/");
}
export function runnerTestId(identity) {
    const parts = [
        identity.runner,
        localFile(identity.file) ?? "unknown",
        identity.line ?? 0,
        identity.column ?? 0,
        identity.name,
    ];
    // Preserve existing top-level, uniquely registered test IDs. Nested tests
    // and repeated registrations need more than a shared source/name identity.
    if (identity.role === "setup")
        parts.push("role", "setup");
    if (identity.parentTestId)
        parts.push("parent", identity.parentTestId);
    if (identity.registrationOrdinal)
        parts.push("registration", identity.registrationOrdinal);
    // Titles can themselves contain separator text. Domain-separate and encode
    // the extended identity structurally so it cannot alias a literal title.
    const key = identity.role === "setup" || identity.parentTestId || identity.registrationOrdinal
        ? JSON.stringify(["registration-v2", ...parts])
        : parts.join("\0");
    return `${identity.runner}:${createHash("sha256").update(key).digest("hex").slice(0, 24)}`;
}
export function runnerExecutionScope(identity) {
    const testId = runnerTestId(identity);
    const retry = identity.retry ?? 0;
    // Same hazard as the Playwright shim: a pooled runner's fresh workers can
    // share a pid, so the worker identity carries a per-process token.
    const workerId = `${identity.runner}-${process.env["JEST_WORKER_ID"] ?? process.pid}-${processInstanceToken()}`;
    const testKey = createHash("sha256").update(testId).digest("hex").slice(0, 24);
    return {
        version: 1,
        runId: process.env["SUPERCOV_RUN_ID"] ?? "unscoped",
        workerId,
        testId,
        testKey,
        retry,
        // Different processes/worker threads can execute the same registration.
        // Their files must not collide even though the stable test ID is shared.
        attemptId: `${testKey}-${retry}-${processInstanceToken()}`,
    };
}
export function callerLocation(boundary = callerLocation) {
    // Omit the registration wrapper by identity. A user file may have the same
    // basename as a runtime adapter. Parse the location suffix, not individual
    // path segments: spaces, parentheses and Unicode are valid filenames.
    try {
        const error = {};
        Error.captureStackTrace(error, boundary);
        if (typeof error.stack !== "string")
            return {};
        const entry = error.stack.split("\n")[1]?.trim();
        const match = entry && /(?:^at (?:async )?| \()((?:file:\/\/|\/|[A-Za-z]:[\\/]|\\\\).*):(\d+):(\d+)\)?$/.exec(entry);
        if (!match)
            return {};
        return {
            file: match[1],
            line: Number(match[2]),
            column: Number(match[3]),
        };
    }
    catch {
        // Custom formatters must not prevent registration. Missing provenance
        // is explicit, never replaced with an unrelated deeper caller.
        return {};
    }
}
export function readScopedServerEvidence(scope, evidencePath = serverEvidencePath(scope)) {
    try {
        return readFileSync(evidencePath, "utf8")
            .split("\n")
            .filter(Boolean)
            .map((line) => JSON.parse(line))
            .filter((record) => record.scope?.attemptId === scope.attemptId);
    }
    catch {
        return [];
    }
}
export function writeRunnerEvidence(identity, status, scope, evidenceDirectoryOverride, phases = [], serverEvidenceSource) {
    const evidenceDirectory = evidenceDirectoryOverride ?? process.env["SUPERCOV_EVIDENCE_DIR"];
    if (!evidenceDirectory)
        return;
    const testFile = localFile(identity.file);
    const payload = {
        testId: scope.testId,
        scope,
        test: identity.name,
        ...(testFile ? { testFile } : {}),
        title: identity.name.split(" > ").at(-1) ?? identity.name,
        retry: identity.retry ?? 0,
        status,
        ...(identity.role ? { role: identity.role } : {}),
        provenance: inferTestProvenance({
            runner: identity.runner,
            file: testFile,
            explicitKind: process.env["SUPERCOV_TEST_KIND"],
        }),
        ...(phases.length > 0 ? { phases } : {}),
        runtime: [],
        browser: [],
        server: serverEvidenceSource
            ? readScopedServerEvidence(scope, serverEvidenceSource)
            : readScopedServerEvidence(scope),
    };
    appendEvidenceRecord(resolve(process.cwd(), evidenceDirectory), identity.runner.replace(/[^A-Za-z0-9_-]/g, "_"), payload);
}
