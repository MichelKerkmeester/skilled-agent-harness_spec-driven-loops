#!/usr/bin/env bash
# Test harness for migrate-legacy-branch-names.sh. Runs entirely inside a
# throwaway git repo so it never renames refs or moves worktrees in the real
# clone. Exercises the dry-run plan when a target name already exists: the
# colliding pair must be skipped, kept out of the planned count, and surface a
# non-zero exit so the operator resolves the name before a real run.
set -euo pipefail

# git resolves its repository and config from these variables in preference to the working
# directory. If the caller's environment has any set (routine inside a git worktree), the
# fixture's git writes and the script's reads would escape $TMP and hit the real, shared
# repository. Clear them so `cd "$REPO"` is the only thing that selects the repo.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_GLOBAL GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
MIGRATE="$SCRIPT_DIR/migrate-legacy-branch-names.sh"

PASS=0; FAIL=0
expect_eq() { # expect_eq <desc> <expected> <actual>
  if [ "$2" = "$3" ]; then PASS=$((PASS+1)); else FAIL=$((FAIL+1)); echo "FAIL: $1 (exp='$2' got='$3')"; fi
}
expect_contains() { # expect_contains <desc> <needle> <haystack>
  case "$3" in
    *"$2"*) PASS=$((PASS+1)) ;;
    *) FAIL=$((FAIL+1)); echo "FAIL: $1 (missing '$2')" ;;
  esac
}
expect_not_contains() { # expect_not_contains <desc> <needle> <haystack>
  case "$3" in
    *"$2"*) FAIL=$((FAIL+1)); echo "FAIL: $1 (unexpected '$2')" ;;
    *) PASS=$((PASS+1)) ;;
  esac
}

# ── isolated fixture repo ──────────────────────────────────────
TMP="$(mktemp -d)"
trap 'rm -rf "${TMP:?}"' EXIT
REPO="$TMP/repo"
mkdir -p "$REPO"

# ── a dry run whose target name is taken fails, skips the pair ─
# The legacy branch sk-git/0007-demo would renumber to worktrees/001-demo,
# but that branch already exists. The pair must be skipped with a collision
# note, excluded from the planned count, and the run must exit non-zero so an
# operator resolves the name before a real run.
(
  cd "$REPO" || exit 1
  export GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false
  git init -q -b main
  git config user.email t@t
  git config user.name t
  git commit -q --allow-empty -m init
  git worktree add -q -b sk-git/0007-demo .worktrees/legacy-demo main
  git branch worktrees/001-demo main
)
MIGRATE_RC=0
( cd "$REPO" && GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false \
    bash "$MIGRATE" --dry-run ) > "$TMP/stdout" 2> "$TMP/stderr" || MIGRATE_RC=$?
MIGRATE_ERR="$(cat "$TMP/stderr")"
expect_eq "collision dry-run rc" 1 "$MIGRATE_RC"
expect_contains "collision dry-run names the collision" "collision" "$MIGRATE_ERR"
expect_not_contains "collision dry-run keeps the skipped pair out of the plan" \
  "1 legacy pair(s) planned" "$MIGRATE_ERR"

# ── report ─────────────────────────────────────────────────────
echo "migrate-legacy-branch-names tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
