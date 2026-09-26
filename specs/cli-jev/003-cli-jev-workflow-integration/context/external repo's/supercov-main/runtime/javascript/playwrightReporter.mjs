import { relative, resolve, sep } from "node:path";
import { inferTestProvenance } from "./provenance.mjs";
import { appendJsonLineDurableSync, appendJsonLineSync } from "./atomic.mjs";
const GENERATED_EVIDENCE_DIRECTORY = "__SUPERCOV_EVIDENCE_DIRECTORY__";
const evidenceWriterIdentity = () => (process.env.SUPERCOV_EXECUTION_LOG_SHARD ?? `pid-${process.pid}`)
    .replace(/[^A-Za-z0-9_-]/g, "_");
/** Records outcomes even when browser or fixture startup fails before coverage. */
export default class SupercovPlaywrightReporter {
    records = [];
    onTestEnd(test, result) {
        const evidenceDirectory = process.env["SUPERCOV_EVIDENCE_DIR"] ??
            (GENERATED_EVIDENCE_DIRECTORY.startsWith("__")
                ? undefined
                : GENERATED_EVIDENCE_DIRECTORY);
        if (!evidenceDirectory)
            return;
        const testFile = relative(process.cwd(), test.location.file)
            .split(sep)
            .join("/");
        const payload = {
            testId: test.id,
            test: test.titlePath().filter(Boolean).join(" > "),
            testFile,
            title: test.title,
            retry: result.retry,
            status: result.status ?? "unknown",
            expectedStatus: test.expectedStatus,
            provenance: inferTestProvenance({
                runner: "playwright",
                file: testFile,
                project: test.parent.project()?.name,
                explicitKind: process.env["SUPERCOV_TEST_KIND"],
            }),
            browser: [],
            server: [],
        };
        this.records.push(payload);
    }
    onEnd() {
        const evidenceDirectory = process.env["SUPERCOV_EVIDENCE_DIR"] ??
            (GENERATED_EVIDENCE_DIRECTORY.startsWith("__")
                ? undefined
                : GENERATED_EVIDENCE_DIRECTORY);
        if (!evidenceDirectory || this.records.length === 0)
            return;
        const append = process.env.SUPERCOV_DURABLE_EVIDENCE_EACH_TEST === "1"
            ? appendJsonLineDurableSync
            : appendJsonLineSync;
        append(resolve(process.cwd(), evidenceDirectory, `playwright-status-${evidenceWriterIdentity()}-${process.pid}.mcdc.jsonl`), `${this.records.map(record => JSON.stringify(record)).join("\n")}\n`);
    }
}
