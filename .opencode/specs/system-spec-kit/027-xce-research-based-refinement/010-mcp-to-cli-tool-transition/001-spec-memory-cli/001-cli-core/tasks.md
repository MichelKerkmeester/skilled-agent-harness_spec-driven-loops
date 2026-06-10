---
title: "Tasks: Phase 1: CLI Core [system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core/tasks]"
description: "Implemented task breakdown for CLI Core: daemon-backed spec-memory CLI, shim, runtime command generation from TOOL_DEFINITIONS, Zod argv validation, targeted tests, and live smoke evidence."
trigger_phrases:
  - "spec-memory cli core tasks"
  - "cli subcommand codegen tasks"
  - "spec-memory shim tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Closed successor-owned verification row; phase 002 shipped"
    next_safe_action: "Continue dual-stack observation window"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 1: CLI Core

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T000 Verify predecessor handoff criteria and execute this Level 1 phase from the existing plan/research authority
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 Generate runtime subcommand map from `TOOL_DEFINITIONS` (`mcp_server/spec-memory-cli.ts`)
- [x] T002 Implement CLI entrypoint with Zod argv boundary and `--json` escape hatch (`mcp_server/spec-memory-cli.ts`)
- [x] T003 Implement connect-falls-back-to-spawn over the launcher; wire `--session-id` and `--timeout-ms` (`mcp_server/spec-memory-cli.ts`)
- [x] T004 Implement exit-code contract incl. 75 retryable and 69 fail-closed (`mcp_server/spec-memory-cli.ts`, targeted vitest)
- [x] T005 Author shim with dist-freshness guard and short-socket-dir default (`.opencode/bin/spec-memory.cjs`)
- [x] T006 Wire package bin and smoke-invoke live daemon via `memory_stats`; full destructive-safe 37-tool invocation matrix remains phase 002
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 CLI tests: `npx vitest run tests/cli.vitest.ts tests/spec-memory-cli.vitest.ts` -> 11 passed
- [x] T901 Typecheck/build: `npm run typecheck`; `npm run build`
- [x] T902 Live smoke: `node .opencode/bin/spec-memory.cjs memory_stats --format json --timeout-ms 5000`
- [x] T9xx Full 37-subcommand invocation matrix, dual-spawn race tests, and warm-path p95 sample are owned by phase 002 hardening — phase 002 shipped and verified (suites 10/10)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`; the successor-owned hardening scope shipped in phase 002
- [x] No `[B]` blocked tasks remaining
- [x] P0 requirements in spec.md implemented with targeted evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research authority**: `../000-spec-memory-cli-research/research/research.md` (deltas and measurements)
<!-- /ANCHOR:cross-refs -->
