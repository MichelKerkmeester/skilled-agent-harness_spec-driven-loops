#!/usr/bin/env bash
# Test harness for stamp-branch.sh. Runs entirely inside a throwaway git repo
# so it never mints ordinals or rewrites refs in the real clone. Exercises the
# dirty-worktree and non-ancestor refusals, a dry run that mints nothing, and a
# real run that stamps only the id-less commits in its unique range.
set -uo pipefail

# git resolves its repository and config from these variables in preference to the working
# directory. If the caller's environment has any set (routine inside a git worktree), the
# fixture's git writes would escape $TMP and hit the real, shared repository. Clear them so
# `cd "$REPO"` is the only thing that selects the repo.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_GLOBAL GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
STAMP="$SCRIPT_DIR/stamp-branch.sh"

PASS=0; FAIL=0
_rc() { if "$@" >/dev/null 2>&1; then echo 0; else echo $?; fi; }
expect_rc() { # expect_rc <desc> <expected-rc> <cmd...>
  local desc="$1" exp="$2"; shift 2
  local rc; rc="$(_rc "$@")"
  if [ "$rc" = "$exp" ]; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $desc (rc=$rc exp=$exp)"; fi
}
expect_eq() { # expect_eq <desc> <expected> <actual>
  if [ "$2" = "$3" ]; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $1 (exp='$2' got='$3')"; fi
}

# ── isolated fixture repo ──────────────────────────────────────
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
REPO="$TMP/repo"
mkdir -p "$REPO"
cd "${REPO:?mktemp -d failed}" || exit
git init -q -b main
# Hermetic fixture: override any global core.hooksPath so the shared commit-msg /
# pre-commit gates never run against throwaway test commits.
mkdir -p "$TMP/.nohooks"
git config core.hooksPath "$TMP/.nohooks"
git config user.email t@t.t; git config user.name t
git config commit.gpgsign false

# ── base branch + feature branch of three commits ──────────────
git commit -q --allow-empty -m "base commit"
BASE_SHA="$(git rev-parse HEAD)"
git checkout -q -b feature
git commit -q --allow-empty -m "feat(first): alpha"
git commit -q --allow-empty -m "feat(second): beta" -m "Commit-Id: 0000005"
git commit -q --allow-empty -m "feat(third): gamma" -m "Co-Authored-By: co <co@e.com>"
FEATURE_OLD="$(git rev-parse feature)"

# Snapshot subjects, trees and authors outside the repo so the worktree stays clean.
git log --reverse --format='%s%x1f%T%x1f%an%x1f%ae' "$BASE_SHA..feature" > "$TMP/before.txt"

# ── dirty worktree refusal ─────────────────────────────────────
printf 'scratch\n' > "$REPO/dirty.txt"
expect_rc "dirty worktree refused" 1 bash "$STAMP" feature main
expect_eq "dirty worktree kept tip" "$FEATURE_OLD" "$(git rev-parse feature)"
rm -f "$REPO/dirty.txt"

# ── non-ancestor base refusal ──────────────────────────────────
git branch island "$BASE_SHA"
git checkout -q island
git commit -q --allow-empty -m "island commit"
ISLAND_TIP="$(git rev-parse island)"
git checkout -q feature
expect_rc "non-ancestor base refused" 1 bash "$STAMP" feature island
expect_eq "non-ancestor kept tip" "$FEATURE_OLD" "$(git rev-parse feature)"

# ── dry run lists and mints nothing ────────────────────────────
DRY_OUT="$(bash "$STAMP" --dry-run feature main 2>/dev/null)"; DRY_RC=$?
expect_eq "dry-run rc" 0 "$DRY_RC"
expect_eq "dry-run kept tip" "$FEATURE_OLD" "$(git rev-parse feature)"
case "$DRY_OUT" in *"feat(first): alpha"*) PASS=$((PASS+1)) ;; *) FAIL=$((FAIL+1)); echo "FAIL: dry-run does not list first commit" ;; esac
case "$DRY_OUT" in *"feat(third): gamma"*) PASS=$((PASS+1)) ;; *) FAIL=$((FAIL+1)); echo "FAIL: dry-run does not list third commit" ;; esac
case "$DRY_OUT" in *"feat(second): beta"*) FAIL=$((FAIL+1)); echo "FAIL: dry-run lists the already-stamped middle commit" ;; *) PASS=$((PASS+1)) ;; esac
if [ -f "$REPO/.git/commit-id-number.highwater" ]; then
  FAIL=$((FAIL+1)); echo "FAIL: dry-run minted a high-water mark"
else
  PASS=$((PASS+1))
fi

# ── real run stamps exactly the two id-less commits ────────────
RUN_OUT="$(bash "$STAMP" feature main 2>/dev/null)"; RUN_RC=$?
expect_eq "real run rc" 0 "$RUN_RC"
FEATURE_NEW="$(git rev-parse feature)"
case "$RUN_OUT" in *"$FEATURE_OLD"*) PASS=$((PASS+1)) ;; *) FAIL=$((FAIL+1)); echo "FAIL: run output omits the old tip" ;; esac
case "$RUN_OUT" in *"$FEATURE_NEW"*) PASS=$((PASS+1)) ;; *) FAIL=$((FAIL+1)); echo "FAIL: run output omits the new tip" ;; esac
case "$RUN_OUT" in *"2 commits stamped"*) PASS=$((PASS+1)) ;; *) FAIL=$((FAIL+1)); echo "FAIL: run output omits the stamped count" ;; esac
if [ "$FEATURE_NEW" != "$FEATURE_OLD" ]; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: feature tip did not change"; fi

git log --reverse --format='%s%x1f%T%x1f%an%x1f%ae' "$BASE_SHA..feature" > "$TMP/after.txt"
expect_eq "subjects, trees and authors preserved" "$(cat "$TMP/before.txt")" "$(cat "$TMP/after.txt")"
expect_eq "base branch untouched" "$BASE_SHA" "$(git rev-parse main)"
expect_eq "unrelated branch untouched" "$ISLAND_TIP" "$(git rev-parse island)"

FIRST_ID="$(git log -1 --format=%B feature~2 | grep -E '^Commit-Id: [0-9]{7}$' | sed 's/^Commit-Id: //')"
MID_ID="$(git log -1 --format=%B feature~1 | grep -E '^Commit-Id: [0-9]{7}$' | sed 's/^Commit-Id: //')"
THIRD_ID="$(git log -1 --format=%B feature | grep -E '^Commit-Id: [0-9]{7}$' | sed 's/^Commit-Id: //')"
expect_eq "first commit stamped" 0000006 "$FIRST_ID"
expect_eq "middle commit keeps its id" 0000005 "$MID_ID"
expect_eq "third commit stamped" 0000007 "$THIRD_ID"
expect_eq "stamped ordinals consecutive" 1 "$((10#$THIRD_ID - 10#$FIRST_ID))"

BODY3="$(git log -1 --format=%B feature)"
CID_LINE3="$(printf '%s\n' "$BODY3" | grep -n '^Commit-Id: ' | head -1 | cut -d: -f1)"
CO_LINE3="$(printf '%s\n' "$BODY3" | grep -n '^Co-Authored-By: ' | head -1 | cut -d: -f1)"
if [ -n "$CID_LINE3" ] && [ -n "$CO_LINE3" ] && [ "$CID_LINE3" -lt "$CO_LINE3" ]; then
  PASS=$((PASS+1))
else
  FAIL=$((FAIL+1)); echo "FAIL: Commit-Id not placed before Co-Authored-By (cid='$CID_LINE3' co='$CO_LINE3')"
fi

expect_eq "allocator high-water advanced" 0000007 "$(cat "$REPO/.git/commit-id-number.highwater" 2>/dev/null)"

# ── report ─────────────────────────────────────────────────────
echo "stamp-branch tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
