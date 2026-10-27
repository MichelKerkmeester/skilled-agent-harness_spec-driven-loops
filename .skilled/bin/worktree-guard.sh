#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree Guard
# ───────────────────────────────────────────────────────────────
# Detect-and-warn guard for AI SessionStart hook chains.
#
# Companion to worktree-session.sh. A SessionStart hook cannot relocate an
# already-started process into a worktree, but it CAN warn the operator when a
# top-level session is running directly on a shared checkout instead of an
# isolated worktree — the situation worktree-session.sh exists to prevent.
#
# Wire it into any runtime's SessionStart chain, e.g. as an extra hook command:
#   bash /abs/path/.skilled/bin/worktree-guard.sh
#
# It is intentionally non-fatal: it prints a one-line warning to stderr and always
# exits 0, so it never blocks a session that the operator chose to run there.
#
# Silence with SPECKIT_WORKTREE_GUARD=off.
#
# It also starts the numbered-worktree sweep: `worktree-reaper.sh --numbered`, detached, so
# the hook still returns at once. At most one sweep starts per six hours, tracked by a stamp
# file in the repository's shared git directory, so every session start after the first in
# that window spawns nothing. The same switches that silence the guard (SPECKIT_WORKTREE_GUARD=off,
# the shared hook kill-switch) stop the sweep, and SPECKIT_WORKTREE_AUTOREAP=0 stops only the sweep.
# The sweep's own output lands in worktree-reaper-numbered.log beside the stamp.

set -euo pipefail

[ "${SPECKIT_WORKTREE_GUARD:-on}" = "off" ] && exit 0

# shared hook kill-switch (master + per-concern); fail-open if guard absent
__hf_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
__hf_file="$(dirname "${BASH_SOURCE[0]}")/../hooks/shared/hook-flags.sh"
if [ -n "$__hf_root" ] && [ -r "$__hf_file" ]; then
  # shellcheck source=../hooks/shared/hook-flags.sh
  . "$__hf_file"
  # Honor the pre-rename flag name as a backward-compatible alias for this concern.
  __hook_flags_truthy "$(__hook_flags_resolve SYSTEM_WORKTREE_GUARD_DISABLED)" && exit 0
  hook_enabled git-worktree-guard || exit 0
fi

# Orchestrated children are expected to share the parent's tree — never warn for them.
[ "${AI_SESSION_CHILD:-}" = "1" ] && exit 0

GUARD_GIT_DIR="$(git rev-parse --git-dir 2>/dev/null || true)"
GUARD_GIT_COMMON_DIR="$(git rev-parse --git-common-dir 2>/dev/null || true)"

# Not a git repo: nothing to guard.
[ -z "$GUARD_GIT_DIR" ] && exit 0

# Start the numbered-worktree sweep at most once per window. Every failure here is silent:
# a session never waits on, or fails because of, housekeeping.
__guard_sweep_numbered() {
  local window=21600 common stamp reaper now mtime
  case "${SPECKIT_WORKTREE_AUTOREAP:-1}" in 0|off|false|no) return 0 ;; esac
  case "$GUARD_GIT_COMMON_DIR" in
    /*) common="$GUARD_GIT_COMMON_DIR" ;;
    *)  common="$(cd "$GUARD_GIT_COMMON_DIR" 2>/dev/null && pwd -P)" || return 0 ;;
  esac
  reaper="${SPECKIT_WORKTREE_REAPER:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)/worktree-reaper.sh}"
  [ -f "$reaper" ] || return 0
  stamp="$common/worktree-reaper-numbered.stamp"
  now="$(date +%s)"
  if [ -e "$stamp" ]; then
    if [ "$(uname)" = "Darwin" ]; then mtime="$(stat -f %m "$stamp" 2>/dev/null || true)"; else mtime="$(stat -c %Y "$stamp" 2>/dev/null || true)"; fi
    case "$mtime" in ''|*[!0-9]*) ;; *) [ $((now - mtime)) -lt "$window" ] && return 0 ;; esac
  fi
  # The stamp is written first, and a stamp that cannot be written spawns nothing, so a
  # read-only git directory cannot cause a sweep on every start.
  : > "$stamp" 2>/dev/null || return 0
  ( nohup bash "$reaper" --numbered </dev/null >"$common/worktree-reaper-numbered.log" 2>&1 & ) || true
}
__guard_sweep_numbered || true

# Inside a linked worktree => already isolated, no warning.
if [ -n "$GUARD_GIT_DIR" ] && [ -n "$GUARD_GIT_COMMON_DIR" ] && [ "$GUARD_GIT_DIR" != "$GUARD_GIT_COMMON_DIR" ]; then
  exit 0
fi

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
printf '%s\n' "[worktree-guard] This top-level session is running on the shared '$branch' checkout, not an isolated worktree. Concurrent AI sessions here can collide (shared working tree + MCP databases). To isolate next time, launch via: bash .skilled/bin/worktree-session.sh <runtime>. (silence: SPECKIT_WORKTREE_GUARD=off)" >&2

exit 0
