---
title: "PAGE-004 -- Archive a page"
description: "This scenario validates notion_archive-a-page by creating a disposable scratch page and archiving it, confirming the reversible trash state."
stage: routing
version: 0.1.0.0
---

# PAGE-004 -- Archive a page

## 1. OVERVIEW

This scenario validates the confirmed `notion_archive-a-page` tool by creating a disposable scratch page, archiving it, and confirming the reversible trashed state with a follow-up read.

### Why This Matters

Archiving is Notion's only delete lifecycle for a page — there is no hard-delete endpoint. The scenario proves the callable resolves and that a page reports as trashed after the call, not merely that the call returns without error.

---

## 2. SCENARIO CONTRACT

- Feature ID: `PAGE-004`
- Feature Name: Archive a page
- Scenario Objective: Create a scratch page, archive it, and confirm the trashed state with a follow-up read.
- Exact Prompt: `Create a scratch Notion page, archive it, and confirm it now shows as archived.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_archive-a-page") -> 4. Code Mode: tool_info("notion.notion_retrieve-a-page") -> 5. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"] ({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"Playbook scratch - archive-a-page\" } }] } }); const archived = await notion[\"notion_archive-a-page\"] ({ page_id: page.id }); const confirmed = await notion[\"notion_retrieve-a-page\"] ({ page_id: page.id }); return { page, archived, confirmed };" })`
- Expected Signals: The manual reports all three callable names; all three schemas resolve; the archive call returns a success response; the follow-up read on `confirmed` shows `archived: true` (or equivalent `in_trash` state).
- Evidence: `list_tools()` result, three `tool_info()` results, Code Mode response (page/archived/confirmed), and the scratch parent ID.
- Pass/Fail Criteria: PASS if the callables and schemas resolve, the archive call succeeds, and the follow-up read confirms trashed state; SKIP if the manual, token, or a shared scratch parent is unavailable; FAIL if the follow-up read shows the page is still active.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch parent is shared with the integration. 2. Re-run `list_tools()` and each `tool_info()` call. 3. Compare the returned schema against the `page_id` input before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered, `NOTION_TOKEN` set, and a scratch parent page shared with the integration. Manual registration or scratch-parent sharing may be pending.

### Prompt

`Create a scratch Notion page, archive it, and confirm it now shows as archived.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_archive-a-page")`
4. `tool_info("notion.notion_retrieve-a-page")`
5. Run the Code Mode chain shown in the scenario contract.
6. Confirm the trashed state in the `confirmed` response.

### Expected

All three callable names are discoverable, all three schemas resolve, and the follow-up read confirms the page is archived.

### Evidence

Capture discovery, schema, the create/archive/confirm responses, and the scratch parent ID.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the follow-up read confirms trashed state.
- **Skip:** manual registration, token, or a shared scratch parent is unavailable.
- **Fail:** the follow-up read shows the page as still active.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch parent is shared with the integration.
2. Re-run `list_tools()` and each `tool_info()` call.
3. Adjust only to the returned schema; if no safe schema is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAGE-004 | Archive a page | Create a scratch page, archive it, and confirm the trashed state | `Create a scratch Notion page, archive it, and confirm it now shows as archived.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_archive-a-page")` -> 4. `tool_info("notion.notion_retrieve-a-page")` -> 5. Code Mode create+archive+confirm chain | Known names and schemas resolve; page trashed and confirmed | Discovery, schemas, create/archive/confirm responses, scratch parent ID | PASS on confirmed trashed state; SKIP on prerequisites/schema; FAIL if page still active | Check token/sharing, rediscover tools, compare schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/pages/archive-a-page.md`](../../feature-catalog/pages/archive-a-page.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, and reversible-trash model |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern reference |

---

## 5. SOURCE METADATA

- Group: Pages
- Playbook ID: `PAGE-004`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pages/archive-a-page.md`
