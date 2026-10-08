---
name: mcp-click-up
description: Routes ClickUp between cupt CLI (daily ops) and the hosted MCP (task create, docs, search). Embedded install and safety rules.
allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]
version: 1.2.0.0
---

<!-- keywords: clickup cupt task-management work-queue time-tracking mcp -->

# mcp-click-up Skill

ClickUp task management via **cupt CLI** (primary) and **official ClickUp MCP** (secondary). Operation-based routing: cupt handles daily task ops, and the MCP handles task creation, documents, search, lists and folders, task relations, chat and reminders. Goals, bulk create, webhooks and checklist edits have no route on either surface.

---

## MARKDOWN FORMATTING CONTRACT — READ BEFORE ANY CLICKUP WRITE

ClickUp shows plain text literally. Markdown sent through a plain-text path shows up in the ClickUp UI as raw `### Heading`, `**bold**`, and `- [ ]` text. Whenever the content contains ANY markdown syntax, use the markdown-aware parameter for the operation. On the Code Mode manual (`clickup_official`), checked against the server's schema on 2026-10-08:

| Operation | Required parameter |
| --- | --- |
| Task create or update | `markdown_description` (the server has no plain `description` or `markdown_content` parameter) |
| Document page create, update or read | `content_format: "text/md"` |
| Task read-back | `include: ["description"]` on `clickup_get_task` |

On the raw ClickUp v2 REST API, `markdown_content` is also accepted on task update and `include_markdown_description=true` returns markdown, both live-verified 2026-07-15. The claude.ai ClickUp connector was not re-checked on 2026-10-08.

**Push shape for a markdown artifact:** the document's H1 becomes the task `name` (drop it from the body); strip internal HTML comments and processing metadata; everything else travels verbatim.

**Failure symptom:** literal `###` or `**` visible in a ClickUp task means someone used the plain `description` field. That is the defect, not a rendering bug.

Worked examples: `references/mcp-tools.md` (Markdown Transport Contract + invocation patterns).

---

## 1. WHEN TO USE

### Activation Triggers (explicit user phrases)

- "clickup", "cupt", "mcp-click-up", "click up"
- "manage tasks", "list tasks", "mark task done", "complete task"
- "log time", "track time", "start timer", "stop timer"
- "add note to task", "tag task", "show task details"
- "process work queue", "process task queue"
- "clickup documents", "clickup doc page", "create clickup task", "search clickup"

### Automatic Triggers (keyword patterns)

- `cupt` appears in the request
- `clickup` + any action verb (list, show, done, mark, note, time, tag)
- "work queue" or "task queue" in a ClickUp context
- "time tracking" or "work log" with project management context
- MCP tool names: `clickup_create_task`, `clickup_get_task`, `clickup_create_document`, `clickup_update_document_page`

### When NOT to Use

- **@krodak/clickup-cli (`cu` command)** — different tool entirely; not supported by this skill
- Community ClickUp MCP servers (@taazkareem/clickup-mcp-server) — use official MCP only
- Direct ClickUp REST API calls (no CLI/MCP) — this skill adds no value there
- Browser-based ClickUp automation (Playwright/Puppeteer) — wrong surface

---

## 2. SMART ROUTING

### Resource Loading Levels

```
ALWAYS:    SKILL.md (this file)
ON_DEMAND: references/cupt-commands.md    (when cupt command details needed)
           references/mcp-tools.md         (when MCP tool details needed)
           references/troubleshooting.md   (when error or auth issue detected)
           INSTALL-GUIDE.md                (when setup or authentication details needed)
```

### Operation-to-Tool Routing Table

| Operation | Primary Tool | Command | MCP Fallback |
|-----------|-------------|---------|-------------|
| List/filter tasks | cupt | `cupt list [--today\|--week\|--tag X]` | `clickup_filter_tasks` |
| Task details | cupt | `cupt show <id> [--notes]` | `clickup_get_task` |
| Mark task complete | cupt | `cupt done <id> [--dry-run]` | `clickup_update_task` |
| Add note/comment | cupt | `cupt note <id> "<text>"` | `clickup_create_comment` |
| Read comments | cupt | `cupt notes <id>` | `clickup_get_task_comments` |
| Start/stop timer | cupt | `cupt time start <id>` / `cupt time stop` | `clickup_start_time_tracking` / `clickup_stop_time_tracking` |
| Log time manually | cupt | `cupt time add <id> <dur>` | `clickup_add_time_entry` |
| Add tag | cupt | `cupt tag add <id> <name>` | `clickup_add_tag_to_task` |
| Remove tag | cupt | `cupt tag remove <id> <name>` | `clickup_remove_tag_from_task` |
| Task context | cupt | `cupt context <id>` | `clickup_get_task` with `include: ["subtasks"]` |
| Discover statuses | cupt | `cupt statuses <id>` | `clickup_get_task` with `expand_statuses: true` |
| **Create a task or subtask** | **MCP only** | n/a | `clickup_create_task` (`parent` for a subtask) |
| **Documents and pages** | **MCP only** | n/a | `clickup_create_document`, `clickup_list_document_pages`, `clickup_get_document_pages`, `clickup_create_document_page`, `clickup_update_document_page` |
| **Search the workspace** | **MCP only** | n/a | `clickup_search` |
| **Lists and folders** | **MCP only** | n/a | `clickup_create_list`, `clickup_get_list`, `clickup_create_folder` and their update tools |
| **Task relations** | **MCP only** | n/a | dependency, link, move, merge and extra-list tools |
| **Chat and reminders** | **MCP only** | n/a | `clickup_send_chat_message`, `clickup_create_reminder` and their read tools |
| **Goals, bulk create, webhooks, checklist edits, spaces, views, audit logs** | **Not available** | n/a | No tool on the hosted server and no enabled operator. Tell the user. |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
# The install guide lives at the packet root, outside both bases.
ROOT_RESOURCES = ("INSTALL-GUIDE.md",)
DEFAULT_RESOURCE = "references/cupt-commands.md"
# Fallback-only: DEFAULT_RESOURCE is a defer-time suggestion, never unioned
# into a route's loaded set. Scored routes load exactly RESOURCE_MAP[intent];
# zero-score routes load nothing and ask for disambiguation instead.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is for cupt daily ops, official ClickUp MCP, install/auth, or troubleshooting",
    "Provide the task ID, command, error text, or target ClickUp feature",
    "Confirm whether cupt CLI or Code Mode MCP is already configured",
    "Confirm the verification command before completing any write action",
]

INTENT_SIGNALS = {
    "CUPT_DAILY": {
        "weight": 5,
        "keywords": ["list", "show", "done", "note", "notes", "time", "tag", "context",
                     "statuses", "summary", "teams", "attach", "work queue", "complete task",
                     "mark done", "log time", "track time",
                     "my tasks", "assigned to me", "due today", "due this week", "overdue",
                     "ticket", "close it out", "jot down",
                     "wrap up", "close out", "update status", "leave a comment", "add a comment",
                     "task details", "start timer", "stop timer", "clock in", "clock out",
                     "log hours", "worklog", "task summary", "list teams", "upload a file",
                     "download a file", "prefetch", "offline cache"],
    },
    "MCP_ADVANCED": {
        "weight": 5,
        "keywords": ["document", "goal", "okr", "bulk", "webhook", "chat", "audit",
                     "create_bulk", "manage_documents", "checklist", "custom field",
                     "quarterly goals", "quarterly objective", "objective", "key results",
                     "doc page", "wiki page", "write-up page",
                     "create a folder", "create a space", "manage lists", "task dependencies",
                     "link tasks", "bulk update", "mass create", "batch create", "user groups",
                     "guest access", "enterprise feature", "task template", "space tags",
                     "create a task", "create task", "new task", "subtask", "search clickup",
                     "reminder", "merge tasks", "move task", "time in status"],
    },
    "INSTALL": {
        "weight": 6,
        "keywords": ["install cupt", "setup", "not found", "not installed", "auth",
                     "authenticate", "api token", "mcp config",
                     "getting started", "onboarding", "configure", "configuration",
                     "connect clickup", "link my account", "personal token", "pipx install",
                     "sign in", "how do i install"],
    },
    "TROUBLESHOOT": {
        "weight": 6,
        "keywords": ["error", "failed", "not working", "403", "401", "slow", "timeout",
                     "empty", "no tasks",
                     "broken", "doesn't work", "isn't working", "won't load", "stuck",
                     "unauthorized", "forbidden", "permission denied", "rate limit", "429",
                     "500", "crash", "bug", "not authenticated", "can't connect",
                     "connection failed", "timing out"],
    },
}

# NOTE: no "DEFAULT" entry — route_clickup_resources() never indexes RESOURCE_MAP
# by that key (the selected `intent` is always one of the four INTENT_SIGNALS
# keys above). The no-match case is owned by DEFAULT_RESOURCE above, whose
# declared fallback-only semantics mean it is SUGGESTED beside the
# disambiguation checklist, never loaded — so cupt-commands.md can never leak
# into MCP_ADVANCED/INSTALL/TROUBLESHOOT routes, and router-doc-aware callers
# (the benchmark replay honors the same declaration) assemble exactly what a
# scored intent's RESOURCE_MAP entry names.
RESOURCE_MAP = {
    "CUPT_DAILY":    ["references/cupt-commands.md"],
    "MCP_ADVANCED":  ["references/mcp-tools.md"],
    "INSTALL":       ["INSTALL-GUIDE.md", "references/troubleshooting.md"],
    "TROUBLESHOOT":  ["references/troubleshooting.md"],
}

# Operations cupt has no command for. A CUPT_DAILY word such as "list" or
# "show" in the same request must not pull them to cupt on a tie.
MCP_ONLY_PHRASES = ["create a task", "create task", "new task", "subtask",
                    "move task", "merge tasks", "time in status", "search clickup",
                    "reminder", "document", "doc page"]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    docs.extend(SKILL_ROOT / name for name in ROOT_RESOURCES if (SKILL_ROOT / name).is_file())

    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown skill resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path: str, loaded: list[str], seen: set[str], inventory: set[str]) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def route_clickup_resources(request: str) -> dict:
    """Score intent labels and load available ClickUp reference docs."""
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    request_lower = request.lower()

    scores = {}
    for intent, config in INTENT_SIGNALS.items():
        score = sum(
            config["weight"] for kw in config["keywords"]
            if kw in request_lower
        )
        if score > 0:
            scores[intent] = score

    if not scores:
        # Fallback-only: nothing is loaded on a zero-score route; the default
        # reference is offered as a suggestion beside the disambiguation ask.
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "suggested_fallback": DEFAULT_RESOURCE,
            "resources": loaded,
        }

    # Error/install keywords boost TROUBLESHOOT/INSTALL regardless of other signals
    if scores.get("TROUBLESHOOT", 0) > 3:
        intent = "TROUBLESHOOT"
    elif scores.get("INSTALL", 0) > 4:
        intent = "INSTALL"
    elif any(phrase in request_lower for phrase in MCP_ONLY_PHRASES):
        intent = "MCP_ADVANCED"
    else:
        intent = max(scores, key=scores.get)

    for resource in RESOURCE_MAP[intent]:
        load_if_available(resource, loaded, seen, inventory)

    if not loaded:
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "notice": f"No ClickUp reference docs available for intent '{intent}'",
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "suggested_fallback": DEFAULT_RESOURCE,
            "resources": loaded,
        }

    return {"intent": intent, "resources": loaded}
```

---

## 3. HOW IT WORKS

### Tool Comparison

| Dimension | cupt CLI | Official ClickUp MCP |
|-----------|---------|---------------------|
| **Activation** | `cupt <command>` in Bash | Code Mode `call_tool_chain()` |
| **Best for** | Daily task ops, time tracking, notes, tags | Task creation, documents, search, lists and folders, task relations |
| **Output** | Human-readable + `--json` flag | Structured JSON always |
| **Auth** | `cupt auth` / `cupt config --api-token` | OAuth through the hosted ClickUp server, one browser approval |
| **Offline** | `--offline` flag uses local cache | Always requires network |
| **Install** | `pipx install cupt` (Python) | `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio) |
| **Dry-run** | `cupt done --dry-run` | No equivalent |
| **Status auto** | Yes — resolves per-list | No — must specify status |

### cupt CLI (Primary Path)

**Step 1: Verify installation**
```bash
cupt --version   # e.g. cupt 0.7.1
cupt status      # Shows workspace + auth status
```

**Step 2: Install if missing**
```bash
bash .skilled/skills/mcp-tooling/mcp-click-up/scripts/install.sh
```

**Step 3: Authenticate**
```bash
cupt auth                          # Interactive wizard
# OR:
cupt config --api-token pk_xxxxx   # Direct token setup
```

**Step 4: Set defaults (optional)**
```bash
cupt config --workspace-id <id>    # From cupt status
cupt config --default-list <id>    # For quick task creation
```

**Step 5: Use for daily operations**
```bash
cupt list --today --json           # Tasks due today, JSON output
cupt statuses <task_id>            # Discover list's status schema FIRST
cupt done <task_id> --dry-run      # Preview completion without writing
cupt done <task_id> --note "done"  # Mark complete with note
```

### Official ClickUp MCP (Secondary Path)

This is ClickUp's official hosted MCP server, at `https://mcp.clickup.com/mcp`. The registered `clickup_official` manual reaches it over stdio through `npx -y mcp-remote`. It authenticates with OAuth, so the first launch needs one approval in the browser, and the manual reads no API key. The npm package `@clickup/mcp-server` returned 404 on 2026-07-10 and again on 2026-10-08, so the older API-key route no longer works.

**Prerequisites:**
- Code Mode MCP configured, with the `clickup_official` manual in `.utcp_config.json` (not `opencode.json`, that file is for native/non-Code-Mode MCP tools)
- One OAuth approval for ClickUp in the browser, on the first launch

**Configuration** (`.utcp_config.json`, `manual_call_templates`):
```json
{
  "name": "clickup_official",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup_official": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "mcp-remote", "https://mcp.clickup.com/mcp"]
      }
    }
  }
}
```

Reference: `references/mcp-tools.md` and `mcp-servers/clickup-mcp/README.md`

**Invocation via Code Mode.** Call `mcp__code_mode__call_tool_chain` with one `code` string, not an array of `{tool, input}` records. Every server tool name already starts with `clickup_`, so the callable name repeats it: `clickup_official.clickup_official_clickup_<tool>`. Top-level `await` is rejected and a returned value comes back as `{}`, so wrap calls in an async function and print with `console.log`:
```typescript
(async () => {
  const doc = await clickup_official.clickup_official_clickup_create_document({
    name: "Sprint Notes",
    parent: { id: "LIST_ID", type: "6" },   // "4" space, "5" folder, "6" list, "7" everything, "12" workspace
    visibility: "PRIVATE",
    create_page: false,
  });
  console.log(JSON.stringify(doc));
})();
```
The document tool takes no content. Add text with `clickup_create_document_page` and `content_format: "text/md"`. See `references/mcp-tools.md` sections 7 and 8.

**When to prefer MCP:**
- Creating tasks and subtasks, since cupt has no create command
- Creating documents and reading or writing their pages
- Searching the workspace by keyword, or filtering tasks across lists by field
- Creating or updating lists and folders
- Task relations, comment threads, chat and reminders

**Limitations:**
- No dry-run for task completion (always specify correct status)
- No offline mode
- Requires Code Mode MCP to be configured
- No goals, bulk create or update, webhooks, checklist edits, spaces, views, templates, guests, user groups or audit logs. Its operator catalog had nothing enabled on 2026-10-08

---

## 4. RULES

### ✅ ALWAYS

1. **Run `cupt statuses <id>` before any `cupt done` call** — each ClickUp list has its own status schema; the closed status varies (Done, Complete, Closed, etc.). Never assume.
2. **Use `cupt done <id> --dry-run` before batch completion** — verify resolved status for every task before writing. One dry-run per task in a batch loop.
3. **Use `--json` flag for all cupt read commands** when processing output programmatically: `cupt list --json`, `cupt show <id> --json`, etc.
4. **Run `cupt --version && cupt status` as preflight** before starting a ClickUp workflow session.
5. **Treat empty `cupt list` results as valid** — an empty queue is not an error. Before escalating: check tag spelling, try `--all` flag, verify team name via `cupt teams`.
6. **Use `cupt context <id>`** before acting on a task to understand its parent and sibling relationships.
7. **Route markdown through markdown-aware parameters** per the MARKDOWN FORMATTING CONTRACT section at the top of this skill. On the Code Mode manual: `markdown_description` for task create and update, `content_format: "text/md"` for document pages, and `include: ["description"]` on `clickup_get_task` for read-back.

### ⛔ NEVER

1. **Never hardcode status names across tasks** — `"Done"` in one list may not exist in another. Use `cupt statuses <id>` to discover the correct status for each task's list.
2. **Never run `cupt done` on multiple tasks without per-task dry-run first** — batch status errors are hard to reverse.
3. **Never use `@krodak/clickup-cli` (`cu` command)** — this is a different tool not supported by this skill. The `cu` binary also conflicts with the system `cu` command on some Unix systems.
4. **Never auto-modify `opencode.json`** — print MCP config snippets for user to apply; never write to config files programmatically.
5. **Never fabricate tasks** — if `cupt list` returns empty, the queue is genuinely empty. Report this clearly.
6. **Never use the MCP for daily task ops** — cupt handles these more efficiently and with dry-run safety.
7. **Never put markdown into the plain `description` field** — it renders as literal `### Heading` / `**bold**` / `- [ ]` text in ClickUp. Any content containing markdown syntax must use the markdown-aware parameters from ALWAYS rule 7. This is exactly the defect that produced raw-markdown tickets in the Barter workspace.

### ⚠️ ESCALATE IF

- cupt is not installed and `scripts/install.sh` fails → report Python version and pip issues
- `cupt status` shows auth failure → direct to `cupt auth` or `cupt config --api-token`
- `cupt list --team X` is extremely slow (>30s) → team filter is client-side on large workspaces; suggest combining with `--tag` to reduce result set
- MCP connection fails → verify the `clickup_official` manual in `.utcp_config.json` launches `npx -y mcp-remote https://mcp.clickup.com/mcp` over stdio, and that the OAuth approval is still valid. A `not_found_or_authorized` error on every call means the approval has lapsed, so approve again. The same error on one page means that page is missing or restricted
- Task status after `cupt done` is unexpected → run `cupt statuses <id>` and report available statuses

---

## 5. SUCCESS CRITERIA

- [ ] `cupt --version` prints version string
- [ ] `cupt status` shows workspace name without error
- [ ] `cupt list --today --json` returns valid JSON array (even if empty)
- [ ] `cupt statuses <id>` returns status list for the task's list
- [ ] Dry-run before batch: `cupt done <id> --dry-run` shows resolved status
- [ ] For MCP operations: Code Mode `clickup_official.clickup_official_clickup_get_workspace_hierarchy` returns the workspace's spaces

---

## 6. INTEGRATION POINTS

**Gate 2 (Skill Routing):** This skill activates at ≥0.8 confidence for ClickUp task management requests. The skill advisor matches on: `clickup`, `cupt`, `task management`, `work queue`, `time tracking`, `mark done`.

**Code Mode MCP:** Official ClickUp MCP tools are invoked via `mcp__code_mode__call_tool_chain`. Tool naming convention: `clickup_official.clickup_official_clickup_{tool}`, because every server tool name already starts with `clickup_`. See references/mcp-tools.md for the full tool catalog.

**Memory:** Save ClickUp workflow context (current list, active tags, workspace ID) using `/speckit:save` when switching sessions.

**Tool Usage:** Use Bash for cupt CLI commands. Use mcp__code_mode__call_tool_chain for official MCP operations. Use Read to load references on demand.

---

## 7. QUICK REFERENCE

### cupt Command Cheat Sheet

| Category | Command | Description |
|----------|---------|-------------|
| **Auth** | `cupt auth` | Interactive authentication wizard |
| | `cupt config --api-token pk_xxx` | Set Personal API Token directly |
| | `cupt status` | Show auth status + workspace |
| | `cupt logout` | Clear stored credentials |
| **Config** | `cupt config --workspace-id <id>` | Set default workspace |
| | `cupt config --default-list <id>` | Set default list |
| | `cupt config --show` | Display current configuration |
| **Tasks** | `cupt list` | List assigned tasks |
| | `cupt list --today` | Tasks due today |
| | `cupt list --week` | Tasks due this week |
| | `cupt list --overdue` | Overdue tasks |
| | `cupt list --tag <name>` | Filter by tag (server-side, fast) |
| | `cupt list --team <name>` | Filter by team (client-side, slow) |
| | `cupt list --all` | All tasks including team |
| | `cupt list --mine` | Only self-assigned tasks |
| | `cupt list --json` | JSON output for agents |
| | `cupt show <id>` | Full task details |
| | `cupt show <id> --notes` | Include comments |
| | `cupt show <id> --json` | JSON output |
| | `cupt show <id> --offline` | Use cached data |
| | `cupt context <id>` | Parent + siblings + subtasks |
| | `cupt statuses <id>` | Status schema for task's list |
| | `cupt done <id>` | Mark complete (auto-resolves status) |
| | `cupt done <id> --dry-run` | Preview completion, no write |
| | `cupt done <id> --note "text"` | Mark complete with note |
| **Notes** | `cupt note <id> "<text>"` | Add comment to task |
| | `cupt notes <id>` | List all comments |
| **Time** | `cupt time start <id>` | Start timer on task |
| | `cupt time stop` | Stop running timer |
| | `cupt time add <id> <dur>` | Log time (e.g., `1h30m`, `45m`) |
| | `cupt time status` | Show current timer state |
| **Tags** | `cupt tag add <id> <name>` | Add tag to task |
| | `cupt tag remove <id> <name>` | Remove tag from task |
| **Attach** | `cupt attach list <id>` | List attachments |
| | `cupt attach add <id> <file>` | Upload file |
| | `cupt attach get <id> <sel>` | Download attachment |
| **Workspace** | `cupt teams` | List teams (user-groups) |
| | `cupt summary` | Task summary overview |
| | `cupt prefetch` | Pre-cache tasks for offline use |

---

## 8. REFERENCES AND RELATED RESOURCES

**Reference Files (load on demand via router):**
- `references/cupt-commands.md` — Full cupt command reference with agent patterns
- `references/mcp-tools.md`: the 61 live MCP tools, invocation, markdown contract and what the server cannot do
- `references/troubleshooting.md` — Auth, status, team-filter, MCP failures
- `INSTALL-GUIDE.md`: step-by-step install with validation checkpoints, at the packet root

Install guide (front door): [INSTALL-GUIDE.md](INSTALL-GUIDE.md) — condensed top-level install doc; the phase-validation reference above stays the router's INSTALL-intent target.

**Scripts:**
- `scripts/install.sh` — Installs cupt + prints MCP config snippet

**Embedded Servers:**
- `mcp-servers/clickup-mcp/README.md` — Configuration notes for the hosted official server, reached through `mcp-remote` by the `clickup_official` manual.
- `mcp-servers/clickup-cli/requirements.txt` — cupt CLI pip pin (`cupt>=0.7.1`). Run `setup.sh` to install.
- `mcp-servers/clickup-cli/setup.sh` — cupt install via pipx or pip.

**Examples:**
- `examples/task-queue-workflow.sh` — Process tagged work queue
- `examples/time-tracking-workflow.sh` — Timer + time log workflow

**Related Skills:**
- `mcp-chrome-devtools` — Structural template this skill was modeled on
- `mcp-code-mode` — Code Mode MCP orchestration (used for official MCP invocation)

**External:**
- cupt repository: https://github.com/newz2000/cupt
- Official ClickUp MCP setup docs: https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server-1
- ClickUp API tokens: https://app.clickup.com/settings/apps
