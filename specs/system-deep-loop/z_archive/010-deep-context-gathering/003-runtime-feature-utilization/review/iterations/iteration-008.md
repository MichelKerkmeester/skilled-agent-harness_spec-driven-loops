# Deep Review — Iteration 008

**Dimension**: docs-vs-code accuracy · **Scope**: deep-context SKILL/feature_catalog/references vs runtime code
**Executor**: cli-opencode openai/gpt-5.5-fast --variant xhigh (read-only) · **Raw**: /tmp/dr-r8.out

## Findings (all CONFIRMED real doc/code mismatches — docs over-claim what is wired)

- **P1** loop-lock.md:22 — heartbeat-refresh + cross-session prevention claimed; loop has acquire/release only, pid-stale advisory.
- **P1** executor-audit.md:3 — "stack set for each CLI seat" claimed; council dispatcher doesn't stamp; only fanout path does (guard still unenforced, P1-3).
- **P1** context-node-kinds-relations.md:52,53 — COVERED_BY→iteration and CONFIRMS→executor-seat reference non-existent node kinds.
- **P1** context-convergence-signals.md:46-49 — reuseCatalogCoverage (≥2 vs ≥1/verified), agreementRate denominator, relevanceFloor (MIN vs fraction), dependencyCompleteness formula all mis-describe the code.
- **P1** convergence.md:51,92 — composite score documented as STOP gate (it's telemetry); "all thresholds configurable" but evaluateContext hardcodes them.
- **P2** context-convergence-signals.md:21 — evaluateContext export-name/API drift in docs.

See review-report.md §4 (P1-7…P1-13) for the consolidated list + fixes.
