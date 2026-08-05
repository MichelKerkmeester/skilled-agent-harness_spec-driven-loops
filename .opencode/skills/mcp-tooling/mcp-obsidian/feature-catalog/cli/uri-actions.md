---
title: "Trigger URI actions"
description: "Document the official CLI's app/plugin URI-action boundary without asserting unconfirmed command syntax."
trigger_phrases:
  - "Trigger URI actions"
  - "obsidian:// URI action"
  - "open an Obsidian plugin action"
version: 0.1.0.0
---

# Trigger URI actions (`obsidian://`)

## 1. OVERVIEW

The official app-backed CLI is documented as the live surface for `obsidian://` URI actions and app/plugin actions. The exact CLI bridge and supported action set are not confirmed in the current reference.

This entry records the current boundary, not a guaranteed command recipe. Use `obsidian --help` and the target app/plugin documentation before executing an action.

---

## 2. HOW IT WORKS

When the requested result depends on an in-app command, plugin action, or UI focus, the operator keeps the action on the official `obsidian` surface. A URI may be the bridge, but the installed CLI's accepted syntax and plugin-specific behavior must be verified locally.

The headless CLI can edit the underlying files but cannot invoke command-palette actions or ribbon icons. The cyanheads MCP is likewise a structured note surface, not a general UI automation bridge.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Distinguishes app-only actions from filesystem and REST-backed note work. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Records URI actions as a `VERIFY` app-backed capability. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/official-cli/open-app-action.md`](../../manual-testing-playbook/official-cli/open-app-action.md) | Manual playbook | Confirms the local CLI help and captures any operator-approved URI action. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Routes app-only failures and PATH mismatches. |

---

## 4. SOURCE METADATA

- Group: official obsidian CLI app actions
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/uri-actions.md`

Related references:
- [`open-note-or-vault.md`](open-note-or-vault.md) — primary live-app action.
- [`../../references/plugins/obsidian42-brat/obsidian42-brat.md`](../../references/plugins/obsidian42-brat/obsidian42-brat.md) — plugin installation context; command invocation remains app-only.
