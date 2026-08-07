# Iteration 003: KQ3 — MCP-Only Affordances and CLI Replacements

## Focus
Identify every feature that exists only because of MCP protocol transport, and design the concrete CLI replacement for each.

## Assessment: newInfoRatio=1.0

Third iteration — all findings orthogonal to KQ1 and KQ2. No overlap with classified tools or daemon services.

## Findings

### MCP Affordance Inventory

From the MCP SDK integration at `mcp_server/context-server.ts:16-18` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:16]:
```ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
```

The MCP protocol provides these affordances:

#### 1. Tool-Schema Auto-Discovery (ListToolsRequestSchema)

**MCP mechanism:** The client sends `tools/list`, the server responds with all 37 `TOOL_DEFINITIONS` (names, descriptions, JSON input schemas). This is how agents know what tools exist without hardcoding.

**Source:** `mcp_server/tool-schemas.ts` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:1-756] defines all 37 `ToolDefinition` objects with `name`, `description`, `inputSchema`, and `outputSchema`.

**CLI replacement:** `spec-memory list-tools --format json` — exports all tool definitions as a JSON manifest. This trades dynamic discovery for static, but the tool set changes only on code updates (not at runtime), so a static manifest is functionally equivalent.

**Verification:** The tool-schemas.ts file is a static TypeScript module. It never changes at runtime. A build step can export it to a JSON manifest file. Loss: none if the CLI ships with matching manifest.

#### 2. Runtime Permissioning

**MCP mechanism:** OpenCode (and other clients) gate each tool call on a user-consented allowlist. The MCP protocol tags each tool with its name, and the runtime's permission system checks before dispatching.

**Source:** The runtime permissioning happens at the OpenCode/Claude/Codex/Copilot level, NOT in the MCP server. The MCP server just declares tools; the runtime decides which to allow.

**CLI replacement:** OpenCode already has a `permissions.allow` list in `opencode.json` for shell tools. The same mechanism works for a CLI: add `spec-memory` to the allowlist with subcommand-level granularity (e.g., `spec-memory search` allowed, `spec-memory delete` require confirmation). This is an OpenCode config change, not a CLI change.

#### 3. Zod Boundary Validation

**MCP mechanism:** Every tool's input is validated against its Zod schema at the server boundary. `validateToolArgs()` in `mcp_server/context-server.ts:1057-1059` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1057]:
```ts
const validatedArgs = KNOWN_TOOL_NAMES.has(name)
  ? validateToolArgs(name, args) as Record<string, unknown>
  : args;
```

**CLI replacement:** The same Zod schemas can validate CLI arguments. The schemas live in `schemas/tool-input-schemas.ts` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts] and are reusable TypeScript modules. `spec-memory search --query "..."` would validate `query` against the same Zod schema before executing.

**Key insight:** The Zod schemas are NOT MCP-specific. They are general input validation that the MCP server happens to call at the boundary. Moving them to the CLI is a straight port — same library, same function calls, different invocation point.

#### 4. -32001 Retryable Error Semantics

**MCP mechanism:** The session proxy emits `-32001` errors with `{ retryable: true }` data when the backend recycles mid-request. The MCP client (not the LLM agent) handles reconnection transparently.

**Source:** `launcher-session-proxy.cjs:23-27` [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:23]:
```js
const RETRYABLE_RECYCLE_ERROR = Object.freeze({
  code: -32001,
  message: 'backend recycled; retry',
  data: { retryable: true },
});
```

**CLI replacement:** Exit code mapping. A CLI can use POSIX exit codes: exit 75 (EX_TEMPFAIL) for retryable transient failures, exit 1 for permanent errors. The calling agent can then retry on exit 75. This is slightly less granular than JSON-RPC error codes but functionally equivalent for retry decisions.

**Architecture (b) benefit:** Under architecture (b), the CLI is an IPC client to the same daemon. The daemon can still emit -32001 JSON-RPC errors, and the CLI can parse them and map to appropriate exit codes. This preserves the full error granularity.

#### 5. Session-Proxy Replay Classification

**MCP mechanism:** On backend recycle, the session proxy replays `REPLAYABLE_TOOL_NAMES` (safe: search, context, triggers, save, bootstrap, health, resume, stats, checkpoint_list, embedder_health) and returns -32001 for `UNSAFE_TOOL_NAMES` (delete, update, restore, sweep, ingest_start, ingest_cancel).

**Source:** `launcher-session-proxy.cjs:33-58` [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:33]:
```js
const REPLAYABLE_TOOL_NAMES = new Set([...]);
const UNSAFE_TOOL_NAMES = new Set([...]);
```

**CLI replacement:** Under architecture (a) — no proxy, no replay. The CLI itself IS the invocation, so there's no "reconnect mid-request" scenario. Under architectures (b)/(c) — the session proxy is still present, it's just accessed through the CLI IPC client instead of MCP stdio. The replay classification lives in the proxy, not in the MCP layer.

#### 6. Inline Server Instructions

**MCP mechanism:** The `buildServerInstructions()` at `context-server.ts:898-989` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:898] generates dynamic instructions describing how many memories are indexed, active/stale counts, search channels, session recovery digest, and structural bootstrap guidance. These are surfaced to the AI agent at session start.

**CLI replacement:** `spec-memory instructions` — a read-only command that produces the same dynamic instructions text. The AI agent calls this once at session start instead of getting it injected automatically. Minor UX difference: the agent must explicitly ask for instructions rather than receiving them automatically.

### MCP Affordance CLI Replacement Summary

| MCP Affordance | CLI Replacement | Lost? |
|---------------|-----------------|-------|
| Tool-schema auto-discovery | `spec-memory list-tools --format json` | No — static manifest is equivalent for a statically-defined tool set |
| Runtime permissioning | `opencode.json` `permissions.allow` for shell tools | No — same mechanism, different tool type |
| Zod boundary validation | Same Zod schemas, called at CLI entry point | No — schemas are reusable modules |
| -32001 retryable errors | POSIX exit code 75 (EX_TEMPFAIL) | Minimal — slightly less granular but functionally equivalent |
| Session-proxy replay | Same proxy under architectures (b)/(c); N/A under (a) | No for (b)/(c); not needed under (a) |
| Inline server instructions | `spec-memory instructions` | No — explicit call replaces implicit injection |
| MCP transport overhead | N/A — CLI eliminates it | **This is a GAIN, not a loss**: no token overhead for tool schemas in every request, no MCP negotiation handshake per session |

### The Hidden Gain: Token Budget Savings

The MCP protocol requires every tool invocation to carry the full tool schema in the request context. For 37 tools with complex input schemas (e.g., `memory_search` has ~40 properties), this is significant token overhead per session. A CLI eliminates this entirely — the agent calls `spec-memory search --query "..." --limit 10` with only the needed args.

The spec's own problem statement confirms: "every session pays tool-schema token overhead" [SOURCE: file:.opencode/specs/system-spec-kit/028-memory-mcp-cli-feasibility/spec.md:53].

## Ruled Out
- (none)

## Next Focus Shifts To
KQ4 — map every current MCP caller (runtime hooks, agents, /doctor, deep-loop) and define the migration path for each.
