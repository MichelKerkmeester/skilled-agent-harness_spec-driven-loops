## Edit 1

File: `.opencode/bin/worktree-session.sh`

OLD:

~~~~text
}

# Shared artifacts symlinked from main into each worktree (deps + compiled output).
# Override with SPECKIT_WORKTREE_SHARED_PATHS (newline- or colon-separated relative paths).
default_shared_paths() {
  cat <<'PATHS'
.opencode/skills/system-spec-kit/node_modules
.opencode/skills/system-spec-kit/runtime/node_modules
.opencode/skills/system-spec-kit/runtime/dist
.opencode/skills/system-spec-kit/runtime/cli/dist
.opencode/skills/system-spec-kit/runtime/cli/node_modules
.opencode/skills/system-spec-kit/shared/dist
PATHS
~~~~

NEW:

~~~~text
}

# The source tree sits under .skilled or .opencode, and a checkout may link one name to
# the other. Print the name whose spec-kit skill is really present, preferring .skilled so a
# linked checkout names its real tree. A checkout that holds neither keeps .opencode, the
# layout every earlier session used.
source_root_name() {
  local checkout="$1" name
  for name in .skilled .opencode; do
    if [ -f "$checkout/$name/skills/system-spec-kit/SKILL.md" ]; then
      printf '%s\n' "$name"
      return 0
    fi
  done
  printf '%s\n' .opencode
}

# Shared artifacts symlinked from main into each worktree (deps + compiled output), under
# main's source root.
# Override with SPECKIT_WORKTREE_SHARED_PATHS (newline- or colon-separated relative paths).
default_shared_paths() {
  local root="$1"
  cat <<PATHS
$root/skills/system-spec-kit/node_modules
$root/skills/system-spec-kit/runtime/node_modules
$root/skills/system-spec-kit/runtime/dist
$root/skills/system-spec-kit/runtime/cli/dist
$root/skills/system-spec-kit/runtime/cli/node_modules
$root/skills/system-spec-kit/shared/dist
PATHS
~~~~

## Edit 2

File: `.opencode/bin/worktree-session.sh`

OLD:

~~~~text
# Resolve the shared-artifact list.
if [ -n "${SPECKIT_WORKTREE_SHARED_PATHS:-}" ]; then
  SHARED_RAW="$(printf '%s' "$SPECKIT_WORKTREE_SHARED_PATHS" | tr ':' '\n')"
else
  SHARED_RAW="$(default_shared_paths)"
fi

WT_DB_DIR="$WT_ABS/.opencode/skills/system-spec-kit/runtime/database"
# Short per-session socket dir under $HOME (NOT inside the deep worktree) to stay under the
~~~~

NEW:

~~~~text
# Resolve the shared-artifact list.
MAIN_SOURCE_ROOT="$(source_root_name "$MAIN_ROOT")"
if [ -n "${SPECKIT_WORKTREE_SHARED_PATHS:-}" ]; then
  SHARED_RAW="$(printf '%s' "$SPECKIT_WORKTREE_SHARED_PATHS" | tr ':' '\n')"
else
  SHARED_RAW="$(default_shared_paths "$MAIN_SOURCE_ROOT")"
fi

# The worktree does not exist yet, so the plan names main's source root. The worktree's
# own root replaces it once the checkout is written.
WT_DB_DIR="$WT_ABS/$MAIN_SOURCE_ROOT/skills/system-spec-kit/runtime/database"
# Short per-session socket dir under $HOME (NOT inside the deep worktree) to stay under the
~~~~

## Edit 3

File: `.opencode/bin/worktree-session.sh`

OLD:

~~~~text
git -C "$MAIN_ROOT" worktree add -b "$BRANCH" "$WT_ABS" "$WT_BASE" >&2

# A dependency root can contain the workspace's own packages, written by the package manager
~~~~

NEW:

~~~~text
git -C "$MAIN_ROOT" worktree add -b "$BRANCH" "$WT_ABS" "$WT_BASE" >&2

# A base committed before the tree moved checks out under the other name than main's working
# tree holds. Linking main's paths there would plant a second source tree beside the real
# one, so the session starts with no shared links and says why.
WT_SOURCE_ROOT="$(source_root_name "$WT_ABS")"
WT_DB_DIR="$WT_ABS/$WT_SOURCE_ROOT/skills/system-spec-kit/runtime/database"
if [ "$WT_SOURCE_ROOT" != "$MAIN_SOURCE_ROOT" ]; then
  log "WARNING: main checkout keeps its source tree under $MAIN_SOURCE_ROOT but the new worktree keeps it under $WT_SOURCE_ROOT; skipping shared links"
  SHARED_RAW=""
fi

# A dependency root can contain the workspace's own packages, written by the package manager
~~~~
