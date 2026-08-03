---
title: "Remove a vault"
description: "Unregister a named vault from the notesmd-cli local configuration."
trigger_phrases:
  - "Remove a vault"
  - "notesmd-cli remove-vault"
  - "unregister an Obsidian vault"
version: 1.0.0.0
---

# Remove a vault (`notesmd-cli remove-vault`)

## 1. OVERVIEW

`notesmd-cli remove-vault <name>` unregisters a named vault from the headless CLI configuration.

This removes the CLI registration, not the vault directory itself. It is still a configuration mutation and should be run only after confirming the exact name.

---

## 2. HOW IT WORKS

The operator lists registered vaults, identifies a controlled name, removes that registration, and lists again to confirm it is absent. The vault's files are not described as deleted by this command.

The command operates locally and does not need a running app. Re-registering the same path with `add-vault` is the documented recovery path if the wrong registration is removed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Keeps vault selection explicit before file operations. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines the unregister command and local config boundary. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-vaults/vault-registration.md`](../../manual-testing-playbook/headless-vaults/vault-registration.md) | Manual playbook | Verifies removal and re-registration of a controlled fixture. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Covers configuration and PATH diagnostics. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli vaults
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/remove-vault.md`

Related references:
- [`list-vaults.md`](list-vaults.md) — verifies the registration list.
- [`add-vault.md`](add-vault.md) — restores a removed registration.
