1. **PURPOSE** — Code Mode is the mandatory MCP orchestration layer that executes TypeScript code inside a sandboxed V8 isolate to call external MCP tools registered in `.utcp_config.json`, using progressive disclosure so the AI context only ever sees four meta-tools regardless of how many external servers are configured.

2. **PROBLEM** — Every external MCP tool definition injected directly into the AI context window consumes roughly 3,000 tokens; at 47 tools that is ~141k tokens before any real work begins, which exhausts a 200k context window and limits an agent to 2–3 MCP servers. Code Mode collapses that cost to a flat ~1,600 tokens by giving the agent only `call_tool_chain`, `search_tools`, `list_tools`, and `tool_info`, then letting the agent discover and invoke the remaining tools on demand inside a single TypeScript execution. One `call_tool_chain` call replaces what would otherwise be 15+ separate AI reasoning loops and API round trips, cutting execution time by roughly 60%.

3. **MODES & CAPABILITIES** — Four meta-tools exposed by the Code Mode MCP server:
   - `call_tool_chain` — execute a TypeScript code block with direct access to all registered external MCP tools; accepts `code`, `timeout`, and `max_output_size` parameters.
   - `search_tools` — find tools by natural language description (`task_description` + `limit`); returns tool names and descriptions with minimal token cost.
   - `list_tools` — return every registered tool name from `.utcp_config.json` with no parameters.
   - `tool_info` — return the full TypeScript interface definition for one specific tool by name.
   Headline capabilities (one line each): progressive disclosure (tools loaded on-demand, zero upfront cost); ~98.7% context reduction (1.6k tokens vs 141k for 47 tools); state persistence across all tool calls within a single execution; built-in error isolation via try/catch inside the sandbox; configurable timeouts (30s default, 120s+ for complex workflows); parallel execution via `Promise.all` / `Promise.allSettled`; console.log output captured and returned automatically.

4. **INVOCATION** — The four tools are called as native MCP tools from the AI client (e.g., `mcp__code_mode__call_tool_chain({ code: "..." })`). `call_tool_chain` accepts a `code` string (required), an optional `timeout` in ms (default 30000), and an optional `max_output_size` in characters (default 200000). The tool-naming convention inside the code block is `{manual_name}.{manual_name}_{tool_name}` (e.g., `clickup.clickup_create_task({})`). The gotcha: `list_tools()` returns names in `a.b.c` dotted format (e.g., `myservice.myservice.sites_list`), but to call the tool you must use the underscore form `myservice.myservice_sites_list()`. Configuration requires two files at the project root: `.utcp_config.json` (defines `manual_call_templates[]` with each MCP server) and `.env` (stores API keys using the prefixed convention `{manual_name}_{VAR}`). The Code Mode MCP server itself is registered in `opencode.json` (or `.mcp.json` / `.vscode/mcp.json`) with `UTCP_CONFIG_FILE` pointing to the absolute path of `.utcp_config.json`.

5. **KEY FILES** —

   | Path | Purpose |
   |---|---|
   | `.opencode/skills/mcp-code-mode/SKILL.md` | AI agent routing instructions, smart router pseudocode, rules, naming pattern, integration points |
   | `.opencode/skills/mcp-code-mode/README.md` | User-facing documentation: overview, quick start, features, configuration, usage examples, troubleshooting, FAQ |
   | `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md` | Step-by-step installation walkthrough with phase-validated checkpoints for Claude Code, OpenCode, VS Code Copilot |
   | `.opencode/skills/mcp-code-mode/graph-metadata.json` | Skill graph metadata for the advisor system |
   | `.opencode/skills/mcp-code-mode/references/naming_convention.md` | Complete tool naming pattern guide with common mistakes, troubleshooting, and per-manual examples |
   | `.opencode/skills/mcp-code-mode/references/configuration.md` | `.utcp_config.json` and `.env` setup guide: structure, elements, adding servers, prefixed env vars |
   | `.opencode/skills/mcp-code-mode/references/tool_catalog.md` | Catalog of 170+ tools across 7+ MCP servers organized by service (MyService, ClickUp, Figma, Chrome DevTools, ShadCN UI, Imagician, Video Audio, GitHub) |
   | `.opencode/skills/mcp-code-mode/references/workflows.md` | Five end-to-end workflow patterns: single-tool, task creation, Notion, multi-tool orchestration, error handling, plus parallel execution patterns |
   | `.opencode/skills/mcp-code-mode/references/architecture.md` | Token economics, V8 isolate sandbox internals, data flow diagrams, performance characteristics |
   | `.opencode/skills/mcp-code-mode/assets/config_template.md` | Copy-ready `.utcp_config.json` template with pre-configured MCP servers |
   | `.opencode/skills/mcp-code-mode/assets/env_template.md` | Copy-ready `.env` template with credential sources and prefixed variable examples |
   | `.opencode/skills/mcp-code-mode/scripts/install.sh` | Installer: checks Node.js 18+, creates `.utcp_config.json` template, creates `.env.example`, adds code_mode to `opencode.json` |
   | `.opencode/skills/mcp-code-mode/scripts/update.sh` | Updater: runs `npm update @utcp/code-mode-mcp` and verifies installation |
   | `.opencode/skills/mcp-code-mode/scripts/doctor.sh` | Read-only health check: verifies `node_modules`, Node on PATH, and critical runtime imports (`@modelcontextprotocol/sdk`, `@utcp/code-mode`, `@utcp/cli`) |
   | `.opencode/skills/mcp-code-mode/scripts/validate_config.py` | Python validator for `.utcp_config.json`: checks JSON syntax, manual name validity, required fields, duplicates, and optionally validates env var references against `.env` |
   | `.opencode/skills/mcp-code-mode/scripts/README.md` | Code-facing README for the scripts folder |
   | `.opencode/skills/mcp-code-mode/mcp_server/` | Embedded MCP server source: `package.json` (name `@utcp/code-mode-mcp`, version 1.0.9), `index.ts` entry, `tsconfig.json`, `dist/` compiled output |
   | `.opencode/skills/mcp-code-mode/mcp_server/README.md` | Duplicate of the skill-level README.md (identical content) |
   | `.opencode/skills/mcp-code-mode/changelog/` | Version changelogs: `v1.0.0.0.md` through `v1.0.8.0.md` (8 files) |
   | `.opencode/skills/mcp-code-mode/manual_testing_playbook/` | Manual testing playbook with 7 test scenario folders plus `manual_testing_playbook.md` |

6. **BOUNDARIES** — Code Mode only accesses tools defined in `.utcp_config.json`; it does NOT access native MCP tools registered in `opencode.json` (such as Spec Kit Memory, Sequential Thinking, or Code Graph). The AI client must call native MCP tools directly — using `call_tool_chain` for them adds overhead and fails because Code Mode cannot see them. Conversely, bypassing Code Mode for external tools (calling ClickUp, Figma, etc. directly) causes context exhaustion. The sibling `mcp-chrome-devtools` skill can fall back to Code Mode for browser automation but also has its own `bdg CLI` path; `mcp-click-up` similarly has a `cupt CLI` surface. Code Mode is the shared execution engine those skills build on, not a replacement for them.

7. **TROUBLESHOOTING & FAQ MATERIAL** — Common failure modes:
   - **"Tool is not a function" / "Tool not found"**: Missing manual prefix — `myservice.sites_list({})` must be `myservice.myservice_sites_list({})`. Fix: use `search_tools` to discover the exact name.
   - **"Variable 'clickup_CLICKUP_API_KEY' not found"**: `.env` uses unprefixed key name. Code Mode prefixes all env vars with `{manual_name}_`. Fix: add prefixed version to `.env`.
   - **"Execution timeout"**: Default 30s is too short for 3+ tool workflows. Fix: increase `timeout` parameter (60s for 3–5 tools, 120s+ for 6+).
   - **"UTCP config file not found"**: `UTCP_CONFIG_FILE` in `opencode.json` uses a relative path. Fix: use absolute path.
   - **Tools not appearing in `list_tools()`**: MCP server not configured in `.utcp_config.json`, or manual name contains invalid characters (hyphens, spaces). Fix: validate config with `python3 scripts/validate_config.py .utcp_config.json`.
   - **Gotcha — dotted-list vs underscore-call**: `list_tools()` returns `myservice.myservice.sites_list` but the call syntax is `myservice.myservice_sites_list()`. Use `tool_info()` to confirm the callable form.
   - Typical user questions: (1) "When should I NOT use call_tool_chain?" — file ops, native MCP tools, anything in `opencode.json`. (2) "Why does list_tools() not show Sequential Thinking?" — it is native MCP, not in `.utcp_config.json`. (3) "Can I add a new MCP server without restarting?" — yes, use `register_manual` at runtime. (4) "What happens if one tool fails in a multi-step workflow?" — wrap in try/catch; use `Promise.allSettled` for partial success.

8. **STALE FACTS** — Items in the current `README.md` that are inaccurate versus `SKILL.md` and the real files:
   - **README line 14** says "currently 5 manuals: 2 Chrome DevTools instances, ClickUp, Figma, GitHub" — the `INSTALL_GUIDE.md` section "Current Configuration" lists 6 manuals (github, figma, chrome_devtools_1, chrome_devtools_2, clickup, myservice) totaling 159 tools. The `tool_catalog.md` references 7+ servers including ShadCN UI, Imagician, and Video Audio. The README's manual count is stale and omits MyService.
   - **README line 99** says "Native Tools (7 total)" — this is accurate for the MCP server's exposed surface (`call_tool_chain`, `search_tools`, `list_tools`, `tool_info`, `get_required_keys_for_tool`, `register_manual`, `deregister_manual`), but `SKILL.md` section 4 only documents the four core tools as the "allowed-tools" in its frontmatter. The count is defensible but the README does not note that `get_required_keys_for_tool`, `register_manual`, and `deregister_manual` are optional/auxiliary.
   - **README line 178** says `tool_catalog.md` covers "currently 5 in .utcp_config.json" — the actual file (`tool_catalog.md`) covers 8 configured MCP servers (MyService, ClickUp, Figma, Chrome DevTools ×2, ShadCN UI, Imagician, Video Audio) with 170+ tools. The README understates the catalog.
   - **README line 3** and **SKILL.md line 5** both say version `1.0.7.0` — the embedded MCP server `mcp_server/package.json` shows version `1.0.9`. The skill version metadata lags behind the package version.
   - **README line 151** says execution time improvement is "60% faster" — `INSTALL_GUIDE.md` line 1453 says "85% faster" for the same 4-tool benchmark. The README uses the lower figure.
   - **`mcp_server/README.md`** is an exact duplicate of the skill-level `README.md` (identical frontmatter, identical content). This is not inaccurate but is redundant.
   - **INSTALL_GUIDE.md line 48** says "159 MCP tools across 6 manuals" — the `tool_catalog.md` says "170+ tools across 7 MCP servers" (listing 8 including ShadCN UI, Imagician, Video Audio). The INSTALL_GUIDE count is lower than the catalog's.
   - **`references/tool_catalog.md` line 1** description says "170+ tools across 7 MCP servers" but section 2 lists 8 servers. Minor inconsistency within the file itself.