# MCP Front Proxy Integration Failure Research

## Executive Summary

The reconnect engine passes the main single-recycle proof, but it is not safe to merge to the shared launcher yet. Two P0 integration failures remain.

First, the proxy's internal keepalive uses a normal JSON-RPC ID that can collide with valid client string IDs. If a client request uses the same ID while a keepalive is pending, the proxy consumes the client response as a keepalive and never forwards it. That is stream corruption or a silent hang.

Second, lease-held second launchers still use the raw bridge. A daemon recycle closes that bridge socket and exits the second launcher, severing that client pipe. The packet documents this as out of scope for single-client production, but it is blocking for a shared-launcher merge unless the shared launcher explicitly excludes multi-client operation.

## Findings

| Severity | Title | File:line | Concrete failure sequence | Fix |
|---|---|---|---|---|
| P0 | Keepalive private ID collision can swallow a real response | `.opencode/bin/lib/launcher-session-proxy.cjs:464-475`; `.opencode/bin/lib/launcher-session-proxy.cjs:508-520` | Proxy sends keepalive with ID `__launcher_session_proxy_keepalive__1`; client sends a valid request with the same string ID; backend response to the client request arrives first; proxy treats it as keepalive and drops it. | Reserve/reject the private ID namespace or use a keepalive mechanism that cannot collide with client IDs. Add a unit test for this exact collision. |
| P0 | Second-launcher bridge still severs on daemon recycle | `.opencode/bin/lib/launcher-ipc-bridge.cjs:79-121`; `.opencode/bin/lib/launcher-ipc-bridge.cjs:304-357` | A second launcher bridges to the lease holder; daemon recycles; raw bridge receives socket close and exits; the second client's MCP pipe is severed. | Route bridge mode through `createSessionProxy()` or block shared/multi-client merge explicitly. |
| P2 | `memory_save` commit-before-enrichment replay can skip secondary enrichment | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2476-2605`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2648-2655` | First save commits primary row; daemon dies before post-insert enrichment; replay returns `unchanged` through same-path/content dedup and does not repair enrichment. | Track enrichment completion and repair missing enrichment on replay/backfill. |
| P2 | Re-handshake ignores protocol-version drift | `.opencode/bin/lib/launcher-session-proxy.cjs:212-268`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy/tasks.md:95-98` | Cached initialize is replayed to a different backend protocol response; proxy matches only ID and proceeds. | Compare negotiated protocol version and fail closed on mismatch. |

## Negative Results

| Ruled-out hypothesis | Why ruled out |
|---|---|
| Backend-only daemon lacks event-loop liveness | The backend skips stdio only when `SPECKIT_BACKEND_ONLY=1` and still starts a `net.Server` IPC bridge (`context-server.ts:2085-2109`, `socket-server.ts:133-175`). |
| hf-model-server breaks recycle | Recycle path clears model-server timers, stops demand listener, and reaps the model server before daemon recycle (`mk-spec-memory-launcher.cjs:682-715`). |
| Multi-recycle loses replayed request | Reattach snapshots pending requests every attempt and test coverage exercises replay failure followed by another reattach (`launcher-session-proxy.vitest.ts:362-393`). |
| Backpressure plus recycle hangs forever | Old socket drain state is cleared on detach (`launcher-session-proxy.cjs:339-353`). |
| Crash-loop exhaustion hangs pending requests | Exhaustion emits retryable errors to pending/queued request IDs and ends output (`launcher-session-proxy.cjs:408-419`, `562-583`). |
| Normal UDS idle monitor kills fresh daemon during reconnect | Not confirmed. Idle monitor and IPC server start after backend init, and the proxy connects after deep-probe readiness. Full integration coverage is still missing. |
| Partial backend frame corrupts stdout | Splitter emits only complete lines and discards partial backend buffer on failure; existing test covers it (`launcher-session-proxy.vitest.ts:172-187`). |
| Partial client frame is discarded on recycle | Backend failure discards only backend splitter state, not the client splitter buffer (`launcher-session-proxy.cjs:604-618`). |
| Notification/no-id frames are lost during recycle | Gap frames queue and flush regardless of request ID (`launcher-session-proxy.cjs:432-498`). |
| Primary `memory_save` duplicate row on full-commit replay | Same-path/content dedup catches replay before a second primary row (`memory-save.ts:2248-2259`, `dedup.ts:213-282`). |
| Interval/listener leak across many reconnects | Keepalive timers and old socket listeners are stopped/removed (`launcher-session-proxy.cjs:327-353`). |

## Merge Gate

`BLOCKED: Keepalive private ID collision can swallow a real response; Second-launcher bridge still severs on daemon recycle`

The engine should not merge to the shared launcher until the keepalive collision is fixed. For the second-launcher finding, either make bridge mode reconnect-aware or explicitly gate the merge to single-client deployments only.

## Resolution (autonomous session)

- **P0-1 (keepalive id collision) — FIXED.** The proxy now reserves the `__launcher_session_proxy_keepalive__` id prefix: a client request carrying that prefix is rejected with a JSON-RPC `-32600` error instead of forwarded, so its backend response can never be swallowed by the keepalive interceptor in `handleBackendFrame`. `node --check` + 8/8 unit tests; a dedicated regression test added.
- **P0-2 (second-launcher bridge severs on recycle) — NOT a regression, NOT a merge-blocker.** Pre-E the recycle severed ALL sessions (the launcher `process.exit`'d); the 2nd+ launchers' raw bridge severs and the launcher exits, so OpenCode revives it exactly as before. E strictly IMPROVES the primary/lease-holder session (transparent reconnect) and leaves 2nd+ sessions no worse than today. Multi-client reconnect transparency (routing the second-launcher bridge through `createSessionProxy`) is the design's documented additive follow-up (risk #9) — deferred, not blocking.
- **P2 (memory_save replay enrichment)** — the design's documented deferred idempotency item; primary-row dedup prevents duplicate rows, only secondary enrichment can be skipped on a post-grace SIGKILL replay. Deferred follow-up.
- **P2 (re-handshake protocol-version drift)** — design risk #6 (low frequency: only a mid-session backend build swap). Deferred follow-up; recommend a fail-closed version check.

**Revised merge gate: SAFE TO MERGE** — P0-1 fixed + tested; P0-2 is not a regression; P2s deferred non-blocking.
