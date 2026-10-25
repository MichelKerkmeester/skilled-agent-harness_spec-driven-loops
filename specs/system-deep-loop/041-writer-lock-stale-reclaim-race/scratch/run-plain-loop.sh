#!/bin/zsh
# Repeats the CI-shaped case N times and prints the failure count.
N=${1:-200}
RT=../../../../.skilled/skills/system-deep-loop/runtime
cd "$(dirname "$0")/$RT" || exit 1
fail=0
for i in $(seq 1 $N); do
  npx vitest run --no-coverage tests/unit/jsonl-repair.vitest.ts -t "does not drop a plain appendJsonlRecord" >/dev/null 2>&1 || fail=$((fail+1))
done
echo "rounds=$N failures=$fail"
