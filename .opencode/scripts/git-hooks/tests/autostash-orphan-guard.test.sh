#!/usr/bin/env bash
# Test harness for the autostash orphan guard.
#
# WHY: the guard is the only thing between a conflicted `rebase --autostash` and a
# silently lost uncommitted changeset, so its hook wiring must be proven with git
# invoking the hook, not the test calling the guard by hand. Runs in a throwaway
# repo with an isolated hooksPath so no machine-global hook interferes.
#
# Exit 0 = all pass, 1 = any failure.
set -uo pipefail

unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOKS_DIR="$HERE/.."

if [[ ! -f "$HOOKS_DIR/lib/autostash-orphan-guard.sh" ]]; then
  echo "FAIL: guard lib not found at $HOOKS_DIR/lib/autostash-orphan-guard.sh" >&2
  exit 1
fi

pass=0; fail=0
chk() { # <actual> <expected> <name>
  if [[ "$1" == "$2" ]]; then echo "PASS: $3"; pass=$((pass + 1))
  else echo "FAIL: $3 (got '$1' want '$2')"; fail=$((fail + 1)); fi
}
first_ref() { git -C "$T" for-each-ref --format='%(objectname)' --count=1 "$1" 2>/dev/null || true; }

export GIT_CONFIG_GLOBAL=/dev/null
T="$(mktemp -d "${TMPDIR:-/tmp}/autostash-guard-test.XXXXXX")"
trap 'rm -rf "$T"' EXIT

# Install the shipped post-rewrite and post-commit hooks into the fixture through
# core.hooksPath, so git itself invokes the guard during the real operations.
setup_repo() {
  rm -rf "$T"; mkdir -p "$T"
  git -C "$T" init -q
  git -C "$T" config user.email t@t
  git -C "$T" config user.name t
  git -C "$T" config commit.gpgsign false
  mkdir -p "$T/.opencode/scripts/git-hooks/lib"
  cp "$HOOKS_DIR/lib/autostash-orphan-guard.sh" "$T/.opencode/scripts/git-hooks/lib/"
  cp "$HOOKS_DIR/post-rewrite" "$T/.opencode/scripts/git-hooks/"
  cp "$HOOKS_DIR/post-commit" "$T/.opencode/scripts/git-hooks/"
  chmod +x "$T/.opencode/scripts/git-hooks/post-rewrite" "$T/.opencode/scripts/git-hooks/post-commit"
  git -C "$T" config core.hooksPath "$T/.opencode/scripts/git-hooks"
}

# ── 1. a conflicting rebase --autostash is anchored by post-rewrite ──
# post-rewrite runs before git re-applies the autostash, so refs/stash is empty at
# hook time and only the sequencer's recorded object can be anchored there.
setup_repo
printf 'base\n' > "$T/f.txt"; printf 'base\n' > "$T/g.txt"
git -C "$T" add f.txt g.txt; git -C "$T" commit -qm base
printf 'main\n' > "$T/f.txt"; git -C "$T" add f.txt; git -C "$T" commit -qm main
git -C "$T" checkout -q -b topic HEAD~1
printf 'topic\n' > "$T/g.txt"; git -C "$T" add g.txt; git -C "$T" commit -qm topic
# An uncommitted edit that conflicts when git re-applies the autostash onto main.
printf 'work\n' > "$T/f.txt"
git -C "$T" rebase --autostash main >/dev/null 2>&1 || true
rescue_sha="$(first_ref refs/autostash-rescue/)"
stash_sha="$(git -C "$T" stash list --format='%H' 2>/dev/null | head -1)"
chk "$rescue_sha" "$stash_sha" "conflicting rebase --autostash is anchored at its stash object"

# ── 2. post-commit anchors a leftover autostash entry on the next commit ──
setup_repo
printf 'base\n' > "$T/f.txt"; git -C "$T" add f.txt; git -C "$T" commit -qm base
printf 'work\n' > "$T/f.txt"
git -C "$T" stash push -qm autostash
printf 'next\n' > "$T/next.txt"; git -C "$T" add next.txt; git -C "$T" commit -qm next
rescue_sha="$(first_ref refs/autostash-rescue/)"
stash_sha="$(git -C "$T" stash list --format='%H' 2>/dev/null | head -1)"
chk "$rescue_sha" "$stash_sha" "post-commit anchors a leftover autostash"

echo "--- autostash-orphan-guard: $pass passed, $fail failed ---"
[[ "$fail" -eq 0 ]]
