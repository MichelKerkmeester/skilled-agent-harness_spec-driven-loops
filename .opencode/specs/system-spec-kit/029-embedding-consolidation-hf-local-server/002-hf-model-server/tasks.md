---
title: "Tasks: Build hf-model-server.cjs local HTTP model server"
description: "Implementation task tracker for Add a hand-written CommonJS local HTTP/UDS model server that wraps the existing transformers load path and exposes ollama-shaped /api/embed plus /api/health endpoints."
trigger_phrases:
  - "hf-model-server tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-embedding-consolidation-hf-local-server/002-hf-model-server"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deferred tasks for the hf-model-server HTTP/UDS service"
    next_safe_action: "Implement hf-model-server.cjs after phase 001 lands"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000492"
      session_id: "029-002-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Build hf-model-server.cjs local HTTP model server

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

- [x] T001 Confirm predecessor handoff criteria from 001-nomic-only-consolidation
- [x] T002 Inventory affected files and symbols before implementation
- [x] T003 [P] Identify focused tests to add or migrate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the hand-written CJS server entrypoint and argument/env parsing [REQ-001]
- [x] T005 Relocate existing transformers load logic into the server without algorithm changes [REQ-002]
- [x] T006 Bind the HTTP listener before model load resolves and implement /api/health [REQ-003]
- [x] T007 Implement /api/embed with loadingPromise await, runtime dim derivation, and batch response shape [REQ-004]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T08 Add UDS and tcp transport coverage [REQ-005]
- [x] T09 Add single-session dispose assertion and self-warm coverage [REQ-006]
- [x] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks complete
- [x] No `[B]` blocked tasks remaining
- [x] Focused phase tests/static checks are green and predecessor/successor handoff is documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

