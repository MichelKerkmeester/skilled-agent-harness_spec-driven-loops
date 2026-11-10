## Edit 1

File: `.opencode/bin/tests/worktree-session.test.sh`

OLD:

~~~~text
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
~~~~

NEW:

~~~~text
set -euo pipefail

# A run started from a git hook inherits variables that point git at the enclosing
# repository, so fixture commits and the launcher would write there. Clear them first.
unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
~~~~
