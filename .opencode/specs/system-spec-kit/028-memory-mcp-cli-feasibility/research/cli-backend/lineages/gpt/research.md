# Deep Research Synthesis - GPT Lineage: CLI Back-End Design

- Date: 2026-06-06
- Session: `fanout-gpt-1780740389166-k7ph9k`
- Parent: `dr-20260606T120541-cli-backend`
- Executor: `cli-codex model=gpt-5.5`
- Iterations: 3/3
- Stop reason: `maxIterationsReached`, with 3/3 key questions answered

## Verdict

Build the `spec-memory` CLI as a daemon-backed dual-stack surface, not as a daemon-free replacement. The implementation should be a compiled `mcp_server` CLI plus a stable `.opencode/bin/spec-memory.cjs` shim. The CLI should call the existing `daemon-ipc.sock` JSON-RPC surface, auto-spawn through `mk-spec-memory-launcher.cjs` when the daemon/socket is absent or dead, generate its subcommand manifest from the canonical 37 `TOOL_DEFINITIONS`, and reuse strict Zod validation at the argv boundary.

This preserves the run-1 verdict: zero feature loss depends on keeping the daemon. Run 2 should not remove MCP or migrate the existing MCP references; it should add a fallback/universal access path.

## KQ1 - CLI Architecture

Recommended layout:

| Surface | Recommendation | Evidence |
|---|---|---|
| Stable runtime path | `.opencode/bin/spec-memory.cjs` | `.opencode/bin/` owns runtime-spawned launchers and bridge behavior. [SOURCE: file:.opencode/bin/README.md:14] |
| Compiled implementation | `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` -> `dist/spec-memory-cli.js` | The package already exposes compiled bins. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:13] |
| Existing admin CLI | Keep or fold `cli.ts` under `spec-memory admin` | Current CLI is narrow maintenance prior art. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/cli.ts:9] |
| Socket path | Reuse `getIpcSocketPath('mk-spec-memory', { dbDir })` | Existing bridge resolves `SPECKIT_IPC_SOCKET_DIR` or DB dir. [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:59] |
| Auto-spawn | Spawn/reuse `mk-spec-memory-launcher.cjs` | Launcher already loads env, leases, builds, starts backend-only daemon, and proxies stdio. [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1328] |
| Subcommands | Generate from `TOOL_DEFINITIONS` and validate through `validateToolArgs` | 37 canonical registrations live in `TOOL_DEFINITIONS`; strict Zod validation lives in `tool-input-schemas.ts`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:709] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:685] |
| Output | `--format json|text|jsonl`, JSON canonical | Server dispatch already returns structured payloads; renderers should not change handler contracts. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1137] |

Exit-code map:

| Code | Meaning |
|---:|---|
| 0 | Success |
| 1 | Local validation/runtime error |
| 64 | CLI usage error |
| 69 | Non-retryable service unavailable/protocol mismatch |
| 75 | Retryable daemon/socket temporary failure, including `-32001` and cold-start exhaustion |

## KQ2 - Dual-Stack Coexistence

The CLI should be another IPC client. The context server already starts an IPC bridge and registers the same handlers for secondary clients. Existing tests prove the bridge serves multiple concurrent clients. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2183] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts:279]

Launcher ownership is the concurrency boundary. The owner lease ensures one daemon owner; second launchers are bridged or receive retryable JSON-RPC errors instead of opening a competing database writer. [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:365] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287]

Session continuity should be explicit. Expose `--session-id`, forward it into tool args as `sessionId`, and default to `CODEX_THREAD_ID` when present. The server already resolves session identity from args, transport metadata, `CODEX_THREAD_ID`, and a sticky last-known session. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:522] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:535]

Env/db parity should reuse current resolution. The launcher loads `.env.local` and `.env`; core config resolves `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, and `MEMORY_DB_PATH`; runtime configs pin short socket dirs for mk-spec-memory. [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:47] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/core/config.ts:63] [SOURCE: file:.codex/config.toml:65]

Fallback guidance to add in the implementation packet:

```text
If mk-spec-memory MCP tools are unavailable or a memory call returns a retryable transport/lease error, use the dual-stack CLI fallback without unregistering MCP:

  node .opencode/bin/spec-memory.cjs <tool-name-or-alias> --json '<args>' --format json --session-id "$CODEX_THREAD_ID"

Prefer MCP when it is live. Use the CLI for hooks, cron, CI, scripts, and MCP-transport-down recovery. Treat CLI calls as the same memory surface: pass specFolder/sessionId, preserve Gate 3 behavior for memory saves, and do not start a direct database writer.
```

Non-goals:

- Do not remove MCP registration.
- Do not migrate the 120-125 existing MCP references in this packet.
- Do not bypass daemon session/watch/queue behavior.

## KQ3 - Delivery Plan

File-level plan:

| File | Change |
|---|---|
| `.opencode/bin/spec-memory.cjs` | New shim for env loading, socket probe, launcher auto-spawn, and compiled CLI handoff. |
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | New command parser, JSON-RPC caller, format renderer, exit-code mapper. |
| `.opencode/skills/system-spec-kit/mcp_server/cli-manifest.ts` | Generated/derived manifest from `TOOL_DEFINITIONS` + `TOOL_SCHEMAS`. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Add `spec-memory` bin and focused tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli.vitest.ts` | Unit tests for argv, validation, format, aliases, exit codes. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-ipc.vitest.ts` | Integration tests for probe, auto-spawn, retryable failure, live IPC. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-dual-client.vitest.ts` | Parallel MCP+CLI test against one daemon. |
| Runtime configs/docs | Add narrow allowlist and guidance; leave MCP configured. |

Test plan:

- Build/typecheck: `npm run build`, `npm run typecheck` under `.opencode/skills/system-spec-kit`. [SOURCE: file:.opencode/skills/system-spec-kit/package.json:14]
- Focused mcp-server tests: CLI, tool schema, tool contract parity, MCP dispatch, launcher IPC bridge, session proxy, launcher lease. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:26]
- Add all-37 schema/subcommand parity by extending current parity test beyond its four-tool scope. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/tool-contract-parity.vitest.ts:15]
- Add live dual-client test: one daemon, one MCP/stdio request, one CLI IPC request, same temp DB/socket.
- Add Claude Code permission pattern: `Bash(node .opencode/bin/spec-memory.cjs *)`. Current settings show allowlist patterns are explicit strings. [SOURCE: file:.claude/settings.local.json:8]

Risk register:

| Risk | Severity | Mitigation |
|---|---|---|
| CLI bypasses daemon behavior | High | Public 37-tool CLI uses daemon IPC only; direct DB remains admin-only. |
| Schema drift | High | Generate manifest; test all 37 public/Zod/CLI names. |
| Competing daemon | High | Reuse launcher owner lease and tests. |
| Retry ambiguity | Medium | Standardize `-32001` and transient socket failures to exit 75. |
| Overbroad shell permissions | Medium | Add narrow exact-path Bash allowlist. |
| Format drift | Low | JSON is canonical; text/jsonl render parsed JSON. |

Effort estimate: 8-12 engineering days, plus rollout/monitoring.

## Negative Knowledge

- Pure per-invocation CLI is still rejected.
- MCP removal is outside this run.
- Existing `mcp_server/cli.ts` is useful prior art but not the full tool surface.
- Broad `Bash(*)` or generic shell allowlists are not needed.

## Convergence Report

| Metric | Value |
|---|---|
| Iterations | 3/3 |
| Questions answered | 3/3 |
| newInfoRatio trend | `1.00 -> 0.82 -> 0.70` |
| Rolling average | `0.84` |
| Stop reason | `maxIterationsReached` |
| Legal-stop gates | pass by terminal cap and full question coverage |
| Graph gates | not applicable |

## References

- `.opencode/specs/system-spec-kit/028-memory-mcp-cli-feasibility/research/research.md`
- `.opencode/specs/system-spec-kit/028-memory-mcp-cli-feasibility/research/cli-backend/deep-research-strategy.md`
- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/package.json`
- `.opencode/skills/system-spec-kit/package.json`
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-session-proxy.vitest.ts`
- `.claude/settings.local.json`
