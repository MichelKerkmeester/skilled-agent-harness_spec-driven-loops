---
title: "Tasks: Phase 13: Coverage Graph Time Decay"
description: "Completed task ledger for coverage graph signal time-decay weighting."
trigger_phrases:
  - "coverage-graph time-decay"
  - "signal decay weighting"
  - "stale convergence signal"
  - "decay-days configuration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/013-coverage-graph-time-decay"
    last_updated_at: "2026-07-01T21:44:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed coverage-decay ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped coverage graph time-decay weighting"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts"
    session_dedup:
      fingerprint: "sha256:013b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6e0"
      session_id: "scaffold-content-remediation-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: Coverage Graph Time Decay

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

- [x] T001 Read the shipped phase spec and confirm `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` is the only implementation file in scope.
- [x] T002 Inspect the existing signal-ranking math before adding the decay multiplier.
- [x] T003 Confirm historical coverage raw counts must remain unchanged.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `timeDecayWeight(createdAt, decayDays, now)` returning `0.5^(ageDays/decayDays)`.
- [x] T005 Return `1.0` when `decayDays=0` to disable decay by default.
- [x] T006 Wire `timeDecayWeight` into existing signal ranking math.
- [x] T007 Enforce a safe minimum decay window when decay is enabled.
- [x] T008 Preserve raw coverage count fields and apply decay only to actionability/ranking weight.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify `decayDays=0` returns `1.0` and default rankings match pre-patch output.
- [x] T010 Verify `decayDays=30` and age 30 days returns `0.5`.
- [x] T011 Verify `decayDays=30` and age 60 days returns `0.25`.
- [x] T012 Verify raw coverage counts remain unchanged in persisted state.
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
