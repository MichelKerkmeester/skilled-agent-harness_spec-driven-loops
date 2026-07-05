---
title: "CR-021 -- Unrequested-code removal prompt"
description: "This scenario validates the unrequested-code removal prompt for `CR-021`. It focuses on recommending removal, not just simplification, for code that traces to no stated requirement."
version: 1.5.0.2
---

# CR-021 -- Unrequested-code removal prompt

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-021`.

---

## 1. OVERVIEW

This scenario validates the unrequested-code removal prompt for `CR-021`. It focuses on recommending removal, not just simplification, for code that traces to no stated requirement.

### Why This Matters

The old KISS pass asked "can this be simpler?" but never "should this exist?". A feature, parameter, branch, or config that nothing in the stated scope asked for is pure carrying cost, and simplifying it only makes unused code shorter. The §7 needed-ness prompt added in v1.4.0.0 makes the reviewer ask whether the code was requested and whether anything breaks if the requirement is dropped, then recommend removal cross-referenced to removal_plan.md. CR-021 proves the reviewer reaches for removal with a Replacement entry and applies the correct P2 default with P1 escalation only when the unneeded code adds attack surface, contract obligations, or regression risk.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-021` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the reviewer recommends removal with a Replacement entry for code tracing to no requirement, defaulting P2 and escalating P1 only on added risk.
- Real user request: `Review target adds a feature, parameter, or branch that nothing in the stated scope asked for.`
- Prompt: `Review this diff for code that traces to no stated requirement, and recommend removal with a Replacement entry when nothing in scope asked for it.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: diff and stated scope captured; Step 2: unrequested code flagged with a removal recommendation and a Replacement entry; Step 3: finding defaults P2, escalates P1 only on added attack surface, contract, or regression risk.
- Desired user-visible outcome: a removal recommendation a maintainer can act on, naming what replaces the deleted code and why nothing in scope needs it.
- Pass/fail: PASS if unrequested code earns a removal recommendation per assets/code_quality_checklist.md section 7 with a Replacement per assets/removal_plan.md section 2; FAIL if it gets only a simplification note or is ignored.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and the stated scope in plain review-scope language.
2. Confirm the review target, changed-file list, and which lines trace to no requirement.
3. Execute the deterministic steps exactly as written.
4. Compare the observed report against the cited review reference files.
5. Return a concise final verdict that names the unrequested code when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-021 | Unrequested-code removal prompt | Confirm the reviewer recommends removal with a Replacement entry for code tracing to no requirement, P2 default with P1 escalation on added risk. | `Review this diff for code that traces to no stated requirement, and recommend removal with a Replacement entry when nothing in scope asked for it.` | bash: git diff --staged -U5 -> agent: @review with the stated scope for needed-ness -> bash: rg -n "the unrequested symbol" path/to/file | Step 1: diff and scope captured; Step 2: removal recommendation with a Replacement entry; Step 3: P2 default, P1 only on added surface or contract or regression risk | Diff hunk, stated scope, removal finding with Replacement | PASS if unrequested code earns a removal recommendation per assets/code_quality_checklist.md section 7 with a Replacement per assets/removal_plan.md section 2; FAIL if it gets only a simplification note | 1. Confirm the code traces to no requirement; 2. Check section 7 needed-ness prompt loaded; 3. Add Replacement and re-grade P2 vs P1 |

### Optional Supplemental Checks

If the primary run passes, repeat against a diff where the new code DOES trace to a stated requirement and confirm the reviewer does NOT recommend removal. Keep supplemental evidence separate from the primary verdict.

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
| `../../assets/code_quality_checklist.md` | Section 7 needed-ness removal prompt and P2/P1 escalation rule |
| `../../assets/removal_plan.md` | Section 2 safe-to-remove-now table and the Replacement field |

---

## 5. SOURCE METADATA

- Group: Efficiency And Restraint
- Playbook ID: CR-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--efficiency-and-restraint/unrequested-code-removal.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
