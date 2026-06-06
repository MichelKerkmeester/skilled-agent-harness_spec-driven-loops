# Agent 1 - Worktree / Large-Reorg Lessons (scratch)

Scope owned: `worktree_workflows.md`, `SKILL.md`, new `large_reorg_playbook.md`.
Sibling agent owns `commit_workflows.md` + `shared_patterns.md` (scoped staging,
rename-heavy merge-conflict resolution). I cover the worktree-side rename verify +
post-merge leftover scan; sibling covers the conflict mechanics.

## Incident
026 wave-4 reorg: 17 phases → 7 themed parents, ~9000 renames, done in a worktree then
merged to main. Four avoidable failure modes hit:

1. **`git mv` ignored-leftover cruft** - old source dirs lingered on disk holding only
   `.DS_Store`/`*.log`/`*.pyc`. Repo correct (0 tracked files), working dir cluttered
   with "double" folders. Detection one-liner: a dir is safe to `rm -rf` when
   `git ls-files <dir>` is empty AND `git status --porcelain --untracked-files=all -- <dir>`
   is empty. Run the scan on MAIN post-merge (merged tree = source of truth).
2. **Fresh worktree lacks gitignored deps** (`node_modules`, `dist`). Spec-kit toolchain
   (`validate.sh --strict`, `generate-*.js`) then crashes OR — worse — silently no-ops on
   zero files and reports success. Symlinking deps in is a trap: Node resolves relative to
   the symlink target and processes nothing. FIX: toolchain runs on MAIN post-merge only;
   treat any worktree strict-validate exit code as meaningless.
3. **Memory/vector DBs are a SINGLE global instance** under
   `system-spec-kit/mcp_server/database/` (gitignored), NOT per-worktree. So
   `memory_index_scan`, generate-context indexing, re-embed must run on MAIN post-merge —
   running from the worktree indexes paths that don't exist yet → stale/dupe rows.
4. **Rename verification** - confirm `R`-status (history preserved, not delete+add) before
   commit; after merge confirm no old+new duplicate folders. Keep rename commits separate
   from content edits so git rename detection stays clean.

## Key decision
DBs are gitignored → `git revert` can't restore them. So playbook STEP 0 = snapshot the
DB dir (`cp -a`) before anything. This is the only rollback path for the global DB.

## What I changed
- `worktree_workflows.md`: new §8b "Large Reorg in a Worktree - Caveats" (3 caveats +
  detection one-liner), placed before Troubleshooting.
- `large_reorg_playbook.md` (new): step-ordered runbook 0-5 + failure-mode quick map.
- `SKILL.md`: §4 ALWAYS rules 8-10, §4 ESCALATE rule 8, §5 References row for the playbook
  + worktree §8b note.

## Validation
`validate.sh --strict` on the packet — result recorded in final report.
