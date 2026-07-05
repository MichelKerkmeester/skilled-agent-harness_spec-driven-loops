---
title: "Implementation Summary: Phase 18: fanout-stopreason-tolerance"
description: "The fan-out max-iterations policy validator now accepts any formatting variant of the max-iterations stop reason on a completed lineage, while still rejecting genuinely different outcomes, fixing the false failure that flagged a full 10-iteration cli-opencode review lineage."
trigger_phrases:
  - "fanout stopreason tolerance implemented"
  - "isMaxIterationsStopReason helper"
  - "fanout false-failure fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/003-guard-and-enforcement/004-fanout-stopreason-tolerance"
    last_updated_at: "2026-07-04T10:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Landed tolerant stop-reason check with mutation-proved test"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-phase-018-fanout-stopreason-tolerance-20260704"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-fanout-stopreason-tolerance |
| **Status** | Complete |
| **Completed** | 2026-07-04 |
| **Level** | 1 |
| **completion_pct** | 100 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The fan-out max-iterations policy validator no longer fails a completed review lineage over the exact spelling of its synthesis stop reason. A new pure helper judges the stop-reason family, and the validator uses it in place of a strict string equality.

### The Fix

`findMaxIterationsPolicyViolation` in `fanout-run.cjs` previously required `synthesis.stopReason === 'maxIterationsReached'` exactly. Because the synthesis event is written by the lineage's model, a semantically-correct value such as `max-iterations (10/10)` failed the check even though the same function had already confirmed the lineage ran every iteration. The branch now calls `isMaxIterationsStopReason`, which lowercases the reason, strips non-alphabetic characters, and matches the `maxiteration` prefix. That folds `maxIterationsReached`, `max-iterations (10/10)`, `maxIterations`, and `max_iterations_reached` into a single accepted family while leaving `converged`, `manualStop`, `error`, and `userPaused` rejected.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Added `isMaxIterationsStopReason`, routed the validator through it, exported both the helper and `findMaxIterationsPolicyViolation`. |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | Added a describe block covering the tolerated family, the rejected set, and the end-to-end validator behavior. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly (a pure helper plus one call-site swap in correctness-critical shared runtime infrastructure), then mutation-proved: restoring the strict equality made the end-to-end tolerance test fail, and the tolerant check returned it to green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Loosen the consumer, not tighten the producer | The lineage's model output cannot be forced to a canonical string; the harness is the reliable place to normalize. |
| Anchor the match with a `maxiteration` prefix | Keeps the family tolerance narrow so a genuinely different outcome still fails, backed by the iteration-count check that already runs first. |
| Export the validator too, not just the helper | Lets the test pin the real end-to-end behavior (a synthetic 10-iteration state with a variant reason), not only the pure predicate. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline vitest | PASS: `tests/unit/fanout-run.vitest.ts` 42 passed before the change. |
| Mutation proof (RED) | PASS: with the strict check restored, `does not fail a completed lineage whose stopReason is a non-canonical max-iterations variant` failed (1 failed / 3 passed / 42 skipped). |
| Final vitest (GREEN) | PASS: `tests/unit/fanout-run.vitest.ts` 46 passed, delta +4. |
| Sibling importers | PASS: `observability-events`, `workflow-session-id-parity`, `lineage-timestamp-window` = 3 files / 9 tests passed. |
| Syntax | PASS: `node --check fanout-run.cjs` produced no output. |
| Comment hygiene | PASS: `check-comment-hygiene.sh` produced no output. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Producer still writes free-form reasons.** This fix makes the consumer tolerant; it does not force lineages to emit the canonical `maxIterationsReached`. That is intentional, since the model-written value cannot be guaranteed and the iteration-count check remains the authoritative completeness signal.
2. **Generated metadata refreshed post-implementation.** description.json and graph-metadata.json for this phase and the parent packet were regenerated after the code change; strict validation reports Errors: 0.
<!-- /ANCHOR:limitations -->
