---
title: "Page Property Items"
description: "Direct Notion REST recipe (GAP-003) for reading the full, non-truncated value of a paginated page property -- recovers what retrieve-a-page truncates past ~25 items."
trigger_phrases:
  - "notion page property item"
  - "GAP-003"
  - "notion property truncation"
version: 0.1.0.0
---

# Page Property Items (direct API -- GAP-003)

## 1. OVERVIEW

The MCP's `retrieve-a-page` returns page properties, but paginated property types -- `title`, `rich_text`, `relation`, and `people` -- truncate at 25 references. The dedicated property-item endpoint returns the complete, non-truncated value by paginating with `start_cursor` and `page_size`.

Invocation is a single direct HTTPS GET call (`fetch()` inside `call_tool_chain`, or `curl` via Bash), confirmed on its own reference page. Confirm the exact response shape (a single `property_item` or a paginated list with `next_url`) against `references/api-gap-tools.md` §5 before parsing programmatically.

---

## 2. HOW IT WORKS

Prerequisites: `notion_NOTION_TOKEN` set in the environment, the target page explicitly shared with the integration, and the `property_id` for the property in question (from the page's data-source schema, or from the property key returned by `retrieve-a-page`).

| Endpoint | Method | Purpose |
|---|---|---|
| `/v1/pages/{page_id}/properties/{property_id}` | GET | Retrieve one property item, with pagination for large values |

Every request carries `Authorization: Bearer $notion_NOTION_TOKEN` and `Notion-Version: 2025-09-03` (the current reference also renders examples at `2026-03-11`, and either resolves for this endpoint). Key inputs: `page_id`, `property_id`, `page_size` (recommend `100`), and `start_cursor` for continuation.

Behavior notes: only `title`, `rich_text`, `relation`, and `people` properties paginate; every other property type returns its full value in one call regardless of size. Walk `start_cursor` until `has_more` is `false` to recover the complete set past the ~25-item limit that `retrieve-a-page` silently truncates at. For any property that is not one of the four paginated types, `retrieve-a-page` (MCP) is already complete and this gap fill is unnecessary.

A `Notion-Version` mismatch surfaces as a 400 validation error; an unshared page returns 404/403. See `../../references/troubleshooting.md` §4 and §6.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes the 5 API-gap capabilities to direct REST calls instead of an MCP tool. |
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Shared | Confirms the endpoint, the paginated property types, the `2025-09-03` version pin, and a runnable curl example. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/api-gap-fills/page-property-items.md`](../../manual-testing-playbook/api-gap-fills/page-property-items.md) | Manual playbook | Compares a truncated `retrieve-a-page` read against the full direct-call result on a many-item relation. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Illustrates the shared Code Mode `call_tool_chain` pattern and the read-only preflight the comparison step reuses. |

---

## 4. SOURCE METADATA

- Group: API-gap fills
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `api-gap-fills/page-property-items.md`

Related references:
- [`file-uploads.md`](file-uploads.md) -- another direct-API gap fill with no MCP tool.
- [`async-task-polling.md`](async-task-polling.md) -- direct-API gap fill scoped to the local stdio backend.
