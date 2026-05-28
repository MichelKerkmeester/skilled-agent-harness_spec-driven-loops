---
title: "Tasks: Liveness-probe-before-bridge + reap-aware respawn (F3′)"
description: "Implementation task tracker for the application-level handshake probe, reap-before-respawn, and cross-process single-winner respawn."
trigger_phrases:
  - "bridge liveness tasks F3"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/007-bridge-liveness-reap"
    last_updated_at: "2026-05-28T21:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored F3′ implementation tasks (all pending — spec ready, gated on phase 006)"
    next_safe_action: "Implement after phase 006 lands the child-pid lease"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000713"
      session_id: "007-007-tasks"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Liveness-probe-before-bridge + reap-aware respawn (F3′)

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

- [ ] T001 [B] Confirm phase 006 shipped the child-pid lease + `processLiveness` (REQ-006 gate)
- [ ] T002 Choose the handshake JSON-RPC method + reply bound
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 `probeDaemon(socketPath)`: throwaway connection + minimal JSON-RPC request + bounded reply → alive/dead/timeout (`launcher-ipc-bridge.cjs`) [REQ-001]
- [ ] T004 Make `maybeBridgeLeaseHolder` async, return `{action: bridge|respawn|report}`; replace the existsSync gate (`launcher-ipc-bridge.cjs:122`) [REQ-001/004]
- [ ] T005 Reap-before-respawn: SIGTERM→grace(>5000)→SIGKILL the lease `childPid` via ported `processLiveness` before spawning (`mk-spec-memory-launcher.cjs`) [REQ-002]
- [ ] T006 Exclusive `wx` single-winner acquire (+ bootstrap lock) on respawn; in-process `respawnInFlight` documented as intra-process only (`mk-spec-memory-launcher.cjs`; reuse mk-code-index `wx`) [REQ-003]
- [ ] T007 await the async decision at BOTH launchers' call sites with a duplicate-spawn guard (`mk-spec-memory-launcher.cjs:415`, `mk-code-index-launcher.cjs:705`) [REQ-004]
- [ ] T008 tcp:// EADDRINUSE handling on respawn (`socket-server.ts:155`) [REQ-005]
- [ ] T009 [P] (Optional) `socketReadyAt` readiness marker at `startIpcSocketServer` resolve (`context-server.ts:1986`) [REQ-007]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Dead-socket + OOM-wedged-daemon (accepts but no JSON-RPC reply) reconnect tests → not bridged, one daemon [REQ-001/002]
- [ ] T011 Concurrent-launcher slow-probe race test → no duplicate spawn [REQ-003/004]
- [ ] T012 Healthy-reconnect latency unchanged; tcp:// respawn no crash [SC-002/REQ-005]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Phase 006 prerequisite met; P0 tasks (T003-T007) complete
- [ ] No `[B]` blocked tasks remaining
- [ ] dead/wedged reconnect + race tests green; healthy path fast
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prerequisite**: `../006-graceful-exit-watchdog` (child-pid lease)
- **Root cause + design**: See `../003-daemon-reliability-research/research/research.md` §6 + `research/iterations/iteration-003.md`
<!-- /ANCHOR:cross-refs -->
