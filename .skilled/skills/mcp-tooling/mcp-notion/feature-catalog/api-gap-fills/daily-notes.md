---
title: "Daily Notes"
description: "Knowledge-layer convention (GAP-005) for opening or creating today's dated page in a Daily Notes data source -- Notion has no daily-notes endpoint, so the mode implements it with existing MCP tools."
trigger_phrases:
  - "notion daily notes"
  - "GAP-005"
  - "open today's notion note"
version: 0.1.0.0
---

# Daily Notes (convention -- GAP-005)

## 1. OVERVIEW

Notion has no daily-note concept and no endpoint for one. This is the one gap fill that is a **knowledge-layer convention**, not a direct-API call -- it is implemented entirely with two MCP tools that already exist: `query-data-source` and `create-a-page`.

The pattern: maintain a dedicated "Daily Notes" data source whose title (or a `date` property) is the ISO date. To open today's note, query that data source filtered on today's date; if a page exists, use it, otherwise create one titled with the date. No `Notion-Version` pin beyond the standard `2025-09-03` used by the two MCP tools involved.

---

## 2. HOW IT WORKS

Prerequisites: `notion_NOTION_TOKEN` set, the `notion` manual registered, and a "Daily Notes" data source that already exists and is shared with the integration (or is created once as scratch scaffolding via `create-a-data-source`).

The convention, in two existing MCP calls:

1. `query-data-source` -- filter the "Daily Notes" data source on today's date (title equals the ISO date, or a `date` property equals today).
2. If the result is empty, `create-a-page` -- title = today's ISO date, parent = the "Daily Notes" data source.

Behavior notes: the query-then-create sequence is idempotent -- re-running it for the same date must resolve to the same single page, never a duplicate. The date format and the target data source id are fixed once for a given workspace; every "today's note" request then resolves through this same query-then-create path. No direct REST call is involved at any step.

Fallback: if the "Daily Notes" data source itself does not exist and cannot be created (for example, no writable scratch parent is available), the convention cannot be exercised and the operation is a documented `SKIP`, not a silently fabricated note.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes the 5 API-gap capabilities, including this convention-based one, out of the raw MCP tool surface. |
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Shared | Confirms this is the one gap with no endpoint at all, and states the query-then-create pattern in full. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/api-gap-fills/daily-notes.md`](../../manual-testing-playbook/api-gap-fills/daily-notes.md) | Manual playbook | Exercises query -> create-if-absent -> re-query for idempotency against a scratch Daily Notes data source. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Illustrates the shared Code Mode `call_tool_chain` pattern for both the query and page-create calls this convention composes. |

---

## 4. SOURCE METADATA

- Group: API-gap fills
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `api-gap-fills/daily-notes.md`

Related references:
- [`async-task-polling.md`](async-task-polling.md) -- another gap fill scoped to the local backend.
- [`page-property-items.md`](page-property-items.md) -- direct-API gap fill for non-truncated property reads.
