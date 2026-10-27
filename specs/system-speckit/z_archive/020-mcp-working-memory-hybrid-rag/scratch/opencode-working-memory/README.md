# OpenCode Working Memory Plugin

[![npm version](https://img.shields.io/npm/v/opencode-working-memory.svg)](https://www.npmjs.com/package/opencode-working-memory)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Advanced four-tier memory architecture that keeps your AI agent sharp, focused, and never forgets what matters.**

Stop losing context across compactions. Stop watching your agent repeat the same mistakes. This plugin gives your OpenCode agent a professional-grade memory system that scales with your project complexity.

## What You Get

- 🧠 **Core Memory** - Persistent goal/progress/context blocks that survive compaction
- 💡 **Working Memory** - Smart slot-based system (errors, decisions, todos, dependencies) 
- 🎯 **Memory Pressure Monitoring** - Real-time token tracking with automatic interventions
- 🧹 **Auto Storage Governance** - Prevents unbounded disk growth (300 files/session, 7-day TTL)
- 📊 **Smart Pruning** - Pressure-aware tool output compression
- ⚡ **Zero Configuration** - Works out of the box, highly customizable

## Installation

**Option A: Let an AI agent do it**

Paste this into any AI agent:

```
Install opencode-working-memory plugin by following:
https://raw.githubusercontent.com/sdwolf4103/opencode-working-memory/main/docs/installation.md
```

**Option B: Manual setup**

Add to your `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["opencode-working-memory"]
}
```

Restart OpenCode. The plugin is downloaded and installed automatically.

### For LLM Agents

1. Edit `~/.config/opencode/opencode.json`
2. Add `"opencode-working-memory"` to the `plugin` array
3. Verify the config file was saved correctly

## Quick Start

The plugin works automatically once installed. No configuration needed.

**Try telling your agent:**

```
Use core_memory_update to set my current goal
```
```
Use core_memory_read to show me what you remember
```
```
Use working_memory_add to remember this file path
```

## Features

### 🧠 Core Memory

Persistent blocks that survive conversation resets:

- **goal** (1000 chars) - Current task/objective
- **progress** (2000 chars) - What's done, in-progress, next steps
- **context** (1500 chars) - Key file paths, conventions, patterns

### 💡 Working Memory

Auto-extracts and ranks important information:

- **Slots** (guaranteed visibility): errors, decisions, todos, dependencies
- **Pool** (ranked by relevance): file paths, recent activity
- Exponential decay keeps memory fresh
- FIFO limits prevent bloat

### 🎯 Memory Pressure Monitoring

Real-time token tracking from session database:

- Monitors context window usage (75% moderate → 90% high)
- Proactive intervention messages when pressure is high
- Pressure-aware smart pruning (adapts compression based on pressure)

### 🧹 Storage Governance

Prevents unbounded disk growth:

- Auto-cleanup on session deletion (all artifacts removed)
- Active cache management (max 300 files/session, 7-day TTL)
- Silent background operation

### 📊 Smart Pruning

Intelligent tool output compression:

- Per-tool strategies (keep-all, keep-ends, keep-last, discard)
- Pressure-aware limits (2k/5k/10k lines based on memory pressure)
- Preserves important context while reducing noise

## Documentation

- [Installation Guide](docs/installation.md) - Detailed setup instructions
- [Architecture Overview](docs/architecture.md) - How it works under the hood
- [Configuration](docs/configuration.md) - Customization options
- [Agent Developer Guide](AGENTS.md) - For plugin developers

## Tools Provided

The plugin exposes these tools to your OpenCode agent:

- `core_memory_update` - Update goal/progress/context blocks
- `core_memory_read` - Read current memory state
- `working_memory_add` - Manually add important items
- `working_memory_clear` - Clear all working memory
- `working_memory_clear_slot` - Clear specific slot (errors/decisions)
- `working_memory_remove` - Remove specific item by content

## How It Works

```
┌───────────────────────────────────────────────────────────┐
│  Core Memory (Always Visible)                             │
│  ┌─────────┬──────────┬──────────┐                        │
│  │  Goal   │ Progress │ Context  │                        │
│  └─────────┴──────────┴──────────┘                        │
└───────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────┐
│  Working Memory (Auto-Extracted)                          │
│  ┌──────────────────┬──────────────────┐                  │
│  │  Slots (FIFO)    │  Pool (Ranked)   │                  │
│  │  • errors        │  • file-paths    │                  │
│  │  • decisions     │  • recent        │                  │
│  │  • todos         │  • mentions      │                  │
│  │  • dependencies  │  • decay score   │                  │
│  └──────────────────┴──────────────────┘                  │
└───────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────┐
│  Memory Pressure Monitor                                  │
│  • Tracks tokens from session DB                          │
│  • Warns at 75% (moderate) / 90% (high)                   │
│  • Sends proactive interventions                          │
│  • Adjusts pruning aggressiveness                         │
└───────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────┐
│  Storage Governance                                       │
│  • Session deletion → cleanup all artifacts               │
│  • Every 20 calls → sweep old cache (300 max, 7d TTL)     │
│  • Silent background operation                            │
└───────────────────────────────────────────────────────────┘
```

## Why This Plugin?

**Without this plugin:**
- 🔴 Agent forgets context after compaction
- 🔴 Repeats resolved errors
- 🔴 Loses track of project structure  
- 🔴 Context window fills up uncontrollably
- 🔴 Disk space grows unbounded

**With this plugin:**
- ✅ Persistent memory across compactions
- ✅ Smart auto-extraction of important info
- ✅ Real-time pressure monitoring with interventions
- ✅ Automatic storage cleanup
- ✅ Pressure-aware compression
- ✅ Zero configuration, works immediately

## Configuration (Optional)

The plugin works great with zero configuration. To customize behavior, modify the constants at the top of `index.ts`. See the [Configuration Guide](docs/configuration.md) for all tunable options.

## Requirements

- OpenCode >= 1.0.0
- Node.js >= 18.0.0
- `@opencode-ai/plugin` >= 1.2.0

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/sdwolf4103/opencode-working-memory/issues)

## Credits

Inspired by the needs of real-world OpenCode usage and built to solve actual pain points in AI-assisted development.

> This project is not affiliated with or endorsed by the OpenCode team.

---

**Made with ❤️ for the OpenCode community**

<!-- readme-check
allow-count 300 files | a per-session cache limit, toolOutputMaxFiles in index.ts, not a folder count
-->
