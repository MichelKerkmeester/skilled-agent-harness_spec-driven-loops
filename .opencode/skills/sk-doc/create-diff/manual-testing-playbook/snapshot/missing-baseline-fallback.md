---
title: "SNAP-002 -- Missing baseline routes to fallback"
description: "This scenario validates missing-baseline fallback for `SNAP-002`. It focuses on confirming `compare` with no stored baseline exits `4` and that the explicit-pair fallback works instead."
stage: routing
version: 1.0.0.0
---

# SNAP-002 -- Missing baseline routes to fallback

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SNAP-002`.

---

## 1. OVERVIEW

This scenario validates missing-baseline fallback for `SNAP-002`. It focuses on confirming `compare` with no stored baseline exits `4` and that the explicit-pair fallback works instead.

### Why This Matters

Users often reach for a diff after the edit has already happened, with no baseline ever captured. The honest behavior is to refuse cleanly with exit `4` and point them at the explicit-pair path rather than inventing a "before" or silently comparing a file to itself. This scenario proves the no-baseline branch is unambiguous and that `compare-pair` provides a working way forward, so a missing baseline is a redirect, not a dead end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SNAP-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm `compare` with no stored baseline exits `4` with guidance, and that the explicit-pair fallback produces a report instead
- Real user request: `Diff this file — oh, I never saved a baseline.`
- Prompt: `Diff this file — oh, I never saved a baseline.`
- Expected execution process: the operator runs `compare` against an empty state store so no baseline exists; the engine exits `4` with a "no baseline" message pointing to the explicit-pair fallback; the operator then runs `compare-pair` with two explicit files, which produces a report the validator confirms safe.
- Expected signals: `compare` exit `4` with actionable "no baseline" guidance and no report, followed by a `compare-pair` report and a validator `PASS`.
- Desired user-visible outcome: a clear "no baseline" message and a working fallback path.
- Pass/fail: PASS if `compare` exits `4` with guidance and writes no report, and `compare-pair` then produces a report that validates `PASS`; FAIL if `compare` fabricates a diff, exits with a different code, or the fallback fails to produce a valid report.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Diff this file — oh, I never saved a baseline.`

### Commands

1. `python3 scripts/create_diff.py compare /tmp/nobaseline.md --state-dir /tmp/empty-store`
2. `python3 scripts/create_diff.py compare-pair --before /tmp/a.md --after /tmp/b.md --report /tmp/pair.html`
3. `python3 scripts/validate_report.py /tmp/pair.html`

### Expected

Step 1, run against the empty state store `/tmp/empty-store` (no prior snapshot for the file), exits `4` and prints a "no baseline" message pointing the user at the explicit-pair fallback; no report is written. Step 2 compares two explicit files, prints a summary with change counts, writes `/tmp/pair.html`, and exits `0`. Step 3 prints `PASS` and exits `0`. (Supply `/tmp/a.md` and `/tmp/b.md` as two small files that differ.)

### Evidence

Capture the step 1 stdout and its exit code `4`, confirmation that no report file was written by step 1, the step 2 summary and report path, and the step 3 validator verdict. Record the two fallback inputs used.

### Pass / Fail

- **Pass**: step 1 exits `4` with a clear "no baseline" message and no report, step 2 writes a report (exit `0`), and step 3 returns `PASS`.
- **Fail**: step 1 fabricates a diff, exits with any code other than `4`, or writes a report; or step 2/3 fails to produce a valid report.

### Failure Triage

1. Confirm `/tmp/empty-store` contains no prior snapshot for the target file; a leftover baseline would make step 1 succeed instead of exiting `4`.
2. Confirm the step 1 exit code is exactly `4` (missing baseline) and not `5` (I/O/extraction) — the latter points to a file/permission problem, not the intended branch.
3. Confirm `/tmp/a.md` and `/tmp/b.md` exist and differ so the fallback in step 2 produces a non-empty, valid report.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/snapshot-lifecycle/explicit-pair-comparison.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/create_diff.py` | Primary implementation anchor |
| `scripts/validate_report.py` | Validation anchor |

---

## 5. SOURCE METADATA

- Group: SNAPSHOT
- Playbook ID: SNAP-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `snapshot/missing-baseline-fallback.md`
