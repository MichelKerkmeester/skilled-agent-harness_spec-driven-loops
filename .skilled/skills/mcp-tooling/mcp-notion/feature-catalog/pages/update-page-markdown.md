---
title: "Update page via Markdown"
description: "Edit a Notion page's block content via Markdown — full replace or find-and-replace — through the confirmed notion_update-page-markdown MCP tool."
trigger_phrases:
  - "Update page via Markdown"
  - "notion_update-page-markdown"
  - "edit a Notion page with Markdown"
version: 0.1.0.0
---

# Update page via Markdown (`notion_update-page-markdown`)

## 1. OVERVIEW

`notion_update-page-markdown` writes Markdown content into a page's blocks, in one of two modes: `replace_content` for a full-page replace, or `update_content` for a targeted find-and-replace against existing content.

Code Mode callable: `notion["notion_update-page-markdown"]`. VERIFY the callable and schema with `list_tools()` / `tool_info("notion.notion_update-page-markdown")` before hardcoding.

---

## 2. HOW IT WORKS

Needs the registered `notion` manual, `NOTION_TOKEN`, and the target page shared with the integration. Runs under `PATCH /v1/pages/{page_id}/markdown` and **requires API version `2026-03-11`**, matching `notion_retrieve-page-markdown`; a call pinned to `2025-09-03` fails.

Behavior note: `replace_content` discards the page's existing block content, so a find-and-replace intent should use `update_content` instead of a full replace. Pair with `notion_retrieve-page-markdown` before writing to confirm current content, and again afterward to confirm the write landed as expected — do not assume success from the write call's return alone without a follow-up read on a scratch page.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | States the markdown round-trip tools' API-version requirement. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, `replace_content`/`update_content` inputs, and the `2026-03-11` version pin. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/pages/update-page-markdown.md`](../../manual-testing-playbook/pages/update-page-markdown.md) | Manual playbook | Creates a scratch page, writes Markdown content, reads it back, and archives as cleanup. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern used by this scenario. |

---

## 4. SOURCE METADATA

- Group: Pages
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `pages/update-page-markdown.md`

Related references:
- [`retrieve-page-markdown.md`](retrieve-page-markdown.md) — read counterpart of the Markdown round trip.
- [`create-a-page.md`](create-a-page.md) — creates the scratch page this tool edits.
