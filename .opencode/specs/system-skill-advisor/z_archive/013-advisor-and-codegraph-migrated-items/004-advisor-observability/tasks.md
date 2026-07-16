---
title: "Tasks: Phase 1: advisor-observability"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/004-advisor-observability"
    last_updated_at: "2026-06-10T22:36:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed advisor observability implementation and verification"
    next_safe_action: "Track the unrelated Claude settings parity failure in a separate scoped packet if needed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-advisor-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: advisor-observability

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

- [x] T001 Read phase scaffold before code inspection (`spec.md`, `plan.md`, `tasks.md`)
- [x] T002 Inspect advisor recommend/status handlers, scorer types/fusion, semantic-shadow lane, schemas, and existing tests
- [x] T003 [P] Confirm no dependency or package metadata changes are needed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add prompt-safe `why_recommended` output behind `includeAttribution` (`advisor-recommend.ts`, `advisor-tool-schemas.ts`)
- [x] T005 Preserve default recommendation payload and ranking fields when attribution is not requested (`advisor-recommend.ts`)
- [x] T006 Add opt-in `semanticLaneHealth` to `advisor_status` (`advisor-status.ts`, `advisor-tool-schemas.ts`)
- [x] T007 Record semantic-shadow disabled reasons for database, adapter, dim mismatch, prompt embedding, skill vectors, and empty-vector cases (`semantic-shadow.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add attribution gating and prompt-safety tests (`tests/handlers/advisor-recommend.vitest.ts`)
- [x] T009 Add no-ranking-drift and semantic-health tests (`tests/handlers/advisor-recommend.vitest.ts`, `tests/handlers/advisor-status.vitest.ts`)
- [x] T010 Run `npm run typecheck` and `npm run build` in the advisor MCP server
- [x] T011 Run targeted vitest: 3 files passed, 33 tests passed
- [x] T012 Run full vitest: 69 files passed, 1 out-of-scope hook-settings parity file failed, 431 tests passed, 35 failed
- [x] T013 Update spec, plan, tasks, implementation summary, and continuity metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Required targeted verification passed; full-suite residual is out of allowed write scope
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
