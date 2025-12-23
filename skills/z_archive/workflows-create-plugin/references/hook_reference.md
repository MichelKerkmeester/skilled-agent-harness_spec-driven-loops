# OpenCode Plugin Hook Reference

Complete API reference for all hooks with TypeScript signatures, input/output parameters, and usage examples.

**Prerequisites:** Follow plugin patterns for all implementations:
- **Direct Export**: Plugin must be async function returning hooks
- **Return Values**: Most hooks require returning modified parameters
- See [plugin_patterns.md](./plugin_patterns.md) for export patterns

---

## 1. 📖 CORE PRINCIPLE

**"Hooks receive input, mutate output parameters, and return confirmation."**

Most hooks follow the pattern: receive read-only input, modify mutable output object, return the modified output.

---

## 2. 🎯 HOOK OVERVIEW

| Hook | Purpose | Return Type | Required |
|------|---------|-------------|----------|
| `event` | React to lifecycle events | `void \| Promise<void>` | No return |
| `config` | Modify OpenCode configuration | `void` (mutates input) | No return |
| `tool` | Register custom tools | `{ [name]: ToolDef }` | Object literal |
| `auth` | Provide authentication | `AuthResult` | Yes |
| `chat.message` | Inject content into messages | `void` (mutates output) | No return |
| `chat.params` | Modify LLM parameters | `void` (mutates output) | No return |
| `permission.ask` | Handle permission requests | `void` (mutates output) | No return |
| `tool.execute.before` | Intercept before tool runs | `void` (mutates output) | No return |
| `tool.execute.after` | Intercept after tool runs | `void` (mutates output) | No return |

---

## 3. 🔄 EVENT HOOK

React to system events throughout the OpenCode session lifecycle.

### Signature

```typescript
event: async ({ event }: { event: Event }) => Promise<void>

interface Event {
  type: EventType;
  properties: Record<string, unknown>;
}

type EventType =
  | "session.created"
  | "session.idle"
  | "session.deleted"
  | "session.compacted"
  | "session.diff"
  | "session.error"
  | "session.status"
  | "session.updated"
  | "file.edited"
  | "file.watcher.updated"
  | "message.part.removed"
  | "message.part.updated"
  | "message.removed"
  | "message.updated"
  | "command.executed"
  | "installation.updated"
  | "lsp.client.diagnostics"
  | "lsp.updated"
  | "permission.replied"
  | "permission.updated"
  | "server.connected"
  | "todo.updated"
  | "tool.execute.after"
  | "tool.execute.before"
  | "tui.prompt.append"
  | "tui.command.execute"
  | "tui.toast.show";
```

### Input Parameters

| Property | Type | Description |
|----------|------|-------------|
| `event.type` | `EventType` | Event identifier |
| `event.properties` | `Record<string, unknown>` | Event-specific data |

### Common Event Properties

| Event Type | Properties | Description |
|------------|------------|-------------|
| `session.created` | `sessionID: string` | New session started |
| `session.idle` | `sessionID: string` | Session went idle |
| `session.deleted` | `info: { id: string }` | Session ended |
| `file.edited` | `path: string` | File was modified |
| `command.executed` | `command: string` | Bash command ran |

### Example

```typescript
event: async ({ event }) => {
  switch (event.type) {
    case "session.created":
      const sessionID = event.properties.sessionID as string;
      console.log(`[Plugin] Session started: ${sessionID}`);
      // Initialize session-specific state
      break;
      
    case "session.idle":
      // Good place for notifications
      await sendNotification("OpenCode session idle");
      break;
      
    case "session.deleted":
      const info = event.properties.info as { id: string };
      console.log(`[Plugin] Session ended: ${info.id}`);
      // Cleanup resources
      break;
      
    case "file.edited":
      const path = event.properties.path as string;
      if (path.endsWith(".env")) {
        console.warn("[Plugin] Warning: .env file was edited");
      }
      break;
  }
}
```

### Common Use Cases

- Session initialization and cleanup
- Logging and analytics
- External service notifications (Slack, Discord)
- Audit trails
- Desktop notifications on session.idle

**Validation**: `event_hook_implemented`

---

## 4. 💬 CHAT.MESSAGE HOOK

Inject content into chat messages sent to the LLM.

### Signature

```typescript
"chat.message": async (
  input: { sessionID: string; agent?: string; model?: string; messageID?: string },
  output: { message: UserMessage; parts: Part[] }
) => Promise<void>

type Part = 
  | { type: "text"; text: string }
  | { type: "image"; image: string; mimeType: string }
  | { type: "file"; file: string; mimeType: string };
```

### Input Parameters (Read-Only)

| Property | Type | Description |
|----------|------|-------------|
| `input.sessionID` | `string` | Current session ID |
| `input.agent` | `string?` | Agent being used |
| `input.model` | `string?` | Model being used |
| `input.messageID` | `string?` | Message ID |

### Output Parameters (Mutable)

| Property | Type | Description |
|----------|------|-------------|
| `output.message` | `UserMessage` | The user's message |
| `output.parts` | `Part[]` | Message parts to modify |

### Parts Manipulation

```typescript
// Prepend context to message
output.parts.unshift({
  type: "text",
  text: "CONTEXT: You are helping with a TypeScript project.\n\n"
});

// Append instructions
output.parts.push({
  type: "text",
  text: "\n\nRemember: Always include tests."
});

// Transform existing text parts
output.parts = output.parts.map(part => {
  if (part.type === "text") {
    return { ...part, text: part.text.toUpperCase() };
  }
  return part;
});
```

### Example

```typescript
// Module-scope state for one-time injection
let dashboardInjected = false;
let pendingDashboard: string | null = null;

"chat.message": async (input, output) => {
  // Inject dashboard on first message after session start
  if (pendingDashboard && !dashboardInjected) {
    output.parts.unshift({
      type: "text",
      text: pendingDashboard,
    });
    dashboardInjected = true;
    pendingDashboard = null;
  }
  
  // Add session duration to all messages
  const timestamp = sessionTimestamps.get(input.sessionID);
  if (timestamp) {
    const elapsed = Math.round((Date.now() - timestamp) / 1000);
    output.parts.push({
      type: "text",
      text: `\n[Session: ${elapsed}s]`
    });
  }
}
```

### Common Use Cases

- Inject project context
- Add system instructions
- Display memory/dashboard data
- Add timestamps or metadata
- Filter or transform content

**Validation**: `chat_message_hook_implemented`

---

## 5. 🔧 TOOL.EXECUTE.BEFORE HOOK

Intercept and modify tool arguments before execution.

### Signature

```typescript
"tool.execute.before": async (
  input: { tool: string; sessionID: string; callID: string },
  output: { args: Record<string, unknown> }
) => Promise<void>
```

### Input Parameters (Read-Only)

| Property | Type | Description |
|----------|------|-------------|
| `input.tool` | `string` | Tool name (e.g., "Bash", "Read") |
| `input.sessionID` | `string` | Session ID |
| `input.callID` | `string` | Unique call identifier |

### Output Parameters (Mutable)

| Property | Type | Description |
|----------|------|-------------|
| `output.args` | `Record<string, unknown>` | Tool arguments to modify |

### Example

```typescript
"tool.execute.before": async (input, output) => {
  // Log all tool executions
  console.log(`[Plugin] Executing: ${input.tool}`);
  
  // Block dangerous bash commands
  if (input.tool === "Bash") {
    const command = output.args.command as string;
    if (command.includes("rm -rf /") || command.includes("sudo rm")) {
      throw new Error("[Plugin] Blocked: Dangerous command detected");
    }
  }
  
  // Add default timeout to bash commands
  if (input.tool === "Bash" && !output.args.timeout) {
    output.args.timeout = 60000; // 60 seconds
  }
  
  // Prefix bash commands with environment setup
  if (input.tool === "Bash") {
    output.args.command = `source ~/.bashrc 2>/dev/null; ${output.args.command}`;
  }
}
```

### Common Use Cases

- Logging tool executions
- Blocking dangerous operations
- Adding default parameters
- Modifying file paths
- Environment variable injection

**Validation**: `tool_before_hook_implemented`

---

## 6. 🔧 TOOL.EXECUTE.AFTER HOOK

Intercept and modify tool output after execution.

### Signature

```typescript
"tool.execute.after": async (
  input: { tool: string; sessionID: string; callID: string },
  output: { title: string; output: string; metadata: Record<string, unknown> }
) => Promise<void>
```

### Input Parameters (Read-Only)

| Property | Type | Description |
|----------|------|-------------|
| `input.tool` | `string` | Tool name |
| `input.sessionID` | `string` | Session ID |
| `input.callID` | `string` | Unique call identifier |

### Output Parameters (Mutable)

| Property | Type | Description |
|----------|------|-------------|
| `output.title` | `string` | Tool result title |
| `output.output` | `string` | Tool output to modify |
| `output.metadata` | `Record<string, unknown>` | Additional metadata |

### Example

```typescript
"tool.execute.after": async (input, output) => {
  // Redact sensitive information
  output.output = output.output
    .replace(/api[_-]?key\s*[:=]\s*["']?[\w-]+["']?/gi, "API_KEY=[REDACTED]")
    .replace(/password\s*[:=]\s*["']?[^\s"']+["']?/gi, "password=[REDACTED]")
    .replace(/secret\s*[:=]\s*["']?[\w-]+["']?/gi, "secret=[REDACTED]");
  
  // Truncate extremely long outputs
  if (output.output.length > 50000) {
    output.output = output.output.slice(0, 50000) + "\n...[truncated by plugin]";
  }
  
  // Add timing metadata
  output.metadata = {
    ...output.metadata,
    processedAt: new Date().toISOString(),
    processedByPlugin: true,
  };
  
  // Modify title for specific tools
  if (input.tool === "Bash") {
    output.title = `[BASH] ${output.title}`;
  }
}
```

### Common Use Cases

- Redacting sensitive information
- Truncating large outputs
- Adding metadata
- Logging results
- Transforming output format

**Validation**: `tool_after_hook_implemented`

---

## 7. ⚙️ CONFIG HOOK

Modify OpenCode configuration at startup.

### Signature

```typescript
config: async (config: Config) => Promise<void>

interface Config {
  agent?: Record<string, AgentConfig>;
  mcp?: Record<string, McpConfig>;
}

interface AgentConfig {
  name: string;
  model: string;
  systemPrompt?: string;
}

interface McpConfig {
  type: "local" | "remote";
  command?: string[];
  url?: string;
  environment?: Record<string, string>;
}
```

### Example

```typescript
config: async (config) => {
  // Add custom agent
  config.agent = {
    ...config.agent,
    "code-reviewer": {
      name: "Code Reviewer",
      model: "anthropic/claude-sonnet-4-20250514",
      systemPrompt: `You are an expert code reviewer. Focus on:
- Code quality and readability
- Potential bugs and edge cases
- Performance considerations
- Security vulnerabilities`,
    },
    "documentation-writer": {
      name: "Documentation Writer",
      model: "anthropic/claude-sonnet-4-20250514",
      systemPrompt: "You specialize in writing clear, comprehensive documentation.",
    }
  };
  
  // Add MCP server
  config.mcp = {
    ...config.mcp,
    "my-database": {
      type: "local",
      command: ["node", "./mcp-server/db.js"],
      environment: {
        DATABASE_URL: process.env.DATABASE_URL || "",
      }
    }
  };
}
```

### Common Use Cases

- Adding custom agents
- Configuring MCP servers
- Environment-specific settings
- Dynamic configuration

**Validation**: `config_hook_implemented`

---

## 8. 🛠️ TOOL HOOK (CUSTOM TOOLS)

Define custom tools available to the LLM.

### Signature

```typescript
tool: {
  [toolName: string]: ToolDefinition
}

// Using the tool() helper
import { tool } from "@opencode-ai/plugin";

const myTool = tool({
  description: string,
  args: {
    [argName]: tool.schema.string() | tool.schema.number() | tool.schema.boolean() | ...
  },
  execute: async (args, ctx) => string
});
```

### Tool Schema Types

```typescript
// String
tool.schema.string().describe("Description")

// Number
tool.schema.number().describe("Description")

// Boolean
tool.schema.boolean().describe("Description")

// Optional
tool.schema.string().optional().describe("Optional field")

// Enum
tool.schema.enum(["option1", "option2"]).describe("Choose one")

// Array
tool.schema.array(tool.schema.string()).describe("List of strings")
```

### Execute Context

```typescript
interface ExecuteContext {
  sessionID: string;
  messageID: string;
  agent: string;
  abort: AbortSignal;
}
```

### Example

```typescript
import { tool } from "@opencode-ai/plugin";

tool: {
  greet_user: tool({
    description: "Greets a user by name",
    args: {
      name: tool.schema.string().describe("Name to greet"),
      formal: tool.schema.boolean().optional().describe("Use formal greeting"),
    },
    async execute({ name, formal }, ctx) {
      const greeting = formal 
        ? `Good day, ${name}.` 
        : `Hey ${name}!`;
      return greeting;
    },
  }),
  
  fetch_url: tool({
    description: "Fetches content from a URL",
    args: {
      url: tool.schema.string().describe("URL to fetch"),
      format: tool.schema.enum(["text", "json"]).describe("Response format"),
    },
    async execute({ url, format }, ctx) {
      const response = await fetch(url);
      if (format === "json") {
        return JSON.stringify(await response.json(), null, 2);
      }
      return await response.text();
    },
  }),
}
```

### Common Use Cases

- External API integrations
- Database queries
- File operations beyond built-in tools
- Custom calculations
- Third-party service access

**Validation**: `custom_tools_implemented`

---

## 9. 🧪 EXPERIMENTAL HOOKS

These hooks are experimental and may change in future versions.

### experimental.chat.messages.transform

Transform the entire message history before sending to LLM.

```typescript
"experimental.chat.messages.transform": async (
  input: { messages: Message[] },
  output: { messages: Message[] }
) => Promise<void>
```

### experimental.chat.system.transform

Transform the system prompt.

```typescript
"experimental.chat.system.transform": async (
  input: { system: string },
  output: { system: string }
) => Promise<void>
```

### experimental.session.compacting

Called when session context is being compacted.

```typescript
"experimental.session.compacting": async (
  input: { sessionID: string },
  output: { context: string[] }
) => Promise<void>
```

### Example

```typescript
"experimental.chat.system.transform": async (input, output) => {
  output.system = input.system + "\n\nAdditional instruction: Always be concise.";
},

"experimental.session.compacting": async (input, output) => {
  // Add context that should persist across compaction
  output.context.push(`## Plugin State
- Session has been active for extended period
- Important decisions made: [list from plugin state]
- Files being actively worked on: [list from plugin state]`);
}
```

---

## 10. 📋 HOOK EXECUTION ORDER

```
1. session.created (event)
2. config (once at startup)
3. auth (when authentication needed)
4. chat.message (before each user message)
5. chat.params (before LLM call)
6. experimental.chat.system.transform
7. experimental.chat.messages.transform
8. permission.ask (when tool needs permission)
9. tool.execute.before (before each tool)
10. tool.execute.after (after each tool)
11. experimental.session.compacting (when context grows large)
12. session.deleted (event)
```

---

## 11. ⚠️ ERROR HANDLING

All hooks should handle errors gracefully:

```typescript
"tool.execute.before": async (input, output) => {
  try {
    // Your logic here
    if (shouldBlock(input)) {
      throw new Error("Operation blocked by plugin");
    }
  } catch (error) {
    // Log error but don't break the flow unless intentional
    console.error("[Plugin] Error:", error);
    // Re-throw if you want to block the operation
    throw error;
  }
}
```

**Note**: Throwing an error in a hook may prevent the operation from completing. Only throw if you intentionally want to block the operation.

---

## 12. 🔗 RELATED RESOURCES

- [plugin_patterns.md](./plugin_patterns.md) - Export and state patterns
- [debugging_guide.md](./debugging_guide.md) - Troubleshooting workflows
- [plugin_template.ts](../assets/plugin_template.ts) - Starter template with all hooks
