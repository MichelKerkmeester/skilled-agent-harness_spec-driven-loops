#!/usr/bin/env bash
# Runs a queue file through run-test.sh with a fixed number of workers (default 2, the operator's limit).
# A worker never starts an entry whose cli is already running, and scenario 457 runs one at a time,
# because it runs the full advisor suite and two copies would compete for the same machine.
# Env: POOL_STATE_DIR (required, a scratch directory), POOL_QUEUE (default queue.txt), POOL_WORKERS (default 2).
set -uo pipefail
d="$(cd "$(dirname "$0")" && pwd)"
state="${POOL_STATE_DIR:?set POOL_STATE_DIR to a scratch directory}"
workers="${POOL_WORKERS:-2}"
mkdir -p "$state/running"
grep -v '^[[:space:]]*$' "$d/${POOL_QUEUE:-queue.txt}" > "$state/pending.txt"

take() {
  until mkdir "$state/lock" 2>/dev/null; do sleep 0.2; done
  local line cli id picked=""
  while IFS= read -r line; do
    cli="${line%% *}"; id="${line#* }"
    if [ -z "$picked" ] && [ ! -e "$state/running/cli-$cli" ] \
      && { [ "$id" != "457" ] || [ ! -e "$state/running/id-457" ]; }; then
      picked="$line"
    fi
  done < "$state/pending.txt"
  if [ -n "$picked" ]; then
    cli="${picked%% *}"; id="${picked#* }"
    touch "$state/running/cli-$cli"
    if [ "$id" = "457" ]; then touch "$state/running/id-457"; fi
    grep -v -x -F "$picked" "$state/pending.txt" > "$state/pending.tmp"
    mv "$state/pending.tmp" "$state/pending.txt"
    echo "$picked"
  fi
  rmdir "$state/lock"
}

worker() {
  local w="$1" next cli id rc
  while :; do
    next="$(take)"
    if [ -z "$next" ]; then
      [ -s "$state/pending.txt" ] || break
      sleep 5
      continue
    fi
    cli="${next%% *}"; id="${next#* }"
    echo "$(date -u +%H:%M:%S) w$w start $cli $id" >> "$state/pool.log"
    bash "$d/run-test.sh" "$cli" "$id"
    rc=$?
    echo "$(date -u +%H:%M:%S) w$w done $cli $id rc=$rc" >> "$state/pool.log"
    rm -f "$state/running/cli-$cli"
    if [ "$id" = "457" ]; then rm -f "$state/running/id-457"; fi
  done
}

for w in $(seq 1 "$workers"); do worker "$w" & done
wait
echo "$(date -u +%H:%M:%S) pool finished" >> "$state/pool.log"
