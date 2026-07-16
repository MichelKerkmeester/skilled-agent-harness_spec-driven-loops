---
title: "Tasks: Phase 30: Client-Side MCP Reconnect Survival [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "client reconnect tasks"
  - "frontend disconnect logging"
  - "mcp keepalive task"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/030-client-side-reconnect-survival"
    last_updated_at: "2026-06-08T15:19:04Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author task list from client-reconnect plan"
    next_safe_action: "Start T001 frontend-teardown logging"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-client-side-reconnect-survival"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 30: Client-Side MCP Reconnect Survival

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

_P0: instrument the frontend transport drop. This phase gates everything below._

- [ ] T001 Add frontend stdin-EOF / `'end'` / `'close'` logging with timestamp + pid (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T002 Add stdout EPIPE / write-error logging on the serving pipe (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T003 [P] Mirror the same instrumentation in the code-index launcher (.opencode/bin/mk-code-index-launcher.cjs)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Mitigate only what P0 justifies (keepalive, stdout hygiene)._

- [ ] T004 Capture and classify one real disconnect from the launcher log (idle-reap vs transport error vs orphan-exit)
- [ ] T005 [B] IF idle-reap confirmed: flag-gated default-off keepalive notification emitter (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T006 Confirm stdout hygiene: trace `writeLeaseHeldDiagnostic` reachability on the serving path; reroute to stderr if reachable (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T007 Add error handling / flag wiring + ENV_REFERENCE row for any keepalive flag (.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Decide (HTTP/SSE ROI), document the residual, and verify the instrumentation captures a real disconnect._

- [ ] T008 Manually reproduce a disconnect and confirm the new logging captures + classifies it
- [ ] T009 Write the HTTP/SSE transport ROI note (go/no-go vs keepalive) and handle the edge case where neither is worth it
- [ ] T010 Document the residual operator-facing (stdio = no auto-reconnect; `/mcp` recovery; zero data loss) and refresh ../changelog/
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
