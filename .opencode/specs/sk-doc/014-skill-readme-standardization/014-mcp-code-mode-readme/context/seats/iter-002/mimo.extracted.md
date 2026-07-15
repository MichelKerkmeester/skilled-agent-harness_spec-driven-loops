# mcp-code-mode Fact-Verification Report

## 1. EXACT INVOCATION

**Four meta-tools (SKILL.md:4, allowed-tools list):**
- `mcp__code_mode__search_tools` — find tools by natural language description
- `mcp__code_mode__list_tools` — return all registered tool names
- `mcp__code_mode__tool_info` — return TypeScript interface for a tool
- `mcp__code_mode__call_tool_chain` — execute TypeScript code with tool access

**`call_tool_chain` parameters (README.md:111–117):**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `code` | string | Yes | — | TypeScript code to execute |
| `timeout` | number | No | 30000 | Execution timeout in ms |
| `max_output_size` | number | No | 200000 | Max response size in characters |

**Documented `call_tool_chain` forms (SKILL.md:48, 259):**
```typescript
call_tool_chain({ code: "await clickup.clickup_create_task({...})" })
```
SKILL.md:259 states the basic workflow as: "Execute `call_tool_chain()` with `{manual_name}.{manual_name}_{tool_name}` calls."

**Tool-naming convention (SKILL.md:218–219):**
```typescript
{manual_name}.{manual_name}_{tool_name}
```
Dotted namespace (`manual.tool`) is **wrong**; underscore join (`manual_manual_tool`) is correct for the second segment. `list_tools()` returns `a.b.c` format; calling uses `a.a_b_c()` format (SKILL.md:253).

**Configuration files (SKILL.md:279–280):**
- `.utcp_config.json` — project root, defines external MCP servers via `manual_call_templates[]`
- `.env` — project root, stores API keys with `{manual_name}_` prefix

---

## 2. CAPABILITY ROSTER

**Progressive-disclosure workflow (SKILL.md:257–261, exact order):**
1. Discover tools with `search_tools()` or `list_tools()`
2. Confirm exact callable syntax with `tool_info()`
3. Execute `call_tool_chain()` with `{manual_name}.{manual_name}_{tool_name}` calls
4. Return structured state from the TypeScript block

**Context-reduction figure (SKILL.md:26):**
> "98.7% context reduction - 1.6k tokens vs 141k for 47 tools"

**State persistence (SKILL.md:28):**
> "State persistence — Data flows naturally between operations"

**Error handling (SKILL.md:371–375):**
- `try/catch` prevents one failing tool from crashing the workflow
- `Promise.allSettled()` for partial-success tolerance
- `Promise.all()` when all operations must succeed

**Additional capabilities (SKILL.md:27–30):**
- 60% faster execution — single execution vs 15+ API round trips
- Type safety — full TypeScript support
- Progressive loading — tools discovered on-demand, zero upfront cost

---

## 3. KEY FILES

| File | Role |
|------|------|
| `SKILL.md` | AI agent instructions, smart router pseudocode, rules, 478 lines |
| `README.md` | User-facing overview, quick start, features, troubleshooting, 403 lines |
| `INSTALL_GUIDE.md` | Installation walkthrough, platform config, validation phases, 1570 lines |
| `references/naming_convention.md` | Complete naming pattern guide with troubleshooting, 553 lines |
| `references/configuration.md` | `.utcp_config.json` and `.env` setup guide, 762 lines |
| `references/tool_catalog.md` | Tool catalog across configured manuals, 423 lines |
| `references/workflows.md` | Five end-to-end workflow examples, 945 lines |
| `references/architecture.md` | Token economics, V8 isolate internals, data flow, 514 lines |
| `assets/config_template.md` | Copy-ready `.utcp_config.json` template, 449 lines |
| `assets/env_template.md` | Copy-ready `.env` template with credential sources, 474 lines |
| `mcp_server/package.json` | npm package `@utcp/code-mode-mcp` v1.0.9, MIT license |
| `mcp_server/index.ts` | MCP server TypeScript entry point |
| `mcp_server/dist/` | Compiled JS output |
| `mcp_server/tsconfig.json` | TypeScript config |
| `scripts/install.sh` | Installation script |
| `scripts/update.sh` | Update script |
| `scripts/validate_config.py` | Configuration validation script |
| `scripts/doctor.sh` | Diagnostics script |
| `scripts/README.md` | Scripts documentation |

---

## 4. WORKFLOWS & OUTPUTS

**End-to-end workflow (SKILL.md:257–261):**
1. Discover → `search_tools()` or `list_tools()` returns tool names + descriptions
2. Confirm syntax → `tool_info()` returns full TypeScript interface
3. Execute → `call_tool_chain()` runs TypeScript with direct tool access
4. Return → structured state from the TypeScript block

**Example chains (references/workflows.md):**
- **MyService workflow** (§2): `myservice_sites_list` → `myservice_collections_list`, returns site + collection data
- **ClickUp workflow** (§3): `clickup_create_task` → `clickup_get_task` (verify), returns task ID/URL/status
- **Notion workflow** (§4): `notion_API_post_search` → `notion_API_post_page` → `notion_API_retrieve_a_page`
- **Multi-tool orchestration** (§5): Figma → ClickUp → MyService pipeline, 60s timeout
- **Error handling** (§6): try/catch pattern with partial success, `success`/`partialSuccess`/`errorCount` return structure
- **Parallel patterns** (§7): `Promise.all`, `Promise.allSettled`, batched chunking

**What they produce (workflows.md:87–109, 171–188):**
- `{ result: { ... }, logs: [ ... ] }` — structured result object + captured `console.log` output

---

## 5. TROUBLESHOOTING & FAQ

**Concrete failure modes:**

| Failure | Cause | Fix | Source |
|---------|-------|-----|--------|
| `"Tool is not a function"` | Missing manual prefix: `myservice.sites_list` instead of `myservice.myservice_sites_list` | Use `search_tools()` to discover exact name | README.md:319–325 |
| `"Variable 'clickup_CLICKUP_API_KEY' not found"` | `.env` uses unprefixed key name | Prepend `{manual_name}_` to key in `.env` | README.md:329–335 |
| `"Execution timeout"` | Workflow calls >2 tools on default 30s | Increase `timeout`: 60s for 3–5 tools, 120s+ for 6+ | README.md:339–345 |
| `"UTCP config file not found"` | `UTCP_CONFIG_FILE` points to relative path or file missing | Use absolute path, verify file exists | README.md:349–355 |
| `TypeError: myservice.myservice is not a function` | Double dot `manual.manual.tool` instead of `manual.manual_tool` | Use single dot: `manual.manual_tool` | naming_convention.md:73–78 |
| `Tool not found: myservice.myserviceSitesList` | camelCase instead of snake_case | Use snake_case: `myservice_sites_list` | naming_convention.md:94–98 |

**Top 3–5 user questions (README.md:359–375):**

1. **When should I NOT use call_tool_chain?** — Not for file ops (Read/Write/Edit/Grep/Glob/Bash), native MCP tools (Spec Kit Memory, Sequential Thinking, Code Graph), or first-class app connectors. Only for `.utcp_config.json` tools.
2. **Why does list_tools() not show Sequential Thinking?** — Those are native MCP tools in `opencode.json`, not `.utcp_config.json`. Discovery tools only see Code Mode tools.
3. **Can I add a new MCP server without restarting?** — Yes, use `register_manual` at runtime. For persistent registration, add to `.utcp_config.json` and restart.
4. **What happens if one tool fails in a multi-step workflow?** — Without try/catch, the entire execution stops. Use `try/catch` and `Promise.allSettled()` for resilience.

---

## 6. STALE FACTS IN CURRENT README.md

1. **Manual count and composition (README.md:14):**
   README claims "currently 5 manuals: 2 Chrome DevTools instances, ClickUp, Figma, GitHub". INSTALL_GUIDE.md:68–76 lists **6 manuals** (github, figma, chrome_devtools_1, chrome_devtools_2, clickup, **myservice**) with 159 tools total. **MyService is missing from README's count.**

2. **Tool count (README.md:178):**
   `references/tool_catalog.md` is described as "currently 5 in .utcp_config.json". INSTALL_GUIDE.md:76 says **6 manuals**. tool_catalog.md:8 says "8 MCP servers" including ShadCN UI, Imagician, and Video Audio. The "5" is stale.

3. **Version inconsistency:**
   SKILL.md:5 frontmatter says `version: 1.0.7.0`. INSTALL_GUIDE.md:5 says "Version: 2.0.0". mcp_server/package.json says `version: 1.0.9`. README.md:149 says "Version: 1.0.7.0". Three different version numbers across files.

4. **Native Tools count (README.md:99):**
   README says "Native Tools (7 total)" listing `call_tool_chain`, `search_tools`, `list_tools`, `tool_info`, `get_required_keys_for_tool`, `register_manual`, `deregister_manual`. SKILL.md:4 allowed-tools lists exactly **4** tools. The architecture.md:28–33 shows only **3** tools in the AI-visible layer. The "7" includes `get_required_keys_for_tool`, `register_manual`, and `deregister_manual` which are not in the SKILL.md allowed-tools list.

5. **Context-reduction figure qualifier (README.md:150):**
   README says "98.7% reduction" for "47 tools" at "141k" tokens. SKILL.md:26 says the same. INSTALL_GUIDE.md:48 says "unified access to 159 MCP tools" but the 1.6k figure still applies. The "47 tools" baseline is accurate per SKILL.md but the INSTALL_GUIDE.md references 159 tools at the same 1.6k cost, which could confuse readers.

6. **Execution speed claim (README.md:151):**
   README says "85% faster" for execution time. SKILL.md:27 says "60% faster execution". INSTALL_GUIDE.md:1453 says "85% faster". The SKILL.md (authoritative agent instructions) and README disagree: **60% vs 85%**.

7. **tool_catalog.md description (README.md:393):**
   README describes it as "Tool catalog for the configured manuals (currently 5 in .utcp_config.json)". The actual tool_catalog.md:3–8 says "Reference catalog of 170+ tools across 7 MCP servers" (later lists 8 servers including ShadCN UI, Imagician, Video Audio). Neither the "5" nor the "7"/"8" matches INSTALL_GUIDE.md's "6 manuals, 159 tools".

8. **workflows.md description (README.md:395):**
   README says "Five end-to-end workflow examples". workflows.md actually documents **6 patterns** (5 core + parallel execution patterns in §7). The "five" is stale — §7 adds a sixth parallel-execution pattern set.

9. **Config example manual name (README.md:196):**
   README uses `"name": "clickup_official"` in its config example. INSTALL_GUIDE.md:529 uses `"name": "clickup"`. The naming convention docs all use `clickup` as the canonical example. The `clickup_official` name in README is inconsistent with every other file.