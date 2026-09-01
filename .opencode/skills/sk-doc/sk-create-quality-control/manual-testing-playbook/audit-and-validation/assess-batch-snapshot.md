---
title: "QC-006 -- Assess a batch snapshot"
description: "This scenario validates batch snapshot assessment for `QC-006`. It focuses on per-file extraction, DQI reporting, blockers and recommendations without edits."
version: 1.0.0.0
---

# QC-006 -- Assess a batch snapshot

This document captures the operator contract for `QC-006`.

---

## 1. OVERVIEW

This scenario validates the batch snapshot mode for multiple existing markdown documents. It checks that the mode extracts each requested file and summarizes its type, DQI, blockers and top recommendations without editing either target.

### Why This Matters

A batch result can hide a weak document when the report gives only one combined score. Per-file evidence shows which document needs attention.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `QC-006` and compare each report entry with the matching extraction output.

- Objective: assess two existing markdown files in batch snapshot mode with per-file evidence and no edits
- Realistic user request: `Assess these two existing markdown files in batch snapshot mode. Extract each file, report its type, DQI, blockers and top recommendations, and do not edit either file.`
- Prompt: `Assess these two existing markdown files in batch snapshot mode. Extract each file, report its type, DQI, blockers and top recommendations, and do not edit either file.`
- Expected execution process: identify batch snapshot mode, read both targets, run structure extraction for each file, summarize each result and confirm that neither target changed.
- Expected signals: both files have separate extraction output, each report entry names its detected type, DQI, blockers and top recommendations and the final status check shows no target edits.
- Desired user-visible outcome: one batch report with a verifiable result for each requested file and no unauthorized change.
- Pass/fail: PASS if both files have separate extraction-backed entries and the targets remain unchanged. FAIL if the mode skips a file, reports only an aggregate result, claims a score without extraction or edits a target.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Assess these two existing markdown files in batch snapshot mode. Extract each file, report its type, DQI, blockers and top recommendations, and do not edit either file.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| QC-006 | Assess a batch snapshot | Assess two existing markdown files with one per-file quality summary and no edits | `Assess these two existing markdown files in batch snapshot mode. Extract each file, report its type, DQI, blockers and top recommendations, and do not edit either file.` | 1. `agent: Read .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md and select Batch snapshot` -> 2. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md` -> 3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` -> 4. `agent: Summarize each extraction with its type, DQI, blockers and top recommendations` -> 5. `bash: git -c core.fsmonitor=false status --porcelain -- .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md .opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` | Step 1: batch snapshot mode is selected. Steps 2 and 3: each target returns extraction JSON. Step 4: the report has one entry per file with type, DQI, blockers and top recommendations. Step 5: empty output shows neither target changed | The exact prompt, both target paths, both extraction JSON outputs, the per-file report, the status output and each exit status | PASS if both target files have separate extraction-backed summaries and the status check is empty. FAIL if one target is absent, the report has only one combined result or either file changes | 1. Check that both paths were passed to extraction. 2. Match each report entry to its file output. 3. Compare the status result with the pre-run baseline |

### Commands

1. `agent: Read .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md and select Batch snapshot`
2. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md`
3. `bash: python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`
4. `agent: Summarize each extraction with its type, DQI, blockers and top recommendations`
5. `bash: git -c core.fsmonitor=false status --porcelain -- .opencode/skills/sk-doc/sk-create-quality-control/SKILL.md .opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`

### Expected

Step 1 selects batch snapshot mode. Steps 2 and 3 produce separate extraction outputs. Step 4 reports one result for each file. Step 5 confirms that the report-only mode did not edit either target.

### Evidence

Capture the exact prompt, both target paths, the full extraction output for each file, the per-file summary and the status output with exit statuses.

### Pass / Fail

- **Pass**: both target files have separate extraction-backed summaries and neither target changes.
- **Fail**: the mode skips a target, reports only an aggregate result, claims a score without extraction or edits either target.

### Failure Triage

1. Confirm that the two extraction commands used different target paths.
2. Match each DQI and blocker summary to its source JSON.
3. Compare the final status with the pre-run baseline before rerunning the batch assessment.

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
| [`SKILL.md`](../../SKILL.md) | Batch snapshot mode and per-file reporting |
| [`references/workflows.md`](../../references/workflows.md) | Batch snapshot workflow details |
| [`../../../shared/scripts/extract_structure.py`](../../../shared/scripts/extract_structure.py) | Structure and DQI producer |

---

## 5. SOURCE METADATA

- Group: AUDIT AND VALIDATION
- Playbook ID: QC-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `audit-and-validation/assess-batch-snapshot.md`
