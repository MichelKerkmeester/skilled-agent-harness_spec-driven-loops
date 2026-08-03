---
title: "OBS-004 -- Search notes"
description: "This scenario validates title search and full-text content search with notesmd-cli."
stage: routing
version: 1.0.0.0
---

# OBS-004 -- Search notes

## 1. OVERVIEW

This scenario validates the distinction between `notesmd-cli search` for note names and `notesmd-cli search-content` for note bodies.

### Why This Matters

Title lookup and body search are different operations. The mode must not report a title search miss as proof that a note body has no matching content.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-004`
- Feature Name: Search notes
- Scenario Objective: Find a known title and a known body marker with their respective commands.
- Exact Prompt: `Find the playbook test note by title, then search the vault body for the marker mcp-obsidian-playbook-marker.`
- Exact Command Sequence: `1. notesmd-cli search "mcp-obsidian-playbook-test" -> 2. notesmd-cli search-content "mcp-obsidian-playbook-marker"`
- Expected Signals: Step 1 returns the fixture title; step 2 returns the fixture containing the body marker or a valid empty result when the marker fixture is absent.
- Evidence: Both command outputs, the fixture note path, and whether the marker was present.
- Pass/Fail Criteria: PASS if title and body searches use the correct surfaces and produce the expected match/no-match semantics; FAIL if the commands are swapped, output is contradictory, or an exit code is non-zero.
- Failure Triage: 1. Print the fixture note. 2. Confirm the marker spelling and case. 3. Run `notesmd-cli list-vaults` and retry against the intended vault.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Use the note from `OBS-003` or another operator-owned fixture whose body contains `mcp-obsidian-playbook-marker`.

### Prompt

`Find the playbook test note by title, then search the vault body for the marker mcp-obsidian-playbook-marker.`

### Commands

1. `notesmd-cli search "mcp-obsidian-playbook-test"`
2. `notesmd-cli search-content "mcp-obsidian-playbook-marker"`

### Expected

The first command searches names; the second scans bodies. An empty second result is valid only when the fixture does not contain the marker and that fact is recorded.

### Evidence

Capture both outputs, the fixture contents or path, and the exit codes.

### Pass / Fail

- **Pass:** each query uses its intended surface and the result agrees with the fixture.
- **Fail:** title search is used for body content, body search is not attempted, or output contradicts the fixture.

### Failure Triage

1. Print the fixture note and inspect the marker.
2. Confirm the selected vault with `notesmd-cli list-vaults`.
3. Retry with a spelling-checked marker and record an empty result as valid when appropriate.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-004 | Search notes | Search note names and bodies with separate commands | `Find the playbook test note by title, then search the vault body for the marker mcp-obsidian-playbook-marker.` | 1. `notesmd-cli search "mcp-obsidian-playbook-test"` -> 2. `notesmd-cli search-content "mcp-obsidian-playbook-marker"` | Title match in step 1; body match or documented empty result in step 2 | Both outputs, fixture path/content, exit codes | PASS if query surfaces and fixture evidence agree; FAIL on swapped surface or contradiction | Print fixture, confirm vault, retry exact marker |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| [`../../feature-catalog/cli/search-note-names.md`](../../feature-catalog/cli/search-note-names.md) | Catalog entry for title search |
| [`../../feature-catalog/cli/search-note-content.md`](../../feature-catalog/cli/search-note-content.md) | Catalog entry for body search |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Search command distinction |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Empty-result and vault diagnostics |

---

## 5. SOURCE METADATA

- Group: Headless note operations
- Playbook ID: `OBS-004`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `headless-notes/search-notes.md`
