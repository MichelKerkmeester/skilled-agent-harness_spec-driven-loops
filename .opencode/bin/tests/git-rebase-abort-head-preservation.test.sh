#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: git rebase-abort HEAD-preservation regression test
# ───────────────────────────────────────────────────────────────
# A pre-existing (stale or foreign) rebase state directory must never let a
# live-sync reconciler rewind the branch. This reproduces the failure where a
# blanket `git rebase --abort` after a failed `git rebase` reset HEAD to a stale
# orig-head, silently dropping a just-made commit, and asserts both reconcilers
# now leave the local commit in place.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
RECONCILE="$SCRIPT_DIR/git-primary-reconcile.sh"
GITSYNC="$SCRIPT_DIR/git-sync.sh"

PASS=0
FAIL=0
ok()  { PASS=$((PASS+1)); }
bad() { FAIL=$((FAIL+1)); echo "FAIL: $1"; }
eq()  { if [ "$2" = "$3" ]; then ok; else bad "$1 (want=$2 got=$3)"; fi; }
present() { if [ -e "$2" ]; then ok; else bad "$1 (missing $2)"; fi; }

TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

# A local email/name plus an empty hooks path keeps every fixture hermetic: no
# repo hook fires, so the script under test is the only actor touching HEAD.
init_repo() {
  local dir="$1" branch="$2"
  git init -q -b "$branch" "$dir"
  git -C "$dir" config user.email t@t.t
  git -C "$dir" config user.name t
  mkdir -p "$dir/.nohooks"
  git -C "$dir" config core.hooksPath "$dir/.nohooks"
}

commit_file() {
  local dir="$1" name="$2" msg="$3"
  printf '%s\n' "$msg" > "$dir/$name"
  git -C "$dir" add "$name"
  git -C "$dir" commit -q -m "$msg"
}

# Build an AUTHENTIC stale rebase-merge directory by starting a real interactive
# rebase that stops on a failing `exec`, saving the state dir, then aborting.
# Its orig-head is the branch's current HEAD; plant it later (after advancing the
# branch) to model a stale rebase whose orig-head is an OLDER commit.
save_stale_rebase() {
  local dir="$1" out="$2"
  GIT_SEQUENCE_EDITOR=true git -C "$dir" -c core.editor=true \
    rebase -i --exec false --root >/dev/null 2>&1 || true
  local sd="$dir/.git/rebase-merge"
  if [ ! -d "$sd" ]; then
    echo "SETUP-ERROR: no rebase-merge produced in $dir" >&2
    return 1
  fi
  rm -rf "$out"
  cp -R "$sd" "$out"
  git -C "$dir" rebase --abort >/dev/null 2>&1 || true
}

# ───────────────────────────────────────────────────────────────
# CASE 1 — git-primary-reconcile.sh (the primary-checkout reconciler)
# ───────────────────────────────────────────────────────────────
P="$TMP/primary"
init_repo "$P" "skilled/v4.0.0.0"
commit_file "$P" a "c0-init"
commit_file "$P" b "c1"
commit_file "$P" c "c2-Y"            # HEAD = Y

git init -q --bare "$TMP/remote.git"
git -C "$P" remote add origin "$TMP/remote.git"
git -C "$P" push -q origin skilled/v4.0.0.0   # origin = Y

# Remote diverges: a sibling clone adds Z on top of Y and publishes it. The clone
# gets its own empty hooks path so the ambient pre-push gates never block this
# setup push — the divergence is a fixture precondition, not the thing under test.
git clone -q "$TMP/remote.git" "$TMP/rc"
git -C "$TMP/rc" config user.email t@t.t
git -C "$TMP/rc" config user.name t
mkdir -p "$TMP/rc/.nohooks"
git -C "$TMP/rc" config core.hooksPath "$TMP/rc/.nohooks"
git -C "$TMP/rc" checkout -q -B skilled/v4.0.0.0 origin/skilled/v4.0.0.0
commit_file "$TMP/rc" z "c3-Z-remote"
git -C "$TMP/rc" push -q origin skilled/v4.0.0.0   # origin = Z (parent Y)

# Stale rebase state whose orig-head is Y (built while HEAD is still Y).
save_stale_rebase "$P" "$TMP/stale-primary"

# The local session then commits X on top of Y — the commit that must survive.
commit_file "$P" x "c4-X-local"
P_X="$(git -C "$P" rev-parse HEAD)"
P_Y="$(git -C "$P" rev-parse HEAD~1)"

# Plant the stale dir: HEAD=X, but a leftover rebase claims orig-head=Y.
cp -R "$TMP/stale-primary" "$P/.git/rebase-merge"
present "primary: pre-state has a planted rebase-merge dir" "$P/.git/rebase-merge"
eq "primary: pre-state HEAD is the local commit X" "$P_X" "$(git -C "$P" rev-parse HEAD)"

( cd "$P" && env -u MK_LIVE_SYNC_DISABLED -u MK_PRIMARY_RECONCILE_DISABLED -u MK_HOOKS_DISABLED \
    SPECKIT_LIVE_BRANCH=skilled/v4.0.0.0 SPECKIT_LIVE_REMOTE=origin \
    bash "$RECONCILE" ) >/dev/null 2>&1

P_AFTER="$(git -C "$P" rev-parse HEAD)"
eq "primary-reconcile: HEAD is NOT rewound to the stale orig-head Y" "$P_X" "$P_AFTER"
if [ "$P_AFTER" = "$P_Y" ]; then
  echo "  -> regression: reconcile aborted a foreign rebase and lost commit $P_X"
fi

# ───────────────────────────────────────────────────────────────
# CASE 2 — git-sync.sh (the worktree publisher, on a session branch)
# ───────────────────────────────────────────────────────────────
S="$TMP/session"
init_repo "$S" "skilled/v4.0.0.0"
commit_file "$S" a "s0-init"
git init -q --bare "$TMP/sremote.git"
git -C "$S" remote add origin "$TMP/sremote.git"
git -C "$S" push -q origin skilled/v4.0.0.0    # origin live = s0

# Session branch (BRANCH != LIVE) diverges from the live tip.
git -C "$S" checkout -q -b work/test-session
commit_file "$S" sa "s1"
commit_file "$S" sy "s2-Y"            # session HEAD = Y2

# Live branch diverges on the remote (a commit the session does not have). Empty
# hooks path on the clone so the ambient pre-push gates never block this setup push.
git clone -q "$TMP/sremote.git" "$TMP/sc"
git -C "$TMP/sc" config user.email t@t.t
git -C "$TMP/sc" config user.name t
mkdir -p "$TMP/sc/.nohooks"
git -C "$TMP/sc" config core.hooksPath "$TMP/sc/.nohooks"
git -C "$TMP/sc" checkout -q -B skilled/v4.0.0.0 origin/skilled/v4.0.0.0
commit_file "$TMP/sc" sz "s3-Z-remote"
git -C "$TMP/sc" push -q origin skilled/v4.0.0.0

save_stale_rebase "$S" "$TMP/stale-session"   # orig-head = Y2 (built on work/test-session)

commit_file "$S" sx "s4-X-local"     # session HEAD = X2 (must survive)
S_X="$(git -C "$S" rev-parse HEAD)"
S_Y="$(git -C "$S" rev-parse HEAD~1)"

cp -R "$TMP/stale-session" "$S/.git/rebase-merge"
present "session: pre-state has a planted rebase-merge dir" "$S/.git/rebase-merge"

( cd "$S" && env -u MK_LIVE_SYNC_DISABLED -u MK_HOOKS_DISABLED \
    SPECKIT_LIVE_BRANCH=skilled/v4.0.0.0 SPECKIT_LIVE_REMOTE=origin \
    bash "$GITSYNC" --live skilled/v4.0.0.0 --auto --quiet ) >/dev/null 2>&1

S_AFTER="$(git -C "$S" rev-parse HEAD)"
eq "git-sync: session HEAD is NOT rewound to the stale orig-head Y" "$S_X" "$S_AFTER"
if [ "$S_AFTER" = "$S_Y" ]; then
  echo "  -> regression: git-sync aborted a foreign rebase and lost commit $S_X"
fi

# ───────────────────────────────────────────────────────────────
# CASE 3 — a GENUINE own-rebase conflict (no stale dir) must still abort
# cleanly and preserve the local commit; the restore guard must not fire.
# ───────────────────────────────────────────────────────────────
P3="$TMP/primary-conflict"
init_repo "$P3" "skilled/v4.0.0.0"
printf 'base\n' > "$P3/shared"; git -C "$P3" add shared; git -C "$P3" commit -q -m c0
git init -q --bare "$TMP/remote3.git"
git -C "$P3" remote add origin "$TMP/remote3.git"
git -C "$P3" push -q origin skilled/v4.0.0.0
git clone -q "$TMP/remote3.git" "$TMP/rc3"
git -C "$TMP/rc3" config user.email t@t.t; git -C "$TMP/rc3" config user.name t
mkdir -p "$TMP/rc3/.nohooks"; git -C "$TMP/rc3" config core.hooksPath "$TMP/rc3/.nohooks"
git -C "$TMP/rc3" checkout -q -B skilled/v4.0.0.0 origin/skilled/v4.0.0.0
printf 'remote-change\n' > "$TMP/rc3/shared"; git -C "$TMP/rc3" add shared; git -C "$TMP/rc3" commit -q -m z3; git -C "$TMP/rc3" push -q origin skilled/v4.0.0.0
printf 'local-change\n' > "$P3/shared"; git -C "$P3" add shared; git -C "$P3" commit -q -m x3
P3_X="$(git -C "$P3" rev-parse HEAD)"
( cd "$P3" && env -u MK_LIVE_SYNC_DISABLED -u MK_PRIMARY_RECONCILE_DISABLED -u MK_HOOKS_DISABLED \
    SPECKIT_LIVE_BRANCH=skilled/v4.0.0.0 SPECKIT_LIVE_REMOTE=origin bash "$RECONCILE" ) >/dev/null 2>&1
eq "reconcile genuine conflict: local commit preserved" "$P3_X" "$(git -C "$P3" rev-parse HEAD)"
if grep -q "rebase conflict aborted cleanly" "$P3/.git/git-primary-reconcile.log" 2>/dev/null; then ok; else bad "reconcile genuine conflict: records a clean abort"; fi
if grep -q "assertion failed" "$P3/.git/git-primary-reconcile.log" 2>/dev/null; then bad "reconcile genuine conflict: must NOT record a false assertion failure"; else ok; fi

# ───────────────────────────────────────────────────────────────
# CASE 4 — a CLEAN divergence must still rebase and publish; the pre-guard
# must not block the normal path.
# ───────────────────────────────────────────────────────────────
P4="$TMP/primary-clean"
init_repo "$P4" "skilled/v4.0.0.0"
commit_file "$P4" base c0
git init -q --bare "$TMP/remote4.git"
git -C "$P4" remote add origin "$TMP/remote4.git"
git -C "$P4" push -q origin skilled/v4.0.0.0
git clone -q "$TMP/remote4.git" "$TMP/rc4"
git -C "$TMP/rc4" config user.email t@t.t; git -C "$TMP/rc4" config user.name t
mkdir -p "$TMP/rc4/.nohooks"; git -C "$TMP/rc4" config core.hooksPath "$TMP/rc4/.nohooks"
git -C "$TMP/rc4" checkout -q -B skilled/v4.0.0.0 origin/skilled/v4.0.0.0
commit_file "$TMP/rc4" rz z4-remote
git -C "$TMP/rc4" push -q origin skilled/v4.0.0.0
commit_file "$P4" lx x4-local
( cd "$P4" && env -u MK_LIVE_SYNC_DISABLED -u MK_PRIMARY_RECONCILE_DISABLED -u MK_HOOKS_DISABLED \
    SPECKIT_LIVE_BRANCH=skilled/v4.0.0.0 SPECKIT_LIVE_REMOTE=origin bash "$RECONCILE" ) >/dev/null 2>&1
present "reconcile clean rebase: remote file present after rebase" "$P4/rz"
present "reconcile clean rebase: local file retained after rebase" "$P4/lx"
P4_AFTER="$(git -C "$P4" rev-parse HEAD)"
P4_REMOTE="$(git -C "$P4" ls-remote origin skilled/v4.0.0.0 | awk '{print $1}')"
eq "reconcile clean rebase: origin advanced to the rebased HEAD" "$P4_AFTER" "$P4_REMOTE"

# ───────────────────────────────────────────────────────────────
# CASE 5 — git-sync genuine conflict still aborts cleanly, preserving the
# session commit; the restore guard must not fire.
# ───────────────────────────────────────────────────────────────
S5="$TMP/session-conflict"
init_repo "$S5" "skilled/v4.0.0.0"
printf 'base\n' > "$S5/shared"; git -C "$S5" add shared; git -C "$S5" commit -q -m s0
git init -q --bare "$TMP/sremote5.git"
git -C "$S5" remote add origin "$TMP/sremote5.git"
git -C "$S5" push -q origin skilled/v4.0.0.0
git -C "$S5" checkout -q -b work/test-session
git clone -q "$TMP/sremote5.git" "$TMP/sc5"
git -C "$TMP/sc5" config user.email t@t.t; git -C "$TMP/sc5" config user.name t
mkdir -p "$TMP/sc5/.nohooks"; git -C "$TMP/sc5" config core.hooksPath "$TMP/sc5/.nohooks"
git -C "$TMP/sc5" checkout -q -B skilled/v4.0.0.0 origin/skilled/v4.0.0.0
printf 'remote-change\n' > "$TMP/sc5/shared"; git -C "$TMP/sc5" add shared; git -C "$TMP/sc5" commit -q -m z5; git -C "$TMP/sc5" push -q origin skilled/v4.0.0.0
printf 'session-change\n' > "$S5/shared"; git -C "$S5" add shared; git -C "$S5" commit -q -m x5
S5_X="$(git -C "$S5" rev-parse HEAD)"
( cd "$S5" && env -u MK_LIVE_SYNC_DISABLED -u MK_HOOKS_DISABLED \
    SPECKIT_LIVE_BRANCH=skilled/v4.0.0.0 SPECKIT_LIVE_REMOTE=origin bash "$GITSYNC" --live skilled/v4.0.0.0 --auto --quiet ) >/dev/null 2>&1
eq "git-sync genuine conflict: session commit preserved" "$S5_X" "$(git -C "$S5" rev-parse HEAD)"
if grep -q "aborted cleanly" "$S5/.git/git-sync.log" 2>/dev/null; then ok; else bad "git-sync genuine conflict: records a clean abort"; fi
if grep -q "abort-failed" "$S5/.git/git-sync.log" 2>/dev/null; then bad "git-sync genuine conflict: must NOT record abort-failed"; else ok; fi

echo "git-rebase-abort-head-preservation tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
