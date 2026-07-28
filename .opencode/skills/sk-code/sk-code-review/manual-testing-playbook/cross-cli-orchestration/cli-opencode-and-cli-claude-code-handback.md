---
title: "CR-018 -- cli-opencode and cli-claude-code handback"
description: "This scenario validates cli-opencode and cli-claude-code handback for `CR-018`. It focuses on Confirm alternate CLI reviewers can hand back findings that preserve severity, evidence, and uncertainty."
version: 1.5.0.4
---

# CR-018 -- cli-opencode and cli-claude-code handback

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-018`.

---

## 1. OVERVIEW

This scenario validates cli-opencode and cli-claude-code handback for `CR-018`. It focuses on Confirm alternate CLI reviewers can hand back findings that preserve severity, evidence, and uncertainty.

### Why This Matters

When two different external CLIs review the same diff, agreement is signal and disagreement is information about doctrine ambiguity. CR-018 tests reconciliation: severity buckets and file:line evidence must be preserved across handbacks, and disagreements must be carried forward with explicit uncertainty rather than averaged away - unsupported claims from either CLI must NOT silently become blockers in the merged report.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-018` and confirm the expected signals without contradictory evidence.

- Objective: Confirm alternate CLI reviewers can hand back findings that preserve severity, evidence, and uncertainty.
- Real user request: `Review uses two alternate CLI surfaces.`
- Prompt: `As an external conductor, cross-check a review through cli-opencode and cli-claude-code against the same changed-file list. Verify both handbacks preserve severity buckets, file:line evidence, and explicit uncertainty on disagreements. Return a reconciled review comparison.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: one scope file list; Step 2: both CLI reports cite lines; Step 3: reconciliation separates confirmed findings from disagreements
- Desired user-visible outcome: a reconciled review comparison that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if reconciliation keeps P0/P1 only when supported by file:line evidence per references/review-core.md; FAIL if unsupported CLI claims become blockers

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
| CR-018 | cli-opencode and cli-claude-code handback | Confirm alternate CLI reviewers can hand back findings that preserve severity, evidence, and uncertainty. | `As an external conductor, cross-check a review through cli-opencode and cli-claude-code against the same changed-file list. Verify both handbacks preserve severity buckets, file:line evidence, and explicit uncertainty on disagreements. Return a reconciled review comparison.` | bash: git diff --staged --name-only -> cli-opencode: review same scope with review findings only -> cli-claude-code: review same scope with review findings only -> agent: reconcile handbacks | Step 1: one scope file list; Step 2: both CLI reports cite lines; Step 3: reconciliation separates confirmed findings from disagreements | Both CLI transcripts and reconciliation report | PASS if reconciliation keeps P0/P1 only when supported by file:line evidence per references/review-core.md; FAIL if unsupported CLI claims become blockers | 1. Check both tools used identical scope; 2. Demand counterevidence for disagreements; 3. Downgrade unsupported claims |

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
| `../../SKILL.md` | Review baseline and tool-neutral output contract |
| `../../references/review-core.md` | Portable findings schema for handbacks |
| `../../../../agent/review.md` | Native @review read-only behavior |
| `../../../../agent/deep-review.md` | Deep-review leaf boundary and file:line evidence discipline |

---

## 5. SOURCE METADATA

- Group: Cross Cli Orchestration
- Playbook ID: CR-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cross-cli-orchestration/cli-opencode-and-cli-opencode-handback.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
