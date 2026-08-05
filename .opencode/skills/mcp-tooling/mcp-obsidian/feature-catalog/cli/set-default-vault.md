---
title: "Set the default vault"
description: "Select the registered vault used by notesmd-cli when no vault is named."
trigger_phrases:
  - "Set the default vault"
  - "notesmd-cli set-default-vault"
  - "choose the active Obsidian vault"
version: 0.1.0.0
---

# Set the default vault (`notesmd-cli set-default-vault`)

## 1. OVERVIEW

`notesmd-cli set-default-vault <name>` selects the registered vault used by subsequent commands that omit an explicit vault.

The default is stored in the CLI's local Obsidian configuration and applies to the headless filesystem surface.

---

## 2. HOW IT WORKS

The operator runs `list-vaults`, selects an existing registered name, sets it as default, and runs `list-vaults` again to verify the selection. The command does not require the Obsidian app.

A failed selection should be treated as a configuration error rather than a reason to guess a vault path. Add the vault first if the intended name is not registered.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Requires explicit vault confirmation before writes. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines default-vault selection and config storage. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-vaults/vault-preflight.md`](../../manual-testing-playbook/headless-vaults/vault-preflight.md) | Manual playbook | Sets and verifies a real registered default. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Diagnoses no-default-vault failures. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli vaults
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/set-default-vault.md`

Related references:
- [`list-vaults.md`](list-vaults.md) — observes the current default.
- [`remove-vault.md`](remove-vault.md) — unregisters a controlled vault.
