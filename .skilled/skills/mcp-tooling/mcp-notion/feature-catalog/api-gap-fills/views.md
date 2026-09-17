---
title: "Views"
description: "Direct Notion REST recipe (GAP-002) for creating, querying, and managing saved database views -- a capability the official Notion MCP does not expose."
trigger_phrases:
  - "notion views api"
  - "GAP-002"
  - "create a saved notion view"
version: 0.1.0.0
---

# Views (direct API -- GAP-002)

## 1. OVERVIEW

The official Notion MCP has no view tool. Views are Notion's saved table/board/list/calendar/timeline/gallery/form/chart/map/dashboard layouts over a database, each with its own filters and sorts. The REST API exposes a full CRUD-plus-query surface: 8 endpoints covering create, list, retrieve, update, delete, run-query, paginate-cached-results, and delete-cached-query.

Invocation is a direct HTTPS call (`fetch()` inside `call_tool_chain` when the sandbox permits outbound HTTPS, else `curl` via Bash). `POST /v1/views` is confirmed general-availability (not beta) on its dedicated reference page; the remaining paths are confirmed via the API index. The full `parent` and filter/sort/config request-body schema for create and update is marked `VERIFY` in `references/api-gap-tools.md` §4 -- confirm the live schema before hardcoding a non-trivial body.

---

## 2. HOW IT WORKS

Prerequisites: `notion_NOTION_TOKEN` set in the environment, the target database/data source explicitly shared with the integration, and outbound HTTPS permitted for the Code Mode `fetch()` path (else `curl` fallback via Bash). No MCP manual registration is required for these calls.

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/views` | POST | Create a view on a database |
| `/v1/databases/{database_id}/views` | GET | List all views in a database |
| `/v1/views/{view_id}` | GET | Retrieve one view |
| `/v1/views/{view_id}` | PATCH | Update a view's name, filter, sorts, or configuration |
| `/v1/views/{view_id}` | DELETE | Delete a view |
| `/v1/views/{view_id}/query` | POST | Execute the view's saved query and return results |
| `/v1/views/{view_id}/query_results` | GET | Paginate through cached query results |
| `/v1/views/{view_id}/query` | DELETE | Delete a cached view query |

Every request carries `Authorization: Bearer $notion_NOTION_TOKEN` and `Notion-Version: 2026-03-11`. Key inputs on create: `parent` (a `data_source_id`), `type`, and `name`; the full filter/sort/config object is `VERIFY`.

Behavior notes: the list path is nested under `databases`, not `/v1/views` -- a common source of a wrong-endpoint 404. A view materializes a persisted, re-runnable filtered/sorted layout; for an ad-hoc, unsaved filtered read, `query-data-source` (an MCP tool) is the lighter-weight choice and needs no view object at all.

A `Notion-Version` mismatch or an unconfirmed create/update body surfaces as a 400 validation error. See `../../references/troubleshooting.md` §6.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes the 5 API-gap capabilities to direct REST calls instead of an MCP tool. |
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Shared | Confirms all 8 view endpoints, the `2026-03-11` version pin, and the create/query example, with the create/update body flagged `VERIFY`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/api-gap-fills/views.md`](../../manual-testing-playbook/api-gap-fills/views.md) | Manual playbook | Exercises create -> list -> query -> delete against a scratch data source. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Illustrates the shared Code Mode `call_tool_chain` pattern and the data-source-vs-database distinction the `parent` field depends on. |

---

## 4. SOURCE METADATA

- Group: API-gap fills
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `api-gap-fills/views.md`

Related references:
- [`file-uploads.md`](file-uploads.md) -- another direct-API gap fill with no MCP tool.
- [`page-property-items.md`](page-property-items.md) -- direct-API gap fill for non-truncated property reads.
