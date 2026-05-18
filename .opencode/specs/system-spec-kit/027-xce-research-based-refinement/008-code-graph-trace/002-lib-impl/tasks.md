---
title: "Tasks: 027/003/002 Trace Library"
description: "Task scaffold for the code_graph_trace resolver implementation."
trigger_phrases:
  - "027 003 002 tasks"
  - "trace library tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded trace library tasks"
    next_safe_action: "Execute resolver tasks after dependencies merge"
    blockers:
      - "system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace/001-contract"
      - "system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/002-lib-impl"
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-002-lib-impl-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 027/003/002 Trace Library

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
- [ ] T002 Confirm upstream Phase 002 classifier implementation is merged.
- [ ] T003 Locate existing code graph DB helper APIs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `mcp_server/code_graph/lib/code-graph-trace.ts`.
- [ ] T005 Implement `traceSymbol` using `CodeNode.filePath` for file ownership.
- [ ] T006 Implement file-path-derived module policy.
- [ ] T007 Add optional CONTAINS/fqName display ancestry.
- [ ] T008 Implement nested-class fqName prefix matching.
- [ ] T009 Delegate architectural-role lookup to Phase 002.
- [ ] T010 Implement depth cap and missing-symbol error shape.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Coordinate sparse-containment tests with `004-test`.
- [ ] T012 Run `npm run check`.
- [ ] T013 Run strict child validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Resolver conforms to contract.
- [ ] FilePath is the ownership truth.
- [ ] Phase 002 role equality is verified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
