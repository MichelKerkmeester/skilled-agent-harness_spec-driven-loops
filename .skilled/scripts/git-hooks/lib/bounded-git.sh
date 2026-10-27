#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Bounded Git For Shell
# ───────────────────────────────────────────────────────────────
# Runs a git call that reads the index or the working tree under a wall-clock bound,
# with fsmonitor off, so a wedged fsmonitor daemon or a stuck index lock costs one
# timeout instead of an open-ended hang. Source it; it defines functions only.
#
#   bounded_run <seconds> <command...>   run any command under the bound; status 142
#                                        means the bound expired
#   git_bounded <git args...>            git -c core.fsmonitor=false <args>, bounded by
#                                        GIT_BOUND_SECONDS (default 20, or
#                                        SPECKIT_GIT_TIMEOUT); on expiry it prints one
#                                        line, records the timeout and returns 142
#   git_bound_arm                        for a hook: create the timeout record; call it
#                                        once, before the first git_bounded
#   git_bound_finish <status>            for a hook's EXIT trap: exits 1 when any
#                                        git_bounded call timed out, else with <status>
#
# A timeout fails closed for a gate because the record is read at exit. A call inside
# $(...) or <(...) runs in a subshell, where an exit or a variable write would be lost;
# the record is a file, so it survives. Without git_bound_arm a timeout still returns 142.
#
# The child gets SIGTERM first and SIGKILL after a three second grace, so a git that is
# writing the index removes its lock file instead of leaving one behind.

# Run one command under a wall-clock bound. The child is a separate process, so the
# alarm ends the command itself and a command that traps SIGALRM cannot turn a timeout
# into a normal exit. Status 142 means the bound expired. Without perl on PATH the
# command runs unbounded, as it did before the helper existed: a gate must not break
# on a host that lacks the interpreter that enforces its bound.
bounded_run() {
  local seconds="$1"
  shift
  if ! command -v perl >/dev/null 2>&1; then
    "$@"
    return
  fi
  perl -e 'my $s = shift; my $pid = fork; defined $pid or exit 126;
    if (!$pid) { exec @ARGV or exit 127 }
    $SIG{ALRM} = sub {
      kill "TERM", $pid;
      my $end = time + 3; my $r = 0;
      while (time < $end) { $r = waitpid($pid, 1); last if $r != 0; select(undef, undef, undef, 0.1) }
      if ($r == 0) { kill "KILL", $pid; waitpid $pid, 0 }
      exit 142;
    };
    alarm $s; waitpid $pid, 0; alarm 0;
    exit(($? & 127) ? 128 + ($? & 127) : $? >> 8);' "$seconds" "$@"
}

# The bound in seconds. A non-numeric or zero setting falls back to the default.
_git_bound_seconds() {
  local seconds="${GIT_BOUND_SECONDS:-${SPECKIT_GIT_TIMEOUT:-20}}"
  case "$seconds" in
    ''|*[!0-9]*|0) seconds=20 ;;
  esac
  printf '%s\n' "$seconds"
}

git_bounded() {
  local rc=0 seconds sub="" arg skip=0
  seconds="$(_git_bound_seconds)"
  bounded_run "$seconds" git -c core.fsmonitor=false "$@" || rc=$?
  if [ "$rc" -eq 142 ]; then
    # The subcommand is the first word that is not a global option or its value.
    for arg in "$@"; do
      if [ "$skip" -eq 1 ]; then skip=0; continue; fi
      case "$arg" in
        -C|-c) skip=1 ;;
        -*) ;;
        *) sub="$arg"; break ;;
      esac
    done
    echo "git-timeout: git ${sub:-call} did not finish within ${seconds}s and was stopped (raise the bound with SPECKIT_GIT_TIMEOUT=<seconds>)" >&2
    if [ -n "${GIT_BOUND_DIR:-}" ] && [ -d "$GIT_BOUND_DIR" ]; then
      : > "$GIT_BOUND_DIR/timeout" 2>/dev/null || true
    fi
  fi
  return "$rc"
}

git_bound_arm() {
  GIT_BOUND_DIR="$(mktemp -d "${TMPDIR:-/tmp}/git-bound.XXXXXX" 2>/dev/null)" || GIT_BOUND_DIR=""
  export GIT_BOUND_DIR
}

# Call as the last step of an EXIT trap, with the status the hook was exiting with.
git_bound_finish() {
  local status="$1"
  if [ -n "${GIT_BOUND_DIR:-}" ] && [ -d "$GIT_BOUND_DIR" ]; then
    if [ -e "$GIT_BOUND_DIR/timeout" ]; then
      rm -rf "$GIT_BOUND_DIR"
      echo "BLOCKED [gate:git-timeout]: a git call did not finish in time, so this hook refuses rather than pass on a missing answer. The line above names the call." >&2
      exit 1
    fi
    rm -rf "$GIT_BOUND_DIR"
  fi
  exit "$status"
}
