---
description: "Mandatory rules (ALWAYS, NEVER) for writing Code Mode scripts."
---
# Code Mode Rules

## 5. RULES

### ✅ ALWAYS

- **Use Code Mode for ALL MCP tool calls** - Mandatory for ClickUp, Notion, Figma, Webflow, Chrome DevTools, etc.
- **Follow naming pattern**: `{manual_name}.{manual_name}_{tool_name}` (see [naming_convention.md](references/naming_convention.md))
- **Use progressive discovery**: `search_tools()` before calling unknown tools
- **Use try/catch** for error handling in multi-step workflows
- **Set appropriate timeouts**: 30s (simple), 60s (complex), 120s+ (very complex)
- **Console.log progress** in complex workflows for debugging
- **Structure return values** consistently: `{ success, data, errors, timestamp }`

### ❌ NEVER

- **Skip Code Mode for MCP tools** - Direct MCP calls cause context exhaustion
- **Use wrong naming pattern** - `webflow.sites_list` instead of `webflow.webflow_sites_list`
- **Guess tool names** - Use `search_tools()` to discover correct names
- **Ignore TypeScript errors** - Type safety prevents runtime errors
- **Skip error handling** - Unhandled errors crash entire workflow
- **Use Code Mode for file operations** - Use Read/Write/Edit tools instead
- **Assume tool availability** - Verify with `list_tools()` first

### ⚠️ ESCALATE IF

- **Tool naming errors persist** after consulting [naming_convention.md](references/naming_convention.md)
- **Configuration fails to load** - Check [configuration.md](references/configuration.md)
- **Environment variables not found** - Verify .env file exists and syntax is correct
- **MCP server fails to start** - Check command/args in .utcp_config.json
- **Tools not discovered** - Verify manual name matches configuration
- **Execution timeout** - Increase timeout or break into smaller operations
- **Need to add new MCP server** - Follow guide in [configuration.md](references/configuration.md)

---

