# Iteration 003: KQ3 — MCP-Only Affordances and CLI Replacements

## Focus
Identify every affordance that exists SOLELY because of the MCP protocol transport, and design concrete CLI replacements for each.

## Assessment: newInfoRatio=1.0

Orthogonal to KQ1/KQ2. Those iterations covered tool portability and daemon dependencies. This iteration covers the protocol-level features that MCP provides and whether CLI equivalents exist.

## Findings

### MCP Protocol Affordance Inventory

I examined the MCP server's context-server.ts, tool-schemas.ts, and the session proxy to identify features that exist because of the MCP protocol:

#### Affordance 1: Tool-Schema Auto-Discovery

**What MCP does:** When a client connects, the MCP server sends `tools/list` with all 37 tool definitions (name, description, JSON schema for args). The client automatically knows what tools are available and how to call them.

**CLI replacement:** `spec-memory list-tools --format json` — a static manifest file generated from the same `tool-schemas.ts` definitions. Updated on build. Agents call this once at startup.

**Verdict: PORTED** — static manifest is functionally equivalent. The MCP version is dynamic (reflects runtime state), but tool definitions don't change at runtime.

#### Affordance 2: Runtime Permissioning

**What MCP does:** OpenCode/Claude runtime provides per-tool permission gating. Each MCP tool call is individually allow/deny-able in the runtime config.

**CLI replacement:** `opencode.json` `permissions.allow` for shell commands. Per-subcommand permission gating requires a runtime feature (registered CLI tools with subcommand-level permissions).

**Verdict: ADAPTED** — the CLI needs a runtime feature that doesn't exist yet. This is the **only external dependency** for the migration. Interim workaround: agents use bare `spec-memory` commands with existing shell execution permissions.

**Risk: HIGH** — this is the critical path item.

#### Affordance 3: Zod Boundary Validation

**What MCP does:** `mcp_server/schemas/tool-input-schemas.ts` validates every tool call's arguments against Zod schemas before the handler runs. Invalid args get structured error responses.

**CLI replacement:** Same Zod schemas at CLI entry point. The `validateToolArgs()` function is already a reusable module — the CLI imports it and validates CLI args before dispatching to handlers.

**Verdict: PORTED** — zero change. The validation logic is transport-agnostic.

[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:23]

#### Affordance 4: -32001 Retryable Error Semantics

**What MCP does:** The session proxy (`launcher-session-proxy.cjs:23-27`) returns `-32001` with `{retryable: true}` when the daemon recycles. Clients automatically retry.

**CLI replacement:** POSIX exit code 75 (`EX_TEMPFAIL`) — standard convention for "temporary failure, retry". CLI wrapper maps `-32001` to exit 75. Agents/scripts check exit code and retry.

**Verdict: PORTED** — functionally equivalent. POSIX exit codes are universal.

[SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:23-27]

#### Affordance 5: Session-Proxy Replay Classification

**What MCP does:** The session proxy classifies tools as replayable vs unsafe (`launcher-session-proxy.cjs:33-58`). On daemon recycle, replayable tool calls are automatically replayed; unsafe ones get `-32001`.

**CLI replacement:** Under architecture (b), the same proxy handles this. The CLI sends JSON-RPC to the daemon; the proxy's replay logic is unchanged. Under architecture (a), there's no proxy — but there's also no daemon recycle, so replay is unnecessary.

**Verdict: PRESERVED** under (b)/(c). Not applicable under (a).

[SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:33-58]

#### Affordance 6: Inline Server Instructions

**What MCP does:** The MCP server can inject instructions into the tool response (e.g., session priming, constitutional context). Agents receive these automatically.

**CLI replacement:** `spec-memory instructions` — explicit call that returns the same instruction payload. Agents call this at session start instead of receiving it implicitly.

**Verdict: PORTED** — explicit call replaces implicit injection. Same data, different trigger mechanism.

### Summary Table

| # | Affordance | CLI Replacement | Status | Risk |
|---|-----------|-----------------|--------|------|
| 1 | Tool-schema auto-discovery | `list-tools --format json` (static manifest) | PORTED | Low |
| 2 | Runtime permissioning | `opencode.json` shell permissions + runtime feature | ADAPTED | **HIGH** |
| 3 | Zod boundary validation | Same Zod modules at CLI entry | PORTED | None |
| 4 | -32001 retryable errors | POSIX exit 75 (EX_TEMPFAIL) | PORTED | Low |
| 5 | Session-proxy replay | Same proxy under (b)/(c); N/A under (a) | PRESERVED | None |
| 6 | Inline server instructions | Explicit `instructions` call | PORTED | Low |

### Bonus Finding: Token Savings

MCP tool schemas add ~2-4KB of JSON to every request (the full schema is sent in tool definitions). Over a typical session with 50-100 tool calls, this is 100-400KB of wasted tokens. A CLI eliminates this entirely — the agent already knows the CLI syntax from its system prompt.

**Net effect: CLI is BETTER than MCP on token efficiency.**

### Key Insight

All 6 MCP affordances have concrete CLI replacements. Only one (runtime permissioning) requires an external change (OpenCode runtime feature). The other 5 are either transport-agnostic (Zod, replay, instructions) or have standard CLI equivalents (manifest, exit codes). The MCP protocol provides convenience, not unique capability.

## Ruled Out
- "MCP-only" features that have no CLI equivalent: **none found.** Every MCP affordance is replaceable.

## Next Focus Shifts To
KQ4 — the migration effort: mapping every file that references MCP tools, counting references, and identifying the critical-path dependency (OpenCode runtime shell-tool registration).
