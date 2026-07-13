#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Git Live-Follow — keep the IDE checkout current with the live branch
# ───────────────────────────────────────────────────────────────
# The operator side of the continuous-integration model. Sessions publish their
# commits to the shared "live" branch (see git-sync.sh); this watcher runs in the
# operator's primary checkout — the one open in the IDE — and fast-forwards it as
# new commits land, so the editor always shows the current combined state of every
# active session, seconds behind the latest commit.
#
# Safety contract:
#   - Fast-forward ONLY. It never merges, rebases, or resets — if the local live
#     branch has diverged (someone committed directly in this tree), it warns and
#     leaves the tree untouched for the operator to reconcile.
#   - Never pulls over uncommitted work: a dirty tree is reported, not overwritten,
#     so an in-progress edit in the IDE is never clobbered by an incoming commit.
#   - Read-mostly: the only mutation is a clean fast-forward of an unmodified tree.
#
# Usage:
#   git-live-follow.sh [--live <branch>] [--remote <name>] [--interval <sec>] [--once]
#     --live      Branch to follow. Default: this checkout's current branch.
#     --remote    Remote to poll. Default: $SPECKIT_LIVE_REMOTE or "origin".
#     --interval  Poll seconds between checks (default 5). Ignored with --once.
#     --once      Run a single check and exit (for a manual "catch me up" nudge).

set -uo pipefail

LIVE=""
REMOTE="${SPECKIT_LIVE_REMOTE:-origin}"
INTERVAL=5
ONCE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --live)     LIVE="${2:-}"; shift 2 || shift ;;
    --remote)   REMOTE="${2:-}"; shift 2 || shift ;;
    --interval) INTERVAL="${2:-5}"; shift 2 || shift ;;
    --once)     ONCE=1; shift ;;
    *) echo "git-live-follow: unknown arg '$1'" >&2; shift ;;
  esac
done

command -v git >/dev/null 2>&1 || { echo "[live-follow] git not found" >&2; exit 1; }
git rev-parse --git-dir >/dev/null 2>&1 || { echo "[live-follow] not a git repository" >&2; exit 1; }

# Default to whatever branch the IDE currently has open — the follower's job is to
# keep THIS checkout current, whatever it is pointed at.
if [ -z "$LIVE" ]; then
  LIVE="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  [ -z "$LIVE" ] && { echo "[live-follow] detached HEAD and no --live given" >&2; exit 1; }
fi

echo "[live-follow] following $REMOTE/$LIVE (interval ${INTERVAL}s, ff-only)" >&2

check_once() {
  git fetch --quiet "$REMOTE" "$LIVE" 2>/dev/null || { echo "[live-follow] fetch failed" >&2; return 0; }
  local remote_tip local_tip
  remote_tip="$(git rev-parse --quiet --verify "$REMOTE/$LIVE" 2>/dev/null || true)"
  local_tip="$(git rev-parse --quiet --verify "HEAD" 2>/dev/null || true)"
  [ -z "$remote_tip" ] && return 0
  [ "$remote_tip" = "$local_tip" ] && return 0

  # Behind and clean fast-forward: the local tip is an ancestor of the remote tip.
  if git merge-base --is-ancestor "$local_tip" "$remote_tip"; then
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
      local n; n="$(git rev-list --count "$local_tip..$remote_tip" 2>/dev/null || echo '?')"
      echo "[live-follow] $n new commit(s) on $LIVE, but this tree is dirty — not pulling (commit/stash to catch up)" >&2
      return 0
    fi
    local n; n="$(git rev-list --count "$local_tip..$remote_tip" 2>/dev/null || echo '?')"
    if git merge --ff-only --quiet "$remote_tip" 2>/dev/null; then
      echo "[live-follow] ↑ pulled $n commit(s) — now at $(git rev-parse --short HEAD)" >&2
    else
      echo "[live-follow] fast-forward refused unexpectedly; leaving tree untouched" >&2
    fi
    return 0
  fi

  # Diverged: this tree has commits not on the remote live branch. Do not touch it.
  echo "[live-follow] local $LIVE has diverged from $REMOTE/$LIVE — manual reconcile needed (not auto-merging)" >&2
  return 0
}

if [ "$ONCE" = "1" ]; then
  check_once
  exit 0
fi

# Long-running poll loop. The operator backgrounds this once per IDE session.
while :; do
  check_once
  sleep "$INTERVAL"
done
