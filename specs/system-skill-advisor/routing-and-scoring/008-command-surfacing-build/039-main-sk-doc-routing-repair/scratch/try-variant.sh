#!/bin/zsh
# Measures one keyword variant of the sk-doc router against the five failing test files.
set -u
cd /Users/michelkerkmeester/worktrees/public/352-command-surfacing-research
SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/scratch
git -c core.fsmonitor=false checkout -q -- .skilled/skills/sk-doc/ROUTER.md .skilled/skills/sk-doc/graph-metadata.json
python3 $SP/try-variant.py "$1"
node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --write --hub sk-doc > /dev/null 2>&1; echo "generate exit $?"
cd .skilled/skills/system-skill-advisor/runtime
npx vitest run tests/scorer/doctor-bridge-isolation.vitest.ts tests/doctor-routing-slice.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts 2>&1 | grep -E '^ +Tests |live=|"doctor-|rr-iter' | sed 's/^ *//' | cut -c1-160
