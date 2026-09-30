#!/usr/bin/env bash
# Mirrors runtime/scripts/run-tests-sharded.mjs (12 serial shards, 10 min bound each),
# calling the hoisted vitest binary because runtime/node_modules/.bin/vitest is absent.
# usage: run-shards.sh <out-dir>
set -u
OUT="$1"; mkdir -p "$OUT"
RT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration/.skilled/skills/system-spec-kit/runtime
VT="$RT/../node_modules/.bin/vitest"
cd "$RT" || exit 90
FAIL=0
for i in $(seq 1 12); do
  S=$(date +%s)
  perl -e 'alarm shift; exec @ARGV' 600 "$VT" run --shard=$i/12 </dev/null > "$OUT/shard-$i.txt" 2>&1
  RC=$?
  [ $RC -ne 0 ] && FAIL=$((FAIL+1))
  echo "shard $i/12 exit=$RC seconds=$(( $(date +%s) - S )) ps_bytes=$(ps -A -o pid= -o ppid= -o command= | wc -c | tr -d ' ')" >> "$OUT/summary.txt"
done
echo "failing_shards=$FAIL" >> "$OUT/summary.txt"
