---
title: "CHG-013 -- Extend the open release instead of numbering a new one"
description: "This scenario validates the open-release rule for CHG-013. When the latest skilled entry has no release tag on origin, the run folds the new work into that entry and keeps its version."
version: 1.0.0.0
---

# CHG-013 -- Extend the open release instead of numbering a new one

This document captures the operator contract for adding work to a Skilled release that has notes but no tag yet.

## 1. OVERVIEW

This scenario validates the open-release rule for `CHG-013`. It focuses on the release tag check and on folding new work into the existing entry rather than opening a second one.

### Why This Matters

Release notes are often written before the release is tagged, and other work keeps landing on main in the meantime. A second untagged entry beside the first splits one release across two files, and the tag later lands on a commit that both describe. Extending the open entry keeps one release in one file.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-013` and confirm the tag check, the target path and the version.

- Objective: when the latest `skilled` entry has no release tag on origin, extend that entry and keep its version
- Realistic user request: `Add the work that landed since the release notes were written to the Skilled release notes.`
- Prompt: `Create a global changelog for the skilled component. Read the latest version, check whether origin has a release tag for it, and if it has none, fold the new work into that entry instead of numbering a new one.`
- Expected execution process: `SKILL.md` section 7 step 3 is read, the version reader prints the latest entry, the tag check runs against origin, the run sets the extend mode and step 4 folds the new work into the existing entry.
- Expected signals: the tag check exits 2, the target is the existing `.skilled/changelog/skilled/v<latest>.md`, the version is unchanged, no new file appears in the folder and the existing sections are kept.
- Desired user-visible outcome: one release entry that covers the old and the new work.
- Pass/fail: PASS if the tag check output, the unchanged version and an in-place edit are evidenced. FAIL if a new version file is written while the latest entry is untagged, or if the run extends an entry whose tag exists.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a global changelog for the skilled component. Read the latest version, check whether origin has a release tag for it, and if it has none, fold the new work into that entry instead of numbering a new one.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-013 | Extend the open release instead of numbering a new one | Fold new work into the untagged latest entry | `Create a global changelog for the skilled component. Read the latest version, check whether origin has a release tag for it, and if it has none, fold the new work into that entry instead of numbering a new one.` | 1. `agent: Read SKILL.md section 7 step 3` -> 2. `bash: { find -L .skilled/changelog/skilled -maxdepth 1 -name 'v*.md'; find -L .skilled/changelog/skilled -mindepth 2 -maxdepth 2 -path '*+/v*.md'; } \| sed 's#.*/##' \| sort -V \| tail -1` -> 3. `bash: git ls-remote --exit-code --tags origin refs/tags/v<latest>; echo "exit=$?"` -> 4. `agent: State the mode, the version and the target path` | Step 3 exits 2 for an open release or 0 for a tagged one. Step 4 names the existing file and the same version when step 3 exited 2, and a new higher version when it exited 0 | Exact prompt, rule text, reader output, tag check output and exit status, mode, version and target path | PASS if exit 2 leads to an in-place edit at the same version and exit 0 leads to a new entry. FAIL on any other pairing | 1. Rerun the tag check with `--exit-code`. 2. Confirm the reader's last line is the version passed to the tag check. 3. When the tag check exits with any other code, confirm the run numbered a new entry and said the check failed. |

### Commands

1. `agent: Read SKILL.md section 7 step 3`
2. `bash: { find -L .skilled/changelog/skilled -maxdepth 1 -name 'v*.md'; find -L .skilled/changelog/skilled -mindepth 2 -maxdepth 2 -path '*+/v*.md'; } | sed 's#.*/##' | sort -V | tail -1`
3. `bash: git ls-remote --exit-code --tags origin refs/tags/v<latest>; echo "exit=$?"`
4. `agent: State the mode, the version and the target path`

### Expected

When the tag check exits 2, the run keeps the latest version, reports any chosen bump as not applied and edits the existing entry in place: new sections or H4 items, a glance bullet in section order, the spec folder on the spec-folder line and any upgrade action. When it exits 0, the run numbers a new entry as CHG-008 describes.

### Evidence

Capture the prompt, the rule text, the reader output, the tag check output and exit status, the chosen mode, the version and the target path, and a diff that shows the existing sections kept.

### Pass / Fail

- **Pass**: an untagged latest release is extended in place at the same version, and a tagged one gets a new entry.
- **Fail**: a second untagged entry is written, a tagged release is edited, existing sections are deleted or a chosen bump is dropped without a word in the report.

### Failure Triage

1. Rerun the tag check with `--exit-code`.
2. Confirm the reader's last line is the version passed to the tag check.
3. When the tag check exits with any other code, confirm the run numbered a new entry and said the check failed.

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
| [`SKILL.md`](../../SKILL.md) | The open-release rule in section 7 step 3 |
| [`create-changelog-auto.yaml`](../../../../../commands/create/assets/create-changelog-auto.yaml) | Step 3 tag check and the step 4 extend branch |

---

## 5. SOURCE METADATA

- Group: RELEASE LINE
- Playbook ID: CHG-013
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `release-line/extend-open-release.md`
