DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

Execute exactly one LEAF research iteration. Read `.opencode/agents/deep-research.md` completely, then read the lineage config, state log, strategy, registry, and iteration 1 narrative before research.

## STATE

Iteration count: 1 of 2. Last ratio: 1.00, but exact schema remains unresolved. `stopPolicy=max-iterations`; this is the mandatory final evidence iteration.
Research Topic: Complete the source-verified `.table.md` data model and file-layer AI knowledge base for `aztekgold/obsidian-tables`.
Iteration: 2 of 2
Focus Area: Use the installed GitHub connector—not raw/blob WebFetch—to read source bodies and resolve exact persisted structure, serialization, migrations, feature commands/settings, workflows, and troubleshooting. Then cover every remaining user-requested surface.

Important discovery: the GitHub connector tool `github_fetch_file` successfully returns source bodies. `src/types.ts` currently begins `// src/types.ts — Agentable V1.0 aligned`, defines `AGENTABLE_VERSION='agentable-1.0.0'`, and exact `TableData`, `ColumnDef`, `ViewDef`, `FilterRule`, `SortRule`, and row interfaces. The author's separate primary-source repo `aztekgold/agentable` documents the JSON Agentic Table Standard. Treat the plugin source as authoritative when it diverges from Agentable.

Prioritize these source files via the GitHub connector: `src/types.ts`, `src/fileHandlers/JsonFileHandler.ts`, `src/fileHandlers/MarkdownFileHandler.ts`, `src/fileHandlers/CsvFileHandler.ts`, `src/utils/migrateUtils.ts`, `src/JsonTableView.ts`, `src/FilterHandler.ts`, `src/SortHandler.ts`, `src/main.ts`, formula/renderers/editors discovered by repository search, README, and fixtures/examples. Search within `aztekgold/obsidian-tables`; also use `aztekgold/agentable` only for explicit standard/migration context.

## STATE FILES

- Config: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian-tables/lineages/sol/deep-research-config.json`
- State Log: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian-tables/lineages/sol/deep-research-state.jsonl`
- Strategy: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian-tables/lineages/sol/deep-research-strategy.md`
- Registry: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian-tables/lineages/sol/findings-registry.json`
- Prior iteration: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian-tables/lineages/sol/iterations/iteration-001.md`
- Write narrative: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian-tables/lineages/sol/iterations/iteration-002.md`
- Append state log above exactly once.
- Write delta: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian-tables/lineages/sol/deltas/iter-002.jsonl`

## REQUIRED COVERAGE

1. Exact root schema and actual `.table.md` wrapper/JSON parsing behavior.
2. All ten column types, exact persisted type strings, shared/optional fields, cell value types, options/colors, date, note-link, formula expression/result inference.
3. Views, filters, multi-sort, hidden/order/width serialization, IDs and ordering.
4. Formula persistence versus computed result behavior.
5. Commands, settings, CSV import/export, embeds, drag/reorder, autosave.
6. File-layer AI recipes: minimal create, add/query/patch row, CSV import, safe atomic in-place patch, validation, migration.
7. Malformed JSON/Markdown-wrapper/formula/migration symptoms and recovery.
8. Explicit uncertainty for any fact not evidenced by source.

## CONSTRAINTS AND OUTPUT

- LEAF only; no subagents. Max 12 tool calls. Batch connector reads where possible.
- The ONLY writes are `iterations/iteration-002.md`, one append to `deep-research-state.jsonl`, and `deltas/iter-002.jsonl`.
- Do not edit reducer-owned or investigated files.
- Cite every finding with exact GitHub file URLs and line ranges when the connector exposes them; cite README/Agentable separately.
- Narrative sections: Focus, Actions Taken, Findings, Verified Data Model, Workflows, Troubleshooting/Edge Cases, Questions Answered/Remaining, Ruled Out, Sources Consulted, Assessment, Reflection, Recommended Synthesis.
- Append one canonical iteration record with iteration/run 2, route proof, novelty justification, source list, graph events if useful, and `executor:{"kind":"cli-codex","model":"gpt-5.6-sol","reasoningEffort":null,"serviceTier":null}`. Delta first line must contain the same JSON object.
- Verify all three artifacts and write containment before returning.
