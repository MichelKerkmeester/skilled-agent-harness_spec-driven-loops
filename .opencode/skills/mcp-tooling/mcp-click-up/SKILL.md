---
name: mcp-click-up
description: Routes ClickUp between cupt CLI (daily ops) and official MCP (docs, goals, bulk). Embedded install and agent safety invariants.
allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]
version: 1.0.0.0
---

<!-- keywords: clickup cupt task-management work-queue time-tracking mcp -->

# mcp-click-up Skill

ClickUp task management via **cupt CLI** (primary) and **official ClickUp MCP** (secondary). Operation-based routing: cupt handles daily task ops, MCP handles documents, goals, and bulk operations.

---

## 1. WHEN TO USE

### Activation Triggers (explicit user phrases)

- "clickup", "cupt", "mcp-click-up", "click up"
- "manage tasks", "list tasks", "mark task done", "complete task"
- "log time", "track time", "start timer", "stop timer"
- "add note to task", "tag task", "show task details"
- "process work queue", "process task queue"
- "clickup documents", "clickup goals", "bulk create tasks"

### Automatic Triggers (keyword patterns)

- `cupt` appears in the request
- `clickup` + any action verb (list, show, done, mark, note, time, tag)
- "work queue" or "task queue" in a ClickUp context
- "time tracking" or "work log" with project management context
- MCP tool names: `clickup_create_task`, `clickup_get_task`, `clickup_manage_documents`

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
ON_DEMAND: references/cupt_commands.md    (when cupt command details needed)
           references/mcp_tools.md         (when MCP tool details needed)
           references/troubleshooting.md   (when error or auth issue detected)
           references/install_guide.md     (when setup or authentication details needed)
```

### Operation-to-Tool Routing Table

| Operation | Primary Tool | Command | MCP Fallback |
|-----------|-------------|---------|-------------|
| List/filter tasks | cupt | `cupt list [--today\|--week\|--tag X]` | `clickup_search_tasks` |
| Task details | cupt | `cupt show <id> [--notes]` | `clickup_get_task` |
| Mark task complete | cupt | `cupt done <id> [--dry-run]` | `clickup_update_task` |
| Add note/comment | cupt | `cupt note <id> "<text>"` | `clickup_manage_comments` |
| Read comments | cupt | `cupt notes <id>` | `clickup_manage_comments` |
| Start/stop timer | cupt | `cupt time start <id>` / `cupt time stop` | MCP time tracking |
| Log time manually | cupt | `cupt time add <id> <dur>` | MCP time tracking |
| Add tag | cupt | `cupt tag add <id> <name>` | `clickup_add_tag_to_task` |
| Remove tag | cupt | `cupt tag remove <id> <name>` | `clickup_remove_tag_from_task` |
| Task context | cupt | `cupt context <id>` | n/a |
| Discover statuses | cupt | `cupt statuses <id>` | n/a |
| **Documents** | **MCP only** | n/a | `clickup_create_document` |
| **Goals/OKRs** | **MCP only** | n/a | goal management tools |
| **Bulk create 5+** | **MCP only** | n/a | `clickup_create_bulk_tasks` |
| **Webhooks** | **MCP only** | n/a | webhook management tools |
| **Chat** | **MCP only** | n/a | chat tools |
| **Audit logs** | **MCP only** | n/a | `clickup_get_audit_logs` |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")

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
                     "wrap up", "close out", "update status", "leave a comment", "add a comment",
                     "task details", "start timer", "stop timer", "clock in", "clock out",
                     "log hours", "worklog", "task summary", "list teams", "upload a file",
                     "download a file", "prefetch", "offline cache"],
    },
    "MCP_ADVANCED": {
        "weight": 5,
        "keywords": ["document", "goal", "okr", "bulk", "webhook", "chat", "audit",
                     "create_bulk", "manage_documents", "checklist", "custom field",
                     "quarterly goals", "key results", "doc page", "wiki page",
                     "create a folder", "create a space", "manage lists", "task dependencies",
                     "link tasks", "bulk update", "mass create", "batch create", "user groups",
                     "guest access", "enterprise feature", "task template", "space tags"],
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
# keys above). Both no-match fallback branches already hardcode
# "references/cupt_commands.md" directly, so a "DEFAULT" dict entry would be
# dead weight duplicating that literal. Promoting it to a top-level
# DEFAULT_RESOURCE = [...] constant instead would change semantics: the
# benchmark harness (and any router-doc-aware caller) treats DEFAULT_RESOURCE
# as an always-loaded preamble unioned into EVERY route, which would make
# cupt_commands.md load on MCP_ADVANCED/INSTALL/TROUBLESHOOT routes too —
# resources those intents' gold never expects. Removing the key keeps the
# hardcoded fallback as the single source of truth for the no-match case.
RESOURCE_MAP = {
    "CUPT_DAILY":    ["references/cupt_commands.md"],
    "MCP_ADVANCED":  ["references/mcp_tools.md"],
    "INSTALL":       ["references/install_guide.md", "references/troubleshooting.md"],
    "TROUBLESHOOT":  ["references/troubleshooting.md"],
}

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())

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
        load_if_available("references/cupt_commands.md", loaded, seen, inventory)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    # Error/install keywords boost TROUBLESHOOT/INSTALL regardless of other signals
    if scores.get("TROUBLESHOOT", 0) > 3:
        intent = "TROUBLESHOOT"
    elif scores.get("INSTALL", 0) > 4:
        intent = "INSTALL"
    else:
        intent = max(scores, key=scores.get)

    for resource in RESOURCE_MAP[intent]:
        load_if_available(resource, loaded, seen, inventory)

    if not loaded:
        load_if_available("references/cupt_commands.md", loaded, seen, inventory)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "notice": f"No ClickUp reference docs available for intent '{intent}'",
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
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
| **Best for** | Daily task ops, time tracking, notes, tags | Documents, goals, bulk ops, webhooks |
| **Output** | Human-readable + `--json` flag | Structured JSON always |
| **Auth** | `cupt auth` / `cupt config --api-token` | OAuth 2.1 + PKCE (browser authorization, no API key) |
| **Offline** | `--offline` flag uses local cache | Always requires network |
| **Install** | `pipx install cupt` (Python) | `npx mcp-remote https://mcp.clickup.com/mcp` (bridges to the remote server) |
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
bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh
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

This is ClickUp's own hosted MCP server at `https://mcp.clickup.com/mcp`, not a community package. It authenticates with OAuth 2.1 + PKCE only, ClickUp's docs are explicit that API keys and access tokens are not supported for this server. The first connection opens a browser for the user to authorize; there is no key to configure.

**Prerequisites:**
- Code Mode MCP configured, with the `clickup` manual in `.utcp_config.json` (not `opencode.json`, that file is for native/non-Code-Mode MCP tools)
- A browser available to complete the one-time OAuth authorization on first connect

**Configuration** (`.utcp_config.json`, `manual_call_templates`):
```json
{
  "name": "clickup",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup": {
        "transport": "stdio",
        "command": "npx",
        "args": ["mcp-remote", "https://mcp.clickup.com/mcp"],
        "env": {}
      }
    }
  }
}
```

Reference: https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server

**Invocation via Code Mode:**
```typescript
// Tool naming: clickup.clickup_{tool_name}
const result = await call_tool_chain([
  {
    tool: "clickup.clickup_create_document",
    input: {
      name: "Sprint Notes",
      parent: { type: 4, id: "LIST_ID" },
      content: "# Sprint Notes\n\n..."
    }
  }
]);
```

**When to prefer MCP:**
- Creating or reading ClickUp Documents
- Managing Goals and OKRs
- Bulk-creating 5+ tasks simultaneously
- Webhooks, custom views, user groups
- Enterprise features (audit logs, guests)

**Limitations:**
- No dry-run for task completion (always specify correct status)
- No offline mode
- Requires Code Mode MCP to be configured

---

## 4. RULES

### ALWAYS

1. **Run `cupt statuses <id>` before any `cupt done` call** — each ClickUp list has its own status schema; the closed status varies (Done, Complete, Closed, etc.). Never assume.
2. **Use `cupt done <id> --dry-run` before batch completion** — verify resolved status for every task before writing. One dry-run per task in a batch loop.
3. **Use `--json` flag for all cupt read commands** when processing output programmatically: `cupt list --json`, `cupt show <id> --json`, etc.
4. **Run `cupt --version && cupt status` as preflight** before starting a ClickUp workflow session.
5. **Treat empty `cupt list` results as valid** — an empty queue is not an error. Before escalating: check tag spelling, try `--all` flag, verify team name via `cupt teams`.
6. **Use `cupt context <id>`** before acting on a task to understand its parent and sibling relationships.

### NEVER

1. **Never hardcode status names across tasks** — `"Done"` in one list may not exist in another. Use `cupt statuses <id>` to discover the correct status for each task's list.
2. **Never run `cupt done` on multiple tasks without per-task dry-run first** — batch status errors are hard to reverse.
3. **Never use `@krodak/clickup-cli` (`cu` command)** — this is a different tool not supported by this skill. The `cu` binary also conflicts with the system `cu` command on some Unix systems.
4. **Never auto-modify `opencode.json`** — print MCP config snippets for user to apply; never write to config files programmatically.
5. **Never fabricate tasks** — if `cupt list` returns empty, the queue is genuinely empty. Report this clearly.
6. **Never use the MCP for daily task ops** — cupt handles these more efficiently and with dry-run safety.

### ESCALATE IF

- cupt is not installed and `scripts/install.sh` fails → report Python version and pip issues
- `cupt status` shows auth failure → direct to `cupt auth` or `cupt config --api-token`
- `cupt list --team X` is extremely slow (>30s) → team filter is client-side on large workspaces; suggest combining with `--tag` to reduce result set
- MCP connection fails → verify the `clickup` manual in `.utcp_config.json` points at `mcp-remote https://mcp.clickup.com/mcp`, and that the OAuth authorization has been completed in the browser
- Task status after `cupt done` is unexpected → run `cupt statuses <id>` and report available statuses

---

## 5. SUCCESS CRITERIA

- [ ] `cupt --version` prints version string
- [ ] `cupt status` shows workspace name without error
- [ ] `cupt list --today --json` returns valid JSON array (even if empty)
- [ ] `cupt statuses <id>` returns status list for the task's list
- [ ] Dry-run before batch: `cupt done <id> --dry-run` shows resolved status
- [ ] For MCP operations: Code Mode `clickup.clickup_get_workspace` returns workspace data

---

## 6. INTEGRATION POINTS

**Gate 2 (Skill Routing):** This skill activates at ≥0.8 confidence for ClickUp task management requests. The skill advisor matches on: `clickup`, `cupt`, `task management`, `work queue`, `time tracking`, `mark done`.

**Code Mode MCP:** Official ClickUp MCP tools are invoked via `mcp__code_mode__call_tool_chain`. Tool naming convention: `clickup.clickup_{tool_name}`. See references/mcp_tools.md for the full tool catalog.

**Memory:** Save ClickUp workflow context (current list, active tags, workspace ID) using `/memory:save` when switching sessions.

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
- `references/cupt_commands.md` — Full cupt command reference with agent patterns
- `references/mcp_tools.md` — 46 official MCP tools, priority table, invocation
- `references/troubleshooting.md` — Auth, status, team-filter, MCP failures
- `references/install_guide.md` — Step-by-step install with validation checkpoints

**Scripts:**
- `scripts/install.sh` — Installs cupt + prints MCP config snippet

**Embedded Servers:**
- `mcp-servers/clickup-mcp/package.json` — Stale. The official server is remote (`https://mcp.clickup.com/mcp`, OAuth), nothing to vendor locally. Use the `.utcp_config.json` `mcp-remote` bridge in Section 3 instead.
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
- Official ClickUp MCP setup docs: https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server
- ClickUp API tokens: https://app.clickup.com/settings/apps
