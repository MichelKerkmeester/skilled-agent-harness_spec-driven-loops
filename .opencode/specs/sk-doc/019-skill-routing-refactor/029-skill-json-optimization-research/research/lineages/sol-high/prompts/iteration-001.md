DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 1 Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 5
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: focused lookup found no canonical packet results.
Next focus: Dimension 1, inventory and current state.

Research Topic: Skill and skill-advisor JSON optimization, automation, effectiveness, testing, and integration across `.opencode/skills`.
Iteration: 1 of 5
Focus Area: Inventory and current state. Enumerate every in-scope JSON type, classify authored versus generated, measure presence per H or S root, and map current generation and validation coverage.
Remaining Key Questions: See the strategy file. Address only the first key question in this iteration.
Last 3 Iterations Summary: none yet

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/findings-registry.json
- Iteration narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/iterations/iteration-001.md
- Delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/lineages/sol-high/deltas/iter-001.jsonl

## CONSTRAINTS

- Execute exactly one LEAF iteration. Do not dispatch sub-agents.
- Read config, state log, and strategy before research.
- Target 3-5 focused research actions and stay within 12 total tool calls.
- Read any repository path needed for evidence, but write only the iteration narrative, append-only state log, delta file, and optional lineage-local `research.md`.
- Do not modify researched files, reducer-owned files, config, spec docs, sibling lineages, or any path outside `sol-high`.
- Findings only. Do not implement fixes or redesign advisor scoring or the H/S contract.
- Cite `file:line` for every finding. Include ruled-out directions and dead ends.
- Append exactly one canonical `type: iteration` state record with route-proof fields.
- Create a delta whose first record matches the canonical state record and includes structured finding or ruled-out rows.
- Use `iteration: 1`, `run: 1`, `mode: research`, `target_agent: deep-research`, `agent_definition_loaded: true`, and `resolved_route: Resolved route: mode=research target_agent=deep-research`.
- Stop-policy is max-iterations: do not synthesize the full five-dimension report in this iteration.
