# Stage 0 External-Findings Brief: Spec-Kit Data Quality by Default

A fresh-Opus online sweep of about thirty cited sources, all read-only. The sweep answers one question: how can spec-kit raise data quality by default so every packet retrieves better, steers AI better and reads as logic better. The findings are sorted into seven angles, then distilled into ten ranked candidates. Every cited source URL is preserved.

---

## Angle 1: Retrieval

Embedding chunks together with header path, context and global identifiers is the highest-ROI win. It is externally validated three ways.

- **Anthropic Contextual Retrieval**: prepend a 50 to 100 token LLM context blurb per chunk plus contextual BM25. This cut top-20 failure from 35 to 49 percent and reached 67 percent with a reranker. https://www.anthropic.com/news/contextual-retrieval
- **LLM-metadata-fusion** (arXiv 2512.05411): recursive plus TF-IDF-weighted 70/30 content-to-metadata fusion reached 82.5 percent precision against a 73.3 baseline, with HitRate@10 of 0.925. https://arxiv.org/html/2512.05411v1
- **Metadata-in-embedding-space** (arXiv 2601.11863): the fused vector is alpha times text plus one minus alpha times metadata, computed once per field with no re-embed. On SEC 10-K it lifted Context@5 by 30 percentage points and global identifiers carried most of the signal. https://arxiv.org/html/2601.11863v1
- **RAPTOR**: a recursive cluster-summarize tree (arXiv 2401.18059). https://arxiv.org/abs/2401.18059

---

## Angle 2: Adherence

- **EARS**: five sentence patterns. Ubiquitous, State-driven While, Event When, Optional Where and Unwanted If-then. https://alistairmavin.com/ears/ . Spec-kit issue 1356 proposes adopting EARS. https://github.com/github/spec-kit/issues/1356
- **GitHub spec-kit**: a constitution, spec, clarify, plan, analyze, tasks and implement flow with checklist gates, a contracts json and an analyze cross-artifact consistency gate. https://github.com/github/spec-kit
- **Kiro and Tessl**: Kiro uses GIVEN/WHEN/THEN with a steering memory bank. Tessl uses annotation tags and generated-from markers. https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
- **Addy Osmani**: six mandatory sections plus a three-tier always, ask-first, never constraint system plus embedded self-verification. https://addyosmani.com/blog/good-spec/

**Honest ceiling (Fowler and Bockeler)**: no spec format fully guarantees agent adherence. Pair structure with self-verification gates.

---

## Angle 3: Logic

- **Microsoft GraphRAG**: a community hierarchy plus community summaries. https://github.com/microsoft/graphrag
- **LightRAG**: dual-level retrieval with Local, Global and Mix modes plus incremental set-merge graph updates that avoid a full re-index. EMNLP 2025. https://github.com/hkuds/lightrag
- **Multi-layer heterogeneous typed-node graph**. https://neo4j.com/labs/agent-memory/tutorials/knowledge-graph-typescript/
- **Typed edges**: SUPERSEDES, DEPENDS_ON, COVERED_BY, REFUTES, IMPLEMENTS.

---

## Angle 4: Metadata Artifacts

- **Embedding-metadata block**: model id, dimension, chunk-strategy version, fingerprint and timestamp for drift detection.
- **Quality and confidence score per doc**: LLM-as-judge on a 1 to 5 Likert scale.
- **Semantic-intent plus content-type tags plus answerable-questions**.
- **Provenance**: generating-model, source-commit and supersedes-pointer.
- **Temporal block**: created, last_verified, shelf_life_class and stale_after.

Sources: https://www.digitaldividedata.com/blog/rag-detailed-guide-data-quality-evaluation-and-governance and https://tianpan.co/blog/2026-04-10-rag-freshness-problem-stale-embeddings-silent-failure

---

## Angle 5: Turso and libSQL

- **Native vector search with no extension**: F32_BLOB default down to F8 and F1BIT, DiskANN through libsql_vector_idx, vector_top_k, vector_distance_cos, a max of 65536 dims and compress_neighbors set to float8.
- **Embedded replicas**: offline sync with read-your-writes.

Sources: https://docs.turso.tech/features/ai-and-embeddings and https://docs.turso.tech/features/embedded-replicas/introduction

This angle is vendor-validated and not independently benchmarked.

---

## Angle 6: Automation

- **markdownlint and Vale**: markdown and prose linters. https://github.com/davidanson/markdownlint
- **remark-lint-frontmatter-schema**: JSON-Schema frontmatter validation. https://github.com/JulianCataldo/remark-lint-frontmatter-schema
- **Langfuse**: LLM-as-judge with score backfill. https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge
- **CDC drift-triggered re-embed**: re-embed when cosine drift is greater than 0.05. https://tianpan.co/blog/2026-04-10-rag-freshness-problem-stale-embeddings-silent-failure
- **Databricks enrichment pipeline plus RAGAS**. https://docs.databricks.com/aws/en/generative-ai/tutorials/ai-cookbook/quality-data-pipeline-rag

---

## Angle 7: Reference Repos

- github/spec-kit
- microsoft/graphrag
- HKUDS/LightRAG
- **bozbuilds/AIngram**: the closest twin. One SQLite file with sqlite-vec two-pass plus FTS5 plus a knowledge graph plus Ed25519-signed entries plus MCP. https://github.com/bozbuilds/AIngram
- devwhodevs/engraph
- sqliteai/sqlite-rag
- tursodatabase/turso
- DEEP-PolyU/Awesome-GraphRAG
- agents-txt/agents-txt
- **alexgarcia.xyz sqlite-vec hybrid**: FTS5 plus vector plus RRF. https://alexgarcia.xyz/blog/2024/sqlite-vec-hybrid-search/index.html

---

## Ranked Candidates

Each candidate is tagged by the job it serves: [R] retrieval, [A] adherence, [L] logic. The list carries into the loop.

1. Header-path plus global-id prefixing plus contextual blurb on every embedded chunk [R]
2. Metadata fusion, alpha times text plus one minus alpha times metadata, computed once per field [R]
3. EARS requirements plus a three-tier constraint block [A][L]
4. JSON-Schema validation of the two JSONs plus frontmatter wired to validate.sh [A][L]
5. LLM-as-judge quality score 1 to 5 with backfill [R][A][L]
6. GraphRAG community-summary rollup nodes plus typed semantic edges [L][R]
7. LightRAG incremental set-merge graph updates [L]
8. Embedding-metadata block plus drift-triggered re-embed [R]
9. RRF hybrid plus sqlite-vec and libSQL native vector plus DiskANN [R]
10. Temporal and freshness fields plus a shelf-life class [R][L]

---

## Caveats

- The adherence ceiling is real. No format fully guarantees agent adherence.
- The Turso sync claims are vendor-only.
- The chunking choice is corpus-dependent, so the metadata-fusion effect is the robust signal rather than a specific chunker.
