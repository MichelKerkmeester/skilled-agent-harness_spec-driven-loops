---
title: "Retrieve a block"
description: "Read a single Notion block object by ID through the confirmed notion_retrieve-a-block tool."
trigger_phrases:
  - "Retrieve a block"
  - "notion_retrieve-a-block"
  - "read a single Notion block by ID"
version: 0.1.0.0
---

# Retrieve a block (`notion_retrieve-a-block`)

## 1. OVERVIEW

`notion_retrieve-a-block` reads one Notion block object — a paragraph, heading, list item, or embed — by its `block_id`. It is the block-level counterpart to `retrieve-a-page`: one ID in, one block object out, with no children expansion.

The Code Mode callable form is `notion["notion_retrieve-a-block"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the block's parent page shared with the integration in the Notion UI.

`notion_retrieve-a-block` calls `GET /v1/blocks/{block_id}` under API version `2025-09-03`, the pin shared by every non-markdown tool. The only required input is `block_id`; the response is a single block object carrying its `type`, the type-specific payload (e.g. `paragraph.rich_text`), and metadata such as `has_children` and `archived`.

`has_children: true` means the block has nested content that this call does not return — follow up with `retrieve-block-children` (`BLK-002`) against the same `block_id` to read them. A `restricted_resource` or 404-style error usually means the block's page was never shared with the integration, not that the block does not exist; re-share the page in the Notion UI and retry rather than fabricating a block object.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes block-level reads to the Blocks domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Blocks). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/blocks/retrieve-a-block.md`](../../manual-testing-playbook/blocks/retrieve-a-block.md) | Manual playbook | Exercises a scratch-page block read as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Blocks
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `blocks/retrieve-a-block.md`

Related references:
- [`retrieve-block-children.md`](retrieve-block-children.md) — paginated listing of a block's or page's children.
- [`update-a-block.md`](update-a-block.md) — mutates the same block object this tool reads.
