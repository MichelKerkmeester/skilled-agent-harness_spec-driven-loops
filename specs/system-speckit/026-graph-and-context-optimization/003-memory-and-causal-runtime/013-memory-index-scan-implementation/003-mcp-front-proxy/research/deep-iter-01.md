# Iteration 01 - MAP

## Scope

Adversarial map of integration failure-mode hypotheses for the MCP launcher reconnect proxy. This iteration intentionally does not confirm; it enumerates what must be traced in the implementation.

## Hypotheses

| ID | Hypothesis | Failure class to test | Primary surfaces |
|---|---|---|---|
| H01 | Backend-only daemon may not stay alive without stdio transport. | Daemon exits or becomes unreachable. | `context-server.ts`, `socket-server.ts` |
| H02 | Backend-only idle/no-client path may kill the respawned daemon during reconnect. | Wrong behavior on recycle. | `context-server.ts`, `launcher-idle-timeout.ts` |
| H03 | hf-model-server teardown may interact badly with in-place recycle. | Recycle stalls or leaves sidecar. | `mk-spec-memory-launcher.cjs`, `launcher-ipc-bridge.cjs` |
| H04 | Socket-bind failure may falsely report backend-only readiness. | Silent unavailable bridge. | `socket-server.ts`, `launcher-ipc-bridge.cjs` |
| H05 | Multi-recycle may replay the same in-flight request more than once or lose it. | Duplicate work or hang. | `launcher-session-proxy.cjs` |
| H06 | Concurrent in-flight requests during the reconnect gap may reorder or drop. | Stream corruption or missing response. | `launcher-session-proxy.cjs` |
| H07 | Socket backpressure (`write() === false`) coinciding with recycle may permanently pause input or block replay. | Silent hang. | `launcher-session-proxy.cjs` |
| H08 | Crash-loop exhaustion over `maxReattach` may leave pending requests unresolved. | Silent hang instead of graceful degrade. | `launcher-session-proxy.cjs` |
| H09 | Idle monitor may fire during the gap despite keepalive. | Wrong behavior on recycle. | `context-server.ts`, `launcher-idle-timeout.ts` |
| H10 | Proxy keepalive ping may race with or be mis-attributed as real client traffic. | Stream corruption or silent hang. | `launcher-session-proxy.cjs` |
| H11 | Replay may violate frame ordering. | Reordered client-visible frames. | `launcher-session-proxy.cjs` |
| H12 | Notification/no-id frames during recycle may be lost. | Lost client notification. | `launcher-session-proxy.cjs` |
| H13 | A partial backend frame at recycle instant may leak to client stdout. | Stream corruption. | `launcher-session-proxy.cjs` |
| H14 | A partial client frame at recycle instant may be discarded. | Lost request. | `launcher-session-proxy.cjs` |
| H15 | `memory_save` replay after partial secondary-index commit may produce duplicates or miss enrichment. | Data/index inconsistency. | `launcher-session-proxy.cjs`, `memory-save.ts`, `create-record.ts` |
| H16 | Intervals/listeners may leak across many reconnects. | Resource leak, later misbehavior. | `launcher-session-proxy.cjs`, `context-server.ts` |
| H17 | Second-launcher bridge path is raw-pipe and may sever on daemon recycle. | Severed pipe. | `launcher-ipc-bridge.cjs`, `mk-spec-memory-launcher.cjs` |
| H18 | Re-handshake may ignore protocol-version drift after backend swap. | Wrong behavior on recycle. | `launcher-session-proxy.cjs`, packet design contract |

## Initial Risk Notes

The highest-risk hypotheses are H10 and H17 because they can corrupt or sever a client-visible stream without requiring database mutation. H15 is likely lower severity if the primary row dedup works, but it must be traced because the proxy explicitly classifies `memory_save` as replayable.
