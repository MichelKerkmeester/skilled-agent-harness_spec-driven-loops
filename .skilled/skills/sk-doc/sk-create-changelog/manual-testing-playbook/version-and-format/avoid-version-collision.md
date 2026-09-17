---
title: "CHG-004 -- Avoid a version collision"
description: "This scenario validates collision handling for CHG-004. When the calculated global changelog path exists, the build segment increases until the target is unique and no file is overwritten."
version: 1.0.0.3
---

# CHG-004 -- Avoid a version collision

This document captures the operator contract for unique global changelog paths.

## 1. OVERVIEW

This scenario validates collision handling for `CHG-004`. It focuses on the no-overwrite rule.

### Why This Matters

A version calculation can be correct and still point at a file that already exists. The workflow must keep the existing record and increment the build segment until a free path is found. This protects both the old release note and the new release note.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-004` and confirm the collision response.

- Objective: resolve an occupied global version path without overwriting it
- Realistic user request: `The next version file already exists because another run used it. Create this changelog safely.`
- Prompt: `Calculate the next global changelog version for this component. If the target file already exists, increment the build segment and leave the existing file unchanged.`
- Expected execution process: the latest version is listed, the candidate path is checked, an occupied path is rejected and the build segment is incremented until the path is free. The existing file is not opened for replacement.
- Expected signals: the new version is greater than the latest version, the final target does not exist before writing and the existing file remains unchanged.
- Desired user-visible outcome: a unique target path and an explicit no-overwrite decision.
- Pass/fail: PASS if collision handling increments the build segment and preserves the existing file. FAIL if the run overwrites or reuses the occupied path.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Calculate the next global changelog version for this component. If the target file already exists, increment the build segment and leave the existing file unchanged.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-004 | Avoid a version collision | Find a free version path without overwriting a changelog | `Calculate the next global changelog version for this component. If the target file already exists, increment the build segment and leave the existing file unchanged.` | 1. `agent: Read SKILL.md sections 4 and 7 and state the collision rule` -> 2. `bash: ls .opencode/changelog/sk-doc` -> 3. `agent: Compare the calculated target with the existing filenames and increment the build segment if needed` -> 4. `bash: git status --porcelain .opencode/changelog/sk-doc` | Step 1 states no overwrite. Step 2 lists the current files. Step 3 reports each occupied candidate and the free target. Step 4 shows no unrequested change | Exact prompt, rule text, file listing and exit status, candidate comparisons, final target and status output | PASS if the final target is free and the existing file is preserved. FAIL if the run overwrites, reuses or silently skips the collision | 1. Confirm the candidate filename is exact. 2. Check the build segment increment. 3. Compare the existing file before and after the run |

### Commands

1. `agent: Read SKILL.md sections 4 and 7 and state the collision rule`
2. `bash: ls .opencode/changelog/sk-doc`
3. `agent: Compare the calculated target with the existing filenames and increment the build segment if needed`
4. `bash: git status --porcelain .opencode/changelog/sk-doc`

### Expected

The workflow checks the target filename before writing. If it exists, the build segment increments until the path is unique. Existing content is not overwritten. A new target is validated before writing.

### Evidence

Capture the prompt, collision rule, file listing and exit status, candidate sequence, final target and status output.

### Pass / Fail

- **Pass**: the final version path is free and the occupied file is unchanged.
- **Fail**: the existing file is overwritten or the same path is reused.

### Failure Triage

1. List the target folder again.
2. Compare the candidate version with the exact filenames.
3. Check the existing file content and working-tree status.

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
| [`SKILL.md`](../../SKILL.md) | Version collision and write gates |
| [`README.md`](../../README.md) | Collision troubleshooting behavior |
| [`references/version-bump-rules.md`](../../references/version-bump-rules.md) | First-entry and build-increment rules |

---

## 5. SOURCE METADATA

- Group: VERSION AND FORMAT
- Playbook ID: CHG-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `version-and-format/avoid-version-collision.md`
