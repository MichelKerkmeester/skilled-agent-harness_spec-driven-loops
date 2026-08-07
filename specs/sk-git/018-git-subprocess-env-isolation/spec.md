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
    last_updated_at: "2026-07-29T06:46:35Z"
    last_updated_by: "claude"
    recent_action: "Extended fix to all 12 class helpers via repo-wide sweep"
    next_safe_action: "Commit the extension on skilled/v4"
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
- Scrub the repo/config-redirecting `GIT_*` env vars from every git subprocess in **every** write-capable test/tool helper in the class (a repo-wide sweep found 12 total: the 3 first-identified plus 9 more).
- Add a regression test proving a git config write cannot escape the temp repo even when `GIT_DIR`/`GIT_WORK_TREE` are set in the parent env.
- Provide one canonical scrub util per language (`git_env.py` for the sk-doc Python family; the exemplar `cleanGitEnv()` pattern inlined in the independent JS test files across skills).

### Out of Scope
- Read-only git helpers (`git-context.mjs`; `reference_rewrite_core.py`) — they only run `rev-parse`/`status`/`ls-files` and never write config, so they are not corruption vectors. (Left unchanged; a follow-up could harden them for defense-in-depth.)
- Repairing an already-corrupted `.git/config` — handled operationally (config repaired this session); this packet prevents recurrence.
- Enabling `extensions.worktreeConfig` — a broader git-topology change outside this fix.
- Pre-existing, unrelated failures in `session-enrichment.vitest.ts` (3) and the rename fixture harness (2) — both fail at HEAD independently of this change (not hermetic against the global commit-msg hook / deleted `.gitkeep` files).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` | Modify | Scrub `GIT_*` in the `git()` helper's `execFileSync` env + a poisoned-env regression test. |
| `.opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py` | Modify | Build `_run_git`'s child env from the shared scrub util. |
| `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Unset the `GIT_*` redirectors before the fixture's git calls (incl. the EXIT trap). |
| `.opencode/skills/sk-doc/shared/scripts/git_env.py` | Create | Canonical Python scrub util (`GIT_ENV_REDIRECTORS` + `scrub_git_env`). |
| `.opencode/skills/sk-doc/shared/scripts/rename_engine_core.py` | Modify | Scrub `_git()`'s env — production `git mv` was the most severe vector. |
| `.opencode/skills/sk-doc/scripts/tests/test_reference_checker.py` | Modify | Scrub its own `_git()`; add shared-scripts bootstrap. |
| `.opencode/skills/sk-doc/scripts/tests/test_reference_rewrite_executor.py` | Modify | Scrub its own `_git()`; add shared-scripts bootstrap. |
| `.opencode/skills/sk-doc/scripts/tests/test_semantic_rename_engine.py` | Modify | Scrub its own `_git()`. |
| `.opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py` | Modify | Scrub its own `_git()`; add shared-scripts bootstrap. |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Replace `env: process.env` with `cleanGitEnv()`. |
| `.opencode/skills/system-spec-kit/scripts/tests/session-enrichment.vitest.ts` | Modify | Add `env: cleanGitEnv()` to all git write spawns. |
| `.opencode/skills/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts` | Modify | Add `env: cleanGitEnv()` to `initGitRepo` (dormant suite). |
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | Modify | Unset the `GIT_*` repo redirectors at the top (alongside the existing `GIT_CONFIG_GLOBAL`). |
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
| REQ-005 | A repo-wide sweep finds every write-capable git test/tool helper in the class, and each is hardened. | Every candidate (temp-repo creation + git write) is triaged; all vulnerable ones scrub `GIT_*`; read-only ones are documented as safe. |
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
