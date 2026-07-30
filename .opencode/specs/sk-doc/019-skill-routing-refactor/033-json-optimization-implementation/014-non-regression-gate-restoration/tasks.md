---
title: "Task Breakdown: Restore and Wire the Non-Regression Gate"
description: "Tasks for restore and wire the non-regression gate."
trigger_phrases:
  - "gate restoration task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/014-non-regression-gate-restoration"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/014-non-regression-gate-restoration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Restore and Wire the Non-Regression Gate

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Record the ratchet's current failure modes and confirm no workflow references it
- [ ] T-02 Determine which failures are corpus-pin drift and which are genuine metric movement
- [ ] T-03 Decide whether the review bucket reaches its minimum by adding prompts or by changing the minimum
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-04 Set the ratchet baseline from the upstream disposition, never from a blind regeneration
- [ ] T-05 Resolve the corpus hash pin, recording the previous hashes so a corpus change stays distinguishable from a scorer change
- [ ] T-06 Resolve the review bucket condition per the decision above
- [ ] T-07 Add the ratchet suite to the routing workflow alongside the existing suites
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-08 Confirm the ratchet passes locally before the wiring lands, never as a standalone red commit
- [ ] T-09 Confirm a real CI run fails when the ratchet fails
- [ ] T-10 Introduce a deliberate routing mutation, observe the gate fail, record the output, and revert
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The ratchet passes 7 of 7; the corpus hash pin matches live with prior hashes recorded; the review bucket meets its minimum or the minimum changes with written rationale; a real CI run shows the job failing when the ratchet fails; a deliberate mutation is observed to trip the gate; and both declared floors keep their current values.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
