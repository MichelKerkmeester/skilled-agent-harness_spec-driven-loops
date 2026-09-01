---
title: "CHG-005 -- Select the canonical prose format"
description: "This scenario validates changelog format selection for CHG-005. Compact and expanded entries use the shared template and plain category vocabulary."
version: 1.0.0.0
---

# CHG-005 -- Select the canonical prose format

This document captures the operator contract for changelog content shape.

## 1. OVERVIEW

This scenario validates format selection for `CHG-005`. It focuses on the change count and release type rules.

### Why This Matters

The shared template gives compact and expanded shapes for different release sizes. The summary leads with why the release matters. Category names stay plain and consistent. Older workflow text may ask for a version header, but the current template starts with the summary paragraph.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-005` and confirm the current format source.

- Objective: select compact or expanded format from the release type and use the canonical sections
- Realistic user request: `Write release notes for these changes and make the format match the size of the release.`
- Prompt: `Choose the canonical changelog format for this release. Use the shared template, lead with why it matters and explain whether compact or expanded format applies.`
- Expected execution process: the template is read, the number of changes and breaking status are counted, compact or expanded format is selected and old header requirements are treated as stale when they conflict with the template.
- Expected signals: fewer than 10 non-major changes use compact format. Ten or more changes or a breaking change use expanded format. The file starts with a summary paragraph and uses plain category names.
- Desired user-visible outcome: a readable changelog with the right sections and no mixed format rules.
- Pass/fail: PASS if the format decision follows the shared template. FAIL if a version header is added because of stale workflow text or the wrong format is selected.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Choose the canonical changelog format for this release. Use the shared template, lead with why it matters and explain whether compact or expanded format applies.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-005 | Select the canonical prose format | Choose compact or expanded format from the shared template | `Choose the canonical changelog format for this release. Use the shared template, lead with why it matters and explain whether compact or expanded format applies.` | 1. `agent: Read assets/changelog-template.md sections 2 through 5` -> 2. `agent: State the compact and expanded thresholds and breaking-change rule` -> 3. `agent: List the required sections for the selected format` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-changelog/assets/changelog-template.md --type readme` | Step 1 identifies the current template. Step 2 states the thresholds. Step 3 lists summary, category content, files changed and upgrade guidance. Step 4 reports the template validation result and exit status | Exact prompt, template sections, threshold statement, section list and validator transcript with exit status | PASS if the shared template controls the format and the result is validated. FAIL if stale header rules are mixed in or the wrong format is selected | 1. Re-read the template before the YAML snippets. 2. Count changes and check breaking status. 3. Confirm the summary starts the file |

### Commands

1. `agent: Read assets/changelog-template.md sections 2 through 5`
2. `agent: State the compact and expanded thresholds and breaking-change rule`
3. `agent: List the required sections for the selected format`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-changelog/assets/changelog-template.md --type readme`

### Expected

Compact is used for fewer than 10 non-major changes. Expanded is used for 10 or more changes, major releases and breaking changes. The canonical global file starts with a summary paragraph. The section vocabulary includes names such as `Documentation`, `Testing`, `Commands`, `New Features` and `Bug Fixes`.

### Evidence

Capture the prompt, template sections, format thresholds, required section list and validator output and exit status.

### Pass / Fail

- **Pass**: the selected format follows the shared template and the content is validated.
- **Fail**: the run adds a stale version header, uses non-canonical headings without an explicit external requirement or omits required sections.

### Failure Triage

1. Identify the format source that was read.
2. Recount changes and check breaking status.
3. Compare the draft with the compact or expanded scaffold.
4. Run the shared validator again.

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
| [`assets/changelog-template.md`](../../assets/changelog-template.md) | Canonical compact and expanded format |
| [`SKILL.md`](../../SKILL.md) | Format selection and source conflict rule |
| [`README.md`](../../README.md) | Format and validation overview |

---

## 5. SOURCE METADATA

- Group: VERSION AND FORMAT
- Playbook ID: CHG-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `version-and-format/select-canonical-format.md`
