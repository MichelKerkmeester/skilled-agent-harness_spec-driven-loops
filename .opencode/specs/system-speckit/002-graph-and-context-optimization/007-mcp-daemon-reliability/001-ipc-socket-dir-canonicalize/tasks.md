---
title: "Tasks: Canonicalize missing IPC socket dirs in code-graph resolveIpcSocketPath"
description: "Task tracker for the system-code-graph socket-dir canonicalization fix + regression test + dist rebuild."
trigger_phrases:
  - "ipc socket dir canonicalize tasks"
  - "code-graph socket fix tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/001-ipc-socket-dir-canonicalize"
    last_updated_at: "2026-05-28T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete: fix + test (2/2) + dist build green"
    next_safe_action: "None; phase complete pending strict validate"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000293"
      session_id: "029-001-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Canonicalize missing IPC socket dirs in code-graph resolveIpcSocketPath

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

- [x] T001 Confirm root cause: missing /tmp socket dir not canonicalized vs canonicalized allowed roots (`socket-server.ts`)
- [x] T002 Confirm scope: only system-code-graph has the allowed-root check (grep both siblings = 0)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite `canonicalizePath` to realpath the nearest existing ancestor + re-append missing tail (`socket-server.ts`)
- [x] T004 Route `resolveIpcSocketPath` through `canonicalizePath` (drop the existsSync ternary) (`socket-server.ts`)
- [x] T005 Rebuild system-code-graph dist (`tsc --build`, exit 0)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Add regression test: missing /tmp dir resolves; out-of-root still throws (`tests/ipc-socket-resolve.vitest.ts`)
- [x] T007 Run test — 2/2 pass
- [x] T008 Remove the manual /tmp/mk-code-index dir so the fix is self-sufficient on reconnect
- [x] T009 Update spec/plan/tasks/implementation-summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Regression test passes; dist rebuilt
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
