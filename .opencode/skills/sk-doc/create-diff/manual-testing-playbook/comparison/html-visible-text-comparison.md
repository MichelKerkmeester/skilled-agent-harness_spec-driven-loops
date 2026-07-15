---
title: "CMP-004 -- HTML visible-text comparison"
description: "This scenario validates HTML visible-text comparison for `CMP-004`. It focuses on extracting only visible text from HTML (scripts and styles dropped) and comparing it at text fidelity."
stage: routing
version: 1.0.0.0
---

# CMP-004 -- HTML visible-text comparison

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CMP-004`.

---

## 1. OVERVIEW

This scenario validates HTML visible-text comparison for `CMP-004`. It focuses on extracting only visible text from HTML (scripts and styles dropped) and comparing it at text fidelity.

### Why This Matters

HTML mixes user-visible prose with `<script>` and `<style>` content that is never on the page, and comparing raw markup would both mislead the user and risk pulling hostile script text into the diff. The honest contract is to drop `<script>` and `<style>`, compare only visible text at text fidelity, and warn that markup was not compared. This scenario proves script/style content is excluded and never leaks or executes, keeping the HTML path both accurate and safe.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMP-004` and confirm the expected signals without contradictory evidence.

- Objective: extract only visible text from HTML (scripts and styles dropped) and compare it at text fidelity
- Real user request: `What text changed between these two HTML pages?`
- Prompt: `What text changed between these two HTML pages?`
- Expected execution process: the operator supplies two small `.html` files where at least one contains a `<script>` and/or `<style>` block; the engine strips those blocks, extracts the remaining visible text, compares at text fidelity via `compare-pair`, writes a report, and emits a fidelity warning.
- Expected signals: an `html, tier text` summary line, the script/style content excluded from the comparison, a fidelity warning that markup was not compared, a written report path, and a validator `PASS`.
- Desired user-visible outcome: a report of the visible-text changes that does not leak or execute page scripts.
- Pass/fail: PASS if the summary reports `html, tier text`, the `<script>`/`<style>` content is absent from the diff, the fidelity warning is present, and the validator returns `PASS`; FAIL if script/style text appears in the diff, the tier is misreported, or the validator returns `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What text changed between these two HTML pages?`

### Commands

1. `python3 scripts/create_diff.py compare-pair --before /tmp/before.html --after /tmp/after.html --report /tmp/html-diff.html`
2. `python3 scripts/validate_report.py /tmp/html-diff.html`

### Expected

Step 1 prints a `Compared before.html → after.html (html, tier text)` summary with change counts drawn only from visible text, a fidelity warning that markup was not compared, and a written report path, exiting `0`; the `<script>`/`<style>` content does not appear in the reported changes. Step 2 prints `PASS` and exits `0`. (Before step 1, supply two small `.html` files at `/tmp/before.html` and `/tmp/after.html` where at least one contains a `<script>` and/or `<style>` block; there are no shipped `.html` fixtures.)

### Evidence

Capture the full step 1 stdout including the `html, tier text` summary and the fidelity warning, the step 1 exit code, the step 2 validator verdict, and the generated `/tmp/html-diff.html` path. Confirm by inspection that the script/style text from the inputs is not present anywhere in the reported diff.

### Pass / Fail

- **Pass**: step 1 exits `0` with an `html, tier text` summary, the `<script>`/`<style>` content is excluded from the diff, the fidelity warning is present, and step 2 returns `PASS`.
- **Fail**: script/style text appears in the reported changes, the tier is not `text`, the warning is missing, or step 2 returns `FAIL`.

### Failure Triage

1. Confirm at least one input actually contains a `<script>` or `<style>` block so the exclusion behavior is exercised.
2. Search the step 1 output and the generated report for the script/style text; if it appears, the extractor is not dropping those blocks.
3. Confirm both files are well-formed HTML and differ in visible text; identical visible text yields an empty diff regardless of markup.

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
- Playbook ID: CMP-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `comparison/html-visible-text-comparison.md`
