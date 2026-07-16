# Follow-up Design Iteration 01: Current Gap Map

## Focus

This iteration mapped the four deferred follow-ups against the current merged code, without proposing broad rewrites. The guiding question was: which exact seams can be changed with the smallest safe implementation surface?

## Evidence Map

| Follow-up | Current seam | Evidence |
|---|---|---|
| Multi-client reconnect transparency | Second and later launchers still call the shared raw bridge after the lease-holder probe succeeds. | `launcher-ipc-bridge.cjs:79-121`, `launcher-ipc-bridge.cjs:304-356`, `mk-spec-memory-launcher.cjs:933-938` |
| Primary session reconnect | The first launcher already routes its stdio through `createSessionProxy`. | `mk-spec-memory-launcher.cjs:973-979` |
| Proxy state model | A proxy instance owns one client stream, one cached initialize frame, one pending request map, and one backend socket. | `launcher-session-proxy.cjs:125-153`, `launcher-session-proxy.cjs:271-680` |
| IPC secondary server model | Each secondary socket connection gets a fresh MCP `Server` and `StdioServerTransport`. | `context-server.ts:2100-2106`, `socket-server.ts:133-170` |
| `memory_save` enrichment gap | Dedup can return before post-insert enrichment, while enrichment runs only after the primary row commit. | `memory-save.ts:2333-2343`, `memory-save.ts:2487-2497`, `memory-save.ts:2500-2604`, `memory-save.ts:2648-2655` |
| Replay dedup return | Same-path unchanged and content-hash duplicate returns are terminal no-ops today. | `dedup.ts:268-279`, `dedup.ts:330-351` |
| Protocol drift gap | Internal re-handshake accepts the initialize response by ID only. | `launcher-session-proxy.cjs:212-268` |
| Context server identity | The server reports name/version but leaves protocol negotiation to the MCP SDK. | `context-server.ts:979-983` |
| Checkpoint rebuild gap | Derived rebuild steps are best-effort and do not report failures to restore status. | `checkpoints.ts:1701-1772`, `checkpoints.ts:2456-2464` |
| Existing boot repair | Boot FTS repair only reacts to `.unclean-shutdown`, not a checkpoint restore rebuild miss. | `context-server.ts:364-418` |

## Findings By Follow-up

### 1. Multi-client reconnect transparency

Current gap: the second-launcher path starts in `mk-spec-memory-launcher.cjs:933-938`, calls `bridgeOrReportLeaseHeld()`, and delegates to `maybeBridgeLeaseHolder()` in `launcher-ipc-bridge.cjs:304-356`. After liveness probe success, `bridgeStdioToSocket()` pipes stdio to the daemon socket and exits on socket close or input close. That is intentionally simple, but it is not reconnect-aware.

Important constraint: `maybeBridgeLeaseHolder()` is shared by `mk-code-index-launcher.cjs` and `mk-skill-advisor-launcher.cjs`, so making the shared bridge default reconnect-aware would silently change other MCP servers. The smallest safe design is to inject a reconnecting bridge only from `mk-spec-memory-launcher.cjs`.

Lifecycle conclusion: each bridged client needs its own `createSessionProxy()` instance. The pending request map and cached initialize frame are client-session state, not daemon-global state. Sharing one proxy across multiple bridged clients would mix JSON-RPC IDs and pending requests.

Handshake conclusion: the lease-holder probe remains useful as a pre-bridge liveness gate. After that, the proxy performs its normal cold-start wait and first client initialize forwarding. On later daemon recycle, the proxy replays the cached initialize internally before replaying pending safe requests. This matches the primary session behavior and the IPC server already creates one MCP server instance per secondary connection.

### 2. `memory_save` replay enrichment window

Current gap: `memory_save` commits the primary `memory_index` row inside the write transaction, then runs `runPostInsertEnrichmentIfEnabled()` after the commit. If the daemon dies in that window, replay finds the primary row and returns `unchanged` or `duplicate`; no code checks whether post-insert enrichment completed.

Important constraint: the post-insert pipeline is asynchronous and feature-flagged. It can run causal links, entity extraction, summaries, entity linking, and graph lifecycle. Folding that entire pipeline into the primary write transaction would hold the SQLite writer through async and potentially provider-backed work.

Best seam: add a durable per-memory enrichment marker, set it to pending in the same transaction that creates the primary row, mark it complete/partial/failed/deferred after the enrichment pipeline returns, and repair pending markers on replay before returning a dedup no-op.

### 3. Re-handshake protocol-version drift

Current gap: `internalHandshake()` replays the cached initialize frame and discards the matching initialize response when `parsed.id === initialize.id`. It does not inspect `result.protocolVersion`. If a backend build swap changes negotiated protocol, the proxy can continue serving a session against a backend that is not the same protocol contract.

Best seam: cache the negotiated protocol version from the first client-visible initialize response. During internal re-handshake, compare the backend's initialize response protocol version to that cached version. On mismatch, fail closed by emitting request errors for pending/queued requests and closing stdout, rather than continuing.

### 4. Checkpoint-v2 `.needs-rebuild` sentinel

Current gap: `runPostRestoreRebuilds()` catches individual rebuild failures and logs them. Restore then clears the restore journal and keeps the restored base. That is defensible for restore success, but it leaves FTS/communities/derived graph artifacts stale until an operator or next scan repairs them.

Important constraint: existing boot FTS repair only uses `.unclean-shutdown`, so a clean checkpoint restore with a non-fatal derived rebuild failure has no boot marker.

Best seam: have `runPostRestoreRebuilds()` return a summary. If any step failed or was dependency-skipped, write a `checkpoints/.needs-rebuild` sentinel. Startup and `memory_index_scan` should check that sentinel, rerun the same derived rebuild helper, and clear the sentinel only after all steps complete.

## Iteration Recommendation

Prioritize protocol drift and multi-client reconnect first because both are front-proxy correctness properties and can be unit-tested without database fixtures. Then add the `memory_save` marker because it requires a schema migration and replay/backfill semantics. Defer the checkpoint sentinel unless checkpoint restore is being hardened in the same sprint; it is useful but lower severity than the replay and protocol risks.
