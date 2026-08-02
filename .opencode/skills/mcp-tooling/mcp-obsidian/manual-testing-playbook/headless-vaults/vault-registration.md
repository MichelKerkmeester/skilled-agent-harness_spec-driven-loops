---
title: "OBS-002 -- Vault registration lifecycle"
description: "This scenario validates controlled add-vault and remove-vault operations without a running Obsidian app."
stage: routing
version: 1.0.0.0
---

# OBS-002 -- Vault registration lifecycle

## 1. OVERVIEW

This scenario validates registration and removal of one operator-owned throwaway vault in the local notesmd-cli configuration.

### Why This Matters

Vault registration is the boundary between a filesystem path and the named target used by later headless commands. The test must not confuse unregistering a vault with deleting its files.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-002`
- Feature Name: Vault registration lifecycle
- Scenario Objective: Register `TEST_VAULT_PATH`, verify its name, and remove only that registration.
- Exact Prompt: `Register my throwaway vault for headless Obsidian work, verify it appears, then remove only that registration.`
- Exact Command Sequence: `1. notesmd-cli add-vault "TEST_VAULT_PATH" --name "mcp-obsidian-playbook-test" (VERIFY --name) -> 2. notesmd-cli list-vaults -> 3. notesmd-cli remove-vault "mcp-obsidian-playbook-test"`
- Expected Signals: Step 1 exits 0 or local help identifies the supported naming form; step 2 lists the controlled registration; step 3 exits 0 and leaves the vault directory intact.
- Evidence: Registration output, listing output, removal output, and a filesystem check that `TEST_VAULT_PATH` still exists.
- Pass/Fail Criteria: PASS if the controlled registration is added and removed without deleting the vault directory; FAIL if another registration is changed, the path is removed, or the command surface contradicts the documented behavior.
- Failure Triage: 1. Run `notesmd-cli add-vault --help` and record whether `--name` is supported. 2. List vaults and copy the exact emitted name. 3. If the name form is unsupported, repeat with the name reported by the CLI or mark SKIP with the syntax blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use a disposable vault path. Do not pass a production vault path to the mutation commands.

### Prompt

`Register my throwaway vault for headless Obsidian work, verify it appears, then remove only that registration.`

### Commands

1. `notesmd-cli add-vault "TEST_VAULT_PATH" --name "mcp-obsidian-playbook-test"` — the `--name` flag is `VERIFY`.
2. `notesmd-cli list-vaults`
3. `notesmd-cli remove-vault "mcp-obsidian-playbook-test"`
4. `test -d "TEST_VAULT_PATH"`

### Expected

The controlled registration appears, removal exits 0, and the vault directory still exists.

### Evidence

Capture the exact name emitted by `list-vaults` and the final filesystem check.

### Pass / Fail

- **Pass:** only the controlled registration changes and the vault directory remains intact.
- **Fail:** the path is deleted, another vault is modified, or the installed CLI rejects the documented form without a recorded syntax result.

### Failure Triage

1. Read `notesmd-cli add-vault --help` and `notesmd-cli remove-vault --help`.
2. Re-run `notesmd-cli list-vaults` and compare the exact name.
3. Check the vault path directly and restore only the local registration with `add-vault` if needed.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-002 | Vault registration lifecycle | Register and remove one controlled vault registration | `Register my throwaway vault for headless Obsidian work, verify it appears, then remove only that registration.` | 1. `notesmd-cli add-vault "TEST_VAULT_PATH" --name "mcp-obsidian-playbook-test"` (VERIFY `--name`) -> 2. `notesmd-cli list-vaults` -> 3. `notesmd-cli remove-vault "mcp-obsidian-playbook-test"` -> 4. `test -d "TEST_VAULT_PATH"` | Registration appears; removal exits 0; directory remains | CLI transcript plus filesystem check | PASS if only local registration changes; FAIL if files are deleted or syntax is unverified | Read command help, recheck exact name, restore registration only |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| [`../../feature-catalog/notesmd-cli-vaults/add-vault.md`](../../feature-catalog/notesmd-cli-vaults/add-vault.md) | Catalog entry for registration |
| [`../../feature-catalog/notesmd-cli-vaults/remove-vault.md`](../../feature-catalog/notesmd-cli-vaults/remove-vault.md) | Catalog entry for removal |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Vault command reference and `VERIFY` flag boundary |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Configuration and PATH recovery |

---

## 5. SOURCE METADATA

- Group: Headless vault setup
- Playbook ID: `OBS-002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `headless-vaults/vault-registration.md`
