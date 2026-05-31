---
title: "CR-005 -- Input validation injection"
description: "This scenario validates Input validation injection for `CR-005`. It focuses on Confirm injection sinks trigger context-aware input/output safety review."
---

# CR-005 -- Input validation injection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-005`.

---

## 1. OVERVIEW

This scenario validates Input validation injection for `CR-005`. It focuses on Confirm injection sinks trigger context-aware input/output safety review.

### Why This Matters

Source-to-sink tracing for SQL, command, path, SSRF, and HTML sinks is the discipline that separates a real security review from a generic 'looks fine' review. CR-005 catches reviewers who flag 'use parameterized queries' as advice without locating the actual untrusted input or its sink - findings without source-to-sink evidence cannot be acted on and let injections ship.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-005` and confirm the expected signals without contradictory evidence.

- Objective: Confirm injection sinks trigger context-aware input/output safety review.
- Real user request: `Review target touches validation, parsing, path, URL, or query code.`
- Prompt: `Review this validation diff for injection risks, tracing untrusted input to SQL, command, path, SSRF, or HTML sinks.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: changed files listed; Step 2: risky sinks inventoried; Step 3: report ties untrusted input to sink or clears it with evidence
- Desired user-visible outcome: a P0/P1 risk report with triage that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if source-to-sink reasoning follows references/security_checklist.md section 2 and every P0/P1 has file:line; FAIL if it only says validate inputs generically

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
| CR-005 | Input validation injection | Confirm injection sinks trigger context-aware input/output safety review. | `Review this validation diff for injection risks, tracing untrusted input to SQL, command, path, SSRF, or HTML sinks.` | bash: git diff --staged --name-only -> bash: rg -n -e "exec" -e "query" -e "innerHTML" -e "fetch\(" -e "readFile" -e "join\(" path/to/changed/files -> agent: @review injection-risk diff | Step 1: changed files listed; Step 2: risky sinks inventoried; Step 3: report ties untrusted input to sink or clears it with evidence | Sink grep results, reviewed lines, final report | PASS if source-to-sink reasoning follows references/security_checklist.md section 2 and every P0/P1 has file:line; FAIL if it only says validate inputs generically | 1. Identify untrusted source; 2. Identify output channel; 3. Reclassify severity using review_core.md definitions |

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
| `../../references/security_checklist.md` | Security, authz, secrets, injection, abuse, and reliability checks |
| `../../references/review_core.md` | Mandatory P0/P1 evidence and baseline minimums |
| `../../SKILL.md` | Baseline plus sk-code surface-evidence contract |

---

## 5. SOURCE METADATA

- Group: Security And Correctness Minimums
- Playbook ID: CR-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--security-and-correctness-minimums/005-input-validation-injection.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
