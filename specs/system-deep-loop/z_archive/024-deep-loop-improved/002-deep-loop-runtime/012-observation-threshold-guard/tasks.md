---
title: "Tasks: Phase 12: Observation Threshold Guard"
description: "Completed task ledger for the convergence min_observations actionability guard."
trigger_phrases:
  - "observation threshold guard"
  - "convergence min observations"
  - "single-observation premature stop"
  - "convergence actionability boundary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/012-observation-threshold-guard"
    last_updated_at: "2026-07-01T21:42:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed observation-threshold ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped convergence threshold guard"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/coverage-graph-signals.ts"
    session_dedup:
      fingerprint: "sha256:012b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6d9"
      session_id: "scaffold-content-remediation-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: Observation Threshold Guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the shipped phase spec and confirm the implementation scope is `convergence.cjs` and `coverage-graph-signals.ts`.
- [x] T002 Confirm `min_observations` default is 2 and clamped to 1-10.
- [x] T003 Confirm full backlog lifecycle tracking and cross-mode parity are out of scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Wire `min_observations` config read into `convergence.cjs`.
- [x] T005 Block STOP decisions until the leading finding reaches the configured observation threshold.
- [x] T006 Block promotion triggers until the leading finding reaches the configured observation threshold.
- [x] T007 Persist sub-threshold findings with `subThreshold: true` instead of discarding them.
- [x] T008 Add `min_observations` to `coverage-graph-signals.ts` signal read output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify config `min_observations: 3` blocks STOP with two observations and allows it on the third.
- [x] T010 Verify default `min_observations: 2` blocks a one-observation STOP and allows a second confirmation.
- [x] T011 Verify `min_observations: 1` restores prior single-observation actionability.
- [x] T012 Verify blocked findings appear in convergence state with `subThreshold: true`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the spec.md acceptance criteria.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
