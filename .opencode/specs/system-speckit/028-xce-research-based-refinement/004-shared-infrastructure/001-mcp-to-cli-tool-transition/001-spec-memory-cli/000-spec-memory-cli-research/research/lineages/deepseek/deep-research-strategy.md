# Deep Research Strategy (DeepSeek Lane)

## Topic

Can the system-spec-kit memory MCP (mk-spec-memory, 37 tools) be replaced by a CLI with ZERO feature loss? Evaluate three architectures — (a) pure per-invocation CLI, (b) CLI front-end over the existing daemon/IPC socket (kill only the MCP protocol layer), (c) hybrid CLI that auto-spawns the daemon on demand.

## Key Questions

- [x] KQ1: Parity matrix for all 37 MCP tools — CLI equivalent per tool → 37/37 classified: 22 STATELESS, 10 STATE-EMBED, 5 STATE-WATCHER, 0 MCP-ONLY
- [x] KQ2: Daemon-dependency audit — what dies under each architecture → Architecture (b) preserves all 13 services; (a) loses 5 tools + 4 services; (c) preserves all with cold-latency caveat
- [x] KQ3: MCP-only affordances and CLI replacements (discovery, permissioning, Zod validation, retryable errors, session-proxy replay) → All 6 affordances have CLI equivalents; token overhead is a net GAIN from elimination
- [x] KQ4: Integration-surface migration (runtime hooks, agents, /doctor, deep-loop) → ~120 references across ~29 files; OpenCode runtime tool registration is sole external dependency
- [x] KQ5: Architecture comparison with effort estimates, risk register, go/no-go → **GO — Architecture (b)** with 3-4 week effort estimate, 37/37 tools preserved, zero daemon-side changes

## Known Context

Verified from codebase exploration:
- 37 tools in 5 registry modules (memory 16, context 1, causal 4, checkpoint 4, lifecycle 12)
- Launcher at `.opencode/bin/mk-spec-memory-launcher.cjs`: owner-lease single-writer, IPC bridge over `daemon-ipc.sock`, RSS watchdog with in-place recycle, crash-loop detection, respawn after dead socket
- Session proxy at `.opencode/bin/lib/launcher-session-proxy.cjs`: reconnecting MCP proxy with replay classification, keepalive pings, protocol version check
- IPC bridge at `.opencode/bin/lib/launcher-ipc-bridge.cjs`: `getIpcSocketPath()`, `probeDaemon()` with deep JSON-RPC probe, `bridgeStdioToSocket()`
- Daemon context-server at `mcp_server/dist/context-server.js`: full MCP stdio server with 37 tools
- CLI prior art: `generate-context.js` performs memory_save; no other operational CLIs found in `scripts/dist/` (only test scripts exist)

## Negative Knowledge (ruled out)

- Architecture (a) pure CLI: fails zero-feature-loss bar (5 tools + 4 services lost)
- Architecture (c) hybrid: adds 1 week complexity for marginal gain over (b); launcher crash-loop guard already handles daemon restart

## What Worked

- Systematic bottom-up analysis: read every tool definition, handler, and daemon source file
- Architecture-agnostic classification of all 37 tools before comparing architectures
- Tracing the exact IPC path from launcher through bridge to session proxy — this revealed that (b) requires no server changes
- Mapping all ~120 integration references for an honest migration effort estimate

## What Failed

- (none) — all 5 iterations produced novel findings

## Next Focus

Done. Synthesis complete. Verdict: GO for architecture (b).

## Parameters

- Max iterations: 5 (terminal cap reached)
- Convergence threshold: 0 (forced full budget)
- Executor: DeepSeek-v4-pro via cli-opencode
- Status: complete
