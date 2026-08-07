DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

Segment: 1 | Iteration: 2 of 5
Questions: 1/5 answered | Last focus: authoritative surface and live unauthenticated behavior
Last 2 ratios: N/A -> 1.00 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: reducer registry contains 6 findings from official docs, live auth probe, and root skill.
Next focus: Separate the documented monthly quota from undocumented burst/rate limits and map batch, page, result, image, and plan constraints.

## STATE FILES

- Config: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/deep-research-config.json`
- State Log: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/deep-research-state.jsonl`
- Strategy: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/deep-research-strategy.md`
- Registry: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/findings-registry.json`
- Write narrative: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/iterations/iteration-002.md`
- Write delta: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/deltas/iter-002.jsonl`

## CONSTRAINTS

- LEAF execution; no sub-agents or nested CLI dispatch.
- Use authoritative current pages rather than stale search-index snippets.
- Write only the three iteration artifacts and preserve route proof.
- Treat convergence as telemetry until iteration 5.
