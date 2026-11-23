---
title: mcp-click-up
description: "Makes ClickUp task operations safe and fast from an agent or terminal: a lightweight CLI for daily task operations with a dry-run safety net and the official MCP for task creation, documents, search and workspace structure."
trigger_phrases:
  - "clickup"
  - "cupt"
  - "task management"
  - "time tracking"
  - "click up"
version: 1.1.9.0
---

# mcp-click-up

> ClickUp task work from your agent or terminal, with a fast path for daily operations and a dry run before every completion.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Daily ClickUp task work, task creation, documents and workspace search |
| **Invoke with** | "clickup" or "cupt" plus a task action or a work queue request |
| **Works on** | Any ClickUp workspace, through the `cupt` CLI or the hosted MCP |
| **Produces** | Completed tasks, time logs, notes, tags, new tasks and doc pages |

### What It Does

This skill drives ClickUp from an agent or a terminal through two paths. The `cupt` CLI handles daily task work: list, show, mark complete, add notes, time tracking and tags. It resolves the closed status for each list and previews a completion with `--dry-run` before writing. Where `cupt` has no command, or where a task's description carries markdown, the work goes to ClickUp's official MCP through Code Mode: task creation with markdown, documents, workspace search, lists and folders, task relations, chat and reminders.

`mcp-code-mode` owns the Code Mode call path. This skill only names the ClickUp tools you call inside it.

### Why This Skill Exists

Every ClickUp list defines its own status set, so a blind completion can write the wrong status. Reversing a batch of wrong writes needs manual repair. Daily reads through the full API also cost more tokens than a single command needs. This skill splits the work: one small CLI for daily operations and the official MCP for the operations the server covers.

### The ClickUp Operation Layer

| Capability | What the skill knows how to operate |
|---|---|
| **Task statuses** | resolve the closed status for each list automatically and preview each completion with `--dry-run` before any write |
| **Time tracking** | run the full timer lifecycle with `cupt time start`, `stop`, `add` and `status`, including retroactive logs |
| **Tasks and documents** | create tasks and document pages, then search the workspace through the official MCP. Goals, bulk creates, webhooks and checklist edits have no route |
| **Offline task reads** | serve cached task data with the `--offline` flag after `cupt prefetch` |

---

## 2. QUICK START

**Step 1: Install the CLI.** Run this from the `mcp-click-up` folder.

```bash
bash scripts/install.sh
```

Expected: the phase lines, the auth options, the `clickup_official` JSON manual, then `Installation Complete`. The script prints and never edits a config file.

**Step 2: Authenticate.** The wizard signs in with OAuth.

```bash
cupt auth
```

Expected: the wizard completes and stores credentials, which the next command confirms. For a Personal API Token instead, run `cupt config --api-token pk_YOUR_TOKEN_HERE`. A token typed on the command line lands in your shell history.

```bash
cupt status
```

Expected: `OK: Authenticated as: <user>` then `OK: Workspace: <workspace name>`.

**Step 3: Read the status schema, then dry-run the completion.**

```bash
cupt statuses TASK_ID
```

Expected: the list name, then one line per status, with `← closed status` marking the status that `cupt done` will apply.

```bash
cupt done TASK_ID --dry-run
```

Expected: `DRY RUN: Task "<name>" (<id>)`, the list name, `Resolved status: "<status>"` and `[No changes made]`.

**Step 4: Use the MCP path.** The `clickup_official` manual lives in `.utcp_config.json`, under `manual_call_templates`. It launches the hosted server over stdio with `npx -y mcp-remote https://mcp.clickup.com/mcp` and signs in with OAuth. Run task and document calls inside one Code Mode `code` string.

```typescript
(async () => {
  const doc = await clickup_official.clickup_official_clickup_create_document({
    name: "Sprint Notes",
    parent: { id: "SPACE_ID", type: "4" },
    visibility: "PRIVATE",
    create_page: false,
  });
  console.log(JSON.stringify(doc));
})();
```

Expected: one JSON line carrying `document_id` and `document_url`. Restart the AI client after you change the config.

---

## 3. HOW IT WORKS

A request names ClickUp or `cupt` and carries an action such as list, done, note, time or tag. The skill scores that wording, picks one intent and loads only the reference files the intent names. The intent also decides which surface runs the work. A request that matches no intent loads nothing and returns a disambiguation checklist instead.

```text
                              ┌──────────────────────────┐
                              │ ClickUp request          │
                              └─────────────┬────────────┘
                                            │
                                            ▼
                              ┌──────────────────────────┐
                              │ Score the intent         │
                              └─────────────┬────────────┘
                                            │
              ┬─────────────────────────────┼─────────────────────────────┬
              │                             │                             │
              ▼                             ▼                             ▼
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│ cupt CLI:                │  │ Official MCP: creation,  │  │ Install guide and        │
│ daily task work          │  │ documents, search        │  │ troubleshooting          │
└─────────────┬────────────┘  └─────────────┬────────────┘  └──────────────────────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
               ┌──────────────────────────┐
               │ Status, timer, note or   │
               │ tag change               │
               └──────────────────────────┘
```

### The Operation Router

The intent model has four entries. `CUPT_DAILY` and `MCP_ADVANCED` carry weight 5, `INSTALL` and `TROUBLESHOOT` carry 6. A troubleshooting score above 3 wins before any other intent, then an install score above 4. An MCP-only phrase such as "create a task", "subtask", "doc page" or "search clickup" pulls the request to the MCP even when a daily word like "list" also appears.

The operation table in `ROUTER.md` sends 11 daily operations to `cupt` and 6 operation classes to the MCP alone. Goals, bulk creates, webhooks, checklist edits, spaces, views, task templates, guests, user groups and audit logs have no route on either surface.

### Agent Safety Invariants

Each list owns its status set, so a completion has two steps. Read `cupt statuses <id>` first and dry-run each task in a batch before the first real write. Reversing a batch of wrong status writes is slow manual work in the ClickUp UI.

The CLI is a guardrail, not a guarantee. It exits 0 even when the API rejects a call and prints the failure as an `ERROR:` line on stderr, so read stderr as well as the exit code. Both example scripts treat that line as a failure.

- Use `--json` for every read an agent parses.
- Never reuse one status name across tasks.
- Never use the community `@krodak/clickup-cli`, whose `cu` binary collides with the Unix `cu` command.
- Print an MCP config snippet for the user to apply. Never edit a config file from an agent.
- Treat an empty queue as valid. Check the tag spelling, try `--all`, then confirm team names with `cupt teams`.

### The cupt CLI Path

`cupt` talks to the ClickUp REST API v2 and writes human-readable output, with `--json` on every read for machine parsing. It resolves the per-list status, so a completion needs no status name. `--dry-run` previews the resolved status and the target without writing. `--offline` serves a local cache that `cupt prefetch` fills, so reads work without a network.

`--tag` filters on the server and stays fast. `--team` filters on the client, walks every page and can run for many seconds on a large workspace. Combine the two when you need a team view.

```bash
cupt list --today --json
```

Expected: `[]` when nothing is due today, otherwise a JSON array whose objects carry `id`, `name`, `status` and `tags`.

The daily commands cover list, show, context, statuses, done, note, notes, time and tag, plus attachments and workspace summaries. `references/cupt-commands.md` holds the full table.

### The Official MCP Path

ClickUp's hosted server sits at `https://mcp.clickup.com/mcp`. The `clickup_official` manual reaches it over stdio through `npx -y mcp-remote` and signs in with OAuth 2.1 and PKCE, so there is no API key to paste. The last capture listed 67 tools. The server adds and renames tools, so confirm a name with `tool_info()` before the first call.

Code Mode names every tool `clickup_official.clickup_official_<tool>`. Every server tool name already starts with `clickup_`, so the callable form repeats the prefix: `clickup_official.clickup_official_clickup_create_task`. A name with one `clickup_` does not exist.

Wrap calls in an async function and print with `console.log`. This Code Mode rejects top-level `await`. A value returned from the async function comes back as `{}`.

The MCP has no dry-run and no offline mode, so daily writes stay on `cupt`. The MCP is the only route for a task whose description carries markdown, and for documents, workspace search, lists and folders, task relations, chat and reminders. Documents are read and written page by page. No tool deletes a page.

### Worked Examples

Two scripts under `examples/` double as end-to-end workflows and manual checks against a live workspace.

`task-queue-workflow.sh [--tag X] [--dry-run]` processes a tagged queue. It runs a preflight, fetches with `cupt list --tag X --all --json`, inspects each task with `cupt show --notes` and `cupt context`, reads each list's statuses, dry-runs every completion, then completes and hands off by swapping the processing tag for `needs_review` and leaving a note. An empty queue exits 0. The script exits 1 on invalid arguments, a failed preflight, a queue it cannot fetch or a task that fails to complete or hand off.

`time-tracking-workflow.sh {start <id>|stop|log <id> <dur>|status}` runs the timer lifecycle. `start` refuses when a timer is already running. `stop` ends the timer and logs the elapsed time. `log` takes a duration such as `1h30m`, `45m`, `2h` or `30m`. `status` reports the running timer or confirms that none is active.

### What Lives Where

| Path | What it holds |
|---|---|
| `SKILL.md` | Runtime rules, the markdown contract and the safety invariants |
| `ROUTER.md` | Intent model, resource map and the routing pseudocode |
| `INSTALL-GUIDE.md` | Install and auth steps with validation checkpoints |
| `references/` | cupt commands and MCP tools, plus the troubleshooting guide |
| `examples/` | The queue and timer scripts |
| `scripts/` | `install.sh`, `doctor.sh` and their notes |
| `feature-catalog/` | One card per CLI feature and MCP tool |
| `manual-testing-playbook/` | 37 scenarios, grouped by feature area, that validate the catalog |
| `mcp-servers/` | Install pointers for the CLI and the hosted server |

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when a request names ClickUp and asks for a task action, a work queue, time tracking, a ClickUp document or a workspace search. Pick the path by the operation, not by habit.

Use `cupt` for daily reads and writes: list a queue, read a task, mark it complete, add a note, run a timer, change a tag. Use the MCP when the operation has no CLI route: create a task whose description carries markdown, create a doc page, search the workspace, change a list or folder, link or move tasks, send a chat message or set a reminder.

The two surfaces are not interchangeable. `cupt add` creates a task but sends only the plain `description` field, so markdown in it renders as literal text. The MCP has no bulk create, so a batch of tasks needs one create call each.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the Code Mode call path. This skill names the ClickUp tools you call inside it. |
| `mcp-browser-use` | The browser hub. Its Chrome DevTools mode routes a fast CLI and an MCP path by operation, the same shape this skill follows, and its Aside and Chrome DevTools modes drive the signed-in doc page writes. |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: cupt` | The CLI is missing or its install folder is not on PATH | Run `bash scripts/install.sh`, then `pipx ensurepath && source ~/.zshrc` |
| `AuthError: No credentials` | No token is stored | Run `cupt auth` or `cupt config --api-token pk_xxx` |
| `cupt status` shows 401 | The token expired or was revoked | Run `cupt logout && cupt auth` |
| `cupt done` wrote the wrong status | The list's closed status differs from the name you expected | Read `cupt statuses <id>` before each completion |
| `cupt list --team X` is slow on a large workspace | The team filter runs on the client | Add `--tag Y` to cut the pages the filter walks |
| MCP: connection fails | The manual is missing, the stdio launch fails or the OAuth approval lapsed | Fix the `clickup_official` manual, then run the first-use readiness check in `references/mcp-tools.md` section 3 |
| MCP: tool not found | The callable name is wrong | Confirm it with `tool_info()`, then repeat the `clickup_` prefix |

`bash scripts/doctor.sh` reports the local environment without changing it. `references/troubleshooting.md` holds the longer diagnostic sequence.

---

## 6. FAQ

### Which path should I use, `cupt` or the MCP?

Use `cupt` for daily task work: list, show, complete, note, time and tag. Use the MCP for task creation, documents, workspace search, lists and folders, task relations, chat and reminders. When `cupt` covers the operation, it wins. It is a single command with a dry run.

### Why can I not run `cupt done` across a batch?

Every list defines its own statuses. A closed status named "Done" in one list can be "Complete" or "Closed" in another. `cupt done` resolves the status for the task, but a blind batch leaves you guessing what each write will change. Read `cupt statuses <id>`, dry-run each task, then write.

### How should I set up the MCP path?

Run `bash scripts/install.sh` from the packet folder. It prints the `clickup_official` manual for `.utcp_config.json`, which is Code Mode's config, not `opencode.json`. Paste the manual under `manual_call_templates` and restart the AI client. The first connection opens one ClickUp approval tab in your browser. The approval counts only while that connection waits, about a minute. `references/mcp-tools.md` section 3 walks through the check.

### What is `cu` and why should I avoid it?

`@krodak/clickup-cli` is a different project that installs a `cu` binary. On some Unix systems that name belongs to the serial `cu` command. This skill uses `cupt` and supports no other CLI. The two tools share the ClickUp API as a target and nothing else.

### My queue came back empty. Is that an error?

No. An empty `cupt list` result is valid. `task-queue-workflow.sh` exits 0 on it. Check the tag spelling, because tags are case-sensitive in some ClickUp configs. Try `cupt list --all --json` for a wider scope, then confirm team names with `cupt teams`. If the queue is still empty, report that. Never invent tasks.

---

## 7. VERIFICATION

The skill ships a manual testing playbook and two example scripts that double as checks against a live workspace.

| Check | How to run it |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-tooling/mcp-click-up/README.md --type readme` reports zero issues |
| Install state | `bash .skilled/skills/mcp-tooling/mcp-click-up/scripts/install.sh --check-only` reports the Python version and the installed `cupt` version, then stops without installing |
| Local environment | `bash .skilled/skills/mcp-tooling/mcp-click-up/scripts/doctor.sh` prints `✓` for each passing check and `!` for anything missing, then reports that it is read-only |
| cupt health | `cupt --version && cupt status && cupt list --today --json` prints the version and the two `OK:` lines, then a JSON array |
| MCP health | `list_tools()` lists `clickup_official.*` entries and `clickup_official.clickup_official_clickup_get_workspace_hierarchy` returns the workspace's spaces |
| Example scripts | `bash examples/task-queue-workflow.sh --dry-run` exits 0, then `bash examples/time-tracking-workflow.sh status` reports the timer state |

`manual-testing-playbook/manual-testing-playbook.md` holds the 37 scenarios, grouped by feature area, that validate the catalog.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime rules, the markdown contract and the full safety invariants |
| [`ROUTER.md`](./ROUTER.md) | Intent model, resource map and the routing pseudocode |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Step-by-step install for the CLI and the hosted server |
| [`references/cupt-commands.md`](./references/cupt-commands.md) | Every `cupt` command and flag, with agent patterns |
| [`references/mcp-tools.md`](./references/mcp-tools.md) | The 67 MCP tools by area, with the markdown contract and invocation |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Error reference, diagnostic sequence and recovery steps |
| [`feature-catalog/FEATURE-CATALOG.md`](./feature-catalog/FEATURE-CATALOG.md) | Current-state inventory of every CLI feature and MCP tool |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate the catalog by feature area |
| [`examples/README.md`](./examples/README.md) | Guide to the two production scripts and their exit codes |
| [`scripts/install.sh`](./scripts/install.sh) | Installer for `cupt` that prints the MCP config snippet |
| [`scripts/doctor.sh`](./scripts/doctor.sh) | Read-only diagnostics for the local environment and the registered manual |
| [`scripts/README.md`](./scripts/README.md) | What each script changes and the output it prints |
| [`mcp-servers/clickup-mcp/README.md`](./mcp-servers/clickup-mcp/README.md) | Configuration notes for the hosted official server |
| [`mcp-servers/clickup-cli/README.md`](./mcp-servers/clickup-cli/README.md) | Install and verification notes for the `cupt` CLI |
