#!/bin/bash
cd "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P="specs/system-speckit/033-system-speckit-v4/036-goal-unification/001-goal-unification-research"
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder "$P" \
  --loop-type research \
  --stop-policy max-iterations \
  --convergence-threshold 0.05 \
  --research-topic "Goal unification: how the cross-runtime goal hook (.opencode/hooks/goal, .opencode/plugins/opencode-goal.js) should be rebuilt so the packet goal.md under specs/ is the single source of goal state, nested when phased and singular otherwise, with frontmatter never sent in chat and the parent goal auto-updated and resent. Follow the charter at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/$P/research/deep-research-strategy.md: one angle per iteration per its allocation table (iterations 1-10), evidence discipline, deliverables. Research only; write nothing outside the lineage directory." \
  --fanout-config-json "$(cat $P/research/deep-research-fanout-config.run1.json)" \
  --base-artifact-dir "$P/research"
