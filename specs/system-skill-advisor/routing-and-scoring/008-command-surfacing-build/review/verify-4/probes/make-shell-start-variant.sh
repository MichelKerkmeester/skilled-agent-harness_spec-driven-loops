#!/usr/bin/env bash
# Writes a counterfactual copy of the committed transcript scorer, outside the
# repository, whose readDocument also accepts a shell read, so a start-rate delta
# over the stored arms can be read. Usage: make-shell-start-variant.sh <out.mjs>
set -uo pipefail
RAD=/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy
sed -e "s#from '../../../../../hooks/shared/session-readers/index.mjs'#from '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/hooks/shared/session-readers/index.mjs'#" \
    -e "s#from './run-command-behaviour.mjs'#from '$RAD/run-command-behaviour.mjs'#" \
    -e "s#resolve(dirname(fileURLToPath(import.meta.url)), 'command-prompts.jsonl')#resolve('$RAD', 'command-prompts.jsonl')#" \
    -e "s#resolve(dirname(fileURLToPath(import.meta.url)), '../command-bridges/command-bridges.generated.json')#resolve('$RAD', '../command-bridges/command-bridges.generated.json')#" \
    -e "s#    if (event.kind !== 'read' \&\& event.kind !== 'skill') continue;\$#    if (event.kind === 'shell' \&\& shellReadTargets(event.command).some((value) => tailMatches(value, documents))) return true;\n    if (event.kind !== 'read' \&\& event.kind !== 'skill') continue;#" \
    "$RAD/score-command-transcripts.mjs" > "$1"
