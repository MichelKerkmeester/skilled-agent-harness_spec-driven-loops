---
title: "Tasks: Phase 3: Runtime Integration [system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/tasks]"
description: "Planned task breakdown for Runtime Integration; rows expand at speckit:plan time."
trigger_phrases:
  - "cli runtime integration tasks"
  - "spec-memory allowlist tasks"
  - "dual-stack rollout tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration"
    last_updated_at: "2026-06-06T15:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Audit findings propagated to companions"
    next_safe_action: "Run speckit:plan on this phase to expand the plan before implementation"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
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

- [ ] T000 Verify predecessor handoff criteria and run speckit:plan for this phase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Add Claude Code allowlist entry and smoke-check promptless invocation
- [ ] T002 Add second-runtime allowlist (Codex or OpenCode) and smoke-check
- [ ] T003 Publish hook integration policy with warm-only examples and timeout fallback
- [ ] T004 Packaging/install steps verified from a fresh checkout
- [ ] T005 Author transport-down fallback guidance (AGENTS.md / skill text) and verify once against a stopped MCP transport
- [ ] T006 Extend spec-memory hook adapters with the CLI warm path for Claude Code and Codex (system-spec-kit/mcp_server/hooks/{claude,codex})
- [ ] T007 Create the OpenCode spec-memory plugin + bridge following the mk-skill-advisor pattern (.opencode/plugins/ + plugin_bridges/)
- [ ] T008 Open dual-stack verification window and record observations + rollback note
- [x] T009 Rewire `.codex/hooks.json` to the Codex adapters — COMPLETED EARLY in 026/008-runtime-defect-fixes (smoke-verified); remaining for this phase: smoke the CLI-backed path against the live hook file
- [ ] T010 Dual-failure drill: MCP transport stopped + daemon socket absent/dead → hook warm-only path performs NO cold spawn, fails open within the runtime hook timeout, surfaces exit-75 retryable status
- [ ] T011 Runtime-config inventory verification: live hook configs (.claude/settings.local.json, .codex/hooks.json, .codex/settings.json) modified as scoped; MCP configs diff-verified unchanged
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T9xx End-to-end transport-down drill (kill MCP transport, CLI keeps continuity ops working); two runtimes invoke without manual approval; window observations recorded.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] P0 requirements in spec.md verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research authority**: `../000-spec-memory-cli-research/research/research.md` (deltas and measurements)
<!-- /ANCHOR:cross-refs -->
