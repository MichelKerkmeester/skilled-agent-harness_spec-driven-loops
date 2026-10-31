---
title: "Iteration 5 Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 5 Prompt Pack

Research Topic: Perfect skill routing across the fleet: why a phrase a hub's router advertises fails to reach that hub, and what would fix it.
Iteration: 5 of 5
Focus Area: measurement as gate

## State Files

- Config: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-config.json`
- State log: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-state.jsonl`
- Strategy: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-strategy.md`
- Iteration narrative: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/iterations/iteration-005.md`
- Delta: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deltas/iter-005.jsonl`

## Inline execution contract

Read the supplied `specs/system-skill-advisor/024-routing-perfection-research/research/dispatch-prompt.md` and the state log first. Read `ci-router-vocabulary-reach.cjs` and the supplied reach reports. Define the build-gating assertions, safe negatives, baseline traps, and probe-health behavior. Do not spawn an executor, add vocabulary, lower the confidence bar, or re-derive the supplied daemon-generation-679 totals.

