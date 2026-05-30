#!/usr/bin/env bash
#
# worktree-guard.sh — detect-and-warn guard for AI SessionStart hook chains.
#
# Companion to worktree-session.sh. A SessionStart hook cannot relocate an
# already-started process into a worktree, but it CAN warn the operator when a
# top-level session is running directly on the shared main checkout instead of an
# isolated worktree — the situation worktree-session.sh exists to prevent.
#
# Wire it into any runtime's SessionStart chain, e.g. as an extra hook command:
#   bash /abs/path/.opencode/bin/worktree-guard.sh
#
# It is intentionally non-fatal: it prints a one-line warning to stderr and always
# exits 0, so it never blocks a session that the operator chose to run on main.
#
# Silence with SPECKIT_WORKTREE_GUARD=off.

set -u

[ "${SPECKIT_WORKTREE_GUARD:-on}" = "off" ] && exit 0

# Orchestrated children are expected to share the parent's tree — never warn for them.
[ "${AI_SESSION_CHILD:-}" = "1" ] && exit 0

git_dir="$(git rev-parse --git-dir 2>/dev/null || true)"
common_dir="$(git rev-parse --git-common-dir 2>/dev/null || true)"

# Not a git repo: nothing to guard.
[ -z "$git_dir" ] && exit 0

# Inside a linked worktree => already isolated, no warning.
if [ -n "$git_dir" ] && [ -n "$common_dir" ] && [ "$git_dir" != "$common_dir" ]; then
  exit 0
fi

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  printf '%s\n' "[worktree-guard] This top-level session is running on the shared '$branch' checkout, not an isolated worktree. Concurrent AI sessions here can collide (shared working tree + MCP databases). To isolate next time, launch via: bash .opencode/bin/worktree-session.sh <runtime>. (silence: SPECKIT_WORKTREE_GUARD=off)" >&2
fi

exit 0
