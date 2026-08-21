---
title: "CMT-001 -- Create a comment"
description: "This scenario validates a scratch-page create-comment-list-archive cycle through the confirmed notion_create-a-comment tool."
stage: routing
version: 0.1.0.0
---

# CMT-001 -- Create a comment

## 1. OVERVIEW

This scenario validates the confirmed `notion_create-a-comment` tool by creating a disposable scratch page, adding a comment to it, listing comments to confirm it landed, then archiving the scratch page as cleanup.

### Why This Matters

`create-a-comment` is the only comment-write tool in the 24-tool inventory, and it is mutating — it must be exercised inside a page the scenario itself creates and discards, never against real workspace content. Because there is no comment-delete tool, cleanup happens by archiving the scratch page the comment lives on, which is reversible.

---

## 2. SCENARIO CONTRACT

- Feature ID: `CMT-001`
- Feature Name: Create a comment
- Scenario Objective: Create a scratch page, add a comment to it via `create-a-comment`, confirm it appears via `list-comments`, then archive the scratch page as cleanup.
- Exact Prompt: `Add a comment to a scratch Notion page saying it's ready for review, then clean up the scratch page when you're done.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-comment") -> 3. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"]({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"mcp-notion playbook scratch — CMT-001\" } }] } }); const comment = await notion[\"notion_create-a-comment\"]({ parent: { page_id: page.id }, rich_text: [{ text: { content: \"CMT-001 scratch comment: ready for review\" } }] }); const listed = await notion[\"notion_list-comments\"]({ block_id: page.id }); const archived = await notion[\"notion_archive-a-page\"]({ page_id: page.id, archived: true }); return { page, comment, listed, archived };" })`
- Expected Signals: `create-a-page` returns a page object with an `id`; `create-a-comment` returns a comment object with an `id` and `discussion_id`; `list-comments` returns a `results` array containing the created comment's `id`; `archive-a-page` returns the page with `archived: true`.
- Evidence: `list_tools()` result, `tool_info()` result, and the Code Mode response — scratch page `id`, comment `id`/`discussion_id`, the `list-comments` results array, and the archived page state.
- Pass/Fail Criteria: PASS if the comment is created under the scratch page, appears in `list-comments` before cleanup, and the scratch page is archived afterward; SKIP if no scratch parent page/data source is available to create the page into, or the manual/token is unregistered; FAIL if the comment create call returns without a valid `id`/`discussion_id`, `list-comments` does not include it, or the scratch page fails to archive.
- Failure Triage: 1. Confirm `NOTION_TOKEN` and manual registration with `retrieve-bot-user` (`USR-003`). 2. Confirm the scratch parent page/data source is shared with the integration. 3. Re-run `list_tools()`/`tool_info()` and compare the `create-a-comment` schema's `parent` shape (`page_id` vs `discussion_id`) before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has a scratch parent page (or data source) already shared with the integration, so a disposable child page can be created into it. `NOTION_TOKEN` is set and the `notion` manual is registered.

### Prompt

`Add a comment to a scratch Notion page saying it's ready for review, then clean up the scratch page when you're done.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-comment")`
3. Run the Code Mode chain shown in the scenario contract: create the scratch page, add the comment, list comments to verify, then archive the page.
4. Read the `list-comments` result from step 3 to confirm the comment's `id` is present before treating the run as passed.

### Expected

The scratch page is created, the comment is added and returns an `id`/`discussion_id`, `list-comments` includes that comment before archival, and the scratch page ends the scenario archived.

### Evidence

Capture tool discovery, the scratch page `id`, the comment object, the `list-comments` results array, and the archived page state.

### Pass / Fail

- **Pass:** the comment is created, confirmed via `list-comments`, and the scratch page is archived as cleanup.
- **Skip:** no scratch parent page/data source is available, or the manual/token is unregistered.
- **Fail:** the comment create call fails or returns without a valid `id`, `list-comments` omits it, or the scratch page fails to archive.

### Failure Triage

1. Confirm `NOTION_TOKEN` and manual registration with `retrieve-bot-user` (`USR-003`).
2. Confirm the scratch parent page/data source is shared with the integration.
3. Re-run `list_tools()`/`tool_info()` and compare the `create-a-comment` schema's `parent` shape before retrying.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CMT-001 | Create a comment | Create a scratch page, comment on it, verify via list-comments, and archive as cleanup | `Add a comment to a scratch Notion page saying it's ready for review, then clean up the scratch page when you're done.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-comment")` -> 3. Code Mode create-page/create-comment/list-comments/archive-page chain | Comment created with `id`/`discussion_id`; `list-comments` includes it; page archived after | Discovery, schema, scratch page id, comment object, list-comments results, archived state | PASS on comment created+confirmed+cleaned up; SKIP on missing scratch prerequisite/registration; FAIL on missing id, unconfirmed list, or failed archive | Check token/registration, confirm scratch parent shared, re-verify parent schema |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [`../../feature-catalog/comments/create-a-comment.md`](../../feature-catalog/comments/create-a-comment.md) | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern and preflight reference |

---

## 5. SOURCE METADATA

- Group: Comments
- Playbook ID: `CMT-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `comments/create-a-comment.md`
