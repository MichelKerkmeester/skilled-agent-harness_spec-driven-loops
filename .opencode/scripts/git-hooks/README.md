---
title: "Git Hooks"
description: "Advisory-first git lifecycle hooks and their shared autostash and mass-deletion guards, installed via install-git-hooks.sh."
trigger_phrases:
  - "git hooks"
  - "pre-commit hook"
  - "autostash orphan guard"
  - "post-commit hook"
  - "pre-push hook"
---

# Git Hooks

> Source-of-truth git lifecycle hooks symlinked into `.git/hooks/` by `install-git-hooks.sh`, plus the shared guard helpers they source.

---

## 1. OVERVIEW

`.opencode/scripts/git-hooks/` holds the hook scripts this repo installs into `.git/hooks/`. Hooks here are advisory-first: each one's primary check has its own bypass env var — with two exceptions whose headline check blocks by default: `pre-commit` layers a few genuinely blocking sub-gates on top of its advisory headline check, and `pre-push` blocks outright (for new remote branches only; see below).

Current state:

- `pre-commit` runs an advisory doc-model-reference drift check, then three independently-bypassable blocking sub-gates (comment hygiene, prompt-card sync, MCP mutation-class).
- `post-commit` publishes the just-completed commit to the shared live branch, and only from a linked worktree in a launch-wrapper session that exports both `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH`.
- `post-merge` and `post-rewrite` anchor and surface any `--autostash` entry after a merge or an amend/rebase, so a conflicted (un-applied) autostash cannot be lost silently.
- `lib/autostash-orphan-guard.sh` is the one shared helper `post-merge` and `post-rewrite` both source; `lib/mass-deletion-guard.sh` backs the `pre-push` mass-deletion gate.
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
│ git commit   │ ───▶ │ post-commit      │ ───▶ │ live-branch       │
│ (completed)  │      │                  │      │ autosync publish  │
└──────────────┘      └──────────────────┘      └──────────────────┘

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ git merge /  │ ───▶ │ post-merge /     │ ───▶ │ lib/autostash-    │
│ rebase       │      │ post-rewrite     │      │ orphan-guard.sh   │
└──────────────┘      └──────────────────┘      └────────┬─────────┘
                                                           ▼
                                                  ┌──────────────────┐
                                                  │ refs/autostash-   │
                                                  │ rescue/<sha>      │
                                                  └──────────────────┘

Dependency direction: git lifecycle event ───▶ hook script ───▶ lib/ guard helper
```

---

## 3. PACKAGE TOPOLOGY

```text
git-hooks/
+-- pre-commit                   # Doc-model-ref drift (advisory) + 4 blocking sub-gates
+-- post-commit                     # Live-branch autosync publish
+-- post-merge                      # Autostash orphan guard after merge
+-- post-rewrite                    # Autostash orphan guard after amend/rebase
+-- pre-push                        # Owner-first branch-naming gate (new branches only)
+-- lib/
|   +-- autostash-orphan-guard.sh   # Shared autostash_orphan_guard() anchor and alert
|   `-- mass-deletion-guard.sh      # Mass-deletion detection sourced by pre-push
`-- README.md
```

Allowed dependency direction:

```text
post-merge / post-rewrite → lib/autostash-orphan-guard.sh
post-commit → .opencode/hooks/shared/hook-flags.sh, .opencode/bin/git-sync.sh
pre-commit → .opencode/hooks/git/pre-commit, sk-doc validator, skill-advisor card-sync guard, doctor mutation-class guard
pre-push → .opencode/skills/sk-git/scripts/worktree-naming.sh (sourced; validators only), lib/mass-deletion-guard.sh
```

Disallowed dependency direction:

```text
lib/autostash-orphan-guard.sh → hook-specific logic (stays a generic stash-anchoring guard)
hooks here → hard-fail without a bypass env var on their primary check
```

---

## 4. KEY FILES

| File | Responsibility | Bypass |
|---|---|---|
| `pre-commit` | Runs `validate-doc-model-refs.js` and warns (does not block) on drift. Then runs three blocking sub-gates when their staged-path trigger matches: comment hygiene, prompt-quality-card sync, and the MCP mutation-class contract. | `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1` (advisory check); `SPECKIT_SKIP_COMMENT_HYGIENE=1`, `SPECKIT_SKIP_CARD_SYNC=1`, `SPECKIT_SKIP_MCP_MUTATION_CLASS=1` (the three blocking sub-gates) |
| `post-commit` | Publishes the just-completed commit to the shared live branch through `.opencode/bin/git-sync.sh --auto --quiet`, and only from a linked worktree in a launch-wrapper session that exports both `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH`. | `SPECKIT_AUTOSYNC=0` (this launch); `SYSTEM_LIVE_SYNC_DISABLED` or `SYSTEM_HOOKS_DISABLED` (whole live-sync loop) |
| `post-merge` | Sources `lib/autostash-orphan-guard.sh` and anchors any `--autostash` entry the merge left un-applied. | None; the guard is best-effort and never blocks |
| `post-rewrite` | Sources `lib/autostash-orphan-guard.sh` after an amend or rebase. The rewritten `old_commit new_commit` pairs git sends on stdin are unused. | None; the guard is best-effort and never blocks |
| `lib/autostash-orphan-guard.sh` | Defines `autostash_orphan_guard()`, the one function `post-merge` and `post-rewrite` source. Anchors every autostash entry under `refs/autostash-rescue/<sha>` so it survives garbage collection, prints recovery instructions and records an alert in `.opencode/logs/autostash-orphan-alerts.log`. | None; it always returns success |
| `pre-push` | Reads `<local ref> <local sha> <remote ref> <remote sha>` lines from stdin. Blocks only a *new* remote branch (remote sha all-zero) whose name fails `is_valid_branch`/`is_wrapper_branch` from `worktree-naming.sh` — `<owner>/NNNN-slug`, `skilled/vA.B.C.D`, `main`, and `backup/*` are accepted, `work/<runtime>/<slug>` wrapper refs are always rejected as new branches. Updates to a branch that already exists on the remote are always allowed (migration tolerance); a non-conformant name there only gets an advisory notice. Fails safe (exits 0) if `worktree-naming.sh` is missing or fails to source. | `SPECKIT_SKIP_PREPUSH_NAMING=1` |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Blocking vs advisory | `pre-commit`'s four named sub-gates and `pre-push`'s new-branch naming gate may fail their git operation. Every other check in this folder is advisory or best-effort (`\|\| true` on the guard call). |
| Autostash ownership | Only `lib/autostash-orphan-guard.sh` writes `refs/autostash-rescue/*` and the alert log. Hooks source it rather than duplicating the anchor-and-alert logic. |
| Autosync scope | `post-commit` publishes only from a linked worktree in a launch-wrapper session. The primary checkout never auto-publishes, and a blocked publish stays local. |
| Installation | Hooks are plain files here; `install-git-hooks.sh` is what makes them live, by symlinking each into `.git/hooks/`. Editing a hook here takes effect immediately for anyone whose `.git/hooks/<name>` is still the symlink. |

Autostash-guard flow:

```text
╭──────────────────────────────────────────╮
│ merge / rebase --autostash completes      │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ hook sources the autostash orphan guard   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ every stash entry anchored under          │
│ refs/autostash-rescue/<sha>               │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ recovery instructions printed and logged  │
│ to .opencode/logs/autostash-orphan-alerts │
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
bash -n .opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh
git commit --allow-empty -m "hook smoke"
```

Expected result: syntax checks pass, and the smoke commit runs silently unless a blocking sub-gate or advisory drift check has something to report.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../../skills/system-spec-kit/mcp-server/ENV-REFERENCE.md`](../../skills/system-spec-kit/mcp-server/ENV-REFERENCE.md)
- [`lib/README.md`](lib/README.md)
- [`../../skills/sk-git/scripts/worktree-naming.sh`](../../skills/sk-git/scripts/worktree-naming.sh)
