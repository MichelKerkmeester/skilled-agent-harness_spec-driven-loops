---
title: "Spec: Deep-Loop Gauge Defaults Flood-Test and Dedup Scale-Test"
description: "Closes the two deep-loop production-readiness gaps the 009 dark-flag validation flagged, with two deep-review corrections applied. The progress-heartbeat and lag-ceiling gauges default to 0 = disabled, so the runtime never informs in production; a flood-test reproduces the 009 0.05s flood, sets a seconds-scale heartbeat cadence proven to inform without flooding, and corrects the lag-ceiling to a queue-backpressure gauge (the old 1500ms default false-fires on every healthy width>concurrency pool) with a re-justified, raised default. The finding-dedup was only proven on 17 synthetic records; a scale-test synthesizes 50-plus findings across six workers with identical, varied, distinct, near-miss, and title-distinct wording and runs the production merge to measure the body-distinguished false-collapse rate, distinct-finding recall, and the title-only false-collapse rate (the title-excluded-key free-text limit). The committed gauge defaults stay at 0 because flipping them cascades into committed silent-when-off tests; the recommended production values (heartbeat 30s, lag-ceiling 300000ms) ship documented with flood-test evidence instead. Both tests drive the real production modules read-only and flip no default."
trigger_phrases:
  - "deep loop gauge defaults flood test"
  - "progress heartbeat cadence production default"
  - "lag ceiling production default flood test"
  - "fanout dedup scale test false collapse rate"
  - "SPECKIT_FANOUT_NEAR_DUP_DEDUP scale"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/002-deeploop-gauges-dedup-scale"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the phase spec for the gauge flood-test and dedup scale-test"
    next_safe_action: "Build and run both harnesses, then validate strict"
    blockers: []
    key_files:
      - "scripts/gauge-flood-test.mjs"
      - "scripts/dedup-scale-test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Deep-Loop Gauge Defaults Flood-Test and Dedup Scale-Test

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

A sub-phase of the 010 graduation follow-ups packet covering the two deep-loop gaps the 009 validation left open: undefined production gauge defaults and an under-scaled dedup proof. Both are measurement-and-decision tasks, not feature changes to shared code.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 009 dark-flag validation (research sections 3.5 and 3.6) qualified two graduated deep-loop capabilities. The progress-heartbeat (`fanout-run.cjs`) and the lag-ceiling (`fanout-pool.cjs`) both default to `0 = disabled`, so they never inform in production, and the research warned a naive low cadence floods (`0.05s x 10 concurrent pools = 430 records / 2s`); the production cadence and lag threshold were undefined. Separately, the finding near-duplicate dedup (`fanout-merge.cjs`) was only proven on 17 hand-crafted records, and the research warned that precision 1.0 on 17 synthetic records does not guarantee scale behavior and that false-collapse risk is higher on free-text findings.

### Purpose

Measure both against the real production modules: a flood-test that picks and proves a production heartbeat cadence and lag threshold, and a scale-test that measures the dedup's false-collapse rate and distinct-finding recall on a realistically larger, wording-varied set, then record the enable-by-default decision with its evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A flood-test (`scripts/gauge-flood-test.mjs`) that drives the real `fanout-run.cjs` CLI and `runCappedPool` under concurrent pools, reproduces the 009 0.05s flood, proves a seconds-scale candidate cadence informs without flooding over a projected hour-long run, and corrects the lag-ceiling to a queue-backpressure gauge (proving the old 1500ms default false-fires on a healthy width>concurrency pool, and a backpressure-aware default is silent on a healthy pool and fires once on a genuine stall).
- A scale-test (`scripts/dedup-scale-test.mjs`) that drives the real `mergeResearchRegistries` and `mergeReviewRegistries` exports over a 50-plus-finding, six-worker, wording-varied labeled set (identical, varied, distinct, near-miss, and title-distinct modes) and measures the body-distinguished false-collapse rate, distinct-finding recall, designed-for collapse recall, near-miss precision, the title-only false-collapse rate, and review severity preservation.
- The recommended production gauge values (heartbeat 30s, lag-ceiling 300000ms with its backpressure meaning), documented with their flood-test evidence, and the enable-by-default decision with its justification.

### Out of Scope

- Flipping the committed source defaults for `lagCeilingMs` / `progressHeartbeatSeconds` (would cascade into committed silent-when-off tests; that flip belongs to the graduation decision).
- Any edit to the production fan-out modules (`fanout-run.cjs`, `fanout-pool.cjs`, `fanout-merge.cjs`, `executor-config.ts`) — they are driven read-only.
- The code-graph, search, and advisor follow-ups (sibling sub-phases of 010).

### Files to Change

- `scripts/gauge-flood-test.mjs` (new) — the gauge flood-test harness.
- `scripts/dedup-scale-test.mjs` (new) — the dedup scale-test harness.
- `results/gauge-flood-metrics.json`, `results/dedup-scale-metrics.json` (new) — the metric rollups.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- The flood-test reproduces the 009 0.05s-cadence flood on the real runner and confirms it exceeds an operator-readable hourly budget.
- A seconds-scale candidate cadence is chosen and proven to inform without flooding, resting on OBSERVED records at that cadence across all in-flight lineages, not projection alone.
- The scale-test runs 50-plus findings across 5-plus workers with mixed structured and free-text-varied wording and known true-duplicates and known-distinct findings, and reports the body-distinguished false-collapse rate, the distinct-finding recall, AND the title-only false-collapse rate (the title-excluded-key free-text limit per deep-review P2-15).

### P1 - Required (complete OR user-approved deferral)

- The lag-ceiling is documented as a queue-backpressure gauge (not a stall detector, per deep-review P1-7): the flood-test proves the old 1500ms default false-fires on a healthy width>concurrency pool, and the backpressure-aware default stays silent on a healthy pool while firing once on a genuine stall.
- The scale-test surfaces the content-identity semantic limit and the title-only false-collapse limit explicitly, and verifies the review path keeps the strongest severity on every collapse.
- Both harnesses drive the production modules read-only, flip no default, and the off path is byte-identical to the production default across re-runs.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `scripts/gauge-flood-test.mjs` exits 0: the 009 flood is reproduced, a seconds-scale cadence is observed to inform within budget, the old lag default is shown to false-fire on a healthy pool, and the backpressure-aware default is silent on a healthy pool and fires on a genuine stall.
- `scripts/dedup-scale-test.mjs` exits 0: the body-distinguished false-collapse rate and distinct-finding recall hold at scale (0 and 1.0), the title-only false-collapse rate is measured, the review severity is preserved on every collapse, and the off path is byte-identical.
- The recommended gauge values (heartbeat 30s, lag-ceiling 300000ms with its backpressure meaning) and the enable-by-default decision are documented with the flood-test numbers.
- `validate.sh <phase> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Type | Mitigation |
|-------------------|------|------------|
| Short stub windows under-count long cadences | Risk | The flood matrix reports both observed and analytic projections, and a dedicated observed run at the recommended cadence uses a window of 2.5x the cadence so every lineage ticks |
| A scale-test that reimplements the merge measures a copy, not production | Risk | Both harnesses import the exported production functions the CLI re-execs, never a reimplementation |
| Flipping the committed gauge default silently breaks the suite | Risk | The committed default is left at 0 and the recommended value is documented; the existing silent-when-off tests stay green |
| The production merge, pool, and runner exports | Dependency | Driven read-only; if absent the harnesses fail loudly with a fatal message |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The gauge-default decision is resolved in `implementation-summary.md`. The two un-closed dedup limits — the title-only false-collapse (over-merge when distinguishing content is in the title) and the varied-wording miss (under-merge when the same point is reworded) — are documented as measured known limits, not open questions. Redefining the lag metric to a true stall-detector is recorded as a deferred follow-up, not a gap in this phase.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

The flood-test's hour-long projection rests on the analytic rate `lineagesInFlight / cadence` plus an observed confirmation run; the recommended 30s cadence projects ~1200 records/h and is observed at ~955 records/h on a 10-wide pool, within a 1500/h operator-readable budget.

### Security

The harnesses read or spawn only the production modules and in-memory or OS-temp fixtures; no cell opens the corpus, the graph, or the memory database, and no committed default is flipped.

### Reliability

Both harnesses exit non-zero if the production primitives change shape (the flood fails to reproduce, the lag one-shot breaks, a false collapse appears, or the off path stops being byte-identical), so a regression fails loudly.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

The scale-test spans five wording modes at the dedup's content-identity boundary: identical-body restatements (collapse), varied-wording restatements (no collapse, the semantic under-merge limit), distinct singletons (survive), near-miss pairs differing by one token (must not collapse, body-distinguished precision), and title-distinct pairs with identical bodies but distinguishing titles (DO collapse, the title-excluded-key over-merge limit measured as the title-only false-collapse rate).

### Error Scenarios

If the runner or merge module is missing, each harness prints a fatal message and exits 1 rather than silently measuring nothing. A short stub window that catches no ticks is handled by the analytic projection and the dedicated observed run.

### State Transitions

The lag-ceiling is a queue-backpressure gauge: its metric is total time queued since pool start, so on any `width > concurrency` fan-out the tail's normal second-wave wait crosses a low ceiling (the 1500ms false positive proven in the flood-test). At the backpressure-aware default (300000ms) it stays silent on a healthy pool and transitions from silent to a single warning only when a queued lineage waits abnormally long (a starved pool); the test confirms both directions with a scaled ceiling preserving the production ordering.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Low-to-medium. The harnesses are new read-only files that drive existing production exports and a spawned CLI; no shared code changes. The complexity is in synthesizing a labeled set that probes the real dedup boundary and in projecting a non-flooding cadence from a short measurement window.
<!-- /ANCHOR:complexity -->

---
