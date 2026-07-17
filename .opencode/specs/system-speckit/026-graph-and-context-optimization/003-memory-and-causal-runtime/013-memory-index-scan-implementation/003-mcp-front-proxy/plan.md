---
title: "Implementation Plan: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle"
description: "Recycle the daemon child in place (delete the launcher process.exit), make the launcher a frame-aware reconnecting proxy that owns the client stdio, and add transparent reconnect with handshake replay, an idle-monitor fix, and an idempotency classifier. Lands after checkpoint-v2 (002) since both touch context-server.ts."
trigger_phrases:
  - "mcp front proxy plan"
  - "in-place recycle phases"
  - "launcher session proxy phases"
  - "transparent reconnect idempotency classifier"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy"
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
# Implementation Plan: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CJS launcher (`.cjs`) plus TypeScript MCP server (better-sqlite3) |
| **Framework** | Spec Kit Memory MCP server over a Unix domain socket; MCP SDK v1.26.0 |
| **Storage** | Unchanged: SQLite main DB plus `active_vec` shard (no persistence change here) |
| **Testing** | Vitest plus node unit tests for the proxy (`npm run typecheck`, `npm run test:core`) plus a live RSS-recycle integration proof |

### Overview
Stop the recycle from exiting the launcher. Recycle the daemon child in place so the existing child-exit supervisor respawns it, and move the client MCP session off inherited stdio onto a frame-aware reconnecting proxy that lives inside the launcher. The proxy owns the client `stdin`/`stdout`, frame-parses both directions, caches the verbatim `initialize`, and on a recycle re-handshakes internally and replays safe in-flight requests. A backend keepalive plus an idle-monitor fix keep the respawned daemon alive during the reconnect gap, and an idempotency classifier returns a single retryable error for unsafe in-flight writes. No client config changes; the launcher stays the OpenCode `command`.

> **Sequencing**: This packet lands AFTER `002-checkpoint-v2-file-snapshot`, because both edit `context-server.ts` (002 touches `fatalShutdown`/restore wiring; this packet gates the transport and idle monitor). Sequencing avoids a merge collision on the same file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (see `spec.md`)
- [ ] Success criteria measurable (SC-001..SC-004)
- [ ] Dependencies identified (child-exit supervisor, `fatalShutdown` ipcBridge close, SDK leniencies)
- [ ] Sequencing recorded: lands after checkpoint-v2 (002) due to shared `context-server.ts`

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-010)
- [ ] `npm run typecheck` shows 0 new errors and `npm run test:core` is green per phase
- [ ] Live RSS-recycle-mid-request proof passes (read transparent, `memory_delete` returns `-32001` once)
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [ ] Mandatory deep-review surfaces no P0/P1
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Session front-proxy plus disposable backend. The launcher remains the OpenCode `command` and becomes the durable session front: it owns the client pipe for its whole life and bridges to a recycle-surviving daemon child over a UDS socket. The daemon is stateless per-connection and is recycled in place; the launcher reconstructs the session by replaying a cached `initialize`.

### Key Components
- **`launcher-session-proxy.cjs` (new)**: `createSessionProxy({ socketPath, stdin, stdout, probe, connect, log, classify }) -> { start(), stop() }`. Holds the bidirectional newline-frame splitter, `pendingRequests: Map<id,{frame, replayable}>`, `cachedInitialize`, the `CONNECTED -> REATTACHING -> CONNECTED` state machine, the `classify` idempotency boundary, and the backend keepalive emitter.
- **`recycleDaemonInPlace` (`mk-spec-memory-launcher.cjs`)**: the renamed recycle that SIGTERMs the daemon child but does NOT exit the launcher and does NOT set `launcherShutdownInProgress`, so the supervisor respawns the child.
- **Backend transport gate (`context-server.ts`)**: the primary `StdioServerTransport` is gated behind `SPECKIT_BACKEND_ONLY`; the daemon serves only over `startIpcSocketServer`.
- **Idle-monitor fix (`context-server.ts` + `launcher-idle-timeout.ts`)**: keepalive plus a `REATTACHING` grace in `getActiveClientCount`, and the stdin activity listener detached under backend-only.

### Data Flow
Steady state: the proxy owns client `stdin`/`stdout` over one persistent UDS socket. Each client->backend frame is parsed for its `id`, stored in `pendingRequests` with a `replayable` flag from `classify`, and written to the socket; each backend->client frame is parsed and, on `result|error`, cleared from `pendingRequests` before the complete frame is written to stdout. On an RSS breach the daemon SIGTERMs and `fatalShutdown` closes `ipcBridge`, destroying the proxy socket; the proxy enters `REATTACHING`, pauses `process.stdin`, probes the respawned daemon to handshake-readiness, replays the cached `initialize` internally, replays `replayable:true` requests, returns `-32001 retryable` for the rest, then resumes the stdin stream.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet changes process-lifetime semantics and the client I/O path, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-spec-memory-launcher.cjs` recycle | Exits the launcher on RSS breach (`process.exit(0)`) | update (rename to `recycleDaemonInPlace`, delete exits, keep flag false) | Forced-recycle test: launcher pid unchanged, daemon pid changed, supervisor respawns |
| `mk-spec-memory-launcher.cjs` `launchServer` stdio | `stdio: 'inherit'` makes child stdio the MCP channel | update (`['ignore','ignore','inherit']`) | MCP works end to end through the socket; child stderr still tagged to launcher |
| `mk-spec-memory-launcher.cjs` `main()` boot | Spawns the server | update (start `createSessionProxy` after `launchServer()`) | Cold-start probe-until-ready before first client frame flush |
| `context-server.ts` primary transport | Binds `StdioServerTransport` on stdin/stdout | update (gate behind `SPECKIT_BACKEND_ONLY`) | Backend serves only via socket; four client configs still connect |
| `context-server.ts` idle monitor | Idle-kills the daemon | update (keepalive + `REATTACHING` grace + detach stdin listener) | Idle-during-reconnect regression test does not idle-kill |
| `launcher-session-proxy.cjs` | NEW | create | Unit + integration suites below |
| `socket-server.ts`, `launcher-ipc-bridge.cjs`, `model-server-supervision.cjs` | Socket server, probe, watchdog | unchanged (reference only) | grep confirms no edits |

Required inventories:
- Same-class producers: `rg -n 'process.exit|launcherShutdownInProgress|recycleViaGracefulSelfExit' .opencode/bin/mk-spec-memory-launcher.cjs`.
- Consumers of changed symbols: `rg -n 'recycleViaGracefulSelfExit|recycleDaemonInPlace|SPECKIT_BACKEND_ONLY|getActiveClientCount|StdioServerTransport' . --glob '*.cjs' --glob '*.ts' --glob '*.md'`.
- Matrix axes: request class (read, idempotent-write, non-idempotent-write) x recycle trigger (RSS-ceiling watchdog, direct SIGTERM) x backend state (booting, ready, wedged) - list required rows before implementation.
- Algorithm invariant: the client socket never EOFs while the proxy is attached and below the crash-loop bound; only complete frames reach client stdout; non-idempotent in-flight writes are never replayed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Every phase is gated: `npm run typecheck` (0 new errors) plus `npm run test:core` (green) before the next phase starts. Phase 0 is this packet setup, done by the orchestrator, not the executor.

### Phase 1: In-place daemon recycle (no transparency yet)
- [ ] Rename `recycleViaGracefulSelfExit` to `recycleDaemonInPlace` (`mk-spec-memory-launcher.cjs:676-711`)
- [ ] Delete both `process.exit(0)` calls (lines 697, 710); keep the SIGTERM->SIGKILL ladder on `childProcess`
- [ ] Stop setting `launcherShutdownInProgress = true` for the recycle path (line 679) so the supervisor guard (line 818) does not suppress relaunch
- [ ] Reset `rssBreachSelfExitInProgress` after the supervisor relaunch instead of exiting; keep the hf-model-server teardown block (683-693)
- [ ] Wire `onBreach` (728, 740) to `recycleDaemonInPlace`
- [ ] Verify the existing child-exit supervisor (817-839) respawns the daemon and `daemon-ipc.sock` re-binds (socket-server.ts EADDRINUSE rebind 199-208)

### Phase 2: Launcher frame-proxy owning client stdio
- [ ] Flip `launchServer` stdio to `['ignore','ignore','inherit']` (line 811)
- [ ] Gate the primary `StdioServerTransport` behind `SPECKIT_BACKEND_ONLY` (context-server.ts:2067-2069); backend serves only via `startIpcSocketServer`
- [ ] Build a minimal non-reconnecting proxy (cold-start probe + plain pipe) and start it on `process.stdin/stdout` after `launchServer()` (after line 961), against `resolveIpcSocketPath(dbDir)`
- [ ] First job: cold-start probe-until-ready before flushing client frames (cold start == reconnect path)
- [ ] Exit criteria: MCP works end to end through the socket with the launcher as command; recycle still severs (no engine yet) but the topology is proven

### Phase 3: Transparent reconnect engine
- [ ] Build `launcher-session-proxy.cjs` full: bidirectional newline-frame splitter (mirror `probeDaemon`'s proven parser)
- [ ] `pendingRequests: Map<id,{frame, replayable}>` populated on client->backend `id` frames, cleared on backend->client `result|error`
- [ ] `cachedInitialize` captured by `method==='initialize'`, NOT by chunk position
- [ ] `CONNECTED -> REATTACHING -> CONNECTED` state machine that never exits on backend close; pause `process.stdin` during the gap
- [ ] Readiness gate: retry `probeDaemon(socketPath,{deepProbe:true})` with bounded backoff `[100,250,500,1000,1500]`
- [ ] Re-handshake: open a fresh socket, send the cached `initialize`, consume the reply internally (not forwarded)
- [ ] Replay `replayable:true` requests under their original `id`; synthesize `-32001 retryable` for `replayable:false`; resume stdin
- [ ] Frame-parse the backend->client direction (never raw-pipe); discard incomplete trailing frames on close

### Phase 4: Idle-monitor fix + safety hardening
- [ ] Add the backend keepalive emitter (~10s idle) so `secondary_clients_count` stays >= 1 and `onActivity` fires
- [ ] Detach the idle monitor's stdin listener under `SPECKIT_BACKEND_ONLY` (pass `stdin: null`); add a `REATTACHING` grace to `getActiveClientCount` (launcher-idle-timeout.ts:98)
- [ ] Build the idempotency `classify(frame)`: default-deny the verified-unsafe set, allow reads plus dedup-guarded `memory_save` plus protocol frames
- [ ] Tighten `memory_save` secondary-index atomicity to close the single-tenant partial-commit window (or add an idempotency token), gated by the partial-commit replay test
- [ ] Bound proxy reattach attempts to the `crashLoopGuard` window (model-server-supervision.cjs:259-267); on exhaustion flush `-32001` to all pending then EOF

### Phase 5: Flip default + completion gate
- [ ] Decide and set `SPECKIT_BACKEND_ONLY` default (per spec.md open question)
- [ ] Run the live RSS-recycle-mid-request proof on the real launcher + daemon
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`; reconcile completion metadata
- [ ] Mandatory deep-review surfaces no P0/P1
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (proxy, no real daemon) | Frame splitter (coalesced frames -> 3 frames, `cachedInitialize` by method), truncated-frame discard, `classify` table over all tools, `pendingRequests` lifecycle | Node unit / Vitest |
| Integration (real launcher + daemon over UDS) | RSS-recycle-mid-request (read transparent, `memory_delete` -> `-32001` once), idle-during-reconnect, partial-commit replay, crash-loop give-up, cold-start parity, second-launcher documented-limitation | Live launcher + daemon + `memory_health` |
| SDK-invariant guards | Pin SDK v1.26.x; grep-fail build if `_onrequest` gains init-state gating or context-server adds server->client requests | CI grep guard |
| Regression | All existing daemon/launcher tests stay green; four client configs connect | Vitest + manual connect |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child-exit supervisor (`mk-spec-memory-launcher.cjs:817-839`) | Internal | Green | In-place recycle cannot respawn the daemon |
| `fatalShutdown` ipcBridge close (`context-server.ts:1543-1546`) | Internal | Green | No reconnect trigger for the proxy |
| `probeDaemon` deep-probe (`launcher-ipc-bridge.cjs:184-192`) | Internal | Green | No handshake-level readiness gate |
| MCP SDK v1.26.0 leniencies | External (pinned) | Green | Replay transparency assumptions break |
| `002-checkpoint-v2-file-snapshot` landing first | Internal (sequencing) | Pending | Merge collision on `context-server.ts` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A recycle severs the client after the change, the proxy corrupts the client stream, or any of the four client configs stop connecting.
- **Procedure**: Because the change is gated behind `SPECKIT_BACKEND_ONLY` and the proxy is additive, set `SPECKIT_BACKEND_ONLY` off to fall back to inherited-stdio behavior, then revert per-phase commits in reverse order. Restoring the two `process.exit(0)` calls returns the original recycle-by-exit behavior. No persistent data is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (in-place recycle) ──► Phase 2 (frame-proxy) ──► Phase 3 (reconnect engine) ──► Phase 4 (idle + safety) ──► Phase 5 (flip + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None (after 002 lands) | Phase 2 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 2 | Phase 4 |
| Phase 4 | Phase 3 | Phase 5 |
| Phase 5 | Phase 4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: in-place recycle | Med | 2-3 hours |
| Phase 2: frame-proxy topology | High | 4-6 hours |
| Phase 3: transparent reconnect engine | High | 6-8 hours |
| Phase 4: idle fix + safety hardening | High | 4-6 hours |
| Phase 5: flip default + live proof + gate | Med | 3-4 hours |
| **Total** | | **19-27 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `002-checkpoint-v2-file-snapshot` merged to main; recovery-baseline hash recorded (RM-8 L3)
- [ ] Worktree node_modules symlinks in place (`mcp_server/node_modules`, `system-spec-kit/node_modules`, `system-spec-kit/shared/dist`)
- [ ] No `npm run build` while the daemon is live; typecheck only until the deliberate restart

### Rollback Procedure
1. Stop dispatching; `pkill -9 -f "opencode run"` between dispatches.
2. Set `SPECKIT_BACKEND_ONLY` off to restore inherited-stdio behavior immediately.
3. Revert the offending per-phase commit on `main` (restore `process.exit(0)` for a full revert of the recycle change).
4. Re-run `npm run typecheck` plus `npm run test:core` to confirm green; reconnect all four client configs.

### Data Reversal
- **Has data migrations?** No - this packet changes process lifetime and I/O routing only, no schema or persistence change.
- **Reversal procedure**: None required; revert code and toggle the env flag.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Phase 1   │──►│   Phase 2   │──►│   Phase 3   │──►│   Phase 4   │──►│   Phase 5   │
│ in-place    │   │ frame-proxy │   │ reconnect   │   │ idle+safety │   │ flip+proof  │
│ recycle     │   │ topology    │   │ engine      │   │             │   │             │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| In-place recycle | 002 landed | `recycleDaemonInPlace`, supervisor respawn | Frame-proxy |
| Frame-proxy topology | In-place recycle | stdio flip, `SPECKIT_BACKEND_ONLY` gate, minimal proxy | Reconnect engine |
| Reconnect engine | Frame-proxy | `launcher-session-proxy.cjs`, replay, cached initialize | Idle + safety |
| Idle + safety | Reconnect engine | keepalive, grace, `classify`, crash-loop bound | Flip + proof |
| Flip + proof | Idle + safety | default flip, live RSS-recycle proof | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 - in-place recycle** - 2-3 hours - CRITICAL
2. **Phase 2 - frame-proxy topology** - 4-6 hours - CRITICAL
3. **Phase 3 - transparent reconnect engine** - 6-8 hours - CRITICAL
4. **Phase 4 - idle fix + safety hardening** - 4-6 hours - CRITICAL
5. **Phase 5 - flip default + live proof + gate** - 3-4 hours - CRITICAL

**Total Critical Path**: 19-27 hours

**Parallel Opportunities**:
- Proxy unit tests (frame splitter, `classify` table) can be written alongside Phase 3 implementation.
- The SDK-invariant CI guard tests can be added at any point once Phase 2 lands.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Recycle no longer exits the launcher | Forced recycle keeps launcher pid, respawns daemon, re-binds socket | End Phase 1 |
| M2 | Launcher owns the client session over the socket | MCP works end to end through the socket; four client configs connect | End Phase 2 |
| M3 | Transparent reconnect works | Recycle mid-request resolves read transparently or returns `-32001` for unsafe writes | End Phase 3 |
| M4 | Idle-safe and double-apply-safe | Idle monitor cannot fire during reconnect; classifier verified; save replay single-apply | End Phase 4 |
| M5 | Live-proven and gated | Live RSS-recycle proof passes; deep-review clean; validate strict passes | End Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Full ADRs live in `decision-record.md`. Summary:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Launcher-as-proxy over standalone-proxy and over bridge-reconnect | The launcher must stay the OpenCode `command`; moving it orphans it with no supervisor. |
| ADR-002 | In-place daemon recycle | Delete the launcher `process.exit(0)` so the existing child-exit supervisor respawns the daemon; minimal survivable change. |
| ADR-003 | Frame-aware bidirectional parsing + idempotency classifier | Byte-level piping leaks truncated frames; default-deny replay prevents double-applying non-idempotent writes. |

---

## EXECUTOR DISPATCH CONTRACT

Per-phase code implementation runs through cli-opencode, model `openai/gpt-5.5-fast --variant high`, fast tier. The orchestrator verifies each gate and owns all git writes.

- Dispatch: `AI_SESSION_CHILD=1 opencode run --model openai/gpt-5.5-fast --variant high --agent general --format json --dir <worktree> "<prompt>" </dev/null`
- RM-8 four-layer safeguards (cli-opencode SKILL.md ALWAYS rule 13): (L1) rendered prompt carries literal `BANNED OPERATIONS` plus `ALLOWED WRITE PATHS`; (L2) `--dir` is a fresh `git worktree`, not the live tree; (L3) main committed plus recovery-baseline hash recorded; (L4) gpt-5.5 chosen for instruction-following.
- Worktree node_modules gotcha (013 handover): three symlinks required - `mcp_server/node_modules`, `system-spec-kit/node_modules`, `system-spec-kit/shared/dist` - or `tsc` fails resolving `@spec-kit/shared/types`.
- Build-while-live: never `npm run build` (emits to `dist/` that the live daemon reloads). Typecheck is `npm run typecheck` (`tsc --noEmit`) only; daemon restart is a deliberate final step.
- `pkill -9 -f "opencode run"` between dispatches; treat `TS5101 baseUrl deprecated` in clean worktrees as pre-existing noise (count only new errors).
- Sequencing: do NOT dispatch Phase 1 until `002-checkpoint-v2-file-snapshot` is merged to main, because both edit `context-server.ts`.
