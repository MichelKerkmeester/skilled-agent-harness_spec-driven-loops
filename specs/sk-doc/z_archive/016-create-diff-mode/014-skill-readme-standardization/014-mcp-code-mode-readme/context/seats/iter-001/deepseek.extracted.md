---

## 1. PURPOSE

Code Mode is the mandatory execution layer for external MCP tool calls — it lets an AI agent call tools from MCP servers configured in `.utcp_config.json` by writing TypeScript that runs in a single sandboxed execution, loading tool schemas on demand rather than injecting every tool definition into the context window.

## 2. PROBLEM

When an AI client loads tool definitions directly, every registered MCP tool consumes ~3,000 tokens of context (schema, description, type definitions, usage examples). With 47 tools, that is ~141,000 tokens consumed before any real work begins, making 2–3 MCP servers the practical ceiling before context exhaustion. Multi-tool workflows compound this: each tool call is a separate AI reasoning loop with its own round trip, so a Figma→ClickUp→CMS pipeline takes 15+ API round trips with no shared state between them.

Code Mode solves both problems by exposing only 4 meta-tools (~1,600 tokens total) to the AI. Tools are discovered via `search_tools` at call time, full schemas load with `tool_info` only when needed, and all external calls execute inside a single `call_tool_chain` TypeScript block where variables persist naturally between operations. The result: unlimited MCP servers at constant context cost, and multi-tool workflows collapse from 15+ round trips into one execution.

## 3. MODES & CAPABILITIES

**Four code_mode tools (as registered in SKILL.md `allowed-tools`):**

| Tool | What it does |
|------|-------------|
| `code_mode_search_tools` | Finds tools matching a natural-language task description (progressive discovery) |
| `code_mode_list_tools` | Returns all tool names currently registered from `.utcp_config.json` |
| `code_mode_tool_info` | Returns the full TypeScript interface definition for a specific tool name |
| `code_mode_call_tool_chain` | Executes a TypeScript string with direct access to every configured tool namespace; returns `{ result, logs }` |

**Headline capabilities (each one line):**

- **Progressive disclosure** — only tool names and descriptions load during discovery; full schemas load on demand via `tool_info`, so unused tools cost zero context.
- **Context reduction** — ~1,600 tokens for the four meta-tools versus ~141,000 tokens for 47 direct tool definitions (~98.7% reduction).
- **State persistence** — variables declared in a `call_tool_chain` block remain in scope for all subsequent tool calls within the same execution; data flows naturally between operations.
- **Built-in error handling** — `try/catch` in the TypeScript block isolates failures; `Promise.allSettled` enables partial-success workflows; unhandled exceptions stop the entire chain.

**Three additional tools surfaced by the runtime but NOT in the skill's `allowed-tools`:**
`get_required_keys_for_tool`, `register_manual`, and `deregister_manual` appear in the README "Native Tools" table (7 total) and in the runtime's tool listing but are absent from SKILL.md's `allowed-tools` array (line 4). Whether they are available depends on the installation.

## 4. INVOCATION

**The four core tools are called as top-level functions** — they are native MCP tools registered on the `code_mode` server in `opencode.json`:

```typescript
search_tools({ task_description: "clickup task management", limit: 10 })
list_tools()
tool_info({ tool_name: "clickup.clickup_create_task" })
call_tool_chain({ code: "…", timeout: 60000, max_output_size: 200000 })
```

**`call_tool_chain` parameters** (from `SKILL.md` §8, `README.md` §3.2):

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `code` | string | Yes | — | TypeScript code to execute |
| `timeout` | number | No | 30000 | Execution timeout in milliseconds |
| `max_output_size` | number | No | 200000 | Max response size in characters |

**Tool-naming convention:** `{manual_name}.{manual_name}_{tool_name}`

- The first `{manual_name}` is the TypeScript namespace (from the `name` field in `.utcp_config.json`).
- The dot `.` is the namespace accessor.
- The second `{manual_name}_{tool_name}` uses **underscore** to join the manual name with the tool name (from the MCP server).

**Dotted-list vs underscore-call gotcha:** `list_tools()` returns names in `a.b.c` dotted form (e.g., `myservice.myservice.sites_list`). To call the tool, replace the last dot with an underscore: `myservice.myservice_sites_list()`. Using a dot produces `TypeError: myservice.myservice is not a function`. The `tool_info()` output shows the correct callable syntax.

**Setup required:**
- `.utcp_config.json` (project root) — `manual_call_templates[]` array defining MCP servers, each with a `name`, `call_template_type: "mcp"`, and `config.mcpServers`.
- `.env` (project root) — API keys with **prefixed names**: `{manual_name}_{VAR}` (e.g., `clickup_CLICKUP_API_KEY`). Code Mode auto-prefixes all variables; unprefixed keys cause `Variable 'clickup_CLICKUP_API_KEY' not found`.
- `opencode.json` registers the `code_mode` MCP server itself, pointing `UTCP_CONFIG_FILE` at `.utcp_config.json`.

## 5. KEY FILES

| Path | Purpose |
|------|---------|
| `.opencode/skills/mcp-code-mode/SKILL.md` | AI agent routing instructions, smart-router pseudocode, rules, allowed-tools list, version metadata |
| `.opencode/skills/mcp-code-mode/README.md` | Human-facing skill overview, quick start, features, troubleshooting, FAQ |
| `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md` | Full installation walkthrough: prerequisites, `.utcp_config.json` / `.env` creation, platform configs, verification phases |
| `.opencode/skills/mcp-code-mode/graph-metadata.json` | Skill-graph metadata: prerequisites for `mcp-chrome-devtools` and `mcp-click-up`, derived trigger phrases, causal summary |
| `.opencode/skills/mcp-code-mode/references/naming_convention.md` | Complete `{manual}.{manual}_{tool}` pattern guide with 4 common mistakes and troubleshooting |
| `.opencode/skills/mcp-code-mode/references/configuration.md` | `.utcp_config.json` element reference, `.env` prefix rule, adding/removing MCP servers |
| `.opencode/skills/mcp-code-mode/references/tool_catalog.md` | Static catalog of 170+ tools across 7+ MCP servers (note: may be outdated; runtime discovery preferred) |
| `.opencode/skills/mcp-code-mode/references/workflows.md` | Six workflow patterns: single-tool, ClickUp, Notion, multi-tool orchestration, error handling, parallel execution |
| `.opencode/skills/mcp-code-mode/references/architecture.md` | Token economics, the "2-3 MCP Server Wall" problem, V8 Isolate sandbox, data-flow diagrams |
| `.opencode/skills/mcp-code-mode/assets/config_template.md` | Copy-ready `.utcp_config.json` template with MyService, ClickUp, Figma, Notion, Chrome DevTools entries |
| `.opencode/skills/mcp-code-mode/assets/env_template.md` | Copy-ready `.env` template with prefixed variables and credential-source instructions |
| `.opencode/skills/mcp-code-mode/scripts/validate_config.py` | Python script to validate `.utcp_config.json` syntax |
| `.opencode/skills/mcp-code-mode/scripts/install.sh` | Installation helper script |
| `.opencode/skills/mcp-code-mode/scripts/update.sh` | Update helper script |
| `.opencode/skills/mcp-code-mode/scripts/doctor.sh` | Diagnostic/healing script |
| `.opencode/skills/mcp-code-mode/mcp_server/package.json` | npm package manifest for `@utcp/code-mode-mcp` v1.0.9; declares dependencies (`@utcp/sdk`, `@utcp/mcp`, etc.) |
| `.opencode/skills/mcp-code-mode/mcp_server/index.ts` | TypeScript entry point for the MCP server (compiled to `dist/index.js`) |
| `.opencode/skills/mcp-code-mode/mcp_server/README.md` | Duplicate of the skill-level README.md (appears to be a copy, not a distinct document) |
| `.opencode/skills/mcp-code-mode/mcp_server/dist/` | Compiled JavaScript output of the MCP server |
| `.opencode/skills/mcp-code-mode/changelog/` | Change-log directory (contents not inspected) |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/` | Manual testing playbook directory (contents not inspected) |

## 6. BOUNDARIES

**What Code Mode does NOT do:**

- It does **not** access native MCP servers defined in `opencode.json` (Spec Kit Memory, Sequential Thinking, Code Graph). Those are called directly by their full function names — never through `call_tool_chain`. The discovery tools (`search_tools`, `list_tools`, `tool_info`) only see servers in `.utcp_config.json`.
- It does **not** replace file-operation tools (Read, Write, Edit, Grep, Glob, Bash). Those remain first-class native tools and must never be routed through Code Mode.
- It does **not** own the configuration of external MCP servers — it only reads `.utcp_config.json` at startup. Adding/removing servers is a user configuration task.

**Consumer skills:**

- `mcp-chrome-devtools` (`.opencode/skills/mcp-chrome-devtools/`) — routes browser automation through Code Mode's `call_tool_chain` for Chrome DevTools MCP calls; can also fall back to the `bdg` CLI directly.
- `mcp-click-up` (`.opencode/skills/mcp-click-up/`) — routes ClickUp operations through Code Mode for advanced multi-tool workflows; uses the official ClickUp MCP server via `call_tool_chain`.
- Both are declared as consumers in `graph-metadata.json` under `edges.prerequisite_for` (weight 0.7 each). They build on Code Mode but add service-specific routing, fallback logic, and CLI integration.

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**

1. **Wrong naming pattern** — calling `myservice.sites_list()` (missing prefix) or `myservice.myservice.sites_list()` (dot instead of underscore). Error: `Tool not found` or `TypeError: myservice.myservice is not a function`. Fix: always use `{manual}.{manual}_{tool}`.

2. **Unprefixed environment variables** — `.env` has `CLICKUP_API_KEY=pk_xxx` but Code Mode looks for `clickup_CLICKUP_API_KEY`. Error: `Variable 'clickup_CLICKUP_API_KEY' not found`. Fix: prefix all `.env` keys with the manual name from `.utcp_config.json`.

3. **`.utcp_config.json` not found** — `UTCP_CONFIG_FILE` points to a relative path or the file is missing. Error: Code Mode fails to initialize. Fix: use an absolute path in `opencode.json` and validate JSON with `python3 -m json.tool`.

4. **Execution timeout** — workflow exceeds the default 30s. Fix: increase `timeout` to 60000 (3–5 tools) or 120000 (6+ tools); break into smaller calls if needed.

**Gotchas:**

- `list_tools()` returns dotted names (`a.b.c`) but calls require underscore form (`a.b_c`).
- The `name` field in `.utcp_config.json` is the manual name — not the `mcpServers` key. If they differ, the `name` field wins.
- `search_tools` / `list_tools` / `tool_info` only see Code Mode tools — native MCP tools (Sequential Thinking, Spec Kit Memory) never appear in their results.
- Code Mode does not have direct network or filesystem access — all external interaction must go through registered MCP tools.

**User FAQ questions (2–4 most common):**

1. "When should I NOT use `call_tool_chain`?"
2. "Why doesn't `list_tools()` show Sequential Thinking or Spec Kit Memory?"
3. "Can I add a new MCP server without restarting?"
4. "What happens if one tool fails in a multi-step workflow?"

## 8. STALE FACTS

**Inconsistencies between the current README.md and the real files:**

1. **Tool count: 7 vs 4.** README §3.2 table "Native Tools (7 total)" lists 7 tools: `call_tool_chain`, `search_tools`, `list_tools`, `tool_info`, `get_required_keys_for_tool`, `register_manual`, `deregister_manual`. SKILL.md `allowed-tools` (line 4) registers only 4: `mcp__code_mode__call_tool_chain`, `mcp__code_mode__list_tools`, `mcp__code_mode__search_tools`, `mcp__code_mode__tool_info`. The three registration helpers (`get_required_keys_for_tool`, `register_manual`, `deregister_manual`) are **not** in the skill's allowed-tools list.

2. **Manual count in subtitle: "5" vs actual "6".** The README subtitle says "currently 5 manuals: 2 Chrome DevTools instances, ClickUp, Figma, GitHub". But INSTALL_GUIDE.md §0 "Current Configuration" table lists 6 manuals (github, figma, chrome_devtools_1, chrome_devtools_2, clickup, myservice = 159 tools), and `assets/config_template.md` also includes 6 manuals (adds Notion). The README is missing MyService/Notion from the count and the count itself is wrong.

3. **README structure section incomplete.** README §4 "STRUCTURE" only shows `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, and 5 `references/` files. It omits `assets/` (2 files), `scripts/` (5 files), `mcp_server/` (8 entries), `changelog/`, `manual_testing_playbook/`, and `graph-metadata.json`.

4. **Version field in performance table is the SKILL.md version, not the package version.** README §3.3 "Key Statistics Comparison" shows "Version | 1.0.7.0" — this matches `SKILL.md` frontmatter `version: 1.0.7.0`. But `mcp_server/package.json` has `"version": "1.0.9"` and `INSTALL_GUIDE.md` declares `Version: 2.0.0`. The version cited in the README is the SKILL.md metadata version, not the code artifact version.

5. **`references/naming_convention.md` internally inconsistent with `tool_catalog.md` on tool count.** `naming_convention.md` line 550 says "200+ tools" but `tool_catalog.md` line 4 says "170+ tools".

6. **`references/architecture.md` says "Only 3 tools in context" (lines 28, 33, 134, 160).** The skill exposes 4 tools, not 3. This is an internal reference-doc inconsistency.