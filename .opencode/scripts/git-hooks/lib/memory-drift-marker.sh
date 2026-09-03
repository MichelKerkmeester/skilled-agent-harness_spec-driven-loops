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

  # The diff goes to a file and reaches the writer on stdin, never through the
  # environment. A commit touching tens of thousands of paths produces a diff
  # far past the combined argument-and-environment limit, and exporting it made
  # every later command in this function die with E2BIG -- including the ones
  # that only ever received a short value.
  local diff_file
  diff_file="$(mktemp "${TMPDIR:-/tmp}/memory-drift-diff.XXXXXX" 2>/dev/null)" || return 0

  git diff-tree --no-commit-id -r -M --name-status "$@" -- specs >"$diff_file" 2>/dev/null

  if [ ! -s "$diff_file" ]; then
    rm -f "$diff_file"
    return 0
  fi

  if ! command -v node >/dev/null 2>&1; then
    rm -f "$diff_file"
    return 0
  fi

  local drift_marker_script="$repo_root/.opencode/skills/system-spec-kit/scripts/dist/git-hooks/drift-marker-write.js"
  if [ ! -f "$drift_marker_script" ]; then
    echo "memory-drift-marker: missing build artifact $drift_marker_script -- rebuild with: cd .opencode/skills/system-spec-kit/mcp-server && npm run build && cd ../scripts && npm run build" >&2
    rm -f "$diff_file"
    return 0
  fi

  local hook_source
  hook_source="$(basename "$0")"

  local write_status=0
  MEMORY_DRIFT_REPO_ROOT="$repo_root" \
  MEMORY_DRIFT_SOURCE="$hook_source" \
  node "$drift_marker_script" <"$diff_file" || write_status=$?

  rm -f "$diff_file"
  return "$write_status"
}
