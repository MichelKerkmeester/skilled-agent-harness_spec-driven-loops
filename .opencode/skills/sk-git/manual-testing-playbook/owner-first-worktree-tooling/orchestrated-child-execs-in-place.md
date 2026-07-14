---
title: "GIT-028 -- Orchestrated child execs in place"
description: "This scenario validates Orchestrated child execs in place for `GIT-028`. It focuses on prove a dispatched child (AI_SESSION_CHILD=1) or a session already inside a linked worktree execs the runtime in place instead of allocating a second nested worktree."
version: 1.0.0.0
---

# GIT-028 -- Orchestrated child execs in place

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-028`.

---

## 1. OVERVIEW

This scenario validates Orchestrated child execs in place for `GIT-028`. It focuses on prove a dispatched child (`AI_SESSION_CHILD=1`) or a session already inside a linked worktree execs the runtime in place instead of allocating a second nested worktree.

### Why This Matters

Nesting worktrees inside worktrees would fragment isolation and orphan every child's own DB/socket state. The two independent signals (env var and structural git-dir check) must both trigger the same safe fallback.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-028` and confirm the expected signals without contradictory evidence.

- Objective: prove a dispatched child (`AI_SESSION_CHILD=1`) or a session already inside a linked worktree execs the runtime in place instead of allocating a second nested worktree.
- Real user request: `A sub-agent got dispatched inside my already-isolated session — make sure it doesn't spin up yet another worktree on top of mine.`
- Prompt: `Launch worktree-session.sh with AI_SESSION_CHILD=1 set and confirm it execs the runtime in place with no new worktree, then repeat from inside an existing linked worktree and confirm the same structural backstop applies.`
- Expected execution process: Set `AI_SESSION_CHILD=1` and run the wrapper in `--dry-run`; separately, run the wrapper (without the env var) from inside an already-linked worktree and confirm the git-dir-vs-common-dir structural check also triggers exec-in-place.
- Expected signals: output states `child/already-isolated session (...) — exec'ing in place, no new worktree`; no `git worktree add` is invoked; runtime arguments are preserved exactly.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if both the env-var signal and the structural backstop each cause an in-place exec with zero new worktrees created and the original CLI arguments preserved unmodified. FAIL if a child still allocates a new worktree, or if the reason string leaks into the exec argv.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is on the intended branch and the working tree is safe for the scenario.
3. Execute or document the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GIT-028 | Orchestrated child execs in place | prove a dispatched child (`AI_SESSION_CHILD=1`) or a session already inside a linked worktree execs the runtime in place instead of allocating a second nested worktree. | `Launch worktree-session.sh with AI_SESSION_CHILD=1 set and confirm it execs the runtime in place with no new worktree, then repeat from inside an existing linked worktree and confirm the same structural backstop applies.` | 1. `bash: AI_SESSION_CHILD=1 bash .opencode/bin/worktree-session.sh --dry-run myrt arg1 arg2` -> 2. `bash: git worktree list` -> 3. `bash: (cd <linked-worktree> && bash .opencode/bin/worktree-session.sh --dry-run myrt)` -> 4. `bash: git worktree list` | Both invocations print `would exec in place: myrt ...` with the original arguments intact; `git worktree list` is identical before and after each. | Dry-run stdout for both cases, and a before/after `git worktree list` diff showing no change. | PASS if both the env-var signal and the structural backstop each cause an in-place exec with zero new worktrees created and the original CLI arguments preserved unmodified. FAIL if a child still allocates a new worktree, or if the reason string leaks into the exec argv. | Check `exec_in_place` and the `GIT_DIR` vs `GIT_COMMON_DIR` comparison in `worktree-session.sh §3`, then `bin/tests/worktree-session.test.sh` child dry-run assertions. |

### Optional Supplemental Checks

Confirm `MK_SPEC_GATE_ENFORCE=0` is exported before the in-place exec, so a dispatched child never inherits an enforced spec gate it has no user turn to answer.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

No `feature-catalog/` package exists for sk-git; see `manual-testing-playbook.md` §14 for the direct-anchor exception.

### Implementation Anchors

| File | Role |
|---|---|
| `../../../../bin/worktree-session.sh` | Child detection (`AI_SESSION_CHILD`) and structural git-dir backstop |
| `../../../../bin/tests/worktree-session.test.sh` | Regression coverage: child dry-run argument preservation |
| `../../SKILL.md` | "Launch-Wrapper Worktrees vs the In-Session Ask-First Rule" |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-028
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner_first_worktree_tooling/orchestrated_child_execs_in_place.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
