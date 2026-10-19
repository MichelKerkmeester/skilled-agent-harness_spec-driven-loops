#!/usr/bin/env bash
# One cheap dispatch per OpenCode version through the real lineage argv builder, in throwaway
# projects outside the repository, each with its own OpenCode database file.
set -u
W=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/143-opencode-dual-compat-build
OUT=$1; WS=$2
export PATH=/Users/michelkerkmeester/.nvm/versions/node/v26.8.2/bin:$PATH
SMOKE=$W/specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/006-cli-opencode-dual-dispatch/scratch/smoke/smoke.cjs
FANOUT=$W/.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
for v in v1 v2; do
  mkdir -p "$WS/ws-$v" "$OUT/$v"
  if [ "$v" = v1 ]; then bin=opencode; else bin=; fi
  ( cd "$WS/ws-$v" && env OPENCODE_DB="$WS/db-$v.sqlite" ${bin:+OPENCODE_BIN=$bin} node "$SMOKE" "$FANOUT" "$v" "$OUT/$v" ) > "$OUT/$v/run.txt" 2>&1
  echo "$v exit=$?" >> "$OUT/exits.txt"
done
