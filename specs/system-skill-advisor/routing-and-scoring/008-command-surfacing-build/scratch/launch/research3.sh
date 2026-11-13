#!/bin/bash
# Research segment three launcher. Run it only after phases 012 and 013 are built and committed.
# Three lineages, 6 iterations each, concurrency 3, convergence 0.05 (the research default).
# Labels differ from segment two's, so research/lineages/ keeps the earlier lineage folders;
# research/orchestration-summary.json is rewritten by this run, as segment two rewrote it.
# After the run: merge with fanout-merge.cjs --loop-type research --artifact-dir $SF/research,
# then write research/research-segment-3.md the way research-segment-2.md was written.
S=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/fddcf466-8e1f-44cf-a132-6f846b676c18/scratchpad
W=/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research
SF=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research
cd $W || exit 2
CFG='{"executors":[{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":6,"label":"offer-reach-3","count":1},{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":6,"label":"cross-cli-3","count":1},{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":6,"label":"ux-cost-3","count":1}],"concurrency":3}'
printf '%s\n' "$CFG" > $SF/research/deep-research-config-segment-3.json
node .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder $SF --loop-type research \
  --research-topic "$(cat $S/topic3.txt)" \
  --fanout-config-json "$CFG" \
  --base-artifact-dir $SF/research \
  --convergence-threshold 0.05 --stop-policy convergence --convergence-mode default \
  > $S/fanout3.out 2> $S/fanout3.err
echo "fanout exit=$?"
