---
title: "CMP-003 -- PDF text comparison"
description: "This scenario validates PDF text comparison for `CMP-003`. It focuses on extracting and comparing the text layer of two PDFs when an extractor is available and failing cleanly when none is present."
stage: routing
version: 1.0.0.0
---

# CMP-003 -- PDF text comparison

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CMP-003`.

---

## 1. OVERVIEW

This scenario validates PDF text comparison for `CMP-003`. It focuses on extracting and comparing the text layer of two PDFs when an extractor is available and failing cleanly when none is present.

### Why This Matters

PDF extraction is the one comparison path with an external dependency: it needs `pdftotext`, `pypdf`, or `pdfplumber`, and scanned image-only PDFs have no text layer at all. The honest contract is to compare the text layer when an extractor is present and to refuse — cleanly, with exit `3` and an actionable message — when it is not, rather than fabricating a diff. This scenario proves both branches so the feature never lies about what it could read.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMP-003` and confirm the expected signals without contradictory evidence.

- Objective: extract and compare the text layer of two PDFs when an extractor is available, and fail cleanly with an actionable message when none is present
- Real user request: `Compare the text of these two PDF exports.`
- Prompt: `Compare the text of these two PDF exports.`
- Expected execution process: the operator first checks `capabilities` for a detected PDF extractor, then supplies two small text-based PDFs; with an extractor present the engine extracts and compares the text layer via `compare-pair` and writes a report; with no extractor present the engine exits `3` and points the user at the explicit-pair fallback.
- Expected signals: with an extractor, a `pdf, tier text*` summary, a written report, and a validator `PASS`; with no extractor, exit `3` and an actionable message (no fabricated diff, no report).
- Desired user-visible outcome: a text diff of the PDFs, or a clear, non-fabricated explanation of why it could not run.
- Pass/fail: PASS if (extractor present) the summary reports `pdf, tier text*` and the validator returns `PASS`, OR (extractor absent) the run exits `3` with a clear message and produces no report — a documented SKIP; FAIL if a diff is fabricated when no extractor is present, or the run crashes with an unhandled error.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Compare the text of these two PDF exports.`

### Commands

1. `python3 scripts/create_diff.py capabilities`
2. `python3 scripts/create_diff.py compare-pair --before /tmp/before.pdf --after /tmp/after.pdf --report /tmp/pdf-diff.html`
3. `python3 scripts/validate_report.py /tmp/pdf-diff.html`

### Expected

Step 1 shows the format matrix including the detected PDF extractor (or none). When step 1 reports an extractor, step 2 prints a `Compared before.pdf → after.pdf (pdf, tier text*)` summary with counts and a written report, exiting `0`, and step 3 returns `PASS`. When step 1 reports no extractor, step 2 exits `3` with an actionable message pointing to the explicit-pair fallback, writes no report, and step 3 is skipped. (Before step 2, supply two small text-based — not scanned — PDFs at `/tmp/before.pdf` and `/tmp/after.pdf`; there are no shipped `.pdf` fixtures.)

### Evidence

Capture the step 1 `capabilities` output showing the detected extractor (or its absence), the full step 2 stdout and exit code, the step 3 validator verdict when applicable, and the generated `/tmp/pdf-diff.html` path when a report is produced. Record which extractor (`pdftotext`/`pypdf`/`pdfplumber`) was available and the two supplied PDF inputs.

### Pass / Fail

- **Pass**: with an extractor present, step 2 exits `0` with a `pdf, tier text*` summary and step 3 returns `PASS`; OR with no extractor present, step 2 exits `3` with a clear actionable message and no report (documented SKIP).
- **Fail**: step 2 fabricates a diff or writes a report when no extractor is present, or the run crashes with an unhandled error instead of exit `3`.

### Failure Triage

1. Re-read the step 1 `capabilities` output to confirm whether a PDF extractor is actually detected before judging step 2.
2. If step 2 exits `5` with an extractor present, confirm the supplied PDFs carry a real text layer — a scanned/image-only PDF is flagged and OCR is out of scope.
3. Install one of `pdftotext`, `pypdf`, or `pdfplumber` and re-run steps 1-2 to exercise the extractor-present branch.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/safety-and-capabilities/capability-tier-reporting.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/create_diff.py` | Primary implementation anchor |
| `scripts/validate_report.py` | Validation anchor |

---

## 5. SOURCE METADATA

- Group: COMPARISON
- Playbook ID: CMP-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `comparison/pdf-text-comparison.md`
