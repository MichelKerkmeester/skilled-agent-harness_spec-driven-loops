---
title: "Iteration 2: Full Notion REST API Surface Beyond MCP Tools"
trigger_phrases: []
---
# Iteration 2: Full Notion REST API Surface Beyond MCP Tools

## Focus
Map the complete Notion REST API endpoint surface (15 domains) and identify which endpoints the official MCP server does NOT expose. Assess which gaps matter for an mcp-notion mode at mcp-obsidian parity. Also capture rate limits and property types as foundational knowledge.

## Findings

### F2.1 — Notion API has 15 endpoint domains; MCP covers 6

The Notion API reference (OpenAPI spec) defines 15 endpoint tags. The official MCP server exposes tools for 6 of them:

| Domain | MCP coverage | Endpoints in API | MCP tools |
|---|---|---|---|
| Pages | ✅ 7 tools | create, retrieve, update, archive, move, markdown×2 | All covered |
| Blocks | ✅ 5 tools | retrieve, children, append, update, delete | All covered |
| Data sources | ✅ 6 tools | query, retrieve, update, create, templates | All covered |
| Comments | ✅ 2 tools | create, list | All covered |
| Users | ✅ 3 tools | list, retrieve, bot/me | All covered |
| Search | ✅ 1 tool | post-search | All covered |
| **File uploads** | ❌ 0 tools | create, send, complete, retrieve, list | **NOT covered** |
| **Views** | ❌ 0 tools | create, list, retrieve, update, delete, query | **NOT covered** |
| **Async tasks** | ❌ 0 tools | retrieve (poll status) | **NOT covered** |
| **Page property items** | ❌ 0 tools | retrieve individual property | **NOT covered** |
| **Agents** | ❌ 0 tools | agent endpoints | **NOT covered** |
| **Sessions** | ❌ 0 tools | session endpoints | **NOT covered** |
| **Custom emojis** | ❌ 0 tools | custom emoji endpoints | **NOT covered** |
| **Meeting notes** | ❌ 0 tools | meeting note endpoints | **NOT covered** |
| **OAuth** | ❌ 0 tools | OAuth flow (external) | N/A (handled externally) |

[SOURCE: https://developers.notion.com/reference/intro] [SOURCE: https://developers.notion.com/reference/create-file] [SOURCE: https://developers.notion.com/reference/create-view]

### F2.2 — File uploads: 5 endpoints, completely absent from MCP

The Notion API supports file uploads via 5 endpoints:
- `POST /v1/file_uploads` (create-file) — create a file upload (modes: `single_part`, `multi_part`, `external_url`)
- `POST /v1/file_uploads/{id}/send` (upload-file) — send file contents
- `POST /v1/file_uploads/{id}/complete` (complete-file-upload) — finalize multi-part upload
- `GET /v1/file_uploads/{id}` (retrieve-file-upload) — get status
- `GET /v1/file_uploads` (list-file-uploads) — list uploads

Files up to 5 GiB on paid plans (5 MiB on free). Files >20 MiB require multi-part mode. Once uploaded, file IDs are attached to blocks, pages, and database properties via file objects. [SOURCE: https://developers.notion.com/reference/create-file] [SOURCE: https://developers.notion.com/guides/data-apis/working-with-files-and-media]

**Gap significance for mcp-notion**: An mcp-obsidian-parity mode needs to handle attachments (images, PDFs, files). Without file upload tools, the MCP server cannot attach files to Notion pages — a capability gap that requires either direct API calls or a custom tool.

### F2.3 — Views: 6+ endpoints, completely absent from MCP

The Notion API supports database views via:
- `POST /v1/views` (create-view) — create views: table, board, list, calendar, timeline, gallery, form, chart, map, dashboard
- `GET /v1/views` (list-views)
- `GET /v1/views/{id}` (retrieve-a-view)
- `PATCH /v1/views/{id}` (update-a-view) — modify filters, sorts, display settings
- `DELETE /v1/views/{id}` (delete-a-view)
- `POST /v1/views/{id}/query` (get-view-query-results / create-view-query) — query using a view's predefined filters/sorts

[SOURCE: https://developers.notion.com/reference/create-view]

**Gap significance**: Views are a core Notion organizational concept (equivalent to Obsidian's saved searches/Dataview queries). Without view tools, the MCP cannot create, modify, or query saved views — limiting the mode's ability to manage Notion databases at parity with how mcp-obsidian manages Dataview queries.

### F2.4 — Async tasks: needed for page duplication and long operations

The API has `GET /v1/async_tasks/{task_id}` (retrieve-an-async-task) for polling the status of asynchronous operations (e.g., page duplication completes asynchronously). The MCP server has no async task tool, meaning duplicate-page operations cannot be monitored. [SOURCE: https://developers.notion.com/reference/intro]

**Gap significance**: Medium — page duplication is a convenience operation, not a core parity requirement. But any mode that triggers async operations needs a way to poll completion.

### F2.5 — Rate limits: 3 requests/second per integration

The Notion API enforces two rate limits:
- **Per connection**: average 3 requests/second, with some bursts allowed
- **Per workspace**: shared across all connections, scaled to workspace plan (Free: ~10 r/s, Plus: ~25 r/s, Business: ~50 r/s, Enterprise: ~100 r/s)
- Secondary limit: ~1000 requests per 5 minutes per workspace
- HTTP 429 with `Retry-After` header (seconds); HTTP 529 for service overload
- No published way to raise the 3 r/s limit for standard integrations

[SOURCE: https://developers.notion.com/reference/request-limits] [SOURCE: https://novumos.app/learn/notion-api-rate-limits]

**Significance for mcp-notion**: The 3 r/s limit is a hard constraint for batch operations, bulk imports, and AI agent workflows that process many pages. The mode must encode rate-limit handling (retry with backoff, respect Retry-After). This is analogous to mcp-obsidian's need to handle the Local REST API's request limits, but more constraining.

### F2.6 — Notion property types: 22 types defining the knowledge layer

The Notion data source (database) schema supports 22 property types:

`title`, `rich_text`, `number`, `select`, `multi_select`, `status`, `date`, `people`, `files`, `checkbox`, `url`, `email`, `phone_number`, `formula`, `relation`, `rollup`, `created_time`, `created_by`, `last_edited_time`, `last_edited_by`, `unique_id`, `place`

Plus `verification` as a page property value type (not a schema type).

Each property type has specific configuration (e.g., `select` has options with colors, `number` has number format, `formula` has expression, `relation` has target database + single/dual direction, `rollup` has relation + target property + aggregation function). [SOURCE: https://developers.notion.com/reference/property-object] [SOURCE: https://developers.notion.com/reference/property-schema-object] [SOURCE: https://developers.notion.com/reference/page-property-values]

**Significance**: This is the core of the Notion knowledge layer the mode must encode — analogous to mcp-obsidian's plugin file-layer doctrine. The 22 property types, their configurations, and their interdependencies (relation → rollup, formula referencing other properties) define the schema the mode must understand to create, query, and manage Notion databases.

### F2.7 — Page property items: individual property retrieval not in MCP

The API has `GET /v1/pages/{page_id}/properties/{property_id}` (retrieve-a-page-property) for retrieving individual property items. This is the recommended way to get accurate, non-truncated values for `title`, `rich_text`, `relation`, and `people` properties (which are paginated). The MCP server does not expose this endpoint. [SOURCE: https://developers.notion.com/reference/intro] [SOURCE: https://developers.notion.com/reference/property-item-object]

**Gap significance**: Low-medium — the MCP's `retrieve-a-page` returns all properties, but for large text/relation fields, individual property retrieval avoids truncation. A custom tool could fill this gap.

## Sources Consulted
- https://developers.notion.com/reference/intro (API endpoint tags, pagination)
- https://developers.notion.com/reference/create-file (file upload endpoints)
- https://developers.notion.com/reference/create-view (view endpoints)
- https://developers.notion.com/reference/complete-file-upload (multi-part upload)
- https://developers.notion.com/guides/data-apis/working-with-files-and-media (file upload guide)
- https://developers.notion.com/reference/request-limits (rate limits)
- https://developers.notion.com/reference/property-object (property types)
- https://developers.notion.com/reference/property-schema-object (property schema configuration)
- https://developers.notion.com/reference/page-property-values (page property value types)
- https://developers.notion.com/reference/property-item-object (property item retrieval)
- https://novumos.app/learn/notion-api-rate-limits (rate limit analysis)
- https://ones.com/blog/demystifying-notion-api-rate-limits (workspace plan limits)

## Assessment
- **newInfoRatio: 0.85** — Nearly all findings are new; the gap analysis (9 of 15 domains uncovered), rate limits, and 22 property types are all net-new. Slight overlap with iteration 1's gap list, but now with endpoint-level detail.
- **Novelty justification**: Expanded the high-level gap list from iteration 1 into endpoint-level enumeration; added rate limits and property type catalog as foundational knowledge for the knowledge-layer question.
- **Confidence**: High on endpoint enumeration (from official OpenAPI spec tags). High on rate limits (official docs + multiple secondary sources). High on property types (official property-object reference).

## Reflection
- **What worked**: Official API reference pages gave authoritative endpoint and property type data. Rate limit search surfaced both official docs and practical analysis.
- **What failed**: Nothing significant.
- **Ruled out**: Nothing yet.

## Recommended Next Focus
Iteration 3: Map the complete mcp-obsidian capability set — note CRUD, search, tags, frontmatter, daily notes, and the 11 plugin file-layer operations (Beancount, Tables, BRAT, Health.md, Iconic, Charts, Dataview, Excalidraw, Git, Outliner, Minimal) — to establish the full parity baseline.
