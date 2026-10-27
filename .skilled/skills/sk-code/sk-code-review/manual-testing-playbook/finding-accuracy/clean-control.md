---
title: "CR-027 -- Clean control"
description: "This scenario validates the clean control for `CR-027`. It focuses on a live review of a small clamp helper with no seeded defect, and on whether the review stays quiet at blocking severity while still being allowed to raise P2 suggestions."
version: 1.0.0.0
---

# CR-027 -- Clean control

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-027`.

---

## 1. OVERVIEW

This scenario validates the clean control for `CR-027`. It focuses on a live review of a small clamp helper with no seeded defect, and on whether the review stays quiet at blocking severity while still being allowed to raise P2 suggestions.

### Why This Matters

A review that finds every seeded defect by flagging everything is worthless, so the finding-accuracy group needs a control that punishes false positives. The clamp helper validates its own range precondition, throws on an inverted range, and composes `Math.min` with `Math.max` in the correct order, which leaves no defect that should block a merge. The scenario passes when the review approves or comments without a P0 or P1 finding, and fails the moment a blocker is invented. Read together with `seeded-sql-injection.md` and `seeded-off-by-one.md`, this control separates a review that actually discriminates from one that scores well on recall by escalating normal code.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-027` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a live review of the clean file raises no P0 and no P1 finding, allows P2 suggestions, and approves or comments rather than requesting changes.
- Real user request: `Review this clamp helper before I commit it.`
- Prompt: `Review this clamp helper before I commit it.`
- Expected execution process: Run the deterministic command sequence, save the review output, check its final line, and record a PASS, FAIL, or SKIP verdict with rationale; SKIP only when no review executor can run in the session.
- Expected signals: Step 1: the fixture is written to a scratch folder outside the repository; Step 2: the review raises no P0 or P1 finding, reports status `APPROVED` or `COMMENTED`, and any remaining findings are P2; Step 3: the final-line checker exits 0.
- Desired user-visible outcome: the review lets the commit through, at most noting non-blocking polish, so the operator is not slowed by invented blockers.
- Pass/fail: PASS iff no P0 or P1 finding is raised and the final-line checker exits 0; FAIL on any P0 or P1 finding, since the file has no defect that blocks a merge.

Fixture file (write it to a scratch folder as clamp.js):

```js
'use strict';

// Limits a number to the closed range [min, max].
function clamp(value, min, max) {
  if (min > max) {
    throw new RangeError('min must not exceed max');
  }
  return Math.min(Math.max(value, min), max);
}

module.exports = { clamp };
```

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Write the fixture to a scratch folder outside the repository and read it once to confirm it matches this contract verbatim.
2. Run the exact prompt through the chosen review executor and save the full output beside the run record.
3. Run `scripts/check-review-final-line.js` over the saved output and read its exit status.
4. Compare the severity of every reported finding against this contract, treating P2 as allowed and any P0 or P1 as a failure.
5. Record executor, model, wall-clock duration, and total tokens with the verdict, then quote the invented blocker when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-027 | Clean control | Confirm a live review of the clean file raises no P0 and no P1 finding, allows P2 suggestions, and approves or comments rather than requesting changes. | `Review this clamp helper before I commit it.` | bash: write the fixture to a scratch folder -> agent: @review the fixture as a pre-commit review of a new file -> bash: node <sk-code-review>/scripts/check-review-final-line.js <saved review output> -> record executor, model, duration and tokens | Step 1: the fixture is written verbatim; Step 2: the review raises no P0 or P1 finding, reports status `APPROVED` or `COMMENTED`, and any remaining findings are P2; Step 3: the final-line checker exits 0 | Saved review output, final-line checker output, executor, model, duration and token count | PASS iff no P0 or P1 finding is raised and the final-line checker exits 0; FAIL on any P0 or P1 finding, since the file has no defect that blocks a merge | 1. Confirm the fixture was written verbatim and not altered by the harness; 2. Re-run with the same executor and model before changing the verdict; 3. Quote the P0 or P1 finding and the rule it cites when the control fails |

### Optional Supplemental Checks

If the primary run passes, re-run the same prompt against a variant that removes the `min > max` guard and confirm the review does raise a finding, which shows the control is not passing because the review is silent on everything. Keep supplemental evidence separate from the primary verdict and do not overwrite the primary saved output.

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
| `../../assets/code-quality-checklist.md` | Correctness and boundary checklist criteria a false blocker would cite |

---

## 5. SOURCE METADATA

- Group: Finding Accuracy
- Playbook ID: CR-027
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `finding-accuracy/clean-control.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
