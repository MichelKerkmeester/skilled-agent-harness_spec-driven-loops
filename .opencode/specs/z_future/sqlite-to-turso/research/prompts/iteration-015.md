You are one ADVERSARIAL verification seat executing iteration 15 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

MISSION: earlier iterations produced the CHANGED/REFUTED verdicts below about Turso v0.7.0-pre.6 (vendored at .opencode/specs/z_future/sqlite-to-turso/external/turso-main/). Your job is to ATTEMPT TO REFUTE each one with fresh, independent evidence from the vendored source. Do NOT trust the earlier citations — re-locate the evidence yourself (different files where possible: tests, core implementation, bindings — not just COMPAT.md). Default to skepticism: a claim survives only if you find positive evidence.

THIS ITERATION FOCUS: W5 adversarial: vector, FTS, and call-site claims

CLAIMS TO ADVERSARIALLY VERIFY:
- CLAIM-1 (iter-10, highest value): ZERO call sites of the compat not-implemented surface (backup(, serialize(, .function(, .aggregate(, .table(, loadExtension(, .iterate(, .raw(, .pluck() exist across the three skills OUTSIDE the vector layer. Re-run the greps yourself across .opencode/skills/system-spec-kit/mcp_server/lib, .opencode/skills/system-code-graph/mcp_server/lib, .opencode/skills/system-skill-advisor/mcp_server/lib (production .ts only, exclude tests/dist) and report ANY hits with file:line. Note: sqliteVec.load/loadExtension in the vector layer is a KNOWN exception being replaced by the native-vector design.
- CLAIM-2 (gap 1 unchanged): no native vector index at 0.7.0-pre.6 — similarity search is a full linear scan; only a toy/experimental sparse-IVF exists. Verify in core/ and docs.
- CLAIM-3: Turso dense f32 vector blobs are raw little-endian f32 arrays (dims*4 bytes, no header), making sqlite-vec float32 blobs binary-compatible, and vector_distance_cos = 1 - cosine_similarity matching sqlite-vec ordering. Verify in the vector implementation in core/.
- CLAIM-4 (iter-11): the index_method experimental flag is enableable from the JS SDK via connect options (experimental: ["index_method"] or similar), not just the CLI. Verify in bindings/javascript.
- CLAIM-5 (iter-11): Turso FTS weights are index-time (WITH weights=... at CREATE INDEX), unlike FTS5 query-time bm25() weights; and BM25 stats are per-segment under NoMergePolicy causing ranking drift. Verify the weights syntax + the NoMergePolicy setting in core/index_method/fts.rs.
- CLAIM-6 (iter-11): the dimension-discovery fallback in vector-index-store.ts (regex over sqlite_master for FLOAT[N]) breaks under the native-table design. Read the actual code at vector-index-store.ts around lines 258-273 and confirm the dependency.
- CLAIM-7 (iter-11): the staging-shard reindex flow depends on shard.pragma(wal_checkpoint(TRUNCATE)) before atomic rename (reindex.ts around lines 511-590). Read the code and confirm; cross-check with the W5-seat-13 wal_checkpoint findings if the checkpoint form matters.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents. Web access is unavailable in your sandbox — use only the vendored tree and the repository.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 15: W5 adversarial: vector, FTS, and call-site claims
## Focus
(one paragraph)
## Findings
(one bullet per claim verified; EACH starts with NEW|PARTIAL|KNOWN, then a verdict CONFIRMED|OVERTURNED|NUANCED, then your independent evidence with [SOURCE: path:line])
## Ruled Out
## Dead Ends
## Sources Consulted
## Reflection
- What worked: ...
- What failed: ...
- Confidence: high|medium|low + why
## Recommended Next Focus
(one sentence)

