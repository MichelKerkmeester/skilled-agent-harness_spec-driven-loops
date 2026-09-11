## Iteration 3 - The preflight advisory

### What was read

- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` (349 lines): `GIT_SHAPE`/`GIT_INVOCATION` acknowledge `-C` but capture only the subcommand `:26-28`; `parseGitCommand` `:57-83`; the 17 checks (`GIT_CHECKS` `:91-343`); fail-open principle `:18-19`.
  - `add-pathspec-matches-nothing` `:146-154` computes `ctx.addDryRun(p.paths).status !== 'unmatched'`.
  - `reset-hard-discards-changes` `:258-262` (`ctx.dirtyCount()`), `add-update-skips-untracked` `:175-180`, `commit-scope-drops-untracked` `:105-122`, `commit-pathspec-empty-change` `:128-140`, `restore-discards-over-staged` `:187-196`, `case-only-pathspec-folds` `:226-233`, `staged-path-rewritten-by-filter` `:240-246`, `clean-force-deletes-files` `:270-280`, `branch-force-delete-unmerged` `:287-294`, `stash-clear-drops-entries` `:300-305`.
- `.opencode/skills/sk-git/scripts/lib/git-context.mjs` (235 lines): `createGitContext(cwd)` `:94`; `addDryRun` `:168-176` (`git add --dry-run --` in `cwd`); `dirtyCount` `:119`; `untrackedPaths` `:115-116`; `isLinkedWorktree` `:136-141` and `isDetached` `:128` exist but are unused by any check.
- `.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` (106 lines): `context = gitContext.createGitContext(ctx.cwd)` `:70`; advisory delivered on `tool_result` `:91-105`; advisory-only `:13-16`.
- `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` (146 lines): `projectDir = payload?.cwd || ... || process.cwd()` `:111`; `createGitContext(projectDir)` `:116`; suppression tiers `:68-75`.
- `.opencode/skills/sk-git/scripts/hooks/opencode/sk-git-preflight-advisory.js` (137 lines): same shape, project dir fallback to `process.cwd()` `:81`, `createGitContext(projectDir)` `:110`.
- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs:281`: the only `-C` test asserts `parseGitCommand('git -C /repo status').sub === 'status'` -- it never checks that state resolves against `/repo`.

### What was reproduced

Throwaway: main checkout + linked worktree `wt1` with three new files reachable only from the worktree. The real `GIT_CHECKS` were evaluated by importing the shipped modules (`evaluate.mjs`, scratch `it3-advisory`).

**R3.1 -- raw git is correct when the cwd is correct**

```text
$ git add --dry-run -- w1.txt w2.txt w3.txt        # inside wt1
add 'w1.txt'
add 'w2.txt'
add 'w3.txt'
dry_run_rc=0
$ git add --dry-run -- w1.txt w2.txt w3.txt        # inside main
fatal: pathspec 'w1.txt' did not match any files
dry_run_main_rc=128
$ git add w1.txt w2.txt w3.txt                     # inside wt1
w1.txt
w2.txt
w3.txt
```

**R3.2 -- the real rule engine, correct vs mismatched context cwd**

```text
case 1: context cwd == command cwd (worktree)          advisories fired: (none)
case 2: context cwd = main, paths exist only in wt1    advisories fired: add-pathspec-matches-nothing
case 3: git -C <wt1> add ... , context cwd = main      advisories fired: add-pathspec-matches-nothing
case 4: cd <wt1> && git add ... , context cwd = main   advisories fired: add-pathspec-matches-nothing
case 5: git -C <wt1> add ... , context cwd = wt1       advisories fired: (none)
```

**R3.3 -- the same defect silences a real warning (dangerous direction)**

```text
case 6: git reset --hard, context cwd = wt1 (dirty)   advisories fired: reset-hard-discards-changes
case 7: git reset --hard, context cwd = main (clean)  advisories fired: (none)   <- dirty worktree loses changes unwarned
```

### Findings

1. **[confirmed] The `add-pathspec-matches-nothing` misfire is a context-cwd defect, not a git behavior.** Raw `git add --dry-run` resolves correctly in a linked worktree (R3.1); the check fires only when the context is built on a directory other than the command's effective one (R3.2 cases 2/4). Producer: `git-rule-checks.mjs:146-154` -> `git-context.mjs:168-176`, with the context directory chosen by the adapter: `hooks/pi/git-preflight-advisory.ts:70` (`ctx.cwd`), `hooks/git-preflight-advisory.mjs:111,116` (payload cwd/`process.cwd`), `hooks/opencode/sk-git-preflight-advisory.js:81,110`. Whether the reported session hit this via a runtime cwd mismatch or via the two command forms below is not settled; both command forms are reproduced.
2. **[confirmed] `-C <dir>` is parsed and then dropped.** `GIT_INVOCATION` (`git-rule-checks.mjs:26-28`) consumes `-C <target>` but `parseGitCommand` returns no target and every check reads `ctx`, which was built from the session cwd. `git -C <wt1> add <paths>` evaluated from main fires the false advisory (R3.2 case 3) while the command itself stages exactly those paths.
3. **[confirmed] An inner `cd` is ignored.** `cd <wt1> && git add <paths>` is evaluated against the session cwd, same false fire (R3.2 case 4).
4. **[confirmed] The direction that matters is false silence.** `git reset --hard` about to destroy dirty files in the worktree produces no advisory when the context cwd is the clean primary checkout (R3.3 case 7). This contradicts the module's own fail-open principle: uncertainty is supposed to mean silence, but here certainty is borrowed from the wrong repository state (`git-rule-checks.mjs:18-19`).
5. **[confirmed by code] Twelve of the seventeen checks are cwd-sensitive and can false-fire or false-silence under a mismatched context**: `commit-scope-drops-untracked`, `commit-pathspec-empty-change`, `add-pathspec-matches-nothing`, `add-pathspec-only-ignored`, `add-update-skips-untracked`, `restore-discards-over-staged`, `case-only-pathspec-folds`, `staged-path-rewritten-by-filter`, `reset-hard-discards-changes`, `clean-force-deletes-files`, `branch-force-delete-unmerged`, `stash-clear-drops-entries` (each consumes a `ctx` accessor; line references above). Five checks are shape-only and cwd-independent: `checkout-from-ref-stages-silently`, `merge-strategy-resolves-one-sided`, `history-expiry-defeats-recovery`, `push-deletes-remote-ref`, `force-push-without-lease`.
6. **[confirmed by code] Detached HEAD cannot misfire the current rule set** because no check reads `ctx.branch()` or `ctx.isDetached()`; both accessors exist unused (`git-context.mjs:122-128`), as does `isLinkedWorktree()` (`:136-141`). Any detached-HEAD problem today enters only through the cwd path above.

### Adjustments proposed

1. **[fix in sk-git] Resolve the command's effective cwd before building context.** Have `parseGitCommand` return the first `-C <dir>` target (resolved relative to the session cwd) and pass it to `createGitContext`; when the command contains a preceding `cd <dir> &&` segment, resolve that directory as well, or skip path-dependent checks entirely for that evaluation. Producer: `git-rule-checks.mjs:26-28,57-83` + the three adapters above. Test: port R3.2 cases 3/4 into `git-rule-checks.test.mjs` asserting no advisory when the target directory holds the paths.
2. **[fix in sk-git] Enforce the stated fail-open principle at the check boundary.** When the effective cwd is uncertain (unparseable `cd`/`-C`, multiple conflicting directories), checks must return true (silence) rather than borrow state from the session cwd. Same producer lines; test asserts `git -C /elsewhere add x` from any cwd produces no `add-pathspec-matches-nothing`.
3. **[fix in sk-git] Keep the advisory non-blocking, but stop paying for it wrongly.** No suppression change is needed for correctness; the three suppression tiers (`SKGIT_ADVISORY=0`, id-prefix and single-id skips, `hooks/pi/git-preflight-advisory.ts:11-21`) already exist and the text names the skip form. Priority is the state source, not the switch.
4. **[fix in sk-git, optional] Wire the dormant accessors.** `isDetached`/`isLinkedWorktree` are unused; a rule for the SKILL.md #15 case (push from detached HEAD does not move the local branch) would justify them, but that is an addition, not a misfire fix.
5. **[ruled out] "Raw `git add --dry-run` misbehaves in a linked worktree."** Disproved by R3.1; the shipped check's own dry-run call is the correct approach when its cwd is correct.

### What this iteration could not settle

- Which runtime cwd the reported session actually supplied (`ctx.cwd` vs the bash command's cwd); both the `-C` and inner-`cd` reproductions demonstrate the defect without that answer.
- Whether the pi adapter ever receives a per-call working directory distinct from `ctx.cwd` (the extension API surface exposed to this session does not show it).
