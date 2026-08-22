---
title: "GAP-002 -- Views"
description: "This scenario validates creating, listing, querying, and deleting a saved database view via the direct Notion REST views API."
stage: routing
version: 0.1.0.0
---

# GAP-002 -- Views

## 1. OVERVIEW

This scenario validates the direct Notion REST views surface that the official MCP does not expose: create a saved table view on a scratch data source, confirm it is listed, run its query, then delete it as its own cleanup.

### Why This Matters

Views are a hard gap -- no MCP tool exists for any of the 8 endpoints, and the create/update request body is only partially confirmed (`VERIFY`). Without this scenario, neither the create-list-query sequence nor the `data_source_id`-as-parent shape is demonstrated.

---

## 2. SCENARIO CONTRACT

- Feature ID: `GAP-002`
- Feature Name: Views
- Scenario Objective: Create a table view on a scratch data source, confirm it appears in the list, run its query, then delete it.
- Exact Prompt: `"Create a saved table view on the scratch data source, then run its query and confirm it returns rows."`
- Exact Command Sequence: `1. POST https://api.notion.com/v1/views (Bearer $notion_NOTION_TOKEN, Notion-Version: 2026-03-11, body { parent: { type: "data_source_id", data_source_id: "<scratch_data_source_id>" }, type: "table", name: "Playbook test view" }) -> 2. GET https://api.notion.com/v1/databases/<database_id>/views -> 3. POST https://api.notion.com/v1/views/<view_id>/query (body {}) -> 4. DELETE https://api.notion.com/v1/views/<view_id>`
- Expected Signals: Step 1 returns a `view_id`; Step 2's list includes that id; Step 3 returns a paginated result list (empty is valid); Step 4 confirms deletion with no error.
- Evidence: create response body, the list response showing the new view, the query response (row count or empty confirmation), the delete confirmation.
- Pass/Fail Criteria: PASS if create/list/query resolve and query returns a paginated list object; SKIP if the create-view request body 400s against the unconfirmed (`VERIFY`) schema and no working body variant can be found without further live confirmation; FAIL if create succeeds but the view is absent from the list, or query returns something other than a paginated list.
- Failure Triage: 1. Confirm `parent` uses `data_source_id`, not `database_id`. 2. Confirm `Notion-Version: 2026-03-11` is set. 3. Re-check the create-view body against the live schema before retrying. 4. Confirm the scratch database/data source is shared with the integration.

---

## 3. TEST EXECUTION

### Prerequisites

`notion_NOTION_TOKEN` is set, a scratch database with at least one data source is shared with the integration, and outbound HTTPS is permitted (or a `curl` fallback via Bash is available).

### Prompt

`"Create a saved table view on the scratch data source, then run its query and confirm it returns rows."`

### Commands

1. `POST https://api.notion.com/v1/views` (Bearer `$notion_NOTION_TOKEN`, `Notion-Version: 2026-03-11`, body `{"parent":{"type":"data_source_id","data_source_id":"<scratch_data_source_id>"},"type":"table","name":"Playbook test view"}`) -- capture `id`.
2. `GET https://api.notion.com/v1/databases/<database_id>/views` -- confirm the new view id is present.
3. `POST https://api.notion.com/v1/views/<view_id>/query` (body `{}`) -- run the saved query.
4. `DELETE https://api.notion.com/v1/views/<view_id>` -- delete the scratch view.

### Expected

Create returns a view id; the list includes it; the query returns a paginated result object (empty is a valid outcome); the delete call confirms removal with no error.

### Evidence

Capture the create response, the list response, the query response, and the delete confirmation.

### Pass / Fail

- **Pass:** create/list/query resolve as expected and delete confirms cleanup.
- **Skip:** the create-view body 400s against the unconfirmed schema and no working variant is found without further live schema confirmation.
- **Fail:** the created view never appears in the list, or the query call returns something other than a paginated list.

### Failure Triage

1. Confirm `parent` uses `data_source_id`, not `database_id`.
2. Confirm `Notion-Version: 2026-03-11` is set on every call.
3. Re-check the create-view body against the live schema before retrying.
4. Confirm the scratch database/data source is shared with the integration.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GAP-002 | Views | Verify create -> list -> query -> delete against a scratch data source | `"Create a saved table view on the scratch data source, then run its query and confirm it returns rows."` | 1. `POST /v1/views` -> 2. `GET /v1/databases/<id>/views` -> 3. `POST /v1/views/<id>/query` -> 4. `DELETE /v1/views/<id>` | View created, listed, queried, deleted | Create/list/query/delete response bodies | PASS if all four resolve as expected; SKIP if create body is unconfirmed and 400s; FAIL if view absent from list or query malformed | Check parent id type, check version header, re-check schema, confirm sharing |

Cleanup: the created view is deleted in step 4 as its own cleanup; deleting a view does not affect the underlying data source rows.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/api-gap-fills/views.md`](../../feature-catalog/api-gap-fills/views.md) | Catalog entry for this gap fill |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/api-gap-tools.md`](../../references/api-gap-tools.md) | Endpoint table, version pin, and the VERIFY-flagged create/update body |
| [`../../examples/README.md`](../../examples/README.md) | Shared Code Mode `call_tool_chain` pattern and the data-source-vs-database distinction |

---

## 5. SOURCE METADATA

- Group: API-gap fills
- Playbook ID: `GAP-002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `api-gap-fills/views.md`
