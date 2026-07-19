You are one read-only research seat executing iteration 11 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline v0.5.0 docs) against the VENDORED tree at v0.7.0-pre.6 and current web state. This is a WAVE-4 DEEP-DIVE iteration.

THIS ITERATION FOCUS: W4 deep-dive: vector + FTS replacement design
Questions (answer ALL):
- Concrete vec_memories migration design: exact DDL replacing the vec0 virtual table with FLOAT[384/768], the KNN query rewrite (vector_distance_cos ORDER BY LIMIT shape), the reindex.ts writeVectorsToKnn rewrite, staging-shard atomic-rename flow compatibility, and the quantized two-stage variant (vector8 coarse scan + exact rerank) with concrete SQL.
- memory_fts replacement design: Turso FTS (fts_match/fts_score/fts_highlight) DDL + query rewrites for the bm25-index.ts FTS5 gate lines (~478/~520) and the 3 sync triggers; how is the index_method experimental flag enabled from the JS SDK / embedded use (not just the CLI flag)? What breaks if FTS stays experimental at adoption time?
- Tantivy weighted-scoring semantics vs the FTS5 bm25() query-time column weights used today at the bm25-index call sites: what ranking drift should be expected and how to compensate (index-time weights / per-column boosts)?

ESTABLISHED (iterations 1-9; build on, do not re-derive): compat-mode sync API shipped (./compat, transaction(fn) variants); not-implemented compat surface = backup(), serialize(), function(), aggregate(), table(), loadExtension(); ATTACH/DETACH + CREATE TRIGGER + VACUUM INTO + database_list/quick_check/table_info/user_version pragmas all OK; synchronous=NORMAL accepted (iter-9 supersedes iter-1); WITH RECURSIVE hard-rejected; no native vector index (linear scan; f32 blob sqlite-vec-compatible; quantized two-stage lever); Tantivy FTS experimental via index_method flag, in JS SDK, NoMergePolicy unconditional, MUTUALLY EXCLUSIVE with MVCC; CDC de-unstabled but per-connection opt-in; bare in-place VACUUM experimental (real blocker at db-shard-migration.ts:274,:282); run().changes reliability partial (NEW 027-era gap); Busy/BusySnapshot replaces SQLITE_BUSY + native busy_timeout; lease single-writer survives; Path C-prime (adapter as ports model 1200-2000 LOC + compat pilot) is the leading strategy; production FAQ: powers production apps but below SQLite reliability bar, libSQL production-ready vs Turso not, no 1.0 signal.

EVIDENCE SOURCES: vendored .opencode/specs/z_future/sqlite-to-turso/external/turso-main/ (COMPAT.md, CHANGELOG.md, docs/, core/, bindings/javascript/); the three skills under .opencode/skills/*/mcp_server/lib; baseline docs + context report in the packet; WebSearch/WebFetch where the question says WEB. Cite [SOURCE: path:line] or URLs with dates.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 11: W4 deep-dive: vector + FTS replacement design
## Focus
(one paragraph)
## Findings
(one bullet per finding; EACH starts with NEW|PARTIAL|KNOWN, then verdict UNCHANGED|CHANGED|REFUTED where applicable, then evidence)
## Ruled Out
## Dead Ends
## Sources Consulted
## Reflection
- What worked: ...
- What failed: ...
- Confidence: high|medium|low + why
## Recommended Next Focus
(one sentence)
