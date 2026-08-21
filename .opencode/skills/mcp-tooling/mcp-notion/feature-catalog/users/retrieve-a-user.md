---
title: "Retrieve a user"
description: "Read a single Notion workspace user by ID through the confirmed notion_retrieve-a-user tool."
trigger_phrases:
  - "Retrieve a user"
  - "notion_retrieve-a-user"
  - "look up a Notion user by ID"
version: 0.1.0.0
---

# Retrieve a user (`notion_retrieve-a-user`)

## 1. OVERVIEW

`notion_retrieve-a-user` reads one user object by `user_id`. It is `USR-002`, the targeted counterpart to `list-all-users` (`USR-001`) in the three-tool Users domain.

The Code Mode callable form is `notion["notion_retrieve-a-user"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set, and a specific `user_id` already in hand — this tool has no discovery path of its own.

`notion_retrieve-a-user` calls `GET /v1/users/{user_id}` under API version `2025-09-03`. The only input is `user_id`; the response is a single `person` or `bot` type user object, matching the row shape returned by `list-all-users`.

Because this tool takes an opaque ID and nothing else, a valid `user_id` must always be sourced first — typically from `list-all-users` (§USR-001) or from `retrieve-bot-user` (§USR-003) when the target is the integration's own identity — never fabricated or guessed. A 404 means the ID does not exist or is not visible to the calling integration, matching the same "not shared" semantics as page/block 404s; user-read capability affects whether email/detail fields populate, matching `list-all-users`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes targeted user reads to the Users domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Users). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/users/retrieve-a-user.md`](../../manual-testing-playbook/users/retrieve-a-user.md) | Manual playbook | Exercises a targeted user read sourced from `list-all-users`, SKIP-able when no user ID is discoverable. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Users
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `users/retrieve-a-user.md`

Related references:
- [`list-all-users.md`](list-all-users.md) — the usual source of the `user_id` this tool requires.
- [`retrieve-bot-user.md`](retrieve-bot-user.md) — the no-input alternative when the target is the integration's own identity.
