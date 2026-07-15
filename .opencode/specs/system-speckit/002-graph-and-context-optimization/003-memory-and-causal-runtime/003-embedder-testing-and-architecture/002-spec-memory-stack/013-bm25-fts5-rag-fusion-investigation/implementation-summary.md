---
title: "Implementation Summary: BM25 FTS5 RAG Fusion Investigation"
description: "Five-iteration research packet completed for the BM25-to-FTS5 RAG-fusion decision."
trigger_phrases:
  - "bm25 fts5 implementation summary"
  - "deep research 013 summary"
  - "bm25 fts5 commit handoff"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed read-only five-iteration BM25-to-FTS5 RAG-fusion investigation"
    next_safe_action: "If implementing, add golden-query parity tests before switching default BM25 engine"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/iterations/iteration-001.md"
      - "research/iterations/iteration-002.md"
      - "research/iterations/iteration-003.md"
      - "research/iterations/iteration-004.md"
      - "research/iterations/iteration-005.md"
    session_dedup:
      fingerprint: "sha256:0130130130130130130130130130130130130130130130130130130130130131"
      session_id: "res-013-20260519-000000"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Measured golden-query nDCG and recall remain future work."
    answered_questions:
      - "Recommended Option B, FTS5-only lexical engine with guardrails and parity tests."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation` |
| **Completed** | 2026-05-19 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:what-built -->
## What Was Built

This packet turns the BM25-to-FTS5 memory-saving idea into a concrete retrieval-quality decision. The main outcome is not "FTS5 is identical"; it is narrower and more useful: FTS5 preserves the RAG-fusion lexical lane, but the implementation needs golden-query guardrails because JS BM25 currently contributes query expansion, custom stemming, and identifier-friendly tokenization that the production FTS schema only partially matches.

### Five Iterations

The research loop produced five independent iteration files. Iteration 001 inventories JS BM25 features. Iteration 002 maps FTS5 parity and implementation cost. Iteration 003 defines 30 representative query predictions. Iteration 004 inspects tests and likely breakage. Iteration 005 evaluates RRF behavior under keep, switch, and hybrid options.

### Final Synthesis

`research/research.md` consolidates the evidence into a ranked finding list, decision matrix, recommendation, negative knowledge, open questions, and cross-references. The recommendation is Option B: switch the default lexical BM25 engine to SQLite FTS5, keep TypeScript query expansion in front of FTS5, and require golden-query parity gates before removal of the JS warm resident index.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Level 3 specification |
| `plan.md` | Created | Research plan |
| `tasks.md` | Created | Task ledger |
| `checklist.md` | Created | Verification checklist |
| `implementation-summary.md` | Created | Completion summary |
| `decision-record.md` | Created | ADR-001 |
| `description.json` | Created | Discovery metadata |
| `graph-metadata.json` | Created | Graph metadata |
| `research/iterations/iteration-001.md` through `iteration-005.md` | Created | Iteration findings |
| `research/research.md` | Created | Final synthesis |
| `research/deep-research-state.jsonl` | Created/Appended | Iteration state log |
<!-- /ANCHOR:what-built -->

---
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The investigation stayed on `main`, used direct source and test reads, cited file-line evidence, and avoided source mutation. No production daemon query was run; query-level behavior in iteration 003 is explicitly predicted from code and marked `REQUIRES_LIVE_TEST` where live ranking is needed.
<!-- /ANCHOR:how-delivered -->

---
<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recommend Option B with guardrails | FTS5 already supplies weighted BM25 ranks and the RRF combiner groups lexical evidence under `keyword`; keeping JS BM25 resident mainly buys recall quirks at a meaningful memory cost. |
| Do not recommend a permanent hybrid Option C now | The current JS-only features are small enough to port or preserve via query expansion and tests; keeping two lexical engines doubles complexity. |
| Require golden-query parity before implementation | Existing tests assert some JS behavior but do not measure production retrieval quality, so the default switch needs behavioral gates. |
<!-- /ANCHOR:decisions -->

---
<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All five iteration files written | PASS |
| `research/research.md` has seven requested sections | PASS |
| Standard packet docs exist | PASS |
| Source files left unchanged | PASS, source edits were not made in this packet |
| Strict spec validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation --strict` |
<!-- /ANCHOR:verification -->

---
<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live rank metrics.** nDCG@5, recall@10, and rank correlation are qualitative predictions because production daemon queries were explicitly prohibited.
2. **No implementation shipped.** This packet does not change BM25, FTS5, RRF, schema, or tests.
3. **FTS5 docs are capability evidence, not production behavior.** The production schema currently uses default tokenizer settings unless changed in a future implementation.

## Commit Handoff

Exact paths to stage if committing this research packet:

```bash
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/spec.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/plan.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/tasks.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/checklist.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/implementation-summary.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/decision-record.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/description.json
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/graph-metadata.json
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/research/deep-research-config.json
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/research/deep-research-state.jsonl
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/research/research.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/research/iterations/iteration-001.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/research/iterations/iteration-002.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/research/iterations/iteration-003.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/research/iterations/iteration-004.md
git add .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation/research/iterations/iteration-005.md
```
<!-- /ANCHOR:limitations -->
