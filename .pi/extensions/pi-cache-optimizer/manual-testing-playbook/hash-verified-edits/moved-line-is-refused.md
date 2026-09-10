---
title: "CACHE-012 -- An edit whose target moved is refused"
description: "This scenario validates that `edit_lines` refuses an edit when the file's line count no longer matches the read for `CACHE-012`, which is the case a content hash alone cannot detect."
stage: routing
version: 1.0.0.0
---

# CACHE-012 -- An edit whose target moved is refused

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-012`.

---

## 1. OVERVIEW

This scenario validates that a hash-anchored edit is refused when lines were inserted or removed since the read, including the case where an identical line has shifted into the target position.

### Why This Matters

A content hash cannot notice that its line moved: an identical line arriving at the target index hashes the same and would absorb the edit silently. Files full of repeated lines -- a lone closing brace, a blank line, a comment terminator -- make that ordinary rather than exotic, and the likeliest thing to shift them is the model's own previous edit in the same turn. Movement always changes the file's line count, which is what the refusal keys on.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-012` and confirm the expected signals without contradictory evidence.

- Objective: confirm an edit is refused once the file's length no longer matches the read.
- Real user request: `Fix the second closing brace in this file.`
- Prompt: read a file with repeated identical lines, insert a line above the target, then attempt the original edit.
- Expected execution process: capture the read, mutate the file, then replay the edit built from the stale read.
- Expected signals: the edit is refused with an error naming the line count seen at read time and the count now.
- Desired user-visible outcome: a stale edit fails loudly instead of landing on the wrong line.
- Pass/fail: PASS if the edit is refused and the file is unchanged; FAIL if it applies, or if it applies to a different line than intended.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: edit one of several identical lines.
2. Read a file containing at least two identical lines and note the reported line count.
3. Insert a line above the target so every line below it shifts.
4. Replay the original edit unchanged and read the refusal.
5. Confirm the file on disk is byte-identical to step 3.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-012 | A moved line is refused | Verify a shifted identical line cannot absorb a stale edit | `Replace the second closing brace with a comment.` | 1. read the file and record its line count -> 2. insert one line above the target -> 3. replay the original `edit_lines` call unchanged -> 4. diff the file | Step 3: refusal naming the count at read time against the current count; step 4: no change on disk | The read output, the edit call, the refusal text, and the diff | PASS if refused and the file is unchanged; FAIL if the edit applies at all | 1. Confirm the replayed call carries the line count from the original read rather than a fresh one. 2. Confirm the inserted line actually shifted the target, since an in-place edit above does not move anything. 3. Re-read the file and retry to confirm a fresh read still succeeds. |

### Optional Supplemental Checks

Confirm a near-miss hash still refuses rather than falling back to a fuzzy match, and that the existing exact-string edit tool is untouched.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | Edit validation, the line-count binding, and the refusal text |
| `../../tests/hash-verified-edits.test.ts` | Regression anchor including the shifted identical line |

---

## 5. SOURCE METADATA

- Group: Hash-Verified Edits
- Playbook ID: CACHE-012
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `hash-verified-edits/moved-line-is-refused.md`
