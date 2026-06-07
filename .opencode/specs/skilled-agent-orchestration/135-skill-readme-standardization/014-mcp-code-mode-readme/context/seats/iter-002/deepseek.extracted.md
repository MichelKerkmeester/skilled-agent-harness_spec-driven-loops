Now let me read the reference files, assets, and key `mcp_server` files:
Now I have all the data needed. Here is the structured verification report:

---

# mcp-code-mode README Fact Verification Report

## 1. EXACT INVOCATION

### Four Tool Signatures

From the runtime tool registrations and documented in `README.md:103-109`, `SKILL.md:4`:

**`search_tools`**
```
call signature: search_tools({ task_description: string, limit?: number })
```
- `task_description` (string, required) — natural language description of task
- `limit` (number, optional, default 10) — maximum results to return
- Source: `INSTALL_GUIDE.md:960-961`, `SKILL.md:303-306`

**`list_tools`**
```
call signature: list_tools()
```
- No parameters (takes `{}` in JS). Returns `{ tools: string[] }`.
- Source: `INSTALL_GUIDE.md:978-981`, `SKILL.md:309`

**`tool_info`**
```
call signature: tool_info({ tool_name: string })
```
- `tool_name` (string, required) — full tool name in `manual.manual_tool` format
- Source: `INSTALL_GUIDE.md:990-997`, `SKILL.md:311-314`

**`call_tool_chain`** — exact forms documented:

From `README.md:54-65` (single-tool):
```typescript
call_tool_chain({
  code: `
    const task = await clickup.clickup_create_task({
      name: "New Feature",
      listName: "Development Sprint",
      description: "Implement user authentication"
    });
    console.log("Task created:", task.id);
    return task;
  `
});
```

From `README.md:69-81` (multi-tool with timeout):
```typescript
call_tool_chain({
  code: `
    const design = await figma.figma_get_file({ fileKey: "abc123" });
    const task = await clickup.clickup_create_task({
      name: \`Implement: \${design.name}\`,
      listName: "Frontend Sprint"
    });
    return { design: design.name, taskId: task.id };
  `,
  timeout: 60000
});
```

Parameters (from `README.md:112-117`, `INSTALL_GUIDE.md:936-940`):
- `code` (string, required)
- `timeout` (number, optional, default 30000)
- `max_output_size` (number, optional, default 200000)

### Tool Naming Convention: Dotted-vs-Underscore Rule

From `SKILL.md:219`:
```typescript
{manual_name}.{manual_name}_{tool_name}
```

The critical rule (from `SKILL.md:253`):
> `list_tools()` returns names in `a.b.c` format (e.g., `myservice.myservice.sites_list`). To call the tool, use underscore format: `myservice.myservice_sites_list()`.

Correct calling form per `SKILL.md:223-229`:
```typescript
await myservice.myservice_sites_list({});
await clickup.clickup_create_task({...});
await figma.figma_get_file({...});
```

### Setup: `.utcp_config.json` / `.env`

From `SKILL.md:279-281`:
- Code Mode tools registered in `.utcp_config.json` (project root)
- Environment variables via `.env` (project root)
- Native tools in `opencode.json` — NOT accessed via Code Mode

From `SKILL.md:339`: Environment variables MUST be prefixed with `{manual_name}_` (e.g., `clickup_CLICKUP_API_KEY`, not `CLICKUP_API_KEY`).

---

## 2. CAPABILITY ROSTER

### Progressive Disclosure Workflow (ordered steps)

From `SKILL.md:257-261`:
> 1. Discover tools with `search_tools()` or `list_tools()`.
> 2. Confirm exact callable syntax with `tool_info()`.
> 3. Execute `call_tool_chain()` with `{manual_name}.{manual_name}_{tool_name}` calls.
> 4. Return structured state from the TypeScript block.

### Context-Reduction Figure

From `SKILL.md:26`:
> 🚀 **98.7% context reduction** — 1.6k tokens vs 141k for 47 tools

Consistent across files:
- `README.md:89`: "47 tool definitions directly, it consumes roughly 141,000 tokens... Code Mode reduces that to 1,600 tokens"
- `INSTALL_GUIDE.md:3`: "98.7% context reduction"
- `INSTALL_GUIDE.md:96`: "Code Mode keeps your context flat at ~1.6k tokens regardless of how many servers you add."
- `references/architecture.md:134-136`: "Total: ~1,600 tokens for unlimited MCP access"

### State Persistence and Error Handling

From `SKILL.md:12`:
> "state persistence and built-in error handling"

From `SKILL.md:371`:
> "Use try/catch for error handling in multi-step workflows"

From `README.md:27` (observability):
> console.log output captured automatically and returned

From `references/workflows.md` (error handling patterns):
> "Pattern 5: Error Handling — Robust patterns with fallbacks" (line 415)

From `README.md:111-117` — `call_tool_chain` timeout is 30000ms default, extendable via `timeout` parameter; `max_output_size` default 200000.

---

## 3. KEY FILES

| Path | Role |
|------|------|
| `.opencode/skills/mcp-code-mode/SKILL.md` | AI agent routing instructions, smart router pseudocode, naming convention, rules |
| `.opencode/skills/mcp-code-mode/README.md` | Human-facing skill readme with overview, quickstart, features, usage, troubleshooting |
| `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md` | Full installation and configuration walkthrough (Node.js 18+, .utcp_config.json, .env, per-client config) |
| `.opencode/skills/mcp-code-mode/references/naming_convention.md` | Complete naming pattern guide with troubleshooting; the `#1 most common error` reference |
| `.opencode/skills/mcp-code-mode/references/configuration.md` | `.utcp_config.json` and `.env` setup guide; MCP server configurations, env variable prefixes |
| `.opencode/skills/mcp-code-mode/references/tool_catalog.md` | Static catalog of 170+ tools across 8 MCP servers (MyService, ClickUp, Figma, Chrome DevTools, ShadCN UI, Imagician, Video Audio, GitHub) |
| `.opencode/skills/mcp-code-mode/references/workflows.md` | Five+ workflow pattern examples: MyService, ClickUp, Notion, multi-tool orchestration, error handling, parallel execution |
| `.opencode/skills/mcp-code-mode/references/architecture.md` | Token economics, data flow, V8 Isolate sandbox, performance characteristics, scalability analysis |
| `.opencode/skills/mcp-code-mode/assets/config_template.md` | Copy-ready `.utcp_config.json` template with 6 pre-configured MCP servers |
| `.opencode/skills/mcp-code-mode/assets/env_template.md` | Copy-ready `.env` template with prefixed variable placeholders for all manuals |
| `.opencode/skills/mcp-code-mode/scripts/install.sh` | Bash installer for Code Mode MCP server |
| `.opencode/skills/mcp-code-mode/scripts/update.sh` | Bash updater via npm |
| `.opencode/skills/mcp-code-mode/scripts/validate_config.py` | Python config validator for `.utcp_config.json` |
| `.opencode/skills/mcp-code-mode/scripts/doctor.sh` | Read-only health check for the mcp-code-mode MCP server |
| `.opencode/skills/mcp-code-mode/scripts/README.md` | Code-facing README for scripts directory |
| `.opencode/skills/mcp-code-mode/mcp_server/package.json` | `@utcp/code-mode-mcp` v1.0.9; Node.js ≥18.0.0; main entry `dist/index.js` |
| `.opencode/skills/mcp-code-mode/mcp_server/index.ts` | TypeScript source entry point for the MCP server |
| `.opencode/skills/mcp-code-mode/mcp_server/README.md` | Package-level README (mirrors skill README) |
| `.opencode/skills/mcp-code-mode/mcp_server/tsconfig.json` | TypeScript build configuration |
| `.opencode/skills/mcp-code-mode/mcp_server/dist/` | Compiled output directory |
| `.opencode/skills/mcp-code-mode/changelog/` | 8 changelog files: v1.0.0.0 through v1.0.8.0 |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/` | 7 playbook directories + master playbook.md |
| `.opencode/skills/mcp-code-mode/graph-metadata.json` | Skill graph metadata: schema v2, family "mcp", prerequisite_for mcp-chrome-devtools and mcp-click-up |

---

## 4. WORKFLOWS & OUTPUTS

### End-to-End Workflow

From `SKILL.md:257-261` and `README.md:36-81`:

1. **Discover** — `search_tools({ task_description: "..." })` or `list_tools()` to find registered tools
2. **Confirm syntax** — `tool_info({ tool_name: "..." })` to get TypeScript interface definition
3. **Execute** — `call_tool_chain({ code: "...", timeout?: N })` with `{manual_name}.{manual_name}_{tool_name}` calls

### Documented Example Chains

**Single-tool** (`README.md:54-65`): ClickUp task creation — produces `{ taskId, taskName, taskUrl, ... }` with console logs.

**Multi-tool sequential** (`README.md:69-81`): Figma → ClickUp — produces `{ design, taskId }`.

**Multi-tool with error handling** (`README.md:260-291`): Figma → ClickUp → MyService — produces `{ success, designName, taskId, cmsItemId }` or `{ success: false, error }`.

**Parallel fetch** (`README.md:297-312`): `Promise.all([...])` across three services — produces `{ siteCount, taskCount, figmaName }`.

Full five-pattern catalog in `references/workflows.md:18-25`: MyService workflow, ClickUp workflow, Notion workflow, Multi-Tool Orchestration (Figma→ClickUp→MyService), Error Handling patterns. Plus parallel execution patterns (workflows.md:600-779).

### What They Produce

From `SKILL.md:443-448`:
> - External tool operation results (tasks created, data fetched, etc.)
> - Workflow execution logs (console.log captured)
> - Error details (if failures occur)
> - State snapshots (all variables returned)

From `INSTALL_GUIDE.md:952`: `call_tool_chain` returns `{ result: any, logs: string[] }`.

---

## 5. TROUBLESHOOTING & FAQ

### Concrete Failure Modes (from `README.md:319-356` and `INSTALL_GUIDE.md:1230-1402`)

1. **"Tool is not a function" / "Cannot read properties of undefined"** — Missing manual prefix. Calling `myservice.sites_list({})` instead of `myservice.myservice_sites_list({})`. Source: `README.md:319-326`.

2. **Wrong naming format** — Using dots-throughout (`myservice.myservice.sites_list`) instead of dot-then-underscore (`myservice.myservice_sites_list`). Source: `INSTALL_GUIDE.md:777-779`.

3. **Config missing / "UTCP config file not found"** — `UTCP_CONFIG_FILE` env var points to relative path or file doesn't exist. Source: `README.md:349-355`.

4. **Native-vs-Code-Mode confusion** — Trying to call Sequential Thinking or Spec Kit Memory through `call_tool_chain()`. These are native MCP tools in `opencode.json`, not in `.utcp_config.json`. Source: `SKILL.md:34-41`, `README.md:363-367`.

5. **"Variable 'clickup_CLICKUP_API_KEY' not found"** — `.env` uses unprefixed key. Must use `{manual_name}_{VAR}` format. Source: `README.md:329-336`, `SKILL.md:339-345`.

### Likely User Questions with Answers

**Q: When should I NOT use call_tool_chain?**
A: For file operations (Read/Write/Edit/Grep/Glob/Bash), native MCP tools (Spec Kit Memory, Sequential Thinking, Code Graph), or first-class AI client tools. Code Mode is only for tools in `.utcp_config.json`. Source: `README.md:361-364`.

**Q: Why does list_tools() not show Sequential Thinking or Spec Kit Memory?**
A: Those are native MCP tools in `opencode.json`, not in `.utcp_config.json`. The discovery tools only see Code Mode tools. Source: `README.md:365-368`.

**Q: Can I add a new MCP server without restarting?**
A: Yes — use `register_manual` at runtime. For persistence across sessions, add to `.utcp_config.json` and restart. Source: `README.md:369-372`.

**Q: What happens if one tool fails in a multi-step workflow?**
A: Without error handling, it stops the entire execution. Wrap in `try/catch` or use `Promise.allSettled()` for partial success. Source: `README.md:373-376`.

**Q: What's the naming pattern?**
A: `{manual_name}.{manual_name}_{tool_name}`. The manual name comes from the `name` field in `.utcp_config.json`. Tool names use snake_case. Example: `myservice.myservice_sites_list({})`. Source: `SKILL.md:219`, `README.md:93`.

---

## 6. STALE FACTS IN CURRENT README

1. **Manual count: "5 manuals" is wrong.** `README.md:14` says "currently 5 manuals: 2 Chrome DevTools instances, ClickUp, Figma, GitHub". `INSTALL_GUIDE.md:68-76` ("Current Configuration") lists **6 manuals**: github (26), figma (18), chrome_devtools_1 (26), chrome_devtools_2 (26), clickup (21), myservice (42) = 159 tools. The README omits MyService from its manual count. (`INSTALL_GUIDE.md:68-76`).

2. **README Structure section omits key directories.** `README.md:170-181` shows only 5 reference files under `references/` and lists no other directories. The real skill directory contains `assets/` (2 files), `scripts/` (5 files), `mcp_server/` (8 entries), `changelog/` (8 entries), `manual_testing_playbook/` (8 entries), and `graph-metadata.json` — none of which appear in the README's structure tree.

3. **INSTALL_GUIDE version disagrees with all other version markers.** `INSTALL_GUIDE.md:5` says "Version: 2.0.0". `SKILL.md:5` says `version: 1.0.7.0`. `mcp_server/package.json:3` says `"version": "1.0.9"`. The INSTALL_GUIDE version `2.0.0` has no matching reference anywhere else in the skill.

4. **Related Documents table omits scripts, assets, mcp_server.** `README.md:383-402` lists only `SKILL.md`, `INSTALL_GUIDE.md`, and 5 references files. It omits `assets/config_template.md`, `assets/env_template.md`, any `scripts/` files, `mcp_server/` files, and `changelog/` — all real files in the skill directory.

5. **"Native Tools" count (7) contradicts SKILL.md `allowed-tools` (4).** `README.md:99-109` lists 7 native tools including `get_required_keys_for_tool`, `register_manual`, `deregister_manual`. `SKILL.md:4` (`allowed-tools`) only permits 4: `call_tool_chain`, `list_tools`, `search_tools`, `tool_info`. Either the README is correct about actual available tools and SKILL.md is stale, or vice versa.

6. **No mention of `get_required_keys_for_tool` in SKILL.md.** `README.md:95,107,335,368` references `get_required_keys_for_tool` as a discovery/validation tool. `SKILL.md` never mentions this tool in its core command set (Section 8), its allowed-tools, or its workflow description — yet the tool exists in the runtime.

7. **Tool catalog count mismatch.** `README.md:178,393` says "currently 5 in `.utcp_config.json`" (referring to manuals). `INSTALL_GUIDE.md:76` says 6 manuals. `references/tool_catalog.md:1,53` says "170+ tools across 7 MCP servers" and lists 8 servers (counting Chrome DevTools as 1 with 2 instances). The counts are internally inconsistent across files.

8. **README does not document the `list_tools()` return format vs call format translation rule.** `SKILL.md:253` documents the critical rule that `list_tools()` returns names in `a.b.c` format (all dots) but calling requires dot-then-underscore format. The README describes the calling format but never explains this translation step, which is the documented root cause of naming errors (`SKILL.md:216` — "#1 most common error").