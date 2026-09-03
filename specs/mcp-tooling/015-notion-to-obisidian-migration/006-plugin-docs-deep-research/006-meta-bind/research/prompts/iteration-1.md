---
title: "Deep-Research Iteration Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 4
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: none loaded yet.
Next focus: Start by researching the Meta Bind expression grammar for now()-style timestamps and the js action signature

Research Topic: Optimize the mcp-obsidian meta-bind file-layer reference docs for AI operation. Research the real plugin (repo mProjectsCode/obsidian-meta-bind-plugin, id obsidian-meta-bind-plugin, docs, and the installed main.js) to resolve the two VERIFY-flagged unknowns behind the Notion-style task-timer buttons: (1) the exact expression grammar for writing a now()-style timestamp into frontmatter from a button, and (2) the precise signature and options of the js inline-button action (script path resolution, arguments, and coupling to the JS Engine plugin). Confirm input-field and button-block syntax and identify missing workflows and gotchas.
Iteration: 1 of 4
Focus Area: Start by researching the Meta Bind expression grammar for now()-style timestamps and the js action signature
Remaining Key Questions: 
- What is the exact expression grammar for writing a now()-style timestamp into frontmatter from a Meta Bind button?
- What are the precise signature and options of the js inline-button action in Meta Bind?
- How does the js action resolve script paths and couple with the JS Engine plugin?
- What is the correct syntax for Meta Bind input-fields and button-blocks?
- What workflows and gotchas are missing from the current reference docs?

Carried-Forward Open Questions:
None yet

Last 3 Iterations Summary: No prior iterations
Pivot Lineage: none yet
Saturated Directions: none yet

## STATE FILES

All paths are relative to the repo root.

- Config: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-config.json
- State Log: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-state.jsonl
- Strategy: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-strategy.md
- Registry: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/findings-registry.json
- Write iteration narrative to: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/iterations/iteration-001.md
- Write per-iteration delta file to: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization. Treat those reducer-owned files as read-only.
- Do not re-enter a saturated direction.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/iterations/iteration-001.md
  - specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-state.jsonl
  - specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deltas/iter-001.jsonl
- **BANNED OPERATIONS**: rm, rm -rf, git rm, mv, sed -i, rmdir, shell output-redirect truncate
- **SCOPE VIOLATION PROTOCOL**: if you would need to modify any path not in the allowed-write list, STOP and emit a finding instead.
- Research HARD BOUNDARY: Do NOT edit shipped mcp-obsidian reference docs outside the spec folder.

## OUTPUT CONTRACT

You MUST produce THREE artifacts:

1. **Iteration narrative markdown** at specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/iterations/iteration-001.md
2. **Canonical JSONL iteration record** appended to specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deep-research-state.jsonl with type="iteration"
3. **Per-iteration delta file** at specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind/research/deltas/iter-001.jsonl with the same iteration record plus structured events
