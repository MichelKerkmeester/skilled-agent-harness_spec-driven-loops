---
title: "PAGE-005 -- Move a page"
description: "This scenario validates notion_move-page by creating a scratch page, moving it to a second scratch parent, then archiving it as cleanup."
stage: routing
version: 0.1.0.0
---

# PAGE-005 -- Move a page

## 1. OVERVIEW

This scenario validates the confirmed `notion_move-page` tool by creating a scratch page under one scratch parent, moving it to a second scratch parent, confirming the new parent, then archiving as cleanup.

### Why This Matters

Reorganizing content without recreating it is a common workspace-maintenance need. The scenario proves the callable resolves and that the page's `id` is preserved across the move, so a caller can rely on the same ID before and after reorganization.

---

## 2. SCENARIO CONTRACT

- Feature ID: `PAGE-005`
- Feature Name: Move a page
- Scenario Objective: Create a scratch page, move it to a second scratch parent, confirm the new parent, then archive.
- Exact Prompt: `Create a scratch Notion page under our first scratch parent, move it under our second scratch parent, confirm it moved, then archive it.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_move-page") -> 4. Code Mode: tool_info("notion.notion_retrieve-a-page") -> 5. Code Mode: tool_info("notion.notion_archive-a-page") -> 6. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"]({ parent: { page_id: SCRATCH_PARENT_A_ID }, properties: { title: [{ text: { content: \"Playbook scratch - move-page\" } }] } }); const moved = await notion[\"notion_move-page\"]({ page_id: page.id, parent: { page_id: SCRATCH_PARENT_B_ID } }); const confirmed = await notion[\"notion_retrieve-a-page\"]({ page_id: page.id }); const archived = await notion[\"notion_archive-a-page\"]({ page_id: page.id }); return { page, moved, confirmed, archived };" })`
- Expected Signals: The manual reports all four callable names; all four schemas resolve; the move call succeeds; the follow-up read on `confirmed` shows the page's parent as `SCRATCH_PARENT_B_ID`; the archive call confirms trashed state afterward.
- Evidence: `list_tools()` result, four `tool_info()` results, Code Mode response (page/moved/confirmed/archived), and both scratch parent IDs.
- Pass/Fail Criteria: PASS if the callables and schemas resolve, the page's `id` is preserved, the confirmed parent matches the second scratch parent, and the page is archived afterward; SKIP if the manual, token, or either shared scratch parent is unavailable; FAIL if the confirmed parent does not match the destination.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and both scratch parents are shared with the integration. 2. Re-run `list_tools()` and each `tool_info()` call. 3. Compare the returned schema against the `parent` input before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered, `NOTION_TOKEN` set, and two distinct scratch parent pages shared with the integration. Manual registration or either scratch-parent sharing may be pending.

### Prompt

`Create a scratch Notion page under our first scratch parent, move it under our second scratch parent, confirm it moved, then archive it.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_move-page")`
4. `tool_info("notion.notion_retrieve-a-page")`
5. `tool_info("notion.notion_archive-a-page")`
6. Run the Code Mode chain shown in the scenario contract.
7. Confirm the parent reported in `confirmed` matches the second scratch parent.

### Expected

All four callable names are discoverable, all four schemas resolve, the page moves to the second scratch parent, and it ends archived.

### Evidence

Capture discovery, schema, the create/move/confirm/archive responses, and both scratch parent IDs.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the confirmed parent matches the destination and the page is archived.
- **Skip:** manual registration, token, or either shared scratch parent is unavailable.
- **Fail:** the confirmed parent does not match the destination after the move.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm both scratch parents are shared with the integration.
2. Re-run `list_tools()` and each `tool_info()` call.
3. Adjust only to the returned schema; if no safe schema is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAGE-005 | Move a page | Create a scratch page, move it to a second scratch parent, then archive | `Create a scratch Notion page under our first scratch parent, move it under our second scratch parent, confirm it moved, then archive it.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_move-page")` -> 4. `tool_info("notion.notion_retrieve-a-page")` -> 5. `tool_info("notion.notion_archive-a-page")` -> 6. Code Mode create+move+confirm+archive chain | Known names and schemas resolve; parent changes to the second scratch parent; page archived | Discovery, schemas, create/move/confirm/archive responses, both scratch parent IDs | PASS on confirmed move+archive; SKIP on prerequisites/schema; FAIL on mismatched parent | Check token/sharing, rediscover tools, compare schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/pages/move-page.md`](../../feature-catalog/pages/move-page.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, and parent shape |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern reference |

---

## 5. SOURCE METADATA

- Group: Pages
- Playbook ID: `PAGE-005`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pages/move-page.md`
