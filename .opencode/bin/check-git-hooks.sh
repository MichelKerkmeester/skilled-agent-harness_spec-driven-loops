#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Check Git Hooks
# ───────────────────────────────────────────────────────────────
# Detect-and-warn guard for AI SessionStart hook chains.
#
# Companion to install-git-hooks.sh. A SessionStart hook cannot install missing
# git hooks into an already-running session, but it CAN warn the operator when a
# versioned hook under .opencode/scripts/git-hooks/ has no matching effective
# hook symlink — the state a fresh clone or a forgotten install step leaves behind,
# and the same silent gap that can drop post-merge/post-rewrite drift-marker
# coverage.
#
# Wire it into any runtime's SessionStart hook chain, e.g. as an extra hook command:
#   bash /abs/path/.opencode/bin/check-git-hooks.sh
#
# It is intentionally non-fatal: it prints one warning line naming every invalid
# hook to stderr and always exits 0, so it never blocks a session.
#
# Silence with SPECKIT_GIT_HOOKS_GUARD=off.

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

[ "${SPECKIT_GIT_HOOKS_GUARD:-on}" = "off" ] && exit 0

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"

# Not a git repo: nothing to guard.
[ -z "$REPO_ROOT" ] && exit 0

HOOK_SOURCE_DIR="$REPO_ROOT/.opencode/scripts/git-hooks"
HOOK_TARGET_DIR="$(git -C "$REPO_ROOT" rev-parse --git-path hooks 2>/dev/null || true)"
[ -n "$HOOK_TARGET_DIR" ] || exit 0
case "$HOOK_TARGET_DIR" in
  /*) ;;
  *) HOOK_TARGET_DIR="$REPO_ROOT/$HOOK_TARGET_DIR" ;;
esac

# No versioned hook source in this checkout: nothing to guard.
[ -d "$HOOK_SOURCE_DIR" ] || exit 0

# ───────────────────────────────────────────────────────────────
# 2. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

canonical_path() {
  local path="$1"
  local path_dir
  local path_name
  path_dir="$(dirname "$path")"
  path_name="$(basename "$path")"
  (cd -P "$path_dir" 2>/dev/null && printf '%s/%s\n' "$(pwd -P)" "$path_name")
}

resolved_link_path() {
  local link_path="$1"
  local link_target
  link_target="$(readlink "$link_path" 2>/dev/null || true)"
  [ -n "$link_target" ] || return 1
  case "$link_target" in
    /*) ;;
    *) link_target="$(dirname "$link_path")/$link_target" ;;
  esac
  canonical_path "$link_target"
}

# ───────────────────────────────────────────────────────────────
# 3. MAIN LOGIC
# ───────────────────────────────────────────────────────────────

INVALID=()
for hook in "$HOOK_SOURCE_DIR"/*; do
  [ -f "$hook" ] || continue
  name="$(basename "$hook")"
  [ "$name" = "README.md" ] && continue
  target="$HOOK_TARGET_DIR/$name"
  if [ ! -L "$target" ]; then
    INVALID+=("$name (missing)")
  elif [ ! -e "$target" ]; then
    INVALID+=("$name (broken)")
  elif [ "$(resolved_link_path "$target" || true)" != "$(canonical_path "$hook" || true)" ]; then
    INVALID+=("$name (mismatched)")
  elif [ ! -x "$target" ]; then
    INVALID+=("$name (non-executable)")
  fi
done

if [ "${#INVALID[@]}" -gt 0 ]; then
  JOINED="$(IFS=', '; echo "${INVALID[*]}")"
  printf '%s\n' "[check-git-hooks] Invalid git hook symlink(s): $JOINED. Fix: bash .opencode/scripts/install-git-hooks.sh (silence: SPECKIT_GIT_HOOKS_GUARD=off)" >&2
fi

exit 0
