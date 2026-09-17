## Edit 1

File: `.opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh`

OLD:

~~~~text
printf 'PASS --status names the global hooksPath: %s\n' "$global_dir"

printf '%s\n' 'Installer transcript (linked worktree):'
~~~~

NEW:

~~~~text
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

printf '%s\n' 'Installer transcript (linked worktree):'
~~~~
