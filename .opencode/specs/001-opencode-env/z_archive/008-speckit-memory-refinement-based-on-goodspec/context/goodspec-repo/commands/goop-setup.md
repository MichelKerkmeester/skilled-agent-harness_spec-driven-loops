---
name: goop-setup
description: GoopSpec setup wizard - first-time init, configuration, and verification
---

# GoopSpec Setup Wizard

You are helping the user set up or modify their GoopSpec configuration. This wizard handles first-time setup, modifications, and verification.

## Available Actions

| Action | Purpose | When to Use |
|--------|---------|-------------|
| `init` | Full first-time initialization | New projects, creates all directories and files |
| `detect` | Show current environment | Understand what's already configured |
| `plan` | Preview changes | Before applying, see what will change |
| `apply` | Write configuration | Apply configuration changes |
| `verify` | Check setup health | Ensure everything is working |
| `reset` | Reset to defaults | Start over or fix broken config |
| `models` | Show model suggestions | Help choosing agent models |
| `status` | Show current config | Quick overview of current state |

## First-Time Setup Flow

For users who haven't set up GoopSpec yet, use the `init` action.

### Step 1: Detect Current State

```
goop_setup(action: "detect")
```

Review what's already configured. If nothing exists, proceed to full init.

### Step 2: Ask for Project Name

Ask the user: "What's your project name?"

This will be stored in the configuration for context.

### Step 3: Configuration Scope

Ask: "Where should GoopSpec be configured?"

Use the question tool:
- **both** (Recommended) - Both global and project-specific settings
- **global** - Only system-wide settings
- **project** - Only this project

### Step 4: MCP Preset

Ask: "Which MCPs should be installed?"

- **recommended** - Context7 + Exa + Playwright (full workflow support)
- **core** - Context7 + Exa only (minimal)
- **none** - Skip MCP installation

### Step 5: Memory System

Ask: "Would you like to enable the memory system?"

The memory system allows GoopSpec to remember decisions, patterns, and context across sessions.

If yes, ask about embedding provider:
- **local** (Recommended) - Uses local embeddings, no API needed
- **openai** - Uses OpenAI embeddings (requires API key)
- **ollama** - Uses local Ollama server

### Step 6: Model Configuration

Ask: "Would you like to configure models for each agent?"

- **Quick setup** - Use recommended defaults
- **Custom setup** - Choose models individually

For custom setup, walk through each agent or accept shortcuts like "use Claude Sonnet for everything".

### Step 7: Apply Init

Execute the initialization:

```
goop_setup(
  action: "init",
  scope: "<scope>",
  projectName: "<name>",
  mcpPreset: "<preset>",
  memoryEnabled: true,
  memoryProvider: "local",
  agentModels: { ... }
)
```

### Step 8: Verify Setup

After init completes, verify everything is working:

```
goop_setup(action: "verify")
```

Report any issues and suggest fixes.

## Modifying Existing Setup

For users who already have GoopSpec configured:

### Check Current Status

```
goop_setup(action: "status")
```

Shows what's currently configured.

### Update Configuration

```
goop_setup(
  action: "apply",
  scope: "project",
  // Only include what you want to change
  memoryEnabled: true,
  agentModels: {
    "goop-executor": "anthropic/claude-sonnet-4-5"
  }
)
```

### Reset Configuration

If something is broken:

```
goop_setup(
  action: "reset",
  scope: "project",
  preserveData: true,  // Keep memories, history, checkpoints
  confirmed: true
)
```

## Agent Model Options

### goop-debugger
*Systematic debugging with hypothesis testing*
1. openai/gpt-5.2-codex
2. anthropic/claude-opus-4-5
3. opencode/kimi-k2.5-free

### goop-designer
*Visual design planning and UI/UX reasoning*
1. anthropic/claude-opus-4-5
2. opencode/kimi-k2.5-free
3. google/antigravity-gemini-3-pro-high

### goop-executor
*Task execution with checkpoints and verification*
1. openai/gpt-5.2-codex
2. anthropic/claude-opus-4-5
3. anthropic/claude-sonnet-4-5
4. opencode/kimi-k2.5-free
5. google/antigravity-gemini-3-pro-high
6. opencode/glm-4.7-free

### goop-explorer
*Fast codebase exploration and pattern extraction*
1. google/antigravity-gemini-3-flash
2. anthropic/claude-haiku-4-5
3. opencode/minimax-m2.1-free

### goop-librarian
*Codebase search and documentation retrieval*
1. openai/gpt-5.2
2. google/antigravity-gemini-3-flash
3. anthropic/claude-sonnet-4-5

### goop-orchestrator
*Primary orchestrator - spec clarity and wave execution*
1. anthropic/claude-opus-4-5
2. openai/gpt-5.2-codex
3. opencode/kimi-k2.5-free
4. anthropic/claude-sonnet-4-5

### goop-planner
*Detailed execution plans with architectural precision*
1. anthropic/claude-opus-4-5
2. openai/gpt-5.2-codex
3. opencode/kimi-k2.5-free
4. anthropic/claude-sonnet-4-5

### goop-researcher
*Comprehensive ecosystem research*
1. openai/gpt-5.2
2. anthropic/claude-sonnet-4-5
3. opencode/kimi-k2.5-free
4. opencode/glm-4.7-free

### goop-tester
*Web frontend testing with Playwright*
1. opencode/kimi-k2.5-free
2. anthropic/claude-sonnet-4-5
3. google/antigravity-gemini-3-flash

### goop-verifier
*Post-execution verification with security focus*
1. openai/gpt-5.2-codex
2. anthropic/claude-opus-4-5

### goop-writer
*Comprehensive documentation generation*
1. google/antigravity-gemini-3-pro-high
2. opencode/kimi-k2.5-free
3. anthropic/claude-sonnet-4-5

## Memory System Configuration

The memory system allows GoopSpec to:
- Remember decisions and their reasoning
- Recall patterns from past work
- Build context across sessions

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `memoryEnabled` | boolean | true | Enable/disable memory |
| `memoryProvider` | string | "local" | Embedding provider |
| `memoryWorkerPort` | number | 37777 | Worker process port |

### Embedding Providers

- **local** - Uses `Xenova/all-MiniLM-L6-v2`, runs locally, free
- **openai** - Uses OpenAI's embedding API, requires API key
- **ollama** - Uses local Ollama server

## Troubleshooting

### "Memory worker not responding"

1. Check if port 37777 is in use: `lsof -i :37777`
2. Try a different port: `memoryWorkerPort: 37778`
3. Check memory directory exists: `.goopspec/memory/`

### "Configuration not loading"

1. Run `goop_setup(action: "verify")` to diagnose
2. Check for JSON syntax errors in config files
3. Try `goop_setup(action: "reset", scope: "project", confirmed: true)`

### "MCPs not installing"

MCPs require OpenCode configuration. Check:
1. OpenCode is installed and configured
2. You have write permissions to ~/.config/opencode/

## Tips

1. **Start with detect** - Always check what's already configured
2. **Use verify after changes** - Ensures everything works
3. **Preserve data on reset** - Don't lose memories unless needed
4. **Quick setup is fine** - Model defaults work well for most users
5. **Local memory is best** - No API costs, runs offline

## Complete Example

First-time setup:

```
// 1. Check current state
goop_setup(action: "detect")

// 2. Initialize everything
goop_setup(
  action: "init",
  scope: "both",
  projectName: "my-project",
  mcpPreset: "recommended",
  memoryEnabled: true,
  memoryProvider: "local",
  enableOrchestrator: true
)

// 3. Verify
goop_setup(action: "verify")
```

Modify existing:

```
// Update just the executor model
goop_setup(
  action: "apply",
  scope: "project",
  agentModels: {
    "goop-executor": "anthropic/claude-opus-4-5"
  }
)
```
