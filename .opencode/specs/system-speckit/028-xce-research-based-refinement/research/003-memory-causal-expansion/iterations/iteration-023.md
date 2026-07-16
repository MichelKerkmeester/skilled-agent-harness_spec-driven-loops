# Iteration 004 - RQ-A4 Few-shot example-bank retrieval for CocoIndex

## Focus

RQ-A4 asks whether prior validated CocoIndex hits can surface as positive exemplars for later similar queries. The XCE analog is not a public "few-shot bank" feature; it is the broader retrieval-augmentation claim that an agent should receive precise context from search, architecture, trace, and graph-backed context on every relevant tool call. For CocoIndex, the viable transfer is a local example-bank layer that retrieves prior helpful query-result pairs and presents them separately from normal semantic search results.

## Actions Taken

- Re-read XCE's public README for retrieval-augmentation claims. XCE advertises architecture context, semantic search, traceability, and impact analysis as the visible context surface (`external/README.md:22-27`), recommends steering agents to call XCE first for codebase understanding (`external/README.md:101-119`), and describes a graph-store-backed query/context flow (`external/README.md:240-245`). The public docs do not describe an explicit few-shot example-bank implementation.
- Read current CocoIndex activation guidance. The skill triggers on concept/code-location searches such as "find code that does X", fuzzy semantic search, unfamiliar-code exploration, and architecture understanding (`.opencode/skills/mcp-coco-index/SKILL.md:20-32`), but there is no prior-query or search-history feature in the skill surface.
- Read the query path. `query_codebase()` accepts a single user `query`, generates one query embedding, runs one KNN/full-scan path, and returns one deduped/ranked result list (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:267-323`).
- Read the current result schema and rerank surface. `QueryResult` exposes file, language, content, line range, score, raw score, path class, and ranking signals (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py:24-36`). `_ranked_result()` today applies only bounded static score nudges for implementation intent and canonical resources (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:177-223`).
- Read the current vector table shape. Indexed code chunks are represented as `CodeChunk` rows with file path, realpath, language, content hash, path class, line range, and embedding (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py:8-21`), and the indexer mounts those fields into the `code_chunks_vec` vec0 table with auxiliary columns (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:308-326`).
- Re-read the current feedback hook. CocoIndex docs expose `ccc_feedback` as a quality feedback loop that records `query`, `rating`, optional `resultFile`, and optional `comment`, storing JSONL under the skill feedback directory (`.opencode/skills/mcp-coco-index/references/search_patterns.md:344-352`). Iteration 003 already found this stream is write-only today and insufficient for precise rank/line learning without extra fields.
- Skimmed the memory-side feedback precedent. `feedback-ledger.ts` records typed local feedback events into SQLite, has a feature flag, stores confidence tiers, indexes type/memory/query/confidence/timestamp/session, and offers query APIs (`.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:1-12`, `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:115-137`, `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:231-276`).
- Re-read continuity from iterations 001-003. RQ-A1 placed expansion before query embedding and stressed bounded fanout; RQ-A2 kept HLD rerank as a feature-flagged, fail-closed sidecar; RQ-A3 separated raw JSONL feedback from query-time rerank tables. A4 should preserve that separation by surfacing examples, not by changing result scores.

## Findings

### F-iter004-001 - XCE supports the retrieval-augmentation analogy, not direct few-shot implementation transfer

Verdict: ADAPT. LOC estimate: ~0 for XCE-specific logic; design guidance only. Dependencies: none.

Evidence: XCE publicly claims a context surface that combines architecture context, semantic search, traceability, and impact analysis (`external/README.md:22-27`), and asks agents to call XCE before direct file reading because it combines search, architecture context, and tracing (`external/README.md:111-119`). Its public "How It Works" flow is index/connect/query/context over a graph store (`external/README.md:240-245`). It does not expose a public example-bank table, few-shot prompt builder, or prior-query retrieval mechanism.

Implication: do not say CocoIndex can copy XCE exemplification internals. The transfer is a local UX pattern: give the agent prior validated context when a similar query appears. Implementation must be first-principles and local, using existing embeddings and feedback signals.

### F-iter004-002 - Prior positive hits can surface as exemplars, but they should be a separate result group

Verdict: ADAPT-with-feature-flag. LOC estimate: ~90-140 query/output integration LOC plus ~40-70 tests. Dependencies: RQ-A3 for high-quality positive signals; RQ-A1 optional for intent tags.

Evidence: The current query path produces one embedding from the current query (`query.py:293-295`), then runs the normal code chunk retrieval path and returns `_dedup_and_rank_rows()` (`query.py:300-323`). The existing ranking path already has transparent `rankingSignals` for score changes (`query.py:177-223`), but A4's requested mechanism is not a score change. Iteration 003's active feedback design changes weights via aggregate deltas; A4 should instead show concrete prior helpful hits.

Implication: add a disabled-by-default mode such as `SPECKIT_COCOINDEX_EXEMPLARS=1`. At query time, reuse the current query embedding to KNN-search a local example bank. If a similar prior validated query exists, return up to 3 exemplar records in a new response-level group, for example `exemplars: [{queryHash, resultFile, startLine, endLine, pathClass, similarity, validationSource}]`. Do not mix exemplar rows into the normal `QueryResult` ranking and do not alter `score`.

### F-iter004-003 - The example bank should be new local SQLite state, not an overload of `code_chunks_vec`

Verdict: ADAPT. LOC estimate: ~100-160 for schema, migrations, vec0 helper, and cached loader. Dependencies: none for storage; RQ-A3 for ingestion source.

Evidence: `code_chunks_vec` is the indexed-code table mounted by the indexer from `CodeChunk` (`indexer.py:308-326`), and its schema is tied to code chunk content and code chunk embeddings (`schema.py:8-21`). Query helpers assume rows have code chunk columns and a `distance` value in a fixed tuple shape (`query.py:92-116`, `query.py:177-193`). `ccc_feedback` currently stores raw JSONL for analysis, not a queryable vector table (`search_patterns.md:344-352`).

Implication: create a separate local SQLite/vec0 table, preferably outside the generated code chunk table lifecycle. A workable schema is:

```sql
CREATE VIRTUAL TABLE IF NOT EXISTS coco_query_examples_vec USING vec0(
  query_embedding float[<embedding_dim>],
  query_hash TEXT,
  result_file TEXT,
  source_realpath TEXT,
  content_hash TEXT,
  path_class TEXT,
  start_line INTEGER,
  end_line INTEGER,
  validation_source TEXT,
  validated_at_ms INTEGER,
  expires_at_ms INTEGER
);
```

If sqlite-vec virtual tables make mixed metadata awkward, split metadata into `coco_query_examples` keyed by `id` and keep only `id + query_embedding` in the vec table. Either way, keep it separate from `code_chunks_vec` so reindexing code chunks cannot silently erase or corrupt example history.

### F-iter004-004 - Existing `ccc_feedback` is a seed, but precise exemplars need richer captured result identity

Verdict: ADAPT. LOC estimate: ~60-100 to extend feedback capture or add a dedicated positive-example writer. Dependencies: RQ-A3 if sharing reducer/audit input.

Evidence: Public feedback examples capture `query`, `rating`, and `resultFile`, with optional comment (`search_patterns.md:344-352`). That is enough to know that a file was helpful for a query, but not enough to identify the exact chunk, line range, raw score, result rank, or content hash. Current `QueryResult` already has the missing result identity fields: `start_line`, `end_line`, `raw_score`, `path_class`, and `rankingSignals` (`schema.py:24-36`).

Implication: v1 should either extend `ccc_feedback` with optional `resultRange`, `pathClass`, `contentHash`, `rawScore`, `rank`, and `queryHash`, or add a narrower `ccc_example_positive` maintenance call that is only emitted when a user validates a shown result. Do not store free-form comments in the example bank. Comments can remain in the local audit JSONL; exemplar retrieval only needs query embedding/hash, result identity, validation metadata, and expiry.

### F-iter004-005 - Privacy, bounded growth, and stale-hit reconciliation are mandatory for default safety

Verdict: ADAPT. LOC estimate: ~90-140 for opt-out/clear-history/TTL/reconciliation plus ~60-100 tests. Dependencies: Phase-005 for default-on evaluation.

Evidence: The memory feedback ledger already has a feature flag and local SQLite indexes for bounded querying (`feedback-ledger.ts:102-108`, `feedback-ledger.ts:130-137`). It also treats feedback as local, shadow infrastructure with no ranking side effects (`feedback-ledger.ts:4-8`). CocoIndex code chunks already carry `source_realpath`, `content_hash`, and line ranges (`schema.py:12-21`), which are the right fields to detect stale exemplars after file moves or content changes.

Implication: the example bank needs:

- opt-out: `SPECKIT_COCOINDEX_EXEMPLARS=0` by default and a documented setting to disable recording;
- clear history: a CLI/MCP maintenance operation such as `ccc_examples_clear`;
- bounded growth: cap stored positives, e.g. 1000-2000 rows per project, and TTL records after ~90 days unless revalidated;
- bounded retrieval: return at most 3 exemplars above a similarity threshold, e.g. >=0.80, with no result if below threshold;
- stale reconciliation: suppress or purge exemplars when `result_file` is missing, line range no longer exists, or `content_hash` no longer matches the current chunk/index row.

### F-iter004-006 - This does not duplicate code-graph, but it should defer default-on behavior

Verdict: ADAPT design; DEFER default-on. LOC estimate: ~320-500 production LOC plus ~120-180 tests. Dependencies: RQ-A3 for signal quality, Phase-005 for evaluation, optional RQ-A1 for intent tags.

Evidence: Code graph answers structural questions over symbols, files, and relationships; XCE's public surface similarly distinguishes architecture context, traceability, and impact analysis from semantic search (`external/README.md:24-27`). An example bank answers a different question: "what previously helped for a similar semantic query?" Current CocoIndex has no history-aware retrieval surface, and the query path is still single-shot (`query.py:267-323`).

Implication: this is complementary to code graph, not a replacement. It is valuable for repeated local workflows such as "retry logic", "auth flow", or "agent dispatch tests", where prior helpful files are strong hints. It is weaker for one-off exploration and can become stale, so default-on should wait for Phase-005 precision/utility evaluation. The immediate packet decision should be: ADAPT the design behind a feature flag; DEFER default-on and any ranking influence.

## Questions Answered

- Can prior validated hits surface as positive exemplars in the next query? Yes, ADAPT. Use local KNN over prior positive query embeddings and surface matches as a separate exemplar group.
- Should exemplars change ranking? No. A3 changes weights; A4 surfaces examples. Mixing exemplars into `QueryResult` order would blur the mechanisms and make failures harder to debug.
- Does current CocoIndex have prior-query awareness? No production surface found. It has semantic search triggers, a single-shot query path, ranking telemetry, and manual `ccc_feedback` JSONL for analysis.
- Can the current schema host this? Not inside `code_chunks_vec` cleanly. Use a separate local SQLite/vec0 example table keyed by query embedding and result identity; optionally keep metadata in a normal table and embeddings in a vec table.
- Is `ccc_feedback` enough? It is enough as an audit seed for file-level positives, but not enough for precise line/chunk exemplars. Add optional rank/range/hash/path-class fields or a dedicated positive-example writer.
- Privacy requirements? Keep everything local, default disabled or recording-disabled until evaluated, provide clear-history, avoid comment text in exemplar rows, and document opt-out.
- Bounded growth? Cap storage around 1000-2000 rows per project, TTL around 90 days, top-k exemplar output at 3, and require a similarity threshold.
- Cold start behavior? Missing/empty table is no-op and returns today's normal search results only.
- Stale exemplar risk? High enough to require reconciliation. Suppress or purge records when file, line range, source realpath, or content hash no longer matches current index state.
- LOC estimate? Roughly ~320-500 production LOC plus ~120-180 tests: schema/migration/vector helper (~100-160), positive capture (~60-100), query/output integration (~90-140), clear/TTL/reconciliation controls (~90-140). A file-level-only MVP could be lower, but precise exemplars need result identity fields.
- ADAPT vs DEFER? ADAPT the feature-flagged local design. DEFER default-on behavior and any score/ranking influence until RQ-A3 signal quality and Phase-005 evaluation exist.

## Questions Remaining

- Should the example bank live in the main CocoIndex project DB, a sidecar DB under `.cocoindex_code/`, or the existing feedback directory?
- Should positive examples be captured only from explicit `ccc_feedback`, or can strong implicit events such as "opened result file after search" seed the bank later?
- What exact similarity threshold should Phase-005 evaluate: 0.80, 0.85, or model-dependent percentile gating?
- Should a later UI/API expose exemplars before normal results, after normal results, or only in verbose/diagnostic mode?

## Next Focus

RQ-A5 - Cross-cutting coco+graph fused rerank stage. Investigate whether CocoIndex and code graph should share one fused rerank stage, or whether separate semantic retrieval, exemplar surfacing, graph seeding, and graph rerank remain easier to reason about.
