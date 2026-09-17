---
title: "BLK-001 -- Retrieve a block"
description: "This scenario validates a read-only single-block fetch through the confirmed notion_retrieve-a-block tool against a scratch page's own block."
stage: routing
version: 0.1.0.0
---

# BLK-001 -- Retrieve a block

## 1. OVERVIEW

This scenario validates the confirmed `notion_retrieve-a-block` tool as a read-only fetch of one block object by ID, run against a block belonging to a disposable scratch page.

### Why This Matters

`retrieve-a-block` is the smallest read primitive in the Blocks domain — it confirms a block ID resolves to a real object before any block-level edit or trash call relies on it. The scenario is read-only against a scratch page's own content, so it never touches shared or production data.

---

## 2. SCENARIO CONTRACT

- Feature ID: `BLK-001`
- Feature Name: Retrieve a block
- Scenario Objective: Create a scratch page, append one paragraph block to get a real `block_id`, retrieve that block by ID, then archive the scratch page as cleanup.
- Exact Prompt: `Create a scratch Notion page under my sandbox parent, add one paragraph to it, then read that paragraph block back by its ID and tell me what it contains.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_append-block-children") -> 4. Code Mode: tool_info("notion.notion_retrieve-a-block") -> 5. Code Mode: tool_info("notion.notion_archive-a-page") -> 6. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"] ({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"BLK-001 scratch\" } }] } }); const appended = await notion[\"notion_append-block-children\"] ({ block_id: page.id, children: [{ type: \"paragraph\", paragraph: { rich_text: [{ text: { content: \"BLK-001 marker\" } }] } }] }); const blockId = appended.results[0].id; const block = await notion[\"notion_retrieve-a-block\"] ({ block_id: blockId }); await notion[\"notion_archive-a-page\"] ({ page_id: page.id }); return block;" })`
- Expected Signals: The live manual reports the callable names; all four schemas resolve; the scratch page and paragraph block are created; the retrieved block object's `type` is `paragraph` and its `paragraph.rich_text` text matches the marker; the scratch page archives successfully afterward.
- Evidence: `list_tools()` result, all four `tool_info()` results, the created page ID, the appended block ID, the retrieved block object, and the archive response.
- Pass/Fail Criteria: PASS if the tool names and schemas resolve and the retrieved block's content matches what was appended; SKIP if no scratch parent page is available or registration/token is missing; FAIL if a confirmed call returns a block object that contradicts what was appended.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch parent is shared with the integration. 2. Run `list_tools()` and `tool_info()` again for all four tools. 3. Re-check the appended block's returned ID before assuming the retrieve call failed.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set, and a scratch parent page ID shared with the integration. Scratch-parent provisioning may be pending.

### Prompt

`Create a scratch Notion page under my sandbox parent, add one paragraph to it, then read that paragraph block back by its ID and tell me what it contains.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_append-block-children")`
4. `tool_info("notion.notion_retrieve-a-block")`
5. `tool_info("notion.notion_archive-a-page")`
6. Run the Code Mode chain shown in the scenario contract.

### Expected

The four confirmed names are discoverable, all schemas resolve, the scratch page and paragraph block are created, the retrieved block object reports `type: "paragraph"` with the marker text, and the scratch page is archived afterward.

### Evidence

Capture discovery, all four schema checks, the created page ID, the appended block ID, the full retrieved block object, and the archive response.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the retrieved block's content matches the appended marker.
- **Skip:** no scratch parent page ID is available, or the manual, token, or a schema is unavailable.
- **Fail:** a confirmed call returns a block object that contradicts the appended content, or the scratch page fails to archive.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch parent page is shared with the integration.
2. Re-run `list_tools()` and each `tool_info()` call.
3. Compare the appended block's returned ID against the ID passed to `retrieve-a-block`; if no safe scratch parent is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BLK-001 | Retrieve a block | Read a single block by ID from a scratch page, then clean up | `Create a scratch Notion page under my sandbox parent, add one paragraph to it, then read that paragraph block back by its ID and tell me what it contains.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_append-block-children")` -> 4. `tool_info("notion.notion_retrieve-a-block")` -> 5. `tool_info("notion.notion_archive-a-page")` -> 6. Code Mode create/append/retrieve/archive chain | Known names and schemas resolve; retrieved block matches appended marker; scratch page archives | Discovery, schemas, page ID, block ID, block object, archive response | PASS on matching structured retrieve; SKIP on missing scratch parent or schema; FAIL on contradictory confirmed behavior | Check token/sharing, rediscover tools, compare block ID |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario index |
| [`../../feature-catalog/blocks/retrieve-a-block.md`](../../feature-catalog/blocks/retrieve-a-block.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs (§5 Blocks) |
| [`../../examples/README.md`](../../examples/README.md) | Code Mode invocation pattern and scratch-safe round-trip reference |

---

## 5. SOURCE METADATA

- Group: Blocks
- Playbook ID: `BLK-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `blocks/retrieve-a-block.md`
