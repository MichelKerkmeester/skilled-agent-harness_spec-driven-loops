---
title: "Task Breakdown: Authority Path and Contract Corrections"
description: "Tasks for authority path and contract corrections."
trigger_phrases:
  - "authority corrections task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/017-authority-path-corrections"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/017-authority-path-corrections"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Task Breakdown: Authority Path and Contract Corrections

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Confirm the dead citations appear in spec-folder metadata only, and not in any skill-root metadata
- [ ] T-02 Enumerate every occurrence across the packet's documents and metadata
- [ ] T-03 Confirm the command-metadata reversal is documented as deliberate in the sibling packet
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-04 Correct every dead citation to a path that exists on disk, leaving historical evidence blocks untouched
- [ ] T-05 Update the contract document to match the implementing module, referencing the deciding packet
- [ ] T-06 Label, relocate or untrack the scratch artifact per operator preference
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-07 Confirm a search for the dead path returns no occurrences and every corrected path resolves
- [ ] T-08 Confirm the contract document and implementing module agree
- [ ] T-09 Record the schema-conflation correction durably in the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

No dead citation remains and every corrected path resolves on disk; the contract document and the implementing module agree with the deciding packet referenced; the scratch artifact cannot be mistaken for live state; and the schema-conflation correction is written where a future reader will find it.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
