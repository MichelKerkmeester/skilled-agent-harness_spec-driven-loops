---
title: "Tasks: Registry advisorRouting block + CI drift-guard"
description: "Tasks for phase 002: the advisorRouting block, the --dump-routing-maps flag, the DEEP_MODE_BY_CANONICAL export, and the drift-guard vitest."
trigger_phrases:
  - "advisorRouting drift guard tasks"
  - "phase 002 tasks"
  - "C-plus routing tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-parent-nested-skill-pattern/002-advisor-routing-drift-guard"
    last_updated_at: "2026-06-15T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored task list for the C-plus routing change"
    next_safe_action: "Validate and commit scoped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-002-advisor-routing-drift-guard-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Registry advisorRouting block + CI drift-guard

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

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify the real Python `DEEP_ROUTING_MODE_BY_KEY` / TS `DEEP_MODE_BY_CANONICAL` / `SKILL_ALIAS_GROUPS` against source
- [x] T002 Confirm the vitest harness + `aliases.ts` importability

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 Add the per-mode `advisorRouting` block (8 modes) + top-level `advisorRoutingContract` legend; bump registry version to 1.1.0. (`.opencode/skills/deep-loop-workflows/mode-registry.json`)
- [x] T002 Add the `--dump-routing-maps` flag (arg registration + handler). (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`)
- [x] T003 Export `DEEP_MODE_BY_CANONICAL`. (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`)
- [x] T004 Write the drift-guard vitest. (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `python3 skill_advisor.py --dump-routing-maps` emits the maps; registry projection matches exactly
- [x] T006 `vitest run` over drift-guard + both parity suites is green (19 tests)
- [x] T007 One-identity check: exactly one `graph-metadata.json` under `deep-loop-workflows`
- [x] T008 `validate.sh --strict` on this phase folder
- [x] T009 Commit scoped (`git commit --only -- <phase + advisor + registry paths>`)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation + verification tasks `[x]` (T008/T009 close out this turn).
- [x] No `[B]` blocked tasks remaining.
- [x] 19/19 tests green; one identity intact.
- [x] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: `../research/research.md`

<!-- /ANCHOR:cross-refs -->
