## Iteration 2 - Live-sync and worktree lifecycle

### What was read

- `.opencode/bin/git-sync.sh` (294 lines): `_bail` (auto mode always exits 0, `:62`); push-gate classifier `:78-104`; fetch/publish loop `:166-219`; **diverged rebase path `:220-263`**; dirty-tracked refusal `:227-232`; pre-existing rebase refusal `:234-244`; conflict abort + restore assertion + `reset --hard` `:265-293`; `.git/git-sync.log` records `:122-138`.
- `.opencode/bin/git-live-follow.sh` (260 lines): ff-only pull `:219-226`; diverged warn-only `:229-238`; per-checkout PID lock `:123-142`; `--start` refuses inside a linked worktree `:149-155`.
- `.opencode/bin/worktree-session.sh` (360 lines): child detection (AI_SESSION_CHILD / linked worktree) `:159-172`; base resolution env > git config > `.worktrees` `:194-204`; live-branch wiring `:209-215`; shared-path symlinks `:264-317`; socket dir under `$HOME/.spk-wt-sock` `:227`; marker = wrapper PID `:351-356`.
- `.opencode/bin/worktree-reaper.sh` (194 lines): base resolution `:60-70`; `_marker_says_inactive` (marker + dead pid) `:82-98`; wrapper-lane + clean + merged + inactive gate `:122-165`; socket cleanup `:172-183`; marker cleanup `:185-192`.
- `.opencode/scripts/git-hooks/post-commit` (51): autosync gate `:23-49`.
- `.opencode/scripts/git-hooks/post-rewrite` (25) + `lib/autostash-orphan-guard.sh` (46): guard reads `git stash list` at hook time `:19-43`.
- `.opencode/skills/sk-git/SKILL.md`: CI model `:295`; ALWAYS #14 autostash `:369`; ALWAYS #16 no hand-rolled publish `:371`; ALWAYS #17 reap order `:372`.
- `.opencode/skills/sk-git/references/continuous-integration.md`: rebase/refusal contract `:56-57`; guarantee table `:131-137` ("No `--autostash` orphan risk" `:137`).

### What was reproduced

**R2.1-R2.4 -- git-sync diverged-tip matrix (throwaway repo, bare origin, live branch)**

```text
R2.1 diverged, non-conflicting
  [git-sync] rebased onto origin/live and published session/one
  sync_rc=0
  sha_before=091b6097977905ad5b585cfd26eea3a51ac09a0d
  sha_after =de511e02002c0ba53e599cc5c2f6b6c2c08fde33
  session_head_rewritten=yes

R2.2 diverged, conflicting
  Auto-merging shared.txt
  CONFLICT (content): Merge conflict in shared.txt
  [git-sync] auto-publish blocked: session/one conflicts with origin/live (1 commit(s) pending, unpublished).
  sync_rc=1
  sha_unchanged=yes
  no rebase state left

R2.3 diverged with dirty TRACKED file
  [git-sync] origin/live moved but there are uncommitted changes to tracked files — cannot rebase.
  sync_rc=1

R2.4 pre-existing rebase state
  [git-sync] a rebase is already in progress — refusing to rebase or abort it. Resolve: git status ...
  sync_rc=1
```

**R2.5 -- conflicting `git rebase --autostash`: the orphan guard never sees the orphan**

```text
Created autostash: c82e149
Applying autostash resulted in conflicts.
Your changes are safe in the stash.
Successfully rebased and updated refs/heads/main.
--- stash list after rebase ---
stash@{0}: autostash
--- working tree status ---
UU f.txt                      (conflict markers present)
--- post-rewrite invocation log ---
post-rewrite invoked args=rebase
stash_list_at_hook_time:      (EMPTY — the autostash is not in refs/stash yet)
--- autostash rescue anchor ---
none
--- alert log ---
no log
--- manual guard run afterwards (same stash entry now present) ---
⚠️  AUTOSTASH DETECTED  stash@{0}  (c82e149a85d8)
   Safety:   anchored at refs/autostash-rescue/c82e149a85d8 (survives a dropped stash)
c82e149a85d81b6fef031e53b683972037dda45d refs/autostash-rescue/c82e149a85d8
2026-09-11T10:03:58Z	HEAD=182b202	stash@{0}	c82e149a85d81b6fef031e53b683972037dda45d
```

**R2.6-R2.7 -- reaper target resolution and removal (fake HOME, custom base)**

```text
R2.6a reaper WITHOUT SPECKIT_WORKTREE_BASE (worktree lives under a custom base)
  [worktree-reaper] no worktree base dir (.../repo/.worktrees) — nothing to prune
  [worktree-reaper] prune stale socket dir (no matching worktree): .../.spk-wt-sock/pi-...-1111
  [worktree-reaper] prune stale session marker (no matching worktree): .../worktree-sessions/pi-...-1111.pid
  worktree dir still exists: yes
  socket dir still exists:   NO
  marker still exists:       NO

R2.6b same run WITH SPECKIT_WORKTREE_BASE and a LIVE marker
  [worktree-reaper] keep (wrapper active or liveness unproven): .../custom-base/pi-...-1111
  socket dir still exists:   yes

R2.6c same mis-resolution with a LIVE pid marker
  marker still exists:       NO

R2.7 dead marker, live child with cwd inside the worktree
  [worktree-reaper] prune (wrapper merged + clean + inactive): .../repo/.worktrees/pi-...-2222
  Deleted branch work/pi/...-2222 (was dee4e97).
  worktree dir after reaper: NO
  child still alive after:   yes
```

### Findings

1. **[confirmed] A diverged autosync rewrites the session branch under the run.** The publish path rebases the session's commits onto the live tip and pushes; the commit object ids the run recorded change (R2.1: `091b609` -> `de511e0`). Producer: `.opencode/bin/git-sync.sh:246-263`. The sync log records the event but not the old/new SHAs (`_record published "rebased onto ..."`, `:248`), so a run cannot reconstruct which of its references went stale.
2. **[confirmed] The conflict path is genuinely clean** (R2.2): abort + assertion + no residual rebase state, branch SHA unchanged, commits left pending. In `--auto` mode the outcome is invisible except in `.git/git-sync.log` because `_bail` exits 0 (`git-sync.sh:62`). Producer-side design, working as documented; the automation gap is outcome visibility, not correctness.
3. **[confirmed] Dirty tracked files block a diverged publish before any rebase** (R2.3, `git-sync.sh:227-232`) and a pre-existing rebase state is refused untouched (R2.4, `:234-244`). Both are safe refusals; the second is the guard against discarding commits made after a foreign orig-head.
4. **[confirmed] The autostash orphan guard cannot see a rebase autostash when it becomes an orphan.** `post-rewrite` runs before git re-applies the autostash, so `git stash list` is empty at the only hook invocation; the conflicting re-apply then leaves `stash@{0}: autostash` plus a conflict-marked tree with no hook left to run (R2.5). Running the same guard afterwards detects and anchors, so the anchor depends on a later rewrite/merge or a human. Producers: `post-rewrite` delegation, `lib/autostash-orphan-guard.sh:19-43` (reads `refs/stash` only), git's autostash order. This contradicts the stated safety net in `SKILL.md` ALWAYS #14 and the "No `--autostash` orphan risk" line in `continuous-integration.md:137` (the latter is about git-sync's own rebase, which is clean-tree only, but the operator/child path is uncovered).
5. **[confirmed] Reaper base mis-resolution deletes live session state.** A wrapper launched with `SPECKIT_WORKTREE_BASE` env only, then a reaper run without that env, resolves `.worktrees`, finds no worktree for the slug, and prunes the live session's socket dir **and session marker -- even when the marker PID is alive** (R2.6a/c). Producers: `worktree-reaper.sh:60-70` vs `worktree-session.sh:194-204` (env > config > default, env is per-process); marker prune `:190` ignores liveness; socket prune `:178`.
6. **[confirmed] The reaper removes a worktree under a live detached child.** The marker proves only the wrapper's exec'd PID; a child that outlives its parent (background runner) does not refresh it. With the marker dead, the clean+merged worktree is removed and its branch deleted while a process still runs with cwd inside (R2.7). Producers: `worktree-reaper.sh:82-98` (liveness = marker PID only), `worktree-session.sh:351-356` (marker written once).
7. **[code-confirmed] The live follower never rebases/resets; it warns on divergence** (`git-live-follow.sh:219-238`) and moves the primary checkout under any run measuring it; it fast-forwards only, so a run's start/end measurements are the run's responsibility (observed-failures #6 class). No producer defect; pin SHAs.
8. **[code-confirmed] Autosync is silent by construction in the hook path.** `post-commit` calls `git-sync --auto --quiet` (`post-commit:45-46`); `--auto` exits 0 for every non-success and `--quiet` suppresses the success line, so the only durable outcome surface is `.git/git-sync.log`.

### Adjustments proposed

1. **[fix in sk-git] Reaper must resolve worktrees from the registry, not from its own base guess.** Before pruning any socket dir or marker, skip slugs that appear in `git -C MAIN_TOPLEVEL worktree list --porcelain` (any base). Optionally, `worktree-session.sh` should persist the chosen base into `speckit.worktreeBase` when it was chosen from the environment, so later processes agree. Test: R2.6a must leave socket dir and marker intact when the worktree is registered under a custom base.
2. **[fix in sk-git] Reaper must not remove a worktree with a live process inside it.** Add a cwd scan (`lsof -a -d cwd` or `/proc/*/cwd`) over the worktree path before `worktree remove`; refuse (report-only) when any live process resolves inside. Alternative narrower fix: children that outlive their parent write their own liveness marker and the reaper treats any marker liveness as active. Test: R2.7 must keep the worktree while the child is alive.
3. **[fix in hooks] Autostash guard must catch the orphan at (or after) the moment it is created.** At `post-rewrite` time, read `$(git rev-parse --git-path rebase-merge)/autostash` (and `rebase-apply/autostash`) when it exists and anchor that object; additionally run `autostash_orphan_guard` from `post-commit` and at `git-sync.sh` entry so any later commit/publish anchors a leftover entry. Test: R2.5 must show the anchor immediately after the rebase with no manual invocation.
4. **[fix in sk-git] Record the SHA rewrite on the rebase publish path.** Extend `_record published "rebased onto ..."` (`git-sync.sh:248`) to include `old=<sha> new=<sha>` so a run can update anything pinned; print the pair when not `--quiet`. Test: R2.1 asserts the log line contains both SHAs.
5. **[fix in sk-git] Make a blocked auto-publish machine-readable.** `--auto` swallowing every outcome is correct for the commit hook, but a lineage has no signal. Emit a small status file beside `git-sync.log` (or a `git config`-visible ref) with the pending commit count and gate name. Test: R2.2 auto-mode run leaves a status record a script can read.

### What this iteration could not settle

- Whether `git merge --autostash` (post-merge path) also re-applies after the hook (ordering assumed identical; only the rebase path was demonstrated).
- Whether any consumer depends on the session SHA surviving autosync (the reaper checks branch merge state, the containment snapshot uses paths not SHAs; not traced).
- Whether the socket dir deletion actually breaks a running MCP daemon (the daemon side was not reproduced; only the deletion of the directory the daemon's socket lives in).
