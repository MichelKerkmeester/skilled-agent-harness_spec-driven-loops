---
title: "Tasks: 003 Fixtures"
description: "Task list for labeled eval fixtures."
trigger_phrases:
  - "027 006 003 tasks"
  - "fixtures tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval/003-fixtures"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 tasks.md"
    next_safe_action: "Implement Fixtures work when dependencies are ready"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-003-fixtures"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 003 Fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm fixture schema from child 001 [15m]
- [ ] T002 Select candidate task surfaces [30m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `mcp_server/scripts/dist/eval/tasks/labeled-tasks.jsonl` [90m]
- [ ] T004 Add fixture schema README if needed [20m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Parse JSONL and validate row schema [20m]
- [ ] T006 Verify expected file paths [20m]
- [ ] T007 Run strict validation for this child packet [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] JSONL has 12-20 valid tasks.
- [ ] Every task has expected file and keyword labels.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->

