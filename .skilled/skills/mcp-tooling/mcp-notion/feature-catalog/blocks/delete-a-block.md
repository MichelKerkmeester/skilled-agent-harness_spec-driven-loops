---
title: "Delete a block"
description: "Move a block to trash through the confirmed notion_delete-a-block tool, mirroring the page archive model."
trigger_phrases:
  - "Delete a block"
  - "notion_delete-a-block"
  - "trash a Notion block"
version: 0.1.0.0
---

# Delete a block (`notion_delete-a-block`)

## 1. OVERVIEW

`notion_delete-a-block` moves a single block to trash by ID. Despite the name, it is a **reversible soft delete** — Notion has no hard-delete endpoint for blocks, matching the page-level `archive-a-page` model.

The Code Mode callable form is `notion["notion_delete-a-block"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the block's parent page shared with the integration in the Notion UI with update capability.

`notion_delete-a-block` calls `DELETE /v1/blocks/{block_id}` under API version `2025-09-03`. The only input is `block_id`; the response returns the now-archived block object with `archived: true`.

This is functionally equivalent to calling `update-a-block` (`BLK-004`) with `archived: true`, exposed as its own dedicated endpoint. Because it is reversible trash, not permanent removal, a scratch-safe scenario can restore a block afterward by calling `update-a-block` with `archived: false` — or simply rely on archiving the whole scratch parent page as cleanup, since Notion trash retains the block tree underneath it. Treat "deleted" in this tool's name as "trashed," never as "gone."

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes block trash operations to the Blocks domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and the no-hard-delete note (§5 Blocks). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/blocks/delete-a-block.md`](../../manual-testing-playbook/blocks/delete-a-block.md) | Manual playbook | Exercises a scratch-page block trash, then reversible cleanup, as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the scratch-safe archive pattern (§3.5) this tool mirrors at block level. |

---

## 4. SOURCE METADATA

- Group: Blocks
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `blocks/delete-a-block.md`

Related references:
- [`update-a-block.md`](update-a-block.md) — the general-purpose tool this delete shortcut mirrors.
- [`append-block-children.md`](append-block-children.md) — creates the block a scenario later trashes with this tool.
