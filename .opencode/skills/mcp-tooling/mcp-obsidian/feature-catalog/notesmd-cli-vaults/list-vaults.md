---
title: "List vaults"
description: "List registered notesmd-cli vaults and identify the configured default."
trigger_phrases:
  - "List vaults"
  - "notesmd-cli list-vaults"
  - "show registered Obsidian vaults"
version: 1.0.0.0
---

# List vaults (`notesmd-cli list-vaults`)

## 1. OVERVIEW

`notesmd-cli list-vaults` lists the vaults registered in the headless CLI configuration and shows which one is default.

It is the required preflight before note writes because the command identifies the filesystem target without relying on an unstated default.

---

## 2. HOW IT WORKS

The operator runs the command and records the registered names and default marker. If no vault is registered, the next safe action is `add-vault <path>` followed by `set-default-vault <name>`.

The command needs no running app and reads local CLI configuration stored at `~/.config/obsidian/obsidian.json`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`SKILL.md`](../../SKILL.md) | Shared | Makes vault discovery a precondition for note operations. |
| [`references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Shared | Defines the registered-vault inventory and config path. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/headless-vaults/vault-preflight.md`](../../manual-testing-playbook/headless-vaults/vault-preflight.md) | Manual playbook | Captures the actual registered vault and default selection. |
| [`../../examples/headless-notes-workflow.sh`](../../examples/headless-notes-workflow.sh) | Reference | Runs `list-vaults` before headless note work. |

---

## 4. SOURCE METADATA

- Group: notesmd-cli vaults
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `notesmd-cli-vaults/list-vaults.md`

Related references:
- [`set-default-vault.md`](set-default-vault.md) — changes the selected default.
- [`add-vault.md`](add-vault.md) — registers a missing vault.
