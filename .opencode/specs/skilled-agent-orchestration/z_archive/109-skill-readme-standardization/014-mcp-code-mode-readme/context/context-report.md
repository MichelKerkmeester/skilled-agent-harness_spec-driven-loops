# Context Report: mcp-code-mode README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the four tools, the progressive-disclosure workflow, the context-reduction figure and the naming rule. Both agree the canonical call form here is `call_tool_chain({ code })`, and both flag the same version and count drift. This is the engine the other mcp-* skills consume.

---

## 1. PURPOSE

`mcp-code-mode` is the Code Mode execution engine. It lets an agent call hundreds of external MCP tools by writing TypeScript that runs in a single execution, discovering tool schemas on demand instead of injecting every tool definition into the context window.

## 2. PROBLEM

Native MCP loads every tool's full schema into the context window before the agent does anything. With a few dozen tools across several servers that is a large fixed tax on every turn, and it grows with each server you add. The agent pays for tool definitions it will never call on this turn, and a multi-step flow across two or three services means several separate tool round-trips. Code Mode discovers tools on demand, so the context stays flat regardless of how many servers are configured, and a whole multi-tool workflow runs in one TypeScript execution with state held in local variables.

## 3. THE FOUR TOOLS

- `search_tools({ task_description, limit? })`: find registered tools by a natural-language task description.
- `list_tools()`: list every registered Code Mode tool.
- `tool_info({ tool_name })`: get the exact callable TypeScript signature for one tool.
- `call_tool_chain({ code, timeout?, max_output_size? })`: execute a TypeScript block that calls the tools and returns structured state. Returns the result plus captured logs.

Three auxiliary tools exist in the runtime beyond the core four: `register_manual` adds a server at runtime, `deregister_manual` removes one, and `get_required_keys_for_tool` reports the env keys a tool needs.

## 4. PROGRESSIVE DISCLOSURE WORKFLOW (verified, SKILL.md:257-261)

1. Discover tools with `search_tools()` or `list_tools()`.
2. Confirm the exact callable syntax with `tool_info()`.
3. Execute `call_tool_chain({ code })` with `{manual_name}.{manual_name}_{tool_name}` calls.
4. Return structured state from the TypeScript block.

The context-reduction figure is consistent across SKILL.md, README, INSTALL_GUIDE and architecture.md: roughly 98% (1.6k tokens versus about 141k for 47 tools), and it stays flat as servers are added because schemas load on demand.

## 5. INVOCATION (verified)

The call form documented throughout this skill is the code form, not the array form:

```typescript
call_tool_chain({
  code: `
    const task = await clickup.clickup_create_task({ name: "New Feature", listName: "Dev Sprint" });
    return task;
  `,
  timeout: 60000
});
```

`call_tool_chain` takes `code` (required), `timeout` (default 30000) and `max_output_size` (default 200000), and returns `{ result, logs }`.

Tool naming is `{manual_name}.{manual_name}_{tool_name}`. The single most common error is the naming translation: `list_tools()` returns names in dotted `a.b.c` form (for example `myservice.myservice.sites_list`), but a call uses the dot-then-underscore form `myservice.myservice_sites_list()`. `tool_info()` always shows the correct callable syntax. Setup lives in `.utcp_config.json` at the project root, with env vars in `.env` prefixed by the manual name (`clickup_CLICKUP_API_KEY`, not `CLICKUP_API_KEY`).

## 6. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | Routing instructions, the smart router, the naming convention and the rules |
| `INSTALL_GUIDE.md` | Full install and configuration walkthrough (Node 18+, `.utcp_config.json`, `.env`, per-client config) |
| `references/naming_convention.md` | The naming pattern guide and the number-one-error troubleshooting |
| `references/configuration.md` | `.utcp_config.json` and `.env` setup, server configs and env prefixes |
| `references/tool_catalog.md` | A static catalog of the tools across the configured MCP servers |
| `references/workflows.md` | Workflow patterns: single tool, multi-tool orchestration, error handling, parallel execution |
| `references/architecture.md` | Token economics, the data flow and the sandbox model |
| `assets/config_template.md` | A copy-ready `.utcp_config.json` template |
| `assets/env_template.md` | A copy-ready `.env` template with prefixed placeholders |
| `scripts/install.sh` / `update.sh` / `validate_config.py` / `doctor.sh` | Install, update, config validation and a read-only health check |
| `mcp_server/index.ts` | The TypeScript source for the Code Mode MCP server (`@utcp/code-mode-mcp`) |

The skill also ships `changelog/`, `manual_testing_playbook/` and `graph-metadata.json`. The `.DS_Store` in the tree is junk, not a deliverable.

## 7. WORKFLOWS & OUTPUTS

The documented chains run inside one `call_tool_chain` block: a single-tool call (create a ClickUp task), a multi-tool sequence (read a Figma file then create a task), a multi-tool sequence with `try/catch` error handling, and a parallel fetch with `Promise.all` across services. Each returns a structured object plus captured `console.log` output. State persists across the chain in local TypeScript variables, and a failure without error handling stops the whole execution, so multi-step flows wrap calls in `try/catch` or use `Promise.allSettled` for partial success.

## 8. BOUNDARIES

Code Mode only reaches tools registered in `.utcp_config.json`. Native MCP servers registered in `opencode.json` (Spec Kit Memory, Sequential Thinking, Code Graph and the like) are NOT accessible through `call_tool_chain()`, and `list_tools()` does not show them. Code Mode is also not for local file operations (Read, Write, Edit, Grep, Glob, Bash) or first-class client tools. The consumer mcp-* skills (`mcp-chrome-devtools`, `mcp-click-up`) build on this engine; this skill is their shared transport.

## 9. TROUBLESHOOTING & FAQ MATERIAL

- "Tool is not a function" or "Cannot read properties of undefined": the manual prefix is missing. Call `myservice.myservice_sites_list()`, not `myservice.sites_list()`.
- "myservice.myservice is not a function": a double-dot `manual.manual.tool` instead of `manual.manual_tool`. Use the dot-then-underscore form.
- "Variable 'clickup_CLICKUP_API_KEY' not found": the `.env` key is missing its manual prefix.
- Config not found: `.utcp_config.json` is missing or the path env var is wrong.
- A tool is missing from `list_tools()`: it is a native MCP tool in `opencode.json`, which Code Mode does not see.
- FAQ: when not to use Code Mode, why native tools do not appear, how to add a server at runtime (`register_manual`) versus persistently (`.utcp_config.json` plus restart), and what happens when one tool fails mid-chain.

## 10. STALE FACTS

The narrative template drops version lines and brittle counts, so the drift here resolves on rewrite:

- Version: SKILL.md says 1.0.7.0, `mcp_server/package.json` says 1.0.9, INSTALL_GUIDE says 2.0.0. Drop the version line.
- Manual count: the README says 5 manuals, the INSTALL_GUIDE says 6. Do not pin a manual count.
- Tool count: the README says 7 native tools, SKILL.md `allowed-tools` lists 4. The runtime has all 7 (the core four plus `register_manual`, `deregister_manual`, `get_required_keys_for_tool`). Describe the four-step workflow and name the auxiliary tools where relevant rather than pinning a count.
- Catalog count: the docs say 170-plus tools across 7 or 8 servers, and 159 tools elsewhere. Do not pin a catalog count.
- The current README omits the naming translation rule (dotted list versus underscore call). The rewrite must include it, since it is the documented number-one error.

## 11. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, the four tools and the workflow; iteration 2 verified the tool signatures, the call form, the naming rule and the stale facts, each cited to a file and line. Both models agreed on the code-form call pattern and the seven-tool runtime surface, which matches the runtime tool registry. Converged before the three-iteration ceiling.
