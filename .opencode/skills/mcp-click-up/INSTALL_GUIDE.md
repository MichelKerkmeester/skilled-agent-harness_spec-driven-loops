---
title: "mcp-click-up Installation Guide"
description: "Phase-based install for cupt CLI and official ClickUp MCP. Validation checkpoints at every phase."
version: "1.0.0"
updated: "2026-05-31"
trigger_phrases:
  - "install cupt"
  - "clickup setup"
  - "mcp-click-up install"
  - "clickup mcp config"
---

# mcp-click-up Installation Guide

Complete installation and configuration for ClickUp task management via cupt CLI (daily ops) and the official ClickUp MCP server (documents, goals, bulk ops). Five validation phases confirm each step before proceeding.

---

## 0. AI-FIRST INSTALL GUIDE

> **AI Assistant:** Copy this block to install cupt and configure the ClickUp MCP in one pass.

```
Run the embedded install script:
  bash .opencode/skills/mcp-click-up/scripts/install.sh

It will:
  1. Install cupt via pipx (or pip fallback)
  2. Print the official ClickUp MCP config snippet to stdout

Then:
  cupt auth                              # Authenticate interactively
  # OR:
  cupt config --api-token pk_YOUR_TOKEN  # Set token directly

Verify:
  cupt --version    # → cupt X.Y.Z
  cupt status       # → workspace name + user

For MCP: copy the printed JSON snippet into your platform config (opencode.json, .mcp.json, or claude_desktop_config.json).
```

**30-second success check:**
```bash
cupt --version && cupt status && cupt list --today --json | head -5
```

---

## 1. OVERVIEW

| Component | Source | Package | Install | Required For |
|-----------|--------|---------|---------|-------------|
| **cupt CLI** | [github.com/newz2000/cupt](https://github.com/newz2000/cupt) · [PyPI](https://pypi.org/project/cupt/) | `cupt` | `pipx install cupt` or `bash mcp-servers/clickup-cli/setup.sh` | Daily task ops (primary) |
| **Official ClickUp MCP** | [github.com/clickup/clickup-mcp-server](https://github.com/clickup/clickup-mcp-server) · [npm](https://www.npmjs.com/package/@clickup/mcp-server) | `@clickup/mcp-server` | Platform config or `npm install` in `mcp-servers/clickup-mcp/` | Documents, goals, bulk (secondary) |

### When to Install What

```
Need ClickUp access?
  │
  ├─ Daily task ops (list, done, note, time, tag)?
  │     → Phases 1-3 only (cupt CLI)
  │
  └─ Documents, goals, bulk ops, webhooks?
        → Phases 1-3 (cupt) + Phase 4 (MCP config)
```

### Architecture

```
Agent
  │
  ├── cupt list / done / note / time / tag
  │     └── ClickUp REST API v2 (via cupt)
  │
  └── call_tool_chain("clickup.clickup_*")
        └── Code Mode MCP
              └── Official ClickUp MCP server
                    └── ClickUp REST API v2
```

---

## 2. PREREQUISITES

### Required

- **Python 3.8+** — cupt requires Python 3.8 or newer

```bash
python3 --version    # → Python 3.8.x or newer
```

- **pipx** (recommended) or **pip** — for isolated cupt install

```bash
pipx --version       # Check if pipx is available
```

**Install pipx if missing:**
```bash
# macOS
brew install pipx && pipx ensurepath

# Linux / other
python3 -m pip install --user pipx
python3 -m pipx ensurepath
source ~/.zshrc   # or ~/.bashrc
```

### For MCP (Phase 4 only)

- **Node.js 18+** and **npx** — for `@clickup/mcp-server`

```bash
node --version       # → v18.x or newer
npx --version        # → confirms npx available
```

### Validation: `phase_1_complete`

```bash
python3 --version    # → Python 3.8.0 or newer
```

**Checklist:**
- [ ] `python3 --version` shows 3.8+?
- [ ] `pipx --version` works (or pip available as fallback)?

❌ **STOP if Python < 3.8** — install Python 3.8+ before proceeding.

---

## 3. INSTALLATION

### Install cupt

**Recommended — isolated environment via pipx:**
```bash
pipx install cupt
```

**Fallback — user pip (no isolation):**
```bash
pip install --user cupt
```

**Verify the installation:**
```bash
cupt --version    # → cupt 0.7.1 (or newer)
which cupt        # → /Users/you/.local/bin/cupt (or similar)
```

**PATH fix if cupt is installed but not found:**
```bash
pipx ensurepath           # Adds pipx bin dir to PATH
source ~/.zshrc           # Reload shell
cupt --version            # Retry
```

### Validation: `phase_2_complete`

```bash
cupt --version    # → cupt X.Y.Z
```

**Checklist:**
- [ ] `cupt --version` prints a version string?
- [ ] `which cupt` returns a path?

❌ **STOP if cupt is not found** — run `pipx ensurepath` and reload your shell.

---

## 4. CONFIGURATION

### cupt Authentication

**Option A — Personal API Token (recommended for individuals):**
1. Go to https://app.clickup.com/settings/apps
2. Generate a Personal API Token (starts with `pk_`)
3. Set the token:
   ```bash
   cupt config --api-token pk_YOUR_TOKEN_HERE
   ```

**Option B — OAuth (recommended for teams):**
1. Create an app at https://app.clickup.com/settings/apps
2. Set redirect URL to `http://localhost:4321`
3. Note your Client ID and Client Secret
4. Run the interactive wizard:
   ```bash
   cupt auth
   ```

**Optional defaults:**
```bash
cupt config --workspace-id 1234567    # From cupt status output
cupt config --default-list 9876543    # Default list for lookups
cupt config --show                    # Review current config
```

### Official ClickUp MCP — Platform Configuration

The official MCP uses environment variables. Get your workspace ID first:
```bash
cupt status    # Shows "Workspace ID: XXXXXXX"
```

**OpenCode (`opencode.json`):**
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

**Claude Code (`.mcp.json` in project root, or `~/.claude/mcp.json` for user-scope):**
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

**Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):**
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

> Restart your AI client after updating the config.

### Validation: `phase_3_complete`

```bash
cupt status       # → workspace name + authenticated user
cupt teams        # → list of teams in workspace
```

**Checklist:**
- [ ] `cupt status` shows workspace name without error?
- [ ] `cupt teams` lists at least one team?
- [ ] (MCP) Config file updated and AI client restarted?

❌ **STOP if `cupt status` shows 401** — run `cupt logout && cupt auth` to re-authenticate.

---

## 5. VERIFICATION

### cupt Full Verification

```bash
cupt --version                    # → cupt X.Y.Z
cupt status                       # → workspace name + user
cupt teams                        # → team list
cupt list --today --json          # → [] or task array (both valid)
cupt list --tag nonexistent --json # → [] (confirms empty queue handling)
```

### Validation: `phase_4_complete`

```bash
cupt list --today --json | python3 -c "import sys,json; json.load(sys.stdin); print('JSON valid')"
```

**Checklist:**
- [ ] `cupt list --today --json` returns valid JSON (empty array is fine)?
- [ ] `cupt teams` lists teams correctly?
- [ ] No auth errors on any command?

### MCP Verification (if configured)

```typescript
// In Code Mode — test the MCP connection:
const result = await call_tool_chain([{
  tool: "clickup.clickup_get_workspace",
  input: {}
}]);
// Should return workspace data with team ID
```

### Validation: `phase_5_complete`

**Checklist:**
- [ ] cupt auth verified — `cupt status` shows workspace?
- [ ] cupt listing verified — `cupt list --today --json` returns valid JSON?
- [ ] (MCP) `clickup.clickup_get_workspace` returns workspace data?

❌ **STOP if MCP fails** — verify `CLICKUP_API_KEY` starts with `pk_` and `CLICKUP_TEAM_ID` is numeric.

---

## 6. USAGE

### Basic Task Workflow

```bash
# 1. Fetch tasks tagged for processing
cupt list --tag ai_ready --all --json

# 2. Inspect before acting
cupt show TASK_ID --notes --json
cupt context TASK_ID

# 3. Discover status schema FIRST
cupt statuses TASK_ID

# 4. Dry-run — verify resolved status, no write
cupt done TASK_ID --dry-run

# 5. Complete with note
cupt done TASK_ID --note "Processed by AI agent"
```

### Time Tracking

```bash
cupt time start TASK_ID     # Begin work
cupt time status            # Check elapsed
cupt time stop              # Log automatically
cupt time add TASK_ID 45m   # Or log manually
```

### MCP Advanced Operations

```typescript
// Create document (MCP only)
await call_tool_chain([{
  tool: "clickup.clickup_create_document",
  input: {
    name: "Sprint Notes",
    parent: { type: 4, id: "LIST_ID" },
    content: "# Sprint Notes\n\n...",
    content_format: "markdown"
  }
}]);

// Bulk create tasks (MCP only)
await call_tool_chain([{
  tool: "clickup.clickup_create_bulk_tasks",
  input: {
    list_id: "LIST_ID",
    tasks: [
      { name: "Task A", priority: 2 },
      { name: "Task B", priority: 3 }
    ]
  }
}]);
```

---

## 9. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| `command not found: cupt` | PATH or install issue | `pipx install cupt && pipx ensurepath && source ~/.zshrc` |
| `AuthError: No credentials` | Not authenticated | `cupt auth` or `cupt config --api-token pk_xxx` |
| `cupt status` shows 401 | Expired or revoked token | `cupt logout && cupt auth` |
| `cupt list --team X` slow (>20s) | Client-side team filter | Add `--tag Y` to narrow the result set |
| MCP: `CLICKUP_API_KEY not set` | Missing env var in config | Add `CLICKUP_API_KEY` to the env block in your platform config |
| MCP: tool not found | Wrong tool name | Use `clickup.clickup_{tool_name}` (all lowercase, underscores) |
| Python version error | Python < 3.8 | Install Python 3.8+ via Homebrew or python.org |
| cupt installed but wrong version | Old version | `pipx upgrade cupt` |

Full guide: `references/troubleshooting.md`

---

## 10. RESOURCES

| Resource | Purpose |
|----------|---------|
| `SKILL.md` | Routing rules, agent invariants, quick-reference cheat sheet |
| `README.md` | Human-facing overview with feature tables and FAQ |
| `references/cupt_commands.md` | Complete cupt command reference with `--json` variants |
| `references/mcp_tools.md` | 46 official MCP tools: HIGH/MEDIUM/LOW priority + invocation |
| `references/troubleshooting.md` | Detailed error diagnosis and recovery steps |
| `feature_catalog/feature_catalog.md` | Full cupt + MCP feature inventory |
| `examples/task-queue-workflow.sh` | Production script: tagged queue → dry-run → complete → handoff |
| `examples/time-tracking-workflow.sh` | Production script: start / stop / log / status |
| [cupt repository](https://github.com/newz2000/cupt) | Upstream cupt source, changelog, issues |
| [Official ClickUp MCP](https://github.com/clickup/clickup-mcp-server) | MCP server source and API reference |
| [ClickUp API tokens](https://app.clickup.com/settings/apps) | Generate `pk_` Personal API Token |

### Quick Reference Card

```
INSTALL:   bash .opencode/skills/mcp-click-up/scripts/install.sh
AUTH:      cupt auth  OR  cupt config --api-token pk_xxx
VERIFY:    cupt status && cupt list --today --json

DAILY OPS (cupt):
  List:    cupt list [--today|--week|--overdue|--tag X|--team X] [--json]
  Show:    cupt show <id> [--notes] [--json] [--offline]
  Status?: cupt statuses <id>   ← ALWAYS before done
  Done:    cupt done <id> [--dry-run] [--note "text"]
  Note:    cupt note <id> "<text>"
  Notes:   cupt notes <id>
  Time:    cupt time start <id> | stop | add <id> <dur> | status
  Tag:     cupt tag add|remove <id> <name>
  Context: cupt context <id>

MCP OPS (Code Mode — call_tool_chain):
  Tool naming: clickup.clickup_{tool_name}
  Docs:    clickup.clickup_create_document
  Goals:   clickup.clickup_manage_goals
  Bulk:    clickup.clickup_create_bulk_tasks
  Search:  clickup.clickup_search_tasks

VALIDATION:
  phase_1_complete: python3 --version → 3.8+
  phase_2_complete: cupt --version → X.Y.Z
  phase_3_complete: cupt status → workspace name
  phase_4_complete: cupt list --today --json → valid JSON
  phase_5_complete: (MCP) clickup_get_workspace → workspace data
```
