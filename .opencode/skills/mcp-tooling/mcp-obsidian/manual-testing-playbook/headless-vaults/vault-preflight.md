---
title: "OBS-001 -- Vault preflight and default selection"
description: "This scenario validates the notesmd-cli vault preflight and explicit default selection before headless note work."
stage: routing
version: 1.0.0.0
---

# OBS-001 -- Vault preflight and default selection

## 1. OVERVIEW

This scenario validates `notesmd-cli list-vaults` and `notesmd-cli set-default-vault` before any note mutation.

### Why This Matters

The mode must know which filesystem vault it will touch. The preflight prevents an agent from silently writing to an unintended default.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-001`
- Feature Name: Vault preflight and default selection
- Scenario Objective: Verify that the operator-owned `TEST_VAULT` is registered and becomes the explicit default.
- Exact Prompt: `Before changing any notes, confirm my registered vaults and set TEST_VAULT as the default.`
- Exact Command Sequence: `1. notesmd-cli list-vaults -> 2. notesmd-cli set-default-vault "TEST_VAULT" -> 3. notesmd-cli list-vaults`
- Expected Signals: Step 1 lists registered vaults; step 2 exits 0; step 3 marks `TEST_VAULT` as default.
- Evidence: Full output and exit codes for all three commands, with the selected vault name visible.
- Pass/Fail Criteria: PASS if `TEST_VAULT` is listed and marked default after step 3; FAIL if it is absent, selection fails, or another vault remains default.
- Failure Triage: 1. Run `notesmd-cli --help` and `notesmd-cli list-vaults`. 2. Confirm the exact registered name and inspect `~/.config/obsidian/obsidian.json`. 3. If no vault exists, use the registration scenario before retrying.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Identify an operator-owned `TEST_VAULT` from the first command.
2. Set only that registered name as default.
3. Re-run the listing and capture the default marker.

### Prompt

`Before changing any notes, confirm my registered vaults and set TEST_VAULT as the default.`

### Commands

1. `notesmd-cli list-vaults`
2. `notesmd-cli set-default-vault "TEST_VAULT"`
3. `notesmd-cli list-vaults`

### Expected

Step 1 lists vaults; step 2 exits 0; step 3 shows `TEST_VAULT` as the default.

### Evidence

Capture the three command outputs, exit codes, and the exact selected vault name.

### Pass / Fail

- **Pass:** `TEST_VAULT` is registered and is the default after step 3.
- **Fail:** the name is not registered, selection exits non-zero, or a different vault is default.

### Failure Triage

1. Re-run `notesmd-cli list-vaults` and compare the exact name, including case and spacing.
2. Confirm the CLI config exists at `~/.config/obsidian/obsidian.json`.
3. Route to `vault-registration.md` if the fixture is not registered.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-001 | Vault preflight and default selection | Verify `TEST_VAULT` is registered and selected as default | `Before changing any notes, confirm my registered vaults and set TEST_VAULT as the default.` | 1. `notesmd-cli list-vaults` -> 2. `notesmd-cli set-default-vault "TEST_VAULT"` -> 3. `notesmd-cli list-vaults` | Step 1 lists vaults; step 2 exits 0; step 3 marks `TEST_VAULT` default | Full output and exit codes | PASS if the named vault is default; FAIL if missing or another vault remains default | Recheck exact name, config path, then run the registration scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| [`../../feature-catalog/notesmd-cli-vaults/list-vaults.md`](../../feature-catalog/notesmd-cli-vaults/list-vaults.md) | Catalog entry for vault discovery |
| [`../../feature-catalog/notesmd-cli-vaults/set-default-vault.md`](../../feature-catalog/notesmd-cli-vaults/set-default-vault.md) | Catalog entry for default selection |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Confirmed vault commands and config path |
| [`../../examples/headless-notes-workflow.sh`](../../examples/headless-notes-workflow.sh) | Headless preflight pattern |

---

## 5. SOURCE METADATA

- Group: Headless vault setup
- Playbook ID: `OBS-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `headless-vaults/vault-preflight.md`
