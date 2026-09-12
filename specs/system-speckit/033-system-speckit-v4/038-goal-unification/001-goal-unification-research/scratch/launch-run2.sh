#!/bin/bash
cd "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P="specs/system-speckit/033-system-speckit-v4/036-goal-unification/001-goal-unification-research"
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder "$P" \
  --loop-type research \
  --stop-policy max-iterations \
  --convergence-threshold 0.05 \
  --research-topic "Goal unification, run 2 (iterations 11-15 of a 15-iteration program). Iterations 1-10 already ran on deepseek and wrote /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/$P/research/lineages/deepseek/research.md plus iterations/iteration-001.md through iteration-010.md. BEFORE your first iteration, read that research.md in full and skim the ten iteration files; your job is to verify, refute and deepen those findings, not repeat them. Follow the charter at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/$P/research/deep-research-strategy.md, allocation rows 11-15: attack the weakest-evidenced angle first, verify the runtime feasibility claims against the repo, reconcile isolation with auto-update authority, verify the 4000-char budget arithmetic on /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-speckit/033-system-speckit-v4/036-goal-unification/goal.md, then a final ranked synthesis per decision D1-D7 that states where you agree with, correct, or overturn run 1, with resolving file:line citations. Research only; write nothing outside the lineage directory." \
  --fanout-config-json "$(cat $P/research/deep-research-fanout-config.run2.json)" \
  --base-artifact-dir "$P/research"
