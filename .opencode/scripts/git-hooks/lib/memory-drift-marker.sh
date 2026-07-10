#!/usr/bin/env bash
# Shared memory-index drift marker writer for git lifecycle hooks.

mark_memory_drift_from_diff() {
  if [ "${SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK:-0}" = "1" ]; then
    return 0
  fi

  local repo_root
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
  if [ -z "$repo_root" ]; then
    return 0
  fi

  local diff_output
  diff_output="$(git diff-tree --no-commit-id -r -M --name-status "$@" -- .opencode/specs 2>/dev/null || true)"
  if [ -z "$diff_output" ]; then
    return 0
  fi

  if ! command -v node >/dev/null 2>&1; then
    return 0
  fi

  local drift_marker_script="$repo_root/.opencode/skills/system-spec-kit/scripts/dist/git-hooks/drift-marker-write.js"
  if [ ! -f "$drift_marker_script" ]; then
    echo "memory-drift-marker: missing build artifact $drift_marker_script -- rebuild with: cd .opencode/skills/system-spec-kit/mcp_server && npm run build && cd ../scripts && npm run build" >&2
    return 0
  fi

  MEMORY_DRIFT_DIFF="$diff_output" \
  MEMORY_DRIFT_REPO_ROOT="$repo_root" \
  MEMORY_DRIFT_SOURCE="$(basename "$0")" \
  node "$drift_marker_script"
}
