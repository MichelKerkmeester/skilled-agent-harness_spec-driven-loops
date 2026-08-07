---
title: "Feature Specification: Remote Branch Push Permission Policy"
description: "Every push to origin outside an allowlist (main, skilled/v* release branches) needs a fresh, explicit go-ahead for that push; local branch/worktree creation stays unrestricted."
trigger_phrases:
  - "remote branch policy"
  - "ask before pushing to origin"
  - "remote push permission"
  - "remote branch allowlist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/015-remote-branch-policy"
    last_updated_at: "2026-07-17T16:27:39Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implementation complete, committed 27dd49c73b"
    next_safe_action: "Push once operator resolves the tree divergence"
    blockers:
      - "push to origin rejected non-fast-forward; shared tree has a concurrent session's uncommitted work"
    key_files:
      - ".opencode/scripts/git-hooks/pre-push"
      - ".opencode/skills/sk-git/scripts/worktree-naming.sh"
      - ".opencode/skills/sk-git/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Ask scope: every push (not just branch creation) requires a fresh go-ahead — operator chose this over 'ask only at creation'."
      - "CLAUDE.md sync: add a summary row to §5 Git Workspace Safety — operator approved."
---
# Feature Specification: Remote Branch Push Permission Policy

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

sk-git and its git hooks currently let any locally-created branch reach `origin` freely — the pre-push hook only checks branch **naming**, never whether the branch belongs on the remote at all. This spec adds a second, independent gate: every push to a branch outside a small allowlist (`main`, `skilled/v*` release branches, plus operator-added patterns) requires an explicit, in-the-moment go-ahead, at both the agent layer (sk-git's own behavior) and a technical layer (an extended pre-push hook).

**Key Decisions**: Ask before *every* push to a non-allowlisted branch, not just its first creation (operator's explicit choice over the recommended lighter option); the continuous-integration autosync's live-branch publish stays exempt (scoped narrowly) so it doesn't regress a working, documented feature.

**Critical Dependencies**: Must not break `git-sync.sh`'s "never asks the caller mid-hook" contract ([continuous-integration.md](../../../skills/sk-git/references/continuous-integration.md)), and must not silently widen what reaches origin if its own config file is missing or broken (fail-open must narrow, never widen).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-17 |
| **Branch** | `skilled/v4.0.0.0` (spec authored directly on the current branch; implementation may use a worktree — operator to choose) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Local branch/worktree creation in this repo is cheap and unrestricted by design (numbered worktrees, owner-first naming) — but every one of those branches can currently reach `origin` with an ordinary `git push`, with nothing asking whether it should. The operator wants local branch sprawl to stay free while `origin` stays curated: only a small set of branches (e.g. `main`, `skilled/v4.0.0.0`) belong on remote without asking; everything else needs an explicit yes, every time it's pushed.

### Purpose
No branch reaches `origin` — new or updated — without either an explicit user instruction to push it right now, or an explicit yes to a direct question, unless it matches a small, operator-controlled allowlist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A remote-branch allowlist (`main`, `skilled/v*` built in; operator-extensible via a config file)
- A pre-push git hook gate that blocks any push (new branch or update) to a non-allowlisted branch unless bypassed for that invocation
- An sk-git SKILL.md behavioral rule: ask before every such push, with an explicit user push instruction counting as the go-ahead (no redundant double-ask)
- A scoped, documented exception for the continuous-integration autosync's live-branch publish (see [continuous-integration.md](../../../skills/sk-git/references/continuous-integration.md))
- Updated tests for the pre-push hook (existing scenarios whose expected outcome changes, plus new coverage)
- Cross-references: `finish-workflows.md` (Option 2's push step), `install-git-hooks.sh` header, feature-catalog entry
- A summary row in root `CLAUDE.md` §5 Git Workspace Safety table (operator-approved)

### Out of Scope
- GitHub-side rulesets/branch protection changes — investigated and rejected as the enforcement mechanism (see [research.md](research.md) §4): GitHub rulesets have no "ask" primitive, only allow/deny, and the repo's existing `main-protection` ruleset already grants the repo-owner role an unconditional bypass, so a remote-side rule would not gate the operator's own pushes at all.
- Changing how local branches/worktrees are created (`worktree-naming.sh`'s numbering/grammar) — unrelated surface, already governed by the existing naming gate.
- Retroactively cleaning up branches already on `origin` (`skilled/0064-spec-root-resolution-impl`, etc.) — this policy governs future pushes only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Modify | Add `is_remote_push_allowlisted()` + `_wn_remote_allowlist_file()` + CLI dispatch |
| `.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt` | Create | Operator-editable allowlist patterns (comment-only template; built-ins are hardcoded) |
| `.opencode/scripts/git-hooks/pre-push` | Modify | Add the remote-push permission gate alongside the existing naming gate |
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | Modify | Update 4 scenarios whose expected rc changes; add allowlist/autosync/bypass coverage |
| `.opencode/scripts/install-git-hooks.sh` | Modify | Update pre-push's header description + new bypass var |
| `.opencode/skills/sk-git/SKILL.md` | Modify | New §3 subsection, ALWAYS #18 |
| `.opencode/skills/sk-git/references/remote-branch-policy.md` | Create | Full contract doc (allowlist format, bypass var, autosync exception, rationale) |
| `.opencode/skills/sk-git/references/finish-workflows.md` | Modify | Option 2 push snippet gets `SPECKIT_ALLOW_REMOTE_PUSH=1` + a one-line note |
| `.opencode/skills/sk-git/references/continuous-integration.md` | Modify | Cross-link the scoped exception |
| `.opencode/skills/sk-git/feature-catalog/feature-catalog.md` | Modify | New capability row |
| `CLAUDE.md` (repo root) | Modify | New row in §5 Git Workspace Safety table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pre-push hook blocks any push (new or update) to a branch not on the remote allowlist, unless `SPECKIT_ALLOW_REMOTE_PUSH=1` is set for that invocation | `pre-push.test.sh` proves block-by-default and bypass-when-set, for both new-branch and existing-branch update refs |
| REQ-002 | `main` and `skilled/v*` stay pushable with zero friction, always | Test proves both, new and update forms, with no env vars set |
| REQ-003 | A missing/deleted/empty allowlist config file never widens what's exempt — it only narrows back to the two hardcoded defaults | Test: delete/empty the config file, confirm only `main`/`skilled/v*` still pass, everything else still blocks |
| REQ-004 | The continuous-integration autosync publish to `$SPECKIT_LIVE_BRANCH` stays un-gated when `SPECKIT_AUTOSYNC=1`, scoped exactly to that branch name | Test proves the exemption fires for the live branch and does NOT fire for any other branch even with `SPECKIT_AUTOSYNC=1` set |
| REQ-005 | sk-git's SKILL.md states the ask-first behavior as MANDATORY, with an explicit user push instruction counting as the go-ahead (no redundant re-ask) | New §3 subsection + ALWAYS #18 present; `finish-workflows.md` Option 2 shows the bypass var in its push snippet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `SPECKIT_SKIP_PREPUSH_NAMING=1` no longer implies a bypass of the new permission gate (the two gates are independently bypassable) | Test: naming-skip alone on a malformed, non-allowlisted new branch still blocks on permission; combined with `SPECKIT_ALLOW_REMOTE_PUSH=1` it passes |
| REQ-007 | Root `CLAUDE.md` §5 Git Workspace Safety table carries a one-line pointer to the new rule | Row present, matches the existing table's style |
| REQ-008 | `feature-catalog.md` and `install-git-hooks.sh` reflect the hook's expanded behavior | Both files mention the permission gate and its bypass var |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A push to a brand-new or already-existing non-allowlisted branch is blocked by default and clearly explains how to proceed, both from a human terminal and from an agent-issued `git push`.
- **SC-002**: `main` and `skilled/v*` releases (e.g. `skilled/v4.0.0.0`) push exactly as before — zero added friction.
- **SC-003**: The continuous-integration "always-current live branch" feature (autosync) keeps working unmodified for its one sanctioned branch.
- **SC-004**: `pre-push.test.sh` passes in full (`PASS=<N> FAIL=0`) after the rewrite.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git-sync.sh` / continuous-integration autosync | Blocking its publish would silently strand every wrapper session's commits, seconds-behind visibility included | Scoped, tested exemption keyed to `SPECKIT_AUTOSYNC=1` + exact `$SPECKIT_LIVE_BRANCH` match only |
| Risk | Existing remote branches not on the allowlist (`skilled/0064-spec-root-resolution-impl`, etc.) will need the bypass var on their very next push | Medium — expected friction, not a bug | Documented plainly in this spec and in the reference doc; not "fixed" by grandfathering, since the operator chose ask-every-push |
| Risk | A hook regression could block ALL pushes (including `main`) if the allowlist check is miswired | High if it happens, low likelihood | `main`/`skilled/v*` are checked first via a hardcoded `case`, independent of the config file or any sourced function; tests cover this explicitly before considering the phase done |
| Risk | Existing pre-push tests silently keep passing while asserting stale (pre-change) behavior | Would mask a broken gate | 4 existing tests are being updated in place (not just added-to) with expectations that match the new gate; see [research.md](research.md) §5 |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: A broken or unsourceable `worktree-naming.sh` must fail OPEN for both gates (never silently gate-open is not the issue here — the issue is a broken validator must not turn a normal push into a hard outage); this mirrors the existing naming-gate fail-open contract exactly.

### Reliability
- **NFR-R01**: The hook adds at most one extra pass per already-iterated ref line (no second `stdin` read — the existing loop reads stdin once; the new gate is folded into the same loop body).

---

## 8. EDGE CASES

### Data Boundaries
- Allowlist file present but empty / all-comments: falls back to hardcoded `main`/`skilled/v*` only (same as file absent).
- Multi-branch push (`git push origin a b c`) in one invocation: `SPECKIT_ALLOW_REMOTE_PUSH=1` bypasses the whole invocation, matching the existing `SPECKIT_SKIP_PREPUSH_NAMING` semantics — documented, not silently different.

### Error Scenarios
- `git ls-files` / owner-discovery failure (existing fail-open path in `worktree-naming.sh`) must remain isolated from the new gate's own pass/fail — a naming fail-open must not accidentally also fail-open the permission gate.
- Autosync fires for a branch OTHER than `$SPECKIT_LIVE_BRANCH` (should not happen under the wrapper's own contract, but a hand-set env var could contrive it) → still gated, not exempt.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 11, LOC: ~350-450 (mostly bash + docs), Systems: git hooks, sk-git skill docs, root governance doc |
| Risk | 16/25 | Touches a security/workflow-safety-relevant git hook that runs on every push; interacts with an existing documented safety contract (autosync) |
| Research | 14/20 | Full investigation completed this session (hook internals, autosync, GitHub ruleset API) — see research.md |
| Multi-Agent | 0/15 | Single-author sequential implementation (tightly coupled function/hook/test surface) |
| Coordination | 6/15 | Cross-file consistency required (hook ↔ validator ↔ tests ↔ docs) but no external team coordination |
| **Total** | **50/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | New gate accidentally blocks `main`/release pushes | H | L | Hardcoded `case` check runs first, independent of sourced function/config; explicit tests |
| R-002 | New gate silently fails open (never blocks anything) on a bug, defeating the whole point | H | L | Tests assert BLOCKED rc=1 for the default (non-allowlisted, no bypass) case explicitly |
| R-003 | Autosync exemption becomes a blanket bypass usable for any branch | M | L | Exemption requires exact `branch_name == $SPECKIT_LIVE_BRANCH` match, tested negatively |
| R-004 | Operator/agent forgets the bypass var syntax and gets stuck | L | M | Hook's own BLOCKED message prints the exact retry command every time |

---

## 11. USER STORIES

### US-001: Curated remote, free local branching (Priority: P0)

**As a** repo operator who creates many local worktrees/branches per session, **I want** only a small allowlist of branches to reach `origin` without asking, **so that** `origin` stays clean while local experimentation stays unrestricted.

**Acceptance Criteria**:
1. Given a new local branch `sk-git/0044-foo`, When it is pushed to `origin` without prior confirmation, Then the push is blocked with a clear explanation and retry instructions.
2. Given `skilled/v4.0.0.0`, When it is pushed (new or update), Then it succeeds with no confirmation needed.
3. Given a branch the operator has explicitly approved in the current turn, When it is pushed with `SPECKIT_ALLOW_REMOTE_PUSH=1`, Then it succeeds.

### US-002: Continuous integration keeps working (Priority: P0)

**As a** launch-wrapper session running in continuous-integration/autosync mode, **I want** my commits to keep publishing to the live branch automatically, **so that** the operator's IDE stays seconds-behind current without extra friction.

**Acceptance Criteria**:
1. Given `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH=<branch>` exported by the wrapper, When `git-sync.sh` publishes a commit to `<branch>`, Then the push succeeds without `SPECKIT_ALLOW_REMOTE_PUSH`.
2. Given the same env vars, When something (mistakenly or otherwise) pushes to a DIFFERENT branch, Then that push is still gated normally.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None outstanding — the two forks that mattered (ask-every-push vs. ask-at-creation; whether to touch root `CLAUDE.md`) were resolved with the operator before this spec was authored (see `answered_questions` above and [research.md](research.md) §6).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research**: See `research.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
