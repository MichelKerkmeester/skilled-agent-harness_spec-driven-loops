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
# home directory. The reaper ends only the fsmonitor daemon of a worktree it
# removes, and one assertion holds it to that so a broader kill path cannot
# return unnoticed. A second fixture repo covers the opt-in numbered lane: one
# worktree per keep rule plus one that qualifies, and a stub lsof and a stub git
# prove the process check and every git call fail toward keeping. The same fixture
# covers the provisioning list's regenerable files and a squash-merged branch.
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
expect_gone() { # expect_gone <desc> <pid>  -- PASS once the pid stops within 10s
  local desc="$1" pid="$2" elapsed=0
  while [ "$elapsed" -lt 10 ]; do
    if ! kill -0 "$pid" 2>/dev/null; then PASS=$((PASS+1)); return 0; fi
    sleep 1
    elapsed=$((elapsed+1))
  done
  FAIL=$((FAIL+1)); echo "FAIL: $desc"
}
expect_no_daemon_ended() { # expect_no_daemon_ended <desc> <worktree>  -- no daemon-end row names it
  local desc="$1" wt="$2"
  if grep -F "ended pid=" "$REAPER_OUT" | grep -Fq "worktree=$wt"; then
    FAIL=$((FAIL+1)); echo "FAIL: $desc"
  else
    PASS=$((PASS+1))
  fi
}

# ── isolated fixture repo + isolated HOME ──────────────────────
FAKE_HOME="$(mktemp -d)"
FIXTURE="$(mktemp -d)"
CUSTOM_BASE="$(mktemp -d)"
NUM_REPO="$(mktemp -d)"
SHIM_DIR="$(mktemp -d)"
REAL_GIT="$(command -v git)"
STUB_PIDS=""
cleanup() {
  local pid
  for pid in $STUB_PIDS; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
  git -C "$FIXTURE" worktree prune >/dev/null 2>&1 || true
  git -C "$NUM_REPO" worktree prune >/dev/null 2>&1 || true
  rm -rf "$FIXTURE" "$FAKE_HOME" "$CUSTOM_BASE" "$NUM_REPO" "$SHIM_DIR"
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
# A stand-in for the worktree's fsmonitor daemon: it has the daemon's argv and the
# DIR descriptors the sibling reaper attributes it by. Its cwd
# stays outside the worktree so it does not mark the worktree as occupied.
( cd "$FIXTURE" && exec -a "git fsmonitor--daemon run --detach" \
    perl -e 'my @d; for (@ARGV) { opendir(my $h, $_) or die; push @d, $h } sleep 600' \
    "$FIXTURE/.worktrees/rt-a" "$FIXTURE/.git/worktrees/rt-a" ) &
FSMON_A_PID=$!
STUB_PIDS="$STUB_PIDS $FSMON_A_PID"
# Disown the stub so bash does not announce the sibling reaper terminating it.
disown "$FSMON_A_PID" 2>/dev/null || true
sleep 1

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
STUB_PIDS="$STUB_PIDS $BUSY_PID"
sleep 0.5

# ── a process listing that comes back empty is never proof of an idle worktree ──
# The wrapper rt-a qualifies for removal (dead marker, clean, merged), so only the
# empty listing keeps it. The shim stands in for an lsof that timed out or failed.
mkdir -p "$SHIM_DIR/empty-lsof"
printf '#!/bin/sh\nexit 0\n' > "$SHIM_DIR/empty-lsof/lsof"
chmod +x "$SHIM_DIR/empty-lsof/lsof"
EMPTY_LSOF_OUT="$FIXTURE/.reaper-empty-lsof.out"
( cd "$FIXTURE" && PATH="$SHIM_DIR/empty-lsof:$PATH" bash "$REAPER" ) >"$EMPTY_LSOF_OUT" 2>&1 || true
expect "wrapper with an empty process listing: dir kept" test -d "$FIXTURE/.worktrees/rt-a"
expect "wrapper with an empty process listing: branch kept" git -C "$FIXTURE" show-ref --verify --quiet refs/heads/work/rt/a
expect "wrapper with an empty process listing: reaper says why" grep -F "live process inside; pid unknown" "$EMPTY_LSOF_OUT"

# A listing that printed rows and then exited non-zero is incomplete too: the process that
# works inside the worktree may be among the rows it never reached.
mkdir -p "$SHIM_DIR/partial-lsof"
printf '#!/bin/sh\nprintf "p1\\nfcwd\\nn/\\n"\nexit 1\n' > "$SHIM_DIR/partial-lsof/lsof"
chmod +x "$SHIM_DIR/partial-lsof/lsof"
PARTIAL_LSOF_OUT="$FIXTURE/.reaper-partial-lsof.out"
( cd "$FIXTURE" && PATH="$SHIM_DIR/partial-lsof:$PATH" bash "$REAPER" ) >"$PARTIAL_LSOF_OUT" 2>&1 || true
expect "wrapper with a partial process listing: dir kept" test -d "$FIXTURE/.worktrees/rt-a"
expect "wrapper with a partial process listing: branch kept" git -C "$FIXTURE" show-ref --verify --quiet refs/heads/work/rt/a
expect "wrapper with a partial process listing: reaper says why" grep -F "live process inside; pid unknown" "$PARTIAL_LSOF_OUT"

# ── run the REAL reaper (not dry-run) inside the fixture ────────
REAPER_OUT="$FIXTURE/.reaper.out"
if ( cd "$FIXTURE" && bash "$REAPER" ) >"$REAPER_OUT" 2>&1; then
  REAPER_RC=0
else
  REAPER_RC=$?
fi

# ── assertions ───────────────────────────────────────────────────
# (a) reaped: its fsmonitor daemon ended, the worktree dir gone AND branch deleted
expect_gone "(a) wrapper+dead: fsmonitor daemon ended" "$FSMON_A_PID"
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

# The reaper ends a removed worktree's fsmonitor daemon through the sibling script;
# it never sends a signal itself. Its only `kill` is the `kill -0` liveness probe.
expect_not "reaper itself never signals a process" \
  grep -Eq '(^|[[:space:];&|(])kill[[:space:]]+(-([1-9][0-9]*|[A-Za-z]+)|[^[:space:]-])' "$REAPER"

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
expect_no_daemon_ended "(h) live child: daemon reaper ended nothing for it" \
  "$(cd "$FIXTURE/.worktrees/rt-child" && pwd -P)"
kill "$BUSY_PID" 2>/dev/null || true
wait "$BUSY_PID" 2>/dev/null || true

# ── an unreadable worktree registry is not an empty one ─────────
# rt-custom-c lives outside the configured base, so only git's registry says it exists.
# When the registry cannot be read (git fails, or hangs until its bound), the socket dir
# and the session marker of every registered worktree must survive and no verdict may
# rest on the missing list.
registry_shim() { # registry_shim <name> <shell command that fails the listing>
  mkdir -p "$SHIM_DIR/$1"
  cat > "$SHIM_DIR/$1/git" <<SHIM
#!/bin/sh
prev=""
for a in "\$@"; do
  if [ "\$prev" = worktree ] && [ "\$a" = list ]; then $2; fi
  prev="\$a"
done
exec "$REAL_GIT" "\$@"
SHIM
  chmod +x "$SHIM_DIR/$1/git"
}
registry_shim dead-registry-git 'exit 1'
registry_shim hung-registry-git 'exec sleep 60'
for REG_MODE in dead hung; do
  printf '%s\n' "$$" > "$MARKERS_DIR/rt-custom-c.pid"
  mkdir -p "$FAKE_HOME/.spk-wt-sock/rt-custom-c"
  REG_OUT="$FIXTURE/.reaper-$REG_MODE-registry.out"
  REG_RC=0
  ( cd "$FIXTURE" && PATH="$SHIM_DIR/$REG_MODE-registry-git:$PATH" SPECKIT_GIT_TIMEOUT=1 bash "$REAPER" ) >"$REG_OUT" 2>&1 || REG_RC=$?
  expect "$REG_MODE registry: the run still exits 0" test "$REG_RC" -eq 0
  expect "$REG_MODE registry: the session marker of a registered worktree survives" test -f "$MARKERS_DIR/rt-custom-c.pid"
  expect "$REG_MODE registry: the socket dir of a registered worktree survives" test -d "$FAKE_HOME/.spk-wt-sock/rt-custom-c"
  expect "$REG_MODE registry: the log says the registry could not be read" grep -F "worktree registry could not be read" "$REG_OUT"
  expect "$REG_MODE registry: the custom-base worktree survives" test -d "$CUSTOM_BASE/rt-custom-c"
done

# ═══ the opt-in numbered lane ═══════════════════════════════════
# One worktree per rule. Every worktree is merged into the primary checkout's HEAD and
# aged to 2020 unless its case says otherwise, so the single rule under test is the only
# reason it stays. 002-ok is the one that qualifies; 001-lockref qualifies too, but a
# ref lock file makes `branch -d` refuse, and it sorts first so a run that aborted on the
# refusal would leave 002-ok behind.
# Two ignored files that the repository's build and install write into every checkout, so
# neither may keep a worktree: one sits under a dist folder, the provisioning list names the
# other, and each sits beside a tracked file so git reports that file, never its folder.
REGEN_BUNDLE="fixture-pkg/dist/bundle.js"
REGEN_MARKER=".skilled/skills/system-spec-kit/.node-version-marker"
git -C "$NUM_REPO" init -q
mkdir -p "$NUM_REPO/.nohooks" "$NUM_REPO/specs/a" "$NUM_REPO/$(dirname "$REGEN_BUNDLE")" "$NUM_REPO/$(dirname "$REGEN_MARKER")"
git -C "$NUM_REPO" config core.hooksPath "$NUM_REPO/.nohooks"
git -C "$NUM_REPO" config user.email t@t.t
git -C "$NUM_REPO" config user.name t
printf 'node_modules/\ndist/\n.pytest_cache/\n*.log\nlocal-*\n.nohooks/\n%s\n%s\n' \
  "$REGEN_BUNDLE" "$REGEN_MARKER" > "$NUM_REPO/.gitignore"
printf 'readme\n' > "$NUM_REPO/README"
printf 'spec\n' > "$NUM_REPO/specs/a/spec.md"
printf 'tracked\n' > "$NUM_REPO/$(dirname "$REGEN_BUNDLE")/index.js"
printf 'tracked\n' > "$NUM_REPO/$(dirname "$REGEN_MARKER")/package.json"
git -C "$NUM_REPO" add -f .gitignore README specs "$(dirname "$REGEN_BUNDLE")/index.js" "$(dirname "$REGEN_MARKER")/package.json"
git -C "$NUM_REPO" commit -q -m init
NUM_REPO_REAL="$(cd "$NUM_REPO" && pwd -P)"
NUM_COMMON="$NUM_REPO_REAL/.git"

num_add() { # num_add <NNN-slug>  -- a worktree on worktrees/<NNN-slug>
  git -C "$NUM_REPO" worktree add -q -b "worktrees/$1" "$NUM_REPO/.worktrees/$1" HEAD
}
num_age() { # num_age <NNN-slug>  -- backdate the three activity times the reaper reads
  local name="$1" admin
  admin="$NUM_COMMON/worktrees/$name"
  touch -t 202001010000 "$NUM_COMMON/logs/refs/heads/worktrees/$name" "$admin/logs/HEAD" "$admin/index"
}

num_add 001-lockref
num_add 002-ok
mkdir -p "$NUM_REPO/.worktrees/002-ok/node_modules/pkg" "$NUM_REPO/.worktrees/002-ok/dist" "$NUM_REPO/.worktrees/002-ok/.pytest_cache"
printf 'x\n' > "$NUM_REPO/.worktrees/002-ok/node_modules/pkg/index.js"
printf 'x\n' > "$NUM_REPO/.worktrees/002-ok/dist/out.js"
printf 'x\n' > "$NUM_REPO/.worktrees/002-ok/.pytest_cache/v"
ln -s "$NUM_REPO_REAL/README" "$NUM_REPO/.worktrees/002-ok/local-link"
mkdir -p "$NUM_REPO/.worktrees/002-ok/local-dir"
ln -s "$NUM_REPO_REAL/README" "$NUM_REPO/.worktrees/002-ok/local-dir/entry"
num_add 003-fresh
num_add 004-specs-log
mkdir -p "$NUM_REPO/.worktrees/004-specs-log/specs/a"
printf 'log\n' > "$NUM_REPO/.worktrees/004-specs-log/specs/a/x.log"
num_add 005-untracked
printf 'new\n' > "$NUM_REPO/.worktrees/005-untracked/new.txt"
num_add 006-unpushed
printf 'unmerged\n' > "$NUM_REPO/.worktrees/006-unpushed/unmerged.txt"
git -C "$NUM_REPO/.worktrees/006-unpushed" add unmerged.txt
git -C "$NUM_REPO/.worktrees/006-unpushed" commit -q -m "unmerged work"
num_add 007-process
num_add 008-locked
git -C "$NUM_REPO" worktree lock "$NUM_REPO/.worktrees/008-locked"
num_add 009-stash
printf 'changed\n' > "$NUM_REPO/.worktrees/009-stash/README"
git -C "$NUM_REPO/.worktrees/009-stash" stash push -q -m "keep me"
# A branch of another pattern, and a numbered branch whose folder does not match it.
git -C "$NUM_REPO" worktree add -q -b other/010-human "$NUM_REPO/.worktrees/010-human" HEAD
git -C "$NUM_REPO" worktree add -q -b worktrees/011-mismatch "$NUM_REPO/.worktrees/011-folder" HEAD
git -C "$NUM_REPO" worktree add -q --detach "$NUM_REPO/.worktrees/012-detached" HEAD
num_add 013-ignored
printf 'private\n' > "$NUM_REPO/.worktrees/013-ignored/local-note.txt"
# Regenerable ignored files: both kinds, then a regenerable one followed by an unlisted
# file. The unlisted file sorts after the regenerable one, so a run that stopped at the
# first would name the wrong file.
num_add 014-regen
mkdir -p "$NUM_REPO/.worktrees/014-regen/$(dirname "$REGEN_BUNDLE")" "$NUM_REPO/.worktrees/014-regen/$(dirname "$REGEN_MARKER")"
printf 'bundle\n' > "$NUM_REPO/.worktrees/014-regen/$REGEN_BUNDLE"
printf 'v24\n' > "$NUM_REPO/.worktrees/014-regen/$REGEN_MARKER"
num_add 015-regen-mixed
mkdir -p "$NUM_REPO/.worktrees/015-regen-mixed/$(dirname "$REGEN_BUNDLE")"
printf 'bundle\n' > "$NUM_REPO/.worktrees/015-regen-mixed/$REGEN_BUNDLE"
printf 'trace\n' > "$NUM_REPO/.worktrees/015-regen-mixed/$(dirname "$(dirname "$REGEN_BUNDLE")")/trace.log"
# A database or a .state folder inside an otherwise rebuildable folder is still state
# someone could lose: git reports only the folder, so the reaper has to look inside it.
num_add 018-sqlite-dist
mkdir -p "$NUM_REPO/.worktrees/018-sqlite-dist/dist"
printf 'x\n' > "$NUM_REPO/.worktrees/018-sqlite-dist/dist/out.js"
printf 'rows\n' > "$NUM_REPO/.worktrees/018-sqlite-dist/dist/session.sqlite"
num_add 019-state-cache
mkdir -p "$NUM_REPO/.worktrees/019-state-cache/.pytest_cache/.state"
printf 'lease\n' > "$NUM_REPO/.worktrees/019-state-cache/.pytest_cache/.state/lease"
# A branch squash-merged into the primary checkout is not its ancestor, and a branch whose
# change collides with a later edit in the primary checkout is not merged at all.
num_add 016-squashed
printf 'squashed\n' > "$NUM_REPO/.worktrees/016-squashed/squashed.txt"
git -C "$NUM_REPO/.worktrees/016-squashed" add squashed.txt
git -C "$NUM_REPO/.worktrees/016-squashed" commit -q -m "squashed work"
num_add 017-conflict
printf 'branch side\n' > "$NUM_REPO/.worktrees/017-conflict/README"
git -C "$NUM_REPO/.worktrees/017-conflict" commit -q -am "branch edit"
git -C "$NUM_REPO" merge --squash worktrees/016-squashed >/dev/null
git -C "$NUM_REPO" commit -q -m "squash of 016"
printf 'primary side\n' > "$NUM_REPO/README"
git -C "$NUM_REPO" commit -q -am "primary edit"
# A folder git does not know about.
mkdir -p "$NUM_REPO/.worktrees/099-orphan"
printf 'precious\n' > "$NUM_REPO/.worktrees/099-orphan/notes.txt"
( cd "$NUM_REPO/.worktrees/007-process" && exec sleep 120 ) &
NUM_BUSY_PID=$!
STUB_PIDS="$STUB_PIDS $NUM_BUSY_PID"
sleep 0.5
for n in 001-lockref 002-ok 004-specs-log 005-untracked 006-unpushed 007-process 008-locked 009-stash 013-ignored 014-regen 015-regen-mixed 016-squashed 017-conflict 018-sqlite-dist 019-state-cache; do
  num_age "$n"
done
# 003-fresh keeps its creation times; 011-mismatch is aged under its branch's name.
touch -t 202001010000 "$NUM_COMMON/logs/refs/heads/worktrees/011-mismatch"
# git refuses to delete a branch whose ref file is locked.
: > "$NUM_COMMON/refs/heads/worktrees/001-lockref.lock"

list_state() { # list_state  -- worktree folders and branches, to compare before and after
  ( cd "$NUM_REPO/.worktrees" && ls -1 ) | sort
  git -C "$NUM_REPO" for-each-ref --format='%(refname)' refs/heads | sort
}
NUM_STATE_BEFORE="$(list_state)"

NUM_FSMON_LOG="$SHIM_DIR/fsmon-reaper.log"
printf '#!/bin/sh\nprintf "%%s\\n" "$*" >> "%s"\n' "$NUM_FSMON_LOG" > "$SHIM_DIR/fsmon-reaper-stub.sh"
run_num() { # run_num <out> [reaper args...]  -- inside the numbered fixture repo
  local out="$1"; shift
  NUM_RC=0
  ( cd "$NUM_REPO" && SPECKIT_FSMON_REAPER="$SHIM_DIR/fsmon-reaper-stub.sh" bash "$REAPER" "$@" ) >"$out" 2>&1 || NUM_RC=$?
}

# Without the flag the lane is off: nothing numbered is touched.
NUM_OFF_OUT="$SHIM_DIR/num-off.out"
run_num "$NUM_OFF_OUT"
expect "numbered lane off by default: 002-ok kept" test -d "$NUM_REPO/.worktrees/002-ok"
expect "numbered lane off by default: state unchanged" test "$NUM_STATE_BEFORE" = "$(list_state)"

# --dry-run changes nothing and says what it would do.
NUM_DRY_OUT="$SHIM_DIR/num-dry.out"
NUM_SCRATCH_TMP="$SHIM_DIR/num-tmp"
mkdir -p "$NUM_SCRATCH_TMP"
NUM_OBJECTS_BEFORE="$(git -C "$NUM_REPO" count-objects -v)"
TMPDIR="$NUM_SCRATCH_TMP" run_num "$NUM_DRY_OUT" --numbered --dry-run
NUM_OBJECTS_AFTER="$(git -C "$NUM_REPO" count-objects -v)"
expect "numbered dry-run exits 0" test "$NUM_RC" -eq 0
expect "numbered dry-run: state unchanged" test "$NUM_STATE_BEFORE" = "$(list_state)"
expect "numbered dry-run: names 002-ok as would-reap" grep -Eq "^numbered verdict=would-reap worktree=.*/002-ok " "$NUM_DRY_OUT"
expect "numbered dry-run: names 014-regen as would-reap" grep -Eq "^numbered verdict=would-reap worktree=.*/014-regen " "$NUM_DRY_OUT"
expect "numbered dry-run: starts no fsmonitor reaper" test ! -e "$NUM_FSMON_LOG"
expect "numbered dry-run: reports the orphan folder" grep -Eq "^orphan path=.*/099-orphan$" "$NUM_DRY_OUT"
# The squash check merges in memory, and git writes the merged tree and any conflict blobs.
# They have to land in a scratch store: a dry run writes nothing to the repository.
expect "numbered dry-run: the object store is unchanged" test "$NUM_OBJECTS_BEFORE" = "$NUM_OBJECTS_AFTER"
expect "numbered dry-run: the scratch object store is removed" test -z "$(ls -A "$NUM_SCRATCH_TMP")"
expect "numbered dry-run: still tells a squash merge from a collision" grep -Eq "^numbered verdict=keep worktree=.*/016-squashed .*reason=branch content already in the live branch \(squash-merged\); remove by hand$" "$NUM_DRY_OUT"
expect "numbered dry-run: an unmerged branch stays unmerged" grep -Eq "^numbered verdict=keep worktree=.*/006-unpushed .*reason=branch is not merged into the live branch$" "$NUM_DRY_OUT"

# An empty process listing keeps even the worktree that qualifies.
NUM_LSOF_OUT="$SHIM_DIR/num-lsof.out"
( cd "$NUM_REPO" && PATH="$SHIM_DIR/empty-lsof:$PATH" SPECKIT_FSMON_REAPER="$SHIM_DIR/fsmon-reaper-stub.sh" bash "$REAPER" --numbered ) >"$NUM_LSOF_OUT" 2>&1 || true
expect "empty process listing: 002-ok kept" test -d "$NUM_REPO/.worktrees/002-ok"
expect "empty process listing: reason recorded" grep -Eq "^numbered verdict=keep worktree=.*/002-ok .*reason=process listing unavailable" "$NUM_LSOF_OUT"

# A listing that exits non-zero after printing rows is no proof either.
NUM_PARTIAL_OUT="$SHIM_DIR/num-partial.out"
( cd "$NUM_REPO" && PATH="$SHIM_DIR/partial-lsof:$PATH" SPECKIT_FSMON_REAPER="$SHIM_DIR/fsmon-reaper-stub.sh" bash "$REAPER" --numbered --dry-run ) >"$NUM_PARTIAL_OUT" 2>&1 || true
expect "partial process listing: 002-ok kept" grep -Eq "^numbered verdict=keep worktree=.*/002-ok .*reason=process listing unavailable" "$NUM_PARTIAL_OUT"
expect "partial process listing: nothing would be reaped" test -z "$(grep -E '^numbered verdict=would-reap' "$NUM_PARTIAL_OUT" || true)"

# An unreadable registry yields no verdict and no orphan report: with no list, every folder
# under the base would look unregistered.
for REG_MODE in dead hung; do
  NUM_REG_OUT="$SHIM_DIR/num-$REG_MODE-registry.out"
  NUM_RC=0
  ( cd "$NUM_REPO" && PATH="$SHIM_DIR/$REG_MODE-registry-git:$PATH" SPECKIT_GIT_TIMEOUT=1 SPECKIT_FSMON_REAPER="$SHIM_DIR/fsmon-reaper-stub.sh" bash "$REAPER" --numbered ) >"$NUM_REG_OUT" 2>&1 || NUM_RC=$?
  expect "$REG_MODE registry (numbered): the run still exits 0" test "$NUM_RC" -eq 0
  expect "$REG_MODE registry (numbered): no verdict row is printed" test -z "$(grep -E '^numbered verdict=' "$NUM_REG_OUT" || true)"
  expect "$REG_MODE registry (numbered): no orphan is reported" test -z "$(grep -E '^orphan path=' "$NUM_REG_OUT" || true)"
  expect "$REG_MODE registry (numbered): 002-ok kept" test -d "$NUM_REPO/.worktrees/002-ok"
done

# A wedged git status costs one bound, then the worktree is kept.
mkdir -p "$SHIM_DIR/wedged-git"
GIT_SHIM_LOG="$SHIM_DIR/git-calls.log"
cat > "$SHIM_DIR/wedged-git/git" <<SHIM
#!/bin/sh
printf '%s\n' "\$*" >> "$GIT_SHIM_LOG"
for a in "\$@"; do
  [ "\$a" = status ] && exec sleep 60
done
exec "$REAL_GIT" "\$@"
SHIM
chmod +x "$SHIM_DIR/wedged-git/git"
NUM_WEDGE_OUT="$SHIM_DIR/num-wedge.out"
WEDGE_START="$(date +%s)"
( cd "$NUM_REPO" && PATH="$SHIM_DIR/wedged-git:$PATH" SPECKIT_GIT_TIMEOUT=2 SPECKIT_FSMON_REAPER="$SHIM_DIR/fsmon-reaper-stub.sh" bash "$REAPER" --numbered ) >"$NUM_WEDGE_OUT" 2>&1 || true
WEDGE_ELAPSED=$(( $(date +%s) - WEDGE_START ))
expect "wedged git status: run ends within a few bounds" test "$WEDGE_ELAPSED" -lt 55
expect "wedged git status: 002-ok kept" test -d "$NUM_REPO/.worktrees/002-ok"
expect "wedged git status: timeout recorded as the reason" grep -Eq "^numbered verdict=keep worktree=.*/002-ok .*reason=git status timed out" "$NUM_WEDGE_OUT"
expect "git calls that read a tree run with fsmonitor off" \
  test -z "$(grep -E ' (status|ls-files|merge-base|merge-tree|branch|stash|prune|remove)( |$)' "$GIT_SHIM_LOG" | grep -v 'core.fsmonitor=false' || true)"
expect "the shim saw the reaper's status calls" grep -Eq 'core.fsmonitor=false .*status' "$GIT_SHIM_LOG"
expect "the shim saw the reaper's merge-tree call" grep -Eq 'core.fsmonitor=false .*merge-tree' "$GIT_SHIM_LOG"

# The real sweep.
NUM_OUT="$SHIM_DIR/num-real.out"
run_num "$NUM_OUT" --numbered
expect "numbered sweep exits 0 although git refused a branch delete" test "$NUM_RC" -eq 0
expect "002-ok: folder removed" test ! -d "$NUM_REPO/.worktrees/002-ok"
expect "002-ok: branch removed" test ! -e "$NUM_COMMON/refs/heads/worktrees/002-ok"
expect "002-ok: fsmonitor reaper ran first" grep -Fq "002-ok" "$NUM_FSMON_LOG"
expect "001-lockref: folder removed" test ! -d "$NUM_REPO/.worktrees/001-lockref"
expect "001-lockref: branch kept after git refused -d" test -e "$NUM_COMMON/refs/heads/worktrees/001-lockref"
expect "001-lockref: refusal logged as keep" grep -F "git refused to delete" "$NUM_OUT"
expect "014-regen: folder removed although it holds only listed regenerable files" test ! -d "$NUM_REPO/.worktrees/014-regen"
expect "014-regen: branch removed" test ! -e "$NUM_COMMON/refs/heads/worktrees/014-regen"
for n in 003-fresh 004-specs-log 005-untracked 006-unpushed 007-process 008-locked 009-stash 010-human 011-folder 012-detached 013-ignored 015-regen-mixed 016-squashed 017-conflict 018-sqlite-dist 019-state-cache; do
  expect "$n: folder kept" test -d "$NUM_REPO/.worktrees/$n"
done
for b in worktrees/003-fresh worktrees/004-specs-log worktrees/005-untracked worktrees/006-unpushed worktrees/007-process worktrees/008-locked worktrees/009-stash other/010-human worktrees/011-mismatch worktrees/013-ignored worktrees/015-regen-mixed worktrees/016-squashed worktrees/017-conflict worktrees/018-sqlite-dist worktrees/019-state-cache; do
  expect "$b: branch kept" git -C "$NUM_REPO" show-ref --verify --quiet "refs/heads/$b"
done
expect "003-fresh: kept for recent activity" grep -Eq "^numbered verdict=keep worktree=.*/003-fresh .*reason=active within" "$NUM_OUT"
expect "004-specs-log: kept for the ignored spec file" grep -Eq "^numbered verdict=keep worktree=.*/004-specs-log .*reason=ignored path is not regenerable: specs/a/x.log" "$NUM_OUT"
expect "005-untracked: kept for the untracked file" grep -Eq "^numbered verdict=keep worktree=.*/005-untracked .*reason=uncommitted or untracked" "$NUM_OUT"
expect "006-unpushed: kept as unmerged" grep -Eq "^numbered verdict=keep worktree=.*/006-unpushed .*reason=branch is not merged" "$NUM_OUT"
expect "007-process: kept for the live process, naming it" grep -Eq "^numbered verdict=keep worktree=.*/007-process .*reason=live process inside; pid $NUM_BUSY_PID" "$NUM_OUT"
expect "008-locked: kept as locked" grep -Eq "^numbered verdict=keep worktree=.*/008-locked .*reason=locked" "$NUM_OUT"
expect "009-stash: kept for its stash entry" grep -Eq "^numbered verdict=keep worktree=.*/009-stash .*reason=a stash entry belongs" "$NUM_OUT"
expect "011-folder: kept as a mismatched pair" grep -Eq "^numbered verdict=keep worktree=.*/011-folder .*reason=not a numbered branch and folder pair" "$NUM_OUT"
expect "013-ignored: kept for the ignored file that is no provisioned link" grep -Eq "^numbered verdict=keep worktree=.*/013-ignored .*reason=ignored path is not regenerable: local-note.txt" "$NUM_OUT"
expect "015-regen-mixed: kept for the unlisted file beside a listed one" grep -Eq "^numbered verdict=keep worktree=.*/015-regen-mixed .*reason=ignored path is not regenerable: .*/trace.log$" "$NUM_OUT"
expect "016-squashed: kept, reported as squash-merged" grep -Eq "^numbered verdict=keep worktree=.*/016-squashed .*reason=branch content already in the live branch \(squash-merged\); remove by hand$" "$NUM_OUT"
expect "017-conflict: kept as unmerged when its change collides with the live branch" grep -Eq "^numbered verdict=keep worktree=.*/017-conflict .*reason=branch is not merged into the live branch$" "$NUM_OUT"
expect "018-sqlite-dist: kept for a database inside a rebuildable folder" grep -Eq "^numbered verdict=keep worktree=.*/018-sqlite-dist .*reason=ignored path is not regenerable: dist" "$NUM_OUT"
expect "019-state-cache: kept for a .state folder inside a rebuildable folder" grep -Eq "^numbered verdict=keep worktree=.*/019-state-cache .*reason=ignored path is not regenerable: .pytest_cache" "$NUM_OUT"
expect "orphan folder: untouched" test -f "$NUM_REPO/.worktrees/099-orphan/notes.txt"
expect "orphan folder: reported" grep -Eq "^orphan path=.*/099-orphan$" "$NUM_OUT"
expect "the registered folders are never reported as orphans" test -z "$(grep -E '^orphan path=.*/(00[1-9]|01[0-9])-' "$NUM_OUT" || true)"
expect "the stash entry survives the sweep" test -n "$(git -C "$NUM_REPO" stash list)"
expect "main checkout untouched" test -f "$NUM_REPO/README"
expect_not "numbered lane never forces a removal" grep -Eq 'worktree remove (-f|--force)|branch -D' "$REAPER"

# The idle clock is injectable, and --idle-hours sets the threshold.
NUM_LATE_OUT="$SHIM_DIR/num-late.out"
WORKTREE_REAPER_NOW="$(( $(date +%s) + 72 * 3600 ))" run_num "$NUM_LATE_OUT" --numbered --dry-run
expect "a later clock makes 003-fresh idle" grep -Eq "^numbered verdict=would-reap worktree=.*/003-fresh " "$NUM_LATE_OUT"
NUM_LONG_OUT="$SHIM_DIR/num-long.out"
WORKTREE_REAPER_NOW="$(( $(date +%s) + 72 * 3600 ))" run_num "$NUM_LONG_OUT" --numbered --dry-run --idle-hours 200
expect "--idle-hours 200 keeps 003-fresh again" grep -Eq "^numbered verdict=keep worktree=.*/003-fresh .*reason=active within the last 200 hours" "$NUM_LONG_OUT"
run_num "$SHIM_DIR/num-bad.out" --numbered --idle-hours soon
expect "a non-numeric --idle-hours exits 2" test "$NUM_RC" -eq 2

kill "$NUM_BUSY_PID" 2>/dev/null || true
wait "$NUM_BUSY_PID" 2>/dev/null || true
rm -f "$NUM_COMMON/refs/heads/worktrees/001-lockref.lock"

if [ "$FAIL" -ne 0 ]; then
  for f in "$SHIM_DIR"/num-*.out; do
    [ -f "$f" ] || continue
    echo "--- $(basename "$f") ---"
    cat "$f"
  done
fi
if [ "$FAIL" -ne 0 ]; then
  echo "--- reaper output (rc=$REAPER_RC) ---"
  cat "$REAPER_OUT"
  echo "--------------------------------------"
fi

echo "worktree-reaper tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
