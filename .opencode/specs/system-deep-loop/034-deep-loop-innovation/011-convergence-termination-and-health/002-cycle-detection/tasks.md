---
title: "Tasks: cycle detection"
description: "Tasks for planning and verifying canonical cycle signatures, bounded ledger history, sensitivity thresholds, progress gating, health events, and stopping-clock integration."
trigger_phrases:
  - "cycle detection tasks"
  - "deep-loop fingerprint history tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
    last_updated_at: "2026-07-15T15:19:57Z"
    last_updated_by: "codex"
    recent_action: "Mapped cycle signatures, thresholds, progress gates, and replay checks into tasks"
    next_safe_action: "Build canonical observation fixtures and implement the bounded history reducer"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Cycle Detection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin the ledger boundary, projection watermark, reducer versions, and typed claim/focus/progress interfaces used by one cycle observation
- [ ] T002 Capture legacy council convergence output and build pinned histories for fixed points, period-two-to-four oscillations, repetition with state churn, and productive revisitation
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Define canonical focus, claim-frontier, composite-state, and progress-vector payloads from one committed watermark
- [ ] T004 Implement versioned serialization and byte-stable fingerprinting over sorted stable identities and typed state
- [ ] T005 Implement the 12-observation history reducer, eviction-chain hash, resume restoration, and full-replay verification
- [ ] T006 Implement period `1..4` matching with three-traversal confirmation and exact start/end cursor traces
- [ ] T007 Implement focus/claim repetition suspicion at three occurrences within eight observations
- [ ] T008 Implement the progress gate for independent evidence, material claim transitions, contradiction/blocker resolution, and versioned coverage gain
- [ ] T009 Implement transition-authorized, idempotent `cycle_suspected`, `cycle_confirmed`, and `cycle_cleared` events
- [ ] T010 Implement the typed stopping-clock contribution adapter with no direct stop authority
- [ ] T011 Wire dark detector output beside shipped council convergence without altering legacy decisions or snapshot behavior
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify canonical signatures are stable under input reordering, paraphrase/display changes, incremental folding, resume, and full replay
- [ ] T013 Verify periods one through four confirm only after three complete traversals and focus/claim repetition observes the three-in-eight threshold
- [ ] T014 Verify every qualifying progress category prevents or clears degeneration while missing or inconsistent progress returns `not_evaluable`
- [ ] T015 Verify gaps, stale watermarks, non-monotonic cursors, conflicting fingerprints, unsupported versions, and incomplete periods fail closed
- [ ] T016 Verify health events are authorized, idempotent, complete, and replayable; conflicting reuse is rejected
- [ ] T017 Verify confirmed cycle health reaches sibling stopping-clock input without independently producing `STOP_ALLOWED`
- [ ] T018 Verify shadow execution leaves `.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs` decisions and current authority unchanged
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
