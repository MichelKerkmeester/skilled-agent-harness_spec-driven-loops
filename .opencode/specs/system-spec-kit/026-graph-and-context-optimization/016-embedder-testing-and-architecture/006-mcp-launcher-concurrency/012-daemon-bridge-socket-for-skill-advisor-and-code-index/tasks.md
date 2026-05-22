---
title: "Tasks: Daemon bridge socket for skill-advisor and code-index [template:level_1/tasks.md]"
description: "Task breakdown. T001-T013 shipped in this packet."
trigger_phrases:
  - "012 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "All tasks complete; awaiting commit"
    next_safe_action: "Strict validate + commit"
    blockers: []
---
# Tasks: Daemon bridge socket for skill-advisor and code-index

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status:** `[x]` complete, `[ ]` open, `[!]` blocked
- **P-tag:** P0 (blocker) / P1 (required) / P2 (deferred or follow-on)
- **Evidence:** smoke output, file:line, or commit ref
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Reproduce the failure: confirm OpenCode plugin `mk-skill-advisor.js` reports `last_bridge_status=fail_open` with primary daemon alive | `[x]` | Initial diagnosis session — `last_duration_ms=145` from previous session |
| T002 | P0 | Confirm `mk-spec-memory` has socket-server binding (positive control) vs skill-advisor/code-index don't (negative) | `[x]` | `grep "net.createServer" advisor-server.ts code-graph/mcp_server/index.ts` returns 0 hits; `context-server.ts:113` imports from `socket-server.js` |
| T003 | P0 | Stage target `lib/ipc/` dirs in both packages | `[x]` | `mkdir -p` |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Copy `socket-server.ts` into `system-skill-advisor/mcp_server/lib/ipc/` | `[x]` | `diff -q` confirms identical |
| T005 | P0 | Copy `socket-server.ts` into `system-code-graph/mcp_server/lib/ipc/` | `[x]` | `diff -q` confirms identical |
| T006 | P0 | Refactor `advisor-server.ts`: extract `createAdvisorMcpServer()` factory; call `startIpcSocketServer` after stdio connect; close bridge on shutdown | `[x]` | `advisor-server.ts:192-237, 245-251` (post-edit) |
| T007 | P0 | Refactor `system-code-graph/mcp_server/index.ts`: extract `createCodeIndexMcpServer()` factory; add SIGTERM/SIGINT handlers + `shutdownCodeIndex`; call `startIpcSocketServer` after stdio connect | `[x]` | `index.ts:1-90` (full file rewritten) |
| T008 | P1 | Add 3 env vars to `mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST` | `[x]` | `mk-skill-advisor-launcher.cjs:91-93` |
| T009 | P0 | `npm run build` in `system-skill-advisor/mcp_server` | `[x]` | exit 0 |
| T010 | P0 | `npm run build` in `system-code-graph` | `[x]` | exit 0 |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T011 | P0 | Smoke: primary skill-advisor binds `/tmp/mk-skill-advisor/daemon-ipc.sock` | `[x]` | `srw-------` socket present after ~5s + log line `[ipc-bridge] socket listening at /tmp/mk-skill-advisor/daemon-ipc.sock` |
| T012 | P0 | Smoke: primary code-index binds `/tmp/mk-code-index/daemon-ipc.sock` | `[x]` | same evidence for code-index — note: needs ~10s warmup before socket bind, not 5s |
| T013 | P0 | Smoke: secondary skill-advisor launcher bridges via socket | `[x]` | `[mk-skill-advisor-launcher] bridging to lease holder pid=86629 socket=/tmp/mk-skill-advisor/daemon-ipc.sock` |
| T014 | P0 | Smoke: secondary code-index launcher bridges via socket | `[x]` | `[mk-code-index-launcher] bridging to lease holder pid=87044 socket=/tmp/mk-code-index/daemon-ipc.sock` |
| T015 | P0 | Strict validate on this packet | `[x]` | 2026-05-21T10:17:49Z: `validate.sh <packet> --strict` exit 0; `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED` |
| T016 | P1 | Update arc parent: phase-map row + children_ids + last_active_child_id | `[x]` | (this commit) |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T016 complete with evidence. T017 below is the follow-on hand-off:

| Task | P | Description | Status | Notes |
|------|---|-------------|--------|-------|
| T017 | P2 | Raise OpenCode plugin's `DEFAULT_BRIDGE_TIMEOUT_MS` from 1000ms to ~8000ms | `[ ]` | Follow-on packet `013-plugin-bridge-timeout-tune` (proposed). The bridge's `ADVISOR_MCP_TIMEOUT_MS` is 8s; plugin must allow at least that. Without it, the plugin still kills its bridge subprocess before the MCP handshake completes — even though the bridge socket now exists. Validate after a sufficiently long bridge round-trip. |
| T018 | P2 | Dead-PID auto-reclaim in `skill_graph_daemon_lease` | `[ ]` | Still tracked from packet 011 REQ-006; orthogonal to bridge-socket fix |
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` §2 Problem & Purpose — gap analysis + why this packet exists
- `spec.md` §3 Scope — what's in vs. out
- `spec.md` §4 Requirements — REQ-001..REQ-007 mapping to T011..T014 (smoke) and T009..T010 (build)
- `plan.md` §3 Architecture — factory pattern explanation + launcher allowlist rationale
- `implementation-summary.md` §3 — full smoke output capture
- Predecessor packet: `../010-multi-client-stdio-socket-bridge/` (introduced launcher-side bridge for all 3; daemon-side only for spec-memory)
- Sibling packet: `../011-sun-path-and-stale-lease-followups/` (flagged this work as REQ-006)
<!-- /ANCHOR:cross-refs -->
