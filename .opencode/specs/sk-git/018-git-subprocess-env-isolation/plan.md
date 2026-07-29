---
title: "Implementation Plan: git test/tool subprocess env isolation"
description: "Scrub repository/config-redirecting GIT_* env vars from the git subprocesses of three write-capable test/tool helpers so their temp-repo isolation cannot be defeated by a poisoned parent environment."
trigger_phrases:
  - "git env isolation plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/018-git-subprocess-env-isolation"
    last_updated_at: "2026-07-29T06:46:35Z"
    last_updated_by: "claude"
    recent_action: "Plan executed + extended to all 12 class helpers"
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
    answered_questions: []
---
# Implementation Plan: git test/tool subprocess env isolation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Each of the three helpers spawns `git` with a `-C <tempdir>`/`cwd` but leaves the parent process's `GIT_*` variables in place. Git honors `GIT_DIR`/`GIT_WORK_TREE`/`GIT_CONFIG*` over the working directory, so a poisoned parent env redirects the writes. The fix is uniform: build each git subprocess's environment from the parent's, minus the repository/config-redirecting `GIT_*` keys, so isolation rests solely on the temp path the helper owns.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `node --test` on `git-rule-checks.test.mjs` passes (including a new poisoned-env regression case).
- `bash worktree-naming.test.sh` passes.
- The sk-doc rename fixture's own tests/harness pass.
- Comment hygiene clean on every changed file.
- `validate.sh --strict` on this packet: Errors 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The scrubbed key set is the repository/config/object-store redirectors: `GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`, `GIT_OBJECT_DIRECTORY`, `GIT_ALTERNATE_OBJECT_DIRECTORIES`, `GIT_CONFIG`, `GIT_CONFIG_GLOBAL`, `GIT_CONFIG_SYSTEM`, `GIT_CONFIG_COUNT`, `GIT_NAMESPACE`, `GIT_CEILING_DIRECTORIES`. Benign vars (`GIT_AUTHOR_DATE`, `GIT_COMMITTER_DATE`, `PATH`, etc.) are preserved. Each helper keeps its existing `-C <dir>` argument; the scrub simply removes the overrides that would beat it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current isolation | After fix |
|---------|-------------------|-----------|
| `git-rule-checks.test.mjs` `git()` | `execFileSync('git', …, { cwd })` | same, plus `env` = scrubbed `process.env` |
| `rename_tooling_fixture_core.py` `_run_git` | `env=None` (inherits `os.environ`) or a caller env | scrubbed base env in both branches |
| `worktree-naming.test.sh` fixture | `cd "$TMP"` + `git init/config` | `unset` the `GIT_*` redirectors before any git call |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Add a small scrub helper in each language surface (JS object filter; Python dict filter; shell `unset` list) and apply it to every git spawn in the three helpers.
2. Add a poisoned-env regression test to `git-rule-checks.test.mjs` (exports `GIT_DIR`/`GIT_WORK_TREE` at a throwaway repo, asserts it is untouched).
3. Re-run all three suites and comment hygiene; validate the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The regression proof is the sandbox reproduction already run during investigation: with `GIT_DIR`/`GIT_WORK_TREE` set at a stand-in repo, an unscrubbed `git -C tempdir config user.email …` writes to the stand-in; a scrubbed one does not. Encode that as a `node --test` case for the JS helper; verify the Python and shell helpers by direct poisoned-env invocation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond git and Node/Python already required by the suites.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each change is localized to one helper. Reverting any single edit restores the prior behavior; there is no shared state or migration. `git revert` of the packet commit fully undoes it.
<!-- /ANCHOR:rollback -->
