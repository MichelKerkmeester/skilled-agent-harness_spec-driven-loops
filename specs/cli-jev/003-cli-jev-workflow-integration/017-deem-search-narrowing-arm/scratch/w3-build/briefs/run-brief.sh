#!/usr/bin/env bash
# usage: run-brief.sh <executor> <NN> <brief-name>   (from the worktree root)
set -u
W=specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build
S=.skilled/skills/system-spec-kit/runtime/cli
git status --porcelain > $W/logs/$2.pre-status.txt
[ -f $S/retrieval/score-track-narrowing.mjs ] && cp $S/retrieval/score-track-narrowing.mjs $W/logs/$2.pre.mjs
[ -f $S/tests/score-track-narrowing.vitest.ts ] && cp $S/tests/score-track-narrowing.vitest.ts $W/logs/$2.pre.vitest.ts
bash /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/dispatch.sh "$1" $W/briefs/$3.md $W/logs/$2
