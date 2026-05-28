---
title: "Tasks: 002 Library Implementation"
description: "Task list for deterministic HLD/LLD generator implementation."
trigger_phrases:
  - "027 phase 002 lib impl tasks"
  - "code graph hld lld implementation tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded library tasks"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-002-lib-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: 002 Library Implementation

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
- [ ] T002 Choose and document dangling-edge policy.
- [ ] T003 Define constants for caps, role priority, and fan-in threshold.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `mcp_server/code_graph/lib/code-graph-hld-lld.ts`.
- [ ] T005 Implement stable sort helper before capped collections.
- [ ] T006 Implement `classifyFileRole(filePath, db)`.
- [ ] T007 Implement `generateHLD(filePath, db)`.
- [ ] T008 Implement `generateLLD(symbolId, db)`.
- [ ] T009 Implement `generateFileNarrative(filePath, db)`.
- [ ] T010 Implement primary module selection.
- [ ] T011 Implement layer classification.
- [ ] T012 Implement complexity hints.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run generator unit tests from child 004.
- [ ] T014 Run typecheck.
- [ ] T015 Run strict validation for this child.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] HLD/LLD outputs are deterministic and serializable.
- [ ] `classifyFileRole` equals HLD `file_role`.
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
