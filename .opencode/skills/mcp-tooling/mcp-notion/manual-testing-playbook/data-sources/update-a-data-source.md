---
title: "DS-004 -- Update a data source"
description: "This scenario validates a scratch data-source schema edit through the confirmed notion_update-a-data-source tool."
stage: routing
version: 0.1.0.0
---

# DS-004 -- Update a data source

## 1. OVERVIEW

This scenario validates the confirmed `notion_update-a-data-source` tool by creating its own scratch data source, then editing its title and adding a column.

### Why This Matters

Schema edits apply to every existing row immediately, so this is a mutating scenario. It stays scratch-safe by creating a disposable scratch data source as setup, anchoring on `update-a-data-source` as the primary tool under test, and leaving the scratch data source in place afterward -- data sources have no archive/trash mechanism, so cleanup is "keep it scratch and minimal", not delete.

---

## 2. SCENARIO CONTRACT

- Feature ID: `DS-004`
- Feature Name: Update a data source
- Scenario Objective: Create a scratch data source, then rename it and add a `Status` property, and confirm the schema edit is reflected.
- Exact Prompt: `Add a Status column to that scratch data source and rename it to "Scratch Data Source (updated)".`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-data-source") -> 3. Code Mode: tool_info("notion.notion_update-a-data-source") -> 4. Code Mode: call_tool_chain({ code: "const scratch = await notion[\"notion_create-a-data-source\"]({ parent: { page_id: \"SCRATCH_PARENT_PAGE_ID\" }, title: [{ text: { content: \"Scratch Data Source (DS-004 setup)\" } }], properties: { Name: { title: {} } } }); const updated = await notion[\"notion_update-a-data-source\"]({ data_source_id: scratch.id, title: [{ text: { content: \"Scratch Data Source (updated)\" } }], properties: { Status: { select: { options: [{ name: \"Open\" }] } } } }); return updated;" })`
- Expected Signals: The live manual reports both callable names; both schemas resolve; the setup create returns a `data_source_id`; the update response carries the new `title` and a `Status` select property with the `Open` option.
- Evidence: `list_tools()` result, both `tool_info()` results, Code Mode response for both calls, the scratch data source ID created, and the updated `properties` map.
- Pass/Fail Criteria: PASS if the tool names and schemas resolve and the updated schema reflects the new title and `Status` property; SKIP if no scratch parent page shared with the integration is available; FAIL if a confirmed call returns an error, or the schema after update does not reflect the requested title/property change.
- Failure Triage: 1. Confirm `SCRATCH_PARENT_PAGE_ID` exists and is shared with the integration with insert-content capability. 2. Confirm the update call used the setup call's returned `data_source_id`, not a database ID. 3. Re-run `list_tools()` and both `tool_info()` calls to confirm the exact property-schema shape before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `notion_NOTION_TOKEN` set, and a scratch parent page shared with the integration with insert-content capability granted, so the setup call can create a disposable scratch data source.

### Prompt

`Add a Status column to that scratch data source and rename it to "Scratch Data Source (updated)".`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-data-source")`
3. `tool_info("notion.notion_update-a-data-source")`
4. Run the Code Mode chain shown in the scenario contract: create the scratch data source under `SCRATCH_PARENT_PAGE_ID`, then update its title and add the `Status` property.
5. Re-read the data source with `retrieve-a-data-source` (DS-002) to confirm the persisted schema.

### Expected

Both callable names and schemas resolve, the setup call returns a new `data_source_id`, and the update response (and the follow-up read) shows the renamed title and the new `Status` property.

### Evidence

Capture discovery, both schemas, both Code Mode responses, the scratch data source ID created, and the confirmed updated properties map.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the scratch data source is created and its schema/title update persists.
- **Skip:** no scratch parent page is available, or the manual/token is not registered.
- **Fail:** a confirmed call returns contradictory data, an error, or the schema after update does not reflect the requested change.

### Failure Triage

1. Confirm `SCRATCH_PARENT_PAGE_ID` is shared with the integration and grants insert-content capability.
2. Confirm the `data_source_id` used in the update call is the one returned by the setup create call.
3. Re-run `list_tools()` and both `tool_info()` calls; adjust only to the returned schema, or record `SKIP` if no scratch parent page is available.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DS-004 | Update a data source | Create a scratch data source, then rename it and add a `Status` property | `Add a Status column to that scratch data source and rename it to "Scratch Data Source (updated)".` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-data-source")` -> 3. `tool_info("notion.notion_update-a-data-source")` -> 4. Code Mode create+update chain -> 5. read back with `retrieve-a-data-source` | Known names and schemas resolve; scratch data source created; title and `Status` property updated | Discovery, both schemas, both responses, scratch data-source ID, updated properties map | PASS on persisted title/property update; SKIP on missing scratch parent page; FAIL on contradictory or error response | Confirm parent page sharing, confirm correct data-source ID reuse, rediscover tools and schemas |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario directory |
| [`../../feature-catalog/data-sources/update-a-data-source.md`](../../feature-catalog/data-sources/update-a-data-source.md) | Catalog entry for the tool this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode chain and preflight reference |

---

## 5. SOURCE METADATA

- Group: Databases and data sources
- Playbook ID: `DS-004`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `data-sources/update-a-data-source.md`
