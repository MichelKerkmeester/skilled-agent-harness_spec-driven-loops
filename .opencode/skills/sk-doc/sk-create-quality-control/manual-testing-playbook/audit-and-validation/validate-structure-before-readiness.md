---
title: "QC-002 -- Validate structure before readiness"
description: "This scenario validates the structure-validation path for `QC-002`. It focuses on directory boundaries, filename checks and grouped readiness findings."
version: 1.0.0.1
---

# QC-002 -- Validate structure before readiness

This document captures the operator contract for `QC-002`.

---

## 1. OVERVIEW

This scenario validates the readiness path for an existing skill packet. It checks that `quick_validate.py` receives a directory, that filename case is checked separately and that findings are grouped by severity.

### Why This Matters

The quick validator reads a directory's `SKILL.md`. Passing a file path gives the wrong boundary and can produce a misleading error. Filename case is a separate non-scored signal, so it must not be folded into DQI.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `QC-002` and compare the readiness report with both command outputs.

- Objective: validate a skill packet with the correct directory boundary and a separate filename check
- Realistic user request: `Is this skill packet ready to ship? Run the structure and filename checks and list anything blocking.`
- Prompt: `Is this skill packet ready to ship? Run the structure and filename checks and list anything blocking.`
- Expected execution process: identify the packet directory, run `quick_validate.py` on that directory, run the authored-name checker on its `SKILL.md` and group blockers, warnings and recommendations.
- Expected signals: the quick validator reads the packet directory, the filename check reports its own result and the final report does not merge the filename result into DQI.
- Desired user-visible outcome: a readiness report grounded in the right command boundaries.
- Pass/fail: PASS if both commands run against the intended targets and findings are grouped correctly. FAIL if a file path is passed where a directory is required or filename case changes the DQI score.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Is this skill packet ready to ship? Run the structure and filename checks and list anything blocking.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| QC-002 | Validate structure before readiness | Validate a skill packet with the correct directory boundary and a separate filename check | `Is this skill packet ready to ship? Run the structure and filename checks and list anything blocking.` | 1. `agent: Identify the target packet directory and document type` -> 2. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .opencode/skills/sk-doc/sk-create-quality-control` -> 3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md` -> 4. `agent: Group blockers, warnings, recommendations and the filename signal` | Step 1: the packet directory and SKILL type are named. Step 2: quick validation uses the directory. Step 3: filename case is reported separately. Step 4: readiness findings are grouped and the filename signal is non-scored | The exact prompt, target classification, both command transcripts with exit statuses, grouped report and filename result | PASS if the directory boundary is correct and filename case stays separate from DQI. FAIL if quick validation receives a file path or filename case is treated as a DQI component | 1. Check the quick-validator argument. 2. Check the filename checker target. 3. Confirm the final report labels filename case as non-scored |

### Commands

1. `agent: Identify the target packet directory and document type`
2. `bash: python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py .opencode/skills/sk-doc/sk-create-quality-control`
3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md`
4. `agent: Group blockers, warnings, recommendations and the filename signal`

### Expected

Step 1 identifies the directory and skill document. Step 2 uses the directory boundary required by `quick_validate.py`. Step 3 produces the separate filename signal. Step 4 reports blocking structure issues before warnings and recommendations.

### Evidence

Capture the prompt, target classification, both command outputs and exit statuses and the grouped readiness report.

### Pass / Fail

- **Pass**: quick validation receives a directory, filename case is reported separately and blockers are distinguished from lower-severity findings.
- **Fail**: a file path is passed to quick validation, filename case changes DQI or the report hides a blocker among recommendations.

### Failure Triage

1. Inspect the quick-validator argument and confirm it is a directory.
2. Inspect the filename-check argument and confirm it is the target file.
3. Check the report order for blockers, warnings, recommendations and the separate filename signal.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Structure validation and filename-check workflow |
| [`references/validation-and-enforcement.md`](../../references/validation-and-enforcement.md) | Validation touchpoints and severity order |
| [`../../../shared/scripts/quick_validate.py`](../../../shared/scripts/quick_validate.py) | Directory-level sanity validator |
| [`../../../shared/scripts/check_authored_name_kebab.py`](../../../shared/scripts/check_authored_name_kebab.py) | Non-scored filename checker |

---

## 5. SOURCE METADATA

- Group: AUDIT AND VALIDATION
- Playbook ID: QC-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `audit-and-validation/validate-structure-before-readiness.md`
