---
title: "FMB-003 -- Silent discovery drop"
description: "This scenario validates the shared-budget diagnosis for `FMB-003`. Descriptions share one project-wide allowance, and going over it drops the longest entries from auto-discovery with no error at the point of failure."
version: 1.0.0.2
---

# FMB-003 -- Silent discovery drop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FMB-003`.

---

## 1. OVERVIEW

This scenario validates the shared-budget diagnosis for `FMB-003`. It focuses on the fact that descriptions share one project-wide allowance, and that going over it drops the longest entries from auto-discovery with no error at the point of failure.

### Why This Matters

The symptom has no error attached to it, which is what makes it hard. A skill stops being auto-suggested, stays invocable when named explicitly, and nothing in any log says why. The field reference explains it: the budget is a project total, and when it is exceeded the harness silently drops the longest descriptions from the available-skills list. The scope is what most diagnoses get wrong. The file that stopped being found may be entirely within its own per-skill target and be dropped because other files grew. That inverts the normal debugging instinct, which is to look at the file that broke. This scenario checks that the answer names the shared cost, not a per-file style rule, and that it points at a check for accumulated drift rather than at one description.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FMB-003` and confirm the expected signals without contradictory evidence.

- Objective: diagnose a silent discovery drop as a breach of the shared project-wide allowance, not as a per-file length problem
- Realistic user request: `A skill is no longer being suggested automatically, but it still runs when I ask for it by name.`
- Prompt: `One of our skills stopped showing up for the model, but it still works when I name it directly. Nothing errored. What happened?`
- Expected execution process: `assets/frontmatter-templates.md` loads, the budget section is read for the project total rather than the per-skill target, the answer identifies the drop as silent and as applying to the longest entries, and the remedy is described as trimming across the project rather than editing the affected file.
- Expected signals: the reply names the project total as a shared allowance, states that the longest entries are dropped and that skills stay explicitly invocable, and confirms that nothing warns at the point of failure. It does not conclude that the affected file's own description is too long without measuring it.
- Desired user-visible outcome: the user learns the cost is shared, that their own file may be fine, and which check surfaces accumulated drift.
- Pass/fail: PASS if the diagnosis names the shared project allowance and the silent drop of the longest entries. FAIL if the answer treats it as a per-file length rule, or asserts a cause with no reference to the budget table.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `One of our skills stopped showing up for the model, but it still works when I name it directly. Nothing errored. What happened?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FMB-003 | Silent discovery drop | Diagnose the silent drop as a shared project-budget breach rather than a per-file length problem | `One of our skills stopped showing up for the model, but it still works when I name it directly. Nothing errored. What happened?` | 1. `agent: Read the budget table in assets/frontmatter-templates.md and distinguish the per-skill target from the project total` -> 2. `agent: Match the reported symptom against the documented drop behavior` -> 3. `agent: State whether the affected file is necessarily the cause` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .opencode/skills/sk-doc/sk-create-frontmatter` | Step 1: two different limits are named with their scopes. Step 2: the symptom is matched to the silent drop of the longest entries. Step 3: the answer is that it is not necessarily the affected file. Step 4: the validator passes, showing a per-file check cannot see this failure | The prompt as typed, the two limits quoted with their scopes, the diagnosis, the statement about which file is at fault, and the validator transcript with its exit status | PASS if the shared allowance and the silent drop are both named. FAIL if the diagnosis is a per-file length rule, or the affected file is blamed without measurement | 1. Confirm the project total was read, not just the per-skill target. 2. Check that the answer accounts for the skill still being invocable by name, which is the detail that identifies this failure. 3. Confirm the remedy is project-wide trimming rather than an edit to one file |

### Commands

1. `agent: Read the budget table in assets/frontmatter-templates.md and state the per-skill soft target and the project soft-ceiling separately`
2. `agent: Match the reported symptom against the documented drop behavior, including that skills stay invocable when named`
3. `agent: State whether the affected file is necessarily the cause, and describe the remedy`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .opencode/skills/sk-doc/sk-create-frontmatter`

### Expected

Step 1 separates the two numbers. They have different scopes and only one of them explains this symptom. Step 2 matches the report to the documented behavior: over the project total, the longest descriptions are dropped from the available-skills list, the skills remain invocable explicitly, and nothing reports it. Step 3 states that the dropped file is not necessarily the file at fault, since the drop selects the longest entries across the project. Step 4 runs the per-file validator and it passes, which is the negative control for the whole scenario: the instrument that would normally be trusted here is structurally unable to see this failure.

### Evidence

Capture the prompt exactly as typed, both limits as quoted from the budget table with their scopes, the diagnosis, the explicit statement about which file is at fault, the remedy described, and the literal output and exit status of the validator. Record the validator passing, because a passing per-file check alongside a real discovery failure is the evidence that this is a shared-budget problem and not a file problem.

### Pass / Fail

- **Pass**: the project-wide allowance is named as distinct from the per-skill target, the drop is described as silent and as selecting the longest entries, the still-invocable behavior is accounted for, and the remedy is project-wide.
- **Fail**: the answer treats the symptom as a per-file length rule, blames the affected description without measuring it, claims something would have warned, or asserts a cause with no reference to the budget table.

### Failure Triage

1. Confirm the project total was read. A run that only read the per-skill target has one number and cannot explain a file that is inside its own target and still dropped.
2. Check that the still-invocable detail was used. It is the discriminating symptom: a broken file would not stay invocable, and a dropped one does.
3. Confirm the remedy is described as trimming across the project. An edit to one description may not bring the total back under the ceiling, and the scenario is graded on the diagnosis rather than on the size of the edit.
4. If the run claimed a warning exists, re-read the budget section. The absence of a signal at the point of failure is the documented behavior and the reason the trim rules are specific.

### Optional Supplemental Checks

Ask the same run what would happen if a single description exceeded the per-item hard cap. Confirm it names a different consequence from the shared-ceiling drop. A run that gives the same answer to both has collapsed three separate limits into one rule.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`assets/frontmatter-templates.md`](../../assets/frontmatter-templates.md) | Primary implementation anchor, the budget table and the silent-drop paragraph in section 3 |
| [`README.md`](../../README.md) | The silent-budget concept section and the troubleshooting row for a skill that stopped appearing |
| [`SKILL.md`](../../SKILL.md) | The NEVER rule against padding a `description`, and the reason the budget is shared |

---

## 5. SOURCE METADATA

- Group: DESCRIPTION BUDGET
- Playbook ID: FMB-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `description-budget/silent-discovery-drop.md`
