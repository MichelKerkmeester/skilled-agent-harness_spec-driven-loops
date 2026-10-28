---
title: "CR-016 -- Native Claude Code invocation"
description: "This scenario validates Native Claude Code invocation for `CR-016`. It focuses on Confirm native review-agent invocation obeys read-only leaf constraints and review doctrine."
version: 1.6.0.0
---

# CR-016 -- Native Claude Code invocation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-016`.

---

## 1. OVERVIEW

This scenario validates Native Claude Code invocation for `CR-016`. It focuses on Confirm native review-agent invocation obeys read-only leaf constraints and review doctrine.

### Why This Matters

@review must stay read-only: if the agent starts editing files during a review pass, the review boundary collapses and findings can no longer be trusted as independent verdicts. The invocation also has a floor of its own: a dispatcher adds the `CODE-REVIEW` marker line as the first line of the rendered review prompt, so the review that receives the prompt can tell a review request from an ordinary one. CR-016 verifies both on the native path: the rendered prompt starts on the marker when the dispatch comes through the orchestrator, @review loads review and returns findings-first output, and `git status` is byte-identical before and after the invocation - any Edit/Write tool call inside the agent transcript is an immediate FAIL.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the orchestrator-rendered prompt starts on the `CODE-REVIEW` marker and that native review-agent invocation obeys read-only leaf constraints and review doctrine.
- Real user request: `Review is run natively through @review.`
- Prompt: `As an orchestrator, dispatch the native review agent against the target diff inside Claude Code or OpenCode. Verify @review stays read-only, loads review, and returns findings-first output. Return a native agent review transcript.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, FAIL, or SKIP verdict with rationale; SKIP only when the native @review agent is unavailable in the current runtime.
- Expected signals: Step 1: target files listed; Step 2: the prompt the orchestrator renders starts on a line reading `CODE-REVIEW` alone, ahead of the review instruction; Step 3: @review report names baseline; Step 4: status shows no target edits by reviewer; Step 5: a dispatched prompt rendered without the marker is recorded with the difference it makes
- Desired user-visible outcome: a native agent review transcript that a real maintainer can act on without asking for missing scope or evidence, dispatched on a prompt that names itself a review.
- Pass/fail: PASS if the rendered prompt's first line is the `CODE-REVIEW` marker when the dispatch goes through the orchestrator, @review remains read-only per .skilled/agents/review.md and output follows references/review-core.md; FAIL if the marker is absent from an orchestrator-rendered prompt, the agent edits files, or it delegates

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
| CR-016 | Native Claude Code invocation | Confirm the orchestrator-rendered prompt starts on the `CODE-REVIEW` marker and that native review-agent invocation obeys read-only leaf constraints and review doctrine. | `As an orchestrator, dispatch the native review agent against the target diff inside Claude Code or OpenCode. Verify @review stays read-only, loads review, and returns findings-first output. Return a native agent review transcript.` | bash: git diff --staged --name-only -> agent: @orchestrate dispatch @review for the staged diff, with CODE-REVIEW as the first line of the rendered prompt -> bash: git status --short -> agent: @review the same scope with the marker omitted and record what the rendered prompt looks like without it | Step 1: target files listed; Step 2: the rendered prompt starts on a line reading `CODE-REVIEW` alone; Step 3: @review report names baseline; Step 4: status shows no target edits by reviewer; Step 5: the marker-less prompt is recorded with the difference it makes | Agent transcript, the rendered prompt verbatim, the marker-less prompt, git status before/after, final report | PASS iff the orchestrator-rendered prompt starts on `CODE-REVIEW`, @review stays read-only per .skilled/agents/review.md, and output follows references/review-core.md; FAIL if the marker is missing from an orchestrator-rendered prompt, the agent edits files, or it delegates | 1. Check whether the dispatch went through the orchestrator or called @review directly; 2. Confirm the marker is the first line, not a later one; 3. Compare git status; 4. Re-run as read-only findings-only |

### Optional Supplemental Checks

If the primary run fails only on the marker step, record whether the executor was the orchestrator or a direct `@review` call before changing the verdict: the floor binds the dispatcher that renders the prompt, and a hand-typed `@review` prompt has no dispatcher. Keep that finding separate from the read-only result. Otherwise, if the primary run passes, repeat the scenario against a second tiny fixture or narrowed file list to confirm the behavior is not tied to one diff shape, with the marker present in both runs. Keep supplemental evidence separate from the primary verdict.

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
| `../../SKILL.md` | Review baseline, the `CODE-REVIEW` extension floor in section 4, and the tool-neutral output contract |
| `../../references/review-core.md` | Portable findings schema for handbacks |
| `../../../../../agents/review.md` | Native @review read-only behavior |
| `../../../../../agents/deep-review.md` | Deep-review leaf boundary and file:line evidence discipline |

---

## 5. SOURCE METADATA

- Group: Cross Cli Orchestration
- Playbook ID: CR-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cross-cli-orchestration/native-claude-code-invocation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md`, `references/` and `.skilled/agents/` per the root coverage note.
