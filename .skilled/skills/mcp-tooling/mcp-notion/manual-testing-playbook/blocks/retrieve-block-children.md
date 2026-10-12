---
title: "BLK-002 -- Retrieve block children"
description: "This scenario validates a paginated, read-only child-block listing through the confirmed notion_retrieve-block-children tool against a scratch page."
stage: routing
version: 0.1.0.0
---

# BLK-002 -- Retrieve block children

## 1. OVERVIEW

This scenario validates the confirmed `notion_retrieve-block-children` tool as a read-only, paginated listing of a page's child blocks, run against a disposable scratch page.

### Why This Matters

`retrieve-block-children` is the block-level way to read page content and confirm pagination behavior (`start_cursor` / `page_size` / `has_more`). An empty `results` array is a valid outcome and must never be treated as a failure or padded with fabricated rows. The scenario is read-only against a scratch page's own content, so it never touches shared or production data.

---

## 2. SCENARIO CONTRACT

- Feature ID: `BLK-002`
- Feature Name: Retrieve block children
- Scenario Objective: Create a scratch page, append one paragraph block, list the page's children and confirm the appended block is present, then archive the scratch page as cleanup.
- Exact Prompt: `Create a scratch Notion page under my sandbox parent, add one paragraph to it, then list all of that page's child blocks and confirm my paragraph is there.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_append-block-children") -> 4. Code Mode: tool_info("notion.notion_retrieve-block-children") -> 5. Code Mode: tool_info("notion.notion_archive-a-page") -> 6. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"] ({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"BLK-002 scratch\" } }] } }); await notion[\"notion_append-block-children\"] ({ block_id: page.id, children: [{ type: \"paragraph\", paragraph: { rich_text: [{ text: { content: \"BLK-002 marker\" } }] } }] }); const children = await notion[\"notion_retrieve-block-children\"] ({ block_id: page.id, page_size: 25 }); await notion[\"notion_archive-a-page\"] ({ page_id: page.id }); return children;" })`
- Expected Signals: The live manual reports the callable names; all four schemas resolve; the scratch page and paragraph block are created; the children listing's `results` array contains exactly one block whose `paragraph.rich_text` text matches the marker; `has_more` is `false` for this small set; the scratch page archives successfully afterward.
- Evidence: `list_tools()` result, all four `tool_info()` results, the created page ID, the appended block response, the full children-listing response, and the archive response.
- Pass/Fail Criteria: PASS if the tool names and schemas resolve and the children listing contains the appended marker block; SKIP if no scratch parent page is available or registration/token is missing; FAIL if a confirmed call returns a listing that omits the appended block or fabricates content when the result should be empty.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch parent is shared with the integration. 2. Run `list_tools()` and `tool_info()` again for all four tools. 3. Check `start_cursor`/`page_size`/`has_more` handling before assuming the listing is wrong.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set, and a scratch parent page ID shared with the integration. Scratch-parent provisioning may be pending.

### Prompt

`Create a scratch Notion page under my sandbox parent, add one paragraph to it, then list all of that page's child blocks and confirm my paragraph is there.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_append-block-children")`
4. `tool_info("notion.notion_retrieve-block-children")`
5. `tool_info("notion.notion_archive-a-page")`
6. Run the Code Mode chain shown in the scenario contract.

### Expected

The four confirmed names are discoverable, all schemas resolve, the scratch page and paragraph block are created, the children listing returns exactly one result containing the marker text with `has_more: false`, and the scratch page is archived afterward.

### Evidence

Capture discovery, all four schema checks, the created page ID, the appended block response, the full children-listing response, and the archive response.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the children listing contains the appended marker block.
- **Skip:** no scratch parent page ID is available, or the manual, token, or a schema is unavailable.
- **Fail:** a confirmed call returns a listing that omits the appended block, or fabricates content for an empty result.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch parent page is shared with the integration.
2. Re-run `list_tools()` and each `tool_info()` call.
3. Inspect the `start_cursor`/`page_size`/`has_more` fields in the response before assuming the listing is incomplete; if no safe scratch parent is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BLK-002 | Retrieve block children | List a scratch page's child blocks and confirm the appended block, then clean up | `Create a scratch Notion page under my sandbox parent, add one paragraph to it, then list all of that page's child blocks and confirm my paragraph is there.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_append-block-children")` -> 4. `tool_info("notion.notion_retrieve-block-children")` -> 5. `tool_info("notion.notion_archive-a-page")` -> 6. Code Mode create/append/list/archive chain | Known names and schemas resolve; listing contains appended marker with `has_more: false`; scratch page archives | Discovery, schemas, page ID, append response, children listing, archive response | PASS on listing containing the marker; SKIP on missing scratch parent or schema; FAIL on omitted block or fabricated content | Check token/sharing, rediscover tools, inspect pagination fields |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario index |
| [`../../feature-catalog/blocks/retrieve-block-children.md`](../../feature-catalog/blocks/retrieve-block-children.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and pagination inputs (§5 Blocks) |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern and scratch-safe round-trip reference |

---

## 5. SOURCE METADATA

- Group: Blocks
- Playbook ID: `BLK-002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `blocks/retrieve-block-children.md`
