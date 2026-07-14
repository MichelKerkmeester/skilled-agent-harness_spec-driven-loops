---
title: mcp-click-up
description: Routes ClickUp between cupt CLI (daily ops) and official MCP (docs, goals, bulk), with operation-based routing and agent safety invariants.
trigger_phrases:
  - "clickup"
  - "cupt"
  - "task management"
  - "time tracking"
  - "click up"
---

# mcp-click-up

> Drive ClickUp from your agent or terminal with a fast CLI for daily task ops and the official MCP for documents, goals and bulk work.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Task listing, completion, notes, time tracking, tags, documents, goals and bulk operations from an agent or terminal |
| **Invoke with** | "clickup", "cupt", "task management", "time tracking" or auto-routing on ClickUp keywords |
| **Works on** | ClickUp workspaces through a `cupt` CLI (primary) and the official `@clickup/mcp-server` via Code Mode (secondary) |
| **Produces** | Task lists, task details, completion confirmations, time logs, notes, tags, documents and goal data |

---

## 2. OVERVIEW

### Why This Skill Exists

Managing ClickUp from an agent is risky and slow if you reach for the heavyweight API on every small action. A "mark this done" or "list my tasks today" wants one fast command. Each ClickUp list carries its own status schema, so a blind completion writes the wrong status and that is hard to reverse. Bulk work and documents need the full API, but routing daily reads and writes through it wastes tokens and loses the dry-run safety net. You need two paths: a fast CLI for daily reads and writes with a preview step, and the official MCP for the heavy operations that cupt cannot cover.

### What It Does

This skill drives ClickUp through two complementary paths. The `cupt` CLI handles daily task ops: listing, showing, completing, noting, timing, tagging, context and status discovery. The official ClickUp MCP handles documents, goals, bulk creates, webhooks, chat and audit logs. A routing rule picks the right path for each operation. Safety invariants force a status check and a dry-run preview before any completion, so you never write the wrong status by accident.

---

## 3. QUICK START

**Step 1: Install and authenticate.**

```bash
bash .opencode/skills/mcp-click-up/scripts/install.sh
```

This runs `pipx install cupt` (falling back to `pip install --user cupt`), then prints the MCP config snippet for your platform. It never writes config files. After install:

```bash
cupt auth
# Follow the interactive prompts to enter your API token

cupt status
# Expected: workspace name, authenticated user, cupt version
```

**Step 2: List your tasks and complete one with a dry-run.**

```bash
cupt list --today
# Expected: tasks due today, or "(no tasks)" if the queue is empty

cupt done <task_id> --dry-run
# Expected: shows the status that would be written, without changing anything
```

**Step 3: Call the official MCP through Code Mode.**

Register the `@clickup/mcp-server` in your platform config (`opencode.json` under `mcpServers`) with server key `"clickup"` and env vars `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`. Then call tools through Code Mode:

```typescript
call_tool_chain([
  { tool: "clickup.clickup_search_tasks", input: { "team_id": "1234567", "status": ["to do"] } }
])
// Expected: returns matching tasks as a typed object array
```

---

## 4. HOW IT WORKS

### Operation Routing

The skill routes by operation type. Eleven daily operations go to cupt: list/filter, task details, mark complete, add note, read comments, start/stop timer, log time, add tag, remove tag, task context and discover statuses. Six heavier operation classes are MCP-only: documents, goals and OKRs, bulk create (5+ tasks), webhooks, chat and audit logs. Many daily operations also have an MCP fallback tool, but the routing rule keeps daily ops on cupt for speed and dry-run safety. The MCP has no dry-run equivalent, which is why daily writes stay on the CLI.

### The cupt Path

`cupt` is a Python CLI purpose-built for agent-driven workflows. Every read command supports `--json` for machine-readable output. Completion uses automatic per-list status resolution so you never need to hardcode status names. The `--offline` flag uses a local cache for operation without network access. A typical agent workflow runs `cupt list --json` to fetch tasks, `cupt show <id> --notes --json` to inspect each one, `cupt done <id> --dry-run` to preview the completion, then `cupt done <id>` to write it.

### The MCP Path

The official ClickUp MCP server registers in your platform config under the server key `"clickup"`. Tool naming follows the Code Mode convention: `clickup.clickup_{tool_name}` (all lowercase, underscores). You call tools through `call_tool_chain()` with the array form:

```typescript
call_tool_chain([
  { tool: "clickup.clickup_create_document", input: { "team_id": "1234567", "name": "Sprint Notes" } }
])
```

This path covers operations cupt cannot perform. Documents, goals, bulk creates, webhooks, chat and audit logs all live here.

### Safety Invariants

Before any completion, run `cupt statuses <id>` to discover the correct status for that list. Then run `cupt done <id> --dry-run` to preview what would be written. Never hardcode status names across tasks. The MCP has no dry-run, so daily writes stay on cupt. Never bulk-complete without a per-task dry-run. Always run `cupt --version && cupt status` as a preflight before starting work. Treat an empty `cupt list` as valid (the queue might be clear). Run `cupt context <id>` before acting on a task you have not seen.

### Example Workflows

The skill ships two production scripts under `examples/`.

`task-queue-workflow.sh [--tag X] [--dry-run]` processes a tagged queue: preflight (checks cupt, jq and auth), fetch (`cupt list --tag X --all --json`), inspect each task (`cupt show --notes --json`, `cupt context`, `cupt statuses`), dry-run every completion, then complete and hand off (removes the processing tag, adds `needs_review`, leaves a note). It prints phase-segmented output with a completed/failed summary and exits 0 on success or empty queue, 1 on preflight failure.

`time-tracking-workflow.sh {start <id>|stop|log <id> <dur>|status}` manages a timer with duration validation and orphan detection on exit.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when an agent needs to list, complete, note or time-track ClickUp tasks. Reach for it when you need documents, goals or bulk creates through the official MCP. Do not reach for it when you are writing application code (that is `sk-code`). Do not use the community `@krodak/clickup-cli` (`cu`) tool or community MCP servers. This skill uses only the official `@clickup/mcp-server`.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the MCP transport. This skill registers ClickUp as a Code Mode provider and calls tools through `call_tool_chain()`. |
| `sk-code` | Owns application-code standards and tests. This skill orchestrates ClickUp; it does not generate code. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: cupt` | CLI not installed or pipx bin not on PATH | Run `bash .opencode/skills/mcp-click-up/scripts/install.sh` and verify PATH with `pipx environment` |
| `Not authenticated` / `403` | No API token or token expired | Run `cupt auth` or `cupt config --api-token pk_xxx`, then `cupt status` to confirm |
| Wrong status written on completion | Skipped `cupt statuses` or status names differ per list | Always run `cupt statuses <id>` before `cupt done`. Each list has its own status schema |
| `clickup.clickup_*` tools not found | MCP server not registered or env vars missing | Confirm `"clickup"` entry exists in `opencode.json` `mcpServers` with `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` set. Restart the session |
| `--json` output is empty | No tasks match the filter | Valid result. Treat an empty queue as data, not an error |
| `cupt done` writes the wrong status | Status resolution hit an edge case | Run `cupt statuses <id>` first and compare the dry-run output against the expected status name |

---

## 7. FAQ

**Q: When do I use cupt versus the MCP?**

A: Use cupt for daily task ops: listing, showing, completing, noting, timing and tagging. Use the MCP for documents, goals, bulk creates, webhooks, chat and audit logs. The routing rule in `SKILL.md` maps every operation to the right path.

**Q: Why does cupt need a dry-run before completion?**

A: Each ClickUp list carries its own status schema. A status named "Done" in one list might be "Closed" or "Complete" in another. `cupt done <id> --dry-run` shows you exactly which status would be written before you commit. The MCP has no equivalent, so daily writes stay on cupt.

**Q: Can I use the community ClickUp CLI or MCP server?**

A: No. This skill uses only the official `@clickup/mcp-server` and the `cupt` CLI. Community tools like `@krodak/clickup-cli` (`cu`) or `@taazkareem/clickup-mcp-server` are not supported.

**Q: How do I get the MCP config snippet?**

A: Run `bash .opencode/skills/mcp-click-up/scripts/install.sh --mcp-only`. It prints the snippet for your platform. The script never writes config files.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| CLI health | `cupt --version && cupt status` confirms install and auth |
| Task listing | `cupt list --json` returns a JSON array (or `[]` if the queue is empty) |
| Dry-run safety | `cupt done <id> --dry-run` shows the target status without writing |
| MCP health | `call_tool_chain([{ tool: "clickup.clickup_search_tasks", input: { "team_id": "..." } }])` returns task data |
| Example scripts | Run `examples/task-queue-workflow.sh --dry-run` and confirm it exits 0 |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the operation routing table and the safety invariants |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Phased install for cupt and the MCP server with validation checkpoints |
| [`references/cupt_commands.md`](./references/cupt_commands.md) | Complete cupt command reference with `--json` variants and agent patterns |
| [`references/mcp_tools.md`](./references/mcp_tools.md) | Official MCP tool reference with priority tiers and the `call_tool_chain()` pattern |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Auth, status, team-filter, MCP connection and PATH-conflict diagnostics |
| [`examples/README.md`](./examples/README.md) | Guide to the two production workflow scripts |
| [`scripts/install.sh`](./scripts/install.sh) | Embedded installer for cupt and the MCP config snippet |
