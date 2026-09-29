#!/usr/bin/env bash
# Final-state proof runs after the doc briefs landed: P1 again (census and zero-call default), then P4 (live local Deem).
set -u
ROOT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
cd "$ROOT" || exit 90
W=specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-build
S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
run() {
  local name="$1" secs="$2"; shift 2
  git status --porcelain > "$W/runs/$name.pre.txt"
  date +%T > "$W/runs/$name.time.txt"
  env -u JEV_PROVIDER perl -e 'alarm shift; exec @ARGV' "$secs" "$@" > "$W/runs/$name.stdout.txt" 2> "$W/runs/$name.stderr.txt"
  echo "exit=$?" > "$W/runs/$name.exit.txt"
  date +%T >> "$W/runs/$name.time.txt"
  git status --porcelain > "$W/runs/$name.post.txt"
}
rm -f "$W"/stubs/logging/*.log
run p1-final 1500 env PATH="$ROOT/$W/stubs/logging:$PATH" node "$S"
node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs health > "$W/runs/p4-health.txt" 2>&1
echo "exit=$?" >> "$W/runs/p4-health.txt"
if grep -q '"ok":true' "$W/runs/p4-health.txt" && grep -q '^planned calls:' "$W/runs/p1-final.stdout.txt"; then
  run p4-deem 3600 node "$S" --deem --out "$W/runs/deem"
else
  echo "p4 not run: health or headroom" > "$W/runs/p4-deem.skipped.txt"
fi
echo done > "$W/runs/final.done"
