---
title: "DS-002 -- Retrieve a data source"
description: "This scenario validates a scratch data-source schema read through the confirmed notion_retrieve-a-data-source tool."
stage: routing
version: 0.1.0.0
---

# DS-002 -- Retrieve a data source

## 1. OVERVIEW

This scenario validates the confirmed `notion_retrieve-a-data-source` tool as a read-only schema check against a scratch data source.

### Why This Matters

Every write against a data source's rows depends on knowing its schema first — property names, types, and select options. This scenario confirms the schema read resolves and matches what `create-a-data-source` (DS-005) defined, without mutating anything.

---

## 2. SCENARIO CONTRACT

- Feature ID: `DS-002`
- Feature Name: Retrieve a data source
- Scenario Objective: Read a scratch data source's property schema and confirm it resolves.
- Exact Prompt: `Show me the schema of my scratch data source -- what columns does it have?`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_retrieve-a-data-source") -> 3. Code Mode: call_tool_chain({ code: "const ds = await notion[\"notion_retrieve-a-data-source\"] ({ data_source_id: \"SCRATCH_DATA_SOURCE_ID\" }); return ds;" })`
- Expected Signals: The live manual reports the callable name; the schema resolves; the response carries the data source's `title`, `parent`, and a `properties` map including the `Name` title column.
- Evidence: `list_tools()` result, `tool_info()` result, Code Mode response, `SCRATCH_DATA_SOURCE_ID` used, and the returned `properties` map.
- Pass/Fail Criteria: PASS if the tool name and schema resolve and the returned `properties` map matches the scratch data source's known columns; SKIP if no scratch data source ID is available (run DS-005 first, or supply one); FAIL if a confirmed call returns an error or a schema contradicting the known scratch setup.
- Failure Triage: 1. Confirm `SCRATCH_DATA_SOURCE_ID` is a data-source ID, not a database ID. 2. Confirm the data source (or its parent database) is shared with the integration. 3. Re-run `list_tools()` and `tool_info()` to confirm the exact response schema before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `notion_NOTION_TOKEN` set, and a scratch data source ID on hand — either from running DS-005 (Create a data source) or an existing scratch data source shared with the integration.

### Prompt

`Show me the schema of my scratch data source -- what columns does it have?`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_retrieve-a-data-source")`
3. Run the Code Mode chain shown in the scenario contract against `SCRATCH_DATA_SOURCE_ID`.

### Expected

The callable name and schema resolve, and the response returns the data source's properties map matching the known scratch schema.

### Evidence

Capture discovery, schema, the Code Mode response, the scratch data-source ID used, and the returned properties map.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the returned schema matches the known scratch data source.
- **Skip:** no scratch data source ID is available, or the manual/token is not registered.
- **Fail:** a confirmed call returns contradictory data, an error, or a schema that does not match the known scratch setup.

### Failure Triage

1. Confirm `SCRATCH_DATA_SOURCE_ID` is a data-source ID, not a database ID.
2. Confirm the data source is shared with the integration in the Notion UI.
3. Re-run `list_tools()` and `tool_info()`; adjust only to the returned schema, or record `SKIP` if no scratch data source is available.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DS-002 | Retrieve a data source | Read a scratch data source's property schema | `Show me the schema of my scratch data source -- what columns does it have?` | 1. `list_tools()` -> 2. `tool_info("notion.notion_retrieve-a-data-source")` -> 3. Code Mode `retrieve-a-data-source` call against `SCRATCH_DATA_SOURCE_ID` | Known name and schema resolve; properties map returned matching scratch setup | Discovery, schema, response, scratch data-source ID, properties map | PASS on resolved schema read matching setup; SKIP on missing scratch data source; FAIL on contradictory or error response | Confirm ID type, confirm sharing, rediscover tool and schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario directory |
| [`../../feature-catalog/data-sources/retrieve-a-data-source.md`](../../feature-catalog/data-sources/retrieve-a-data-source.md) | Catalog entry for the tool this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode chain and preflight reference |

---

## 5. SOURCE METADATA

- Group: Databases and data sources
- Playbook ID: `DS-002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `data-sources/retrieve-a-data-source.md`
