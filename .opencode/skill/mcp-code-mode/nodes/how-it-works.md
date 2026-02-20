---
description: "The architecture of the UTCP TypeScript execution environment."
---
# How It Works

## 3. HOW IT WORKS

### Critical Naming Pattern

**The #1 most common error** when using Code Mode is using wrong function names. All MCP tool calls MUST follow this pattern:

```typescript
{manual_name}.{manual_name}_{tool_name}
```

**Examples**:

✅ **Correct**:
```typescript
await webflow.webflow_sites_list({});
await clickup.clickup_create_task({...});
await figma.figma_get_file({...});
```

❌ **Wrong** (missing manual prefix):
```typescript
await webflow.sites_list({});        // Error: Tool not found
await clickup.create_task({...});    // Error: Tool not found
```

**See [references/naming_convention.md](references/naming_convention.md) for complete guide with troubleshooting.**


### Context Parameter

Many Code Mode tools require a `context` parameter (15-25 words) for analytics:

```typescript
await webflow.webflow_sites_list({ 
  context: "Listing sites to identify collection structure for CMS update" 
});
```

This helps with usage tracking and debugging.

### Tool Name Translation

> **Note:** `list_tools()` returns names in `a.b.c` format (e.g., `webflow.webflow.sites_list`). To call the tool, use underscore format: `webflow.webflow_sites_list()`. The `tool_info()` function shows the correct calling syntax.

### Basic Workflow

**Step 1: Discover Tools**

```typescript
// Progressive discovery - search for relevant tools
search_tools({
  task_description: "clickup task management",
  limit: 10
});

// Returns: Tool names and descriptions (minimal tokens)
// Example: ["clickup.clickup_create_task", "clickup.clickup_get_task", ...]
```

**Step 2: Call Tools via Code Mode**

```typescript
// Execute TypeScript with direct tool access
call_tool_chain({
  code: `
    // Note the naming pattern: {manual_name}.{manual_name}_{tool_name}
    const result = await clickup.clickup_create_task({
      name: "New Feature",
      listName: "Development Sprint",
      description: "Implement user authentication"
    });

    console.log('Task created:', result.id);
    return result;
  `
});
```

**Step 3: Multi-Tool Orchestration**

```typescript
// State persists across tool calls in single execution
call_tool_chain({
  code: `
    // Step 1: Get Figma design
    const design = await figma.figma_get_file({ fileId: "abc123" });

    // Step 2: Create ClickUp task (design data available)
    const task = await clickup.clickup_create_task({
      name: \`Implement: \${design.name}\`,
      description: \`Design has \${design.document.children.length} components\`
    });

    // Step 3: Update Webflow CMS (both design and task data available)
    const cms = await webflow.webflow_collections_items_create_item_live({
      collection_id: "queue-id",
      request: {
        items: [{
          fieldData: {
            name: design.name,
            taskUrl: task.url,
            status: "In Queue"
          }
        }]
      }
    });

    return { design, task, cms };
  `,
  timeout: 60000  // Extended timeout for complex workflow
});
```

---

