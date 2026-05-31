---
title: "mcp-click-up: ClickUp Task Management Skill"
description: "AI agent skill for ClickUp task management via cupt CLI (primary) and official ClickUp MCP (secondary). Operation-based routing with embedded install."
trigger_phrases:
  - "clickup"
  - "cupt"
  - "task management"
  - "work queue"
  - "time tracking"
  - "mark task done"
importance_tier: "important"
---

# mcp-click-up

ClickUp task management for AI agents via **cupt CLI** (primary) and **official ClickUp MCP** (secondary).

---

## Overview

`mcp-click-up` gives AI agents a structured, safe interface to ClickUp. The skill routes operations to the right tool:

- **cupt** — daily task operations: list, show, complete, note, time, tag
- **Official ClickUp MCP** — advanced operations: documents, goals, bulk create, webhooks

Unlike a simple primary/fallback pattern, these tools cover **different ClickUp surfaces** and are used based on what operation the agent needs.

| Key Feature | Detail |
|-------------|--------|
| Primary CLI | `cupt` v0.7.1+ (Python, `pipx install cupt`) |
| Secondary | Official ClickUp MCP (`github.com/clickup/clickup-mcp-server`) |
| Routing model | Operation-based (not availability-based) |
| Embedded install | `scripts/install.sh` handles cupt + prints MCP config |
| Agent-safe | Dry-run patterns, per-list status resolution, --json output |

---

## Quick Start

**Step 1: Install cupt**
```bash
bash .opencode/skills/mcp-click-up/scripts/install.sh
```

**Step 2: Authenticate**
```bash
cupt auth                          # Interactive wizard
# OR for API token:
cupt config --api-token pk_xxxxx
```

**Step 3: Verify**
```bash
cupt status       # Shows workspace name
cupt teams        # Shows available teams
```

**Step 4: List tasks**
```bash
cupt list --today --json           # Today's tasks as JSON
cupt list --tag ai_ready --json    # Tasks tagged ai_ready
```

**Step 5: Complete a task safely**
```bash
cupt statuses <task_id>            # Discover status schema first
cupt done <task_id> --dry-run      # Preview — no write
cupt done <task_id> --note "done"  # Actual completion
```

---

## CLI vs MCP Feature Coverage

| Feature | cupt CLI | Official MCP |
|---------|---------|-------------|
| List tasks (date/tag filters) | ✓ (fast, server-side) | ✓ |
| Task details | ✓ (--offline cache) | ✓ |
| Mark complete | ✓ (auto-resolves status) | ✓ |
| Notes/comments | ✓ | ✓ |
| Time tracking | ✓ (start/stop/add) | ✓ |
| Tags | ✓ | ✓ |
| Task context (parent/siblings) | ✓ | — |
| Status schema discovery | ✓ (`cupt statuses`) | — |
| Dry-run | ✓ (`--dry-run`) | — |
| Offline mode | ✓ (`--offline`) | — |
| **Documents** | — | **✓** |
| **Goals/OKRs** | — | **✓** |
| **Bulk create 5+** | — | **✓** |
| **Webhooks** | — | **✓** |
| **Chat** | — | **✓** |
| **Custom views** | — | **✓** |
| **Audit logs** | — | **✓ (Enterprise)** |

---

## Structure

```
mcp-click-up/
├── SKILL.md                    # Core skill: 8 sections + routing pseudocode
├── README.md                   # This file
├── INSTALL_GUIDE.md            # Step-by-step install with validation gates
├── graph-metadata.json         # Skill graph registration
├── scripts/
│   └── install.sh              # Embedded install: cupt + MCP config snippet
├── references/
│   ├── cupt_commands.md        # Full cupt reference + agent patterns
│   ├── mcp_tools.md            # 46 official MCP tools + invocation
│   └── troubleshooting.md     # Error resolution guide
├── examples/
│   ├── README.md
│   ├── task-queue-workflow.sh  # Process tagged work queue
│   └── time-tracking-workflow.sh  # Timer workflow
├── manual_testing_playbook/    # 5-phase testing guide
└── changelog/
    └── v1.0.0.0.md
```

---

## Critical Agent Rules

These rules prevent the most common errors when using ClickUp via AI agents:

1. **Never hardcode status names** — each ClickUp list has its own status schema. Always run `cupt statuses <id>` first.
2. **Always dry-run before batch completion** — `cupt done <id> --dry-run` is free; reversing wrong completions is not.
3. **Empty results are not errors** — `cupt list` returning 0 tasks is valid. Check tag spelling, try `--all`, verify team names.
4. **Use `--json` for programmatic processing** — all cupt read commands support `--json`.
5. **Use `cupt context <id>`** before acting to understand parent/sibling relationships.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `command not found: cupt` | Not installed | `bash scripts/install.sh` |
| `AuthError: No credentials` | Not authenticated | `cupt auth` |
| `cupt done` uses wrong status | List status varies | Run `cupt statuses <id>` first |
| `cupt list --team` is slow | Client-side filter | Add `--tag X` to reduce results |
| MCP connection failure | Missing env vars | Add `CLICKUP_API_KEY` + `CLICKUP_TEAM_ID` to opencode.json |

Full guide: `references/troubleshooting.md`

---

## Related Documents

- `SKILL.md` — Full routing rules and agent invariants
- `INSTALL_GUIDE.md` — Installation with validation checkpoints
- `references/cupt_commands.md` — Complete cupt command reference
- `references/mcp_tools.md` — Official MCP tool catalog

---

## Version History

See `changelog/v1.0.0.0.md`
