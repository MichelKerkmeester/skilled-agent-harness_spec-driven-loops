---
title: mcp-click-up
description: ClickUp orchestrator that drives task management from an agent through a fast cupt CLI for daily task ops and the official ClickUp MCP for documents, goals and bulk work.
trigger_phrases:
  - "clickup"
  - "cupt"
  - "task management"
  - "time tracking"
  - "click up"
version: 1.0.0.7
---

# mcp-click-up

> Manage ClickUp tasks from your agent or terminal, with a fast CLI for daily task ops that carries a dry-run safety net and the official MCP for documents, goals and bulk work.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | ClickUp task operations (list, complete, note, time, tag), documents, goals and bulk creates from an agent or terminal |
| **Invoke with** | "clickup", "cupt", "task management", "work queue", "time tracking" or auto-routing on ClickUp keywords |
| **Works on** | Any ClickUp workspace, cupt uses a Personal API Token, the MCP path uses `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID` env vars, cupt works offline after `cupt prefetch` |
| **Produces** | Task completions with status resolution, time logs, tagged queues and structured documents via two operation-routed paths |

---

## 2. OVERVIEW

### Why This Skill Exists

Managing ClickUp from an agent is risky when every small action hits the heavyweight API. A "mark this done" or "list my tasks today" wants one fast command. Each ClickUp list carries its own status schema, so a blind completion writes the wrong status and that is hard to reverse. Bulk work and documents need the full API surface, but routing daily reads and writes through it wastes tokens and loses the dry-run safety net. A single tool does not solve both problems, so this skill gives you two paths and routes between them.

### What It Does

This skill drives ClickUp through two complementary paths. The `cupt` CLI is fast and token-efficient for daily task operations: list, show, mark complete, add notes, time tracking and tags. It resolves per-list status schemas automatically and runs a dry-run preview before any completion. The official ClickUp MCP handles documents, goals, OKRs, bulk task creation, webhooks and audit logs through Code Mode. An operation-based routing rule picks the right path for the work at hand. A daily task completion never pays the MCP overhead, and a bulk document operation never loses the full API surface.

The MCP transport is owned by `mcp-code-mode`. This skill consumes Code Mode as a provider. It does not implement the transport. For the generated application code that integrates ClickUp, `sk-code` owns the standards and tests.

---

## 3. QUICK START

**Step 1: Install cupt and authenticate.**

```bash
bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh
# Expected: [mcp-click-up] ✓ cupt X.Y.Z installed
# Also prints the MCP config snippet for Phase 2 below

cupt auth
# OR:
cupt config --api-token pk_YOUR_TOKEN_HERE
```

**Step 2: Verify and run a daily task operation.**

```bash
cupt --version
# Expected: cupt X.Y.Z

cupt status
# Expected: Workspace: Your Workspace Name  (ID: 1234567)

cupt list --today --json
# Expected: [] or valid JSON task array (both mean success)

cupt statuses TASK_ID
# Expected: ordered list of available statuses for the task's list

cupt done TASK_ID --dry-run
# Expected: Would mark TASK_ID as "Done" (no write performed)
```

**Step 3: MCP path with Code Mode.**

Code Mode servers are configured in `.utcp_config.json`, not `opencode.json` (that file is for native, non-Code-Mode MCP tools). The ClickUp manual is `clickup_official`, launched over stdio (`npx -y @clickup/mcp-server`, authenticated with `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` env vars), so run document and goal operations inside `call_tool_chain({ code })`:

```typescript
call_tool_chain({
  code: `
    // Tool naming: clickup_official.clickup_official_{tool_name}
    const result = await clickup_official.clickup_official_create_document({
      name: "Sprint Notes",
      parent: { id: "SPACE_ID", type: "4" },
      visibility: "PRIVATE",
      create_page: true
    });
    return result;
  `
});
// Expected: { success: true, document_id: "...", document_url: "https://app.clickup.com/..." }
```

The printed MCP config snippet from `install.sh` has the exact JSON block; it sets the `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` env vars. Restart your AI client after applying it.

---

## 4. HOW IT WORKS

### The Operation Router

The skill reads your request, scores it against weighted intent signals and loads only the reference files relevant to the chosen path. A keyword such as "list", "done", "note" or "tag" routes to the cupt CLI. A keyword such as "document", "goal", "okr" or "bulk" routes to the official MCP. Eleven daily operations go to cupt. Six heavier operation classes are MCP-only. If cupt is not installed, the router loads the install guide first.

### The cupt CLI Path

cupt is a Python CLI purpose-built for agent-driven ClickUp workflows. It talks to the ClickUp REST API v2 and writes human-readable output with a `--json` flag for machine parsing. It resolves per-list status schemas automatically, so you write `cupt done <id>` without hardcoding a status name. The `--dry-run` flag on `cupt done` previews the resolved status and the selected target without writing, which is the safety net that enables batch completions. The `--offline` flag serves a local cache populated by `cupt prefetch`, so you can operate without network access.

```bash
cupt list --today --json | head -5
# [{"id":"abc123","name":"Fix login bug","status":{"status":"in progress",...
```

cupt covers every daily task operation: list with server-side `--tag` filtering (fast) and client-side `--team` filtering (slow on large workspaces), full task detail with `cupt show`, notes and comments with `cupt note` and `cupt notes`, a full time-tracking lifecycle with `cupt time start`, `stop`, `add` and `status`, tag management and task context discovery with `cupt context` and `cupt statuses`.

### The Official MCP Path

The official server is ClickUp's `@clickup/mcp-server`, registered through Code Mode: `.utcp_config.json` defines the `clickup_official` manual, launched over stdio via `npx -y @clickup/mcp-server` and authenticated with the `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` env vars. It exposes tools across task CRUD, documents, time tracking, chat, reminders and workspace structure. You reach it through Code Mode with `call_tool_chain({ code: "..." })`. The callable form is `clickup_official.clickup_official_{tool_name}`, for example `clickup_official.clickup_official_get_task`, `clickup_official.clickup_official_filter_tasks`, `clickup_official.clickup_official_create_document`. Always confirm the exact name with `tool_info()` before calling, do not guess it from the tool's description.

The MCP path is the only surface for documents, goals and OKRs, bulk creates of five or more tasks, webhooks, chat and audit logs. Many daily operations also have an MCP fallback tool, but the routing rule keeps daily writes on cupt because the MCP has no dry-run equivalent. Use the MCP when you need its exclusive surface or when you are already in a Code Mode flow with other tools.

### Agent Safety Invariants

cupt ships built-in guardrails that prevent the most dangerous ClickUp mistakes. The skill enforces them at the routing level and in every example workflow.

Always run `cupt statuses <id>` before any `cupt done` call. Each ClickUp list defines its own status schema. "Done" in one list may be "Complete" or "Closed" in another. cupt resolves this automatically, but you must discover the schema first so you know what will happen.

Always run `cupt done <id> --dry-run` before a batch completion, one dry-run per task. Batch status errors are hard to reverse. A dry-run costs nothing and confirms the resolved status and the selected target before the write happens.

Always use `--json` for programmatic reads. Never hardcode status names across tasks. Never use the community `@krodak/clickup-cli` (`cu` command), which conflicts with the Unix `cu` command and is not supported by this skill. Never auto-modify `opencode.json`. Print the MCP config snippet for the user to apply. Never fabricate tasks when `cupt list` returns empty. An empty queue is valid and common.

### Preflight Check

Start every ClickUp session with these two commands. They confirm the tool is installed and authenticated before any work begins.

```bash
cupt --version && cupt status
# Expected: cupt X.Y.Z followed by workspace name and authenticated user
```

### Example Workflows

The skill ships two production scripts under `examples/`. Each doubles as an end-to-end workflow and a CI-ready verification gate.

`task-queue-workflow.sh [--tag X] [--dry-run]` processes a tagged work queue end to end. It runs a preflight check, fetches tasks with `cupt list --tag X --all --json`, inspects each task with `cupt show --notes --json` and `cupt context`, discovers per-list status schemas with `cupt statuses`, dry-runs every completion, then completes and hands off by removing the processing tag and adding a `needs_review` tag with a note. An empty queue exits cleanly. It returns exit code 0 on success or empty queue and exit code 1 on preflight failure.

`time-tracking-workflow.sh {start <id>|stop|log <id> <dur>|status}` manages the full timer lifecycle. `start` begins tracking on a task and fails if a timer is already running. `stop` ends the current timer and logs the elapsed time. `log` accepts durations such as `1h30m`, `45m` or `2h` for retroactive entries. `status` reports the running timer or confirms none is active. The script detects orphaned timers on exit and warns you to clean them up.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when you need to list, complete, annotate or time-track ClickUp tasks from an agent. Reach for the cupt CLI when the work is a single daily operation. Reach for the MCP path when you need documents, goals, bulk creates, webhooks or audit logs. Reach for the example scripts when you want a pre-built work queue processor or time-tracking automation.

cupt and the MCP cover different operation sets by design. Neither is a drop-in for the other. For a "mark this task done" or "what is on my plate today", cupt is the only right answer. For "create a sprint retro document" or "bulk-create 10 tasks from this spec", only the MCP path will work.

This skill uses only ClickUp's official MCP server (`@clickup/mcp-server`, launched over stdio). It never reaches for a community MCP server. The MCP transport and the `call_tool_chain()` invocation are owned by `mcp-code-mode`. This skill orchestrates the ClickUp surface. It does not implement the transport.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the MCP transport. This skill consumes Code Mode as a provider and calls ClickUp tools through `call_tool_chain()`. |
| `sk-code` | Owns application-code standards and tests. This skill operates on ClickUp data that sk-code may produce or consume. |
| `mcp-chrome-devtools` | Structural sibling. Both skills own a two-path orchestrator pattern (CLI + MCP) with operation-based routing. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: cupt` | cupt not installed or PATH missing | Run `bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh` then `pipx ensurepath && source ~/.zshrc` |
| `AuthError: No credentials` | Not authenticated | Run `cupt auth` or `cupt config --api-token pk_YOUR_TOKEN` |
| `cupt status` shows 401 | Expired or revoked token | Run `cupt logout && cupt auth` to refresh credentials |
| `cupt done` wrote the wrong status | The list's closed status differs from the default | Run `cupt statuses <id>` before every completion to discover the schema |
| `cupt list --team X` is slow (>20s) | Team filter is client-side on large workspaces | Add `--tag Y` to narrow the result set with a server-side filter |
| MCP: connection fails | `clickup_official` manual in `.utcp_config.json` missing or not launched via `npx -y @clickup/mcp-server` | Fix the manual, set `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID`, and reconnect |
| MCP: tool not found | Wrong tool name | Confirm with `tool_info()` first, the callable form is `clickup_official.clickup_official_{tool_name}` |

---

## 7. FAQ

**Q: When do I use cupt versus the official MCP?**

A: Use cupt for daily task operations: list, show, mark complete, add notes, time tracking and tags. Use the official MCP for documents, goals, OKRs, bulk creates of five or more tasks, webhooks and audit logs. If cupt is available and the operation is in its surface, cupt wins because it is faster and has a dry-run safety net. The MCP has no dry-run equivalent, so daily writes stay on cupt.

**Q: Why can I not just use `cupt done` on every task in a batch?**

A: Every ClickUp list defines its own status schema. "Done" in one list may not exist in another. Running `cupt done` on a batch without checking each task's statuses first can write the wrong status on some tasks, and reversing a batch of wrong status writes is painful. Always run `cupt statuses <id>` once per task, then `cupt done <id> --dry-run`, then the real write.

**Q: How do I set up the MCP for ClickUp documents and goals?**

A: Run `bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh`. It prints a manual for `.utcp_config.json` (Code Mode's config, not `opencode.json`) with server key `"clickup_official"`, launched via `npx -y @clickup/mcp-server` with `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` set. Paste the snippet in, set the two env vars, and restart your AI client. Full instructions are in `references/install_guide.md`.

**Q: What is the difference between `@krodak/clickup-cli` (`cu`) and cupt?**

A: `@krodak/clickup-cli` is a different tool that installs the `cu` binary. It conflicts with the Unix `cu` command and is not supported by this skill. This skill uses cupt (`pipx install cupt`), a Python CLI purpose-built for agent-driven workflows with built-in status resolution, dry-run previews and offline support. The two tools share nothing beyond the ClickUp API target.

**Q: My work queue came back empty. Is that an error?**

A: No. An empty `cupt list` result is valid. Before you escalate, check the tag spelling (tags are case-sensitive), try `cupt list --all --json` to see all tasks on the workspace and verify team names with `cupt teams`. If those checks confirm the queue is genuinely empty, report it clearly and do not fabricate tasks.

---

## 8. VERIFICATION

The skill ships a manual testing playbook and two example scripts that double as verification gates.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-tooling/mcp-click-up/README.md --type readme` reports zero issues |
| cupt health | `cupt --version && cupt status && cupt list --today --json | python3 -c "import sys,json; json.load(sys.stdin); print('JSON valid')"` all pass with no errors |
| MCP health | Confirm `clickup` tools appear in `list_tools()` and a `clickup_official.clickup_official_get_workspace_hierarchy` call via `call_tool_chain(...)` returns workspace data |
| Example scripts | Run `task-queue-workflow.sh --dry-run` with a valid tag and confirm exit code 0, then run `time-tracking-workflow.sh status` and confirm no errors |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the two-path operation router and the full agent safety invariants |
| [`references/install_guide.md`](./references/install_guide.md) | Step-by-step install for cupt and the official MCP server with validation checkpoints |
| [`references/cupt_commands.md`](./references/cupt_commands.md) | Complete cupt command reference with `--json` variants and agent patterns |
| [`references/mcp_tools.md`](./references/mcp_tools.md) | Official ClickUp MCP tool catalog with priority tiers and `call_tool_chain()` invocation |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Error reference, diagnostic sequence and recovery steps for auth, status and MCP issues |
| [`examples/README.md`](./examples/README.md) | Guide to the two production scripts and common workflow patterns |
| [`scripts/install.sh`](./scripts/install.sh) | Automated cupt installer that prints the MCP config snippet |
