---
title: "Tasks: 027/003/003 Trace Handler"
description: "Task scaffold for the code_graph_trace MCP handler."
trigger_phrases:
  - "027 003 003 tasks"
  - "trace handler tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded trace handler tasks"
    next_safe_action: "Execute handler tasks after local contract publishes"
    blockers:
      - "system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace/001-contract"
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-003-handler-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 027/003/003 Trace Handler

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm local trace contract is published.
- [ ] T002 Read existing code graph handler patterns.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `mcp_server/code_graph/handlers/trace.ts`.
- [ ] T004 Add zod input schema.
- [ ] T005 Reuse code-graph readiness gate.
- [ ] T006 Delegate to `TraceTool`.
- [ ] T007 Register `code_graph_trace` if handler packet owns registration.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add/coordinate handler tests.
- [ ] T009 Run `npm run check`.
- [ ] T010 Run strict child validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Handler validates and delegates.
- [ ] Registration is complete or explicitly handed off.
- [ ] Strict validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
