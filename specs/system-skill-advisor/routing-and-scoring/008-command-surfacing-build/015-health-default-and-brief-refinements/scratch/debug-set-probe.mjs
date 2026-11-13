// Persists one diagnostic record that holds a skill label and error text through
// the built sink, then reads the last line back. Usage:
//   TMPDIR=<temp> [SKILL_ADVISOR_DEBUG=1] node debug-set-probe.mjs <dist metrics.js> <workspace root>
const m = await import(process.argv[2]);
const rec = m.createAdvisorHookDiagnosticRecord({ runtime: "claude", status: "ok", freshness: "live", durationMs: 5, cacheHit: false, skillLabel: "sk-doc", errorDetails: "probe detail" });
const path = await m.persistAdvisorHookDiagnosticRecord(process.argv[3], rec);
const fs = await import("node:fs");
const lines = fs.readFileSync(path, "utf8").trim().split("\n");
const last = JSON.parse(lines.at(-1));
console.log(JSON.stringify({ debug: process.env.SKILL_ADVISOR_DEBUG ?? null, lines: lines.length, skillLabel: last.skillLabel ?? null, errorDetails: last.errorDetails ?? null }));
