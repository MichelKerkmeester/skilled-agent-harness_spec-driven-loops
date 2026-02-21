---
description: "Code snippets, tool chain patterns, and templates for Code Mode invocations."
---
# Quick Reference

### Essential Commands

```typescript
// 1. Discover tools
search_tools({ task_description: "webflow site management", limit: 10 });

// 2. Get tool details
tool_info({ tool_name: "webflow.webflow_sites_list" });

// 3. List all tools
list_tools();

// 4. Call single tool
call_tool_chain({
  code: `await webflow.webflow_sites_list({})`
});

// 5. Multi-tool workflow with error handling
call_tool_chain({
  code: `
    try {
      const design = await figma.figma_get_file({ fileKey: "AbC123DeF45" });
      const task = await clickup.clickup_create_task({
        name: `Implement ${design.name}`,
        listName: "Frontend Sprint",
        description: "Build from latest approved Figma file"
      });
      return { success: true, designName: design.name, taskId: task.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  `,
  timeout: 60000
});

// 6. Parallel execution of independent operations
call_tool_chain({
  code: `
    const [sites, tasks, figmaFile] = await Promise.all([
      webflow.webflow_sites_list({}),
      clickup.clickup_get_tasks({ listName: "Development" }),
      figma.figma_get_file({ fileKey: "abc123" })
    ]);
    
    return { 
      siteCount: sites.length,
      taskCount: tasks.length,
      figmaName: figmaFile.name
    };
  `
});
```

### Parallel Execution Patterns

| Pattern                | Use When                | Example                                            |
| ---------------------- | ----------------------- | -------------------------------------------------- |
| `Promise.all()`        | All must succeed        | `const [a, b] = await Promise.all([fnA(), fnB()])` |
| `Promise.allSettled()` | Partial success OK      | `const results = await Promise.allSettled([...])`  |
| Batch processing       | Many items, rate limits | `processInBatches(items, 3, processor)`            |
| Parallel → Sequential  | Fetch then process      | Phase 1: parallel fetch, Phase 2: sequential use   |

**See [references/workflows.md](references/workflows.md) Section 7 for comprehensive parallel execution examples.**

### Critical Naming Pattern

**See Section 3: Critical Naming Pattern for the complete guide with examples.**

**Pattern**: `{manual_name}.{manual_name}_{tool_name}`

### Timeout Guidelines

- **Simple (1-2 tools)**: 30s (default)
- **Complex (3-5 tools)**: 60s
- **Very complex (6+ tools)**: 120s+