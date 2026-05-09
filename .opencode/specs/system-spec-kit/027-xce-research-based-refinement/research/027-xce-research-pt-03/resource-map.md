# Resource Map — 027-XCE Pt-03

> Inventory of files examined across 10 iterations. Treat this as the EXCLUSION SET when looking for net-new files in pt-04 or follow-on work — flag only missed-from-map candidates as gaps.

**Generated:** 2026-05-09T10:11:00Z (post-synthesis)
**Packet:** `research/027-xce-research-pt-03/`
**Method:** manual aggregation from deltas + iter narrative file:line citations

---

## XCE source corpus (read-only `external/`)

| Path | Iterations | Purpose |
|---|---|---|
| `external/README.md` | 1, 2, 4, 6, 7 | XCE public surface, steering pattern, semantic-search claims, query/context flow |
| `external/steering/CLAUDE.md` | 1 | XCE "use first" steering example |

> Other `external/` files (kiro.md, .cursorrules, .clinerules, .windsurfrules, opencode-prompt.txt, MCP configs, PNG assets) were classified as not adding new transferable patterns beyond CLAUDE.md and README.md.

---

## mcp-coco-index skill + fork

| Path | Iterations | Purpose |
|---|---|---|
| `.opencode/skills/mcp-coco-index/SKILL.md` | 1, 4 | Activation triggers, invocation surface |
| `.opencode/skills/mcp-coco-index/references/search_patterns.md` | 1, 3, 4 | Current query advice + ccc_feedback shape |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | 1, 2, 3, 4, 5, 10 | Query path, intent detection, rerank, dedup |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | 1, 4, 10 | path_class taxonomy, vec0 indexing |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | 1 | MCP search tool surface |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | 1 | IPC SearchRequest schema |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py` | 2, 3, 4, 10 | CodeChunk + QueryResult schemas |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | 10 | Embedder configuration |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/{client,config,settings}.py` | not read | Out of pt-03 scope (config/settings change is a future packet) |

---

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

## Coco-index ↔ code-graph bridge

| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/code_graph/lib/seed-resolver.ts` | 2, 5 | Anchor resolution, telemetry preservation |
| `mcp_server/code_graph/handlers/ccc-status.ts` | 5 | Availability reporting |
| `mcp_server/code_graph/handlers/ccc-feedback.ts` | 3 | Write-only JSONL handler |
| `mcp_server/code_graph/handlers/context.ts` | 5 | code_graph_context CocoIndex seed intake |
| `mcp_server/code_graph/lib/code-graph-db.ts` | 2 | code_files + code_nodes schema (content_hash, file_mtime_ms) |
| `mcp_server/schemas/tool-input-schemas.ts` | 3 | cccFeedbackSchema |
| `mcp_server/tool-schemas.ts` | 3 | ccc_feedback tool definition + rating enum |

---

## Skill advisor + scorer

| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/skill_advisor/lib/render.ts` | 1 | Advisor brief threshold gates + final wording |
| `mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | 1 | Coco-relevant lexical hints |
| `mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | 1 | Coco explicit boosts |

---

## Search envelope + decision

| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/lib/search/search-decision-envelope.ts` | 5 | Calibration / rerank decisions / shadow deltas |
| `mcp_server/lib/search/pipeline/types.ts` | 5 | Pipeline stage types |
| `mcp_server/lib/search/search-results.ts` | 7 | Graph evidence per result |
| `mcp_server/lib/embeddings/embeddings.ts` | 6 | Provider call + timeout/circuit-breaker |
| `mcp_server/lib/search/profile-formatters.ts` | 7 | Quick/research/resume/debug deterministic profiles |
| `mcp_server/lib/search/progressive-disclosure.ts` | 7 | Rule-based summary/snippet/cursor layer |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | 7 | LLM reformulation precedent |

---

## Pt-01 + pt-02 continuity

| Path | Iterations | Purpose |
|---|---|---|
| `027/research/027-xce-research-pt-01/research.md` | 1, 5 | Pt-01 baseline, RQ9 SKIP boundary |
| `027/research/027-xce-research-pt-02/research.md` | 1 | Pt-02 cross-validation summary, pt-03 trigger |
| `027/spec.md` | 1 | Packet scope including coco scope-out |
| `027/001-code-graph-hld-lld/spec.md` | 2, 5 | Phase 001 generator schema |
| `027/001-code-graph-hld-lld/plan.md` | 2 | Phase 001 plan + classifyFileRole contract |
| `027/001-code-graph-hld-lld/implementation-summary.md` | 2 | Phase 001 not-implemented status |
| `027/002-code-graph-trace/spec.md` | 5 | Phase 002 trace + role dependency |
| `027/003-code-graph-impact-analysis/spec.md` | 5 | Phase 003 risk signals + normalizers |
| `026/.../004-cocoindex-overfetch-dedup/implementation-summary.md` | 3 | Prior coco rerank precedent + sandbox limits |

---

## Configuration / environment

| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/ENV_REFERENCE.md` | 3 | Feature flag reference (feedback logging, shadow feedback, batch learned feedback) |
| `mcp_server/code_graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md` | 3 | Feature catalog: ccc_feedback writer-only contract |

---

## Files NOT examined (intentionally — out of pt-03 scope)

- `mcp_server/code_graph/lib/structural-indexer.ts` — pt-02 territory (RQ7 TESTED_BY direction)
- `mcp_server/code_graph/lib/indexer-types.ts` — pt-02 territory
- `mcp_server/lib/storage/vector-index-store.ts` (init pipeline beyond decay fallback) — out of scope
- `001-code-graph-hld-lld/tasks.md` / `checklist.md` / `decision-record.md` — implementation work belongs to phase ship, not pt-03 research
- `004-skill-advisor-first-action-mandate/{spec,plan,tasks,checklist,implementation-summary}.md` — only render.ts:124-158 needed
- `005-code-graph-adoption-eval/*` — Phase 005 design is Pt-01 territory

---

## Coverage Summary

- **XCE corpus:** 2 files read of ~15 in `external/` (the others are IDE-specific steering variants of CLAUDE.md or MCP configs adding no new pattern).
- **mcp-coco-index:** 9 files examined of ~12 in `mcp_server/cocoindex_code/`.
- **memory backend handlers + search pipeline:** ~25 files — comprehensive coverage of trigger / context / search / rerank / cache / embeddings / cognitive / governance surfaces.
- **Causal graph + feedback + retention:** 12 files — comprehensive.
- **Coco↔graph bridge:** 7 files — comprehensive.
- **Skill advisor:** 3 files focused on coco-relevant scorer lanes + brief renderer.
- **Pt-01/pt-02 continuity:** 9 spec / research / plan files.

**Total inventory:** ~67 files cited across 56 findings. No identified gaps in current pt-03 scope; pt-04 scope (if any) should re-examine the "Files NOT examined" list when relevant.
