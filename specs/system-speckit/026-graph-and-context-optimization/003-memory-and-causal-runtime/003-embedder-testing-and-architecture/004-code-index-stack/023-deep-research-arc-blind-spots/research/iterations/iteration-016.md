# Iteration 016 - Comparative architecture deltas [PASS-2]

## Pass 1 claim under attack
- NEW blind spot - orthogonal to Pass 1: compare peer systems for dimension-flex schema, prompt policy, license disclosure, and multi-project/index contention.

## Hypotheses going in
- H1: Peer systems will show that fixed vector dimensions are normal, but metadata/status UX should be stronger than the local implementation.
- H2: Peer systems will split embedding, reranking, and search roles more explicitly than this fork does.

## Evidence gathered
- LlamaIndex docs: vector-store examples pass explicit `embed_dim=1536` for MariaDB/Neo4j/Pinecone-style indexes and list many backends: `https://developers.llamaindex.ai/python/framework/community/integrations/vector_stores/`.
- LangChain docs: vector stores are initialized with an embedding model and expose a common add/delete/similarity-search interface: `https://docs.langchain.com/oss/python/integrations/vectorstores/`.
- Continue docs: model roles include `embed` for vector search and `rerank` for reranking vector-search results: `https://docs.continue.dev/setup/overview` and `https://docs.continue.dev/advanced/model-roles/embeddings`.
- Sourcegraph Cody FAQ: Sourcegraph says Cody Enterprise replaced embeddings with Sourcegraph Search for security, lower maintenance, and larger-repo/multi-repo scale: `https://sourcegraph.com/docs/cody/faq`.
- Cursor docs: Cursor indexes codebases automatically, incrementally indexes new files, exposes indexing status, and supports multi-root workspaces where all codebases are indexed automatically: `https://docs.cursor.com/chat/codebase`.
- CocoIndex docs: transformation logic should be shared between indexing and querying for embeddings: `https://cocoindex.io/docs-v0/query/`.
- Local evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:136-140` daemon status exposes version/uptime/projects/client disconnects only; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:317-348` uses one embedder for loaded projects.

## Pass-1 attack outcome
- [ORTHOGONAL]: Peer comparison does not falsify a single Pass 1 finding. It reframes the recommendations: fixed dimensions are common, but mature systems expose role separation, index status, multi-root handling, and shared embedding transforms more clearly.

## Findings (severity-tagged)
- **FINDING-016-A** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#1]:
  - **What**: Fixed vector dimensions are not the smell. The smell is not storing and surfacing which dimension/model/prompt produced the current index.
  - **Why Pass 1 / deep-review missed this**: Pass 1 treated fixed dimensions as the problem; peer docs show fixed dimensions are normal when paired with explicit index metadata.
  - **Evidence**: LlamaIndex vector-store URL above; CocoIndex data-types URL from iteration 011; local `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:136-140`.
  - **What to do**: 023A should prioritize `index_metadata` and compatibility checks before fancy multi-table routing.

- **FINDING-016-B** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#3]:
  - **What**: Continue and CocoIndex both make role/transform separation explicit; the local fork has role behavior spread across config, shared globals, indexer, and query code.
  - **Why Pass 1 / deep-review missed this**: It inspected local prompt code but did not ask how peer systems make role boundaries operator-visible.
  - **Evidence**: Continue model-role URLs above; CocoIndex query-support URL above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:35-60`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:314-329`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:710-713`.
  - **What to do**: Model roles should become explicit metadata: `embed_document`, `embed_query`, `rerank`, and `license`.

- **FINDING-016-C** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#4]:
  - **What**: Sourcegraph's embedding removal is a useful counter-design: for large enterprise contexts, lexical/code intelligence search can be more maintainable than embedding-heavy infrastructure.
  - **Why Pass 1 / deep-review missed this**: The investigation assumed "better embeddings/rerankers" were the main future path.
  - **Evidence**: Sourcegraph FAQ URL above; local fixture evidence still has stable misses at `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:104-127`.
  - **What to do**: 023B should compare embedding-only, hybrid search, and symbol/graph-assisted retrieval, not only model swaps.

- **FINDING-016-D** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#8]:
  - **What**: Cursor's user-facing indexing status and multi-root indexing make the local daemon status look thin.
  - **Why Pass 1 / deep-review missed this**: Pass 1 saw daemon status as observability, not product UX.
  - **Evidence**: Cursor docs URL above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:122-140`.
  - **What to do**: Add active model, index freshness, indexing progress, and per-project compatibility to `ccc status` / MCP status.

## Hypotheses that FAILED falsification (valuable!)
- "Dimension-flex tables are the peer-standard answer" failed. Peer systems generally require dimension-aware index creation rather than dimension-agnostic vector stores.
- "Embedding replacement is always the strategic direction" failed against Sourcegraph's enterprise search-first choice.

## Updates to research-pass-2.md
- Added comparative architecture deltas: fixed dimensions are normal; weak metadata/status is the local gap.

## NO-EARLY-STOP confirmation
- Iteration <= 20: continuing to next iter.

