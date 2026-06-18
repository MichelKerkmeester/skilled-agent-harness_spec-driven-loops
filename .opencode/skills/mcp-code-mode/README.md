---
title: mcp-code-mode
description: MCP orchestration engine that lets an agent call hundreds of external tools by writing TypeScript that runs in one execution, discovering tool schemas on demand so the context stays flat.
trigger_phrases:
  - "code mode"
  - "call_tool_chain"
  - "mcp tools"
  - "tool orchestration"
  - "context reduction"
---

# mcp-code-mode

> Execute TypeScript with direct access to every external MCP tool registered in `.utcp_config.json`, discovering tool schemas on demand so the agent context stays roughly 98% smaller regardless of how many servers are configured.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Calling ClickUp, Figma, MyService, Notion, Chrome DevTools and any other external MCP tool through a single TypeScript execution layer |
| **Invoke with** | "code mode", "call_tool_chain", "mcp tools", "tool orchestration" or automatic routing on external-tool keywords |
| **Works on** | External tools registered in `.utcp_config.json` at the project root with environment variables in `.env` |
| **Produces** | Typed tool results, captured console logs and structured state returned from a single execution |

---

## 2. OVERVIEW

### Why This Skill Exists

Native MCP loads every tool schema into the context window before the agent does anything. With a few dozen tools across several servers that is a large fixed tax on every turn, and it grows with each server you add. The agent pays for tool definitions it will never call on this turn, and a multi-step flow across two or three services means several separate tool round-trips. At roughly 47 tools the traditional approach consumes about 141,000 tokens before any real work begins, hitting the practical wall somewhere around two or three MCP servers.

Code Mode replaces that upfront load with progressive disclosure. The AI sees only the Code Mode meta-tools. It discovers tool schemas on demand, so the context stays flat at about 1,600 tokens no matter how many servers are configured. A whole multi-tool workflow runs in one TypeScript execution with state held in local variables, saving the round trips and the re-parsing cost between steps.

### What It Does

Code Mode is the execution engine that all the other `mcp-*` skills build on. It wraps every external MCP tool behind a single `call_tool_chain` call that runs TypeScript in a sandboxed V8 isolate. You search for tools with `search_tools`, confirm the callable signature with `tool_info`, write your tool calls inside a `call_tool_chain({ code: "..." })` block and return structured results. The four core tools are `search_tools`, `list_tools`, `tool_info` and `call_tool_chain`. Auxiliary runtime tools such as `register_manual` and `get_required_keys_for_tool` handle dynamic server registration and credential checks.

Code Mode does not reach native MCP servers registered in `opencode.json`. Spec Kit Memory, Skill Advisor, Sequential Thinking and Code Graph are called directly. Code Mode is also not for local file operations. Its boundary is `.utcp_config.json` tools only.

---

## 3. QUICK START

**Step 1: Discover tools with search_tools.** Before calling any external tool, search by task description to get the registered name. Never guess tool names.

```typescript
search_tools({ task_description: "ClickUp task management", limit: 10 })
// Returns matching tool names and descriptions
```

**Step 2: Confirm the callable signature with tool_info.** Use the exact name to get the TypeScript interface before writing parameterised code.

```typescript
tool_info({ tool_name: "clickup_official.clickup_official_create_task" })
// Returns the full TypeScript function signature with parameter types
```

**Step 3: Execute with call_tool_chain.** Every external tool call goes inside a `call_tool_chain({ code: "..." })` block. The naming pattern is `{manual_name}.{manual_name}_{tool_name}`.

```typescript
call_tool_chain({
  code: `
    const task = await clickup_official.clickup_official_create_task({
      name: "New Feature",
      listName: "Development Sprint",
      description: "Implement user authentication"
    });
    console.log("Task created:", task.id);
    return task;
  `
})
// Returns { result: { id: "...", name: "New Feature", ... }, logs: ["Task created: ..."] }
```

**Step 4: Chain multiple tools in one execution.** State persists across all calls in the same `code` block. Data from the first call is available to every subsequent call.

```typescript
call_tool_chain({
  code: `
    const design = await figma.figma_get_file({ fileId: "abc123" });
    const task = await clickup_official.clickup_official_create_task({
      name: \`Implement: \${design.name}\`,
      listName: "Frontend Sprint"
    });
    return { design: design.name, taskId: task.id };
  `,
  timeout: 60000
})
// Returns { result: { design: "Homepage Redesign", taskId: "..." }, logs: [...] }
```

---

## 4. HOW IT WORKS

### The Four Core Tools

`search_tools({ task_description, limit? })` finds registered tools by a natural-language task description. It returns tool names and short descriptions only, keeping the token cost negligible. `list_tools()` returns every registered Code Mode tool name. Use it when you need the full inventory or want to group tools by manual prefix. `tool_info({ tool_name })` returns the exact callable TypeScript signature for one tool. Always call it before writing parameterised execution code. `call_tool_chain({ code, timeout?, max_output_size? })` executes a TypeScript block that calls the tools and returns structured state. It returns `{ result, logs }` where `logs` captures every `console.log` output from inside the block.

Two auxiliary tools support dynamic server management. `register_manual` adds an MCP server at runtime without a restart. `get_required_keys_for_tool` reports the prefixed environment variable keys a tool needs before you call it.

### Progressive Disclosure

The reason context stays flat is that tool schemas are never loaded upfront. The agent calls `search_tools` to discover what exists, then `tool_info` to inspect a specific tool interface, then `call_tool_chain` to run the TypeScript. Each step loads only the schema information needed for that step. Tools you never use cost zero tokens. Adding more servers to `.utcp_config.json` does not increase the initial context load at all. The context stays at about 1,600 tokens whether you have one MCP server or ten.

### The Naming Rule and Its Number-One Error

Every tool call follows `{manual_name}.{manual_name}_{tool_name}`. The manual name comes from the `name` field in `.utcp_config.json`. The tool name comes from the MCP server and uses snake_case, joined to the manual name with an underscore.

The most common error is the naming translation mismatch. `list_tools()` returns names in dotted `a.b.c` form, for example `clickup_official.clickup_official.create_task`. A call uses the dot-then-underscore form `clickup_official.clickup_official_create_task()`. The `tool_info` function always shows the correct callable syntax. When in doubt, run `tool_info` on the tool name before writing the call.

### State Persistence and Error Handling

State persists across all tool calls inside a single `call_tool_chain` execution. A variable set by the first call is available to every subsequent call in the same block. You can fetch a Figma design, extract the component count, create a ClickUp task with that data and update a MyService CMS item, all without leaving the execution or manually passing state between tool calls.

An unhandled exception stops the entire execution. Wrap multi-step flows in `try/catch` and return structured results with a `success` boolean. For parallel work where partial success is acceptable use `Promise.allSettled` instead of `Promise.all`. The execution is sandboxed in a V8 isolate with configurable timeouts (30 seconds default, extendable to 120 seconds or more for complex workflows) and output size limits (200,000 characters default).

### The .env Prefix Rule

Code Mode prefixes every environment variable with the manual name from `.utcp_config.json`. If the manual name is `clickup_official` and the config references `${CLICKUP_API_KEY}`, your `.env` file must declare `clickup_official_CLICKUP_API_KEY`. Using the unprefixed form `CLICKUP_API_KEY` produces a runtime error. Run `get_required_keys_for_tool` before a workflow to confirm the exact prefixed variable names a tool expects.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for Code Mode whenever you need to call an external MCP tool: ClickUp for task management, Figma for design files, MyService for CMS operations, Notion for documentation, Chrome DevTools for browser automation or any other server registered in `.utcp_config.json`. Reach for it too when you need to chain several of those tools into a single workflow.

Skip Code Mode for native MCP tools in `opencode.json` (Spec Kit Memory, Skill Advisor, Sequential Thinking, Code Graph), for local file operations (Read, Write, Edit, Grep, Glob, Bash) and for any first-class tool the active runtime already exposes directly. Calling native tools through Code Mode adds overhead without giving you access to them because Code Mode only sees what is in `.utcp_config.json`.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-chrome-devtools` | Consumes Code Mode as its MCP transport. Routes Chrome DevTools calls through `call_tool_chain()` and registers chrome_devtools entries in `.utcp_config.json`. |
| `mcp-click-up` | Consumes Code Mode as its MCP transport. Routes ClickUp calls through `call_tool_chain()` and registers clickup entries in `.utcp_config.json`. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `Tool not found` or `Cannot read properties of undefined` | Missing manual prefix. Calling `myservice.sites_list()` instead of `myservice.myservice_sites_list()` | Use `search_tools()` to get the exact registered name, then `tool_info()` to confirm the callable syntax |
| `TypeError: myservice.myservice is not a function` | Double-dot notation where an underscore belongs. `manual.manual.tool` instead of `manual.manual_tool` | Replace the second dot with an underscore: `myservice.myservice_sites_list()` |
| `Variable 'clickup_official_CLICKUP_API_KEY' not found` | `.env` uses the unprefixed key. Code Mode expects `clickup_official_CLICKUP_API_KEY` | Prepend the manual name from `.utcp_config.json` to the key in `.env`. Run `get_required_keys_for_tool` to see the expected names |
| `Execution timeout exceeded` | Workflow calls more tools than the default 30-second timeout allows | Set `timeout: 60000` for 3 to 5 tools or `timeout: 120000` for 6 or more |
| Config file not found | `UTCP_CONFIG_FILE` points to a relative path or the file is missing | Use an absolute path in the `UTCP_CONFIG_FILE` value and confirm the file exists with `ls -la` |
| A tool is missing from `list_tools()` | The tool is a native MCP tool in `opencode.json`. Code Mode only sees `.utcp_config.json` tools | Call native MCP tools directly by their function name without using `call_tool_chain` |

---

## 7. FAQ

**Q: When do I use `call_tool_chain` versus calling a tool directly?**

A: Use `call_tool_chain` for every tool registered in `.utcp_config.json`. Call native MCP tools from `opencode.json` directly. File operations (Read, Write, Edit, Grep, Glob, Bash) always go direct. The boundary is simple: if the tool exists because of an entry in `.utcp_config.json`, it goes through Code Mode.

**Q: Why does `list_tools()` not show Sequential Thinking, Spec Kit Memory, Skill Advisor or Code Graph?**

A: Those are native MCP tools in `opencode.json`. Code Mode discovery tools only see what is registered in `.utcp_config.json`. Native MCP tools are called directly by their function name and never appear in Code Mode tool listings.

**Q: How do I add a new MCP server without restarting?**

A: Use `register_manual` with the full UTCP call template to add a server at runtime. It is available immediately inside `call_tool_chain`. To remove it call `deregister_manual` with the manual name. For persistent registration across sessions add the entry to `.utcp_config.json` and restart.

**Q: What happens when one tool fails in a multi-step workflow?**

A: Without error handling an unhandled exception stops the entire `call_tool_chain` execution. Wrap critical sections in `try/catch` and return structured results with a `success` boolean. For workflows where partial success is acceptable use `Promise.allSettled` instead of `Promise.all`.

---

## 8. VERIFICATION

The skill ships a manual testing playbook covering the core tools, the naming contract, environment variable prefixing, multi-tool workflows and recovery scenarios.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-code-mode/README.md --type readme` reports zero issues |
| Config health | `python3 .opencode/skills/mcp-code-mode/scripts/validate_config.py .utcp_config.json` passes with no errors |
| Runtime health | `bash .opencode/skills/mcp-code-mode/scripts/doctor.sh` runs a read-only health check against the live config |
| Behavior | Run the playbook scenarios under `manual_testing_playbook/01--core-tools/` through `manual_testing_playbook/07--recovery-and-config/` in a live session |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Step-by-step install and configuration for `.utcp_config.json`, `.env` and per-client setup |
| [`references/naming_convention.md`](./references/naming_convention.md) | The naming pattern guide and the number-one-error troubleshooting |
| [`references/configuration.md`](./references/configuration.md) | `.utcp_config.json` and `.env` setup, server configs and environment variable prefixing |
| [`references/workflows.md`](./references/workflows.md) | Workflow patterns: single tool, multi-tool orchestration, error handling and parallel execution |
| [`references/architecture.md`](./references/architecture.md) | Token economics, the data flow and the V8 isolate sandbox model |
| [`assets/config_template.md`](./assets/config_template.md) | Copy-ready `.utcp_config.json` template |
| [`assets/env_template.md`](./assets/env_template.md) | Copy-ready `.env` template with prefixed placeholders |
