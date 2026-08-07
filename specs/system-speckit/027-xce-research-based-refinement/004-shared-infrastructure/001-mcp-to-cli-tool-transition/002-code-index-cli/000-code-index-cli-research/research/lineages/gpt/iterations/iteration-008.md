# Iteration 8: Dual-Stack Coexistence and Spawn Races

## Focus

Audit whether MCP and CLI can coexist through the same daemon without split-brain or transport races.

## Findings

1. The launcher acquires the owner lease using exclusive file creation for fresh ownership and atomic write/re-read logic for reclaim paths. [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:347]
2. The TypeScript owner-lease helper adds a mutation lock and identity-checked stale-lock removal, reducing split-brain risk during acquire/refresh/release. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:119] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:386]
3. Secondary launchers bridge to a live holder only after a deep JSON-RPC initialize probe; a socket accept alone is not sufficient. [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:356]
4. Dead-socket handling can reap a recorded owner PID and respawn under the bootstrap lock, but only if the owner lease still points to that PID. [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:537]
5. The session proxy queues and replays only classified replayable frames and returns retryable errors for non-replayable pending work. [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:33] [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:623]
6. The proxy fails closed on backend protocol-version drift after re-handshake. [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:640]

## Sources Consulted

- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`

## Assessment

`newInfoRatio`: 0.47. The architecture was known; the code-index-specific race boundaries and tests-to-add were the novelty.

Confidence: high for mechanism, medium for untested new CLI path.

## Reflection

Worked: tracing bridge, launcher, and proxy together identified exact test deltas.

Failed/ruled out: a separate CLI-owned daemon manager.

## Recommended Next Focus

Risk register and design deltas.
