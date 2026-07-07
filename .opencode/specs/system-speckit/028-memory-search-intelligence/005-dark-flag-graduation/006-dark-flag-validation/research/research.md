# Dark Flag Validation: Real-World Scenario Coverage of 007 Graduation Winners

## Executive Summary

The 007 Dark Flag Graduation Suite returned GRADUATE verdicts for 4 clusters (9 flags), REFINE for 1 (true-citation ledger), and CUT for 5. This research investigated whether each GRADUATE winner benefits all relevant real-world scenarios beyond the labeled benchmark set, triangulating implementation code, benchmark evidence, and retrieval/graph/routing theory.

**Core finding: Three of five graduated flags carry unresolved production gaps the benchmark verdicts acknowledge but don't surface as blockers.** The graduation recommendations are sound as design validations but premature as production readiness signals. Two cross-cutting patterns emerged:

1. **Conditional graduations dressed as unqualified verdicts.** The bitemporal writer graduates but isn't wired to the reindex path. The staleness repair graduates but its safety mechanism (degree cap) defaults to 0 = uncapped with no production ceiling set. The heartbeat graduates with an undefined production cadence. The citation ledger is REFINE (not GRADUATE) but its code-level fix is sound — it's gated on traffic accumulation, not a design flaw.

2. **All benchmarks ran against synthetic data, read-only corpus copies, or in-memory overlays — never against live, mutating production state.** The leap from benchmark conditions to production behavior is the single largest unmeasured variable across the suite.

### Per-Cluster Confidence Beyond Labeled Set

| Cluster | Flag(s) | Verdict | Confidence Beyond Benchmark | Primary Limitation |
|---------|---------|---------|---------------------------|-------------------|
| 001 Multihop | `SPECKIT_DETERMINISTIC_MULTIHOP`, `SPECKIT_LANE_CHAMPION_BACKFILL` | GRADUATE (deep-K) | **Low-Medium** | Domain-specific heuristic coupled to NNN-slug convention; K=12 only 0.625 |
| 006 Staleness | `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE`, degree cap | GRADUATE | **Medium** | Graph consistency principle is general, but tested on 3-file synthetic graph |
| 006 Bitemporal | `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` | GRADUATE | **Low-Medium** | Proven in isolation, consumer NOT wired to reindex path |
| 007 RRF | `SPECKIT_ADVISOR_RRF_FUSION` + conflict seam | GRADUATE | **Medium-High** | Theory-backed (Cormack 2009), but only 1/42 prompts differed |
| 008 Dedup | `SPECKIT_FANOUT_NEAR_DUP_DEDUP` | GRADUATE | **Low-Medium** | Precision 1.0 on 17 synthetic records; scale behavior unknown |
| 008 Gauges | Lag ceiling + heartbeat | GRADUATE | **Medium** | Principles sound; production cadence/thresholds undefined |
| 003 Citation | `SPECKIT_TRUE_CITATION_EMITTER` | REFINE | **Low** | Zero live density — gated entirely on traffic accumulation |

---

## 1. Research Context

### Research Topic

Investigate whether each dark-flag-graduation winner benefits ALL relevant real-world scenarios, not only the labeled benchmark set. For each graduate: where does it genuinely help, where could it hurt or be a no-op, and what scenario classes did the benchmark miss. Triangulate implementation code, 007 benchmark evidence, and general retrieval/graph/routing principles.

### Scope

The 007 Dark Flag Graduation Suite benchmarked 8 candidate clusters against the real corpus and returned verdicts. This research validates those verdicts by examining whether the benchmark's tested scenario classes cover the full range of real-world behavior.

### Methodology

4-iteration deep research triangulating three evidence sources:
- **Implementation code:** Flag gates, pipeline paths, algorithms in TypeScript source
- **Benchmark evidence:** Per-cluster benchmark results, query sets, metric tables
- **Retrieval/graph/routing theory:** IR rank-fusion (Cormack et al. 2009), incremental index consistency, structured dedup theory, citation mining

### Coverage

| Source | Files Analyzed |
|--------|---------------|
| Implementation | `orchestrator.ts`, `deterministic-multihop.ts`, `lane-champion-backfill.ts`, `fusion.ts`, `code-graph-db.ts`, `structural-indexer.ts`, `fanout-merge.cjs`, `fanout-pool.cjs`, `fanout-run.cjs` |
| Benchmarks | `001/benchmark-results.md`, `003/benchmark-results.md`, `006/benchmark-results.md`, `007/benchmark-results.md`, `008/benchmark-results.md`, `benchmark-status.md`, `before-vs-after.md` |
| Context | `005-dark-flag-graduation/spec.md`, `feature-flags.md`, `benchmark-and-test-status.md` |

---

## 2. GRADUATE Winners Overview

| # | Cluster | Verdict | Flags | Production Gap |
|---|---------|---------|-------|---------------|
| 1 | Multihop Tail-Appends | GRADUATE (deep-K) | 2 | Deep-K only; K=12 recall 0.625, not 0.9375 headline |
| 2 | CG Staleness Repair | GRADUATE | 2 | Degree cap defaults to 0 (uncapped); 3-file synthetic graph |
| 3 | CG Bitemporal Reads | GRADUATE | 1 | Writer NOT wired to reindex path |
| 4 | Advisor RRF Fusion | GRADUATE | 1 + conflict seam | Only 1/42 prompts moved; conflict seam dormant on live corpus |
| 5 | Deep-Loop Dedup | GRADUATE | 1 | 17 synthetic records; production scale unknown |
| 6 | Deep-Loop Gauges | GRADUATE | 2 | Cadence undefined; single-pool test only |
| 7 | True-Citation Ledger | REFINE | 1 | Zero live density; gated on traffic |

---

## 3. Per-Cluster Analysis

### 3.1 MULTIHOP TAIL-APPENDS (001) — Domain-Specific Heuristic

**What it does:** Post-fusion tail-append stage after Stage-4 limit cap. Two mechanisms:
- **Deterministic multihop:** Extracts folder-slug patterns from top-5 doc content, resolves 1:1 to spec_folder, appends that folder's spec.md
- **Lane champion backfill:** Appends each lane's first candidate not already in fused results

**Benchmark tested:** 8 queries, 24 target IDs, one corpus snapshot, K=20. completeRecall@20: 0.5625 → 0.9375 (+0.375).

**Where it genuinely helps:**
- Multi-target queries with hub docs containing slug references to sibling folders (structural property of spec ecosystem)
- Deep-K readers (K ≥ 12) consuming results beyond the standard top-10 window
- The canonical "compact-code-graph-hooks" case: baseline recall 0.00 → 1.00 — hub doc references 4 siblings invisible to lexical/vector search

**Where it's a no-op:**
- Shallow-K consumers (K ≤ 8): recall flat at 0.4375 — appends land past rank 10
- Queries where top-5 docs contain zero resolvable folder-slugs (clean-text, code-only, non-spec content)
- Queries with ambiguous slug resolution (0 or 2+ spec_folder matches → strict skip)
- Already-perfect recall queries (2 of 8 test queries at 1.0 OFF)
- Cold/empty memory_index (slug resolution depends on SQL spec_folder lookup)

**Where it could hurt:**
- Fixed per-query latency tax (slug extraction + SQL lookups) even on zero-slug queries
- Lane champion redundancy with RRF (when 007 is also ON, RRF already absorbs lane champions)
- Corpus coupling: mechanism is meaningless on non-spec documents without NNN-slug naming

**Benchmark gaps (tested → untested):**
- Slug availability distribution across ALL production queries is unknown
- 3-digit prefix collision rate (packet families share prefixes) unmeasured
- Non-spec corpus behavior completely untested
- Per-query: K=12 recall only 0.625 — the "deep-K graduate" at K=20 (0.9375) masks that realistic deep-K gains are modest

**Confidence beyond labeled set: Low-Medium.** Domain-specific heuristic, not general retrieval technique.

---

### 3.2 CODE-GRAPH STALENESS REPAIR (006) — Graph Consistency Principle

**What it does:** During incremental scan, detects files where `symbolIdentityChanged()` (rename, type-flip, move), finds their importers via `queryImportersOf()`, and force-parses them to rebind cross-file edges. Degree cap bounds the blast radius (drops importers exceeding cap from re-parse).
