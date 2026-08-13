---
title: "Tasks: cycle detection"
description: "Tasks for planning and verifying canonical cycle signatures, bounded ledger history, sensitivity thresholds, progress gating, health events, and stopping-clock integration."
trigger_phrases:
  - "cycle detection tasks"
  - "deep-loop fingerprint history tasks"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
    last_updated_at: "2026-07-21T11:31:40Z"
    last_updated_by: "codex"
    recent_action: "Completed cycle-detector defect fixes"
    next_safe_action: "Keep cycle evidence dark until stopping-clock arbitration"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Cycle Detection

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Pin the ledger boundary, projection watermark, reducer versions, and typed claim/focus/progress interfaces used by one cycle observation [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T002 Capture the opaque legacy-authority result and build pinned histories for fixed points, period-two-to-four oscillations, repetition with state churn, and productive revisitation [evidence: validate.sh strict plus vitest 28 tests passed]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Define canonical focus, claim-frontier, composite-state, and progress-vector payloads from one committed watermark [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T004 Implement versioned serialization and byte-stable fingerprinting over sorted stable identities and typed state [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T005 Implement the 12-observation history reducer, eviction-chain hash, resume restoration, and full-replay verification [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T006 Implement period `1..4` matching with three-traversal confirmation and exact start/end cursor traces [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T007 Implement focus/claim repetition suspicion at three occurrences within eight observations [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T008 Implement the progress gate for independent evidence, material claim transitions, contradiction/blocker resolution, and versioned net coverage gain [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T009 Implement transition-authorized, idempotent `cycle_suspected`, `cycle_confirmed`, and `cycle_cleared` events [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T010 Implement the typed stopping-clock contribution adapter with no direct stop authority [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T011 Wire dark detector output beside an opaque legacy-authority result without altering it [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T019 Evaluate every independently qualifying focus and claim repetition candidate while preserving deterministic primary ordering [evidence: co-occurrence and window-shift fixture in vitest 28 tests passed]
- [x] T020 Require a non-null claim-projection watermark and reject null or mismatched values before observation construction [evidence: null and mismatch fixtures in vitest 28 tests passed]
- [x] T021 Measure coverage progress as net end-versus-start gain rather than an interval peak [evidence: transient-blip fixture in vitest 28 tests passed]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify canonical signatures are stable under input reordering, paraphrase/display changes, incremental folding, resume, and full replay [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T013 Verify periods one through four confirm only after three complete traversals and focus/claim repetition observes the three-in-eight threshold [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T014 Verify every qualifying progress category prevents or clears degeneration while missing or inconsistent progress returns `not_evaluable` [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T015 Verify gaps, stale watermarks, non-monotonic cursors, conflicting fingerprints, unsupported versions, and incomplete periods fail closed [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T016 Verify health events are authorized, idempotent, complete, and replayable; conflicting reuse is rejected [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T017 Verify confirmed cycle health reaches sibling stopping-clock input without independently producing `STOP_ALLOWED` [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T018 Verify shadow execution returns the opaque authoritative object unchanged and no detector module imports `convergence.cjs` [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] T022 Verify co-occurring focus and claim cycles both report at the closing iteration before the claim occurrence falls out of the next window [evidence: vitest 28 tests passed]
- [x] T023 Verify null and mismatched required claim-projection watermarks fail closed with typed errors [evidence: vitest 28 tests passed]
- [x] T024 Verify a transient coverage peak that regresses to baseline does not clear a cycle [evidence: vitest 28 tests passed]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] All requirements in spec.md met with evidence [evidence: validate.sh strict plus vitest 28 tests passed]
- [x] Phase gate green: 28 unit tests and TypeScript compilation pass; strict packet validation is the final gate [evidence: validate.sh strict plus vitest 28 tests passed]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
