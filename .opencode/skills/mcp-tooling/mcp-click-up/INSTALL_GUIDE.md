# mcp-click-up Installation Guide

Complete installation and configuration for ClickUp task management, providing AI assistants with two complementary surfaces. The cupt CLI is the primary tool: daily task operations (list, complete, note, time, tag) with per-list status resolution, dry-run safety, and `--json` output. The official ClickUp MCP is the secondary surface, launched through Code Mode for documents, goals, and bulk operations.

> **Part of OpenCode Installation.** See the [Master Installation Guide](../../../install_guides/README.md) for complete setup.
> **Package:** `cupt` (PyPI) | **Dependencies:** Python 3.8+, pipx (or pip); Node.js 18+ for the MCP path
> **Phase-by-phase validation:** the full checkpoint reference lives in [`references/install_guide.md`](references/install_guide.md) — this front door summarizes it.

**Version:** 1.0.1.0 | **Updated:** 2026-07-16

---

## 0. AI-FIRST INSTALL GUIDE

Copy and paste this prompt to your AI assistant to get installation help:

```
Run the embedded install script:
  bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh

It will:
  1. Install cupt via pipx (or pip fallback)
  2. Print the official ClickUp MCP config snippet to stdout

Then:
  cupt auth                              # Authenticate interactively
  # OR:
  cupt config --api-token pk_YOUR_TOKEN  # Set token directly

Verify:
  cupt --version    # -> cupt X.Y.Z
  cupt status       # -> workspace name + user

For MCP: copy the printed `clickup_official` manual into .utcp_config.json's
manual_call_templates (Code Mode's config, not opencode.json). It launches
`npx -y @clickup/mcp-server` over stdio and uses `CLICKUP_API_KEY` and
`CLICKUP_TEAM_ID` from the Code Mode environment.
```

### Quick Success Check (30 seconds)

```bash
cupt --version && cupt status && cupt list --today --json | head -5
```

All three succeed: the CLI surface is fully working. Not working? Go to [Troubleshooting](#6-troubleshooting).

---

## 1. OVERVIEW

| Component | Source | Package | Install | Required For |
|-----------|--------|---------|---------|-------------|
| **cupt CLI** | [github.com/newz2000/cupt](https://github.com/newz2000/cupt) · [PyPI](https://pypi.org/project/cupt/) | `cupt` | `pipx install cupt` or `bash mcp-servers/clickup-cli/setup.sh` | Daily task ops (primary) |
| **Official ClickUp MCP** | Official ClickUp MCP package | `@clickup/mcp-server` | `.utcp_config.json` manual using stdio via `npx -y @clickup/mcp-server`; set `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` | Documents, goals, bulk (secondary) |

### When to Install What

```
Need ClickUp access?
  │
  ├─ Daily task ops (list, done, note, time, tag)?
  │     → cupt CLI only (Sections 2-3)
  │
  └─ Documents, goals, bulk ops?
        → cupt CLI + MCP config (Sections 2-4)
```

### Architecture

```
Agent
  │
  ├── cupt list / done / note / time / tag
  │     └── ClickUp REST API v2 (via cupt)
  │
  └── call_tool_chain("clickup_official.clickup_official_*")
        └── Code Mode MCP
              └── Official ClickUp MCP server
                    └── ClickUp REST API v2
```

---

## 2. PREREQUISITES & INSTALLATION

### Prerequisites

- **Python 3.8+** — `python3 --version`
- **pipx** (recommended) or **pip** — `pipx --version`; install via `brew install pipx && pipx ensurepath` (macOS) or `python3 -m pip install --user pipx`
- **For MCP only:** Node.js 18+ and npx, plus `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` in the environment available to Code Mode

### Install cupt

```bash
# Recommended — isolated environment
pipx install cupt

# Fallback — user pip (no isolation)
pip install --user cupt

# Verify
cupt --version    # -> cupt 0.7.1 (or newer)
which cupt
```

**PATH fix if installed but not found:** `pipx ensurepath && source ~/.zshrc`.

---

## 3. AUTHENTICATION

**Option A — Personal API Token (recommended for individuals):** generate a `pk_` token at https://app.clickup.com/settings/apps, then:

```bash
cupt config --api-token pk_YOUR_TOKEN_HERE
```

**Option B — OAuth (recommended for teams):** create an app with redirect URL `http://localhost:4321`, then run the interactive wizard:

```bash
cupt auth
```

**Optional defaults:**

```bash
cupt config --workspace-id 1234567    # From cupt status output
cupt config --default-list 9876543    # Default list for lookups
cupt config --show                    # Review current config
```

**Verify:** `cupt status` shows workspace name + user; `cupt teams` lists at least one team. A 401 means re-authenticate with `cupt logout && cupt auth`.

---

## 4. MCP CONFIGURATION (OPTIONAL)

The official server is launched over stdio by the `clickup_official` manual with `npx -y @clickup/mcp-server`. Set `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` in the environment available to Code Mode; there is no browser authorization step.

**Code Mode (`.utcp_config.json`, the path this skill uses):**

```json
{
  "name": "clickup_official",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup_official": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@clickup/mcp-server"],
        "env": {
          "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
          "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"
        }
      }
    }
  }
}
```

Restart your AI client after updating the config. Tool naming is `clickup_official.clickup_official_{tool_name}` — confirm every name with `tool_info()`/`list_tools()`, never guess. Configuration notes for other stdio clients: [`references/install_guide.md`](references/install_guide.md) §4 and [`mcp-servers/clickup-mcp/README.md`](mcp-servers/clickup-mcp/README.md).

**MCP smoke test (Code Mode):**

```typescript
const result = await call_tool_chain([{
  tool: "clickup_official.clickup_official_get_workspace",
  input: {}
}]);
// Should return workspace data with team ID
```

---

## 5. VERIFICATION

```bash
cupt --version                        # -> cupt X.Y.Z
cupt status                           # -> workspace name + user
cupt teams                            # -> team list
cupt list --today --json              # -> [] or task array (both valid)
cupt list --tag nonexistent --json    # -> [] (confirms empty-queue handling)
```

The full five-phase validation ladder (`phase_1_complete` through `phase_5_complete`) with STOP conditions lives in [`references/install_guide.md`](references/install_guide.md) — run it when an install misbehaves or when validating a fresh machine end to end.

---

## 6. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| `command not found: cupt` | PATH or install issue | `pipx install cupt && pipx ensurepath && source ~/.zshrc` |
| `AuthError: No credentials` | Not authenticated | `cupt auth` or `cupt config --api-token pk_xxx` |
| `cupt status` shows 401 | Expired or revoked token | `cupt logout && cupt auth` |
| `cupt list --team X` slow (>20s) | Client-side team filter | Add `--tag Y` to narrow the result set |
| MCP: connection fails | Manual missing, stdio launch fails, or env vars unavailable | Add/fix the `clickup_official` manual, verify `npx -y @clickup/mcp-server`, set `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID` |
| MCP: tool not found | Wrong tool name | Use `clickup_official.clickup_official_{tool_name}` (all lowercase, underscores) |
| Python version error | Python < 3.8 | Install Python 3.8+ via Homebrew or python.org |

Full diagnosis and recovery: [`references/troubleshooting.md`](references/troubleshooting.md).

---

## 7. RESOURCES

| Resource | Purpose |
|----------|---------|
| [`SKILL.md`](SKILL.md) | Routing rules, agent invariants, quick-reference cheat sheet |
| [`README.md`](README.md) | Human-facing overview with feature tables and FAQ |
| [`references/install_guide.md`](references/install_guide.md) | Phase-by-phase install reference with validation checkpoints (loaded by the smart router on INSTALL intent) |
| [`references/cupt_commands.md`](references/cupt_commands.md) | Complete cupt command reference with `--json` variants |
| [`references/mcp_tools.md`](references/mcp_tools.md) | Official MCP tool catalog: priorities + invocation |
| [`feature_catalog/FEATURE_CATALOG.md`](feature_catalog/FEATURE_CATALOG.md) | Full cupt + MCP feature inventory |
| [`examples/README.md`](examples/README.md) | Production scripts: task queue + time tracking |
| [`mcp-servers/clickup-cli/README.md`](mcp-servers/clickup-cli/README.md) | cupt install pointer |
| [`mcp-servers/clickup-mcp/README.md`](mcp-servers/clickup-mcp/README.md) | Official MCP server configuration notes |

---

**Need help?** See [Troubleshooting](#6-troubleshooting) or load the `mcp-click-up` skill for detailed workflows.
