---
title: "SD-023 -- Shared frontmatter value warning"
description: "This scenario validates the shared frontmatter value warning for `SD-023`. It focuses on validate_document.py adding one `frontmatter_value_outside_list` warning to a reference copy whose contextType is outside the shared list, with no new blocking error compared with the unedited copy."
version: 2.3.0.2
---

# SD-023 -- Shared frontmatter value warning

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SD-023`.

---

## 1. OVERVIEW

This scenario validates the shared frontmatter value warning for `SD-023`. It focuses on validate_document.py adding one `frontmatter_value_outside_list` warning to a reference copy whose contextType is outside the shared list, with no new blocking error compared with the unedited copy.

### Why This Matters

Skill docs and spec docs carry the same `contextType` and `importance_tier` keys, and both should be judged by the one list system-spec-kit owns. `.skilled/skills/sk-doc/shared/scripts/validate_document.py` reads that list and warns on a value outside it, but the warning must never block: a document that passed before the edit must still pass. Validating an edited copy next to an unedited copy shows the warning and proves it adds nothing blocking.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SD-023` and confirm the expected signals without contradictory evidence.

- Objective: prove the edited copy gets exactly one `frontmatter_value_outside_list` warning for `contextType "architecture"`, that its blocking-error count matches the unedited copy, and that both runs exit with the same status
- Real user request: `If a skill doc says contextType: architecture, does the doc validator flag it, and would that ever fail the doc?`
- Prompt: `Copy a sk-doc reference doc twice, set contextType to architecture in one copy, validate both as reference docs and tell me what changed between the two results.`
- Expected execution process: the orchestrator copies one reference doc to two scratch files, sets `contextType: "architecture"` in one, validates both with `--type reference`, compares the two outputs and removes the scratch folder
- Expected signals: step 4 prints the unedited copy's verdict and `exit=<code>`. Step 5 prints the same verdict and the same exit code, plus a `Warnings` block holding `[frontmatter_value_outside_list] contextType "architecture" is not in the shared list`. Step 6 shows a total-issues count one higher and the added warning lines, and no added blocking-error line
- Desired user-visible outcome: the warning text, and a statement that the edited copy passes or fails exactly as the unedited copy does
- Pass/fail: PASS if step 5 carries exactly one `frontmatter_value_outside_list` warning, both runs exit with the same code and step 6 shows no added blocking error. FAIL if the warning is missing or repeated, the exit codes differ, or the edited copy gains a blocking error

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Copy a sk-doc reference doc twice, set contextType to architecture in one copy, validate both as reference docs and tell me what changed between the two results.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-023 | Shared frontmatter value warning | Warn once on a contextType outside the shared list and add no blocking error | `Copy a sk-doc reference doc twice, set contextType to architecture in one copy, validate both as reference docs and tell me what changed between the two results.` | 1. `bash: mkdir -p /tmp/skd-SD-023/references && cp .skilled/skills/sk-doc/shared/references/validation.md /tmp/skd-SD-023/references/base.md && cp .skilled/skills/sk-doc/shared/references/validation.md /tmp/skd-SD-023/references/edited.md` -> 2. `bash: sed -i.bak -E 's/^contextType:.*/contextType: "architecture"/' /tmp/skd-SD-023/references/edited.md` -> 3. `bash: grep -n '^contextType' /tmp/skd-SD-023/references/base.md /tmp/skd-SD-023/references/edited.md` -> 4. `bash: python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py /tmp/skd-SD-023/references/base.md --type reference > /tmp/skd-SD-023/base.txt; code=$?; cat /tmp/skd-SD-023/base.txt; echo "exit=$code"` -> 5. `bash: python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py /tmp/skd-SD-023/references/edited.md --type reference > /tmp/skd-SD-023/edited.txt; code=$?; cat /tmp/skd-SD-023/edited.txt; echo "exit=$code"` -> 6. `bash: diff /tmp/skd-SD-023/base.txt /tmp/skd-SD-023/edited.txt` -> 7. `bash: rm -rf /tmp/skd-SD-023` | Step 4 prints the unedited verdict and its exit line. Step 5 prints the same verdict and exit code plus `[frontmatter_value_outside_list] contextType "architecture" is not in the shared list` under `Warnings`. Step 6 shows the file name, a total-issues count one higher and the warning lines, and no added blocking-error line | The prompt, the reply text, the full output of steps 3 to 6 with each exit line | PASS if step 5 carries exactly one `frontmatter_value_outside_list` warning, both runs exit with the same code and step 6 adds no blocking error. FAIL if the warning is missing or repeated, the exit codes differ or the edited copy gains a blocking error | 1. No warning in step 5 while step 3 shows the edit: check that `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` exists, since a checkout without the list stays silent by design. 2. Step 3 shows no edit: the copied doc has no top-level `contextType` line, so pick a reference doc that carries one. 3. Different exit codes: the warning reached the blocking path, which the check never does by contract |

### Commands

1. `bash: mkdir -p /tmp/skd-SD-023/references && cp .skilled/skills/sk-doc/shared/references/validation.md /tmp/skd-SD-023/references/base.md && cp .skilled/skills/sk-doc/shared/references/validation.md /tmp/skd-SD-023/references/edited.md`
2. `bash: sed -i.bak -E 's/^contextType:.*/contextType: "architecture"/' /tmp/skd-SD-023/references/edited.md`
3. `bash: grep -n '^contextType' /tmp/skd-SD-023/references/base.md /tmp/skd-SD-023/references/edited.md`
4. `bash: python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py /tmp/skd-SD-023/references/base.md --type reference > /tmp/skd-SD-023/base.txt; code=$?; cat /tmp/skd-SD-023/base.txt; echo "exit=$code"`
5. `bash: python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py /tmp/skd-SD-023/references/edited.md --type reference > /tmp/skd-SD-023/edited.txt; code=$?; cat /tmp/skd-SD-023/edited.txt; echo "exit=$code"`
6. `bash: diff /tmp/skd-SD-023/base.txt /tmp/skd-SD-023/edited.txt`
7. `bash: rm -rf /tmp/skd-SD-023`

### Expected

Step 3 shows `contextType: general` in the base copy and `contextType: "architecture"` in the edited copy. Step 4 prints the unedited copy's verdict, its document type `reference`, its total-issues count and `exit=<code>`. Step 5 prints the same verdict and exit code, a total-issues count one higher, and a `Warnings` block that holds `[frontmatter_value_outside_list] contextType "architecture" is not in the shared list`. Step 6 shows the differing file name, the total-issues line and the added warning lines, and no line under a blocking-error heading, because the check adds a warning and never an error.

### Evidence

Capture the prompt and reply text, the step 3 grep, the complete output of steps 4 and 5 with each `exit=` line and the step 6 diff.

### Pass / Fail

- **Pass**: step 5 carries exactly one `frontmatter_value_outside_list` warning, both runs exit with the same code, and step 6 adds no blocking-error line.
- **Fail**: the warning is missing or repeated, the exit codes differ, or the edited copy gains a blocking error.

### Failure Triage

1. No warning in step 5 while step 3 shows the edit: check that `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` exists, since a checkout without the list stays silent by design.
2. Step 3 shows no edit: the copied doc has no top-level `contextType` line, so pick a reference doc that carries one and rerun from step 1.
3. Different exit codes: the warning reached the blocking path, which the check never does by contract. Read `validate_frontmatter_values` in the validator.

### Optional Supplemental Checks

Set `importance_tier: planning` in a third copy and confirm one `frontmatter_value_outside_list` warning naming `importance_tier`. Set `contextType: review` and confirm no warning, because `review` is a legal alias.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [`../../feature-catalog/document-validation/shared-frontmatter-value-warning.md`](../../feature-catalog/document-validation/shared-frontmatter-value-warning.md) | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../shared/scripts/validate_document.py`](../../shared/scripts/validate_document.py) | Loads the shared list and adds the warning for every document type |
| [`../../scripts/tests/test_frontmatter_values.py`](../../scripts/tests/test_frontmatter_values.py) | Seven cases over canonical values, aliases, values outside the list and the silent cases |

---

## 5. SOURCE METADATA

- Group: DOCUMENT VALIDATION
- Playbook ID: SD-023
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `document-validation/shared-frontmatter-value-warning.md`
