---
title: "DS-003 -- Query a data source"
description: "This scenario validates a scratch data-source row query, including an empty-result outcome, through the confirmed notion_query-data-source tool."
stage: routing
version: 0.1.0.0
---

# DS-003 -- Query a data source

## 1. OVERVIEW

This scenario validates the confirmed `notion_query-data-source` tool as a read-only row query against a scratch data source.

### Why This Matters

`query-data-source` is the high-priority read path for row-level data and the tool most directly affected by the API 2.0 migration (it targets a `data_source_id`, never a `database_id`). Because a fresh scratch data source has no rows, this scenario also confirms the empty-result path is handled correctly rather than treated as a failure.

---

## 2. SCENARIO CONTRACT

- Feature ID: `DS-003`
- Feature Name: Query a data source
- Scenario Objective: Query a scratch data source for rows and confirm a paginated result resolves, empty or not.
- Exact Prompt: `Query my scratch data source for any rows -- it's probably empty right now, that's fine.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_query-data-source") -> 3. Code Mode: call_tool_chain({ code: "const rows = await notion[\"notion_query-data-source\"]({ data_source_id: \"SCRATCH_DATA_SOURCE_ID\", page_size: 25 }); return rows;" })`
- Expected Signals: The live manual reports the callable name; the schema resolves; the response carries a `results` array (which may legitimately be `[]`), `has_more`, and `next_cursor`.
- Evidence: `list_tools()` result, `tool_info()` result, Code Mode response, `SCRATCH_DATA_SOURCE_ID` used, and the `results` array (or explicit empty-array note).
- Pass/Fail Criteria: PASS if the tool name and schema resolve and a well-formed paginated result returns, including an empty `results` array; SKIP if no scratch data source ID is available; FAIL if the call returns a `data_source_id` validation error (indicating a database ID was supplied instead) or if rows are fabricated where the source is empty.
- Failure Triage: 1. Confirm `SCRATCH_DATA_SOURCE_ID` is a data-source ID, not a database ID -- a `validation_error` naming `data_source_id` means the wrong ID type was used. 2. Confirm the data source is shared with the integration. 3. Re-run `list_tools()` and `tool_info()` to confirm the exact filter/sort/pagination schema before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `notion_NOTION_TOKEN` set, and a scratch data source ID on hand — either from running DS-005 (Create a data source) or an existing scratch data source shared with the integration.

### Prompt

`Query my scratch data source for any rows -- it's probably empty right now, that's fine.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_query-data-source")`
3. Run the Code Mode chain shown in the scenario contract against `SCRATCH_DATA_SOURCE_ID`.

### Expected

The callable name and schema resolve, and the response returns a paginated result with a `results` array (`[]` is a valid outcome for a fresh scratch data source).

### Evidence

Capture discovery, schema, the Code Mode response, the scratch data-source ID used, and the exact `results` array content (including if empty).

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; a well-formed paginated result returns, empty or populated.
- **Skip:** no scratch data source ID is available, or the manual/token is not registered.
- **Fail:** a `data_source_id` validation error is returned, or rows are fabricated instead of reporting a genuinely empty result.

### Failure Triage

1. Confirm `SCRATCH_DATA_SOURCE_ID` is a data-source ID, not a database ID.
2. Confirm the data source is shared with the integration in the Notion UI.
3. Re-run `list_tools()` and `tool_info()`; adjust only to the returned schema, or record `SKIP` if no scratch data source is available.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DS-003 | Query a data source | Query a scratch data source for rows, empty-result included | `Query my scratch data source for any rows -- it's probably empty right now, that's fine.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_query-data-source")` -> 3. Code Mode `query-data-source` call against `SCRATCH_DATA_SOURCE_ID` | Known name and schema resolve; paginated result returned, empty array valid | Discovery, schema, response, scratch data-source ID, results array | PASS on resolved paginated result (empty or populated); SKIP on missing scratch data source; FAIL on validation error or fabricated rows | Confirm ID type, confirm sharing, rediscover tool and schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario directory |
| [`../../feature-catalog/data-sources/query-data-source.md`](../../feature-catalog/data-sources/query-data-source.md) | Catalog entry for the tool this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode chain, including the documented read-only data-source query example |

---

## 5. SOURCE METADATA

- Group: Databases and data sources
- Playbook ID: `DS-003`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `data-sources/query-data-source.md`
