---
description: "MCP (Code Mode) approach for Chrome DevTools: configuration, isolated instances, tool invocation, and session cleanup"
---
# MCP Approach

The MCP approach uses Chrome DevTools via Code Mode as a fallback when CLI is unavailable or multi-tool integration is needed.

## Prerequisites

1. Code Mode configured in `.utcp_config.json`
2. Chrome DevTools MCP server registered with `--isolated=true`

## Isolated Instances

**Key Feature**: MCP uses `--isolated=true` flag for independent browser instances.

**Benefits of isolated instances:**
- Each instance runs in its own browser process
- Multiple parallel browser sessions possible
- No session conflicts between instances
- Register multiple instances for parallel testing (e.g., `chrome_devtools_1`, `chrome_devtools_2`)

**Configuration example** (`.utcp_config.json`):
```json
{
  "manual_call_templates": [
    {
      "name": "chrome_devtools_1",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "chrome_devtools_1": {
            "transport": "stdio",
            "command": "npx",
            "args": ["chrome-devtools-mcp@latest", "--isolated=true"],
            "env": {}
          }
        }
      }
    },
    {
      "name": "chrome_devtools_2",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "chrome_devtools_2": {
            "transport": "stdio",
            "command": "npx",
            "args": ["chrome-devtools-mcp@latest", "--isolated=true"],
            "env": {}
          }
        }
      }
    }
  ]
}
```

## Configuration Check

```bash
cat .utcp_config.json | jq '.manual_call_templates[] | select(.name | startswith("chrome_devtools"))'
```

## Invocation Pattern

Tool naming: `{manual_name}.{manual_name}_{tool_name}`

**Single instance example:**
```typescript
await call_tool_chain({
  code: `
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://example.com"
    });
    const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    return screenshot;
  `,
  timeout: 30000
});
```

**Parallel instances example** (comparing two pages):
```typescript
await call_tool_chain({
  code: `
    // Instance 1: Production site
    await chrome_devtools_1.chrome_devtools_1_navigate_page({
      url: "https://example.com"
    });

    // Instance 2: Staging site (parallel)
    await chrome_devtools_2.chrome_devtools_2_navigate_page({
      url: "https://staging.example.com"
    });

    // Capture both screenshots
    const prod = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
    const staging = await chrome_devtools_2.chrome_devtools_2_take_screenshot({});

    return { production: prod, staging: staging };
  `,
  timeout: 60000
});
```

## Available MCP Tools

| Tool                    | Purpose            | CLI Equivalent                                           |
| ----------------------- | ------------------ | -------------------------------------------------------- |
| `navigate_page`         | Navigate to URL    | `bdg <url>`                                              |
| `take_screenshot`       | Capture screenshot | `bdg dom screenshot`                                     |
| `list_console_messages` | Get console logs   | `bdg console --list`                                     |
| `resize_page`           | Set viewport size  | N/A (use cdp)                                            |
| `click`                 | Click on element   | `bdg cdp Input.dispatchMouseEvent`                       |
| `fill`                  | Fill form field    | `bdg dom eval "document.querySelector(...).value = ..."` |
| `hover`                 | Hover over element | `bdg cdp Input.dispatchMouseEvent`                       |
| `press_key`             | Press keyboard key | `bdg cdp Input.dispatchKeyEvent`                         |
| `wait_for`              | Wait for condition | N/A (scripting)                                          |
| `new_page`              | Open new page      | N/A                                                      |
| `close_page`            | Close page         | `bdg stop`                                               |
| `select_page`           | Switch to page     | N/A                                                      |

**Note**: Tool names use underscores (e.g., `take_screenshot`) not camelCase.

**Full invocation pattern**: `{manual_name}.{manual_name}_{tool_name}()`
- Example: `chrome_devtools_1.chrome_devtools_1_take_screenshot({})`

## When to Prefer MCP

- Already using Code Mode for other tools (Webflow, Figma, etc.)
- Need to chain browser operations with other MCP tools
- **Parallel browser testing** -- compare multiple sites/viewports simultaneously
- Complex multi-step automation in TypeScript
- Type-safe tool invocation required

## MCP Limitations

- Higher token cost than CLI
- Requires Code Mode infrastructure
- Subset of CDP methods (CLI has 300+ methods across 53 domains)
- Less self-documenting than CLI's `--list`, `--describe`

## Session Cleanup

**Important**: Always close browser instances when done to prevent resource leaks.

```typescript
// Cleanup pattern for MCP sessions
await call_tool_chain({
  code: `
    try {
      // Your browser operations
      await chrome_devtools_1.chrome_devtools_1_navigate_page({
        url: "https://example.com"
      });
      const screenshot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
      return screenshot;
    } finally {
      // Always close the page when done
      await chrome_devtools_1.chrome_devtools_1_close_page({});
    }
  `,
  timeout: 30000
});

// For multi-instance cleanup
await call_tool_chain({
  code: `
    try {
      // Operations on multiple instances...
    } finally {
      // Close all instances
      await chrome_devtools_1.chrome_devtools_1_close_page({});
      await chrome_devtools_2.chrome_devtools_2_close_page({});
    }
  `,
  timeout: 30000
});
```

**Best Practice**: Wrap browser operations in try/finally to ensure cleanup even on errors.

## Cross References
- [[how-it-works|How It Works]] -- Tool comparison overview
- [[cli-approach|CLI Approach]] -- Primary approach when CLI available
- [[routing-decision|Routing Decision]] -- When to use MCP vs CLI
- [[quick-reference|Quick Reference]] -- MCP tool cheat sheet