---
title: "Git Hooks"
description: "Advisory-first git lifecycle hooks and their shared memory-drift marker helper, installed via install-git-hooks.sh."
trigger_phrases:
  - "git hooks"
  - "pre-commit hook"
  - "memory drift marker"
  - "post-commit hook"
  - "pre-push hook"
---

# Git Hooks

> Source-of-truth git lifecycle hooks symlinked into `.git/hooks/` by `install-git-hooks.sh`, plus the shared drift-marker helper three of them source.

---

## 1. OVERVIEW

`.opencode/scripts/git-hooks/` holds the hook scripts this repo installs into `.git/hooks/`. Hooks here are advisory-first: each one's primary check has its own bypass env var — with two exceptions whose headline check blocks by default: `pre-commit` layers a few genuinely blocking sub-gates on top of its advisory headline check, and `pre-push` blocks outright (for new remote branches only; see below).

Current state:

- `pre-commit` runs an advisory doc-model-reference drift check, then four independently-bypassable blocking sub-gates (comment hygiene, prompt-card sync, MCP mutation-class, tool-ownership lint).
- `post-commit` invalidates the code-graph SQLite after a large commit and marks memory-index drift for any spec-doc rename/delete in the commit.
- `post-merge` and `post-rewrite` mark memory-index drift after a merge or an amend/rebase, diffing the appropriate commit range (`ORIG_HEAD`→`HEAD`, or each rewritten commit pair).
- `lib/memory-drift-marker.sh` is the one shared helper `post-commit`, `post-merge`, and `post-rewrite` all source. Its `mark_memory_drift_from_diff()` function writes rename/delete entries for `.opencode/specs` paths to `.memory-drift-dirty-paths.json`, which `mcp-server/startup-checks.ts` consumes on the next MCP server boot to seed drift-suspect confirmation.
- `pre-push` blocks creation of a *new* remote branch (remote sha all-zero) whose name breaks the owner-first naming grammar (`<owner>/NNNN-slug`, `skilled/vA.B.C.D` release, or `main`); wrapper refs (`work/<runtime>/<slug>`) are always rejected as new branches. Updates to a branch that already exists on the remote are always allowed — migration tolerance, with only an advisory notice for a non-conformant name. The naming check is **tri-state**: a genuine invalid name blocks, but an internal validator error (for example a failed owner-discovery scan) fails **open** so a tooling fault never blocks a legal push, and the authorized-owner set is read only from version-controlled `SKILL.md` files (an untracked skill cannot authorize a remote owner).

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                            GIT HOOKS                              │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ git commit   │ ───▶ │ pre-commit       │ ───▶ │ advisory + 4     │
│              │      │                  │      │ blocking gates   │
└──────────────┘      └──────────────────┘      └──────────────────┘

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ git commit   │ ───▶ │ post-commit      │ ───▶ │ code-graph        │
│ (completed)  │      │                  │      │ invalidation      │
└──────┬───────┘      └────────┬─────────┘      └──────────────────┘
       │                       │
┌──────▼───────┐      ┌────────▼─────────┐      ┌──────────────────┐
│ git merge /  │ ───▶ │ post-merge /     │ ───▶ │ lib/memory-drift- │
│ rebase       │      │ post-rewrite     │      │ marker.sh         │
└──────────────┘      └──────────────────┘      └────────┬─────────┘
                                                           ▼
                                                  ┌──────────────────┐
                                                  │ .memory-drift-    │
                                                  │ dirty-paths.json  │
                                                  └────────┬─────────┘
                                                           ▼
                                                  ┌──────────────────┐
                                                  │ startup-checks.ts │
                                                  │ (next MCP boot)   │
                                                  └──────────────────┘

Dependency direction: git lifecycle event ───▶ hook script ───▶ lib/memory-drift-marker.sh ───▶ marker file
```

---

## 3. PACKAGE TOPOLOGY

```text
git-hooks/
+-- pre-commit                   # Doc-model-ref drift (advisory) + 4 blocking sub-gates
+-- post-commit                  # Code-graph invalidation + memory-drift marker
+-- post-merge                   # Memory-drift marker after merge
+-- post-rewrite                 # Memory-drift marker after amend/rebase
+-- pre-push                     # Owner-first branch-naming gate (new branches only)
+-- lib/
|   `-- memory-drift-marker.sh   # Shared mark_memory_drift_from_diff() writer
`-- README.md
```

Allowed dependency direction:

```text
post-commit / post-merge / post-rewrite → lib/memory-drift-marker.sh
pre-commit → .opencode/hooks/pre-commit, sk-doc validator, skill-advisor card-sync guard, doctor mutation-class guard, tool-ownership lint runner
pre-push → .opencode/skills/sk-git/scripts/worktree-naming.sh (sourced; validators only)
```

Disallowed dependency direction:

```text
lib/memory-drift-marker.sh → hook-specific logic (stays a generic diff-to-marker writer)
hooks here → hard-fail without a bypass env var on their primary check
```

---

## 4. KEY FILES

| File | Responsibility | Bypass |
|---|---|---|
| `pre-commit` | Runs `validate-doc-model-refs.js` and warns (does not block) on drift. Then runs four blocking sub-gates when their staged-path trigger matches: comment hygiene, prompt-quality-card sync, MCP mutation-class contract, and tool-ownership map lint. | `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1` (advisory check); `SPECKIT_SKIP_COMMENT_HYGIENE=1`, `SPECKIT_SKIP_CARD_SYNC=1`, `SPECKIT_SKIP_MCP_MUTATION_CLASS=1`, `SPECKIT_SKIP_TOOL_OWNERSHIP_LINT=1` (the four blocking sub-gates) |
| `post-commit` | When the just-completed commit changes at least `SPECKIT_CODE_GRAPH_POST_COMMIT_REBUILD_THRESHOLD` files (default 100), invalidates the code-graph SQLite + lease files so the next MCP launcher boot runs a fresh full scan. Also sources `lib/memory-drift-marker.sh` to mark spec-doc renames/deletes in the commit. | `SPECKIT_SKIP_CODE_GRAPH_POST_COMMIT=1` (skip invalidation entirely), `SPECKIT_CODE_GRAPH_POST_COMMIT_DRY_RUN=1` (log the would-be invalidation only), `SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK=1` (skip the drift marker) |
| `post-merge` | Marks memory-index drift for spec-doc renames/deletes brought in by the merge, diffing `ORIG_HEAD`→`HEAD` when `ORIG_HEAD` resolves, else `HEAD` alone. | `SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK=1` |
| `post-rewrite` | Marks memory-index drift after an amend or rebase, reading each rewritten `old_commit new_commit` pair from stdin and diffing every pair. | `SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK=1` |
| `lib/memory-drift-marker.sh` | Defines `mark_memory_drift_from_diff()`, the one function `post-commit`, `post-merge`, and `post-rewrite` source. Diffs the given commit range for renames/deletes under `.opencode/specs`, then appends deduped entries to `.memory-drift-dirty-paths.json` under a short-lived lock directory so concurrent hook invocations cannot corrupt the marker. | `SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK=1` (checked once, at the top of the function) |
| `pre-push` | Reads `<local ref> <local sha> <remote ref> <remote sha>` lines from stdin. Blocks only a *new* remote branch (remote sha all-zero) whose name fails `is_valid_branch`/`is_wrapper_branch` from `worktree-naming.sh` — `<owner>/NNNN-slug`, `skilled/vA.B.C.D`, `main`, and `backup/*` are accepted, `work/<runtime>/<slug>` wrapper refs are always rejected as new branches. Updates to a branch that already exists on the remote are always allowed (migration tolerance); a non-conformant name there only gets an advisory notice. Fails safe (exits 0) if `worktree-naming.sh` is missing or fails to source. | `SPECKIT_SKIP_PREPUSH_NAMING=1` |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Blocking vs advisory | `pre-commit`'s four named sub-gates and `pre-push`'s new-branch naming gate may fail their git operation. Every other check in this folder is advisory or best-effort (`\|\| true` on the marker call). |
| Marker ownership | Only `lib/memory-drift-marker.sh` writes `.memory-drift-dirty-paths.json`. Hooks source it rather than duplicating the diff-and-append logic. |
| Marker consumption | The marker is read once, on the next MCP server boot, by `mcp-server/startup-checks.ts`. Hooks never read it back. |
| Installation | Hooks are plain files here; `install-git-hooks.sh` is what makes them live, by symlinking each into `.git/hooks/`. Editing a hook here takes effect immediately for anyone whose `.git/hooks/<name>` is still the symlink. |

Drift-marker flow:

```text
╭──────────────────────────────────────────╮
│ commit / merge / rebase completes         │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ hook diffs the relevant commit range      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ rename/delete entries under .opencode/    │
│ specs appended to the marker JSON         │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ next MCP boot: startup-checks.ts consumes │
│ the marker, seeds drift-suspect queue     │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

```bash
bash .opencode/scripts/install-git-hooks.sh             # symlink all hooks in this folder into .git/hooks/
bash .opencode/scripts/install-git-hooks.sh --uninstall  # remove symlinks this installer created
```

Hooks are not invoked directly; git calls them by name during the matching lifecycle event once installed.

---

## 7. VALIDATION

```bash
bash -n .opencode/scripts/git-hooks/pre-commit
bash -n .opencode/scripts/git-hooks/post-commit
bash -n .opencode/scripts/git-hooks/post-merge
bash -n .opencode/scripts/git-hooks/post-rewrite
bash -n .opencode/scripts/git-hooks/pre-push
bash -n .opencode/scripts/git-hooks/lib/memory-drift-marker.sh
git commit --allow-empty -m "hook smoke"
```

Expected result: syntax checks pass, and the smoke commit runs silently unless a blocking sub-gate or advisory drift check has something to report.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../../skills/system-spec-kit/mcp-server/ENV-REFERENCE.md`](../../skills/system-spec-kit/mcp-server/ENV-REFERENCE.md)
- [`../../skills/system-spec-kit/mcp-server/lib/storage/README.md`](../../skills/system-spec-kit/mcp-server/lib/storage/README.md)
- [`../../skills/sk-git/scripts/worktree-naming.sh`](../../skills/sk-git/scripts/worktree-naming.sh)
