---
title: "Tasks: 001 Harness Skeleton"
description: "Task list for the code graph adoption eval CLI skeleton."
trigger_phrases:
  - "027 006 001 tasks"
  - "harness skeleton tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-code-graph-adoption-eval/001-harness-skeleton"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 tasks.md"
    next_safe_action: "Implement Harness Skeleton work when dependencies are ready"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-001-harness-skeleton"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 001 Harness Skeleton

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

- [ ] T001 Inspect existing eval script layout [15m]
- [ ] T002 Define CLI options and defaults [20m]
- [ ] T003 Define result row minimum contract [20m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `mcp_server/scripts/dist/eval/code-graph-adoption-eval.js` [60m]
- [ ] T005 Add module-loader functions for token, fixture, and report helpers [30m]
- [ ] T006 Add dry-run matrix builder [30m]
- [ ] T007 Add guarded output directory setup [20m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run targeted syntax check for the CLI [10m]
- [ ] T009 Run strict validation for this child packet [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] CLI dry-run constructs baseline and after rows.
- [ ] Loader seams are stable enough for children 002, 003, and 004.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->

