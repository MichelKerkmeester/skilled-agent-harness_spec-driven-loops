---
title: "CR-017 -- cli-opencode delegation"
description: "This scenario validates cli-opencode delegation for `CR-017`. It focuses on Confirm external OpenCode delegation preserves the exact review scope and returns review-compatible findings."
version: 1.5.0.4
---

# CR-017 -- cli-opencode delegation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-017`.

---

## 1. OVERVIEW

This scenario validates cli-opencode delegation for `CR-017`. It focuses on Confirm external OpenCode delegation preserves the exact review scope and returns review-compatible findings.

### Why This Matters

External CLI delegation must preserve the declared scope and return findings in a format compatible with review's severity schema - drift here breaks the multi-AI handoff. CR-017 catches the most common external-delegation failure modes: implementing fixes instead of reporting findings, omitting file:line evidence, or scope-creeping into adjacent files; any of these turns an 'external review' into 'external rewrite' and corrupts the review trail.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm external OpenCode delegation preserves the exact review scope and returns review-compatible findings.
- Real user request: `Review is delegated to OpenCode.`
- Prompt: `As an external conductor, delegate a code review to cli-opencode against the requested diff scope. Verify OpenCode uses findings-first severity, file:line evidence, and no implementation changes. Return a review-compatible handback.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: scope listed; Step 2: OpenCode handback includes P0/P1/P2 buckets; Step 3: no edits appear
- Desired user-visible outcome: a review-compatible handback that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if handback satisfies references/review_core.md schema and .opencode/agents/review.md read-only intent; FAIL if OpenCode fixes code or omits file:line evidence

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
| CR-017 | cli-opencode delegation | Confirm external OpenCode delegation preserves the exact review scope and returns review-compatible findings. | `As an external conductor, delegate a code review to cli-opencode against the requested diff scope. Verify OpenCode uses findings-first severity, file:line evidence, and no implementation changes. Return a review-compatible handback.` | bash: git diff --staged --name-only -> cli-opencode: review the staged diff using review; findings only -> bash: git status --short | Step 1: scope listed; Step 2: OpenCode handback includes P0/P1/P2 buckets; Step 3: no edits appear | CLI transcript, handback report, git status | PASS if handback satisfies references/review_core.md schema and .opencode/agents/review.md read-only intent; FAIL if OpenCode fixes code or omits file:line evidence | 1. Restate findings-only scope; 2. Require file:line citations; 3. Reject implementation edits |

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
| `../../SKILL.md` | Review baseline and tool-neutral output contract |
| `../../references/review_core.md` | Portable findings schema for handbacks |
| `../../../../agent/review.md` | Native @review read-only behavior |
| `../../../../agent/deep-review.md` | Deep-review leaf boundary and file:line evidence discipline |

---

## 5. SOURCE METADATA

- Group: Cross Cli Orchestration
- Playbook ID: CR-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `cross_cli_orchestration/cli_opencode_delegation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
