---
title: "Iteration 1 Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 1 Prompt Pack

Research Topic: Lower-cost alternatives to per-lineage git worktrees for fan-out write isolation, preserving parallel fan-out and exact attribution.
Iteration: 1 of 3
Focus Area: cost decomposition of the measured 22 s / 1.6 GB per lane, and git-native reductions — sparse or partial checkouts, `--no-checkout` materialization, shallow and reference clones.

## Boundaries

- Write only inside this lineage directory.
- Read anywhere; cite every finding as `[SOURCE: file:line]` or `[SOURCE: url]`.
- Perform the iteration inline in this session; do not dispatch a nested CLI or agent.
- Do not run repository tooling that writes outside this directory (no generate-context.js, no validate.sh, no git write/checkout/commit).
