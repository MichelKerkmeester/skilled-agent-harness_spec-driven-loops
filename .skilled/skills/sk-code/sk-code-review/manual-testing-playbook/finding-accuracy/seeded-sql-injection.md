---
title: "CR-025 -- Seeded SQL injection"
description: "This scenario validates the seeded SQL injection for `CR-025`. It focuses on a live review of a small user lookup module that builds a SQL statement by concatenating its email argument, and on whether the review raises a P0 or P1 finding at the concatenation line that names SQL injection and recommends a parameterized query."
version: 1.0.0.0
---

# CR-025 -- Seeded SQL injection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-025`.

---

## 1. OVERVIEW

This scenario validates the seeded SQL injection for `CR-025`. It focuses on a live review of a small user lookup module that builds a SQL statement by concatenating its email argument, and on whether the review raises a P0 or P1 finding at the concatenation line that names SQL injection and recommends a parameterized query.

### Why This Matters

Routing scenarios can prove that a review reaches the right references, but they cannot prove the review finds a real defect. This scenario supplies the benchmark's D4 usefulness evidence: a small JavaScript file carries one unambiguous defect whose location and severity are known in advance, and the review has to report it at the right line, at a blocking severity, with a concrete remedy. A review that misses the defect, cites it at the wrong line, or softens it to P2 is not useful to the operator who is about to commit the file, so the scenario fails in exactly those cases. It pairs with the clean control in `clean-control.md`, which fails when the review invents a blocker, so the two together measure both recall and restraint on the same kind of input.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-025` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a live review of the seeded file raises a P0 or P1 finding at `users.js:5` naming SQL injection through string concatenation and recommending a parameterized query.
- Real user request: `Review this new user lookup module before I commit it.`
- Prompt: `Review this new user lookup module before I commit it.`
- Expected execution process: Run the deterministic command sequence, save the review output, check its final line, and record a PASS, FAIL, or SKIP verdict with rationale; SKIP only when no review executor can run in the session.
- Expected signals: Step 1: the fixture is written to a scratch folder outside the repository with the injection on line 5; Step 2: the review reports a P0 or P1 finding at `users.js:5` naming SQL injection and a parameterized query, with a Case line, and its Overall assessment and status line agree; Step 3: the final-line checker exits 0.
- Desired user-visible outcome: the review blocks the commit and tells the operator exactly which line interpolates untrusted input into SQL and how to fix it.
- Pass/fail: PASS iff the P0 or P1 finding is present at `users.js:5` with a Case line, the Overall assessment and status line agree, and the final-line checker exits 0; FAIL if the injection is missed, cited at the wrong line, or graded P2.

Fixture file (write it to a scratch folder as users.js):

```js
'use strict';
const db = require('./db');

async function findUserByEmail(email) {
  const sql = "SELECT id, email, role FROM users WHERE email = '" + email + "'";
  const rows = await db.query(sql);
  return rows[0] || null;
}

module.exports = { findUserByEmail };
```

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Write the fixture to a scratch folder outside the repository and confirm the injection lands on line 5.
2. Run the exact prompt through the chosen review executor and save the full output beside the run record.
3. Run `scripts/check-review-final-line.js` over the saved output and read its exit status.
4. Compare the finding line, severity, and remedy against this contract, not against a remembered summary.
5. Record executor, model, wall-clock duration, and total tokens with the verdict, then name the missed or misgraded element when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-025 | Seeded SQL injection | Confirm a live review of the seeded file raises a P0 or P1 finding at `users.js:5` naming SQL injection through string concatenation and recommending a parameterized query. | `Review this new user lookup module before I commit it.` | bash: write the fixture to a scratch folder -> agent: @review the fixture as a pre-commit review of a new file -> bash: node <sk-code-review>/scripts/check-review-final-line.js <saved review output> -> record executor, model, duration and tokens | Step 1: the fixture is written with the injection on line 5; Step 2: the review reports a P0 or P1 finding at `users.js:5` naming SQL injection and a parameterized query, with a Case line, and its Overall assessment and status line agree; Step 3: the final-line checker exits 0 | Saved review output, final-line checker output, executor, model, duration and token count | PASS iff the P0 or P1 finding is present at `users.js:5` with a Case line, the Overall assessment and status line agree, and the final-line checker exits 0; FAIL if the injection is missed, cited at the wrong line, or graded P2 | 1. Confirm the fixture was written verbatim so the injection is on line 5; 2. Re-run with the same executor and model before changing the verdict; 3. Check whether the status line is last and agrees with the Overall assessment |

### Optional Supplemental Checks

If the primary run passes, re-run the same prompt against a variant that uses a parameterized query and confirm the review raises no P0 or P1 finding. Keep supplemental evidence separate from the primary verdict and do not overwrite the primary saved output.

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
| `../../assets/security-checklist.md` | SQL injection checklist criteria the seeded defect is graded against |

---

## 5. SOURCE METADATA

- Group: Finding Accuracy
- Playbook ID: CR-025
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `finding-accuracy/seeded-sql-injection.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
