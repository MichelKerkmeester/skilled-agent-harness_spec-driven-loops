---
title: "Git Hooks"
description: "Version-controlled Git hooks and the opt-in installer that places the pre-commit hook into the active repository hook directory."
trigger_phrases:
  - "git hooks"
  - "pre-commit hook"
  - "install git hooks"
---

# Git Hooks

---

## 1. OVERVIEW

`.opencode/hooks/git/` contains a standalone, opt-in Git hook surface: `install-hooks.sh` symlinks `pre-commit` into Git's resolved hooks directory, and `pre-commit` runs the comment-hygiene and agent-mirror-sync gates for staged changes. The hook is opt-in: a clone does nothing until the installer is run.

This folder is the standalone/legacy surface. The repository's primary Git hook installer is `.opencode/scripts/install-git-hooks.sh`, which installs a broader set of hooks (`commit-msg`, `pre-commit`, `post-commit`, `post-merge`, `post-rewrite`, `pre-push`) from `.opencode/scripts/git-hooks/`. The primary `pre-commit` chains into this folder's `pre-commit` as its comment-hygiene sub-gate, and also runs mass-deletion, doc-model-refs, prompt-card-sync, MCP mutation-class, and tool-ownership gates. Run `install-hooks.sh` here directly only to install or test the hygiene gate standalone, without the other gates.

---

## 2. WHAT IT DOES

`pre-commit` runs two independent gates over staged files, then exits 0 if none block:

| Gate | Scope | Behavior | Bypass |
|---|---|---|---|
| Comment hygiene | Staged added/modified files (`git diff --cached --name-only --diff-filter=ACM`) | Runs `check-comment-hygiene.sh` per file. Exit 1 from the checker → violation counted. Any non-{0,1,2} exit → hard block. Blocks the commit when violations > 0. | `SPECKIT_SKIP_COMMENT_HYGIENE=1` (primary pre-commit only); this standalone hook has no per-gate bypass, use the kill switch below. |
| Agent mirror-sync | Staged agent files under `.opencode/agents/` or `.claude/agents/` (`--diff-filter=ACMD`) | Runs `check-agent-mirror-sync.cjs` over the staged agent files. Blocks the commit if the `.opencode` / `.claude` mirrors desync. | None per-gate; use the kill switch. |

Both gates resolve their checkers from the repository root. Missing tooling is fail-open: if the comment-hygiene checker is absent or not executable, the gate warns and skips; if `node` or the mirror-sync checker is unavailable, the mirror gate warns and skips. The kill switch (`hook_enabled git-commit-hooks`) short-circuits the whole hook before any gate runs.

On a block, the hook prints:

```text
BLOCKED: <N> file(s) contain ephemeral-artifact pointers in code comments.
See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4
Fix: replace the pointer with the durable WHY. Escape: add '// hygiene-ok' to exempt a line.
```

or, for the mirror gate:

```text
BLOCKED: staged agent files desync the .opencode / .claude mirrors.
Fix: re-sync the mirrors so each agent body matches, then re-stage.
```

---

## 3. PER-RUNTIME DELIVERY

This concern has no per-runtime adapters: it is a native Git hook, not a runtime hook. Git invokes `pre-commit` directly from `.git/hooks/` during `git commit`. The kill-switch resolver (`hook-flags.sh`) is sourced at the top of the hook; it is the same POSIX mirror the shell entrypoints under `shared/` use.

| Surface | File | How it fires |
|---|---|---|
| Git | `pre-commit` | Symlinked into `.git/hooks/pre-commit` by `install-hooks.sh`. Git runs it on `git commit`. |
| Git (primary) | `.opencode/scripts/git-hooks/pre-commit` | Symlinked into `.git/hooks/pre-commit` by `.opencode/scripts/install-git-hooks.sh`. Chains into this folder's `pre-commit` as its comment-hygiene sub-gate. |

The two installers are mutually exclusive at the same target path: whichever runs last wins the symlink. The primary installer is the recommended one for normal use; this folder's installer exists for standalone hygiene-gate testing.

---

## 4. DIRECTORY TREE

```text
git/
+-- install-hooks.sh   # symlinks pre-commit into .git/hooks/pre-commit (standalone)
`-- pre-commit         # comment-hygiene + agent-mirror-sync gates for staged changes
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `install-hooks.sh` | Resolves the repo root, symlinks `pre-commit` into `$REPO_ROOT/.git/hooks/pre-commit`. Does not check for existing hooks or ownership: the primary installer does. |
| `pre-commit` | Sources `shared/hook-flags.sh` and short-circuits on the `git-commit-hooks` kill switch. Runs `check-comment-hygiene.sh` per staged file (fail-open if absent). Runs `check-agent-mirror-sync.cjs` over staged agent files (fail-open if `node` or the checker is absent). Blocks on violations; exits 0 otherwise. |

---

## 6. CONFIGURATION

The concern is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` | Full no-op. The hook sources `shared/hook-flags.sh` and exits 0 before any gate runs. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

The `hook-flags.sh` mirror checks the master switch and the default-shape `SYSTEM_<CONCERN>_DISABLED` name only. Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The hook sources `shared/hook-flags.sh` (POSIX sh, Node-free). The checkers are spawned by path: `check-comment-hygiene.sh` (shell) and `check-agent-mirror-sync.cjs` (Node). |
| Decisions | Block (exit 1) or allow (exit 0). No advisory state: both gates are blocking when they fire. |
| Failure | Fail-open: a missing or non-executable checker, a missing `node`, or an unavailable kill-switch resolver produces a warning and skips the gate, never a block. |
| Scope | Only staged files are inspected (`git diff --cached --name-only`). Commits that touch no in-scope files are unaffected. |

---

## 8. VALIDATION

```bash
# Install the standalone hook
bash .opencode/hooks/git/install-hooks.sh

# Verify the symlink
ls -l .git/hooks/pre-commit

# Negative control: a clean commit should pass silently
git commit --allow-empty -m "chore(repo): test hook installation"
```

Expected result: the symlink points at `.opencode/hooks/git/pre-commit`; the test commit runs silently (no staged in-scope files → no gates fire).

```bash
# Verify the kill switch short-circuits
SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1 git commit --allow-empty -m "test"
```

Expected result: the hook exits 0 immediately, regardless of staged content.

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../shared/README.md`](../shared/README.md): the `hook-flags.sh` POSIX mirror this hook sources.
- [`../../scripts/install-git-hooks.sh`](../../scripts/install-git-hooks.sh): the primary Git hook installer (broader hook set).
- [`../../scripts/git-hooks/pre-commit`](../../scripts/git-hooks/pre-commit): the primary pre-commit hook (chains into this folder's hook as its comment-hygiene sub-gate).
- [`../../skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`](../../skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh): the comment-hygiene checker.
- [`../../skills/sk-code/shared/references/universal/code-style-guide.md`](../../skills/sk-code/shared/references/universal/code-style-guide.md): the comment-hygiene standard (§4).
- [`../../skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs`](../../skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs): the agent mirror-sync checker.
