---
title: "Tasks: Advisor BFS consolidation"
description: "Completed task list for the behavior-preserving advisor skill-graph BFS extraction."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/007-advisor-bfs-consolidation"
    last_updated_at: "2026-06-10T23:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed BFS helper extraction, call-site cutovers, parity tests, and verification"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/bfs-traversal.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-queries.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-bfs-traversal.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-queries-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-advisor-bfs-consolidation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Advisor BFS Consolidation

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

- [x] T001 Read scaffold and target implementation files before edits
- [x] T002 Identify current `transitivePath` and `subgraph` BFS semantics
- [x] T003 [P] Confirm local advisor test/build commands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create advisor-local BFS helper with shared depth clamp, visited set, path match, and truncation metadata
- [x] T005 Cut over `transitivePath` to use the helper without changing returned path shape
- [x] T006 Cut over `subgraph` to use the helper without changing returned graph shape
- [x] T007 Add helper tests for caps, visited semantics, truncation, and queue order
- [x] T008 Add parity tests comparing new query outputs to legacy traversal behavior
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `npm run typecheck`
- [x] T010 Run `npm run build`
- [x] T011 Run new helper and parity vitest files
- [x] T012 Run existing skill-graph-focused vitest suites
- [x] T013 Run alignment and comment-hygiene checks
- [x] T014 Update phase documentation and continuity metadata
- [x] T015 Run full advisor vitest suite and confirm only the known hook parity file fails
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Automated verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
