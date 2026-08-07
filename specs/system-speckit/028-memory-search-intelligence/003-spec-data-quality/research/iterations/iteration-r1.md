# Iteration R1 - Retrieval Prefix plus Fusion (gpt-5.5, prod-path feasibility)

## TITLE

Cohort R1 retrieval angle. Model gpt-5.5. Angle traces the live chunk and embed path to test whether header-path and global-id prefixing plus metadata fusion are feasible on the production vector path, not just in eval mode.

## FINDINGS

The corpus does not embed header-path, packet-id, or status into every content chunk today. `chunking-orchestrator.ts:297` embeds only `normalizeContentForEmbedding(chunk.content)` and `content-normalizer.ts:216-229` strips YAML frontmatter and anchor comments before embedding. Packet pointers and status continuity frontmatter are not vector input. Chunk labels are stored separately as `anchor_id` and `chunk_label` at `chunking-orchestrator.ts:315,347` not prepended to embedded text. Reader served retrieval. BM25 already includes `file_path` via `bm25-index.ts:413-444` so any gain must be measured on vector and hybrid production ranking not assumed from exact lexical path queries.

Packet and status metadata is embedded only as separate metadata documents not fused into each spec-doc chunk. `memory-parser.ts:287-313` converts description.json into indexable text (Spec folder, Spec id, Folder slug, Parent chain, keywords at `:595-606`). `graph-metadata-parser.ts:1311-1352` embeds Packet, Spec Folder, Status, Importance Tier, key files and source docs. Separate metadata hits can win retrieval themselves but they do not make the relevant spec.md or plan.md chunk rank higher unless fusion or prefixing changes the production vector.

Prefixing plus metadata fusion is externally validated but the spec-kit improvement is still a hypothesis until measured on the production retrieval path. The brief reports Anthropic contextual retrieval cut top-20 failure by 35 to 49 percent and 67 percent with reranker (`stage-0-external-findings.md:11`), metadata fusion at 82.5 percent precision vs 73.3 baseline with HitRate@10 0.925 (`:12`), and fused metadata vectors lifting Context@5 by 30 percentage points with global identifiers carrying most signal (`:13`). The 028 lesson applies. Production runs confidence truncation after ranking at `hybrid-search.ts:2046-2067` and token-budget floors at `:2900-2904,2985-2994` while evaluation mode skips these paths at `:2049,2122-2124`.

## CONCRETE CHANGE

Implement a deterministic embedding-context layer in the MCP indexing path not just in generate-context.js. Prefix shape:

`Packet: system-speckit/028-memory-search-intelligence/002-spec-data-quality | Doc: spec.md | Status: in_progress | Tier: important | Header path: spec.md > 4. REQUIREMENTS | Anchor: requirements`

Apply it before `generateDocumentEmbedding()` for non-chunked docs at `embedding-pipeline.ts:106-118,168-171` and chunked child docs at `chunking-orchestrator.ts:274-323`. Then add metadata fusion: build metadata text from description.json, graph-metadata.json, parsed doc type, file path, anchor and header path, compute metadata embeddings once per joined metadata block, store `fused = normalize(alpha * text_emb + (1 - alpha) * metadata_emb)`. Version the input with `embedding_context_version` and `metadata_fusion_version` and update cache keys, since current cache keys use normalized content only at `embedding-pipeline.ts:121-123,138` and chunk content only at `chunking-orchestrator.ts:288-301` so unchanged keys would incorrectly reuse pre-prefix vectors.

## EVIDENCE

- Embed strips structure: `chunking-orchestrator.ts:297`, `content-normalizer.ts:216-229`. Chunk labels separate at `chunking-orchestrator.ts:315,347`. BM25 has file_path at `bm25-index.ts:413-444`.
- Metadata indexed separately: `memory-parser.ts:287-313,595-606`, `graph-metadata-parser.ts:1311-1352`. Packet fields at `031.../description.json:3-19` and `031.../graph-metadata.json:3-37`.
- External numbers: `stage-0-external-findings.md:11,12,13`.
- Prod truncation vs eval skip: `hybrid-search.ts:2046-2067,2900-2904,2985-2994` vs `:2049,2122-2124`.
- Save path refreshes metadata then reindexes at `workflow.ts:1663-1720,1755-1780,1823-1844`.

## READER

Retrieval primary. The deterministic prefix targets vector and hybrid production ranking. Logic benefits secondarily from the fused metadata block but the angle is scoped to retrieval.

## ON-WRITE OR RETROACTIVE

Both feasible on-write since generate-context.js already refreshes the JSONs and triggers reindex. The embedding change should live in the MCP parser and embedding path so memory_save and memory_index_scan both get it. Retroactive fusion is feasible without a full content re-embed if existing successful vectors are treated as text_emb and only metadata vectors are newly computed, but true text prefixing of existing records requires full re-embedding unless fusion is accepted as the retroactive substitute.

## RISK

The prod win is a hypothesis until measured on the production retrieval path, not the eval path the external benchmarks use. BM25 already carrying file_path means lexical path-query gains will overstate the real vector improvement. Unchanged cache keys silently reusing pre-prefix vectors is a correctness hazard that the version bump must close.
