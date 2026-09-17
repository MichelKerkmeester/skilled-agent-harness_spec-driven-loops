## Edit 1

File: `.opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh`

OLD:

~~~~text
printf '%s\n' "PASS another tool's hook link is left in place"

printf '%s\n' 'Installer transcript (linked worktree):'
~~~~

NEW:

~~~~text
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
~~~~
