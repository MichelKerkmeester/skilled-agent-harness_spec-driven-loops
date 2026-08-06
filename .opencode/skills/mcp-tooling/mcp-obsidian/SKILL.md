---
name: mcp-obsidian
description: Makes AI use inside Obsidian effective: vault and note operations across the headless notesmd-cli, the app-backed official obsidian CLI, and the cyanheads MCP, plus deep plugin and theme knowledge (Beancount, Tables, BRAT, Health.md, Iconic, Charts, Dataview, Excalidraw, Git, Outliner, Minimal) operated at the file layer. Embedded install and agent safety invariants.
allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]
version: 0.15.0.0
---

<!-- keywords: obsidian, obsidian vault, notesmd-cli, obsidian-mcp, note management, markdown notes, beancount, local rest api, health-md, health data, iconic, icon rules, iconic rulebook, icon automation, file icons, folder icons, iconic data json, iconic ruleset, iconic-rules.full.json, iconic-rules.full.md, data.json, charts, chart render block, dataview, dql, dataviewjs, inline field, excalidraw, excalidraw.md, drawing note, obsidian-git, vault git, auto backup, outliner, list editing, minimal theme, css theme, theme snippet -->

# mcp-obsidian Skill

The skill that makes AI use inside Obsidian effective. It operates notes and vaults through three surfaces (headless `notesmd-cli`, the app-backed official `obsidian` CLI, and the cyanheads MCP) and knows the eleven plugin and theme file formats at the file layer, so an agent can read, write, search, and extend what the vault contains without guessing.

---

## 1. WHEN TO USE

### Activation Triggers (explicit user phrases)

- "obsidian", "obsidian vault", "notesmd-cli", "obsidian-mcp", "mcp-obsidian"
- "note", "notes", "markdown note", "daily note", "vault"
- "create a note", "open a note", "search notes", "search my vault"
- "add a tag to a note", "manage frontmatter", "delete a note", "move a note"
- "obsidian plugin", "beancount", "beancount finance", "obsidian tables", "brat"
- "health", "health data", "apple health", "health chart", "health-md", "health.md"
- "iconic", "icons", "icon color", "file icons", "folder icons", "icon rules", "iconic rulebook", "iconic ruleset", "iconic data json", "icon automation"
- "local rest api", "obsidian api key"

### Automatic Triggers (keyword patterns)

- `notesmd-cli` or `obsidian` (the CLI binary) appears in the request
- `obsidian` + any action verb (create, open, search, list, print, move, delete, tag)
- "vault" in a note-management context
- "daily note" or "note frontmatter" in a personal-knowledge context
- MCP tool names: `obsidian_get_note`, `obsidian_write_note`, `obsidian_search_notes`

### When NOT to Use

- **StevenStavrakis `obsidian-mcp`** — a different (filesystem-based) MCP server; this skill's MCP path uses the cyanheads `obsidian-mcp-server`. The Stavrakis server is documented only as the headless MCP alternative.
- Generic markdown authoring with no Obsidian vault — use `@markdown` / `sk-doc`.
- Non-Obsidian note apps (Notion, Bear, Apple Notes) — wrong surface.
- Editing arbitrary repo files that merely happen to be markdown — use `Read`/`Edit` directly.

---

## 2. SMART ROUTING

### Resource Loading Levels

```
ALWAYS:    SKILL.md (this file)
ON_DEMAND: references/obsidian-cli-commands.md          (notesmd-cli + official obsidian CLI command details)
           references/mcp-tools.md                      (cyanheads MCP tool catalog + invocation)
           references/lra-rest-surface.md               (Local REST API REST endpoints + built-in MCP)
           references/troubleshooting.md                (error, auth, REST API, or install issue detected)
           Plugin operation logic:
             references/plugins/plugin-operation-logic.md (plugin-driven note automation)
           Beancount Finance:
             references/plugins/beancount-finance/beancount-finance.md      (plugin index)
             references/plugins/beancount-finance/data-model.md
             references/plugins/beancount-finance/workflows.md
             references/plugins/beancount-finance/troubleshooting.md
           Obsidian Tables:
             references/plugins/obsidian-tables/obsidian-tables.md         (plugin index)
             references/plugins/obsidian-tables/data-model.md
             references/plugins/obsidian-tables/workflows.md
             references/plugins/obsidian-tables/troubleshooting.md
           Obsidian42 BRAT:
             references/plugins/obsidian42-brat/obsidian42-brat.md         (plugin index)
             references/plugins/obsidian42-brat/data-model.md
             references/plugins/obsidian42-brat/workflows.md
             references/plugins/obsidian42-brat/troubleshooting.md
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
           Charts:
             references/plugins/charts/charts.md                         (plugin index)
             references/plugins/charts/data-model.md
             references/plugins/charts/workflows.md
             references/plugins/charts/troubleshooting.md
           Dataview:
             references/plugins/dataview/dataview.md                     (plugin index)
             references/plugins/dataview/data-model.md
             references/plugins/dataview/workflows.md
             references/plugins/dataview/troubleshooting.md
           Excalidraw:
             references/plugins/excalidraw/excalidraw.md                 (plugin index)
             references/plugins/excalidraw/data-model.md
             references/plugins/excalidraw/workflows.md
             references/plugins/excalidraw/troubleshooting.md
           Obsidian Git:
             references/plugins/git/git.md                               (plugin index)
             references/plugins/git/data-model.md
             references/plugins/git/workflows.md
             references/plugins/git/troubleshooting.md
           Outliner:
             references/plugins/outliner/outliner.md                     (plugin index)
             references/plugins/outliner/data-model.md
             references/plugins/outliner/workflows.md
             references/plugins/outliner/troubleshooting.md
           Minimal (theme):
             references/plugins/minimal/minimal.md                       (plugin index)
             references/plugins/minimal/data-model.md
             references/plugins/minimal/workflows.md
             references/plugins/minimal/troubleshooting.md
```

### Two Decisions This Router Makes

1. **CLI vs MCP** — filesystem/terminal work goes to a CLI; live-app note reads/writes/tags/search go to the MCP.
2. **Which CLI profile** — headless `notesmd-cli` (default, no running app) vs the app-backed official `obsidian` CLI (a remote control for a running desktop app).

### Execution Profile Selection

| Surface | Binary / transport | Needs a running app? | Best for |
|---|---|---|---|
| **Headless CLI** | `notesmd-cli` (Bash) | No — operates on the vault filesystem | Daily note ops anywhere: open, daily, search, create, list, print, move, delete, frontmatter, vault management |
| **App-backed CLI** | `obsidian` (Bash) | Yes — launches/controls the desktop app | In-app actions: opening notes in the live UI, `obsidian://` URI actions, app-context commands |
| **MCP** | `obsidian.obsidian_*` via Code Mode | Yes — plus Local REST API + `OBSIDIAN_API_KEY` | Structured note reads/writes, tag management, semantic/global search over a live vault |

```python
def resolve_execution_profile(request, runtime):
    """Pick the execution surface for an Obsidian operation.

    Best-effort runtime probes — never fabricated:
      runtime.app_running   -> an Obsidian desktop app is live
      runtime.rest_api_up   -> Local REST API plugin reachable on OBSIDIAN_BASE_URL
      runtime.api_key       -> OBSIDIAN_API_KEY present in the Code Mode environment
    """
    # MCP path needs a live app + Local REST API + token. It is the only surface
    # for structured note reads/writes, tag management and global/semantic search.
    if wants_structured_note_ops(request) and runtime.app_running \
            and runtime.rest_api_up and runtime.api_key:
        return "MCP"            # cyanheads obsidian-mcp-server via Code Mode

    # The official obsidian CLI is a remote control for a RUNNING app; use it only
    # for in-app actions (open in UI, obsidian:// URIs) when the app is up.
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
| **In-app open / URI action** | **obsidian CLI** | `obsidian "<vault/path>"` | n/a |
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
    "MCP_ADVANCED": {
        "weight": 5,
        "keywords": ["get_note", "write_note", "search_notes", "manage_tags",
                     "delete_note", "manage tags", "add a tag", "remove a tag",
                     "semantic search", "global search", "live app", "rest api note",
                     "structured note", "read note via mcp", "write note via mcp"],
    },
    "PLUGIN_FINANCE": {
        "weight": 5,
        "keywords": ["beancount", "beancount finance", "beancount-finance", "ledger",
                     "double-entry", "bql", "bean-query", "bean-price", "net worth",
                     "transaction"],
    },
    "PLUGIN_TABLES": {
        "weight": 5,
        "keywords": ["obsidian tables", "obsidian-tables", ".table.md", "table plugin",
                     "agentable", "columns", "rows", "formula column"],
    },
    "PLUGIN_BRAT": {
        "weight": 5,
        "keywords": ["brat", "obsidian42", "obsidian42-brat", "beta plugin",
                     "community plugin install", "install plugin from github", "frozen version",
                     "beta theme"],
    },
    "PLUGIN_ICONIC": {
        "weight": 5,
        "keywords": ["iconic", "iconic rulebook", "icon rules", "icon automation",
                     "file icons", "folder icons", "icon color", "iconic data json",
                     "iconic ruleset"],
    },
    "PLUGIN_CHARTS": {
        "weight": 5,
        "keywords": ["charts", "chart", "obsidian charts", "render block", "chart block",
                     "bar chart", "line chart", "pie chart", "chart json", "advanced-chart"],
    },
    "PLUGIN_DATAVIEW": {
        "weight": 5,
        "keywords": ["dataview", "dql", "dataviewjs", "inline field", "metadata query",
                     "frontmatter query", "task query", "list query", "table query", "dataview query"],
    },
    "PLUGIN_EXCALIDRAW": {
        "weight": 5,
        "keywords": ["excalidraw", "drawing", "excalidraw.md", "drawing note",
                     "embedded drawing", "whiteboard", "excalidraw automate", "drawing script"],
    },
    "PLUGIN_GIT": {
        "weight": 5,
        "keywords": ["obsidian git", "obsidian-git", "git plugin", "auto backup",
                     "vault git", "commit vault", "push vault", "pull vault", "git status", "git log"],
    },
    "PLUGIN_OUTLINER": {
        "weight": 5,
        "keywords": ["outliner", "obsidian outliner", "list editing", "list zoom",
                     "outline plugin", "fold list", "list indentation"],
    },
    "PLUGIN_MINIMAL": {
        "weight": 5,
        "keywords": ["minimal", "minimal theme", "theme", "css theme", "appearance",
                     "theme snippet", "style settings", "snippets"],
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
    "INSTALL": {
        "weight": 6,
        "keywords": ["install notesmd-cli", "install obsidian", "setup", "not found",
                     "not installed", "api key", "api token", "local rest api",
                     "register cli", "enable cli", "brew install", "scoop install",
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
# by that key. The selected `intent` is one of the sixteen INTENT_SIGNALS keys above.
# Specific plugin intents always supersede generic PLUGINS whenever any specific signal matches: the highest specific score wins, a tie between specific intents disambiguates, and generic PLUGINS is considered only when no specific plugin signal matches.
# The no-match case is owned by DEFAULT_RESOURCE, whose declared
# fallback-only semantics mean it is SUGGESTED beside the disambiguation checklist,
# never loaded — so obsidian-cli-commands.md can never leak into the MCP_ADVANCED /
# PLUGINS / INSTALL / TROUBLESHOOT routes.
RESOURCE_MAP = {
    "NOTES_CLI":     ["references/obsidian-cli-commands.md"],
    "MCP_ADVANCED":  ["references/mcp-tools.md",
                     "references/lra-rest-surface.md"],
    "PLUGIN_FINANCE": ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/beancount-finance/beancount-finance.md",
                       "references/plugins/beancount-finance/data-model.md",
                       "references/plugins/beancount-finance/workflows.md",
                       "references/plugins/beancount-finance/troubleshooting.md"],
    "PLUGIN_TABLES":  ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/obsidian-tables/obsidian-tables.md",
                       "references/plugins/obsidian-tables/data-model.md",
                       "references/plugins/obsidian-tables/workflows.md",
                       "references/plugins/obsidian-tables/troubleshooting.md"],
    "PLUGIN_BRAT":    ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/obsidian42-brat/obsidian42-brat.md",
                       "references/plugins/obsidian42-brat/data-model.md",
                       "references/plugins/obsidian42-brat/workflows.md",
                       "references/plugins/obsidian42-brat/troubleshooting.md"],
    "PLUGIN_ICONIC":  ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/iconic/iconic.md",
                       "references/plugins/iconic/data-model.md",
                       "references/plugins/iconic/workflows.md",
                       "references/plugins/iconic/troubleshooting.md"],
    "PLUGIN_CHARTS":   ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/charts/charts.md",
                       "references/plugins/charts/data-model.md",
                       "references/plugins/charts/workflows.md",
                       "references/plugins/charts/troubleshooting.md"],
    "PLUGIN_DATAVIEW": ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/dataview/dataview.md",
                       "references/plugins/dataview/data-model.md",
                       "references/plugins/dataview/workflows.md",
                       "references/plugins/dataview/troubleshooting.md"],
    "PLUGIN_EXCALIDRAW": ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/excalidraw/excalidraw.md",
                       "references/plugins/excalidraw/data-model.md",
                       "references/plugins/excalidraw/workflows.md",
                       "references/plugins/excalidraw/troubleshooting.md"],
    "PLUGIN_GIT":     ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/git/git.md",
                       "references/plugins/git/data-model.md",
                       "references/plugins/git/workflows.md",
                       "references/plugins/git/troubleshooting.md"],
    "PLUGIN_OUTLINER": ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/outliner/outliner.md",
                       "references/plugins/outliner/data-model.md",
                       "references/plugins/outliner/workflows.md",
                       "references/plugins/outliner/troubleshooting.md"],
    "PLUGIN_MINIMAL": ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/minimal/minimal.md",
                       "references/plugins/minimal/data-model.md",
                       "references/plugins/minimal/workflows.md",
                       "references/plugins/minimal/troubleshooting.md"],
    "PLUGIN_HEALTH":  ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/health-md/health-md.md",
                       "references/plugins/health-md/data-model.md",
                       "references/plugins/health-md/workflows.md",
                       "references/plugins/health-md/troubleshooting.md"],
    "PLUGINS":        ["references/plugins/plugin-operation-logic.md",
                       "references/plugins/beancount-finance/beancount-finance.md",
                       "references/plugins/obsidian-tables/obsidian-tables.md",
                       "references/plugins/obsidian42-brat/obsidian42-brat.md",
                       "references/plugins/iconic/iconic.md",
                       "references/plugins/health-md/health-md.md",
                       "references/plugins/charts/charts.md",
                       "references/plugins/dataview/dataview.md",
                       "references/plugins/excalidraw/excalidraw.md",
                       "references/plugins/git/git.md",
                       "references/plugins/outliner/outliner.md",
                       "references/plugins/minimal/minimal.md"],
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
        specific_plugin_intents = ("PLUGIN_FINANCE", "PLUGIN_TABLES", "PLUGIN_BRAT", "PLUGIN_ICONIC",
                                   "PLUGIN_CHARTS", "PLUGIN_DATAVIEW", "PLUGIN_EXCALIDRAW",
                                   "PLUGIN_GIT", "PLUGIN_OUTLINER", "PLUGIN_MINIMAL", "PLUGIN_HEALTH")
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

---

## 3. HOW IT WORKS

### Surface Comparison

| Dimension | Headless CLI (`notesmd-cli`) | App-backed CLI (`obsidian`) | Cyanheads MCP |
|---|---|---|---|
| **Activation** | `notesmd-cli <command>` in Bash | `obsidian <target>` in Bash | Code Mode `call_tool_chain()` |
| **Running app** | Not required — filesystem only | Required (launches it if not running) | Required + Local REST API |
| **Best for** | Daily note ops anywhere | In-app open / URI actions | Structured reads/writes, tags, search |
| **Auth** | None — reads the vault directory | None — controls the local app | `OBSIDIAN_API_KEY` bearer token |
| **Install** | `brew install yakitrak/yakitrak/notesmd-cli` | Ships with Obsidian desktop v1.12.4+ | `npx -y obsidian-mcp-server@latest` |
| **Config store** | `~/.config/obsidian/obsidian.json` | In-app: Settings → Command line interface | `.utcp_config.json` manual `obsidian` |
| **Output** | Human-readable text | Launches app UI | Structured JSON |

### Headless CLI — `notesmd-cli` (Default Path)

Yakitrak's `notesmd-cli` (binary `notesmd-cli`, renamed from "obsidian-cli" to avoid confusion with the official one) operates directly on the vault filesystem, so it works with **no running app**.

**Step 1: Verify installation**
```bash
notesmd-cli --version
notesmd-cli list-vaults        # Shows registered vaults + default
```

**Step 2: Install if missing**
```bash
bash .opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh
# or directly:
brew tap yakitrak/yakitrak && brew install yakitrak/yakitrak/notesmd-cli
```

**Step 3: Register a vault (one-time)**
```bash
notesmd-cli add-vault "/path/to/Vault"    # writes ~/.config/obsidian/obsidian.json
notesmd-cli set-default-vault "Vault"
```

**Step 4: Daily note operations**
```bash
notesmd-cli list                          # List notes in the default vault
notesmd-cli search "meeting"              # Search by note name
notesmd-cli search-content "action item" # Full-text content search
notesmd-cli print "Inbox"                # Print a note to stdout
notesmd-cli create "New Idea"            # Create a note
notesmd-cli daily                        # Open/append today's daily note
```

### App-backed CLI — official `obsidian` (Live-App Path)

The official `obsidian` CLI shipped GA in Obsidian desktop **v1.12.4** (Feb 2026). It is a **remote control for a running app** (it launches the app if not running), not a headless tool. There is no npm/brew package — it ships with the desktop app.

**Enable in-app:** Settings → General → Command line interface → toggle on → "Register CLI" (auto-adds `obsidian` to PATH on macOS/Linux). Use it for in-app opens and `obsidian://` URI actions when a live app is the target.

### Cyanheads MCP — `obsidian-mcp-server` (Structured Path)

The default MCP is cyanheads' `obsidian-mcp-server` (npm **@3.2.9**), launched over **stdio** via `npx -y obsidian-mcp-server@latest` (it also supports http on `127.0.0.1:3010/mcp`). It talks to the vault through the **Local REST API plugin v4.0.0+**, so it needs a **running Obsidian + the plugin enabled + an API key**.

**Prerequisites:**
- Code Mode MCP configured, with the `obsidian` manual in `.utcp_config.json` (not `opencode.json`, that file is for native/non-Code-Mode MCP tools)
- Obsidian running with the Local REST API plugin enabled and an API key generated
- `obsidian_OBSIDIAN_API_KEY` (required), `obsidian_OBSIDIAN_BASE_URL` (default `http://127.0.0.1:27123`), `obsidian_OBSIDIAN_VERIFY_SSL` (default `false`) available to Code Mode

**Configuration** (`.utcp_config.json`, `manual_call_templates`):
```json
{
  "name": "obsidian",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "obsidian": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "obsidian-mcp-server@latest"],
        "env": {
          "OBSIDIAN_API_KEY": "${obsidian_OBSIDIAN_API_KEY}",
          "OBSIDIAN_BASE_URL": "${obsidian_OBSIDIAN_BASE_URL}",
          "OBSIDIAN_VERIFY_SSL": "${obsidian_OBSIDIAN_VERIFY_SSL}"
        }
      }
    }
  }
}
```

The `obsidian_` env prefix matches the manual name `obsidian`, so `${obsidian_OBSIDIAN_API_KEY}` resolves correctly. This skill documents that registration; a later gated phase writes it into `.utcp_config.json` and `.env.example`.

**Tools:** the server exposes **14 `obsidian_*` tools**. The core five are `obsidian_get_note`, `obsidian_write_note`, `obsidian_search_notes`, `obsidian_manage_tags`, `obsidian_delete_note`; the full 14-tool catalog with per-tool inputs lives in `references/mcp-tools.md`. Confirm every name with `tool_info()`/`list_tools()` before calling — never guess it from a description.

**Invocation via Code Mode** (`call_tool_chain` takes a single `code` string):
```typescript
// Tool naming: obsidian.obsidian_{tool_name}
const result = await call_tool_chain({
  code: `
    const note = await obsidian.obsidian_get_note({ path: "Inbox/Idea.md" });
    return note;
  `,
});
```

**When to prefer the MCP:**
- Structured note reads/writes where you need JSON back, not terminal text
- Tag management (`obsidian_manage_tags`) across a live vault
- Global or semantic search over an active, plugin-backed vault

**Limitations:**
- Requires a running Obsidian + Local REST API plugin + API key (headless CLI has none of these needs)
- Requires Code Mode MCP to be configured
- `OBSIDIAN_VERIFY_SSL` defaults to `false`; only enable it behind a trusted TLS endpoint

**Alternative MCP servers (two exist — do not conflate the tool names):** (1) **Local REST API's own built-in MCP** — the `obsidian-local-rest-api` plugin (v5.1.0+) serves a Streamable HTTP MCP at `https://127.0.0.1:27124/mcp/` exposing **16 `vault_*` tools** (`vault_read`/`vault_write`/`vault_patch`/`search_simple`/`tag_list`/…) — validated working, needs no extra npm package, and is a DIFFERENT surface from the cyanheads `obsidian_*` tools. (2) StevenStavrakis' `obsidian-mcp` (npm @1.0.6) is filesystem-based — treat its no-app/no-token claim as `VERIFY`.

---

## 4. RULES

### ✅ ALWAYS

1. **Resolve the execution profile before acting** — headless `notesmd-cli` is the default; only route to the app-backed `obsidian` CLI or the MCP when a live app (and, for the MCP, Local REST API + `OBSIDIAN_API_KEY`) is actually available. Probe, do not assume.
2. **Register and confirm the vault first** — run `notesmd-cli list-vaults` and, if empty, `notesmd-cli add-vault <path>` + `set-default-vault <name>` before any note operation.
3. **Preview destructive note ops** — for `move` and `delete`, confirm the exact note name with `notesmd-cli list` / `search` before running the write; deletions are hard to reverse.
4. **Quote note names and paths** — note titles and vault paths contain spaces; always wrap them in quotes in Bash.
5. **Run `notesmd-cli --version` (and, for the MCP path, confirm the Local REST API is reachable) as preflight** before starting an Obsidian session.
6. **Treat empty `notesmd-cli list` / `search` results as valid** — an empty vault or no-match search is not an error. Verify the default vault and query spelling before escalating.
7. **Confirm MCP tool names with `tool_info()`** before calling `obsidian.obsidian_*` — the callable form is `obsidian.obsidian_{tool_name}`.

### ⛔ NEVER

1. **Never assume a running app for the default path** — `notesmd-cli` is filesystem-only and needs no app; do not launch Obsidian just to run a headless note op.
2. **Never confuse the two CLIs** — `notesmd-cli` (Yakitrak, headless) and `obsidian` (official, app-backed) are different binaries with different behavior. The official one requires and controls a running app.
3. **Never use the StevenStavrakis `obsidian-mcp` as the default MCP** — this skill's MCP path is the cyanheads `obsidian-mcp-server`. The Stavrakis server is only the documented headless alternative.
4. **Never auto-modify `.utcp_config.json`, `.env.example`, `opencode.json`, or hub files** — this skill documents the `obsidian` manual; a later gated phase applies it. Print the config for the user; never write config files programmatically.
5. **Never hardcode the API key or base URL in commands or notes** — read them from `obsidian_OBSIDIAN_API_KEY` / `obsidian_OBSIDIAN_BASE_URL` in the Code Mode environment.
6. **Never fabricate notes** — if `notesmd-cli list`/`search` returns empty, the vault or query is genuinely empty. Report it clearly.
7. **Never enable `OBSIDIAN_VERIFY_SSL` blindly** — it defaults to `false`; only turn it on behind a trusted TLS endpoint.

### ⚠️ ESCALATE IF

- `notesmd-cli` is not installed and `scripts/install.sh` fails → report the OS/package-manager (brew/scoop/AUR) and Go toolchain state
- `notesmd-cli list-vaults` shows no vault or no default → direct to `add-vault` + `set-default-vault`
- The MCP connection fails → verify the `obsidian` manual in `.utcp_config.json` launches `npx -y obsidian-mcp-server@latest` over stdio, that Obsidian is running with Local REST API v4.0.0+ enabled, and that `obsidian_OBSIDIAN_API_KEY` / `obsidian_OBSIDIAN_BASE_URL` are set
- A `401`/`403` from the MCP → the API key is missing, wrong, or the Local REST API plugin is disabled
- A connection-refused / SSL error on `OBSIDIAN_BASE_URL` → the plugin is not listening on the expected port, or `OBSIDIAN_VERIFY_SSL` is mismatched with the endpoint

---

## 5. SUCCESS CRITERIA

- [ ] `notesmd-cli --version` prints a version string
- [ ] `notesmd-cli list-vaults` shows at least one registered vault with a default
- [ ] `notesmd-cli list` returns notes for the default vault (empty list is valid)
- [ ] `notesmd-cli search-content "<query>"` returns body matches (title `search` is broken in v0.3.6 — use `list` + filter for names)
- [ ] For in-app work: `obsidian "<vault/path>"` opens the note in the running app
- [ ] For MCP work: a Code Mode `obsidian.obsidian_get_note` call returns note content as JSON

---

## 6. INTEGRATION POINTS

**Gate 2 (Skill Routing):** This skill activates at ≥0.8 confidence for Obsidian note/vault requests. The skill advisor matches on: `obsidian`, `notesmd-cli`, `obsidian vault`, `note management`, `markdown notes`, `local rest api`.

**Code Mode MCP:** The cyanheads MCP tools are invoked via `mcp__code_mode__call_tool_chain`. Tool naming convention: `obsidian.obsidian_{tool_name}`. See `references/mcp-tools.md` for the full 14-tool catalog.

**Memory:** Save Obsidian workflow context (default vault name, base URL, active plugin set) using `/memory:save` when switching sessions.

**Tool Usage:** Use Bash for `notesmd-cli` and the official `obsidian` CLI. Use `mcp__code_mode__call_tool_chain` for cyanheads MCP operations. Use Read to load references on demand.

---

## 7. QUICK REFERENCE

### notesmd-cli Command Cheat Sheet (headless)

| Category | Command | Description |
|---|---|---|
| **Vaults** | `notesmd-cli add-vault "<path>"` | Register a vault |
| | `notesmd-cli remove-vault "<name>"` | Unregister a vault |
| | `notesmd-cli list-vaults` | List registered vaults + default |
| | `notesmd-cli set-default-vault "<name>"` | Set the default vault |
| **Read** | `notesmd-cli list` | List notes in the default vault |
| | `notesmd-cli search "<query>"` | Search by note name |
| | `notesmd-cli search-content "<query>"` | Full-text content search |
| | `notesmd-cli print "<name>"` | Print a note to stdout |
| **Write** | `notesmd-cli create "<name>"` | Create a note |
| | `notesmd-cli daily` | Open/append today's daily note |
| | `notesmd-cli move "<a>" "<b>"` | Move / rename a note |
| | `notesmd-cli delete "<name>"` | Delete a note |
| | `notesmd-cli frontmatter "<name>"` | Edit a note's frontmatter |
| **Open** | `notesmd-cli open "<name>"` | Open a note |

### Official `obsidian` CLI (app-backed)

| Command | Description |
|---|---|
| `obsidian "<vault/path>"` | Open a note in the running desktop app (launches it if needed) |
| `obsidian "obsidian://..."` | Trigger an `obsidian://` URI action in the live app |

*(Enable first: Settings → General → Command line interface → Register CLI. Ships with Obsidian desktop v1.12.4+.)*

### Cyanheads MCP Call Pattern (Code Mode)

```typescript
// Tool naming: obsidian.obsidian_{tool_name}  — 14 tools total
await call_tool_chain({
  code: `
    const hit  = await obsidian.obsidian_search_notes({ query: "roadmap" });
    const note = await obsidian.obsidian_get_note({ path: hit[0].path });
    await obsidian.obsidian_manage_tags({ path: hit[0].path, add: ["reviewed"] });
    return note;
  `,
});
```

---

## 8. REFERENCES AND RELATED RESOURCES

**Reference Files (load on demand via router):**
- `references/obsidian-cli-commands.md` — Full `notesmd-cli` + official `obsidian` CLI command reference with agent patterns
- `references/mcp-tools.md` — Cyanheads `obsidian-mcp-server` 14-tool catalog, priorities, and `call_tool_chain()` invocation
- `references/troubleshooting.md` — Install, vault, auth, Local REST API and MCP failures
- `references/plugins/plugin-operation-logic.md` — How plugin-driven note automation is operated
- `references/plugins/beancount-finance/beancount-finance.md` — Beancount Ledger / beancount-finance plugin index
- `references/plugins/beancount-finance/data-model.md` — Beancount Ledger settings, layout, directives, and BQL data model
- `references/plugins/beancount-finance/workflows.md` — Beancount Ledger file-layer recipes
- `references/plugins/beancount-finance/troubleshooting.md` — Beancount Ledger failure and recovery recipes
- `references/plugins/obsidian-tables/obsidian-tables.md` — Obsidian Tables plugin index
- `references/plugins/obsidian-tables/data-model.md` — `.table.md` envelope, columns, rows, formulas, and views
- `references/plugins/obsidian-tables/workflows.md` — Obsidian Tables file-layer recipes
- `references/plugins/obsidian-tables/troubleshooting.md` — Obsidian Tables failure and recovery recipes
- `references/plugins/obsidian42-brat/obsidian42-brat.md` — BRAT beta-plugin install/update index
- `references/plugins/obsidian42-brat/data-model.md` — BRAT `data.json` and release-policy data model
- `references/plugins/obsidian42-brat/workflows.md` — BRAT stage, register, activate, and update recipes
- `references/plugins/obsidian42-brat/troubleshooting.md` — BRAT release, asset, compatibility, and path recovery recipes
- `references/plugins/iconic/iconic.md` — Iconic icon/color rulebook plugin index (usage companion: `assets/plugins/iconic/iconic-rules.full.md`; canonical full rule payload: `assets/plugins/iconic/iconic-rules.full.json`, 21 file + 11 folder rules)
- `references/plugins/iconic/data-model.md` — Iconic `data.json` keys, rule schema, and the merge-only rulebook contract
- `references/plugins/iconic/workflows.md` — Iconic file-layer recipes: add/edit/disable rules, flip toggles, apply the canonical rulebook
- `references/plugins/iconic/troubleshooting.md` — Iconic failure and recovery recipes

Install guide (front door): [INSTALL-GUIDE.md](INSTALL-GUIDE.md) — condensed top-level install doc for both CLI profiles and the MCP; `references/troubleshooting.md` is the router's INSTALL/TROUBLESHOOT-intent target.

**Scripts:**
- `scripts/install.sh` — Installs `notesmd-cli` and prints the MCP config snippet
- `scripts/doctor.sh` — Diagnoses the CLI + MCP setup

**Embedded Servers:**
- `mcp-servers/obsidian-cli/README.md` — `notesmd-cli` install pointer (brew/scoop/AUR/source); run `setup.sh`
- `mcp-servers/obsidian-mcp/README.md` — Cyanheads `obsidian-mcp-server` configuration notes (stdio via `npx -y obsidian-mcp-server@latest`, `OBSIDIAN_API_KEY`/`OBSIDIAN_BASE_URL`/`OBSIDIAN_VERIFY_SSL`)

**Examples:**
- `examples/README.md` — Guide to the example note-workflow scripts

**Related Skills:**
- `mcp-click-up` — Structural sibling; same two-path (CLI + MCP) orchestrator pattern
- `mcp-code-mode` — Code Mode MCP orchestration (used for cyanheads MCP invocation)

**External:**
- notesmd-cli repository: https://github.com/Yakitrak/obsidian-cli
- cyanheads obsidian-mcp-server: https://github.com/cyanheads/obsidian-mcp-server
- Obsidian Local REST API plugin: https://github.com/coddingtonbear/obsidian-local-rest-api
