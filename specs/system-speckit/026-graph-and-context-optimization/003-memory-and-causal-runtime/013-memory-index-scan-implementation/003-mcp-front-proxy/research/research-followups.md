# MCP Front Proxy Follow-up Implementation Designs

## Summary

This synthesis covers four deferred follow-ups from the merged MCP front-proxy and checkpoint-v2 work. It is based on current main code reads only. No source files were modified.

Recommended order:

1. Re-handshake protocol-version drift.
2. Multi-client reconnect transparency.
3. `memory_save` replay enrichment repair.
4. Checkpoint-v2 `.needs-rebuild` sentinel, deferred unless checkpoint restore hardening is active.

## 1. Multi-client Reconnect Transparency

### Current Gap

Second and later launchers still route through the raw bridge. `bridgeStdioToSocket()` creates one socket, pipes stdin/stdout, destroys the socket, and exits on close/error (`launcher-ipc-bridge.cjs:79-121`). The lease-held path calls that bridge after a successful liveness probe (`launcher-ipc-bridge.cjs:304-356`). `mk-spec-memory-launcher.cjs:933-938` returns after that lease-held bridge path.

The primary launcher already uses `createSessionProxy()` (`mk-spec-memory-launcher.cjs:973-979`). That means only the lease-holder client's session reconnects transparently today.

### Options And Trade-offs

| Option | Trade-off |
|---|---|
| Change the shared raw bridge globally | Too broad. `launcher-ipc-bridge.cjs` is also used by code-index and skill-advisor launchers. They do not share the same replay classifier guarantees. |
| Inject a reconnecting bridge only for `mk-spec-memory` | Recommended. Minimal, scoped, preserves client command configs. |
| Move reconnect to the backend IPC server | Wrong ownership. The backend server does not own client stdio or per-client cached initialize state. |

### Recommended Approach

Inject `createSessionProxy()` into the `mk-spec-memory` lease-held bridge path only.

Concrete changes:

| File | Concrete change |
|---|---|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs:350-355` | Change the bridge call to `await Promise.resolve(bridgeToSocket(socketPath, { onError }))` so async injected bridges are supported while raw bridges remain valid. |
| `.opencode/bin/mk-spec-memory-launcher.cjs:407-414` | Pass `bridge: bridgeStdioThroughSessionProxy` into `maybeBridgeLeaseHolder()` for `serviceName: 'mk-spec-memory'`. |
| `.opencode/bin/mk-spec-memory-launcher.cjs:407-419` | Keep respawn handling unchanged for `{ action: 'respawn' }`. Only the successful bridge action changes. |
| `.opencode/bin/mk-spec-memory-launcher.cjs:973-979` | Reuse the same `createSessionProxy()` options shape as the primary launcher. |

Each bridged client needs its own proxy instance. `createSessionProxy()` owns per-client `pendingRequests`, cached initialize state, queues, splitters, and keepalive state (`launcher-session-proxy.cjs:271-313`). A shared proxy would mix JSON-RPC IDs across clients. This matches the IPC server model: every secondary socket gets its own MCP `Server` and transport (`context-server.ts:2100-2106`, `socket-server.ts:157-160`).

Lease/bridge handshake behavior:

1. Keep the existing lease-holder deep probe (`launcher-ipc-bridge.cjs:337-347`).
2. If the probe is dead, preserve the existing respawn decision.
3. If the probe is alive, start a per-client session proxy.
4. The proxy forwards the client's first initialize normally and caches it.
5. On daemon recycle, the proxy reattaches and internally replays cached initialize before replaying safe pending requests (`launcher-session-proxy.cjs:551-568`).

Back-compat:

No client config changes are required. The command remains `.opencode/bin/mk-spec-memory-launcher.cjs`; stdin/stdout remain the MCP transport for OpenCode, Claude/Codex-style MCP configs, Gemini configs, and manual launcher usage.

### Risks

| Risk | Mitigation |
|---|---|
| Async bridge returns before proxy starts. | Await bridge return in `maybeBridgeLeaseHolder()`. |
| Other services get replay behavior accidentally. | Keep raw bridge default; inject proxy bridge only in `mk-spec-memory-launcher.cjs`. |
| Secondary launcher tries to become daemon owner after bridge start. | Do not add respawn after bridge start; lease holder owns backend lifecycle. |
| Diagnostic output corrupts MCP stream. | Avoid stdout diagnostics after proxy owns stdout; let proxy emit JSON-RPC errors for MCP failures. |

### Test Strategy

1. `launcher-ipc-bridge-probe.vitest.ts`: async bridge override is awaited.
2. `launcher-session-proxy.vitest.ts`: second-client proxy replays a pending safe request after socket close and fresh attach.
3. Launcher test: `mk-spec-memory` passes proxy bridge override while code-index and skill-advisor continue using raw bridge default.

### Worth Doing Now

Yes. Medium effort, medium risk. It completes the front-proxy design for 2nd+ clients and removes a known user-visible recycle severance.

## 2. `memory_save` Replay Enrichment Window

### Current Gap

`memory_save` dedup can return before enrichment repair (`memory-save.ts:2333-2343`, `memory-save.ts:2487-2497`). The primary row is committed in `writeTransaction.immediate()` (`memory-save.ts:2500-2604`). Post-insert enrichment runs afterward (`memory-save.ts:2648-2655`).

A post-grace kill between those phases leaves the primary row present but enrichment skipped. Replay returns `unchanged` (`dedup.ts:268-279`) or `duplicate` (`dedup.ts:330-351`) and never repairs the secondary enrichment.

### Options And Trade-offs

| Option | Trade-off |
|---|---|
| Put enrichment in the primary transaction | Avoids marker but holds SQLite writer through async/entity/summary/graph work. Not recommended. |
| Durable marker plus replay repair | Recommended. Keeps current latency model and repairs exactly the replay hole. |
| Scan-only backfill | Useful as a safety net, but does not fix immediate replay idempotency. |

### Recommended Approach

Add a durable enrichment-completion marker and repair incomplete markers on dedup replay.

Concrete changes:

| File | Concrete change |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:427` | Bump `SCHEMA_VERSION` from `29` to `30`. |
| `vector-index-schema.ts:2408-2470` | Add fresh schema columns: `post_insert_enrichment_status`, `post_insert_enrichment_state`, `post_insert_enrichment_completed_at`, `post_insert_enrichment_version`. |
| `vector-index-schema.ts:439-599` and latest migration block | Add idempotent v30 migration and pending-status partial index. |
| New `handlers/save/enrichment-state.ts` | Add marker helpers: mark pending, record result, check repair need, repair replay, bounded backlog repair. |
| `memory-save.ts:2333-2343` | If `duplicatePrecheck` returns a row id, run replay repair before returning. |
| `memory-save.ts:2487-2497` | If `dupResult` returns a row id, run replay repair before returning. |
| `memory-save.ts:2500-2604` | Mark the new memory id as `pending` inside the primary write transaction. |
| `memory-save.ts:2648-2655` | Persist result from `runPostInsertEnrichmentIfEnabled()` immediately after it returns. |
| `memory-index.ts:249-333` | Add bounded repair of incomplete enrichment markers under the scan lease. |

Status semantics:

| Status | Meaning |
|---|---|
| `pending` | Row committed; enrichment has not completed. Repair on replay. |
| `complete` | All relevant enrichment completed. No replay repair. |
| `partial` | Enrichment ran but has recoverable gaps. Repair on replay if policy allows. |
| `failed` | Enrichment failed. Repair on replay/backfill if retry policy allows. |
| `deferred` | Planner-first or feature-disabled path intentionally deferred. Do not repair on normal replay; explicit backfill can process it. |

### Risks

| Risk | Mitigation |
|---|---|
| Duplicate enrichment edges | Use idempotent causal/graph writes and test repeated repair. |
| Schema churn | Keep marker columns narrow and defaulted; update fresh schema and migration together. |
| Dedup helpers become async | Keep them synchronous; caller handles repair after dedup result. |
| Deferred rows get unexpectedly enriched | Treat `deferred` as intentional except for explicit backfill. |

### Test Strategy

1. Schema migration v30 test for fresh and migrated DBs.
2. Save path test: pending marker is written in the primary transaction and complete marker after enrichment.
3. Replay repair test for `unchanged` and `duplicate` dedup returns with pending marker.
4. No-op replay test for complete marker.
5. Deferred semantics test.
6. Backfill test for pending marker under `memory_index_scan`.

### Worth Doing Now

Yes, after the proxy correctness fixes. Medium-high effort because it includes schema and data-path tests, but it closes the only known replay idempotency hole for `memory_save`.

## 3. Re-handshake Protocol-version Drift

### Current Gap

`internalHandshake()` only checks initialize response ID (`launcher-session-proxy.cjs:212-268`). It does not compare `result.protocolVersion`. A backend build swap can therefore re-handshake successfully while negotiating a different protocol version.

### Options And Trade-offs

| Option | Trade-off |
|---|---|
| Ignore | No work, but unsafe across backend protocol changes. |
| Warn and continue | Visibility without safety. |
| Fail closed on mismatch | Recommended. Preserves protocol correctness and forces a clean client reconnect. |

### Recommended Approach

Cache the first negotiated protocol version and compare it on internal re-handshake.

Concrete changes:

| File | Concrete change |
|---|---|
| `launcher-session-proxy.cjs:125-153` | Extend pending tracker with cached initialize id and negotiated protocol version accessors. |
| `launcher-session-proxy.cjs:524-536` | When the first initialize response is forwarded to the client, cache `result.protocolVersion` if present. |
| `launcher-session-proxy.cjs:212-268` | Return protocol version from `internalHandshake()` and compare against expected version. |
| `launcher-session-proxy.cjs:399-419` | Add protocol-mismatch error frame helper, preferably code `-32002` and `retryable:false`. |
| `launcher-session-proxy.cjs:551-568` | On mismatch, do not install the fresh socket; emit errors for pending/queued ids and EOF. |

Mismatch policy:

If the original initialize response had a protocol version, later internal handshakes must return the same version. A different version or missing version is a mismatch. If no original version was ever cached, preserve current behavior.

### Risks

| Risk | Mitigation |
|---|---|
| Older SDK omits protocol version. | Only require comparison after an original version was observed. |
| Reattach loop keeps retrying same mismatched backend. | Treat mismatch as terminal for the client session, not a retryable attach failure. |
| Pending requests get misleading retryable errors. | Use non-retryable protocol mismatch error, not the recycle retryable error. |

### Test Strategy

1. Same-version re-handshake succeeds and replays pending request.
2. Different-version re-handshake emits `-32002`, marks `retryable:false`, and ends output.
3. Missing later version after cached original version also fails closed.

### Worth Doing Now

Yes. Small effort, low-medium risk, high correctness value.

## 4. Checkpoint-v2 `.needs-rebuild` Sentinel

### Current Gap

`runPostRestoreRebuilds()` runs derived rebuilds best-effort and catches failures (`checkpoints.ts:1701-1772`). `restoreCheckpointV2()` calls it after DB swap/reopen (`checkpoints.ts:2456-2464`). If a rebuild step fails, restore can succeed with stale FTS/community/derived graph artifacts.

Boot FTS auto-heal is tied to `.unclean-shutdown` (`context-server.ts:364-418`), not checkpoint restore rebuild failures. Startup scan currently indexes files and runs mutation hooks (`context-server.ts:1385-1477`) but does not run the checkpoint derived rebuild helper.

### Options And Trade-offs

| Option | Trade-off |
|---|---|
| Keep existing behavior | No work; stale window remains. |
| Fail restore on derived rebuild failure | Too harsh because source snapshot restore succeeded. |
| Write `.needs-rebuild` sentinel and repair on boot/scan | Best design if implemented; durable and non-blocking. |

### Recommended Approach

Design the sentinel but defer implementation unless checkpoint restore hardening is already active.

Concrete changes if implemented:

| File | Concrete change |
|---|---|
| `checkpoints.ts:1701-1772` | Return rebuild summary with `completed`, `failed`, and `skipped`. Export one derived rebuild helper. |
| `checkpoints.ts:723-768` | Add `.needs-rebuild` path/write/clear helpers near restore journal helpers. |
| `checkpoints.ts:2456-2464` | Write sentinel when rebuild summary has failed or skipped steps; restore still succeeds. |
| `context-server.ts:1667-1670` and `context-server.ts:2066-2091` | Check sentinel after DB init and before scheduled startup scan; repair and clear on success. |
| `memory-index.ts:249-333` | Check sentinel under scan lease and report repair counts in response. |
| `vector-index-store.ts:876-925` | For swap-done journal recovery, preserve or create rebuild-needed state because post-restore rebuild evidence is absent. |

### Risks

| Risk | Mitigation |
|---|---|
| Heavy rebuild at boot | Run bounded/non-fatal and log; consider scheduling immediately before startup scan. |
| Infinite sentinel retry | Leave sentinel on failure, but do not block server boot or scan. |
| Divergent rebuild implementations | Export one helper used by restore, boot, and scan. |

### Test Strategy

1. Restore with forced rebuild failure writes `.needs-rebuild` and returns success.
2. Successful repair clears sentinel.
3. Failed repair leaves sentinel.
4. Swap-done journal recovery handles sentinel semantics.

### Worth Doing Now

Defer. It is useful and low risk, but source data remains valid and existing scan/health paths provide partial self-heal. Implement it if checkpoint restore reliability is the next active packet.

## Final Priority Order

| Order | Follow-up | Effort | Risk | Recommendation |
|---|---|---|---|---|
| 1 | Protocol drift | Small | Low-medium | Do now. |
| 2 | Multi-client reconnect | Medium | Medium | Do now. |
| 3 | `memory_save` enrichment repair | Medium-high | Medium | Do now after proxy fixes. |
| 4 | `.needs-rebuild` sentinel | Small-medium | Low | Defer unless checkpoint-focused. |

## Notes

The first three close correctness gaps in the merged front-proxy replay story. The fourth is a checkpoint restore polish/self-heal improvement. It is concrete and implementation-ready, but it should not block the front-proxy follow-ups.
