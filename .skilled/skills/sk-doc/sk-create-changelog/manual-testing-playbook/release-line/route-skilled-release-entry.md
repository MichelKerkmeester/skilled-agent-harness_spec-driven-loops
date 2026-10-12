---
title: "CHG-008 -- Route a Skilled release entry to the release line"
description: "This scenario validates release-line routing for CHG-008. Naming the skilled component writes the entry to the release line with a version above every existing entry, generation folders included."
version: 1.2.0.0
---

# CHG-008 -- Route a Skilled release entry to the release line

This document captures the operator contract for writing a Skilled framework release entry.

## 1. OVERVIEW

This scenario validates release-line routing for `CHG-008`. It focuses on the explicit component choice and on a version reader that sees the generation folders.

### Why This Matters

The `skilled` folder holds one entry per Skilled release, and its older entries sit in the generation folders `v1+/`, `v2+/` and `v3+/`. The workflow writes there only when the operator names the component. A reader that lists only the top level of a folder can miss its newest entry, and a guessed version can collide with a release tag.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-008` and confirm the target path and version.

- Objective: write a release entry to `.skilled/changelog/skilled/` when the operator names `skilled`
- Realistic user request: `Write the release entry for the next Skilled release from the changes since the last tag.`
- Prompt: `Create a global changelog for the skilled component. Confirm that skilled is the framework release line, read the latest version from the folder and its generation folders, and calculate a unique four-part version before writing.`
- Expected execution process: `SKILL.md` section 6 is read for rules 1 and 7, the component folders are listed, `skilled` is matched exactly from the hint, the step 3 reader lists the top level and the generation folders, the bump is chosen and the next version is calculated.
- Expected signals: the target is `.skilled/changelog/skilled/vX.Y.Z.B.md` at the top level of the folder, the version is strictly greater than the reader's last line and no generation folder is written to.
- Desired user-visible outcome: a release entry in the release line with a version that no existing entry holds.
- Pass/fail: PASS if the target, the reader output and the version comparison are evidenced. FAIL if the entry lands in a generation folder or another component folder, or if its version is not above the latest entry.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a global changelog for the skilled component. Confirm that skilled is the framework release line, read the latest version from the folder and its generation folders, and calculate a unique four-part version before writing.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-008 | Route a Skilled release entry to the release line | Write the release entry to the release line with a unique version | `Create a global changelog for the skilled component. Confirm that skilled is the framework release line, read the latest version from the folder and its generation folders, and calculate a unique four-part version before writing.` | 1. `agent: Read SKILL.md section 6 rules 1 and 7, and step 3 of section 7` -> 2. `bash: ls -d .skilled/changelog/*/` -> 3. `bash: { find -L .skilled/changelog/skilled -maxdepth 1 -name 'v*.md'; find -L .skilled/changelog/skilled -mindepth 2 -maxdepth 2 -path '*+/v*.md'; } \| sed 's#.*/##' \| sort -V \| tail -1` -> 4. `agent: Choose the bump, calculate the next version and state the target path` | Step 1 states that skilled resolves only from an explicit hint. Step 2 lists `skilled/`. Step 3 prints the latest entry. Step 4 names a new top-level target whose version is above it | Exact prompt, rule text, folder listing, reader output and exit status, bump choice, version comparison and target path | PASS if the target is a new top-level file in `.skilled/changelog/skilled/` with a version above the reader's last line. FAIL if the target is a generation folder, another folder or an existing version | 1. Rerun the reader with both `find` commands. 2. Compare versions as integer tuples, not strings. 3. Confirm that the hint names `skilled` exactly. |

### Commands

1. `agent: Read SKILL.md section 6 rules 1 and 7, and step 3 of section 7`
2. `bash: ls -d .skilled/changelog/*/`
3. `bash: { find -L .skilled/changelog/skilled -maxdepth 1 -name 'v*.md'; find -L .skilled/changelog/skilled -mindepth 2 -maxdepth 2 -path '*+/v*.md'; } | sed 's#.*/##' | sort -V | tail -1`
4. `agent: Choose the bump, calculate the next version and state the target path`

### Expected

The workflow resolves `skilled` only because the hint names it. The reader lists the top-level entries and the entries in `v1+/`, `v2+/` and `v3+/`, so its last line is the newest entry in the whole line. The next version is strictly greater than that entry, and the target is a new file at the top level of `.skilled/changelog/skilled/`.

### Evidence

Capture the prompt, the resolution rules, the folder listing and exit status, the reader output and exit status, the bump choice, the version comparison and the target path.

### Pass / Fail

- **Pass**: the target is a new top-level file in the release line with a version above every existing entry.
- **Fail**: the entry lands in a generation folder or another folder, reuses a version, or the reader skipped the generation folders.

### Failure Triage

1. Rerun the reader with both `find` commands.
2. Compare versions as integer tuples, not strings.
3. Confirm that the hint names `skilled` exactly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Release-line resolution and the version reader |
| [`create-changelog-auto.yaml`](../../../../../commands/create/assets/create-changelog-auto.yaml) | Step 3 version reader |

---

## 5. SOURCE METADATA

- Group: RELEASE LINE
- Playbook ID: CHG-008
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `release-line/route-skilled-release-entry.md`
