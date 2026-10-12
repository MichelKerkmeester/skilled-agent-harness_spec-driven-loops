---
title: "Archive a page"
description: "Move a Notion page to trash — a reversible soft delete — through the confirmed notion_archive-a-page MCP tool."
trigger_phrases:
  - "Archive a page"
  - "notion_archive-a-page"
  - "move a Notion page to trash"
version: 0.1.0.0
---

# Archive a page (`notion_archive-a-page`)

## 1. OVERVIEW

`notion_archive-a-page` moves a page to trash by setting `archived: true` (a `PATCH` on `page_id`). This is Notion's only delete lifecycle for a page — there is no hard-delete endpoint, so archiving is always reversible from the Notion UI or a follow-up `notion_update-page-properties` call with `archived: false`.

Code Mode callable: `notion["notion_archive-a-page"]`. VERIFY the callable and schema with `list_tools()` / `tool_info("notion.notion_archive-a-page")` before hardcoding.

---

## 2. HOW IT WORKS

Needs the registered `notion` manual, `NOTION_TOKEN`, and the target page shared with the integration. Runs under API `2025-09-03` against `PATCH /v1/pages/{page_id}` with `archived: true`.

Behavior note: this is the standard scratch-cleanup step for every mutating playbook scenario in this category — a scenario that creates a scratch page always archives it afterward rather than leaving orphaned content in the workspace. Because there is no hard delete, a "cleanup" claim is only true once archival is confirmed by a follow-up `notion_retrieve-a-page` read showing `archived: true` (or equivalent `in_trash` state), not merely by the archive call returning without error.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | States the no-hard-delete, reversible-trash model. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, and payload shape. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/pages/archive-a-page.md`](../../manual-testing-playbook/pages/archive-a-page.md) | Manual playbook | Creates a scratch page and archives it, confirming reversible trash state. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern used by this scenario. |

---

## 4. SOURCE METADATA

- Group: Pages
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `pages/archive-a-page.md`

Related references:
- [`create-a-page.md`](create-a-page.md) — creates the scratch page this tool archives.
- [`move-page.md`](move-page.md) — the other page-lifecycle mutation covered by this category.
