---
title: "CR-009 -- Cross-consumer affected surface"
description: "This scenario validates Cross-consumer affected surface for `CR-009`. It focuses on Confirm public helper or schema changes inventory consumers before declaring review complete."
version: 1.5.0.4
---

# CR-009 -- Cross-consumer affected surface

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-009`.

---

## 1. OVERVIEW

This scenario validates Cross-consumer affected surface for `CR-009`. It focuses on Confirm public helper or schema changes inventory consumers before declaring review complete.

### Why This Matters

Changing a shared helper, schema field, or response contract without naming downstream consumers causes silent breakage in N call sites. CR-009 forces the reviewer to inventory every consumer of changed symbols (or prove no consumers exist) - producer/consumer surface hints are mandatory for any contract change, and missing this inventory ships interface drift to dependent code.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm public helper or schema changes inventory consumers before declaring review complete.
- Real user request: `Review target changes a shared helper, response field, schema, or policy.`
- Prompt: `Trace consumer impact for this shared helper or schema change, naming affected consumers or proving none exist.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: changed contract identified; Step 2: consumers listed; Step 3: affectedSurfaceHints present for cross-consumer findings
- Desired user-visible outcome: a cross-consumer review finding set that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if cross-consumer findings include affectedSurfaceHints per references/review-core.md schema; FAIL if downstream consumers are ignored

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
| CR-009 | Cross-consumer affected surface | Confirm public helper or schema changes inventory consumers before declaring review complete. | `Trace consumer impact for this shared helper or schema change, naming affected consumers or proving none exist.` | bash: git diff --staged --name-only -> bash: rg -n -e "changedSymbol" -e "changedField" -e "changedPolicy" . -> agent: @review shared-contract diff | Step 1: changed contract identified; Step 2: consumers listed; Step 3: affectedSurfaceHints present for cross-consumer findings | Consumer rg output, report affectedSurfaceHints, final verdict | PASS if cross-consumer findings include affectedSurfaceHints per references/review-core.md schema; FAIL if downstream consumers are ignored | 1. Identify changed public symbol; 2. Search consumers repo-wide; 3. Add migration or compatibility recommendation |

### Optional Supplemental Checks

If the primary run passes, repeat the scenario against a second tiny fixture or narrowed file list to confirm the behavior is not tied to one diff shape. Keep supplemental evidence separate from the primary verdict.

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
| `../../references/review-core.md` | File:line evidence, ordering, finding schema, affectedSurfaceHints |
| `../../assets/fix-completeness-checklist.md` | Finding class, scopeProof, producer and consumer inventories |
| `../../SKILL.md` | Instance-only opt-out and fix completeness expectations |

---

## 5. SOURCE METADATA

- Group: Severity And Evidence Discipline
- Playbook ID: CR-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `severity-and-evidence-discipline/cross-consumer-affected-surface.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
