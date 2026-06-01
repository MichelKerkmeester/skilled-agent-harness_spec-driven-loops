---
title: "BM25 FTS5 RAG Fusion Investigation"
description: "Five-iteration read-only research packet deciding whether replacing the in-memory JS BM25 lane with SQLite FTS5 degrades hybrid RAG fusion quality. Converged on Option B with guardrails: switch to FTS5 as the default BM25 rank provider, preserve TypeScript query expansion in front of FTS5. Gate the switch with golden-query parity tests."
trigger_phrases:
  - "bm25 fts5 rag fusion investigation"
  - "sqlite fts5 bm25 swap"
  - "hybrid search lexical lane research"
  - "rag fusion lexical engine decision"
  - "option b fts5 guardrails"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

A prior deep-research recommendation (deep-research-005, iteration 010, Finding 1) ranked the in-memory JS BM25 index as the top resident-memory reduction target and proposed switching to SQLite FTS5 as the default lexical engine. Before that switch could land safely, operators needed to know whether it would degrade RAG-fusion search intelligence.

A five-iteration read-only investigation answered that question. Iteration 001 inventoried JS BM25 behavior beyond raw scoring: custom tokenization, synonym expansion, lightweight stemming, stop-word filtering, underscore and hyphen preservation plus markdown normalization. Iteration 002 mapped SQLite FTS5 parity for each feature, identifying which behaviors FTS5 covers natively, which require schema or query changes. Absent behaviors were recorded for each feature. Iteration 003 produced 30 representative golden queries predicting divergence and labeling uncertain rows as `REQUIRES_LIVE_TEST`. Iteration 004 inspected test fixture coverage and identified likely breakage paths. Iteration 005 evaluated RRF rank-fusion behavior under three options: Option A keeps JS BM25, Option B switches to FTS5 as the default. Option C maintains a permanent hybrid of both engines.

The verdict was Option B with guardrails. SQLite FTS5 preserves the RAG-fusion lexical lane because `hybrid-search.ts` already collects FTS and BM25 candidates into a shared `keyword` list before final fusion. The safe path keeps TypeScript query expansion (synonyms, stems) in front of FTS5 and requires golden-query parity gates before the default switch is flipped.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| Five iteration files written (`iteration-001.md` through `iteration-005.md`) | PASS |
| `research/research.md` contains seven requested synthesis sections | PASS |
| Standard Level 3 packet docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`) | PASS |
| Metadata files exist (`description.json`, `graph-metadata.json`) | PASS |
| Source files left unchanged. `git status` shows only packet documentation and research files for this commit. | PASS |
| Strict spec validation (`validate.sh 013 --strict`) | PASS (recorded in implementation-summary.md) |

### Files Changed

| File | What changed |
|------|--------------|
| `013-bm25-fts5-rag-fusion-investigation/research/research.md` (NEW) | Final synthesis with Summary, Findings, Decision matrix, Recommendation, Negative knowledge, Open questions. Cross-references included. |
| `013-bm25-fts5-rag-fusion-investigation/research/iterations/iteration-001.md` through `iteration-005.md` (NEW) | Per-iteration pass narratives covering JS BM25 inventory, FTS5 parity map, 30 golden queries, fixture coverage analysis. RRF impact evaluation in iteration-005. |
| `013-bm25-fts5-rag-fusion-investigation/research/deep-research-state.jsonl` (NEW) | Externalized iteration state log across all five passes |
| `013-bm25-fts5-rag-fusion-investigation/research/deep-research-config.json` (NEW) | Deep research loop configuration for this packet |
| `013-bm25-fts5-rag-fusion-investigation/spec.md` (NEW) | Level 3 research specification |
| `013-bm25-fts5-rag-fusion-investigation/plan.md` (NEW) | Investigation plan and verification route |
| `013-bm25-fts5-rag-fusion-investigation/tasks.md` (NEW) | Completed research task ledger |
| `013-bm25-fts5-rag-fusion-investigation/checklist.md` (NEW) | Verification checklist |
| `013-bm25-fts5-rag-fusion-investigation/implementation-summary.md` (NEW) | Research completion summary and commit handoff paths |
| `013-bm25-fts5-rag-fusion-investigation/decision-record.md` (NEW) | ADR-001 recommending Option B with guardrails |
| `013-bm25-fts5-rag-fusion-investigation/description.json` (NEW) | Packet metadata for memory and spec discovery |
| `013-bm25-fts5-rag-fusion-investigation/graph-metadata.json` (NEW) | Packet graph metadata |

### Follow-Ups

- Add a golden-query test suite of at least 30 queries (from `iteration-003.md`) with `overlap@5 >= 0.8` assertions before flipping the default BM25 engine to FTS5.
- Preserve `normalizeLexicalQueryTokens()` behavior for FTS5 consumers. Move it out of `bm25-index.ts` if needed before removing the JS warm resident index.
- Introduce a `SPECKIT_BM25_ENGINE` flag supporting values `sqlite`, `packed-inmemory`, `legacy-inmemory`, `auto` rather than removing `bm25-index.ts` immediately.
- Measure live nDCG@5 and recall@10 for the 30 proposed golden queries once a safe non-production fixture runner exists. Predictions in iteration-003 are marked `REQUIRES_LIVE_TEST`.
- Revisit Option C (permanent hybrid) if golden-query results show synonym or identifier recall regressions after the FTS5 default switch.
