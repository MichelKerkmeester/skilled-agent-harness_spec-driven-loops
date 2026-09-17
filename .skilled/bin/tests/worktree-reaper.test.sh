#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree Reaper Test
# ───────────────────────────────────────────────────────────────
# Hermetic test for worktree-reaper.sh's reap/keep classification. Builds a
# throwaway fixture repo with one worktree of every shape the reaper must
# tell apart (wrapper+dead marker, wrapper+live marker, wrapper+no marker,
# human numbered, detached), runs the REAL reaper against it, then asserts
# the on-disk + ref-level outcome for each. HOME is redirected to a scratch
# dir before the reaper ever runs, since the reaper reads/writes
# $HOME/.spk-wt-sock and must never be allowed to see the operator's real
# home directory. The reaper signals no process, and one assertion holds it
# to that so a kill path cannot return unnoticed.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
REAPER="$SCRIPT_DIR/worktree-reaper.sh"

PASS=0; FAIL=0
expect() { # expect <desc> <cmd...>      -- PASS when cmd succeeds (rc 0)
  local desc="$1"; shift
  if "$@" >/dev/null 2>&1; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $desc"; fi
}
expect_not() { # expect_not <desc> <cmd...>  -- PASS when cmd FAILS (rc != 0)
  local desc="$1"; shift
  if "$@" >/dev/null 2>&1; then FAIL=$((FAIL+1)); echo "FAIL: $desc"; else PASS=$((PASS+1)); fi
}

# ── isolated fixture repo + isolated HOME ──────────────────────
FAKE_HOME="$(mktemp -d)"
FIXTURE="$(mktemp -d)"
CUSTOM_BASE="$(mktemp -d)"
cleanup() {
  git -C "$FIXTURE" worktree prune >/dev/null 2>&1 || true
  rm -rf "$FIXTURE" "$FAKE_HOME" "$CUSTOM_BASE"
}
trap cleanup EXIT

# Redirect HOME *before* the reaper ever runs — the reaper's socket-dir sweep
# reads/writes "$HOME/.spk-wt-sock" and must never touch the real home dir.
export HOME="$FAKE_HOME"

git -C "$FIXTURE" init -q
# Hermetic fixture: override any global core.hooksPath so the shared commit-msg /
# pre-commit gates never run against throwaway test commits.
mkdir -p "$FIXTURE/.nohooks"
git -C "$FIXTURE" config core.hooksPath "$FIXTURE/.nohooks"
git -C "$FIXTURE" config user.email t@t.t
git -C "$FIXTURE" config user.name t
git -C "$FIXTURE" commit -q --allow-empty -m init

# Absolute common git dir, normalized the same way worktree-reaper.sh does.
abs_common_dir() {
  local common
  common="$(git -C "$FIXTURE" rev-parse --git-common-dir 2>/dev/null)"
  case "$common" in
    /*) printf '%s\n' "$common" ;;
    *)  ( cd "$FIXTURE/$common" && pwd -P ) ;;
  esac
}

COMMON_ABS="$(abs_common_dir)"
MARKERS_DIR="$COMMON_ABS/worktree-sessions"
mkdir -p "$MARKERS_DIR"

# ── (a) WRAPPER + DEAD marker → expect reaped ──────────────────
git -C "$FIXTURE" worktree add -q -b work/rt/a "$FIXTURE/.worktrees/rt-a" HEAD
( exit 0 ) &
DEAD_PID=$!
wait "$DEAD_PID" 2>/dev/null || true
printf '%s\n' "$DEAD_PID" > "$MARKERS_DIR/rt-a.pid"

# ── (b) WRAPPER + LIVE marker → expect kept ────────────────────
git -C "$FIXTURE" worktree add -q -b work/rt/b "$FIXTURE/.worktrees/rt-b" HEAD
printf '%s\n' "$$" > "$MARKERS_DIR/rt-b.pid"

# ── (c) WRAPPER + NO marker → expect kept ───────────────────────
git -C "$FIXTURE" worktree add -q -b work/rt/c "$FIXTURE/.worktrees/rt-c" HEAD

# ── wrapper + malformed marker → expect kept ────────────────────
git -C "$FIXTURE" worktree add -q -b work/rt/bad-marker "$FIXTURE/.worktrees/rt-bad-marker" HEAD
printf '%s' 'garbage99999999' > "$MARKERS_DIR/rt-bad-marker.pid"

# ── invalid wrapper branch grammar → expect kept ─────────────────
git -C "$FIXTURE" worktree add -q -b work/human "$FIXTURE/.worktrees/rt-human" HEAD
( exit 0 ) &
INVALID_BRANCH_DEAD_PID=$!
wait "$INVALID_BRANCH_DEAD_PID" 2>/dev/null || true
printf '%s\n' "$INVALID_BRANCH_DEAD_PID" > "$MARKERS_DIR/rt-human.pid"

# ── (d) HUMAN numbered → expect kept (report-only) ──────────────
git -C "$FIXTURE" worktree add -q -b sk-git/0001-human "$FIXTURE/.worktrees/0001-sk-git-human" HEAD

# ── (e) DETACHED → expect kept (report-only) ────────────────────
git -C "$FIXTURE" worktree add -q --detach "$FIXTURE/.worktrees/0002-detached" HEAD

# ── (f) WRAPPER under a CUSTOM base, DIRTY tree, dead marker ────
# The launcher may pick the base from its environment; a reaper that does not inherit that
# environment must still find the worktree through git's registry, and must not prune the
# live session's socket dir or marker.
git -C "$FIXTURE" worktree add -q -b work/rt/custom-a "$CUSTOM_BASE/rt-custom-a" HEAD
printf 'uncommitted\n' > "$CUSTOM_BASE/rt-custom-a/.dirty"
( exit 0 ) &
CUSTOM_A_DEAD_PID=$!
wait "$CUSTOM_A_DEAD_PID" 2>/dev/null || true
printf '%s\n' "$CUSTOM_A_DEAD_PID" > "$MARKERS_DIR/rt-custom-a.pid"
mkdir -p "$FAKE_HOME/.spk-wt-sock/rt-custom-a"

# ── (g) WRAPPER under a CUSTOM base, CLEAN+MERGED, LIVE marker ──
# Same mis-resolution, but the wrapper pid is alive: a live marker must survive even when
# the reaper's own base probe cannot see the worktree.
git -C "$FIXTURE" worktree add -q -b work/rt/custom-c "$CUSTOM_BASE/rt-custom-c" HEAD
printf '%s\n' "$$" > "$MARKERS_DIR/rt-custom-c.pid"
mkdir -p "$FAKE_HOME/.spk-wt-sock/rt-custom-c"

# ── (h) WRAPPER, dead marker, but a live child runs inside ─────
# The marker only proves the wrapper's own pid; a background child outlives it. Removing
# the worktree would tear the ground out from under that child.
git -C "$FIXTURE" worktree add -q -b work/rt/child "$FIXTURE/.worktrees/rt-child" HEAD
( exit 0 ) &
CHILD_MARKER_DEAD_PID=$!
wait "$CHILD_MARKER_DEAD_PID" 2>/dev/null || true
printf '%s\n' "$CHILD_MARKER_DEAD_PID" > "$MARKERS_DIR/rt-child.pid"
mkdir -p "$FAKE_HOME/.spk-wt-sock/rt-child"
( cd "$FIXTURE/.worktrees/rt-child" && exec sleep 120 ) &
BUSY_PID=$!
sleep 0.5

# ── run the REAL reaper (not dry-run) inside the fixture ────────
REAPER_OUT="$FIXTURE/.reaper.out"
if ( cd "$FIXTURE" && bash "$REAPER" ) >"$REAPER_OUT" 2>&1; then
  REAPER_RC=0
else
  REAPER_RC=$?
fi

# ── assertions ───────────────────────────────────────────────────
# (a) reaped: worktree dir gone AND branch deleted
expect_not "(a) wrapper+dead: dir removed"    test -d "$FIXTURE/.worktrees/rt-a"
expect_not "(a) wrapper+dead: branch removed" git -C "$FIXTURE" show-ref --verify --quiet refs/heads/work/rt/a

# (b) kept: dir present AND branch present (live marker)
expect "(b) wrapper+live: dir kept"    test -d "$FIXTURE/.worktrees/rt-b"
expect "(b) wrapper+live: branch kept" git -C "$FIXTURE" show-ref --verify --quiet refs/heads/work/rt/b

# (c) kept: dir present AND branch present (no marker => liveness unproven)
expect "(c) wrapper+no-marker: dir kept"    test -d "$FIXTURE/.worktrees/rt-c"
expect "(c) wrapper+no-marker: branch kept" git -C "$FIXTURE" show-ref --verify --quiet refs/heads/work/rt/c

# malformed marker content is not proof of an inactive wrapper
expect "wrapper+malformed-marker: dir kept"    test -d "$FIXTURE/.worktrees/rt-bad-marker"
expect "wrapper+malformed-marker: branch kept" git -C "$FIXTURE" show-ref --verify --quiet refs/heads/work/rt/bad-marker

# a work ref without the exact wrapper grammar is report-only
expect "invalid wrapper branch: dir kept"    test -d "$FIXTURE/.worktrees/rt-human"
expect "invalid wrapper branch: branch kept" git -C "$FIXTURE" show-ref --verify --quiet refs/heads/work/human

# (d) kept: human numbered worktree is report-only, never auto-reaped
expect "(d) human numbered: dir kept"    test -d "$FIXTURE/.worktrees/0001-sk-git-human"
expect "(d) human numbered: branch kept" git -C "$FIXTURE" show-ref --verify --quiet refs/heads/sk-git/0001-human

# (e) kept: detached worktree is report-only, never auto-reaped
expect "(e) detached: dir kept" test -d "$FIXTURE/.worktrees/0002-detached"

# The reaper prunes worktrees and their leftover state; it never signals a process.
expect_not "reaper signals no process" grep -Fq 'kill -TERM' "$REAPER_OUT"

# (f) custom-base dirty wrapper: git's registry, not the base guess, protects live state
expect "(f) custom-base dirty: worktree kept"   test -d "$CUSTOM_BASE/rt-custom-a"
expect "(f) custom-base dirty: socket dir kept" test -d "$FAKE_HOME/.spk-wt-sock/rt-custom-a"
expect "(f) custom-base dirty: marker kept"     test -f "$MARKERS_DIR/rt-custom-a.pid"

# (g) custom-base merged wrapper with a LIVE marker: kept, with socket dir and marker
expect "(g) custom-base live-marker: worktree kept"   test -d "$CUSTOM_BASE/rt-custom-c"
expect "(g) custom-base live-marker: socket dir kept" test -d "$FAKE_HOME/.spk-wt-sock/rt-custom-c"
expect "(g) custom-base live-marker: marker kept"     test -f "$MARKERS_DIR/rt-custom-c.pid"

# (h) live child inside: the worktree is kept and the holding pid is named
expect "(h) live child: worktree kept" test -d "$FIXTURE/.worktrees/rt-child"
expect "(h) live child: branch kept"   git -C "$FIXTURE" show-ref --verify --quiet refs/heads/work/rt/child
expect "(h) live child: reaper names the holding pid" grep -F "pid $BUSY_PID" "$REAPER_OUT"
expect "(h) live child: reaper reports a live process inside" grep -F "live process inside" "$REAPER_OUT"
kill "$BUSY_PID" 2>/dev/null || true
wait "$BUSY_PID" 2>/dev/null || true

if [ "$FAIL" -ne 0 ]; then
  echo "--- reaper output (rc=$REAPER_RC) ---"
  cat "$REAPER_OUT"
  echo "--------------------------------------"
fi

echo "worktree-reaper tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
