---
title: "BLK-005 -- Delete a block"
description: "This scenario validates a scratch-safe, reversible block trash through the confirmed notion_delete-a-block tool, then archives the scratch page as cleanup."
stage: routing
version: 0.1.0.0
---

# BLK-005 -- Delete a block

## 1. OVERVIEW

This scenario validates the confirmed `notion_delete-a-block` tool by trashing a paragraph block on a disposable scratch page and confirming the trash is reversible.

### Why This Matters

`delete-a-block` is trash, not permanent removal — there is no hard-delete endpoint for blocks. The scenario confirms the archived flag flips as expected and that the block can be restored before the scratch page itself is archived as final cleanup, so the "delete" behavior is verified as reversible rather than assumed.

---

## 2. SCENARIO CONTRACT

- Feature ID: `BLK-005`
- Feature Name: Delete a block
- Scenario Objective: Create a scratch page, append one paragraph block to get a real `block_id`, trash that block, confirm the response reports `archived: true`, restore it, then archive the scratch page as cleanup.
- Exact Prompt: `Create a scratch Notion page under my sandbox parent, add a paragraph, delete that paragraph block, confirm it is trashed, then restore it before you're done.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_append-block-children") -> 4. Code Mode: tool_info("notion.notion_delete-a-block") -> 5. Code Mode: tool_info("notion.notion_update-a-block") -> 6. Code Mode: tool_info("notion.notion_archive-a-page") -> 7. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"] ({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"BLK-005 scratch\" } }] } }); const appended = await notion[\"notion_append-block-children\"] ({ block_id: page.id, children: [{ type: \"paragraph\", paragraph: { rich_text: [{ text: { content: \"BLK-005 marker\" } }] } }] }); const blockId = appended.results[0].id; const trashed = await notion[\"notion_delete-a-block\"] ({ block_id: blockId }); const restored = await notion[\"notion_update-a-block\"] ({ block_id: blockId, archived: false }); await notion[\"notion_archive-a-page\"] ({ page_id: page.id }); return { trashed, restored };" })`
- Expected Signals: The live manual reports the callable names; all five schemas resolve; the scratch page and paragraph block are created; the trash response reports `archived: true`; the restore response reports `archived: false`; the scratch page archives successfully afterward.
- Evidence: `list_tools()` result, all five `tool_info()` results, the created page ID, the appended block ID, the trash response, the restore response, and the archive response.
- Pass/Fail Criteria: PASS if the tool names and schemas resolve, the trash response shows `archived: true`, and the restore shows `archived: false`; SKIP if no scratch parent page is available or registration/token is missing; FAIL if a confirmed call reports the block as not archived after the trash call, or the restore does not clear the flag.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch parent is shared with the integration with update capability. 2. Run `list_tools()` and `tool_info()` again for all five tools. 3. Re-read the block via `retrieve-a-block` if available to independently confirm the `archived` state before assuming the trash/restore call failed.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set, and a scratch parent page ID shared with the integration with update capability. Scratch-parent provisioning may be pending.

### Prompt

`Create a scratch Notion page under my sandbox parent, add a paragraph, delete that paragraph block, confirm it is trashed, then restore it before you're done.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_append-block-children")`
4. `tool_info("notion.notion_delete-a-block")`
5. `tool_info("notion.notion_update-a-block")`
6. `tool_info("notion.notion_archive-a-page")`
7. Run the Code Mode chain shown in the scenario contract.

### Expected

The five confirmed names are discoverable, all schemas resolve, the scratch page and block are created, the trash call reports `archived: true`, the restore call reports `archived: false`, and the scratch page is archived afterward.

### Evidence

Capture discovery, all five schema checks, the created page ID, the appended block ID, the trash response, the restore response, and the archive response.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the block trashes to `archived: true` and restores to `archived: false`.
- **Skip:** no scratch parent page ID is available, or the manual, token, or a schema is unavailable.
- **Fail:** a confirmed call reports the block as not archived after the trash call, or the restore fails to clear the flag.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch parent page is shared with the integration with update capability.
2. Re-run `list_tools()` and each `tool_info()` call.
3. Independently re-read the block's `archived` state (via `retrieve-a-block`) before assuming the trash or restore call is broken; if no safe scratch parent is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BLK-005 | Delete a block | Trash a scratch page's paragraph block, confirm reversibility, and restore it, then clean up | `Create a scratch Notion page under my sandbox parent, add a paragraph, delete that paragraph block, confirm it is trashed, then restore it before you're done.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_append-block-children")` -> 4. `tool_info("notion.notion_delete-a-block")` -> 5. `tool_info("notion.notion_update-a-block")` -> 6. `tool_info("notion.notion_archive-a-page")` -> 7. Code Mode create/append/trash/restore/archive chain | Known names and schemas resolve; trash sets `archived: true`; restore clears it; scratch page archives | Discovery, schemas, page ID, block ID, trash response, restore response, archive response | PASS on correct archived-flag transitions; SKIP on missing scratch parent or schema; FAIL on flag not flipping as expected | Check token/sharing/capability, rediscover tools, independently re-read archived state |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario index |
| [`../../feature-catalog/blocks/delete-a-block.md`](../../feature-catalog/blocks/delete-a-block.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and no-hard-delete note (§5 Blocks) |
| [`../../examples/README.md`](../../examples/README.md) | Scratch-safe archive pattern (§3.5) this scenario mirrors at block level |

---

## 5. SOURCE METADATA

- Group: Blocks
- Playbook ID: `BLK-005`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `blocks/delete-a-block.md`
