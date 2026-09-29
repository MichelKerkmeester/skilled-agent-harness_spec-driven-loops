#!/usr/bin/env bash
# Proof runs P1 and P2 from the final script state, one at a time, each with porcelain snapshots.
set -u
ROOT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
cd "$ROOT" || exit 90
W=specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-build
S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
run() {
  local name="$1"; shift
  git status --porcelain > "$W/runs/$name.pre.txt"
  date +%T > "$W/runs/$name.time.txt"
  env -u JEV_PROVIDER perl -e 'alarm shift; exec @ARGV' 1500 "$@" > "$W/runs/$name.stdout.txt" 2> "$W/runs/$name.stderr.txt"
  echo "exit=$?" > "$W/runs/$name.exit.txt"
  date +%T >> "$W/runs/$name.time.txt"
  git status --porcelain > "$W/runs/$name.post.txt"
}
rm -f "$W"/stubs/logging/*.log "$W"/stubs/p2-deem/*.log "$W"/stubs/p2-jev/*.log
run p1 env PATH="$ROOT/$W/stubs/logging:$PATH" node "$S"
run p2-deem env PATH="$ROOT/$W/stubs/p2-deem:$PATH" node "$S" --deem --out "$W/runs/p2-deem"
run p2-jev env PATH="$ROOT/$W/stubs/p2-jev:$PATH" node "$S" --jev --out "$W/runs/p2-jev"
echo done > "$W/runs/proofs.done"
