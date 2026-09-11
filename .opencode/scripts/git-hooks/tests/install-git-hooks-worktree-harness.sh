#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: INSTALL GIT HOOKS WORKTREE HARNESS
# ───────────────────────────────────────────────────────────────
# Verifies hook installation through Git's resolved hook path in linked worktrees.
#
# Exit codes:
#   0 - All scenarios passed
#   1 - Fixture setup or an assertion failed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_REPO="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
INSTALLER="$SOURCE_REPO/.opencode/scripts/install-git-hooks.sh"
TEMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/install-git-hooks-worktree.XXXXXX")"
REPO="$TEMP_ROOT/repo"
WORKTREE="$TEMP_ROOT/linked"
export GIT_CONFIG_GLOBAL=/dev/null

cleanup() {
  rm -rf "$TEMP_ROOT"
}
trap cleanup EXIT

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

normalize_git_path() {
  local worktree="$1"
  local git_path="$2"
  if [[ "$git_path" == /* ]]; then
    printf '%s\n' "$git_path"
  else
    printf '%s\n' "$worktree/$git_path"
  fi
}

mkdir -p "$REPO/.opencode/scripts/git-hooks"
printf '#!/usr/bin/env bash\nexit 0\n' > "$REPO/.opencode/scripts/git-hooks/pre-commit"
chmod +x "$REPO/.opencode/scripts/git-hooks/pre-commit"
git -C "$REPO" init -q
git -C "$REPO" config user.email 'hook-harness@example.invalid'
git -C "$REPO" config user.name 'Hook Harness'
git -C "$REPO" add -f .opencode/scripts/git-hooks/pre-commit
git -C "$REPO" commit -qm 'seed hook fixture'
git -C "$REPO" worktree add -q -b hook-harness-linked "$WORKTREE"

[[ -f "$WORKTREE/.git" ]] || fail 'fixture is not a linked worktree'

linked_output="$TEMP_ROOT/linked-output.txt"
(
  cd "$WORKTREE"
  bash "$INSTALLER"
) > "$linked_output"
linked_hooks="$(git -C "$WORKTREE" rev-parse --git-path hooks)"
linked_hooks="$(normalize_git_path "$WORKTREE" "$linked_hooks")"
[[ -L "$linked_hooks/pre-commit" ]] || fail "linked-worktree hook missing at $linked_hooks/pre-commit"
printf 'PASS linked-worktree: %s\n' "$linked_hooks/pre-commit"

git -C "$WORKTREE" config core.hooksPath .custom-hooks
custom_output="$TEMP_ROOT/custom-output.txt"
(
  cd "$WORKTREE"
  bash "$INSTALLER"
) > "$custom_output"
custom_hooks="$(git -C "$WORKTREE" rev-parse --git-path hooks)"
custom_hooks="$(normalize_git_path "$WORKTREE" "$custom_hooks")"
[[ -L "$custom_hooks/pre-commit" ]] || fail "core.hooksPath hook missing at $custom_hooks/pre-commit"
printf 'PASS core.hooksPath: %s\n' "$custom_hooks/pre-commit"

# --status must make a shadowing core.hooksPath visible instead of claiming the
# checkout's own hooks are live. Clear the local value set above so the global
# config is the only source, then name it.
git -C "$REPO" config --unset core.hooksPath 2>/dev/null || true
global_dir="$TEMP_ROOT/global-hooks"
mkdir -p "$global_dir"
global_cfg="$TEMP_ROOT/global-gitconfig"
git config --file "$global_cfg" core.hooksPath "$global_dir"
status_output="$TEMP_ROOT/status-output.txt"
(
  cd "$REPO"
  GIT_CONFIG_GLOBAL="$global_cfg" bash "$INSTALLER" --status
) > "$status_output"
grep -q "core.hooksPath: $global_dir (global)" "$status_output" \
  || fail "--status did not name the global hooksPath and its scope"
grep -q "resolved hooks dir: $global_dir" "$status_output" \
  || fail "--status did not print the resolved hooks directory"
printf 'PASS --status names the global hooksPath: %s\n' "$global_dir"

printf '%s\n' 'Installer transcript (linked worktree):'
sed 's/^/  /' "$linked_output"
printf '%s\n' 'Installer transcript (core.hooksPath):'
sed 's/^/  /' "$custom_output"
