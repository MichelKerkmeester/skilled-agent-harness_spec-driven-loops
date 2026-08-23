DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 4
Questions: 3/5 answered | Last focus: Meta Bind expression grammar and js action signature
Last 2 ratios: N/A -> 0.90 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Investigate the JS Engine plugin API surface and ButtonContext interface

Research Topic: Optimize the mcp-obsidian meta-bind file-layer reference docs for AI operation. Research the real plugin (repo mProjectsCode/obsidian-meta-bind-plugin, id obsidian-meta-bind-plugin, docs, and the installed main.js) to resolve the two VERIFY-flagged unknowns behind the Notion-style task-timer buttons
Iteration: 2 of 4
Focus Area: Investigate the JS Engine plugin's API surface (engine object methods like engine.setMetadata, engine.getMetadata), the ButtonContext interface shape, and MathJS date handling for view field expressions
Remaining Key Questions:
- How does the js action couple with JS Engine's API surface (engine.setMetadata, engine.getMetadata)?
- What workflows and gotchas are missing from the current reference docs?

## STATE FILES

All paths relative to repo root.

- Config: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-config.json
- State Log: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-state.jsonl
- Strategy: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-strategy.md
- Registry: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/findings-registry.json
- Write iteration narrative to: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/iterations/iteration-002.md
- Write per-iteration delta file to: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deltas/iter-002.jsonl

## CONSTRAINTS

- LEAF agent: no sub-agent dispatch
- Target 3-5 research actions, max 12 tool calls total
- Write ALL findings to files
- Reducer-owned files read-only: strategy, registry, dashboard
- **ALLOWED WRITES**: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/iterations/iteration-002.md, specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-state.jsonl (append), specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deltas/iter-002.jsonl
- **BANNED**: rm, mv, sed -i, truncate >, any destructive operation outside allowed paths
- HARD BOUNDARY: do NOT edit shipped mcp-obsidian reference docs

## OUTPUT CONTRACT

1. Iteration narrative: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/iterations/iteration-002.md
2. JSONL append: one type="iteration" record to specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-state.jsonl
3. Delta file: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deltas/iter-002.jsonl with structured records
