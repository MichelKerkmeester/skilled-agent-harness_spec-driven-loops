---
title: "Tasks: 001 Contract"
description: "Task list for the HLD/LLD TypeScript contract child."
trigger_phrases:
  - "027 phase 002 contract tasks"
  - "hld lld contract tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/001-contract"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded contract tasks"
    next_safe_action: "Implement contract exports"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-001-contract-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: 001 Contract

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

- [ ] T001 Review parent audit constraints (`../spec.md`).
- [ ] T002 Define open-string role contract and required baseline labels.
- [ ] T003 Define unresolved-edge policy shape.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create contract exports (`mcp_server/code_graph/lib/code-graph-hld-lld.ts`).
- [ ] T005 Export `HldLldClassifier`.
- [ ] T006 Export `FileRole` enum.
- [ ] T007 Export HLD, LLD, dependency, unresolved dependency, complexity, and file narrative types.
- [ ] T008 Export `classifyFileRole(filePath, db)` signature.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm children 002, 003, and 004 can depend on this contract.
- [ ] T010 Run strict validation for this child.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Contract exports are importable.
- [ ] No private implementation details are required by children.
- [ ] Strict validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
