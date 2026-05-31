---
title: "mcp-click-up Installation Guide"
description: "Step-by-step installation for cupt CLI and official ClickUp MCP. Includes validation checkpoints and AI-first install block."
trigger_phrases:
  - "install cupt"
  - "clickup setup"
  - "mcp-click-up install"
  - "clickup mcp config"
importance_tier: "important"
---

# mcp-click-up Installation Guide

---

## AI-First Install Block

> **AI Assistant:** Copy this prompt to install cupt and configure the ClickUp MCP.

```
Run the cupt CLI install script:
  bash .opencode/skills/mcp-click-up/scripts/install.sh

Then verify:
  cupt --version
  cupt status

For MCP support, add the printed JSON snippet to your opencode.json mcpServers section.
Set CLICKUP_API_KEY and CLICKUP_TEAM_ID in the env block.

Authenticate:
  cupt auth   (interactive)
  OR: cupt config --api-token pk_YOUR_TOKEN_HERE
```

---

## Overview

| Component | Package | Install Method | Required For |
|-----------|---------|----------------|-------------|
| **cupt CLI** | `cupt` (PyPI) | `pipx install cupt` | Daily task ops (primary) |
| **Official ClickUp MCP** | `@clickup/mcp-server` | Config in opencode.json | Documents, goals, bulk ops (secondary) |

### Decision Flowchart

```
Need ClickUp access?
  │
  ├─ Daily task ops (list, done, note, time, tag)?
  │     → Install cupt CLI (Section 1)
  │
  └─ Documents, goals, bulk ops, webhooks?
        → Configure Official MCP (Section 2)
        (requires cupt auth for CLICKUP_TEAM_ID)
```

---

## Section 1: cupt CLI Installation

### Prerequisites

- Python 3.8+ (`python3 --version`)
- pipx (recommended) OR pip

**Check if pipx is installed:**
```bash
pipx --version   # or: python3 -m pipx --version
```

**Install pipx if missing:**
```bash
# macOS (Homebrew)
brew install pipx
pipx ensurepath

# Linux / other
python3 -m pip install --user pipx
python3 -m pipx ensurepath
```

### Installation

**Recommended (isolated environment):**
```bash
pipx install cupt
```

**Alternative (user pip):**
```bash
pip install --user cupt
```

> VALIDATION CHECKPOINT 1: `cupt --version` prints `cupt X.Y.Z`

**STOP if cupt --version fails.** Ensure your Python bin directory is in PATH:
```bash
export PATH="$HOME/.local/bin:$PATH"   # or check pipx ensurepath output
```

### Authentication

**Option A: Personal API Token (individuals)**
1. Go to https://app.clickup.com/settings/apps
2. Generate a Personal API Token (starts with `pk_`)
3. Run:
   ```bash
   cupt config --api-token pk_YOUR_TOKEN_HERE
   ```

**Option B: OAuth (teams)**
1. Create an app at https://app.clickup.com/settings/apps
2. Set redirect URL to `http://localhost:4321`
3. Note your Client ID and Client Secret
4. Run:
   ```bash
   cupt auth   # follow the prompts
   ```

> VALIDATION CHECKPOINT 2: `cupt status` shows workspace name without error

**STOP if `cupt status` fails.** Check:
- Token format: must start with `pk_` for Personal API Token
- Network: workspace API must be reachable
- Run `cupt logout` then `cupt auth` to re-authenticate

### Optional Configuration

```bash
# Set default workspace (from cupt status output)
cupt config --workspace-id 1234567

# Set default list (for quick task lookup)
cupt config --default-list 9876543

# Check current config
cupt config --show

# Clear cached data
cupt config --clear-cache
```

> VALIDATION CHECKPOINT 3: `cupt list --today` returns tasks (or empty — both are valid)

---

## Section 2: Official ClickUp MCP Configuration

The official ClickUp MCP provides advanced operations not available in cupt:
documents, goals, bulk task creation, webhooks, custom views, and more.

### Prerequisites

- Node.js (for `npx`) — verify: `node --version`
- cupt authenticated (for CLICKUP_TEAM_ID — run `cupt status`)
- Code Mode MCP configured in your OpenCode environment

### Getting Your CLICKUP_TEAM_ID

```bash
cupt status   # Look for "Workspace ID:" in output
# OR:
cupt config --show | grep workspace
```

### opencode.json Configuration

Add this to your `opencode.json` under `mcpServers`:

```json
{
  "mcpServers": {
    "clickup": {
      "command": "npx",
      "args": ["-y", "@clickup/mcp-server"],
      "env": {
        "CLICKUP_API_KEY": "pk_YOUR_TOKEN_HERE",
        "CLICKUP_TEAM_ID": "YOUR_WORKSPACE_ID_HERE"
      }
    }
  }
}
```

> VALIDATION CHECKPOINT 4: Restart OpenCode and verify MCP is loaded

**Test MCP connection via Code Mode:**
```typescript
// In Code Mode:
const result = await call_tool_chain([{
  tool: "clickup.clickup_get_workspace",
  input: {}
}]);
// Should return workspace data
```

**STOP if MCP fails.** Check:
- `CLICKUP_API_KEY` matches your cupt token (same `pk_` token works)
- `CLICKUP_TEAM_ID` is numeric (not workspace name)
- Node.js/npx is available: `npx --version`
- OpenCode was restarted after config change

### MCP Tool Naming Convention

All MCP tools follow: `clickup.clickup_{tool_name}` (all lowercase, underscores)

Examples:
```
clickup.clickup_create_task
clickup.clickup_get_task
clickup.clickup_search_tasks
clickup.clickup_create_document
clickup.clickup_get_workspace
```

See `references/mcp_tools.md` for the complete 46-tool catalog.

---

## Section 3: Verification Checklist

Run these in order to confirm both tools are operational:

```bash
# cupt verification
cupt --version                    # ✓ Prints "cupt X.Y.Z"
cupt status                       # ✓ Shows workspace name
cupt teams                        # ✓ Lists available teams
cupt list --today --json          # ✓ Returns [] or task array

# Specific task verification (replace TASK_ID)
cupt statuses TASK_ID             # ✓ Returns list of statuses
```

**Expected cupt status output:**
```
Authenticated: ✓
Workspace: Your Workspace Name (ID: 1234567)
User: your@email.com
```

---

## Section 4: Usage Examples

### Basic Task Workflow (cupt)

```bash
# 1. List tasks tagged for AI processing
cupt list --tag ai_ready --json

# 2. Inspect a task (replace with real ID)
cupt show TASK_ID --notes --json

# 3. Discover the list's status schema
cupt statuses TASK_ID

# 4. Dry-run completion (preview only)
cupt done TASK_ID --dry-run

# 5. Complete with a note
cupt done TASK_ID --note "Processed by AI agent"
```

### Time Tracking (cupt)

```bash
cupt time start TASK_ID    # Start timer
cupt time status           # Check current timer
cupt time stop             # Stop timer
cupt time add TASK_ID 1h30m  # Log time manually
```

### Advanced Operations (MCP via Code Mode)

```typescript
// Create a ClickUp document
await call_tool_chain([{
  tool: "clickup.clickup_create_document",
  input: {
    name: "Sprint Retrospective",
    parent: { type: 4, id: "LIST_ID" },
    content: "# Sprint Retrospective\n\n## What went well\n..."
  }
}]);
```

---

## Section 5: Troubleshooting

| Issue | Diagnosis | Fix |
|-------|-----------|-----|
| `command not found: cupt` | PATH issue or not installed | `pipx install cupt && pipx ensurepath` |
| `AuthError: No credentials` | Not authenticated | `cupt auth` |
| `cupt status` shows 401 | Expired/invalid token | `cupt logout && cupt auth` |
| `cupt list --team X` slow (>20s) | Client-side filter | Add `--tag Y` to narrow results |
| MCP: `CLICKUP_API_KEY not set` | Missing env var | Check opencode.json env block |
| MCP: tool not found | Wrong tool name | Use `clickup.clickup_{name}` format |

Full guide: `references/troubleshooting.md`

---

## Quick Reference Card

```
INSTALL:     bash .opencode/skills/mcp-click-up/scripts/install.sh
AUTH:        cupt auth  OR  cupt config --api-token pk_xxx
VERIFY:      cupt status  &&  cupt list --today

DAILY OPS (cupt):
  List:      cupt list [--today|--week|--tag X] [--json]
  Details:   cupt show <id> [--notes] [--json]
  Status?:   cupt statuses <id>   ← ALWAYS before done
  Done:      cupt done <id> [--dry-run] [--note "text"]
  Note:      cupt note <id> "<text>"
  Time:      cupt time start <id> | stop | add <id> <dur>
  Tag:       cupt tag add|remove <id> <name>
  Context:   cupt context <id>

MCP OPS (via Code Mode):
  Tool:      clickup.clickup_{tool_name}
  Docs:      clickup.clickup_create_document
  Goals:     use goal management tools
  Bulk:      clickup.clickup_create_bulk_tasks
```
