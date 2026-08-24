---
title: "PAGE-007 -- Update page via Markdown"
description: "This scenario validates notion_update-page-markdown by creating a scratch page, writing Markdown content, reading it back, then archiving as cleanup."
stage: routing
version: 0.1.0.0
---

# PAGE-007 -- Update page via Markdown

## 1. OVERVIEW

This scenario validates the confirmed `notion_update-page-markdown` tool by creating a disposable scratch page, replacing its content with Markdown, reading the content back to confirm the write landed, then archiving as cleanup.

### Why This Matters

The Markdown write path is the highest-priority write path for editing page content — full replace or targeted find-and-replace, without hand-building block objects. The scenario proves the callable resolves under the required `2026-03-11` API version and that a write is confirmed by an independent read, not assumed from the write call's return alone.

---

## 2. SCENARIO CONTRACT

- Feature ID: `PAGE-007`
- Feature Name: Update page via Markdown
- Scenario Objective: Create a scratch page, write Markdown content to it, read it back to confirm, then archive.
- Exact Prompt: `Create a scratch Notion page, write a short Markdown paragraph into it, confirm the content by reading it back, then archive the page.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_update-page-markdown") -> 4. Code Mode: tool_info("notion.notion_retrieve-page-markdown") -> 5. Code Mode: tool_info("notion.notion_archive-a-page") -> 6. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"]({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"Playbook scratch - update-page-markdown\" } }] } }); const written = await notion[\"notion_update-page-markdown\"]({ page_id: page.id, replace_content: \"## Playbook marker\\n\\nWritten by PAGE-007.\" }); const confirmed = await notion[\"notion_retrieve-page-markdown\"]({ page_id: page.id }); const archived = await notion[\"notion_archive-a-page\"]({ page_id: page.id }); return { page, written, confirmed, archived };" })`
- Expected Signals: The manual reports all four callable names; all four schemas resolve; the write call succeeds under API `2026-03-11`; the `confirmed` read contains the written marker text; the archive call confirms trashed state.
- Evidence: `list_tools()` result, four `tool_info()` results, Code Mode response (page/written/confirmed/archived), and the scratch parent ID.
- Pass/Fail Criteria: PASS if the callables and schemas resolve, the confirmed read contains the written marker, and the page is archived afterward; SKIP if the manual, token, or a shared scratch parent is unavailable; FAIL if the confirmed read does not contain the written marker or the write errors on API version.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch parent is shared with the integration. 2. Re-run `list_tools()` and each `tool_info()` call. 3. Confirm the server pins `2026-03-11` for the markdown tools before retrying.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered, `NOTION_TOKEN` set, and a scratch parent page shared with the integration. Manual registration or scratch-parent sharing may be pending.

### Prompt

`Create a scratch Notion page, write a short Markdown paragraph into it, confirm the content by reading it back, then archive the page.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_update-page-markdown")`
4. `tool_info("notion.notion_retrieve-page-markdown")`
5. `tool_info("notion.notion_archive-a-page")`
6. Run the Code Mode chain shown in the scenario contract.
7. Confirm the written marker appears in the `confirmed` response.

### Expected

All four callable names are discoverable, all four schemas resolve, the marker text appears in the confirmed read, and the page ends archived.

### Evidence

Capture discovery, schema, the create/write/confirm/archive responses, and the scratch parent ID.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the confirmed read contains the written marker and the page is archived.
- **Skip:** manual registration, token, or a shared scratch parent is unavailable.
- **Fail:** the confirmed read does not contain the marker, or the write errors on API version.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch parent is shared with the integration.
2. Re-run `list_tools()` and each `tool_info()` call.
3. Confirm the API version pin; if no safe schema is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAGE-007 | Update page via Markdown | Create a scratch page, write and confirm Markdown content, then archive | `Create a scratch Notion page, write a short Markdown paragraph into it, confirm the content by reading it back, then archive the page.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_update-page-markdown")` -> 4. `tool_info("notion.notion_retrieve-page-markdown")` -> 5. `tool_info("notion.notion_archive-a-page")` -> 6. Code Mode create+write+confirm+archive chain | Known names and schemas resolve; written marker confirmed; page archived | Discovery, schemas, create/write/confirm/archive responses, scratch parent ID | PASS on confirmed write+archive; SKIP on prerequisites/schema; FAIL on missing marker or API-version error | Check token/sharing, rediscover tools, confirm API version |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and wave order |
| [`../../feature-catalog/pages/update-page-markdown.md`](../../feature-catalog/pages/update-page-markdown.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, `replace_content`/`update_content` inputs, and the `2026-03-11` version pin |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern reference |

---

## 5. SOURCE METADATA

- Group: Pages
- Playbook ID: `PAGE-007`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pages/update-page-markdown.md`
