---
title: "Implementation Summary: git test/tool subprocess env isolation"
description: "Hardened three write-capable git test/tool helpers to scrub repository/config-redirecting GIT_* variables from their git subprocesses, closing the vector by which a poisoned parent environment corrupted the shared worktree .git/config. Verified with a new regression test plus direct poisoned-env checks on all three."
trigger_phrases:
  - "git env isolation summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/018-git-subprocess-env-isolation"
    last_updated_at: "2026-07-29T06:03:51Z"
    last_updated_by: "claude"
    recent_action: "Hardened three git helpers; verified no-leak under poisoned env"
    next_safe_action: "Commit on skilled/v4; consider git-context read-path follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs"
      - ".opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py"
      - ".opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "git-env-isolation-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-git-subprocess-env-isolation |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An env-scrub applied to every git subprocess in the three write-capable helpers, so their throwaway-repo isolation no longer depends on the parent process's environment:

- `sk-git/scripts/lib/git-rule-checks.test.mjs` — added `GIT_ENV_REDIRECTORS` + `cleanGitEnv()`; the `git()` helper now passes `env: cleanGitEnv()`. Added a regression test (section 9) that exports `GIT_DIR`/`GIT_WORK_TREE` at a stand-in repo and asserts `makeRepo()` leaves it untouched.
- `sk-doc/shared/scripts/rename_tooling_fixture_core.py` — added `_GIT_ENV_REDIRECTORS` + `_scrub_git_env()`; `_run_git` now builds its child env from a scrubbed base in both the default and caller-supplied branches (previously `env=None` inherited `os.environ` wholesale).
- `sk-git/scripts/tests/worktree-naming.test.sh` — `unset` the redirectors immediately after `set -uo pipefail`, so the fixture's git calls and the EXIT trap's `worktree prune` cannot escape `$TMP`.

The scrubbed set is the repository/config/object-store redirectors (`GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`, `GIT_OBJECT_DIRECTORY`, `GIT_ALTERNATE_OBJECT_DIRECTORIES`, `GIT_CONFIG`, `GIT_CONFIG_GLOBAL`, `GIT_CONFIG_SYSTEM`, `GIT_CONFIG_COUNT`, `GIT_NAMESPACE`, `GIT_CEILING_DIRECTORIES`). Benign vars (author/committer dates, PATH) are preserved.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Root cause was established by sandbox reproduction: git honors `GIT_DIR`/`GIT_WORK_TREE` over `-C <dir>`/`cwd`, so with those exported (routine inside a git worktree — and worktrees share one `.git/config`), an "isolated" `git config` write lands in the real repository. The three helpers each emitted a subset of the exact corruption observed in the real `.git/config` (`test@example.invalid`/`Test`/`git-advisory-*/.no-hooks`/`commit.gpgsign=false` from `makeRepo`; `rename-engine.disposable=true` from the rename fixture; `core.bare=true` from a bare/gitdir resolution). The fix removes those variables from each git subprocess so `-C`/`cwd` is authoritative.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scrub a fixed denylist of repository/config redirectors rather than clearing the whole env. | Preserves vars the helpers legitimately need (e.g. `GIT_AUTHOR_DATE` in the rename fixture's commit path, `PATH`), while removing exactly the ones that beat `-C`/`cwd`. |
| Unset early in the shell test (right after `set`), not just before the fixture. | The EXIT trap runs `git -C "$TMP" worktree prune`; under a poisoned `GIT_DIR` that would prune the real repo's worktrees. Clearing at the top protects the trap too. |
| Leave `git-context.mjs`'s read path unchanged. | It only runs read-only git queries and never writes config, so it cannot corrupt; hardening it is defense-in-depth, recorded as a follow-up. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test git-rule-checks.test.mjs` (incl. new poisoned-env case) | PASS — 24/24 |
| Regression guard is non-vacuous | Confirmed by sandbox repro: the same scenario leaks against an unscrubbed `git()` |
| `bash worktree-naming.test.sh` | PASS — 47/47 |
| Shell helper under poisoned env leaves a stand-in repo untouched | PASS — email/name/bare unchanged, suite still 47/47 |
| Python `_run_git` under poisoned env writes only to the fixture | PASS — stand-in untouched, fixture received `test@example.invalid` + `rename-engine.disposable=true` |
| Rename fixture harness suite | 2 pass / 2 fail — the 2 failures pre-exist (deleted `shared/**/.gitkeep`); proven by running the HEAD version of the core, which fails identically. No regression from this change. |
| Comment hygiene (all 3 files) | CLEAN |
| `validate.sh --strict` | (recorded at packet validation) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rename fixture harness has 2 pre-existing failures** caused by two tracked-but-deleted `.gitkeep` files in the working tree (`shared/assets/.gitkeep`, `shared/scripts/.gitkeep`) — a not-in-scope, not-mine working-tree state. Proven independent of this change by running the original core (identical 2/2 result). Restoring those files or the deleting session's intent is out of this packet's scope.
2. **`git-context.mjs`'s read path is not scrubbed.** It performs only read-only queries and cannot write config, so it is not a corruption vector; a defense-in-depth scrub there is deferred.
3. **This packet prevents recurrence; it does not detect a corrupted config.** The one-time repair of the already-corrupted `.git/config` (identity, hooks path, bare flag) was done operationally in the same session.
<!-- /ANCHOR:limitations -->
