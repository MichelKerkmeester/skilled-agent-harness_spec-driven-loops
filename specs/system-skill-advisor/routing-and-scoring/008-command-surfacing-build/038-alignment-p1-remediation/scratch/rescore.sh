#!/usr/bin/env bash
# Scores the four stored run sets with the committed scorer into <suffix> files, so a
# before and an after set can be compared field by field.
set -euo pipefail
suffix="$1"
PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
RL=$PK/007-per-runtime-behaviour-proof/scratch
OSP=$PK/033-untuned-arm-arena-run/scratch
SP=$PK/038-alignment-p1-remediation/scratch
S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs
env -u OPENCODE_DB -u SKILL_ADVISOR_FRESH_PROMPTS_PATH node "$S" --summary "$RL/runs-pre.jsonl" "$RL/runs-post.jsonl" --json > "$SP/start-007-$suffix.json"
env -u OPENCODE_DB -u SKILL_ADVISOR_FRESH_PROMPTS_PATH node "$S" --summary "$RL/runs-pre-final.jsonl" --json > "$SP/pre-set-$suffix.json"
env -u OPENCODE_DB -u SKILL_ADVISOR_FRESH_PROMPTS_PATH node "$S" --summary "$RL/runs-final.jsonl" --json > "$SP/final-set-$suffix.json"
env -u SKILL_ADVISOR_FRESH_PROMPTS_PATH node "$S" --summary "$OSP"/runs/{claude,opencode,pi,devin,dsh}.jsonl --pair off,on --json > "$SP/arm-033-$suffix.json"
