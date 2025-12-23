---
name: workflows-create-plugin
description: "OpenCode plugin development specialist providing plugin architecture guidance, hook implementation patterns, build configuration, and debugging workflows for creating JavaScript/TypeScript plugins that extend OpenCode functionality via event hooks, custom tools, and lifecycle management."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0
---

# OpenCode Plugin Development

## 1. 🎯 WHEN TO USE

### Activation Triggers

- User wants to create a new OpenCode plugin
- User needs to extend OpenCode functionality with custom hooks
- User is debugging plugin loading errors (especially "fn3 is not a function")
- User asks about OpenCode plugin architecture or hook system
- User wants to add custom tools to OpenCode
- User is configuring plugin build pipeline (tsup, TypeScript)
- User encounters plugin initialization or lifecycle issues
- User wants to publish a plugin to npm
- User needs to manage npm package versions or updates

### Use Cases

| Scenario                        | This Skill Handles                        |
| ------------------------------- | ----------------------------------------- |
| "Create an OpenCode plugin"     | Full plugin scaffolding and configuration |
| "Add a custom tool to OpenCode" | Tool hook implementation                  |
| "Plugin won't load"             | Debugging factory pattern mistakes        |
| "Hook not firing"               | Hook registration and event debugging     |
| "Build configuration"           | tsup, TypeScript, package.json setup      |
| "Transform chat messages"       | Experimental hook patterns                |
| "Publish plugin to npm"         | npm publishing workflow and commands      |
| "Update npm package"            | Version management and republishing       |

---

## 2. 🧭 SMART ROUTING

### Activation Detection

```
START
  │
  ├─► User mentions "plugin" + "OpenCode"? ──► ACTIVATE
  │
  ├─► User asks about hooks/events? ──► ACTIVATE
  │
  ├─► Error contains "fn3 is not a function"? ──► ACTIVATE (Factory Pattern Fix)
  │
  ├─► User configuring @opencode-ai/plugin? ──► ACTIVATE
  │
  ├─► User wants custom tools in OpenCode? ──► ACTIVATE
  │
  ├─► User wants to publish plugin to npm? ──► ACTIVATE (NPM Publishing)
  │
  ├─► User managing npm versions/packages? ──► ACTIVATE (NPM Management)
  │
  └─► Otherwise ──► SKIP
```

### Resource Router

```
IF task == "new plugin":
    LOAD assets/plugin_template.ts
    LOAD assets/package_template.json
    LOAD assets/tsconfig_template.json

ELIF task == "debugging":
    LOAD references/debugging_guide.md
    CHECK for factory pattern mistake

ELIF task == "specific hook":
    LOAD references/hook_reference.md
    FIND relevant hook section

ELIF task == "patterns/examples":
    LOAD references/plugin_patterns.md

ELIF task == "npm publishing":
    USE Section 7 (NPM Publishing)
    GUIDE through publish workflow
    
ELIF task == "version management":
    USE npm version commands
    APPLY semantic versioning
```

---

## 3. 🛠️ HOW IT WORKS

### The #1 Mistake: Factory Pattern

**CRITICAL**: OpenCode plugins must be direct async functions returning hooks, NOT factories that return plugins.

#### WRONG (Factory Pattern)
```typescript
// This causes "fn3 is not a function" error
const createPlugin = (options: Options) => {
  const plugin: Plugin = async (ctx) => {
    return { /* hooks */ };
  };
  return plugin;
};
export default createPlugin;
```

#### CORRECT (Direct Plugin)
```typescript
import type { Plugin } from "@opencode-ai/plugin";

const MyPlugin: Plugin = async (ctx) => {
  return {
    event: async ({ event }) => {
      console.log("Event:", event.type);
    },
  };
};

export default MyPlugin;
```

### Plugin Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    OpenCode Runtime                     │
├─────────────────────────────────────────────────────────┤
│  Plugin Loader                                          │
│    │                                                    │
│    ├─► Imports default export                           │
│    ├─► Expects: async (ctx) => HooksObject              │
│    ├─► Calls plugin function with context               │
│    └─► Registers returned hooks                         │
├─────────────────────────────────────────────────────────┤
│  Hook System                                            │
│    │                                                    │
│    ├─► Lifecycle Hooks (event, config, auth)            │
│    ├─► Chat Hooks (chat.message, chat.params)           │
│    ├─► Tool Hooks (tool, tool.execute.*)                │
│    └─► Experimental Hooks (transform, compact)          │
└─────────────────────────────────────────────────────────┘
```

### Correct Plugin Structure

```typescript
import type { Plugin } from "@opencode-ai/plugin";

const MyPlugin: Plugin = async (ctx) => {
  // ctx provides access to OpenCode internals
  // Initialize any plugin state here
  
  return {
    // Lifecycle events
    event: async ({ event }) => {
      if (event.type === "session.created") {
        console.log("New session:", event.properties.sessionID);
      }
    },
    
    // Chat message interception
    "chat.message": async (input, output) => {
      // Modify or observe chat messages
    },
    
    // Custom tools
    tool: [
      // Array of custom tool definitions
    ],
  };
};

export default MyPlugin;
```

### Available Hooks

| Hook                              | Purpose                       | Signature                                      |
| --------------------------------- | ----------------------------- | ---------------------------------------------- |
| `event`                           | React to lifecycle events     | `async ({ event }) => void`                    |
| `config`                          | Modify OpenCode configuration | `async (config) => void` (mutates input)       |
| `tool`                            | Register custom tools         | `{ [name]: ToolDef }`                          |
| `auth`                            | Custom authentication         | `async (provider) => AuthResult`               |
| `chat.message`                    | Intercept chat messages       | `async (input, output) => void`                |
| `chat.params`                     | Modify LLM parameters         | `async (input, output) => void`                |
| `permission.ask`                  | Custom permission prompts     | `async (input, output) => void`                |
| `tool.execute.before`             | Pre-tool execution            | `async (input, output) => void`                |
| `tool.execute.after`              | Post-tool execution           | `async (input, output) => void`                |
| `experimental.session.compacting` | Session compacting logic      | `async (input, output) => void`                |

### Event Types

Plugins can subscribe to 27+ system events via the `event` hook:

```typescript
type EventType =
  // Session lifecycle
  | "session.created"
  | "session.idle"
  | "session.deleted"
  | "session.compacted"
  | "session.diff"
  | "session.error"
  | "session.status"
  | "session.updated"
  // File operations
  | "file.edited"
  | "file.watcher.updated"
  // Messages
  | "message.part.removed"
  | "message.part.updated"
  | "message.removed"
  | "message.updated"
  // Commands
  | "command.executed"
  // Installation
  | "installation.updated"
  // LSP
  | "lsp.client.diagnostics"
  | "lsp.updated"
  // Permissions
  | "permission.replied"
  | "permission.updated"
  // Server
  | "server.connected"
  // Todos
  | "todo.updated"
  // Tools (also available as separate hooks)
  | "tool.execute.before"
  | "tool.execute.after"
  // TUI
  | "tui.prompt.append"
  | "tui.command.execute"
  | "tui.toast.show";
```

### Event Categories Quick Reference

| Category         | Events                                                              | Use Cases                        |
| ---------------- | ------------------------------------------------------------------- | -------------------------------- |
| **command**      | `command.executed`                                                  | Track command history            |
| **file**         | `file.edited`, `file.watcher.updated`                               | File validation, auto-formatting |
| **installation** | `installation.updated`                                              | Dependency tracking              |
| **lsp**          | `lsp.client.diagnostics`, `lsp.updated`                             | Custom error handling            |
| **message**      | `message.*.updated/removed`                                         | Message filtering, logging       |
| **permission**   | `permission.replied/updated`                                        | Permission policies              |
| **server**       | `server.connected`                                                  | Connection monitoring            |
| **session**      | `session.created/deleted/error/idle/status/updated/compacted/diff`  | Session management               |
| **todo**         | `todo.updated`                                                      | Todo synchronization             |
| **tool**         | `tool.execute.before/after`                                         | Tool interception                |
| **tui**          | `tui.prompt.append`, `tui.command.execute`, `tui.toast.show`        | UI customization                 |

### Custom Tools Pattern

```typescript
import { type Plugin, tool } from "@opencode-ai/plugin";

const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      my_custom_tool: tool({
        description: "Does something useful",
        args: {
          input: tool.schema.string().describe("The input value"),
          count: tool.schema.number().optional().describe("Optional count"),
        },
        async execute({ input, count = 10 }, ctx) {
          // ctx: { sessionID, messageID, agent, abort }
          return `Processed: ${input} (count: ${count})`;
        },
      }),
    },
  };
};

export default MyPlugin;
```

### Installation Locations

| Location    | Path                         | Scope        | Use Case                       |
| ----------- | ---------------------------- | ------------ | ------------------------------ |
| **Global**  | `~/.config/opencode/plugin/` | All projects | Security policies, global utils|
| **Project** | `.opencode/plugin/`          | Current only | Project-specific hooks         |

### Build Configuration

#### package.json Requirements

```json
{
  "name": "my-opencode-plugin",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup src/index.ts --format esm --dts --watch"
  },
  "optionalDependencies": {
    "@opencode-ai/plugin": "^0.1.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

**Key Points**:
- `type: "module"` - Required for ESM
- `exports.default` - NOT `exports.import` (common mistake)
- `@opencode-ai/plugin` in `optionalDependencies` - Allows plugin to work even if types unavailable

#### tsconfig.json Requirements

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Plugin Development Workflow

```
1. Scaffold
   └─► Create project structure with templates

2. Implement
   └─► Write plugin as direct async function
   └─► Add hooks for desired functionality
   └─► Register custom tools if needed

3. Build
   └─► Run tsup to compile TypeScript
   └─► Verify dist/index.js exports correctly

4. Test
   └─► Use verification script
   └─► Load in OpenCode and check logs

5. Debug
   └─► Check for factory pattern if errors
   └─► Verify hook signatures match expected
```

### Claude Code Hook Migration

When porting Claude Code hooks to OpenCode plugins, use these mappings:

| Claude Hook        | OpenCode Event/Hook      | Description                    |
| ------------------ | ------------------------ | ------------------------------ |
| `PreToolUse`       | `tool.execute.before`    | Run before tool, can block     |
| `PostToolUse`      | `tool.execute.after`     | Run after tool execution       |
| `UserPromptSubmit` | `chat.message`           | Process user prompts           |
| `SessionEnd`       | `session.idle` (event)   | Session completion             |

**Example: Claude-like Hook Behavior**

```typescript
export const CompatiblePlugin: Plugin = async (context) => {
  return {
    // Equivalent to Claude's PreToolUse hook
    "tool.execute.before": async (input, output) => {
      if (shouldBlock(input)) {
        throw new Error("Blocked by policy");
      }
    },

    // Equivalent to Claude's PostToolUse hook
    "tool.execute.after": async (input, output) => {
      console.log(`Tool completed: ${input.tool}`);
    },

    // Equivalent to Claude's SessionEnd hook
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await cleanup();
      }
    }
  };
};
```

**Note**: OpenCode plugins cannot be directly converted from Claude Code hooks due to different event models (Claude has 4 hooks, OpenCode has 27+ events), formats (Claude uses scripts, OpenCode uses JS/TS modules), and execution context.

### Plugin Composition

Combine multiple plugins using [opencode-plugin-compose](https://github.com/ericc-ch/opencode-plugins):

```typescript
import { compose } from "opencode-plugin-compose";

const composedPlugin = compose([
  envProtectionPlugin,
  notifyPlugin,
  customToolsPlugin
]);
// Runs all hooks in sequence
```

---

## 4. 📖 RULES

### ✅ ALWAYS

- Export plugin as default export of async function
- Return hooks object directly from the async function
- Use `optionalDependencies` for `@opencode-ai/plugin`
- Use `exports.default` in package.json (not `exports.import`)
- Set `type: "module"` in package.json
- Use ESNext for target and module in tsconfig
- Use bundler moduleResolution
- Build with tsup using ESM format
- Test plugin loading with verification script before deployment

### ❌ NEVER

- Use factory pattern (function that returns a plugin function)
- Use `exports.import` instead of `exports.default`
- Forget `type: "module"` in package.json
- Use CommonJS module format
- Skip the build step before testing
- Ignore "fn3 is not a function" errors (always indicates factory pattern)

### ⚠️ ESCALATE IF

- Plugin requires access to OpenCode internals not exposed via context
- Hook behavior differs from documentation
- Build succeeds but plugin still won't load
- Need to modify OpenCode core functionality
- Experimental hooks cause unexpected behavior

---

## 5. 🎓 SUCCESS CRITERIA

### Plugin Creation Checklist

- [ ] Plugin exports direct async function (not factory)
- [ ] Hooks object returned from async function
- [ ] package.json has `type: "module"`
- [ ] package.json uses `exports.default`
- [ ] @opencode-ai/plugin in optionalDependencies
- [ ] tsconfig uses ESNext target/module
- [ ] tsconfig uses bundler moduleResolution
- [ ] Build completes without errors
- [ ] dist/index.js contains valid ESM export
- [ ] Verification script confirms plugin loads
- [ ] Plugin loads in OpenCode without errors
- [ ] Hooks fire as expected

### Verification Script

```javascript
// verify-plugin.mjs
import plugin from "./dist/index.js";

const mockCtx = { /* mock context */ };

async function verify() {
  try {
    const hooks = await plugin(mockCtx);
    console.log("Plugin loaded successfully");
    console.log("Available hooks:", Object.keys(hooks));
  } catch (error) {
    console.error("Plugin failed to load:", error.message);
    if (error.message.includes("is not a function")) {
      console.error("HINT: Check for factory pattern - plugin must be direct async function");
    }
  }
}

verify();
```

---

## 6. 🔗 INTEGRATION POINTS

### Related Skills

| Skill                    | When to Use                     |
| ------------------------ | ------------------------------- |
| `typescript-development` | TypeScript configuration issues |
| `npm-package-management` | Publishing plugin to npm        |
| `debugging-workflows`    | Complex debugging scenarios     |

### Tools Used

- **tsup**: Build TypeScript to ESM
- **zod**: Schema validation for custom tools
- **node**: Runtime for verification scripts

### Reference Files

| File                            | Purpose                      |
| ------------------------------- | ---------------------------- |
| `references/plugin_patterns.md` | Common patterns and examples |
| `references/hook_reference.md`  | Complete hook API reference  |
| `references/debugging_guide.md` | Error resolution workflows   |
| `assets/plugin_template.ts`     | Starter plugin template      |
| `assets/package_template.json`  | package.json template        |
| `assets/tsconfig_template.json` | tsconfig.json template       |

### Quick Debug Reference

| Error                   | Cause                  | Fix                              |
| ----------------------- | ---------------------- | -------------------------------- |
| "fn3 is not a function" | Factory pattern        | Convert to direct async function |
| "Cannot use import"     | Missing `type: module` | Add to package.json              |
| "Module not found"      | Wrong exports config   | Use `exports.default`            |
| Hook not firing         | Wrong hook signature   | Check hook reference             |
| Types missing           | optionalDependencies   | Install @opencode-ai/plugin      |

---

## 7. 📦 NPM PUBLISHING

### Publishing Workflow

```
1. BUILD      → npm run build
2. VERIFY     → npm run verify
3. PREVIEW    → npm pack --dry-run
4. AUTH       → npm login / npm whoami
5. PUBLISH    → npm publish (or --access public for scoped)
6. CONFIRM    → npm info <package-name>
```

### Required package.json Fields

| Field | Required | Purpose |
|-------|----------|---------|
| `name` | Yes | Package identifier |
| `version` | Yes | Semantic version (X.Y.Z) |
| `description` | Yes | npm search description |
| `type` | Yes | Must be `"module"` |
| `main` | Yes | Entry point (`dist/index.js`) |
| `exports.default` | Yes | Modern ESM entry |
| `files` | Recommended | Files to publish |
| `keywords` | Recommended | Include `opencode`, `plugin` |

### Version Commands

```bash
npm version patch   # 1.0.0 → 1.0.1 (bug fixes)
npm version minor   # 1.0.0 → 1.1.0 (new features)
npm version major   # 1.0.0 → 2.0.0 (breaking changes)
```

### Publishing Commands

| Command | Use Case |
|---------|----------|
| `npm pack --dry-run` | Preview what will be published |
| `npm publish` | Publish unscoped package |
| `npm publish --access public` | Publish scoped package (@user/pkg) |
| `npm publish --tag beta` | Publish as beta (not latest) |

### Managing Packages

```bash
# View package info
npm info <package-name>

# Deprecate version (warns users)
npm deprecate <pkg>@<version> "message"

# Unpublish (within 72 hours only)
npm unpublish <pkg>@<version>
```

### Publishing Troubleshooting

| Error | Solution |
|-------|----------|
| 403 Forbidden | Run `npm login` |
| 402 Payment Required | Use `--access public` |
| EPUBLISHCONFLICT | Increment version first |
| prepublishOnly fails | Fix build errors |

### Best Practices

- Use `prepublishOnly` script for auto-build
- Preview with `npm pack --dry-run` before publishing
- Include `README.md` in `files` array
- Test locally with `npm pack` + install from tarball
- Use semantic versioning consistently
