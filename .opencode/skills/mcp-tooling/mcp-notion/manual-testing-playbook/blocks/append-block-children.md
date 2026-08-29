---
title: "BLK-003 -- Append block children"
description: "This scenario validates a scratch-safe block append through the confirmed notion_append-block-children tool, then archives the scratch page as cleanup."
stage: routing
version: 0.1.0.0
---

# BLK-003 -- Append block children

## 1. OVERVIEW

This scenario validates the confirmed `notion_append-block-children` tool by appending a paragraph block to a disposable scratch page and reading it back.

### Why This Matters

`append-block-children` is the primary way to write page content at the block-object level, and this is the mutation every other Blocks scenario relies on to produce a real `block_id` to exercise. The scenario creates its own scratch page, appends, verifies, then archives — reversible cleanup that never touches shared or production data.

---

## 2. SCENARIO CONTRACT

- Feature ID: `BLK-003`
- Feature Name: Append block children
- Scenario Objective: Create a scratch page, append one paragraph block to it, confirm the response contains a real block ID and matching content, then archive the scratch page as cleanup.
- Exact Prompt: `Create a scratch Notion page under my sandbox parent and add a paragraph saying "BLK-003 marker" to it, then confirm the block was created.`
- Exact Command Sequence: `1. Code Mode: list_tools() -> 2. Code Mode: tool_info("notion.notion_create-a-page") -> 3. Code Mode: tool_info("notion.notion_append-block-children") -> 4. Code Mode: tool_info("notion.notion_archive-a-page") -> 5. Code Mode: call_tool_chain({ code: "const page = await notion[\"notion_create-a-page\"] ({ parent: { page_id: SCRATCH_PARENT_ID }, properties: { title: [{ text: { content: \"BLK-003 scratch\" } }] } }); const appended = await notion[\"notion_append-block-children\"] ({ block_id: page.id, children: [{ type: \"paragraph\", paragraph: { rich_text: [{ text: { content: \"BLK-003 marker\" } }] } }] }); await notion[\"notion_archive-a-page\"] ({ page_id: page.id }); return appended;" })`
- Expected Signals: The live manual reports the callable names; all three schemas resolve; the scratch page is created; the append response's `results` array contains exactly one new block object with `type: "paragraph"` and the marker text; the scratch page archives successfully afterward.
- Evidence: `list_tools()` result, all three `tool_info()` results, the created page ID, the full append response including the new block ID, and the archive response.
- Pass/Fail Criteria: PASS if the tool names and schemas resolve and the append response returns a new block matching the marker; SKIP if no scratch parent page is available or registration/token is missing; FAIL if a confirmed call returns a block object with content that contradicts what was appended, or the append silently fails.
- Failure Triage: 1. Confirm `NOTION_TOKEN` is set and the scratch parent is shared with the integration with insert capability. 2. Run `list_tools()` and `tool_info()` again for all three tools. 3. Check the `children` array shape (`type` plus the matching type-keyed field) before assuming the append tool is broken.

---

## 3. TEST EXECUTION

### Prerequisites

The operator has the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set, and a scratch parent page ID shared with the integration with insert capability. Scratch-parent provisioning may be pending.

### Prompt

`Create a scratch Notion page under my sandbox parent and add a paragraph saying "BLK-003 marker" to it, then confirm the block was created.`

### Commands

1. `list_tools()`
2. `tool_info("notion.notion_create-a-page")`
3. `tool_info("notion.notion_append-block-children")`
4. `tool_info("notion.notion_archive-a-page")`
5. Run the Code Mode chain shown in the scenario contract.

### Expected

The three confirmed names are discoverable, all schemas resolve, the scratch page is created, the append call returns exactly one new paragraph block containing the marker text with a real block ID, and the scratch page is archived afterward.

### Evidence

Capture discovery, all three schema checks, the created page ID, the full append response including the new block ID, and the archive response.

### Pass / Fail

- **Pass:** tool discovery and schema checks succeed; the append response returns a new block matching the marker text.
- **Skip:** no scratch parent page ID is available, or the manual, token, or a schema is unavailable.
- **Fail:** a confirmed call returns a block with contradictory content, or the append call reports success without a new block ID.

### Failure Triage

1. Check `NOTION_TOKEN` and confirm the scratch parent page is shared with the integration with insert capability.
2. Re-run `list_tools()` and each `tool_info()` call.
3. Compare the `children` payload shape (`type` key plus its type-specific field) against the confirmed schema; if no safe scratch parent is available, record `SKIP`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BLK-003 | Append block children | Append a paragraph to a scratch page and confirm the new block, then clean up | `Create a scratch Notion page under my sandbox parent and add a paragraph saying "BLK-003 marker" to it, then confirm the block was created.` | 1. `list_tools()` -> 2. `tool_info("notion.notion_create-a-page")` -> 3. `tool_info("notion.notion_append-block-children")` -> 4. `tool_info("notion.notion_archive-a-page")` -> 5. Code Mode create/append/archive chain | Known names and schemas resolve; new block matches marker text; scratch page archives | Discovery, schemas, page ID, append response with new block ID, archive response | PASS on new block matching marker; SKIP on missing scratch parent or schema; FAIL on contradictory or silent-failure append | Check token/sharing/capability, rediscover tools, verify children payload shape |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy and scenario index |
| [`../../feature-catalog/blocks/append-block-children.md`](../../feature-catalog/blocks/append-block-children.md) | Catalog entry for the tool under test |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Tool name, endpoint, API-version pin, and key inputs (§5 Blocks) |
| [`../../examples/README.md`](../../examples/README.md) | Page-create-plus-append Code Mode pattern (§3.1) |

---

## 5. SOURCE METADATA

- Group: Blocks
- Playbook ID: `BLK-003`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `blocks/append-block-children.md`
