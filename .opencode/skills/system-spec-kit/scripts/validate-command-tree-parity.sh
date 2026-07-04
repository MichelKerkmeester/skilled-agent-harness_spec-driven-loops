#!/usr/bin/env bash
set -euo pipefail

QUIET=false
SELF_TEST=false
LEFT=""
RIGHT=""

usage() {
  cat <<'EOF'
Usage: validate-command-tree-parity.sh [--quiet] [--left <dir> --right <dir>] [--self-test]

Checks that the OpenCode and Claude command trees expose byte-identical files.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --quiet) QUIET=true; shift ;;
    --self-test) SELF_TEST=true; shift ;;
    --left) LEFT="${2:-}"; shift 2 ;;
    --right) RIGHT="${2:-}"; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) echo "ERROR: unknown argument: $1" >&2; usage >&2; exit 64 ;;
  esac
done

resolve_dir() {
  local dir="$1"
  [[ -d "$dir" ]] || { echo "ERROR: directory not found: $dir" >&2; return 1; }
  (cd "$dir" && pwd -P)
}

compare_trees() {
  local left_input="$1"
  local right_input="$2"
  local left_resolved right_resolved
  left_resolved=$(resolve_dir "$left_input") || return 1
  right_resolved=$(resolve_dir "$right_input") || return 1

  if [[ "$left_resolved" == "$right_resolved" ]]; then
    $QUIET || echo "PASS: command trees resolve to the same directory: $left_resolved"
    return 0
  fi

  local tmp_dir left_list right_list
  tmp_dir=$(mktemp -d "${TMPDIR:-/tmp}/command-tree-parity.XXXXXX")
  left_list="$tmp_dir/left.txt"
  right_list="$tmp_dir/right.txt"

  (cd "$left_resolved" && find . -type f -print | LC_ALL=C sort) > "$left_list"
  (cd "$right_resolved" && find . -type f -print | LC_ALL=C sort) > "$right_list"

  if ! cmp -s "$left_list" "$right_list"; then
    echo "FAIL: command tree file lists differ" >&2
    diff -u "$left_list" "$right_list" >&2 || true
    rm -rf "$tmp_dir"
    return 1
  fi

  local rel failed=0
  while IFS= read -r rel; do
    if ! cmp -s "$left_resolved/$rel" "$right_resolved/$rel"; then
      echo "FAIL: command file differs: $rel" >&2
      failed=1
    fi
  done < "$left_list"

  if [[ "$failed" -ne 0 ]]; then
    rm -rf "$tmp_dir"
    return 1
  fi

  rm -rf "$tmp_dir"
  $QUIET || echo "PASS: command trees are byte-identical"
  return 0
}

run_self_test() {
  local tmp_dir
  tmp_dir=$(mktemp -d "${TMPDIR:-/tmp}/command-tree-parity-selftest.XXXXXX")

  mkdir -p "$tmp_dir/left/memory" "$tmp_dir/right/memory"
  printf 'same\n' > "$tmp_dir/left/memory/search.md"
  printf 'same\n' > "$tmp_dir/right/memory/search.md"
  compare_trees "$tmp_dir/left" "$tmp_dir/right" >/dev/null

  printf 'different\n' > "$tmp_dir/right/memory/search.md"
  if compare_trees "$tmp_dir/left" "$tmp_dir/right" >/dev/null 2>&1; then
    echo "FAIL: self-test expected a byte diff to fail" >&2
    rm -rf "$tmp_dir"
    return 1
  fi

  rm -rf "$tmp_dir"
  $QUIET || echo "PASS: command tree parity self-test detected positive and negative cases"
}

if $SELF_TEST; then
  run_self_test
  exit $?
fi

if [[ -z "$LEFT" || -z "$RIGHT" ]]; then
  ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
  LEFT="$ROOT/.opencode/commands"
  RIGHT="$ROOT/.claude/commands"
fi

compare_trees "$LEFT" "$RIGHT"
