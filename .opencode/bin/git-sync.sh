#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Git Sync — publish a session's commits to the live branch
# ───────────────────────────────────────────────────────────────
# Continuous-integration primitive for the worktree-per-session model. A session
# works on its own branch in its own worktree (safe, isolated writes); git-sync
# publishes its committed work onto the ONE shared "live" branch that the
# operator's IDE follows, so every session's commits become visible within
# seconds — without ever leaving a session's branch in a broken state.
#
# Safety contract (the whole point):
#   - Publishes only COMMITTED work. Never touches uncommitted changes.
#   - Fast-forwards the live branch when possible (the common case).
#   - When the live branch has moved, rebases the session's commits onto it.
#     On ANY rebase conflict it ABORTS the rebase (restoring the exact pre-sync
#     state) and reports the commits as pending — it never asks the caller to
#     resolve another session's changes mid-hook, and never half-applies.
#   - Non-fatal by default: a blocked publish leaves the commit local and prints
#     how to finish it manually; the session keeps working.
#
# Usage:
#   git-sync.sh [--live <branch>] [--remote <name>] [--auto] [--quiet]
#     --live    Target integration branch. Default: $SPECKIT_LIVE_BRANCH.
#     --remote  Remote to publish to. Default: $SPECKIT_LIVE_REMOTE or "origin".
#     --auto    Hook mode: stay silent on the no-op path, never exit non-zero.
#     --quiet   Suppress the success line.
#
# Env:
#   SPECKIT_LIVE_BRANCH   default live branch (exported by worktree-session.sh)
#   SPECKIT_LIVE_REMOTE   default remote (default "origin")
#   SPECKIT_SYNC_RETRIES  push race retries (default 3)

set -uo pipefail

# ───────────────────────────────────────────────────────────────
# 1. ARGUMENT + ENVIRONMENT RESOLUTION
# ───────────────────────────────────────────────────────────────

LIVE="${SPECKIT_LIVE_BRANCH:-}"
REMOTE="${SPECKIT_LIVE_REMOTE:-origin}"
AUTO=0
QUIET=0
RETRIES="${SPECKIT_SYNC_RETRIES:-3}"

while [ $# -gt 0 ]; do
  case "$1" in
    --live)   LIVE="${2:-}"; shift 2 || shift ;;
    --remote) REMOTE="${2:-}"; shift 2 || shift ;;
    --auto)   AUTO=1; shift ;;
    --quiet)  QUIET=1; shift ;;
    *) echo "git-sync: unknown arg '$1'" >&2; shift ;;
  esac
done

# In --auto (post-commit hook) mode, every early exit is a clean 0: a sync that
# cannot proceed must never fail the commit that triggered it.
_bail() { if [ "$AUTO" = "1" ]; then exit 0; else exit "${1:-1}"; fi; }
log()   { [ "$QUIET" = "1" ] || echo "[git-sync] $*" >&2; }
warn()  { echo "[git-sync] $*" >&2; }

command -v git >/dev/null 2>&1 || { warn "git not found"; _bail 1; }
git rev-parse --git-dir >/dev/null 2>&1 || { [ "$AUTO" = "1" ] && exit 0; warn "not a git repository"; exit 1; }

if [ -z "$LIVE" ]; then
  [ "$AUTO" = "1" ] && exit 0
  warn "no live branch: pass --live <branch> or set SPECKIT_LIVE_BRANCH"
  exit 1
fi

# A detached HEAD has no branch to publish from; skip rather than guess.
BRANCH="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
if [ -z "$BRANCH" ]; then
  [ "$AUTO" = "1" ] && exit 0
  warn "detached HEAD — nothing to publish"
  exit 1
fi

# Never let a session republish while it IS the live checkout (that is the
# follower's job, and it would create a self-referential push).
if [ "$BRANCH" = "$LIVE" ]; then
  [ "$AUTO" = "1" ] && exit 0
  log "current branch is the live branch ($LIVE) — nothing to publish from here"
  exit 0
fi

# ───────────────────────────────────────────────────────────────
# 2. PUBLISH LOOP (fetch → fast-forward, else rebase, else pending)
# ───────────────────────────────────────────────────────────────

attempt=0
while :; do
  attempt=$((attempt + 1))

  git fetch --quiet "$REMOTE" "$LIVE" 2>/dev/null || { warn "fetch of $REMOTE/$LIVE failed"; _bail 1; }
  REMOTE_TIP="$(git rev-parse --quiet --verify "$REMOTE/$LIVE" 2>/dev/null || true)"

  # No remote live branch yet: create it from HEAD (first publisher).
  if [ -z "$REMOTE_TIP" ]; then
    if git push "$REMOTE" "HEAD:$LIVE" 2>/dev/null; then
      log "created $REMOTE/$LIVE from $BRANCH"
      exit 0
    fi
    warn "could not create $REMOTE/$LIVE"; _bail 1
  fi

  HEAD_SHA="$(git rev-parse HEAD)"

  # Nothing to publish: our commit is already contained in the live tip.
  if git merge-base --is-ancestor "$HEAD_SHA" "$REMOTE_TIP"; then
    [ "$AUTO" = "1" ] && exit 0
    log "already published — $BRANCH is contained in $REMOTE/$LIVE"
    exit 0
  fi

  # Fast-forward case: the live tip is an ancestor of HEAD, so publishing only
  # adds our commits. This is the common single-session / non-overlapping path.
  if git merge-base --is-ancestor "$REMOTE_TIP" "$HEAD_SHA"; then
    ahead="$(git rev-list --count "$REMOTE_TIP..$HEAD_SHA")"
    if git push "$REMOTE" "HEAD:$LIVE" 2>/dev/null; then
      log "published $ahead commit(s) to $REMOTE/$LIVE (fast-forward)"
      exit 0
    fi
    # A concurrent push landed between fetch and push: retry the whole loop.
    if [ "$attempt" -le "$RETRIES" ]; then continue; fi
    warn "push race persisted after $RETRIES retries; $ahead commit(s) pending on $BRANCH"; _bail 1
  fi

  # Diverged case: the live branch moved. Rebase our commits onto it, but only
  # when TRACKED files are clean, and abort on the first conflict. Untracked files
  # (scratch output, a session's unrelated new files) do NOT block a rebase, so we
  # deliberately ignore them here — checking `git status --porcelain` instead would
  # refuse the rebase for any session that merely has scratch files, which is the
  # common case right after a scoped commit.
  if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
    warn "$REMOTE/$LIVE moved but there are uncommitted changes to tracked files — cannot rebase."
    warn "commit or stash them, then run: bash .opencode/bin/git-sync.sh --live $LIVE"
    _bail 1
  fi

  if git rebase --quiet "$REMOTE_TIP" 2>/dev/null; then
    if git push "$REMOTE" "HEAD:$LIVE" 2>/dev/null; then
      log "rebased onto $REMOTE/$LIVE and published $BRANCH"
      exit 0
    fi
    if [ "$attempt" -le "$RETRIES" ]; then continue; fi
    warn "push race persisted after $RETRIES retries; commits pending on $BRANCH"; _bail 1
  fi

  # Rebase hit a conflict: undo it completely and report. The session's branch
  # is byte-identical to before this run; its commits stay local and unpublished.
  git rebase --abort 2>/dev/null || true
  pending="$(git rev-list --count "$REMOTE_TIP..$HEAD_SHA" 2>/dev/null || echo '?')"
  warn "auto-publish blocked: $BRANCH conflicts with $REMOTE/$LIVE ($pending commit(s) pending, unpublished)."
  warn "resolve manually: git rebase $REMOTE/$LIVE  (fix conflicts)  then  git push $REMOTE HEAD:$LIVE"
  _bail 1
done
