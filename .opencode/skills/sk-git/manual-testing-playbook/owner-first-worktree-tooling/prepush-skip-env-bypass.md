---
title: "GIT-040 -- SPECKIT_SKIP_PREPUSH_NAMING bypass"
description: "This scenario validates the explicit bypass env var for `GIT-040`. It focuses on prove SPECKIT_SKIP_PREPUSH_NAMING=1 disables the entire naming gate for the push, regardless of how malformed the branch name is."
version: 1.0.0.0
---

# GIT-040 -- SPECKIT_SKIP_PREPUSH_NAMING bypass

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-040`.

---

## 1. OVERVIEW

This scenario validates the explicit bypass env var for `GIT-040`. It focuses on prove `SPECKIT_SKIP_PREPUSH_NAMING=1` disables the entire naming gate for the push, regardless of how malformed the branch name is.

### Why This Matters

There are legitimate reasons to push a branch outside the owner-first grammar (one-off backups, external collaboration branches). The bypass must be explicit, logged, and total — never a silent partial skip.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-040` and confirm the expected signals without contradictory evidence.

- Objective: prove `SPECKIT_SKIP_PREPUSH_NAMING=1` disables the entire naming gate for the push, regardless of how malformed the branch name is.
- Real user request: `I know this branch name is unusual on purpose — let me push it without the naming check getting in the way, just this once.`
- RCAF Prompt: `As a git safety reviewer, push a maximally malformed new branch name with SPECKIT_SKIP_PREPUSH_NAMING=1 set, and verify the entire gate is skipped with an explicit bypass notice rather than a silent pass.`
- Expected execution process: Set the env var and feed a badly malformed new-branch line; confirm the hook exits before evaluating any ref line and logs an explicit bypass notice.
- Expected signals: stderr contains `SPECKIT_SKIP_PREPUSH_NAMING=1 — skipping branch-naming gate.`; exit code is 0 regardless of branch name shape.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the bypass env var causes an immediate, explicitly logged skip of the entire gate for every ref line in the push. FAIL if the bypass is silent, or if any ref line is still evaluated/rejected despite the bypass.

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
| GIT-040 | SPECKIT_SKIP_PREPUSH_NAMING bypass | prove `SPECKIT_SKIP_PREPUSH_NAMING=1` disables the entire naming gate for the push, regardless of how malformed the branch name is. | `As a git safety reviewer, push a maximally malformed new branch name with SPECKIT_SKIP_PREPUSH_NAMING=1 set, and verify the entire gate is skipped with an explicit bypass notice rather than a silent pass.` | 1. `bash: printf 'refs/heads/totally!!bad %040d refs/heads/totally!!bad %040d\n' 1 0 \| SPECKIT_SKIP_PREPUSH_NAMING=1 bash pre-push; echo $?` -> 2. `bash: grep -F "skipping branch-naming gate" <stderr>` | Step 1 exits 0; step 2 confirms the exact bypass-notice line is present. | Exit code and the exact bypass-notice stderr line. | PASS if the bypass env var causes an immediate, explicitly logged skip of the entire gate for every ref line in the push. FAIL if the bypass is silent, or if any ref line is still evaluated/rejected despite the bypass. | Confirm the top-of-script `SPECKIT_SKIP_PREPUSH_NAMING` check in `pre-push §1` runs before stdin is even read, then `pre-push.test.sh` bypass case. |

### Optional Supplemental Checks

Repeat with a multi-line push feed (several branches, mixed legality) to confirm the bypass exits before the stdin read loop even starts, not just before the first line's grammar check.

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
| `../../../../scripts/git-hooks/pre-push` | Top-of-script `SPECKIT_SKIP_PREPUSH_NAMING` bypass check |
| `../../../../scripts/git-hooks/tests/pre-push.test.sh` | Regression coverage: bypass-entire-gate case |

---

## 5. SOURCE METADATA

- Group: Owner-First Worktree Tooling
- Playbook ID: GIT-040
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `owner-first-worktree-tooling/prepush-skip-env-bypass.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
