# Iteration 05 - SYNTHESIZE

## Executive Synthesis

The single-recycle proof and eight unit tests cover the main happy path: one backend recycle, one in-flight request, stable launcher PID, replay after fresh-socket failure, truncated backend frame discard, basic classifier behavior, keepalive timeout, and graceful reattach exhaustion. The remaining genuine failures are narrower integration edges.

The blocking issue is that the proxy's internal keepalive uses the same JSON-RPC ID namespace as real client traffic and consumes matching responses before normal dispatch. An adversarial but protocol-valid string request ID can cause a real client response to be swallowed or replaced by the ping response. That is a P0 stream-corruption/silent-hang class bug.

The second blocking issue depends on merge scope. The packet explicitly excludes second-launcher transparency, but the requested target is a shared launcher. In that environment, lease-held bridge clients still raw-pipe to the daemon and exit on socket close, so they are severed by recycle. That is P0 for shared/multi-client operation and non-blocking only if the merge gate explicitly restricts the engine to single-client use.

## Prioritized Findings

| Priority | Title | File:line | Concrete failure sequence | Fix |
|---|---|---|---|---|
| P0 | Keepalive private ID collision can swallow a real response | `.opencode/bin/lib/launcher-session-proxy.cjs:464-475`, `.opencode/bin/lib/launcher-session-proxy.cjs:508-520` | Proxy sends keepalive ID `__launcher_session_proxy_keepalive__1`; client sends a valid request using the same string ID; backend response to the client request arrives first; proxy treats it as keepalive and returns without writing it to stdout. | Reserve the private ID namespace and reject/correct client collisions, or implement keepalive without a client-collidable JSON-RPC ID. Add a collision unit test. |
| P0 | Second-launcher bridge still severs on daemon recycle | `.opencode/bin/lib/launcher-ipc-bridge.cjs:79-121`, `.opencode/bin/lib/launcher-ipc-bridge.cjs:304-357` | A lease-held second launcher bridges via raw pipe; daemon recycles; socket closes; bridge `closeOnce(0)` unpipes, destroys, and exits, severing that client pipe. | For shared launcher merge, route bridge mode through the reconnecting proxy or block multi-client use with an explicit gate/test. |
| P2 | `memory_save` commit-before-enrichment replay can skip secondary enrichment | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2476-2605`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2648-2655` | First save commits primary row; daemon dies before enrichment; replay dedups as unchanged; enrichment is not retried. | Track enrichment completion and repair on replay/backfill when a committed row lacks required enrichment. |
| P2 | Re-handshake ignores protocol-version drift | `.opencode/bin/lib/launcher-session-proxy.cjs:212-268`, `tasks.md:95-98` | Cached initialize is replayed to a backend with a different protocol response; proxy only matches ID and proceeds to replay. | Compare negotiated protocol version and fail closed on mismatch. |

## Negative Results

| Hypothesis ruled out | Why |
|---|---|
| Backend-only daemon liveness without stdio | IPC socket server is started after stdio is skipped and is a live `net.Server` handle (`context-server.ts:2085-2109`, `socket-server.ts:133-175`). |
| hf-model-server interaction | Recycle path clears timers, stops demand listener, and reaps model-server before daemon recycle (`mk-spec-memory-launcher.cjs:682-715`). |
| Multi-recycle replay loss | Reattach snapshots pending requests each attempt and existing tests cover fresh-socket failure during replay (`launcher-session-proxy.vitest.ts:362-393`). |
| Concurrent in-flight response order | JSON-RPC responses are ID-correlated; write order is preserved for replay/gap frames. |
| Backpressure plus recycle | Old socket drain wait is cleared on detach (`launcher-session-proxy.cjs:339-353`). |
| Crash-loop exhaustion silent hang | Exhaustion emits retryable errors and ends output (`launcher-session-proxy.cjs:408-419`, `562-583`); existing test covers one queued request. |
| Idle monitor normal UDS reconnect kill | Not confirmed in normal path; the socket server and idle monitor start together after backend init, and the proxy connects after deep-probe readiness. Full integration test still recommended. |
| Keepalive misattributed to non-colliding real traffic | Refuted; the bug requires ID collision with the private prefix. |
| Partial backend frame at recycle | Existing splitter discard test covers it (`launcher-session-proxy.vitest.ts:172-187`). |
| Partial client frame at recycle | Client splitter buffer is not discarded on backend failure. |
| Notification/no-id frames during recycle | Gap queue flushes no-id frames; pending tracking only excludes them from response replay. |
| Primary `memory_save` duplicate row on full-commit replay | Dedup catches same-path/content replay before writing (`memory-save.ts:2248-2259`; `dedup.ts:213-282`). |
| Interval/listener leak across reconnects | Keepalive timers and old socket listeners are cleared on detach/stop (`launcher-session-proxy.cjs:327-353`). |

## Merge-Gate Verdict

BLOCKED for shared-launcher merge until the P0 keepalive ID-collision bug is fixed and the second-launcher path is either proxied through the reconnect engine or explicitly excluded by a merge gate. If the target were strictly single-client only, the second-launcher item could be downgraded to a documented limitation, but the keepalive collision remains blocking.
