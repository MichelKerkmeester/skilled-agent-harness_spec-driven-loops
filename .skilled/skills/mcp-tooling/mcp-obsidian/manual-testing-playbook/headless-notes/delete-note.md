---
title: "OBS-007 -- Delete a note"
description: "This scenario validates destructive notesmd-cli deletion against a disposable note only."
stage: routing
version: 0.1.0.0
---

# OBS-007 -- Delete a note

## 1. OVERVIEW

This scenario validates deleting a throwaway note and confirming its absence with the headless CLI.

### Why This Matters

Delete has no documented undo in the current references. Target confirmation and an isolated fixture are mandatory.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-007`
- Feature Name: Delete a note
- Scenario Objective: Delete only `TEST_NOTE` after confirming its exact title and contents.
- Exact Prompt: `Delete the throwaway note TEST_NOTE after confirming its contents, then verify that it is gone.`
- Exact Command Sequence: `1. notesmd-cli search "TEST_NOTE" -> 2. notesmd-cli print "TEST_NOTE" -> 3. notesmd-cli delete "TEST_NOTE" -> 4. notesmd-cli search "TEST_NOTE"`
- Expected Signals: Step 1 finds the fixture; step 2 confirms it is disposable; step 3 exits 0; step 4 returns no matching note.
- Evidence: Exact note name, pre-delete contents, delete output and exit code, post-delete search.
- Pass/Fail Criteria: PASS if the disposable note is removed and no unrelated note changes; FAIL if the wrong target is selected, deletion fails, or the post-delete state is ambiguous.
- Failure Triage: 1. Stop and do not retry if the pre-delete path is ambiguous. 2. Re-run search/list against the throwaway vault. 3. Inspect the vault filesystem and restore from a known fixture only when safe.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Run only in a throwaway vault or against a note explicitly created for this scenario. This is a dedicated destructive wave.

### Prompt

`Delete the throwaway note TEST_NOTE after confirming its contents, then verify that it is gone.`

### Commands

1. `notesmd-cli search "TEST_NOTE"`
2. `notesmd-cli print "TEST_NOTE"`
3. `notesmd-cli delete "TEST_NOTE"`
4. `notesmd-cli search "TEST_NOTE"`

### Expected

The fixture is confirmed, deletion exits 0, and the final search has no matching result.

### Evidence

Capture the exact title/path, pre-delete content, exit code, and final search output.

### Pass / Fail

- **Pass:** only the disposable note is deleted and the final search is empty.
- **Fail:** the target is ambiguous, an unrelated note changes, or the final state cannot be confirmed.

### Failure Triage

1. Stop on ambiguity; do not guess a path.
2. Run `notesmd-cli list-vaults` and search the exact title.
3. Inspect the sandbox filesystem and restore only from a known fixture or backup.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-007 | Delete a note | Delete and verify a disposable note | `Delete the throwaway note TEST_NOTE after confirming its contents, then verify that it is gone.` | 1. `notesmd-cli search "TEST_NOTE"` -> 2. `notesmd-cli print "TEST_NOTE"` -> 3. `notesmd-cli delete "TEST_NOTE"` -> 4. `notesmd-cli search "TEST_NOTE"` | Target confirmed; delete exits 0; final search empty | Pre/post search, content, and exit codes | PASS if only the throwaway note is deleted; FAIL on ambiguity or unrelated change | Stop, recheck vault and fixture, restore only from safe backup |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and destructive-wave rules |
| [`../../feature-catalog/cli/delete-note.md`](../../feature-catalog/cli/delete-note.md) | Catalog entry for deletion |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Delete command and target-confirmation invariants |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Empty-result and path diagnosis |

---

## 5. SOURCE METADATA

- Group: Headless note operations
- Playbook ID: `OBS-007`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `headless-notes/delete-note.md`
