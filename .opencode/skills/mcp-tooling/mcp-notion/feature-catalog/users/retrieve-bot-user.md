---
title: "Retrieve your bot user"
description: "Read the calling integration's own bot identity - the owner of NOTION_TOKEN - through the confirmed notion_retrieve-bot-user tool."
trigger_phrases:
  - "Retrieve your bot user"
  - "notion_retrieve-bot-user"
  - "check the Notion integration identity"
version: 0.1.0.0
---

# Retrieve your bot user (`notion_retrieve-bot-user`)

## 1. OVERVIEW

`notion_retrieve-bot-user` reads the integration's own bot user object — the identity behind the active `NOTION_TOKEN`. It is `USR-003`, the only Users-domain tool that takes no input.

This tool is the **connectivity and auth preflight for the entire mcp-notion mode**, and the **critical-path gate every other scenario in this mode depends on**: a successful call proves the token is valid and the manual is reachable before any page, block, data-source, comment, user, or search call is attempted. If this call fails, every other tool in the 24-tool inventory should be treated as blocked rather than tested independently.

The Code Mode callable form is `notion["notion_retrieve-bot-user"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json` and `NOTION_TOKEN` set — nothing else. No page or database sharing is required, since this tool reads the integration's own identity, not workspace content, which is exactly why it doubles as the mode's cheapest and safest preflight call.

`notion_retrieve-bot-user` calls `GET /v1/users/me` under API version `2025-09-03` with no input. The response is a `bot` type user object carrying `bot.owner` (a workspace or user owner) and `bot.workspace_name`, alongside the standard user fields (`id`, `type`, `name`).

A 401 here means `NOTION_TOKEN` is missing or invalid — resolve that before attempting any other tool in any domain. Because this call needs no sharing state and no target ID, run it first whenever validating the mode end to end: it is the single cheapest signal that the whole Notion integration is reachable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes connectivity/auth preflight checks to the Users domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and no-input contract (§5 Users). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/users/retrieve-bot-user.md`](../../manual-testing-playbook/users/retrieve-bot-user.md) | Manual playbook | Runs the no-input connectivity preflight as the critical-path gate for the mode's other scenarios. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Users
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `users/retrieve-bot-user.md`

Related references:
- [`list-all-users.md`](list-all-users.md) — the bot user always appears as one row in this tool's results.
- [`retrieve-a-user.md`](retrieve-a-user.md) — accepts this tool's returned `id` as a valid `user_id` input.
