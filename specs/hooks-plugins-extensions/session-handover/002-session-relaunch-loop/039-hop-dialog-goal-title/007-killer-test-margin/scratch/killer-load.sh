#!/usr/bin/env bash
# Runs the one killer test N times at once and prints how many runs failed.
set -uo pipefail
runs=$1
out_dir=$2
mkdir -p "$out_dir"
rm -f "$out_dir"/run-*.txt
pids=()
for i in $(seq 1 "$runs"); do
  env -u AI_SESSION_CHILD -u OPENCODE_DB node --test \
    --test-name-pattern='killer keeps the record armed when the target exits during its grace period' \
    .skilled/hooks/session-relaunch/tests/killer.test.cjs > "$out_dir/run-$i.txt" 2>&1 &
  pids+=($!)
done
failed=0
for pid in "${pids[@]}"; do
  wait "$pid" || failed=$((failed + 1))
done
printf 'parallel runs: %s, failed runs: %s\n' "$runs" "$failed"
