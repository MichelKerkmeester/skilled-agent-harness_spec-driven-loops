---
title: "DAL-011 -- sk-git adapter: commit-message grammar and branch naming"
description: "Verify the sk-git adapter discovers commits + branches, ports the real commit-msg grammar, applies the wt/{NNNN}-{name} rule only to worktree-backed branches (excluding the main checkout), and re-reads live git before every finding."
version: 1.0.0.0
---

# DAL-011 -- sk-git adapter: commit-message grammar and branch naming

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-011`.

---

## 1. OVERVIEW

This scenario validates the sk-git adapter for `DAL-011`. The objective is to verify that `discover({type:'branchRange'})` returns commit + branch artifacts (a `paths`/`globs` scope returns empty), that `checkCommitGrammar` faithfully ports the real `.opencode/scripts/git-hooks/commit-msg` grammar (subject format, vague summaries, body-required-if-≥4-paths against the commit's OWN diff-tree), that the `wt/{NNNN}-{name}` rule is applied only to branches backing a live linked worktree (with the main checkout excluded), and that every finding is preceded by a live git re-read (verify-first).

### WHY THIS MATTERS

sk-git is the fully-deterministic authority: its findings must reflect live git state, not a cached snapshot from discovery time. The body-required rule is subtle — the hook reads today's staging index, but for an already-made commit the adapter must instead use that commit's own historical file count. And the branch rule must not false-positive on legitimately unprefixed long-lived branches (main, integration branches).

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify branchRange discover(), ported commit-msg grammar, worktree-backed branch-naming, and verify-first live git re-reads.
- Real user request: Do my recent commits and worktree branches follow sk-git's conventional-commit and branch-naming standards?
- Prompt: `Validate the sk-git alignment adapter: branchRange discover(), ported commit-msg grammar, worktree-backed branch-naming check, and its verify-first live git re-reads.`
- Expected execution process: Run `discover` over a small real branch range, `check --commit` on a real HEAD sha, and `check --branch` on the current branch, then read the ported grammar constants and the `branchIsBackedByWorktree` main-checkout exclusion.
- Desired user-facing outcome: The user is told which commits/branches were checked, that findings come from the same grammar the commit hook enforces, and that a plain long-lived branch is not flagged just for lacking the wt/ prefix.
- Expected signals: `discover({type:'branchRange'})` returns commit + branch artifacts and a `paths`/`globs` scope returns empty; `checkCommitGrammar` mirrors `commit-msg` (`SUBJECT_RE`, `VAGUE_SUMMARIES`, `historicalFileCount>=4` body rule against the commit's OWN diff-tree, not today's index); exempt subjects (`Merge`/`Revert "`/`fixup!`/`squash!`/`amend!`) are pre-checked out; a non-`wt/` branch is flagged only when `git worktree list --porcelain` shows it backs a live linked worktree; `commitExists`/`branchExists` re-probe live git first.
- Pass/fail posture: PASS if discover/grammar/branch behaviors match the ported hook rules and live git is re-read per finding. FAIL if the adapter uses the staging index for a historical commit, flags a plain branch, or trusts discovery-time state.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so discover is exercised before the commit/branch checks.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the sk-git alignment adapter: branchRange discover(), ported commit-msg grammar, worktree-backed branch-naming check, and its verify-first live git re-reads.
### Commands
1. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs discover HEAD~3 HEAD | head -40`
2. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs check --commit "$(git rev-parse HEAD)"`
3. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs check --branch "$(git rev-parse --abbrev-ref HEAD)"`
4. `bash: rg -n 'SUBJECT_RE|VAGUE_SUMMARIES|BODY_MIN_FILES_FOR_REQUIRED_BODY|historicalFileCount|WT_BRANCH_RE|branchIsBackedByWorktree|commitExists|branchExists|worktreeLine.*REPO_ROOT' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs`
### Expected
`discover HEAD~3 HEAD` returns commit artifacts (`{path:'git-log/<sha>', ref, artifactKind:'commit'}`) plus branch artifacts, with `kind:'FILE'` nodes tagged `authority:'sk-git'`. A `check --commit` on a well-formed HEAD returns no grammar findings (or only P2 warnings); a `check --branch` on the current primary branch returns no finding because the main-checkout block is excluded from the worktree probe. The source shows the ported `commit-msg` constants, the historical-file-count body rule, and the `commitExists`/`branchExists` live re-reads.
### Evidence
Capture the discover sample, both check outputs, and the source lines proving the ported grammar, the diff-tree body rule, and the verify-first live reads plus the main-checkout exclusion.
### Pass/Fail
PASS if discover/grammar/branch behaviors match the ported hook rules and live git is re-read per finding. FAIL if the adapter uses the staging index for a historical commit, flags a plain branch, or trusts discovery-time state.
### Failure Triage
If the current primary branch is flagged `worktree-branch-missing-namespace`, the main-checkout exclusion (compare against `REPO_ROOT`) is broken. If the body rule references `git diff --cached`, it is scoring against today's index instead of the commit's own diff-tree — the documented discrepancy this adapter deliberately avoids.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `discovery-and-adapters/` | Adapter category; the sk-git adapter CLI is exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs` | discover/check, ported grammar constants, worktree probe, live git re-reads |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_git_adapter.md` | Full adapter specification incl. the staging-vs-historical body-rule discrepancy |
| `.opencode/scripts/git-hooks/commit-msg` | The real hook whose grammar the adapter ports |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND ADAPTERS
- Playbook ID: DAL-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `discovery-and-adapters/sk-git-adapter.md`
- Note: Actual findings depend on live repo history; capture whatever the current HEAD/branch produce and reason from the source rules, not from an assumed clean result.
