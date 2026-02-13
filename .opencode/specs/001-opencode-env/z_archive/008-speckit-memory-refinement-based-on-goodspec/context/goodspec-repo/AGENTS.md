# AGENTS.md

Guidelines for AI agents working in this codebase.

## Build & Test Commands

```bash
bun install          # Install dependencies
bun run build        # Build (outputs to dist/)
bun run dev          # Watch build for development
bun run typecheck    # Type check (no emit)
bun test             # Run all tests
bun test src/tools/goop-status/index.test.ts  # Single test file
bun test --filter "goop_status"               # Tests matching pattern
bun test --watch     # Watch mode
```

## Project Structure

```
src/
├── core/           # Types, config, resolver
├── tools/          # MCP tool implementations
├── hooks/          # OpenCode plugin hooks
├── features/       # Feature modules (memory, state, routing)
├── agents/         # Agent definitions and prompt sections
├── shared/         # Utilities (logger, paths, ui)
└── test-utils.ts   # Shared test utilities

agents/             # Agent markdown definitions
commands/           # Slash command definitions
skills/             # Loadable skill modules
references/         # Reference documentation
templates/          # File templates
```

## Code Style

### TypeScript Configuration
- **Target**: ES2022, **Module**: NodeNext
- **Strict mode** enabled with noUnusedLocals, noUnusedParameters, noImplicitReturns
- Use `.js` extension for all local imports (ESM requirement)

### Import Order
```typescript
// 1. External imports
import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
// 2. Internal imports with .js extension
import type { PluginContext } from "../../core/types.js";
import { log, logError } from "../shared/logger.js";
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `goop-status.ts` |
| Variables/Functions | camelCase | `createGoopStatusTool` |
| Types/Interfaces | PascalCase | `PluginContext` |
| Constants | UPPER_SNAKE_CASE | `MEMORY_TYPES` |

### Type Definitions
- Define interfaces in `src/core/types.ts`
- Use explicit types, avoid `any`
- Export const arrays with `as const` for union types:
```typescript
export const MEMORY_TYPES = ["observation", "decision", "note"] as const;
export type MemoryType = (typeof MEMORY_TYPES)[number];
```

### Error Handling
```typescript
try {
  // Main logic
} catch (error) {
  logError("Operation failed", error);
  return createMinimalResult();  // Graceful degradation, don't throw
}
```

### Logging
```typescript
import { log, logError } from "../shared/logger.js";
log("Debug message", { data });   // Only when GOOPSPEC_DEBUG=true
logError("Error message", error); // Always logged
```

## Testing

### Test Location
Tests are co-located: `src/tools/goop-status/index.test.ts`

### Test Structure
```typescript
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { createGoopStatusTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
  setupTestEnvironment,
  type PluginContext,
} from "../../test-utils.js";

describe("goop_status tool", () => {
  let ctx: PluginContext;
  let cleanup: () => void;

  beforeEach(() => {
    const env = setupTestEnvironment("test-name");
    cleanup = env.cleanup;
    ctx = createMockPluginContext({ testDir: env.testDir });
  });

  afterEach(() => cleanup());

  it("does something", async () => {
    const tool = createGoopStatusTool(ctx);
    const result = await tool.execute({}, createMockToolContext());
    expect(result).toContain("expected");
  });
});
```

### Mock Factories (test-utils.ts)
- `setupTestEnvironment(prefix)` - Temp dir with .goopspec structure
- `createMockPluginContext(opts)` - Full plugin context mock
- `createMockToolContext(opts)` - Tool execution context mock
- `createMockStateManager(state)` - State manager mock

## Implementation Patterns

### UI Pattern (Clack)
Use the shared UI wrapper for consistent, interactive feedback.

```typescript
import { ui } from "../shared/ui.js";

// Status spinners
await ui.spinner("Analyzing dependency graph", async () => {
  await heavyOperation();
  return "Graph built";
});

// Interactive prompts
const confirm = await ui.confirm("Do you want to proceed?");

// Notes and Logs
ui.note("Analysis Complete", "Found 3 potential issues.");
```

### Tool Pattern
```typescript
import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ToolContext } from "../../core/types.js";

export function createMyTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: "Brief tool description",
    args: {
      param: tool.schema.string().optional(),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      // 1. Memory Check (Memory-First)
      const memory = await ctx.memory.search(args.param);
      
      // 2. Execution
      const state = ctx.stateManager.getState();
      return "result";
    },
  });
}
```

### Hook Pattern
```typescript
export function createMyHook(ctx: PluginContext) {
  return {
    name: "my-hook",
    async postToolUse(params: {
      toolName: string;
      result: unknown;
      sessionId: string;
    }): Promise<{ inject?: string } | void> {
      // Hook logic
    },
  };
}
```

## Key Rules

1. **Memory-First** - Always check memory/state before action. Persist learnings after.
2. **Interactive UI** - Use `ui` helpers (Clack) for all user interaction. Never use raw `console.log`.
3. **Graceful degradation** - Never crash the plugin, return fallback results.
4. **Co-locate tests** - Test files next to implementation.
5. **Use test-utils** - Leverage shared mock factories.
6. **ESM imports** - Always use .js extension for local imports.
7. **Explicit types** - Avoid `any`, define interfaces in core/types.ts.
8. **Minimal comments** - Only document non-obvious logic.
9. **Atomic commits** - Keep changes focused and small.
