# Review Resource Map - gpt55r2-a-1

## Phase-5 Augmentation
- Novel logic gaps: F001 in sqlite lexical fusion and F002 in summary embedding scoped retrieval.
- Iteration source links: `iterations/iteration-001.md`.
- Empty-result case: not applicable; the lineage produced two active findings.

## Files Touched By Review Evidence
| File | Role | Finding refs |
|------|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Hybrid retrieval orchestration and lexical fusion | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | BM25 engine routing | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts` | Summary embedding retrieval | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Stage 1 candidate collection and post-filtering | F002 |
| `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts` | Supporting fusion impact reference | F001 |
