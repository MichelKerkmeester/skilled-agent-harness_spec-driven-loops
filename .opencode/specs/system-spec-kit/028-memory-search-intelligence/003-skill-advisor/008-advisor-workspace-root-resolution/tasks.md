---
title: "Task Breakdown: Advisor workspace-root resolution by walk-up [template:level_2/tasks.md]"
description: "Tasks to clean stray nested .advisor-state, rewrite resolveWorkspaceRoot to walk up, swap the two write-path call sites, and verify via typecheck, rebuild, and a subdir-cwd logic check."
trigger_phrases:
  - "advisor root tasks"
  - "advisor-state cleanup tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/008-advisor-workspace-root-resolution"
    last_updated_at: "2026-06-21T15:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored task breakdown"
    next_safe_action: "Recycle advisor daemon to activate"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-advisor-root-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Advisor workspace-root resolution by walk-up

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every task names concrete evidence and maps to a phase.
- Remove placeholders and tasks not backed by a real action.
FAILURE MODES:
- Tasks without evidence, or phases that do not cover setup, implementation, and verification.
-->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending. Each task names its evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 [P1] Inventory stray nested `.advisor-state` directories. Evidence: `find` reported 13 (9 main-tree, 4 worktree).
- [x] T-002 [P1] Inspect each stray's parent `.opencode` to avoid removing real content. Evidence: counts showed several parents hold other content.
- [x] T-003 [P1] Remove main-tree `.advisor-state` leaves; `rmdir` empty parents only. Evidence: 9 removed, parents with content preserved.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 [P0] Rewrite `resolveWorkspaceRoot()` to walk up to the directory containing `.opencode/skills/system-skill-advisor`. Evidence: advisor-server.ts:71.
- [x] T-005 [P0] Route the startup-scan write path through `resolveWorkspaceRoot()`. Evidence: advisor-server.ts:134.
- [x] T-006 [P0] Route the daemon-init write path through `resolveWorkspaceRoot()`. Evidence: advisor-server.ts:298.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-007 [P0] Typecheck the advisor mcp_server. Evidence: `npm run typecheck` rc=0, 0 errors.
- [x] T-008 [P1] Rebuild dist. Evidence: `dist/mcp_server/advisor-server.js` rebuilt.
- [x] T-009 [P0] Confirm the resolver returns the repo root from `cwd=tool/`. Evidence: node walk-up check printed the repo root, PASS true.
- [ ] T-010 [P1] Activate on the running daemon via reconnect / fresh session (operator deploy step).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Code and cleanup complete and verified. T-010 (live daemon activation) is an operator deploy step pending a reconnect or fresh session.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source: `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts`
- Build: `mcp_server/package.json` build script.
<!-- /ANCHOR:cross-refs -->
