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
#     branch has diverged (someone committed directly in this tree), it warns
#     loudly and leaves the tree untouched for the operator to reconcile.
#   - Never pulls over uncommitted work: a dirty tree is reported, not overwritten,
#     so an in-progress edit in the IDE is never clobbered by an incoming commit.
#   - The dirty test is TRACKED-ONLY. Untracked scratch files and build artifacts
#     must never block a fast-forward, or the checkout silently falls behind in a
#     real working tree that produces build output.
#   - Read-mostly: the only mutation is a clean fast-forward of an unmodified tree.
#   - Exactly one follower per checkout: a per-checkout PID lock under the git
#     common dir makes a second instance exit cleanly instead of double-polling.
#
# Usage:
#   git-live-follow.sh [--live <branch>] [--remote <name>] [--interval <sec>] [--once] [--start]
#     --live      Branch to follow. Default: this checkout's current branch.
#     --remote    Remote to poll. Default: $SPECKIT_LIVE_REMOTE or "origin".
#     --interval  Poll seconds between checks (default 5). Ignored with --once.
#     --once      Run a single check and exit (for a manual "catch me up" nudge).
#     --start     SessionStart mode: auto-start one follower for THIS checkout.
#                 Refuses to run inside a linked worktree, honors the live-sync
#                 kill switches, prints the live-sync status line, and exits 0.
#
# Kill switches (see .opencode/hooks/shared/hook-flags.sh):
#   SYSTEM_LIVE_SYNC_DISABLED   master off for the whole live-sync loop
#   SYSTEM_LIVE_FOLLOW_DISABLED follower-only opt-out

set -uo pipefail

LIVE=""
REMOTE="${SPECKIT_LIVE_REMOTE:-origin}"
INTERVAL=5
ONCE=0
START=0
LIVE_FOLLOW_MANAGED_LOG="${LIVE_FOLLOW_MANAGED_LOG:-0}"
LIVE_FOLLOW_LOG_MAX_BYTES="${LIVE_FOLLOW_LOG_MAX_BYTES:-262144}"

case "$LIVE_FOLLOW_LOG_MAX_BYTES" in
  ''|0|*[!0-9]*) LIVE_FOLLOW_LOG_MAX_BYTES=262144 ;;
esac

while [ $# -gt 0 ]; do
  case "$1" in
    --live)     LIVE="${2:-}"; shift 2 || shift ;;
    --remote)   REMOTE="${2:-}"; shift 2 || shift ;;
    --interval) INTERVAL="${2:-5}"; shift 2 || shift ;;
    --once)     ONCE=1; shift ;;
    --start)    START=1; shift ;;
    *) echo "git-live-follow: unknown arg '$1'" >&2; shift ;;
  esac
done

command -v git >/dev/null 2>&1 || { echo "[live-follow] git not found" >&2; exit 1; }
git rev-parse --git-dir >/dev/null 2>&1 || { echo "[live-follow] not a git repository" >&2; exit 1; }

# ───────────────────────────────────────────────────────────────
# Lock plumbing: one follower per checkout. The lock lives under the
# git COMMON dir (shared state that must never dirty a worktree) and is
# keyed to THIS checkout's own git dir, so distinct worktrees may each
# follow while a second follower on the same tree exits cleanly.
# ───────────────────────────────────────────────────────────────
GIT_DIR_PATH="$(git rev-parse --git-dir 2>/dev/null || true)"
GIT_COMMON_PATH="$(git rev-parse --git-common-dir 2>/dev/null || true)"
case "$GIT_DIR_PATH" in
  /*) ;;
  *) [ -n "$GIT_DIR_PATH" ] && GIT_DIR_PATH="$PWD/$GIT_DIR_PATH" ;;
esac
case "$GIT_COMMON_PATH" in
  /*) ;;
  *) [ -n "$GIT_COMMON_PATH" ] && GIT_COMMON_PATH="$PWD/$GIT_COMMON_PATH" ;;
esac
LOCK_DIR="${GIT_COMMON_PATH:-.}/live-follow"
LOCK_KEY="$(printf '%s' "$GIT_DIR_PATH" | cksum 2>/dev/null | awk '{print $1}')"
LOCK_FILE="$LOCK_DIR/${LOCK_KEY:-default}.pid"
LOG_FILE="$LOCK_DIR/${LOCK_KEY:-default}.log"
PREVIOUS_LOG_FILE="$LOG_FILE.1"
LAST_POLL_STATE=""

rotate_log_if_needed() {
  [ "$LIVE_FOLLOW_MANAGED_LOG" = "1" ] || return 0
  [ -f "$LOG_FILE" ] || return 0
  local incoming_bytes="${1:-0}"
  local current_size
  current_size="$(wc -c < "$LOG_FILE" 2>/dev/null | tr -d '[:space:]')" || current_size=0
  case "$current_size" in
    ''|*[!0-9]*) return 0 ;;
  esac
  case "$incoming_bytes" in
    ''|*[!0-9]*) incoming_bytes=0 ;;
  esac
  if [ "$current_size" -lt "$LIVE_FOLLOW_LOG_MAX_BYTES" ] &&
    [ "$incoming_bytes" -le "$((LIVE_FOLLOW_LOG_MAX_BYTES - current_size))" ]; then
    return 0
  fi
  mv -f "$LOG_FILE" "$PREVIOUS_LOG_FILE" 2>/dev/null || return 0
  exec >> "$LOG_FILE" 2>&1
}

log_state_change() {
  local state="$1"
  shift
  [ "$LAST_POLL_STATE" = "$state" ] && return 0
  LAST_POLL_STATE="$state"
  local incoming_bytes
  incoming_bytes="$(printf '%s\n' "$@" | wc -c | tr -d '[:space:]')" || incoming_bytes=0
  rotate_log_if_needed "$incoming_bytes"
  local message
  for message in "$@"; do
    printf '%s\n' "$message" >&2
  done
}

# A lock is live only while its PID answers kill -0; a stale file from a
# killed follower is discarded so the next start can take over.
lock_held() {
  [ -f "$LOCK_FILE" ] || return 1
  local pid
  pid="$(cat "$LOCK_FILE" 2>/dev/null || true)"
  case "$pid" in
    ''|*[!0-9]*) rm -f "$LOCK_FILE" 2>/dev/null || true; return 1 ;;
  esac
  if kill -0 "$pid" 2>/dev/null; then return 0; fi
  rm -f "$LOCK_FILE" 2>/dev/null || true
  return 1
}

acquire_lock() {
  mkdir -p "$LOCK_DIR" 2>/dev/null || return 0
  printf '%s\n' "$$" > "$LOCK_FILE" 2>/dev/null || return 0
  trap 'rm -f "$LOCK_FILE" 2>/dev/null || true' EXIT
  return 0
}

# ───────────────────────────────────────────────────────────────
# SessionStart auto-start: main-checkout-only, single-instance, silent
# when disabled or outside the main checkout. This is the surface that
# turns live-sync on by default without any operator setup step.
# ───────────────────────────────────────────────────────────────
if [ "$START" = "1" ]; then
  # A linked worktree is a session tree: never fast-forward it from under the
  # session that owns it. Only the main checkout (git-dir == git-common-dir)
  # qualifies for auto-start.
  if [ -n "$GIT_DIR_PATH" ] && [ -n "$GIT_COMMON_PATH" ] && [ "$GIT_DIR_PATH" != "$GIT_COMMON_PATH" ]; then
    exit 0
  fi
  # Kill switches: absent means ON; a disabled loop must not announce or start.
  __hf_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
  if [ -n "$__hf_root" ] && [ -r "$__hf_root/.opencode/hooks/shared/hook-flags.sh" ]; then
    # shellcheck source=/dev/null
    . "$__hf_root/.opencode/hooks/shared/hook-flags.sh"
    hook_enabled live-sync || exit 0
    hook_enabled live-follow || exit 0
  fi
  if [ -z "$LIVE" ]; then
    LIVE="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
    [ -z "$LIVE" ] && exit 0
  fi
  # One-line status notice per session; starting is separate so an already
  # running follower (from an earlier session) still gets the notice once.
  echo "[live-sync] live-sync active (commits auto-publish, checkout auto-follows); disable with SYSTEM_LIVE_SYNC_DISABLED=1" >&2
  if ! lock_held; then
    if [ -f "$__hf_root/.opencode/bin/git-live-follow.sh" ]; then
      mkdir -p "$LOCK_DIR" 2>/dev/null || true
      LIVE_FOLLOW_MANAGED_LOG=1 nohup bash "$__hf_root/.opencode/bin/git-live-follow.sh" \
        --live "$LIVE" --remote "$REMOTE" --interval "$INTERVAL" \
        >/dev/null 2>&1 &
      disown 2>/dev/null || true
    fi
  fi
  exit 0
fi

if [ "$LIVE_FOLLOW_MANAGED_LOG" = "1" ]; then
  mkdir -p "$LOCK_DIR" 2>/dev/null || true
  exec >> "$LOG_FILE" 2>&1
fi

# Default to whatever branch the IDE currently has open — the follower's job is to
# keep THIS checkout current, whatever it is pointed at.
if [ -z "$LIVE" ]; then
  LIVE="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  [ -z "$LIVE" ] && { echo "[live-follow] detached HEAD and no --live given" >&2; exit 1; }
fi

rotate_log_if_needed
echo "[live-follow] following $REMOTE/$LIVE (interval ${INTERVAL}s, ff-only)" >&2

check_once() {
  git fetch --quiet "$REMOTE" "$LIVE" 2>/dev/null || {
    log_state_change "fetch-failed" "[live-follow] fetch failed"
    return 0
  }
  local remote_tip local_tip
  remote_tip="$(git rev-parse --quiet --verify "$REMOTE/$LIVE" 2>/dev/null || true)"
  local_tip="$(git rev-parse --quiet --verify "HEAD" 2>/dev/null || true)"
  if [ -z "$remote_tip" ]; then
    LAST_POLL_STATE="remote-unavailable"
    return 0
  fi
  if [ "$remote_tip" = "$local_tip" ]; then
    LAST_POLL_STATE="in-sync"
    return 0
  fi

  # Behind fast-forward: the local tip is an ancestor of the remote tip. Let git's
  # own --ff-only decide — it refuses to overwrite a modified tracked file, so an
  # unrelated dirty tree still follows for disjoint commits and a colliding change is
  # reported, never clobbered. Untracked scratch and build output never block it.
  if git merge-base --is-ancestor "$local_tip" "$remote_tip"; then
    local n; n="$(git rev-list --count "$local_tip..$remote_tip" 2>/dev/null || echo '?')"
    if git merge --ff-only --quiet "$remote_tip" 2>/dev/null; then
      log_state_change "fast-forward:$remote_tip" "[live-follow] ↑ pulled $n commit(s) — now at $(git rev-parse --short HEAD)"
    else
      log_state_change "fast-forward-blocked:$remote_tip" "[live-follow] $n new commit(s) on $LIVE, but a fast-forward would overwrite local changes — not pulling (commit/stash to catch up)"
    fi
    return 0
  fi

  # Diverged: this tree has commits not on the remote live branch. Loud warning
  # naming the drift so a silent divergence cannot hide; this follower never
  # merges, rebases, or resets the tree.
  local ahead behind
  ahead="$(git rev-list --count "$remote_tip..$local_tip" 2>/dev/null || echo '?')"
  behind="$(git rev-list --count "$local_tip..$remote_tip" 2>/dev/null || echo '?')"
  log_state_change "diverged:$ahead:$behind" \
    "[live-follow] DIVERGED: local $LIVE is $ahead commit(s) ahead of and $behind commit(s) behind $REMOTE/$LIVE" \
    "[live-follow] manual reconcile needed — this follower never auto-merges or resets"
  return 0
}

if [ "$ONCE" = "1" ]; then
  check_once
  exit 0
fi

# Single-instance guard for the long-running loop: a second follower on the
# same checkout exits cleanly instead of double-polling. --once stays lock-free
# so a manual "catch me up" nudge always works even while a poller runs.
if lock_held; then
  echo "[live-follow] another follower already running for this checkout; exiting" >&2
  exit 0
fi
acquire_lock

# Long-running poll loop. The operator or the SessionStart --start step
# backgrounds this once per checkout.
while :; do
  check_once
  sleep "$INTERVAL"
done
