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
# Live-sync self-heal: with the live-sync loop enabled (MK_LIVE_SYNC_DISABLED
# absent), this guard also auto-runs the installer from the MAIN checkout so a
# fresh clone heals itself without an operator step. It never auto-installs from
# a linked worktree, and disabling the guard or the live-sync loop stops it.
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

# shared hook kill-switch (master + per-concern); fail-open if guard absent
__hf_root="$(git rev-parse --show-toplevel 2>/dev/null)"
__hook_flags_loaded=0
if [ -n "$__hf_root" ] && [ -r "$__hf_root/.opencode/hooks/shared/hook-flags.sh" ]; then
  # shellcheck source=/dev/null
  . "$__hf_root/.opencode/hooks/shared/hook-flags.sh"
  __hook_flags_loaded=1
  hook_enabled git-hooks-check || exit 0
fi

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

  # Self-heal: when live-sync is not disabled, repair the symlinks from the MAIN
  # checkout only. A linked worktree shares the main checkout's hooks dir, so
  # installing from a session tree would point the shared symlinks at scripts
  # that vanish when the worktree is removed — never auto-install there.
  __live_sync_enabled=1
  if [ "$__hook_flags_loaded" = "1" ]; then
    hook_enabled live-sync || __live_sync_enabled=0
  fi
  if [ "$__live_sync_enabled" = "1" ]; then
    _self_dir="$(git rev-parse --git-dir 2>/dev/null || true)"
    _self_common="$(git rev-parse --git-common-dir 2>/dev/null || true)"
    case "$_self_dir" in
      /*) ;;
      *) _self_dir="$REPO_ROOT/$_self_dir" ;;
    esac
    case "$_self_common" in
      /*) ;;
      *) _self_common="$REPO_ROOT/$_self_common" ;;
    esac
    if [ -n "$_self_dir" ] && [ -n "$_self_common" ] && [ "$_self_dir" = "$_self_common" ]; then
      if [ -f "$REPO_ROOT/.opencode/scripts/install-git-hooks.sh" ]; then
        if bash "$REPO_ROOT/.opencode/scripts/install-git-hooks.sh" >&2; then
          printf '%s\n' "[check-git-hooks] auto-installed git hook symlinks (self-heal)" >&2
        else
          printf '%s\n' "[check-git-hooks] self-heal install failed; run it manually" >&2
        fi
      fi
    fi
  fi
fi

exit 0
