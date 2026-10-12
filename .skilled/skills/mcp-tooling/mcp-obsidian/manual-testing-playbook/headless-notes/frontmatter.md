---
title: "OBS-008 -- Frontmatter command surface"
description: "This scenario validates the installed notesmd-cli frontmatter help surface before a controlled metadata edit."
stage: routing
version: 0.1.0.0
---

# OBS-008 -- Frontmatter command surface

## 1. OVERVIEW

This scenario validates that the installed `notesmd-cli frontmatter` command is discoverable and that its exact read/write syntax is captured before use.

### Why This Matters

The command identity is confirmed, but the current references do not confirm the get/set flags or key/value syntax. A truthful test must verify the local help rather than invent a mutation form.

---

## 2. SCENARIO CONTRACT

- Feature ID: `OBS-008`
- Feature Name: Frontmatter command surface
- Scenario Objective: Capture the installed frontmatter help and, only if the schema is explicit, perform a controlled metadata read/write.
- Exact Prompt: `Check the installed notesmd-cli frontmatter syntax, then update only the test note if the supported flags are explicit.`
- Exact Command Sequence: `1. notesmd-cli frontmatter --help -> 2. notesmd-cli frontmatter "TEST_NOTE" --help -> 3. use the locally confirmed read/write form (VERIFY)`
- Expected Signals: Steps 1–2 return usage or help; step 3 is executed only when the local syntax is explicit; otherwise the scenario is SKIP with the captured help.
- Evidence: Help output, installed version, controlled note path, and before/after frontmatter if a local form was verified.
- Pass/Fail Criteria: PASS if the syntax is captured and any edit uses only the confirmed local form; SKIP if the binary does not expose a confirmed form; FAIL if an unverified mutation is attempted or the command fails unexpectedly.
- Failure Triage: 1. Run `notesmd-cli --version`. 2. Capture both help outputs without changing a note. 3. Compare the installed help with the reference and report the exact divergence.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Do not guess the frontmatter mutation flags. A syntax gap is a documented `SKIP`, not a reason to substitute raw file editing in this scenario.

### Prompt

`Check the installed notesmd-cli frontmatter syntax, then update only the test note if the supported flags are explicit.`

### Commands

1. `notesmd-cli frontmatter --help`
2. `notesmd-cli frontmatter "TEST_NOTE" --help`
3. `VERIFY: use only the read/write form printed by the installed help`

### Expected

The help output is captured. If it documents an unambiguous read/write form, the operator may use it on `TEST_NOTE`; otherwise record `SKIP` with the syntax blocker.

### Evidence

Capture help output, version, note path, and any controlled before/after frontmatter.

### Pass / Fail

- **Pass:** local syntax is captured and any mutation uses only that syntax.
- **Skip:** the current binary leaves the read/write form unconfirmed.
- **Fail:** an unverified command is attempted or a confirmed command errors unexpectedly.

### Failure Triage

1. Capture `notesmd-cli --version` and both help outputs.
2. Compare the local flags with `references/obsidian-cli-commands.md`.
3. Keep the scenario skipped until the exact installed form is known.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| OBS-008 | Frontmatter command surface | Confirm help before any metadata edit | `Check the installed notesmd-cli frontmatter syntax, then update only the test note if the supported flags are explicit.` | 1. `notesmd-cli frontmatter --help` -> 2. `notesmd-cli frontmatter "TEST_NOTE" --help` -> 3. `VERIFY` locally documented form | Help is captured; edit only if syntax is explicit | Help, version, and optional before/after content | PASS on confirmed syntax; SKIP on an unconfirmed form; FAIL on unexpected command error | Capture version/help and compare with reference |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and `VERIFY`/`SKIP` rules |
| [`../../feature-catalog/cli/edit-frontmatter.md`](../../feature-catalog/cli/edit-frontmatter.md) | Catalog entry for frontmatter |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/obsidian-cli-commands.md`](../../references/obsidian-cli-commands.md) | Current command identity and unknown flags |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | CLI and PATH recovery |

---

## 5. SOURCE METADATA

- Group: Headless note operations
- Playbook ID: `OBS-008`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `headless-notes/frontmatter.md`
