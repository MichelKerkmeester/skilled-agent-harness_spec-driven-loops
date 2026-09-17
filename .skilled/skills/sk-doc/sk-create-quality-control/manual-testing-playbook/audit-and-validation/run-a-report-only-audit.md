---
title: "QC-001 -- Run a report-only audit"
description: "This scenario validates the report-only audit path for `QC-001`. It focuses on extraction evidence, DQI reporting, HVR review and no edits."
version: 1.0.0.3
---

# QC-001 -- Run a report-only audit

This document captures the operator contract for `QC-001`.

---

## 1. OVERVIEW

This scenario validates the default audit path for an existing `SKILL.md`. It checks target reading, structure extraction, DQI evidence, HVR review and the report-only mutation boundary.

### Why This Matters

A DQI score is an observed result from `extract_structure.py`. A report that gives a score without the JSON output cannot be checked. A report-only request also must not change the target.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `QC-001` and compare the report with the observed script output.

- Objective: run a report-only audit with extraction evidence and no target edit
- Realistic user request: `Please audit this existing skill file for structure, DQI and human voice issues. Leave the file unchanged.`
- Prompt: `Audit this existing SKILL.md for structure, DQI and human voice issues. Do not edit it.`
- Expected execution process: read the target, select report-only audit, run structure extraction, group blockers, warnings and recommendations, then apply HVR review after extraction.
- Expected signals: the report names the detected type, metrics, checklist results, DQI score, quality band, HVR issues and unchanged working-tree state.
- Desired user-visible outcome: a concise report with observed quality evidence and no edit.
- Pass/fail: PASS if extraction output is cited, HVR is reviewed after structure and the target is unchanged. FAIL if a DQI score is asserted without extraction or the target is edited.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Audit this existing SKILL.md for structure, DQI and human voice issues. Do not edit it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| QC-001 | Run a report-only audit | Run a report-only audit with extraction evidence and no target edit | `Audit this existing SKILL.md for structure, DQI and human voice issues. Do not edit it.` | 1. `agent: Read .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md` -> 2. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md` -> 3. `agent: Report the detected type, metrics, checklist, DQI, quality band and HVR findings` -> 4. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md` | Step 1: the target is read before judgment. Step 2: JSON extraction output is present. Step 3: DQI is tied to the JSON and HVR follows structure review. Step 4: empty output | The exact prompt, target path, extraction JSON, report, HVR findings, status output and exit statuses | PASS if the score is taken from extraction, HVR is separate and the target is unchanged. FAIL if the score is guessed, HVR replaces structure review or the target changes | 1. Confirm the extraction command used the target file. 2. Check that the DQI score and band appear in the JSON output. 3. Compare the before and after status outputs |

### Commands

1. `agent: Read .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md`
2. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md`
3. `agent: Report the detected type, metrics, checklist, DQI, quality band and HVR findings`
4. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md`

### Expected

Step 1 confirms the existing target. Step 2 produces the source JSON. Step 3 reports the structure result first, then HVR findings and recommendations. Step 4 proves the report-only boundary.

### Evidence

Capture the prompt, target path, full extraction output, DQI score, quality band, HVR findings and status output with exit statuses.

### Pass / Fail

- **Pass**: the DQI score comes from extraction output, HVR is reviewed after structure and the target remains unchanged.
- **Fail**: a score is claimed without extraction, HVR substitutes for structural evidence or the report-only path edits the target.

### Failure Triage

1. Verify the extraction command and target path.
2. Find the DQI and quality-band fields in the JSON output.
3. Compare the target status before and after the audit.

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
| [`SKILL.md`](../../SKILL.md) | Report-only workflow and extraction rule |
| [`references/workflows.md`](../../references/workflows.md) | Mode selection and report-only output |
| [`../../../shared/scripts/extract_structure.py`](../../../shared/scripts/extract_structure.py) | Structure and DQI producer |

---

## 5. SOURCE METADATA

- Group: AUDIT AND VALIDATION
- Playbook ID: QC-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `audit-and-validation/run-a-report-only-audit.md`
