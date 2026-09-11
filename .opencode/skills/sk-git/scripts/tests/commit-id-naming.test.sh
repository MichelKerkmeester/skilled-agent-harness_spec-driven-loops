#!/usr/bin/env bash
# Test harness for commit-id-naming.sh. Runs entirely inside a throwaway git
# repo so it never mints ordinals in the real clone. Exercises the seven-digit
# validator, the history-derived scan, locked allocation (including concurrent),
# the deleted-cache rebuild path, the ceiling and rebuild-highwater.
set -uo pipefail

# git resolves its repository and config from these variables in preference to the working
# directory. If the caller's environment has any set (routine inside a git worktree), the
# fixture's git writes would escape $TMP and hit the real, shared repository. Clear them so
# `cd "$TMP"` is the only thing that selects the repo.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_GLOBAL GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
NAMING="$SCRIPT_DIR/commit-id-naming.sh"

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
cd "${TMP:?mktemp -d failed}" || exit
git init -q
# Hermetic fixture: override any global core.hooksPath so the shared commit-msg /
# pre-commit gates never run against throwaway test commits.
mkdir -p "$TMP/.nohooks"
git config core.hooksPath "$TMP/.nohooks"
git config user.email t@t.t; git config user.name t
# Fixture commits must not depend on the operator's global signing setup.
git config commit.gpgsign false
BASE_BRANCH="$(git symbolic-ref --quiet --short HEAD)"

# shellcheck source=/dev/null
source "$NAMING"

# ── grammar: seven-digit ordinals 0000001..9999999 ─────────────
expect_rc "validate 0000001 ok" 0 is_valid_commit_id 0000001
expect_rc "validate 0009113 ok" 0 is_valid_commit_id 0009113
expect_rc "validate 9999999 ok" 0 is_valid_commit_id 9999999
expect_rc "validate 0000000 bad" 1 is_valid_commit_id 0000000
expect_rc "validate 6-digit bad" 1 is_valid_commit_id 9113
expect_rc "validate 8-digit bad" 1 is_valid_commit_id 10000000
expect_rc "validate alpha bad" 1 is_valid_commit_id abc
expect_rc "validate empty bad" 1 is_valid_commit_id ""

# ── scan-max on empty history ──────────────────────────────────
expect_eq "scan-max empty history" 0 "$(scan_max_ordinal)"
expect_eq "scan-max CLI empty history" 0 "$(bash "$NAMING" scan-max)"

# ── scan-max across two branches ───────────────────────────────
git commit -q --allow-empty -m init
expect_eq "scan-max ignores id-less commits" 0 "$(scan_max_ordinal)"
git commit -q --allow-empty -m "feat(alpha): first" -m "Commit-Id: 0000004"
git checkout -q -b side
git commit -q --allow-empty -m "feat(beta): second" -m "Commit-Id: 0000007"
expect_eq "scan-max across branches" 7 "$(scan_max_ordinal)"
git checkout -q "$BASE_BRANCH"
expect_eq "scan-max sees other-branch id" 7 "$(scan_max_ordinal)"

# ── next previews without lock or write ────────────────────────
rm -f "$(_ci_highwater_file)"
expect_eq "next previews max+1" 0000008 "$(next_ordinal)"
expect_rc "next wrote no high-water" 1 test -f "$(_ci_highwater_file)"

# ── allocate mints max+1 and persists it ───────────────────────
expect_eq "allocate mints max+1" 0000008 "$(allocate_ordinal)"
expect_eq "allocate persisted high-water" 0000008 "$(cat "$(_ci_highwater_file)")"
expect_eq "scan-max sees cached high-water" 8 "$(scan_max_ordinal)"

# ── concurrent allocation: distinct and consecutive ────────────
( cd "$TMP" && bash -c 'source "'"$NAMING"'"; allocate_ordinal' ) > "$TMP/alloc.1" 2>/dev/null &
( cd "$TMP" && bash -c 'source "'"$NAMING"'"; allocate_ordinal' ) > "$TMP/alloc.2" 2>/dev/null &
wait
A1="$(cat "$TMP/alloc.1")"
A2="$(cat "$TMP/alloc.2")"
if [ -z "$A1" ] || [ -z "$A2" ]; then
  FAIL=$((FAIL+1)); echo "FAIL: concurrent allocates produced no output (a1='$A1' a2='$A2')"
else
  LO=$((10#$A1)); HI=$((10#$A2))
  if [ "$LO" -gt "$HI" ]; then SWAP="$LO"; LO="$HI"; HI="$SWAP"; fi
  expect_eq "concurrent allocates distinct-consecutive" 1 "$((HI - LO))"
  expect_eq "concurrent allocates start after 8" 9 "$LO"
  expect_eq "concurrent allocated persisted high-water" 0000010 "$(cat "$(_ci_highwater_file)")"
fi

# ── a deleted high-water is rebuilt from history ───────────────
rm -f "$(_ci_highwater_file)"
expect_eq "deleted cache resumes from history" 0000008 "$(allocate_ordinal)"

# ── ceiling: last value allocates, one beyond is refused ───────
printf '9999998\n' > "$(_ci_highwater_file)"
expect_eq "allocate reaches 9999999" 9999999 "$(allocate_ordinal)"
CEIL_OUT="$(allocate_ordinal 2>/dev/null)"; CEIL_RC=$?
expect_eq "ceiling refusal rc" 1 "$CEIL_RC"
expect_eq "ceiling refusal output" "" "$CEIL_OUT"
NEXT_OUT="$(next_ordinal 2>/dev/null)"; NEXT_RC=$?
expect_eq "next at ceiling rc" 1 "$NEXT_RC"
expect_eq "next at ceiling output" "" "$NEXT_OUT"

# ── CLI entry points ───────────────────────────────────────────
expect_rc "validate CLI accepts" 0 bash "$NAMING" validate 0000025
expect_rc "validate CLI rejects" 1 bash "$NAMING" validate 0000000
printf '0000007\n' > "$(_ci_highwater_file)"
expect_eq "next CLI previews" 0000008 "$(bash "$NAMING" next)"

# ── rebuild-highwater: history is the floor, cache is the mark ─
rm -f "$(_ci_highwater_file)"
expect_eq "rebuild restores deleted cache from history" 0000007 "$(rebuild_highwater)"
printf '0000002\n' > "$(_ci_highwater_file)"
expect_eq "rebuild raises a stale cache" 0000007 "$(rebuild_highwater)"
git commit -q --allow-empty -m "feat(gamma): third" -m "Commit-Id: 0000210"
expect_eq "rebuild picks up a committed id" 0000210 "$(bash "$NAMING" rebuild-highwater)"
printf '0000300\n' > "$(_ci_highwater_file)"
expect_eq "rebuild keeps a reserved high-water" 0000300 "$(rebuild_highwater)"
HISTORY_MAX="$(git log --all --format='%B' | grep -E '^Commit-Id: [0-9]{7}$' | sed 's/^Commit-Id: //' | sort | tail -1)"
HW_VALUE="$(cat "$(_ci_highwater_file)")"
expect_eq "high-water never below history after rebuild" 1 \
  "$([ "$((10#$HW_VALUE))" -ge "$((10#$HISTORY_MAX))" ] && echo 1 || echo 0)"

# ── report ─────────────────────────────────────────────────────
echo "commit-id-naming tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
