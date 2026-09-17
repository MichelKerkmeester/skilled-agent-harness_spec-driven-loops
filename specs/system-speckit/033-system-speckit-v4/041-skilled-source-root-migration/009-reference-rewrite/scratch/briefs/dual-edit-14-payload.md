## Edit 1

File: `.skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh`

OLD:

~~~~text
# so it resolves correctly at any nesting depth (e.g. a wrapped <root>/coder/.opencode layout).
REPO_ROOT="${SCRIPT_DIR%%/.opencode/*}"
SQLITE_PATH="${REPO_ROOT}/.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite"
~~~~

NEW:

~~~~text
# so it resolves correctly at any nesting depth (e.g. a wrapped <root>/coder/.opencode layout).
REPO_ROOT="${SCRIPT_DIR%%/.skilled/*}"; REPO_ROOT="${REPO_ROOT%%/.opencode/*}"
SQLITE_PATH="${REPO_ROOT}/.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite"
~~~~
