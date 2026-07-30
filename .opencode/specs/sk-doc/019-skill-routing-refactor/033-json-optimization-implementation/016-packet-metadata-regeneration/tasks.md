---
title: "Task Breakdown: Packet Metadata Regeneration"
description: "Tasks for packet metadata regeneration."
trigger_phrases:
  - "metadata regeneration task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/016-packet-metadata-regeneration"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/016-packet-metadata-regeneration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Packet Metadata Regeneration

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Commit the packet so the generator pass is fully revertible
- [ ] T-02 Confirm the upstream honesty phase has established which completion state is truthful
- [ ] T-03 Examine the frontmatter errors on the affected children and attribute them to a cause
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-04 Run the close-time metadata generator across the packet and its children
- [ ] T-05 Confirm the pass resolved the phase map, continuity blocks, derived status and fingerprints together
- [ ] T-06 List explicitly any residue the generator could not fix rather than hand-patching it quietly
- [ ] T-07 Make the phase map unambiguous about whether its status column means planning or execution state
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-08 Diff the result and confirm only derived and metadata fields changed
- [ ] T-09 Confirm the generated-metadata integrity check passes across every folder
- [ ] T-10 Confirm the propagated status matches the reconciled truth, not an assumed Complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

One generator pass resolves all four symptoms; propagated status matches the reconciled truth rather than an assumed Complete; the generated-metadata integrity check passes across every folder; the frontmatter errors are attributed to a cause; and a diff review confirms no authored content was overwritten.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
