# Follow-up Design Iteration 04: Protocol Drift And Checkpoint Sentinel

## Focus

This iteration designs the two fail-closed or self-heal follow-ups: protocol-version drift during proxy re-handshake, and the checkpoint-v2 `.needs-rebuild` sentinel.

## Protocol-version Drift

### Current Gap

`internalHandshake()` parses backend frames until it sees a JSON-RPC response with the cached initialize request id (`launcher-session-proxy.cjs:212-268`). It treats that as sufficient. It does not inspect the initialize result body. `attachFreshSocket()` then installs the new socket and replays pending requests (`launcher-session-proxy.cjs:551-568`).

If the backend has been rebuilt or swapped during a live client session and negotiates a different MCP protocol version, the proxy can continue serving the old client session against a mismatched backend.

### Options

| Option | Description | Pros | Cons |
|---|---|---|---|
| A. Ignore drift | Keep current ID-only match. | No work. | Serves a potentially incompatible backend. |
| B. Warn and continue | Log mismatch but keep serving. | Visibility. | Still unsafe; client cannot know the protocol changed. |
| C. Fail closed | Cache the first negotiated protocol version and reject re-handshake mismatches with request errors plus EOF. | Safe and explicit; matches requested behavior. | Existing sessions are closed on backend protocol change and clients must reconnect. |

### Recommended Approach

Use option C.

Concrete changes:

| File | Change |
|---|---|
| `launcher-session-proxy.cjs:125-153` | Extend `createPendingRequestsTracker()` to store `cachedInitializeId` and `negotiatedProtocolVersion`. Cache initialize id when handling client initialize. Cache protocol version when handling the first backend response for that initialize id. |
| `launcher-session-proxy.cjs:212-268` | Change `internalHandshake(socket, initializeFrame)` to accept an `expectedProtocolVersion` option and return `{ residual, protocolVersion }`. When the matched initialize response has `result.protocolVersion`, compare it to the expected version if one exists. |
| `launcher-session-proxy.cjs:399-419` | Add a non-retryable protocol mismatch error frame helper, for example JSON-RPC code `-32002`, message `backend protocol version changed; reconnect required`, and data `{ retryable: false, expectedProtocolVersion, actualProtocolVersion }`. |
| `launcher-session-proxy.cjs:551-568` | Pass the cached negotiated version into `internalHandshake()`. On mismatch, detach the socket, synthesize errors for pending and queued request ids, and request output EOF. Do not continue reattach attempts against the mismatched backend. |
| `launcher-session-proxy.cjs:524-536` | When forwarding the initial initialize response to the client, cache `result.protocolVersion` in the tracker before enqueueing output. |

Semantics:

1. Before the first initialize response is known, no version check is possible. Reattach can proceed as today.
2. After the first initialize response is known, every internal re-handshake must return the same protocol version.
3. Missing `result.protocolVersion` on a later re-handshake should be treated as mismatch when the original version was present.
4. Mismatch closes the client stream after emitting errors for request ids the proxy owns. It does not forward residual backend frames.

### Test Strategy

1. Extend `launcher-session-proxy.vitest.ts` with a test where initial initialize returns `2025-06-18`, reattach returns the same version, and replay proceeds.
2. Add a mismatch test: initial initialize returns `2025-06-18`, reattach returns `2026-01-01`, pending `memory_search` receives `-32002`, output ends, and no replay is written to the mismatched socket.
3. Add a missing-version test: original version exists, re-handshake response omits `protocolVersion`, and the session fails closed.

## Checkpoint-v2 `.needs-rebuild` Sentinel

### Current Gap

`runPostRestoreRebuilds()` is intentionally best-effort. It runs lineage backfill, auto-entities, degree snapshots, community artifacts, and FTS rebuild, but catches individual step failures and logs them (`checkpoints.ts:1701-1772`). `restoreCheckpointV2()` calls it after the file swap and DB reopen (`checkpoints.ts:2456-2464`). Since failures are swallowed inside the helper, restore can succeed while derived artifacts remain stale.

Existing boot FTS auto-heal is tied to `.unclean-shutdown` (`context-server.ts:364-418`). A clean checkpoint restore with a non-fatal derived rebuild failure does not necessarily leave that marker.

### Options

| Option | Description | Pros | Cons |
|---|---|---|---|
| A. Keep existing behavior | Rely on next scan or health repair. | No new state. | Leaves a known stale window and no durable prompt to repair. |
| B. Fail restore if any rebuild step fails | Treat derived rebuilds as part of restore success. | Strong consistency. | Too harsh; restored base data is valid, and rollback for community/FTS failure is unnecessary. |
| C. Write `.needs-rebuild` sentinel | Keep restored base, but persist a durable rebuild-needed marker and clear it after successful derived rebuild. | Small and fail-safe. | Adds one filesystem state file and boot/scan logic. |

### Recommended Approach

Design option C, but defer implementation unless checkpoint restore hardening is already in scope. It is worth having a concrete plan, but it is lower priority than protocol drift and `memory_save` replay repair.

Concrete changes if implemented:

| File | Change |
|---|---|
| `checkpoints.ts:1701-1772` | Refactor `runPostRestoreRebuilds()` to return a summary `{ completed, skipped, failed }` instead of `void`. Preserve non-fatal behavior. Export a public helper such as `runCheckpointDerivedRebuilds(database, checkpointSpecFolder)`. |
| `checkpoints.ts:723-768` | Add helpers near restore journal helpers: `getNeedsRebuildSentinelPath(liveMainPath)`, `writeNeedsRebuildSentinel(path, summary)`, and `clearNeedsRebuildSentinel(path)`. Use the checkpoints directory and filename `.needs-rebuild`. |
| `checkpoints.ts:2456-2464` | After rebuild summary, if any step failed or was dependency-skipped, write the sentinel before clearing the restore journal. Restore still returns success. |
| `context-server.ts:1667-1670` or after DB init | Check for the sentinel after `vectorIndex.initializeDb()` and before background startup scan. If present, run the exported derived rebuild helper and clear the sentinel only if all steps complete. |
| `memory-index.ts:249-333` | At scan entry, after restore barrier and scan lease acquisition, check the same sentinel and run the derived rebuild helper before normal indexing. Include result counts in scan output. |
| `vector-index-store.ts:876-925` | When boot recovery finalizes a `swap-done` journal, optionally leave or write the sentinel because the restored DB was kept but post-restore derived rebuilds may not have run. This is the crash-continuation case. |

Sentinel shape:

```json
{
  "formatVersion": 1,
  "createdAt": "<iso>",
  "reason": "checkpoint_restore_post_rebuild_incomplete",
  "failed": ["fts-rebuild"],
  "skipped": ["community-artifacts"],
  "completed": ["lineage-backfill", "auto-entities"]
}
```

### Risks

| Risk | Mitigation |
|---|---|
| Sentinel loops forever if rebuild always fails. | Leave the sentinel and log bounded warnings; do not block server boot. |
| Startup runs a heavy community rebuild before serving. | Consider scheduling with `setImmediate`, but run before startup scan mutates derived state. |
| Duplicate logic between restore, boot, and scan. | Export one derived rebuild helper and one sentinel check helper from checkpoint storage. |
| Sentinel path with custom DB path. | Derive from the resolved live main DB path, same as restore journal path. |

### Test Strategy

1. Add a checkpoint test that forces `fts-rebuild` or `community-artifacts` failure and asserts `.needs-rebuild` is written while restore succeeds.
2. Add a test that successful post-restore rebuild clears no sentinel.
3. Add boot-style helper test: sentinel present, rebuild succeeds, sentinel removed.
4. Add failure-loop test: sentinel present, rebuild fails, sentinel remains and server/scan result reports non-fatal repair failure.
5. Extend swap-done journal recovery test to assert sentinel behavior for completed swap with missing rebuild evidence.
