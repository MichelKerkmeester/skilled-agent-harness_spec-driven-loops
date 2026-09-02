---
title: "RRL-003 -- Rule retirement"
description: "This scenario validates the retirement ordering for `RRL-003`. It focuses on removing a rule in the inverted create order so no intermediate state leaves a row pointing at nothing."
stage: routing
version: 1.1.0.1
---

# RRL-003 -- Rule retirement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRL-003`.

---

## 1. OVERVIEW

This scenario validates the retirement ordering for `RRL-003`. It focuses on removing a rule in the inverted create order so no intermediate state leaves a row pointing at nothing.

### Why This Matters

Retirement is the least exercised path in this workflow, and the ordering carries the whole risk. Delete the file first and every intermediate state has rows pointing at nothing, which reads as coverage to anyone looking at the router and fails silently when the rule is needed. Removing the pointer first inverts the create order for the same reason create is ordered as it is: if the work stops halfway, the worst state left behind is a file nothing points at, which is inert and obvious.

Destructive note: this scenario deletes a shipped rule and edits two files. Run it on a scratch branch. Recovery is `git checkout` of the rule file, the router, and the always-loaded document, and recovery must be confirmed available before the scenario starts.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRL-003` and confirm the expected signals without contradictory evidence.

- Objective: retire a rule in the inverted create order, leaving no dangling row or pointer and equal counts
- Real user request: `Nothing this rule prevents still happens. Retire it.`
- Prompt: `The root cause rule has not caught anything in months and nothing it prevents still happens here. Retire it properly.`
- Expected execution process: the decision tests run first, because whether a rule should still exist is the same four questions as whether it should exist. If retirement is confirmed, the removal proceeds in order: the pointer from every governed section, then the index row, then the trigger row, then the file, then a recorded reason. Counts are compared before and after and nothing is archived.
- Expected signals: all three counts drop by exactly one together, every remaining link resolves, no archive directory is created, and the reason is recorded.
- Desired user-visible outcome: the rule is gone, the router is consistent, and the reason it went is written down so the same rule is not proposed again with nobody remembering.
- Pass/fail: PASS if counts are equal after and every link resolves; FAIL if any count differs, a dangling row or pointer remains, or the file is archived instead of deleted.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The root cause rule has not caught anything in months and nothing it prevents still happens here. Retire it properly.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRL-003 | Rule retirement | Verify a rule is retired in the inverted create order with equal counts and no dangling references | `The root cause rule has not caught anything in months and nothing it prevents still happens here. Retire it properly.` | 1. `bash: awk '/^## 2\. TRIGGER TABLE/{t=1} /^## 3\. INDEX/{t=0;i=1} /^## 4\./{i=0} t&&/repo-rules\//{tr++} i&&/repo-rules\//{ix++} END{print tr, ix}' 'REPO RULES.md'` -> 2. `agent: Remove the pointer, then the index row, then the trigger row, then the file` -> 3. `agent: Record why the rule was retired` -> 4. `bash: rerun the step 1 command and compare` | Step 1: eight trigger rows and eight index rows. Step 2: removal proceeds in the stated order. Step 4: seven and seven, with eight files becoming seven | The step 1 counts, the removal order, the recorded reason, and the step 4 counts | PASS if step 4 shows seven trigger rows, seven index rows and seven files with every link resolving; FAIL if any count differs, a pointer remains, or the file is archived | 1. Compare the step 1 and step 4 counts before reading anything else, since unequal counts localize the failure to a specific missed removal. 2. Check the order actually used, because a row removed after the file leaves a window where the router points at nothing. 3. Grep the always-loaded document for the retired rule name, since a surviving pointer is the removal most often missed and it is invisible in the router |

### Commands

1. `bash: awk '/^## 2\. TRIGGER TABLE/{t=1} /^## 3\. INDEX/{t=0;i=1} /^## 4\./{i=0} t&&/repo-rules\//{tr++} i&&/repo-rules\//{ix++} END{print tr, ix}' 'REPO RULES.md'`
2. `agent: Remove the pointer from every governed section, then the index row, then the trigger row, then delete the file`
3. `agent: Record why the rule was retired`
4. `bash: rerun the step 1 command and compare the two results`

### Expected

Step 1 prints eight and eight, matching the eight rule files. Step 2 performs the removals in the inverted create order, and each intermediate state leaves at worst a file nothing points at. Step 3 records the reason, which is the deliverable that stops the rule being re-proposed later. Step 4 prints seven and seven, and the rule file count is seven. No archive directory exists.

### Evidence

Capture the step 1 counts, the file count before, the order the removals were performed in, the recorded reason, the step 4 counts, and the file count after. The before and after counts are the structural assertion and neither reading is gradeable alone.

### Pass / Fail

- **Pass**: trigger rows, index rows and rule files all drop from eight to seven together, no pointer to the retired rule remains, every link resolves, the reason is recorded, and nothing is archived.
- **Fail**: any of the three counts differs from the others, a pointer or row survives, the file is moved to an archive rather than deleted, or the reason is not recorded.

### Failure Triage

1. Compare the step 1 and step 4 counts first. Unequal counts name the missed removal directly and save reading the diff.
2. Check the order the removals happened in. A correct final state reached by deleting the file first still passes the counts and leaves a window where the router pointed at nothing.
3. Grep the always-loaded document for the retired rule name. A surviving pointer is the most commonly missed removal and it does not show up in any router count.

### Optional Supplemental Checks

After a successful retirement, confirm the rule is recoverable from git history and that no archive directory was created. Git holding the history is what makes deletion safe, and an archive directory becomes the place rules go to be ignored.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`references/agents-md-integration.md`](../../references/agents-md-integration.md) | Primary implementation anchor, section 5 |
| [`references/decision-tests.md`](../../references/decision-tests.md) | The tests that run again before a retirement is confirmed |

---

## 5. SOURCE METADATA

- Group: LIFECYCLE AND WIRING
- Playbook ID: RRL-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `lifecycle-and-wiring/rule-retirement.md`
