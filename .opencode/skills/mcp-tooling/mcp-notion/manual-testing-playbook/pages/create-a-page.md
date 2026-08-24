---
title: "PAGE-001 -- Create a page"
description: "This scenario validates notion_create-a-page by creating a disposable scratch page under a shared parent and archiving it as cleanup."
stage: routing
version: 0.1.0.0
---

# PAGE-001 -- Create a page

## 1. OVERVIEW

This scenario validates the confirmed `notion_create-a-page` tool by creating a disposable scratch page under a parent shared with the integration, then archiving it as its own cleanup.

### Why This Matters

Page creation is the entry point for every write workflow Notion supports — spec notes, database rows, and nested content all start with `notion_create-a-page`. The scenario proves the callable resolves, the parent shape (`page_id` or `data_source_id`) is accepted, and the created page is reversibly cleaned up rather than left orphaned in the workspace.

---

## 2. SCENARIO CONTRACT

- Feature ID: `PAGE-001`
- Feature Name: Create a page
- Scenario Objective: Create a scratch page under a shared parent page, confirm it was created, then archive it.
- Exact Prompt: `Create a scratch Notion page titled "Playbook scratch - create-a-page" under our shared scratch parent, then archive it once you've confirmed it exists.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_archive-a-page") -> 4. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"]({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"Playbook scratch - create-a-page\" } }] } }); const archived = await notion[\"notion_archive-a-page\"]({ page_id: page.id }); return { page, archived };" })`
- Expected Signals: The manual reports both callable names; both schemas resolve; the create call returns a structured page object with an `id`; the archive call returns `archived: true` (or equivalent trashed state) for that same `id`.
- Evidence: `list_tools()` result, both `tool_info()` results, Code Mode response (page object + archive result), and the scratch parent ID used.
- Pass/Fail Criteria: PASS if the callable and schema resolve, the page is created with an `id`, and the archive call confirms trashed state on that `id`; SKIP if the manual, token, or a shared scratch parent is unavailable; FAIL if a confirmed call contradicts the expected create/archive behavior.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch parent is shared with the integration. 2. Re-run `list_tools()` and both `tool_info()` calls. 3. Compare the returned schema against the `parent`/`properties` inputs before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set to a valid internal integration token, and a scratch parent page shared with that integration. Manual registration or scratch-parent sharing may be pending.

### Prompt

`Create a scratch Notion page titled "Playbook scratch - create-a-page" under our shared scratch parent, then archive it once you've confirmed it exists.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_archive-a-page")`
4. Run the Code Mode chain shown in the scenario contract.
5. Confirm the returned page `id` and the archived state in the response.

### Expected

Both callable names are discoverable, both schemas resolve, the page is created with a structured `id`, and the archive call returns a trashed state for the same `id`.

### Evidence

Capture discovery, schema, the created page object, the archive result, and the scratch parent ID.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the page is created and then archived.
- **Skip:** manual registration, token, or a shared scratch parent is unavailable.
- **Fail:** a confirmed call returns a page without an `id`, or the archive call fails to trash it.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch parent is shared with the integration.
2. Re-run `list_tools()` and both `tool_info()` calls.
3. Adjust only to the returned schema; if no safe schema is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAGE-001 | Create a page | Create a scratch page under a shared parent and archive it | `Create a scratch Notion page titled "Playbook scratch - create-a-page" under our shared scratch parent, then archive it once you've confirmed it exists.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_archive-a-page")` -> 4. Code Mode create+archive chain | Known names and schemas resolve; page created with `id`; archive confirms trashed state | Discovery, schemas, page object, archive result, scratch parent ID | PASS on structured create+archive; SKIP on prerequisites/schema; FAIL on contradictory confirmed behavior | Check token/sharing, rediscover tools, compare schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/pages/create-a-page.md`](../../feature-catalog/pages/create-a-page.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, parent shape, and API-version pin |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern reference |

---

## 5. SOURCE METADATA

- Group: Pages
- Playbook ID: `PAGE-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pages/create-a-page.md`
