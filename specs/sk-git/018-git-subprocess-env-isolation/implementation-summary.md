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
    last_updated_at: "2026-07-29T06:46:35Z"
    last_updated_by: "claude"
    recent_action: "Extended to all 12 class helpers; sweep + tests verified"
    next_safe_action: "Commit the extension on skilled/v4"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/git_env.py"
      - ".opencode/skills/sk-doc/shared/scripts/rename_engine_core.py"
      - ".opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs"
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

### Class-wide extension (repo-wide sweep)

A repo-wide sweep (temp-repo creation ∩ git-write spawn, then per-file verification) found 9 more helpers in the same class, all hardened here:

- **Canonical Python util** `sk-doc/shared/scripts/git_env.py` — `GIT_ENV_REDIRECTORS` + `scrub_git_env()`. `rename_tooling_fixture_core.py`'s local copy was collapsed onto it. (It lives in its own leaf module because `rename_tooling_fixture_core` imports from `rename_engine_core`, so the util cannot sit in either without a cycle.)
- **Production tool** `sk-doc/shared/scripts/rename_engine_core.py` — its `_git()` (driving `git mv`) now scrubs; this was the most severe vector (a mutating write, not a test fixture).
- **sk-doc test fixtures** (`test_reference_checker.py`, `test_reference_rewrite_executor.py`, `test_semantic_rename_engine.py`, `test_no_new_snake_case_guard.py`) — each had its OWN unscrubbed `_git()`; each now imports `scrub_git_env` (three needed a `SHARED_SCRIPTS` `sys.path` bootstrap) and passes `env=scrub_git_env()`.
- **JS fixtures** `write-containment.vitest.ts` (was `env: process.env`), `session-enrichment.vitest.ts` (scattered inline spawns), `auto-detection-fixes.vitest.ts` (dormant `describe.skip`) — each got the `cleanGitEnv()` exemplar inlined (no shared JS test util exists across these skills).
- **Shell** `.opencode/scripts/git-hooks/tests/pre-push.test.sh` — `unset` the repo redirectors at the top (its pre-existing `GIT_CONFIG_GLOBAL=/dev/null` covered only global config).

Ruled SAFE by the sweep and left unchanged: `reference_rewrite_core.py` (read-only git), `fanout-merge.vitest.ts` (spawns `node`, never `git`), plus read-only benchmark/validator scripts.
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
| **Extension** — `rename_engine_core.py` `git mv` fix | Exercised by `test_semantic_rename_engine.py` — PASS 18/18 |
| **Extension** — 4 sk-doc test fixtures | PASS — 18 + 9 + 9 + 4 = 40/40 |
| **Extension** — `write-containment.vitest.ts` | PASS — 16/16 (root: system-deep-loop/runtime) |
| **Extension** — `pre-push.test.sh` | PASS — 21/21 |
| **Extension** — `session-enrichment.vitest.ts` | 10 pass / 3 PRE-EXISTING fail / 3 skip — the 3 fails reproduce at HEAD (not hermetic vs the global commit-msg hook); no regression |
| **Extension** — `auto-detection-fixes.vitest.ts` | Dormant (`describe.skip`); compiles/parses; scrub applied for when re-enabled |
| Python compile + import smoke (git_env + cores) | PASS — all compile; `scrub_git_env` drops `GIT_DIR` |
| Comment hygiene (all 12 files + `git_env.py`) | CLEAN |
| `validate.sh --strict` | (recorded at packet validation) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two suites carry pre-existing, unrelated failures** — the rename fixture harness (2, from tracked-but-deleted `shared/**/.gitkeep`) and `session-enrichment.vitest.ts` (3, not hermetic against the global commit-msg hook). Both reproduce at HEAD without this change (proven by restoring the original file and re-running), so neither is a regression; both are not-mine working-tree/test-hermeticity issues out of this packet's scope.
2. **Read-only git helpers are not scrubbed** (`git-context.mjs`, `reference_rewrite_core.py`). They run only `rev-parse`/`status`/`ls-files` and cannot write config, so they are not corruption vectors; a defense-in-depth scrub is deferred.
3. **This packet prevents recurrence; it does not detect a corrupted config.** The one-time repair of the already-corrupted `.git/config` (identity, hooks path, bare flag) was done operationally in the same session.
4. **The sweep covered the standard "temp-dir creation + git write" pattern.** A helper that builds a fixture repo via a non-standard temp API, or writes to a hard-coded fixture path, could still exist; the sweep is high-confidence for the class but not provably exhaustive.
<!-- /ANCHOR:limitations -->
