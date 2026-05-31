---
title: "Tasks: Observability + safe model-switch + cold-start timeout"
description: "Implementation task tracker for a read-only /doctor embeddings route and embedder_status surface, a safe model-switch path (allowlist + 404 loadedModel + dim-drift warn), and cold-start timeout alignment with first-embed download docs."
trigger_phrases:
  - "observability model-switch tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/003-observability-model-switch"
    last_updated_at: "2026-05-29T16:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 003 tasks complete; verified + reviewed + fixed; strict validate clean"
    next_safe_action: "Begin phase 004 perf measure-first"
    blockers: []
    key_files:
      - "mcp_server/handlers/embedder-status.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003133"
      session_id: "031-003-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Observability + safe model-switch + cold-start timeout

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
- [x] T001 Confirm predecessor handoff criteria from 002-server-liveness-supervision
- [x] T002 Inventory `embedder_status`, `getProviderInfo`, `loadedModel`, `DEFAULT_READY_TIMEOUT`, `MODEL_LOAD_TIMEOUT`, `CHILD_ENV_ALLOWLIST`
- [x] T003 [P] Identify status-payload + 404-surfacing + dim-drift tests to add
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Extend `embedder_status` with model-server state + provider info (mcp_server/handlers/embedder_status.ts) [REQ-001]
- [x] T005 Add the read-only `embeddings` doctor route, no restart/kill verbs (doctor _routes.yaml) [REQ-002]
- [x] T006 Allowlist `HF_EMBEDDINGS_MODEL`; log resolved model+dim on bind (.opencode/bin/mk-skill-advisor-launcher.cjs) [REQ-003]
- [x] T007 Surface the 404 `loadedModel`; warn on dim drift vs `vec_metadata` (shared/embeddings/providers/hf-local.ts) [REQ-004]
- [x] T008 Align client `DEFAULT_READY_TIMEOUT` with server `MODEL_LOAD_TIMEOUT`; retry while `loading` (shared/embeddings/providers/hf-local.ts, .opencode/bin/hf-model-server.cjs) [REQ-005]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Document first-embed download + health-states table (INSTALL_GUIDE.md, ENV_REFERENCE.md) [REQ-006]
- [x] T010 Confirm the doctor route + status handler perform no lifecycle mutation [REQ-007]
- [x] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All P0 tasks complete
- [x] No `[B]` blocked tasks remaining
- [x] Focused phase tests/static checks are green and successor handoff (004) is documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
