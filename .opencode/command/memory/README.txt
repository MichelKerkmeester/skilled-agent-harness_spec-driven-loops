---
title: "Memory Commands"
description: "Slash commands for managing the Spec Kit Memory system including context retrieval, session recovery, constitutional memory management, and database operations."
trigger_phrases:
  - "memory command"
  - "memory save"
  - "memory context"
  - "memory continue"
  - "memory learn"
  - "memory manage"
---

# Memory Commands

> Slash commands for managing the Spec Kit Memory system across sessions.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. COMMANDS](#2-commands)
- [3. STRUCTURE](#3-structure)
- [4. USAGE EXAMPLES](#4-usage-examples)
- [5. MANAGE SUBCOMMANDS](#5-manage-subcommands)
- [6. TROUBLESHOOTING](#6-troubleshooting)
- [7. RELATED DOCUMENTS](#7-related-documents)

---

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `memory` command group provides operations for the Spec Kit Memory MCP system. These commands handle context preservation across sessions, intent-aware retrieval, session recovery, constitutional memory management, and database maintenance.

All commands interact with the memory MCP server tools (`spec_kit_memory_*`). They follow a gate-based argument validation pattern: if required arguments are missing, the command prompts the user before proceeding.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:commands -->
## 2. COMMANDS

| Command | Invocation | Description |
|---------|------------|-------------|
| **context** | `/memory:context <query> [--intent:<type>]` | Intent-aware context retrieval with task-specific weight optimization |
| **continue** | `/memory:continue [recovery-mode:auto\|manual]` | Recover session from crash, compaction, or timeout |
| **learn** | `/memory:learn [rule] \| list \| edit \| remove \| budget` | Create and manage constitutional memories (always-surface rules) |
| **manage** | `/memory:manage <subcommand>` | Database operations (scan with source-scope prompt, cleanup, tier, health, checkpoint) |
| **save** | `/memory:save <spec-folder>` | Save conversation context with semantic indexing |

### Intent Types for Context Command

| Intent | Trigger Keywords | Weight Focus |
|--------|-----------------|--------------|
| `add_feature` | implement, add new, create new | Implementation, architecture, patterns |
| `fix_bug` | bug, error, fix, broken, debug | Decisions, implementation, errors |
| `refactor` | refactor, restructure, optimize | Architecture, patterns, decisions |
| `security_audit` | security, vulnerability, auth | Decisions, implementation, security |
| `understand` | how, why, what, explain | Architecture, decisions, overview |
| `find_spec` | spec, specification, find spec | Spec docs, architecture, overview |
| `find_decision` | decision, rationale, why did we | Decisions, rationale, context |

### Learn Subcommands

| Subcommand | Invocation | Description |
|------------|------------|-------------|
| (default) | `/memory:learn [rule]` | Create new constitutional memory (guided) |
| list | `/memory:learn list` | Show all constitutional memories + budget |
| edit | `/memory:learn edit <filename>` | Edit existing constitutional memory |
| remove | `/memory:learn remove <filename>` | Remove constitutional memory |
| budget | `/memory:learn budget` | Token budget status (~2000 max) |

---

<!-- /ANCHOR:commands -->
<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
memory/
├── context.md      # /memory:context - Intent-aware retrieval
├── continue.md     # /memory:continue - Session recovery
├── learn.md        # /memory:learn - Constitutional memory manager
├── manage.md       # /memory:manage - Database management
└── save.md         # /memory:save - Context saving
```

No `assets/` folder exists for memory commands. Workflows are defined inline within each command file.

---

<!-- /ANCHOR:structure -->
<!-- ANCHOR:usage-examples -->
## 4. USAGE EXAMPLES

```bash
# Save context to a spec folder
/memory:save specs/007-feature-name

# Retrieve context with auto-detected intent
/memory:context "how does the auth system work"

# Retrieve context with explicit intent
/memory:context "auth flow" --intent:fix_bug

# Recover from a crashed session
/memory:continue

# Auto-recovery mode
/memory:continue :auto

# Create a constitutional memory (always-surface rule)
/memory:learn "Never commit API keys or secrets to git"

# List all constitutional memories and budget
/memory:learn list

# Check token budget status
/memory:learn budget

# View database stats
/memory:manage stats

# Scan for new memory files (prompts source scope: [a]ll/[c]ore/[b]ack)
/memory:manage scan

# Force re-index all files
/memory:manage scan --force

# Check system health
/memory:manage health
```

---

<!-- /ANCHOR:usage-examples -->
<!-- ANCHOR:manage-subcommands -->
## 5. MANAGE SUBCOMMANDS

The `/memory:manage` command accepts these subcommands:

| Subcommand | Arguments | Description |
|------------|-----------|-------------|
| `stats` | (none) | Show memory database statistics |
| `scan` | `[--force]` | Scan workspace for new/changed memory files (asks source scope each run) |
| `cleanup` | (none) | Remove orphaned or invalid entries |
| `tier` | `<id> <tier>` | Change importance tier of a memory |
| `triggers` | `<id>` | View trigger phrases for a memory |
| `validate` | `<id> <useful\|not>` | Record validation feedback for a memory |
| `delete` | `<id>` | Delete a specific memory |
| `health` | (none) | Check memory system health status |
| `checkpoint` | `create\|list\|restore\|delete` | Manage named checkpoints of memory state |

---

<!-- /ANCHOR:manage-subcommands -->
<!-- ANCHOR:troubleshooting -->
## 6. TROUBLESHOOTING

| Problem | Cause | Fix |
|---------|-------|-----|
| "No results" from context | Query too narrow or no matching memories | Broaden query or try different intent |
| Save fails | Spec folder path invalid or missing | Verify path exists under `specs/` |
| Continue finds no session | No saved context from prior session | Use `/memory:context` with manual query instead |
| Manage scan finds 0 files | No memory files in expected directories | Check `specs/**/memory/`, `.opencode/skill/*/constitutional/`, and configured `.opencode/skill/*/{references,assets}/` paths |
| Learn file not found | Wrong filename for edit/remove | Run `/memory:learn list` to see available files |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:related-documents -->
## 7. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Parent: OpenCode Commands](../README.txt) | Overview of all command groups |
| [system-spec-kit SKILL.md](../../skill/system-spec-kit/SKILL.md) | Memory system architecture and spec folder workflow |
| [Spec Kit Memory MCP](../../skill/system-spec-kit/mcp_server/) | MCP server implementation for memory operations |
<!-- /ANCHOR:related-documents -->
