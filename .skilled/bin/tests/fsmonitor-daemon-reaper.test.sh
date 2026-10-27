#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: fsmonitor Daemon Reaper Test
# ───────────────────────────────────────────────────────────────
# Hermetic test for fsmonitor-daemon-reaper.sh's attribution, classification and
# apply contract. Builds throwaway fixture repositories, starts stub daemons
# whose argv[0] is the daemon command and whose lowest DIR descriptor is the
# directory under test, then runs the REAL reaper. The stubs and the one real
# daemon this test starts are the only processes signalled, either by the apply
# runs under test or at exit.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
REAPER="$SCRIPT_DIR/fsmonitor-daemon-reaper.sh"
BASH_BIN="${BASH:-/bin/bash}"

PASS=0; FAIL=0
expect() { # expect <desc> <cmd...>      -- PASS when cmd succeeds (rc 0)
  local desc="$1"; shift
  if "$@" >/dev/null 2>&1; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $desc"; fi
}
expect_gone() { # expect_gone <desc> <pid>   -- PASS when the pid no longer runs
  local desc="$1" pid="$2"
  if kill -0 "$pid" 2>/dev/null; then FAIL=$((FAIL+1)); echo "FAIL: $desc"; else PASS=$((PASS+1)); fi
}
# ── isolated fixtures ──────────────────────────────────────────
TMP="$(mktemp -d)"
FIXTURE="$TMP/repo"
OTHER="$TMP/other"
OUT="$TMP/reaper.out"
ERR="$TMP/reaper.err"
STUB_PIDS=""
STUB_PID=""
REAPER_RC=0
REAL_REPO=""
REAL_WT=""

stop_real_daemons() { # git's stop is the only end a real daemon accepts safely
  [ -n "$REAL_REPO" ] && [ -d "$REAL_REPO" ] || return 0
  git -c core.fsmonitor=true -C "$REAL_REPO" fsmonitor--daemon stop >/dev/null 2>&1 || true
  if [ -n "$REAL_WT" ] && [ -d "$REAL_WT" ]; then
    git -c core.fsmonitor=true -C "$REAL_WT" fsmonitor--daemon stop >/dev/null 2>&1 || true
  fi
}

cleanup() {
  local pid
  stop_real_daemons
  for pid in $STUB_PIDS; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
  git -C "$FIXTURE" worktree prune >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap cleanup EXIT

init_repo() { # init_repo <dir>
  local dir="$1"
  mkdir -p "$dir"
  git -C "$dir" init -q
  mkdir -p "$dir/.nohooks"
  git -C "$dir" config core.hooksPath "$dir/.nohooks"
  git -C "$dir" config core.fsmonitor false
  git -C "$dir" config user.email t@t.t
  git -C "$dir" config user.name t
  git -C "$dir" commit -q --allow-empty -m init
}

start_stub() { # start_stub <watched-dir> [admin-dir]
  ( exec -a "git fsmonitor--daemon run --detach" \
      perl -e 'my @d; for (@ARGV) { opendir(my $h, $_) or die; push @d, $h } sleep 600' "$@" ) &
  STUB_PID=$!
  STUB_PIDS="$STUB_PIDS $STUB_PID"
}

start_plain_stub() { # a daemon-shaped process with no DIR row other than cwd
  ( exec -a "git fsmonitor--daemon run --detach" sleep 600 ) &
  STUB_PID=$!
  STUB_PIDS="$STUB_PIDS $STUB_PID"
}

start_ignore_term_stub() { # start_ignore_term_stub <watched-dir> [admin-dir]
  ( exec -a "git fsmonitor--daemon run --detach" \
      perl -e '$SIG{TERM}="IGNORE"; my @d; for (@ARGV) { opendir(my $h, $_) or die; push @d, $h } sleep 600' "$@" ) &
  STUB_PID=$!
  STUB_PIDS="$STUB_PIDS $STUB_PID"
}

run_reaper() { # run_reaper [args...]  -- output in $OUT, stderr in $ERR, rc in $REAPER_RC
  REAPER_RC=0
  "$BASH_BIN" "$REAPER" "$@" >"$OUT" 2>"$ERR" || REAPER_RC=$?
}

run_reaper_fast() { # run_reaper_fast [args...]  -- apply runs use short bounds
  REAPER_RC=0
  FSMON_TERM_WAIT=1 FSMON_KILL_WAIT=1 FSMON_STOP_TIMEOUT=2 \
    "$BASH_BIN" "$REAPER" "$@" >"$OUT" 2>"$ERR" || REAPER_RC=$?
}

run_reaper_probe() { # run_reaper_probe <probe-timeout> [args...]  -- probe runs use a small bound
  local timeout="$1"; shift
  REAPER_RC=0
  FSMON_PROBE_TIMEOUT="$timeout" FSMON_TERM_WAIT=1 FSMON_KILL_WAIT=1 FSMON_STOP_TIMEOUT=2 \
    "$BASH_BIN" "$REAPER" "$@" >"$OUT" 2>"$ERR" || REAPER_RC=$?
}

run_reaper_idle() { # run_reaper_idle <now> [args...]  -- idle runs fix the clock
  local now="$1"; shift
  REAPER_RC=0
  FSMON_NOW="$now" FSMON_TERM_WAIT=1 FSMON_KILL_WAIT=1 FSMON_STOP_TIMEOUT=2 \
    "$BASH_BIN" "$REAPER" "$@" >"$OUT" 2>"$ERR" || REAPER_RC=$?
}

stub_started_epoch() { # stub_started_epoch <pid>  -- exact start second of a stub
  local dow mon day clock year
  read -r dow mon day clock year <<< "$(LC_ALL=C ps -o lstart= -p "$1")"
  LC_ALL=C date -j -f '%a %b %d %T %Y' "$dow $mon $day $clock $year" +%s
}

real_daemon_pid() { # real_daemon_pid <worktree>  -- a live daemon holding that worktree
  local worktree="$1" pid
  while IFS= read -r pid; do
    [ -n "$pid" ] || continue
    if "$REAL_LSOF" -nP -p "$pid" -Fftn 2>/dev/null | grep -Fqx "n$worktree"; then
      printf '%s\n' "$pid"
      return 0
    fi
  done <<< "$(pgrep -f 'fsmonitor--daemon run' 2>/dev/null || true)"
  return 1
}

init_repo "$FIXTURE"
init_repo "$OTHER"

WT="$FIXTURE/.worktrees/keep"
WT2="$FIXTURE/.worktrees/second"
GHOST="$FIXTURE/.worktrees/ghost"
GHOST_ADMIN="$FIXTURE/.git/worktrees/ghost"
GHOST2="$FIXTURE/.worktrees/ghost2"
GHOST2_ADMIN="$FIXTURE/.git/worktrees/ghost2"
NESTED="$FIXTURE/nested"
mkdir -p "$FIXTURE/.worktrees"
git -C "$FIXTURE" worktree add -q -b fsmon-test-keep "$WT" HEAD
git -C "$FIXTURE" worktree add -q -b fsmon-test-second "$WT2" HEAD
WT_ADMIN="$FIXTURE/.git/worktrees/keep"
WT2_ADMIN="$FIXTURE/.git/worktrees/second"
mkdir -p "$GHOST" "$GHOST_ADMIN"
init_repo "$NESTED"

WT_REAL="$(cd "$WT" && pwd -P)"
WT2_REAL="$(cd "$WT2" && pwd -P)"

start_stub "$FIXTURE";                    MAIN_PID="$STUB_PID"
start_stub "$WT" "$WT_ADMIN";             WT_PID="$STUB_PID"
start_stub "$WT2" "$WT2_ADMIN";           WT2_PID="$STUB_PID"
start_stub "$GHOST" "$GHOST_ADMIN";       GHOST_PID="$STUB_PID"
start_stub "$OTHER";                      OTHER_PID="$STUB_PID"
start_stub "$NESTED";                     NESTED_PID="$STUB_PID"
start_plain_stub;                         UNATTRIBUTED_PID="$STUB_PID"
sleep 1
# A worktree removed while its daemon kept running leaves the daemon holding a
# deleted administrative directory and no registration.
rmdir "$GHOST_ADMIN"

run_reaper --repo "$FIXTURE"

# ── classification ─────────────────────────────────────────────
expect "dry-run exits 0" test "$REAPER_RC" -eq 0
expect "main checkout daemon is class main" \
  grep -Fq "pid=$MAIN_PID class=main worktree=main" "$OUT"
expect "registered worktree daemon is class keep with its path" \
  grep -Fq "pid=$WT_PID class=keep worktree=$WT_REAL" "$OUT"
expect "unregistered worktree daemon is class stray" \
  grep -Fq "pid=$GHOST_PID class=stray" "$OUT"
expect "other repository daemon is out of scope" \
  grep -Fq "pid=$OTHER_PID class=out-of-scope" "$OUT"
expect "nested repository daemon inside the checkout is out-of-scope" \
  grep -Fq "pid=$NESTED_PID class=out-of-scope" "$OUT"
expect "daemon without a DIR row is unattributed" \
  grep -Fq "pid=$UNATTRIBUTED_PID class=unattributed" "$OUT"
expect "only the fixture main checkout is class main" \
  test "$(grep -c 'class=main' "$OUT" || true)" -eq 1

# ── dry-run contract ───────────────────────────────────────────
expect "summary reports dry-run with no signals" \
  grep -Fq "mode=dry-run signalled=0" "$OUT"
expect "summary counts every daemon" \
  grep -Eq 'total=[0-9]+ stray=[0-9]+' "$OUT"
expect "stray count includes the unregistered folder" \
  grep -Eq 'stray=[1-9]' "$OUT"

# ── stubs survive the read-only run ────────────────────────────
expect "main stub survives"        kill -0 "$MAIN_PID"
expect "keep stub survives"        kill -0 "$WT_PID"
expect "stray stub survives"       kill -0 "$GHOST_PID"
expect "out-of-scope stub survives" kill -0 "$OTHER_PID"
expect "unattributed stub survives" kill -0 "$UNATTRIBUTED_PID"

# ── hostile input ──────────────────────────────────────────────
run_reaper --bogus
expect "unknown flag exits 2" test "$REAPER_RC" -eq 2
expect "unknown flag prints usage on stderr" grep -Fq "Usage:" "$ERR"

run_reaper --help
expect "--help exits 0" test "$REAPER_RC" -eq 0
expect "--help prints usage on stdout" grep -Fq "Usage:" "$OUT"

for var in FSMON_PROBE_TIMEOUT FSMON_STOP_TIMEOUT FSMON_TERM_WAIT FSMON_KILL_WAIT; do
  REAPER_RC=0
  env "$var=abc" "$BASH_BIN" "$REAPER" --repo "$FIXTURE" >"$OUT" 2>"$ERR" || REAPER_RC=$?
  expect "$var=abc exits 2" test "$REAPER_RC" -eq 2
  expect "$var=abc names the variable" grep -Fq "$var" "$ERR"
done

# ── the idle flag still plans, not signals ─────────────────────
# A probe here would run real git with fsmonitor on, which starts a real daemon for
# each fixture worktree; the probe's dry-run contract is covered through the git shim.
run_reaper --idle-hours 1 --repo "$FIXTURE"
expect "--idle-hours stays dry-run" grep -Fq "mode=dry-run signalled=0" "$OUT"
expect "--idle-hours does not signal the stray" kill -0 "$GHOST_PID"

run_reaper --worktree "$FIXTURE" --repo "$FIXTURE"
expect "--worktree refuses the main checkout" test "$REAPER_RC" -eq 2
expect "--worktree refusal names the main checkout" grep -Fq "main checkout" "$ERR"

run_reaper --idle-hours abc --repo "$FIXTURE"
expect "--idle-hours rejects a non-integer" test "$REAPER_RC" -eq 2

# ── --worktree without --apply only prints the plan ────────────
run_reaper --worktree "$WT" --repo "$FIXTURE"
expect "--worktree accepts a registered worktree" test "$REAPER_RC" -eq 0
expect "--worktree without --apply keeps the dry-run summary" \
  grep -Fq "mode=dry-run signalled=0" "$OUT"
expect "--worktree without --apply plans the keep daemon" \
  grep -Fq "pid=$WT_PID class=keep worktree=$WT_REAL" "$OUT"
expect "--worktree without --apply leaves the keep stub alive" kill -0 "$WT_PID"

# ── --apply ends the strays and only the strays ────────────────
run_reaper_fast --apply --repo "$FIXTURE"
expect "--apply exits 0" test "$REAPER_RC" -eq 0
expect_gone "--apply ends the stray stub" "$GHOST_PID"
expect "--apply names the ended stray" \
  grep -Fq "ended pid=$GHOST_PID class=stray" "$OUT"
expect "--apply reports the term step" grep -Fq "via=term" "$OUT"
expect "--apply signals one daemon" grep -Fq "mode=apply signalled=1" "$OUT"
expect "--apply leaves the main stub alive" kill -0 "$MAIN_PID"
expect "--apply leaves the keep stub alive" kill -0 "$WT_PID"
expect "--apply leaves the second keep stub alive" kill -0 "$WT2_PID"
expect "--apply leaves the nested stub alive" kill -0 "$NESTED_PID"
expect "--apply leaves the out-of-scope stub alive" kill -0 "$OTHER_PID"
expect "--apply leaves the unattributed stub alive" kill -0 "$UNATTRIBUTED_PID"

# ── a registered root alone is not proof the daemon is this repo's ──
PLAIN_WT="$FIXTURE/.worktrees/plain"
git -C "$FIXTURE" worktree add -q -b fsmon-test-plain "$PLAIN_WT" HEAD
start_stub "$PLAIN_WT"
PLAIN_PID="$STUB_PID"
sleep 1

run_reaper_fast --apply --repo "$FIXTURE"
expect "a registered root without its admin folder is out of scope" \
  grep -Fq "pid=$PLAIN_PID class=out-of-scope worktree=-" "$OUT"
expect "a registered root without its admin folder survives --apply" kill -0 "$PLAIN_PID"
expect "a registered root without its admin folder signals nothing" \
  grep -Fq "mode=apply signalled=0" "$OUT"

PLAIN_START="$(stub_started_epoch "$PLAIN_PID")"
run_reaper_idle "$((PLAIN_START + 3600))" --idle-hours 0 --apply \
  --worktree "$PLAIN_WT" --repo "$FIXTURE"
expect "a registered root without its admin folder stays out of scope when idle" \
  grep -Fq "pid=$PLAIN_PID class=out-of-scope" "$OUT"
expect "a registered root without its admin folder survives --apply --idle-hours 0" \
  kill -0 "$PLAIN_PID"
expect "the idle run signals nothing" grep -Fq "mode=apply signalled=0" "$OUT"

# ── a worktree path with repeated spaces keeps its exact name ──
SPACE_WT="$FIXTURE/.worktrees/w  x"
git -C "$FIXTURE" worktree add -q -b fsmon-test-spaces "$SPACE_WT" HEAD
SPACE_ADMIN="$(sed -n 's/^gitdir: //p' "$SPACE_WT/.git")"
SPACE_WT_REAL="$(cd "$SPACE_WT" && pwd -P)"
start_stub "$SPACE_WT" "$SPACE_ADMIN"
SPACE_PID="$STUB_PID"
sleep 1

run_reaper --repo "$FIXTURE"
expect "a path with repeated spaces is classified keep" \
  grep -Fq "pid=$SPACE_PID class=keep worktree=$SPACE_WT_REAL" "$OUT"
run_reaper_fast --apply --repo "$FIXTURE"
expect "a path with repeated spaces survives --apply" kill -0 "$SPACE_PID"
expect "a path with repeated spaces is never ended" \
  test -z "$(grep -F "ended pid=$SPACE_PID" "$OUT" || true)"

# ── a non-git process with the daemon text in an argument is not a daemon ──
( exec perl -e 'opendir(my $h, $ARGV[1]) or die; sleep 600' \
    "/opt/git fsmonitor--daemon run" "$FIXTURE" ) &
DECOY_PID=$!
STUB_PIDS="$STUB_PIDS $DECOY_PID"
sleep 1

run_reaper --repo "$FIXTURE"
expect "a command argument holding the daemon text is not listed" \
  test -z "$(grep -F "pid=$DECOY_PID class=" "$OUT" || true)"
run_reaper_fast --apply --repo "$FIXTURE"
expect "a command argument holding the daemon text survives --apply" kill -0 "$DECOY_PID"

# ── a daemon that ignores SIGTERM escalates to SIGKILL ─────────
mkdir -p "$GHOST2" "$GHOST2_ADMIN"
start_ignore_term_stub "$GHOST2" "$GHOST2_ADMIN"
GHOST2_PID="$STUB_PID"
sleep 1
rmdir "$GHOST2_ADMIN"

run_reaper_fast --apply --repo "$FIXTURE"
expect "escalation exits 0" test "$REAPER_RC" -eq 0
expect_gone "a daemon ignoring SIGTERM is gone" "$GHOST2_PID"
expect "escalation names the ended daemon" \
  grep -Fq "ended pid=$GHOST2_PID class=stray" "$OUT"
expect "escalation reports the kill step" grep -Fq "via=kill" "$OUT"
expect "escalation signals one daemon" grep -Fq "mode=apply signalled=1" "$OUT"

# ── --apply --worktree ends that worktree's daemon only ────────
run_reaper_fast --apply --worktree "$WT" --repo "$FIXTURE"
expect "--worktree apply exits 0" test "$REAPER_RC" -eq 0
expect_gone "--worktree apply ends the keep stub" "$WT_PID"
expect "--worktree apply names the ended daemon" \
  grep -Fq "ended pid=$WT_PID class=keep worktree=$WT_REAL" "$OUT"
expect "--worktree apply signals one daemon" grep -Fq "mode=apply signalled=1" "$OUT"
expect "--worktree apply leaves the main stub alive" kill -0 "$MAIN_PID"
expect "--worktree apply leaves the other worktree stub alive" kill -0 "$WT2_PID"

# ── a live process inside the worktree refuses the stop ────────
( cd "$WT2" && exec sleep 600 ) &
BLOCKER_PID=$!
STUB_PIDS="$STUB_PIDS $BLOCKER_PID"
sleep 1

run_reaper_fast --apply --worktree "$WT2" --repo "$FIXTURE"
expect "refusal exits 0" test "$REAPER_RC" -eq 0
expect "refusal is reported" grep -Fq "refused" "$OUT"
expect "refusal names the blocking pid" grep -Fq "blocker=$BLOCKER_PID" "$OUT"
expect "refusal signals nothing" grep -Fq "mode=apply signalled=0" "$OUT"
expect "refusal leaves the worktree daemon alive" kill -0 "$WT2_PID"

# ── shims: a git that logs stop calls, an lsof whose cwd listing is empty ──
SHIM="$TMP/shim"
mkdir -p "$SHIM"
REAL_GIT="$(command -v git)"
REAL_LSOF="$(command -v lsof)"
STOP_LOG="$TMP/stop.log"
: > "$STOP_LOG"
cat > "$SHIM/git" <<EOF
#!/bin/bash
case " \$* " in *" fsmonitor--daemon stop "*) echo "\$*" >> "$STOP_LOG" ;; esac
exec "$REAL_GIT" "\$@"
EOF
cat > "$SHIM/lsof" <<EOF
#!/bin/bash
case " \$* " in *" -d cwd "*) exit 1 ;; esac
exec "$REAL_LSOF" "\$@"
EOF
chmod +x "$SHIM/git" "$SHIM/lsof"

# ── a stray never gets git's stop: git -C would reach the enclosing repo ──
GHOST3="$FIXTURE/.worktrees/ghost3"
GHOST3_ADMIN="$FIXTURE/.git/worktrees/ghost3"
mkdir -p "$GHOST3" "$GHOST3_ADMIN"
start_stub "$GHOST3" "$GHOST3_ADMIN"
GHOST3_PID="$STUB_PID"
sleep 1
rmdir "$GHOST3_ADMIN"
PATH="$SHIM:$PATH" run_reaper_fast --apply --repo "$FIXTURE"
expect_gone "a stray under the checkout is ended" "$GHOST3_PID"
expect "a stray is never sent git's stop" test ! -s "$STOP_LOG"

# ── an empty cwd listing refuses instead of assuming the worktree is idle ──
kill "$BLOCKER_PID" 2>/dev/null || true
wait "$BLOCKER_PID" 2>/dev/null || true
PATH="$SHIM:$PATH" run_reaper_fast --apply --worktree "$WT2" --repo "$FIXTURE"
expect "an empty cwd listing refuses" grep -Fq "refused worktree=" "$OUT"
expect "an empty cwd listing names an unknown blocker" grep -Fq "blocker=unknown" "$OUT"
expect "an empty cwd listing leaves the daemon alive" kill -0 "$WT2_PID"

# ── a cwd listing that outlives its bound refuses, partial rows and all ──
SLOW_SHIM="$TMP/slow-shim"
mkdir -p "$SLOW_SHIM"
cat > "$SLOW_SHIM/lsof" <<EOF
#!/bin/bash
case " \$* " in
  *" -d cwd "*) printf 'p1\nn%s\n' "$TMP/unrelated"; exec sleep 30 ;;
esac
exec "$REAL_LSOF" "\$@"
EOF
chmod +x "$SLOW_SHIM/lsof"
SLOW_STARTED="$(date +%s)"
PATH="$SLOW_SHIM:$PATH" run_reaper_probe 2 --apply --worktree "$WT2" --repo "$FIXTURE"
SLOW_ELAPSED=$(( $(date +%s) - SLOW_STARTED ))
expect "a timed-out cwd listing refuses" grep -Fq "refused worktree=$WT2_REAL" "$OUT"
expect "a timed-out cwd listing names an unknown blocker" grep -Fq "blocker=unknown" "$OUT"
expect "a timed-out cwd listing is bounded by the probe timeout" test "$SLOW_ELAPSED" -lt 10
expect "a timed-out cwd listing leaves the daemon alive" kill -0 "$WT2_PID"

# ── shims: a git whose diff-files hangs, to fake a wedged daemon ──
PROBE_REPO="$TMP/probe"
PROBE_WT="$PROBE_REPO/.worktrees/keep"
init_repo "$PROBE_REPO"
mkdir -p "$PROBE_REPO/.worktrees"
git -C "$PROBE_REPO" worktree add -q -b fsmon-test-probe "$PROBE_WT" HEAD
PROBE_WT_REAL="$(cd "$PROBE_WT" && pwd -P)"
PROBE_ADMIN="$PROBE_REPO/.git/worktrees/keep"

PROBE_SHIM="$TMP/probe-shim"
PROBE_ARGV="$TMP/probe-argv.log"
PROBE_DELAY="$TMP/probe-delay"
mkdir -p "$PROBE_SHIM"
: > "$PROBE_ARGV"
printf '30\n' > "$PROBE_DELAY"
cat > "$PROBE_SHIM/git" <<EOF
#!/bin/bash
case " \$* " in
  *" diff-files "*)
    echo "\$*" >> "$PROBE_ARGV"
    delay="\$(cat "$PROBE_DELAY")"
    if [ "\$delay" -gt 10 ]; then exec sleep "\$delay"; fi
    sleep "\$delay"
    exit 1
    ;;
esac
exec "$REAL_GIT" "\$@"
EOF
chmod +x "$PROBE_SHIM/git"

# ── a wedged daemon: the probe hits its alarm and --apply ends it ──
start_stub "$PROBE_WT" "$PROBE_ADMIN"
PROBE_KEEP_PID="$STUB_PID"
sleep 1
PROBE_STARTED="$(date +%s)"
PATH="$PROBE_SHIM:$PATH" run_reaper_probe 2 --probe --apply --repo "$PROBE_REPO"
PROBE_ELAPSED=$(( $(date +%s) - PROBE_STARTED ))
expect "probe apply exits 0" test "$REAPER_RC" -eq 0
expect "a daemon that misses its alarm is wedged" \
  grep -Fq "probe pid=$PROBE_KEEP_PID worktree=$PROBE_WT_REAL result=wedged" "$OUT"
expect "probe apply ends the wedged keep daemon" \
  grep -Fq "ended pid=$PROBE_KEEP_PID class=keep worktree=$PROBE_WT_REAL" "$OUT"
expect "probe apply signals one daemon" grep -Fq "mode=apply signalled=1" "$OUT"
expect_gone "probe apply kills the wedged stub" "$PROBE_KEEP_PID"
expect "a wedged probe is bounded by its timeout" test "$PROBE_ELAPSED" -lt 10

# ── a daemon that answers is not wedged and keeps running ──────
start_stub "$PROBE_WT" "$PROBE_ADMIN"
PROBE_ANSWER_PID="$STUB_PID"
sleep 1
printf '1\n' > "$PROBE_DELAY"
PATH="$PROBE_SHIM:$PATH" run_reaper_probe 3 --probe --apply --repo "$PROBE_REPO"
expect "a daemon that answers is not wedged" \
  grep -Fq "probe pid=$PROBE_ANSWER_PID worktree=$PROBE_WT_REAL result=answered" "$OUT"
expect "probe apply signals nothing when the daemon answers" \
  grep -Fq "mode=apply signalled=0" "$OUT"
expect "a daemon that answers survives the probe" kill -0 "$PROBE_ANSWER_PID"

# ── probing alone reports, signals nothing and keeps the daemon ──
printf '30\n' > "$PROBE_DELAY"
PATH="$PROBE_SHIM:$PATH" run_reaper_probe 2 --probe --repo "$PROBE_REPO"
expect "probing alone reports the wedged daemon" \
  grep -Fq "probe pid=$PROBE_ANSWER_PID worktree=$PROBE_WT_REAL result=wedged" "$OUT"
expect "probing alone stays dry-run" grep -Fq "mode=dry-run signalled=0" "$OUT"
expect "probing alone leaves the daemon alive" kill -0 "$PROBE_ANSWER_PID"

# ── the probe keeps fsmonitor on so the daemon is the one asked ──
printf '1\n' > "$PROBE_DELAY"
: > "$PROBE_ARGV"
PATH="$PROBE_SHIM:$PATH" run_reaper_probe 3 --probe --worktree "$PROBE_WT" --repo "$PROBE_REPO"
expect "the probe passes -c core.fsmonitor=true" grep -Fq "core.fsmonitor=true" "$PROBE_ARGV"
expect "the probe reads diff-files under --no-optional-locks" \
  grep -Fq -- "--no-optional-locks diff-files --quiet" "$PROBE_ARGV"
expect "the probe targets the daemon's worktree" grep -Fq -- "-C $PROBE_WT_REAL" "$PROBE_ARGV"
expect "--probe --worktree probes that worktree's daemon" \
  grep -Fq "probe pid=$PROBE_ANSWER_PID worktree=$PROBE_WT_REAL result=answered" "$OUT"

# ── a wedged daemon ends even while a process sits in its worktree ──
printf '30\n' > "$PROBE_DELAY"
( cd "$PROBE_WT" && exec sleep 600 ) &
PROBE_OCCUPANT_PID=$!
STUB_PIDS="$STUB_PIDS $PROBE_OCCUPANT_PID"
sleep 1
PATH="$PROBE_SHIM:$PATH" run_reaper_probe 2 --probe --apply --worktree "$PROBE_WT" --repo "$PROBE_REPO"
expect "a wedged daemon is not refused for an occupied worktree" \
  test -z "$(grep -F "refused worktree=" "$OUT" || true)"
expect_gone "a wedged daemon in an occupied worktree is ended" "$PROBE_ANSWER_PID"
expect "the worktree's occupant keeps running" kill -0 "$PROBE_OCCUPANT_PID"
kill "$PROBE_OCCUPANT_PID" 2>/dev/null || true
wait "$PROBE_OCCUPANT_PID" 2>/dev/null || true

# ── idle selection: age, worktree occupancy and the dry-run contract ──
IDLE_REPO="$TMP/idle"
IDLE_WT="$IDLE_REPO/.worktrees/keep"
IDLE_BUSY_WT="$IDLE_REPO/.worktrees/busy"
IDLE_MAIN_REPO="$TMP/idle-main"
init_repo "$IDLE_REPO"
mkdir -p "$IDLE_REPO/.worktrees"
git -C "$IDLE_REPO" worktree add -q -b fsmon-test-idle "$IDLE_WT" HEAD
git -C "$IDLE_REPO" worktree add -q -b fsmon-test-idle-busy "$IDLE_BUSY_WT" HEAD
IDLE_WT_REAL="$(cd "$IDLE_WT" && pwd -P)"
IDLE_WT_ADMIN="$IDLE_REPO/.git/worktrees/keep"
IDLE_BUSY_ADMIN="$IDLE_REPO/.git/worktrees/busy"
init_repo "$IDLE_MAIN_REPO"

start_stub "$IDLE_WT" "$IDLE_WT_ADMIN"
IDLE_KEEP_PID="$STUB_PID"
start_stub "$IDLE_BUSY_WT" "$IDLE_BUSY_ADMIN"
IDLE_BUSY_PID="$STUB_PID"
( cd "$IDLE_BUSY_WT" && exec sleep 600 ) &
IDLE_BLOCKER_PID=$!
STUB_PIDS="$STUB_PIDS $IDLE_BLOCKER_PID"
start_stub "$IDLE_MAIN_REPO"
IDLE_MAIN_PID="$STUB_PID"
sleep 1

IDLE_KEEP_START="$(stub_started_epoch "$IDLE_KEEP_PID")"
IDLE_MAIN_START="$(stub_started_epoch "$IDLE_MAIN_PID")"

run_reaper_idle "$((IDLE_KEEP_START + 11 * 3600))" --idle-hours 12 --apply --repo "$IDLE_REPO"
expect "an 11-hour keep daemon stays under the idle threshold" \
  test -z "$(grep -F "idle pid=$IDLE_KEEP_PID" "$OUT" || true)"
expect "an 11-hour idle run signals nothing" grep -Fq "mode=apply signalled=0" "$OUT"
expect "an 11-hour keep daemon survives" kill -0 "$IDLE_KEEP_PID"

run_reaper_idle "$((IDLE_KEEP_START + 13 * 3600))" --idle-hours 12 --apply --repo "$IDLE_REPO"
expect "a keep daemon past the threshold is printed idle" \
  grep -Fq "idle pid=$IDLE_KEEP_PID worktree=$IDLE_WT_REAL age_hours=13" "$OUT"
expect_gone "idle apply ends the unoccupied keep daemon" "$IDLE_KEEP_PID"
expect "idle apply names the ended daemon" \
  grep -Fq "ended pid=$IDLE_KEEP_PID class=keep worktree=$IDLE_WT_REAL" "$OUT"
expect "idle apply signals exactly the unoccupied daemon" \
  grep -Fq "mode=apply signalled=1" "$OUT"
expect "an occupied worktree is never idle" \
  test -z "$(grep -F "idle pid=$IDLE_BUSY_PID" "$OUT" || true)"
expect "an occupied worktree keeps its daemon" kill -0 "$IDLE_BUSY_PID"

run_reaper_idle "$((IDLE_MAIN_START + 13 * 3600))" --idle-hours 12 --apply --repo "$IDLE_MAIN_REPO"
expect "a main daemon is never idle" \
  test -z "$(grep -F "idle pid=$IDLE_MAIN_PID" "$OUT" || true)"
expect "a main-only idle run signals nothing" grep -Fq "mode=apply signalled=0" "$OUT"
expect "a main daemon survives the idle selection" kill -0 "$IDLE_MAIN_PID"

start_stub "$IDLE_WT" "$IDLE_WT_ADMIN"
IDLE_DRY_PID="$STUB_PID"
sleep 1
IDLE_DRY_START="$(stub_started_epoch "$IDLE_DRY_PID")"
run_reaper_idle "$((IDLE_DRY_START + 13 * 3600))" --idle-hours 12 --repo "$IDLE_REPO"
expect "a dry-run idle daemon is printed" \
  grep -Fq "idle pid=$IDLE_DRY_PID worktree=$IDLE_WT_REAL age_hours=13" "$OUT"
expect "a dry-run idle run signals nothing" grep -Fq "mode=dry-run signalled=0" "$OUT"
expect "a dry-run idle run leaves the daemon alive" kill -0 "$IDLE_DRY_PID"

kill "$IDLE_BLOCKER_PID" 2>/dev/null || true
wait "$IDLE_BLOCKER_PID" 2>/dev/null || true
run_reaper_idle "$((IDLE_DRY_START + 13 * 3600))" --idle-hours 12 --worktree "$IDLE_WT" --repo "$IDLE_REPO"
expect "--idle-hours --worktree reports that worktree's idle daemon" \
  grep -Fq "idle pid=$IDLE_DRY_PID worktree=$IDLE_WT_REAL" "$OUT"
expect "--idle-hours --worktree ignores another idle worktree" \
  test -z "$(grep -F "idle pid=$IDLE_BUSY_PID" "$OUT" || true)"

# ── the launch sweep (--apply --idle-hours) still ends strays ──
IDLE_GHOST="$IDLE_REPO/.worktrees/ghost"
IDLE_GHOST_ADMIN="$IDLE_REPO/.git/worktrees/ghost"
mkdir -p "$IDLE_GHOST" "$IDLE_GHOST_ADMIN"
start_stub "$IDLE_GHOST" "$IDLE_GHOST_ADMIN"
IDLE_GHOST_PID="$STUB_PID"
sleep 1
rmdir "$IDLE_GHOST_ADMIN"
run_reaper_idle "$((IDLE_DRY_START + 1 * 3600))" --idle-hours 12 --apply --repo "$IDLE_REPO"
expect_gone "the idle sweep ends a stray however young" "$IDLE_GHOST_PID"
expect "the idle sweep keeps a young keep daemon" kill -0 "$IDLE_DRY_PID"

# ── one real daemon: attribution and git's stop, end to end ────
REAL_REPO="$TMP/real"
REAL_WT="$REAL_REPO/.worktrees/keep"
init_repo "$REAL_REPO"
mkdir -p "$REAL_REPO/.worktrees"
git -C "$REAL_REPO" worktree add -q -b fsmon-test-real "$REAL_WT" HEAD
REAL_WT_REAL="$(cd "$REAL_WT" && pwd -P)"
git -c core.fsmonitor=true -C "$REAL_WT" status >/dev/null 2>&1 || true

REAL_PID=""
REAL_WAIT=0
while [ "$REAL_WAIT" -lt 20 ]; do
  REAL_PID="$(real_daemon_pid "$REAL_WT_REAL" || true)"
  [ -n "$REAL_PID" ] && break
  sleep 0.5
  REAL_WAIT=$((REAL_WAIT+1))
done

if [ -z "$REAL_PID" ]; then
  echo "SKIP: real daemon did not start"
else
  run_reaper_fast --apply --worktree "$REAL_WT" --repo "$REAL_REPO"
  expect "a real daemon is ended by git's stop" \
    grep -Fq "ended pid=$REAL_PID class=keep worktree=$REAL_WT_REAL via=stop" "$OUT"
  expect_gone "a real daemon is gone after --apply" "$REAL_PID"
fi
stop_real_daemons

if [ "$FAIL" -ne 0 ]; then
  echo "--- reaper output (rc=$REAPER_RC) ---"
  cat "$OUT"
  echo "--- reaper stderr ---"
  cat "$ERR"
  echo "-----------------------------------"
fi

echo "fsmonitor-daemon-reaper tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
