---
title: "Append block children"
description: "Add one or more blocks to a page or block through the confirmed notion_append-block-children tool."
trigger_phrases:
  - "Append block children"
  - "notion_append-block-children"
  - "add content blocks to a Notion page"
version: 0.1.0.0
---

# Append block children (`notion_append-block-children`)

## 1. OVERVIEW

`notion_append-block-children` adds one or more new blocks to a page or block, in one call. This is the primary way to write page content directly at the block-object level — a paragraph, a heading, a bulleted list item, or several of these at once, all in a single request.

The Code Mode callable form is `notion["notion_append-block-children"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the parent page shared with the integration in the Notion UI with insert capability.

`notion_append-block-children` calls `PATCH /v1/blocks/{block_id}/children` under API version `2025-09-03`. Inputs are `block_id` (the parent page or block), `children` (an array of block objects, each keyed by its `type`), and an optional `after` (the ID of an existing child to insert after — omit to append at the end). The response returns the newly created block objects, including their IDs.

Because `children` accepts multiple block objects in one call, a caller can build an entire section — heading plus several paragraphs — in a single request rather than one call per block. New blocks always land at the end unless `after` is supplied. This is the tool a scratch-safe write scenario uses to give a freshly created scratch page real block content (and therefore a real `block_id`) for the mutating Blocks scenarios to exercise.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes block-append writes to the Blocks domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Blocks). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/blocks/append-block-children.md`](../../manual-testing-playbook/blocks/append-block-children.md) | Manual playbook | Exercises a scratch-page append, then reversible cleanup, as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the page-create-plus-append Code Mode pattern (§3.1). |

---

## 4. SOURCE METADATA

- Group: Blocks
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `blocks/append-block-children.md`

Related references:
- [`retrieve-block-children.md`](retrieve-block-children.md) — reads back the children this tool writes.
- [`update-a-block.md`](update-a-block.md) — edits a block already appended by this tool.
