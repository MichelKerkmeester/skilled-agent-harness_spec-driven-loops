---
title: "SAFE-001 -- Report is self-contained and zero-JS"
description: "This scenario validates the self-contained zero-JS report for `SAFE-001`. It focuses on confirming a generated report passes the safety validator: correct doctype, `lang`, CSP, no scripts, and no remote references."
stage: routing
version: 1.0.0.0
---

# SAFE-001 -- Report is self-contained and zero-JS

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SAFE-001`.

---

## 1. OVERVIEW

This scenario validates the self-contained zero-JS report for `SAFE-001`. It focuses on confirming a generated report passes the safety validator: correct doctype, `lang`, CSP, no scripts, and no remote references.

### Why This Matters

The report is meant to be opened offline, from disk, with no network access and no executable code — that is the whole safety promise of the format. If a report ever ships inline JavaScript, a remote stylesheet, or a missing CSP, it becomes a channel for exfiltration or execution the moment a user opens it. This scenario runs the shipped validator over a real report to prove the doctype, `lang`, CSP, zero-`<script>`, and no-remote-reference guarantees hold on every generated artifact.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SAFE-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm a generated report passes the safety validator — correct doctype, `<html lang>`, CSP meta, no scripts, no inline handlers, and no remote references
- Real user request: `Make sure the diff report is safe to open and doesn't call out to the internet.`
- Prompt: `Make sure the diff report is safe to open and doesn't call out to the internet.`
- Expected execution process: the operator generates any report (using the shipped fixtures), runs `validate_report.py` over it, and confirms by inspection that CSS is inlined and there are no `<script>` tags or remote `href`/`src` in the markup.
- Expected signals: a validator `PASS` (exit `0`), inlined CSS, zero `<script>` tags, no inline event handlers, and no remote `href`/`src` in real markup.
- Desired user-visible outcome: a validator `PASS` and a report that works fully offline.
- Pass/fail: PASS if the validator returns `PASS` (exit `0`) and inspection confirms inlined CSS, zero scripts, and no remote references; FAIL if the validator returns `FAIL`, or inspection finds a `<script>` tag, an inline handler, or a remote `href`/`src`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Make sure the diff report is safe to open and doesn't call out to the internet.`

### Commands

1. `python3 scripts/create_diff.py compare-pair --before assets/fixtures/onboarding-before.md --after assets/fixtures/onboarding-after.md --report /tmp/safe.html`
2. `python3 scripts/validate_report.py /tmp/safe.html`

### Expected

Step 1 writes a self-contained report to `/tmp/safe.html` and exits `0`. Step 2 checks the doctype, `<html lang>`, CSP meta, absence of `<script>` tags and inline handlers, and absence of remote `href`/`src` in real markup, then prints `PASS` and exits `0`. Inspecting `/tmp/safe.html` confirms the CSS is inlined and no network references are present.

### Evidence

Capture the step 1 report path and exit code, the full step 2 validator output including its `PASS` verdict and exit `0`, and the results of a manual inspection (for example a search of `/tmp/safe.html` for `<script`, `on*=` handlers, and `http://`/`https://` in real markup).

### Pass / Fail

- **Pass**: step 2 returns `PASS` (exit `0`) and inspection of the step 1 report confirms inlined CSS, zero `<script>` tags, no inline handlers, and no remote references.
- **Fail**: step 2 returns `FAIL`, or inspection of the report finds a `<script>` tag, an inline event handler, or a remote `href`/`src`.

### Failure Triage

1. Re-read the step 2 validator output to see which specific check failed (doctype, `lang`, CSP, script, or remote reference) and inspect that region of `/tmp/safe.html`.
2. Distinguish real markup from escaped content: a `&lt;script&gt;` inside the diff body is escaped text and is expected; a live `<script>` element in the page structure is a real FAIL.
3. Confirm step 1 completed and actually wrote `/tmp/safe.html` before running step 2; validating a stale or missing file gives a misleading verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/safety-and-capabilities/report-safety-validation.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/validate_report.py` | Primary implementation anchor |
| `scripts/create_diff.py` | Validation anchor |

---

## 5. SOURCE METADATA

- Group: SAFETY
- Playbook ID: SAFE-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `safety/self-contained-zero-js-report.md`
