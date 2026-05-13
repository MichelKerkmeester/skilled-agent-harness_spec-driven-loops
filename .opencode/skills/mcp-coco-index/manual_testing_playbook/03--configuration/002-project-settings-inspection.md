---
title: "CFG-002 -- Project settings inspection"
description: "This scenario validates Project settings inspection for `CFG-002`. It focuses on Verify project settings contain language extension patterns."
---

# CFG-002 -- Project settings inspection

## 1. OVERVIEW

This scenario validates Project settings inspection for `CFG-002`. It focuses on Verify project settings contain language extension patterns.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CFG-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify project settings contain language extension patterns
- Real user request: `Please verify project settings contain language extension patterns.`
- Prompt: `Verify project CocoIndex settings include multi-language include_patterns; return pass/fail with reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `CFG-002`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: `include_patterns` field present; contains code-language extension patterns (e.g., `*.py`, `*.ts`, `*.js`, `*.go`, `*.rs`, etc.); docs/spec formats are not required in the default include set; repo-local spec/changelog paths are excluded when present.
- Desired user-visible outcome: A concise user-visible PASS/PARTIAL/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if `include_patterns` contains the current code-oriented language extension set and does not require docs/spec formats; PARTIAL if code patterns are present but known language defaults are missing; FAIL if `include_patterns` is missing


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CFG-002 | Project settings inspection | Verify project settings contain language extension patterns | `Verify project CocoIndex settings include multi-language include_patterns; return pass/fail with reason.` | 1. `bash: cat .cocoindex_code/settings.yml` -> 2. Locate `include_patterns` and `exclude_patterns` fields -> 3. Confirm the include set is code-oriented and spec/changelog excludes are present when checked-in settings are used | `include_patterns` field present; contains code-language extension patterns (e.g., `*.py`, `*.ts`, `*.js`, `*.go`, `*.rs`, etc.); docs/spec formats are not required in the default include set; repo-local spec/changelog paths are excluded when present | Contents of `settings.yml` with include_patterns and exclude_patterns sections; count of code extension patterns | PASS if `include_patterns` contains the current code-oriented language extension set and does not require docs/spec formats; PARTIAL if code patterns are present but known language defaults are missing; FAIL if `include_patterns` is missing | Run `ccc init -f` to regenerate defaults; compare against supported languages in tool_reference.md and checked-in project settings |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--configuration/002-project-settings-inspection.md`
