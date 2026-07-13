---
title: "Tasks: Codex hook/plugin parity"
description: "Task breakdown across the eight portable adapters, lifecycle wiring, native equivalents, install, and verification."
trigger_phrases: ["Codex hook parity tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-13T17:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the task breakdown"
    next_safe_action: "Implement the eight portable Codex guard adapters"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: Codex hook/plugin parity
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
Checked tasks carry source or verification evidence. The capability spike (Phase 0) is complete and recorded in `decision-record.md`.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Portable guard adapters
- [ ] T001 spec-gate-enforce Codex adapter (PreToolUse, deny-capable) over `spec-gate-core.mjs`.
- [ ] T002 spec-gate-classify Codex adapter (UserPromptSubmit, advisory) over `spec-gate-core.mjs`.
- [ ] T003 code-graph-freshness Codex adapter (PostToolUse) over `freshness-core.cjs`.
- [ ] T004 post-edit-quality Codex adapter (PostToolUse) over `post-edit-router.cjs`.
- [ ] T005 dispatch-preflight-lint Codex adapter (PreToolUse, deny-capable) over `dispatch-rule-checks.mjs`.
- [ ] T006 dispatch-audit Codex adapter (PostToolUse, observe) over `dispatch-audit.mjs`.
- [ ] T007 completion-evidence Codex adapter (Stop, advisory) over `completion-evidence-sentinel.cjs`.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Session-lifecycle wiring
- [ ] T010 Register worktree-guard, check-git-hooks, check-dist-staleness in the Codex SessionStart chain.
- [ ] T011 Fold session-cleanup into the Codex Stop chain with a neutral session-pid env.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Native equivalents
- [ ] T020 Codex route-guard adapter over `mcp-route-guard.cjs` with a `mcp__.*` matcher; document dormancy.
- [ ] T021 Extend the Codex dispatch adapter to recognize `codex exec -p` command shapes.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:phase-4 -->
## Phase 4: Install and registration
- [ ] T030 Extend the versioned repo `.codex/hooks.json` with all new events and matchers.
- [ ] T031 Add `install-codex-hooks.mjs` and run it to merge into `~/.codex/hooks.json` (backup first).
<!-- /ANCHOR:phase-4 -->
<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and closeout
- [ ] T040 Fixture stdin-pipe smoke plus fail-open check for every adapter.
- [ ] T041 Live `codex exec` matrix for the representative set.
- [ ] T042 Author cli-codex manual testing playbook entries.
- [ ] T043 Strict validation, metadata reconcile, and parent note.
<!-- /ANCHOR:phase-5 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Every Claude hook and OpenCode plugin has a Codex adapter, a documented native equivalent, or a documented gap, all verified.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `decision-record.md`
- `../004-codex-hook-adapter-layer/spec.md`
<!-- /ANCHOR:cross-refs -->
