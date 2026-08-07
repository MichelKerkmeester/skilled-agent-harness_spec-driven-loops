# Iteration 3: Daemon Dependency and Lease/IPC Audit

## Focus

Identify which behavior lives in the daemon and launcher, and what a CLI would lose if it bypassed them.

## Findings

1. The server starts a stdio MCP transport, then starts an owner-lease refresh timer and an IPC socket server for secondary clients. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/index.ts:136] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/index.ts:149]
2. The owner lease heartbeat refreshes every third of a 60s TTL and shuts down when ownership moves to another process. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/index.ts:33]
3. The launcher classifies stale owners by process liveness, orphaned parent PID, and heartbeat age; stale heartbeat is reclaimable only after `ttlMs * 2`. [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:328]
4. The shared IPC server supports secondary clients, enforces a default max of 8 clients, and tracks activity for idle shutdown. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:16] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:298]
5. The idle monitor defaults to 30 minutes, keeps the daemon alive while secondary IPC clients exist, and can be disabled with timeout `0`. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/ipc/launcher-idle-timeout.ts:34] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/ipc/launcher-idle-timeout.ts:96]
6. Readiness markers are file-backed snapshots for startup-critical consumers and are written beside the code graph DB. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:4]

## Sources Consulted

- `.opencode/skills/system-code-graph/mcp_server/index.ts`
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/launcher-idle-timeout.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`

## Assessment

`newInfoRatio`: 0.85. The key novelty was the stronger code-index-specific daemon hardening compared to the generic spec-memory precedent.

Confidence: high.

## Reflection

Worked: tracing the launcher and server together showed why the CLI should be another IPC client.

Failed/ruled out: direct DB or per-invocation parser CLI as the public parity surface.

## Recommended Next Focus

MCP affordance replacement and prior-art transfer.
