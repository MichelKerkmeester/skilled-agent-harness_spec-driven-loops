---
title: "Tasks: Phase 6: codegraph-tombstone-audit"
description: "Completed task list for bounded default-off code-graph tombstone audit lineage."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit"
    last_updated_at: "2026-06-10T23:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed tombstone audit implementation and verification"
    next_safe_action: "No implementation action remains"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/scan.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/status.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-codegraph-tombstone-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: codegraph-tombstone-audit

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

- [x] T001 Reuse existing code-graph MCP server structure and temp DB test harness
- [x] T002 Confirm no dependency or package changes are required
- [x] T003 [P] Identify verification commands from code-graph package scripts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add flag-gated tombstone schema and summary helpers (`lib/code-graph-db.ts`)
- [x] T005 Add bounded retention pruning for tombstone rows (`lib/code-graph-db.ts`)
- [x] T006 Capture deletion reasons at node, edge, dangling-edge, file, and orphan cleanup paths (`lib/code-graph-db.ts`)
- [x] T007 Surface scan/status tombstone summaries without changing live query tables (`handlers/scan.ts`, `handlers/status.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add tombstone tests for enabled lineage and default-off behavior (`tests/code-graph-tombstones.vitest.ts`)
- [x] T009 Run code-graph DB, scan, status, typecheck, and build verification
- [x] T010 Update phase documentation (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed with vitest/typecheck/build evidence
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
