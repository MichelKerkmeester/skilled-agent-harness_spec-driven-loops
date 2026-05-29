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
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 task tracker for observability + safe model-switch + cold-start timeout"
    next_safe_action: "Implement phase 003"
    blockers: []
    key_files:
      - "mcp_server/handlers/embedder_status.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003133"
      session_id: "031-003-tasks"
      parent_session_id: null
    completion_pct: 0
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
- [ ] T001 Confirm predecessor handoff criteria from 002-server-liveness-supervision
- [ ] T002 Inventory `embedder_status`, `getProviderInfo`, `loadedModel`, `DEFAULT_READY_TIMEOUT`, `MODEL_LOAD_TIMEOUT`, `CHILD_ENV_ALLOWLIST`
- [ ] T003 [P] Identify status-payload + 404-surfacing + dim-drift tests to add
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 Extend `embedder_status` with model-server state + provider info (mcp_server/handlers/embedder_status.ts) [REQ-001]
- [ ] T005 Add the read-only `embeddings` doctor route, no restart/kill verbs (doctor _routes.yaml) [REQ-002]
- [ ] T006 Allowlist `HF_EMBEDDINGS_MODEL`; log resolved model+dim on bind (.opencode/bin/mk-skill-advisor-launcher.cjs) [REQ-003]
- [ ] T007 Surface the 404 `loadedModel`; warn on dim drift vs `vec_metadata` (shared/embeddings/providers/hf-local.ts) [REQ-004]
- [ ] T008 Align client `DEFAULT_READY_TIMEOUT` with server `MODEL_LOAD_TIMEOUT`; retry while `loading` (shared/embeddings/providers/hf-local.ts, .opencode/bin/hf-model-server.cjs) [REQ-005]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T009 Document first-embed download + health-states table (INSTALL_GUIDE.md, ENV_REFERENCE.md) [REQ-006]
- [ ] T010 Confirm the doctor route + status handler perform no lifecycle mutation [REQ-007]
- [ ] T099 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P0 tasks complete
- [ ] No `[B]` blocked tasks remaining
- [ ] Focused phase tests/static checks are green and successor handoff (004) is documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
