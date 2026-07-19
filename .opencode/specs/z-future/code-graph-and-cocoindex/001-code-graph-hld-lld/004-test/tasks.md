---
title: "Tasks: 004 Tests"
description: "Task list for the code-graph-hld-lld Vitest suite."
trigger_phrases:
  - "027 phase 002 test tasks"
  - "code graph hld lld vitest tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/001-code-graph-hld-lld/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded test tasks"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-004-test-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: 004 Tests

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
- [ ] T002 Build DB-like fixture helpers.
- [ ] T003 Confirm handler and omni scope with child 003.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `mcp_server/tests/code-graph-hld-lld.vitest.ts`.
- [ ] T005 Add deterministic-order fixture with 1000+ symbols and 100+ repeated calls.
- [ ] T006 Add dangling-edge fixture.
- [ ] T007 Add primary-module-selection fixture.
- [ ] T008 Add classifier equality fixture.
- [ ] T009 Add baseline role fixtures.
- [ ] T010 Add layer tier fixtures.
- [ ] T011 Add JSON serialization fixture.
- [ ] T012 Add handler JSON parse integration fixture if omni remains.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run `npx vitest run code-graph-hld-lld.vitest.ts --coverage`.
- [ ] T014 Confirm at least 80 percent line coverage for new code.
- [ ] T015 Run `npm run check`.
- [ ] T016 Run strict validation for this child.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Determinism, dangling-edge, primary-module, classifier, and serialization fixtures pass.
- [ ] Handler integration coverage passes where in scope.
- [ ] Strict validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Contract**: `../001-contract/spec.md`
<!-- /ANCHOR:cross-refs -->
