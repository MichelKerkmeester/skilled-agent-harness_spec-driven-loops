---
title: "CR-008 -- Class of bug vs instance-only"
description: "This scenario validates Class of bug vs instance-only for `CR-008`. It focuses on Confirm findings classify same-class inventory instead of patching only the cited instance by default."
---

# CR-008 -- Class of bug vs instance-only

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-008`.

---

## 1. OVERVIEW

This scenario validates Class of bug vs instance-only for `CR-008`. It focuses on Confirm findings classify same-class inventory instead of patching only the cited instance by default.

### Why This Matters

Misclassifying a class-of-bug as instance-only ships the same bug under N other producers in the codebase - the fix-completeness checklist exists precisely to prevent this. CR-008 catches reviewers who accept 'this is the only place' without grep evidence: same-class producers must be inventoried before instance-only is allowed, or the next deploy reintroduces the regression elsewhere.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm findings classify same-class inventory instead of patching only the cited instance by default.
- Real user request: `Review target fixes or introduces a repeated validation/error pattern.`
- Prompt: `Review this repeated bug pattern and inventory same-class producers before accepting an instance-only fix.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: sibling pattern inventory exists; Step 2: report assigns findingClass; Step 3: instance-only opt-out has proof if used
- Desired user-visible outcome: a finding-class disposition table that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if finding class follows references/fix-completeness-checklist.md classification and SKILL.md instance-only opt-out; FAIL if no scopeProof is provided

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
| CR-008 | Class of bug vs instance-only | Confirm findings classify same-class inventory instead of patching only the cited instance by default. | `Review this repeated bug pattern and inventory same-class producers before accepting an instance-only fix.` | bash: rg -n -e "errors\.push" -e "warnings\.push" -e "throw new Error" -e "return \{.*error" -e "message:" path/to/module -> agent: @review repeated-pattern diff | Step 1: sibling pattern inventory exists; Step 2: report assigns findingClass; Step 3: instance-only opt-out has proof if used | rg transcript, finding-class line, final report | PASS if finding class follows references/fix-completeness-checklist.md classification and SKILL.md instance-only opt-out; FAIL if no scopeProof is provided | 1. Re-run same-class rg; 2. Classify class-of-bug or instance-only; 3. Add scopeProof evidence |

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
| `../../references/review_core.md` | File:line evidence, ordering, finding schema, affectedSurfaceHints |
| `../../references/fix-completeness-checklist.md` | Finding class, scopeProof, producer and consumer inventories |
| `../../SKILL.md` | Instance-only opt-out and fix completeness expectations |

---

## 5. SOURCE METADATA

- Group: Severity And Evidence Discipline
- Playbook ID: CR-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--severity-and-evidence-discipline/class-of-bug-vs-instance-only.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
