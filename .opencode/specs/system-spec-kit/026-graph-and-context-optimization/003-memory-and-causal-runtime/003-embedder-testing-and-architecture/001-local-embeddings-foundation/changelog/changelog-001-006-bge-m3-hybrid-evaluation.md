---
title: "Local Embeddings Phase 006: bge-m3 Hybrid Evaluation Planning"
description: "Planning packet for the bge-m3 versus EmbeddingGemma-300m retrieval-quality evaluation. Defines eval methodology, 40-60 query set construction with a 5pp MRR@10 ship/don't-ship decision threshold. Execution gated on the 009 cocoindex IPC fix. A 1-iteration doc-quality review converged with zero P0 findings."
trigger_phrases:
  - "bge-m3 hybrid evaluation planning"
  - "MRR@10 ship decision threshold"
  - "RRF hybrid retrieval eval"
  - "EmbeddingGemma bge-m3 comparison"
  - "006 local embeddings eval packet"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-12

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/006-bge-m3-hybrid-evaluation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

No ground-truth measurement existed for retrieval quality against this codebase. EmbeddingGemma-300m was selected for cocoindex in phase 002 based on published benchmark scores, without measuring actual MRR on local code. bge-m3 offers hybrid retrieval (dense vectors, sparse lexical scores, colbert multi-vector via Reciprocal Rank Fusion) that can improve recall on lexical-heavy code queries, but the sqlite-vec schema would need a multi-column redesign to support it.

This packet authored the full evaluation plan: a 40-60 query ground-truth set, a Python harness to index and score each variant, a decision threshold of 5pp MRR@10 over baseline. A structured comparison of EmbeddingGemma-300m against bge-m3 dense plus bge-m3 hybrid was scoped. Execution is blocked on the 009 cocoindex IPC fix, which must restore valid cocoindex search results before the EmbeddingGemma baseline can be measured fairly. A 1-iteration doc-quality review confirmed zero P0 findings and one P1 dependency-accuracy note.

### Added

None.

### Changed

None.

### Fixed

None.

### Verification

| Check | Evidence |
|-------|----------|
| Doc-quality review converged | `review/deep-review-state.jsonl` event `converged` after 1 iteration, P0 0, P1 1, P2 0 |
| P1 finding noted | `review/iterations/iteration-001.md` P1-006-001: 009 must verify source-language rows before 006 unblocks |
| Execution checks | All pending. No eval files exist yet. Evidence not available until 009 ships. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `006-bge-m3-hybrid-evaluation/spec.md` | Created | Eval scope, decision threshold, dependencies, requirements |
| `006-bge-m3-hybrid-evaluation/plan.md` | Created | Task plan for T001 through T010 |
| `006-bge-m3-hybrid-evaluation/tasks.md` | Created | Task breakdown with acceptance criteria |
| `006-bge-m3-hybrid-evaluation/implementation-summary.md` | Created | Planning summary with blocker state and planned file set |
| `006-bge-m3-hybrid-evaluation/review/iterations/iteration-001.md` (NEW) | Created | 1-iteration doc-quality review artifact, P1 finding on 009 dependency scope |

### Follow-Ups

- Unblock once 009 ships and verifies that cocoindex search returns source-language rows alongside markdown rows.
- Build `scratch/eval-set.jsonl` with 40-60 hand-labeled or synthetic query and relevant-files pairs.
- Implement `scratch/run-eval.py` to index the codebase, query each variant, scoring MRR@10 plus NDCG@10.
- Run EmbeddingGemma-300m baseline, bge-m3 dense, then bge-m3 hybrid, recording results to `scratch/results-*.json`.
- Record ship or don't-ship decision in implementation-summary based on whether hybrid beats baseline by 5pp MRR@10.
- Packet may be incomplete. Verify execution results before publishing as shipped.
