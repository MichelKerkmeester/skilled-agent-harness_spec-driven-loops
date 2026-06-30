---
title: "Tasks: Phase 3: Runtime Integration [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/tasks]"
description: "Task breakdown for Runtime Integration; rows reconciled with shipped runtime evidence."
trigger_phrases:
  - "cli runtime integration tasks"
  - "spec-memory allowlist tasks"
  - "dual-stack rollout tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration"
    last_updated_at: "2026-06-10T06:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "T9xx transport-down drill PASSED; T008 window observation recorded"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 3: Runtime Integration

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

- [x] T001 Add Claude Code allowlist entry and smoke-check promptless invocation
- [x] T002 Add second-runtime allowlist (Codex or OpenCode) and smoke-check
- [x] T003 Publish hook integration policy with warm-only examples and timeout fallback
- [x] T004 Packaging/install steps verified from a fresh checkout
- [x] T005 Author transport-down fallback guidance (AGENTS.md / skill text) and verify once against a stopped MCP transport
- [x] T006 Extend spec-memory hook adapters with the CLI warm path for Claude Code and Codex (system-spec-kit/mcp_server/hooks/{claude,codex})
- [x] T007 Create the OpenCode spec-memory plugin + bridge following the mk-skill-advisor pattern (.opencode/plugins/ + plugin_bridges/)
- [x] T008 Open dual-stack verification window and record observations + rollback note — window observation recorded: T9xx drill PASSED (cross-runtime-fallback 16/16, adaptive-fallback 7/7, hooks green); no rollback triggered; dual-stack stable
- [x] T009 Rewire `.codex/hooks.json` to the Codex adapters — COMPLETED EARLY in 026/008-runtime-defect-fixes (smoke-verified); remaining for this phase: smoke the CLI-backed path against the live hook file
- [x] T010 Dual-failure drill: MCP transport stopped + daemon socket absent/dead → hook warm-only path performs NO cold spawn, fails open within the runtime hook timeout, surfaces exit-75 retryable status
- [x] T011 Runtime-config inventory verification: live hook configs (.claude/settings.local.json, .codex/hooks.json, .codex/settings.json) modified as scoped; MCP configs diff-verified unchanged
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T9xx End-to-end transport-down drill (kill MCP transport, CLI keeps continuity ops working); two runtimes invoke without manual approval; window observations recorded. — PASS: spec-memory cross-runtime-fallback 16/16 + adaptive-fallback 7/7; Claude+Codex hook adapters green; warm-only no-spawn proven by stress scenario 435 (60/60 exit-75); launcher delta 0
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
- **Research authority**: `../000-spec-memory-cli-research/research/research.md` (deltas and measurements)
<!-- /ANCHOR:cross-refs -->
