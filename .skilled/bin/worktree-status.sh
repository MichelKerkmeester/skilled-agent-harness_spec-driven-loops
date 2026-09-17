#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree Status — one-glance view of every session's live state
# ───────────────────────────────────────────────────────────────
# Answers the question the continuous-integration model is built around: "what is
# every active session doing right now, and what have I not seen yet?" For each
# worktree it shows the branch, how many commits it is ahead of / behind the live
# branch, and how many uncommitted files it holds — the ahead+uncommitted columns
# are exactly the work that is NOT yet visible in the IDE.
#
# Read-only: it never fetches, mutates, or touches any tree. Pass --fetch to
# refresh remote-tracking refs first for accurate ahead/behind against origin.
#
# Usage:
#   worktree-status.sh [--live <branch>] [--remote <name>] [--fetch]
#     --live    Branch to compare against. Default: $SPECKIT_LIVE_BRANCH, else the
#               main checkout's current branch.
#     --remote  Remote for --fetch and origin/<live> comparison. Default: origin.
#     --fetch   Refresh origin/<live> before comparing (one network call).

set -uo pipefail

LIVE="${SPECKIT_LIVE_BRANCH:-}"
REMOTE="${SPECKIT_LIVE_REMOTE:-origin}"
DO_FETCH=0

while [ $# -gt 0 ]; do
  case "$1" in
    --live)   LIVE="${2:-}"; shift 2 || shift ;;
    --remote) REMOTE="${2:-}"; shift 2 || shift ;;
    --fetch)  DO_FETCH=1; shift ;;
    *) echo "worktree-status: unknown arg '$1'" >&2; shift ;;
  esac
done

command -v git >/dev/null 2>&1 || { echo "worktree-status: git not found" >&2; exit 1; }
git rev-parse --git-dir >/dev/null 2>&1 || { echo "worktree-status: not a git repository" >&2; exit 1; }

# The main (non-linked) checkout defines the default live branch — it is the tree
# the IDE follows.
MAIN_ROOT="$(git worktree list --porcelain 2>/dev/null | awk '/^worktree /{print $2; exit}')"
if [ -z "$LIVE" ]; then
  LIVE="$(git -C "$MAIN_ROOT" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  [ -z "$LIVE" ] && LIVE="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || echo 'HEAD')"
fi

if [ "$DO_FETCH" = "1" ]; then
  git fetch --quiet "$REMOTE" "$LIVE" 2>/dev/null || echo "worktree-status: fetch of $REMOTE/$LIVE failed (showing local view)" >&2
fi

# Compare against origin/<live> when present (the true published state), else the
# local <live> ref.
BASE_REF="$REMOTE/$LIVE"
git rev-parse --quiet --verify "$BASE_REF" >/dev/null 2>&1 || BASE_REF="$LIVE"

echo "live branch: $BASE_REF"
printf '%-40s  %-26s  %6s  %6s  %6s\n' "WORKTREE" "BRANCH" "AHEAD" "BEHIND" "DIRTY"
printf '%-40s  %-26s  %6s  %6s  %6s\n' "--------" "------" "-----" "------" "-----"

# Walk each worktree from the porcelain stream (path + branch per record).
wt_path=""
git worktree list --porcelain 2>/dev/null | while IFS= read -r line; do
  case "$line" in
    "worktree "*) wt_path="${line#worktree }" ;;
    "branch "*)
      branch="${line#branch }"; branch="${branch#refs/heads/}"
      ;;
    "detached") branch="(detached)" ;;
    "")
      # End of a record: emit the row.
      [ -z "$wt_path" ] && continue
      short_path="${wt_path##*/Code_Environment/Public}"
      [ "$short_path" = "$wt_path" ] && short_path="$wt_path"
      short_path=".${short_path}"
      [ "$short_path" = ".$wt_path" ] && short_path="$wt_path"

      ahead="-"; behind="-"
      if git -C "$wt_path" rev-parse --quiet --verify "$BASE_REF" >/dev/null 2>&1; then
        ahead="$(git -C "$wt_path" rev-list --count "$BASE_REF..HEAD" 2>/dev/null || echo '?')"
        behind="$(git -C "$wt_path" rev-list --count "HEAD..$BASE_REF" 2>/dev/null || echo '?')"
      fi
      dirty="$(git -C "$wt_path" status --porcelain 2>/dev/null | grep -c . || true)"

      printf '%-40s  %-26s  %6s  %6s  %6s\n' \
        "$(printf '%.40s' "$short_path")" "$(printf '%.26s' "${branch:-?}")" "$ahead" "$behind" "$dirty"
      wt_path=""; branch=""
      ;;
  esac
done

echo
echo "AHEAD + DIRTY = work not yet on $BASE_REF (AHEAD is committed-but-unpublished; DIRTY is uncommitted)."
