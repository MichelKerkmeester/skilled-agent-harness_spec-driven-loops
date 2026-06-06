---
title: "Tasks: Phase 5: stale-audit-and-tool-ownership [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "stale exclusion audit tasks"
  - "tool ownership lint tasks"
  - "intended exclusion policy task"
  - "tool ownership drift unit test"
  - "phase 5 stale audit task list"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership"
    last_updated_at: "2026-06-06T10:10:50Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populate Phase 5 planning docs (plan only)"
    next_safe_action: "Implement T001 intended-exclusion policy"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-stale-audit-and-tool-ownership"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: stale-audit-and-tool-ownership

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

- [ ] T001 Define the intended status-exclusion policy: enumerate which statuses (archived via `includeArchived=false`, `deprecated` tier) are excluded on purpose vs at risk of silent drop (`.opencode/commands/doctor/assets/doctor_memory.yaml`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Read-only stale-exclusion audit in health that classifies each live exclusion as intended or silent (`mcp_server/handlers/memory-crud-health.ts`, reads predicates from `mcp_server/lib/search/hybrid-search.ts`)
- [ ] T003 Wire the audit into `/doctor memory` + startup health, registering the hard-exclusion-risk diagnostic (`.opencode/commands/doctor/assets/doctor_memory.yaml`)
- [ ] T004 Derive the tool-ownership/stability map from `TOOL_DEFINITIONS` (the single ownership source), generated not hand-maintained (`mcp_server/tool-schemas.ts`)
- [ ] T005 Tool-ownership drift lint as a blocking pre-commit gate and in `/doctor skill-budget` (`.opencode/scripts/git-hooks/pre-commit`)
- [ ] T006 [P] Surface audit diagnostics via MCP response hints + health output, with no new search flags (`mcp_server/handlers/memory-crud-health.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 [P] vitest unit tests for audit classification: intended-exclusion (archived) not flagged; silent deprecated-but-relevant flagged (`mcp_server` vitest suite)
- [ ] T008 [P] vitest unit tests for lint drift detection over a derived map; clean map passes, drifted map fails (`mcp_server` vitest suite)
- [ ] T009 Update docs for the audit + ownership-lint surfaces and where they fire (`mcp_server/references/config/hook_system.md`)
- [ ] T010 Manual verification: `/doctor memory` shows the exclusion diagnostic, `/doctor skill-budget` shows ownership drift, default `memory_search` results unchanged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

