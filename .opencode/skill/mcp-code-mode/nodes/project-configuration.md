---
description: "How to configure .utcp_config.json for external MCP tools."
---
# Project Configuration

## 4. PROJECT CONFIGURATION

### Two MCP Configuration Systems

**IMPORTANT**: Code Mode only accesses tools in `.utcp_config.json`. Native MCP tools are NOT accessed through Code Mode.

**1. Native MCP** (`opencode.json`) - Direct tools (call directly, NOT through Code Mode):
- **Sequential Thinking**: `sequential_thinking_sequentialthinking()`
- **Spec Kit Memory**: `spec_kit_memory_memory_search()`, `spec_kit_memory_memory_save()`, etc.
- **Code Mode server**: The Code Mode tool itself
- **Note**: Some AI environments have built-in extended thinking capabilities that may supersede Sequential Thinking MCP.

**2. Code Mode MCP** (`.utcp_config.json`) - External tools accessed through Code Mode:
- **MCP Config**: `.utcp_config.json` (project root)
- **Environment Variables**: `.env` (project root)
- **External tools**: Webflow, Figma, Chrome DevTools, ClickUp, Notion, etc.
- These are accessed via `call_tool_chain()` wrapper

### How to Discover Available Code Mode Tools

**These discovery methods ONLY work for Code Mode tools in `.utcp_config.json`**
**They do NOT show Sequential Thinking (which is in `.mcp.json`)**

**Step 1: Check Configuration**
```typescript
// Read .utcp_config.json to see configured Code Mode MCP servers
// Look for "manual_call_templates" array
// Each object has a "name" field (this is the manual name)
// Check "disabled" field - if true, server is not active

// NOTE: Sequential Thinking is NOT in this file
// Sequential Thinking is in .mcp.json and called directly
```

**Step 2: Use Progressive Discovery**
```typescript
// Search for Code Mode tools by description
const tools = await search_tools({
  task_description: "browser automation",
  limit: 10
});

// List all available Code Mode tools
const allTools = await list_tools();

// Get info about a specific Code Mode tool
const info = await tool_info({
  tool_name: "server_name.server_name_tool_name"
});

// NOTE: These discovery tools are part of Code Mode
// They only show tools configured in .utcp_config.json
// Sequential Thinking will NOT appear in these results
```

### Critical Naming Convention (Code Mode Tools Only)

**See Section 3: Critical Naming Pattern for the complete guide.**

**Quick reminder**: `{manual_name}.{manual_name}_{tool_name}` (e.g., `webflow.webflow_sites_list()`)

**Sequential Thinking Exception**:
- NOT in `.utcp_config.json` - uses native MCP tools
- Call directly: `sequential_thinking_sequentialthinking()`
- Does NOT use `call_tool_chain()`
- Sequential Thinking MCP provides structured reasoning for complex multi-step problems.

### Configuration Structure

```json
{
  "manual_call_templates": [
    {
      "name": "manual_name",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "manual_name": {
            "transport": "stdio",
            "command": "npx",
            "args": ["package-name"],
            "env": {},
            "disabled": false
          }
        }
      }
    }
  ]
}
```

### Critical: Prefixed Environment Variables

> **⚠️ IMPORTANT**: Code Mode prefixes ALL environment variables with `{manual_name}_` from your configuration.

**Example:**
- Config has `"name": "clickup"` and env section references `${CLICKUP_API_KEY}`
- Your `.env` file MUST use: `clickup_CLICKUP_API_KEY=pk_xxx`
- Using `CLICKUP_API_KEY=pk_xxx` will cause: `Error: Variable 'clickup_CLICKUP_API_KEY' not found`

**Quick Reference:**

| Manual Name | Config Reference | .env Variable |
|-------------|-----------------|---------------|
| `clickup` | `${CLICKUP_API_KEY}` | `clickup_CLICKUP_API_KEY` |
| `figma` | `${FIGMA_API_KEY}` | `figma_FIGMA_API_KEY` |
| `notion` | `${NOTION_TOKEN}` | `notion_NOTION_TOKEN` |

See [env_template.md](assets/env_template.md) for complete examples.

### Generic Multi-Tool Workflow Pattern

```typescript
call_tool_chain({
  code: `
    // Step 1: Discover what tools are available
    const availableTools = await search_tools({
      task_description: "sync design QA tasks and publish status",
      limit: 10
    });

    console.log("Available tools:", availableTools);

    // Step 2: Call tools using correct naming pattern
    const task = await clickup.clickup_create_task({
      name: "Verify hero section spacing",
      listName: "Design QA",
      description: "Compare Figma spacing against production page"
    });

    // Step 3: Chain multiple tools if needed
    const cmsItem = await webflow.webflow_collections_items_create_item_live({
      collection_id: "design-qa-queue",
      request: {
        items: [{
          fieldData: {
            name: task.name,
            status: "Queued",
            taskUrl: task.url
          }
        }]
      }
    });

    return { task, cmsItem, availableTools: availableTools.length };
  `,
  timeout: 60000
});
```

### How to Check Active Code Mode Servers

**IMPORTANT**: This only shows Code Mode servers in `.utcp_config.json`, NOT Sequential Thinking

```typescript
// This code shows how to discover what Code Mode tools are configured
call_tool_chain({
  code: `
    // List all available tools from all active Code Mode MCP servers
    // NOTE: This will NOT include Sequential Thinking
    const allTools = await list_tools();

    // Group by server (manual name is prefix before first dot)
    const servers = {};
    allTools.forEach(tool => {
      const serverName = tool.split('.')[0];
      if (!servers[serverName]) servers[serverName] = [];
      servers[serverName].push(tool);
    });

    console.log("Active Code Mode servers:", Object.keys(servers));
    console.log("Tool counts:", Object.fromEntries(
      Object.entries(servers).map(([k, v]) => [k, v.length])
    ));

    console.log("NOTE: Sequential Thinking is NOT in this list");
    console.log("Sequential Thinking is a native MCP tool, not a Code Mode tool");

    return servers;
  `
});
```

---

