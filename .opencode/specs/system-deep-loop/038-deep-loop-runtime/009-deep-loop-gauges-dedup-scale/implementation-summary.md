---
title: "Implementation Summary"
description: "Status COMPLETE. Closed the two deep-loop production-readiness gaps the 009 validation flagged, then IMPLEMENTED the two deep-review follow-up fixes, each behind its existing default-off flag and byte-identical off. A flood-test reproduces the 009 0.05s flood (440 records/2s, ~645K/h) and proves a 30s heartbeat cadence informs without flooding (20 observed records over 75s, ~955/h). FIX 1 (P1-7): the lag metric in fanout-pool.cjs was redefined from time-since-pool-start (queue backpressure, which false-fired on every healthy width>concurrency pool) to time-since-last-completion (a TRUE stall signal); the same healthy 10-wide pool that false-fired at 1500ms is now silent, the detector fires once on a genuine 5s stall, the committed pool test was updated to stall semantics plus two new silent-on-backpressure / silent-when-off cases, and the recommended default drops from 5min to 120000ms (2min). FIX 2 (P2-15): nearDuplicateContentKey now factors a title-overlap gate (Jaccard of stopword-stripped title tokens, threshold 0.15) so genuinely-distinct findings with identical bodies but disjoint titles no longer collapse; the title-only false-collapse rate drops 0.50 -> 0 while body-distinguished precision holds (false-collapse 0, distinct recall 1.0, identical-dup 7/7 still collapses) and the off path stays byte-identical. The full 428-test deep-loop suite is green; the gauge committed defaults remain 0 (the recommended values ship documented for the separate graduation flip)."
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
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/009-deep-loop-gauges-dedup-scale"
    last_updated_at: "2026-07-06T17:15:59.524Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped P1-7 stall-metric and P2-15 title-aware dedup fixes"
    next_safe_action: "Phase complete; the full cli test pass runs after"
    blockers: []
    key_files:
      - "scripts/gauge-flood-test.mjs"
      - "scripts/dedup-scale-test.mjs"
      - "results/gauge-flood-metrics.json"
      - "results/dedup-scale-metrics.json"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts"
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

Two harnesses over the production deep-loop fan-out modules plus two production fixes. The harnesses close the two gaps the 009 dark-flag validation left open (research sections 3.6 gauges and 3.5 dedup) and carry the gauge-default decision. The fixes — a redefined lag metric in `fanout-pool.cjs` (P1-7) and a title-aware dedup match in `fanout-merge.cjs` (P2-15) — land each behind its existing default-off flag and are byte-identical off.

### A. Gauge flood-test (`scripts/gauge-flood-test.mjs`)

The harness spawns the real `fanout-run.cjs` CLI with sleeping-stub lineages and imports the production `runCappedPool`. It answers three questions on the production path:

1. **Does the 009-flagged flood reproduce?** Yes. At the 009 worst case — `0.05s` cadence with 10 lineages in flight (concurrency 10, so 10 heartbeat intervals tick into one ledger) — the real runner wrote **440 `progress` records over a 2s window** (~178.6 records/s). Projected to a 1-hour fan-out that is **~645,000 records/h**, far past any operator-readable budget. The 009 "430 records / 2s" estimate is confirmed and slightly exceeded on the real code.

2. **What seconds-scale cadence informs without flooding?** The matrix swept 10s, 15s, 30s, and 60s at the same 10-in-flight pressure, scored on the projected records over a 1-hour, 10-wide fan-out against a **1500-record hourly budget** (~25/min across all 10 lineages, ~2.5/min each — scannable, not a flood). 10s (3600/h) and 15s (2400/h) exceed the budget; **30s (1200/h projected) and 60s (600/h projected) inform within it.** The harness picks the smallest informing cadence (most granular signal that stays within budget): **30 seconds**.

3. **Does the chosen cadence actually fire, not just project?** Confirmed with an OBSERVED run at 30s over a 75s window (2.5x the cadence) with 10 lineages in flight: **20 `progress` records, every one of the 10 lineages emitted at least once** (~2 ticks each), ~0.265 records/s → **~955 records/h observed**, comfortably within the 1500 budget. The recommended default rests on observed records, not projection alone.

**The lag-ceiling is now a TRUE stall detector (FIX, deep-review P1-7).** The metric in `fanout-pool.cjs` was redefined from `Date.now() - queuedAtMs[index]` (time since queued at pool start — queue backpressure) to **time since the pool last settled an item while work is pending** (`lastProgressAtMs`, reset in every settlement's `.finally()`). On a healthy fan-out wider than its concurrency, completions arrive steadily and reset the clock, so the metric stays small and the gauge does NOT fire — the old false positive is gone. The metric only grows past the ceiling when NOTHING settles while work waits — a hung slot. The flood-test proves all three directions on the real runner: the **same healthy 10-wide pool that false-fired at 1500ms under the old metric is now silent** (fired 0); the detector stays silent on a healthy pool even at a small 2500ms scaled ceiling; and it **fires exactly once on a genuine 5s stall** (`oldest_pending_lag_ms` 2502, `metric: time_since_last_completion`). Because it is now a true stall signal, the recommended default drops from the old 5min backpressure guess to **120000ms (2 minutes)** — a 2min gap with no settlement while work is pending is a hung slot, not backpressure. The committed pool test (`fanout-pool.vitest.ts`) was updated from the old backpressure firing to stall semantics, with two new cases added: silent on normal width>concurrency backpressure (steady completions), and silent when the ceiling is left at the default 0 (byte-silent off). The gauge default stays 0; with `lagCeilingMs <= 0` the metric returns `undefined`, no gauge field is emitted and no warning fires — byte-identical off.

### B. Dedup scale-test (`scripts/dedup-scale-test.mjs`)

The harness drives the production `mergeResearchRegistries` and `mergeReviewRegistries` exports off versus on over a labeled set far larger than the 008 17-record proof: **75 source findings across 6 workers** (60 research + 15 review), spanning five wording modes that probe the surfaces the 17-record set never stressed:

- **identical-body** restatements (the dedup's designed-for collapse case),
- **varied-wording** restatements of the same point (the content-identity limit),
- **distinct** singletons (must survive alone),
- **near-miss** pairs whose bodies differ by one number/file/token (the body-distinguished precision trap the 009 flagged), and
- **title-distinct** pairs whose bodies are IDENTICAL but whose titles carry the only distinguishing information (added per deep-review P2-15; the title-excluded-key precision blind spot, now closed by the fix).

Results, all traced to `results/dedup-scale-metrics.json`:

| Metric | Value |
|--------|-------|
| **Title-only false-collapse rate** (after the fix) | **0** (0 of 6 title-distinct points collapsed; was 0.50) |
| **Body-distinguished false-collapse rate** | **0** (0 of 32 body-distinguished research points) |
| **Distinct-finding recall** (body-distinguished) | **1.0** (32/32 survive) |
| Designed-for (identical-body) dup recall | 1.0 (7/7 clusters still collapse) |
| Near-miss precision | 8/8 near-miss distinct findings survived, none collapsed |
| Research noise removed | 19 records |
| Review severity preservation | 1.0 (4/4 collapses kept the strongest severity) |
| Review distinct survival | 4/4 distinct review bodies survived |
| Off-path byte-identity across re-runs | true |

**The title blind spot is fixed (FIX, deep-review P2-15).** `nearDuplicateContentKey` excluded the title, so genuinely-distinct findings sharing an identical body but differing only by title collapsed — measured at a 0.50 title-only false-collapse rate before the fix (3 of 6 distinct title-only points lost). The fix adds a title-overlap gate to the near-dup match: two same-body findings collapse only when their stopword-stripped title token sets have Jaccard overlap ≥ 0.15. Genuinely-distinct titles that name different specific subjects (e.g. "AWS access key" vs "Stripe token") share no content token (overlap 0) and stay separate, while restatement titles that paraphrase one point share their subject noun (e.g. "Cache invalidation missing" vs "Stale cache survives writes" share "cache", overlap 0.167) and still collapse. The bucketing (`getFindingBucket`) was made title-aware too, so a distinct same-body finding opens its own bucket rather than being mis-tagged as a same-id conflict variant. After the fix the **title-only false-collapse rate drops to 0** while the body-distinguished precision holds intact (false-collapse 0, distinct recall 1.0, identical-dup 7/7 still collapses). The fix is behind the dedup flag and the off path is byte-identical (the off branch never calls the title-aware match or bucketer; the committed "leaves variants separate by default" tests still pass).

The remaining limit is the **content-identity semantic miss**: the 2 varied-wording true-dup clusters stay separate (2/2), because the body-only key does not understand meaning — varied restatements share no key. This is an under-merge (a missed collapse), not a precision failure, and closing it would require a semantic key.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two harnesses are read-only and drive the real production code (the gauge harness spawns `fanout-run.cjs` and imports `runCappedPool`; the dedup harness imports `mergeResearchRegistries`/`mergeReviewRegistries`), so every number reflects the production path. On top of the measurement, two production fixes were shipped, each behind its existing default-off flag and byte-identical off: the lag metric in `fanout-pool.cjs` was redefined to a true stall signal, and `nearDuplicateContentKey`'s comparison in `fanout-merge.cjs` was made title-aware. The committed pool test was migrated to the new stall semantics with two new silent-direction cases; the committed dedup tests still pass unchanged. The full 428-test deep-loop suite is green.

### Gauge enable-by-default decision

**Chosen: keep the committed source defaults at 0; ship the recommended production values documented with this flood-test evidence.**

| Gauge | Committed default | Recommended production value | Basis |
|-------|-------------------|------------------------------|-------|
| Progress heartbeat (`progressHeartbeatSeconds`, `fanout-run.cjs`) | 0 (disabled) | **30 seconds** | Observed ~955 records/h on a 10-wide run, within the 1500/h budget; the 009 0.05s baseline floods at ~645K/h |
| Lag ceiling (`lagCeilingMs`, `fanout-pool.cjs`) — now a TRUE stall detector | 0 (disabled) | **120000 ms (2 min)** | The metric was redefined to time-since-last-completion, so the old healthy-pool false positive is gone (proven silent); a 2min gap with no settlement while work waits is a hung slot — far below the old 5min backpressure guess |

The defaults stay 0 because flipping the zod default cascades into committed silent-when-off suites (`executor-config.vitest.ts:232-233` asserting both defaults are 0; `fanout-run.vitest.ts` asserting the runner is silent when cadence is disabled) — that flip is the separate graduation step, with its own test migration, explicitly out of scope here per the 010 parent spec. The metric REDEFINITION and the title fix are different: they are byte-identical when the flag is off, so they ship now without touching the default. With each flag off, the lag metric returns `undefined` (no gauge field, no warning) and the dedup never calls the title-aware path — proven by the unchanged off-path tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the committed gauge defaults at 0, document the recommended values instead | Flipping the zod default cascades into three committed silent-when-off test suites; the flip is a separate graduation step, while the evidence-backed recommended value is the safe in-scope close the task offers as its fallback |
| Recommend 30s heartbeat cadence (smallest informing candidate) | Most granular signal that still stays within the 1500/h operator-readable budget; observed at ~955/h on a 10-wide pool, where 10s/15s flood and 60s is coarser |
| Redefine the lag metric to time-since-last-completion (deep-review P1-7 fix) | The old time-since-pool-start metric was queue backpressure and false-fired on every healthy width>concurrency pool; a true stall signal resets on each completion, stays silent on backpressure, and fires only on a hung slot. Byte-identical when off, so it ships behind the existing flag; the committed pool test was migrated to stall semantics |
| Drop the recommended lag default from 5min to 120000ms (2min) | Now that the metric is a true stall signal (no completion at all for the window), a 2min gap is already strong evidence of a hung slot; the 5min figure was sized for the noisier backpressure metric |
| Add a title-overlap gate to the dedup match (deep-review P2-15 fix) | The body-only key over-merged genuinely-distinct findings with identical bodies but disjoint titles (0.50 false-collapse). A Jaccard title-overlap gate (threshold 0.15) keeps disjoint-title findings separate while still collapsing restatements that share their subject noun; title-only false-collapse drops to 0, body-distinguished precision holds, byte-identical off |
| Set the title-overlap threshold at 0.15 (not higher) | The committed restatement contract ("Cache invalidation missing" vs "Stale cache survives writes", overlap 0.167) must keep collapsing; genuinely-distinct titles share no content token (overlap 0). 0.15 threads both, verified against the committed merge tests and the scale fixtures |
| Drive the real CLI and exported merge, never a reimplementation | A copy of the algorithm would measure the copy, not the production path the verdict gate requires |
| Add a review-path severity check to the scale-test | The 009 research flagged review false-collapse losing the strongest severity; the scale-test must cover that contract, not just the research path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Gauge flood-test runs green | `node scripts/gauge-flood-test.mjs` | exit 0; flood reproduced, 30s observed-informs, old lag false-positive now SILENT, stall-aware silent-on-healthy + fires-once-on-stall |
| Dedup scale-test runs green | `node scripts/dedup-scale-test.mjs` | exit 0; title-only false-collapse 0 (was 0.50), body-distinguished false-collapse 0, distinct recall 1.0, identical-dup 7/7, review severity 4/4 |
| Full deep-loop regression suite | `npx vitest run --no-coverage` | 49 files, 428 tests pass; includes the migrated pool stall tests and the unchanged dedup off-path tests |
| Lag metric off byte-identical | pool default `lagCeilingMs=0` test | silent, no `oldest_pending_lag_ms` gauge field emitted |
| Dedup off byte-identical | scale-test off-vs-off re-run + "leaves variants separate by default" tests | byte-identical; off branch never calls the title-aware path |

The harnesses write only to `results/` and OS-temp dirs removed at the end. The two production fixes change behavior only when their flag is on.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The committed gauge defaults remain 0 (disabled).** The recommended production values (heartbeat 30s, lag-ceiling 120000ms) are documented and proven but not enacted. To turn them on, set `progressHeartbeatSeconds: 30` and `lagCeilingMs: 120000` in the fan-out config, or flip the zod defaults in `executor-config.ts` AS PART OF the graduation step — which must also update `executor-config.vitest.ts` (lines 232-233) and the `fanout-run.cjs` silent-when-off test to the new defaults.
2. **The stall detector keys on settlement events, not per-worker liveness.** Time-since-last-completion fires when NO item settles for the window. If many short items keep settling while one specific worker hangs indefinitely, the steady completions keep the clock reset and that single hang is not isolated until the queue drains down to it. This is the correct pool-level starvation signal (the pool is making progress), but it is not a per-lineage watchdog; per-lineage hang detection remains the executor timeout's job (`computeLineageTimeoutMs`, ~4h cap).
3. **The title-overlap gate is a token-Jaccard heuristic, not semantic.** It separates disjoint-title findings (overlap 0) from subject-sharing restatements (overlap ≥ 0.15), which covers the realistic title-only-distinct case. A pathological pair — genuinely-distinct findings with identical bodies whose titles happen to share content tokens above the threshold — could still collapse, and a restatement whose paraphrased titles share no content token below the threshold could be kept separate. The threshold (0.15) is tuned against the committed restatement contract and the scale fixtures; a semantic title comparison would be more robust but is a larger change not warranted by current evidence.
4. **The dedup cannot collapse varied-wording restatements.** `nearDuplicateContentKey` is a content-identity key, not a semantic matcher, so two workers describing the same point in different sentences stay separate (2/2 such clusters in the scale-test). Closing this would require a semantic key (embeddings), not warranted by current evidence.
5. **Long-cadence projection rests partly on the analytic rate.** A short stub window cannot catch a 30-60s tick, so the matrix uses the analytic rate `lineagesInFlight / cadence` for those cells; the recommended 30s cadence is additionally confirmed with an observed 75s run, but the 60s candidate's hourly number is analytic only.
6. **Scope boundary.** This phase touched only its own folder and `.opencode/skills/deep-loop-runtime/**` (both fixes are within that scope, each behind its default-off flag and byte-identical off). No committed default was flipped. The code-graph, search, and advisor follow-ups are sibling sub-phases of 010 and out of scope here. The full cli test pass runs after this phase per the brief.
<!-- /ANCHOR:limitations -->
