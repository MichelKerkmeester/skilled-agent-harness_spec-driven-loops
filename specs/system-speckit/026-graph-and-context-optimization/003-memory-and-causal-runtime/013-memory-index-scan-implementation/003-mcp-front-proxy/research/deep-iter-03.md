# Iteration 03 - ADVERSARIAL CONFIRM

## Confirmed / Refuted Interleavings

### CONFIRMED: Keepalive Private-ID Collision Can Swallow Real Traffic

Sequence:

1. Proxy is connected and idle long enough for `sendKeepalive()` to enqueue `{ id: "__launcher_session_proxy_keepalive__1", method: "ping" }` (`launcher-session-proxy.cjs:464-475`).
2. Before the ping response is received, a JSON-RPC client sends a legitimate request with the same string ID. JSON-RPC permits string IDs; the proxy does not reserve or reject its private prefix (`launcher-session-proxy.cjs:129-137`, `485-491`).
3. Backend responds to the real client request first with that ID.
4. `handleBackendFrame()` checks `pendingKeepaliveId` before normal request tracking/output and returns early when IDs match (`launcher-session-proxy.cjs:508-520`).
5. The real response is consumed as a keepalive and never reaches stdout. The client request remains pending until a later ping response may be forwarded as the wrong response, or the request silently hangs.

Existing tests cover keepalive timeout/reply consumption (`launcher-session-proxy.vitest.ts:253-289`) but do not cover collision with a real client ID.

### CONFIRMED: Second-Launcher Bridge Still Severs On Recycle

Sequence:

1. A second launcher starts while a lease holder is live. `mk-spec-memory-launcher.cjs:933-938` routes through `bridgeOrReportLeaseHeld()`.
2. `maybeBridgeLeaseHolder()` deep-probes and calls the legacy bridge (`launcher-ipc-bridge.cjs:343-356`).
3. `bridgeStdioToSocket()` pipes stdin/stdout directly to the daemon socket (`launcher-ipc-bridge.cjs:79-121`).
4. The daemon recycles and closes its socket.
5. The bridge receives `close` and calls `closeOnce(0)`, destroys the socket, unpipes, and exits (`launcher-ipc-bridge.cjs:86-93`, `106-107`).

This is documented as out of scope in the packet (`spec.md:83-87`, `implementation-summary.md:128-132`), but it is still a real severed-pipe failure for shared-launcher or multi-client operation. Existing tests only assert that bridge mode stays attached while the socket stays open (`launcher-ipc-bridge.vitest.ts:212-225`).

### CONFIRMED-P2: `memory_save` Commit-Before-Enrichment Replay Can Skip Secondary Enrichment

Sequence:

1. A replayable `memory_save` request commits the primary memory row and core indexes. Non-chunked write is inside `writeTransaction.immediate()` (`memory-save.ts:2476-2605`), and `createMemoryRecord()` writes the row plus metadata/lineage/history inside nested transactions (`create-record.ts:265-433`).
2. The daemon is killed after the DB commit but before post-insert enrichment completes (`memory-save.ts:2648-2655`).
3. The proxy reconnects and replays the original `memory_save` because the classifier allows it (`launcher-session-proxy.cjs:23-37`, `108-123`).
4. Same-path/content dedup sees the committed row and returns `unchanged` before enrichment is called (`memory-save.ts:2248-2259`; `dedup.ts:213-282`).
5. The replay does not duplicate the primary row, FTS, or vector row, but any enrichment that was interrupted remains missing unless a later backfill repairs it.

This is a hardening issue, not a demonstrated double-apply. It matches the packet's acknowledged partial-commit concern (`implementation-summary.md:128-132`) but narrows it to post-commit enrichment skip.

### CONFIRMED-P2: Re-Handshake Ignores Protocol-Version Drift

Sequence:

1. Client originally initializes with protocol version A; proxy caches the verbatim initialize (`launcher-session-proxy.cjs:129-153`).
2. Backend respawns with a different MCP protocol response version B.
3. `internalHandshake()` sends cached initialize and consumes any response with matching ID (`launcher-session-proxy.cjs:212-268`).
4. The code does not inspect `result.protocolVersion`, so it proceeds to replay queued work even if the packet contract says to fail closed on mismatch (`tasks.md:95-98`).

This requires a backend build/protocol swap across recycle, so it is P2 hardening unless the shared launcher supports live binary replacement during recycle.

### REFUTED: Normal UDS Idle Monitor Kills Fresh Daemon During Reconnect

Default UDS path starts the idle monitor and IPC server at the end of backend startup (`context-server.ts:2093-2109`), and the proxy only declares readiness after a deep initialize probe (`launcher-session-proxy.cjs:156-169`, `639-662`). With the built-in minimum idle check interval (`launcher-idle-timeout.ts:72-75`), the normal fresh daemon has time to accept the proxy before its first no-client check. Existing tests prove no-client timeout and active-client suppression (`launcher-idle-timeout.vitest.ts:24-60`), but no full recycle integration test exists.

### REFUTED: Backpressure-Recycle Silent Hang

The prior P0 appears fixed. `detachSocket()` resets `socketDrainWaiting` and removes the stale drain listener (`launcher-session-proxy.cjs:339-353`), so the new socket pump is not blocked forever.
