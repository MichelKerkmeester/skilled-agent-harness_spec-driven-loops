#!/usr/bin/env bash
# Runs every sk-doc script test the way it is written: pytest for a file that
# defines test functions, python for a file that runs itself. Space-separated
# names in SKIP_TESTS are left out; ONLY_TESTS, when set, runs just those.
set -uo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
skip=" ${SKIP_TESTS:-} "
only=" ${ONLY_TESTS:-} "
failed=()

for test_file in test_*.py; do
  if [ -n "${ONLY_TESTS:-}" ]; then
    case "$only" in *" $test_file "*) ;; *) continue ;; esac
  fi
  case "$skip" in *" $test_file "*) echo "SKIP $test_file"; continue ;; esac

  log="$(mktemp)"
  if grep -q '^def test_' "$test_file"; then
    python3 -m pytest -q -p no:cacheprovider "$test_file" >"$log" 2>&1
  else
    python3 "$test_file" >"$log" 2>&1
  fi
  status=$?
  if [ "$status" -eq 0 ]; then
    echo "PASS $test_file"
  else
    echo "FAIL $test_file (exit $status)"
    tail -n 40 "$log"
    failed+=("$test_file")
  fi
  rm -f "$log"
done

if [ "${#failed[@]}" -gt 0 ]; then
  echo "${#failed[@]} failing: ${failed[*]}"
  exit 1
fi
echo "all sk-doc script tests passed"
