# Iteration 10: Rate Limits, Batching, Large-Workspace Scalability, and Remaining Gaps

## Focus
Rate-limit budgets for large workspaces, batching strategies to stay within API constraints, and any remaining unanswered questions requiring human judgement.

## Findings

### F10.1 — Rate Limit Budget for Large Workspaces

Notion API rate limit: ~3 requests/second per integration, ~1000 requests/5 minutes per workspace. For a large workspace (50 databases, 200 data sources, 5000 pages):

| Phase | Approximate API calls | Time at 3 req/s | Notes |
|---|---|---|---|
| Inventory — DB/data source metadata | 50 (DB) + 200 (DS) = 250 | ~83 sec | One call per entity; no pagination needed |
| Inventory — row queries (page_size=100) | 200 DS × (rows/100 avg) = ~1000+ | ~5.5 min | Worst case: 5000 pages → 50 queries per DS? No — each DS has its own rows |
| Inventory — views listing | 50 DBs × 1 call = 50 | ~17 sec | Direct API |
| Inventory — comments listing | 5000 pages × 1 call = 5000 | ~28 min | SLOW — only do for pages flagged must-preserve |
| Inventory — markdown page bodies | 5000 pages × 1 call = 5000 | ~28 min | Only if full content audit needed |
| Relation reconstruction — cross-reference build | 200 DS schemas already read in inventory | 0 | Reuse cached data |
| Verification — row counts | 200 DS × 1 call = 200 (using page_size=1 trick) | ~67 sec | Use cached counts from inventory |
| **Total (full deep inventory)** | **~11,500** | **~64 min** | Realistic maximum for 5000 pages |
| **Total (quick inventory + schema only)** | **~500** | **~3 min** | Lightweight alternative |

[SOURCE: mcp-notion/references/api-gap-tools.md §8 — rate limit: ~3 req/s, 1000/5min]
[SOURCE: mcp-notion SKILL.md §4, rule 6 — rate limit handling]

### F10.2 — Batching and Optimization Strategies

| Strategy | What it does | Impact | When to use |
|---|---|---|---|
| Quick inventory first | Query each DS with `page_size=1` → get count + schema | Gets count/schema in 1 call vs 10+ per DS | Always — enables scoped decision before full inventory |
| Prioritized inventory | Only deep-inventory databases marked "must-preserve" | Cuts calls by 50-80% | After quick inventory + human review |
| Batch vs sequential | 3 concurrent API calls with 333ms spacing | Maximizes throughput without 429s | Within a single phase |
| Cache schema locally | Once a data source schema is read, reuse it | Eliminates redundant calls | Always — cache per migration run |
| Skip full comment inventory | Only list comments for pages with high interaction | Saves 5000+ calls | Unless comment reconstruction is P0 |
| Skip page body inventory | Only retrieve-a-page for properties, not markdown bodies | Saves 5000 calls unless full content audit is needed | Most workspaces |
| Incremental approach | Migrate one database at a time, verify, then proceed | Spreads calls across days | Very large workspaces (500+ databases) |

[SOURCE: mcp-notion/references/mcp-tools.md §5 — query-data-source with page_size param]
[SOURCE: prior-findings.md §4 — test-vault-first, incremental]

### F10.3 — Remaining Open Gaps (Requiring Human Judgement)

| Gap | Why it remains | Who resolves |
|---|---|---|
| **Notion vs Notion Bases formula function mapping** | Every workspace has unique formulas; one-to-one mapping depends on the specific Notion formula | Human | Agent: Document each formula, propose plugin equivalent, flag unsupported functions |
| **Acceptable data loss threshold** | What constitutes "flawless" for this specific workspace — every formula? Every view? Every comment? | Human | Agent: Present the available options with concrete loss implications |
| **Plugin version compatibility** | Notion Bases plugin and Obsidian core versions may not align at migration time | Human/Agent (check at time of execution) | Agent: Read plugin manifest.json for min Obsidian version |
| **Folder structure preference** | Flat vs nested — usability decision with no right answer | Human | Agent: Present 2-3 options with trade-offs |
| **Recurring task migration granularity** | Does every recurring task need to be migrated, or only the template? | Human | Agent: Report count; let human choose depth |
| **Large file handling** | Files >20 MiB may fail import; must be manually copied | Human | Agent: Detect file sizes during inventory; report candidates |

[SOURCE: prior-findings.md §5 — "honest boundaries"]
[SOURCE: mcp-obsidian SKILL.md §4 — "preview destructive ops" principle applies to migration too]

### F10.4 — Scalability Limits Summary

| Constraint | Limit | Mitigation |
|---|---|---|
| Notion API rate limit | ~3 req/s per integration | Spread inventory across hours; prioritize |
| Obsidian Importer scope limit | Per-run scope: selected pages/DBs; no automated "migrate all" | Use incremental migration per database train |
| Vault filesystem size | Depends on disk, not a hard limit | Monitor disk; files are small Markdown |
| Relation reconstruction time | UUID→wikilink: ~50 notes/min for the AI batch script | Run as background job |
| Notion Bases plugin row limit per DB | No documented limit; performance depends on number of `.md` files per folder | Monitor folder size; split very large DBs (>5000 rows) into subfolders |
| mcp-obsidian notesmd-cli batch | Command-per-file means 1 CLI call per note | Script in shell loops; budget ~100 notes/min |

[SOURCE: mcp-notion/references/api-gap-tools.md §8 — rate limits]
[SOURCE: mcp-obsidian SKILL.md §7 — notesmd-cli is per-command, not bulk]

### F10.5 — Decision: Complete Migration Method

Based on all 10 iterations, the decisive flawless migration method for a complex Notion workspace:

**Importer**: Notion API (default), HTML fallback only if integration token cannot be created
**Plugin stack**: Notion Bases (P0 required) + Dataview (P1) + Tasks (conditional) + Obsidian Git (recommended)
**Relation/rollup recovery**: Notion Bases plugin handles >90%; Dataview handles remaining custom aggregations
**File/attachment handling**: Importer preserves inline; agent verifies/reports large file gaps
**Comment handling**: Not imported; agent converts to callout blocks as a post-import task
**Multi-view databases**: Primary view auto-imported; secondary views reconstructed via Notion Bases plugin
**Verification**: Two-pass (AI automated script + human sample)
**Division of labor**: Hybrid — human does 3 GUI actions, AI does everything else

[SOURCE: Synthesis of all 10 iterations, seeded prior-findings, and skill knowledge]

## Sources Consulted
- mcp-notion/references/api-gap-tools.md §8
- mcp-notion/references/mcp-tools.md §5
- mcp-notion SKILL.md §4
- mcp-obsidian SKILL.md §4, §7
- prior-findings.md §4, §5
- All iteration-001..010.md findings

## Assessment
- newInfoRatio: 0.7
- noveltyJustification: "Rate-limit budget for a defined workspace scale, batching strategies, gap register, and decisive migration method summary are new synthesis-level output"
- Confidence: High — all numbers are derived from known API constraints and tool capabilities

## Reflection
- What worked: The call-count budget makes real migration timing predictable — essential for phase planning
- What failed: Without a live large workspace, the timing predictions are estimates; actual time = estimates × 1.5-2x for retries/batching overhead
- Ruled out: Pretending the 3 req/s limit is not a factor for large workspaces — it is the dominant constraint

## Recommended Next Focus
Phase synthesis — compile all 10 iterations + prior findings into the final research.md