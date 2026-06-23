---
title: "CR-002 -- Large refactor PR"
description: "This scenario validates Large refactor PR for `CR-002`. It focuses on Confirm large refactors trigger scope control, surface evidence, and risk-ranked findings."
version: 1.5.0.2
---

# CR-002 -- Large refactor PR

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-002`.

---

## 1. OVERVIEW

This scenario validates Large refactor PR for `CR-002`. It focuses on Confirm large refactors trigger scope control, surface evidence, and risk-ranked findings.

### Why This Matters

Large refactors (500+ LOC across multiple files) are where reviewers tend to dilute severity discipline - either flagging cosmetics as P1 because the diff is intimidating, or rubber-stamping because reading carefully feels exhausting. CR-002 catches that drift: scope must stay declared, blocking findings must stay severity-ordered, and surface evidence must be named even when the diff is long.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm large refactors trigger scope control, surface evidence, and risk-ranked findings.
- Real user request: `Review target is a 500+ LOC refactor branch.`
- Prompt: `Review the full refactor branch diff, call out large-diff limits and surface evidence, and keep blockers severity-ordered.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: large diff size visible; Step 2: changed surface inventory exists; Step 3: report names scope caveat and surface evidence
- Desired user-visible outcome: a merge-readiness report with scope caveats that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if large-diff limits are stated per SKILL.md escalation rules and P0/P1 cite file:line per references/review_core.md; FAIL if the review pretends exhaustive certainty without evidence

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
| CR-002 | Large refactor PR | Confirm large refactors trigger scope control, surface evidence, and risk-ranked findings. | `Review the full refactor branch diff, call out large-diff limits and surface evidence, and keep blockers severity-ordered.` | bash: git diff --stat main...HEAD -> bash: git diff main...HEAD --name-only -> agent: @review full branch diff | Step 1: large diff size visible; Step 2: changed surface inventory exists; Step 3: report names scope caveat and surface evidence | Diff stat, file inventory, final review report | PASS if large-diff limits are stated per SKILL.md escalation rules and P0/P1 cite file:line per references/review_core.md; FAIL if the review pretends exhaustive certainty without evidence | 1. Check SKILL.md section 4 escalate-if large diff rule; 2. Split by changed surface; 3. Re-run on a narrowed file set |

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
| `../../SKILL.md` | Routing, output contract, scope and escalation rules |
| `../../references/review_core.md` | Severity, evidence, precedence, and finding schema |
| `../../references/review_ux_single_pass.md` | Interactive report flow and PR/pre-commit guidance |

---

## 5. SOURCE METADATA

- Group: Baseline Review Flow
- Playbook ID: CR-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--baseline-review-flow/large-refactor-pr.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
