#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# COMPONENT: Git Primary Reconcile - converge the primary live checkout
# -----------------------------------------------------------------------------
# SessionStart safety primitive for the live-sync model. It reconciles only the
# primary checkout, only on its resolved live branch, and only when tracked
# files are clean. Every internal failure is non-fatal so startup can continue.
#
# Exit Codes:
#   0 - Every outcome, including skips, conflicts, and internal errors

set -euo pipefail

REMOTE="${SPECKIT_LIVE_REMOTE:-origin}"
LIVE="${SPECKIT_LIVE_BRANCH:-}"
NETWORK_TIMEOUT="${SPECKIT_PRIMARY_RECONCILE_TIMEOUT:-12}"
LOCK_TTL="${SPECKIT_PRIMARY_RECONCILE_LOCK_TTL:-45}"
BRANCH="-"
COMMON_DIR=""
LOG_FILE=""
LOCK_FILE=""
LOCK_TOKEN=""
LOCK_OWNED=0
PUSH_OUTPUT=""
PUSH_GATE=""
PUSH_FIX=""

warn() {
  printf '%s\n' "[primary-reconcile] $*" >&2
}

record() {
  [ -n "$LOG_FILE" ] || return 0
  local timestamp
  timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || printf '%s' '-')"
  printf '%s\t%s\tbranch=%s\tlive=%s\t%s\n' \
    "$timestamp" "$1" "$BRANCH" "${LIVE:--}" "${2:-}" >> "$LOG_FILE" 2>/dev/null || true
}

# shellcheck disable=SC2329
release_lock() {
  [ "$LOCK_OWNED" = "1" ] || return 0
  [ -n "$LOCK_FILE" ] || return 0
  if [ "$(command cat "$LOCK_FILE" 2>/dev/null || true)" = "$LOCK_TOKEN" ]; then
    rm -f "$LOCK_FILE" 2>/dev/null || true
  fi
}

# shellcheck disable=SC2329
finish() {
  set +e
  release_lock
  trap - EXIT INT TERM
  exit 0
}

trap finish EXIT
trap 'exit 0' INT TERM

canonical_dir() {
  local path="$1"
  case "$path" in
    /*) ;;
    *) path="$PWD/$path" ;;
  esac
  (cd -P "$path" 2>/dev/null && pwd -P)
}

bounded_run() {
  local seconds="$1"
  shift
  if command -v timeout >/dev/null 2>&1; then
    timeout --signal=TERM --kill-after=1 "${seconds}s" "$@"
    return $?
  fi
  if command -v gtimeout >/dev/null 2>&1; then
    gtimeout --signal=TERM --kill-after=1 "${seconds}s" "$@"
    return $?
  fi
  if command -v perl >/dev/null 2>&1; then
    perl -e 'alarm shift; exec @ARGV' "$seconds" "$@"
    return $?
  fi
  warn "SKIP: no bounded command runner is available; refusing network access."
  return 124
}

try_acquire_lock() {
  local now
  local created
  local age

  now="$(date +%s 2>/dev/null || printf '%s' '0')"
  LOCK_TOKEN="$$ $now ${RANDOM:-0}"
  if (set -C; printf '%s\n' "$LOCK_TOKEN" > "$LOCK_FILE") 2>/dev/null; then
    LOCK_OWNED=1
    return 0
  fi

  created="$(command awk 'NR == 1 { print $2 }' "$LOCK_FILE" 2>/dev/null || true)"
  case "$created" in
    ''|*[!0-9]*) age="$LOCK_TTL" ;;
    *) age=$((now - created)) ;;
  esac
  if [ "$age" -ge "$LOCK_TTL" ]; then
    rm -f "$LOCK_FILE" 2>/dev/null || true
    if (set -C; printf '%s\n' "$LOCK_TOKEN" > "$LOCK_FILE") 2>/dev/null; then
      LOCK_OWNED=1
      return 0
    fi
  fi
  return 1
}

classify_push_gate() {
  PUSH_GATE="push-rejected"
  PUSH_FIX="git push $REMOTE HEAD:$LIVE"
  case "$PUSH_OUTPUT" in
    *'[gate:mass-deletion]'*)
      PUSH_GATE="mass-deletion"
      PUSH_FIX="After inspection: SPECKIT_ALLOW_MASS_DELETION=1 git push $REMOTE HEAD:$LIVE"
      ;;
    *'[gate:skill-root-metadata]'*)
      PUSH_GATE="skill-root-metadata"
      PUSH_FIX="node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix"
      ;;
    *'[gate:naming]'*)
      PUSH_GATE="naming"
      PUSH_FIX="Use an owner-first branch name; bypass only with SPECKIT_SKIP_PREPUSH_NAMING=1."
      ;;
    *'[gate:remote-permission]'*)
      PUSH_GATE="remote-permission"
      PUSH_FIX="After explicit approval, retry that one push with SPECKIT_ALLOW_REMOTE_PUSH=1."
      ;;
    *'[gate:test-suites]'*)
      PUSH_GATE="test-suites"
      PUSH_FIX="Fix the reported test failure or use only the documented operator policy."
      ;;
  esac
}

command -v git >/dev/null 2>&1 || { warn "SKIP: git is unavailable; session start will continue."; exit 0; }
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

GIT_DIR="$(canonical_dir "$(git rev-parse --git-dir 2>/dev/null || true)" || true)"
COMMON_DIR="$(canonical_dir "$(git rev-parse --git-common-dir 2>/dev/null || true)" || true)"
[ -n "$GIT_DIR" ] && [ -n "$COMMON_DIR" ] || { warn "SKIP: could not resolve Git directories; session start will continue."; exit 0; }

# A linked worktree shares refs with the primary checkout but is owned by a
# separate session. Moving its checked-out branch from here would cross that
# ownership boundary, so this gate precedes flags, logging, locking, and fetch.
[ "$GIT_DIR" = "$COMMON_DIR" ] || exit 0

LOG_FILE="$COMMON_DIR/git-primary-reconcile.log"
LOCK_FILE="$COMMON_DIR/git-primary-reconcile.lock"

# Resolver failures leave default-on behavior intact. Startup must not become
# dependent on optional policy plumbing, but the missing guard must be visible.
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
FLAGS_FILE="$REPO_ROOT/.opencode/hooks/shared/hook-flags.sh"
FLAGS_LOADED=0
if [ -n "$REPO_ROOT" ] && [ -r "$FLAGS_FILE" ]; then
  set +e
  # shellcheck source=/dev/null
  . "$FLAGS_FILE"
  FLAGS_RC=$?
  set -e
  if [ "$FLAGS_RC" = "0" ] && command -v hook_enabled >/dev/null 2>&1; then
    FLAGS_LOADED=1
  else
    warn "WARN: hook flag resolver failed; continuing with primary reconcile enabled."
  fi
else
  warn "WARN: hook flag resolver unavailable; continuing with primary reconcile enabled."
fi
if [ "$FLAGS_LOADED" = "1" ]; then
  hook_enabled live-sync || { record skip "disabled by MK_LIVE_SYNC_DISABLED"; exit 0; }
  hook_enabled primary-reconcile || { record skip "disabled by MK_PRIMARY_RECONCILE_DISABLED"; exit 0; }
fi

if ! try_acquire_lock; then
  record skip "single-flight lock held"
  exit 0
fi

BRANCH="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
if [ -z "$LIVE" ]; then
  case "$BRANCH" in
    skilled/v*) LIVE="$BRANCH" ;;
    *) record skip "current branch is not a release branch and SPECKIT_LIVE_BRANCH is unset"; exit 0 ;;
  esac
fi
if [ -z "$BRANCH" ] || [ "$BRANCH" != "$LIVE" ]; then
  record skip "current branch does not match resolved live branch"
  exit 0
fi

# Fetching mutates remote-tracking refs, so the tracked-only dirty check must
# happen before any network operation. Untracked build output is intentionally
# ignored because it is normal in the primary checkout.
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  warn "SKIP: uncommitted tracked changes in the primary checkout; not touching it."
  record skip "uncommitted tracked changes; checkout untouched"
  exit 0
fi

if ! bounded_run "$NETWORK_TIMEOUT" git fetch --quiet "$REMOTE" "$LIVE"; then
  warn "SKIP: bounded fetch of $REMOTE/$LIVE failed; checkout remains unchanged."
  record skip "fetch failed or timed out"
  exit 0
fi

REMOTE_TIP="$(git rev-parse --quiet --verify "$REMOTE/$LIVE" 2>/dev/null || true)"
LOCAL_TIP="$(git rev-parse --quiet --verify HEAD 2>/dev/null || true)"
if [ -z "$REMOTE_TIP" ] || [ -z "$LOCAL_TIP" ]; then
  warn "SKIP: could not resolve local and remote live tips after fetch."
  record skip "missing local or remote live tip"
  exit 0
fi
if [ "$LOCAL_TIP" = "$REMOTE_TIP" ]; then
  record skip "already up to date"
  exit 0
fi

if git merge-base --is-ancestor "$LOCAL_TIP" "$REMOTE_TIP"; then
  BEHIND="$(git rev-list --count "$LOCAL_TIP..$REMOTE_TIP" 2>/dev/null || printf '%s' '?')"
  if git merge --ff-only --quiet "$REMOTE_TIP" 2>/dev/null; then
    record advance "fast-forwarded $BEHIND commit(s) to $(git rev-parse --short HEAD 2>/dev/null || true)"
    warn "ADVANCE: fast-forwarded $BRANCH by $BEHIND commit(s)."
  else
    warn "BLOCK: fast-forward was refused; checkout remains at $LOCAL_TIP."
    record block "fast-forward refused from $LOCAL_TIP to $REMOTE_TIP"
  fi
  exit 0
fi

AHEAD="$(git rev-list --count "$REMOTE_TIP..$LOCAL_TIP" 2>/dev/null || printf '%s' '0')"
if [ "$AHEAD" = "0" ]; then
  warn "BLOCK: live histories cannot be reconciled automatically; no commit was moved or pushed."
  record block "no local commits available to rebase"
  exit 0
fi

ORIGINAL_HEAD="$LOCAL_TIP"
if ! git rebase --quiet "$REMOTE_TIP" 2>/dev/null; then
  git rebase --abort >/dev/null 2>&1 || true
  REBASE_MERGE="$(git rev-parse --git-path rebase-merge 2>/dev/null || true)"
  REBASE_APPLY="$(git rev-parse --git-path rebase-apply 2>/dev/null || true)"
  RESTORED_HEAD="$(git rev-parse --quiet --verify HEAD 2>/dev/null || true)"
  if [ "$RESTORED_HEAD" != "$ORIGINAL_HEAD" ] || [ -e "$REBASE_MERGE" ] || [ -e "$REBASE_APPLY" ] || \
     ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
    warn "CRITICAL BLOCK: rebase abort did not restore the original clean checkout. Run: git rebase --abort && git status"
    record block "rebase abort assertion failed; original=$ORIGINAL_HEAD current=$RESTORED_HEAD"
    exit 0
  fi
  warn "BLOCK: rebase conflict; $AHEAD local commit(s) preserved but unpublished. Resolve: git rebase $REMOTE/$LIVE && git push $REMOTE HEAD:$LIVE"
  record block "rebase conflict aborted cleanly; $AHEAD local commit(s) preserved but unpublished"
  exit 0
fi

set +e
PUSH_OUTPUT="$(bounded_run "$NETWORK_TIMEOUT" git push "$REMOTE" "HEAD:$LIVE" 2>&1)"
PUSH_RC=$?
set -e
if [ "$PUSH_RC" = "0" ]; then
  NEW_HEAD="$(git rev-parse --quiet --verify HEAD 2>/dev/null || true)"
  record publish "rebased and published $AHEAD local commit(s); head=$NEW_HEAD"
  warn "PUBLISH: rebased and published $AHEAD local commit(s) to $REMOTE/$LIVE."
  exit 0
fi

classify_push_gate
[ -z "$PUSH_OUTPUT" ] || printf '%s\n' "$PUSH_OUTPUT" >&2
warn "BLOCK [$PUSH_GATE]: push rejected; local commit remains preserved but unpublished. Fix: $PUSH_FIX"
record block "gate=$PUSH_GATE push rejected; fix=$PUSH_FIX"
exit 0
