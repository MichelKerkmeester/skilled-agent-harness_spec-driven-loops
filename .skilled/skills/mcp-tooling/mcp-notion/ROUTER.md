---
title: "mcp-notion Router"
description: "Sibling router for mcp-notion: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "mcp-notion router"
  - "mcp-notion routing"
importance_tier: normal
contextType: general
version: 1.0.1.0
router_state: active
skill_pointer: SKILL.md
---

# mcp-notion Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when the `mcp-tooling` hub's `mcp-notion` signal selects this packet for a prompt that names Notion or one of its surfaces: a page, a block, a database or data source, a property, a relation, a rollup, a formula, an `ntn_` integration token, or a phrase such as create a notion page, add a row, query notion, notion search or upload a file to notion. It routes to six reference files under `references/`: `mcp-tools.md` for the 24-tool MCP catalog, `api-gap-tools.md` for the direct Notion API calls that fill the five capabilities the MCP does not expose, `property-types.md` and `database-model.md` for schema and data-source intent, `troubleshooting.md` for install and error intent, and `migration-inventory.md` for a Notion to Obsidian inventory. `references/mcp-tools.md` is the default reference and the fallback suggestion, and no other reference loads without an intent that selects it.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`NOTION_PAGES`** fires on page, pages, block, blocks, append, markdown, content, create page, retrieve page, update page, archive, comment, user, search, title search, sub-page and child page at weight 5. It loads `references/mcp-tools.md`.
- **`NOTION_DATA`** fires on database, data source, datasource, query, row, rows, relation, rollup, formula, schema, property, filter, sort, `data_source_id`, two-way relation and aggregate at weight 5. It loads `references/database-model.md`, then `references/property-types.md`, then `references/mcp-tools.md`.
- **`NOTION_API_GAP`** fires on file upload, upload a file, view, views, property item, non-truncated, async task, poll task and daily note at weight 6. It loads `references/api-gap-tools.md` and nothing else.
- **`NOTION_KNOWLEDGE`** fires on property type, property types, select, multi-select, status, formula function, rollup function, data model and hierarchy at weight 5. It loads `references/property-types.md` then `references/database-model.md`.
- **`NOTION_MIGRATION`** fires on migration, migrate, migration inventory, notion import, obsidian import, workspace inventory, pre-migration inventory, relation recovery, rollup recovery, comment reconstruction and parity verification at weight 5. It loads `references/migration-inventory.md`.
- **`INSTALL`** fires on install, setup, not found, not installed, notion token, `ntn_`, integration token, api token, mcp config, register, configure, configuration, getting started, onboarding, oauth, connect notion and how do i install at weight 6. It loads `references/troubleshooting.md`, and it beats every other intent once its score passes 4, except a `TROUBLESHOOT` score above 3.
- **`TROUBLESHOOT`** fires on error, failed, not working, 401, 403, 429, 400, rate limit, unauthorized, forbidden, slow, timeout, `validation_error`, `data_source_id`, deprecated, won't connect, can't connect, version mismatch and object_not_found at weight 6. It loads `references/troubleshooting.md`, and it wins outright once its score passes 3.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's deterministic routing detail behind the summary above: the loading levels, both routing decisions, the backend probe, the operation-to-tool table and the discovery pseudocode.

### Resource Loading Levels

```
ALWAYS:    SKILL.md and this ROUTER.md
ON_DEMAND: references/mcp-tools.md        (24-tool catalog + Code Mode invocation)
           references/api-gap-tools.md    (direct API for the 5 uncovered capabilities)
           references/property-types.md   (22 property types: schema, value, filter/sort)
           references/database-model.md    (data-source hierarchy, relations, rollups, Formulas 2.0)
           references/troubleshooting.md   (auth, rate-limit, version, deprecation-migration)
           references/migration-inventory.md (Notion→Obsidian migration read-side inventory method)
```

### Two Decisions This Router Makes

1. **MCP vs direct API** — anything in the 24-tool surface (page/block/data-source/comment/user/search CRUD) goes through the MCP over Code Mode; the five gaps (file uploads, views, page property items, async tasks, daily-notes convention) go to direct Notion API calls.
2. **Which backend** — headless **local stdio** (`npx @notionhq/notion-mcp-server`, `NOTION_TOKEN`) for Code Mode / automated sessions; **remote OAuth** (`mcp.notion.com`) only when an interactive browser session is available. Code Mode is headless, so it uses the local stdio backend.

### Backend Selection

```python
def resolve_notion_backend(runtime):
    """Pick the Notion backend. Probe, never assume.
      runtime.interactive   -> a browser/OAuth session is available
      runtime.oauth_token   -> remote Notion MCP OAuth completed
      runtime.notion_token  -> NOTION_TOKEN (ntn_...) present for Code Mode
    """
    # Remote MCP is OAuth-only and CANNOT run headless. Prefer it only when a
    # human/browser session is present; it adds async-task tools the local lacks.
    if runtime.interactive and runtime.oauth_token:
        return "REMOTE_MCP"      # https://mcp.notion.com/mcp (Streamable HTTP + OAuth)

    # Default for Code Mode and any automated session: the local stdio server.
    # Deprecated by Notion but the only headless-capable backend.
    if runtime.notion_token:
        return "LOCAL_STDIO"     # notion manual in .utcp_config.json, via Code Mode

    return "ESCALATE"            # no auth — direct the user to INSTALL-GUIDE.md
```

### Operation-to-Tool Routing Table

| Operation | Surface | Tool / call | Notes |
|---|---|---|---|
| Create / retrieve / update / archive a page | **MCP** | `create-a-page` / `retrieve-a-page` / `update-page-properties` / `archive-a-page` | Archive, not hard delete |
| Page body as markdown (read/write) | **MCP** | `retrieve-page-markdown` / `update-page-markdown` | Needs API `2026-03-11`; token-efficient |
| Append / update / delete blocks | **MCP** | block tools (`append-block-children`, `update-a-block`, `delete-a-block`, …) | Page *content* surface |
| Query / retrieve / update a data source | **MCP** | `query-data-source` + data-source tools | Target the **data-source id** |
| Comments (create, list) | **MCP** | comment tools | — |
| Users (list, retrieve, bot) | **MCP** | user tools | — |
| Search (by title) | **MCP** | `search` | **Title-only**; no full-text content search |
| **File uploads** | **direct API** | `POST /v1/file_uploads` (+ send/complete) | Not in MCP — see `api-gap-tools.md` |
| **Views** (create/list/query) | **direct API** | data-source view endpoints | Not in MCP |
| **Page property items** (non-truncated) | **direct API** | `GET /v1/pages/{id}/properties/{prop}` | Not in MCP |
| **Async tasks** (poll) | **direct API / remote MCP** | task-status endpoint | Native on remote MCP only |
| **Daily notes** | **convention** | knowledge-layer pattern | No API — see `database-model.md` |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references",)
DEFAULT_RESOURCE = "references/mcp-tools.md"
# Fallback-only: DEFAULT_RESOURCE is a defer-time suggestion, never unioned into a
# route's loaded set. Scored routes load exactly RESOURCE_MAP[intent]; zero-score
# routes load nothing and ask for disambiguation instead.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is Notion page/block ops, data-source/schema ops, an API-gap capability, install/auth, or troubleshooting",
    "Provide the page id, data-source id, property name, or error text",
    "Confirm whether NOTION_TOKEN (headless/Code Mode) or a remote OAuth session is available",
    "Confirm the verification command before completing any write action",
]

INTENT_SIGNALS = {
    "NOTION_PAGES": {
        "weight": 5,
        "keywords": ["page", "pages", "block", "blocks", "append", "markdown", "content",
                     "create page", "retrieve page", "update page", "archive", "comment",
                     "user", "search", "title search", "sub-page", "child page"],
    },
    "NOTION_DATA": {
        "weight": 5,
        "keywords": ["database", "data source", "datasource", "query", "row", "rows",
                     "relation", "rollup", "formula", "schema", "property", "filter",
                     "sort", "data_source_id", "two-way relation", "aggregate"],
    },
    "NOTION_API_GAP": {
        "weight": 6,
        "keywords": ["file upload", "upload a file", "view", "views", "property item",
                     "non-truncated", "async task", "poll task", "daily note"],
    },
    "NOTION_KNOWLEDGE": {
        "weight": 5,
        "keywords": ["property type", "property types", "select", "multi-select", "status",
                     "formula function", "rollup function", "data model", "hierarchy"],
    },
    "NOTION_MIGRATION": {
        "weight": 5,
        "keywords": ["migration", "migrate", "migration inventory", "notion import",
                     "obsidian import", "workspace inventory", "pre-migration inventory",
                     "relation recovery", "rollup recovery", "comment reconstruction",
                     "parity verification"],
    },
    "INSTALL": {
        "weight": 6,
        "keywords": ["install", "setup", "not found", "not installed", "notion token",
                     "ntn_", "integration token", "api token", "mcp config", "register",
                     "configure", "configuration", "getting started", "onboarding",
                     "oauth", "connect notion", "how do i install"],
    },
    "TROUBLESHOOT": {
        "weight": 6,
        "keywords": ["error", "failed", "not working", "401", "403", "429", "400",
                     "rate limit", "unauthorized", "forbidden", "slow", "timeout",
                     "validation_error", "data_source_id", "deprecated", "won't connect",
                     "can't connect", "version mismatch", "object_not_found"],
    },
}

# NOTE: no "DEFAULT" entry — route_notion_resources() never indexes RESOURCE_MAP by
# that key; the selected `intent` is always one of the seven INTENT_SIGNALS keys. The
# no-match case is owned by DEFAULT_RESOURCE, whose fallback-only semantics mean it is
# SUGGESTED beside the disambiguation checklist, never loaded — so mcp-tools.md cannot
# leak into the DATA / API_GAP / KNOWLEDGE / MIGRATION / INSTALL / TROUBLESHOOT routes.
RESOURCE_MAP = {
    "NOTION_PAGES":     ["references/mcp-tools.md"],
    "NOTION_DATA":      ["references/database-model.md", "references/property-types.md",
                         "references/mcp-tools.md"],
    "NOTION_API_GAP":   ["references/api-gap-tools.md"],
    "NOTION_KNOWLEDGE": ["references/property-types.md", "references/database-model.md"],
    "NOTION_MIGRATION": ["references/migration-inventory.md"],
    "INSTALL":          ["references/troubleshooting.md"],
    "TROUBLESHOOT":     ["references/troubleshooting.md"],
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

def route_notion_resources(request: str) -> dict:
    """Score intent labels and load available Notion reference docs."""
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    request_lower = request.lower()

    scores = {}
    for intent, config in INTENT_SIGNALS.items():
        score = sum(config["weight"] for kw in config["keywords"] if kw in request_lower)
        if score > 0:
            scores[intent] = score

    if not scores:
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "suggested_fallback": DEFAULT_RESOURCE,
            "resources": loaded,
        }

    # Error/install keywords win regardless of other signals.
    if scores.get("TROUBLESHOOT", 0) > 3:
        intent = "TROUBLESHOOT"
    elif scores.get("INSTALL", 0) > 4:
        intent = "INSTALL"
    else:
        intent = max(scores, key=scores.get)

    for resource in RESOURCE_MAP[intent]:
        load_if_available(resource, loaded, seen, inventory)

    if not loaded:
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "notice": f"No Notion reference docs available for intent '{intent}'",
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "suggested_fallback": DEFAULT_RESOURCE,
            "resources": loaded,
        }

    return {"intent": intent, "resources": loaded}
```
