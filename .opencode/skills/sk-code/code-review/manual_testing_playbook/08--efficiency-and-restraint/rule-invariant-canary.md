---
title: "CR-024 -- Rule-invariant canary"
description: "This scenario validates the rule-invariant canary for `CR-024`. It focuses on check-rule-copies.js passing when the verdict triplet and cross-doc Iron Law wording agree and failing closed when any copy drifts."
version: 1.5.0.1
---

# CR-024 -- Rule-invariant canary

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-024`.

---

## 1. OVERVIEW

This scenario validates the rule-invariant canary for `CR-024`. It focuses on `check-rule-copies.js` passing when the verdict triplet and cross-doc Iron Law wording agree and failing closed when any copy drifts.

### Why This Matters

Some rules have to read identically in more than one place: the `Review status:` verdict triplet that downstream PR-state dedup logic keys on, and the cross-document Iron Law that forbids completion claims without verification. When an editor updates one copy and forgets the others, the docs silently disagree and the guarantee rots. The `scripts/check-rule-copies.js` canary added in v1.4.0.0 asserts the load-bearing substrings still exist across copies, validates every Iron Law line in `SKILL.md`, the root `CLAUDE.md`, and `AGENTS.md`, and fails loudly when any copy drifts. It is a checker, not a generator. CR-024 proves the clean run passes, the self-test passes, and a tampered copy is caught with a non-zero exit.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the canary exits 0 when copies agree, its self-test passes, and a tampered Iron Law or verdict copy makes it exit non-zero.
- Real user request: `Prove the load-bearing review wording cannot silently drift across its copies.`
- Prompt: `Run the rule-invariant canary and its self-test, confirm a clean pass, then tamper one Iron Law copy and confirm the canary fails loudly.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: canary exits 0 reporting the exact-string and Iron Law file counts; Step 2: the self-test reports all cases pass; Step 3: a tampered copy makes the canary exit 1 and name the drifted phrase, then restore.
- Desired user-visible outcome: a guard that passes silently when wording agrees and blocks loudly the moment any copy drifts.
- Pass/fail: PASS if the clean run exits 0, the self-test passes, and a tampered copy exits 1 per scripts/check-rule-copies.js; FAIL if drift is not caught or the clean run errors.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the invariant being guarded in plain language.
2. Confirm the canary, its self-test, and the copies it checks all resolve on disk.
3. Execute the deterministic steps exactly as written, restoring any tampered copy after.
4. Compare the observed exit codes against the cited sk-code-review source files.
5. Return a concise final verdict that names the uncaught drift when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-024 | Rule-invariant canary | Confirm the canary exits 0 when copies agree, its self-test passes, and a tampered Iron Law or verdict copy makes it exit non-zero. | `Run the rule-invariant canary and its self-test, confirm a clean pass, then tamper one Iron Law copy and confirm the canary fails loudly.` | bash: node .opencode/skills/sk-code/code-review/scripts/check-rule-copies.js -> bash: bash .opencode/skills/sk-code/code-review/scripts/check-rule-copies.test.sh -> bash: tamper one Iron Law copy then re-run the canary expecting exit 1 then restore | Step 1: canary exits 0 with exact-string and Iron Law file counts; Step 2: self-test reports all cases pass; Step 3: tampered copy exits 1 and names the drifted phrase | Clean-run output, self-test output, tampered-run exit 1 transcript | PASS if the clean run exits 0, the self-test passes, and a tampered copy exits 1 per scripts/check-rule-copies.js; FAIL if drift is not caught or the clean run errors | 1. Confirm all checked copies resolve on disk; 2. Restore the tampered copy; 3. Verify AGENTS.md and every Iron Law line are in the checked set |

### Optional Supplemental Checks

If the primary run passes, delete or move the canary and confirm `.github/workflows/rule-canary-sync.yml` would fail closed (its guard errors when the canary is missing). Keep supplemental evidence separate from the primary verdict and restore the canary afterward.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../scripts/check-rule-copies.js` | Rule-invariant canary asserting the verdict triplet and cross-doc Iron Law wording |
| `../../scripts/check-rule-copies.test.sh` | Self-test proving the canary catches a dropped verdict string and a dropped Iron Law concept |

---

## 5. SOURCE METADATA

- Group: Efficiency And Restraint
- Playbook ID: CR-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--efficiency-and-restraint/rule-invariant-canary.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
