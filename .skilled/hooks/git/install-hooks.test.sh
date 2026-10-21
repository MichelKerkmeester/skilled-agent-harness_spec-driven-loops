#!/usr/bin/env bash
# Test harness for the hook installer's destination choice.
#
# WHY: a linked worktree keeps .git as a file, so an installer that assumes
# .git/hooks aborts, and core.hooksPath can move the hooks directory entirely.
# This proves the installer follows the directory Git reports from a main
# checkout, from a linked worktree, and under a custom hooks path. Every case
# runs against throwaway repositories under one temp directory.
#
# Exit 0 = all pass, 1 = any failure.
set -uo pipefail

unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES
export GIT_CONFIG_GLOBAL=/dev/null
export GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME=test GIT_AUTHOR_EMAIL=test@example.com
export GIT_COMMITTER_NAME=test GIT_COMMITTER_EMAIL=test@example.com

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALLER="$HERE/install-hooks.sh"
PRECOMMIT="$HERE/pre-commit"

PASS=0; FAIL=0
TMP="$(mktemp -d "${TMPDIR:-/tmp}/install-hooks-test.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT

check() { # check <label> <yes|no> <detail>
  local label="$1" result="$2" detail="${3:-}"
  if [[ "$result" == yes ]]; then
    echo "PASS  $label"; PASS=$((PASS + 1))
  else
    echo "FAIL  $label${detail:+: $detail}"; FAIL=$((FAIL + 1))
  fi
}

make_repo() { # make_repo <dir>: a committed repo carrying a copy of the installer
  git init -q "$1"
  git -C "$1" commit -q --allow-empty -m init
  mkdir -p "$1/.skilled/hooks/git"
  cp "$INSTALLER" "$PRECOMMIT" "$1/.skilled/hooks/git/"
  chmod +x "$1/.skilled/hooks/git/install-hooks.sh" "$1/.skilled/hooks/git/pre-commit"
  git -C "$1" add .skilled
  git -C "$1" commit -q -m hooks
}

hooks_dir() { # hooks_dir <repo>: the hooks folder Git reports, made absolute
  local repo="$1" path
  path="$(git -C "$repo" rev-parse --git-path hooks)"
  [[ "$path" == /* ]] || path="$repo/$path"
  printf '%s\n' "$path"
}

canonical() { # canonical <path>: resolve the directory without changing the leaf
  printf '%s/%s\n' "$(cd "$(dirname "$1")" && pwd -P)" "$(basename "$1")"
}

run_installer() { # run_installer <repo>: run the copy that repo carries
  ( cd "$1/.skilled/hooks/git" && bash ./install-hooks.sh ) >"$TMP/install.log" 2>&1
}

expect_install() { # expect_install <label> <run-root> <repo> <source-root>
  local label="$1" dir="$2" repo="$3" source="$4" hooks target want rc
  hooks="$(hooks_dir "$repo")"
  if run_installer "$dir"; then rc=0; else rc=$?; fi
  if [[ "$rc" -ne 0 ]]; then
    check "$label" no "installer exited $rc: $(tail -n 1 "$TMP/install.log")"
    return
  fi
  target=""
  [[ -L "$hooks/pre-commit" ]] && target="$(readlink "$hooks/pre-commit")"
  want="$source/.skilled/hooks/git/pre-commit"
  check "$label" \
    "$([[ -n "$target" && "$(canonical "$target")" == "$(canonical "$want")" ]] && echo yes || echo no)" \
    "pre-commit in $hooks points at '${target:-nothing}'"
}

# ── 1. the main checkout installs into its own hooks folder ──
MAIN="$TMP/main"
make_repo "$MAIN"
expect_install "installs into the main checkout's hooks folder" "$MAIN" "$MAIN" "$MAIN"

# ── 2. a linked worktree installs into the folder Git names for it ──
rm -f "$(hooks_dir "$MAIN")/pre-commit"
WORKTREE="$TMP/worktree"
git -C "$MAIN" worktree add -q --detach "$WORKTREE" HEAD
expect_install "installs from a linked worktree's copy" "$WORKTREE" "$WORKTREE" "$WORKTREE"

# ── 3. core.hooksPath moves the destination ──
CUSTOM="$TMP/custom"
make_repo "$CUSTOM"
git -C "$CUSTOM" config core.hooksPath custom-hooks
expect_install "honours a custom core.hooksPath" "$CUSTOM" "$CUSTOM" "$CUSTOM"
check "the default hooks folder stays untouched under core.hooksPath" \
  "$([[ ! -e "$CUSTOM/.git/hooks/pre-commit" ]] && echo yes || echo no)" \
  "$CUSTOM/.git/hooks/pre-commit exists"

if [[ "$FAIL" -eq 0 ]]; then
  echo "PASS $PASS"
else
  echo "FAIL $FAIL (of $((PASS + FAIL)))"
fi
[[ "$FAIL" -eq 0 ]]
