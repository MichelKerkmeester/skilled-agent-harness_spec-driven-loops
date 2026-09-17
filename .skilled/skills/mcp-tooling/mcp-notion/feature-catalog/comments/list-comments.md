---
title: "List comments"
description: "List the unresolved comments on a Notion page or block through the confirmed notion_list-comments tool."
trigger_phrases:
  - "List comments"
  - "notion_list-comments"
  - "read Notion page comments"
version: 0.1.0.0
---

# List comments (`notion_list-comments`)

## 1. OVERVIEW

`notion_list-comments` lists the unresolved comments attached to a page or block, paginated. It is `CMT-002`, the read counterpart to `create-a-comment` (`CMT-001`) in the two-tool Comments domain.

The Code Mode callable form is `notion["notion_list-comments"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set, and the target page or block shared with the integration in the Notion UI.

`notion_list-comments` calls `GET /v1/comments` under API version `2025-09-03`. `block_id` accepts either a page ID or a block ID (a page is itself a block for this purpose). `start_cursor` pages through results when more than one page of comments exists — matching the pagination pattern used by `retrieve-block-children` and `list-all-users`.

Only **unresolved** comments are returned — resolved or closed discussion threads are excluded, so an empty results array is a valid outcome once every thread on a page has been resolved, and must never be read as "the read failed" or padded with fabricated rows. Comments are listed top-level per the given `block_id`; whether replies within a discussion thread are separately paginated by this same call is not documented in the tool table — confirm the exact nesting shape with `tool_info()` before parsing a response programmatically.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes comment reads to the Comments domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Comments). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/comments/list-comments.md`](../../manual-testing-playbook/comments/list-comments.md) | Manual playbook | Exercises a read-only comment listing against a known shared page as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Comments
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `comments/list-comments.md`

Related references:
- [`create-a-comment.md`](create-a-comment.md) — writes the comments this tool lists.
