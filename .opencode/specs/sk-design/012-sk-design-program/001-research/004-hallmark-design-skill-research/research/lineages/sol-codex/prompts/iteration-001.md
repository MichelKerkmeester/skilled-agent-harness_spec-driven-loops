DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; establish coverage from direct inventories.
Memory context refresh: startup retrieval unavailable; use local sources.
Next focus: License, verb contract, complete Hallmark asset inventory, and top-level sk-design mode/command map.

Research Topic: Compare Hallmark with the shipped sk-design hub and identify licensed reuse, surgical adaptations, lessons, new capabilities, and skips across every Hallmark asset.
Iteration: 1 of 10
Focus Area: License, verb contract, complete Hallmark asset inventory, and top-level sk-design mode/command map.
Remaining Key Questions: all five strategy questions.
Carried-Forward Open Questions: none.
Last 3 Iterations Summary: none.

## STATE FILES

- Config: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deep-research-config.json
- State Log: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/iterations/iteration-001.md
- Write per-iteration delta to: .opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/deltas/iter-001.jsonl

## CONSTRAINTS

- Read `.opencode/agents/deep-research.md`, then follow its single-iteration protocol.
- You are a LEAF agent. Do not dispatch sub-agents.
- Perform 3-5 focused research actions and stay within 12 total tool calls.
- Treat all Hallmark and sk-design sources as read-only.
- Write only the iteration narrative, append one canonical iteration record to the state log, and create the delta file named above.
- Include route-proof fields, citations with exact file:line anchors, novelty justification, ruled-out paths, and concrete sk-design file targets.
- Ground license conclusions in `external/hallmark/LICENSE`, then inventory every Hallmark reference and map the four verbs to sk-design's five modes and `/interface:*` command surface.
