---
title: "CHG-015 -- Check the expanded entry shape"
description: "This scenario validates the changelog shape check for CHG-015. An expanded entry fails when a sentence runs past its ceiling, it lists its glance rows out of section order or labels its spec line with a level."
version: 1.1.1.0
---

# CHG-015 -- Check the expanded entry shape

This document captures the operator contract for the changelog shape check.

## 1. OVERVIEW

This scenario validates the shape check for `CHG-015`. It focuses on the ceilings an expanded entry must stay inside and the glance order the check reads from the glance table's Section column.

### Why This Matters

A release with many changes is the one most likely to read badly. The shape check stops a draft with long sentences, before it becomes release notes. It also confirms the glance rows name their sections in the order the body uses.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-015` and confirm the check passes the model entry and fails a broken copy.

- Objective: show that the shape check passes a well-shaped expanded entry and fails one that breaks a rule
- Realistic user request: `Write release notes for this large release and make sure they stay short enough to read.`
- Prompt: `Check the shape of the v4.1.0.0 release entry, then check a copy with some glance rows pointed at a later section, and explain each result.`
- Expected execution process: the check runs on the model entry, a scratch copy renames the Section cell on some glance rows, the check runs on the copy and the exit codes are read.
- Expected signals: the model entry prints `PASS` and exits 0. The copy prints `FAIL` with a `[glance-order]` line and exits 1.
- Desired user-visible outcome: the operator knows the check reads the order and stops a broken draft.
- Pass/fail: PASS if both exit codes match. FAIL if the copy passes or the model entry fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check the shape of the v4.1.0.0 release entry, then check a copy with some glance rows pointed at a later section, and explain each result.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-015 | Check the expanded entry shape | Pass the model entry and fail a copy with its glance order broken | `Check the shape of the v4.1.0.0 release entry, then check a copy with some glance rows pointed at a later section, and explain each result.` | 1. `bash: python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.1.0.0.md` -> 2. `bash: sed 's/| Installs and Overlays |$/| Node.js |/' .skilled/changelog/skilled/v4.1.0.0.md > "$TMPDIR/chg-015.md"` -> 3. `bash: python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py "$TMPDIR/chg-015.md"` | Step 1 prints `PASS` and exits 0. Step 3 prints `FAIL` with `[glance-order]` and exits 1 | Both command outputs with their exit codes | PASS if step 1 exits 0 and step 3 exits 1 with a glance-order line. FAIL otherwise | 1. Confirm the glance table has a Section column. 2. Compare the Section cells with the H2 headings. 3. Re-read the ceiling table in the template |

### Commands

1. `bash: python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.1.0.0.md`
2. `bash: sed 's/| Installs and Overlays |$/| Node.js |/' .skilled/changelog/skilled/v4.1.0.0.md > "$TMPDIR/chg-015.md"`
3. `bash: python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py "$TMPDIR/chg-015.md"`

### Expected

The model entry passes every rule, glance order included. The copy fails on glance order because its Installs and Overlays rows now name Node.js, a section that comes later in the body.

### Evidence

Capture both command outputs and their exit codes.

### Pass / Fail

- **Pass**: the model entry exits 0 and the broken copy exits 1 with a `[glance-order]` line.
- **Fail**: the copy passes, the model entry fails or the order rule is reported as skipped.

### Failure Triage

1. Confirm the glance table has a Section column.
2. Check that each Section cell spells its section the way the H2 does.
3. Re-read the ceiling table in the template and the checker constants.

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
| [`scripts/check_changelog_shape.py`](../../scripts/check_changelog_shape.py) | The shape check and its ceilings |
| [`assets/changelog-template.md`](../../assets/changelog-template.md) | The ceiling table and the glance table rule |
| [`SKILL.md`](../../SKILL.md) | Where the check runs in the workflow |

---

## 5. SOURCE METADATA

- Group: VERSION AND FORMAT
- Playbook ID: CHG-015
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `version-and-format/check-expanded-shape.md`
