#!/usr/bin/env bash
# usage: run-brief.sh <devin|pi> <NN> <brief-name>   (run from the worktree root)
# Snapshots status, S, T and F before one dispatch, runs it, then snapshots status after.
set -u
W=specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build/fix
R=.skilled/skills/system-spec-kit/runtime
git status --porcelain > "$W/logs/$2.pre-status.txt"
cp "$R/scripts/compaction-recall/score-compaction-recall.mjs" "$W/logs/$2.pre.mjs"
cp "$R/tests/compaction-recall.vitest.ts" "$W/logs/$2.pre.vitest.ts"
ls -la "$R/tests/compaction-recall-fixtures" | awk '{print $5, $9}' > "$W/logs/$2.pre-fixtures.txt"
bash /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/dispatch.sh "$1" "$W/briefs/$3.md" "$W/logs/$2"
git status --porcelain > "$W/logs/$2.post-status.txt"
ls -la "$R/tests/compaction-recall-fixtures" | awk '{print $5, $9}' > "$W/logs/$2.post-fixtures.txt"
