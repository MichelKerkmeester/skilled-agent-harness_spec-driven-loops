---
title: "Move a page"
description: "Move a Notion page to a different parent page or data source through the confirmed notion_move-page MCP tool."
trigger_phrases:
  - "Move a page"
  - "notion_move-page"
  - "move a Notion page to a new parent"
version: 0.1.0.0
---

# Move a page (`notion_move-page`)

## 1. OVERVIEW

`notion_move-page` relocates an existing page to a new parent — either another page (`page_id`) or a data source (`data_source_id`) — without recreating its content or properties.

Code Mode callable: `notion["notion_move-page"]`. VERIFY the callable and schema with `list_tools()` / `tool_info("notion.notion_move-page")` before hardcoding.

---

## 2. HOW IT WORKS

Needs the registered `notion` manual, `NOTION_TOKEN`, and both the page and the destination parent shared with the integration. Runs under API `2025-09-03` against `POST /v1/pages/{page_id}/move`.

Behavior note: moving a page into a data source may require its properties to satisfy the destination schema (see `../../references/property-types.md`); moving between two plain pages carries no schema constraint. A move does not create a new page ID — the same `page_id` persists under the new parent, so a post-move `notion_retrieve-a-page` read is the way to confirm the parent changed, not a diff of IDs.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes page-reorganization requests to the MCP. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, and parent shape. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/pages/move-page.md`](../../manual-testing-playbook/pages/move-page.md) | Manual playbook | Creates a scratch page, moves it to a second scratch parent, and archives it as cleanup. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern used by this scenario. |

---

## 4. SOURCE METADATA

- Group: Pages
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `pages/move-page.md`

Related references:
- [`create-a-page.md`](create-a-page.md) — creates the scratch page this tool relocates.
- [`archive-a-page.md`](archive-a-page.md) — cleanup step run after the move.
