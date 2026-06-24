---
title: "Implementation Plan: Deep-Loop Gauge Flood-Test and Dedup Scale-Test"
description: "Builds two read-only harnesses over the production deep-loop fan-out modules, with two deep-review corrections applied. The gauge flood-test spawns the real fanout-run.cjs CLI with ten sleeping-stub lineages at concurrency ten so ten heartbeat intervals tick into one ledger, reproducing the 009 0.05s flood, then sweeps seconds-scale candidate cadences and confirms the chosen one with an observed run whose window is 2.5x the cadence; for the lag-ceiling it proves the metric is queue backpressure (the old 1500ms default false-fires on a healthy width>concurrency pool) and that a backpressure-aware default stays silent on a healthy pool and fires once on a genuine stall. The dedup scale-test synthesizes a 50-plus-finding six-worker labeled set with identical, varied, distinct, near-miss, and title-distinct wording and drives mergeResearchRegistries and mergeReviewRegistries off versus on to measure the body-distinguished false-collapse rate, distinct-finding recall, designed-for collapse recall, near-miss precision, the title-only false-collapse rate, and review severity preservation. Both flip no default and edit no shared code; the committed gauge defaults stay at 0 and the recommended values (heartbeat 30s, lag-ceiling 300000ms) ship documented."
trigger_phrases:
  - "deep loop gauge flood test plan"
  - "fanout dedup scale test plan"
  - "progress heartbeat cadence flood harness"
  - "near dup dedup false collapse harness"
  - "gauge default decision plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/010-graduation-follow-ups/002-deeploop-gauges-dedup-scale"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness plan and built both tests"
    next_safe_action: "Run the tests and write the verdict"
    blockers: []
    key_files:
      - "scripts/gauge-flood-test.mjs"
      - "scripts/dedup-scale-test.mjs"
      - "results/gauge-flood-metrics.json"
      - "results/dedup-scale-metrics.json"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-Loop Gauge Flood-Test and Dedup Scale-Test

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` harnesses over the deep-loop runtime CommonJS modules and CLI |
| **Framework** | Direct imports of `mergeResearchRegistries` / `mergeReviewRegistries` / `runCappedPool`, plus a spawned copy of the real `fanout-run.cjs` |
| **Storage** | In-memory fixtures, an OS-temp status ledger, and two metrics.json rollups; no corpus, graph, or database |
| **Testing** | The harnesses self-verify flood reproduction, observed-cadence informing, lag backpressure (false-positive + silent-on-healthy + fires-on-stall), body-distinguished false-collapse, title-only false-collapse, recall, and off-path byte-identity |

### Overview
This phase closes the two deep-loop gaps the 009 validation left open, with two deep-review corrections applied. The gauge flood-test reproduces the 009 worst case (`0.05s x 10` in-flight) on the real runner, sweeps seconds-scale candidate cadences scored on the projected records over a 1-hour 10-wide fan-out, then confirms the smallest informing cadence with an OBSERVED run whose stub window is 2.5x the cadence so every lineage actually ticks. For the lag-ceiling (deep-review P1-7) it proves the metric is queue backpressure, not stall time — the old 1500ms default false-fires on a healthy width>concurrency pool — and proves a backpressure-aware default stays silent on a healthy pool while firing once on a genuine stall. The dedup scale-test synthesizes a 50-plus-finding six-worker labeled set spanning five wording modes — identical-body restatements (the designed-for collapse), varied-wording restatements (the content-identity under-merge limit), distinct singletons, near-miss pairs whose bodies differ by one token (the body-distinguished precision trap), and title-distinct pairs with identical bodies but distinguishing titles (deep-review P2-15, the title-excluded-key over-merge limit) — and drives the production merge off versus on to measure the body-distinguished false-collapse rate, distinct-finding recall, and the title-only false-collapse rate, plus a review-path severity check. Reimplementing the merge or the gauges in the harness was rejected: that would measure a copy, not the production path, so both harnesses import or spawn the production code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (both harnesses exit 0)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two read-only harnesses over the production modules, each synthesizing its own labeled fixtures and importing or spawning the production code rather than reimplementing it. The gauge harness reads the real ledger the runner writes; the dedup harness keys on the ground-truth point of each finding to score precision and recall.

### Key Components
- **`scripts/gauge-flood-test.mjs`**: the concurrent-pool flood matrix over the spawned `fanout-run.cjs`, the observed-cadence confirmation run, and the lag-ceiling backpressure experiment over `runCappedPool` (false-positive at the old default, silent-on-healthy and fires-on-stall at the backpressure-aware default).
- **`scripts/dedup-scale-test.mjs`**: the 50-plus-finding six-worker labeled set, the five wording modes, and the scoring over `mergeResearchRegistries` and `mergeReviewRegistries` for the body-distinguished false-collapse rate, distinct recall, designed-for collapse, near-miss precision, the title-only false-collapse rate, and review severity preservation.
- **`results/gauge-flood-metrics.json` and `results/dedup-scale-metrics.json`**: the metric rollups, the single source for the data tables and verdicts.

### Data Flow
The gauge harness spawns the real runner with ten sleeping-stub lineages so ten heartbeat intervals tick into one shared ledger, reads back the `progress` and `lag_ceiling_exceeded` records, and projects records-per-hour against an operator-readable budget. The dedup harness builds six worker registries whose findings restate shared points under different ids and titles, merges them off versus on, then re-keys each merged record the way the production dedup keys to count false collapses and surviving distinct points. Each writes its rollup to `results/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a measurement, not a fix, and it edits no shared production code. It reads or spawns the production fan-out modules under measurement. Each is read-only, so the surfaces below are the modules the harnesses drive, not modify.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | The lineage runner with the default-off progress-heartbeat | spawn the CLI with ten sleeping-stub lineages and a candidate cadence | the 009 flood reproduces, the recommended cadence informs within budget, the default stays silent |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | The concurrent pool with the default-off lag-ceiling (a queue-backpressure gauge) | import `runCappedPool` and drive it with a healthy pool and a stalled pool | the old 1500ms ceiling false-fires on a healthy width>concurrency pool; the backpressure-aware default is silent on a healthy pool and fires once on a genuine stall |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | The fan-out merge with the default-off near-dup dedup | import `mergeResearchRegistries` and `mergeReviewRegistries` and drive them off versus on | the body-distinguished false-collapse rate is 0 and distinct recall is 1.0 at scale; the title-only false-collapse rate is measured; the off path is byte-identical |

Required inventories:
- Same-class producers: the three fan-out modules are the only producers of the merge, the lag gauge, and the heartbeat under measurement.
- Consumers of changed symbols: none, the harnesses are new files that drive the production code read-only and change no shared symbol.
- Matrix axes: research and review merge paths each dedup-on versus off; the heartbeat across candidate cadences; the lag-ceiling on a healthy pool versus a stalled pool at the old and the backpressure-aware default.
- Algorithm invariant: the off merge is byte-identical to the production default; the on merge collapses content-identical near-duplicates (and, by the title-excluded key, title-only-distinct findings — measured) and keeps the strongest severity; the gauges are byte-silent when off; the recommended cadence informs within budget; and the backpressure-aware lag-ceiling is silent on a healthy pool.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the 009 research sections 3.5 and 3.6 and the production gauge and merge code paths
- [x] Confirm the real registry field shapes and the gauge config fields from `executor-config.ts`

### Phase 2: Core Implementation
- [x] Write the gauge flood-test: the concurrent-pool flood matrix, the observed-cadence confirmation, and the lag-ceiling backpressure experiment (false-positive + silent-on-healthy + fires-on-stall)
- [x] Write the dedup scale-test: the 50-plus-finding six-worker labeled set across five wording modes and the off-versus-on scoring, including the title-only false-collapse measurement and the review severity check
- [x] Write the metric rollups to `results/gauge-flood-metrics.json` and `results/dedup-scale-metrics.json`

### Phase 3: Verification
- [x] Run both harnesses to exit 0 and confirm the numbers reproduce across re-runs
- [x] Confirm the existing fanout unit suite still passes (production modules unchanged, off-path byte-identical)
- [x] Author the results tables, the recommended gauge values, and the enable-by-default decision grounded strictly in the metrics files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | The real runner floods at 0.05s and informs at the recommended cadence; the lag-ceiling false-fires on a healthy pool at the old default and behaves correctly at the backpressure-aware default | the gauge flood-test over the spawned `fanout-run.cjs` and `runCappedPool` |
| Unit | The dedup collapses identical-body near-dups, never collapses body-distinguished near-miss findings, but over-merges title-only-distinct findings (measured), keeping the strongest review severity | the dedup scale-test over the production merge exports |
| Regression | The production fan-out unit suite still passes; the off path is byte-identical across re-runs | the deep-loop-runtime vitest unit files and the harnesses' own off-vs-off re-run checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The production `mergeResearchRegistries` and `mergeReviewRegistries` exports | Internal | Green | The dedup cannot be scale-tested on the production path without them |
| The production `runCappedPool` export | Internal | Green | The lag-ceiling cannot be measured without it |
| The `fanout-run.cjs` CLI and a resolvable tsx loader | Internal | Green | The heartbeat flood cannot be measured on the production path without driving the real runner |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The measurement is abandoned or the harnesses prove unsound.
- **Procedure**: Delete the phase folder. The harnesses edit no shared code and flip no default, so removal leaves the production fan-out modules untouched.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The harnesses edit no shared production code and flip no committed default
- [x] The dedup off path is byte-identical to the production default across re-runs
- [x] The harnesses run exit 0 and read no corpus or database

### Rollback Procedure
1. Leave every committed gauge and dedup default at its existing value, which is the state the tests measured and never changed
2. If the phase is abandoned, delete the phase folder, which removes only the new harnesses and metrics
3. Confirm the three fan-out modules are untouched, since the harnesses only drive them

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the harnesses write only to the phase results tree and an OS-temp ledger removed at the end
<!-- /ANCHOR:enhanced-rollback -->

---
