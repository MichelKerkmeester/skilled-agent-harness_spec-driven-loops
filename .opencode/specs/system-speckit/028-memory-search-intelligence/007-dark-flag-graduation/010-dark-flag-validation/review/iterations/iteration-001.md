# Iteration 001: Cross-Cluster Correctness + Security + Byte-Identity

**Date:** 2026-06-24
**Dimension:** correctness, security, spec-alignment, completeness
**Coverage:** All five graduate-ready clusters (001 multihop tail-appends, 002 code-graph staleness+bitemporal, 003 advisor RRF+conflict-rerank, 004 deep-loop dedup+gauges, 005 true-citation ledger)

## Review Scope

Full source-code audit of all five clusters recommended for graduation by 007-dark-flag-graduation. Focused on:
1. Byte-identity verification (flag-off produces identical output, no side channels)
2. Edge cases the labeled benchmarks did not cover
3. Error handling and fallback paths
4. Spec-alignment with benchmark findings

## Finding Summary

### Cluster 001: Multihop Tail-Appends — PASS
- Flag-off byte-identity: **CONFIRMED** (`orchestrator.ts:207-209`, `deterministic-multihop.ts:204-206`, `lane-champion-backfill.ts:106-111`)
- Append-after-Stage-4-cap rewired correctly at `orchestrator.ts:195-204`
- Error handling: tail-append failure is non-critical, Stage-4 output returned on catch (`orchestrator.ts:262-269`)
- Slug resolution correctly rejects ambiguous matches (`deterministic-multihop.ts:149`)
- Tail scoring ensures no baseline eviction (`deterministic-multihop.ts:246-266`)
- Tests: 10/10 pass (additive-tail-recall.vitest.ts)

### Cluster 002: Code-Graph Staleness + Bitemporal — PASS
- Flag-off byte-identity: **CONFIRMED** (`structural-indexer.ts:2258`, `code-graph-db.ts:293-295`)
- Degree-capped force-parse: Default 0 = uncapped (byte-identical to pre-cap), positive cap correctly bounds blast radius (`structural-indexer.ts:2303-2308`)
- Symbol identity change detection correct: compares set size then membership (`structural-indexer.ts:2181-2198`)
- Bitemporal migration is transaction-safe (`code-graph-db.ts:780-791`)
- Rollback handles missing columns gracefully (`code-graph-db.ts:735-751, 794-804`)
- HEAD drift scope classification handles git-unavailable gracefully (`ensure-ready.ts:97-108, 150-176`)
- Tests: 11/11 pass (2 suites)

### Cluster 003: Advisor RRF + Conflict-Rerank — PASS
- Flag-off byte-identity: **CONFIRMED** — weighted-sum path used when RRF off (`fusion.ts:648, 706`)
- RRF fusion: 5 lanes, k=8, degraded/disabled lanes get zero weight (`fusion.ts:304-331`)
- Conflict-rerank: `buildConflictMatchIndex` uses Math.min for conflict scores, demoted in sort (`fusion.ts:284-295, 773-774`)
- Self-recommendation guard: cleanly factorized, behaviorally redundant with un-flagged explainer floor (`fusion.ts:386-399`)
- Low-information ambiguity abstention: correct (`fusion.ts:815-844`)
- Breadth/multi-concern abstention: correct gating (`fusion.ts:854-875`)
- Tests: 13/13 pass (3 suites)

### Cluster 004: Deep-Loop Finding Dedup + Gauges — PASS
- Flag-off byte-identity: **CONFIRMED** — exact id-only bucketing when dedup off (`fanout-merge.cjs:281-283`)
- Near-duplicate dedup: content-based keys strip severity/status (`fanout-merge.cjs:167-176`)
- Strongest-severity canonical record selection for review (`fanout-merge.cjs:238-244`)
- Strongest-restriction verdict: any active P0 → FAIL (`fanout-merge.cjs:542-548`)
- Atomic writes for torn-write protection (`fanout-merge.cjs:664-668`)
- Tests: 27/27 pass

### Cluster 005: True-Citation Ledger — PASS (REFINE: data-gated)
- Flag-off byte-identity: **CONFIRMED** — all entry points return empty (`true-citation-emitter.ts:319-320, 465-466`)
- Anchor-based detection: 3+ distinctive words required, ALL must match as standalone tokens (`true-citation-emitter.ts:184-191, 201-210`)
- Id-only fallback with word-boundary matching preserves original behavior (`true-citation-emitter.ts:154-161`)
- INSERT OR IGNORE makes re-runs idempotent (`true-citation-emitter.ts:333-334`)
- SessionId threaded from shown-set reconstruction (`true-citation-emitter.ts:439`)
- Tests: 8/8 pass

## New Findings

| Severity | ID | Finding |
|----------|----|---------|
| P1 | P1-001 | Response-serialization token-budget truncation may strip tail-appended rows at the MCP boundary, a truncation point the labeled benchmarks did not measure. |
| P2 | P2-001 | `resolveSlugToFolder` LIMIT 2 handles 2-ambiguous correctly but a 3+ match coincidence is theoretically possible. |
| P2 | P2-002 | As-of-read bitemporal queries not in review scope (query-layer code lives in downstream handlers). |
| P2 | P2-003 | 1711 historical null-session shown rows will never yield citations. |

## Test Baseline

**69/69 tests pass across all 12 test suites.** No regressions.

Review verdict: PASS
