---
title: "Tasks: Phase 1: CLI Core [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/tasks]"
description: "Task breakdown for CLI Core; all rows complete with shipped CLI and hardening-suite evidence."
trigger_phrases:
  - "code-index cli core tasks"
  - "002 001-cli-core tasks"
  - "code-index phase 1 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Ticked verification row on hardening-suite + smoke evidence"
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

- [x] T000 Verify predecessor handoff criteria and run speckit:plan for this phase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 Stable shim (`.opencode/bin/code-index.cjs` working name) with dist-freshness guard (stale/missing dist → exit 69 unless dev override)
- [x] T002 Manifest codegen for all 8 subcommands from `CODE_GRAPH_TOOL_SCHEMAS`; validation parity via `validateToolArgs()` + dispatcher required-field checks — NOT Zod, confirmed system-specific
- [x] T003 Blocked-read rendering: `query`/`context`/`detect-changes` stale-readiness `status: blocked` + `requiredAction` preserved in every output format, never false empty success
- [x] T004 Exit taxonomy 0/1/64/69/75 incl. retryable socket/backend/cold-start → 75
- [x] T005 Connect-falls-back-to-spawn over the IPC socket via `mk-code-index-launcher.cjs`; `apply` keeps its `--confirm` hard-stale gate; scan/apply/verify confirmation UX
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T9xx All 8 subcommands invocable against a live daemon; blocked-read renders blocked; exit matrix verified; auto-spawn works from a dead socket — proven by the phase-002 suites (16/16) + smoke
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P0 requirements in spec.md verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research authority**: `../000-code-index-cli-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
