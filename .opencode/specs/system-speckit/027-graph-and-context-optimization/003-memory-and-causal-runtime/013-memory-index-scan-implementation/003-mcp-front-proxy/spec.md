---
title: "Feature Specification: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle"
description: "The MCP daemon RSS-recycles under load via process.exit(0), severing the client connection with no transparent reconnect. This packet makes the launcher a frame-aware reconnecting proxy and recycles the daemon child in place so an RSS recycle mid-request never breaks the client."
trigger_phrases:
  - "mcp front proxy"
  - "launcher reconnecting frame proxy"
  - "in-place daemon recycle"
  - "transparent mcp reconnect rss recycle"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored MCP front-proxy packet from judge-panel design"
    next_safe_action: "Land after checkpoint-v2 then dispatch Phase 1 in-place recycle"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - "mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mcp-front-proxy-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The Spec Kit Memory MCP daemon RSS-recycles under load: when resident memory crosses the ceiling, `recycleViaGracefulSelfExit` sets `launcherShutdownInProgress = true` and calls `process.exit(0)`, which exits the launcher that OpenCode spawned as the MCP `command`. That severs the client stdio pipe with no transparent reconnect, so the client sees its MCP server vanish (observed live: `mk_code_index` and `mk_skill_advisor` dropping; launcher pid churn). This packet keeps the launcher alive as a frame-aware reconnecting proxy that owns the client MCP session and recycles the daemon child in place, so an RSS recycle mid-request no longer breaks the client. In-flight read and idempotent-write requests are transparently replayed across the recycle; in-flight non-idempotent writes get a single retryable error instead of a double-apply or a dead pipe.

**Key Decisions**: Launcher-as-proxy over standalone-proxy (the launcher must stay the OpenCode `command` or nothing respawns it); in-place daemon recycle (delete the launcher `process.exit(0)`, let the existing supervisor respawn the child); frame-aware bidirectional parsing with an idempotency classifier for in-flight replay.

**Critical Dependencies**: The child-exit supervisor in `mk-spec-memory-launcher.cjs`, the `fatalShutdown` path that closes `ipcBridge` in `context-server.ts` (the reconnect trigger), the UDS socket server in `socket-server.ts`, and the verified MCP SDK leniencies that make replay transparent.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Under memory pressure the daemon recycles by exiting the launcher process. `recycleViaGracefulSelfExit` (`mk-spec-memory-launcher.cjs:676-711`) flips `launcherShutdownInProgress = true` (line 679) and calls `process.exit(0)` (lines 697/710). Because the launcher is the OpenCode MCP `command`, exiting it tears down the inherited stdio that carries the client MCP session, and the client's server simply disappears mid-session. There is no transparent reconnect: in-flight requests die, and the client must re-handshake (often it just drops the tool). The recycle is necessary for memory safety, but the current mechanism makes it client-visible and disruptive.

### Purpose
Make an RSS recycle survivable and transparent. Keep the launcher alive across a recycle, recycle the daemon child in place, and route the client MCP session through a frame-aware reconnecting proxy inside the launcher so that the client never sees a dropped pipe and in-flight work is replayed or safely failed, with no change to any of the four client configurations that spawn the launcher.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- In-place daemon recycle: delete the two `process.exit(0)` calls and stop setting `launcherShutdownInProgress` for the recycle path so the existing child-exit supervisor respawns the daemon in place.
- A frame-aware reconnecting proxy (`launcher-session-proxy.cjs`) inside the launcher that owns the client `stdin`/`stdout` for the launcher's whole life and bridges to the backend UDS socket.
- A transparent reconnect protocol: cache the verbatim `initialize`, frame-parse both directions, buffer client frames during the gap, probe the respawned daemon to handshake-readiness, replay the cached `initialize` internally, and replay safe in-flight requests.
- An idempotency classifier that marks each in-flight `tools/call` replayable or not, returning a single `-32001 retryable` error for non-idempotent writes instead of replaying them.
- The idle-monitor fix so the idle timeout cannot kill the respawned daemon during the reconnect gap.

### Out of Scope
- Multi-tenant or multi-client transparency. The second-launcher bridge path (`bridgeStdioToSocket`) is NOT wrapped; single-tenant production runs one client. Documented limitation, additive follow-up if ever needed.
- Any change to the RSS watchdog, crash-loop guard, backoff, or lease machinery in `model-server-supervision.cjs` and `main()` beyond the recycle and reconnect wiring.
- A `socket-server.ts` resume-preamble protocol. The backend is stateless per-connection, so a plain re-`initialize` suffices; no backend protocol change is made.
- The full partial-commit hardening of `memory_save` secondary indexes beyond the single-tenant one-write-wide window (tightened in the safety phase, not a redesign of the save path).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Create | The ~280 LOC frame-aware reconnecting proxy: bidirectional newline-frame splitter, `pendingRequests` map, `cachedInitialize`, `CONNECTED -> REATTACHING -> CONNECTED` state machine, `classify`, backend keepalive. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Flip `launchServer` stdio to `['ignore','ignore','inherit']` (line 811); start the proxy after `launchServer()` (after line 961); rename `recycleViaGracefulSelfExit` to `recycleDaemonInPlace`, delete both `process.exit(0)` (697/710), stop setting `launcherShutdownInProgress` for recycle (679); wire `onBreach` to the in-place recycle (728/740). |
| `mcp_server/context-server.ts` | Modify | Gate the primary `StdioServerTransport` behind `SPECKIT_BACKEND_ONLY` (2067-2069); apply the idle-monitor fix (2072-2077): detach the stdin listener under backend-only, tolerate a brief `REATTACHING` window in `getActiveClientCount`. |
| `mcp_server/lib/ipc/socket-server.ts` | Reference | EADDRINUSE unlink+rebind (199-208) and per-connection `Server` (133-175) are reused as-is; no change. |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Reference | `probeDaemon` deep-probe gate (184-192) and `bridgeStdioToSocket` (79-121) reused; no change. |
| `mcp_server/lib/ipc/launcher-idle-timeout.ts` | Reference/Modify | `getActiveClientCount` (98) and stdin activity (120) are the gap-3 surfaces the idle-monitor fix targets via context-server wiring. |
| `mcp_server/lib/session/session-manager.ts` | Reference | `shouldSendMemory` dedup (536-554) is the verified replay guard the classifier relies on; no change. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An RSS recycle mid-request does not sever the client. | During an in-flight `tools/call`, a forced recycle keeps the client socket open (no EOF), the launcher pid is unchanged, the daemon pid changes, and `daemon-ipc.sock` is re-bound. |
| REQ-002 | In-flight read and idempotent-write requests resolve transparently across a recycle. | A read-class `tools/call` in flight at recycle returns exactly one complete, valid result a few hundred ms later, with no client re-handshake. |
| REQ-003 | In-flight non-idempotent writes are not double-applied. | A `memory_delete` (or other classifier-denied tool) in flight at recycle returns exactly one `-32001` error with `data.retryable: true`, and is never replayed against the respawned backend. |
| REQ-004 | The recycle no longer exits the launcher. | `recycleDaemonInPlace` contains no `process.exit(0)`, does not set `launcherShutdownInProgress`, and the supervisor respawns the daemon child in place. |
| REQ-005 | All four client configs keep working unchanged. | `opencode.json`, `.mcp.json`, `.claude/mcp.json`, and `.vscode/mcp.json` still spawn the launcher as the MCP `command` with no edits, and each connects end to end through the socket. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The idle monitor cannot kill the respawned daemon during the reconnect gap. | With a very low idle timeout, a forced recycle does not idle-kill the respawned daemon: backend keepalive plus the `REATTACHING` grace hold `getActiveClientCount` >= 1. |
| REQ-007 | The backend-to-client direction is frame-parsed, never raw-piped. | A mid-frame backend death discards the incomplete trailing frame; the client stdout never receives a truncated JSON-RPC line, and the request stays in `pendingRequests` for replay or classify. |
| REQ-008 | The cached `initialize` is captured by method, not chunk position. | A coalesced `initialize` + `notifications/initialized` + first `tools/call` in one chunk yields three frames and a correctly captured `cachedInitialize`. |
| REQ-009 | Cold start uses the same path as reconnect. | On a cold start the proxy probes the daemon to readiness before flushing client frames, identical to the reconnect readiness gate. |
| REQ-010 | The proxy degrades gracefully on crash-loop. | When recycles exceed the `crashLoopGuard` window, the proxy bounds its reattach attempts, flushes `-32001` to all pending requests, and only then EOFs the client. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An RSS recycle triggered mid-request (real watchdog via a lowered `SPECKIT_RSS_CEILING_MB`, or a direct daemon SIGTERM) does NOT sever the client connection; the launcher pid is unchanged and the daemon pid changes across the event.
- **SC-002**: A read-class in-flight request transparently succeeds across the recycle; a `memory_delete` in-flight request returns exactly one `-32001 retryable` and is not double-applied.
- **SC-003**: All four client configs continue to spawn the launcher and connect through the socket with no config edits.
- **SC-004**: The idle monitor does not fire during a reconnect gap, and `validate.sh --strict` on this packet passes with a mandatory deep-review surfacing no P0/P1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child-exit supervisor (`mk-spec-memory-launcher.cjs:817-839`) | In-place recycle relies on it respawning the daemon after SIGTERM | Keep `launcherShutdownInProgress` false for recycle so the supervisor guard (line 818) does not suppress relaunch; reuse `computeBackoffMs`. |
| Dependency | `fatalShutdown` closing `ipcBridge` (`context-server.ts:1543-1546`) | This socket destroy is the proxy's reconnect trigger | Treat the socket `'close'` event as the canonical signal to enter `REATTACHING`. |
| Dependency | MCP SDK leniencies (v1.26.0) | Replay only works because `_onrequest` does not gate on `initialized` and context-server issues zero server->client requests | CI guard tests pin the SDK major and grep-fail if context-server adds `createMessage`/`elicitInput`/sampling; documented as load-bearing invariants in the proxy header. |
| Risk | Idle monitor kills the respawned daemon mid-reconnect | High | Backend keepalive keeps `secondary_clients_count` >= 1 and fires `onActivity`; detach the stdin listener under `SPECKIT_BACKEND_ONLY`; add a `REATTACHING` grace to `getActiveClientCount`. |
| Risk | Partial response frame corrupts the client stream | High | Frame-parse both directions; emit only complete frames to stdout; discard any incomplete trailing frame on backend close. |
| Risk | Non-idempotent in-flight write replayed twice | High | `classify()` default-deny set returns `-32001 retryable` for `memory_delete`/`bulk_delete`/`update`/`checkpoint_restore`/`embedder_set` instead of replaying. |
| Risk | `memory_save` partial-commit double-indexes secondary tables | Med | Graceful SIGTERM is durable via the clean-close barrier; only post-grace SIGKILL is exposed; safety phase tightens secondary-index atomicity, gated by the partial-commit replay test. |
| Risk | Protocol-version drift on a backend build swap during respawn | Low | Same-build respawn re-negotiates identically; proxy fails closed (synthesize errors + EOF) if the re-handshake `protocolVersion` differs from the cached one. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A transparent reconnect (one backoff + daemon relaunch ~250ms + handshake) must resolve well under typical MCP request timeouts, so read-class requests complete a few hundred ms later without client-visible failure.

### Security
- **NFR-S01**: The proxy must not weaken the backend's connection model; it remains a UDS client over the existing socket and introduces no new network-listening surface.

### Reliability
- **NFR-R01**: On crash-loop exhaustion the proxy must fail fast and clean: bound reattach attempts to the `crashLoopGuard` window, flush `-32001` to all pending requests, then EOF the client rather than hang silently.

---

## 8. EDGE CASES

### Data Boundaries
- Coalesced protocol frames: `initialize` + `notifications/initialized` + first `tools/call` arriving in one chunk must split into three frames; `cachedInitialize` is captured by `method`, never by chunk position.
- No in-flight request at recycle: the reconnect re-handshakes internally and resumes with an empty `pendingRequests` map; the client sees nothing.

### Error Scenarios
- Backend dies mid-frame: the partial backend->client frame is discarded incomplete and never reaches stdout; the originating request stays pending for replay or classify.
- Half-booted backend after respawn: `probeDaemon({deepProbe:true})` requires a JSON-RPC `initialize` reply, so a backend that accepts but never replies is treated as dead and retried, not handshaked against.

### Concurrent Operations
- Multiple client frames buffered during `REATTACHING`: `process.stdin` is paused so frames buffer in order, then flush in order to the new socket on `resume()`.
- Crash-loop: repeated recycles past the guard window bound the reattach attempts; all pending requests get `-32001` before the client is EOFed.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 1 new + 2 changed + reference surfaces, LOC: ~300 new I/O proxy plus wiring, Systems: launcher lifecycle, backend transport, idle monitor |
| Risk | 23/25 | Auth: N, API: N (no tool-schema change), Breaking: N (4 client configs unchanged), live client-session continuity and double-apply risk |
| Research | 8/20 | Architecture is code-verified by the judge panel; all cited line numbers and SDK leniencies confirmed |
| Multi-Agent | 6/15 | Single executor (cli-opencode gpt-5.5-fast) per phase, orchestrator-verified gates |
| Coordination | 10/15 | Four gated phases with strict typecheck plus test gate between each, plus a live RSS-recycle proof and a mandatory deep-review |
| **Total** | **65/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Idle monitor kills the respawned daemon during the reconnect gap | H | M | Backend keepalive + `REATTACHING` grace + detach stdin listener under backend-only; dedicated regression test. |
| R-002 | Partial response frame corrupts the client stream | H | M | Frame-parse both directions; emit only complete frames; discard incomplete trailing frame on close. |
| R-003 | Non-idempotent in-flight write replayed and double-applied | H | L | Classifier default-deny returns `-32001 retryable`; at most one in-flight write in single-tenant. |
| R-004 | `memory_save` partial-commit double-indexes secondary tables | M | L | Clean-close barrier makes graceful SIGTERM durable; safety phase tightens atomicity; gated by partial-commit test. |
| R-005 | Standalone-proxy topology would orphan the launcher (rejected design) | H | L | Keep the launcher as the OpenCode `command`; never move it; the recycle no longer exits it. |
| R-006 | SDK leniency regression silently breaks replay transparency | M | L | CI guard tests pin the SDK major and grep-fail on new reverse requests or init-state gating. |

---

## 11. USER STORIES

### US-001: Recycle survives an in-flight request (Priority: P0)

**As an** operator whose memory daemon recycles under load, **I want** an RSS recycle during an in-flight tool call to not break my MCP client, **so that** `mk_code_index` and `mk_skill_advisor` stop dropping mid-session.

**Acceptance Criteria**:
1. Given an in-flight read-class `tools/call`, When a recycle is forced, Then the client socket never EOFs, the call returns exactly one complete result, the launcher pid is unchanged, and the daemon pid changed.

### US-002: Unsafe in-flight write fails once, not twice (Priority: P0)

**As an** operator, **I want** an in-flight non-idempotent write at recycle time to fail once with a retryable error rather than be silently replayed, **so that** a recycle never double-applies a destructive operation.

**Acceptance Criteria**:
1. Given an in-flight `memory_delete`, When a recycle is forced, Then the client receives exactly one `-32001` error with `data.retryable: true`, and the delete is not replayed against the respawned backend.

---

## 12. OPEN QUESTIONS

- Should `SPECKIT_BACKEND_ONLY` ship default-on in this packet's final phase, or stay opt-in for one release while the live RSS-recycle proof accumulates soak time?
- Should the backend keepalive interval (~10s in the design) be configurable, or is a fixed interval sufficient given the idle-timeout defaults?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
