---
title: "CR-016 -- Native Claude Code invocation"
description: "This scenario validates Native Claude Code invocation for `CR-016`. It focuses on Confirm native review-agent invocation obeys read-only leaf constraints and review doctrine."
version: 1.5.0.4
---

# CR-016 -- Native Claude Code invocation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-016`.

---

## 1. OVERVIEW

This scenario validates Native Claude Code invocation for `CR-016`. It focuses on Confirm native review-agent invocation obeys read-only leaf constraints and review doctrine.

### Why This Matters

@review must stay read-only: if the agent starts editing files during a review pass, the review boundary collapses and findings can no longer be trusted as independent verdicts. CR-016 verifies the native invocation path: @review loads review, returns findings-first output, and `git status` is byte-identical before and after the invocation - any Edit/Write tool call inside the agent transcript is an immediate FAIL.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm native review-agent invocation obeys read-only leaf constraints and review doctrine.
- Real user request: `Review is run natively through @review.`
- Prompt: `As an orchestrator, dispatch the native review agent against the target diff inside Claude Code or OpenCode. Verify @review stays read-only, loads review, and returns findings-first output. Return a native agent review transcript.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: target files listed; Step 2: @review report names baseline; Step 3: status shows no target edits by reviewer
- Desired user-visible outcome: a native agent review transcript that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if @review remains read-only per .opencode/agents/review.md and output follows references/review_core.md; FAIL if it edits files or delegates

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
| CR-016 | Native Claude Code invocation | Confirm native review-agent invocation obeys read-only leaf constraints and review doctrine. | `As an orchestrator, dispatch the native review agent against the target diff inside Claude Code or OpenCode. Verify @review stays read-only, loads review, and returns findings-first output. Return a native agent review transcript.` | bash: git diff --staged --name-only -> agent: @review review staged diff -> bash: git status --short | Step 1: target files listed; Step 2: @review report names baseline; Step 3: status shows no target edits by reviewer | Agent transcript, git status before/after, final report | PASS if @review remains read-only per .opencode/agents/review.md and output follows references/review_core.md; FAIL if it edits files or delegates | 1. Check agent permission block; 2. Compare git status; 3. Re-run as read-only findings-only |

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
- Playbook ID: CR-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `cross_cli_orchestration/native_claude_code_invocation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
