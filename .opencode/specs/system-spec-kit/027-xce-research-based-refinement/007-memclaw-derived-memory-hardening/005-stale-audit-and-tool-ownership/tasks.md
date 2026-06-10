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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership"
    last_updated_at: "2026-06-10T14:35:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped read-only audit and ownership lint"
    next_safe_action: "Monitor health and ownership drift surfaces"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-stale-audit-and-tool-ownership"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Define the intended status-exclusion policy: archived defaults classify as intended, deprecated-tier hard exclusions classify as silent risk (`hybrid-search.ts`, `memory-crud-health.ts`). Evidence: `npx vitest run tests/stale-audit-tool-ownership.vitest.ts` passed 6 tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Read-only stale-exclusion audit in health that classifies each live exclusion as intended or silent (`mcp_server/handlers/memory-crud-health.ts`, reads predicates from `mcp_server/lib/search/hybrid-search.ts`). Evidence: new suite proves silent deprecated rows are flagged and recall output is unchanged.
- [x] T003 Wire the audit into `/doctor memory` + startup health, registering the hard-exclusion-risk diagnostic (`.opencode/commands/doctor/assets/doctor_memory.yaml`). Evidence: `memory_health` now returns `data.exclusionAudit` and the doctor YAML reads it as `hard_exclusion_risk`.
- [x] T004 Derive the tool-ownership/stability map from `TOOL_DEFINITIONS` (the single ownership source), generated not hand-maintained (`mcp_server/tool-schemas.ts`). Evidence: `node tests/tool-ownership-lint-runner.mjs` reports a clean 37-tool map.
- [x] T005 Tool-ownership drift lint as a blocking pre-commit gate and visible ownership surface (`.opencode/scripts/git-hooks/pre-commit`). Evidence: synthetic missing/extra drift tests fail the lint, and the pre-commit hook blocks on runner failure.
- [x] T006 [P] Surface audit diagnostics via MCP response hints + health output, with no new search flags (`mcp_server/handlers/memory-crud-health.ts`). Evidence: audit diagnostics are appended to health `hints[]`; no search schema or recall flag was added.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] vitest unit tests for audit classification: intended-exclusion (archived) not flagged; silent deprecated-but-relevant flagged (`mcp_server` vitest suite). Evidence: `tests/stale-audit-tool-ownership.vitest.ts` passed.
- [x] T008 [P] vitest unit tests for lint drift detection over a derived map; clean map passes, drifted map fails (`mcp_server` vitest suite). Evidence: synthetic missing/extra and fail-closed cases passed.
- [x] T009 Update docs for the audit + ownership-lint surfaces and where they fire (`mcp_server/references/config/hook_system.md`). Evidence: `references/config/hook_system.md` documents `memory_health` and pre-commit surfaces.
- [x] T010 Manual verification: `/doctor memory` shows the exclusion diagnostic, ownership lint gate is visible through pre-commit, default `memory_search` results unchanged. Evidence: source-level runner clean; recall byte-identical assertion passed in vitest.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
