#!/usr/bin/env bash
# Test harness for the git live-follow SessionStart follower's lifecycle guards.
#
# A follower started by --start runs until killed, so one started inside a
# disposable copy (a test harness clone under a temp dir, or a dispatched child
# session) outlives its session and polls forever. These cases pin that --start
# stays out of those checkouts, still starts in a real one, and that a running
# follower exits once its checkout is deleted.
set -uo pipefail

unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES
unset AI_SESSION_CHILD SYSTEM_LIVE_SYNC_DISABLED SYSTEM_LIVE_FOLLOW_DISABLED

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
FOLLOW="$REPO_ROOT/.skilled/bin/git-live-follow.sh"

PASS=0; FAIL=0
export GIT_CONFIG_GLOBAL=/dev/null

# The real-checkout case needs a directory outside every temp root the guard skips.
TMP_ROOT="$(mktemp -d)"
REAL_ROOT="$(mktemp -d "$HOME/.git-live-follow-test.XXXXXX")"
cleanup() {
  pkill -f "$TMP_ROOT/" 2>/dev/null || true
  pkill -f "$REAL_ROOT/" 2>/dev/null || true
  rm -rf "$TMP_ROOT" "$REAL_ROOT"
}
trap cleanup EXIT

make_repo() { # make_repo <dir>
  mkdir -p "$1/.skilled/bin"
  git -C "$1" init -q -b main
  git -C "$1" -c user.name=t -c user.email=t@t commit -q --allow-empty -m init
  cp "$FOLLOW" "$1/.skilled/bin/git-live-follow.sh"
}

follower_running() { pgrep -f "$1/.skilled/bin/git-live-follow.sh --live" >/dev/null; }

wait_for() { # wait_for <seconds> <command...>
  local n=$(( $1 * 10 )); shift
  while [ "$n" -gt 0 ]; do "$@" && return 0; sleep 0.1; n=$((n - 1)); done
  return 1
}

pass() { echo "PASS  $1"; PASS=$((PASS + 1)); }
fail() { echo "FAIL  $1"; FAIL=$((FAIL + 1)); }

# ── 1. --start under a temp dir starts nothing ──
repo="$TMP_ROOT/copy"; make_repo "$repo"
out="$(cd "$repo" && bash .skilled/bin/git-live-follow.sh --start 2>&1)"; rc=$?
sleep 1
if [ "$rc" = 0 ] && [ -z "$out" ] && ! follower_running "$repo"; then
  pass "temp-dir checkout: --start is silent and starts no follower"
else
  fail "temp-dir checkout: rc=$rc out='$out' running=$(follower_running "$repo" && echo yes || echo no)"
fi

# ── 2. --start in a dispatched child session starts nothing ──
repo="$REAL_ROOT/child"; make_repo "$repo"
out="$(cd "$repo" && AI_SESSION_CHILD=1 bash .skilled/bin/git-live-follow.sh --start 2>&1)"; rc=$?
sleep 1
if [ "$rc" = 0 ] && [ -z "$out" ] && ! follower_running "$repo"; then
  pass "child session: --start is silent and starts no follower"
else
  fail "child session: rc=$rc out='$out' running=$(follower_running "$repo" && echo yes || echo no)"
fi

# ── 3. --start in a real checkout still announces and starts one follower ──
repo="$REAL_ROOT/real"; make_repo "$repo"
out="$(cd "$repo" && bash .skilled/bin/git-live-follow.sh --start 2>&1)"; rc=$?
if [ "$rc" = 0 ] && printf '%s' "$out" | grep -qF '[live-sync] live-sync active' \
  && wait_for 5 follower_running "$repo"; then
  pass "real checkout: --start announces and starts a follower"
else
  fail "real checkout: rc=$rc out='$out' running=$(follower_running "$repo" && echo yes || echo no)"
fi
pkill -f "$repo/.skilled/bin/git-live-follow.sh" 2>/dev/null || true

# ── 4. a running follower exits once its checkout is deleted ──
repo="$TMP_ROOT/deleted"; make_repo "$repo"
( cd "$repo" && exec bash "$repo/.skilled/bin/git-live-follow.sh" --live main --interval 1 >/dev/null 2>&1 ) &
pid=$!
# The lock file is written just before the poll loop. Deleting .git any earlier
# would only exercise the startup "not a git repository" exit, not the loop guard.
lock_written() { compgen -G "$repo/.git/live-follow/*.pid" >/dev/null; }
if wait_for 5 lock_written; then
  rm -rf "$repo/.git"
  if wait_for 5 bash -c "! kill -0 $pid 2>/dev/null"; then
    pass "deleted checkout: follower exits"
  else
    fail "deleted checkout: follower still running after .git was removed"
    kill "$pid" 2>/dev/null || true
  fi
else
  fail "deleted checkout: follower never started"
fi

echo
echo "git-live-follow: $PASS passed, $FAIL failed"
[ "$FAIL" = 0 ]
