#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT="$SCRIPT_DIR/ceiling-report.sh"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

failures=0

if [[ ! -f "$REPORT" ]]; then
  printf 'FAIL report script is missing: %s\n' "$REPORT" >&2
  exit 1
fi

# Writes one fixture file, runs the report on it and checks the marker line and the summary.
# The expected tags argument is the full bracketed field, or "none" when no marker line is expected.
run_case() {
  local name="$1"
  local extension="$2"
  local content="$3"
  local expected_tags="$4"
  local expected_summary="$5"
  local file_path="$TMP_DIR/${name}.${extension}"
  local output
  local actual_exit
  local ok=1

  printf '%s\n' "$content" > "$file_path"

  set +e
  output="$(python3 "$REPORT" "$file_path" 2>&1)"
  actual_exit=$?
  set -e

  if [[ "$actual_exit" -ne 0 ]]; then
    ok=0
  fi
  if [[ "$expected_tags" == "none" ]]; then
    if [[ "$output" == *"$file_path:"* ]]; then
      ok=0
    fi
  elif ! grep -qxF -- "$file_path:1  $content  $expected_tags" <<< "$output"; then
    ok=0
  fi
  if ! grep -qxF -- "$expected_summary" <<< "$output"; then
    ok=0
  fi

  if [[ "$ok" -eq 1 ]]; then
    printf 'PASS %s\n' "$name"
  else
    printf 'FAIL %s: exit %s\n%s\n' "$name" "$actual_exit" "$output" >&2
    failures=$((failures + 1))
  fi
}

# Checks only the exit status of a run with the given arguments.
expect_exit() {
  local expected="$1"
  local name="$2"
  shift 2
  local actual

  set +e
  python3 "$REPORT" "$@" >/dev/null 2>&1
  actual=$?
  set -e

  if [[ "$actual" -eq "$expected" ]]; then
    printf 'PASS %s\n' "$name"
  else
    printf 'FAIL %s: expected exit %s, got %s\n' "$name" "$expected" "$actual" >&2
    failures=$((failures + 1))
  fi
}

run_case "measurable" "js" '// ceiling: global lock; switch to per-account locks if throughput matters' "[]" "markers=1 no-trigger=0 no-signal=0"
run_case "no_trigger" "sh" '# ceiling: global lock' "[no-trigger]" "markers=1 no-trigger=1 no-signal=0"
run_case "no_signal" "js" '// ceiling: global lock; switch to per-account locks when the team agrees' "[no-signal]" "markers=1 no-trigger=0 no-signal=1"
run_case "prefix" "sh" '# intentional-limit: single writer; add a queue if rows arrive faster than 100 per second' "[]" "markers=1 no-trigger=0 no-signal=0"
run_case "prose" "js" '// the ceiling: a longer section' "none" "markers=0 no-trigger=0 no-signal=0"

expect_exit 2 "missing_path" "$TMP_DIR/missing-probe.js"
expect_exit 2 "unknown_option" --bogus
expect_exit 2 "directory_path" "$TMP_DIR"

if [[ "$failures" -gt 0 ]]; then
  printf '%s ceiling report test case(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All ceiling report test cases passed\n'
