#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: BOUNDED GIT TESTS
# ───────────────────────────────────────────────────────────────
# Hermetic tests for lib/bounded-git.sh and the hooks that call it. A stub `git` on PATH
# hangs on `diff`, which stands in for an index read stuck behind a wedged fsmonitor
# daemon, and the real hook files run against throwaway repositories. Each hook case is
# also wrapped in its own outer bound, so a hook that does not bound its git calls fails
# the case instead of hanging the suite.
set -uo pipefail

unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES
export GIT_CONFIG_GLOBAL=/dev/null

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
HOOK_DIR="$(cd "$SCRIPT_DIR/.." && pwd -P)"
LIB="$HOOK_DIR/lib/bounded-git.sh"
REAL_GIT="$(command -v git)"
# shellcheck source=../lib/bounded-git.sh
. "$LIB"

PASS=0; FAIL=0
expect() { # expect <desc> <cmd...>
  local desc="$1"; shift
  if "$@" >/dev/null 2>&1; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $desc"; fi
}

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# ── bounded_run ────────────────────────────────────────────────
START="$(date +%s)"
bounded_run 1 sleep 30; RC=$?
ELAPSED=$(( $(date +%s) - START ))
expect "bounded_run reports an expired bound as 142" test "$RC" -eq 142
expect "bounded_run returns when the bound expires" test "$ELAPSED" -lt 8

bounded_run 5 sh -c 'exit 3'; RC=$?
expect "bounded_run passes the command's own status through" test "$RC" -eq 3

bounded_run 5 true; RC=$?
expect "bounded_run passes success through" test "$RC" -eq 0

# The child is told to stop before it is killed, so git can remove an index lock.
TERMED="$TMP/termed"
bounded_run 1 sh -c "trap 'echo seen > \"$TERMED\"; exit 0' TERM; sleep 30 & wait"; RC=$?
expect "the bound sends SIGTERM first" test -s "$TERMED"
expect "a child that exits on SIGTERM still reports the expired bound" test "$RC" -eq 142

START="$(date +%s)"
bounded_run 1 sh -c 'trap "" TERM; sleep 30'; RC=$?
ELAPSED=$(( $(date +%s) - START ))
expect "a child that ignores SIGTERM is killed after the grace" test "$RC" -eq 142
expect "the grace period is bounded" test "$ELAPSED" -lt 10

# Without perl the command runs unbounded instead of failing.
EMPTY_PATH="$TMP/empty-path"
mkdir -p "$EMPTY_PATH"
( PATH="$EMPTY_PATH"; bounded_run 5 /usr/bin/true ); RC=$?
expect "bounded_run runs the command when perl is missing" test "$RC" -eq 0
( PATH="$EMPTY_PATH"; bounded_run 5 /usr/bin/false ); RC=$?
expect "bounded_run keeps the status when perl is missing" test "$RC" -eq 1

# ── git_bounded ────────────────────────────────────────────────
ARGV_LOG="$TMP/argv.log"
LOG_SHIM="$TMP/log-shim"
mkdir -p "$LOG_SHIM"
cat > "$LOG_SHIM/git" <<EOF
#!/bin/bash
echo "\$*" >> "$ARGV_LOG"
exec "$REAL_GIT" "\$@"
EOF
chmod +x "$LOG_SHIM/git"
: > "$ARGV_LOG"
( PATH="$LOG_SHIM:$PATH"; git_bounded --version >/dev/null )
expect "git_bounded turns fsmonitor off ahead of the caller's arguments" \
  grep -Fxq -- "-c core.fsmonitor=false --version" "$ARGV_LOG"

expect "the bound defaults to 20 seconds" \
  test "$(env -u GIT_BOUND_SECONDS -u SPECKIT_GIT_TIMEOUT bash -c ". '$LIB'; _git_bound_seconds")" = "20"
expect "SPECKIT_GIT_TIMEOUT sets the bound" \
  test "$(env -u GIT_BOUND_SECONDS SPECKIT_GIT_TIMEOUT=7 bash -c ". '$LIB'; _git_bound_seconds")" = "7"
expect "GIT_BOUND_SECONDS wins over SPECKIT_GIT_TIMEOUT" \
  test "$(GIT_BOUND_SECONDS=3 SPECKIT_GIT_TIMEOUT=7 bash -c ". '$LIB'; _git_bound_seconds")" = "3"
expect "a non-numeric bound falls back to the default" \
  test "$(GIT_BOUND_SECONDS=abc bash -c ". '$LIB'; _git_bound_seconds")" = "20"
expect "a zero bound falls back to the default" \
  test "$(GIT_BOUND_SECONDS=0 bash -c ". '$LIB'; _git_bound_seconds")" = "20"

# A git that hangs on `diff` stands in for an index read stuck behind a wedged daemon.
HANG_SHIM="$TMP/hang-shim"
mkdir -p "$HANG_SHIM"
cat > "$HANG_SHIM/git" <<EOF
#!/bin/bash
for arg in "\$@"; do
  case "\$arg" in diff) exec sleep 30 ;; esac
done
exec "$REAL_GIT" "\$@"
EOF
chmod +x "$HANG_SHIM/git"

HANG_ERR="$TMP/hang.err"
START="$(date +%s)"
( PATH="$HANG_SHIM:$PATH"; GIT_BOUND_SECONDS=1; git_bound_arm
  git_bounded -C "$TMP" diff --cached >/dev/null 2>"$HANG_ERR"; RC=$?
  [ -e "$GIT_BOUND_DIR/timeout" ] && echo marked > "$TMP/marked"
  echo "$RC" > "$TMP/hang.rc"
  git_bound_finish 0 2>>"$HANG_ERR" ); FINISH_RC=$?
ELAPSED=$(( $(date +%s) - START ))
expect "a hung git call returns 142" test "$(cat "$TMP/hang.rc")" = "142"
expect "a hung git call is bounded" test "$ELAPSED" -lt 10
expect "the timeout message names the subcommand, not an option value" \
  grep -Fq "git-timeout: git diff did not finish within 1s" "$HANG_ERR"
expect "the timeout message names the override" grep -Fq "SPECKIT_GIT_TIMEOUT" "$HANG_ERR"
expect "a timeout is recorded for the exit trap" test -s "$TMP/marked"
expect "git_bound_finish refuses after a timeout, whatever the hook's own status" \
  test "$FINISH_RC" -eq 1
expect "git_bound_finish names the refusal" grep -Fq "BLOCKED [gate:git-timeout]" "$HANG_ERR"

( git_bound_arm; git_bound_finish 7 ); RC=$?
expect "git_bound_finish keeps the hook's own status when nothing timed out" test "$RC" -eq 7
( git_bound_finish 0 ); RC=$?
expect "git_bound_finish without arming keeps the hook's status" test "$RC" -eq 0

( PATH="$HANG_SHIM:$PATH"; GIT_BOUND_SECONDS=1; git_bounded diff >/dev/null 2>&1 ); RC=$?
expect "an unarmed timeout still returns 142" test "$RC" -eq 142

# A timeout inside a subshell still reaches the exit trap, because the record is a file.
SUB_OUT="$( PATH="$HANG_SHIM:$PATH"; GIT_BOUND_SECONDS=1; git_bound_arm
  _x="$(git_bounded diff 2>/dev/null)" || true
  [ -e "$GIT_BOUND_DIR/timeout" ] && echo recorded; rm -rf "$GIT_BOUND_DIR" )"
expect "a timeout inside a command substitution is recorded" test "$SUB_OUT" = "recorded"

# ── the mass-deletion guard counts through the bound ───────────
MDG="$HOOK_DIR/lib/mass-deletion-guard.sh"
MDG_OUT="$( PATH="$HANG_SHIM:$PATH"; export GIT_BOUND_SECONDS=1; git_bound_arm
  # shellcheck source=../lib/mass-deletion-guard.sh
  . "$MDG"
  n="$(mass_deletion_staged_count)"
  [ -e "$GIT_BOUND_DIR/timeout" ] && echo "count=$n recorded"; rm -rf "$GIT_BOUND_DIR" )"
expect "a hung mass-deletion count is recorded as a timeout" test "$MDG_OUT" = "count=0 recorded"

# ── pre-commit refuses when a git call hangs ───────────────────
make_repo() { # make_repo <dir>
  mkdir -p "$1"
  "$REAL_GIT" -C "$1" init -q
  "$REAL_GIT" -C "$1" config core.hooksPath /dev/null
  "$REAL_GIT" -C "$1" config user.email t@t.t
  "$REAL_GIT" -C "$1" config user.name t
  "$REAL_GIT" -C "$1" commit -q --allow-empty -m init
}

PC_REPO="$TMP/pc"
make_repo "$PC_REPO"
PC_ERR="$TMP/pc.err"
START="$(date +%s)"
( cd "$PC_REPO" && PATH="$HANG_SHIM:$PATH" SPECKIT_GIT_TIMEOUT=1 \
    bounded_run 30 bash "$HOOK_DIR/pre-commit" >/dev/null 2>"$PC_ERR" ); RC=$?
ELAPSED=$(( $(date +%s) - START ))
expect "pre-commit exits 1 when a git call hangs" test "$RC" -eq 1
expect "pre-commit does not hang on a stuck git call" test "$ELAPSED" -lt 20
expect "pre-commit names the timeout" grep -Fq "BLOCKED [gate:git-timeout]" "$PC_ERR"

( cd "$PC_REPO" && PATH="$LOG_SHIM:$PATH" bounded_run 30 bash "$HOOK_DIR/pre-commit" >/dev/null 2>&1 ); RC=$?
expect "pre-commit still passes when git answers" test "$RC" -eq 0

# ── pre-push refuses when the deletion count hangs ────────────
PP_REPO="$TMP/pp"
make_repo "$PP_REPO"
"$REAL_GIT" -C "$PP_REPO" config skilled.trustRepoHooks true
mkdir -p "$PP_REPO/.opencode/scripts/git-hooks/lib"
cp "$MDG" "$PP_REPO/.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh"
PP_REMOTE="$("$REAL_GIT" -C "$PP_REPO" rev-parse HEAD)"
"$REAL_GIT" -C "$PP_REPO" commit -q --allow-empty -m second
PP_LOCAL="$("$REAL_GIT" -C "$PP_REPO" rev-parse HEAD)"
PP_LINE="refs/heads/feature $PP_LOCAL refs/heads/feature $PP_REMOTE"
PP_ERR="$TMP/pp.err"
START="$(date +%s)"
( cd "$PP_REPO" && printf '%s\n' "$PP_LINE" | PATH="$HANG_SHIM:$PATH" SPECKIT_GIT_TIMEOUT=1 \
    bounded_run 30 bash "$HOOK_DIR/pre-push" origin url >/dev/null 2>"$PP_ERR" ); RC=$?
ELAPSED=$(( $(date +%s) - START ))
expect "pre-push exits 1 when a git call hangs" test "$RC" -eq 1
expect "pre-push does not hang on a stuck git call" test "$ELAPSED" -lt 20
expect "pre-push names the timeout" grep -Fq "BLOCKED [gate:git-timeout]" "$PP_ERR"

( cd "$PP_REPO" && printf '%s\n' "$PP_LINE" | PATH="$LOG_SHIM:$PATH" \
    bounded_run 30 bash "$HOOK_DIR/pre-push" origin url >/dev/null 2>&1 ); RC=$?
expect "pre-push still passes when git answers" test "$RC" -eq 0

echo "bounded-git tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
