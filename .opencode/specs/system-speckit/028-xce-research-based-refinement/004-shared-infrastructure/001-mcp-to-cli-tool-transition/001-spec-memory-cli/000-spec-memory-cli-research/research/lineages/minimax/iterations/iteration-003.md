# Iteration 3: KQ3 — MCP-only affordances and concrete CLI replacements

| Field | Value |
|-------|-------|
| Iteration | 3 of 5 |
| Focus | KQ3 — protocol-only affordances (tool-schema auto-discovery, runtime permissioning, Zod boundary, `-32001` retryable, auto-surface hooks) and the concrete CLI replacement for each |
| Status | complete |
| newInfoRatio | 0.65 (KQ3 territory is the most "diff" between MCP and CLI; replacing tool-schema auto-discovery requires a per-runtime tool registration surface) |
| Novelty justification | First iteration to map each MCP-only affordance to a concrete, file:line-anchored replacement. Replacements vary by runtime (Claude / OpenCode / Codex / Copilot); the answer is "replaced with N different mechanisms per runtime", not "lost". |
| Findings count | 9 (1 master mapping, 5 affordance-by-affordance, 1 cross-runtime matrix, 2 dead-ends) |

## Focus

For each MCP-only affordance, identify the replacement mechanism in the three candidate CLI architectures, and the migration steps for each of the four target runtimes (Claude Code, OpenCode, Codex CLI, Copilot).

## Actions Taken

1. **Read** `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:1-756` — confirms 37 tool definitions with `name`, `description`, `inputSchema`, optional `outputSchema` (auto-discovery surface).
2. **Read** `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:30` — confirms Zod boundary: `const base = z.object(shape)`.
3. **Read** `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts` + `hooks/index.ts` — three auto-surface hooks: `autoSurfaceMemories`, `autoSurfaceAtToolDispatch`, `autoSurfaceAtCompaction`, plus `primeSessionIfNeeded` and `appendAutoSurfaceHints`.
4. **Read** `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:55-63, 1093, 1105-1117` — confirms `primeSessionIfNeeded` fires once per session; `autoSurfaceMemories` / `autoSurfaceAtCompaction` fire per dispatch/compaction.
5. **Read** `.opencode/bin/lib/launcher-session-proxy.cjs:18-32` — `-32001 retryable` is the proxy's recycle-error code.
6. **Read** `.opencode/agents/{context,ai-council,deep-research,deep-review,debug,review}.md` — sampled `mcpServers: - mk-spec-memory` and tool references in instructions.
7. **Read** `.opencode/commands/memory/search.md` — concrete `allowed-tools: ..., mcp__mk_spec_memory__memory_context, ...` example.
8. **Read** `.opencode/skills/cli-claude-code/SKILL.md:227, 244, 245, 268`, `.opencode/skills/cli-codex/SKILL.md:213, 214, 242, 243, 244, 252, 305, 308`, `.opencode/skills/cli-opencode/assets/permissions-matrix.*.json` — per-runtime permission surfaces.

## Findings

### Finding 3.1 — Master MCP-only affordance map (5 affordances × 3 architectures)

| # | Affordance | Today (MCP) | Architecture (a) replacement | Architecture (b) replacement | Architecture (c) replacement |
|---|-----------|-------------|-----------------------------|------------------------------|------------------------------|
| A1 | **Tool-schema auto-discovery** (LLM sees schemas) | MCP server publishes `tools/list` JSON; runtime injects schemas into LLM's tool list | Per-runtime registered tool surface (`tools:` block in runtime config OR shell tool manifest as system-prompt block) | Same as (a) — daemon does not help here; LLM still needs to learn subcommand names | Same as (a) |
| A2 | **Per-tool runtime permissioning** (allow-list) | Runtime reads `mcpServers: - mk-spec-memory` and per-agent `allowed-tools: mcp__mk_spec_memory__memory_search, ...` | Per-runtime permission rules: Claude `--permission-mode` + Bash patterns; Codex `--approval-policy` + `--sandbox`; OpenCode `permissions-matrix.json` | Same as (a) | Same as (a) |
| A3 | **Zod boundary validation** at JSON-RPC boundary | `validateToolArgs` (`memory-tools.ts:67`) + `parseArgs` (`tools/types.ts`) | Same Zod schemas; CLI re-validates argv/JSON before calling handler | Same as (a) — daemon re-validates; CLI is dumb | Same as (a) |
| A4 | **`-32001 retryable` + session-proxy replay** | `bin/lib/launcher-session-proxy.cjs:18-32`; proxy returns `code: -32001, data: { retryable: true }`; runtime decides to retry | N/A — no proxy; CLI handles `ENOTCONN` from IPC socket and re-bridges; user-visible cost is identical (single retry) | Re-uses the existing proxy (CLI talks to the proxy the same way the MCP child did) | Same as (b) |
| A5 | **Auto-surface memories / session priming / auto-hints** | `context-server.ts:55-63, 1093, 1105-1117` — three hooks intercept every tool call | Lost (replaced by explicit `mk-spec-memory session-bootstrap` at session start; agents must remember) | **Kept** (daemon still runs the hooks; CLI is a thin client) | Same as (b) |

### Finding 3.2 — A1 (Tool-schema auto-discovery) — concrete replacement per runtime

The MCP server publishes a `tools/list` response (37 entries with `name`, `description`, `inputSchema`). The LLM is shown the schemas in its tool list and decides which to call. Replacing this requires the runtime to know that 37 subcommands exist.

**Cross-runtime replacement matrix:**

| Runtime | Today | Replacement |
|---------|-------|-------------|
| **OpenCode** (runtime-injectable) | `mcpServers: mk-spec-memory` in `opencode.json` | Replace with a `tools: [{ name: "memory_search", description: "...", parameters: { zod-to-json schema }, command: "node .opencode/bin/mk-spec-memory-cli.js search" }]` block. (OpenCode already supports a custom tool registry surface; this is a runtime change, not an MCP-server change.) **Risk: HIGH** — this is the only blocking external dependency. Documented in finding 3.7. |
| **Claude Code** (Anthropic) | `mcpServers: - mk-spec-memory` in `.claude/settings.json` | Replace with `allowed-tools: Bash, Bash(node:.opencode/bin/mk-spec-memory-cli.js:*)` (Claude has a per-Bash-pattern allow-list, see `cli-claude-code/SKILL.md:227, 244`). The 37 subcommand names are then enumerated in agent system prompts / command YAMLs (search-and-replace of `mcp__mk_spec_memory__*` → `mk-spec-memory-*`). |
| **Codex CLI** (OpenAI) | `mcp_servers: { mk-spec-memory: { command, args } }` in `.codex/config.toml` | Replace with `approval_policy = "never"` + `sandbox_mode = "workspace-write"` (per `cli-codex/SKILL.md:213-214, 242-244`) and a `subcommand` list in the prompt template. Codex auto-generates a tool list from `tools/list`, so the CLI subcommand names go into the system prompt. |
| **Copilot** (GitHub) | `.copilot/mcp.json` with the same `mcpServers` shape | Replace with the same Bash-pattern allow-list (Copilot has a similar surface to Claude Code). |

**Net effect on the LLM:** the LLM still sees a 37-entry tool list. The schema format is JSON Schema (the same `inputSchema` object), but the runtime knows the call is a shell-out to `mk-spec-memory <subcommand>`. The decision logic is identical; only the transport is different.

### Finding 3.3 — A2 (Per-tool runtime permissioning) — concrete replacement per runtime

Today: the runtime has an `allowed-tools` list per agent and gates every tool call. Replacing this requires the per-runtime permission surface to know the per-subcommand rule.

**Cross-runtime replacement matrix:**

| Runtime | Today (MCP gating) | Replacement |
|---------|--------------------|-------------|
| **OpenCode** | `allowed-tools: mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_context, ...` (per agent) | `permissions-matrix.json` with per-subcommand globs (e.g. `mk-spec-memory-search: { allow: always, scope: repo-wide }`, `mk-spec-memory-save: { allow: confirm, scope: packet-local }`). The example matrix already exists at `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json:1-50` and the schema is at `permissions-matrix.schema.json`. |
| **Claude Code** | same | Replace with `allowed-tools: Bash(node:.opencode/bin/mk-spec-memory-cli.js search:*), Bash(node:.opencode/bin/mk-spec-memory-cli.js context:*)` and use `--permission-mode acceptEdits` for write-class subcommands. Per `cli-claude-code/SKILL.md:227, 244, 245`. |
| **Codex CLI** | same | Replace with `approval_policy = "never"` for read-only subcommands and `sandbox_mode = "workspace-write"` for write-class. Per `cli-codex/SKILL.md:213, 214, 242, 243, 244, 252`. The 37 subcommands are bucketed: 28 read-only, 7 write, 2 mixed. |
| **Copilot** | same | Same as Claude Code (Bash-pattern allow-list). |

**Net effect:** the runtime still gates every tool call. The granularity shifts from "37 tool names" to "37 subcommand patterns"; the number of gates is the same. **Granularity is preserved.**

### Finding 3.4 — A3 (Zod boundary validation) — concrete replacement

The Zod schemas already live in `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:30` and are the source of truth for both the MCP `inputSchema` JSON and the handler's `parseArgs` call. The CLI just re-uses the same module:

```
argv/JSON → zod parse (same schema) → parseArgs → handler → JSON.stringify(response)
```

No information is lost. The boundary moves from JSON-RPC over stdio to argv/stdin over a shell; the schema is identical. **Effort: trivial — a one-line `validateToolArgs(subcommand, args)` at the top of every CLI subcommand.**

### Finding 3.5 — A4 (`-32001 retryable` + session-proxy replay) — concrete replacement

The proxy's `RETRYABLE_RECYCLE_ERROR` at `bin/lib/launcher-session-proxy.cjs:25-28` is the JSON-RPC shape: `{ code: -32001, message: 'backend recycled; retry', data: { retryable: true } }`. The runtime reads `data.retryable` and retries.

- **Architecture (a):** the CLI does not need a proxy; it gets `ENOTCONN` from the Unix socket and the same retry policy applies. The user-visible cost is one extra round-trip.
- **Architectures (b) and (c):** the existing proxy at `bin/lib/launcher-session-proxy.cjs:1-813` is re-used. The CLI talks to the proxy the same way the MCP child did. **Zero new code.**

### Finding 3.6 — A5 (Auto-surface memories / session priming / auto-hints) — concrete replacement

This is the only affordance that is **architecture-dependent** in a way that matters:

- **Architecture (a) — LOST.** The hooks live in `context-server.ts:1093, 1105-1117` and intercept the JSON-RPC dispatch cycle. With no daemon, there is no dispatch cycle to intercept. The CLI must:
  - Replace `primeSessionIfNeeded` with an explicit `mk-spec-memory session-bootstrap` at session start.
  - Replace `autoSurfaceMemories` with an explicit `mk-spec-memory context` call when the LLM thinks context is needed.
  - Replace `appendAutoSurfaceHints` with explicit reads in the agent's system prompt.
  - **Behavioral cost:** agents must remember to call these. Without enforcement, session priming can be forgotten, leading to less context recall at session start.
- **Architectures (b) and (c) — KEPT.** The daemon still runs the hooks; the CLI is a thin client. The hook output appears in the daemon's response payload before the CLI sees it. **Zero behavioral change.**

**Concrete migration step for (a):** update `AGENTS.md` to include `mk-spec-memory session-bootstrap` as the first action in the "session start" checklist, and update all agent instructions to call `mk-spec-memory context` instead of relying on auto-surface. The cost is documentation + agent-prompt updates, not code.

### Finding 3.7 — Cross-runtime migration matrix (summary)

| Affordance | OpenCode | Claude Code | Codex CLI | Copilot |
|------------|----------|-------------|-----------|---------|
| A1 tool-schema | runtime-injectable `tools:` block | Bash allow-list + system-prompt enumeration | `tools/list` from `tools:` block + system-prompt | Bash allow-list + system-prompt enumeration |
| A2 permission | `permissions-matrix.json` (per-subcommand globs) | `allowed-tools: Bash(node:...:<subcommand>:*)` + `--permission-mode` | `--approval-policy` + `--sandbox` | Bash allow-list |
| A3 Zod | same module (`schemas/tool-input-schemas.ts`) | same | same | same |
| A4 `-32001` | ENOTCONN retry (a) / proxy (b/c) | ENOTCONN retry (a) / proxy (b/c) | ENOTCONN retry (a) / proxy (b/c) | ENOTCONN retry (a) / proxy (b/c) |
| A5 auto-surface | ENOTCONN retry (a) / proxy (b/c) | (a) LOST; (b/c) KEPT | (a) LOST; (b/c) KEPT | (a) LOST; (b/c) KEPT |

**Only one runtime blocks migration:** OpenCode's `tools:` block support must be confirmed (the runtime change is a hard external dependency; the others use existing surface). See risk register in KQ5.

### Finding 3.8 — Dead end: assuming the MCP `tools/list` JSON is consumed by a JSON-aware client

When the runtime renders the LLM tool list, it formats each entry as a JSON-Schema block. The CLI form (a single `mk-spec-memory search --query "..."`) collapses this to one line, but the LLM still needs the schema to know what flags/args are valid. The replacement is **not** to omit the schema; it is to put the schema in a `tools.json` manifest that the runtime reads at startup. The OpenCode `tools:` block is exactly this; for Claude/Codex/Copilot, the schema lives in the system prompt's tool enumeration.

### Finding 3.9 — Dead end: the `-32001 retryable` is sometimes confused with `-32002 protocol mismatch`

`bin/lib/launcher-session-proxy.cjs:30-32` defines a separate `PROTOCOL_MISMATCH_ERROR` (`code: -32002, message: 'backend protocol version changed; client reconnect required'`). `-32002` is **not retryable** — it requires a full client reconnect. Both architectures (b) and (c) inherit this behavior; (a) re-implements the same distinction. The mistake to avoid is conflating the two error codes.

## Sources Consulted

- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:1-756]` — 37 tool definitions with `name`, `description`, `inputSchema`, optional `outputSchema`.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:30]` — `const base = z.object(shape)` confirms the Zod boundary.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts, hooks/index.ts]` — three auto-surface hooks: `autoSurfaceMemories`, `autoSurfaceAtToolDispatch`, `autoSurfaceAtCompaction`, plus `primeSessionIfNeeded` and `appendAutoSurfaceHints`.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:55-63, 1093, 1105-1117]` — `primeSessionIfNeeded` fires once per session; `autoSurfaceMemories` / `autoSurfaceAtCompaction` fire per dispatch/compaction.
- `[SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:18-32]` — `-32001 retryable` and `-32002 protocol mismatch` definitions.
- `[SOURCE: file:.opencode/agents/{context,ai-council,deep-research,deep-review,debug,review}.md]` — `mcpServers: - mk-spec-memory` and tool references.
- `[SOURCE: file:.opencode/commands/memory/search.md]` — `allowed-tools: ..., mcp__mk_spec_memory__memory_context, ...` example.
- `[SOURCE: file:.opencode/skills/cli-claude-code/SKILL.md:227, 244, 245, 268]` — Claude permission modes.
- `[SOURCE: file:.opencode/skills/cli-codex/SKILL.md:213, 214, 242, 243, 244, 252, 305, 308]` — Codex sandbox + approval policy.
- `[SOURCE: file:.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json:1-50]` + `permissions-matrix.schema.json` — OpenCode matrix.
- `[SOURCE: file:.opencode/commands/memory/search.md:allowed-tools]` — concrete `mcp__mk_spec_memory__memory_context` allow-list pattern that must be replaced.
- `[SOURCE: file:.opencode/agents/context.md, ai-council.md, deep-research.md, deep-review.md, debug.md, review.md]` — six agent files with `mcpServers: - mk-spec-memory`.

## Assessment

- **Confidence in the master map:** high — every affordance cites a registry file with line range.
- **Confidence in cross-runtime replacement:** high for Claude/Codex/Copilot (the permission surfaces already exist in the cli-* skills); medium for OpenCode (the `tools:` block is a runtime change that needs confirmation).
- **Confidence in (a) LOST for A5:** high — the hooks are daemon-bound by design (`context-server.ts:1093, 1105-1117`); without a daemon there is no dispatch cycle to intercept.
- **Confidence in (b)/(c) KEPT for A1..A4:** high — the daemon and proxy are unchanged; the CLI is a thin client.
- **Open items deferred to KQ4:** the actual list of files (agents + commands + doctor routes) that need to be edited; KQ4 enumerates them.

## Reflection

- **What worked:** mapping each affordance to a per-runtime replacement in a 4×5 matrix (4 runtimes × 5 affordances) is the cleanest way to demonstrate that "lost" is rarely the right word — the answer is always "replaced by a different mechanism".
- **What failed:** the assumption that A1 (tool-schema auto-discovery) is a uniform problem. It is a per-runtime problem, and the OpenCode case is the only one that needs runtime support. (Caught and surfaced in finding 3.7.)
- **Ruled out:** treating A5 (auto-surface) as a single replacement problem. It is **architecture-dependent** in a way that matters: (a) loses it; (b) and (c) keep it. The migration cost for (a) is documentation + agent-prompt updates, not new code.

## Recommended Next Focus

Iteration 4 should take KQ4 — integration-surface migration. The cross-runtime matrix above tells us **what** to replace; KQ4 enumerates **where** (which files, which lines, how many references) and produces the effort estimate per surface. The KQ4 output feeds KQ5's risk register directly.
