---
title: "Tasks: Release Code Mode transports so remote MCP children stop accumulating"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "code mode transport release tasks"
  - "mcp child reaping tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/007-code-mode-transport-leak"
    last_updated_at: "2026-08-25T06:55:42Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks complete"
    next_safe_action: "Close phase; operator commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-010-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Release Code Mode transports so remote MCP children stop accumulating

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

- [x] T001 Attribute the running transport processes to their spawning runtime via process ancestry, reaching `mcp-code-mode/mcp-server/dist/index.js` under a `claude` parent
- [x] T002 Establish the exit path calls `process.exit` without closing the client (`index.ts` shutdown handler)
- [x] T003 Establish registration opens and caches one transport per manual, and that the protocol exposes `close()` which ends them
- [x] T004 Audit the manual roster so the teardown's authorization side effect is known inert: `13 mcp/stdio manuals, 0 http, 0 auth`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Release all transports before exit, bounded by a timeout so exit cannot block (`index.ts`)
- [x] T006 Release idle transports once startup discovery completes (`index.ts`)
- [x] T007 Rebuild the bundle the runtime loads (`dist/index.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Negative control: pre-fix build leaves `1 / 1` spawned children alive after shutdown
- [x] T009 Positive control: fixed build leaves `0 / 1` alive under the identical probe
- [x] T010 Behavior preservation: after release, probe reported `tools_still_searchable=1` and `call_after_close=OK`, with `children_after_ondemand=1` proving the transport reopened on demand
- [x] T011 Steady state: probe reported `idle_children_after_startup = 0` and `idle_children_still = 0` fourteen seconds apart
- [x] T012 `npx tsc` typecheck and build pass at exit code 0; probe artifacts removed from the package tree
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Leak eliminated at both lifecycle points, each proven against a control
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
