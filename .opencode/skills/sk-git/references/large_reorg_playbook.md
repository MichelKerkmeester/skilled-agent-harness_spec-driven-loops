---
title: Large Reorg Playbook - Rename/Renumber in a Worktree, Merge to Main
description: Step-ordered runbook for executing a large rename/reorg (hundreds-to-thousands of git mv) in a worktree and merging it to main without the known failure modes.
---

# Large Reorg Playbook - Rename/Renumber in a Worktree

Step-ordered runbook for a LARGE rename/reorg (hundreds-to-thousands of `git mv`)
executed in a worktree and merged to `main`. Driven by a real incident: the 026 wave-4
spec-folder reorganization (17 phases → 7 themed parents, ~9000 renames) hit avoidable
failure modes this runbook closes.

**Core split:** The worktree does file/rename ops ONLY. The spec-kit toolchain
(strict validate, generators, metadata regen) and the global memory/vector DBs both run
on `main` AFTER merge — never inside the bare worktree. See
[worktree_workflows.md §8b](./worktree_workflows.md#8b-large-reorg-in-a-worktree---caveats)
for the why behind each caveat.

---

## WHEN TO USE

- A rename/renumber/reorg touching dozens+ of paths (folder restructure, phase
  consolidation, mass renumber).
- Any reorg where build deps (`node_modules`, `dist`) or the spec-kit toolchain matter
  for post-move validation.

For a handful of renames on the current branch, the standard
[commit_workflows.md](./commit_workflows.md) flow is enough — skip this runbook.

---

## STEP 0: Snapshot the gitignored DBs (BEFORE touching anything)

`git revert` / `git reset` cannot restore gitignored files. The memory + vector DBs under
`.opencode/skills/system-spec-kit/mcp_server/database/` are gitignored and are a SINGLE
global instance — if a botched reindex corrupts them, git cannot roll them back.

```bash
ts=$(date +%Y%m%d-%H%M%S)
db=.opencode/skills/system-spec-kit/mcp_server/database
cp -a "$db" "${db}.bak-${ts}"
echo "Snapshot: ${db}.bak-${ts}"
```

Keep the snapshot until the reorg is verified on `main`. Restore by swapping the dir back
if reindex goes wrong.

---

## STEP 1: Worktree from a clean HEAD

Start from a clean, up-to-date base so the diff is pure rename signal.

```bash
git status --porcelain        # MUST be empty; stash/commit unrelated WIP first
git fetch && git checkout main && git pull --ff-only
git worktree add .worktrees/reorg -b temp/reorg main
cd .worktrees/reorg
```

Do NOT install deps or run the toolchain here — this worktree is for renames only
(deps/toolchain run on `main` in steps 4-5).

---

## STEP 2: File/rename ops in the worktree + verify R-status

Perform the renames with `git mv` (preserves history; raw `mv` + `git add` can register as
delete+add and lose blame continuity).

```bash
git mv old/path new/path        # repeat / script per rename
```

After the wave, **confirm git recorded renames as `R`-status**, not delete+add:

```bash
git add -A
git status --short                       # renames show as "R  old -> new"
git diff --cached --find-renames --name-status | grep -c '^R'   # count of renames
git diff --cached --find-renames --name-status | grep -v '^R' | grep -E '^(A|D)' || echo "no stray add/delete"
```

If a move shows as `A` + `D` instead of `R`, git did not detect the rename (often due to
large content changes in the same commit). Keep renames and content edits in **separate
commits** so rename detection stays clean. Commit the rename wave with a clear message
(see [commit_workflows.md](./commit_workflows.md)).

---

## STEP 3: Merge to main

Bring the rename commit(s) back to `main`. Rename-heavy merge-conflict handling (rename/edit,
rename/rename) is covered in [shared_patterns.md](./shared_patterns.md).

```bash
cd ../..                 # back to main worktree
git checkout main && git pull --ff-only
git merge temp/reorg     # or PR + squash per project policy
```

After merge, sanity-check the tree has NO old+new duplicate folders (the merge should
have moved, not copied):

```bash
git ls-files | sed 's#/[^/]*$##' | sort -u | grep -i '<old-prefix>' || echo "no old paths tracked"
```

Zero tracked files under the old prefix = the rename landed cleanly.

---

## STEP 4: Post-merge on MAIN — leftover cleanup + toolchain + DB

Everything in this step runs on `main` (the merged tree is the source of truth). The
worktree may still be removed at the end.

### 4a. Remove gitignored leftover folders

`git mv` left ignored cruft (`.DS_Store`, `*.log`, `*.pyc`, `__pycache__/`) behind in old
source dirs, which now show as confusing empty/"double" folders. Detect dirs with disk
files but **0 tracked files and nothing committable**, then remove them:

```bash
while IFS= read -r d; do
  [ -z "$(git ls-files -- "$d")" ] \
    && [ -z "$(git status --porcelain --untracked-files=all -- "$d")" ] \
    && echo "LEFTOVER (safe rm): $d"
done < <(find . -type d -not -path './.git/*' -mindepth 1 | sort)
```

Review the list, then `rm -rf` the confirmed leftovers. Each holds only ignored cruft, so
the commit/tree stays correct.

### 4b. Run the spec-kit toolchain ON MAIN

`main` has the real `node_modules`/`dist`, so generators and strict validate actually
work (a bare worktree silently no-ops — see §8b Caveat 1). Run, in order:

```bash
# 1. Regenerate per-folder metadata for moved/renamed spec folders
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>
# 2. Strict-validate affected packets
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
```

NEVER reuse a strict-validate result from inside the worktree — treat it as meaningless.

### 4c. Reindex / re-embed memory ON MAIN

The global DB now needs to reflect the final tree exactly once:

```bash
# via MCP: memory_index_scan({ specFolder: "<spec-folder>" })
# generate-context.js (4b) also refreshes index + embeddings for the folder it targets
```

Because the DB is a single global instance, running this on `main` post-merge indexes the
real paths once — running it from the worktree would index paths that did not yet exist.

---

## STEP 5: Verify

- [ ] Renames recorded as `R`-status (step 2) — history preserved.
- [ ] Tree has NO old+new duplicate folders (step 3 grep returns "no old paths tracked").
- [ ] Leftover-dir scan (4a) returns nothing on a re-run — all ignored cruft removed.
- [ ] `validate.sh --strict` on `main` exits 0/1 (NOT a worktree run).
- [ ] `memory_index_scan` / generators ran on `main`; spot-check a moved folder resolves
      in `memory_search`.
- [ ] DB snapshot (step 0) can be deleted once the above all pass.
- [ ] Worktree removed: `git worktree remove .worktrees/reorg && git branch -d temp/reorg`.

---

## FAILURE-MODE QUICK MAP

| Symptom | Cause | Fix (step) |
|---------|-------|------------|
| "Double" / empty folders after merge | `git mv` left ignored cruft in old dirs | 4a leftover scan + `rm -rf` |
| Strict-validate "passes" but touched 0 files | Ran in bare worktree (no deps) or via symlinked deps | Run toolchain on `main` (4b) |
| Stale/duplicate memory rows | Reindex ran from worktree against global DB | Reindex on `main` post-merge (4c) |
| Renames show as add/delete, blame lost | Content edits mixed into rename commit | Separate rename + edit commits (step 2) |
| Cannot roll back a corrupted DB | DBs are gitignored; `git revert` can't restore | Restore from step 0 snapshot |

---

## RELATED RESOURCES

- [worktree_workflows.md](./worktree_workflows.md) - §8b caveats behind this runbook
- [commit_workflows.md](./commit_workflows.md) - scoped staging + rename commit hygiene
- [shared_patterns.md](./shared_patterns.md) - rename-heavy merge-conflict resolution
- [quick_reference.md](./quick_reference.md) - one-page command cheat sheet
