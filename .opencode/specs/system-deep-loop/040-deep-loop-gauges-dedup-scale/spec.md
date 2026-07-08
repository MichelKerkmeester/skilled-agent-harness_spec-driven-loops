---
title: "Spec: Deep-Loop Gauge Defaults Flood-Test and Dedup Scale-Test"
description: "Closes the two deep-loop production-readiness gaps the 009 dark-flag validation flagged, then implements the two deep-review follow-up fixes behind their existing default-off flags. A flood-test reproduces the 009 0.05s flood and proves a 30s heartbeat cadence informs without flooding. FIX 1 (P1-7): the lag metric in fanout-pool.cjs is redefined from time-since-pool-start (queue backpressure, which false-fired on every healthy width>concurrency pool) to time-since-last-completion (a true stall signal); the old false positive is now silent, the detector fires once on a genuine stall, the committed pool test is migrated to stall semantics, and the recommended default drops to 120000ms (2min). FIX 2 (P2-15): nearDuplicateContentKey's comparison is made title-aware (a 0.15 Jaccard title-overlap gate) so genuinely-distinct findings with identical bodies but disjoint titles no longer collapse; the title-only false-collapse rate drops 0.50 -> 0 while body-distinguished precision holds. Each fix is byte-identical when its flag is off. The committed gauge defaults stay 0 (the recommended values ship documented for the separate graduation flip). The scale-test synthesizes 50-plus findings across six workers in identical, varied, distinct, near-miss, and title-distinct wording."
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
    packet_pointer: "system-deep-loop/040-deep-loop-gauges-dedup-scale"
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

**Related work**: `039-deep-loop-finding-dedup` covers the same three fanout flags at 17-record scale; this packet's FIX 2 refines its title-only false-collapse-rate result to production scale.
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

- A flood-test (`scripts/gauge-flood-test.mjs`) that drives the real `fanout-run.cjs` CLI and `runCappedPool`, reproduces the 009 0.05s flood, proves a seconds-scale heartbeat cadence informs without flooding, and proves the redefined lag metric (a true stall detector) is silent on a healthy pool and fires once on a genuine stall.
- The P1-7 fix: the lag metric in `fanout-pool.cjs` redefined from time-since-pool-start to time-since-last-completion, with the committed pool test migrated to stall semantics and the recommended default dropped to 120000ms.
- A scale-test (`scripts/dedup-scale-test.mjs`) over a 50-plus-finding, six-worker, wording-varied labeled set (identical, varied, distinct, near-miss, title-distinct) measuring the body-distinguished false-collapse rate, distinct-finding recall, near-miss precision, the title-only false-collapse rate, and review severity preservation.
- The P2-15 fix: a title-overlap gate in `fanout-merge.cjs` so genuinely-distinct findings with identical bodies but disjoint titles no longer collapse, dropping the title-only false-collapse rate to 0.
- The recommended production gauge values (heartbeat 30s, lag-ceiling 120000ms with its stall meaning), documented with flood-test evidence, and the enable-by-default decision.

### Out of Scope

- Flipping the committed zod source defaults for `lagCeilingMs` / `progressHeartbeatSeconds` (would cascade into committed silent-when-off tests; that flip belongs to the graduation decision). The metric REDEFINITION and the title fix are NOT this — they are byte-identical when their flag is off and ship now.
- Any change to the code-graph, search, or advisor follow-ups (sibling sub-phases of 010).

### Files to Change

- `scripts/gauge-flood-test.mjs`, `scripts/dedup-scale-test.mjs` (new) — the harnesses.
- `results/gauge-flood-metrics.json`, `results/dedup-scale-metrics.json` (new) — the metric rollups.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` — lag metric redefined to a stall detector (behind the default-off `lagCeilingMs`).
- `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` — title-aware near-dup match (behind the default-off dedup flag).
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` — pool test migrated to stall semantics, two silent-direction cases added.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- The flood-test reproduces the 009 0.05s-cadence flood on the real runner and confirms it exceeds an operator-readable hourly budget.
- A seconds-scale candidate cadence is chosen and proven to inform without flooding, resting on OBSERVED records at that cadence across all in-flight lineages, not projection alone.
- The scale-test runs 50-plus findings across 5-plus workers with mixed structured and free-text-varied wording and known true-duplicates and known-distinct findings, and reports the body-distinguished false-collapse rate, the distinct-finding recall, AND the title-only false-collapse rate.
- The P1-7 fix: the lag metric is redefined to a true stall signal (time-since-last-completion) so it is silent on healthy width>concurrency backpressure and fires only on a genuine stall, byte-identical when the gauge is off, with the committed pool test migrated.
- The P2-15 fix: the dedup match is made title-aware so the title-only false-collapse rate drops to 0 while body-distinguished precision (0 false-collapse, 1.0 distinct recall, identical-dup still collapses) holds, byte-identical when the dedup flag is off.

### P1 - Required (complete OR user-approved deferral)

- The flood-test proves the redefined lag metric: the same healthy pool that false-fired under the old metric is now silent, and the stall detector fires once on a genuine stall.
- The scale-test surfaces the content-identity semantic limit explicitly and verifies the review path keeps the strongest severity on every collapse.
- The full deep-loop regression suite stays green with both fixes in place.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `scripts/gauge-flood-test.mjs` exits 0: the 009 flood is reproduced, a seconds-scale cadence is observed to inform within budget, the old lag false-positive is now silent under the redefined metric, and the stall detector is silent on a healthy pool and fires on a genuine stall.
- `scripts/dedup-scale-test.mjs` exits 0: the title-only false-collapse rate is 0, the body-distinguished false-collapse rate and distinct-finding recall hold (0 and 1.0), identical-dup still collapses, the review severity is preserved, and the off path is byte-identical.
- Both fixes are byte-identical when their flag is off; the full deep-loop regression suite is green.
- The recommended gauge values (heartbeat 30s, lag-ceiling 120000ms with its stall meaning) and the enable-by-default decision are documented.
- `validate.sh <phase> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Type | Mitigation |
|-------------------|------|------------|
| Short stub windows under-count long cadences | Risk | The flood matrix reports both observed and analytic projections, and a dedicated observed run at the recommended cadence uses a window of 2.5x the cadence so every lineage ticks |
| A scale-test that reimplements the merge measures a copy, not production | Risk | Both harnesses import the exported production functions the CLI re-execs, never a reimplementation |
| A production fix changes behavior when the flag is off | Risk | Both fixes are gated: the lag metric returns undefined when `lagCeilingMs<=0`, the title-aware path is only reached when the dedup flag is on; the off-path tests stay green |
| The title-overlap threshold mislabels a real pair | Risk | 0.15 is verified against the committed restatement contract (overlap 0.167 collapses) and the scale fixtures (disjoint titles, overlap 0, stay separate); documented as a known heuristic limit |
| The production merge, pool, and runner exports | Dependency | Driven read-only by the harnesses; if absent they fail loudly with a fatal message |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The gauge-default decision is resolved in `implementation-summary.md`. Both deep-review fixes are implemented: the lag metric is a true stall detector and the title-only false-collapse is closed. The one remaining dedup limit — the varied-wording miss (under-merge when the same point is reworded) — is a documented known limit, not an open question; closing it would need a semantic key.
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

The scale-test spans five wording modes at the dedup's content-identity boundary: identical-body restatements (collapse), varied-wording restatements (no collapse, the semantic under-merge limit), distinct singletons (survive), near-miss pairs differing by one token (must not collapse, body-distinguished precision), and title-distinct pairs with identical bodies but disjoint titles (must NOT collapse after the title-aware fix; the title-overlap gate keeps them separate, dropping the title-only false-collapse rate to 0).

### Error Scenarios

If the runner or merge module is missing, each harness prints a fatal message and exits 1 rather than silently measuring nothing. A short stub window that catches no ticks is handled by the analytic projection and the dedicated observed run.

### State Transitions

The lag-ceiling is now a true stall detector: its metric is time-since-last-completion while work is pending, reset on every settlement. On a healthy `width > concurrency` fan-out, steady completions keep the metric small, so it never crosses the ceiling (the old false positive is silent). It transitions from silent to a single warning only when NO item settles for the ceiling window while work waits (a hung slot); the flood-test confirms both directions with a scaled ceiling preserving the ordering healthy-gap < ceiling < stall-gap.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Low-to-medium. The harnesses are new read-only files that drive existing production exports and a spawned CLI; no shared code changes. The complexity is in synthesizing a labeled set that probes the real dedup boundary and in projecting a non-flooding cadence from a short measurement window.
<!-- /ANCHOR:complexity -->

---
