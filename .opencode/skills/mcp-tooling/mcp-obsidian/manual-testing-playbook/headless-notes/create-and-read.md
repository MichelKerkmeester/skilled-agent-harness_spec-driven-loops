---
title: "OBS-003 -- Create and read a note"
description: "This scenario validates headless note creation and read-back with notesmd-cli in a throwaway vault."
stage: routing
version: 1.0.0.0
---

# OBS-003 -- Create and read a note

## 1. OVERVIEW

This scenario validates the headless create/read workflow using a controlled note title and no running app.

### Why This Matters

The headless profile is the deterministic default for filesystem note work. A successful write must be confirmed by a real read-back rather than by the create command's exit code alone.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-003`
- Feature Name: Create and read a note
- Scenario Objective: Create `mcp-obsidian-playbook-test` and print it back from the selected vault.
- Exact Prompt: `Create a throwaway note named mcp-obsidian-playbook-test and read it back to confirm the headless write.`
- Exact Command Sequence: `1. notesmd-cli list-vaults -> 2. notesmd-cli search "mcp-obsidian-playbook-test" -> 3. notesmd-cli create "mcp-obsidian-playbook-test" -> 4. notesmd-cli print "mcp-obsidian-playbook-test"`
- Expected Signals: Step 1 identifies the selected vault; step 2 confirms the fixture is absent or the operator chooses a fresh title; step 3 exits 0; step 4 resolves the note.
- Evidence: Full command transcript, selected vault, note title, and read-back output.
- Pass/Fail Criteria: PASS if the note is created in the intended vault and `print` resolves it; FAIL if the write targets the wrong vault, the note is not readable, or the command exits non-zero.
- Failure Triage: 1. Run `notesmd-cli list-vaults`. 2. Search the exact title and inspect the vault path. 3. Run `notesmd-cli create --help` if content or duplicate behavior is unclear.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use a throwaway vault or a unique disposable note title. The exact body-content flags are not used because they remain `VERIFY`.

### Prompt

`Create a throwaway note named mcp-obsidian-playbook-test and read it back to confirm the headless write.`

### Commands

1. `notesmd-cli list-vaults`
2. `notesmd-cli search "mcp-obsidian-playbook-test"`
3. `notesmd-cli create "mcp-obsidian-playbook-test"`
4. `notesmd-cli print "mcp-obsidian-playbook-test"`

### Expected

The selected vault is known, creation exits 0, and print resolves the new note.

### Evidence

Capture the vault list, search result, create exit code, and print output.

### Pass / Fail

- **Pass:** the note exists and is readable in the intended vault.
- **Fail:** creation targets an unintended vault, print cannot resolve the note, or a command exits non-zero.

### Failure Triage

1. Confirm the default with `notesmd-cli list-vaults`.
2. Search the exact note title and inspect the actual vault path.
3. Read `notesmd-cli create --help` for the installed body-input and duplicate behavior.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-003 | Create and read a note | Create and read back a disposable note | `Create a throwaway note named mcp-obsidian-playbook-test and read it back to confirm the headless write.` | 1. `notesmd-cli list-vaults` -> 2. `notesmd-cli search "mcp-obsidian-playbook-test"` -> 3. `notesmd-cli create "mcp-obsidian-playbook-test"` -> 4. `notesmd-cli print "mcp-obsidian-playbook-test"` | Known vault; create exits 0; print resolves note | CLI transcript and read-back output | PASS if the intended vault contains a readable note; FAIL otherwise | Recheck vault, title, and installed create help |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| [`../../feature-catalog/notesmd-cli-create/create-note.md`](../../feature-catalog/notesmd-cli-create/create-note.md) | Catalog entry for headless creation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Create and print commands |
| [`../../examples/headless-notes-workflow.sh`](../../examples/headless-notes-workflow.sh) | Search-before-create and read-back reference |

---

## 5. SOURCE METADATA

- Group: Headless note operations
- Playbook ID: `OBS-003`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `headless-notes/create-and-read.md`
