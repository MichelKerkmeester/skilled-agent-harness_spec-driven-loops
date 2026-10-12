---
title: "Create a comment"
description: "Add a page-level comment or reply to an existing discussion thread through the confirmed notion_create-a-comment tool."
trigger_phrases:
  - "Create a comment"
  - "notion_create-a-comment"
  - "add a comment to a Notion page"
version: 0.1.0.0
---

# Create a comment (`notion_create-a-comment`)

## 1. OVERVIEW

`notion_create-a-comment` adds a comment to a Notion page or replies inside an existing discussion thread. It is `CMT-001`, one of the two tools in the Comments domain alongside `list-comments` (`CMT-002`) — the only comment-write tool in the 24-tool inventory.

The Code Mode callable form is `notion["notion_create-a-comment"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the target page shared with the integration in the Notion UI, with the integration's comment capability enabled.

`notion_create-a-comment` calls `POST /v1/comments` under API version `2025-09-03`. `parent` is EITHER a `page_id` (starts a new comment thread on a page) OR a `discussion_id` (replies inside an existing thread) — never both in the same call. `rich_text` carries the comment body as Notion rich-text objects. The response is the created comment object, carrying its own `id` and the `discussion_id` the comment belongs to.

There is no comment-delete tool anywhere in the 24-tool inventory — resolving or removing a comment happens in the Notion UI, not via MCP, so a scratch comment created for testing should be cleaned up by archiving its parent scratch page instead. A `restricted_resource` or 403 usually means the page was never shared with the integration, or the integration's capabilities are too narrow for comment insert — widen capabilities in the integrations dashboard and re-share the page rather than retrying blindly.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes comment writes to the Comments domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Comments). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/comments/create-a-comment.md`](../../manual-testing-playbook/comments/create-a-comment.md) | Manual playbook | Exercises a scratch-page create-comment-list-archive cycle as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Comments
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `comments/create-a-comment.md`

Related references:
- [`list-comments.md`](list-comments.md) — reads back the comment this tool creates.
