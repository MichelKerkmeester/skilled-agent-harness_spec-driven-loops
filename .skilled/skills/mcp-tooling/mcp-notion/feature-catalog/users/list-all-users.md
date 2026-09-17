---
title: "List all users"
description: "Enumerate every user in the connected Notion workspace, paginated, through the confirmed notion_list-all-users tool."
trigger_phrases:
  - "List all users"
  - "notion_list-all-users"
  - "list Notion workspace users"
version: 0.1.0.0
---

# List all users (`notion_list-all-users`)

## 1. OVERVIEW

`notion_list-all-users` enumerates the workspace's users — both `person` and `bot` type objects — paginated. It is `USR-001`, the broadest of the three Users-domain tools alongside `retrieve-a-user` (`USR-002`) and `retrieve-bot-user` (`USR-003`).

The Code Mode callable form is `notion["notion_list-all-users"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json` and `NOTION_TOKEN` set. Unlike page/block tools, no content-sharing step is required — user listing is scoped to the workspace, not to a shared page.

`notion_list-all-users` calls `GET /v1/users` under API version `2025-09-03`. `start_cursor` and `page_size` paginate the result; a full listing may need repeated calls following the returned `next_cursor` until `has_more` is `false`.

The response mixes `person` and `bot` type user objects in one array. An integration whose capabilities do not include "Read user information including email addresses" still receives user rows, but with narrowed fields (no email) rather than a 403 — check the integration's capabilities in the dashboard before concluding a missing field is a bug. Because the calling integration is always itself a member of the workspace, a real workspace should never return a fully empty array; an empty result here is unlikely, unlike the comment and search read tools, and should prompt re-checking the token rather than being treated as routine.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes user-directory reads to the Users domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Users). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/users/list-all-users.md`](../../manual-testing-playbook/users/list-all-users.md) | Manual playbook | Exercises a read-only paginated user listing as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Users
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `users/list-all-users.md`

Related references:
- [`retrieve-a-user.md`](retrieve-a-user.md) — targeted single-user read, typically sourced from this tool's results.
- [`retrieve-bot-user.md`](retrieve-bot-user.md) — the integration's own identity, always present in this tool's results.
