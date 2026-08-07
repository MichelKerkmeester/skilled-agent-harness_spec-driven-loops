DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

Segment: 1 | Iteration: 3 of 5
Questions: 3/5 answered | Last focus: limits, plan gating, batch behavior, and data shapes
Last 2 ratios: 1.00 -> 0.78 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: official Refero plan/schema findings are reduced; auth and packet-design questions remain.
Next focus: Verify `mcp-remote` OAuth/browser behavior, token persistence implications, and failure presentation for the existing manual.

## STATE FILES

- Config: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/deep-research-config.json`
- State Log: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/deep-research-state.jsonl`
- Strategy: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/deep-research-strategy.md`
- Registry: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/findings-registry.json`
- Write narrative: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/iterations/iteration-003.md`
- Write delta: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol/deltas/iter-003.jsonl`

## CONSTRAINTS

- LEAF execution; no nested Codex or sub-agents.
- Do not launch `npx mcp-remote`, open an OAuth browser, write tokens, or alter the manual.
- Use primary package repository/source and observed Refero metadata.
- Write only the three iteration artifacts and preserve route proof.
