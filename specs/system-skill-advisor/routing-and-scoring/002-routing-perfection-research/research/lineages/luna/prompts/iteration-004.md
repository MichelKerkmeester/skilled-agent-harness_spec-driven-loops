---
title: "Iteration 4 Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 4 Prompt Pack

Research Topic: Perfect skill routing across the fleet: why a phrase a hub's router advertises fails to reach that hub, and what would fix it.
Iteration: 4 of 5
Focus Area: compiled routing

## State Files

- Config: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-config.json`
- State log: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-state.jsonl`
- Strategy: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-strategy.md`
- Iteration narrative: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/iterations/iteration-004.md`
- Delta: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deltas/iter-004.jsonl`

## Inline execution contract

Read the supplied `specs/system-skill-advisor/024-routing-perfection-research/research/dispatch-prompt.md` and the state log first. Work only on compiled-route membership and the legacy fallback. Probe `compiled-route.cjs` for all six hubs, read the resolver/engine/guard/manifest sources, and separate compiled-runtime benefits and rollout costs from scorer vocabulary repair. Do not spawn an executor, modify compiled sources, or re-derive the supplied five-hub fact.

