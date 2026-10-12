---
title: "DS-001 -- Retrieve a database"
description: "This scenario validates a scratch-database container read through the confirmed notion_retrieve-a-database tool."
stage: routing
version: 0.1.0.0
---

# DS-001 -- Retrieve a database

## 1. OVERVIEW

This scenario validates the confirmed `notion_retrieve-a-database` tool against a pre-existing scratch database container shared with the integration.

### Why This Matters

`retrieve-a-database` is the entry point of the API 2.0 hierarchy: it is the only way to turn a bare `database_id` into the `data_source_id` list every other data-source tool requires. There is no MCP tool that creates a database container — only its data sources — so this scenario is read-only against a container the operator provisioned by hand in the Notion UI.

---

## 2. SCENARIO CONTRACT

- Feature ID: `DS-001`
- Feature Name: Retrieve a database
- Scenario Objective: Read a scratch database container's metadata and confirm its data-source ID list resolves.
- Exact Prompt: `What data sources live inside my scratch database container?`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_retrieve-a-database") -> 3. Code Mode: call_tool_chain({ code: "const db = await notion[\"notion_retrieve-a-database\"] ({ database_id: \"SCRATCH_DATABASE_ID\" }); return db;" })`
- Expected Signals: The live manual reports the callable name; the schema resolves; the response carries the database's `title` and a non-empty `data_source_id` list for its child data source(s).
- Evidence: `list_tools()` result, `tool_info()` result, Code Mode response, `SCRATCH_DATABASE_ID` used, and the returned `data_source_id` list.
- Pass/Fail Criteria: PASS if the tool name and schema resolve and the response returns container metadata with a data-source ID list; SKIP if no scratch database container ID is available (no `create-a-database` tool exists, so this requires an operator-provisioned container shared with the integration); FAIL if a confirmed call returns an error or omits the data-source ID list for a container known to hold data sources.
- Failure Triage: 1. Confirm `SCRATCH_DATABASE_ID` refers to a database container ID, not a data-source ID (a `validation_error` on this input usually means the wrong ID type was supplied). 2. Confirm the database is shared with the integration in the Notion UI. 3. Re-run `list_tools()` and `tool_info()` to confirm the exact input schema before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `notion_NOTION_TOKEN` set, and a scratch database container already created in the Notion UI and shared with the integration. This container must exist before the scenario runs — the MCP has no tool to create one.

### Prompt

`What data sources live inside my scratch database container?`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_retrieve-a-database")`
3. Run the Code Mode chain shown in the scenario contract against `SCRATCH_DATABASE_ID`.

### Expected

The callable name and schema resolve, and the response returns the database's metadata plus a data-source ID list.

### Evidence

Capture discovery, schema, the Code Mode response, the scratch database ID used, and the returned data-source ID list.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; container metadata and a data-source ID list are returned.
- **Skip:** no scratch database container ID is available, or the manual/token is not registered.
- **Fail:** a confirmed call returns contradictory data, an error, or omits the expected data-source ID list.

### Failure Triage

1. Confirm `SCRATCH_DATABASE_ID` is a database container ID, not a data-source ID.
2. Confirm the container is shared with the integration in the Notion UI.
3. Re-run `list_tools()` and `tool_info()`; adjust only to the returned schema, or record `SKIP` if no safe scratch container is available.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DS-001 | Retrieve a database | Read a scratch database container's metadata and data-source ID list | `What data sources live inside my scratch database container?` | 1. `list_tools()` -> 2. `tool_info("notion.notion_retrieve-a-database")` -> 3. Code Mode `retrieve-a-database` call against `SCRATCH_DATABASE_ID` | Known name and schema resolve; container metadata and data-source ID list returned | Discovery, schema, response, scratch database ID, data-source ID list | PASS on resolved container read; SKIP on missing scratch container; FAIL on contradictory or error response | Confirm ID type, confirm sharing, rediscover tool and schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario directory |
| [`../../feature-catalog/data-sources/retrieve-a-database.md`](../../feature-catalog/data-sources/retrieve-a-database.md) | Catalog entry for the tool this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode chain and preflight reference |

---

## 5. SOURCE METADATA

- Group: Databases and data sources
- Playbook ID: `DS-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `data-sources/retrieve-a-database.md`
