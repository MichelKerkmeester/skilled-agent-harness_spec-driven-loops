---
title: "Iteration 1: Official Notion MCP Server — Complete Tool Inventory & Capability Map"
trigger_phrases: []
---
# Iteration 1: Official Notion MCP Server — Complete Tool Inventory & Capability Map

## Focus
Map the official `@notionhq/notion-mcp-server`'s complete tool inventory — enumerate all tools, their input/output schemas, and categorize by Notion API domain. Assess the spec's "~18 tools" assumption against the current published version.

## Findings

### F1.1 — Current version is v2.5.1 with 24 tools (not ~18)

The spec's assumption of "~18 tools" is outdated. The npm package `@notionhq/notion-mcp-server` is at **v2.5.1** (updated 2026-08-04), with **24 tools** — confirmed by a third-party benchmark comparison stating "24 tools (one per endpoint), 17,163 tokens loaded into context" for the official open-source server. [SOURCE: https://www.npmjs.com/package/@notionhq/notion-mcp-server] [SOURCE: https://www.npmjs.com/package/notion-mcp-server]

The v2.0.0 release notes state "Total tools now: 22 (was 19 in v1.x)" — that was at the v2.0.0 boundary. Two additional markdown tools (`retrieve-page-markdown`, `update-page-markdown`) were added in a subsequent minor release (v2.1+), bringing the total to 24. [SOURCE: https://raw.githubusercontent.com/makenotion/notion-mcp-server/main/README.md]

### F1.2 — v2.0.0 breaking change: data sources replace databases

v2.0.0 migrated to **Notion API version 2025-09-03**, which introduces **data sources** as the primary abstraction for databases. Three database tools were removed and replaced:

| Removed (v1.x) | Replacement (v2.0) | Parameter change |
|---|---|---|
| `post-database-query` | `query-data-source` | `database_id` → `data_source_id` |
| `update-a-database` | `update-a-data-source` | `database_id` → `data_source_id` |
| `create-a-database` | `create-a-data-source` | No change (uses `parent.page_id`) |

Six truly new tools were added: `query-data-source`, `retrieve-a-data-source`, `update-a-data-source`, `create-a-data-source`, `list-data-source-templates`, `move-page`. `retrieve-a-database` was retained (returns database metadata including data source IDs). [SOURCE: https://raw.githubusercontent.com/makenotion/notion-mcp-server/main/README.md]

### F1.3 — Complete 24-tool inventory by API domain

The server is built from the Notion OpenAPI spec, exposing one tool per endpoint. The 24 tools map to these API domains:

**Pages (7 tools):**
- `create-a-page` — POST /v1/pages (create page with properties, content, icon, cover)
- `retrieve-a-page` — GET /v1/pages/{page_id}
- `update-page-properties` — PATCH /v1/pages/{page_id} (update properties, archived status, icon)
- `archive-a-page` — PATCH /v1/pages/{page_id} with archived:true (soft-delete)
- `move-page` — POST /v1/pages/{page_id}/move (move to different parent) [v2.0 new]
- `retrieve-page-markdown` — GET /v1/pages/{page_id}/markdown (read as Markdown) [requires API 2026-03-11]
- `update-page-markdown` — PATCH /v1/pages/{page_id}/markdown (edit via Markdown, replace or find-and-replace) [requires API 2026-03-11]

**Blocks (5 tools):**
- `retrieve-a-block` — GET /v1/blocks/{block_id}
- `retrieve-block-children` — GET /v1/blocks/{block_id}/children
- `append-block-children` — PATCH /v1/blocks/{block_id}/children
- `update-a-block` — PATCH /v1/blocks/{block_id}
- `delete-a-block` — DELETE /v1/blocks/{block_id}

**Databases / Data Sources (6 tools):**
- `retrieve-a-database` — GET /v1/databases/{database_id} (metadata + data source IDs)
- `query-data-source` — POST /v1/data_sources/{data_source_id}/query (filtered/sorted query) [v2.0 new]
- `retrieve-a-data-source` — GET /v1/data_sources/{data_source_id} (schema + properties) [v2.0 new]
- `update-a-data-source` — PATCH /v1/data_sources/{data_source_id} [v2.0 new]
- `create-a-data-source` — POST /v1/data_sources [v2.0 new]
- `list-data-source-templates` — GET /v1/data_sources/{data_source_id}/templates [v2.0 new]

**Comments (2 tools):**
- `create-a-comment` — POST /v1/comments (page-level or discussion reply)
- `list-comments` — GET /v1/comments

**Users (3 tools):**
- `list-all-users` — GET /v1/users
- `retrieve-a-user` — GET /v1/users/{user_id}
- `retrieve-bot-user` — GET /v1/users/me (bot identity)

**Search (1 tool):**
- `search` — POST /v1/search (search pages/data_sources by title)

[SOURCE: https://raw.githubusercontent.com/makenotion/notion-mcp-server/main/README.md] [SOURCE: https://developers.notion.com/reference/intro] [SOURCE: https://notion.rest/]

### F1.4 — Critical: open-source local server is being deprecated

Notion is prioritizing the **remote Notion MCP** at `https://mcp.notion.com/mcp` with standard OAuth. The GitHub README explicitly states:

> "We are prioritizing, and only providing active support for, Notion MCP (remote). As a result: We may sunset this local MCP server repository in the future. Issues and pull requests here are not actively monitored."

The Notion hosting guide confirms: "The open-source notion-mcp-server package is no longer actively maintained. We recommend the remote Notion MCP server for most clients." [SOURCE: https://developers.notion.com/guides/mcp/hosting-open-source-mcp]

This is a **critical risk factor** for the adopt-vs-build decision: adopting the open-source local server means adopting a deprecated surface.

### F1.5 — Markdown round-trip is a significant capability addition

The two markdown tools (`retrieve-page-markdown`, `update-page-markdown`) are specifically designed for AI agents, offering "enhanced Markdown instead of block JSON, which is significantly more token-efficient." `update-page-markdown` supports both `replace_content` (full overwrite) and `update_content` (targeted find-and-replace). These require Notion API version `2026-03-11`, while the rest of the API uses `2025-09-03`. The server sources the `Notion-Version` header per-operation from the OpenAPI spec. [SOURCE: https://raw.githubusercontent.com/makenotion/notion-mcp-server/main/README.md]

### F1.6 — Transport options: stdio and Streamable HTTP

The server supports two transport modes:
- **STDIO** (default) — standard MCP transport, used by Claude Desktop, Cursor, etc.
- **Streamable HTTP** — for web-based clients, with bearer token auth, configurable port/host, and per-request token passthrough for multi-tenant deployments.

The stdio transport with `NOTION_TOKEN` env var is the headless/Code Mode compatible path. [SOURCE: https://raw.githubusercontent.com/makenotion/notion-mcp-server/main/README.md]

### F1.7 — API domains NOT covered by the MCP server

Comparing the 24-tool inventory against the full Notion API reference endpoint tags, these API domains are **not exposed** by the open-source MCP server:

- **File uploads** — no `upload-file`, `list-file-uploads`, `get-file-upload` tools (the API has these endpoints)
- **Views** — no view creation, update, deletion, or query tools (the API has view endpoints)
- **Async tasks** — no task status polling (e.g., for duplicate-page operations)
- **OAuth** — no OAuth flow tools (handled externally)
- **Agents** — no agent endpoints
- **Sessions** — no session endpoints
- **Custom emojis** — no custom emoji endpoints
- **Meeting notes** — no meeting note endpoints
- **Page property items** — no individual property item retrieval (GET /v1/pages/{page_id}/properties/{property_id})

[SOURCE: https://developers.notion.com/reference/intro] [SOURCE: https://developers.notion.com/reference/post-search]

## Sources Consulted
- https://www.npmjs.com/package/@notionhq/notion-mcp-server (v2.5.1, updated 2026-08-04)
- https://raw.githubusercontent.com/makenotion/notion-mcp-server/main/README.md (full README)
- https://developers.notion.com/guides/mcp/hosting-open-source-mcp (deprecation notice)
- https://developers.notion.com/reference/intro (API endpoint tags)
- https://notion.rest/ (community API reference)
- https://www.npmjs.com/package/notion-mcp-server (third-party comparison: 24 tools, 17,163 tokens)
- https://chatforest.com/reviews/notion-mcp-server/ (remote MCP tool names review)

## Assessment
- **newInfoRatio: 1.0** — First pass; all findings are new to this packet. The tool count correction (18→24), the data sources migration, the markdown round-trip, and the deprecation status are all foundational discoveries.
- **Novelty justification**: First iteration establishing the baseline capability map; every finding is net-new.
- **Confidence**: High on tool count (24) and deprecation status (multiple sources confirm). Medium on exact tool-name enumeration (inferred from API endpoint mapping + README; the server generates tools from OpenAPI spec so names follow `operationId` convention).

## Reflection
- **What worked**: Web search + raw README fetch gave the authoritative tool inventory and the critical deprecation finding.
- **What failed**: GitHub rendered page didn't surface the README content; had to fetch the raw URL.
- **Ruled out**: Nothing yet — too early.

## Recommended Next Focus
Iteration 2: Map the full Notion REST API surface beyond the MCP tools — enumerate all API endpoints (file uploads, views, async tasks, page property items, agents, sessions, custom emojis, meeting notes) and assess which gaps matter for an mcp-notion mode at mcp-obsidian parity.
