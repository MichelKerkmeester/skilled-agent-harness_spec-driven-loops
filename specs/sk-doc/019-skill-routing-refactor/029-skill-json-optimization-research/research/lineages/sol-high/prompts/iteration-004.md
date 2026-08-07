DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 4 Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 4 of 5
Questions: 3/5 answered | Last focus: automation
Last 2 ratios: 0.92 -> 0.83 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Dimension 4, effectiveness.

Research Topic: Skill and skill-advisor JSON optimization, automation, effectiveness, testing, and integration across `.opencode/skills`.
Iteration: 4 of 5
Focus Area: Effectiveness. Trace which authored and generated metadata contributes to advisor candidate selection, lane attribution, hub-mode routing, executor delegation, and fallback behavior. Identify intent-signal, ingest, and route-activation gaps that reduce routing quality without redesigning the scoring algorithm.
Remaining Key Questions: Address only the effectiveness question.
Last Iterations: run 1 inventory (1.00); run 2 optimization (0.92); run 3 automation (0.83).

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/findings-registry.json
- Iteration narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/iterations/iteration-004.md
- Delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deltas/iter-004.jsonl

## CONSTRAINTS

- Execute exactly one LEAF iteration; no sub-agents.
- Read state and prior iterations before research.
- Use 3-5 focused actions, maximum 12 tool calls.
- Read repository sources freely; write only iteration 004, one state append, delta 004, and optional lineage-local `research.md`.
- Do not modify researched, reducer-owned, config, spec, sibling-lineage, or out-of-lineage paths.
- Follow metadata through watcher ingest, graph/index projection, advisor rank lanes, compiled hub routes, and executor delegation. Separate selection effectiveness from generated-route serving mechanics.
- Use existing regression/evaluation evidence where available. Do not propose scoring-algorithm redesign.
- Cite `file:line` for every finding and explain which fields are load-bearing versus currently ineffective.
- Append exactly one canonical state record and matching delta record using iteration/run 4 and required route-proof fields.
- Convergence remains telemetry only; recommend dimension 5 next.
