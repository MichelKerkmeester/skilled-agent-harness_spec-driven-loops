# Resume Prompt — for paused session agents (post worktree/branch cleanup)

> Paste this to a paused session before you un-pause it. It explains what changed on
> the shared branch while it was idle and how to resume safely under the new naming rules.

---

## What happened while you were paused

The operator ran a full worktree/branch declutter on `skilled/v4.0.0.0` (sk-git owner-first
naming packet, `sk-git/002-skill-scoped-worktree-naming`). Concretely:

- **34 stale worktrees were removed** and **30 merged branches were deleted.**
- This was proven safe first: every removed worktree was **0 commits ahead of `origin/skilled/v4.0.0.0`**
  (their work was already on v4), and every deleted branch was an **ancestor of origin/v4**.
- **No committed work was lost.** OIDs for every deleted branch and removed worktree are recorded in
  `deleted-branches-recovery.txt` (same folder). Recover any of them with `git branch <name> <OID>`
  or `git worktree add <path> <branch-or-OID>`.

## First thing to check

Run `git worktree list` and `git branch`.

1. **Your branch still exists** (one of the 11 preserved unmerged branches below, or a new one you make)?
   → Your commits are safe. Continue.
2. **Your worktree is gone but your branch exists?** → Expected if your work was already merged, or your
   worktree was a stale checkout. Re-create a worktree only if you still need one (see below).
3. **Your branch is gone?** → It was merged into v4 (your work is already there). If you believe otherwise,
   find its OID in `deleted-branches-recovery.txt` and restore with `git branch <name> <OID>`.

## Preserved unmerged branches (real work not yet on v4)

`backup/primary-v4-97c3a7b330`, `backup/primary-working-97c3a7b330`, `main`,
`system-speckit/027-xce-research-based-refinement`, `wip/stage1-goal-hardening`,
`work/opencode/20260710-092819-30688`, `wt/0001-mcp-front-proxy`, `wt/0006-deep-review-audit`,
`wt/0014-sk-code-parent`, `wt/0038-codex-hook-parity`, `wt/0039-017-hyphen-naming`.

(`work/021-graph-preservation` and `wt/opencode-doc-readmes` are also preserved — they are still
checked out in external `/private/tmp/**` worktrees that were left untouched.)

## New naming convention (effective now)

Branches are **owner-first**: `{owner}/{NNNN}-{slug}` where `{owner}` is the owning skill id (e.g.
`sk-git`) or the literal `skilled` for cross-cutting/system/release work; directory
`.worktrees/{NNNN}-{owner}-{slug}`. The old flat `wt/{NNNN}-{name}` form is **deprecated but tolerated**
(existing branches are never force-renamed).

**Never hand-compute the number and never create a branch with `git branch` / `checkout -b` / `switch -c`.**
Use the allocator, which holds a clone-wide lock and never reissues a number:

```bash
# reserve a number + create the worktree in one step
bash .opencode/skills/sk-git/scripts/worktree-naming.sh create <owner> <slug>
#   e.g. create sk-code login-refactor -> branch sk-code/{NNNN}-login-refactor
# or just reserve a number:
bash .opencode/skills/sk-git/scripts/worktree-naming.sh allocate
```

A migration-tolerant `pre-push` hook now gates only **new** remote branch names against this grammar;
it never blocks `skilled/v*` and never rewrites existing branches. Bypass (rarely needed):
`SPECKIT_SKIP_PREPUSH_NAMING=1`.

## Resuming your work

1. `git fetch origin skilled/v4.0.0.0`
2. If continuing on your branch: rebase it onto the current tip
   (`git rebase origin/skilled/v4.0.0.0`) from a CLEAN worktree, resolve any conflicts, continue.
3. Commit your own work in your own worktree, then integrate to `skilled/v4.0.0.0`
   (fetch → fast-forward → non-force push). Never `--force`, never stash/reset a shared or dirty tree
   (sk-git ALWAYS #15).
4. If you need a fresh isolated worktree, allocate it owner-first with the command above — do not reuse a
   removed path.

## Do NOT

- Do not recreate the removed `wt/*` worktrees by hand — allocate owner-first instead.
- Do not delete or force-push `main`, `skilled/v*`, or any `backup/*` branch.
- Do not touch another session's `/private/tmp/**` worktree.


READ AND FOLLOW SK-GIT 1:1