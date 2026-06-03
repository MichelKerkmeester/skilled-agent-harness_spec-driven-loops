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
---

# mcp-click-up

ClickUp task management for AI agents via **cupt CLI** (primary) and **official ClickUp MCP** (secondary).

---

## 1. OVERVIEW

`mcp-click-up` gives AI agents a structured, safe interface to ClickUp. The skill routes each operation to the correct tool based on what the agent needs to do — not based on which tool happens to be available.

- **cupt** — daily task operations: list, show, complete, note, time, tag
- **Official ClickUp MCP** — advanced operations: documents, goals, bulk create, webhooks

Unlike an availability-based fallback, these tools cover **different ClickUp surfaces**. cupt cannot create documents; the MCP has no dry-run or per-list status resolution. Routing by operation prevents misuse of either tool.

| Key Stat | Value |
|----------|-------|
| Primary CLI | `cupt` v0.7.1+ (Python, `pipx install cupt`) |
| Secondary | Official ClickUp MCP (`github.com/clickup/clickup-mcp-server`) |
| Routing model | Operation-based (not availability-based) |
| Embedded install | `scripts/install.sh` — cupt via pipx/pip + MCP config snippet |
| Agent safety | Dry-run, per-list status resolution, `--json` output |
| MCP tools | 46 official tools across tasks, docs, goals, webhooks |

---

## 2. QUICK START

**Step 1: Install cupt**
```bash
bash .opencode/skills/mcp-click-up/scripts/install.sh
```

**Step 2: Authenticate**
```bash
cupt auth                            # Interactive wizard (OAuth or token)
# OR direct token:
cupt config --api-token pk_xxxxx
```

**Step 3: Verify**
```bash
cupt status      # Shows workspace name + user
cupt teams       # Shows available teams
```

**Step 4: List tasks**
```bash
cupt list --today --json             # Today's tasks as JSON
cupt list --tag ai_ready --json      # Tasks tagged ai_ready
```

**Step 5: Complete a task safely**
```bash
cupt statuses <task_id>              # Discover list's status schema FIRST
cupt done <task_id> --dry-run        # Preview resolved status — no write
cupt done <task_id> --note "done"    # Actual completion
```

---

## 3. FEATURES

### 3.1 Feature Highlights

**Operation-based routing** — 14 operations mapped to the right tool. Agents don't need to decide; the routing table in SKILL.md §2 covers every case.

**Embedded install** — `scripts/install.sh` installs cupt via pipx (or pip fallback), verifies with `cupt --version`, and prints the official MCP config snippet. No manual steps.

**Agent safety rules** — critical invariants that prevent the most common ClickUp agent errors:

| Rule | Why It Matters |
|------|---------------|
| Always `cupt statuses <id>` before `cupt done` | Each list has its own status schema — "Done" in one list may not exist in another |
| Always `cupt done <id> --dry-run` before batch | Reversing wrong completions requires manual work; dry-run is free |
| Use `--json` for programmatic output | All cupt read commands support it — never parse human-readable output |
| Treat empty `cupt list` as valid | An empty queue is not an error; check tag spelling and try `--all` before escalating |
| `cupt context <id>` before acting | Reveals parent and sibling relationships to avoid orphaning work |

**Dry-run safety** — `cupt done <id> --dry-run` shows the resolved status before writing. Required before batch operations.

**Offline support** — cupt caches responses locally. Use `--offline` to operate without network after a `cupt prefetch`.

### 3.2 Feature Reference

| Feature | cupt CLI | Official MCP | Notes |
|---------|---------|-------------|-------|
| List tasks (date/tag filters) | ✓ server-side | ✓ | cupt has richer filter flags |
| Task details | ✓ + `--offline` | ✓ | cupt has local cache |
| Mark complete | ✓ auto-resolves status | ✓ explicit status | cupt is safer for agents |
| Notes / comments | ✓ | ✓ | cupt simpler API |
| Time tracking | ✓ start/stop/add | ✓ | Both work; cupt simpler |
| Tags | ✓ | ✓ | Both work |
| Task context (parent/siblings) | ✓ | — | cupt only |
| Status schema discovery | ✓ `cupt statuses` | — | cupt only |
| Dry-run completion | ✓ `--dry-run` | — | cupt only |
| Offline mode | ✓ `--offline` | — | cupt only |
| **Documents** | — | **✓** | MCP only |
| **Goals / OKRs** | — | **✓** | MCP only |
| **Bulk create 5+** | — | **✓** | MCP only |
| **Webhooks** | — | **✓** | MCP only |
| **Chat** | — | **✓** | MCP only |
| **Custom views** | — | **✓** | MCP only |
| **Audit logs** | — | **✓ (Enterprise)** | MCP only |

See `feature_catalog/FEATURE_CATALOG.md` for the full feature inventory with examples.

---

## 4. STRUCTURE

```
mcp-click-up/
├── SKILL.md                         # Runtime: 8 sections + routing pseudocode
├── README.md                        # This file — human orientation
├── INSTALL_GUIDE.md                 # Phase-based install with validation
├── graph-metadata.json              # Skill graph registration + intent signals
├── scripts/
│   └── install.sh                   # Embedded: cupt install + MCP config snippet
├── mcp-servers/
│   ├── clickup-mcp/
│   │   └── package.json             # Official ClickUp MCP — npm install to vendor
│   └── clickup-cli/
│       ├── requirements.txt         # cupt pip pin (cupt>=0.7.1)
│       └── setup.sh                 # cupt install via pipx/pip
├── references/
│   ├── cupt_commands.md             # cupt full command reference + agent patterns
│   ├── mcp_tools.md                 # 46 official MCP tools + invocation
│   └── troubleshooting.md          # Error resolution (auth, status, MCP, team filter)
├── examples/
│   ├── README.md
│   ├── task-queue-workflow.sh       # Tagged work queue: inspect → dry-run → complete
│   └── time-tracking-workflow.sh   # Timer: start / stop / log / status
├── feature_catalog/
│   ├── FEATURE_CATALOG.md           # Root catalog: all 96 features indexed
│   └── NN--category/NN-feature.md  # Per-feature files
├── manual_testing_playbook/         # 5 phases, 16 test files
└── changelog/
    └── v1.0.0.0.md
```

| Path | Purpose |
|------|---------|
| `SKILL.md` | Loaded at dispatch time; contains routing logic for the runtime |
| `references/` | Loaded on demand by routing pseudocode based on detected intent |
| `scripts/install.sh` | Run once by user or agent to set up cupt + print MCP config |
| `mcp-servers/clickup-mcp/` | Official ClickUp MCP — `npm install` to vendor `@clickup/mcp-server` |
| `mcp-servers/clickup-cli/` | cupt CLI — `bash setup.sh` to install via pipx/pip |
| `feature_catalog/` | Human-facing capability inventory for operators and agents |
| `manual_testing_playbook/` | Step-by-step verification guide per feature area |

---

## 5. CONFIGURATION

### cupt Configuration

```bash
# After running install.sh and authenticating:
cupt config --workspace-id 1234567   # Set default workspace (from cupt status)
cupt config --default-list 9876543   # Set default list (optional)
cupt config --show                   # Review current config
```

Config is stored at `~/.cupt/config.yaml` (encrypted with the cryptography library).

### Official ClickUp MCP Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CLICKUP_API_KEY` | Yes | Personal API Token (`pk_xxxxx`) |
| `CLICKUP_TEAM_ID` | Yes | Workspace ID (numeric — from `cupt status`) |

Get your workspace ID: `cupt status` shows it as "Workspace ID".

### MCP Platform Configuration

ClickUp runs through Code Mode, so add it to `.utcp_config.json` as a `manual_call_templates` entry named `clickup_official` (not to `opencode.json` — that file only registers `code_mode`):
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

See `INSTALL_GUIDE.md §4` for Claude Code and Claude Desktop platform variants.

---

## 6. USAGE EXAMPLES

### Scenario 1: Process a tagged work queue (cupt)

An AI agent picks up tasks tagged `ai_ready`, processes them, and hands off to review.

```bash
# Fetch the queue
cupt list --tag ai_ready --all --json

# For each task: inspect → dry-run → complete → handoff
cupt show TASK_ID --notes --json
cupt statuses TASK_ID
cupt done TASK_ID --dry-run
cupt done TASK_ID --note "Processed by AI agent"
cupt tag remove TASK_ID ai_ready
cupt tag add TASK_ID needs_review
```

Full script: `examples/task-queue-workflow.sh`

### Scenario 2: Time tracking a development task (cupt)

```bash
cupt time start TASK_ID     # Begin work
# ... do work ...
cupt time stop              # Log elapsed time automatically
cupt time status            # Confirm no orphaned timer
```

Full script: `examples/time-tracking-workflow.sh`

### Scenario 3: Create a sprint document (official MCP via Code Mode)

```typescript
await call_tool_chain({
  code: `
    const result = await clickup_official.clickup_official_create_document({
      name: "Sprint 42 Notes",
      parent: { type: 4, id: "LIST_ID" },
      content: "# Sprint 42\n\n## Goals\n...",
      content_format: "markdown"
    });
    return result;
  `
});
```

---

## 7. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| `command not found: cupt` | Not installed or PATH issue | `bash scripts/install.sh` then `pipx ensurepath` |
| `AuthError: No credentials` | Not authenticated | `cupt auth` or `cupt config --api-token pk_xxx` |
| `cupt done` sets wrong status | List has non-standard status schema | Run `cupt statuses <id>` first; use `--dry-run` to verify |
| `cupt list --team X` is slow | Team filter is client-side | Combine with `--tag X` to narrow results |
| MCP connection failure | Missing env vars or wrong values | Verify `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` in platform config |
| MCP `tool not found` | Wrong tool name format | Use `clickup_official.clickup_official_{tool_name}` (e.g. `clickup_official.clickup_official_create_task`) |

Full guide: `references/troubleshooting.md`

---

## 8. FAQ

**Q: When should I use cupt vs the official MCP?**
Route by operation: cupt for daily task ops (list, done, note, time, tag), MCP for advanced features (documents, goals, bulk create, webhooks). See the Feature Reference table above.

**Q: Do I need both cupt and the MCP installed?**
No. cupt alone covers all daily task management. Install the MCP only if you need documents, goals, or bulk operations.

**Q: How does cupt handle status names that vary by list?**
`cupt done` automatically resolves the correct closed status for each task's list. Use `cupt statuses <id>` to preview the schema, and always `cupt done <id> --dry-run` before batch operations.

**Q: What if `cupt list` returns an empty array?**
An empty result is valid — not an error. Check tag spelling, try `--all` to include team tasks, and verify team names via `cupt teams`. Never fabricate tasks for an empty queue.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| `SKILL.md` | Runtime routing rules, agent invariants, quick reference cheat sheet |
| `INSTALL_GUIDE.md` | Phase-based install with `phase_N_complete` validation checkpoints |
| `references/cupt_commands.md` | Complete cupt command reference with `--json` variants and agent patterns |
| `references/mcp_tools.md` | 46 official MCP tools: HIGH/MEDIUM/LOW priority + call_tool_chain invocation |
| `references/troubleshooting.md` | Diagnostic steps for auth, status, team filter, and MCP failures |
| `feature_catalog/FEATURE_CATALOG.md` | Full cupt + MCP feature inventory — 96 features, 13 categories |

---

## Version History

See `changelog/v1.0.0.0.md` for the initial release notes and architecture decisions.
