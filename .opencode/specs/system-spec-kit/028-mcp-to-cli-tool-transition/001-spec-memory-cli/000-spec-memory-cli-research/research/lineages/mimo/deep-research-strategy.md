# Deep Research Strategy (MiMo Lane)

## Topic

Can the system-spec-kit memory MCP (mk-spec-memory, 37 tools) be replaced by a CLI with ZERO feature loss? Evaluate three architectures — (a) pure per-invocation CLI, (b) CLI front-end over the existing daemon/IPC socket (kill only the MCP protocol layer), (c) hybrid CLI that auto-spawns the daemon on demand.

## Key Questions

- [x] KQ1: Parity matrix for all 37 MCP tools — CLI equivalent per tool → 37/37 classified: 22 STATELESS, 9 STATE-EMBED, 6 STATE-WATCHER, 0 MCP-ONLY
- [x] KQ2: Daemon-dependency audit — what dies under each architecture → Architecture (b) preserves all 13 services; (a) loses 6 tools + 5 services; (c) preserves all with cold-latency caveat
- [x] KQ3: MCP-only affordances and CLI replacements (discovery, permissioning, Zod validation, retryable errors, session-proxy replay) → All 6 affordances have CLI equivalents; token overhead is a net GAIN from elimination
- [x] KQ4: Integration-surface migration (runtime hooks, agents, /doctor, deep-loop) → ~120 references across ~29 files; OpenCode runtime tool registration is sole external dependency
- [x] KQ5: Architecture comparison with effort estimates, risk register, go/no-go → **GO — Architecture (b)** with 3-4 week effort estimate, 37/37 tools preserved, zero daemon-side changes

## Known Context

Verified from codebase exploration:
- 37 tools in 5 registry modules (memory 16, context 1, causal 4, checkpoint 4, lifecycle 12)
  - Source: `mcp_server/tools/memory-tools.ts:45-62`, `context-tools.ts:11`, `causal-tools.ts:24-29`, `checkpoint-tools.ts:24-29`, `lifecycle-tools.ts:39-52`
- Launcher at `.opencode/bin/mk-spec-memory-launcher.cjs`: owner-lease single-writer, IPC bridge over `daemon-ipc.sock`, RSS watchdog with in-place recycle, crash-loop detection, respawn after dead socket
- Session proxy at `.opencode/bin/lib/launcher-session-proxy.cjs`: reconnecting MCP proxy with replay classification, keepalive pings, protocol version check
- IPC bridge at `.opencode/bin/lib/launcher-ipc-bridge.cjs`: `getIpcSocketPath()`, `probeDaemon()` with deep JSON-RPC probe, `bridgeStdioToSocket()`
- Daemon context-server at `mcp_server/dist/context-server.js`: full MCP stdio server with 37 tools
- CLI prior art: `generate-context.js` performs memory_save; the job-queue (`lib/ops/job-queue.ts`) is an in-process daemon-resident data structure for async ingest
- Operational evidence FOR de-MCP-ing: 2026-06-06 mid-session MCP disconnect (owner session closed; Claude Code never reconnects MCP mid-session — 45 tools lost for the session). A per-call CLI would have re-bridged.

## Negative Knowledge (ruled out)

- Architecture (a) pure CLI: fails zero-feature-loss bar (6 STATE-WATCHER tools + 5 services lost)
- Architecture (c) hybrid: adds 1 week complexity for marginal gain over (b); launcher crash-loop guard already handles daemon restart

## What Worked

- Reading every tool registry file to independently verify the 37-tool count (memory-tools.ts:45-62 = 16, context-tools.ts:11 = 1, causal-tools.ts:24-29 = 4, checkpoint-tools.ts:24-29 = 4, lifecycle-tools.ts:39-52 = 12 → total 37)
- Tracing the session_bootstrap handler (session-bootstrap.ts:260-314) — it sub-calls handleSessionResume and handleSessionHealth, both of which depend on daemon-resident working-memory state (memory-surface.ts:10, working-memory.js)
- Examining the job-queue implementation (lib/ops/job-queue.ts) — the IngestJob state machine lives in-process, making ingest_status/ingest_cancel inherently daemon-dependent
- Mapping the launcher-session-proxy replay classification (launcher-session-proxy.cjs:33-58) — replayable vs unsafe tool names show which operations the proxy considers idempotent

## What Failed

- (none) — all 5 iterations produced novel findings

## Next Focus

Done. Synthesis complete. Verdict: GO for architecture (b).

## Parameters

- Max iterations: 5 (terminal cap reached)
- Convergence threshold: 0 (forced full budget)
- Executor: MiMo-V2.5-Pro via cli-opencode (xiaomi-token-plan-ams/mimo-v2.5-pro)
- Status: complete
