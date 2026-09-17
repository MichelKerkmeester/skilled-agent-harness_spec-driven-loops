#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: git-sync SHA-rewrite log test
# ───────────────────────────────────────────────────────────────
# When the live branch has moved, git-sync rebases the session's commits onto it. Every
# rebased commit gets a new object id, so a run that pinned a SHA before the sync has no
# way to learn which of its references went stale unless the rewrite is recorded. This
# test drives the real git-sync through the diverged-non-conflicting path against a bare
# origin and asserts the sync log carries one `rewrite old=<sha> new=<sha>` line per
# rebased commit.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
GITSYNC="$SCRIPT_DIR/git-sync.sh"

PASS=0
FAIL=0
ok()  { PASS=$((PASS+1)); }
bad() { FAIL=$((FAIL+1)); echo "FAIL: $1"; }
eq()  { if [ "$2" = "$3" ]; then ok; else bad "$1 (want=$2 got=$3)"; fi; }

TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

# A local email/name plus an empty hooks path keeps every fixture hermetic: no repo hook
# fires, so the script under test is the only actor touching the branch.
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

S="$TMP/session"
init_repo "$S" "skilled/v4.0.0.0"
commit_file "$S" a "s0-init"

git init -q --bare "$TMP/remote.git"
git -C "$S" remote add origin "$TMP/remote.git"
git -C "$S" push -q origin skilled/v4.0.0.0      # origin live = s0

# Session branch (BRANCH != LIVE) with two of its own commits.
git -C "$S" checkout -q -b work/test-session
commit_file "$S" s1 "s1-session"
commit_file "$S" s2 "s2-session"
OLD1="$(git -C "$S" rev-parse HEAD~1)"
OLD2="$(git -C "$S" rev-parse HEAD)"

# Live branch diverges on the remote: a sibling clone adds one commit on top of s0.
# The clone gets its own empty hooks path so ambient pre-push gates never block this
# setup push -- the divergence is a fixture precondition, not the thing under test.
git clone -q "$TMP/remote.git" "$TMP/rc"
git -C "$TMP/rc" config user.email t@t.t
git -C "$TMP/rc" config user.name t
mkdir -p "$TMP/rc/.nohooks"
git -C "$TMP/rc" config core.hooksPath "$TMP/rc/.nohooks"
git -C "$TMP/rc" checkout -q -B skilled/v4.0.0.0 origin/skilled/v4.0.0.0
commit_file "$TMP/rc" z "s3-remote"
git -C "$TMP/rc" push -q origin skilled/v4.0.0.0

( cd "$S" && env -u SYSTEM_LIVE_SYNC_DISABLED -u SYSTEM_HOOKS_DISABLED \
    SPECKIT_LIVE_BRANCH=skilled/v4.0.0.0 SPECKIT_LIVE_REMOTE=origin \
    bash "$GITSYNC" --live skilled/v4.0.0.0 --auto --quiet ) >/dev/null 2>&1

SYNC_HEAD="$(git -C "$S" rev-parse HEAD)"
REMOTE_HEAD="$(git -C "$S" ls-remote origin skilled/v4.0.0.0 | awk '{print $1}')"
LOG="$S/.git/git-sync.log"

# Preconditions: the sync really rebased and published, and the ids really changed.
if git -C "$S" show-ref --verify --quiet refs/heads/work/test-session; then ok; fi
if [ "$SYNC_HEAD" = "$REMOTE_HEAD" ]; then ok; else bad "precondition: sync published the rebased head (head=$SYNC_HEAD remote=$REMOTE_HEAD)"; fi
if grep -q "rebased onto" "$LOG" 2>/dev/null; then ok; else bad "precondition: sync took the rebase path"; fi
if [ "$OLD2" != "$SYNC_HEAD" ]; then ok; else bad "precondition: rebase rewrote the session head"; fi

# The two rebased commits, in source order, must each appear as an old -> new pair.
NEW1="$(git -C "$S" rev-parse HEAD~1)"
NEW2="$(git -C "$S" rev-parse HEAD)"
if grep -F "old=$OLD1 new=$NEW1" "$LOG" >/dev/null 2>&1; then ok; else bad "rewrite line names the first pair ($OLD1 -> $NEW1)"; fi
if grep -F "old=$OLD2 new=$NEW2" "$LOG" >/dev/null 2>&1; then ok; else bad "rewrite line names the second pair ($OLD2 -> $NEW2)"; fi

# Exactly one rewrite line per rebased commit (two commits -> two lines).
REWRITE_LINES="$(grep -c $'\trewrite\t' "$LOG" 2>/dev/null || true)"
eq "one rewrite line per rebased commit" "2" "$REWRITE_LINES"

if [ "$FAIL" -ne 0 ]; then
  echo "--- git-sync.log ---"
  cat "$LOG" 2>/dev/null || echo "(no log)"
  echo "--------------------"
fi

echo "git-sync sha-rewrite-log tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
