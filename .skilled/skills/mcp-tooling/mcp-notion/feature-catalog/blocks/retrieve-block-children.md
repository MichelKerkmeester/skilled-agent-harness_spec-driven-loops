---
title: "Retrieve block children"
description: "List a page's or block's child blocks, paginated, through the confirmed notion_retrieve-block-children tool."
trigger_phrases:
  - "Retrieve block children"
  - "notion_retrieve-block-children"
  - "list a Notion page's child blocks"
version: 0.1.0.0
---

# Retrieve block children (`notion_retrieve-block-children`)

## 1. OVERVIEW

`notion_retrieve-block-children` lists the child blocks of a page or block — the ordered content that makes up a page body: paragraphs, headings, lists, embeds, and nested blocks. A page's top-level content is itself a list of child blocks under the page ID, so this tool doubles as "read a page's content" at the block-object level.

The Code Mode callable form is `notion["notion_retrieve-block-children"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the parent page shared with the integration in the Notion UI.

`notion_retrieve-block-children` calls `GET /v1/blocks/{block_id}/children` under API version `2025-09-03`. Inputs are `block_id` (a page ID or a block ID), plus the pagination pair `start_cursor` and `page_size`. The response returns a `results` array of block objects, `has_more`, and `next_cursor`.

**Pagination is required for completeness.** A single call may return only a page of results; a full listing needs repeated calls, feeding each response's `next_cursor` into the next call's `start_cursor`, until `has_more` is `false`. An empty `results` array (`[]`) is a valid outcome for a block with no children — never fabricate rows to fill it. For token-efficient full-page reads, `retrieve-page-markdown` (Pages domain) is usually a better fit than paging through raw block objects; use this tool when block-level structure or IDs are specifically needed (e.g. before `update-a-block` or `delete-a-block`).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes block-listing reads to the Blocks domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and pagination inputs (§5 Blocks). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/blocks/retrieve-block-children.md`](../../manual-testing-playbook/blocks/retrieve-block-children.md) | Manual playbook | Exercises a scratch-page children listing as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Blocks
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `blocks/retrieve-block-children.md`

Related references:
- [`retrieve-a-block.md`](retrieve-a-block.md) — single-block read counterpart of this listing call.
- [`append-block-children.md`](append-block-children.md) — writes new children to the same parent this tool lists.
