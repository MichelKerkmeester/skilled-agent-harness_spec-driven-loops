---
title: "CR-007 -- P0 blocker with file:line"
description: "This scenario validates P0 blocker with file:line for `CR-007`. It focuses on Confirm blocker findings include concrete file:line evidence and user impact."
version: 1.5.0.4
---

# CR-007 -- P0 blocker with file:line

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-007`.

---

## 1. OVERVIEW

This scenario validates P0 blocker with file:line for `CR-007`. It focuses on Confirm blocker findings include concrete file:line evidence and user impact.

### Why This Matters

A P0 finding without file:line evidence is unactionable - the maintainer cannot verify or fix it, and the merge gate becomes opinion rather than verdict. CR-007 enforces the strictest evidence rule from review_core.md: every blocker must include exact file:line, observed risk, user impact, finding class, and a recommended fix. Reviews that skip any of these are P0-deficient and should be downgraded with proof.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm blocker findings include concrete file:line evidence and user impact.
- Real user request: `Review target contains a candidate auth bypass or data-loss defect.`
- Prompt: `Validate this suspected P0 diff hunk with exact file:line evidence, user impact, finding class, and an evidence-backed severity.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: hunk captured; Step 2: review includes P0 or downgrade; Step 3: line numbers match source
- Desired user-visible outcome: a blocker finding or evidence-backed downgrade that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if P0/P1 evidence satisfies references/review_core.md section 3 and schema section 7; FAIL if the blocker lacks file:line

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
| CR-007 | P0 blocker with file:line | Confirm blocker findings include concrete file:line evidence and user impact. | `Validate this suspected P0 diff hunk with exact file:line evidence, user impact, finding class, and an evidence-backed severity.` | bash: git diff --staged -U5 -> agent: @review suspected P0 hunk -> bash: nl -ba path/to/file.ts | Step 1: hunk captured; Step 2: review includes P0 or downgrade; Step 3: line numbers match source | Diff hunk, numbered file excerpt, final finding | PASS if P0/P1 evidence satisfies references/review_core.md section 3 and schema section 7; FAIL if the blocker lacks file:line | 1. Re-open numbered source; 2. Check if severity should downgrade; 3. Add findingClass and scopeProof |

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
| `../../assets/fix-completeness-checklist.md` | Finding class, scopeProof, producer and consumer inventories |
| `../../SKILL.md` | Instance-only opt-out and fix completeness expectations |

---

## 5. SOURCE METADATA

- Group: Severity And Evidence Discipline
- Playbook ID: CR-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `severity_and_evidence_discipline/p0_blocker_with_file_line.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
