#!/usr/bin/env bash
# Install repository git hooks shipped under .opencode/scripts/git-hooks/.
#
# Usage:
#   bash .opencode/scripts/install-git-hooks.sh             # install
#   bash .opencode/scripts/install-git-hooks.sh --uninstall # remove
#
# Hooks installed:
#   commit-msg  — blocks invalid structure and warns on clarity issues
#   pre-commit  — runs validate-doc-model-refs.js (advisory) plus blocking gates (comment hygiene, prompt-knowledge card-sync, MCP mutation-class, tool ownership map)
#   post-commit — marks code-graph and memory-index drift for next startup repair
#   post-merge  — marks memory-index drift after spec-folder renames/deletes
#   post-rewrite — marks memory-index drift after amend/rebase rewrites
#   pre-push    — two independent gates: (1) blocks a new remote branch that breaks the owner-first naming grammar, updates always allowed (migration tolerance); (2) blocks any push (new or update) to a branch outside the remote allowlist (main, skilled/v*, plus .opencode/skills/sk-git/scripts/remote-branch-allowlist.txt) unless explicitly permitted for that push
#
# Bypass commit-message validator: SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git commit ...
# Bypass doc validator: SPECKIT_SKIP_DOC_MODEL_VALIDATE=1 git commit ...
# Bypass memory drift marker: SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK=1 git commit ...
# Bypass pre-push naming gate: SPECKIT_SKIP_PREPUSH_NAMING=1 git push ...
# Bypass pre-push remote-permission gate: SPECKIT_ALLOW_REMOTE_PUSH=1 git push ...

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$REPO_ROOT" ]; then
  echo "ERROR: not inside a git working tree" >&2
  exit 1
fi

HOOK_SOURCE_DIR="$REPO_ROOT/.opencode/scripts/git-hooks"
HOOK_TARGET_DIR="$(git -C "$REPO_ROOT" rev-parse --git-path hooks)"
if [[ "$HOOK_TARGET_DIR" != /* ]]; then
  HOOK_TARGET_DIR="$REPO_ROOT/$HOOK_TARGET_DIR"
fi

# Only files matching a real Git hook name are eligible for install/uninstall —
# this excludes README.md and any other non-hook file dropped in HOOK_SOURCE_DIR.
is_git_hook_name() {
  case "$1" in
    applypatch-msg|pre-applypatch|post-applypatch|pre-commit|pre-merge-commit|\
    prepare-commit-msg|commit-msg|post-commit|pre-rebase|post-checkout|post-merge|\
    pre-push|pre-receive|update|proc-receive|post-receive|post-update|\
    reference-transaction|push-to-checkout|pre-auto-gc|post-rewrite|\
    sendemail-validate|fsmonitor-watchman|p4-changelist|p4-prepare-changelist|\
    p4-post-changelist|p4-pre-submit|post-index-change)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# Ownership check: a symlink counts as "ours" only if it resolves into
# HOOK_SOURCE_DIR. Without this, install/uninstall would blindly overwrite
# or remove a hook symlink some other tool (husky, pre-commit, lefthook)
# installed at the same path.
is_our_symlink() {
  local target="$1" resolved
  [ -L "$target" ] || return 1
  resolved="$(readlink "$target")"
  [[ "$resolved" = /* ]] || resolved="$(cd "$(dirname "$target")" && cd "$(dirname "$resolved")" 2>/dev/null && pwd)/$(basename "$resolved")"
  case "$resolved" in
    "$HOOK_SOURCE_DIR"/*) return 0 ;;
    *) return 1 ;;
  esac
}

if [ "${1:-}" = "--uninstall" ]; then
  for hook in "$HOOK_SOURCE_DIR"/*; do
    [ -f "$hook" ] || continue
    name="$(basename "$hook")"
    is_git_hook_name "$name" || continue
    target="$HOOK_TARGET_DIR/$name"
    if is_our_symlink "$target"; then
      rm -f "$target"
      echo "removed symlink: $target"
    elif [ -e "$target" ] || [ -L "$target" ]; then
      echo "skipped (not a symlink we installed): $target" >&2
    fi
  done
  exit 0
fi

mkdir -p "$HOOK_TARGET_DIR"
for hook in "$HOOK_SOURCE_DIR"/*; do
  [ -f "$hook" ] || continue
  name="$(basename "$hook")"
  is_git_hook_name "$name" || continue
  target="$HOOK_TARGET_DIR/$name"
  if [ -e "$target" ] || [ -L "$target" ]; then
    if ! is_our_symlink "$target"; then
      echo "WARNING: $target exists and is not a symlink we installed — skipping" >&2
      continue
    fi
  fi
  chmod +x "$hook"
  ln -sf "$hook" "$target"
  echo "installed: $target -> $hook"
done

echo ""
echo "Hooks installed. Test: 'git commit --allow-empty -m \"chore(repo): test hook installation\"' should run silently unless drift is detected."
echo "Bypass commit-message validator: SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git commit ..."
echo "Bypass doc validator: SPECKIT_SKIP_DOC_MODEL_VALIDATE=1 git commit ..."
echo "Bypass memory drift marker: SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK=1 git commit ..."
echo "Bypass pre-push naming gate: SPECKIT_SKIP_PREPUSH_NAMING=1 git push ..."
echo "Note: the target is resolved by Git (git rev-parse --git-path hooks), so a"
echo "repo-local or global core.hooksPath override, and per-worktree hook dirs in"
echo "linked worktrees, are honored automatically."

# Without a custom core.hooksPath, a linked worktree's hooks dir IS the main
# checkout's shared .git/hooks — but the symlinks just installed point into
# THIS worktree's own copy of the scripts. Removing this worktree later
# leaves those shared symlinks dangling for main and every other worktree.
GIT_DIR="$(git -C "$REPO_ROOT" rev-parse --git-dir)"
GIT_COMMON_DIR="$(git -C "$REPO_ROOT" rev-parse --git-common-dir)"
[[ "$GIT_DIR" = /* ]] || GIT_DIR="$REPO_ROOT/$GIT_DIR"
[[ "$GIT_COMMON_DIR" = /* ]] || GIT_COMMON_DIR="$REPO_ROOT/$GIT_COMMON_DIR"
if [ "$GIT_DIR" != "$GIT_COMMON_DIR" ]; then
  echo ""
  echo "WARNING: this is a linked worktree. If no custom core.hooksPath is set," >&2
  echo "the hooks above were installed into the MAIN checkout's shared .git/hooks" >&2
  echo "but point at scripts inside THIS worktree. Removing this worktree will" >&2
  echo "leave those symlinks dangling — run '$0 --uninstall' from here first," >&2
  echo "or re-run this installer from the main checkout afterward." >&2
fi
