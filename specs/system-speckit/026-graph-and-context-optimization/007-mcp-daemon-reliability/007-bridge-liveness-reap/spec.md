---
title: "Feature Specification: Liveness-probe-before-bridge + reap-aware respawn (F3′ / RC-3)"
description: "The IPC bridge connects whenever the socket file exists (no liveness probe), so a dead or OOM-wedged daemon that left a stale socket gets bridged into — serving nothing and forcing a manual reconnect. This phase adds an application-level handshake probe before bridging and a reap-before-respawn path (child-pid lease + exclusive single-winner acquire), gated on phase 006."
trigger_phrases:
  - "bridge liveness probe F3"
  - "reap before respawn dead socket"
  - "ipc bridge handshake exclusive lease"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/007-bridge-liveness-reap"
    last_updated_at: "2026-05-28T23:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented probe+reap+single-winner; 3 review defects fixed; probe 4/4 green"
    next_safe_action: "Run live concurrent-launcher + kill/wedge/reconnect validation on a daemon"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000711"
      session_id: "007-007-bridge-liveness-reap-spec"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Raw accept-success mis-classifies an OOM-wedged daemon; an application-level JSON-RPC handshake is required"
      - "F3 must be gated on phase 006's child-pid lease (reap needs the daemon child pid, not the launcher pid)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Liveness-probe-before-bridge + reap-aware respawn (F3′ / RC-3)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (headless-verified; phase-006 gate satisfied; live reconnect/race deferred) |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-graceful-exit-watchdog |
| **Successor** | None |
| **Handoff Criteria** | Reconnect after a daemon death/wedge connects to a fresh, healthy daemon (no bridge-to-dead-socket, no double-daemon); gated on the phase-006 child-pid lease |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7 of 7** (final): the IPC-bridge liveness fix (F3′ in `003-daemon-reliability-research`, addressing RC-3).

**Scope Boundary**: Add an application-level liveness probe before bridging and a reap-aware, single-winner respawn on a confirmed-dead socket, in `launcher-ipc-bridge.cjs` + the two launchers' call sites. Does NOT change the embedding provider (005) or the RSS watchdog (006).

**Dependencies**:
- Design + adversarial verdict: `../003-daemon-reliability-research/research/research.md` §6.2-6.3 + `research/iterations/iteration-003.md` (F3 verdict).
- **Gated on phase 006**: reap-before-respawn needs the daemon CHILD pid recorded in the lease (phase 006 REQ-005) and a ported `processLiveness`; the launcher-pid lease alone cannot tell a dead daemon from a live launcher.

**Deliverables**:
- An application-level JSON-RPC handshake probe (throwaway connection) before bridging.
- Reap-before-respawn (SIGTERM→grace>5s→SIGKILL the child) + exclusive `wx` single-winner acquire on respawn.
- Async-converted bridge decision at both launchers' call sites with a duplicate-spawn guard.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`maybeBridgeLeaseHolder` (`launcher-ipc-bridge.cjs:97`) bridges whenever `fs.existsSync(socketPath)` is true (the gate at `:122`) with NO liveness probe; `bridgeStdioToSocket` (`:57`) then `net.createConnection`s. A SIGKILL/OOM'd daemon unlinks its socket only on graceful close (`socket-server.ts:195-204`), so it leaves a stale socket → the bridge connects to nothing → `onError` exits 0 serving no MCP → forced reconnect. The lease records the **launcher** pid (`mk-spec-memory-launcher.cjs:189-194`), so `process.kill(pid,0)` liveness passes even when the daemon is dead. And a naive respawn-on-dead-socket would never reap the old wedged daemon, doubling native RSS (and crashing on `tcp://` EADDRINUSE).

### Purpose
Before bridging, confirm the daemon actually services MCP (application-level handshake, not just a socket accept); on a confirmed-dead socket, reap the old daemon and respawn a single fresh one (cross-process single-winner), so a reconnect always lands on a healthy daemon.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Application-level handshake probe (concrete JSON-RPC request, throwaway connection) replacing the `existsSync`-only gate.
- Reap-before-respawn keyed on the phase-006 child-pid lease + ported `processLiveness`.
- Exclusive `wx` single-winner acquire on the respawn path + bootstrap-lock serialization.
- Async-converted `maybeBridgeLeaseHolder` + both launchers' call sites, with a duplicate-spawn guard.
- `tcp://` EADDRINUSE handling.

### Out of Scope
- Provider dispose (phase 005) and RSS watchdog (phase 006) - [separate phases; 006 is a prerequisite].
- The in-process `respawnInFlight` flag as the sole serializer - [insufficient: it cannot serialize two separate launcher processes; the `wx` acquire is the cross-process lock].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | Replace existsSync gate (`:122`) with an application-level handshake probe on a throwaway connection; return a `{bridge|respawn|report}` verdict; make `maybeBridgeLeaseHolder` (`:97`) async |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | await the async bridge decision at the lease-held branch (`:415`); reap-before-respawn via child-pid lease + processLiveness; exclusive `wx` acquire on respawn; duplicate-spawn guard |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | await the bridge decision at its call site (`:705`); reuse its existing `wx` owner-lease (`:261-275`) as the single-winner primitive |
| `mcp_server/lib/ipc/socket-server.ts` | Modify | `tcp://` EADDRINUSE handling (`:155`); (Unix unlink-and-relisten already at `:158-166`) |
| `mcp_server/context-server.ts` | Modify (optional) | Write a `socketReadyAt` readiness marker when `startIpcSocketServer` resolves (`:1986`) to distinguish 'starting' from 'dead' deterministically |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Application-level liveness probe before bridging (not raw accept) | Probe opens a THROWAWAY connection, sends a concrete minimal JSON-RPC request, and requires a valid reply within a bound before bridging; an OOM-wedged daemon (accepts at libuv but never services JSON-RPC) is classified dead, not bridged |
| REQ-002 | Reap-before-respawn: never spawn over a live/wedged daemon | On confirmed-dead socket, SIGTERM→grace(>5000ms)→SIGKILL the recorded daemon CHILD pid (from phase 006 lease) before spawning a replacement; a wedged-daemon test ends with exactly ONE daemon child |
| REQ-003 | Cross-process single-winner on respawn (not just an in-process flag) | Respawn acquires an exclusive `wx` lock (+ bootstrap lock); two launchers that both see a dead socket result in exactly ONE new daemon (a slow-probe race test shows no duplicate spawn) |
| REQ-004 | Both launchers await the async bridge decision with a duplicate-spawn guard | `maybeBridgeLeaseHolder` is async; both call sites `await` it and cannot fall through the early return into `launchServer` while a probe is pending |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `tcp://` transport EADDRINUSE is handled (not a crash) | On `tcp://`, a respawn does not crash on EADDRINUSE against a port the old (now-reaped) daemon held; or respawn falls back to report-only for tcp |
| REQ-006 | Gate on phase 006 (child-pid lease) | This phase's reap path is inert until the phase-006 `childPid` lease + ported `processLiveness` exist; documented + asserted |
| REQ-007 | Optional readiness marker disambiguates starting-vs-dead | If added, `socketReadyAt` is written by the daemon at `startIpcSocketServer` resolve to a named lease file; the probe uses it to avoid false-dead on a slow cold start |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reconnect after a daemon death/wedge connects to a fresh, healthy daemon — no bridge-to-dead-socket, no double-daemon, no forced second reconnect.
- **SC-002**: A healthy-daemon reconnect still bridges fast (the probe adds latency only on the failure path).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Respawn over a wedged daemon → two daemons / DB split-brain | High | REQ-002 reap-before-respawn + REQ-003 single-winner |
| Risk | Probe adds latency to the common healthy reconnect | Med | Bridge immediately on a valid handshake; retry/grace only on failure |
| Risk | Probe-then-bridge TOCTOU (daemon dies between probe and bridge) | Low | Degrades to today's onError exit-0; next launcher re-probes + respawns |
| Dependency | Phase 006 child-pid lease + processLiveness | High | REQ-006 gates this phase on 006 |
| Dependency | Live daemon for kill/wedge/reconnect verification | Med | Implement + verify in a live-daemon session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which concrete JSON-RPC method should the handshake send (a lightweight `ping`/`initialize`/`tools/list`) and what is the bound?
- Add the `socketReadyAt` readiness marker (REQ-007) now, or rely on the lease `startedAt` + grace window?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
