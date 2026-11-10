---
title: "Iteration 2 Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 2 Prompt Pack

Research Topic: Perfect skill routing across the fleet: why a phrase a hub's router advertises fails to reach that hub, and what would fix it.
Iteration: 2 of 5
Focus Area: cross-hub collision arbitration

## State Files

- Config: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-config.json`
- State log: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-state.jsonl`
- Strategy: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deep-research-strategy.md`
- Iteration narrative: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/iterations/iteration-002.md`
- Delta: `specs/system-skill-advisor/024-routing-perfection-research/research/lineages/luna/deltas/iter-002.jsonl`

## Inline execution contract

Read the supplied `specs/system-skill-advisor/024-routing-perfection-research/research/dispatch-prompt.md` and the state log first. Read all four contract files for `sk-design`, `sk-doc`, `sk-code`, `mcp-tooling`, `system-deep-loop`, and `cli-external-orchestration`. Work only on collision arbitration. Do not spawn an executor, re-derive the supplied fleet totals, add vocabulary, or lower the confidence bar. Probe representative review/audit/branch phrases, cite every finding, and rank recommendations as `[implementable today]` or `[needs a scorer change]`.

