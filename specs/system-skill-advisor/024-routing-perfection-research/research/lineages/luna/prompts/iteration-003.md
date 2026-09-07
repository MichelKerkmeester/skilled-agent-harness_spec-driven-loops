---
title: "Iteration 3 Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 3 Prompt Pack

Research Topic: Perfect skill routing across the fleet: why a phrase a hub's router advertises fails to reach that hub, and what would fix it.
Iteration: 3 of 5
Focus Area: the two-vocabulary contract

## State Files

- Config: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-config.json`
- State log: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-state.jsonl`
- Strategy: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-strategy.md`
- Iteration narrative: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/iterations/iteration-003.md`
- Delta: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deltas/iter-003.jsonl`

## Inline execution contract

Read the supplied `specs/system-skill-advisor/024-routing-perfection-research/research/dispatch-prompt.md` and the state log first. Work only on the stage-1 graph-metadata versus stage-2 router vocabulary contract. Use the checker’s multi-word filtering semantics, inventory exact and canonical coverage across all six hubs, and do not flag bare common words or re-derive the supplied fleet totals. Cite every finding and rank recommendations as `[implementable today]` or `[needs a scorer change]`.

