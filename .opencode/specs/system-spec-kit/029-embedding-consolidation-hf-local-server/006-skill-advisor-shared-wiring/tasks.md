---
title: "Tasks: Wire skill-advisor to the shared hf model server"
description: "Implementation task tracker for Point skill-advisor's semantic embedding lane at the shared hf model-server socket, add cross-launcher respawn-lock coverage, and document new HF_EMBED_SERVER env and troubleshooting contracts."
trigger_phrases:
  - "skill-advisor shared wiring tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-embedding-consolidation-hf-local-server/006-skill-advisor-shared-wiring"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deferred tasks for skill-advisor shared model-server wiring"
    next_safe_action: "Implement after sidecar retirement and shared server routing are stable"
    blockers: []
    key_files:
      - "system-skill-advisor/mcp_server/lib/embedders/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000496"
      session_id: "029-006-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Wire skill-advisor to the shared hf model server

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

- [ ] T001 Confirm predecessor handoff criteria from 005-retire-sidecar
- [ ] T002 Inventory affected files and symbols before implementation
- [ ] T003 [P] Identify focused tests to add or migrate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Wire skill-advisor semantic embeddings to the shared model-server URL/socket [REQ-001]
- [ ] T005 Add absent-mk-spec-memory cross-launcher respawn-lock coverage [REQ-002]
- [ ] T006 Update ENV_REFERENCE.md with new server envs and deprecated sidecar envs [REQ-003]
- [ ] T007 Document single-resident-model and 404 fallback behavior [REQ-004]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T08 Add troubleshooting notes for health states [REQ-005]
- [ ] T09 Verify multi-consumer load-once behavior [REQ-006]
- [ ] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks complete
- [ ] No `[B]` blocked tasks remaining
- [ ] Focused phase tests/static checks are green and predecessor/successor handoff is documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

