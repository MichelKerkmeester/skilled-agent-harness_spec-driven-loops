---
title: "CR-004 -- Security-sensitive auth"
description: "This scenario validates Security-sensitive auth for `CR-004`. It focuses on Confirm auth and authorization gaps are treated as mandatory baseline risks."
version: 1.5.0.4
---

# CR-004 -- Security-sensitive auth

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-004`.

---

## 1. OVERVIEW

This scenario validates Security-sensitive auth for `CR-004`. It focuses on Confirm auth and authorization gaps are treated as mandatory baseline risks.

### Why This Matters

Auth-bypass severity inflation or deflation is the highest-impact regression mode in code review. Downgrading a missing ownership check from P0 to 'style suggestion' ships an IDOR. CR-004 forces reviewers to identify mutation paths that lack authorization guards and classify them at minimum P1 per security_checklist.md section 3 - mistakes here cause real exploits, not just messy diffs.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm auth and authorization gaps are treated as mandatory baseline risks.
- Real user request: `Review target changes authentication or authorization code.`
- Prompt: `Review this auth-sensitive diff for missing auth or ownership checks, treating likely authorization gaps as P1/P0 risks.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: auth diff visible; Step 2: security findings lead; Step 3: grep evidence supports scope
- Desired user-visible outcome: a security findings report that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if missing authz on mutation is flagged per assets/security_checklist.md section 3 and evidence cites file:line per references/review_core.md; FAIL if auth risk is downgraded to style

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
| CR-004 | Security-sensitive auth | Confirm auth and authorization gaps are treated as mandatory baseline risks. | `Review this auth-sensitive diff for missing auth or ownership checks, treating likely authorization gaps as P1/P0 risks.` | bash: git diff --staged -- '*auth*' '*session*' '*permission*' -> agent: @review security-sensitive diff -> bash: rg -n -e "auth" -e "authorize" -e "owner" -e "tenant" -e "permission" path/to/changed/files | Step 1: auth diff visible; Step 2: security findings lead; Step 3: grep evidence supports scope | Diff excerpt, grep transcript, final P0/P1 findings | PASS if missing authz on mutation is flagged per assets/security_checklist.md section 3 and evidence cites file:line per references/review_core.md; FAIL if auth risk is downgraded to style | 1. Check security_checklist.md section 3; 2. Confirm mutation path; 3. Search sibling entry points for same guard pattern |

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
| `../../assets/security_checklist.md` | Security, authz, secrets, injection, abuse, and reliability checks |
| `../../references/review_core.md` | Mandatory P0/P1 evidence and baseline minimums |
| `../../SKILL.md` | Baseline plus sk-code surface-evidence contract |

---

## 5. SOURCE METADATA

- Group: Security And Correctness Minimums
- Playbook ID: CR-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `security-and-correctness-minimums/security-sensitive-auth.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
