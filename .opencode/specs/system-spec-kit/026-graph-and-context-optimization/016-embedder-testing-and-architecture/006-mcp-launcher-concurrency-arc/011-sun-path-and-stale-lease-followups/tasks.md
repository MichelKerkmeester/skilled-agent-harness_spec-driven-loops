---
title: "Tasks: sun_path socket-dir + stale-lease reclaim followups [template:level_1/tasks.md]"
description: "Task breakdown. T001-T003 shipped in commit 9ae9a6f4e, T004-T010 are this packet, T011-T012 are the follow-on capture."
trigger_phrases:
  - "011 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/011-sun-path-and-stale-lease-followups"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Task breakdown authored; all T001-T010 marked complete"
    next_safe_action: "Validate, commit"
    blockers: []
---
# Tasks: sun_path socket-dir + stale-lease reclaim followups

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status:** `[x]` = complete, `[ ]` = open, `[!]` = blocked
- **P-tag:** P0 (blocker) / P1 (required) / P2 (deferred or follow-on)
- **Evidence:** commit ref, file:line, or smoke output
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Confirm parent arc location and verify the failure modes can be reproduced | `[x]` | session log; codex startup failed for 2 of 3 launchers |
| T002 | P0 | Identify root cause #1: macOS 104-byte `sun_path` limit on `<service-db>/daemon-ipc.sock` default | `[x]` | reproduction: `python -c "import socket; socket.socket(socket.AF_UNIX, socket.SOCK_STREAM).bind('<long-path>')"` raises `OSError: [Errno 63] File name too long` |
| T003 | P0 | Identify root cause #2: stale `skill_graph_daemon_lease` rows + stale `.mk-*-launcher.json` files pointing at dead PIDs | `[x]` | DELETE FROM skill_graph_daemon_lease cleared the residue; subsequent cold-start succeeded |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase A (shipped pre-packet)

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Add `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory` block to all 4 runtime configs | `[x]` | commit `9ae9a6f4e` |
| T005 | P0 | Add `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor` block to all 4 runtime configs | `[x]` | commit `9ae9a6f4e` |
| T006 | P0 | Add `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-code-index` block to all 4 runtime configs | `[x]` | commit `9ae9a6f4e` |

### Phase B (this packet's commit)

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T007 | P0 | Re-describe `SPECKIT_IPC_SOCKET_DIR` in `ENV_REFERENCE.md` as **required on macOS** (was "Testing override") | `[x]` | `ENV_REFERENCE.md:181` |
| T008 | P1 | Re-describe `SPECKIT_IPC_SOCKET_DIR` in `references/memory/embedder_architecture.md` as **required on macOS** (was "can relocate the socket for tests") | `[x]` | `embedder_architecture.md:144` |
| T009 | P1 | Author the 5 packet docs + description.json + graph-metadata.json | `[x]` | this packet |
| T010 | P1 | Backfill arc parent: phase-map rows for 006-011, `children_ids` for 005/007/010/011, `last_active_child_id` to 011 | `[x]` | `006-mcp-launcher-concurrency-arc/spec.md` + `graph-metadata.json` |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T011 | P0 | Run `validate.sh --strict` on this packet | `[x]` | exit 0 |
| T012 | P0 | Smoke-test the 3 launcher binaries with pinned env-var; each returns a clean `initialize` JSON-RPC response | `[x]` | smoke output captured in `implementation-summary.md` §5 |
| T013 | P1 | `grep -l SPECKIT_IPC_SOCKET_DIR` returns 4 paths (all configs) | `[x]` | shell verification |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T013 complete with evidence. T014-T015 below are intentionally not in this packet — they are the follow-on hand-off:

| Task | P | Description | Status | Notes |
|------|---|-------------|--------|-------|
| T014 | P2 | Implement `process.kill(pid, 0)` revalidation in `skill_graph_daemon_lease` reclaim | `[ ]` | Follow-on packet `012-launcher-lease-reclaim-dead-pid` (proposed slug). Root-causes the second failure mode in `spec.md` §2. |
| T015 | P2 | Pull `fs.mkdirSync(...)` from `socket-server.ts:102` into `launcher-ipc-bridge.cjs` so `mk-skill-advisor` + `mk-code-index` auto-create their `/tmp/<service>` dirs | `[ ]` | Bundled into the same follow-on. Removes the implicit precondition that `/tmp/<service>` exists at startup. |
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` §3 Scope — what's in vs. out
- `spec.md` §4 Requirements — REQ-001..REQ-006 mapping to T004..T015
- `plan.md` §3 Architecture — affected surfaces, deferred follow-on
- `implementation-summary.md` §3 — operational lease-clear recipe (the source-of-truth doc for T011/T012 cleanup steps)
- Predecessor packet: `../010-multi-client-stdio-socket-bridge/`
- Commit: `9ae9a6f4e fix(mcp): pin SPECKIT_IPC_SOCKET_DIR to short /tmp paths to clear macOS sun_path limit`
<!-- /ANCHOR:cross-refs -->
