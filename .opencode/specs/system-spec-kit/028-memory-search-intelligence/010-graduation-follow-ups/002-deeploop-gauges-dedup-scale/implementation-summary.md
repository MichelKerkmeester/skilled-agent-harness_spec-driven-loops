---
title: "Implementation Summary"
description: "Status COMPLETE. Closed the two deep-loop production-readiness gaps the 009 validation flagged. A flood-test drove the real fanout-run.cjs CLI with ten in-flight lineages to reproduce the 009 0.05s flood (440 records in 2s, ~645K records/h projected), then proved a 30-second heartbeat cadence informs without flooding: 20 observed records over a 75s ten-wide run, ~955 records/h, within a 1500-record hourly budget, every lineage ticking. The lag-ceiling fired exactly once under a concurrent pool at a 1500ms threshold. A dedup scale-test drove the production merge over 69 findings across six workers (54 research, 15 review) in identical, varied, distinct, and near-miss wording modes: false-collapse rate 0, distinct-finding recall 1.0, designed-for collapse recall 1.0, all 8 near-miss distinct findings survived, and the review path kept the strongest severity on all 4 collapses. Decision: keep the committed gauge defaults at 0 and ship the recommended production values (heartbeat 30s, lag-ceiling 1500ms) documented with this evidence, because flipping the committed default cascades into committed silent-when-off tests and belongs to the separate graduation flip."
trigger_phrases:
  - "deep loop gauge flood test summary"
  - "progress heartbeat 30 second cadence decision"
  - "fanout dedup scale test false collapse rate"
  - "gauge enable by default decision"
  - "SPECKIT_FANOUT_NEAR_DUP_DEDUP scale verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/002-deeploop-gauges-dedup-scale"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran both harnesses green and authored the gauge decision and the scale verdict"
    next_safe_action: "Phase complete; the full cli test pass runs after"
    blockers: []
    key_files:
      - "scripts/gauge-flood-test.mjs"
      - "scripts/dedup-scale-test.mjs"
      - "results/gauge-flood-metrics.json"
      - "results/dedup-scale-metrics.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two read-only harnesses over the production deep-loop fan-out modules, closing the two gaps the 009 dark-flag validation left open (research sections 3.6 gauges and 3.5 dedup), plus the gauge-default decision the gauges gap demands.

### A. Gauge flood-test (`scripts/gauge-flood-test.mjs`)

The harness spawns the real `fanout-run.cjs` CLI with sleeping-stub lineages and imports the production `runCappedPool`. It answers three questions on the production path:

1. **Does the 009-flagged flood reproduce?** Yes. At the 009 worst case — `0.05s` cadence with 10 lineages in flight (concurrency 10, so 10 heartbeat intervals tick into one ledger) — the real runner wrote **440 `progress` records over a 2s window** (~178.6 records/s). Projected to a 1-hour fan-out that is **~645,000 records/h**, far past any operator-readable budget. The 009 "430 records / 2s" estimate is confirmed and slightly exceeded on the real code.

2. **What seconds-scale cadence informs without flooding?** The matrix swept 10s, 15s, 30s, and 60s at the same 10-in-flight pressure, scored on the projected records over a 1-hour, 10-wide fan-out against a **1500-record hourly budget** (~25/min across all 10 lineages, ~2.5/min each — scannable, not a flood). 10s (3600/h) and 15s (2400/h) exceed the budget; **30s (1200/h projected) and 60s (600/h projected) inform within it.** The harness picks the smallest informing cadence (most granular signal that stays within budget): **30 seconds**.

3. **Does the chosen cadence actually fire, not just project?** Confirmed with an OBSERVED run at 30s over a 75s window (2.5x the cadence) with 10 lineages in flight: **20 `progress` records, every one of the 10 lineages emitted at least once** (~2 ticks each), ~0.265 records/s → **~955 records/h observed**, comfortably within the 1500 budget. The recommended default rests on observed records, not projection alone.

The lag-ceiling was exercised under a concurrent pool (10 lineages, concurrency 2, ~3s stub so the queue tail ages past the ceiling) at a **1500ms threshold**: it fired **exactly once** (`oldest_pending_lag_ms` 1502 vs ceiling 1500), confirming its one-shot contract holds under concurrency — it cannot flood by construction (a single guarded boolean, at most one warning per pool run).

### B. Dedup scale-test (`scripts/dedup-scale-test.mjs`)

The harness drives the production `mergeResearchRegistries` and `mergeReviewRegistries` exports off versus on over a labeled set far larger than the 008 17-record proof: **69 source findings across 6 workers** (54 research + 15 review), spanning four wording modes that probe the surfaces the 17-record set never stressed:

- **identical-body** restatements (the dedup's designed-for collapse case),
- **varied-wording** restatements of the same point (the content-identity limit),
- **distinct** singletons (must survive alone), and
- **near-miss** pairs whose bodies differ by one number/file/token (the precision trap the 009 flagged).

Results, all traced to `results/dedup-scale-metrics.json`:

| Metric | Value |
|--------|-------|
| **False-collapse rate** (distinct points wrongly merged) | **0** (0 of 32 distinct research points) |
| **Distinct-finding recall** | **1.0** (32/32 distinct points survive) |
| Designed-for (identical-body) dup recall | 1.0 (7/7 clusters collapsed) |
| Near-miss precision | 8/8 near-miss distinct findings survived, none collapsed |
| Research noise removed | 19 records (54 → 35 on-path) |
| Review severity preservation | 1.0 (4/4 collapses kept the strongest severity) |
| Review distinct survival | 4/4 distinct review bodies survived |
| Off-path byte-identity across re-runs | true |

The **content-identity semantic limit is surfaced explicitly**: the 2 varied-wording true-dup clusters stayed separate (2/2), because `nearDuplicateContentKey` normalizes and concatenates body fields but does not understand meaning — varied restatements share no key. This is the dedup's real ceiling, reported as a known limit, not a precision failure. The feature only ever claimed to collapse content-identical restatements, and it does so at scale with zero false collapses.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both harnesses are new read-only files under `scripts/` that drive the real production code — the gauge harness spawns the actual `fanout-run.cjs` CLI and imports `runCappedPool`, the dedup harness imports `mergeResearchRegistries` and `mergeReviewRegistries` — so every number reflects the production path, not a reimplementation. Each writes a single metrics rollup to `results/` and exits non-zero if a production primitive changes shape, so a regression fails loudly. Confidence comes from three independent confirmations: the 009 flood reproduced on the real runner, the recommended 30s cadence observed (not just projected) to inform across all ten in-flight lineages, and the existing fan-out unit suite re-run green to prove the production modules and their default-off contracts are untouched.

### Gauge enable-by-default decision

**Chosen: keep the committed source defaults at 0; ship the recommended production values documented with this flood-test evidence.**

| Gauge | Committed default | Recommended production value | Basis |
|-------|-------------------|------------------------------|-------|
| Progress heartbeat (`progressHeartbeatSeconds`, `fanout-run.cjs`) | 0 (disabled) | **30 seconds** | Observed ~955 records/h on a 10-wide run, within the 1500/h budget; the 009 0.05s baseline floods at ~645K/h |
| Lag ceiling (`lagCeilingMs`, `fanout-pool.cjs`) | 0 (disabled) | **1500 ms** | One-shot fires exactly once under a concurrent pool; cannot flood by construction |

The task set a high bar for a deliberate behavior change, and the evidence earns the *value* — 30s informs without flooding. But flipping the committed zod default is not a self-contained gauge change: three committed test suites assert the current default. `tests/unit/executor-config.vitest.ts` asserts `config.lagCeilingMs === 0` and `config.progressHeartbeatSeconds === 0` as the schema defaults (lines 232-233); `tests/unit/fanout-run.vitest.ts` asserts the runner "does not emit progress events when cadence is left disabled"; and the fan-out unit suite's byte-identity and silent-when-off contracts (87 tests across the three files, re-confirmed green this session) all rest on default-off. Flipping the default would break those committed contracts and require rewriting them — a graduation-flip with its own test-migration blast radius, explicitly separated from this measurement follow-up by the 010 parent spec. The 009 research's own recommendation (#3) asks to "set production defaults before graduation"; those values are now set and proven, and enacting the flip belongs to the graduation step that also migrates the silent-when-off tests. The task's fallback path — keep the default at 0 but document the recommended production value with the flood-test evidence — is the safe, in-scope close this phase delivers.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the committed gauge defaults at 0, document the recommended values instead | Flipping the zod default cascades into three committed silent-when-off test suites; the flip is a separate graduation step, while the evidence-backed recommended value is the safe in-scope close the task offers as its fallback |
| Recommend 30s heartbeat cadence (smallest informing candidate) | Most granular signal that still stays within the 1500/h operator-readable budget; observed at ~955/h on a 10-wide pool, where 10s/15s flood and 60s is coarser |
| Recommend 1500ms lag-ceiling | Fires exactly once under a concurrent pool and cannot flood by construction; a sub-2s threshold catches a genuinely stalled tail without tripping on transient scheduling |
| Drive the real CLI and exported merge, never a reimplementation | A copy of the algorithm would measure the copy, not the production path the verdict gate requires |
| Add a review-path severity check to the scale-test | The 009 research flagged review false-collapse losing the strongest severity; the scale-test must cover that contract, not just the research path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Gauge flood-test runs green | `node scripts/gauge-flood-test.mjs` | exit 0; flood reproduced, 30s observed-informs, lag one-shot |
| Dedup scale-test runs green | `node scripts/dedup-scale-test.mjs` | exit 0; false-collapse 0, distinct recall 1.0, review severity 1.0 |
| Production modules unchanged | `npx vitest run tests/unit/{fanout-merge,fanout-pool,executor-config}.vitest.ts` | 87/87 pass; off-path defaults intact |
| Off-path byte-identity | dedup harness off-vs-off re-run | byte-identical |

Both harnesses drive the production code read-only, flip no committed default, and write only to `results/` and OS-temp dirs removed at the end.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The committed gauge defaults remain 0 (disabled).** The recommended production values (heartbeat 30s, lag-ceiling 1500ms) are documented and proven but not enacted. To turn them on, set `progressHeartbeatSeconds: 30` and `lagCeilingMs: 1500` in the fan-out config, or flip the zod defaults in `executor-config.ts` AS PART OF the graduation step — which must also update `executor-config.vitest.ts` (lines 232-233) and the `fanout-run.cjs` silent-when-off test to the new defaults.
2. **The dedup cannot collapse varied-wording restatements.** `nearDuplicateContentKey` is a content-identity key, not a semantic matcher, so two workers describing the same point in different sentences stay as separate records (the scale-test confirms 2/2 such clusters stay separate). Closing this would require a semantic key (embeddings), a separate larger change with its own cost/precision tradeoff, not warranted by current evidence.
3. **Long-cadence projection rests partly on the analytic rate.** A short stub window cannot catch a 30-60s tick, so the matrix uses the analytic rate `lineagesInFlight / cadence` for those cells; the recommended 30s cadence is additionally confirmed with an observed 75s run, but the 60s candidate's hourly number is analytic only.
4. **Scope boundary.** This phase touched only its own folder and read (never wrote) `.opencode/skills/deep-loop-runtime/**`. No production fan-out source was edited and no committed default was flipped. The code-graph, search, and advisor follow-ups are sibling sub-phases of 010 and out of scope here. The full cli test pass runs after this phase per the brief.
<!-- /ANCHOR:limitations -->
