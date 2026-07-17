---
title: "Tasks: Liveness-probe-before-bridge + reap-aware respawn (F3′)"
description: "Implementation task tracker for the application-level handshake probe, reap-before-respawn, and cross-process single-winner respawn."
trigger_phrases:
  - "bridge liveness tasks F3"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/007-bridge-liveness-reap"
    last_updated_at: "2026-05-28T23:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented probe+reap+single-winner; 2 reviews, 3 defects fixed; probe 4/4"
    next_safe_action: "Run T011/T012 live concurrent-launcher + reconnect validation on a daemon"
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

- [x] T001 Phase 006 shipped the child-pid lease + `processLiveness` (REQ-006 gate satisfied; `buildLeaseObject` writes childPid, `processLiveness` reused)
- [x] T002 Handshake = JSON-RPC `initialize`, ~2500ms reply bound (result OR error proves liveness)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `probeDaemon(socketPath)`: throwaway connection + newline-delimited JSON-RPC initialize + bounded reply → alive/dead/timeout (`launcher-ipc-bridge.cjs`) [REQ-001]
- [x] T004 Made `maybeBridgeLeaseHolder` async, returns `{action: bridge|respawn|report}`; replaced the existsSync gate (`launcher-ipc-bridge.cjs`) [REQ-001/004]
- [x] T005 Reap-before-respawn: SIGTERM→grace(7000>5000)→SIGKILL the lease `childPid` via `processLiveness` + `reapProcessTreeGroups` before spawning (`mk-spec-memory-launcher.cjs`) [REQ-002]
- [x] T006 Exclusive `wx` single-winner acquire (+ bootstrap lock) on respawn, with stale-lock reclaim (dead-holder/aged); reuse mk-code-index `wx` owner-lease (`mk-spec-memory-launcher.cjs`) [REQ-003]
- [x] T007 await the async decision at BOTH launchers' call sites with a running-child duplicate-spawn guard (`shouldSkipLaunch`) (`mk-spec-memory-launcher.cjs`, `mk-code-index-launcher.cjs`) [REQ-004]
- [x] T008 tcp:// EADDRINUSE bounded retry/fallback on respawn (`socket-server.ts`) [REQ-005]
- [ ] T009 [P] (Optional) `socketReadyAt` readiness marker [REQ-007] — SKIPPED: optional/P1; the probe does not depend on it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Headless probe tests: alive→bridge, wedged (accepts-but-silent)→dead-within-timeout, connection-error→dead, dead→respawn verdict (4/4) [REQ-001/002] — LIVE kill/wedge/reconnect deferred
- [ ] T011 Concurrent-launcher slow-probe race → no duplicate spawn [REQ-003/004] — DEFERRED: single-winner verified by adversarial review (bootstrap-lock serialization + atomic wx + post-lock recheck); a live concurrent test needs running launchers
- [ ] T012 Healthy-reconnect latency unchanged; tcp:// respawn no crash [SC-002/REQ-005] — DEFERRED: happy-path bridge-on-reply covered headlessly; live latency + tcp respawn need a daemon
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 006 prerequisite met; P0 tasks (T003-T007) complete
- [x] No `[B]` blocked tasks remaining
- [x] dead/wedged classification + happy-path-bridge headless tests green (probe 4/4); live reconnect + concurrent race deferred (T011/T012)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prerequisite**: `../006-graceful-exit-watchdog` (child-pid lease)
- **Root cause + design**: See `../003-daemon-reliability-research/research/research.md` §6 + `research/iterations/iteration-003.md`
<!-- /ANCHOR:cross-refs -->
