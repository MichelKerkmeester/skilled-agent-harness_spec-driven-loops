---
title: "Tasks: 003 Handler"
description: "Task list for the code_graph_hld_lld handler and tool wiring."
trigger_phrases:
  - "027 phase 002 handler tasks"
  - "code_graph_hld_lld handler tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded handler tasks"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-003-handler-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: 003 Handler

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

- [ ] T001 Confirm `001-contract` exports are available.
- [ ] T002 Inspect existing context handler readiness pattern.
- [ ] T003 Decide whether omni remains in scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `mcp_server/code_graph/handlers/hld-lld.ts`.
- [ ] T005 Add handler input validation.
- [ ] T006 Reuse readiness gate behavior.
- [ ] T007 Register `code_graph_hld_lld` in `code-graph-tools.ts`.
- [ ] T008 If omni remains, update QueryMode, ContextResult, handler parsing, and serialized JSON together.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run handler integration tests from child 004.
- [ ] T010 Run typecheck.
- [ ] T011 Run strict validation for this child.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Tool is registered and handler dispatches.
- [ ] Malformed inputs return structured errors.
- [ ] Omni is fully wired or removed from scope.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Contract**: `../001-contract/spec.md`
<!-- /ANCHOR:cross-refs -->
