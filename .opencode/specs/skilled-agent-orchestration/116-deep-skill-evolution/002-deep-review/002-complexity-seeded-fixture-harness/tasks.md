---
title: "Tasks: 116/002 - Seeded Fixture Harness"
description: "Level 2 task breakdown for review-depth v2 seeded fixture authoring and verification."
trigger_phrases:
  - "116 seeded fixture tasks"
  - "review-depth fixture tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/002-complexity-seeded-fixture-harness"
    last_updated_at: "2026-05-22T11:19:32Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed Level 2 fixture tasks."
    next_safe_action: "Hand fixtures to downstream phases C-G."
    blockers: []
    key_files:
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1160022000000000000000000000000000000000000000000000000000000000"
      session_id: "116-002-tasks"
      parent_session_id: "116-002-seeded-fixture-harness"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 116/002 - Seeded Fixture Harness

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

- [x] T001 Read parent phase-map authority (`../spec.md`) [5m]
- [x] T002 Read frozen v2 research contract (`../001-research-synthesis/research/research.md`) [10m]
- [x] T003 Read Level 2 templates (`.opencode/skills/system-spec-kit/templates/examples/level_2/`) [10m]
- [x] T004 Inspect existing validator Vitest style (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts`) [10m]
- [x] T005 Inspect reducer and coverage graph handler surfaces [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Spec Documentation

- [x] T006 Populate Level 2 `spec.md` (`.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/002-complexity-seeded-fixture-harness/spec.md`) [15m]
- [x] T007 Populate Level 2 `plan.md` (`.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/002-complexity-seeded-fixture-harness/plan.md`) [10m]
- [x] T008 Populate Level 2 `tasks.md` (`.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/002-complexity-seeded-fixture-harness/tasks.md`) [10m]
- [x] T009 Populate Level 2 `checklist.md` (`.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/002-complexity-seeded-fixture-harness/checklist.md`) [10m]

### Fixture Files

- [x] T010 Add validator v2 fixture file (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-validator.vitest.ts`) [15m]
- [x] T011 Add reducer search-debt fixture file (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts`) [10m]
- [x] T012 Add convergence graphless fallback fixture file (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-convergence.vitest.ts`) [10m]
- [x] T013 Add graph vocabulary fixture file (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts`) [10m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run MCP server TypeScript typecheck (`pnpm --dir .opencode/skills/system-spec-kit/mcp_server exec tsc --noEmit --composite false -p tsconfig.json --ignoreDeprecations 6.0`) [10m]
- [x] T015 Run targeted fixture Vitest command (`pnpm vitest run --no-coverage review-depth-`) [10m]
- [x] T016 Refresh metadata with `generate-context.js` (`description.json`, `graph-metadata.json`) [10m]
- [x] T017 Fill implementation summary with verification evidence (`implementation-summary.md`) [10m]
- [x] T018 Run strict spec validation (`validate.sh --strict`) [5m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required fixture categories exist.
- [x] Targeted fixture run loads all four review-depth test files.
- [x] Today-red tests are intentional and named with their owning future phase.
- [x] No forbidden downstream production files are modified.
- [x] `checklist.md` includes evidence for P0/P1/P2 items.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
