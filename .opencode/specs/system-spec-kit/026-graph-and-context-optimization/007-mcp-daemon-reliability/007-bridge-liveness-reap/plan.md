---
title: "Implementation Plan: Liveness-probe-before-bridge + reap-aware respawn (F3′)"
description: "Add an application-level handshake probe before bridging and a reap-before-respawn path (child-pid lease + exclusive wx single-winner), with both launchers awaiting the async bridge decision."
trigger_phrases:
  - "bridge liveness plan F3"
  - "reap before respawn plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/007-bridge-liveness-reap"
    last_updated_at: "2026-05-28T21:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored F3′ plan (handshake probe + reap + wx lock) verified by Opus pass"
    next_safe_action: "Implement after phase 006 child-pid lease; live-daemon verification"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000712"
      session_id: "007-007-plan"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Liveness-probe-before-bridge + reap-aware respawn (F3′)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.cjs` launcher + bridge (CommonJS) |
| **Framework** | mk-spec-memory / mk_code_index MCP launchers + IPC bridge |
| **Storage** | Filesystem lease JSON + unix/tcp socket |
| **Testing** | vitest (mock socket server + concurrent-launcher race) |

### Overview
Replace the bridge's `existsSync`-only gate with an application-level JSON-RPC handshake probe on a throwaway connection; only bridge on a valid reply. On a confirmed-dead socket, reap the recorded daemon child pid (from phase 006), then respawn exactly one fresh daemon behind an exclusive `wx` lock. Make `maybeBridgeLeaseHolder` async and await it at both launchers' call sites with a duplicate-spawn guard.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (phase 006 child-pid lease; 003 §6.3, iter-3 F3 verdict)

### Definition of Done
- [ ] Handshake probe + reap-before-respawn + wx single-winner land
- [ ] Both launchers await the async decision (no duplicate spawn)
- [ ] dead/wedged-daemon reconnect + concurrent-launcher tests pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Probe→verdict→(bridge | reap+single-winner-respawn | report); the bridge stays a stateless decision/transport helper, the launcher owns spawning.

### Key Components
- **`probeDaemon(socketPath)`**: throwaway connection + minimal JSON-RPC request + bounded reply → alive/dead/timeout.
- **`maybeBridgeLeaseHolder` (async)**: returns `{action: bridge|respawn|report}`.
- **Reap**: SIGTERM→grace(>5000ms)→SIGKILL the lease `childPid` (phase 006) via ported `processLiveness`.
- **Single-winner**: exclusive `wx` acquire (mk-code-index precedent) + bootstrap lock; in-process `respawnInFlight` is intra-process only.

### Data Flow
reconnect → lease held → probe daemon → alive: bridge; dead (lease old enough / readiness marker): reap child → wx-acquire → launchServer; the loser of a concurrent race exits cleanly via the post-lease reprobe.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `launcher-ipc-bridge.cjs` maybeBridgeLeaseHolder (97) / existsSync gate (122) / bridgeStdioToSocket (57) / onError (75-78,128-133) | Bridges on file-exists; exits 0 on refusal | add handshake probe; return verdict; async | wedged-daemon test → not bridged |
| `mk-spec-memory-launcher.cjs` lease-held branch (415) / bootstrap lock (321-341) / writeLeaseFile | Returns after bridge; last-writer lease | await verdict; reap+wx respawn; duplicate-spawn guard | concurrent-launcher test → one daemon |
| `mk-code-index-launcher.cjs` wx owner-lease (261-275) / call site (705) | Has exclusive `wx` already | reuse `wx`; await verdict | reuse precedent |
| `socket-server.ts` accept callback (107-149) / EADDRINUSE (155) / unlink (195-204) | Accepts; rethrows tcp EADDRINUSE | tcp EADDRINUSE handling | tcp respawn no crash |
| `context-server.ts` startIpcSocketServer (1986) | Creates socket post-connect | optional `socketReadyAt` marker | starting≠dead disambiguation |

Invariant: never bridge to a daemon that does not service JSON-RPC; never spawn over a live/wedged daemon; at most one new daemon per dead-socket event.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 006 child-pid lease + `processLiveness` available (REQ-006 gate)
- [ ] Choose the handshake JSON-RPC method + bound

### Phase 2: Core Implementation
- [ ] `probeDaemon` handshake on throwaway connection; verdict-returning async `maybeBridgeLeaseHolder` (REQ-001/004)
- [ ] Reap-before-respawn via child-pid lease + grace>5000 (REQ-002)
- [ ] Exclusive `wx` single-winner acquire + bootstrap lock; await at both call sites; duplicate-spawn guard (REQ-003/004)
- [ ] tcp:// EADDRINUSE handling (REQ-005)

### Phase 3: Verification
- [ ] Dead-socket / OOM-wedged-daemon reconnect tests (no bridge-to-dead, one daemon)
- [ ] Concurrent-launcher slow-probe race test (no duplicate spawn)
- [ ] Healthy-reconnect latency unchanged
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | probe verdict (alive/dead/wedged-accept-but-no-reply) | vitest + mock socket server |
| Unit | single-winner under concurrent dead-socket launchers | vitest |
| Manual | kill/wedge daemon → reconnect lands on fresh daemon | live daemon + /mcp |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 child-pid lease + processLiveness | Internal | Pending | Reap path inert without it (REQ-006) |
| Live daemon for kill/wedge verification | Internal | Yellow | SC-001 needs a running daemon |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Probe false-negatives kill healthy daemons, or respawn races.
- **Procedure**: `SPECKIT_BRIDGE_RESPAWN_DISABLED=1` (mirror the existing `SPECKIT_LAUNCHER_BRIDGE_DISABLED` escape hatch) reverts to report-only/exit-0 behavior; then `git revert` the probe/respawn change. The async-decision refactor is the only cross-file piece to unwind.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
