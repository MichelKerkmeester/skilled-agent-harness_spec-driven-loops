---
title: "mcp-notion API Gap Tools Reference"
description: "Direct Notion REST API recipes for the 5 capabilities the official Notion MCP (24 tools) does not expose: file uploads, views, page property items, async task polling, and the daily-notes convention."
trigger_phrases:
  - "notion file upload"
  - "notion views api"
  - "notion page property item"
  - "notion async task poll"
  - "notion api gap"
  - "notion daily notes"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# mcp-notion API Gap Tools Reference

Direct Notion REST API calls that fill the 5 capability gaps the official Notion MCP server does not cover. The MCP server (`@notionhq/notion-mcp-server`, 24 tools) covers all page, block, data-source, comment, user, and search CRUD. It exposes no tools for file uploads, views, page property items, or async task polling, and Notion has no daily-notes concept at all. These five are tooling gaps: the REST API has the endpoints (except daily notes), the MCP just does not surface them, so the mode calls the API directly.

---

## 1. OVERVIEW

Each section below gives the exact endpoint(s) and method, a runnable example, and when to reach for it. Two invocation styles appear throughout:

- **curl** — a direct shell call, the canonical form. The bearer token is always read from the environment variable `$notion_NOTION_TOKEN`; it is never hardcoded.
- **Code Mode** — the same HTTP call issued from inside `call_tool_chain({ code: "..." })` via `fetch()`, reading the token from `process.env.notion_NOTION_TOKEN`. Use this when the mode is already running through Code Mode and outbound HTTPS is permitted in the sandbox; otherwise fall back to a `curl` shell call through Bash.

All requests target base URL `https://api.notion.com/v1` and carry two headers: `Authorization: Bearer $notion_NOTION_TOKEN` and a `Notion-Version` header. Version is per-endpoint, not global — see each section and §8.

Endpoint paths below were confirmed against the live Notion API reference on 2026-08-21 (`developers.notion.com/reference/*` and the API index at `developers.notion.com/llms.txt`); confirmation notes are inline. Request-body schemas that could not be fully confirmed from a dedicated reference page are marked `VERIFY`.

---

## 2. PREREQUISITES

- `notion_NOTION_TOKEN` set in the environment available to the mode (an internal-connection token or PAT, prefix `ntn_` or legacy `secret_`).
- The target page or data source is explicitly shared with the integration/connection — direct API calls inherit the same sharing model as the MCP server. An unshared object returns 404 or 403.
- Rate budget: an integration averages ~3 requests/second. Batch loops (multi-part uploads, paginated property reads) must space requests and honor `Retry-After`. See §8 and `troubleshooting.md §5`.

---

## 3. GAP 1 — FILE UPLOADS

The MCP has no file-upload tool. The REST API exposes five endpoints. Uploading is a create-then-send flow; the returned `file_upload` id is then attached to a block, page cover/icon, or a `files` property.

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/file_uploads` | POST | Create a file upload (mode `single_part`, `multi_part`, or `external_url`) |
| `/v1/file_uploads/{file_upload_id}/send` | POST | Send file bytes (`multipart/form-data`; `file`, plus `part_number` for multi-part) |
| `/v1/file_uploads/{file_upload_id}/complete` | POST | Finalize a `multi_part` upload after all parts are sent |
| `/v1/file_uploads/{file_upload_id}` | GET | Retrieve one upload's status |
| `/v1/file_uploads` | GET | List uploads |

Confirmed: create, send, and complete on their dedicated reference pages; retrieve and list via the API index. `Notion-Version: 2026-03-11` is required for file uploads. Files over 20 MiB require `multi_part` mode (send each part with `part_number` 1-1000, then call `complete`); size caps are ~5 MiB free / ~5 GiB paid.

Single-part upload (create then send):

```bash
# Step 1 — create the upload, capture the returned id
curl -sS -X POST https://api.notion.com/v1/file_uploads \
  -H "Authorization: Bearer $notion_NOTION_TOKEN" \
  -H "Notion-Version: 2026-03-11" \
  -H "Content-Type: application/json" \
  -d '{"mode":"single_part","filename":"diagram.png","content_type":"image/png"}'
# → { "id": "<file_upload_id>", "status": "pending", ... }

# Step 2 — send the bytes (multipart/form-data)
curl -sS -X POST "https://api.notion.com/v1/file_uploads/<file_upload_id>/send" \
  -H "Authorization: Bearer $notion_NOTION_TOKEN" \
  -H "Notion-Version: 2026-03-11" \
  -F "file=@./diagram.png;type=image/png"
# → status becomes "uploaded"
```

Attach the finished upload by referencing its id in a file object (`{"type":"file_upload","file_upload":{"id":"<file_upload_id>"}}`) inside a block-append, page create/update, or a `files` page-property value — those writes go through the normal MCP tools.

Code Mode form of Step 1:

```typescript
const result = await call_tool_chain({
  code: `
    const token = process.env.notion_NOTION_TOKEN;
    const res = await fetch("https://api.notion.com/v1/file_uploads", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Notion-Version": "2026-03-11",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mode: "single_part", filename: "diagram.png", content_type: "image/png" }),
    });
    return await res.json();
  `,
});
```

**When to use:** attaching any image, PDF, or file to a Notion page, block, cover/icon, or `files` property. This is the only path — the MCP cannot do it.

---

## 4. GAP 2 — VIEWS

The MCP has no view tool. Views are Notion's saved table/board/calendar/etc. layouts over a database, with their own filters and sorts. The REST API exposes a full CRUD-plus-query surface.

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/views` | POST | Create a view on a database (types: table, board, list, calendar, timeline, gallery, form, chart, map, dashboard) |
| `/v1/databases/{database_id}/views` | GET | List all views in a database |
| `/v1/views/{view_id}` | GET | Retrieve one view |
| `/v1/views/{view_id}` | PATCH | Update a view's name, filter, sorts, or configuration |
| `/v1/views/{view_id}` | DELETE | Delete a view |
| `/v1/views/{view_id}/query` | POST | Execute the view's query (its saved filters/sorts) and return results |
| `/v1/views/{view_id}/query_results` | GET | Paginate through cached query results |
| `/v1/views/{view_id}/query` | DELETE | Delete a cached view query |

Confirmed: `POST /v1/views` is generally available (not beta) on its reference page; the remaining paths via the API index. Use `Notion-Version: 2026-03-11`. Note the list path is nested under `databases`, not `/v1/views`.

Create a table view, then query it:

```bash
# Create — VERIFY the exact parent + config body against the live create-view schema
curl -sS -X POST https://api.notion.com/v1/views \
  -H "Authorization: Bearer $notion_NOTION_TOKEN" \
  -H "Notion-Version: 2026-03-11" \
  -H "Content-Type: application/json" \
  -d '{"parent":{"type":"data_source_id","data_source_id":"<data_source_id>"},"type":"table","name":"Open items"}'
# → { "id": "<view_id>", ... }

# Query the view (runs its saved filters/sorts)
curl -sS -X POST "https://api.notion.com/v1/views/<view_id>/query" \
  -H "Authorization: Bearer $notion_NOTION_TOKEN" \
  -H "Notion-Version: 2026-03-11" \
  -H "Content-Type: application/json" \
  -d '{}'
```

The `parent` shape and the full filter/sort/config object for create and update are `VERIFY` — the dedicated create-view page confirmed the path and GA status but did not expose the complete request body. Confirm the schema before hardcoding a non-trivial body.

**When to use:** creating, editing, or running a saved database view — e.g. materializing a filtered/sorted layout that mirrors an Obsidian saved search or Dataview query. Falls back to `query-data-source` (an MCP tool) only for ad-hoc, unsaved filtered reads.

---

## 5. GAP 3 — PAGE PROPERTY ITEMS

The MCP's `retrieve-a-page` returns properties, but paginated property types truncate at 25 references. The dedicated property-item endpoint returns the complete, non-truncated value.

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/pages/{page_id}/properties/{property_id}` | GET | Retrieve one property item, with pagination for large values |

Confirmed on its reference page. Paginated property types are `title`, `rich_text`, `relation`, and `people`; the response carries a `next_url` (and accepts `start_cursor` / `page_size`) so you can walk past the 25-reference limit that `retrieve-a-page` silently truncates at. Works on `Notion-Version: 2025-09-03`; the current reference renders examples at `2026-03-11` and either resolves for this endpoint.

```bash
curl -sS -X GET "https://api.notion.com/v1/pages/<page_id>/properties/<property_id>?page_size=100" \
  -H "Authorization: Bearer $notion_NOTION_TOKEN" \
  -H "Notion-Version: 2025-09-03"
# → property_item (or a paginated list with next_url); follow start_cursor until has_more is false
```

**When to use:** reading a `relation` with many linked pages, a long `rich_text`/`title`, or a wide `people` field where `retrieve-a-page` would cut off at 25 items. For everything else, `retrieve-a-page` (MCP) is enough.

---

## 6. GAP 4 — ASYNC TASKS

Some operations (notably page/database duplication) complete asynchronously and return a task id. The local MCP has no way to poll it. The remote Notion MCP backend (`https://mcp.notion.com/mcp`) exposes async tasks natively — so this gap only exists on the headless local stdio backend, where you poll the endpoint directly.

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/async_tasks/{task_id}` | GET | Retrieve the status and result of an async task |

Confirmed via the API index; the dedicated reference page returned 404 on 2026-08-21, so the exact `Notion-Version` and the full status/result field set are `VERIFY` (use `2026-03-11`; the research index attributes it to the current API surface).

```bash
curl -sS -X GET "https://api.notion.com/v1/async_tasks/<task_id>" \
  -H "Authorization: Bearer $notion_NOTION_TOKEN" \
  -H "Notion-Version: 2026-03-11"
# → poll until the task status reports completion; space polls to stay under ~3 req/s
```

**When to use:** monitoring a long-running operation on the local backend after an async trigger. On the remote MCP backend, use its native async-task tool instead of this call.

---

## 7. GAP 5 — DAILY NOTES

Notion has no daily-note concept and no endpoint for one. This is a knowledge-layer convention, not an API gap — the mode implements it with tools that already exist.

The pattern: keep a dedicated "Daily Notes" data source whose title (or a `date` property) is the ISO date. To open today's note, query that data source filtered on today's date; if a page exists, use it, otherwise create one with `create-a-page` (an MCP tool) titled with the date.

```bash
# There is NO daily-notes endpoint. The convention, in two existing MCP calls:
#   1. query-data-source  → filter on today's date (title or a `date` property)
#   2. if empty, create-a-page → title = today's ISO date, parent = the Daily Notes data source
```

**When to use:** any journaling / daily-log workflow. Encode the date format and the target data source once; every "today's note" request then resolves through the query-then-create convention above. No direct API call is involved.

---

## 8. RATE LIMIT AND VERSION DOCTRINE

**Rate limit.** An integration averages ~3 requests/second (short bursts allowed), with a per-workspace ceiling scaled by plan and a secondary ~1000-requests / 5-minutes limit. Over the limit returns HTTP 429 (`rate_limited`) with a `Retry-After` header in seconds; HTTP 529 (`service_overload`) is retried the same way. Centralize retries: honor `Retry-After` with exponential backoff plus jitter, and space batch loops to ~333 ms between calls. Full recovery recipe: `troubleshooting.md §5`.

**Version pinning.** Send a `Notion-Version` header on every request. This surface splits by endpoint:

| Gap | Notion-Version |
|---|---|
| File uploads (§3) | `2026-03-11` (required) |
| Views (§4) | `2026-03-11` |
| Page property items (§5) | `2025-09-03` (or `2026-03-11`) |
| Async tasks (§6) | `2026-03-11` (VERIFY) |

Core CRUD through the MCP pins `2025-09-03`; the newer file-upload, view, and async surfaces need `2026-03-11`. A mismatch surfaces as a 400 validation error — see `troubleshooting.md §6`.

---

## 9. RELATED RESOURCES

- `mcp-tools.md` — the 24-tool official MCP catalog and Code Mode invocation shape (the CRUD surface these gap calls sit alongside).
- `troubleshooting.md` — recovery recipes for 401/403, 429 backoff, version mismatch, data-source-vs-database confusion, and the local-to-remote migration path.
- Notion API reference: https://developers.notion.com/reference/intro — authoritative endpoint and schema source; reconfirm any `VERIFY` body shape here before relying on it.
