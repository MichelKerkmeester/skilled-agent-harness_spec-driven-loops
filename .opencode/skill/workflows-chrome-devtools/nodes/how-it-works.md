---
description: "Core architecture overview comparing CLI, MCP, and framework approaches for Chrome DevTools"
---
# How It Works

Browser debugging and automation through two complementary approaches: CLI (bdg) for speed and token efficiency, MCP for multi-tool integration.

## Tool Comparison

| Feature        | CLI (bdg)                                   | MCP (Code Mode)      | Puppeteer/Playwright |
| -------------- | ------------------------------------------- | -------------------- | -------------------- |
| **Setup**      | `npm install -g browser-debugger-cli@alpha` | MCP config + server  | Heavy dependencies   |
| **Discovery**  | `--list`, `--describe`, `--search`          | `search_tools()`     | API docs required    |
| **Token Cost** | Lowest (self-doc)                           | Medium (progressive) | Highest (verbose)    |
| **CDP Access** | 300+ methods across 53 domains              | MCP-exposed subset   | Full but complex     |
| **Best For**   | Debugging, inspection                       | Multi-tool workflows | Complex UI testing   |

## Routing Summary

CLI is the **priority** approach due to lower token cost and self-documenting discovery. MCP is the **fallback** when CLI is unavailable or when multi-tool integration is required. See the routing decision node for the full selection logic.

## Cross References
- [[cli-approach|CLI Approach]] -- Detailed CLI usage
- [[mcp-approach|MCP Approach]] -- Detailed MCP usage
- [[routing-decision|Routing Decision]] -- CLI vs MCP selection logic