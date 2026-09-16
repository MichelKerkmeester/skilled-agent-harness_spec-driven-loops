# Edits for unit mass-deletion-harness

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/tests/mass-deletion-guard.test.sh`

OLD:

~~~~text
set -uo pipefail

HERE=
~~~~

NEW:

~~~~text
set -uo pipefail

# git resolves its repository from these in preference to -C/cwd. Clear them so the
# fixture stays hermetic even when the caller sits inside a worktree.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

HERE=
~~~~
