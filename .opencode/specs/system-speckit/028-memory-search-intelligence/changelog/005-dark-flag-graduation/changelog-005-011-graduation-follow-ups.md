---
title: "Changelog: Dark Flag Graduation Follow-Ups [005-dark-flag-graduation/007-graduation-follow-ups]"
description: "Chronological changelog for the dark flag graduation follow-up phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/007-graduation-follow-ups` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation`

### Summary

This phase parent rolled up the four production-readiness follow-ups that the 009 pre-graduation validation required before any dark flag could be flipped on evidence. The code-graph child wired the bitemporal close-and-insert writer through the full reindex path and set the degree-cap default to 15 from a benchmark sweep. The deep-loop child redefined the lag metric to a true stall detector and added a title-overlap gate to the near-duplicate dedup so distinct same-body findings with disjoint titles no longer collapse. The search child added an append-exempt tier to the serializer trim so tail-appended rows survive the token-budget cut and wired a density probe into the true-citation ledger. The advisor child documented the implicit self-recommendation penalty with a durable WHY comment, corrected the alias gap in the guard-off branch, and locked both with a regression test. Each change stays behind its existing default-off flag, with the lone deliberate exception of the deep-loop gauge defaults whose committed source values remain 0 while their recommended production values are documented and proven.

### Added

- **Code-graph (001):** Degree-sweep benchmark script `benchmark/degree-cap-sweep.mjs` and results file `benchmark/degree-cap-sweep-results.json` that establish the cap-15 evidence base.
- **Code-graph (001):** `asOf` generation parameter on `code_graph_query` routed through new `asOfEdgesTo` inbound reader, exposing preserved bitemporal history for the first time.
- **Code-graph (001):** Four new vitest files covering the bitemporal reindex round-trip, live-reader filter and close-not-delete, ensure-ready generation bump, lineage validity and the `asOf` query contract, plus off-path byte-identity tests.
- **Deep-loop (002):** Gauge flood-test harness `scripts/gauge-flood-test.mjs` with results at `results/gauge-flood-metrics.json`, proving the 009 flood reproduces at 440 records/2s and that a 30s cadence informs at an observed 955 records/h within the 1500/h budget.
- **Deep-loop (002):** Dedup scale-test harness `scripts/dedup-scale-test.mjs` with results at `results/dedup-scale-metrics.json` over 75 findings across 6 workers, proving title-only false-collapse drops from 0.50 to 0 after the fix.
- **Search (003):** `append-exempt-serializer.vitest.ts` covering append marking, tiered trim selection and the primary-row reservation contract (P1-6) and the constitutional-pin protection (P2-14).
- **Advisor (004):** Regression test `tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts` that fires the penalty for both the canonical id and the `skill-advisor` alias in the production-default guard-off state and breaks when the penalty is zeroed or the guard-off check is reverted to exact-id-only.

### Changed

- **Code-graph (001):** `DEFAULT_REVERSE_DEP_DEGREE_CAP` in `structural-indexer.ts` set to 15, with a comment recording the benchmark sweep rationale and the hot-hub cost trade.
- **Code-graph (001):** `replaceNodes`, `replaceEdges` and `pruneDanglingEdges` in `code-graph-db.ts` changed to close-not-delete under the bitemporal flag. Live readers now filter `invalid_at IS NULL`. Loop-time writers stamp at the next generation. Ensure-ready bumps the generation after its persist loop. Lineage edges carry a `valid_at`.
- **Code-graph (001):** `query.ts` handler accepts an optional `asOf` parameter routing through `asOfEdgesFrom` and `asOfEdgesTo`. `tool-schemas.ts` documents it.
- **Deep-loop (002):** Lag metric in `fanout-pool.cjs` redefined from time-since-pool-start (queue backpressure) to time-since-last-completion (true stall). The committed pool test migrated from backpressure semantics to stall semantics with two new silent-direction cases added.
- **Deep-loop (002):** `nearDuplicateContentKey` comparison in `fanout-merge.cjs` made title-aware with a Jaccard stopword-stripped title-overlap gate at threshold 0.15. `getFindingBucket` made title-aware so a distinct same-body finding opens its own bucket.
- **Search (003):** `search-results.ts` formatter marks each tail-appended row with `appendExempt: true` derived from existing `source`/`sources` markers. `context-server.ts` serializer trim replaced with `selectBudgetTrimIndex` that drops ordinary rows first then backfill rows then constitutional pins last.
- **Search (003):** `true-citation-emitter.ts` extended with `probeTrueCitationDensity` reporting usable session-scoped pair counts and per-class and minority-ratio threshold gates. `memory-crud-health.ts` surfaces the probe when the emitter flag is on.
- **Advisor (004):** `fusion.ts` guard-off branch replaced the exact-string `system-skill-advisor` check with `isAdvisorSelfRecommendationSkill` so the `skill-advisor` alias is demoted consistently with the canonical id.
- **Advisor (004):** `provenance-self-boost-guard.vitest.ts` reconciled to assert the alias is demoted in the guard-off default state.

### Fixed

- **Code-graph (001):** `ensure-ready.ts` never bumped the generation after its persist loop, so two consecutive ensure-ready reindexes wrote at the same generation and collapsed a superseded edge to a zero-width window. (Bitemporal flag-gated.)
- **Code-graph (001):** `recordSupersedesLineage` wrote NULL `valid_at`, silently excluding lineage edges from every as-of read. (Bitemporal flag-gated.)
- **Deep-loop (002):** Lag metric false-fired on every healthy width-greater-than-concurrency pool because queue backpressure grows on any healthy pool wider than its concurrency. The true stall metric is now silent on healthy pools and fires only on a genuine hung slot. (Deep-loop gauge flag-gated.)
- **Deep-loop (002):** `nearDuplicateContentKey` excluded the title, collapsing genuinely-distinct findings that share an identical body but carry disjoint titles. Title-only false-collapse rate was 0.50 on the scale-test fixture, drops to 0 after the fix. (Dedup flag-gated.)
- **Search (003):** Tail-appended rows survived the Stage-4 per-request cap only to be dropped by the response-serialization token-budget trim, which pops from the tail where appends live. The tiered trim now drops ordinary rows first. (Append flags-gated.)
- **Search (003):** True-citation density gate passed a 199:1 class split because it checked count alone with no per-class floor or minority-ratio floor. A lopsided ledger can now not graduate.
- **Advisor (004):** `skill-advisor` alias self-recommended to the top on audit prompts in the production-default guard-off state because the guard-off branch matched only the exact string `system-skill-advisor`. The canonical helper now covers both ids in both guard states.

### Verification

- **Code-graph (001) tsc** - PASS, exit 0
- **Code-graph (001) bitemporal and degree-cap files (4 files)** - PASS, 19 of 19
- **Code-graph (001) code-graph files exercising changed code (9 files)** - PASS, 90 of 90
- **Code-graph (001) full suite excluding daemon-contention and drift guard** - PASS, 712 of 712 (1 skipped)
- **Deep-loop (002) gauge flood-test** - PASS, exit 0. Flood reproduced at 440 records/2s. 30s cadence observed at 955 records/h. Old lag false-positive silent on healthy pool. Stall fires once on genuine 5s stall.
- **Deep-loop (002) dedup scale-test** - PASS, exit 0. Title-only false-collapse 0 (was 0.50). Body-distinguished false-collapse 0. Distinct recall 1.0. Identical-dup 7/7. Review severity 4/4.
- **Deep-loop (002) full deep-loop suite** - PASS, 49 files, 428 tests
- **Search (003) tsc with --ignoreDeprecations 6.0** - PASS, exit 0, zero source errors (pre-existing tsconfig TS5101 only)
- **Search (003) vitest pass** - PENDING, deferred to cli executor per task instruction
- **Advisor (004) tsc on build target** - PASS, exit 0
- **Advisor (004) new regression test** - PASS, 5 tests
- **Advisor (004) full scorer suite** - PASS, 119 tests across 16 files
- **Advisor (004) penalty zeroed** - CONFIRMED FAIL, 3 of 5 regression tests break
- **Advisor (004) guard-off check reverted to exact-id-only** - CONFIRMED FAIL, alias test breaks while canonical-id tests pass

### Files Changed

- `system-code-graph/mcp_server/lib/structural-indexer.ts` (modified, 001 degree-cap default)
- `system-code-graph/mcp_server/lib/code-graph-db.ts` (modified, 001 bitemporal close-not-delete, live-reader filter, generation stamping, lineage valid_at, asOfEdgesTo)
- `system-code-graph/mcp_server/lib/ensure-ready.ts` (modified, 001 generation bump after persist loop)
- `system-code-graph/mcp_server/handlers/query.ts` (modified, 001 asOf parameter routing)
- `system-code-graph/mcp_server/tool-schemas.ts` (modified, 001 asOf documentation)
- `system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts` (created, 001)
- `system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts` (created, 001)
- `system-code-graph/mcp_server/tests/code-edge-bitemporal-followups.vitest.ts` (created, 001)
- `system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts` (created, 001)
- `system-code-graph/benchmark/degree-cap-sweep.mjs` (created, 001)
- `deep-loop-runtime/scripts/fanout-pool.cjs` (modified, 002 lag metric redefinition)
- `deep-loop-runtime/scripts/fanout-merge.cjs` (modified, 002 title-aware dedup match and bucketing)
- `deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` (modified, 002 stall semantics and two new cases)
- `002-deeploop-gauges-dedup-scale/scripts/gauge-flood-test.mjs` (created, 002)
- `002-deeploop-gauges-dedup-scale/scripts/dedup-scale-test.mjs` (created, 002)
- `002-deeploop-gauges-dedup-scale/results/gauge-flood-metrics.json` (created, 002)
- `002-deeploop-gauges-dedup-scale/results/dedup-scale-metrics.json` (created, 002)
- `system-spec-kit/mcp_server/formatters/search-results.ts` (modified, 003 appendExempt marking)
- `system-spec-kit/mcp_server/context-server.ts` (modified, 003 selectBudgetTrimIndex tiered trim)
- `system-spec-kit/mcp_server/lib/feedback/true-citation-emitter.ts` (modified, 003 density probe)
- `system-spec-kit/mcp_server/handlers/memory-crud-health.ts` (modified, 003 probe surface)
- `system-spec-kit/mcp_server/tests/append-exempt-serializer.vitest.ts` (created, 003)
- `system-spec-kit/mcp_server/tests/true-citation-emitter.vitest.ts` (modified, 003 density-probe tests)
- `system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` (modified, 004 WHY comment)
- `system-skill-advisor/mcp_server/lib/scorer/fusion.ts` (modified, 004 alias coverage via canonical helper)
- `system-skill-advisor/mcp_server/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts` (created, 004)
- `system-skill-advisor/mcp_server/tests/scorer/provenance-self-boost-guard.vitest.ts` (modified, 004 reconciled alias test)

### Follow-Ups

- **Search (003):** The vitest pass for the two new suites is pending the cli executor run. Code and tests are authored and tsc-clean.
- **Code-graph (001):** As-of reads are exposed only on `code_graph_query` relationship operations. The `code_graph_context` multi-hop traversal stays live-only. Wiring as-of through its many read sites is deferred by choice.
- **Code-graph (001):** The bitemporal validity columns have no covering indexes. A large-scale as-of read could degrade. Deferred and default-off.
- **Deep-loop (002):** The committed gauge defaults remain 0. Flipping them to the recommended production values (heartbeat 30s, lag-ceiling 120000ms) requires a separate graduation step that also migrates `executor-config.vitest.ts` lines 232-233 and the `fanout-run.cjs` silent-when-off test.
- **Advisor (004):** The full advisor cli test pass runs after this phase before a parent-level completion claim.
