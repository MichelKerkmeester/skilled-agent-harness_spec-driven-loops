# Iteration 28 — kimi

**Angle:** Add an automated linter that extracts bracketed `--flags` from command `argument-hint` frontmatter and runs them through `resolvePropertyName()` against the targeted MCP tool schemas.

**Findings:** 5

- **[P1] misalignment** `.opencode/commands/memory/manage.md:3` — memory:manage bulk-delete flags do not map to memory_bulk_delete schema properties
  - evidence: argument-hint includes '[bulk-delete <tier> [--older-than <days>] [--folder <spec>]]'; tool-input-schemas.ts:338-346 defines properties tier, specFolder, confirm, olderThanDays, skipCheckpoint. resolvePropertyName (spec-memory-cli.ts:288-296) with toCamelCaseFlag (line 257) turns --folder into 'folder' (unmatched) and --older-than into 'olderThan', not 'olderThanDays'.
  - fix: Change the hint to '[--older-than-days <days>] [--spec-folder <spec>]' to match the schema property names.
- **[P1] misalignment** `.opencode/commands/memory/search.md:3` — memory:search --intent:<type> colon syntax fails resolvePropertyName
  - evidence: argument-hint: '<query> [--intent:<type>] ...' and line 43 says 'Parse an optional `--intent:<type>` from `QUERY`'. memory_context schema property is 'intent' (tool-input-schemas.ts:181), and resolvePropertyName does not strip ':<type>', so 'intent:<type>' does not resolve.
  - fix: Use '[--intent <type>]' to match the MCP schema property name.
- **[P1] undocumented** `.opencode/commands/speckit/plan.md:3` — speckit:plan advertises workflow flags absent from allowed MCP tool schemas
  - evidence: argument-hint lists [--intake-only] [--phases N] [--phase-names list] [--phase-folder=<path>] [--level=1|2|3|3+] [--start-state=STATE] [--repair-mode=MODE] [--record-relationships=yes|no] [--depends-on=IDs] [--related-to=IDs] [--supersedes=IDs]; allowed-tools (line 4) only targets memory_context/search/save/index_scan. Only --spec-folder resolves to an existing property (specFolder).
  - fix: Scope the linter to check these flags against a workflow-input schema, or align the hint with the MCP tool parameters actually accepted.
- **[P1] undocumented** `.opencode/commands/doctor/update.md:3` — doctor:update flags are workflow-only relative to allowed MCP tools
  - evidence: argument-hint: '[--force] [--no-snapshot] [--cleanup-legacy] [--migrate] [--keep-snapshots] [--resume-bootstrap]'. allowed-tools (line 4) lists code_index, spec_memory, and skill_advisor tools; none of these dashed flags map to properties on those schemas.
  - fix: Treat these as workflow-level flags and validate them against the update workflow YAML schema instead of MCP tool schemas.
- **[P1] dead** `.opencode/commands/doctor/mcp.md:3-4` — doctor:mcp has MCP-style flags but no MCP tools in allowed-tools
  - evidence: argument-hint (line 3): '<install|debug> [--server <name>] [--runtime <name>] [--fix]'; allowed-tools (line 4) is 'Read, Bash, Grep, Glob, Edit, Write'. There is no MCP tool schema to run the flags through.
  - fix: Either add the relevant MCP tool names to allowed-tools or mark the command as non-MCP so the linter skips schema validation.
