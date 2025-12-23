# OpenCode Plugin Patterns

Deep-dive reference for plugin implementation patterns with explicit reasoning, before/after examples, and validation checkpoints.

**Prerequisites:** Follow plugin architecture standards for all implementations:
- **Direct Export Pattern**: Plugin must export async function directly (not factory)
- **Module-Scope State**: State variables defined at module level
- See [hook_reference.md](./hook_reference.md) for hook API details

---

## 1. 📖 CORE PRINCIPLE

**"Export the plugin function directly - never wrap it in a factory."**

OpenCode calls `defaultExport(ctx)` and expects a hooks object back immediately. Factory patterns break this contract.

---

## 2. 🎯 THE 3 EXPORT PATTERNS

You MUST use one of these patterns. Pattern 1 is recommended for most plugins.

### Pattern 1: Direct Plugin Export (Recommended)

**Purpose**: Simplest, most reliable pattern for most plugins.

❌ **BEFORE**: Factory pattern that breaks plugins
```typescript
// BROKEN: Factory returns a function, not hooks
export const createPlugin = (options = {}) => {
  return async (ctx) => {
    return { event: async () => {} };
  };
};
export default createPlugin;
// → OpenCode calls createPlugin(ctx)
// → Gets back a function, not hooks
// → Error: "fn3 is not a function"
```

✅ **AFTER**: Direct export that works
```typescript
import type { Plugin } from "@opencode-ai/plugin";

export const MyPlugin: Plugin = async ({ directory, client, project }) => {
  console.log(`Plugin loaded for: ${directory}`);
  
  return {
    event: async ({ event }) => {
      if (event.type === "session.created") {
        console.log("Session started");
      }
    },
  };
};

export default MyPlugin;
// → OpenCode calls MyPlugin(ctx)
// → Gets back hooks object immediately
// → Works correctly
```

**Why better**: Direct async function returns hooks immediately. No intermediate step that confuses OpenCode's plugin loader.

**Validation**: `direct_export_verified`

### Pattern 2: With Module-Scope Configuration

**Purpose**: Configuration without factory pattern.

❌ **BEFORE**: Factory for configuration (broken)
```typescript
// BROKEN: Using factory to pass options
export const notification = (options: Options) => {
  const plugin: Plugin = async (ctx) => {
    return {
      event: async ({ event }) => {
        if (event.type === "session.idle") {
          await notify(options.message);
        }
      }
    };
  };
  return plugin;
};
export default notification;
```

✅ **AFTER**: Module-scope config (correct)
```typescript
import type { Plugin } from "@opencode-ai/plugin";

// Configuration at module scope - NOT via factory
interface PluginConfig {
  enabled: boolean;
  timeout: number;
  message: string;
}

function loadConfig(): PluginConfig {
  return {
    enabled: process.env.PLUGIN_ENABLED !== "false",
    timeout: parseInt(process.env.PLUGIN_TIMEOUT || "5000"),
    message: process.env.PLUGIN_MESSAGE || "Session idle",
  };
}

const config = loadConfig();

export const ConfiguredPlugin: Plugin = async (ctx) => {
  if (!config.enabled) {
    return {}; // Return empty hooks if disabled
  }
  
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await notify(config.message);
      }
    }
  };
};

export default ConfiguredPlugin;
```

**Why better**: Configuration loaded at module initialization. Plugin still exports direct function. Environment variables or config files replace factory options.

**Validation**: `module_config_verified`

### Pattern 3: Named Export with Default

**Purpose**: Multiple plugins from one file or explicit naming.

```typescript
import type { Plugin } from "@opencode-ai/plugin";

// Named export for direct access
export const LoggingPlugin: Plugin = async (ctx) => {
  return {
    event: async ({ event }) => {
      console.log(`[LOG] ${event.type}`);
    }
  };
};

// Another named export
export const MetricsPlugin: Plugin = async (ctx) => {
  return {
    "tool.execute.after": async (input, output) => {
      console.log(`[METRIC] Tool: ${input.tool}`);
    }
  };
};

// Default export for standard loading
export default LoggingPlugin;
```

**Validation**: `named_exports_verified`

---

## 3. 🛠️ STATE MANAGEMENT PATTERNS

### Module-Scope State (Recommended)

**Purpose**: Persistent state across hook invocations.

```typescript
import type { Plugin } from "@opencode-ai/plugin";

// Module-scope state - persists for plugin lifetime
let sessionCount = 0;
const sessionTimestamps = new Map<string, number>();
const toolExecutions: string[] = [];

export const StatefulPlugin: Plugin = async ({ directory }) => {
  // Reset on plugin load (new OpenCode session)
  sessionCount = 0;
  sessionTimestamps.clear();
  toolExecutions.length = 0;
  
  return {
    event: async ({ event }) => {
      if (event.type === "session.created") {
        sessionCount++;
        const sessionID = event.properties.sessionID as string;
        sessionTimestamps.set(sessionID, Date.now());
      }
      
      if (event.type === "session.deleted") {
        const sessionID = event.properties.info?.id as string;
        const duration = Date.now() - (sessionTimestamps.get(sessionID) || 0);
        console.log(`Session #${sessionCount} lasted ${duration}ms`);
        console.log(`Tools executed: ${toolExecutions.length}`);
      }
    },
    
    "tool.execute.before": async (input, output) => {
      toolExecutions.push(input.tool);
    }
  };
};

export default StatefulPlugin;
```

**Validation**: `module_state_verified`

---

## 4. 🔄 EVENT HANDLING PATTERNS

### Comprehensive Event Handler

**Purpose**: React to all lifecycle events.

```typescript
event: async ({ event }) => {
  switch (event.type) {
    case "session.created":
      const sessionID = event.properties.sessionID as string;
      console.log(`Session started: ${sessionID}`);
      break;
      
    case "session.idle":
      console.log("Session went idle");
      // Good place for notifications
      break;
      
    case "session.deleted":
      console.log("Session ended");
      // Cleanup resources
      break;
      
    case "file.edited":
      const path = event.properties.path as string;
      console.log(`File edited: ${path}`);
      break;
      
    default:
      // Log unknown events for debugging
      console.log(`Unknown event: ${event.type}`);
  }
}
```

**Validation**: `event_handler_complete`

---

## 5. 🔧 CUSTOM TOOL PATTERNS

### Tool with Zod Schema

**Purpose**: Add custom tools with validated parameters.

```typescript
import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

export const ToolPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      greet_user: tool({
        description: "Greets a user by name with optional formality",
        args: {
          name: tool.schema.string().describe("Name to greet"),
          formal: tool.schema.boolean().optional().describe("Use formal greeting"),
        },
        async execute({ name, formal }, ctx) {
          const greeting = formal ? `Good day, ${name}.` : `Hey ${name}!`;
          return greeting;
        },
      }),
      
      calculate: tool({
        description: "Performs basic arithmetic",
        args: {
          a: tool.schema.number().describe("First number"),
          b: tool.schema.number().describe("Second number"),
          op: tool.schema.enum(["add", "sub", "mul", "div"]).describe("Operation"),
        },
        async execute({ a, b, op }) {
          switch (op) {
            case "add": return String(a + b);
            case "sub": return String(a - b);
            case "mul": return String(a * b);
            case "div": return b !== 0 ? String(a / b) : "Error: Division by zero";
          }
        },
      }),
    }
  };
};

export default ToolPlugin;
```

**Validation**: `custom_tools_verified`

---

## 6. 💬 CHAT MESSAGE INJECTION PATTERNS

### Inject Context on First Message

**Purpose**: Add context to user's first message.

```typescript
// Module-scope tracking
let injected = false;
let contextToInject: string | null = null;

export const ContextPlugin: Plugin = async ({ directory }) => {
  // Reset on plugin load
  injected = false;
  contextToInject = null;
  
  return {
    event: async ({ event }) => {
      if (event.type === "session.created") {
        injected = false;
        contextToInject = `Project directory: ${directory}`;
      }
    },
    
    "chat.message": async (input, output) => {
      if (contextToInject && !injected) {
        output.parts.unshift({
          type: "text",
          text: contextToInject,
        });
        injected = true;
        contextToInject = null;
      }
    },
  };
};
```

**Validation**: `context_injection_verified`

---

## 7. 🔀 TOOL INTERCEPTION PATTERNS

### Before Hook - Modify Arguments

**Purpose**: Transform or block tool execution.

❌ **BEFORE**: No interception
```typescript
// Tool executes with original args
// No logging, no modification
```

✅ **AFTER**: Intercept and modify
```typescript
"tool.execute.before": async (input, output) => {
  // Log all tool executions
  console.log(`[INTERCEPT] Tool: ${input.tool}, Session: ${input.sessionID}`);
  
  // Block dangerous bash commands
  if (input.tool === "Bash") {
    const cmd = output.args.command as string;
    if (cmd.includes("rm -rf /")) {
      throw new Error("Blocked: Dangerous command detected");
    }
  }
  
  // Add timeout to all bash commands
  if (input.tool === "Bash" && !output.args.timeout) {
    output.args.timeout = 30000; // 30 seconds
  }
  
  // Mutate output.args - it's the mutable parameter
}
```

**Why better**: Provides security layer, logging, and default modifications.

### After Hook - Modify Output

**Purpose**: Transform, redact, or enhance tool output.

```typescript
"tool.execute.after": async (input, output) => {
  // Redact sensitive information
  if (typeof output.output === "string") {
    output.output = output.output
      .replace(/api[_-]?key\s*[:=]\s*["']?[\w-]+["']?/gi, "API_KEY=[REDACTED]")
      .replace(/password\s*[:=]\s*["']?[^\s"']+["']?/gi, "password=[REDACTED]");
  }
  
  // Truncate extremely long outputs
  if (typeof output.output === "string" && output.output.length > 50000) {
    output.output = output.output.slice(0, 50000) + "\n...[truncated]";
  }
  
  // Add metadata
  output.metadata = {
    ...output.metadata,
    processedByPlugin: true,
    timestamp: Date.now(),
  };
}
```

**Validation**: `tool_interception_verified`

---

## 8. ⚙️ CONFIG HOOK PATTERN

### Add Agents and MCP Servers

**Purpose**: Extend OpenCode configuration programmatically.

```typescript
config: async (config) => {
  // Add custom agent
  config.agent = {
    ...config.agent,
    "code-reviewer": {
      name: "Code Reviewer",
      model: "anthropic/claude-sonnet-4-20250514",
      systemPrompt: "You are an expert code reviewer...",
    }
  };
  
  // Add MCP server
  config.mcp = {
    ...config.mcp,
    "my-database": {
      type: "local",
      command: ["node", "./mcp-db-server.js"],
      environment: {
        DB_URL: process.env.DATABASE_URL || "",
      }
    }
  };
}
```

**Validation**: `config_modification_verified`

---

## 9. ❌ ANTI-PATTERNS TO AVOID

### Common Mistakes Comparison Table

| Scenario | Wrong Way | Right Way | Why Better |
|----------|-----------|-----------|------------|
| Export pattern | `export default createPlugin()` | `export default MyPlugin` | Direct export, no factory |
| Configuration | Factory function with options | Module-scope config object | No wrapper function |
| State | Inside async function | Module scope | Persists across calls |
| Hook return | Forgetting return | Always return modified params | Hooks need return values |
| Hook names | `onEvent`, `beforeTool` | `event`, `tool.execute.before` | Exact names required |

---

## 10. 📋 QUICK REFERENCE

| Pattern | Use Case | Key Point |
|---------|----------|-----------|
| Direct Export | Most plugins | No factory wrapper |
| Module Config | Environment settings | Load before plugin def |
| Named Export | Multiple plugins | Default export required |
| Module State | Counters, caches | Reset in plugin init |
| Tool Interception | Modify/block tools | Before modifies args, after modifies output |
| Custom Tools | New capabilities | Use tool() helper with schema |

---

## 11. 🔗 RELATED RESOURCES

- [hook_reference.md](./hook_reference.md) - Complete hook API documentation
- [debugging_guide.md](./debugging_guide.md) - Troubleshooting workflows
- [plugin_template.ts](../assets/plugin_template.ts) - Starter template
