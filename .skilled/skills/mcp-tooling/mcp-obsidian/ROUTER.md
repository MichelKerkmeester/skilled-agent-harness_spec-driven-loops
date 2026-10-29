---
title: "mcp-obsidian Router"
description: "Sibling router for mcp-obsidian: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-obsidian router"
  - "mcp-obsidian routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# mcp-obsidian Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

An Obsidian vault or note request reaches this skill when it names Obsidian, a vault, `notesmd-cli`, the cyanheads MCP, the official app-backed `obsidian` CLI, or one of the two documented plugins, and the `mcp-tooling` hub's `mcp-obsidian` mode signal selects the packet. From there the router selects among the CLI command references, the official-CLI agent-usage guide, the cyanheads MCP tool catalog, the troubleshooting and Notion-migration guides, and the plugin and theme families under `references/plugins/` and `references/themes/`. `references/obsidian-cli-commands.md` is the declared default, offered as a fallback suggestion rather than loaded by any scored route.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

Ten intents, one per `INTENT_SIGNALS` key. Each names the phrasing that fires it and the exact files its `RESOURCE_MAP` entry loads.

- **`NOTES_CLI`** — headless note and vault work: "daily note", "create a note", "search-content", "print", "rename", "frontmatter", "vault" or "add-vault", loads `references/obsidian-cli-commands.md`.
- **`OFFICIAL_CLI`** — the app-backed official CLI: "official obsidian cli", "register cli", "obsidian version", "key=value", "backlinks", "orphans", "base:query", "file history" or "unable to find obsidian", loads `references/official-cli-agent-usage.md` and `references/obsidian-cli-commands.md`.
- **`MCP_ADVANCED`** — cyanheads MCP note operations: "get_note", "write_note", "search_notes", "manage_tags", "add a tag", "semantic search" or "structured note", loads `references/mcp-tools.md`.
- **`PLUGIN_ICONIC`** — the Iconic icon and colour rulebook: "iconic", "icon rules", "icon automation", "file icons", "folder icons", "iconic data json" or "iconic ruleset", loads `references/plugins/plugin-operation-logic.md`, `references/plugins/iconic/iconic.md`, `references/plugins/iconic/data-model.md`, `references/plugins/iconic/workflows.md` and `references/plugins/iconic/troubleshooting.md`.
- **`THEME_SYSTEM`** — themes, CSS snippets and theme-level plugin development: "obsidian theme", "css theme", "css snippet", "css variable", "theme development", "build a theme" or "plugin development", loads `references/themes/themes.md`, `references/themes/customization.md`, `references/themes/theme-development.md` and `references/themes/plugin-development.md`.
- **`PLUGIN_HEALTH`** — the Health.md visualization plugin: "health-md", "health.md", "health data", "apple health", "health chart", "healthkit" or "healthmd", loads `references/plugins/plugin-operation-logic.md`, `references/plugins/health-md/health-md.md`, `references/plugins/health-md/data-model.md`, `references/plugins/health-md/workflows.md` and `references/plugins/health-md/troubleshooting.md`.
- **`PLUGINS`** — generic plugin work, considered only when no specific plugin signal matches: "plugin", "plugin automation" or "community plugin", loads `references/plugins/plugin-operation-logic.md`, `references/plugins/installed-plugins.md`, `references/plugins/iconic/iconic.md`, `references/plugins/health-md/health-md.md` and `references/themes/themes.md`.
- **`NOTION_MIGRATION`** — Notion to Obsidian reconstruction: "migration", "migrate", "notion import", "relation recovery", "rollup recovery", "comment reconstruction" or "parity verification", loads `references/notion-migration.md`.
- **`INSTALL`** — install and wiring: "install notesmd-cli", "install obsidian", "setup", "not installed", "api key", "local rest api", "mcp config", "obsidian_base_url" or "how do i install", loads `references/troubleshooting.md`.
- **`TROUBLESHOOT`** — a failure to diagnose: "error", "failed", "401", "403", "connection refused", "ssl", "empty", "no notes", "vault not found", "no default vault" or "doesn't work", loads `references/troubleshooting.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail that does not fit the short summary: the resource loading levels, the two surface decisions, the execution-profile probe, the operation-to-tool table and the intent-scoring pseudocode that reads them.

### Resource Loading Levels

```
ALWAYS:    SKILL.md (this file)
ON_DEMAND: references/obsidian-cli-commands.md          (notesmd-cli + official obsidian CLI command details)
           references/official-cli-agent-usage.md       (official obsidian CLI: preflight, exit-0 contract, key=value syntax, 106-command surface)
           references/mcp-tools.md                      (cyanheads MCP tool catalog + invocation)
           references/troubleshooting.md                (error, auth, REST API, or install issue detected)
           references/notion-migration.md               (Notion→Obsidian migration reconstruction method)
           Plugin operation logic:
             references/plugins/plugin-operation-logic.md (plugin-driven note automation)
           Installed plugins roster:
             references/plugins/installed-plugins.md    (all 24 enabled vault plugins; which two carry dedicated docs)
           Health.md Visualizations:
             references/plugins/health-md/health-md.md                   (plugin index)
             references/plugins/health-md/data-model.md
             references/plugins/health-md/workflows.md
             references/plugins/health-md/troubleshooting.md
           Iconic:
             references/plugins/iconic/iconic.md                         (plugin index)
             references/plugins/iconic/data-model.md
             references/plugins/iconic/workflows.md
             references/plugins/iconic/troubleshooting.md
           Themes (theme system):
             references/themes/themes.md                                 (theme system index)
             references/themes/customization.md
             references/themes/theme-development.md
             references/themes/plugin-development.md
```

### Two Decisions This Router Makes

1. **CLI vs MCP** — filesystem/terminal work goes to a CLI; live-app note reads/writes/tags/search go to the MCP.
2. **Which CLI profile** — headless `notesmd-cli` (default, no running app) vs the app-backed official `obsidian` CLI (a remote control for an already-running desktop app; it does not start one, and it exits 0 even on failure). Preflight and result-handling contract: `references/official-cli-agent-usage.md`.

### Execution Profile Selection

| Surface | Binary / transport | Needs a running app? | Best for |
|---|---|---|---|
| **Headless CLI** | `notesmd-cli` (Bash) | No — operates on the vault filesystem | Daily note ops anywhere: open, daily, search, create, list, print, move, delete, frontmatter, vault management |
| **App-backed CLI** | `obsidian` (Bash) | Yes — the app must ALREADY be running; the CLI does not launch it | App-only outcomes: resolved link graph (`backlinks`/`orphans`/`unresolved`), computed tags and tasks, Bases queries, sync and file history, plugin/theme state, in-app opens |
| **MCP** | `obsidian.obsidian_*` via Code Mode | Yes — plus Local REST API + `OBSIDIAN_API_KEY` | Structured note reads/writes, tag management, semantic/global search over a live vault |

```python
def resolve_execution_profile(request, runtime):
    """Pick the execution surface for an Obsidian operation.

    Best-effort runtime probes — never fabricated:
      runtime.app_running   -> an Obsidian desktop app is live
                               (probe: `obsidian version` prints a version number)
      runtime.rest_api_up   -> Local REST API plugin reachable on OBSIDIAN_BASE_URL
      runtime.api_key       -> OBSIDIAN_API_KEY present in the Code Mode environment
    """
    # MCP path needs a live app + Local REST API + token. It is the only surface
    # for structured note reads/writes, tag management and global/semantic search.
    if wants_structured_note_ops(request) and runtime.app_running \
            and runtime.rest_api_up and runtime.api_key:
        return "MCP"            # cyanheads obsidian-mcp-server via Code Mode

    # The official obsidian CLI is a remote control for an ALREADY-RUNNING app: it
    # does not launch one. Probe with `obsidian version` (exit 0 == registered AND
    # app up), then use it for app-only outcomes the filesystem cannot answer.
    # Its in-app failures exit 0, so callers must read stdout, not the status.
    if runtime.app_running and needs_app_command(request):
        return "OBSIDIAN_CLI"   # official `obsidian` CLI

    # Default: headless, filesystem-only, works with no running app or token.
    return "NOTESMD_CLI"        # Yakitrak notesmd-cli
```

### Operation-to-Tool Routing Table

| Operation | Primary Surface | Command / Tool | Alternative |
|---|---|---|---|
| Open a note | notesmd-cli | `notesmd-cli open "<name>"` | `obsidian` CLI (in live app) |
| Open/append daily note | notesmd-cli | `notesmd-cli daily` | MCP `obsidian_write_note` |
| Search by note name | notesmd-cli | `notesmd-cli list` + filter (`search` title-lookup is broken in v0.3.6) | MCP `obsidian_search_notes` |
| Search note contents | notesmd-cli | `notesmd-cli search-content "<query>"` | MCP `obsidian_search_notes` |
| List notes | notesmd-cli | `notesmd-cli list` | MCP `obsidian_search_notes` |
| Print a note to stdout | notesmd-cli | `notesmd-cli print "<name>"` | MCP `obsidian_get_note` |
| Create a note | notesmd-cli | `notesmd-cli create "<name>"` | MCP `obsidian_write_note` |
| Move / rename a note | notesmd-cli | `notesmd-cli move "<a>" "<b>"` | n/a |
| Delete a note | notesmd-cli | `notesmd-cli delete "<name>"` | MCP `obsidian_delete_note` |
| Edit frontmatter | notesmd-cli | `notesmd-cli frontmatter "<name>"` | MCP `obsidian_manage_tags` |
| Vault registration | notesmd-cli | `notesmd-cli add-vault` / `set-default-vault` | n/a |
| **Structured note read** | **MCP** | `obsidian_get_note` | notesmd-cli `print` |
| **Structured note write** | **MCP** | `obsidian_write_note` | notesmd-cli `create` |
| **Tag management** | **MCP** | `obsidian_manage_tags` | notesmd-cli `frontmatter` |
| **Global / semantic search** | **MCP** | `obsidian_search_notes` | notesmd-cli `search-content` |
| **In-app open** | **obsidian CLI** | `obsidian open file="<name>"` | n/a |
| **Resolved link graph** | **obsidian CLI** | `obsidian backlinks file="<name>"`, `orphans`, `unresolved` | n/a |
| **Vault tags / tasks index** | **obsidian CLI** | `obsidian tags`, `obsidian tasks` | notesmd-cli `search-content` (text only) |
| **Bases query** | **obsidian CLI** | `obsidian base:query file="<base>" format=json` | n/a |
| **Sync / file history** | **obsidian CLI** | `obsidian sync:status`, `obsidian history file="<name>"` | n/a |
| **Plugin / theme state** | **obsidian CLI** | `obsidian plugin:enable id=<id>`, `obsidian theme:set name="<t>"` | n/a |
| **Plugin-driven automation** | reference | `references/plugins/*` | n/a |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references",)
DEFAULT_RESOURCE = "references/obsidian-cli-commands.md"
# Fallback-only: DEFAULT_RESOURCE is a defer-time suggestion, never unioned
# into a route's loaded set. Scored routes load exactly RESOURCE_MAP[intent];
# zero-score routes load nothing and ask for disambiguation instead.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is for headless notesmd-cli, the app-backed obsidian CLI, the cyanheads MCP, a plugin, install/setup, or troubleshooting",
    "Provide the note name, vault path, command, error text, or target plugin",
    "Confirm whether an Obsidian desktop app is running and whether Local REST API + OBSIDIAN_API_KEY are configured",
    "Confirm the verification command before completing any write action",
]

INTENT_SIGNALS = {
    "NOTES_CLI": {
        "weight": 5,
        "keywords": ["note", "notes", "open", "daily", "daily note", "search",
                     "search-content", "search content", "list", "print", "create",
                     "move", "rename", "delete", "frontmatter", "vault", "add-vault",
                     "remove-vault", "list-vaults", "set-default-vault", "default vault",
                     "new note", "find note", "jot", "capture", "markdown note"],
    },
    "OFFICIAL_CLI": {
        "weight": 6,
        "keywords": ["official cli", "official obsidian cli", "obsidian cli",
                     "app-backed", "app backed", "register cli", "live app",
                     "running app", "command line interface", "obsidian version",
                     "obsidian help", "key=value", "backlinks", "orphans",
                     "unresolved links", "deadends", "base:query", "bases query",
                     "sync history", "file history", "obsidian eval", "eval code=",
                     "devtools",
                     "plugin:enable", "theme:set", "cli preflight",
                     "unable to find obsidian"],
    },
    "MCP_ADVANCED": {
        "weight": 5,
        "keywords": ["get_note", "write_note", "search_notes", "manage_tags",
                     "delete_note", "manage tags", "add a tag", "remove a tag",
                     "semantic search", "global search", "live app", "rest api note",
                     "structured note", "read note via mcp", "write note via mcp"],
    },
    "PLUGIN_ICONIC": {
        "weight": 5,
        "keywords": ["iconic", "iconic rulebook", "icon rules", "icon automation",
                     "file icons", "folder icons", "icon color", "iconic data json",
                     "iconic ruleset"],
    },
    "THEME_SYSTEM": {
        "weight": 5,
        "keywords": ["theme", "themes", "obsidian theme", "css theme", "community theme",
                     "appearance", "css snippet", "snippets", "css variable", "theme development",
                     "build a theme", "plugin development", "minimal theme"],
    },
    "PLUGIN_HEALTH": {
        "weight": 5,
        "keywords": ["health-md", "health.md", "health data", "apple health",
                     "android health", "health chart", "health visualization",
                     "healthkit", "health export", "healthmd"],
    },
    "PLUGINS": {
        "weight": 5,
        "keywords": ["plugin", "plugin automation", "community plugin"],
    },
    "NOTION_MIGRATION": {
        "weight": 5,
        "keywords": ["migration", "migrate", "notion import", "obsidian import",
                     "relation recovery", "rollup recovery", "comment reconstruction",
                     "parity verification"],
    },
    "INSTALL": {
        "weight": 6,
        "keywords": ["install notesmd-cli", "install obsidian", "setup", "not found",
                     "not installed", "api key", "api token", "local rest api",
                     "enable cli", "brew install", "scoop install",
                     "add-vault", "getting started", "onboarding", "configure",
                     "configuration", "mcp config", "obsidian_base_url", "how do i install"],
    },
    "TROUBLESHOOT": {
        "weight": 6,
        "keywords": ["error", "failed", "not working", "401", "403", "404", "slow",
                     "timeout", "empty", "no notes", "broken", "doesn't work",
                     "isn't working", "won't load", "stuck", "unauthorized",
                     "forbidden", "connection refused", "can't connect",
                     "connection failed", "cert", "ssl", "vault not found",
                     "no default vault"],
    },
}

# NOTE: no "DEFAULT" entry — route_obsidian_resources() never indexes RESOURCE_MAP
# by that key. The selected `intent` is one of the ten INTENT_SIGNALS keys above.
# Specific plugin intents always supersede generic PLUGINS whenever any specific signal matches: the highest specific score wins, a tie between specific intents disambiguates, and generic PLUGINS is considered only when no specific plugin signal matches.
# The no-match case is owned by DEFAULT_RESOURCE, whose declared
# fallback-only semantics mean it is SUGGESTED beside the disambiguation checklist,
# never loaded — so obsidian-cli-commands.md can never leak into the MCP_ADVANCED /
# PLUGINS / INSTALL / TROUBLESHOOT routes.
RESOURCE_MAP = {
    "NOTES_CLI":     ["references/obsidian-cli-commands.md"],
    "OFFICIAL_CLI":  ["references/official-cli-agent-usage.md",
                       "references/obsidian-cli-commands.md"],
    "MCP_ADVANCED":  ["references/mcp-tools.md"],
    "PLUGIN_ICONIC":  ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/iconic/iconic.md",
                       "references/plugins/iconic/data-model.md",
                       "references/plugins/iconic/workflows.md",
                       "references/plugins/iconic/troubleshooting.md"],
    "THEME_SYSTEM":   ["references/themes/themes.md",
                       "references/themes/customization.md",
                       "references/themes/theme-development.md",
                       "references/themes/plugin-development.md"],
    "PLUGIN_HEALTH":  ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/health-md/health-md.md",
                       "references/plugins/health-md/data-model.md",
                       "references/plugins/health-md/workflows.md",
                       "references/plugins/health-md/troubleshooting.md"],
    "PLUGINS":        ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/installed-plugins.md",
                       "references/plugins/iconic/iconic.md",
                       "references/plugins/health-md/health-md.md",
                       "references/themes/themes.md"],
    "NOTION_MIGRATION": ["references/notion-migration.md"],
    "INSTALL":       ["references/troubleshooting.md"],
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

def load_if_available(relative_path, loaded, seen, inventory) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def route_obsidian_resources(request: str) -> dict:
    """Score intent labels and load available Obsidian reference docs."""
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

    # Error/install keywords boost TROUBLESHOOT/INSTALL regardless of other signals.
    if scores.get("TROUBLESHOOT", 0) > 3:
        intent = "TROUBLESHOOT"
    elif scores.get("INSTALL", 0) > 4:
        intent = "INSTALL"
    else:
        specific_plugin_intents = ("PLUGIN_ICONIC", "PLUGIN_HEALTH", "THEME_SYSTEM")
        matched_specific_plugin_intents = [
            plugin_intent
            for plugin_intent in specific_plugin_intents
            if scores.get(plugin_intent, 0) > 0
        ]
        if matched_specific_plugin_intents:
            max_specific_score = max(
                scores[plugin_intent] for plugin_intent in matched_specific_plugin_intents
            )
            top_specific_plugin_intents = [
                plugin_intent
                for plugin_intent in matched_specific_plugin_intents
                if scores[plugin_intent] == max_specific_score
            ]
            if len(top_specific_plugin_intents) > 1:
                return {
                    "needs_disambiguation": True,
                    "candidate_intents": top_specific_plugin_intents,
                    "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
                    "resources": loaded,
                }
            intent = top_specific_plugin_intents[0]
        else:
            intent = max(scores, key=scores.get)

    for resource in RESOURCE_MAP[intent]:
        load_if_available(resource, loaded, seen, inventory)

    if not loaded:
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "notice": f"No Obsidian reference docs available for intent '{intent}'",
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "suggested_fallback": DEFAULT_RESOURCE,
            "resources": loaded,
        }

    return {"intent": intent, "resources": loaded}
```
