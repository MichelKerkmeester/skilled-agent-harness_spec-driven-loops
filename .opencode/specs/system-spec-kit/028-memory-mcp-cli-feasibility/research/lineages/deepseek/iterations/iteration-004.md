# Iteration 004: KQ4 — Integration-Surface Migration Map

## Focus
Map every integration point that currently calls MCP tools and define the migration path to CLI.

## Assessment: newInfoRatio=1.0

Fourth iteration — orthogonal to KQ1-KQ3. This is the "how much work" question.

## Findings

### Integration Surface Inventory

#### Surface 1: Runtime Agent alled-tools

Every agent in `.opencode/agents/` lists mk-spec-memory tools in its allowed-tools or uses them in its instructions.

**Evidence from codebase:**

| Agent | File | MCP Tools Used | Migration Impact |
|-------|------|---------------|-----------------|
| **context** | `.opencode/agents/context.md:21,76,96,129,148,162,171,191,195` [SOURCE: file:.opencode/agents/context.md:21] | `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_stats` | Replace MCP tool calls with `spec-memory context/search/match-triggers/list/stats` CLI calls. ~5 references per agent file. |
| **deep-research** | `.opencode/agents/deep-research.md:327` | `memory_context`, `memory_search` | Replace with CLI equivalents. 2 references. |
| **ai-council** | `.opencode/agents/ai-council.md:21,82,127` | `memory_context`, `memory_search`, `memory_match_triggers` | Replace with CLI equivalents. 3 references. |
| **deep-review** | `.opencode/agents/deep-review.md:250` | `memory_search`, `memory_context` | Replace with CLI equivalents. 2 references. |
| **debug** | `.opencode/agents/debug.md:136` | `memory_match_triggers`, `memory_context`, `memory_search` | Replace with CLI equivalents. 3 references. |
| **review** | `.opencode/agents/review.md:64` | `memory_match_triggers`, `memory_context`, `memory_search` | Replace with CLI equivalents. 3 references. |

**Migration estimate:** ~20 total references across 6 agent files. Each is a search-and-replace of tool name -> CLI command. *Low effort, low risk.*

#### Surface 2: Command Workflows (YAML assets)

Every command YAML that references MCP tools must switch to CLI invocations.

**Evidence from grep across `.opencode/commands/`:**

| Command | YAML Asset | MCP Tools Used | Migration Impact |
|---------|-----------|---------------|-----------------|
| `/speckit:resume` | `speckit_resume_auto.yaml`, `speckit_resume_confirm.yaml` | `memory_context`, `memory_search`, `session_bootstrap` | ~15 references total. Replace with `spec-memory context/search/bootstrap`. |
| `/speckit:plan` | `speckit_plan_auto.yaml`, `speckit_plan_confirm.yaml` | `memory_search` | ~8 references. |
| `/speckit:implement` | `speckit_implement_auto.yaml`, `speckit_implement_confirm.yaml` | `memory_search` | ~4 references. |
| `/speckit:complete` | `speckit_complete_auto.yaml`, `speckit_complete_confirm.yaml` | `memory_context`, `memory_search` | ~10 references. |
| `/deep:start-research-loop` | `deep_start-research-loop_auto.yaml`, `deep_start-research-loop_confirm.yaml` | `memory_context`, `mk-spec-memory` (server name) | ~5 references. |
| `/deep:start-review-loop` | `deep_start-review-loop_auto.yaml`, `deep_start-review-loop_confirm.yaml` | `memory_context`, `mk-spec-memory` (server name) | ~5 references. |
| `/deep:start-agent-improvement-loop` | `deep_start-agent-improvement-loop_auto.yaml`, `deep_start-agent-improvement-loop_confirm.yaml` | `memory_search` | ~2 references. |
| `/deep:ask-ai-council` | `deep_ask-ai-council_confirm.yaml` | `memory_context` | ~1 reference. |
| `/doctor` | `doctor_memory.yaml`, `doctor_mcp_debug.yaml`, `doctor_mcp_install.yaml`, `doctor_update.yaml`, `doctor_causal-graph.yaml`, `_routes.yaml` | `memory_search`, `memory_context`, `mcp__mk_spec_memory__*` | ~30 references. The `/doctor` routes are the heaviest integration surface. `_routes.yaml:37-129` [SOURCE: file:.opencode/commands/doctor/_routes.yaml:37] maps 9 route entries to `mcp__mk_spec_memory__memory_search` and `mcp__mk_spec_memory__memory_context`. |

**Migration estimate:** ~80 total references across ~16 YAML assets. Each is a string replacement. *Medium effort, low risk.*

#### Surface 3: Runtime Hooks

**Evidence from codebase:** The `context-server.ts:52-64` imports hooks for `autoSurfaceMemories`, `primeSessionIfNeeded`, `appendAutoSurfaceHints`. These are injected automatically by the MCP server into tool responses. Under a CLI, these would NOT auto-fire unless:
1. The daemon is still running (architectures b/c), OR
2. The CLI explicitly calls `spec-memory bootstrap` first (architecture a).

**Impact:** Under architecture (a), agents lose automatic "session priming" — the constitutional memory injection that happens on first tool call. Agents must explicitly `spec-memory bootstrap` at session start. Under architectures (b)/(c), the daemon provides the same auto-surface behavior through the IPC bridge, but the CLI client must request it explicitly (no automatic MCP response interceptor).

**Migration estimate:** Add `spec-memory bootstrap` call to session startup instructions in AGENTS.md. *Low effort, medium behavioral impact.*

#### Surface 4: OpenCode Configuration (opencode.json)

**Current state:** The `opencode.json` MCP server config registers `mk-spec-memory` as a named MCP server:
```
"mk-spec-memory": {
  "command": "node",
  "args": [".opencode/bin/mk-spec-memory-launcher.cjs"]
}
```

**Migration:** Replace with a shell tool registration. The CLI `spec-memory` needs to be discoverable as a registered tool. Under OpenCode, this means either:
- A new `tools` section for CLI-style tools (not just MCP servers), OR
- A shell-level alias that OpenCode's built-in shell execution can discover.

**Impact:** This is an OpenCode runtime change, not a spec-kit change. It requires OpenCode to support "registered shell tools" with per-subcommand permission gating. This is the **highest-risk migration point** because it touches the runtime itself.

#### Surface 5: Deep-Loop Allowed-Tools

**Evidence:** `deep-start-research-loop_auto.yaml` and `deep-start-review-loop_auto.yaml` both list `mcp_servers: [mk-spec-memory]` [SOURCE: file:.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:88] and use `memory_context` as the primary context tool.

**Migration:** Under architecture (b)/(c), the deep-loop executor (fanout-run.cjs) would use `spawn('spec-memory', ['search', ...])` instead of MCP dispatch. The allowed-tools list changes from MCP tool names to CLI subcommand names.

**Migration estimate:** ~10 references across 4 YAML files. *Low effort, low risk.*

#### Surface 6: Constitutionals and Memory Index Scan

**Evidence from `context-server.ts`:** The `initIngestJobQueue()`, `startFileWatcher()`, `findConstitutionalFiles()`, and `indexSingleFile()` functions are built into the daemon startup. Under architecture (a), the CLI would need to call these explicitly.

**Impact:** Agents lose implicit file indexing. They must explicitly run `spec-memory index-scan` when they create new spec documents. This is a behavioral change for agent authors but not a feature loss — the functionality exists, it just needs explicit invocation.

### Migration Effort Summary

| Surface | Files Affected | Reference Count | Effort | Risk |
|---------|---------------|-----------------|--------|------|
| Agent allowed-tools | 6 .md files | ~20 | Low | Low |
| Command YAML assets | 16 .yaml files | ~80 | Medium | Low |
| Runtime hooks / session priming | context-server.ts, AGENTS.md | ~5 call sites | Low | Medium |
| OpenCode config (opencode.json) | opencode.json, runtime | ~1 config entry | **High** | **High** |
| Deep-loop allowed-tools | 4 .yaml files | ~10 | Low | Low |
| Constitutionals / index scan | context-server.ts | ~3 call sites | Low | Medium |

**Total:** ~120 references across ~29 files.

**Critical path:** The OpenCode runtime change (surface 4) is the only blocking dependency on an external team. Everything else is internal to the spec-kit repo.

## Ruled Out
- (none)

## Next Focus Shifts To
KQ5 — final architecture comparison with effort estimates, risk register, and go/no-go recommendation.
