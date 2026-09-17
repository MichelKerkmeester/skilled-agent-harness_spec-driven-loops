## Edit 1

File: `.opencode/scripts/install-git-hooks.sh`

OLD:

~~~~text
#!/usr/bin/env bash
# Install repository git hooks shipped under .opencode/scripts/git-hooks/.
#
~~~~

NEW:

~~~~text
#!/usr/bin/env bash
# Install repository git hooks shipped under the source tree's scripts/git-hooks/.
#
~~~~

## Edit 2

File: `.opencode/scripts/install-git-hooks.sh`

OLD:

~~~~text
HOOK_SOURCE_DIR="$REPO_ROOT/.opencode/scripts/git-hooks"
HOOK_TARGET_DIR="$(git -C "$REPO_ROOT" rev-parse --git-path hooks)"
~~~~

NEW:

~~~~text
HOOK_SOURCE_DIR="$REPO_ROOT/.opencode/scripts/git-hooks"
# A checkout that holds its tree only under .skilled has no .opencode path, and scanning
# the absent directory would install nothing while reporting success.
[ -d "$HOOK_SOURCE_DIR" ] || HOOK_SOURCE_DIR="$REPO_ROOT/.skilled/scripts/git-hooks"
if [ ! -d "$HOOK_SOURCE_DIR" ]; then
  echo "ERROR: no hook sources under $REPO_ROOT/.opencode/scripts/git-hooks or $REPO_ROOT/.skilled/scripts/git-hooks" >&2
  exit 1
fi
HOOK_TARGET_DIR="$(git -C "$REPO_ROOT" rev-parse --git-path hooks)"
~~~~
