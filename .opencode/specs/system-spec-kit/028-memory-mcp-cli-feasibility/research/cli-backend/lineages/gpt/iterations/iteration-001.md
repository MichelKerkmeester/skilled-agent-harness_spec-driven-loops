# Iteration 1: CLI Architecture

## Focus

KQ1: entrypoint and packaging location, daemon IPC connect path with auto-spawn, all-37-tool subcommand layer, output contracts, and exit-code map.

## Findings

1. The right shape is a compiled `mcp_server` implementation plus a stable `.opencode/bin/spec-memory` shim. The existing package already exposes a compiled CLI bin (`spec-kit-cli` -> `dist/cli.js`), while `.opencode/bin/` owns launcher bootstrap, env loading, build checks, lease arbitration, and bridge behavior for runtime entrypoints. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:13] [SOURCE: file:.opencode/bin/README.md:14] [SOURCE: file:.opencode/bin/README.md:71]

2. Existing `mcp_server/cli.ts` is good prior art but too narrow for the new universal surface. It supports stats, bulk-delete, reindex, and schema-downgrade, initializes the DB without MCP, and wires `coreIndex.init()` so handlers invoked from CLI can reuse db-state wiring. The new CLI should keep this operational utility or fold it into `spec-memory admin`, but the daemon-backed 37-tool surface needs a new dispatcher path. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/cli.ts:9] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/cli.ts:141] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/cli.ts:156]

3. The daemon IPC endpoint is already a named socket path, with optional short path override. `launcher-ipc-bridge.cjs` defines `daemon-ipc.sock`, resolves `SPECKIT_IPC_SOCKET_DIR` or the service DB dir, and supports both Unix socket and `tcp://` connection options. The CLI should reuse `getIpcSocketPath('mk-spec-memory', { dbDir })` and not duplicate socket resolution. [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:8] [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:59] [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:69]

4. Auto-spawn should reuse `mk-spec-memory-launcher.cjs`, not invent a new daemon owner. The launcher loads project env, resolves paths, acquires owner/bootstrap leases, builds dist if missing, starts the backend-only context server, writes the lease, and starts the session proxy. For an already-held lease with a dead socket, it can respawn after probe/reap checks. [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:157] [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1328] [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1374] [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1397] [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:671]

5. Generate the subcommand manifest from `TOOL_DEFINITIONS` and validate argv through `validateToolArgs`. The public schema list contains the canonical 37 registrations, and `tool-input-schemas.ts` exports strict Zod validation, allowed parameter guidance, and a single `validateToolArgs(toolName, rawInput)` boundary. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:709] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:753] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:28] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:685]

6. Output contracts should default to JSON and add text/jsonl as presentation layers. The server already returns MCP-style JSON payloads through the same dispatch route, and existing eval reporting has a `format` parameter that accepts text/json, so the new CLI can offer `--format json|text|jsonl` without changing handlers. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1033] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1137] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:600]

Recommended exit codes:

| Code | Meaning | Evidence/Rationale |
|---:|---|---|
| 0 | Success, including successful JSON-RPC error payload when explicitly requested as raw MCP frame | Existing bridge exits 0 after reporting unbridgeable lease held on stdout. [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:774] |
| 1 | Local CLI usage, validation, or non-retryable execution error | Current CLI exits 1 for invalid args and missing DB. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/cli.ts:153] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/cli.ts:245] |
| 64 | Command-line usage error | Conventional split from runtime failure; map unknown subcommands and missing required flags here. |
| 69 | Service unavailable after non-retryable daemon failure | Use when launcher spawn fails or protocol mismatch is non-retryable. |
| 75 | Retryable temporary failure | Map daemon recycle, cold-start exhaustion, `-32001`, ENOENT/ECONNREFUSED before spawn exhaustion, and queued-frame overflow to EX_TEMPFAIL. Existing proxy emits retryable `-32001`. [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:23] [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:223] |

## Sources Consulted

- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/bin/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/cli.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`

## Assessment

`newInfoRatio`: 1.0. The pass established the architecture directly from fresh lineage evidence. Confidence is high for the daemon-backed design and medium-high for the exact package naming until an implementation packet chooses whether to retain `spec-kit-cli` as admin-only or alias it to `spec-memory`.

## Reflection

What worked: reading launcher and schema code together made the implementation shape obvious.

What failed: direct-handler CLI as primary path would lose daemon runtime behavior.

Ruled out: handwritten 37-tool CLI as the default.

## Recommended Next Focus

KQ2: prove dual-stack coexistence semantics and write the exact fallback guidance.
