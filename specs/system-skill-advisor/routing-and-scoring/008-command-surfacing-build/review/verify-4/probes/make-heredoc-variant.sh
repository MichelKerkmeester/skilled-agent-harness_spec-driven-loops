#!/usr/bin/env bash
# Writes a counterfactual copy of the committed transcript scorer, outside the
# repository, whose heredoc delimiter accepts any word bash accepts (hyphen, dot).
# Usage: make-heredoc-variant.sh <out.mjs>
set -uo pipefail
RAD=/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy
sed -e "s#from '../../../../../hooks/shared/session-readers/index.mjs'#from '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/hooks/shared/session-readers/index.mjs'#" \
    -e "s#from './run-command-behaviour.mjs'#from '$RAD/run-command-behaviour.mjs'#" \
    -e "s#resolve(dirname(fileURLToPath(import.meta.url)), 'command-prompts.jsonl')#resolve('$RAD', 'command-prompts.jsonl')#" \
    -e "s#resolve(dirname(fileURLToPath(import.meta.url)), '../command-bridges/command-bridges.generated.json')#resolve('$RAD', '../command-bridges/command-bridges.generated.json')#" \
    -e 's#(\[A-Za-z_\]\[A-Za-z0-9_\]\*)#([A-Za-z_][A-Za-z0-9_.-]*)#' \
    "$RAD/score-command-transcripts.mjs" > "$1"
