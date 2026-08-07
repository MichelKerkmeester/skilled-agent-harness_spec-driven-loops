# Iteration 011 — Tooling: 4-Hour Lineage Timeout Hard Cap STILL LIVE (Round-1 CRITICAL F-006)

**Focus:** Is the computeLineageTimeoutMs 4h cap still present? Is there an override flag?
**Angle:** Read fanout-run.cjs timeout code; grep for any override mechanism.

## Findings

**STILL LIVE — UNCHANGED.** `fanout-run.cjs:884-887`:
```js
function computeLineageTimeoutMs(lineage) {
  ...
  return Math.min(iters * perIterSecs * 2 * 1000, 4 * 60 * 60 * 1000);
}
```

With default `perIterSecs=900` (15 min) and `iters=35`: `35 * 900 * 2 * 1000 = 63,000,000ms (17.5h)` capped to `4 * 60 * 60 * 1000 = 14,400,000ms (4h)`. The cap dominates. At 15 min/iter, 4h allows only ~16 iterations before kill — far short of 35.

**No override exists.** `rg "lineage-timeout-hours|lineageTimeoutHours|lineageTimeout" fanout-run.cjs` returns EMPTY. There is no `--lineage-timeout-hours` CLI flag, no env var, no config option.

**009/002-fanout-timeout-override** was scaffolded (Tier 0, phase-map "Not Started") and **has spec.md + plan.md + tasks.md but NO implementation-summary.md** — confirming it has NOT shipped. Its folder exists (one of only 3 009 children) but is unimplemented.

**Structural risk confirmed:** this exact research loop (35 iterations, stopPolicy=max-iterations) is the kind of run the 4h cap is designed to kill. The only reason this lineage completes is that it runs as a single in-session executor (not a subprocess spawned by fanout-run.cjs with the timeout enforced).

## Evidence
[SOURCE: fanout-run.cjs:884-887 — computeLineageTimeoutMs unchanged]
[SOURCE: rg for override flags — empty]
[SOURCE: 009/002-fanout-timeout-override/ — no implementation-summary.md]

## newInfoRatio: 0.65 (confirmed unchanged + verified the planned fix-phase is unimplemented)
