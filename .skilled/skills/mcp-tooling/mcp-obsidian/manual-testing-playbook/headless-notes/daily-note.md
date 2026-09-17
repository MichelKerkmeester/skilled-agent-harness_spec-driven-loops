---
title: "OBS-005 -- Open the daily note"
description: "This scenario validates the headless notesmd-cli daily-note command without requiring Obsidian to run."
stage: routing
version: 0.1.0.0
---

# OBS-005 -- Open the daily note

## 1. OVERVIEW

This scenario validates `notesmd-cli daily` against an operator-owned vault.

### Why This Matters

Daily capture is a core headless workflow. It must remain usable on a server or in CI even when the desktop app is closed.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-005`
- Feature Name: Open the daily note
- Scenario Objective: Run `notesmd-cli daily` and verify the resulting daily-note output or file.
- Exact Prompt: `Open today's daily note in my selected vault without launching the Obsidian app.`
- Exact Command Sequence: `1. notesmd-cli list-vaults -> 2. notesmd-cli daily -> 3. notesmd-cli list`
- Expected Signals: Step 1 identifies the target; step 2 exits 0 and creates/opens the daily note; step 3 exposes the resulting note or a documented daily-note path.
- Evidence: Vault list, daily command output, note listing, and whether the app remained closed.
- Pass/Fail Criteria: PASS if the command completes headlessly and the daily note is observable; FAIL if it requires the app, exits non-zero, or targets an unintended vault.
- Failure Triage: 1. Confirm the default vault. 2. Run `notesmd-cli daily --help` and record the installed settings behavior. 3. Inspect the vault's daily-note configuration if the path is unexpected.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Keep Obsidian closed for this scenario. The exact daily-note settings interaction is `VERIFY`.

### Prompt

`Open today's daily note in my selected vault without launching the Obsidian app.`

### Commands

1. `notesmd-cli list-vaults`
2. `notesmd-cli daily`
3. `notesmd-cli list`

### Expected

The daily command completes without an app, and the resulting note is visible in the listing or command output.

### Evidence

Capture the vault list, daily output, listing, and an observation that Obsidian was not running.

### Pass / Fail

- **Pass:** the daily command completes headlessly and exposes the expected daily note.
- **Fail:** the command requires the app, targets another vault, or exits non-zero.

### Failure Triage

1. Run `notesmd-cli list-vaults` and set the intended default.
2. Run `notesmd-cli daily --help` and capture the local syntax.
3. Inspect the configured daily-note folder and report the settings mismatch.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-005 | Open the daily note | Open today's daily note without an app | `Open today's daily note in my selected vault without launching the Obsidian app.` | 1. `notesmd-cli list-vaults` -> 2. `notesmd-cli daily` -> 3. `notesmd-cli list` | Known vault; daily command exits 0; daily note visible | Outputs plus app-closed observation | PASS if headless daily operation succeeds; FAIL if app is required or output is wrong | Recheck vault, help, and daily-note settings |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| [`../../feature-catalog/cli/open-daily-note.md`](../../feature-catalog/cli/open-daily-note.md) | Catalog entry for daily notes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Daily command and settings caveat |
| [`../../examples/headless-notes-workflow.sh`](../../examples/headless-notes-workflow.sh) | Headless vault preflight pattern |

---

## 5. SOURCE METADATA

- Group: Headless note operations
- Playbook ID: `OBS-005`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `headless-notes/daily-note.md`
