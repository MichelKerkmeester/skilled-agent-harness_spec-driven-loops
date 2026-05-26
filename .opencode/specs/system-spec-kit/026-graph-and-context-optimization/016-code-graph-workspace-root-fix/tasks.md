---
title: "Tasks: Code-Graph Workspace-Root + IPC Socket Reconnect Fix [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "code index reconnect tasks"
  - "workspace root tasks"
  - "ipc socket tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-code-graph-workspace-root-fix"
    last_updated_at: "2026-05-26T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete + verified"
    next_safe_action: "Reconnect mk_code_index"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/core/config.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code-Graph Workspace-Root + IPC Socket Reconnect Fix

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Reproduce both crashes via direct launcher run (evidence captured)
- [x] T002 Anchor `resolveWorkspaceRoot()` on on-path `.opencode`; import `basename` (`core/config.ts`)
- [x] T003 Confirm 5 stray `.opencode/` dirs untracked + canonical copies intact
- [x] T004 Remove 5 stray `.opencode/` dirs (`.opencode/skills/**`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `canonicalizePath` / `allowedSocketRoots` / `isWithinAllowedSocketRoot`; import `os` (`lib/ipc/socket-server.ts`)
- [x] T006 Relax `resolveIpcSocketPath` to allowed roots (workspace + os.tmpdir() + /tmp)
- [x] T007 Relax `canUnlinkExistingSocket` to allowed roots; keep socket-type + owner-uid check
- [x] T008 `npm run typecheck` + `npm run build` (regenerate dist)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Launcher starts clean (no OUTSIDE_WORKSPACE); socket binds at `/private/tmp/mk-code-index/daemon-ipc.sock`
- [x] T010 Restart reclaims stale socket (no EADDRINUSE throw)
- [x] T011 MCP handshake: `initialize` → mk-code-index 1.0.0; `tools/list` → 8 tools
- [x] T012 Author + strict-validate spec docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (handshake)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
