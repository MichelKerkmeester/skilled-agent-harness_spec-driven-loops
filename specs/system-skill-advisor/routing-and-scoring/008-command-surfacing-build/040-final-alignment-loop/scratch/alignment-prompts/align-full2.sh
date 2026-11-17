#!/bin/zsh
# Full local-skilled-alignment run on the branch, the same step order as the first run.
set -u
SP=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/77af2d6d-58e8-4180-b6da-697f12833f71/scratchpad
cd /Users/michelkerkmeester/worktrees/public/352-command-surfacing-research
A=.skilled/commands/assets/local-skilled-alignment
PRIOR=$(cat $SP/align-final-out.txt)
OUT=$HOME/.local/state/local-skilled-alignment/352-command-surfacing-research/$(date -u +%Y%m%dT%H%M%SZ)
mkdir -p $OUT/lanes; echo $OUT > $SP/align-final2-out.txt; echo "run $OUT"
node $A/resolve-scope.cjs worktrees/352-command-surfacing-research --kind branch --base origin/main --first-parent --out $OUT/scope.json > $OUT/scope.log 2>&1; echo "scope exit $?"
node $A/run-battery.cjs --scope $OUT/scope.json --out $OUT/battery.json > $OUT/battery.log 2>&1; echo "battery exit $?"; grep STATUS $OUT/battery.log | cut -c1-250
jq -r '.rows[] | select(.status!="pass") | "  \(.status) \(.severity) \(.id)"' $OUT/battery.json
python3 $SP/build_lanes.py $OUT $PRIOR $PWD; echo "build lanes exit $?"
jq '.presets["opencode-go"].timeoutSeconds = 3600 | .critic.timeoutSeconds = 3600' $A/executors.json > $OUT/executors-3600.json
echo "Lanes and critic run through --config executors-3600.json, the default config with timeoutSeconds 3600 for the opencode-go preset and the critic, as in run $(basename $PRIOR). Lane prompts are built by the session's build_lanes.py from that run's preamble and this run's battery and scope; the critic prompt by build_critic.py." > $OUT/deviations.txt
node $A/run-lanes.cjs --run-dir $OUT --config $OUT/executors-3600.json --preset opencode-go > $OUT/lanes.log 2>&1; echo "lanes exit $?"; tail -6 $OUT/lanes.log | cut -c1-250
jq '.probes // []' $OUT/lanes/D.json > $OUT/probes-input.json; node $A/run-probes.cjs --probes $OUT/probes-input.json --out $OUT/probes.json > $OUT/probes.log 2>&1; echo "probes exit $?"; tail -2 $OUT/probes.log | cut -c1-200
python3 $SP/build_critic.py $OUT; echo "build critic exit $?"
node $A/run-lanes.cjs --run-dir $OUT --config $OUT/executors-3600.json --critic $OUT/critic.prompt.md > $OUT/critic.log 2>&1; echo "critic exit $?"; tail -3 $OUT/critic.log | cut -c1-250
node $A/aggregate-findings.cjs --run-dir $OUT 2>&1 | tail -3 | cut -c1-300; echo "aggregate exit $?"
