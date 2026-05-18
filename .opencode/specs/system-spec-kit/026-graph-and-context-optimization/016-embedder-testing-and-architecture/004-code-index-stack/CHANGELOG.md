---
title: "Changelog: 004-code-index-stack (CocoIndex semantic-search stack)"
description: "Plain-English changelog of all code changes to the CocoIndex Python MCP (mcp-coco-index): embedder swap, registry, INSTALL_GUIDE, reranker, chunking tuning, hybrid BM25+RRF fusion, daemon resilience."
---

# Changelog: 004-code-index-stack

> **Plain-English summary of code changes** to the CocoIndex semantic-search MCP (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/`). Read this if you want to understand what shipped without diving into TypeScript or Python implementation details.

## What is the CocoIndex stack?

CocoIndex is the **semantic code-search engine** for the workspace. Type `ccc search "how does X work"` and it returns the top-K relevant code chunks via embedding-based similarity. It's wired to the `mk_code_index` MCP so AI agents can search the codebase by intent rather than exact tokens.

This stack ships 10 sub-phases that progressively upgraded CocoIndex from "general-text embedder + heuristic ranking" to "code-tuned embedder + opt-in hybrid lexical fusion + opt-in cross-encoder reranking + daemon resilience."

---

## v1.0 — Switch to code-tuned embedder (`001-cocoindex-swap`)

**Shipped:** 2026-05-17

### What changed
- Replaced the default embedder from Google's general-text `embeddinggemma-300m` to Jina's code-tuned `sbert/jinaai/jina-embeddings-v2-base-code`
- Added Apple Silicon GPU support (Metal/MPS) so reindex runs ~3-4× faster on M-series Macs
- Auto-detects the best device: `mps` on Apple Silicon → `cuda` on NVIDIA → `cpu` fallback
- Validates the `COCOINDEX_CODE_DEVICE` env override (only accepts `cuda`/`mps`/`cpu` — silently falls back if you typo it)
- Added a registry-based check: unknown `COCOINDEX_CODE_EMBEDDING_MODEL` env values log a warning and fall back to the default instead of crashing

### Why it matters
- Code-specific embedders understand programming-language semantics better than general-text models. Same query → more relevant results.
- Apple Silicon users no longer wait 60+ minutes for reindex; it's ~25 minutes.
- Typos in env vars no longer brick the daemon — they just produce a warning.

### Files affected
- `mcp_server/cocoindex_code/config.py` — added `_resolve_device()`, `COCOINDEX_CODE_DEVICE` validation, embedder-registry validation
- `mcp_server/cocoindex_code/indexer.py` — passes device to sentence-transformers
- `mcp_server/cocoindex_code/registered_embedders.py` (NEW) — declarative registry of 7 vetted embedders

---

## v1.1 — 18-pair fixture for benchmarking (`002-baseline-fixture`)

**Shipped:** 2026-05-17

### What changed
- Authored an 18-pair code-retrieval fixture (query → expected file path) at `002-baseline-fixture/evidence/code-retrieval-fixture.json`
- 18 query/expected-path pairs split across 3 difficulty buckets (easy/medium/hard)
- Hit normalization: a result counts as a hit if ANY of `.opencode/`, `.claude/`, `.codex/`, `.gemini/` mirror trees match the expected path (the repo has 4 mirrored skill trees)

### Why it matters
- Provides a stable benchmark to measure "is this embedder/config better?" instead of vibes
- Reusable across all subsequent embedder/pipeline changes — you can A/B test any change against the same 18 queries

---

## v1.2 — First competitive bake-off (`003-comparison-measure`)

**Shipped:** 2026-05-17

### What changed
- Ran the 18-pair fixture against 4 candidates: `jina-embeddings-v2-base-code` (default), `embeddinggemma-300m` (prior baseline), `nomic-ai/CodeRankEmbed`, `BAAI/bge-code-v1`
- Discovered nomic + bge daemon-crash failure during indexing — captured for later remediation
- Authored ADR-001 ratifying jina-code as the production default

### What we learned
- jina-code and gemma TIED at 7/18 hits = 38.9% post-normalization
- jina-code WON on p95 latency (590ms vs gemma's 4011ms — gemma has a slow tail)
- nomic + bge couldn't be measured — both failed mid-index

### Why it matters
- The hit rate (38.9%) is REPO-specific and stress-tested intentionally. It's the lower bound for measuring future improvements.
- Confirmed jina-code as the safe production default with measured evidence (not just intuition)

### Files affected
- `004-code-index-stack/003-comparison-measure/decision-record.md` (ADR-001)
- `004-code-index-stack/003-comparison-measure/evidence/*.csv` + `.jsonl` + runlog

---

## v1.3 — Extended bake-off with stella (`004-extended-bake-off`)

**Shipped:** 2026-05-18

### What changed
- Authored a reusable bash harness at `evidence/run-extended-bake-off.sh` (replaced 003's ad-hoc approach)
- Pre-pulls models via Python before invoking `ccc index` (works around the nomic/bge daemon-crash issue from v1.2)
- Added `stella_en_400M_v5` (Alibaba's 1024-dim text+code model) to the registry and benchmark
- Snapshot/restore safety: snapshots the index before each candidate, auto-restores jina-code baseline after

### What we learned
- Stella scored **0/18 hits** — far worse than jina-code's 38.9%
- This confirmed a key insight: **embedder swap is NOT the dominant lever** on this fixture. Structural changes (chunking, hybrid, reranker) matter much more.

### Why it matters
- Saved future operators from chasing embedder swaps. Set up the harness for future structural-change A/B tests.

### Files affected
- `mcp_server/cocoindex_code/registered_embedders.py` (added stella entry)
- `004-extended-bake-off/evidence/run-extended-bake-off.sh` (NEW harness)

---

## v1.4 — Declarative embedder registry (`005-declarative-registry`)

**Shipped:** 2026-05-17

### What changed
- Introduced `registered_embedders.py` as a single-source-of-truth for 7 vetted embedders (jina-code default + gemma baseline + nomic-CodeRankEmbed + bge-code-v1 + jina-v2-base-en + Salesforce SFR-Embedding-Code-2B_R + stella)
- Each entry carries: name, dim, RAM budget, disk size, MPS compatibility, code/text category, HuggingFace URL, operator-facing notes
- `config.py` rejects unknown `COCOINDEX_CODE_EMBEDDING_MODEL` values and falls back to default with a warning (no silent acceptance)

### Why it matters
- Operators can browse the registry to pick alternative embedders WITHOUT digging into HuggingFace model cards
- Typos in env vars produce clear warnings instead of cryptic loading errors
- New embedders go into ONE file (the registry), not scattered across multiple config sites

### Files affected
- `mcp_server/cocoindex_code/registered_embedders.py` (NEW)
- `mcp_server/cocoindex_code/config.py` (registry-aware validation)

---

## v1.5 — INSTALL_GUIDE updates (`006-install-guide-updates`)

**Shipped:** 2026-05-17

### What changed
- Added "Choosing an embedder" section to `INSTALL_GUIDE.md` listing all registered embedders with RAM/disk/category guidance
- Documented the `COCOINDEX_CODE_DEVICE` and `COCOINDEX_CODE_EMBEDDING_MODEL` env overrides
- MPS auto-detect documentation for Apple Silicon users

### Why it matters
- New users can pick + configure an embedder without reading the source

### Files affected
- `mcp-coco-index/INSTALL_GUIDE.md`
- `mcp-coco-index/README.md`

---

## v1.6 — Reranker integration (`007-reranker-integration`)

**Shipped:** 2026-05-18
**Commit:** `5b14be4da` + advisory fixes (F deep-review)

### What changed
- Added a cross-encoder reranker layer using Alibaba's `gte-multilingual-reranker-base` (Apache-2.0, 306M params, 8192 ctx)
- Sits AFTER the first-stage vector retrieval, BEFORE final result slicing
- Cross-encoder score REPLACES the RRF/vector score (the original score is preserved as `pre_rerank_score` for auditability)
- Top-K to rerank: K=20 (matches `fetch_k = unique_k * 4` overfetch)
- Lazy loads the model on first use (~0.61GB RAM fp16); gracefully falls back to unchanged order if model load fails

### How to enable
- Set env var: `COCOINDEX_RERANK=true` (default OFF — opt-in)
- Override model: `COCOINDEX_RERANK_MODEL=<HF model name>` (default `Alibaba-NLP/gte-multilingual-reranker-base`)
- Override top-K: `COCOINDEX_RERANK_TOP_K=20` (1-100 bounded)

### Why it matters
- Cross-encoders are slower per-pair but MUCH more accurate at relevance than embedding cosine similarity
- Research estimated +2 to +4 hits on the 18-pair fixture (50.0% → 61.1% — biggest potential lift of the 3 §3 improvements)
- Opt-in posture: operators can A/B test before promoting to default-on

### Files affected
- `mcp_server/cocoindex_code/reranker.py` (NEW — 140 LOC)
- `mcp_server/cocoindex_code/query.py` (integration in `query_codebase()` after RRF fusion)
- `mcp_server/cocoindex_code/config.py` (3 new env vars)
- `mcp_server/cocoindex_code/protocol.py` (`pre_rerank_score` + `reranker_score` response fields)
- `mcp_server/tests/test_reranker.py` (NEW — 7 tests including fallback paths)

---

## v1.7 — Chunking tuning (`008-chunking-strategy-tuning`)

**Shipped:** 2026-05-18
**Commit:** `e0560b0a9`

### What changed
- Raised `CHUNK_SIZE` from 1000 chars → **1500 chars** (Stage A — conservative)
- Raised `CHUNK_OVERLAP` from 150 chars → **200 chars** (mild)
- `MIN_CHUNK_SIZE` unchanged at 250
- Exposed all 3 as env-tunable: `COCOINDEX_CODE_CHUNK_SIZE` (100-8000), `COCOINDEX_CODE_CHUNK_OVERLAP` (0-1000), `COCOINDEX_CODE_MIN_CHUNK_SIZE` (50-1000)
- Indexer reads from `Config` instead of module constants on each call (so future operator changes don't require a rebuild)

### How to enable
- These are NEW DEFAULTS — they take effect automatically on next reindex
- To go back to the old 1000/150: `COCOINDEX_CODE_CHUNK_SIZE=1000 COCOINDEX_CODE_CHUNK_OVERLAP=150`

### Why it matters
- Literature (Wu et al. 2026, Zhang et al. 2025, BEIR/LlamaIndex docs) converges on 512-1024 tokens as optimal for code retrieval. The old 1000-char default mapped to only ~250-400 tokens — way below optimum.
- Research estimated +4-6pp lift on the 18-pair fixture (38.9% → 43-45%)
- Reduces corpus size by ~25-30% (~127K chunks → ~90-95K chunks), making reindex faster
- Stage B (raise to 2000 + per-language overrides) is deferred until Stage A reindex benchmark confirms the lift

### Files affected
- `mcp_server/cocoindex_code/indexer.py` (constants + per-call Config lookup)
- `mcp_server/cocoindex_code/config.py` (3 new bounded env vars + `_parse_int_env` helper)
- `mcp_server/tests/test_config.py` (6 new chunk-config tests, 16/16 pass)

---

## v1.8 — Hybrid search with BM25 + RRF (`009-hybrid-search-bm25-fusion`)

**Shipped:** 2026-05-18
**Commit:** `93ba0ed8e`

### What changed
- Added SQLite FTS5 (full-text search 5) as a lexical-search engine alongside the existing semantic vector search
- Added Reciprocal Rank Fusion (RRF) to merge results from BOTH lanes (vector + lexical) with rank-robust scoring
- Mirrors mk-spec-memory's proven `sqlite-fts.ts` + `rrf-fusion.ts` pattern (no greenfield design)
- New virtual table `code_chunks_fts` is populated during indexing with `unicode61` tokenizer (handles code identifiers cleanly)
- Min-max normalizes scores per channel before fusion (matches mk-spec-memory's stage2-fusion contract)

### How to enable
- Set env var: `COCOINDEX_HYBRID=true` (default OFF — opt-in)
- Tune the weights: `COCOINDEX_HYBRID_VECTOR_WEIGHT=0.7`, `COCOINDEX_HYBRID_FTS5_WEIGHT=0.7` (range 0.0-2.0)
- Tune RRF k-value: `COCOINDEX_HYBRID_RRF_K=60` (1-500, default 60 per Cormack et al. 2009 standard)

### Why it matters
- Pure semantic search misses queries with exact code-identifier matches (e.g., "where is `getAdapter` called"). BM25 nails those.
- Pure BM25 misses paraphrased intent (e.g., "code that loads embedder by name"). Vector search nails those.
- Fusion gets BOTH — typical lift in hybrid retrieval literature is +5-15pp.
- Telemetry split lets you see which lane (`vector_only` vs `hybrid_rrf`) handled each query.

### Files affected
- `mcp_server/cocoindex_code/fts_index.py` (NEW — FTS5 table management + queries)
- `mcp_server/cocoindex_code/fusion.py` (NEW — `rrf_fuse()` per mk-spec-memory pattern)
- `mcp_server/cocoindex_code/query.py` (extended `query_codebase()` with hybrid dispatch — +347 LOC)
- `mcp_server/cocoindex_code/indexer.py` (FTS5 populate hook)
- `mcp_server/cocoindex_code/protocol.py` (response gains `fts5_score` + `rrf_score`)
- `mcp_server/cocoindex_code/config.py` (4 new env vars)
- `mcp_server/tests/test_fts_index.py` (NEW — 6 tests)

---

## v1.9 — Daemon resilience (`010-daemon-resilience`)

**Shipped:** 2026-05-17 (pulled in from 026/011)

### What changed
- 7-patch defense-in-depth fix for a socket-unlink cascade that caused leaked-zombie daemon processes
- Removed unconditional socket-unlink at daemon startup
- Made `start_daemon` atomic (no race window between fork + listen)
- Fixed double `logger.exception` per disconnect (was 90% of CPU spike in log spam)
- 6 unsafe `send_bytes` sites wrapped with proper error handling
- Idempotent `fcntl.flock` to prevent multi-daemon overlap

### Why it matters
- Before: long-lived sessions accumulated zombie daemon processes + occasional CPU-spinning log spam
- After: stable single-daemon lifecycle; daemons exit cleanly on shutdown

### Files affected
- `mcp_server/cocoindex_code/daemon.py`
- `mcp_server/cocoindex_code/cli.py`
- `mcp_server/cocoindex_code/observability.py`

---

## v1.10 — Reranker default model swap (GTE→BGE) + hybrid/rerank promoted to default-on

**Shipped:** 2026-05-18
**Commits:** `4ec84cec2` (defaults flip) + `c6a6493e6` (reranker model swap)

### What changed

Two related fixes shipped on the same day:

**Fix 1 — Defaults flipped to default-on** (`4ec84cec2`)

- `COCOINDEX_HYBRID` default `false` → **`true`** (SQLite FTS5 + RRF fusion now on by default)
- `COCOINDEX_RERANK` default `false` → **`true`** (cross-encoder rerank now on by default)
- Operators opt **out** by setting either env var to `false`; the prior opt-in posture is reversed
- Test updates: 3 assertions flipped in `test_config.py` + `test_reranker.py`; 32/32 tests still pass

**Fix 2 — Reranker default model swapped GTE → BGE** (`c6a6493e6`)

- Default `COCOINDEX_RERANK_MODEL` changed from `Alibaba-NLP/gte-multilingual-reranker-base` to **`BAAI/bge-reranker-v2-m3`** (Apache-2.0, ~568M params)
- Triggered by an end-to-end validation run immediately after the Fix-1 default-on promotion, before any production benchmark
- On Apple Silicon MPS, GTE-multilingual fails inside `sentence_transformers.CrossEncoder.predict` under sentence-transformers 5.4.1 + transformers 5.8.0 + torch 2.11.0:
  ```
  AcceleratorError: index 733634176249652595 is out of bounds: 0, range 0 to 21
  ```
- `RerankerAdapter`'s try/except correctly caught the exception and returned candidates in upstream RRF order — but **silently**. The response still populated `pre_rerank_score` and `reranker_score`, so a "did I get a response with rerank fields?" smoke check could not distinguish a real rerank from a silent fallback. Every prior search query with `COCOINDEX_RERANK=true` on MPS got zero reranker contribution between the default-on flip and this swap.
- BGE-reranker-v2-m3 was validated end-to-end: properly reranks 3 fake candidates (moves `user_login.py` from rank 3 to rank 1 for the query "how does user login work")
- 7/7 reranker unit tests still pass (mocked path unaffected by the default-model change)
- Operators on non-MPS backends, or those validating future ST/transformers compatibility patches, can re-pin GTE via `COCOINDEX_RERANK_MODEL=Alibaba-NLP/gte-multilingual-reranker-base`

### Why it matters

- The default-on flip means the hybrid + rerank lift estimates from v1.6 / v1.8 now apply to every operator's default install instead of only those who opted in. Operators who need the prior vector-only behavior have two flags to set explicitly.
- The silent-fallback bug discovered immediately after the default-on promotion is the load-bearing example of why "did the response succeed?" is not enough to verify the rerank stage actually ran. The fail-soft contract in `RerankerAdapter` is correct as a safety mechanism but obscures load-time and per-call failures unless you also inspect `daemon.log` for `RerankerAdapter` warnings.
- Discovery happened end-to-end (smoke search against the running daemon) rather than via the 18-pair fixture benchmark, which would have hidden the silent fallback because the prior bake-off measured retrieval quality, not the reranker-ran-vs-fell-back distinction. The unit test suite was unaffected because the model load is mocked.
- The first cold-cache call now downloads ~2.3 GB (BGE) instead of ~0.61 GB (GTE), so the first-pull window is noticeably longer; the per-call inference cost remains comparable.

### Files affected

- `mcp_server/cocoindex_code/config.py` — defaults for `COCOINDEX_HYBRID`, `COCOINDEX_RERANK`, `_DEFAULT_RERANK_MODEL`
- `mcp_server/tests/test_config.py` — assertions for the new hybrid default
- `mcp_server/tests/test_reranker.py` — assertion for the new rerank default
- `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` — flipped opt-in language to default-on; documented GTE/MPS failure + escape hatch
- `.opencode/skills/mcp-coco-index/feature_catalog/05--search-and-ranking/08-reranker-cross-encoder.md` — renamed from `08-reranker-gte-cross-encoder.md`; added Known Limitations section for GTE-on-MPS
- `.opencode/skills/mcp-coco-index/feature_catalog/08--configuration/04-environment-overrides.md` — updated default values + reranker-model description
- `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` — root catalog cross-reference for the renamed reranker file
- `.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md` — CFG-006/CFG-007 descriptions reframed default-on with opt-out
- `.opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/007-reranker-opt-in.md` — scenario commands + expected signals updated to validate the default-on path and the explicit opt-out (filename kept for catalog stability)

---

## Cross-cutting research arc (016/011)

Sub-phases 007-009 (reranker / chunking / hybrid) were preceded by a **10-iteration deep-research run** via cli-devin SWE-1.6 (later kimi-k2.6 after SWE-1.6 quota hit). Findings live at:

- `007-reranker-integration/research/research.md` — model survey, integration point, top-K sweep
- `008-chunking-strategy-tuning/research/research.md` — current chunker analysis, strategy survey, synthesis
- `009-hybrid-search-bm25-fusion/research/research.md` — BM25 engine selection, fusion algorithm survey, cross-cutting roadmap

All 3 research arcs CONVERGED with concrete recommendations + estimated lift figures. The implementations followed those recommendations directly.

---

## Cumulative impact

| Phase | Status | Est. lift vs baseline (38.9%) |
|---|---|---|
| v1.7 chunking | shipped default-on | +4-6pp → ~43-45% |
| v1.8 hybrid (on top of chunking) | shipped default-on (v1.10) | +5-10pp → ~50% |
| v1.6 reranker (on top of hybrid) | shipped default-on (v1.10) with BGE default (v1.10) | +5-10pp → ~55% |

**All 3 features are now DEFAULT-ON as of v1.10.** Hybrid (BM25+RRF) and cross-encoder rerank flipped from opt-in to default-on in `4ec84cec2`; the reranker default model swapped from GTE to BGE in `c6a6493e6` to avoid the silent Apple Silicon MPS fallback. To opt out of any layer:

```bash
export COCOINDEX_HYBRID=false             # fall back to vector-only retrieval
export COCOINDEX_RERANK=false             # skip the cross-encoder rerank stage
# To pin the prior GTE reranker (non-MPS backends only — broken on Apple Silicon):
# export COCOINDEX_RERANK_MODEL=Alibaba-NLP/gte-multilingual-reranker-base
ccc reset --force && ccc index            # only needed if changing chunk size or restarting from a clean state
```

To validate: run the 18-pair fixture via the bake-off harness with `COCOINDEX_HYBRID=true COCOINDEX_RERANK=true` (now the default) versus `COCOINDEX_HYBRID=false COCOINDEX_RERANK=false` and confirm hit-rate improvement.

---

## Open follow-ons (not yet shipped)

- **Stage B chunking** — raise `CHUNK_SIZE` to 2000 + per-language overrides (TS=2000, MD=800, Python=1500). Pending Stage A reindex benchmark.
- **cAST tree-sitter chunking** — Zhang et al. 2025 showed +4.3pp on RepoEval. High engineering cost — deferred to a separate packet.
- **Reranker default-on** — **shipped in v1.10 (`4ec84cec2`)** ahead of the original p95-latency / +2-hits gate; subsequent benchmark sweep on the 18-pair fixture is queued to retroactively confirm the gate post-promotion.
- **Hybrid default-on** — **shipped in v1.10 (`4ec84cec2`)** alongside the reranker promotion; same retroactive-benchmark follow-on applies.
- **Reranker default-model regression watch (GTE)** — re-evaluate `Alibaba-NLP/gte-multilingual-reranker-base` once `sentence-transformers` / `transformers` ship a fix for the MPS `AcceleratorError`; until then BGE-reranker-v2-m3 stays as the default per `c6a6493e6`.
- **Per-implementation post-impl deep-review** — constitutional mandate; not yet run for 007/008/009 commits.

---

## How to use this changelog

- **New operator?** Read v1.0 → v1.5 to understand the baseline, then v1.6 → v1.10 to know what is on by default and how to opt out.
- **Debugging a search-quality issue?** Check v1.8 hybrid + v1.6 reranker — both default-on as of v1.10. Confirm `daemon.log` shows `lane=hybrid_rrf` and a `BAAI/bge-reranker-v2-m3` load trace before assuming the lanes are doing real work (v1.10's silent-fallback bug is the cautionary tale).
- **Considering a new embedder?** Read v1.3 + v1.4 (registry pattern) before adding entries to `registered_embedders.py`.
- **Daemon flakiness?** v1.9 is the relevant history.
- **Reranker model question (GTE vs BGE)?** v1.10 is the relevant history — BGE is the default; GTE is opt-in via env var and currently broken on Apple Silicon MPS.
