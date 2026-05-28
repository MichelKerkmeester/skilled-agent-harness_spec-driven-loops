# Resource Map — 027-XCE Pt-03

> Inventory of files examined across 10 iterations. Treat this as the EXCLUSION SET when looking for net-new files in pt-04 or follow-on work — flag only missed-from-map candidates as gaps.

**Generated:** 2026-05-09T10:11:00Z (post-synthesis)
**Packet:** `research/027-xce-research-pt-03/`
**Method:** manual aggregation from deltas + iter narrative file:line citations

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/resource-map.md.
## System-spec-kit memory backend

### Handlers
| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/handlers/memory-triggers.ts` | 6 | Trigger handler, activation, scope filtering |
| `mcp_server/handlers/memory-context.ts` | 7 | memory_context strategy + intent routing |
| `mcp_server/handlers/memory-search.ts` | 7, 8 | V2 pipeline + caching + feedback logging |
| `mcp_server/handlers/session-resume.ts` | 5 | Session resume payload, coco availability |

### Search pipeline
| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/lib/search/pipeline/README.md` | 7 | 4-stage pipeline contract |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | 7, 10 | Rerank stage + cross-encoder adapter |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | 7 | Filter/cap, ordering immutability |
| `mcp_server/lib/search/cross-encoder.ts` | 10 | Provider-generic rerank with cache + circuit breaker |
| `mcp_server/lib/search/causal-boost.ts` | 7, 8 | Intent-aware causal boost, sparse-first traversal, neighbor injection |
| `mcp_server/lib/search/llm-cache.ts` | 7 | LLM cache TTL/LRU pattern |
| `mcp_server/lib/search/llm-reformulation.ts` | 7 | LLM call + cache + fail-open precedent |
| `mcp_server/lib/search/embedding-expansion.ts` | 6 | Semantic query-expansion precedent |
| `mcp_server/lib/search/cocoindex-calibration.ts` | 5 | Overfetch + dedup + path-class-count telemetry |

### Embeddings + cache
| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/lib/cache/embedding-cache.ts` | 6, 10 | Persistent embedding cache schema |
| `mcp_server/lib/embeddings/embedding-pipeline.ts` | 6 | Save-time embedding lookup/generate/store |
| `mcp_server/lib/embeddings/factory.ts` | 6 | Provider auto-resolution (Voyage default `voyage-4`) |

### Trigger matching + parsing
| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/lib/parsing/trigger-matcher.ts` | 6 | Lexical trigger matching, candidate index |

---

## Causal graph + retention + feedback

| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/lib/storage/causal-edges.ts` | 8, 9 | Relations, NFR-R01 caps, insertEdge, batch, weight history, createSpecDocumentChain |
| `mcp_server/lib/storage/consolidation.ts` | 8, 9 | Hebbian decay cycle, stale-edge detection |
| `mcp_server/lib/storage/vector-index-schema.ts` | 8, 9 | causal_edges uniqueness, retention columns |
| `mcp_server/lib/storage/vector-index-store.ts` | 9 | Half-life decay fallback |
| `mcp_server/lib/storage/vector-index-queries.ts` | 6, 9 | Vector + decay queries |
| `mcp_server/lib/storage/memory-summaries.ts` | 6 | Local cosine helper, BLOB-to-Float32 |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | 9 | Current TTL-only retention sweep |
| `mcp_server/lib/feedback/feedback-ledger.ts` | 4, 8, 9 | Event schema, confidence hierarchy, queries |
| `mcp_server/lib/feedback/shadow-scoring.ts` | 9 | Promotion-gate weekly-cycle pattern |
| `mcp_server/lib/feedback/batch-learning.ts` | 3 | `MAX_BOOST_DELTA = 0.10` precedent |
| `mcp_server/lib/feedback/query-flow-tracker.ts` | 8 | Result-cited event logging |
| `mcp_server/lib/cognitive/tier-classifier.ts` | 9 | Null half-life for constitutional/critical |
| `mcp_server/lib/cognitive/importance-tiers.ts` | 9 | Tier `decay: false` policy |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | 9 | Infinity stability for constitutional/critical |

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/resource-map.md.
