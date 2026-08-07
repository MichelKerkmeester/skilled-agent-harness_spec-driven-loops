# Deep Research Strategy

## Topic

Can the system-spec-kit memory MCP (mk-spec-memory, 37 tools) be replaced by a CLI with ZERO feature loss? Evaluate three architectures — (a) pure per-invocation CLI, (b) CLI front-end over the existing daemon/IPC socket (kill only the MCP protocol layer), (c) hybrid CLI that auto-spawns the daemon on demand — scoring each against the zero-feature-loss bar.

## Key Questions

- [ ] KQ1: What is the CLI equivalent for each of the 37 MCP tools (full parity matrix)? Prior art: `generate-context.js` already performs memory_save; ~11 maintenance CLIs exist under `scripts/dist/memory/`.
- [ ] KQ2: Which features depend on a long-lived daemon (warm embedder, file-watcher reindex, async retry queue/enrichment, RSS watchdog, single-writer serialization, warm session briefs), and what dies under each architecture?
- [ ] KQ3: Which affordances exist ONLY because of the MCP protocol (tool-schema auto-discovery, runtime permissioning, Zod boundary validation, -32001 retryable + session-proxy replay), and what are the concrete CLI replacements?
- [ ] KQ4: What does migrating every current MCP caller entail (runtime hooks for Claude/OpenCode/Codex/Copilot calling session_bootstrap/memory_context, agents' allowed-tools, /doctor flows, deep-loop allowed-tools)?
- [ ] KQ5: How do architectures a/b/c compare on the zero-feature-loss bar, effort, and risk — and what is the go/no-go recommendation?

## Known Context

Verified facts available at init (from pre-run exploration of this repo; lanes should re-verify citations independently):
- The MCP server registers 37 tools across 5 registry files under `.opencode/skills/system-spec-kit/mcp_server/tools/` (memory 16, context 1, causal 4, checkpoint 4, lifecycle 12).
- The launcher/daemon layer (`.opencode/bin/mk-spec-memory-launcher.cjs` + `lib/launcher-ipc-bridge.cjs` + `lib/launcher-session-proxy.cjs`) already speaks JSON-RPC over a unix socket (`daemon-ipc.sock`); the MCP-protocol-specific surface is the stdio transport + tool schemas + session-proxy replay classification.
- Daemon-resident services: local-first embedding cascade (ollama → hf-local → OpenAI → Voyage) with warm model server, chokidar file-watcher, async embedding retry queue, RSS watchdog with in-place recycle, owner-lease single-writer model.
- CLI prior art: `scripts/dist/memory/generate-context.js` (canonical save), plus reindex/cleanup/validate/backfill/rank maintenance CLIs.
- Operational evidence FOR de-MCP-ing: 2026-06-06 mid-session MCP disconnect (owner session closed; bridged secondary rode the ~41s reattach ladder, gave up, and Claude Code never reconnects MCP mid-session — 45 tools lost for the session). A per-call CLI would have re-bridged.
- Evidence AGAINST / costs: MCP gives agents automatic tool discovery + schemas + per-tool permission gating; hooks and agents across 4 runtimes currently call MCP tools directly.

## Negative Knowledge (ruled out)

- (none yet)

## Next Focus

Start with KQ1 (parity matrix) and KQ2 (daemon-dependency audit) — they anchor every other question.

## Parameters

- Max iterations: 5 (per lane, terminal cap)
- Convergence threshold: 0 (forced full iteration budget; legal early stop only via all-questions-answered)
