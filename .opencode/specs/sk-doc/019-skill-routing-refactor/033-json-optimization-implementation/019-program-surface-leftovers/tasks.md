---
title: "Task Breakdown: Program-Surface Leftovers"
description: "Tasks for program-surface leftovers."
trigger_phrases:
  - "program leftovers task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/019-program-surface-leftovers"
    last_updated_at: "2026-07-30T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase docs"
    next_safe_action: "Begin execution per plan.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/019-program-surface-leftovers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Program-Surface Leftovers

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Confirm each of the four findings still reproduces against the current tree
- [ ] T-02 Search for callers of the deprecated derived-sync writer to decide deletion versus documentation
- [ ] T-03 Read the live mode registry to establish the real mode-to-packet relationship
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-04 Declare an explicit least-privilege token grant on the routing workflow
- [ ] T-05 Correct the feature catalog's mode-versus-packet framing and any count that implied one-to-one
- [ ] T-06 Delete the deprecated writer if no caller reaches it, otherwise document accurately what it honours
- [ ] T-07 Amend the requirement wording so it matches where the baseline capture actually sits
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-08 Confirm a CI run passes under the narrowed permission grant
- [ ] T-09 Confirm the catalog matches the live mode registry
- [ ] T-10 Re-read the parent spec and confirm no requirement still contradicts the phase map
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The workflow declares explicit permissions and still passes CI under them; the feature catalog describes the real mode-to-packet relationship; the deprecated writer is gone or accurately documented with the caller search recorded; the requirement wording agrees with the phase map; and each fix carries a verification specific to it.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
