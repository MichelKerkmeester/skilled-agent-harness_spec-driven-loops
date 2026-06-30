# Iteration 1 — kimi

**Angle:** Command<->impl drift: each command doc (.opencode/commands/**/*.md) vs its asset YAML/script/handler — flags, routes, documented behavior vs actual.

**Findings:** 5

- **[P1] drift** `.opencode/commands/memory/manage.md:32` — /memory:manage validate subcommand uses wrong value type
  - evidence: manage.md line 32 documents `validate <id> <useful|not>`; tool-input-schemas.ts:325-327 defines `memoryValidateSchema` with `wasUseful: z.boolean()` — no `<useful|not>` string is accepted.
  - fix: Change command doc and argument-hint to `validate <id> <true|false>` and map it to tool parameter `wasUseful`.
- **[P1] undocumented** `.opencode/commands/doctor/update.md:30-31` — /doctor:update binds skip_status_check without a flag
  - evidence: update.md line 30 lists parsed flags `--force`, `--no-snapshot`, `--cleanup-legacy`, `--migrate`, `--keep-snapshots`, `--resume-bootstrap`; line 31 additionally binds `skip_status_check`, but no `--skip-status-check` flag is declared in argument-hint or step 2.
  - fix: Add `--skip-status-check` to argument-hint and step 2 flag list, or remove `skip_status_check` from step 3 binding.
- **[P0] contradiction** `.opencode/commands/doctor/_routes.yaml:76-93` — /doctor code-graph route declares read-only but advertises mutating operations
  - evidence: _routes.yaml:84 says `mutating: read-only` and line 85 says 'never scans or writes the index'; yet line 81 allows `--operation=rescan|prune-excludes|repair-nodes|recover-sqlite-corruption|rollback-bad-apply` and line 83 allows `--confirm`, all of which invoke `code_graph_apply` (tool-schemas.ts:149-165), a destructive apply-mode tool. The target's `mcp_tools` list (lines 86-92) also omits `code_graph_apply`.
  - fix: Either reclassify target as `mutating: mutates` and add `mcp__mk_code_index__code_graph_apply`/`code_graph_scan` to mcp_tools, or remove the mutating `--operation` values from `allowed_flags` to match the read-only Phase A contract.
- **[P2] misalignment** `.opencode/commands/memory/manage.md:4` — /memory:manage omits session_health from allowed-tools despite ownership claim
  - evidence: README.txt:267 lists `session_health` as L3 tool owned by `/memory:manage`; manage.md frontmatter line 4 enumerates 19 allowed MCP tools but does not include `mcp__mk_spec_memory__session_health`.
  - fix: Add `mcp__mk_spec_memory__session_health` to manage.md allowed-tools and expose a `manage session-health` subcommand, or remove the ownership claim from README.txt.
- **[P2] drift** `.opencode/commands/memory/README.txt:335-338` — Memory README related-document paths point to non-existent `skill/` directory
  - evidence: README.txt lines 335-338 use `../../skill/system-spec-kit/...` (singular `skill`), but the repository uses `.opencode/skills/` (plural).
  - fix: Replace `../../skill/` with `../../skills/` in all four related-document rows.
