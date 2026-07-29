DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 5 Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 5 of 5
Questions: 4/5 answered | Last focus: effectiveness
Last 2 ratios: 0.83 -> 0.92 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Dimension 5, testing and integration.

Research Topic: Skill and skill-advisor JSON optimization, automation, effectiveness, testing, and integration across `.opencode/skills`.
Iteration: 5 of 5
Focus Area: Testing and integration. Map per-JSON unit, schema, freshness, and CI coverage plus end-to-end scaffold-to-gate-to-advisor-ingest-to-root-selection-to-compiled-route behavior. Cover failure modes, fallback parity, source-change invalidation, and natural-language per-mode evaluation.
Remaining Key Questions: Address the final testing/integration question.
Last Iterations: run 2 optimization (0.92); run 3 automation (0.83); run 4 effectiveness (0.92).

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/findings-registry.json
- Iteration narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/iterations/iteration-005.md
- Delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deltas/iter-005.jsonl

## CONSTRAINTS

- Execute exactly one LEAF iteration; no sub-agents.
- Read state and all prior iterations before research.
- Use 3-5 focused actions, maximum 12 tool calls.
- Read repository sources freely; write only iteration 005, one state append, delta 005, and optional lineage-local `research.md`.
- Do not modify researched, reducer-owned, config, spec, sibling-lineage, or out-of-lineage paths.
- Build a per-surface coverage matrix where evidence permits. Verify tests assert behavior, not only fixtures or presence.
- Trace the end-to-end happy path and concrete failure modes. Identify missing integration scenarios that would catch the gaps from iterations 1-4.
- Cite `file:line` for every finding. Include ranked testing/integration opportunities to support final synthesis.
- Append exactly one canonical state record and matching delta record using iteration/run 5 and required route-proof fields.
- This is the final evidence iteration, not synthesis. Recommend synthesis as next focus.
