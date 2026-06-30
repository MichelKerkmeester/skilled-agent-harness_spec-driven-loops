Deep-research iter 10/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Iter 1-9 covered RQ-A1..A5 + RQ-B1..B4. This iter covers RQ-B5 — the cross-cut between memory backend and coco-index. FINAL iter; produce synthesis-ready output.

ITER 10 FOCUS: RQ-B5 — Cross-cutting: shared embedding cache + rerank infra (coco-index + memory backend).

READ FIRST:
- .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts (current memory-side embedding cache — schema, hit-rate behavior)
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py (coco-side embedding usage — separate cache?)
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py + settings.py (coco's embedding-model config)
- .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/ (rerank stage — search for cross-encoder / Voyage Rerank usage)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-001.md..iteration-009.md (full continuity — synthesize patterns)

QUESTION: Should coco-index and memory backend share embedding cache + rerank stage given both currently use Voyage?
- Today: coco-index has its own SQLite vec0 store + Voyage Code 3 (1024-dim); memory backend has its own SQLite vec0 store + Voyage 4 (1024-dim). Different model variants, different indices, separate caches.
- Proposed shared infra:
  (a) Shared embedding-cache.ts that serves both coco and memory (key by (model_id, content_hash)) — cross-cuts cache hit rate.
  (b) Shared rerank stage (Voyage Rerank) instead of separate per-system rerank.
- Where shared infra leaks abstractions: coco indexes code chunks (lang-aware chunking, AST), memory indexes spec-doc records (frontmatter-aware, intent-tagged). Indexing pipelines are NOT shareable; only cache + rerank stages are.
- Risk: tight coupling reduces option to replace one without the other. Mitigation: clear interface boundary; both consume a shared `EmbeddingCacheClient` and `RerankClient` but own their indexers.
- LOC estimate: shared client extraction + per-system adapter (~200-400?).
- Cost saving: cache hit rate likely improves marginally (queries differ); rerank API call reuse is the bigger win.
- Verdict: ADAPT (extract shared clients, default-off), DEFER (YAGNI until separate caches measurably leak), SKIP (separation is correct)?

ADDITIONAL ITER 10 RESPONSIBILITY (synthesis prep):
- In iteration-010.md, append a "Synthesis Notes" section with:
  - Verdict matrix recap (RQ × ADOPT/ADAPT/DEFER/SKIP × LOC × dependencies on existing 027 phases).
  - Suggested phase 006+ scaffolds (e.g. "006-coco-intent-steering L2 ~250 LOC ADAPT (depends on RQ-A1 ADOPT)") — at most 5 candidate phases prioritized by leverage.
  - Cross-cutting recommendations (RQ-A5 coco+graph fusion + RQ-B5 coco+memory shared infra: defer or ADAPT in unified packet?).
  - Known gaps / open questions for a hypothetical pt-04 if needed.

DELIVERABLES (same shapes):
1. iterations/iteration-010.md (with Synthesis Notes section)
2. state.jsonl append: `{"type":"iteration","iteration":10,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-B5"}`
3. deltas/iter-010.jsonl

CONSTRAINTS: same as iter 1.

NEXT iter focus hint: NONE — this is the terminal iteration. Workflow proceeds to synthesis phase after this iter completes.
