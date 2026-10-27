---
title: "CR-026 -- Seeded off-by-one"
description: "This scenario validates the seeded off-by-one for `CR-026`. It focuses on a live review of a small pagination helper whose start index is computed as `page * pageSize`, and on whether the review raises a P1 or P0 finding at the index line explaining that page 1 skips the first `pageSize` items."
version: 1.0.0.0
---

# CR-026 -- Seeded off-by-one

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-026`.

---

## 1. OVERVIEW

This scenario validates the seeded off-by-one for `CR-026`. It focuses on a live review of a small pagination helper whose start index is computed as `page * pageSize`, and on whether the review raises a P1 or P0 finding at the index line explaining that page 1 skips the first `pageSize` items.

### Why This Matters

An off-by-one in a pagination boundary is the kind of defect that passes every happy-path test on page 2 and silently hides rows on page 1. The seeded file documents a 1-based page contract in a comment directly above the function, so the contradiction between the stated contract and the arithmetic is available to any reviewer that reads the file rather than skimming it. This scenario is the benchmark's D4 usefulness evidence for a logic defect with no security surface: the finding has to land on the index line, explain the observable consequence, and propose the corrected expression. A review that misses it, or that reports it at a blocking severity without naming the skipped range, gives the operator nothing to act on. It pairs with `clean-control.md` so a review cannot pass both by reporting every line as a defect.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-026` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a live review of the seeded file raises a P1 or P0 finding at `paginate.js:5` showing that page 1 skips the first `pageSize` items because the start index should be `(page - 1) * pageSize`.
- Real user request: `Review this pagination helper before I commit it.`
- Prompt: `Review this pagination helper before I commit it.`
- Expected execution process: Run the deterministic command sequence, save the review output, check its final line, and record a PASS, FAIL, or SKIP verdict with rationale; SKIP only when no review executor can run in the session.
- Expected signals: Step 1: the fixture is written to a scratch folder outside the repository with the start index on line 5; Step 2: the review reports a P1 or P0 finding at `paginate.js:5` naming the skipped first page and the `(page - 1) * pageSize` correction, with a Case line, and its summary and status line agree; Step 3: the final-line checker exits 0.
- Desired user-visible outcome: the review blocks the commit and shows the operator which page silently loses rows and which expression fixes it.
- Pass/fail: PASS iff the P1 or P0 finding is present at `paginate.js:5` with a Case line, the summary and status agree, and the final-line checker exits 0; FAIL if the off-by-one is missed or graded P2.

Fixture file (write it to a scratch folder as paginate.js):

```js
'use strict';

// Returns the items on a 1-based page.
function pageItems(items, page, pageSize) {
  const start = page * pageSize;
  return items.slice(start, start + pageSize);
}

module.exports = { pageItems };
```

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Write the fixture to a scratch folder outside the repository and confirm the start index lands on line 5.
2. Run the exact prompt through the chosen review executor and save the full output beside the run record.
3. Run `scripts/check-review-final-line.js` over the saved output and read its exit status.
4. Compare the finding line, severity, skipped range, and correction against this contract, not against a remembered summary.
5. Record executor, model, wall-clock duration, and total tokens with the verdict, then name the missed or misgraded element when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-026 | Seeded off-by-one | Confirm a live review of the seeded file raises a P1 or P0 finding at `paginate.js:5` showing that page 1 skips the first `pageSize` items because the start index should be `(page - 1) * pageSize`. | `Review this pagination helper before I commit it.` | bash: write the fixture to a scratch folder -> agent: @review the fixture as a pre-commit review of a new file -> bash: node <sk-code-review>/scripts/check-review-final-line.js <saved review output> -> record executor, model, duration and tokens | Step 1: the fixture is written with the start index on line 5; Step 2: the review reports a P1 or P0 finding at `paginate.js:5` naming the skipped first page and the `(page - 1) * pageSize` correction, with a Case line, and its summary and status line agree; Step 3: the final-line checker exits 0 | Saved review output, final-line checker output, executor, model, duration and token count | PASS iff the P1 or P0 finding is present at `paginate.js:5` with a Case line, the summary and status agree, and the final-line checker exits 0; FAIL if the off-by-one is missed or graded P2 | 1. Confirm the fixture was written verbatim so the start index is on line 5; 2. Re-run with the same executor and model before changing the verdict; 3. Check whether the status line is last and agrees with the summary |

### Optional Supplemental Checks

If the primary run passes, re-run the same prompt against a variant whose start index reads `(page - 1) * pageSize` and confirm the review raises no P1 or P0 finding. Keep supplemental evidence separate from the primary verdict and do not overwrite the primary saved output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Phase 4 output contract and severity rules |
| `../../references/review-core.md` | Severity model and evidence rules |
| `../../scripts/check-review-final-line.js` | Final-line and Overall assessment check |
| `../../assets/code-quality-checklist.md` | Correctness and boundary checklist criteria the seeded defect is graded against |

---

## 5. SOURCE METADATA

- Group: Finding Accuracy
- Playbook ID: CR-026
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `finding-accuracy/seeded-off-by-one.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
