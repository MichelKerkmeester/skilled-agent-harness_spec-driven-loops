---
title: "Feature Specification: git test/tool subprocess env isolation"
description: "Three git-family test/tool helpers isolate their throwaway repositories only by cwd, but git honors GIT_DIR/GIT_WORK_TREE over cwd, so under a poisoned env their config writes leak into the shared worktree .git/config, corrupting the real repository's identity, hooks path, and bare flag."
trigger_phrases:
  - "git env isolation"
  - "git config leak"
  - "GIT_DIR scrub"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/018-git-subprocess-env-isolation"
    last_updated_at: "2026-07-29T06:03:51Z"
    last_updated_by: "claude"
    recent_action: "Hardened 3 helpers; verified no-leak; ready to commit"
    next_safe_action: "Commit on skilled/v4; optional git-context read-path follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs"
      - ".opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py"
      - ".opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "git-env-isolation-20260729"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope covers all three leaking helpers (operator chose the full-fix option)."
---
# Feature Specification: git test/tool subprocess env isolation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Completed** | 2026-07-29 |
| **Branch** | `skilled/v4.0.0.0` (direct, per operator choice) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three git-family test/tool helpers create throwaway git repositories and write config into them, isolating those writes **only** by passing a `cwd`/`-C <dir>` to git. But git resolves its target repository from `GIT_DIR`/`GIT_WORK_TREE` (and config from `GIT_CONFIG*`) **in preference to** the working directory. When any of these helpers runs in a session that has those variables exported — which happens routinely for a process launched inside a git worktree — the "isolated" `git config` calls silently write to the resolved repository instead of the temp one. Because `extensions.worktreeConfig` is unset, all worktrees share the main `.git/config`, so such a leak corrupts the real repository's identity, hooks path, and bare flag, breaking every subsequent git operation.

This has recurred in practice: the real repo's `.git/config` was found with `user.email=test@example.invalid` / `user.name=Test` / `core.hooksPath=…/git-advisory-*/.no-hooks` / `commit.gpgsign=false` (verbatim output of `git-rule-checks.test.mjs`'s `makeRepo`), `rename-engine.disposable=true` (from the sk-doc rename fixture), and `core.bare=true` (a bare/gitdir resolution under a poisoned `GIT_DIR`).

### Purpose
Make the three helpers immune to a poisoned parent environment by scrubbing the repository/config-redirecting `GIT_*` variables from each git subprocess, so their isolation depends on nothing but the temp path they own.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scrub the repo/config-redirecting `GIT_*` env vars from every git subprocess in the three write-capable helpers.
- Add a regression test proving a git config write cannot escape the temp repo even when `GIT_DIR`/`GIT_WORK_TREE` are set in the parent env.

### Out of Scope
- The production `git-context.mjs` read path — it only runs read-only git queries (`rev-parse`, `status`) and never writes config, so it is not a corruption vector. (Left unchanged; a follow-up could harden it for defense-in-depth.)
- Repairing an already-corrupted `.git/config` — handled operationally (config repaired this session); this packet prevents recurrence.
- Enabling `extensions.worktreeConfig` — a broader git-topology change outside this fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` | Modify | Scrub `GIT_*` redirectors in the `git()` helper's `execFileSync` env. |
| `.opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py` | Modify | Build `_run_git`'s child env from a scrubbed base instead of inheriting `os.environ` unfiltered. |
| `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Unset the `GIT_*` redirectors before the fixture's git calls. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `git-rule-checks.test.mjs`'s git subprocesses ignore inherited `GIT_DIR`/`GIT_WORK_TREE`/`GIT_CONFIG*`. | A test that exports `GIT_DIR`/`GIT_WORK_TREE` at a stand-in repo and runs the helper leaves that repo's config untouched. |
| REQ-002 | The sk-doc rename fixture's `_run_git` does not inherit repo/config-redirecting `GIT_*` from `os.environ`. | Fixture repo creation under a poisoned env writes only to the fixture, not the parent-pointed repo. |
| REQ-003 | `worktree-naming.test.sh`'s fixture git calls ignore inherited `GIT_*` redirectors. | Running the suite under a poisoned env does not write to the parent-pointed repo. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A committed regression test encodes the leak-and-prevention proof for the primary helper. | `node --test` on the new/updated test fails on the pre-fix helper and passes on the fixed one. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With `GIT_DIR`/`GIT_WORK_TREE` exported at a throwaway "real" repo, running each hardened helper leaves that repo's `user.email`, `user.name`, `core.bare`, and `core.hooksPath` unchanged.
- **SC-002**: All three helpers' existing test suites still pass after the change (no behavior regression).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-scrubbing removes a `GIT_*` var the helper legitimately needs (e.g. `GIT_AUTHOR_DATE`). | Med | Scrub only repository/config-redirectors (`GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`, `GIT_OBJECT_DIRECTORY`, `GIT_ALTERNATE_OBJECT_DIRECTORIES`, `GIT_CONFIG*`, `GIT_NAMESPACE`); preserve author/committer-date and other benign vars. |
| Dependency | Concurrent worktree sessions may run these helpers while the fix lands. | Low | Change is additive to the helpers; landing it only strengthens isolation, never weakens it. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether `git-context.mjs`'s read path warrants the same scrub for defense-in-depth is deferred (it never writes config, so it cannot corrupt).
<!-- /ANCHOR:questions -->
