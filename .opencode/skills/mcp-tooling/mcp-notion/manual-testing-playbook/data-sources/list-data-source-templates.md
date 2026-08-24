---
title: "DS-006 -- List data source templates"
description: "This scenario validates a scratch data-source template listing, including the common empty-result outcome, through the confirmed notion_list-data-source-templates tool."
stage: routing
version: 0.1.0.0
---

# DS-006 -- List data source templates

## 1. OVERVIEW

This scenario validates the confirmed `notion_list-data-source-templates` tool as a read-only listing against a scratch data source.

### Why This Matters

Most data sources -- including any newly created scratch one -- have no page templates configured, so this scenario also confirms the tool correctly reports an empty listing instead of the call being mistaken for a failure.

---

## 2. SCENARIO CONTRACT

- Feature ID: `DS-006`
- Feature Name: List data source templates
- Scenario Objective: List a scratch data source's page templates and confirm the result resolves, empty or not.
- Exact Prompt: `Does my scratch data source have any page templates set up?`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_list-data-source-templates") -> 3. Code Mode: call_tool_chain({ code: "const templates = await notion[\"notion_list-data-source-templates\"]({ data_source_id: \"SCRATCH_DATA_SOURCE_ID\" }); return templates;" })`
- Expected Signals: The live manual reports the callable name; the schema resolves; the response carries a `results`-style list (which may legitimately be `[]` for a scratch data source with no templates).
- Evidence: `list_tools()` result, `tool_info()` result, Code Mode response, `SCRATCH_DATA_SOURCE_ID` used, and the returned template list (or explicit empty-list note).
- Pass/Fail Criteria: PASS if the tool name and schema resolve and a well-formed listing returns, including an empty result; SKIP if no scratch data source ID is available; FAIL if the call errors or a non-empty template list is fabricated where none is configured.
- Failure Triage: 1. Confirm `SCRATCH_DATA_SOURCE_ID` is a data-source ID, not a database ID. 2. Confirm the data source is shared with the integration. 3. Re-run `list_tools()` and `tool_info()` to confirm the exact response schema before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `notion_NOTION_TOKEN` set, and a scratch data source ID on hand — either from running DS-005 (Create a data source) or an existing scratch data source shared with the integration.

### Prompt

`Does my scratch data source have any page templates set up?`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_list-data-source-templates")`
3. Run the Code Mode chain shown in the scenario contract against `SCRATCH_DATA_SOURCE_ID`.

### Expected

The callable name and schema resolve, and the response returns the template listing (`[]` is a valid outcome for a fresh scratch data source).

### Evidence

Capture discovery, schema, the Code Mode response, the scratch data-source ID used, and the exact template list content (including if empty).

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; a well-formed listing returns, empty or populated.
- **Skip:** no scratch data source ID is available, or the manual/token is not registered.
- **Fail:** a confirmed call returns an error, or a non-empty template list is fabricated where the scratch data source has none configured.

### Failure Triage

1. Confirm `SCRATCH_DATA_SOURCE_ID` is a data-source ID, not a database ID.
2. Confirm the data source is shared with the integration in the Notion UI.
3. Re-run `list_tools()` and `tool_info()`; adjust only to the returned schema, or record `SKIP` if no scratch data source is available.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DS-006 | List data source templates | List a scratch data source's page templates, empty-result included | `Does my scratch data source have any page templates set up?` | 1. `list_tools()` -> 2. `tool_info("notion.notion_list-data-source-templates")` -> 3. Code Mode `list-data-source-templates` call against `SCRATCH_DATA_SOURCE_ID` | Known name and schema resolve; template listing returned, empty list valid | Discovery, schema, response, scratch data-source ID, template list | PASS on resolved listing (empty or populated); SKIP on missing scratch data source; FAIL on error or fabricated templates | Confirm ID type, confirm sharing, rediscover tool and schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario directory |
| [`../../feature-catalog/data-sources/list-data-source-templates.md`](../../feature-catalog/data-sources/list-data-source-templates.md) | Catalog entry for the tool this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode chain and preflight reference |

---

## 5. SOURCE METADATA

- Group: Databases and data sources
- Playbook ID: `DS-006`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `data-sources/list-data-source-templates.md`
