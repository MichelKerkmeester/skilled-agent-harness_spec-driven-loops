---
title: "Add a vault"
description: "Register an operator-owned vault path with notesmd-cli."
trigger_phrases:
  - "Add a vault"
  - "notesmd-cli add-vault"
  - "register an Obsidian vault"
version: 0.1.0.0
---

# Add a vault (`notesmd-cli add-vault`)

## 1. OVERVIEW

`notesmd-cli add-vault <path>` registers a vault for the headless CLI.

Registrations are stored in `~/.config/obsidian/obsidian.json`. An explicit `--name <name>` form is documented with a `VERIFY` marker, so confirm it before using a named registration.

---

## 2. HOW IT WORKS

The operator supplies a filesystem path to an existing vault. The CLI records the registration, after which `list-vaults` exposes it and `set-default-vault` can select it for commands without a vault argument.

The playbook uses an operator-owned fixture or an existing non-production vault. Registration changes local CLI configuration and does not require the Obsidian app.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Requires vault registration and confirmation before note operations. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines registration commands and config storage. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-vaults/vault-registration.md`](../../manual-testing-playbook/headless-vaults/vault-registration.md) | Manual playbook | Registers and removes a controlled vault fixture. |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Reference | Diagnoses missing CLI and PATH failures. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli vaults
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cli/add-vault.md`

Related references:
- [`list-vaults.md`](list-vaults.md) — confirms registration state.
- [`set-default-vault.md`](set-default-vault.md) — selects the active vault.
