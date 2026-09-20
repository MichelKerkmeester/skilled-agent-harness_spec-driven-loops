#!/usr/bin/env bash
# Print the full command line of the dispatcher's children, and what the executor
# binary actually is, so an unexplained child can be identified rather than assumed.
set -uo pipefail
for pid in "$@"; do
  echo "=== pid $pid ==="
  ps -o pid,ppid,etime,command -p "$pid" | tail -1
done
echo
echo "=== executor binary ==="
BIN="$(command -v pi)"
echo "path: $BIN"
file "$BIN"
echo "--- first 3 lines ---"
head -3 "$BIN"
