---
title: "Spec: 016/013/004 Spec Memory Text Embedder Benchmark (jina-code vs bge-m3)"
description: "Build a text-side retrieval fixture for mk-spec-memory (~15-20 query→spec-doc-path pairs) and bench 4 candidates: jina-code (current default, code-tuned mismatch), bge-base-en-v1.5 (drop-in 768d), bge-large-en-v1.5 (1024d migration), bge-m3 (1024d migration, 8192 ctx, multilingual). If a winner emerges with >3-pair lead, swap mk-spec-memory default."
trigger_phrases:
  - "016/013/004 spec memory bench"
  - "bge-m3 jina-code comparison"
  - "spec memory text fixture"
  - "mk-spec-memory embedder swap"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/013/004 mk-spec-memory Text Embedder Benchmark

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (2026-05-18) |
| Type | Fixture authoring + multi-candidate bench + potential default swap |
| Owner | Main agent |
| Parent | `../spec.md` (013-ollama-and-bge-promotion-arc) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

mk-spec-memory currently defaults to `sbert/jinaai/jina-embeddings-v2-base-code` — a code-tuned model used for **text content** (spec.md, plan.md, tasks.md, descriptions, decision records). This is a content/tier mismatch:

- Spec docs are paraphrase-heavy English markdown, not source code.
- Code-tuned embedders are trained on code-NL pairs; their representations of pure prose may be suboptimal.
- BGE-family has dedicated text embedders (bge-base-en-v1.5, bge-large-en-v1.5, bge-m3) that should outperform jina-code on text retrieval.

But: **we have no measurement.** The code-side 18-pair fixture (`004-extended-bake-off/002-baseline-fixture/`) doesn't apply — it indexes code files, not specs. We need a text-side fixture for mk-spec-memory's actual corpus.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Author a text retrieval fixture (`evidence/spec-memory-fixture.json`) with ~15-20 pairs:
  - `query`: paraphrased intent referencing a spec doc concept ("scope-locked refactor of memory routing", "ADR for chunking parameter increase")
  - `expected_source_path`: actual spec doc path
  - `difficulty`: easy / medium / hard
- Bench candidates (4):
  - `sbert/jinaai/jina-embeddings-v2-base-code` — current default (code-tuned mismatch)
  - `sbert/BAAI/bge-base-en-v1.5` — drop-in 768d, lightweight (110M)
  - `sbert/BAAI/bge-large-en-v1.5` — 1024d migration, classic (335M)
  - `sbert/BAAI/bge-m3` — 1024d migration, 8192 ctx, multilingual (568M)
- Bench harness: adapt `004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh` to point at mk-spec-memory's index + text fixture. mk-spec-memory uses TS-side embedder registry, so the harness shape will differ from CocoIndex's. Approach: dispatch mk-spec-memory's `memory_search` MCP tool per query.
- Capture results: CSV (1 row per candidate), JSONL (per-probe), runlog.
- Decision rule: if any BGE text candidate beats jina-code by ≥3 pairs (≥17pp) AND the win is not the universal-floor-only set → **PROMOTE** that candidate.
- If PROMOTE → update mk-spec-memory's `lib/embedders/registry.ts` default + run mk-spec-memory's reindex.

Out of scope:
- Reranker swap on mk-spec-memory side (separate concern).
- Adding new embedders beyond the 4 listed.
- CocoIndex changes (handled by 003).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Text fixture with 15-20 query / expected_source_path / difficulty rows committed to `evidence/spec-memory-fixture.json`. |
| R2 | Bench harness adapted to mk-spec-memory's search path (likely via `memory_search` MCP tool or direct DB query). |
| R3 | 4-candidate bench run, CSV + JSONL + runlog committed to `evidence/`. |
| R4 | Decision documented: PROMOTE <candidate> or HOLD at jina-code. |
| R5 | If PROMOTE: registry change + reindex evidence + smoke search committed. |
| R6 | Strict-validate PASSED. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:risks -->
## 5. RISKS

- **Fixture authoring is the slow part.** Hand-curating 15-20 paraphrased queries against the spec-doc corpus takes 1-2 hours. Time-box and accept "good enough" coverage rather than perfect coverage.
- **Schema migration cost.** bge-large-en-v1.5 and bge-m3 are 1024d vs current 768d. Migration = one-time reindex of the memory DB (~minutes for current corpus, but disruptive if other ongoing sessions need memory access).
- **mk-spec-memory dispatch shape differs from CocoIndex.** The bench may need to call `memory_search()` MCP tool directly rather than shelling out — requires a small Python or Node harness.
- **Cross-encoder reranker:** mk-spec-memory's pipeline includes its own reranker (BGE-based). Run with rerank on (matches production use) — don't disable for the bench.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- Text fixture + 4-candidate bench results published.
- A clear PROMOTE or HOLD decision with hit-rate evidence and rationale.
- mk-spec-memory's embedder default is either swapped (with reindex evidence) or explicitly kept on jina-code with documented reasoning ("BGE candidates didn't beat jina-code by margin X").
<!-- /ANCHOR:success-criteria -->
