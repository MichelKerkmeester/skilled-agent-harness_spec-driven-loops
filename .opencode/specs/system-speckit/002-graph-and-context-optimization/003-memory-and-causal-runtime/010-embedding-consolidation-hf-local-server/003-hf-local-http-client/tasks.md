---
title: "Tasks: Rewrite hf-local as an HTTP model-server client"
description: "Implementation task tracker for Replace the in-process hf-local pipeline body with an ollama-shaped HTTP/socket client that keeps public provider APIs, client-side prefixes, readiness retry, and runtime dimension adoption."
trigger_phrases:
  - "hf-local HTTP client tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/003-hf-local-http-client"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deferred tasks for rewriting hf-local as an HTTP client"
    next_safe_action: "Implement after hf-model-server endpoint contract is available"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000493"
      session_id: "029-003-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rewrite hf-local as an HTTP model-server client

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

- [x] T001 Confirm predecessor handoff criteria from 002-hf-model-server
- [x] T002 Inventory affected files and symbols before implementation
- [x] T003 [P] Identify focused tests to add or migrate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Copy the relevant ollama client helpers into the hf-local shape [REQ-001]
- [x] T005 Resolve socket/tcp base URL from HF_EMBED_SERVER_URL and defaults [REQ-002]
- [x] T006 Keep client-side prefix and dtype/profile metadata behavior [REQ-003]
- [x] T007 Implement readiness retry for connect errors and loading states [REQ-004]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T08 Adopt server-reported dim and preserve length assertions [REQ-005]
- [x] T09 Add tests for prefixes, readiness, dim adoption, 404, and factory stability [REQ-006]
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

