---
title: "OBS-006 -- Move or rename a note"
description: "This scenario validates a controlled notesmd-cli move or rename and read-back of the destination."
stage: routing
version: 0.1.0.0
---

# OBS-006 -- Move or rename a note

## 1. OVERVIEW

This scenario validates moving a throwaway note from `TEST_SOURCE` to `TEST_DESTINATION` with no running app.

### Why This Matters

Move is a filesystem mutation with possible link implications. The operator must verify both the exact source and the destination rather than assuming a successful exit code proves the result.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-006`
- Feature Name: Move or rename a note
- Scenario Objective: Move a disposable note and verify the destination is readable while the source is no longer addressed.
- Exact Prompt: `Move the throwaway note TEST_SOURCE to TEST_DESTINATION and verify the destination.`
- Exact Command Sequence: `1. notesmd-cli search "TEST_SOURCE" -> 2. notesmd-cli print "TEST_SOURCE" -> 3. notesmd-cli move "TEST_SOURCE" "TEST_DESTINATION" -> 4. notesmd-cli print "TEST_DESTINATION"`
- Expected Signals: Source resolves before mutation; move exits 0; destination prints the note; link-update behavior is recorded as `VERIFY`.
- Evidence: Pre-move search/print, move output and exit code, destination print, and source lookup result.
- Pass/Fail Criteria: PASS if only the controlled note moves and destination read-back succeeds; FAIL if the source is wrong, destination is absent, or unrelated notes change.
- Failure Triage: 1. Search and print both names. 2. Run `notesmd-cli move --help` for path rules. 3. Inspect the vault filesystem and record whether links were updated.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use a disposable note created by `OBS-003`. The current reference marks backlink-update behavior `VERIFY`.

### Prompt

`Move the throwaway note TEST_SOURCE to TEST_DESTINATION and verify the destination.`

### Commands

1. `notesmd-cli search "TEST_SOURCE"`
2. `notesmd-cli print "TEST_SOURCE"`
3. `notesmd-cli move "TEST_SOURCE" "TEST_DESTINATION"`
4. `notesmd-cli print "TEST_DESTINATION"`
5. `notesmd-cli search "TEST_SOURCE"`

### Expected

The exact source is confirmed, the move exits 0, the destination reads back, and the old source no longer resolves.

### Evidence

Capture both note paths, contents before/after, command exit codes, and any link-update observation.

### Pass / Fail

- **Pass:** only the throwaway note moves and the destination is readable.
- **Fail:** the wrong note moves, the destination is missing, or unrelated files change.

### Failure Triage

1. Reconfirm both names with `search` and `print`.
2. Read `notesmd-cli move --help` for installed path and link behavior.
3. Inspect the vault filesystem and restore the fixture manually only if the operator owns the sandbox.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-006 | Move or rename a note | Move a disposable note and verify its destination | `Move the throwaway note TEST_SOURCE to TEST_DESTINATION and verify the destination.` | 1. `notesmd-cli search "TEST_SOURCE"` -> 2. `notesmd-cli print "TEST_SOURCE"` -> 3. `notesmd-cli move "TEST_SOURCE" "TEST_DESTINATION"` -> 4. `notesmd-cli print "TEST_DESTINATION"` -> 5. `notesmd-cli search "TEST_SOURCE"` | Source confirmed; move exits 0; destination reads; source absent | Before/after output and filesystem evidence | PASS if only fixture moves; FAIL on wrong target or missing destination | Reconfirm names, read help, inspect sandbox |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| [`../../feature-catalog/cli/move-note.md`](../../feature-catalog/cli/move-note.md) | Catalog entry for move/rename |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Move command and link-update boundary |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Path and profile diagnosis |

---

## 5. SOURCE METADATA

- Group: Headless note operations
- Playbook ID: `OBS-006`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `headless-notes/move-note.md`
