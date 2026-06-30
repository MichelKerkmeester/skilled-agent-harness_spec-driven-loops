---
title: "Tasks: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp front proxy tasks"
  - "in-place recycle tasks"
  - "launcher session proxy tasks"
  - "transparent reconnect tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy"
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
# Tasks: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

**Phase 1 - In-place daemon recycle** (no transparency yet; the recycle stops exiting the launcher).

- [ ] T001 Rename `recycleViaGracefulSelfExit` to `recycleDaemonInPlace` (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T002 Delete both `process.exit(0)` calls at lines 697 and 710; keep the SIGTERM->SIGKILL ladder on `childProcess` (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T003 Stop setting `launcherShutdownInProgress = true` for the recycle path at line 679 so the supervisor guard at line 818 does not suppress relaunch (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T004 Reset `rssBreachSelfExitInProgress` after the supervisor relaunch instead of exiting; keep the hf-model-server teardown block (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T005 Wire `onBreach` at lines 728 and 740 to call `recycleDaemonInPlace` (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T006 Verify the child-exit supervisor (817-839) respawns the daemon and `daemon-ipc.sock` re-binds via EADDRINUSE unlink+rebind (mcp_server/lib/ipc/socket-server.ts reference)
- [ ] T007 Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green before Phase 2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Phase 2 - Launcher frame-proxy topology** (decouple lifetime; launcher owns the client session over the socket; recycle still severs).

- [ ] T008 Flip `launchServer` stdio to `['ignore','ignore','inherit']` at line 811 (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T009 Gate the primary `StdioServerTransport` behind `SPECKIT_BACKEND_ONLY` at lines 2067-2069 so the backend serves only via `startIpcSocketServer` (mcp_server/context-server.ts)
- [ ] T010 Build a minimal non-reconnecting proxy (cold-start probe + plain pipe) exposing `createSessionProxy({...}) -> { start(), stop() }` (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T011 Start the proxy on `process.stdin/stdout` after `launchServer()` (after line 961) against `resolveIpcSocketPath(dbDir)` (.opencode/bin/mk-spec-memory-launcher.cjs)
- [ ] T012 Cold-start probe-until-ready before flushing client frames, using `probeDaemon` deep-probe (cold start == reconnect path) (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T013 Verify MCP works end to end through the socket with the launcher as command; all four client configs connect (manual + opencode.json/.mcp.json/.claude/mcp.json/.vscode/mcp.json)
- [ ] T014 Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green before Phase 3
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Phase 3 - Transparent reconnect engine** (cached initialize, bidirectional frame parsing, REATTACHING buffering, replay).

- [ ] T015 Implement the bidirectional newline-frame splitter for both directions, mirroring `probeDaemon`'s proven parser (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T016 Implement `pendingRequests: Map<id,{frame, replayable}>` populated on client->backend `id` frames, cleared on backend->client `result|error` (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T017 Capture `cachedInitialize` by `method==='initialize'`, NOT by chunk position (handle coalesced initialize + initialized + first call in one chunk) (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T018 Implement the `CONNECTED -> REATTACHING -> CONNECTED` state machine that never exits on backend close; pause `process.stdin` during the gap to buffer client frames (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T019 Add the readiness gate: retry `probeDaemon(socketPath,{deepProbe:true})` with bounded backoff `[100,250,500,1000,1500]` (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T020 Re-handshake internally: open a fresh socket, send the cached `initialize`, consume the reply internally (not forwarded) (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T021 Replay `replayable:true` requests under their original `id`; synthesize `-32001 retryable` for `replayable:false`; then `process.stdin.resume()` (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T022 Frame-parse the backend->client direction and emit only complete frames; discard any incomplete trailing frame on backend close (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T023 Add a proxy assertion: if the re-handshake `protocolVersion` differs from the cached one, fail closed (synthesize errors + EOF) (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T024 Unit tests: coalesced frames -> 3 frames + cachedInitialize by method; truncated backend frame discarded; pendingRequests lifecycle (launcher-session-proxy.vitest)
- [ ] T025 Integration test (primary): RSS-recycle-mid-request - read-class transparently succeeds, `memory_delete` returns `-32001` exactly once; launcher pid unchanged, daemon pid changed, socket re-bound (launcher-reconnect.integration)
- [ ] T026 Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green before Phase 4
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Idle-monitor fix + safety hardening

**Phase 4 - keepalive, idle fix, idempotency classifier, partial-commit hardening, crash-loop bound.**

- [ ] T027 Add the backend keepalive emitter (~10s idle ping consumed by the proxy) so `secondary_clients_count` stays >= 1 and `onActivity` fires (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T028 Detach the idle monitor's stdin listener under `SPECKIT_BACKEND_ONLY` (pass `stdin: null`) (mcp_server/context-server.ts)
- [ ] T029 Add a `REATTACHING` grace window to `getActiveClientCount` (mcp_server/lib/ipc/launcher-idle-timeout.ts)
- [ ] T030 Implement `classify(frame)`: default-deny `memory_delete`, `memory_bulk_delete`, `memory_update`, `checkpoint_restore`, `checkpoint_delete`, `embedder_set`, `memory_retention_sweep`, `memory_ingest_start/cancel`; allow reads, dedup-guarded `memory_save`, and protocol frames (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T031 [P] Add the `classify` snapshot/table test over all current tools; fails if a new tool is added without classification (default-deny review) (launcher-session-proxy.vitest)
- [ ] T032 Tighten `memory_save` secondary-index atomicity to close the single-tenant partial-commit window (or add an idempotency token) (mcp_server/lib/session/session-manager.ts)
- [ ] T033 Bound proxy reattach attempts to the `crashLoopGuard` window (model-server-supervision.cjs:259-267); on exhaustion flush `-32001` to all pending then EOF (.opencode/bin/lib/launcher-session-proxy.cjs)
- [ ] T034 Integration tests: idle-during-reconnect not idle-killed; partial-commit replay -> exactly one row + one FTS + one vector; crash-loop graceful degrade; cold-start parity; second-launcher documented-limitation (launcher-reconnect.integration)
- [ ] T035 Add the SDK-invariant CI guard: pin SDK v1.26.x; grep-fail if `_onrequest` gains init-state gating or context-server adds `createMessage`/`elicitInput`/sampling (ci guard test)
- [ ] T036 Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green before Phase 5
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Flip default + completion gate

**Phase 5 - default flip, live proof, strict validate, deep-review.**

- [ ] T037 Decide and set the `SPECKIT_BACKEND_ONLY` default per spec.md open question (mcp_server/context-server.ts)
- [ ] T038 Live RSS-recycle-mid-request proof on the real launcher + daemon after a deliberate restart: drive the real watchdog via lowered `SPECKIT_RSS_CEILING_MB`; assert no client EOF, read transparent, `memory_delete` -> `-32001` once
- [ ] T039 Confirm all four client configs connect post-flip (opencode.json, .mcp.json, .claude/mcp.json, .vscode/mcp.json)
- [ ] T040 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` and reconcile completion metadata (spec status, checklist evidence, implementation-summary)
- [ ] T041 Mandatory post-implementation deep-review surfaces no P0/P1 before any completion claim
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Live RSS-recycle-mid-request proof passes (read transparent, `memory_delete` -> `-32001` once, launcher pid unchanged, daemon pid changed)
- [ ] All four client configs connect with no config edits
- [ ] Mandatory deep-review surfaces no P0/P1
- [ ] `validate.sh --strict` on this packet passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
