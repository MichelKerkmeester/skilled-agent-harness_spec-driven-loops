---
title: "PAGE-002 -- Retrieve a page"
description: "This scenario validates notion_retrieve-a-page by reading properties and metadata from a known scratch page."
stage: routing
version: 0.1.0.0
---

# PAGE-002 -- Retrieve a page

## 1. OVERVIEW

This scenario validates the confirmed `notion_retrieve-a-page` tool as a read-only property/metadata read against a known scratch page.

### Why This Matters

Retrieving a page is the baseline read path for confirming state before and after any mutation — including the create/update/move/archive scenarios in this same category. The scenario proves the callable resolves and that truncation behavior on large relation/rollup/people properties is understood, not mistaken for a bug.

---

## 2. SCENARIO CONTRACT

- Feature ID: `PAGE-002`
- Feature Name: Retrieve a page
- Scenario Objective: Read a known scratch page's properties and metadata by ID.
- Exact Prompt: `Look up the properties and metadata of our known scratch Notion page and summarize what you find.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_retrieve-a-page") -> 3. Code Mode: call_tool_chain({ code: "return await notion[\"notion_retrieve-a-page\"]({ page_id: SCRATCH_PAGE_ID });" })`
- Expected Signals: The manual reports the callable name; the schema resolves; the call returns a structured page object with `id`, `properties`, and `url`; any relation/rollup/people property near or past ~25 items shows the documented truncation rather than an error.
- Evidence: `list_tools()` result, `tool_info()` result, Code Mode response, and the scratch page ID used.
- Pass/Fail Criteria: PASS if the callable and schema resolve and the page object is returned with its properties (an empty or minimal property set is a valid outcome); SKIP if the manual, token, or a known scratch page ID is unavailable; FAIL if a confirmed call returns a malformed object or contradicts the documented truncation behavior.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch page is shared with the integration. 2. Re-run `list_tools()` and `tool_info()`. 3. Compare the returned schema with the `page_id` input before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered, `NOTION_TOKEN` set, and a known scratch page ID already shared with the integration (for example, retained from the `PAGE-001` create-a-page scenario before its cleanup archive, or a dedicated persistent scratch page). A missing scratch page ID is a valid SKIP condition, not a reason to fabricate one.

### Prompt

`Look up the properties and metadata of our known scratch Notion page and summarize what you find.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_retrieve-a-page")`
3. Run the Code Mode read call shown in the scenario contract.
4. Inspect the returned `properties` for any truncated relation/rollup/people fields.

### Expected

The callable name is discoverable, the schema resolves, and the page object returns with `id`, `properties`, and `url`.

### Evidence

Capture discovery, schema, the returned page object, and the scratch page ID.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the page object is returned intact.
- **Skip:** manual registration, token, or a known scratch page ID is unavailable.
- **Fail:** a confirmed call returns a malformed object or an unexplained truncation.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch page is shared with the integration.
2. Re-run `list_tools()` and `tool_info()`.
3. Adjust only to the returned schema; if no safe schema is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAGE-002 | Retrieve a page | Read a known scratch page's properties and metadata | `Look up the properties and metadata of our known scratch Notion page and summarize what you find.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_retrieve-a-page")` -> 3. Code Mode read call | Known name and schema resolve; page object returned with properties | Discovery, schema, page object, scratch page ID | PASS on structured read; SKIP on prerequisites/schema; FAIL on contradictory confirmed behavior | Check token/sharing, rediscover tool, compare schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/pages/retrieve-a-page.md`](../../feature-catalog/pages/retrieve-a-page.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, and ~25-item truncation behavior |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern reference |

---

## 5. SOURCE METADATA

- Group: Pages
- Playbook ID: `PAGE-002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pages/retrieve-a-page.md`
