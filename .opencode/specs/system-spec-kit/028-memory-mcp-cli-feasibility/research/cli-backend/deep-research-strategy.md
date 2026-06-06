# Deep Research Strategy — Run 2: CLI Back-End Design (dual-stack)

## Topic

Design the `spec-memory` CLI back-end that lives ALONGSIDE the mk-spec-memory MCP as a fallback. Dual-stack: MCP stays registered and primary for interactive sessions; the CLI is the resilience + universal surface (hooks, cron, CI, scripts, MCP-transport-down recovery).

## Premise (settled by run 1 — do NOT relitigate)

- GO verdict: CLI over the existing daemon/IPC socket with auto-spawn; zero feature loss; 37 tools, 0 MCP-only; daemon services must stay.
- Read as input: `../research.md` (merged synthesis), `../lineages/{deepseek,minimax,mimo}/research.md`, and their iteration files. These are PREMISE documents for this run, not contamination.

## Key Questions

- [ ] KQ1 (iteration 1): CLI architecture — entrypoint + packaging location; connect path over `daemon-ipc.sock` with auto-spawn-on-ENOENT/ECONNREFUSED reusing `mk-spec-memory-launcher.cjs` + `launcher-ipc-bridge.cjs`; subcommand layer for all 37 tools (codegen from `tool-schemas.ts` vs handwritten; Zod reuse at argv); output contracts (`--format json|text|jsonl`); exit-code map incl. 75 EX_TEMPFAIL.
- [ ] KQ2 (iteration 2): Dual-stack coexistence — concurrent CLI+MCP clients on one daemon (serialization, sessionId propagation for dedup/learning/working-memory); env + dbDir resolution parity with the launcher; fallback ergonomics (how agents/hooks detect MCP-down and shell out — exact AGENTS.md/skill guidance text); explicit non-goals (no MCP removal, no ~125-reference migration).
- [ ] KQ3 (iteration 3): Delivery plan — file-level implementation plan with module reuse (`mcp_server/cli.ts` prior art, `launcher-ipc-bridge.cjs`, `tools/index.ts` dispatch); test strategy (unit, live-daemon integration, dual-client MCP+CLI parallel); Claude Code permission allowlist patterns; packaging/install; risk register + effort estimate.

## Known Context

- The daemon already speaks JSON-RPC over a unix socket; the session proxy and IPC bridge are battle-tested (run-1 evidence).
- Existing CLI prior art: `mcp_server/cli.ts` (stats, bulk-delete, reindex, schema-downgrade), `scripts/dist/memory/generate-context.js` (canonical save — performed a full indexed save with the MCP down on 2026-06-06, proving the daemon-free save path).
- 2026-06-06 incident (motivation): owner-exit left the daemon down; Claude Code never reconnects MCP mid-session; a bridged secondary rode the ~41s reattach ladder and gave up.
- STATE-WATCHER tools (`ingest_status/cancel`, `session_health/resume/bootstrap`) require the daemon to be up — the CLI's auto-spawn path must cover them.

## Negative Knowledge (ruled out)

- Pure per-invocation CLI without daemon (run 1: fails zero-loss).
- MCP removal in this design (explicit non-goal — dual-stack).

## Next Focus

Iteration 1 → KQ1 (architecture). Each iteration answers exactly one KQ with file:line evidence.

## Parameters

- Max iterations: 3 (terminal cap; one KQ per iteration)
- Convergence threshold: 0 (forced full budget)
