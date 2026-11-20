#!/usr/bin/env bash
# Scores a two-line run log whose arms are `zzz` and `paired` (both unloadable, so
# unscored) and prints the text summary and the JSON arm keys. Usage: paired-arm.sh <tmpdir>
set -uo pipefail
S=/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs
mkdir -p "$1"
printf '%s\n' '{"runtime":"claude","rowId":"cmd-create-agent-plain-tune-01","arm":"zzz","exit":0,"locator":{"sessionId":"x","transcriptPath":"/nonexistent/a.jsonl"}}' \
              '{"runtime":"claude","rowId":"cmd-create-agent-plain-tune-01","arm":"paired","exit":0,"locator":{"sessionId":"x","transcriptPath":"/nonexistent/b.jsonl"}}' > "$1/log.jsonl"
echo '--- text'; env -u AI_SESSION_CHILD node "$S" --summary "$1/log.jsonl" 2>&1 | grep -E '^[a-z]+:|^  [a-z0-9]+:' 
echo '--- json arm keys'; env -u AI_SESSION_CHILD node "$S" --summary "$1/log.jsonl" --json | jq -c '.claude | keys'
