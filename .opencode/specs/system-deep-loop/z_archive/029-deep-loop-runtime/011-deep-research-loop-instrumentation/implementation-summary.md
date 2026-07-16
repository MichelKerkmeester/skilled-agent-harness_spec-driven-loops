---
title: "Implementation Summary: Deep-Research Loop Instrumentation"
description: "Completed reducer-side inert newInfoRatio warning and RED/GREEN tests."
trigger_phrases:
  - "deep research loop instrumentation summary"
  - "newInfoRatio inertness summary"
  - "novelty_signal_inert summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/011-deep-research-loop-instrumentation"
    last_updated_at: "2026-07-06T17:28:26.224Z"
    last_updated_by: "opencode"
    recent_action: "Ship inert novelty detector instrumentation"
    next_safe_action: "Run strict validation for the instrumentation phase"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
D1-deep-research-loop-instrumentation |
| **Completed** | 2026-07-05 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The reducer now detects the deceptive case where `newInfoRatio` stays flat at a high value across the trend window. Instead of treating that as a buried flatline advisory, it emits `novelty_signal_inert` with warning severity and an explicit note that convergence and not-exhausted claims derived from that signal are untrustworthy.

### File-Line Evidence

| Evidence | Lines | Notes |
|----------|-------|-------|
| Flat-high inert detector and warning payload | `reduce-state.cjs:942-962` | Checks `metric === 'newInfoRatio'` and all recent values `>= 0.9`, then emits `novelty_signal_inert` with warning severity. |
| Warning renderer | `reduce-state.cjs:970-978` | Renders warning events with `WARNING` label. |
| Trend output consumes formatted advisory events | `reduce-state.cjs:2450-2452` | Adds advisory event strings to dashboard trend output. |
| Reducer feeds `newInfoRatio` history into the detector | `reduce-state.cjs:2594-2604` | Builds ratio history from evidence records and assigns `registry.advisoryEvents`. |
| Focused RED/GREEN flat-high test | `deep-research-novelty-inertness.vitest.ts:20-28` | Expects `novelty_signal_inert`, warning severity, untrustworthy note, and rendered `WARNING`. |
| Focused low and varied tests | `deep-research-novelty-inertness.vitest.ts:30-40` | Keeps flat-low as advisory and suppresses varied history. |
| Existing reducer-suite pass evidence | `spec.md:24-25` | Records 16/16 reducer tests passing after the change. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modified before this doc pass | Add inert-novelty warning event and rendering. |
| `.opencode/skills/deep-loop-runtime/tests/unit/deep-research-novelty-inertness.vitest.ts` | Created before this doc pass | Cover flat-high, flat-low, and varied `newInfoRatio` cases. |
| `spec.md` | Existing | Records shipped status and optional stronger follow-up. |
| `plan.md` | Created | Plan and evidence for this phase. |
| `tasks.md` | Created | Completed task ledger. |
| `implementation-summary.md` | Created | Delivered-state summary. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation had already shipped before this documentation pass. This summary records the reducer event path, focused test file, and shipped spec evidence without editing code or tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Ship inert-signal warning instead of deterministic recompute | It closes the deceptive convergence-claim failure with lower blast radius while leaving full deterministic novelty recompute as a documented optional follow-up. |
| Preserve flat-low advisories | A low flatline is legitimate stuck-detection, not the deceptive full-novelty case. |
| Keep tests focused on reducer helpers | The failure was reducer telemetry classification, so direct helper tests prove the behavior without requiring a full research run. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Flat-high `newInfoRatio` warning | Pass | `deep-research-novelty-inertness.vitest.ts:20-28`. |
| Flat-low remains advisory | Pass | `deep-research-novelty-inertness.vitest.ts:30-36`. |
| Varied history emits no flatline event | Pass | `deep-research-novelty-inertness.vitest.ts:38-40`. |
| Existing reducer suite still green | Pass | Shipped spec records 16/16 reducer tests pass at `spec.md:24-25`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-S01 | No runtime behavior outside reducer telemetry | Change is limited to reducer advisory classification and tests | Pass |
| NFR-E01 | Warning text makes the claim boundary explicit | Note says convergence and not-exhausted claims are untrustworthy | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The full deterministic source-novelty recompute remains a stronger follow-up, as recorded in `spec.md:24-25`.
<!-- /ANCHOR:limitations -->
