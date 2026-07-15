---
title: "Implementation Plan: Deep-Research Loop Instrumentation"
description: "Plan and delivered notes for the inert newInfoRatio detector in the deep-research reducer."
trigger_phrases:
  - "deep research loop instrumentation plan"
  - "newInfoRatio inertness"
  - "novelty_signal_inert"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/011-deep-research-loop-instrumentation"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Ship inert novelty detector instrumentation"
    next_safe_action: "Run strict validation for the instrumentation phase"
    completion_pct: 100
---
# Implementation Plan: Deep-Research Loop Instrumentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS reducer plus Vitest coverage |
| **Framework** | deep-loop-workflows deep-research reducer consumed by deep-loop-runtime tests |
| **Storage** | Existing deep-research state JSONL and reducer registry outputs |
| **Testing** | `deep-research-novelty-inertness.vitest.ts` plus existing reducer suite |

### Overview

The shipped implementation adds an inert-novelty detector to the reducer. A flat-high `newInfoRatio` history now emits `novelty_signal_inert` with warning severity and a note that convergence or corpus-not-exhausted claims derived from that signal are untrustworthy.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Failure mode documented in `spec.md:9-17`.
- [x] Acceptance cases documented in `spec.md:19-22`.
- [x] Scope limited to reducer telemetry and tests.

### Definition of Done

- [x] Reducer emits `novelty_signal_inert` for flat-high `newInfoRatio`.
- [x] Flat-low `newInfoRatio` remains a plain advisory.
- [x] Varied `newInfoRatio` emits no flatline event.
- [x] Existing reducer suite remains green per shipped evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Escalate a deceptive telemetry flatline at reduction time without recomputing novelty deterministically.

### Key Components

- **`buildTrendFlatlineAdvisories`**: Detects flat sparklines and classifies flat-high `newInfoRatio` as inert novelty.
- **`formatTrendAdvisoryEvent`**: Renders warnings with a clear `WARNING` label.
- **Reducer registry**: Stores advisory events from `newInfoRatio` and score histories.
- **Focused Vitest**: Proves flat-high, flat-low, and varied cases.

### Data Flow

1. Reducer reads iteration records and filters evidence-bearing records.
2. Reducer builds `ratioHistory` from numeric `record.newInfoRatio` values.
3. `buildTrendFlatlineAdvisories` inspects the trailing window.
4. Flat-high ratios emit warning severity and event `novelty_signal_inert`.
5. Dashboard trend output renders warnings through `formatTrendAdvisoryEvent`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Failure Localization

- [x] Confirm `newInfoRatio` was consumed from state records rather than recomputed (`spec.md:12`).
- [x] Select reducer-side inert-signal escalation as the shipped lower-risk fix (`spec.md:24-25`).

### Phase 2: Implementation

- [x] Add flat-high `newInfoRatio` detection in `buildTrendFlatlineAdvisories` (`reduce-state.cjs:927-968`).
- [x] Emit `novelty_signal_inert`, warning severity, and untrustworthy-claim note (`reduce-state.cjs:942-962`).
- [x] Render warning labels in trend output (`reduce-state.cjs:970-978`, `reduce-state.cjs:2450-2452`).
- [x] Feed reducer histories into advisory construction (`reduce-state.cjs:2594-2604`).

### Phase 3: Verification

- [x] Add RED/GREEN tests for flat-high, flat-low, and varied histories (`deep-research-novelty-inertness.vitest.ts:20-40`).
- [x] Preserve exported reducer helper access for tests (`reduce-state.cjs:2744-2750`).
- [x] Existing reducer suite remains green, recorded as 16/16 in `spec.md:24-25`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Focused unit | Flat-high, flat-low, and varied `newInfoRatio` histories | Vitest |
| Regression | Existing reducer suite | Vitest |
| Source readback | Reducer event and render paths | Read/Grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `reduce-state.cjs` | Internal | Green | Detector cannot run. |
| Deep-research state records | Internal | Green | Detector needs numeric `newInfoRatio` history. |
| Vitest reducer tests | Internal | Green | RED/GREEN coverage cannot be proven. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Detector creates false blocking warnings on valid high-novelty runs.
- **Procedure**: Revert the flat-high special case to plain `trend_flatline` advisory and keep the tests as the failing evidence to redesign thresholding.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Failure localization | Review finding in `spec.md` | Reducer implementation |
| Implementation | Reducer flatline helper | Verification |
| Verification | Focused tests and reducer suite | Completion |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Failure localization | Medium | 1 hour |
| Implementation | Low | 1 hour |
| Verification | Medium | 1 hour |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

- No data migration or persisted state rewrite exists.
- Rollback is a source revert of the warning classification and focused test expectations.
<!-- /ANCHOR:l2-rollback -->
