---
title: mcp-code-mode
description: MCP orchestration engine that lets an agent call external tools by writing TypeScript, discovering schemas on demand so the context window stays flat.
trigger_phrases:
  - "code mode"
  - "call_tool_chain"
  - "mcp tools"
  - "tool orchestration"
  - "context reduction"
---

# mcp-code-mode

> Call hundreds of external MCP tools from one TypeScript block, with the context cost of a handful.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Calling any external MCP tool (ClickUp, Figma, Notion, Chrome DevTools and the rest) without loading every schema into context |
| **Invoke with** | "code mode", "call_tool_chain", "mcp tools" or auto-routing when external tool names appear |
| **Works on** | Tools registered in `.utcp_config.json` at the project root |
| **Produces** | Structured results plus captured console output from a single TypeScript execution |

---

## 2. OVERVIEW

### Why This Skill Exists

Native MCP loads every tool's full schema into the context window before the agent acts. A few dozen tools across several servers is a large fixed tax on each turn, and it grows with every server you add. You pay for definitions you will never call right now. A multi-step flow across two or three services means several separate round-trips, each one re-uploading the same context. The cost scales linearly with the number of configured servers, and the agent has no way to opt out of schemas it does not need.

### What It Does

Code Mode flips the model. Instead of injecting every schema up front, it discovers tools on demand. You search for what you need, confirm the callable signature, then run the whole workflow inside a single `call_tool_chain({ code })` execution. State persists across calls in local TypeScript variables. The context stays roughly 98% smaller (about 1.6k tokens versus 141k for 47 tools) regardless of how many servers are configured, because schemas only load when you ask for them.

This skill is the shared transport the other `mcp-*` skills build on. `mcp-chrome-devtools` and `mcp-click-up` both register their tools through Code Mode and call them via `call_tool_chain()`.

---

## 3. QUICK START

**Step 1: Find the tool you need.**

```typescript
const tools = await search_tools({
  task_description: "create a ClickUp task",
  limit: 5
});
// Expected: array of matching tool objects with name, description and interface fields
```

**Step 2: Confirm the exact callable syntax.**

```typescript
const info = await tool_info({
  tool_name: "clickup.clickup_create_task"
});
// Expected: full TypeScript interface showing parameter types and return shape
```

**Step 3: Call the tool.**

```typescript
call_tool_chain({
  code: `
    const task = await clickup.clickup_create_task({
      name: "New Feature",
      listName: "Dev Sprint"
    });
    return task;
  `,
  timeout: 60000
});
// Expected: { result: { id: "...", name: "New Feature", url: "..." }, logs: [...] }
```

**Step 4: Verify the config is in place.**

```bash
cat .utcp_config.json | grep '"name"'
# Expected: one "name" entry per registered MCP server (e.g. "clickup", "figma")

cat .env | head -3
# Expected: prefixed keys like clickup_CLICKUP_API_KEY=pk_xxx
```

---

## 4. HOW IT WORKS

### The Four Core Tools

Code Mode exposes four tools for discovery and execution. `search_tools({ task_description, limit? })` finds registered tools by a natural-language description. `list_tools()` returns every registered tool. `tool_info({ tool_name })` gives the exact callable TypeScript signature for one tool. `call_tool_chain({ code, timeout?, max_output_size? })` runs a TypeScript block that calls the tools and returns structured state plus captured logs. Three auxiliary tools exist in the runtime beyond the core four: `register_manual` adds a server at runtime, `deregister_manual` removes one and `get_required_keys_for_tool` reports the environment keys a tool needs.

### Progressive Disclosure

The workflow is always the same four steps: discover, confirm, execute, return. You never load a schema you do not use. A search returns only the tools that match your description. A `tool_info()` call returns only the one tool you asked about. The TypeScript block only loads the schemas for the tools it actually calls. The context cost stays flat as you add servers because nothing loads until you ask for it.

### The Naming Translation Rule

Tool naming follows the pattern `{manual_name}.{manual_name}_{tool_name}`. The single most common error is getting this translation wrong, because `list_tools()` and `call_tool_chain()` use different formats.

`list_tools()` returns names in dotted `a.b.c` form. For example:

```
clickup.clickup.create_task
```

A call uses the dot-then-underscore form:

```typescript
await clickup.clickup_create_task({ name: "New Feature" });
```

If you copy the dotted name from `list_tools()` directly into code, you get `TypeError: clickup.clickup is not a function`. The fix is always to replace the second dot with an underscore: `manual.manual_tool()`. `tool_info()` shows the correct callable syntax, so use it when you are unsure.

### State Persistence and Error Handling

State persists across the chain in local TypeScript variables. A result from one call is available to the next call in the same block. A failure without error handling stops the entire execution, so multi-step flows wrap calls in `try/catch` or use `Promise.allSettled` for partial success. `console.log` output is captured and returned alongside the result. `call_tool_chain` takes `code` (required), `timeout` (default 30000ms) and `max_output_size` (default 200000 characters).

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for Code Mode when you need to call an external MCP tool. Skip it for file operations (Read, Write, Edit), text search (Grep), file discovery (Glob), bash commands (Bash) or native MCP tools registered in `opencode.json`. Native tools like Spec Kit Memory and Sequential Thinking are not accessible through `call_tool_chain()` and do not appear in `list_tools()` output.

### The Config Boundary

Code Mode only reaches tools registered in `.utcp_config.json`. Setup is two files at the project root: `.utcp_config.json` for server definitions (the `manual_call_templates` array) and `.env` for secrets. Environment variables are prefixed by the manual name. A config entry with `"name": "clickup"` requires `clickup_CLICKUP_API_KEY` in `.env`, not `CLICKUP_API_KEY`. A missing prefix is the second most common error after the naming translation.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-chrome-devtools` | Registers Chrome DevTools as a Code Mode provider and calls tools through `call_tool_chain()` |
| `mcp-click-up` | Registers ClickUp as a Code Mode provider and calls tools through `call_tool_chain()` |
| `sk-code` | Owns application-code standards and tests. Code Mode handles external tool calls, not local code |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `TypeError: myservice.myservice is not a function` | Double-dot notation `manual.manual.tool` instead of `manual.manual_tool` | Use the dot-then-underscore form: `myservice.myservice_sites_list()` |
| `Error: Tool not found: myservice.sites_list` | Missing manual prefix on the tool name | Add the prefix: `myservice.myservice_sites_list()` |
| `Error: Variable 'clickup_CLICKUP_API_KEY' not found` | The `.env` key is missing its manual prefix | Use `clickup_CLICKUP_API_KEY=pk_xxx`, not `CLICKUP_API_KEY=pk_xxx` |
| Config not found or server fails to start | `.utcp_config.json` is missing or malformed | Confirm the file exists at the project root and each entry has a `name` and `config` field |
| A tool is missing from `list_tools()` | It is a native MCP tool in `opencode.json` | Native tools are not in Code Mode. Call them directly |
| Execution timeout | The workflow is too complex for the default 30s | Set a higher `timeout` (60s for complex, 120s+ for very complex workflows) |

---

## 7. FAQ

**Q: When do I use Code Mode versus native MCP tools?**

A: Use Code Mode for any tool registered in `.utcp_config.json` (external services like ClickUp, Figma, Notion). Use native MCP tools directly for things like Spec Kit Memory, Sequential Thinking and Code Graph. `list_tools()` only shows Code Mode tools. If a tool does not appear there, it is native.

**Q: Why does `list_tools()` show dotted names but my code needs underscores?**

A: `list_tools()` returns names in `a.b.c` format for readability. The callable form replaces the second dot with an underscore: `a.a_b_c()`. This is a UTCP protocol requirement. `tool_info()` always shows the correct callable syntax.

**Q: How do I add a new MCP server at runtime?**

A: Use `register_manual` to add a server for the current session. To make it permanent, add the entry to `.utcp_config.json` and restart the session. Both approaches require the server's environment keys to be present in `.env`.

**Q: What happens when one tool fails mid-chain?**

A: Without error handling, the entire execution stops and the error is returned. Wrap calls in `try/catch` to handle failures gracefully, or use `Promise.allSettled` for parallel operations where partial success is acceptable.

**Q: How much smaller is the context really?**

A: Roughly 98% smaller. A setup with 47 tools across several servers loads about 141k tokens with native MCP. Code Mode loads about 1.6k tokens for the core tools, then discovers schemas on demand. The figure stays flat as you add servers.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Install walkthrough for Node, `.utcp_config.json` and `.env` |
| [`references/naming_convention.md`](./references/naming_convention.md) | The naming pattern guide and the number-one-error troubleshooting |
| [`references/configuration.md`](./references/configuration.md) | `.utcp_config.json` and `.env` setup with server configs and env prefixes |
| [`references/workflows.md`](./references/workflows.md) | Workflow patterns: single tool, multi-tool orchestration and error handling |
| [`references/architecture.md`](./references/architecture.md) | Token economics, the data flow and the sandbox model |
| [`assets/config_template.md`](./assets/config_template.md) | A copy-ready `.utcp_config.json` template |
| [`assets/env_template.md`](./assets/env_template.md) | A copy-ready `.env` template with prefixed placeholders |
