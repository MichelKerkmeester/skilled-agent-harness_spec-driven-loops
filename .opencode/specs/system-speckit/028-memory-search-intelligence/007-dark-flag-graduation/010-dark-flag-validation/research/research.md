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
| Context | `007-dark-flag-graduation/spec.md`, `feature-flags.md`, `benchmark-and-test-status.md` |

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

**Benchmark tested:** 3 synthetic scenarios on 2-3 file throwaway workspace. Correctness: 3/3 rebinds correct including discriminating kind-flip case (importer byte-identical, only repair path rebinds). Cost: hot 30-importer dependency drops 37ms→21ms with cap=10.

**Where it genuinely helps:**
- Any identity-changing refactor (function→const, class split, symbol rename, module move)
- Correctness improvement, not performance — prevents stale edges from persisting when importers aren't edited
- Tunable cap adapts to real graph topology

**Where it's a no-op:**
- Zero symbol-identity changes between scans
- Degree cap ≥ all importer fan-ins (cap never triggers)

**Where it could hurt:**
- Aggressive degree cap (e.g., cap=5 on 200-importer dependency) leaves 195 importers with stale edges — correctness/performance tradeoff with no safety net
- Delete-and-recreate cycles create orphan edges → false-positive force-parses that find nothing to rebind to
- Degree cap defaults to 0 (uncapped) — safety mechanism has no production default

**Benchmark gaps (tested → untested):**
- 3-file throwaway graph → 2648-file, 70427-edge live graph
- No extreme fan-in behavior tested (200+ importers)
- No delete-and-recreate scenarios
- False-positive rate on stale-but-not-refactored graphs unknown
- Degree cap partial-cut behavior (cap=5 on 30 → only 5 rebind) untested

**Confidence beyond labeled set: Medium.** Principle is general, but integration gap is large.

---

### 3.3 CODE-GRAPH BITEMPORAL READS (006) — Temporal Database Principle

**What it does:** Adds `valid_at`/`invalid_at` columns to code_edges. `closeEdgesForSources` stamps `invalid_at` on superseded edges (preserves, never deletes). `insertEdgeWithValidity` stamps `valid_at` on new edges. `asOfEdgesFrom` filters by validity window for time-travel queries.

**Benchmark tested:** Single edge close-and-reopen at generation N→N+1. Verification queries pass (as-of past returns old target, current returns new target).

**Where it genuinely helps:**
- Time-travel debugging ("what did the dependency graph look like before this refactor?")
- Audit trails for compliance
- Impact analysis ("which callers were affected by this rename?")

**Where it's a no-op:**
- No historical queries against the graph
- Consumer not wired to reindex path (current production state)

**Where it could hurt:**
- Integration risk: wiring `closeEdgesForSources`/`insertEdgeWithValidity` into reindex edge replacement path is untested — bug could corrupt live graph
- Scale degradation without covering indexes on validity columns (100K+ edges)
- Multi-generation edge lifecycle (close at N, reopen at N+1) untested

**Critical gap: Writer consumer NOT wired.** `closeEdgesForSources` and `insertEdgeWithValidity` are never called in production. The flag graduates with an explicit unmet pre-condition: "the remaining step is to call it from the reindex path, which is a small wiring change behind the same flag."

**Confidence beyond labeled set: Low-Medium.** Proven in isolation, not integrated.

---

### 3.4 ADVISOR RRF FUSION (007) — IR Rank-Fusion Theory

**What it does:** Replaces weighted-sum lane fusion with RRF (Reciprocal Rank Fusion). Each lane contributes `1/(k + rank)` instead of raw score × weight. `graph_causal` lane split into positiveMatches (fed to RRF) and conflictMatches (reserved for post-fusion demotion). Conflict-rerank seam applies raw conflict score as comparator demotion.

**Benchmark tested:** 42 prompts across 5 bands (exact, paraphrase, hard, self_guard, conflict). Top-1: 37/42→38/42 (+1). Precision band: 0.8667→0.9333. Conflict band: 4/5→5/5 with seam. 0.9762 agreement between RRF and weighted-sum.

**Where it genuinely helps:**
- Prompts where one lane's magnitude swamps the correct rank signal (q02 "codex pr review": lexical `pr`/`review` swamped explicit `codex` signal — RRF preserved rank order)
- Score calibration drift immunity: RRF is invariant to lane score magnitude shifts (robustness to future embedder/infra changes)
- Deterministic, auditable routing: rank-based formula is transparent (weighted sum with floating-point lane scores is opaque)
- Conflict seam makes RRF safe on ANY corpus (not just conflict-free)

**Where it's a no-op:**
- Prompts where all lanes agree (37/42, 0.9762)
- Live corpus has zero `conflicts_with` edges → conflict seam inert
- Self-recommendation guard (CUT): 0/4 top-1 movements — structurally redundant

**Where it could hurt:**
- RRF suppresses magnitude outliers that could be true strong signals (correct lexical dominance)
- K-parameter sensitivity untuned: k=8 vs TREC standard k=60 — optimal value unknown for this domain
- Plain RRF WITHOUT conflict seam regresses on conflict-bearing prompts (4/5 vs baseline 5/5)
- Main benchmark table masks this: shows RRF+seam at 5/5, not plain RRF at 4/5

**Benchmark gaps (tested → untested):**
- 42 prompts → production distribution unknown
- 5 synthetic conflict edges → 100+ real edges
- K-parameter (only k=8 tested; TREC standard is k=60)
- Adversarial prompts designed to exploit rank-fusion weaknesses

**Confidence beyond labeled set: Medium-High.** Theory-backed (Cormack et al. 2009), but marginal practical impact (1/42).

---

### 3.5 DEEP-LOOP FINDING DEDUP (008) — Structured Dedup

**What it does:** Content-normalized near-duplicate detection in fan-out merge. Identity key built from `[summary, description, finding, question, direction]` (excludes title). Whitespace-collapsed, case-insensitive comparison. `chooseCanonicalRecord()` picks best id/title. Review findings preserve strongest severity (P0 over P1).

**Benchmark tested:** 17 synthetic source records, 3 workers, 5 true clusters. Precision 1.0, distinct-finding recall 1.0, 7 noise records removed.

**Where it genuinely helps:**
- Fan-out convergence acceleration (inflated distinct-count delays convergence → dedup makes signal accurate)
- Review severity preservation (P0 survives P1 restatements — safety-critical for review workflows)

**Where it's a no-op:**
- Single-worker runs (no cross-worker collisions)
- Completely disjoint findings across workers

**Where it could hurt:**
- Semantically distinct findings with matching content keys (false collapse — risk low on structured findings, higher on free-text)
- False collapse on review findings with different severity but matching content keys in key fields
- Same-id/different-content conflict markers (`_conflicts`) — code path exists but never triggered by synthetic set

**Benchmark gaps (tested → untested):**
- 17 hand-crafted records → production fan-outs with 50+ findings, 5+ workers
- False-collapse rate on real, variably-written production findings (precision 1.0 on 17 ≠ 1.0 at scale)
- Cross-session dedup (findings from different runs)
- Same-id/different-content conflict markers completely untested
- Content key distinguishable on structured spec-folder findings; free-text generalizability unknown

**Confidence beyond labeled set: Low-Medium.** Precision 1.0 on 17 synthetic records does not guarantee scale behavior.

---

### 3.6 DEEP-LOOP GAUGES (008) — Operational Observability

**What they do:**
- **Lag ceiling:** Tracks oldest pending lineage lag. Fires `lag_ceiling_exceeded` warning once when exceeded. Default 0 (disabled).
- **Progress heartbeat:** Per-lineage `setInterval` writing `progress` events to status ledger. `unref()`d. Default 0 cadence (disabled).

**Benchmark tested:** Lag ceiling at 60ms fires once on 62ms lag. Heartbeat at 0.05s: 43 records over 2s.

**Where they genuinely help:**
- Lag ceiling detects stalled lineages in heterogeneous fan-outs (one worker takes 10s, others complete) — enables timeout tuning
- Heartbeat provides intermediate progress visibility for long-running fan-outs (bridges "started" → "finished")

**Where they could hurt:**
- Lag ceiling false positives on transient I/O noise (hard ceiling, no jitter tolerance)
- Heartbeat volume at low cadences: 0.05s = 43 records/2s. 10 concurrent pools = 430 records/2s. Production cadence is undefined.
- Heartbeat `unref()` correctness claimed but untested on early process exit mid-tick

**Benchmark gaps (tested → untested):**
- Single pool → concurrent multi-pool scaling
- 2-second run → hour-long production fan-outs
- 50ms heartbeat cadence → undefined production default
- Lag ceiling noise resistance (only tested with clean synthetic sleep)

**Confidence beyond labeled set: Medium.** Principles sound, but production defaults undefined.

---

### 3.7 TRUE-CITATION LEDGER (003, REFINE) — Citation Mining

**What it does:** Mines the assistant transcript for memory IDs actually referenced after a search. Anchor-based detector matches memory titles against assistant response for echo detection. Bare-ID fallback for numeric IDs. Emit separates used vs not-used references.

**Benchmark tested:** 13417 real assistant turns. Anchor detection: 48/304 shown IDs detected (15.79% reference coverage) vs bare-id 22/304 (7.24%). 9 prose-count false positives suppressed. 7 emits on scratch copy (4 used, 3 not-used).

**Where it genuinely helps:**
- Negative-citation labels for retrieval evaluation (missing infrastructure for precision metrics)
- Demote-only reranker signal (Beta-posterior penalty on consistently shown-but-never-cited results)
- Content-attribution path for positive label improvement

**Why it's REFINE, not GRADUATE:**
Code is sound, signal is trustworthy when triggered, but live density is zero. 1711 search_shown rows, all null-session, all predating the firing-trigger fix. The `effectiveSessionId` propagation fix needs session-carrying traffic to accumulate before the ledger becomes usable.

**Where it could hurt:**
- Anchor regex false-positives on prose matching NNN-slug pattern in non-spec domains
- Demote-only reranker using unreliable negatives (84% of shown memories undetected — some are false negatives)
- Emit pipeline concurrency at production scale (SQLite write contention, no batching)

**Confidence beyond labeled set: Low.** Gated on data accumulation, not code correctness.

---

## 4. Cross-Cutting Patterns

### Pattern 1: Conditional Graduations Dressed as Unqualified Verdicts

Multiple flags graduate with caveats the verdict body acknowledges but the status label doesn't surface:

| Flag | Status | Unmet Condition |
|------|--------|-----------------|
| Bitemporal reads | GRADUATE | Writer not wired to reindex path |
| Staleness degree cap | GRADUATE | Defaults to 0 (uncapped), "sensible ceiling" undefined |
| Heartbeat | GRADUATE | Production cadence undefined |
| Citation ledger | REFINE | Zero live density |
| Multihop | GRADUATE (deep-K) | K=12 recall only 0.625; "deep-K" conditional on unmeasured reader behavior |

### Pattern 2: Synthetic/Read-Only Benchmarks, Mutating Production

All five clusters' benchmarks ran against:
- Read-only corpus backups (multihop)
- Throwaway workspace graphs (staleness, bitemporal)
- In-memory projection copies with synthetic overlays (RRF conflict seam)
- Hand-crafted 17-record labeled sets (dedup)
- Scratch copy emits, not live writes (citation ledger)

No benchmark exercised live, mutating production state. The leap from synthetic/read-only conditions to production behavior is the single largest unmeasured variable.

### Pattern 3: Guard Redundancy When Cutting Safety Mechanisms

The self-recommendation guard (CUT) was redundant because `auditRecsAdvisorPenalty` already fires. But that existing penalty has no flag, no benchmark, and no documented contract. Cutting the explicit guard leaves the implicit penalty as the sole safety mechanism — if the penalty is ever removed, the advisor may self-recommend on audit prompts with zero protection.

### Pattern 4: Metric Headlines Masking Sub-Optimal Reality

| Headline | Reality |
|----------|---------|
| Multihop completeRecall@20 = 0.9375 | K=12 = 0.625. The K=20 number is the outlier. |
| RRF top-1 +1, zero regressions | Plain RRF (without seam) regresses 4/5 vs baseline 5/5 on conflict band |
| Dedup precision 1.0, recall 1.0 | On 17 hand-crafted records. Scale behavior unmeasured. |
| Heartbeat "cannot flood" | Tested single pool at 50ms. Concurrent 10-pool run = 430 records/2s. |

---

## 5. Scenario Classes the Benchmark Missed

### Per-Cluster Summary

| Cluster | Tested Scenario Class | Missed Scenario Class | Severity |
|---------|----------------------|----------------------|----------|
| 001 Multihop | 8 labeled queries with hub docs containing slugs | Slug-availability distribution across all production queries; non-spec corpus; ambiguity rate | **High** |
| 006 Staleness | 3-file throwaway workspace (rename, type-flip, move) | 2648-file live graph; extreme fan-in (200+); delete-recreate cycles; partial cap behavior | **High** |
| 006 Bitemporal | Single edge, 2 generations | Multi-generation lifecycle; 100K+ edge scale; wired to production reindex | **Critical** |
| 007 RRF | 42 prompts, 5 synthetic conflict edges, k=8 | Production prompt distribution; 100+ real conflict edges; k-parameter sensitivity; adversarial prompts | **High** |
| 008 Dedup | 17 synthetic records, 3 workers, 5 clusters | 50+ real production findings, 5+ workers; cross-session dedup; free-text findings | **High** |
| 008 Gauges | 2s run, 40ms synthetic workers, single pool | Hour-long production runs; concurrent pools; noise-resistant thresholds | **High** |
| 003 Citation | 13417 turns, 0 session-scoped, scratch emit | Live session-carrying traffic; emit concurrency at scale; reranker minimum density threshold | **Critical** |

---

## 6. Retrieval/Graph/Routing Theory Applied

### RRF vs Weighted-Sum (007)
Cormack et al. (2009, SIGIR) proved RRF superior for combining heterogeneous rankings whose score distributions are incomparable. But advisor lanes are already calibrated to comparable score ranges (CombSUM conditions), so RRF's theoretical advantage is narrower than in the TREC setting. The benchmark confirms: 37/42 agreement (0.9762). The graduation is justified not by accuracy lift but by robustness properties (calibration drift immunity, deterministic audit trail, conflict seam regression prevention).

### Slug-Based Cross-Reference Resolution (001)
The multihop mechanism is a domain-specific heuristic, not a general retrieval technique. It exploits the spec-folder ecosystem's structural property (docs reference sibling folders by slug). This property does NOT generalize to: (a) documents referencing by title/URL, (b) corpora without structured naming, (c) implicit cross-references. The graduation is valid for the spec-kit corpus but should not be mistaken for a general retrieval improvement.

### Incremental Index Consistency (006)
The force-reparse repair is a fundamental correctness guarantee for incremental indices under identity-changing refactors. Without it, the graph drifts with every untracked symbol change. The degree cap trades consistency for performance — a tunable tradeoff, not a correctness/incorrectness binary. The principle is sound; the production behavior (at scale, with real graph topology) is the gap.

### Structured-Field Dedup (008)
Content-normalized identity keys work when findings follow a structured format. The dedup is NOT semantic — it doesn't understand meaning. It would fail on free-text findings where "same finding, different wording" vs "different finding, similar wording" requires semantic understanding. Current precision 1.0 reflects the synthetic set's structure, not robustness to text variation.

### Negative Citation Mining (003)
The citation ledger provides the missing negative-citation label for precision evaluation — fundamental IR infrastructure. The anchor-based detection (title echo) is a domain-aware improvement over bare-ID matching but still misses 84% of shown memories. Content-attribution (matching assistant text to memory content) would lift this, but the ledger's value is entirely gated on sufficient session-carrying traffic to accumulate density.

---

## 7. Convergence Report

| Metric | Value |
|--------|-------|
| Stop reason | Maximally answered at 4 iterations (convergence mathematically CONTINUE, questions exhausted) |
| Total iterations | 4 |
| Questions answered | 6/6 (1.0) |
| Average newInfoRatio | 0.8375 (0.95 → 0.90 → 0.85 → 0.65) |
| Sources triangulated | 9 implementation files, 7 benchmark/context files, retrieval theory (Cormack et al.) |
| Quality gates | Source diversity ✓, Focus alignment ✓, No single weak source ✓ |

---

## 8. Recommendations

1. **Re-classify bitemporal reads as REFINE, not GRADUATE.** The consumer wiring is a pre-condition the benchmark acknowledges but the verdict doesn't reflect. Graduation should wait until `closeEdgesForSources`/`insertEdgeWithValidity` are wired and a live reindex integration test passes.

2. **Add production-reader-distribution measurements to the multihop benchmark.** The entire multihop win depends on deep-K consumer behavior. Without knowing what fraction of production readers consume past rank 10, the "GRADUATE (deep-K)" verdict is conditional on an unmeasured variable.

3. **Set production defaults for all undefined tunables before graduation.** The degree cap (0 = uncapped), heartbeat cadence (0 = disabled), and lag ceiling (0 = disabled) have no production defaults. Graduating with zero defaults means the safety mechanism or observability tool is effectively off in production.

4. **Add synthetic-to-production scale tests for dedup.** The precision 1.0 on 17 records needs validation on 50+ real production fan-out findings before the GRADUATE verdict carries production confidence.

5. **Track RRF benefit on the production prompt distribution, not just 42 labeled prompts.** The 37/42 agreement (0.9762) may shift when measured against the actual distribution of production advisor calls. A wider, unlabeled snapshot would provide better coverage evidence.

6. **Document the implicit penalty that replaces the cut guard.** The `auditRecsAdvisorPenalty` that prevents advisor self-recommendation has no flag, no benchmark, and no documented contract. Cutting the explicit guard (CUT) is safe only because this implicit penalty exists — document it so future refactors don't accidentally remove the sole defense.

---

## References

- Cormack, G. V., Clarke, C. L., & Buettcher, S. (2009). "Reciprocal rank fusion outperforms Condorcet and individual rank learning methods." SIGIR 2009.
- `007-dark-flag-graduation/spec.md` — Dark Flag Graduation Suite specification
- `001-multihop-tail-appends/benchmark-results.md` — Multihop benchmark evidence (8 queries, per-query details)
- `003-true-citation-ledger/benchmark-results.md` — Citation ledger feasibility benchmark (13417 turns)
- `006-codegraph-edge-lifecycle/benchmark-results.md` — Staleness + bitemporal benchmark (3 scenarios)
- `007-advisor-rrf-fusion/benchmark-results.md` — RRF fusion benchmark (42 prompts, 5 bands)
- `008-deeploop-finding-dedup/benchmark-results.md` — Dedup + gauges benchmark (17 records)
- `feature-flags.md` — Feature flag registry and kept-switch summary
- `before-vs-after.md` — Flag resolution inference and truncation-law resolution
- `benchmark-and-test-status.md` — Suite-level verdict summary
- Implementation: `orchestrator.ts:207-270`, `deterministic-multihop.ts:195-292`, `lane-champion-backfill.ts:100-162`, `fusion.ts:304-331,648,773-774`, `structural-indexer.ts:2258-2366`, `code-graph-db.ts:1888-1960`, `fanout-merge.cjs:280-421`, `fanout-pool.cjs:320-384`, `fanout-run.cjs:293-315,666-671`
