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
# home directory.
set -uo pipefail

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
cleanup() {
  git -C "$FIXTURE" worktree prune >/dev/null 2>&1 || true
  rm -rf "$FIXTURE" "$FAKE_HOME"
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

# ── (d) HUMAN numbered → expect kept (report-only) ──────────────
git -C "$FIXTURE" worktree add -q -b sk-git/0001-human "$FIXTURE/.worktrees/0001-sk-git-human" HEAD

# ── (e) DETACHED → expect kept (report-only) ────────────────────
git -C "$FIXTURE" worktree add -q --detach "$FIXTURE/.worktrees/0002-detached" HEAD

# ── run the REAL reaper (not dry-run) inside the fixture ────────
REAPER_OUT="$FIXTURE/.reaper.out"
( cd "$FIXTURE" && bash "$REAPER" ) >"$REAPER_OUT" 2>&1
REAPER_RC=$?

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

# (d) kept: human numbered worktree is report-only, never auto-reaped
expect "(d) human numbered: dir kept"    test -d "$FIXTURE/.worktrees/0001-sk-git-human"
expect "(d) human numbered: branch kept" git -C "$FIXTURE" show-ref --verify --quiet refs/heads/sk-git/0001-human

# (e) kept: detached worktree is report-only, never auto-reaped
expect "(e) detached: dir kept" test -d "$FIXTURE/.worktrees/0002-detached"

if [ "$FAIL" -ne 0 ]; then
  echo "--- reaper output (rc=$REAPER_RC) ---"
  cat "$REAPER_OUT"
  echo "--------------------------------------"
fi

echo "worktree-reaper tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
