# Iteration 12 — kimi

**Angle:** Route manifest mutation-class consistency sweep — check every `_routes.yaml` target for allowed_flags that imply mutating operations versus declared `mutating:` class and authorized `mcp_tools`.

**Findings:** 3

- **[P1] contradiction** `.opencode/commands/doctor/_routes.yaml:30-38` — memory route exposes incremental index-scan flag and authorizes a mutating tool while declared read-only
  - evidence: allowed_flags: ["--incremental=true|false", "--no-snapshot", "--dry-run"]; mutating: read-only; mcp_tools includes mcp__mk_spec_memory__memory_index_scan, whose schema controls incremental indexing writes to the context-index DB
  - fix: Drop --incremental and mcp__mk_spec_memory__memory_index_scan from the memory route, or reclassify the route as mutates/add-only with a Gate 3 location; the memory doctor YAML contract is explicitly diagnostic-only.
- **[P1] contradiction** `.opencode/commands/doctor/_routes.yaml:63-69` — causal-graph route authorizes memory_causal_stats while declared read-only
  - evidence: mutating: read-only; mcp_tools includes mcp__mk_spec_memory__memory_causal_stats, whose backfill parameter commits causal_edges (e.g., memory_causal_stats({ backfill: { dryRun: false } }))
  - fix: Remove mcp__mk_spec_memory__memory_causal_stats from the causal-graph route and rely on memory_drift_why + memory_search for read-only diagnostics, or reclassify the route as add-only.
- **[P1] misalignment** `.opencode/commands/doctor/_routes.yaml:121-133` — skill-advisor route declares mutates but exposes a --dry-run preview flag
  - evidence: allowed_flags: ["--skip-tests", "--dry-run", "--scope=all|explicit|derived|lexical"]; mutating: mutates; dry_run is also listed in setup_vars, meaning the same route supports both no-write preview and file-mutating apply modes
  - fix: Split skill-advisor into two manifest rows (read-only dry-run preview vs. mutates apply) or extend the schema to support mode-dependent mutation classes so --dry-run is not misrepresented as mutates.
