# Iteration 004: KQ4 — Integration-Surface Migration Map

## Focus
Map every file that currently calls MCP tools and estimate the migration effort per surface.

## Assessment: newInfoRatio=1.0

Orthogonal to KQ1-KQ3. Those covered tool portability, daemon dependencies, and protocol affordances. This iteration covers the concrete migration work: which files change, how many references, and what effort.

## Findings

### Integration Surface Inventory

I searched the codebase for all references to MCP tool names, `mcp__mk_spec_memory`, and MCP server declarations:

#### Surface 1: Agent Allowed-Tools Lists

**Files:** 6 `.md` agent files under `.opencode/agents/`
**References:** ~20 tool name references
**Pattern:** `allowed-tools: [mk-spec-memory.memory_search, mk-spec-memory.memory_context, ...]`
**Migration:** Replace MCP tool names with CLI subcommand names. Search-and-replace.
**Effort:** Low (~1 hour)
**Risk:** Low — agents already use tool names as strings.

#### Surface 2: Command YAML Assets

**Files:** 16 `.yaml` files under `.opencode/commands/`
**References:** ~80 tool references
**Pattern:** `mcp_servers: { mk-spec-memory: {...} }` and tool name references in prompts
**Migration:** Remove `mcp_servers` declarations. Replace tool references with CLI invocations. Update prompt templates.
**Effort:** Medium (~2-3 days)
**Risk:** Low — YAML is declarative; no behavioral logic changes.

#### Surface 3: Runtime Hooks / Session Priming

**Files:** `mcp_server/context-server.ts`, `AGENTS.md`
**References:** ~5 references to session priming hooks
**Migration:** Replace MCP hook-based priming with explicit CLI `session-bootstrap` call at session start.
**Effort:** Low (~2 hours)
**Risk:** Medium — session priming behavior changes from implicit to explicit.

#### Surface 4: OpenCode Config

**Files:** `opencode.json` (root config)
**References:** ~1 MCP server registration
**Migration:** Remove MCP server registration. Add CLI tool registration (if supported) or document shell execution path.
**Effort:** **Unknown** — depends on OpenCode runtime supporting registered CLI tools with per-subcommand permissions.
**Risk:** **HIGH** — this is the sole external dependency. If OpenCode doesn't support this, the migration uses bare shell execution with confirmation prompts.

#### Surface 5: Deep-Loop Allowed-Tools

**Files:** 4 `.yaml` files under `.opencode/commands/deep/`
**References:** ~10 tool references
**Pattern:** Same as Surface 2 — MCP tool names in allowed-tools lists.
**Migration:** Replace MCP tool names with CLI subcommands.
**Effort:** Low (~1 hour)
**Risk:** Low

#### Surface 6: Constitutionals / Index Scan

**Files:** `mcp_server/context-server.ts`
**References:** ~3 references to constitutional memory injection on startup
**Migration:** Move constitutional injection to explicit CLI call or agent system prompt.
**Effort:** Low (~1 hour)
**Risk:** Medium — constitutional injection behavior changes.

### Migration Summary

| Surface | Files | References | Effort | Risk |
|---------|-------|-----------|--------|------|
| Agent allowed-tools | 6 | ~20 | Low | Low |
| Command YAML assets | 16 | ~80 | Medium | Low |
| Runtime hooks | 2 | ~5 | Low | Medium |
| OpenCode config | 1 | ~1 | **Unknown** | **HIGH** |
| Deep-loop allowed-tools | 4 | ~10 | Low | Low |
| Constitutionals | 1 | ~3 | Low | Medium |
| **Total** | **~29** | **~120** | | |

### Critical Path

The OpenCode runtime's support for "registered CLI tools" with per-subcommand permission gating is the **only external dependency**. Everything else is within the spec-kit repo.

**Interim workaround:** Agents use bare `spec-memory` commands via existing shell execution with confirmation prompts. This loses per-subcommand granularity but preserves functionality.

**Alternative:** If OpenCode never adds this feature, the CLI can be wrapped in a thin MCP server that translates MCP tool calls to CLI invocations — but this defeats the purpose of eliminating MCP.

### Key Insight

The migration is almost entirely search-and-replace across ~29 files with ~120 references. No behavioral logic changes — only the transport mechanism changes. The only non-trivial work is the OpenCode runtime integration, which is an external dependency with an interim workaround.

## Ruled Out
- (none)

## Next Focus Shifts To
KQ5 — synthesizing KQ1-KQ4 into an architecture comparison with quantitative scoring, effort estimates, risk register, and the go/no-go recommendation.
