---
title: "CMP-002 -- DOCX text comparison"
description: "This scenario validates DOCX text comparison for `CMP-002`. It focuses on extracting paragraph and table text from two `.docx` files and comparing them at text fidelity with an honest warning."
stage: routing
version: 1.0.0.0
---

# CMP-002 -- DOCX text comparison

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CMP-002`.

---

## 1. OVERVIEW

This scenario validates DOCX text comparison for `CMP-002`. It focuses on extracting paragraph and table text from two `.docx` files and comparing them at text fidelity with an honest warning.

### Why This Matters

Word documents carry styling, tracked changes, and layout the engine cannot faithfully diff, so the honest contract is to compare only the paragraph and table text and to say so plainly. Users who diff `.docx` files must not be misled into thinking formatting or tracked-changes were compared. This scenario proves the extraction reaches paragraph and table text, the summary is labelled `docx, tier text`, and the fidelity warning is present so trust is calibrated correctly.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMP-002` and confirm the expected signals without contradictory evidence.

- Objective: extract paragraph and table text from two `.docx` files and compare them at text fidelity with an honest warning
- Real user request: `Diff these two Word documents and tell me what text changed.`
- Prompt: `Diff these two Word documents and tell me what text changed.`
- Expected execution process: because there are no shipped `.docx` fixtures, the operator supplies two small sample `.docx` files that differ in body text; the engine extracts paragraph and table text from each, compares at text fidelity via `compare-pair`, writes a report, and emits a fidelity warning.
- Expected signals: a `docx, tier text` summary line, a fidelity warning that formatting and tracked-changes are not compared, a written report path, and a validator `PASS`.
- Desired user-visible outcome: a report of the textual changes plus a clear statement that styling was not compared.
- Pass/fail: PASS if the summary reports `docx, tier text`, the fidelity warning is present, the report is written, and the validator returns `PASS`; FAIL if the tier is misreported, the warning is absent, no report is produced, or the validator returns `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Diff these two Word documents and tell me what text changed.`

### Commands

1. `python3 scripts/create_diff.py compare-pair --before /tmp/before.docx --after /tmp/after.docx --report /tmp/docx-diff.html`
2. `python3 scripts/validate_report.py /tmp/docx-diff.html`

### Expected

Step 1 prints a `Compared before.docx → after.docx (docx, tier text)` summary with the change counts, a fidelity warning that formatting and tracked-changes are not compared, and `  report: /tmp/docx-diff.html`, exiting `0`. Step 2 prints `PASS` and exits `0`. (Before step 1, place two small sample `.docx` files at `/tmp/before.docx` and `/tmp/after.docx` that differ in body text — there are no shipped `.docx` fixtures.)

### Evidence

Capture the full stdout of step 1 including the `docx, tier text` summary and the fidelity warning text, the step 1 exit code, the step 2 validator verdict, and the generated `/tmp/docx-diff.html` path. Record the two supplied `.docx` inputs used so the run is reproducible.

### Pass / Fail

- **Pass**: step 1 exits `0` with a `docx, tier text` summary and a fidelity warning about formatting/tracked-changes, a report is written, and step 2 returns `PASS`.
- **Fail**: the tier is not `text`, the fidelity warning is missing, no report is written, or step 2 returns `FAIL`.

### Failure Triage

1. Confirm both supplied files are genuine `.docx` (Office Open XML) documents and not renamed `.doc` or RTF files that the paragraph/table extractor cannot read.
2. Confirm the two inputs actually differ in body text; identical text yields an empty diff and can look like a failure.
3. If extraction fails (exit `5`), open each file in a word processor to confirm it is not corrupt, then re-run step 1 and inspect the error message.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/comparison-engine/multi-format-extraction.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/create_diff.py` | Primary implementation anchor |
| `scripts/validate_report.py` | Validation anchor |

---

## 5. SOURCE METADATA

- Group: COMPARISON
- Playbook ID: CMP-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `comparison/docx-text-comparison.md`
