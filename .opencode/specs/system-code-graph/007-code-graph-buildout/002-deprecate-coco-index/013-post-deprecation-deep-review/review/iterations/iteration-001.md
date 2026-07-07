# Iteration 1 - D1 Correctness / Reference Completeness

## Files Reviewed
- `.gemini/GEMINI.md:5`
- `.gitignore:123`
- `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.json:37`
- `.opencode/commands/memory/manage.md:3`
- `.utcp_config.json`
- `.gemini/`, `.codex/`, `cli-*/` (extended alias sweep)

## Findings

### P0
- **F001**: GEMINI.md routes to the deleted CocoIndex MCP tool — `.gemini/GEMINI.md:5` — Replace the SEARCH ROUTING line (`use CocoIndex semantic search (mcp__cocoindex_code__search)`) with the HYBRID policy (Code Graph + Grep) to match the other four runtime routing docs. A Gemini session would be told to call a non-existent MCP tool.

### P1
- **F002**: advisor database/skill-graph.json carries 8 stale system-rerank-sidecar / mcp-coco-index / 8765 references — `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.json:37` — Lines 37/144/221-228/232/239/493-497/522 (system list, siblings, adjacency block, depends_on, enhances, keywords incl localhost 8765 rerank, hub_skills). Regenerate the database/ copy from the recompiled scripts/ skill-graph.json so the advisor never routes to deleted skills.
- **F003**: /memory:manage declares the removed ccc subcommand + CCC MODE section — `.opencode/commands/memory/manage.md:3` — Lines 3/19/25/40/168/944 (argument-hint, mode list, error message, action routing, router, CCC MODE §16). Remove the ccc subcommand + CCC MODE §16-17 (the ccc_* tools were removed in phase 002).

### P2
- **F004**: .gitignore has a stale .cocoindex_code/ ignore entry — `.gitignore:123` — Remove the ignore entry for the deleted directory.

## Confirmed-Clean Surfaces
Extended alias sweep across `.gemini/`, `.codex/`, `cli-*/`, hidden config dirs, and `.utcp_config.json` (the scopes the executor's own greps excluded): NO new live references beyond F001-F004. The cli-* `pkill ccc search` cleanup lines are the documented exception. The deprecation was complete except these 4 known misses.

## Claim Adjudication
- F001: claim "GEMINI.md routes to deleted MCP tool"; evidence .gemini/GEMINI.md:5; counterevidence sought = other 4 routing docs (all clean); alternative = archival ref (rejected — it is the live SEARCH ROUTING directive); finalSeverity P0; confidence 0.95.
- F002: claim "database/skill-graph.json stale deleted-skill refs"; evidence database/skill-graph.json:37; counterevidence sought = whether database/ is intentionally retained for rollback; alternative = backward-compat (rejected — advisor reads it live); finalSeverity P1; confidence 0.90.
- F003: claim "/memory:manage declares removed ccc subcommands"; evidence manage.md:3; counterevidence sought = whether ccc_* still exist; alternative = planned restoration (rejected — removed in 002); finalSeverity P1; confidence 0.95.

## Next Focus
D2 Security over cluster B (config/registration/mirror integrity, surfaces 6-10) + the devin-mcp broken-path/duplicate-registration note.

Review verdict: CONDITIONAL
