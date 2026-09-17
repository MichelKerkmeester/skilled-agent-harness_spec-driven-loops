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

# A hook link written through either source-root name belongs to the installer,
# so a reinstall replaces it instead of skipping it as another tool's, and a link
# into some other tool's hooks stays untouched. The fixture holds the tree under
# .skilled with .opencode linked to it. The second installer is a copy whose source
# directory names .skilled, the way the path rewrite leaves it.
LAYOUT_REPO="$TEMP_ROOT/layout-repo"
mkdir -p "$LAYOUT_REPO/.skilled/scripts/git-hooks" "$TEMP_ROOT/other-tool"
printf '#!/usr/bin/env bash\nexit 0\n' > "$LAYOUT_REPO/.skilled/scripts/git-hooks/pre-commit"
chmod +x "$LAYOUT_REPO/.skilled/scripts/git-hooks/pre-commit"
ln -s .skilled "$LAYOUT_REPO/.opencode"
git -C "$LAYOUT_REPO" init -q
LAYOUT_REPO="$(cd "$LAYOUT_REPO" && pwd -P)"
git -C "$LAYOUT_REPO" config core.hooksPath .layout-hooks
mkdir -p "$LAYOUT_REPO/.layout-hooks"
SKILLED_INSTALLER="$TEMP_ROOT/install-git-hooks-skilled.sh"
sed 's#^HOOK_SOURCE_DIR="$REPO_ROOT/.opencode/#HOOK_SOURCE_DIR="$REPO_ROOT/.skilled/#' "$INSTALLER" > "$SKILLED_INSTALLER"
grep -q '^HOOK_SOURCE_DIR="$REPO_ROOT/.skilled/scripts/git-hooks"$' "$SKILLED_INSTALLER" \
  || fail 'could not point the installer copy at .skilled'

for scenario in 'installer under .opencode:.skilled:.opencode' 'installer under .skilled:.opencode:.skilled'; do
  IFS=: read -r label old_root new_root <<< "$scenario"
  installer="$INSTALLER"
  [[ "$new_root" == .skilled ]] && installer="$SKILLED_INSTALLER"
  ln -sfn "$LAYOUT_REPO/$old_root/scripts/git-hooks/pre-commit" "$LAYOUT_REPO/.layout-hooks/pre-commit"
  layout_output="$TEMP_ROOT/layout-output.txt"
  (
    cd "$LAYOUT_REPO"
    bash "$installer"
  ) > "$layout_output" 2>&1
  layout_link="$(readlink "$LAYOUT_REPO/.layout-hooks/pre-commit")"
  [[ "$layout_link" == "$LAYOUT_REPO/$new_root/scripts/git-hooks/pre-commit" ]] \
    || fail "$label kept a $old_root hook link instead of replacing it: $layout_link"
  if grep -q 'not a symlink we installed' "$layout_output"; then
    fail "$label reported its own $old_root hook link as another tool's"
  fi
  printf 'PASS %s replaces a %s hook link: %s\n' "$label" "$old_root" "$layout_link"
done

printf '#!/usr/bin/env bash\nexit 0\n' > "$TEMP_ROOT/other-tool/pre-commit"
ln -sfn "$TEMP_ROOT/other-tool/pre-commit" "$LAYOUT_REPO/.layout-hooks/pre-commit"
(
  cd "$LAYOUT_REPO"
  bash "$INSTALLER"
) > "$layout_output" 2>&1
[[ "$(readlink "$LAYOUT_REPO/.layout-hooks/pre-commit")" == "$TEMP_ROOT/other-tool/pre-commit" ]] \
  || fail "the installer replaced another tool's hook link"
grep -q 'not a symlink we installed' "$layout_output" \
  || fail "the installer did not report skipping another tool's hook link"
printf '%s\n' "PASS another tool's hook link is left in place"

# A checkout that holds its tree only under .skilled has no .opencode path to scan, so
# the installer takes its hooks from .skilled instead of installing nothing.
SKILLED_ONLY_REPO="$TEMP_ROOT/skilled-only-repo"
mkdir -p "$SKILLED_ONLY_REPO/.skilled/scripts/git-hooks"
printf '#!/usr/bin/env bash\nexit 0\n' > "$SKILLED_ONLY_REPO/.skilled/scripts/git-hooks/pre-commit"
chmod +x "$SKILLED_ONLY_REPO/.skilled/scripts/git-hooks/pre-commit"
git -C "$SKILLED_ONLY_REPO" init -q
SKILLED_ONLY_REPO="$(cd "$SKILLED_ONLY_REPO" && pwd -P)"
(
  cd "$SKILLED_ONLY_REPO"
  bash "$INSTALLER"
) > "$TEMP_ROOT/skilled-only-output.txt" 2>&1 || fail 'the installer failed in a .skilled-only checkout'
skilled_only_hooks="$(normalize_git_path "$SKILLED_ONLY_REPO" "$(git -C "$SKILLED_ONLY_REPO" rev-parse --git-path hooks)")"
[[ "$(readlink "$skilled_only_hooks/pre-commit" 2>/dev/null)" == "$SKILLED_ONLY_REPO/.skilled/scripts/git-hooks/pre-commit" ]] \
  || fail 'a .skilled-only checkout got no hook link into .skilled'
printf 'PASS a .skilled-only checkout installs its hooks from .skilled: %s\n' "$skilled_only_hooks/pre-commit"

# A checkout with hook sources under neither name fails instead of reporting an
# install that linked nothing.
NO_HOOKS_REPO="$TEMP_ROOT/no-hooks-repo"
mkdir -p "$NO_HOOKS_REPO"
git -C "$NO_HOOKS_REPO" init -q
if ( cd "$NO_HOOKS_REPO" && bash "$INSTALLER" ) > "$TEMP_ROOT/no-hooks-output.txt" 2>&1; then
  fail 'the installer exited 0 with hook sources under neither name'
fi
grep -q 'no hook sources' "$TEMP_ROOT/no-hooks-output.txt" || fail 'the installer did not report the missing hook sources'
printf '%s\n' 'PASS a checkout with hook sources under neither name fails'

printf '%s\n' 'Installer transcript (linked worktree):'
sed 's/^/  /' "$linked_output"
printf '%s\n' 'Installer transcript (core.hooksPath):'
sed 's/^/  /' "$custom_output"
