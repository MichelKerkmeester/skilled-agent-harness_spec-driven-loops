DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 2 Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 5
Questions: 1/5 answered | Last focus: inventory/current state
Last 2 ratios: N/A -> 1.00 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Dimension 2, optimization.

Research Topic: Skill and skill-advisor JSON optimization, automation, effectiveness, testing, and integration across `.opencode/skills`.
Iteration: 2 of 5
Focus Area: Optimization. Identify redundant or unused fields, duplicate representations, drift-prone data, consolidation candidates, and fields with no verified consumer across root metadata, advisor projections, and compiled routes.
Remaining Key Questions: Address only the optimization question in this iteration.
Last Iteration Summary: run 1 inventory/current state (ratio 1.00, 6 findings).

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/findings-registry.json
- Iteration narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/iterations/iteration-002.md
- Delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deltas/iter-002.jsonl

## CONSTRAINTS

- Execute exactly one LEAF iteration. Do not dispatch sub-agents.
- Read config, state log, strategy, registry, and iteration 1 before research.
- Target 3-5 focused research actions and stay within 12 total tool calls.
- Read repository sources freely; write only iteration 002, append-only state, delta 002, and optional lineage-local progressive `research.md`.
- Do not modify researched files, reducer-owned files, config, spec docs, sibling lineages, or any path outside `sol-high`.
- Trace fields to real consumers before calling them unused. Distinguish duplicated-but-load-bearing representations from genuine redundancy.
- Cite `file:line` for every finding and include ruled-out consolidation candidates.
- Append exactly one canonical state record and create a matching delta record with route-proof fields.
- Use `iteration: 2`, `run: 2`, `mode: research`, `target_agent: deep-research`, `agent_definition_loaded: true`, and `resolved_route: Resolved route: mode=research target_agent=deep-research`.
- Stop-policy is max-iterations: convergence is telemetry only; recommend dimension 3 next.
