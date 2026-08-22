---
title: "BLK-004 -- Update a block"
description: "This scenario validates a scratch-safe block edit through the confirmed notion_update-a-block tool, then archives the scratch page as cleanup."
stage: routing
version: 0.1.0.0
---

# BLK-004 -- Update a block

## 1. OVERVIEW

This scenario validates the confirmed `notion_update-a-block` tool by editing a paragraph block's content on a disposable scratch page.

### Why This Matters

`update-a-block` takes a block-type-specific payload, so this scenario confirms the payload shape actually applies to a live block rather than being silently ignored. The scenario creates its own scratch page and block, edits it, verifies the new content, then archives — reversible cleanup that never touches shared or production data.

---

## 2. SCENARIO CONTRACT

- Feature ID: `BLK-004`
- Feature Name: Update a block
- Scenario Objective: Create a scratch page, append one paragraph block to get a real `block_id`, update that block's text, confirm the new content is present, then archive the scratch page as cleanup.
- Exact Prompt: `Create a scratch Notion page under my sandbox parent, add a paragraph, then change that paragraph's text to "BLK-004 updated" and confirm the change stuck.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_append-block-children") -> 4. Code Mode: tool_info("notion.notion_update-a-block") -> 5. Code Mode: tool_info("notion.notion_archive-a-page") -> 6. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"]({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"BLK-004 scratch\" } }] } }); const appended = await notion[\"notion_append-block-children\"]({ block_id: page.id, children: [{ type: \"paragraph\", paragraph: { rich_text: [{ text: { content: \"BLK-004 original\" } }] } }] }); const blockId = appended.results[0].id; const updated = await notion[\"notion_update-a-block\"]({ block_id: blockId, paragraph: { rich_text: [{ text: { content: \"BLK-004 updated\" } }] } }); await notion[\"notion_archive-a-page\"]({ page_id: page.id }); return updated;" })`
- Expected Signals: The live manual reports the callable names; all four schemas resolve; the scratch page and original paragraph block are created; the update response's `paragraph.rich_text` text reads "BLK-004 updated" (not the original text); the scratch page archives successfully afterward.
- Evidence: `list_tools()` result, all four `tool_info()` results, the created page ID, the appended block ID, the full update response, and the archive response.
- Pass/Fail Criteria: PASS if the tool names and schemas resolve and the updated block's content matches the new text; SKIP if no scratch parent page is available or registration/token is missing; FAIL if a confirmed call returns a block still showing the original text or an unrelated payload.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch parent is shared with the integration with update capability. 2. Run `list_tools()` and `tool_info()` again for all four tools. 3. Confirm the update payload's type key (`paragraph`) matches the target block's actual `type` before assuming the update tool is broken.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set, and a scratch parent page ID shared with the integration with update capability. Scratch-parent provisioning may be pending.

### Prompt

`Create a scratch Notion page under my sandbox parent, add a paragraph, then change that paragraph's text to "BLK-004 updated" and confirm the change stuck.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_append-block-children")`
4. `tool_info("notion.notion_update-a-block")`
5. `tool_info("notion.notion_archive-a-page")`
6. Run the Code Mode chain shown in the scenario contract.

### Expected

The four confirmed names are discoverable, all schemas resolve, the scratch page and original block are created, the update call returns the block with its text changed to "BLK-004 updated", and the scratch page is archived afterward.

### Evidence

Capture discovery, all four schema checks, the created page ID, the appended block ID, the full update response, and the archive response.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the updated block's content matches the new text.
- **Skip:** no scratch parent page ID is available, or the manual, token, or a schema is unavailable.
- **Fail:** a confirmed call returns a block still showing the original text, or the update call errors on a correctly typed payload.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch parent page is shared with the integration with update capability.
2. Re-run `list_tools()` and each `tool_info()` call.
3. Compare the update payload's type key against the block's confirmed `type` (from the append response); if no safe scratch parent is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BLK-004 | Update a block | Edit a scratch page's paragraph text and confirm the change, then clean up | `Create a scratch Notion page under my sandbox parent, add a paragraph, then change that paragraph's text to "BLK-004 updated" and confirm the change stuck.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_append-block-children")` -> 4. `tool_info("notion.notion_update-a-block")` -> 5. `tool_info("notion.notion_archive-a-page")` -> 6. Code Mode create/append/update/archive chain | Known names and schemas resolve; updated block shows new text; scratch page archives | Discovery, schemas, page ID, block ID, update response, archive response | PASS on updated text matching; SKIP on missing scratch parent or schema; FAIL on stale or unrelated content | Check token/sharing/capability, rediscover tools, match payload type to block type |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario index |
| [`../../feature-catalog/blocks/update-a-block.md`](../../feature-catalog/blocks/update-a-block.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and type-specific payload note (§5 Blocks) |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern and preflight before any Notion write |

---

## 5. SOURCE METADATA

- Group: Blocks
- Playbook ID: `BLK-004`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `blocks/update-a-block.md`
