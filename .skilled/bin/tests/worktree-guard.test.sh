#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Worktree Guard Test
# ───────────────────────────────────────────────────────────────
# Hermetic test for the numbered-worktree sweep that worktree-guard.sh starts at session
# start. A stub stands in for worktree-reaper.sh and records each start, so the test sees
# how often the guard spawns it without touching a real worktree. It checks that the hook
# returns before the sweep finishes, that a second start inside the six-hour window spawns
# nothing, that the window is shared by every worktree of one repository, and that each
# disable switch stops the sweep.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
GUARD="$SCRIPT_DIR/worktree-guard.sh"

PASS=0; FAIL=0
expect() { # expect <desc> <cmd...>  -- PASS when cmd succeeds
  local desc="$1"; shift
  if "$@" >/dev/null 2>&1; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $desc"; fi
}

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
export HOME="$TMP/home"
mkdir -p "$HOME"

# Switches from the operator's own shell must not decide the outcome.
unset SPECKIT_WORKTREE_GUARD SPECKIT_WORKTREE_AUTOREAP SYSTEM_HOOKS_DISABLED MK_HOOKS_DISABLED \
  SYSTEM_WORKTREE_GUARD_DISABLED AI_SESSION_CHILD HOOK_FLAGS_CONFIG

REPO="$TMP/repo"
git init -q "$REPO"
git -C "$REPO" config user.email t@t.t
git -C "$REPO" config user.name t
git -C "$REPO" commit -q --allow-empty -m init
git -C "$REPO" worktree add -q -b worktrees/001-linked "$TMP/linked" HEAD
COMMON="$(cd "$REPO/.git" && pwd -P)"
STAMP="$COMMON/worktree-reaper-numbered.stamp"

LOG="$TMP/sweeps.log"
STUB="$TMP/stub-reaper.sh"
cat > "$STUB" <<STUBEOF
#!/bin/sh
printf '%s\n' "\$*" >> "$LOG"
sleep 4
STUBEOF
chmod +x "$STUB"
: > "$LOG"

start_guard() { # start_guard <dir> [env assignments...]  -- one session start from <dir>
  local dir="$1"; shift
  ( cd "$dir" && env SPECKIT_WORKTREE_REAPER="$STUB" "$@" bash "$GUARD" ) >/dev/null 2>&1
}
sweeps() { wc -l < "$LOG" | tr -d ' '; }
wait_sweeps() { # wait_sweeps <n>  -- the detached sweep records itself a moment after the hook returns
  local want="$1" i=0
  while [ "$i" -lt 50 ]; do
    [ "$(sweeps)" -ge "$want" ] && return 0
    sleep 0.2
    i=$((i+1))
  done
  return 1
}
age_stamp() { touch -t 202001010000 "$STAMP"; }

# ── the first start spawns one sweep and returns at once ────────
T0="$(date +%s)"
start_guard "$REPO"
ELAPSED=$(( $(date +%s) - T0 ))
expect "the hook returns before the 4 second sweep ends" test "$ELAPSED" -lt 3
expect "the first start spawns a sweep" wait_sweeps 1
expect "the sweep is the numbered lane" grep -Fx -- "--numbered" "$LOG"
expect "the stamp is written in the shared git directory" test -f "$STAMP"

# ── a second start inside the window spawns nothing ─────────────
start_guard "$REPO"
sleep 1
expect "a second start inside the window spawns nothing" test "$(sweeps)" -eq 1

# ── the window is shared by every worktree of the repository ────
start_guard "$TMP/linked"
sleep 1
expect "a start from a linked worktree shares the window" test "$(sweeps)" -eq 1

# ── an expired stamp spawns again, from a linked worktree too ───
age_stamp
start_guard "$TMP/linked"
expect "an expired stamp spawns a sweep" wait_sweeps 2
start_guard "$REPO"
sleep 1
expect "the sweep from the linked worktree renewed the stamp" test "$(sweeps)" -eq 2

# ── each switch stops the sweep ─────────────────────────────────
age_stamp
start_guard "$REPO" SPECKIT_WORKTREE_AUTOREAP=0
sleep 1
expect "SPECKIT_WORKTREE_AUTOREAP=0 spawns nothing" test "$(sweeps)" -eq 2
start_guard "$REPO" SPECKIT_WORKTREE_GUARD=off
sleep 1
expect "SPECKIT_WORKTREE_GUARD=off spawns nothing" test "$(sweeps)" -eq 2
start_guard "$REPO" AI_SESSION_CHILD=1
sleep 1
expect "an orchestrated child spawns nothing" test "$(sweeps)" -eq 2
start_guard "$REPO" SYSTEM_WORKTREE_GUARD_DISABLED=1
sleep 1
expect "the shared hook kill-switch spawns nothing" test "$(sweeps)" -eq 2
expect "a disabled start leaves the stamp expired" test "$(find "$STAMP" -mmin +60 | wc -l | tr -d ' ')" -eq 1

# ── outside a repository the hook does nothing and exits 0 ──────
mkdir -p "$TMP/plain"
expect "outside a repository the hook exits 0" start_guard "$TMP/plain"
sleep 1
expect "outside a repository nothing is spawned" test "$(sweeps)" -eq 2

# ── a missing reaper spawns nothing and does not fail the hook ──
age_stamp
expect "a missing reaper does not fail the hook" start_guard "$REPO" SPECKIT_WORKTREE_REAPER="$TMP/absent.sh"
sleep 1
expect "a missing reaper spawns nothing" test "$(sweeps)" -eq 2

echo "worktree-guard tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
