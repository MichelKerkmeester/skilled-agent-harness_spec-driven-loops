---
title: "mcp-click-up Router"
description: "Sibling router for mcp-click-up: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-click-up router"
  - "mcp-click-up routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# mcp-click-up Router

The machine router for [`SKILL.md`](../../../.skilled/skills/mcp-tooling/mcp-click-up/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name `clickup` or `cupt` with a task action such as list, show, done, note, time, tag or context, when they mention a work queue, time tracking, a ClickUp document, a workspace search, an install or auth question, or a ClickUp failure. It routes to four resource families: `references/cupt-commands.md` for the CLI's daily operations, `references/mcp-tools.md` for the hosted MCP's task, document, search, list, relation, chat and reminder tools, `INSTALL-GUIDE.md` with `references/troubleshooting.md` for setup and auth, and `references/troubleshooting.md` alone for a failure report.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`CUPT_DAILY`** (weight 5) fires on the daily cupt phrasing, "list", "show", "done", "mark done", "complete task", "my tasks", "due today", "overdue", "log time", "start timer", "add a comment", "work queue" and "task details". It loads `references/cupt-commands.md`, and nothing else.
- **`MCP_ADVANCED`** (weight 5) fires on "create a task", "subtask", "document", "doc page", "search clickup", "manage lists", "task dependencies", "chat", "reminder" and "move task", and the MCP-only phrasings in `MCP_ONLY_PHRASES` select it whenever an error or install signal does not outrank them. It loads `references/mcp-tools.md`.
- **`INSTALL`** (weight 6) fires on "install cupt", "setup", "not installed", "auth", "authenticate", "api token", "mcp config", "sign in" and "how do i install", and a score above 4 selects it ahead of every other intent. It loads `INSTALL-GUIDE.md` and `references/troubleshooting.md`, because a setup request usually ends in a failure report.
- **`TROUBLESHOOT`** (weight 6) fires on "error", "failed", "not working", "401", "403", "rate limit", "429", "empty", "no tasks", "not authenticated" and "can't connect", and a score above 3 selects it ahead of every other intent. It loads `references/troubleshooting.md`.

A request that scores on no intent loads nothing. It returns `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST`, and `references/cupt-commands.md` is suggested beside that checklist as a fallback-only default, so it never enters a scored route's loaded set.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail that does not fit the short summary: the resource loading levels, this packet's own operation-to-tool map and the router pseudocode.

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
RESOURCE_BASES = (SKILL_ROOT / "references",)
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
