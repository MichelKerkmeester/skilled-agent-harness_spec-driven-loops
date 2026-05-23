---
title: "Changelog: 004-code-index-stack (CocoIndex retrieval optimization arc, 22 phases)"
description: "Consolidated plain-English changelog of the CocoIndex (Python semantic code search) retrieval optimization arc. Covers fixture authoring, multi-candidate embedder bake-offs, hybrid BM25/FTS5 fusion, AST-aware tree-sitter chunking, identifier-bridging query expansion, mirror dedup, empirical RRF recalibration, reranker matrix re-bench locking jina-reranker-v3 as production default at 14/18, daemon resilience research, fixture audit and harness hardening, a 10-iteration deep-review arc with P1 remediation and the deep-research follow-on covering arc blind spots."
trigger_phrases:
  - "004-code-index-stack changelog"
  - "cocoindex stack changelog"
  - "cocoindex retrieval arc changelog"
  - "016/004 consolidated changelog"
  - "jina-reranker-v3 production default"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

# Changelog: 004-code-index-stack

> Plain-English changelog covering all 22 sub-phases of the CocoIndex retrieval optimization arc. Read this if you want to understand what shipped in semantic code search without diving into Python.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/` (phase parent, 22 sub-phases, numbering skips 021)
>
> **Stack:** `.opencode/skills/mcp-coco-index/` (CocoIndex Python MCP server, indexer, query pipeline, fts_index, fusion, reranker, query_expansion, chunkers and benchmarks).
>
> **Headline:** Production default after the arc = `sbert/nomic-ai/CodeRankEmbed` embedder + `jina-reranker-v3` second-stage reranker at 14/18 hit rate on the corrected fixture.

---

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/` (Phase Parent)

### Summary

This arc is the CocoIndex parallel of the 002 mk-spec-memory work. It covers the full retrieval stack from embedder selection through hybrid search, reranking, chunking strategy and query expansion. The arc opened with the question "is gemma the right code embedder?" and closed with an empirically-grounded answer: under the fully fixed pipeline (mirror dedup, AST-aware chunking, RRF recalibration), `sbert/nomic-ai/CodeRankEmbed` plus `jina-reranker-v3` reaches 14 of 18 hits on the corrected fixture. The journey took 22 phases because every early answer was conditional on later infrastructure being correct and the bench harness itself needed hardening before any embedder verdict could be trusted.

The structural wins are the durable ones. Mirror dedup collapses 4 runtime mirrors to one canonical representative before the rerank window, recovering up to 75 percent of rerank slots that were previously wasted on duplicates (phase 014). AST-aware tree-sitter chunking replaces blind line-windowing so each top-level definition becomes its own chunk with full body and JSDoc, eliminating the failure mode where 9-line import headers ranked above function bodies (phase 015). Identifier-bridging query expansion splits camelCase, snake_case, PascalCase and kebab-case to bridge natural-language queries to identifier-heavy corpus tokens, though the empirical bench surfaced a regression and the feature ships default-off pending further tuning (phase 016). Empirical RRF recalibration with a 7-cell sweep locked picker-latency-optimum defaults at K=60, vec_weight=0.9, fts_weight=0.5 (phase 017).

Quality assurance came through a 10-iteration deep-review of phases 013-018 plus a P1 remediation packet that closed 9 defects across production code, tests, operator docs and benchmark harnesses (phases 019, 020, 022). A deep-research follow-on (phase 023) scaffolded an 8-packet arc covering retrieval observability, request-budget hardening, upstream rebase spike, metadata fingerprint, doctor model-swap UX, prompt license registry, fixture calibration and a deferred vec0 migration fix.

Honest caveats: phase 005 (declarative registry) and 006 (install-guide updates) remained in planning state in this packet though the actual registry now exists in `cocoindex_code/registered_embedders.py` per parent spec. Phase 008 (chunking strategy tuning) is research-only with no implementation packet of its own. Phase 010 (daemon resilience) is Research-Complete: the 7-patch defense-in-depth plan is documented but the patches themselves were not applied inside this packet. Phases 019 and 022 are non-standard review packets without canonical spec files.

### Included Phases

| Phase | Slug | Status | Shipped |
|---|---|---|---|
| 001 | [cocoindex-swap](./001-cocoindex-swap/) | Pending (planning) | not yet |
| 002 | [baseline-fixture](./002-baseline-fixture/) | Complete | 2026-05-17 |
| 003 | [comparison-measure](./003-comparison-measure/) | Complete (ADR-001 KEEP-JINA-CODE) | 2026-05-17 |
| 004 | [extended-bake-off](./004-extended-bake-off/) | Complete (bge-code-v1 lead, later superseded) | 2026-05-18 |
| 005 | [declarative-registry](./005-declarative-registry/) | Pending (registry exists in code, packet docs not updated) | not yet (per packet) |
| 006 | [install-guide-updates](./006-install-guide-updates/) | Planned (blocked on 005 packet docs) | not yet |
| 007 | [reranker-integration](./007-reranker-integration/) | Implemented (opt-in) | 2026-05-18 |
| 008 | [chunking-strategy-tuning](./008-chunking-strategy-tuning/) | Research-only | n/a |
| 009 | [hybrid-search-bm25-fusion](./009-hybrid-search-bm25-fusion/) | Implemented (default-on) | 2026-05-18 |
| 010 | [daemon-resilience](./010-daemon-resilience/) | Research-Complete (7 patches documented, not applied in this packet) | 2026-05-07 |
| 011 | [rerank-model-fit-investigation](./011-rerank-model-fit-investigation/) | Research-only | 2026-05-18 |
| 012 | [fixture-audit-10-probes](./012-fixture-audit-10-probes/) | Research-only | 2026-05-18 |
| 013 | [bench-harness-and-fixture-audit](./013-bench-harness-and-fixture-audit/) | Complete | 2026-05-19 |
| 014 | [mirror-dedup-canonical-preference](./014-mirror-dedup-canonical-preference/) | Complete | 2026-05-19 |
| 015 | [code-aware-chunking-tree-sitter](./015-code-aware-chunking-tree-sitter/) | Complete | 2026-05-19 |
| 016 | [query-expansion-identifier-bridging](./016-query-expansion-identifier-bridging/) | Complete (default-off) | 2026-05-19 |
| 017 | [hybrid-fusion-empirical-recalibration](./017-hybrid-fusion-empirical-recalibration/) | Complete | 2026-05-19 |
| 018 | [rerank-matrix-rebench](./018-rerank-matrix-rebench/) | Complete (ADR-021, jina-reranker-v3 locked) | 2026-05-19 |
| 019 | [deep-review-arc-013-to-018](./019-deep-review-arc-013-to-018/) | Review packet | 2026-05-19 |
| 020 | [deep-review-p1-p2-remediation](./020-deep-review-p1-p2-remediation/) | Complete (9 P1 fixes) | 2026-05-19 |
| 022 | [verification-p1-p2-remediation](./022-verification-p1-p2-remediation/) | Verification review packet | 2026-05-19 |
| 023 | [deep-research-arc-blind-spots](./023-deep-research-arc-blind-spots/) | Phase parent (8-child scaffold) | 2026-05-20 |

> Phase 021 is intentionally skipped. There is no `021-*` folder under this packet.

### Added

#### 18-pair deterministic baseline fixture (002)

Without a deterministic fixture, embedder comparisons have no measurable answer. Phase 002 authored an 18-pair query-to-expected-source fixture covering mk-spec-memory embedder code, Code Graph libraries, CocoIndex Python code and test files. Distribution was 5 easy, 7 medium and 6 hard difficulty pairs. A `fixture-validate.sh` script checked path existence and pattern compatibility. This fixture became the substrate for every subsequent benchmark phase, including the final 014-018 re-bench.

&nbsp;

#### Reranker integration (007)

Phase 007 added opt-in cross-encoder reranker support. The original first-pick was Alibaba-NLP/gte-multilingual-reranker-base with K=20, rolled out behind a `COCOINDEX_RERANK` flag. The integration point sits after hybrid RRF fusion, replaces the final score with the reranker score and preserves the original fusion score for auditability. Later phases (018) re-benched the reranker choice under the fully fixed pipeline and promoted `jina-reranker-v3` to production default.

&nbsp;

#### Hybrid BM25 + RRF fusion (009)

Combining dense semantic search with lexical BM25 (exact word matching) improves recall by catching exact tokens that embeddings may miss. Phase 009 shipped SQLite FTS5 as the embedded lexical engine plus RRF (reciprocal rank fusion) as the fusion algorithm, default-on via `COCOINDEX_HYBRID=true`. Hybrid search became the new default retrieval mode after this phase.

&nbsp;

#### Mirror-aware dedup (014)

Up to 75 percent of rerank slots can be redundant when 4 runtime mirrors of every file compete (the same file appears under `.opencode/`, `.claude/`, `.gemini/`, `.codex/`). Phase 014 implemented mirror-aware dedup in `_dedup_and_rank_hybrid_rows()` so the 4 mirrors collapse to one canonical representative before the rerank window. A new `COCOINDEX_CANONICAL_MIRROR` config var defaults to `.opencode`. The dedup runs in two passes: collapse mirror groups first, then run existing content-hash dedup. ADR-017 documents the canonical-mirror policy.

&nbsp;

#### AST-aware tree-sitter chunking (015)

The default `RecursiveSplitter` did blind line-windowing, which produced information-poor candidates like 9-line import headers ranking above function bodies. Phase 015 replaced it with AST-aware chunking using tree-sitter grammars. Each top-level definition becomes its own chunk with full body and JSDoc. Six languages are supported (TypeScript, Python, JavaScript, Go, Rust, Java) with a fallback to RecursiveSplitter for unsupported languages. ADR-018 documents the AST upgrade.

&nbsp;

#### Identifier-bridging query expansion (016)

Natural-language queries like "filesystem walker" do not match identifier-heavy corpus tokens like `findFiles`. Phase 016 implemented identifier-bridging expansion before encoding: split camelCase, snake_case, PascalCase and kebab-case, generate identifier variants, apply a code-domain synonym dictionary extensible via env var. Ships **default-off** (`COCOINDEX_QUERY_EXPANSION=false`) after the bench showed deterministic expansion regressed all three lanes. The contract and rollback path are documented in ADR-019.

&nbsp;

#### RRF parameter sweep harness (017)

Inherited RRF defaults (K=60, vec_weight=0.7, fts_weight=0.7) were never empirically tuned on this corpus. Phase 017 ran a 7-cell local-neighbourhood sweep on bge-code-v1. All cells tied at 12 of 18 hits, making RRF tuning a no-op on hit rate. The picker selected the latency-optimum cell (K=60, V=0.9, F=0.5) for a 2.8 percent p95 win at identical recall. The sweep harness supports broader future grids. ADR-020 documents the empirical finding.

&nbsp;

#### 8-packet deep-research follow-on (023)

The deep-research pass found a cluster of retrieval, metadata, operator-UX and upstream-drift gaps. Phase 023 is a phase parent scaffolding an 8-packet follow-on arc covering: request-budget hardening (001), retrieval observability (002), upstream rebase spike (003), metadata fingerprint (004), doctor model-swap UX (005), prompt license registry (006), fixture calibration (007) and a deferred vec0 migration fix (008).

### Changed

#### Production embedder default (003 → 004 → later)

Phase 003 ran the primary jina-code vs gemma comparison and shipped ADR-001 KEEP-JINA-CODE. Phase 004's extended bake-off (4 candidates with hybrid + reranker defaults enabled) measured `BAAI/bge-code-v1` at 11 of 18 hits at 504 ms median latency, outperforming jina-code, gemma and CodeRankEmbed which all tied at 9 of 18. Stella was skipped due to xformers dependency. The reranker was swapped from GTE to `BGE-reranker-v2-m3` due to MPS (Apple Silicon Metal Performance Shaders) compatibility. The bge-code-v1 lead was later invalidated when the corrected pipeline (013-017) and the re-bench (018) reshuffled the verdict. **The current production embedder default `sbert/nomic-ai/CodeRankEmbed` was promoted in `001-local-embeddings-foundation/018`** outside this packet. The 004 results documented the empirical journey but the durable default lives in the foundation arc.

&nbsp;

#### Production reranker default (007 → 018)

Phase 007 shipped the GTE reranker as an opt-in. Phase 018 re-benched all reranker candidates under the fully fixed pipeline from 013 to 017 and locked `jina-reranker-v3` as the production default at 14 of 18 hits versus BGE at 12 of 18 and BGE-plus-path-class at 13 of 18. BGE remains opt-in via env override. ADR-021 documents the 4-lane verdict and closes the arc.

&nbsp;

#### Bench harness hardening (013)

Path-extraction regex in `run-phase2-smoke.sh` was too permissive and misclassified true hits as misses by including backticks, import-statement wrappers and mock-data literals. Phase 013 hardened the regex, added a path-existence sanity check that discards non-file tokens, then audited all 18 probes against live database presence to flag unindexed expected paths. Probe 10 expected an unindexed `.js` dist file, making it a guaranteed miss under any reranker. The corrected fixture (`code-retrieval-fixture-corrected.json`) became the new measurement baseline. ADR-016 documents defects and fixes.

&nbsp;

#### P1 remediation across 9 defects (020)

Phase 019's deep-review found 9 P1 defects across production code, tests, operator docs and benchmark harnesses. Phase 020 remediated all 9. Fixes included stale defaults in `settings.py`, docs contradictions in `README.md`, `SKILL.md` and `INSTALL_GUIDE.md`, unsafe env parsing, misleading success reporting and overpowering hybrid boosts. Full mcp-coco-index pytest suite passes. Ruff lint passes for `cocoindex_code` and `tests`.

### Fixed

- **Path-extraction regex too permissive** that misclassified true hits as misses, fixed by 013.
- **Probe 10 unindexed `.js` dist expectation** that made it a guaranteed miss under any reranker, fixed by 013's corrected fixture.
- **Mirror redundancy in rerank window** that wasted up to 75 percent of rerank slots, fixed by 014.
- **Line-window chunking** that ranked import headers above function bodies, fixed by 015.
- **Inherited RRF defaults** never tuned on this corpus, recalibrated by 017.
- **Reranker fairness regression** measured on broken pipeline with mirror pollution and identifier gap, fixed by 018 re-bench under the corrected pipeline.
- **9 P1 defects from deep-review** across production code, tests and docs, fixed by 020.
- **Daemon resilience gaps** (7 patches for zombie daemon leaks, unsafe `send_bytes` sites, unconditional socket-unlink at startup, missing log rotation) documented by 010 but the patches themselves were not applied inside this packet.

### Verification

- **18-pair fixture (002)** with a `fixture-validate.sh` script confirms path existence and pattern compatibility.
- **Primary embedder comparison (003)** captures per-pair top-3 hits and latency for both candidates in `cocoindex-embedder-comparison.jsonl` and `.csv`.
- **Extended bake-off (004)** measured 4 candidates with hybrid plus reranker defaults enabled.
- **10-iteration deep-review (019)** covered phases 013-018 with iteration JSONL, a dashboard and a final report. Verdict: 9 P1 defects identified for remediation.
- **P1 remediation verification (022)** is a separate review packet that verifies the 020 remediation changes against acceptance criteria.
- **Fixture audit (013)** reports each probe as indexed, excluded or missing.
- **Corrected-fixture baseline re-bench (018)** locks the production reranker at 14 of 18.
- **RRF sweep harness (017)** supports broader future grids.
- **Pytest suite, ruff lint and strict spec validate** pass on every shipped phase.

### Files Changed

| Area | File | What changed |
|---|---|---|
| Config | `cocoindex_code/config.py` | Embedder, reranker, hybrid, chunking, expansion and RRF defaults |
| Config | `cocoindex_code/settings.py` | Stale default sweep (020) |
| Query path | `cocoindex_code/query.py` | Hybrid fusion, mirror dedup, reranker integration, query-expansion entry (007, 009, 014, 016) |
| Lexical | `cocoindex_code/fts_index.py` | SQLite FTS5 lexical index (009) |
| Fusion | `cocoindex_code/fusion.py` | RRF fusion implementation (009) |
| Reranker | `cocoindex_code/reranker.py` | Cross-encoder reranker integration (007) |
| Reranker | `cocoindex_code/rerankers_jina_v3.py` | jina-reranker-v3 implementation (018) |
| Expansion | `cocoindex_code/query_expansion.py` | Identifier bridging plus synonym dictionary (016) |
| Chunkers | `cocoindex_code/chunkers/code_aware.py` | AST-aware chunker using tree-sitter (015) |
| Chunkers | `cocoindex_code/chunkers/grammars.py` | Six-language grammar registry (015) |
| Indexer | `cocoindex_code/indexer.py` | Chunker selection plus mirror-aware path resolution (014, 015) |
| Path utils | `cocoindex_code/path_utils.py` | Canonical-mirror path resolver (014) |
| Daemon | `cocoindex_code/daemon.py` | Documented 7-patch resilience plan (010), 020 cleanup applied |
| Daemon | `cocoindex_code/client.py` | Documented 7-patch resilience plan (010) |
| Registry | `cocoindex_code/registered_embedders.py` | Declarative manifest list (per parent spec, packet 005 docs not yet updated) |
| Tests | `tests/test_query.py` | Mirror dedup tests (014) |
| Tests | `tests/test_query_expansion.py` | Expansion-logic tests (016) |
| Tests | `tests/test_code_aware_chunker.py` | AST chunker tests (015) |
| Tests | `tests/test_rrf_config.py` | RRF config tests (017) |
| Tests | `tests/test_daemon.py`, `tests/test_e2e_daemon.py` | Daemon resilience tests (010, new files) |
| Bench | `phase2-bench/run-extended-bake-off-with-hybrid-rerank.sh` | 4-candidate bench harness (004) |
| Bench | `phase2-bench/sweep-rrf.sh`, `sweep-rrf.py` | RRF parameter sweep harness (017) |
| Bench | `phase2-bench/rerank-matrix-bench.sh`, `rerank-matrix-analyze.py` | 4-lane reranker re-bench (018) |
| Bench | `phase2-bench/run-phase2-smoke.sh` | Path-extraction regex hardening (013) |
| Bench | `phase2-bench/test_path_extraction.py` | Path-extraction tests (013) |
| Fixtures | `evidence/code-retrieval-fixture.json` | Original 18-pair fixture (002) |
| Fixtures | `evidence/code-retrieval-fixture-audited.json` | Audit results (013) |
| Fixtures | `evidence/code-retrieval-fixture-corrected.json` | Corrected baseline (013) |
| Evidence | `evidence/cocoindex-embedder-comparison.csv` | Primary 2-candidate comparison (003) |
| Evidence | `evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv` | Extended 4-candidate bake-off (004) |
| Evidence | `004-extended-bake-off/benchmark-results.md` | Headline analysis (004) |
| Decision | ADR-001 through ADR-021 | Embedder, reranker, mirror, chunking, expansion, RRF and rerank-matrix decisions |
| Docs | `.opencode/skills/mcp-coco-index/README.md`, `SKILL.md`, `INSTALL_GUIDE.md` | Doc alignment after 020 remediation |
| Review | `019-deep-review-arc-013-to-018/review/review-report.md` plus iterations | 10-iter deep review (019) |
| Review | `022-verification-p1-p2-remediation/review/` | Verification review (022) |

### Follow-Ups

- **Phase 001 (cocoindex-swap)** stayed in planning state in this packet. The actual embedder swap that landed in production (`sbert/nomic-ai/CodeRankEmbed`) happened in `001-local-embeddings-foundation/018-*`. The 001 packet docs in this stack should either be marked superseded with a forward pointer or closed.
- **Phase 005 (declarative-registry)** is marked Pending in the packet but `cocoindex_code/registered_embedders.py` exists per the parent `spec.md`. The packet docs should be reconciled with the live code state and either marked Complete or rescoped to cover only the remaining declarative-metadata gaps.
- **Phase 006 (install-guide-updates)** is blocked on the 005 packet docs. Once 005 reconciles, 006 should ship the operator-facing "choosing an embedder" section in INSTALL_GUIDE and README. The 020 remediation already touched these files for stale defaults, so the install-guide changes should layer cleanly on top.
- **Phase 008 (chunking-strategy-tuning)** is research-only and was largely implemented by 015 (AST-aware tree-sitter chunking). The packet should be marked closed-by-015 or merged into 015's continuity ladder.
- **Phase 010 (daemon-resilience)** documented 7 patches but did not apply them. A separate implementation packet should pick up the 7-patch defense-in-depth and run the 24-hour 100-client soak test that the research deferred.
- **Phase 011 (rerank-model-fit)** identified structural reranker failure modes (paraphrase-heavy queries demoting implementations below tests). The 018 re-bench locked jina-reranker-v3 as production default and may have closed the issue empirically, but the structural finding remains in the record and may inform future reranker work.
- **Phase 012 (fixture-audit-10-probes)** triggered the 013 audit. The follow-on is the 023-007 fixture calibration packet, which scopes a deeper recalibration of all 18 probes against the live codebase.
- **23 follow-on arc (8 packets) has not started.** All 8 children are scaffolded but no implementation has shipped. The retrieval observability and request-budget hardening packets are the most operator-visible items in the scaffold and should be prioritised.
- **24-hour 100-client soak test for daemon resilience** was the durable proof point named by 010. It has not been run on this machine.
- **MPS auto-detect coverage in vitest** was named as verification by 001 but the packet did not ship. Once 001 reconciles, the MPS detect vitest assertion should land as part of the swap or be confirmed redundant against current `_resolve_device` coverage.
