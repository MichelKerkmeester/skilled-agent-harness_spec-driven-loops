---
title: "Implementation Summary"
description: "The churn detector now keeps a running total of newly dirty out-of-lineage paths across heartbeats, so a neighbour that dirties one path per heartbeat trips it where the per-window count never could."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/005-churn-cumulative-arm"
    last_updated_at: "2026-09-14T13:30:00Z"
    last_updated_by: "deepseek-v4.1-flash-max"
    recent_action: "Added the cumulative churn arm and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-005-churn-cumulative-arm"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-churn-cumulative-arm |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The shared-checkout churn detector now counts the whole lane's drift, not one window of it. `startSharedCheckoutChurnDetector` in `runtime/scripts/fanout-run.cjs` accumulates the paths that turned dirty since the previous heartbeat and trips when that total passes `containment.churnCumulativeThreshold` — non-negative integer, default 12, zero disarming the arm. The per-window trip is unchanged and computed from the same sample, so a burst still detects inside a single window. The `shared_checkout_detected` event keeps `newly_dirty_paths` and `churn_threshold` and gains `cumulative_dirty_paths` and `churn_cumulative_threshold`; both counts are reported whichever arm fired. A detection still latches preserve for the remainder of the run and stops sampling.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi, for this phase alone. The two new test cases were written and run first: both failed against the burst-only detector (`expected [] to have a length of 1 but got +0`, and `expected undefined to be 12` for the config field). The detector, the config field and the runner plumbing landed next, and the two touched test files plus the runtime typecheck were rerun from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Zero disarms each arm separately | A caller who wants one arm and not the other can say so; both at zero still stops sampling entirely |
| The running total counts a path again once it leaves the sample and returns | That is churn; a writer who keeps touching paths is what the arm exists to see |
| Both counts reported whichever arm fired | A burst that pre-empts the total still says how far the total had come, with no second sample needed |
| No CLI flag | No flag exists for the per-window threshold either, so the config route is mirrored instead of extended |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline of both touched files before any edit | PASS, exit 0, 235 tests |
| Two new cases against the unmodified detector | FAIL as expected: `expected [] to have a length of 1 but got +0`; `expected undefined to be 12` |
| `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts tests/unit/executor-config.vitest.ts` | PASS, exit 0, 2 files, 237 tests |
| `npm run typecheck` in the runtime | PASS, exit 0 |
| Standalone run of the cumulative fixture, reading the ledger | One `shared_checkout_detected` with `newly_dirty_paths: 1`, `cumulative_dirty_paths: 4`, `churn_cumulative_threshold: 3`, `churn_threshold: 3`; all six tracked files kept the stub's bytes under a requested restore |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The parent packet's numbers differ from what ships.** The parent's REQ-004 and plan name twelve paths per window and forty cumulative; the code has shipped a per-window default of three since the detector landed, and this phase's directive fixed the cumulative default at twelve. Reconciling the parent text is outside this phase's write authority.
2. **`churnThreshold: 0` narrowed.** It used to disable the detector outright; it now disarms only the per-window arm, leaving the cumulative arm sampling. Zero on both thresholds is still a no-op sampler.
3. **The integration case asserts a bound, not an exact per-window count.** The cumulative case asserts the observed `newly_dirty_paths` stayed at or below the per-window threshold across a jittery heartbeat, which is what makes the event attributable to the cumulative arm; the exact window contents depend on sample timing.
<!-- /ANCHOR:limitations -->

---

