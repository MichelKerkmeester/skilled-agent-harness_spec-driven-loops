---
title: "Update a block"
description: "Edit a block's type-specific content or archive it through the confirmed notion_update-a-block tool."
trigger_phrases:
  - "Update a block"
  - "notion_update-a-block"
  - "edit a Notion block's content"
version: 0.1.0.0
---

# Update a block (`notion_update-a-block`)

## 1. OVERVIEW

`notion_update-a-block` edits an existing block's content, or moves it to trash by setting `archived: true`. It is the block-level counterpart to `update-page-properties`: one block ID, a type-specific payload, in place.

The Code Mode callable form is `notion["notion_update-a-block"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the block's parent page shared with the integration in the Notion UI with update capability.

`notion_update-a-block` calls `PATCH /v1/blocks/{block_id}` under API version `2025-09-03`. The required input is `block_id`; the payload is **block-type-specific** — a paragraph block takes a `paragraph.rich_text` field, a heading block takes `heading_2.rich_text`, and so on, matching the block's existing `type`. The optional `archived: true` field moves the block to trash instead of editing its content.

Because the payload shape depends on the target block's type, confirm the block's current `type` (via `retrieve-a-block`, `BLK-001`) before composing an update, rather than guessing the field name. `archived: true` mirrors the page-level archive model: reversible, not a hard delete — `archived: false` restores it. A 404/`restricted_resource` error usually means the block's page was never shared with the integration.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes block-level edits to the Blocks domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and type-specific payload note (§5 Blocks). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/blocks/update-a-block.md`](../../manual-testing-playbook/blocks/update-a-block.md) | Manual playbook | Exercises a scratch-page block edit, then reversible cleanup, as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Blocks
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `blocks/update-a-block.md`

Related references:
- [`retrieve-a-block.md`](retrieve-a-block.md) — confirms the block's current `type` before an update.
- [`delete-a-block.md`](delete-a-block.md) — the dedicated trash shortcut for the same reversible model.
