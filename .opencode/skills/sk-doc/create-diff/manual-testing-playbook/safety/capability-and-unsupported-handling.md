---
title: "SAFE-004 -- Capability reporting and unsupported handling"
description: "This scenario validates capability reporting and unsupported handling for `SAFE-004`. It focuses on confirming `capabilities` reports the format matrix and detected PDF extractor, and that unsupported or limited cases fail honestly."
stage: routing
version: 1.0.0.0
---

# SAFE-004 -- Capability reporting and unsupported handling

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SAFE-004`.

---

## 1. OVERVIEW

This scenario validates capability reporting and unsupported handling for `SAFE-004`. It focuses on confirming `capabilities` reports the format matrix and detected PDF extractor, and that unsupported or limited cases fail honestly.

### Why This Matters

Trust in a comparison tool depends on it being honest about what it can and cannot do. Users need an accurate capability matrix — which formats compare at full fidelity, which at text fidelity, and whether a PDF extractor is even installed — and they need unsupported input to fail with exit `3` rather than a fabricated diff. This scenario proves `capabilities` reports the true five-format matrix and detected extractor, and that an unsupported format refuses cleanly instead of inventing a result.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SAFE-004` and confirm the expected signals without contradictory evidence.

- Objective: confirm `capabilities` reports the format matrix and detected PDF extractor, and that an unsupported or limited case exits `3` rather than fabricating a diff
- Real user request: `What document formats can this compare, and how well?`
- Prompt: `What document formats can this compare, and how well?`
- Expected execution process: the operator runs `capabilities` (and `capabilities --json`) to read the format/tier matrix and the detected PDF extractor, then attempts to compare an unsupported format and confirms the engine exits `3` with no report.
- Expected signals: the five formats with their tiers (text=full, markdown=full, html=text, docx=text, pdf=text*) and the detected PDF extractor (or its absence); an unsupported comparison exits `3` and writes no report.
- Desired user-visible outcome: an accurate capability matrix and honest failure on unsupported input.
- Pass/fail: PASS if `capabilities` lists the five formats with correct tiers and the detected extractor, and the unsupported comparison exits `3` with no fabricated diff; FAIL if the matrix is wrong or incomplete, or the unsupported case produces a diff/report instead of exit `3`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What document formats can this compare, and how well?`

### Commands

1. `python3 scripts/create_diff.py capabilities`
2. `python3 scripts/create_diff.py capabilities --json`
3. `python3 scripts/create_diff.py compare-pair --before /tmp/before.xlsx --after /tmp/after.xlsx --report /tmp/unsupported.html`

### Expected

Step 1 prints the format matrix listing text (full), markdown (full), html (text), docx (text), and pdf (text*), plus the detected PDF extractor or a note that none is available. Step 2 emits the same information as a JSON object suitable for scripting, consistent with the step 1 human output. Step 3, given an unsupported format such as `.xlsx`, exits `3` with a message that the format is unsupported and writes no `/tmp/unsupported.html` — it does not fabricate a diff. (Supply the two `.xlsx` inputs, or substitute any other unsupported format.)

### Evidence

Capture the step 1 human-readable matrix, the step 2 `--json` object, and the step 3 stdout plus its exit code `3` and confirmation that no report was written. Record which PDF extractor (if any) `capabilities` reported as detected.

### Pass / Fail

- **Pass**: steps 1-2 list all five formats with correct tiers and a consistent detected-extractor status, and step 3 exits `3` with no report.
- **Fail**: the matrix omits a format or reports a wrong tier, the JSON disagrees with the human output, or step 3 produces a diff/report instead of exit `3`.

### Failure Triage

1. Cross-check the step 1 human matrix against the step 2 `--json` object field by field; any disagreement between them is a reporting bug.
2. Confirm the step 3 input is genuinely an unsupported format and confirm the exit code is exactly `3` (unsupported), not `5` (I/O/extraction failure).
3. If the detected-extractor status looks wrong, verify whether `pdftotext`, `pypdf`, or `pdfplumber` is actually installed on `PATH` and re-run step 1.

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

- Group: SAFETY
- Playbook ID: SAFE-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `safety/capability-and-unsupported-handling.md`
