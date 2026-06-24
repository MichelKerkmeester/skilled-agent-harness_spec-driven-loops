# Iteration 003: Theory Triangulation — Scenario Coverage, Help/Hurt/No-Op Maps

## Focus
For each GRADUATE cluster (and the REFINE true-citation ledger), map tested vs untested scenario classes, predict where each genuinely helps, hurts, or is a no-op beyond the 007 benchmark, using retrieval/graph/routing theory.

## Key Findings

### 1. MULTIHOP TAIL-APPENDS (001) — Domain-Specific Heuristic

**Tested:** 8 queries with hub docs containing folder-slugs in top-5, one corpus snapshot, K=20.
**Untested critical gaps:**
- Slug availability across all production queries (what fraction of top-5 docs contain resolvable slugs?)
- Ambiguity rate (3-digit prefix collisions across packet families → skipped)
- Already-in-baseline rate (when completeRecall is already 1.0 off → appends do nothing)
- Non-spec corpus (mechanism is coupled to NNN-slug convention — fails on general documents)

**No-op zones:** Shallow-K readers (K≤8), zero-slug queries, ambiguous slug resolution, cold/empty memory_index, already-perfect recall queries.

**Hurt zones:** Latency tax even when zero appends (slug extraction + SQL lookups run per query); lane champion redundancy with RRF (007); corpus coupling fragility (meaningless on non-spec documents).

**Genuine help beyond benchmark:** Any multi-target query with cross-referencing hub docs (structural property of spec ecosystem, not query-specific); deep-K consumers reading past rank 10.

**Confidence beyond labeled set: Low-Medium** — domain-specific heuristic, not general retrieval technique.

### 2. CODE-GRAPH STALENESS REPAIR (006) — Graph Consistency Principle

**Tested:** 3 synthetic scenarios (rename, type-flip, move), 30-importer dependency, 2-file workspace.
**Untested critical gaps:**
- Graphs with 200+ importers (cap behavior at extreme fan-in)
- Delete-and-recreate cycles (symbol removed, new file at same path)
- False-positive rate on stale-but-not-refactored graphs
- Performance at production scale (2648 files, 70427 edges)

**No-op zones:** Zero symbol-identity changes; degree cap ≥ all importer fan-ins.

**Hurt zones:** Aggressive degree cap → missed rebinds on cut importers; delete-and-recreate creates orphan edges with false-positive force-parses; cap is a correctness/performance tradeoff with no safety net.

**Genuine help beyond benchmark:** Any identity-changing refactor (function→const, class split, symbol rename, module move) — correctness improvement, not performance optimization. Tunable cap adapts to real graph topology.

**Confidence beyond labeled set: Medium** — graph consistency principle is general, but integration (3-file synthetic vs 70427-edge live graph) is narrow.

### 3. CODEGRAPH BITEMPORAL READS (006) — Temporal Database Principle

**Tested:** Single edge close-and-reopen at gen N→N+1, verification queries pass.
**Untested critical gaps:**
- Multiple generations (asOf at gen N when edge was closed and reopened at N+1)
- Scale: 100K+ edges with validity columns
- Consumer NOT YET wired to re-index edge replacement path
- No covering indexes on validity columns measured

**No-op zones:** No historical queries; no consumer wiring.

**Hurt zones:** Scale degradation without indexes; integration risk (wiring bug could corrupt live graph); query correctness for never-closed edges (invalid_at=NULL) is tested in filter clause but not in multi-edge traversal.

**Genuine help beyond benchmark:** Time-travel debugging ("what did the graph look like before this refactor?"); audit trails for compliance; impact analysis ("which callers were affected by this rename?").

**Confidence beyond labeled set: Low-Medium** — principle proven, integration missing (proven in isolation, not production).

### 4. ADVISOR RRF FUSION (007) — IR Rank-Fusion Theory

**Tested:** 42 prompts across 5 bands, 5 synthetic conflict edges, k=8.
**Untested critical gaps:**
- Prompts with extreme lane weight skew
- K-parameter sensitivity (only k=8 tested; TREC standard is k=60)
- 100+ real conflict edges (only 5 synthetic tested)
- Adversarial prompts designed to exploit rank-fusion weaknesses

**No-op zones:** Prompts where all lanes agree (37/42, 0.9762); live corpus has zero conflict edges → seam inert.

**Hurt zones:** RRF suppresses magnitude outliers — can be false positives (good) OR true strong lexical signals (bad); suboptimal k could regress results; weighted-sum may be better for prompts where lexical dominance is correct.

**Genuine help beyond benchmark:** Score calibration drift immunity (RRF is invariant to score magnitude shifts); deterministic, auditable routing; conflict seam makes RRF safe on ANY corpus (not just conflict-free).

**Confidence beyond labeled set: Medium-High** — theory-backed (Cormack et al. 2009), domain-appropriate, but only 1 of 42 prompts differed.

### 5. DEEP-LOOP FINDING DEDUP (008) — Structured Dedup

**Tested:** 17 synthetic records, 3 workers, 5 true clusters, 7 noise records removed.
**Untested critical gaps:**
- Real fan-out runs with 50+ findings across 5+ workers
- Semantically distinct findings with matching content keys (false-collapse risk)
- Cross-session dedup (findings across runs)
- Same-id/different-content conflict markers (code path exists, never triggered)

**No-op zones:** Single-worker runs; completely disjoint findings.

**Hurt zones:** Near-duplicates collapsed despite semantic difference (whitespace/case normalization loses signal); false collapse on review findings with different severity but matching content keys.

**Genuine help beyond benchmark:** Convergence acceleration (inflated distinct-count delayed convergence); review severity preservation (P0 survives P1 restatements); operational visibility (lag ceiling detects stalled lineages, heartbeat provides intermediate progress).

**Confidence beyond labeled set: Low-Medium** — precision 1.0 on 17 synthetic records does not guarantee same on 50+ real findings.

### 6. TRUE-CITATION LEDGER (003, REFINE) — Citation Mining

**Tested:** Anchor-based detection on 13417 assistant turns (coverage 0.1579), emit pipe on scratch copy.
**Critical blocker:** Zero live density — 1711 search_shown rows are all null-session. Value entirely gated on traffic accumulation.

**Hurt zones:** Anchor regex false-positives on prose matching NNN-slug pattern; emit pipeline concurrency at scale; demote-only reranker using unreliable negatives (84% of shown memories undetected).

**Confidence beyond labeled set: Low** — gated on data accumulation, not code gap.

## Convergence Sources

**Retrieval theory applied:**
- RRF (007): Cormack et al. 2009 — RRF superior for heterogeneous rankings, but advisor lanes are already calibrated (CombSUM), so benefit is marginal (confirmed by 37/42 agreement).
- Multihop (001): Domain-specific heuristic exploiting spec-folder naming convention — NOT a general retrieval technique.
- Staleness repair (006): Incremental index consistency under identity-changing refactors — fundamental correctness guarantee.
- Dedup (008): Structured-field comparison works for formatted findings but wouldn't generalize to free-text without semantic dedup.
- Citation ledger (003): Negative-citation labels for precision evaluation — fundamental infrastructure, gated on data.

### Sources
[SOURCE: Cormack et al., "Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods," SIGIR 2009]
[SOURCE: 001 benchmark-results.md:36-41, 49, 61, 69]
[SOURCE: 003 benchmark-results.md:16, 27, 40-41, 49, 74-75, 101]
[SOURCE: 006 benchmark-results.md:46, 48-54, 71-84]
[SOURCE: 007 benchmark-results.md:29, 38, 52-64, 87, 101-102]
[SOURCE: 008 benchmark-results.md:38, 67-68, 72-78]
[SOURCE: feature-flags.md:77-79]

## Novelty
- newInfoRatio: 0.85 — Comprehensive scenario-class coverage matrices for all 6 clusters, no-op/hurt/help zone predictions triangulated across implementation, benchmark evidence, and retrieval/graph theory. Identified critical gaps: multihop is domain-specific heuristic (not general retrieval), staleness repair is theory-backed but synthetic-tested, bitemporal is proven in isolation but unintegrated, RRF benefit is marginal (37/42 agreement), dedup precision on 17 synthetic records doesn't guarantee scale behavior, and citation ledger is gated on data accumulation.

## Next Focus
Read the specific benchmark query sets for clusters where the gap between test conditions and real-world conditions is highest (multihop query distribution, dedup cluster composition, advisor prompt band breakdown). Also verify code-level behavior for the highest-severity gap: multihop slug availability distribution.
