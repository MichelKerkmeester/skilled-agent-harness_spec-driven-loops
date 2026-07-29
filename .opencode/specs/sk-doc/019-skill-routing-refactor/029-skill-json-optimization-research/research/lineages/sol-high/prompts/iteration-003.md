DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 3 Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 5
Questions: 2/5 answered | Last focus: optimization
Last 2 ratios: 1.00 -> 0.92 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Dimension 3, automation gaps.

Research Topic: Skill and skill-advisor JSON optimization, automation, effectiveness, testing, and integration across `.opencode/skills`.
Iteration: 3 of 5
Focus Area: Automation gaps. Identify hand-authored or manually synchronized JSON that scaffolding, generators, freshness gates, or reconciliation could own. Audit `init_skill.py`, manifest/description/graph generators, root gates, and compiled-route refresh paths against every in-scope JSON type.
Remaining Key Questions: Address only the automation question.
Last Iterations: run 1 inventory (1.00); run 2 optimization (0.92).

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/findings-registry.json
- Iteration narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/iterations/iteration-003.md
- Delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deltas/iter-003.jsonl

## CONSTRAINTS

- Execute exactly one LEAF iteration; no sub-agents.
- Read state and prior iterations before research.
- Use 3-5 focused actions, maximum 12 tool calls.
- Read repository sources freely; write only iteration 003, one state append, delta 003, and optional lineage-local `research.md`.
- Do not modify any researched, reducer-owned, config, spec, sibling-lineage, or out-of-lineage path.
- Evaluate scaffolder coverage and generation/validation lifecycle end to end. Distinguish intentional human policy from derivable boilerplate.
- Cite `file:line` for every finding and rank automation gaps by likely leverage.
- Append exactly one canonical state record and matching delta record using iteration/run 3 and required route-proof fields.
- Convergence is telemetry only. Continue to dimension 4 next.
