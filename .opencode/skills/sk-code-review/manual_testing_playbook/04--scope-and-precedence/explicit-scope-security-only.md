---
title: "CR-010 -- Explicit scope security only"
description: "This scenario validates Explicit scope security only for `CR-010`. It focuses on Confirm a security-only review still enforces correctness minimums when security impact exists and avoids style drift."
---

# CR-010 -- Explicit scope security only

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-010`.

---

## 1. OVERVIEW

This scenario validates Explicit scope security only for `CR-010`. It focuses on Confirm a security-only review still enforces correctness minimums when security impact exists and avoids style drift.

### Why This Matters

When the operator explicitly asks for 'security only' and the reviewer mixes in style or formatting findings, signal-to-noise collapses and the security verdict becomes harder to act on. CR-010 enforces declared-scope discipline: SOLID, DRY, KISS, and style-only checks are suppressed unless they block a security or correctness finding, so the operator gets the focused security audit they asked for.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a security-only review still enforces correctness minimums when security impact exists and avoids style drift.
- Real user request: `User asks for security-only review.`
- Prompt: `Run a security-only review on the requested diff scope, suppressing style-only advice while keeping security-impact correctness blockers.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: scope file list visible; Step 2: report suppresses generic style; Step 3: security/correctness minimums remain enforced
- Desired user-visible outcome: a focused security review that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if baseline minimums from references/review_core.md section 6 remain active and style-only findings are omitted; FAIL if scope is ignored

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
| CR-010 | Explicit scope security only | Confirm a security-only review still enforces correctness minimums when security impact exists and avoids style drift. | `Run a security-only review on the requested diff scope, suppressing style-only advice while keeping security-impact correctness blockers.` | bash: git diff --staged --name-only -> agent: @review security-only scoped diff -> bash: rg -n -e "auth" -e "token" -e "secret" -e "validate" -e "permission" path/to/changed/files | Step 1: scope file list visible; Step 2: report suppresses generic style; Step 3: security/correctness minimums remain enforced | Prompt transcript, scoped report, optional grep evidence | PASS if baseline minimums from references/review_core.md section 6 remain active and style-only findings are omitted; FAIL if scope is ignored | 1. Re-read user scope; 2. Remove generic style findings; 3. Keep security-impact correctness findings |

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
| `../../references/review_core.md` | Baseline and surface precedence rules |
| `../../references/review_ux_single_pass.md` | Scope source and interactive report behavior |
| `../../references/test_quality_checklist.md` | Test-only review severity guidance |

---

## 5. SOURCE METADATA

- Group: Scope And Precedence
- Playbook ID: CR-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--scope-and-precedence/explicit-scope-security-only.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
