---
title: Unsticking a Dirty or Behind Worktree
description: Safe, phantom-deletion-aware recovery for a session jammed on git state, plus a ready-to-paste prompt for a stuck session.
trigger_phrases:
  - "dirty worktree stuck"
  - "phantom deletions restore from origin"
  - "cannot rebase unstaged changes"
  - "stale checkout behind origin"
  - "commit got orphaned by reset"
  - "mass deletion guard blocked commit"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Unsticking a Dirty or Behind Worktree

Recover a session jammed on git state without re-clobbering the branch, and hand a stuck session a ready-to-paste prompt.

---

## 1. OVERVIEW

### Core Principle

A stale checkout's "deletions" are usually files it has not received yet, not files anyone removed — restore them from origin before you commit, and never `git add -A` a tree you have not reconciled.

### When to Use

- A session reports a dirty worktree it cannot commit, a rebase blocked by unstaged changes, deletions it did not make, or a commit that "vanished."
- `git status` shows deleted files that still exist on the remote.
- A commit was rejected by the mass-deletion guard.

### Context

- The external auto-sync that used to commit and publish every session's WIP is **removed**. Nothing lands a session's work now except that session — but a commit is no longer orphaned by an automated reset, so committing and pushing your own work is safe.
- A pre-commit guard blocks any commit deleting more than 100 tracked files (`SPECKIT_ALLOW_MASS_DELETION=1` to authorize an intended one). When it fires, treat it as the safety net catching a stale tree, not an obstacle to override blindly. See the mass-deletion guard in `.opencode/scripts/git-hooks/lib/`.
- The live branch referenced throughout is `skilled/v4.0.0.0`. Swap that token if a session targets a different branch.

---

## 2. RECOVERY PROCEDURE

You MUST complete each phase before the next; do not skip ahead to a commit.

#### Phase 1: Fetch the truth

**Actions**:
1. `git fetch origin skilled/v4.0.0.0`

**Validation**: `origin_known` — the local `origin/skilled/v4.0.0.0` ref now reflects the real remote tip.

#### Phase 2: Clear a stuck operation (only if genuinely stale)

**Actions**:
1. If `git status` errors on a lock, confirm no git is running (`ps aux | grep -i '[g]it'`), then `rm -f .git/index.lock`.
2. If a half-finished rebase or merge is unwanted: `git rebase --abort` or `git merge --abort`.

**Validation**: `git_operational` — `git status` runs cleanly with no in-progress operation you did not intend.

#### Phase 3: Restore phantom deletions (the most common cause)

**Purpose**: A file shown as deleted but still present on origin means your checkout is *behind* origin, not that you deleted it.

**Actions**:
1. List the phantom deletions:
   ```bash
   git status --porcelain | grep -E '^ ?D' | sed 's/^...//' \
     | while read f; do git cat-file -e "origin/skilled/v4.0.0.0:$f" 2>/dev/null \
       && echo "PHANTOM (restore me): $f"; done
   ```
2. Restore every phantom from origin (purely additive):
   ```bash
   git checkout origin/skilled/v4.0.0.0 -- \
     $(git status --porcelain | grep -E '^ ?D' | sed 's/^...//')
   ```

**Validation**: `no_phantom_deletions` — `git status --porcelain | grep -cE '^ ?D'` is `0`, or shows only deletions you actually intend.

#### Phase 4: Commit only your real changes

**Purpose**: The tree is now additive/intended. Land your own work.

**Actions**:
1. Stage what you actually changed and commit.
2. If the tree is a chaotic mix of concerns you cannot cleanly separate, STOP and do your work in an isolated worktree instead of the shared checkout:
   ```bash
   git worktree add --detach /tmp/mywork origin/skilled/v4.0.0.0
   ```

**Validation**: `own_changes_committed` — the commit contains your intended changes and no phantom deletions.

#### Phase 5: Push

**Actions**:
1. Push your branch. If rejected as non-fast-forward, the branch moved under you:
   ```bash
   git fetch origin skilled/v4.0.0.0 && git rebase origin/skilled/v4.0.0.0
   ```
   or cherry-pick your commit into a fresh worktree off origin and push from there.

**Validation**: `published` — your commit is an ancestor of `origin/skilled/v4.0.0.0`. Never force-push the shared branch.

---

## 3. ANTI-PATTERNS

| Wrong move | Why it breaks | Do instead |
|---|---|---|
| `git add -A && commit` on an un-reconciled tree | Commits phantom deletions → removes files that only exist on origin (silent clobber) | Phase 3 first, then commit only real changes |
| `git reset --hard origin/...` to "clean up" | Destroys another session's uncommitted WIP in a shared checkout | Restore phantoms additively (Phase 3); keep real WIP |
| Force-pushing the shared branch after a rejection | Overwrites concurrent writers' commits | Rebase onto origin, or push from a worktree off origin |
| Overriding the mass-deletion guard reflexively | Skips the one check that catches a stale-tree clobber | Investigate the deletion count; override only for a truly intended bulk delete |

If after Phase 3 the tree still does not make sense, do NOT guess — report the branch, `HEAD` vs `origin/skilled/v4.0.0.0`, and the deletion/modification counts, and ask before committing.

---

## 4. READY-TO-PASTE SESSION PROMPT

Hand this verbatim to a stuck session:

```
You appear stuck on git state (dirty worktree, "can't rebase," deletions you
didn't make, or a commit that vanished). STOP and read this fully before running
any git command.

Do NOT `git add -A && commit`, do NOT `git reset --hard`, and do NOT force-push
until the checks below pass. A blind commit of a *stale* tree silently deletes
files that only exist on the remote — that is the exact bug that broke everyone.

Context:
- The old auto-sync that used to commit/publish everyone's WIP is GONE. Nothing
  lands your work now except you. A commit no longer gets orphaned by a reset —
  so it's safe to commit and push your own work.
- A pre-commit guard blocks any commit deleting >100 tracked files. If it fires,
  that's the safety net catching a stale tree — investigate, don't just override.
  (Real, intended large deletion only: `SPECKIT_ALLOW_MASS_DELETION=1 git commit`.)

Your live branch is `skilled/v4.0.0.0`. Work through these IN ORDER:

1) Fetch the truth:
     git fetch origin skilled/v4.0.0.0

2) Clear a stuck op ONLY if genuinely stale:
   - If `git status` errors on a lock: confirm no git is running
     (`ps aux | grep -i '[g]it'`), then `rm -f .git/index.lock`.
   - Half-finished and unwanted: `git rebase --abort` or `git merge --abort`.

3) Find PHANTOM deletions (the #1 cause). These are files your worktree shows as
   deleted but that still exist on origin — meaning your checkout is just BEHIND
   origin, not that you deleted anything:
     git status --porcelain | grep -E '^ ?D' | sed 's/^...//' \
       | while read f; do git cat-file -e "origin/skilled/v4.0.0.0:$f" 2>/dev/null \
         && echo "PHANTOM (restore me): $f"; done
   Restore every phantom from origin (additive, safe):
     git checkout origin/skilled/v4.0.0.0 -- \
       $(git status --porcelain | grep -E '^ ?D' | sed 's/^...//')

4) Re-check the deletion count — it should now be 0, or only files you truly mean
   to delete:
     git status --porcelain | grep -cE '^ ?D'
   If it's still large and unintended, your tree is stale — repeat step 3.

5) Commit only YOUR real changes (they'll be additive/intended now). If the tree
   is a chaotic mix of concerns you can't cleanly separate, STOP and do your work
   in an isolated worktree instead of the shared checkout:
     git worktree add --detach /tmp/mywork origin/skilled/v4.0.0.0

6) Push. If rejected as non-fast-forward, the branch moved under you:
     git fetch origin skilled/v4.0.0.0 && git rebase origin/skilled/v4.0.0.0
   (or cherry-pick your commit into a fresh worktree off origin and push from
   there). NEVER force-push the shared branch.

If after step 3 the tree still doesn't make sense, do NOT guess. Report your
branch, `HEAD` vs `origin/skilled/v4.0.0.0`, and the deletion/modification
counts, and ask before committing.
```

---

## 5. RELATED

- [remote-branch-policy.md](./remote-branch-policy.md) — which branches accept a push and when to ask.
- [worktree-workflows.md](./worktree-workflows.md) — isolated worktrees, the preferred place for real work.
- [continuous-integration.md](./continuous-integration.md) — the safe publish model that replaced the removed auto-sync.
- Mass-deletion guard: `.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh` and packet `specs/sk-git/019-mass-deletion-guard/`.
