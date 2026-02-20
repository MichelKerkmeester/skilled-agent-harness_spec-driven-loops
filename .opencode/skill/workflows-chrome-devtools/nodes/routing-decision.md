---
description: "Decision logic for selecting between CLI (bdg) and MCP (Code Mode) approaches"
---
# Routing Decision

Determines whether to use the CLI approach (bdg) or MCP approach (Code Mode) for a given task.

## Decision Flow

```
Task received
    |
    v
Is bdg installed? (command -v bdg)
    |
    +-- NO --> Is Code Mode configured?
    |              |
    |              +-- YES --> Use MCP approach
    |              +-- NO  --> Install bdg (npm install -g browser-debugger-cli@alpha)
    |
    +-- YES --> Does task need multi-tool integration?
                   |
                   +-- YES --> Is Code Mode configured?
                   |              |
                   |              +-- YES --> Use MCP approach
                   |              +-- NO  --> Use CLI approach
                   |
                   +-- NO  --> Use CLI approach (priority)
```

## Selection Criteria

### Prefer CLI When
- bdg is installed and available
- Task is debugging, inspection, or single-tool automation
- Token efficiency matters
- Self-documenting discovery is needed (`--list`, `--describe`, `--search`)
- Unix pipe composability is beneficial
- CI/CD automation scripts are the target

### Prefer MCP When
- CLI is unavailable
- Already using Code Mode for other tools (Webflow, Figma, etc.)
- Need to chain browser operations with other MCP tools
- Parallel browser testing is required (multiple isolated instances)
- Complex multi-step automation in TypeScript
- Type-safe tool invocation is required

### Key Trade-offs

| Factor       | CLI (bdg)        | MCP (Code Mode)     |
| ------------ | ---------------- | ------------------- |
| Token cost   | Lowest           | Medium              |
| Setup        | Single npm pkg   | MCP config + server |
| CDP coverage | 300+ methods     | Exposed subset      |
| Discovery    | Self-documenting | `search_tools()`    |
| Multi-tool   | Single tool      | Full integration    |
| Parallelism  | Sequential       | Isolated instances  |

## Cross References
- [[cli-approach|CLI Approach]] -- Full CLI usage details
- [[mcp-approach|MCP Approach]] -- Full MCP usage details
- [[smart-routing|Smart Routing]] -- Intent-based resource routing logic
- [[how-it-works|How It Works]] -- Architecture overview