---
title: "Feature Specification: Phase 1: git-hook-review-fixes"
description: "A review of the machine-wide git hooks found one P0 (a cloned repo's own tree supplies code the hooks run), eleven P1 gate bugs and seven P2 items. This phase fixes all nineteen, with DeepSeek V4.1 Flash implementing one change per dispatch against a plan written here."
trigger_phrases:
  - "git hook review fixes"
  - "untrusted repo hook source root"
  - "pre-push range already on remote"
  - "commit-id rebase collision"
  - "cherry-pick commit-id remint"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: git-hook-review-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/075-git-hook-review-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every hook suite and node test passes, the two new trust tests pass, and validate.sh --strict passes on this child and the parent. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Fix the git hook review findings specification.

**Scope Boundary**: The hook scripts under `.skilled/scripts/git-hooks/`, their libraries and tests, the sk-git message validator, the hook installer, `.skilled/hooks/git/pre-commit`, and the docs that describe them. Nothing outside the hooks changes behavior.

**Dependencies**:
- The review report of 2026-10-02 at base `f8519088b9` (findings 1 to 19).
- Operator rulings: #12 warn only, #14 keep the `skilled/v*` exemption.

**Deliverables**:
- Hook, validator and installer fixes for findings 1 to 11, 13, 15 to 17 and 19.
- Wording and doc fixes for findings 12, 14 and 18.
- Regression tests that fail on the old code for the behavior findings.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hooks are installed machine-wide through `core.hooksPath`, but they choose their source root from a file inside whatever repository they fire in, so a cloned repository can make them run its own code on `pull`, `commit` or `push`. Beyond that, the pre-push message range re-checks commits already on the remote, the Commit-Id rules block rebased copies and keep ids on cherry-picks, and several gates fire in repositories that do not carry this toolchain.

### Purpose
The hooks run only trusted code, check only what the push or commit adds, and stay silent in foreign repositories, with docs that say what the code does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A trust check in every hook's source-root block: a repository's tree supplies scripts only when it shares a git common dir with the hook's own checkout or its local config sets `skilled.trustRepoHooks=true`.
- Pre-push range, crash reporting and remote handling (findings 2, 5, 6, 8, 15).
- Commit-Id uniqueness for rebased and amended copies, and re-minting on cherry-picks (3, 4).
- Ignoring a command-scope `skgit.contractDir` (9).
- Attribution stripping that keeps every line but the two forbidden keys (10).
- Comment hygiene on staged blobs with NUL-safe paths and one checker call (11, 19).
- Agreement between commit-msg and pre-push on `#` lines (13).
- Gating the mirror-parity gate and two warnings to the toolchain repo (7, 16).
- Installer error and stale references (17), doc drift (18), warn-only wording (12), exemption comment (14).

### Out of Scope
- Making the skill-metadata gate block: the operator ruled warn only.
- Routing `skilled/v*` creation through the allowlist: the operator ruled to keep the exemption.
- The pre-existing `install-git-hooks-worktree-harness.sh` failure and the CI citation and sk-doc test failures: they predate this work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/git-hooks/{pre-commit,prepare-commit-msg,post-commit,post-merge,post-rewrite,pre-push}` | Modify | Trust block; gate and range fixes |
| `.skilled/scripts/git-hooks/tests/*.test.sh` | Modify | Trust opt-in in fixtures; regression tests |
| `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` | Modify | Contract dir scope, Commit-Id owner, comment stripping |
| `.skilled/skills/sk-git/scripts/validate-message.mjs` | Modify | Crash versus rule-failure exit |
| `.skilled/scripts/install-git-hooks.sh` | Modify | Friendly error, stale refs |
| `.skilled/hooks/git/pre-commit`, `.skilled/hooks/git/install-hooks.sh` | Modify | Staged-blob hygiene, false claim |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` (+ its test) | Modify | Several files per run |
| `.skilled/scripts/git-hooks/README.md`, `lib/README.md`, `.skilled/hooks/git/README.md`, `ENV-REFERENCE.md`, `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | Docs and comments |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A repository that is not the hooks' own checkout, and has not opted in through local config, never has code from its tree sourced or run by any hook. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Pre-push validates only commits not reachable from any remote-tracking ref or the remote's old tip, and reports a validator crash differently from a rule failure. |
| REQ-003 | A Commit-Id owner with the same author email and author date as the candidate is not a collision, at commit-msg and at pre-push. |
| REQ-004 | A cherry-pick, clean or conflicted, gets a fresh Commit-Id. |
| REQ-005 | A `skgit.contractDir` set on the command line or through `GIT_CONFIG_*` is ignored. |
| REQ-006 | prepare-commit-msg removes only `Co-Authored-By:` and `Claude-Session:` lines, never line 1, and prints what it removed. |
| REQ-007 | The mirror-parity gate and the routing-commit-parity check run only where the toolchain is present; routing parity compares only a pushed sha equal to HEAD. |
| REQ-008 | Comment hygiene checks staged content, handles any path name, and runs the checker once per commit. |
| REQ-009 | Docs and header comments match the code (findings 12, 14, 15, 16, 17, 18). |

### P2 - Optional

| ID | Requirement |
|----|-------------|
| REQ-010 | commit-msg and pre-push treat lines starting with `#` the same way git stored them. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The review's P0 reproduction (a planted guard library in a cloned repo) no longer runs.
- **SC-002**: Every hook suite and node test passes, including a regression test per behavior finding that fails on base `f8519088b9`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The trust check misreads a worktree of the hooks' checkout as foreign | High: gates stop running here | Compare git common dirs, which worktrees share; test from a worktree |
| Risk | A loosened Commit-Id check lets a real collision through | Med | Require both author email and author date to match |
| Dependency | DeepSeek V4.1 Flash via cli-opencode | Implementation stalls | One change per dispatch; every diff checked before the next |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Comment hygiene adds one checker process per commit, not one per file.

### Security
- **NFR-S01**: No hook sources or executes a file from an untrusted repository's tree.
- **NFR-S02**: The trust opt-in is read from local config only, which a clone never carries.

### Reliability
- **NFR-R01**: Hooks in a repository without the toolchain print nothing and block nothing beyond the message contract.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Staged path names with non-ASCII bytes or spaces are checked, not skipped.
- A message whose first line names the vendor keeps that line.

### Error Scenarios
- A force-push over a remote tip that is not in the local object store falls back to the new-branch range.
- A push by URL excludes commits known to any remote.

### State Transitions
- A conflicted cherry-pick finished with `--continue` arrives with source `merge` and must still be re-minted.
- An amend keeps the original author date, so the amended commit is not a collision with its predecessor.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 20 files, shell plus one Node module |
| Risk | 18/25 | Machine-wide hooks; security boundary |
| Research | 8/20 | Git behavior probed for amend and cherry-pick |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Findings 12 and 14 were ruled by the operator on 2026-10-02.
<!-- /ANCHOR:questions -->

---
