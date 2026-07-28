---
title: "SNAP-001 -- Baseline capture then compare"
description: "This scenario validates baseline capture then compare for `SNAP-001`. It focuses on the capture-before-edit invariant: snapshot a file, edit it, then compare against the stored baseline."
stage: routing
version: 1.0.0.0
---

# SNAP-001 -- Baseline capture then compare

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SNAP-001`.

---

## 1. OVERVIEW

This scenario validates baseline capture then compare for `SNAP-001`. It focuses on the capture-before-edit invariant: snapshot a file, edit it, then compare against the stored baseline.

### Why This Matters

The core value of the snapshot workflow is letting a user capture a known-good baseline before handing a document to an AI or a risky edit, then seeing exactly what changed afterward. That only works if `snapshot` durably stores the pre-edit content and `compare` reliably uses the latest snapshot as the "before". This scenario proves the capture-before-edit invariant end to end and confirms the snapshot store materializes without ever writing back to the source.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SNAP-001` and confirm the expected signals without contradictory evidence.

- Objective: verify the capture-before-edit invariant — snapshot a file, edit it, then compare against the stored baseline
- Real user request: `Save a baseline of this doc before I let the AI edit it, then show me the diff afterward.`
- Prompt: `Save a baseline of this doc before I let the AI edit it, then show me the diff afterward.`
- Expected execution process: the operator copies a document into a scratch path, runs `snapshot` to store the pre-edit baseline in the state store, edits the scratch file, then runs `compare`, which uses the latest snapshot as the "before" and writes a report reflecting the edit.
- Expected signals: a stored content-addressed baseline under the state store, a `compare` report that reflects the post-snapshot edit, and a validator `PASS`.
- Desired user-visible outcome: a correct diff between the pre-edit baseline and the edited file.
- Pass/fail: PASS if the snapshot is stored, `compare` produces a report reflecting the edit against the pre-edit baseline, and the validator returns `PASS`; FAIL if no baseline is stored, the diff does not reflect the edit, or the source file is modified by any step.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Save a baseline of this doc before I let the AI edit it, then show me the diff afterward.`

### Commands

1. `python3 scripts/create_diff.py snapshot /tmp/doc.md --state-dir /tmp/cd-store`
2. `python3 scripts/create_diff.py compare /tmp/doc.md --state-dir /tmp/cd-store --report /tmp/snap-diff.html`
3. `python3 scripts/validate_report.py /tmp/snap-diff.html`

### Expected

Before step 1, copy a document to `/tmp/doc.md` (for example `cp assets/fixtures/onboarding-before.md /tmp/doc.md`). Step 1 stores a content-addressed baseline under `/tmp/cd-store` and exits `0`. Between steps 1 and 2, edit `/tmp/doc.md`. Step 2 uses the latest snapshot as the "before", prints a summary and change counts reflecting that edit, writes `/tmp/snap-diff.html`, and exits `0`. Step 3 prints `PASS` and exits `0`.

### Evidence

Capture the step 1 stdout and exit code, a listing of `/tmp/cd-store` showing the stored baseline, the exact edit made to `/tmp/doc.md`, the step 2 summary and report path, and the step 3 validator verdict. Record the source checksum before step 1 and after step 2 to prove the source was only read.

### Pass / Fail

- **Pass**: step 1 stores a baseline (exit `0`), step 2 produces a report reflecting the edit against the stored baseline (exit `0`), and step 3 returns `PASS`.
- **Fail**: no baseline is stored, step 2's diff does not reflect the edit, the source checksum changes across steps, or step 3 returns `FAIL`.

### Failure Triage

1. Confirm the same `--state-dir` is passed to both `snapshot` and `compare`; a mismatched store makes `compare` see no baseline and exit `4`.
2. Confirm an edit was actually made to `/tmp/doc.md` between steps 1 and 2; an unedited file yields an empty diff, not a failure of the invariant.
3. Compare the source checksum from before step 1 with the value after step 2; any change indicates the source was mutated and is an immediate FAIL.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/snapshot-lifecycle/baseline-snapshot-and-compare.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/create_diff.py` | Primary implementation anchor |
| `scripts/validate_report.py` | Validation anchor |

---

## 5. SOURCE METADATA

- Group: SNAPSHOT
- Playbook ID: SNAP-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `snapshot/baseline-capture-then-compare.md`
