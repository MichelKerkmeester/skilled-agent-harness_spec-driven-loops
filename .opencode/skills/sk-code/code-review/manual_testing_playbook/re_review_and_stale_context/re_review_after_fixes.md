---
title: "CR-013 -- Re-review after fixes"
description: "This scenario validates Re-review after fixes for `CR-013`. It focuses on Confirm re-review verifies previous findings against the new diff instead of rubber-stamping."
version: 1.5.0.4
---

# CR-013 -- Re-review after fixes

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-013`.

---

## 1. OVERVIEW

This scenario validates Re-review after fixes for `CR-013`. It focuses on Confirm re-review verifies previous findings against the new diff instead of rubber-stamping.

### Why This Matters

Re-review must verify each prior P0/P1 was closed with evidence, not trust the author's 'I fixed it' note. CR-013 catches reviewers who skip the resumption discipline: every prior finding must be mapped to either confirmed-resolved (with new file:line evidence) or still-open (with current file:line evidence), and any new same-class regressions must be flagged.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm re-review verifies previous findings against the new diff instead of rubber-stamping.
- Real user request: `Review target is a fix follow-up.`
- Prompt: `Re-review this follow-up diff against the original findings, closing each P0/P1 with current evidence or leaving it open.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: current diff captured; Step 2: prior findings mapped; Step 3: dispositions include evidence
- Desired user-visible outcome: a findings disposition report that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if closed findings cite current evidence and fix completeness follows assets/fix_completeness_checklist.md; FAIL if prior findings are declared fixed without verification

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain review-scope language.
2. Confirm the review target, changed-file list, and risk lens before invoking the reviewer.
3. Execute the deterministic steps exactly as written.
4. Compare the observed report against the cited review reference files.
5. Return a concise final verdict that names missing evidence when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-013 | Re-review after fixes | Confirm re-review verifies previous findings against the new diff instead of rubber-stamping. | `Re-review this follow-up diff against the original findings, closing each P0/P1 with current evidence or leaving it open.` | bash: git diff main...HEAD --name-only -> agent: @review prior findings plus current diff -> bash: rg -n -e "Finding class" -e "Scope proof" -e "Affected surface" /tmp/prior-review.md | Step 1: current diff captured; Step 2: prior findings mapped; Step 3: dispositions include evidence | Prior finding list, current diff, disposition report | PASS if closed findings cite current evidence and fix completeness follows assets/fix_completeness_checklist.md; FAIL if prior findings are declared fixed without verification | 1. Re-open original finding; 2. Inspect current lines; 3. Verify same-class and consumer coverage |

### Optional Supplemental Checks

If the primary run passes, repeat the scenario against a second tiny fixture or narrowed file list to confirm the behavior is not tied to one diff shape. Keep supplemental evidence separate from the primary verdict.

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
| `../../assets/fix_completeness_checklist.md` | Disposition and proof requirements for fixes |
| `../../assets/code_quality_checklist.md` | Contract, KISS, DRY, and correctness checks |
| `../../references/review_core.md` | Evidence-first severity and uncertainty discipline |

---

## 5. SOURCE METADATA

- Group: Re Review And Stale Context
- Playbook ID: CR-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `re_review_and_stale_context/re_review_after_fixes.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
