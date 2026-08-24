---
title: "DS-005 -- Create a data source"
description: "This scenario validates a scratch data-source creation through the confirmed notion_create-a-data-source tool."
stage: routing
version: 0.1.0.0
---

# DS-005 -- Create a data source

## 1. OVERVIEW

This scenario validates the confirmed `notion_create-a-data-source` tool by creating a disposable scratch data source under a scratch parent page.

### Why This Matters

`create-a-data-source` is the only creation path in the domain -- there is no `create-a-database` tool in the official 24-tool catalog. This scenario confirms the tool defines a minimal schema correctly and produces a `data_source_id` other read-only scenarios (DS-002, DS-003, DS-006) can reuse. The scratch data source is left in place afterward: data sources have no archive/trash mechanism, so the scenario stays scratch-only and minimal rather than attempting cleanup.

---

## 2. SCENARIO CONTRACT

- Feature ID: `DS-005`
- Feature Name: Create a data source
- Scenario Objective: Create a new scratch data source with a minimal `Name` schema under a scratch parent page.
- Exact Prompt: `Set up a new scratch database in my Notion test page so I can validate data-source tooling -- call it "Scratch Data Source" with just a Name column.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-data-source") -> 3. Code Mode: call_tool_chain({ code: "const ds = await notion[\"notion_create-a-data-source\"]({ parent: { page_id: \"SCRATCH_PARENT_PAGE_ID\" }, title: [{ text: { content: \"Scratch Data Source\" } }], properties: { Name: { title: {} } } }); return ds;" })`
- Expected Signals: The live manual reports the callable name; the schema resolves; the response carries a new `data_source_id`, a `parent` referencing `SCRATCH_PARENT_PAGE_ID`, and a `properties` map with the `Name` title column.
- Evidence: `list_tools()` result, `tool_info()` result, Code Mode response, `SCRATCH_PARENT_PAGE_ID` used, and the returned `data_source_id` (recorded for reuse by DS-002/DS-003/DS-006).
- Pass/Fail Criteria: PASS if the tool name and schema resolve and the response returns a `data_source_id` with the requested `Name` schema; SKIP if no scratch parent page shared with the integration is available; FAIL if a confirmed call returns an error or a schema that does not match the requested `Name` column.
- Failure Triage: 1. Confirm `SCRATCH_PARENT_PAGE_ID` exists and is shared with the integration with insert-content capability. 2. Re-run `list_tools()` and `tool_info()` to confirm the exact `parent`/`title`/`properties` input shape before retrying. 3. Confirm `NOTION_TOKEN` and integration capabilities cover content creation.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `notion_NOTION_TOKEN` set, and a scratch parent page shared with the integration with insert-content capability granted.

### Prompt

`Set up a new scratch database in my Notion test page so I can validate data-source tooling -- call it "Scratch Data Source" with just a Name column.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-data-source")`
3. Run the Code Mode chain shown in the scenario contract against `SCRATCH_PARENT_PAGE_ID`.
4. Record the returned `data_source_id` for reuse by DS-002, DS-003, and DS-006.

### Expected

The callable name and schema resolve, and the response returns a new `data_source_id` with the requested minimal `Name` schema.

### Evidence

Capture discovery, schema, the Code Mode response, the scratch parent page ID used, and the returned `data_source_id`.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; a new scratch data source is created with the requested schema.
- **Skip:** no scratch parent page is available, or the manual/token is not registered.
- **Fail:** a confirmed call returns contradictory data, an error, or a schema that does not match the requested `Name` column.

### Failure Triage

1. Confirm `SCRATCH_PARENT_PAGE_ID` is shared with the integration and grants insert-content capability.
2. Re-run `list_tools()` and `tool_info()`; adjust only to the returned schema, or record `SKIP` if no scratch parent page is available.
3. Confirm `notion_NOTION_TOKEN` is set and valid.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DS-005 | Create a data source | Create a scratch data source with a minimal `Name` schema | `Set up a new scratch database in my Notion test page so I can validate data-source tooling -- call it "Scratch Data Source" with just a Name column.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-data-source")` -> 3. Code Mode `create-a-data-source` call against `SCRATCH_PARENT_PAGE_ID` | Known name and schema resolve; new `data_source_id` returned with `Name` schema | Discovery, schema, response, scratch parent page ID, returned data-source ID | PASS on created scratch data source matching requested schema; SKIP on missing scratch parent page; FAIL on contradictory or error response | Confirm parent page sharing, rediscover tool and schema, confirm token/capabilities |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario directory |
| [`../../feature-catalog/data-sources/create-a-data-source.md`](../../feature-catalog/data-sources/create-a-data-source.md) | Catalog entry for the tool this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode chain and preflight reference |

---

## 5. SOURCE METADATA

- Group: Databases and data sources
- Playbook ID: `DS-005`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `data-sources/create-a-data-source.md`
