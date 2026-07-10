---
title: "Tasks: 027/003/004 Trace Tests"
description: "Task scaffold for code_graph_trace Vitest coverage."
trigger_phrases:
  - "027 003 004 tasks"
  - "trace test tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/002-code-graph-trace/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded trace test tasks"
    next_safe_action: "Execute test tasks after local contract publishes"
    blockers:
      - "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/001-contract"
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-004-test-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 027/003/004 Trace Tests

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
- [ ] T002 Locate or build code graph fixture helpers.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `mcp_server/tests/code-graph-trace.vitest.ts`.
- [ ] T004 Add sparse-containment fixtures.
- [ ] T005 Add nested-class fqName regression fixture.
- [ ] T006 Add Phase 001 role-equality test.
- [ ] T007 Add depth-cap truncation test.
- [ ] T008 Add missing-symbol error test.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run `npx vitest run code-graph-trace.vitest.ts --coverage`.
- [ ] T010 Confirm at least 80 percent line coverage for new trace code.
- [ ] T011 Run `npm run check`.
- [ ] T012 Run strict child validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Contract behavior tests pass.
- [ ] Coverage threshold is met.
- [ ] Strict validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
