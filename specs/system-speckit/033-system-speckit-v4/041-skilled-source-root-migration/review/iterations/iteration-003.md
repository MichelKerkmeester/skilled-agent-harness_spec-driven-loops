# Iteration 003: Hooks and installers

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

## HOOK-001 Session-start hook check skips all validation under `.skilled`-only

- **Severity:** P1
- **File:** `.skilled/bin/check-git-hooks.sh:58`
- **Trigger:** The checkout has `.skilled/` but no `.opencode/`, and SessionStart runs `check-git-hooks.sh`.
- **Consequence:** The script warns about the missing `.opencode` source and exits 0 before checking or repairing hook links.
- **Evidence:** Root detection accepts `.skilled` at lines 53-55, but `HOOK_SOURCE_DIR` is fixed to `.opencode` at line 58. Lines 68-72 exit successfully when it is absent.
- **Fix:** Resolve one effective source root and use it for source inspection and self-healing.

## HOOK-002 `pre-commit` falsely blocks every canonical-root commit

- **Severity:** P1
- **File:** `.skilled/scripts/git-hooks/pre-commit:57`
- **Trigger:** A normal commit in a `.skilled`-only checkout with comment-hygiene bypass unset.
- **Consequence:** The valid checker under `.skilled/` is ignored and the commit exits 1 as “checker missing”.
- **Evidence:** The sentinel accepts either root at lines 20-24, but `COMMENT_CHECKER` only uses `.opencode` at line 57. Lines 63-66 block the commit.
- **Fix:** Resolve the checker through the effective root and apply that resolver to the other gate paths in this hook.

## HOOK-003 `pre-push` rejects every normal update from `.skilled`-only

- **Severity:** P1
- **File:** `.skilled/scripts/git-hooks/pre-push:48`
- **Trigger:** An update push with `.skilled` present, `.opencode` absent and `SPECKIT_ALLOW_MASS_DELETION` unset.
- **Consequence:** The missing old-root mass-deletion library sets `_MASS_DEL_MISSING=1`, then lines 124-129 reject the push before other checks run.
- **Evidence:** The library path is hardcoded to `.opencode` at line 48. Missing-library state is recorded at lines 59-61 and treated as blocking at lines 124-129.
- **Fix:** Resolve the mass-deletion library and all other pre-push helpers through the effective root.

## HOOK-004 Post-lifecycle hooks skip autostash protection

- **Severity:** P1
- **File:** `.skilled/scripts/git-hooks/post-merge:26`
- **Trigger:** A `.skilled`-only checkout runs `post-merge`, `post-rewrite` or `post-commit` while an autostash entry is pending.
- **Consequence:** The orphan guard is not sourced, so the stash is not anchored and can later be lost through stash cleanup or garbage collection.
- **Evidence:** `post-merge` only checks `.opencode` at lines 26-32 and then exits 0. The same logic appears in `post-rewrite:27-33` and `post-commit:28-34`. The guard’s purpose is to make such entries GC-safe at `autostash-orphan-guard.sh:4-13`.
- **Fix:** Resolve the guard library through the effective root. Also change its log path from `.opencode/logs` at lines 34 and 38 of the library.

## HOOK-005 `prepare-commit-msg` silently omits required commit IDs

- **Severity:** P2
- **File:** `.skilled/scripts/git-hooks/prepare-commit-msg:55`
- **Trigger:** A normal commit in a `.skilled`-only checkout with the prepare-hook bypass unset.
- **Consequence:** The hook returns 0 without adding the `Commit-Id` trailer.
- **Evidence:** The allocator is fixed to `.opencode` at line 55. Lines 56-60 warn and succeed when it is absent, despite the hook contract stating that the trailer is always stamped.
- **Fix:** Resolve `commit-id-naming.sh` through the effective root while retaining the hook’s non-blocking behavior.

## INSTALL-001 Codex installer writes broken `.skilled` commands in legacy-only checkouts

- **Severity:** P1
- **File:** `.skilled/bin/install-codex-hooks.mjs:129`
- **Trigger:** Run the installer from a checkout containing only `.opencode/`.
- **Consequence:** The global Codex hook file receives commands pointing at missing `.skilled/...` paths. The hooks fall into their drift fallback instead of executing.
- **Evidence:** `canonicalSourceGroups` only substitutes the project anchor at lines 129-143. The source configuration uses `.skilled/...` at `.codex/hooks.json:8`, and the main path at lines 389-396 preserves that command shape without selecting the available root.
- **Fix:** Store a root-neutral command or rewrite `.skilled` to the detected effective root before writing the target.

## GATE-001 Gate-input scanner ignores missing `.skilled` command paths

- **Severity:** P1
- **File:** `.github/scripts/check-gate-inputs.sh:194`
- **Trigger:** A hook uses a command input such as `"$REPO_ROOT/.skilled/bin/missing.sh"`.
- **Consequence:** The parser emits a note instead of a resolvable input, so `scan_hook` never checks the path and the gate can report success.
- **Evidence:** `varpaths` matches both roots at line 188, but line 194 classifies every non-`.opencode` path as `note`. The consumer only validates `repo` records at lines 304-306. The direct assignment and quoted-literal branches also only recognize `.opencode` at lines 267 and 290.
- **Fix:** Treat `.opencode` and `.skilled` symmetrically in all input-resolution branches and add a missing `.skilled` fixture.

## GATE-002 CI gate workflow runs only the legacy test paths

- **Severity:** P1
- **File:** `.github/workflows/gate-inputs.yml:27`
- **Trigger:** CI checks out a repository containing only `.skilled/`.
- **Consequence:** The `.opencode` globs remain literal, `bash` cannot open the test files and the workflow fails without running the hook suites.
- **Evidence:** The loop names only `.opencode/scripts/git-hooks/tests/*.test.sh` and `.opencode/bin/tests/check-git-hooks.test.sh`.
- **Fix:** Resolve the available root before the loop or enumerate both roots with null-glob handling.
