#!/usr/bin/env bash
# usage: run-brief.sh <executor> <NN> <brief-name>   (run from the worktree root)
set -u
W=specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/scratch/w4-build
S=.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts
T=.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts
git status --porcelain > $W/logs/$2.pre-status.txt
[ -f $S ] && cp $S $W/logs/$2.pre.S.ts
[ -f $T ] && cp $T $W/logs/$2.pre.T.ts
bash /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/dispatch.sh "$1" $W/briefs/$3.md $W/logs/$2
git status --porcelain > $W/logs/$2.post-status.txt
