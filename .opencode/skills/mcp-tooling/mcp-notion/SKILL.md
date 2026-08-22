---
name: mcp-notion
description: Operates a Notion workspace through the official Notion MCP (@notionhq/notion-mcp-server, 24 tools) over Code Mode, fills 5 API gaps with direct Notion API calls, and routes between the headless local-stdio backend and the interactive remote OAuth backend. Carries a Notion knowledge layer (data-source model, 22 property types, relations, rollups, Formulas 2.0). Embedded registration and agent safety invariants.
allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]
version: 0.1.0.0
---

<!-- keywords: notion, notion mcp, notion api, notion database, notion data source, notion page, notion property, notion relation, notion rollup, notion formula, notion token, ntn_, notion-mcp-server, notion markdown, notion search -->

# mcp-notion Skill

Notion workspace operations via the **official Notion MCP** (`@notionhq/notion-mcp-server`, 24 tools) over Code Mode, plus **direct Notion API calls** for the five capabilities the MCP does not expose. It knows Notion's data model at the schema layer — data sources, 22 property types, relations, rollups, Formulas 2.0 — so an agent can create, query, and extend a workspace without guessing.

---

## MARKDOWN + DATA-SOURCE CONTRACT — READ BEFORE ANY NOTION WRITE

Two shape rules cause most Notion write failures:

1. **Page bodies vs page properties are different surfaces.** A page's *content* is a tree of **blocks** (append/update via block tools, or the markdown round-trip tools). A page's *metadata* is **properties** typed by its parent data source's schema. Writing prose into a property, or a property value into a block, fails or silently truncates.
2. **API 2.0 replaced "databases" with "data sources"** (API version `2025-09-03`). A database is now a container of one or more **data sources**; queries, schema, relations, and rollups all target a **data source id**, not a database id. Using a database id where a data-source id is required is the most common 400.

Markdown round-trip tools (`retrieve-page-markdown` / `update-page-markdown`) require API version `2026-03-11` and are the token-efficient path for AI. Full detail: `references/database-model.md` and `references/mcp-tools.md`.

**Failure symptom:** a `validation_error` naming `data_source_id`, or property writes that vanish, means a database id was used where a data-source id was required, or content was routed to the wrong surface.

---

## 1. WHEN TO USE

### Activation Triggers (explicit user phrases)

- "notion", "notion mcp", "notion api", "mcp-notion"
- "notion page", "notion database", "notion data source", "query notion"
- "create a notion page", "add a row", "notion property", "notion relation", "notion rollup", "notion formula"
- "notion token", "notion integration", "ntn_", "notion search"
- "upload a file to notion", "notion view", "notion async task"

### Automatic Triggers (keyword patterns)

- `notion` + any action verb (create, read, update, query, search, append, archive)
- "data source" / "property" / "rollup" / "relation" in a Notion context
- MCP tool names: `create-a-page`, `query-data-source`, `retrieve-a-page` (namespaced `notion.notion_<name>`)

### When NOT to Use

- **Community Notion MCP servers** (suekou/mcp-notion-server, awkoy/notion-mcp-server) — this mode uses the **official** `@notionhq/notion-mcp-server` only.
- **Notion→Obsidian migration mechanics (running the importer itself)** — the importer runs inside the Obsidian desktop app, not here; this mode is the read-side inventory enabler (`references/migration-inventory.md`), not the importer.
- Generic markdown authoring with no Notion workspace — use `@markdown` / `sk-doc`.
- Non-Notion knowledge apps (Obsidian, ClickUp docs) — wrong surface (`mcp-obsidian`, `mcp-click-up`).

---

## 2. SMART ROUTING

### Resource Loading Levels

```
ALWAYS:    SKILL.md (this file)
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

---

## 3. HOW IT WORKS

### Backend Comparison

| Dimension | Local stdio (default, headless) | Remote MCP (interactive) |
|---|---|---|
| **Transport** | stdio via `npx -y @notionhq/notion-mcp-server` | Streamable HTTP at `https://mcp.notion.com/mcp` |
| **Auth** | `NOTION_TOKEN` (`ntn_…` internal-integration token) | OAuth (browser) |
| **Headless?** | **Yes** — the only Code-Mode-capable backend | No — interactive only |
| **Tool names** | `create-a-page`, `retrieve-a-page`, … | `notion-create-pages`, … + async tasks |
| **Status** | **Deprecated** by Notion, still functional | **Recommended** by Notion |
| **Used by** | Code Mode / automation | Human-in-the-loop clients |

> **Deprecation note.** Notion is deprecating the open-source local server in favor of the remote OAuth server. Code Mode is headless, so the local stdio server is the correct (and only) choice here today; `references/troubleshooting.md` carries the local→remote migration path for when the operator moves to an interactive workflow.

### Official Notion MCP — via Code Mode (default path)

The registered `notion` manual launches `@notionhq/notion-mcp-server` over **stdio** with `npx -y`. It talks to Notion's REST API with the integration's `NOTION_TOKEN`.

**Prerequisites:**
- Code Mode MCP configured, with the `notion` manual in `.utcp_config.json` (already registered — see INSTALL-GUIDE).
- `notion_NOTION_TOKEN` (an `ntn_…` internal-integration token) available to Code Mode, and the integration granted content access to the target pages/data sources.

**Configuration** (`.utcp_config.json`, `manual_call_templates`) — already applied:
```json
{
  "name": "notion",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "notion": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@notionhq/notion-mcp-server"],
        "env": { "NOTION_TOKEN": "${notion_NOTION_TOKEN}" }
      }
    }
  }
}
```

The `notion_` env prefix matches the manual name `notion`, so `${notion_NOTION_TOKEN}` resolves. This mode documents that registration; it does not rewrite config files.

**Tools:** the server exposes **24 `notion_*` tools** across 6 domains — pages (7), blocks (5), data sources (6), comments (2), users (3), search (1). Confirm every name with `tool_info()` / `list_tools()` before calling; the full catalog with per-tool inputs is in `references/mcp-tools.md`.

**Invocation via Code Mode** (`call_tool_chain` takes a single `code` string):
```typescript
// Code Mode namespaces each tool as notion.notion_<tool_name>. Notion tool names are
// HYPHENATED (create-a-page, retrieve-a-page), so notion.notion_retrieve-a-page is invalid
// JS (it parses as subtraction) — use hyphen-safe BRACKET access. VERIFY once the manual is
// registered: run list_tools() to read the exact callable; Code Mode MAY instead sanitize
// hyphens to underscores (notion.notion_retrieve_a_page). Bracket form is the safe default.
const result = await call_tool_chain({
  code: `
    const hit  = await notion["notion_search"]({ query: "Roadmap" });
    const page = await notion["notion_retrieve-a-page"]({ page_id: hit.results[0].id });
    return page;
  `,
});
```

### The Five API Gaps (direct API)

File uploads, views, non-truncated page property items, and async-task polling exist in the Notion REST API but **not** in the MCP tool surface; daily notes are a convention with no endpoint. Fill them with direct calls (`Authorization: Bearer $notion_NOTION_TOKEN`, `Notion-Version: 2025-09-03`, or `2026-03-11` for markdown/async). Recipes: `references/api-gap-tools.md`.

**When to prefer the remote MCP:** interactive sessions where OAuth is available and async-task tools are needed. Otherwise stay on the local stdio backend.

**Limitations:** search is title-only (no full-text content search); pages archive rather than hard-delete; the workspace is cloud-only (no headless filesystem); rate limit ≈ 3 req/s per integration with `Retry-After`.

---

## 4. RULES

### ✅ ALWAYS

1. **Resolve the backend before acting** — Code Mode uses the local stdio backend with `NOTION_TOKEN`; only route to the remote OAuth backend when an interactive session is genuinely available. Probe, do not assume.
2. **Target a data-source id, not a database id** — API 2.0 made data sources the primary abstraction; queries, schema, relations, and rollups all take a `data_source_id`.
3. **Route content to the right surface** — page prose → blocks (or markdown round-trip tools); metadata → typed properties. Never cross them.
4. **Confirm MCP tool names with `list_tools()` / `tool_info()`** before calling — Notion tool names are hyphenated (`create-a-page`), so the hyphen-safe callable is bracket-access `notion["notion_create-a-page"]` unless `list_tools()` shows Code Mode sanitized them to underscores.
5. **Read a data source's schema before writing rows** — property types and select options are schema-defined; writing an undefined option or wrong-typed value fails.
6. **Handle the rate limit** — ≈3 req/s per integration; on `429` back off with jitter and honor `Retry-After`. Batch reads where possible.
7. **Pin the API version per operation** — `2025-09-03` for most tools, `2026-03-11` for markdown round-trip and async tasks.
8. **Preview destructive ops** — confirm the exact page/row before archive; Notion archives (recoverable) rather than hard-deletes, but bulk archives are still disruptive.

### ⛔ NEVER

1. **Never hardcode the token** — read it from `notion_NOTION_TOKEN` in the Code Mode environment; never inline `ntn_…` in a command, note, or example.
2. **Never use a community Notion MCP server as the default** — this mode is the official `@notionhq/notion-mcp-server`.
3. **Never assume the remote OAuth backend works headless** — it cannot; Code Mode must use the local stdio backend.
4. **Never auto-modify `.utcp_config.json`, `.env.example`, `opencode.json`, or hub files** — the `notion` manual is already registered there; if it needs changing, print the config for the user and never write these files programmatically.
5. **Never fabricate pages, rows, or property values** — if a query returns empty, the data source is genuinely empty or the integration lacks access. Report it.
6. **Never treat search as full-text** — `search` matches titles only; to find by content, retrieve candidate pages and inspect client-side.
7. **Never write markdown into a property field** — prose belongs in blocks or the markdown round-trip; properties are typed values.

### ⚠️ ESCALATE IF

- No `NOTION_TOKEN` and no OAuth session → direct the user to `INSTALL-GUIDE.md` (create an internal integration, copy the `ntn_…` token to `.env`, grant content access).
- A `401`/`403` → the token is missing/wrong, or the integration was not granted access to the target page/data source.
- A `validation_error` naming `data_source_id` → a database id was used where a data-source id is required (2.0 migration); resolve the data source first.
- Persistent `429` → the integration is over ≈3 req/s; reduce concurrency, add backoff, or batch.
- The operator wants an interactive/OAuth workflow → follow the local→remote migration path in `references/troubleshooting.md`.

---

## 5. SUCCESS CRITERIA

- [ ] Code Mode `notion["notion_search"]({query})` returns results (empty is valid) — confirms the manual + token work
- [ ] `list_tools()` shows `notion.notion_*` entries; `tool_info("notion.notion_retrieve-a-page")` resolves a live schema
- [ ] `query-data-source` returns rows for a data-source id the integration can access
- [ ] A page create + markdown round-trip (`update-page-markdown` → `retrieve-page-markdown`) preserves content
- [ ] An API-gap call (e.g. a page-property-item `GET`) returns data with the Bearer token from the environment
- [ ] `bash scripts/doctor.sh` reports Node/npx, the `notion` manual, and `notion_NOTION_TOKEN` state without mutating

---

## 6. INTEGRATION POINTS

**Gate 2 (Skill Routing):** activates at ≥0.8 confidence for Notion workspace requests. The advisor matches on `notion`, `notion mcp`, `notion database`, `notion data source`, `notion page`, `notion token`.

**Code Mode MCP:** the official Notion MCP tools are invoked via `mcp__code_mode__call_tool_chain`; Code Mode namespaces each as `notion.notion_<tool_name>` — use hyphen-safe bracket access since Notion names are hyphenated. See `references/mcp-tools.md`.

**Migration (packet 015):** this mode is the read-side inventory enabler for Notion→Obsidian migration (`references/migration-inventory.md`) — the same knowledge layer that operates a live workspace reads its structure to drive an Obsidian import; the write-side reconstruction method lives in `mcp-obsidian`'s `references/notion-migration.md`.

**Memory:** save Notion workflow context (target data-source ids, integration name, backend) with `/memory:save` when switching sessions.

**Tool Usage:** Bash for direct API calls and `scripts/`; `mcp__code_mode__call_tool_chain` for MCP operations; Read to load references on demand.

---

## 7. QUICK REFERENCE

### Notion MCP tool surface (24 tools, 6 domains — confirm names with `tool_info()`)

| Domain | Count | Representative tools |
|---|---|---|
| **Pages** | 7 | create, retrieve, update, archive; markdown retrieve/update |
| **Blocks** | 5 | retrieve, children, append, update, delete |
| **Data sources** | 6 | query, retrieve, update, create, templates |
| **Comments** | 2 | create, list |
| **Users** | 3 | list, retrieve, bot |
| **Search** | 1 | title search |

### The 5 gaps → direct API (`references/api-gap-tools.md`)

| Gap | Endpoint family |
|---|---|
| File uploads | `POST /v1/file_uploads` (+ send / complete) |
| Views | data-source view endpoints |
| Page property items | `GET /v1/pages/{id}/properties/{prop}` |
| Async tasks | task-status endpoint (native on remote MCP) |
| Daily notes | convention (no endpoint) |

### Code Mode call pattern

```typescript
// 24 tools, namespaced notion.notion_<tool_name>; hyphenated names → bracket access.
// Confirm the exact callable with list_tools() before relying on either form.
await call_tool_chain({
  code: `
    const ds = await notion["notion_query-data-source"]({
      data_source_id: "DATA_SOURCE_ID",
      filter: { property: "Status", status: { equals: "In progress" } },
    });
    return ds.results.map(p => p.id);
  `,
});
```

---

## 8. REFERENCES AND RELATED RESOURCES

**Reference Files (load on demand via router):**
- `references/mcp-tools.md` — the 24-tool catalog by domain + Code Mode invocation
- `references/api-gap-tools.md` — direct Notion API for the 5 uncovered capabilities
- `references/property-types.md` — 22 property types: schema, value, filter/sort
- `references/database-model.md` — data-source hierarchy, relations, rollups, Formulas 2.0
- `references/troubleshooting.md` — auth, rate-limit, API-version, deprecation-migration
- `references/migration-inventory.md` — Notion→Obsidian migration read-side inventory method: the 7-step inventory procedure, the 5 API-gap reads it uses, and the read-limit constraints that shape it

Install guide (front door): [INSTALL-GUIDE.md](INSTALL-GUIDE.md) — token setup, Code Mode registration, dual-backend config.

**Scripts:**
- `scripts/install.sh` — prints the Code Mode manual + `notion_NOTION_TOKEN` env key (read-only)
- `scripts/doctor.sh` — diagnoses Node/npx, the manual, and the token

**Embedded Servers:**
- `mcp-servers/notion-mcp/README.md` — official `@notionhq/notion-mcp-server` config notes (stdio, `NOTION_TOKEN`, dual-backend)

**Examples:**
- `examples/README.md` — Code Mode Notion workflow examples

**Related Skills:**
- `mcp-click-up` — structural sibling (light workflow mode)
- `mcp-obsidian` — sibling knowledge app; the 015 migration counterpart
- `mcp-code-mode` — Code Mode MCP orchestration (used for Notion MCP invocation)

**External:**
- Official Notion MCP server: https://github.com/makenotion/notion-mcp-server
- Notion API reference: https://developers.notion.com/reference
