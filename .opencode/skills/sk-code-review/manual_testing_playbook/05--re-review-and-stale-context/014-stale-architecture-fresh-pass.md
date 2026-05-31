---
title: "CR-014 -- Stale architecture fresh pass"
description: "This scenario validates Stale architecture fresh pass for `CR-014`. It focuses on Confirm stale architecture prose does not override current implementation evidence."
---

# CR-014 -- Stale architecture fresh pass

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-014`.

---

## 1. OVERVIEW

This scenario validates Stale architecture fresh pass for `CR-014`. It focuses on Confirm stale architecture prose does not override current implementation evidence.

### Why This Matters

Architecture notes drift from current code faster than reviewers expect - flagging a 'violation' against stale prose produces ghost findings the author cannot fix. CR-014 forces the reviewer to anchor on code, not docs: implementation evidence beats stale architecture statements, and stale assumptions must be labeled as such rather than presented as current truth.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm stale architecture prose does not override current implementation evidence.
- Real user request: `Review target includes old docs that may contradict code.`
- Prompt: `Review the current code despite stale architecture notes, citing implementation evidence first and labeling any stale assumptions.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: stale references identified; Step 2: report cites current code first; Step 3: assumptions labeled
- Desired user-visible outcome: a fresh-pass review with assumptions that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if stale prose is treated as context only and file:line evidence drives P0/P1 per references/review_core.md; FAIL if obsolete docs become unsupported findings

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain review-scope language.
2. Confirm the review target, changed-file list, and risk lens before invoking the reviewer.
3. Execute the deterministic steps exactly as written.
4. Compare the observed report against the cited sk-code-review reference files.
5. Return a concise final verdict that names missing evidence when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-014 | Stale architecture fresh pass | Confirm stale architecture prose does not override current implementation evidence. | `Review the current code despite stale architecture notes, citing implementation evidence first and labeling any stale assumptions.` | bash: git diff --staged --name-only -> bash: rg -n -e "deprecated" -e "old" -e "legacy" -e "TODO" -e "architecture" docs .opencode/specs -> agent: @review current diff with stale docs noted | Step 1: stale references identified; Step 2: report cites current code first; Step 3: assumptions labeled | Stale doc excerpt, current source lines, final report | PASS if stale prose is treated as context only and file:line evidence drives P0/P1 per references/review_core.md; FAIL if obsolete docs become unsupported findings | 1. Prefer current implementation lines; 2. Search counterevidence once; 3. Mark unresolved contradiction explicitly |

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
| `../../references/fix-completeness-checklist.md` | Disposition and proof requirements for fixes |
| `../../references/code_quality_checklist.md` | Contract, KISS, DRY, and correctness checks |
| `../../references/review_core.md` | Evidence-first severity and uncertainty discipline |

---

## 5. SOURCE METADATA

- Group: Re Review And Stale Context
- Playbook ID: CR-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--re-review-and-stale-context/014-stale-architecture-fresh-pass.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
