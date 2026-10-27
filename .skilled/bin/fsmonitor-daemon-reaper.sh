#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: fsmonitor Daemon Reaper
# ───────────────────────────────────────────────────────────────
# Report the fsmonitor daemons that belong to one repository and the worktree
# each one watches. The watched root is the daemon's lowest-numbered DIR
# descriptor (the cwd row is not it), which is the working-tree root git handed
# to the daemon; a worktree daemon also holds its administrative directory.
#
# Without --apply every flag is parsed and validated, the plan is printed, and
# no process is signalled. With --apply the strays are ended and --worktree
# ends the one daemon watching the named worktree, escalating from git's stop
# command to SIGTERM to SIGKILL and rechecking the command line and the start
# time before each step, so a pid recycled during the run is never signalled.
# Git's stop ends whichever daemon owns a worktree's socket, so it is used only
# when no other daemon watches that worktree; otherwise the exact pid is
# signalled. A worktree that still has a live process inside it is never
# touched, unless its daemon is wedged.
#
# --idle-hours N selects kept daemons started more than N hours ago whose
# worktree no live process is using; with --apply they are ended beside the
# strays. The main checkout's daemon is never idle.
#
# --probe asks every attributed main or kept daemon to answer one diff-files
# read with fsmonitor enabled. Only the probe alarm firing marks the daemon
# wedged; probing alone signals nothing, and --probe --apply ends the wedged.
#
# --orphans classes a daemon whose watched root no longer exists on disk at all
# (a repository deleted with rm -rf) as an orphan; with --apply it is ended by
# signal, since git cannot reach a directory that is gone. A daemon whose root
# still exists is never an orphan.
#
# A stray is confirmed against a fresh worktree list before it is ended, so a
# worktree added while the run was in flight keeps its new daemon.
#
# Exit codes: 0 = done, including a refusal, which prints a `refused` line;
# 1 = the repository could not be read, or a daemon survived every step;
# 2 = bad invocation or a --worktree that is not a registered worktree.

set -euo pipefail

TAB="$(printf '\t')"

# ───────────────────────────────────────────────────────────────
# 1. ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────

usage() {
  cat <<'EOF'
Usage: fsmonitor-daemon-reaper.sh [options]

Report the fsmonitor daemons of one repository and, with --apply, end them.

  --apply            End the selected daemons instead of only reporting
  --worktree <path>  Restrict the run to one registered worktree; with --apply
                     end that worktree's daemon
  --probe            Probe main and keep daemons for a wedged index read; with
                     --apply end the daemons that do not answer
  --idle-hours <n>   Select kept daemons started more than n hours ago with no
                     live process inside their worktree; with --apply end them,
                     and with --worktree consider that worktree only
  --orphans          Report daemons whose watched root no longer exists on disk;
                     with --apply end them. Cannot be combined with --worktree
  --repo <path>      Repository to inspect (default: the current toplevel)
  --help             Show this help
EOF
}

log() { echo "[fsmonitor-daemon-reaper] $*" >&2; }

WORKTREE=""
IDLE_HOURS=""
REPO=""
APPLY=0
PROBE=0
ORPHANS=0

while [ "$#" -gt 0 ]; do
  case "$1" in
    --apply) APPLY=1 ;;
    --probe) PROBE=1 ;;
    --orphans) ORPHANS=1 ;;
    --worktree)
      if [ "$#" -lt 2 ]; then usage >&2; exit 2; fi
      WORKTREE="$2"
      shift
      ;;
    --idle-hours)
      if [ "$#" -lt 2 ]; then usage >&2; exit 2; fi
      IDLE_HOURS="$2"
      shift
      ;;
    --repo)
      if [ "$#" -lt 2 ]; then usage >&2; exit 2; fi
      REPO="$2"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      log "unknown flag: $1"
      usage >&2
      exit 2
      ;;
  esac
  shift
done

if [ "$ORPHANS" = "1" ] && [ -n "$WORKTREE" ]; then
  log "--orphans cannot be combined with --worktree"
  usage >&2
  exit 2
fi

# ───────────────────────────────────────────────────────────────
# 2. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

_require_positive_int() {
  local name="$1" value="$2"
  case "$value" in
    ''|*[!0-9]*)
      log "$name must be a positive integer (got: $value)"
      exit 2
      ;;
  esac
  if [ "$value" -lt 1 ]; then
    log "$name must be a positive integer (got: $value)"
    exit 2
  fi
}

# Run one command under a wall-clock bound. The child is a separate process, so
# the alarm ends the command itself and a command that traps SIGALRM cannot
# turn a timeout into a normal exit. Status 142 means the bound expired.
run_bounded() {
  local seconds="$1"
  shift
  perl -e 'my $s = shift; my $pid = fork; defined $pid or exit 126;
    if (!$pid) { exec @ARGV or exit 127 }
    $SIG{ALRM} = sub { kill "KILL", $pid; waitpid $pid, 0; exit 142 };
    alarm $s; waitpid $pid, 0; alarm 0;
    exit(($? & 127) ? 128 + ($? & 127) : $? >> 8);' "$seconds" "$@"
}

git_bounded() {
  local repo="$1"
  shift
  run_bounded "$FSMON_PROBE_TIMEOUT" git -c core.fsmonitor=false -C "$repo" "$@"
}

_real_path() {
  local path="$1"
  (cd "$path" 2>/dev/null && pwd -P) || printf '%s\n' "$path"
}

_under() {
  case "$1" in
    "$2"/*) return 0 ;;
  esac
  return 1
}

# True when the path is the root itself or lies below it on a `/` boundary.
_inside() {
  [ "$1" = "$2" ] || _under "$1" "$2"
}

_main_worktree() {
  local line
  while IFS= read -r line; do
    case "$line" in
      worktree\ *) printf '%s\n' "${line#worktree }"; return 0 ;;
    esac
  done <<< "$REGISTERED"
  return 1
}

_registered_path() {
  local probe="$1" line path canonical
  while IFS= read -r line; do
    case "$line" in
      worktree\ *) ;;
      *) continue ;;
    esac
    path="${line#worktree }"
    canonical="$(_real_path "$path")"
    if [ "$canonical" = "$probe" ]; then
      printf '%s\n' "$canonical"
      return 0
    fi
  done <<< "$REGISTERED"
  return 1
}

_daemon_rows() {
  LC_ALL=C ps -axo pid=,lstart=,command= 2>/dev/null | LC_ALL=C awk '
    {
      pid = $1
      started = $2 " " $3 " " $4 " " $5 " " $6
      command = $7
      for (i = 8; i <= NF; i++) command = command " " $i
      if (command ~ /^([^ ]*\/)?git fsmonitor--daemon run( |$)/)
        printf "%s\t%s\n", pid, started
    }'
}

# Emit the DIR descriptors of one process as fd<TAB>path, cwd excluded. Field
# mode keeps a name with repeated spaces intact; space-split output would join
# them. A deleted directory keeps its lsof suffix; the caller strips and
# records it.
_lsof_dir_rows() {
  run_bounded "$FSMON_PROBE_TIMEOUT" lsof -nP -p "$1" -Fftn 2>/dev/null | LC_ALL=C awk '
    /^f/ { fd = substr($0, 2); type = ""; next }
    /^t/ { type = substr($0, 2); next }
    /^n/ {
      if (type == "DIR" && fd ~ /^[0-9]+$/) printf "%s\t%s\n", fd, substr($0, 2)
      next
    }'
}

# The command line of one live process, empty when the pid is gone.
_process_command() {
  LC_ALL=C ps -o command= -p "$1" 2>/dev/null || true
}

# True while the pid still runs the daemon command. A reaped or recycled pid
# fails the match, so no escalation step ever trusts a stale pid.
_is_daemon_pid() {
  local command
  command="$(_process_command "$1")"
  [ -n "$command" ] || return 1
  printf '%s\n' "$command" | LC_ALL=C grep -Eq '^([^ ]*/)?git fsmonitor--daemon run( |$)'
}

# The start time of one live process as five single-spaced fields, the shape
# _daemon_rows records. Empty when the pid is gone.
_process_started() {
  local dow mon day clock year
  read -r dow mon day clock year <<< "$(LC_ALL=C ps -o lstart= -p "$1" 2>/dev/null || true)"
  [ -n "$year" ] || return 0
  printf '%s %s %s %s %s\n' "$dow" "$mon" "$day" "$clock" "$year"
}

# Whether the pid is still the daemon the run listed: live when the command and
# the start time both match, changed when the pid now runs another daemon, gone
# when it no longer runs one. A command line alone cannot tell a recycled pid
# from the original, because every daemon runs the same command.
_daemon_state() {
  local pid="$1" started="$2"
  if ! _is_daemon_pid "$pid"; then
    printf 'gone\n'
  elif [ "$(_process_started "$pid")" = "$started" ]; then
    printf 'live\n'
  else
    printf 'changed\n'
  fi
}

# Poll for at most the given number of seconds; true once the listed daemon is
# no longer live.
_wait_gone() {
  local pid="$1" seconds="$2" started="$3" elapsed=0
  while [ "$elapsed" -lt "$seconds" ]; do
    if [ "$(_daemon_state "$pid" "$started")" != "live" ]; then
      return 0
    fi
    sleep 1
    elapsed=$((elapsed+1))
  done
  [ "$(_daemon_state "$pid" "$started")" != "live" ]
}

# The watched root of one daemon: its lowest-numbered DIR descriptor, resolved
# to a real path unless the directory is gone. Empty when lsof shows none.
_watched_root() {
  local fd name root="" root_fd=""
  while IFS="$TAB" read -r fd name; do
    [ -n "$fd" ] || continue
    case "$name" in
      *" (deleted)") name="${name% (deleted)}" ;;
    esac
    if [ -z "$root_fd" ] || [ "$fd" -lt "$root_fd" ]; then
      root_fd="$fd"
      root="$name"
    fi
  done <<< "$(_lsof_dir_rows "$1" 2>/dev/null || true)"
  [ -n "$root" ] || return 0
  _real_path "$root"
}

# True when a daemon other than the given pid also watches the worktree. Git's
# stop ends whichever daemon owns the worktree's socket, so with two daemons on
# one worktree it could end the one that was not chosen. The daemon list is read
# fresh, since the run's own listing may be seconds old.
_other_daemon_watches() {
  local pid="$1" worktree="$2" other started
  while IFS="$TAB" read -r other started; do
    [ -n "$other" ] || continue
    [ "$other" != "$pid" ] || continue
    if [ "$(_watched_root "$other")" = "$worktree" ]; then
      return 0
    fi
  done <<< "$(_daemon_rows || true)"
  return 1
}

# Every process cwd as p<pid> and n<path> rows, from one bounded lsof call. A
# timeout prints nothing, so a partial listing is never taken as proof that a
# worktree is idle. Any other non-zero status is ignored: lsof exits 1 whenever
# it cannot read some other user's process, even after listing everything it
# can.
_cwd_rows() {
  local rc=0 rows
  rows="$(run_bounded "$FSMON_PROBE_TIMEOUT" lsof -nP -d cwd -Fpn 2>/dev/null)" || rc=$?
  if [ "$rc" -eq 142 ]; then
    return 0
  fi
  [ -n "$rows" ] && printf '%s\n' "$rows"
  return 0
}

# First live process other than the excluded pid whose cwd is the worktree or
# below it. lsof's field mode emits a p row before that process's n row. An
# empty listing, including one a timeout suppressed, prints "unknown", so the
# caller refuses rather than ending a daemon it could not prove idle.
_cwd_intruder() {
  local worktree="$1" exclude="$2" rows line pid name
  rows="$(_cwd_rows)"
  if [ -z "$rows" ]; then
    printf 'unknown\n'
    return 0
  fi
  pid=""
  while IFS= read -r line; do
    case "$line" in
      p*) pid="${line#p}" ;;
      n*)
        name="${line#n}"
        case "$name" in
          *" (deleted)") name="${name% (deleted)}" ;;
        esac
        if [ -n "$pid" ] && [ "$pid" != "$exclude" ] && _inside "$name" "$worktree"; then
          printf '%s\n' "$pid"
          return 0
        fi
        ;;
    esac
  done <<< "$rows"
  return 0
}

# Epoch seconds of one process's start time, empty when ps or the date parse
# fails. A failed parse keeps a daemon out of the idle set.
_started_epoch() {
  local dow mon day clock year
  read -r dow mon day clock year <<< "$(LC_ALL=C ps -o lstart= -p "$1" 2>/dev/null || true)"
  [ -n "$year" ] || return 1
  LC_ALL=C date -j -f '%a %b %d %T %Y' "$dow $mon $day $clock $year" +%s 2>/dev/null
}

# Idle hours of one kept daemon, empty unless it has run past the threshold and
# no live process other than the daemon works inside its worktree.
_idle_age_hours() {
  local pid="$1" worktree="$2" now="$3" hours="$4" started age
  started="$(_started_epoch "$pid")" || return 1
  [ -n "$started" ] || return 1
  age=$((now - started))
  [ "$age" -gt $((hours * 3600)) ] || return 1
  [ -z "$(_cwd_intruder "$worktree" "$pid")" ] || return 1
  printf '%s\n' "$((age / 3600))"
}

# End one daemon, escalating git stop -> SIGTERM -> SIGKILL and rechecking the
# command line and the start time before every step. Prints the step that ended
# it and returns 0; 1 when it survives every step; 2 when it was already gone;
# 3 when its pid now runs a different daemon, which is left alone. The git stop
# step runs only for a registered worktree with its own .git file, and only when
# no other daemon watches it: for any other path, git -C walks up to the
# enclosing repository and would stop that repository's daemon instead, and with
# two daemons on one worktree git ends whichever owns the socket.
_end_daemon() {
  local pid="$1" worktree="$2" registered="$3" started="$4" via="" state

  state="$(_daemon_state "$pid" "$started")"
  [ "$state" != "gone" ] || return 2
  [ "$state" != "changed" ] || return 3

  if [ "$registered" = "1" ] && [ -f "$worktree/.git" ] \
    && ! _other_daemon_watches "$pid" "$worktree"; then
    if [ "$(_daemon_state "$pid" "$started")" = "live" ]; then
      run_bounded "$FSMON_STOP_TIMEOUT" git -c core.fsmonitor=false -C "$worktree" \
        fsmonitor--daemon stop >/dev/null 2>&1 || true
      via="stop"
      if _wait_gone "$pid" 1 "$started"; then
        printf '%s\n' "$via"
        return 0
      fi
    fi
  fi

  if [ "$(_daemon_state "$pid" "$started")" = "live" ]; then
    kill -TERM "$pid" 2>/dev/null || true
    via="term"
    if _wait_gone "$pid" "$FSMON_TERM_WAIT" "$started"; then
      printf '%s\n' "$via"
      return 0
    fi
  fi

  if [ "$(_daemon_state "$pid" "$started")" = "live" ]; then
    kill -KILL "$pid" 2>/dev/null || true
    via="kill"
    if _wait_gone "$pid" "$FSMON_KILL_WAIT" "$started"; then
      printf '%s\n' "$via"
      return 0
    fi
  fi

  if [ -n "$via" ] && [ "$(_daemon_state "$pid" "$started")" != "live" ]; then
    printf '%s\n' "$via"
    return 0
  fi
  return 1
}

# ───────────────────────────────────────────────────────────────
# 3. TIMING BOUNDS AND REPOSITORY RESOLUTION
# ───────────────────────────────────────────────────────────────

FSMON_PROBE_TIMEOUT="${FSMON_PROBE_TIMEOUT:-15}"
FSMON_STOP_TIMEOUT="${FSMON_STOP_TIMEOUT:-5}"
FSMON_TERM_WAIT="${FSMON_TERM_WAIT:-5}"
FSMON_KILL_WAIT="${FSMON_KILL_WAIT:-3}"

_require_positive_int FSMON_PROBE_TIMEOUT "$FSMON_PROBE_TIMEOUT"
_require_positive_int FSMON_STOP_TIMEOUT "$FSMON_STOP_TIMEOUT"
_require_positive_int FSMON_TERM_WAIT "$FSMON_TERM_WAIT"
_require_positive_int FSMON_KILL_WAIT "$FSMON_KILL_WAIT"

NOW="${FSMON_NOW:-$(date +%s)}"

if [ -n "$IDLE_HOURS" ]; then
  case "$IDLE_HOURS" in
    *[!0-9]*)
      log "--idle-hours must be a non-negative integer (got: $IDLE_HOURS)"
      exit 2
      ;;
  esac
  # Force base 10 so a leading zero is not read as octal by the age arithmetic.
  IDLE_HOURS=$((10#$IDLE_HOURS))
fi

if [ -n "$REPO" ]; then
  if [ ! -d "$REPO" ]; then
    log "--repo is not a directory: $REPO"
    exit 2
  fi
  REPO="$(cd "$REPO" && pwd -P)"
  if ! TOPLEVEL="$(git_bounded "$REPO" rev-parse --show-toplevel 2>/dev/null)"; then
    log "not a git repository: $REPO"
    exit 2
  fi
  REPO="$(cd "$TOPLEVEL" && pwd -P)"
else
  if ! TOPLEVEL="$(run_bounded "$FSMON_PROBE_TIMEOUT" git -c core.fsmonitor=false rev-parse --show-toplevel 2>/dev/null)"; then
    log "not in a git repository; pass --repo"
    exit 1
  fi
  REPO="$(cd "$TOPLEVEL" && pwd -P)"
fi

if ! COMMON="$(git_bounded "$REPO" rev-parse --git-common-dir 2>/dev/null)"; then
  log "cannot resolve the common git directory for $REPO"
  exit 1
fi
case "$COMMON" in
  /*) : ;;
  *) COMMON="$REPO/$COMMON" ;;
esac
COMMON="$(cd "$COMMON" && pwd -P)"

if ! REGISTERED="$(git_bounded "$REPO" worktree list --porcelain 2>/dev/null)"; then
  log "cannot list worktrees for $REPO"
  exit 1
fi

if ! MAIN_TOPLEVEL="$(_main_worktree)"; then
  log "no main worktree in $REPO"
  exit 1
fi
MAIN_TOPLEVEL="$(_real_path "$MAIN_TOPLEVEL")"

if [ -n "$WORKTREE" ]; then
  if [ ! -d "$WORKTREE" ]; then
    log "--worktree is not a directory: $WORKTREE"
    exit 2
  fi
  WORKTREE="$(_real_path "$WORKTREE")"
  if [ "$WORKTREE" = "$MAIN_TOPLEVEL" ]; then
    log "--worktree names the main checkout: $WORKTREE"
    exit 2
  fi
  if ! _registered_path "$WORKTREE" >/dev/null; then
    log "--worktree is not a registered worktree: $WORKTREE"
    exit 2
  fi
fi

# ───────────────────────────────────────────────────────────────
# 4. ATTRIBUTION AND CLASSIFICATION
# ───────────────────────────────────────────────────────────────

DAEMON_ROWS="$(_daemon_rows || true)"

if [ "$APPLY" = "1" ]; then
  MODE="apply"
else
  MODE="dry-run"
fi

TOTAL=0
STRAYS=0
ORPHAN_COUNT=0
SIGNALLED=0
SURVIVED=0
REFUSED=0
while IFS="$TAB" read -r pid started; do
  [ -n "$pid" ] || continue

  DIR_ROWS="$(_lsof_dir_rows "$pid" 2>/dev/null || true)"

  root=""
  root_fd=""
  root_deleted=0
  admin_row=0
  while IFS="$TAB" read -r fd name; do
    [ -n "$fd" ] || continue
    deleted=0
    case "$name" in
      *" (deleted)")
        name="${name% (deleted)}"
        deleted=1
        ;;
    esac
    if _under "$name" "$COMMON/worktrees"; then
      admin_row=1
    fi
    if [ -z "$root_fd" ] || [ "$fd" -lt "$root_fd" ]; then
      root_fd="$fd"
      root="$name"
      root_deleted="$deleted"
    fi
  done <<< "$DIR_ROWS"

  if [ -z "$root" ]; then
    class="unattributed"
    worktree_field="-"
  else
    [ "$root_deleted" = "1" ] || root="$(_real_path "$root")"
    # Only a daemon holding this repository's worktree administrative directory
    # is provably ours, so a kept daemon needs that row. A watched root under
    # the checkout alone is not proof: a separate repository nested inside the
    # checkout runs its own daemon there.
    if [ "$root" = "$MAIN_TOPLEVEL" ]; then
      class="main"
      worktree_field="main"
    elif [ "$admin_row" = "1" ] && [ "$root_deleted" = "0" ] \
      && registered="$(_registered_path "$root")"; then
      class="keep"
      worktree_field="$registered"
    elif [ "$admin_row" = "1" ]; then
      class="stray"
      worktree_field="$root"
    elif [ "$ORPHANS" = "1" ] && { [ "$root_deleted" = "1" ] || [ ! -d "$root" ]; }; then
      class="orphan"
      worktree_field="$root"
    else
      class="out-of-scope"
      worktree_field="-"
    fi
  fi

  TOTAL=$((TOTAL+1))
  if [ "$class" = "stray" ]; then
    STRAYS=$((STRAYS+1))
  fi
  if [ "$class" = "orphan" ]; then
    ORPHAN_COUNT=$((ORPHAN_COUNT+1))
  fi
  printf 'pid=%s class=%s worktree=%s started=%s\n' \
    "$pid" "$class" "$worktree_field" "$started"

  probe_worktree=""
  probe_result=""
  if [ "$PROBE" = "1" ]; then
    if [ "$class" = "main" ]; then
      probe_worktree="$MAIN_TOPLEVEL"
    elif [ "$class" = "keep" ]; then
      probe_worktree="$worktree_field"
    fi
    if [ -n "$WORKTREE" ] && [ "$probe_worktree" != "$WORKTREE" ]; then
      probe_worktree=""
    fi
    if [ -n "$probe_worktree" ] && [ -d "$probe_worktree" ]; then
      probe_rc=0
      run_bounded "$FSMON_PROBE_TIMEOUT" git -c core.fsmonitor=true \
        -C "$probe_worktree" --no-optional-locks diff-files --quiet >/dev/null 2>&1 \
        || probe_rc=$?
      if [ "$probe_rc" -eq 142 ]; then
        probe_result="wedged"
      else
        probe_result="answered"
      fi
      printf 'probe pid=%s worktree=%s result=%s\n' \
        "$pid" "$probe_worktree" "$probe_result"
    fi
  fi

  idle=0
  age_hours=""
  if [ -n "$IDLE_HOURS" ] && [ "$class" = "keep" ]; then
    if [ -z "$WORKTREE" ] || [ "$worktree_field" = "$WORKTREE" ]; then
      if age_hours="$(_idle_age_hours "$pid" "$worktree_field" "$NOW" "$IDLE_HOURS")"; then
        idle=1
        printf 'idle pid=%s worktree=%s age_hours=%s\n' \
          "$pid" "$worktree_field" "$age_hours"
      fi
    fi
  fi

  # The rules add up rather than override each other, so the launch sweep
  # (--apply --idle-hours) still clears strays. --worktree narrows the run to one
  # kept daemon; with --idle-hours or --probe, those then decide whether it ends.
  # A wedged probe result always ends the daemon.
  action=""
  if [ "$APPLY" = "1" ]; then
    if [ -n "$WORKTREE" ]; then
      if [ "$class" = "keep" ] && [ "$worktree_field" = "$WORKTREE" ]; then
        if [ -n "$IDLE_HOURS" ] || [ "$PROBE" = "1" ]; then
          [ "$idle" = "1" ] && action="end"
        else
          action="end"
        fi
      fi
    elif [ "$class" = "stray" ] || [ "$class" = "orphan" ] || [ "$idle" = "1" ]; then
      action="end"
    fi
    [ "$probe_result" = "wedged" ] && action="end"
  fi

  if [ "$action" = "end" ]; then
    # Occupancy guards a worktree that is about to be removed. A wedged daemon
    # ends regardless: git starts a fresh one on the next call, and the
    # processes inside the worktree are the ones stuck waiting on it.
    if [ -n "$WORKTREE" ] && [ "$REFUSED" = "0" ] && [ "$probe_result" != "wedged" ]; then
      blocker="$(_cwd_intruder "$WORKTREE" "$pid")"
      if [ -n "$blocker" ]; then
        REFUSED=1
        printf 'refused worktree=%s blocker=%s\n' "$WORKTREE" "$blocker"
      fi
    fi
    if [ "$REFUSED" = "0" ]; then
      skip_reason=""
      if [ "$class" = "stray" ]; then
        # The list was read when the run began. A worktree added since then is
        # registered now, and its new daemon is not a stray.
        if ! fresh_list="$(git_bounded "$REPO" worktree list --porcelain 2>/dev/null)"; then
          skip_reason="worktree-list-unreadable"
        else
          REGISTERED="$fresh_list"
          if _registered_path "$worktree_field" >/dev/null; then
            skip_reason="registered-mid-run"
          fi
        fi
      elif [ "$class" = "orphan" ] && [ -d "$worktree_field" ]; then
        skip_reason="root-exists"
      fi
      if [ -n "$skip_reason" ]; then
        printf 'skipped pid=%s class=%s worktree=%s reason=%s\n' \
          "$pid" "$class" "$worktree_field" "$skip_reason"
        continue
      fi
      end_rc=0
      registered_target=0
      [ "$class" = "keep" ] && registered_target=1
      via="$(_end_daemon "$pid" "$worktree_field" "$registered_target" "$started")" || end_rc=$?
      case "$end_rc" in
        0)
          SIGNALLED=$((SIGNALLED+1))
          printf 'ended pid=%s class=%s worktree=%s via=%s\n' \
            "$pid" "$class" "$worktree_field" "$via"
          ;;
        1)
          SURVIVED=$((SURVIVED+1))
          printf 'survived pid=%s class=%s worktree=%s\n' \
            "$pid" "$class" "$worktree_field"
          ;;
        3)
          printf 'skipped pid=%s class=%s worktree=%s reason=start-time-changed\n' \
            "$pid" "$class" "$worktree_field"
          ;;
      esac
    fi
  fi
done <<< "$DAEMON_ROWS"

printf 'mode=%s signalled=%s total=%s stray=%s' \
  "$MODE" "$SIGNALLED" "$TOTAL" "$STRAYS"
if [ "$ORPHANS" = "1" ]; then
  printf ' orphan=%s' "$ORPHAN_COUNT"
fi
printf '\n'

if [ "$SURVIVED" -gt 0 ]; then
  exit 1
fi
exit 0
