---
iteration: 037
rq: RQ-N8
phase_target: all-phases
newInfoRatio: 0.0
verdict: ADAPT
---

# Iteration 037 — RQ-N8: Cross-Cutting Dependency Analysis for Active 027 Memory Phases

## Research Question

Classify active 027 memory phases 002-008 into: phases that can proceed independently now, phases blocked on other 027 phases, and phases soft-blocked on 028 evidence or telemetry; then produce a revised dependency graph and identify order optimisations. The active phase set is the root spec's phase table: 002 has no dependency, 003 has no dependency, 004 depends on 003, 005 depends on 004, 006 depends on 003 and 005, 007 has no internal 027 dependency, and 008 depends on 002 (`spec.md:53-62`).

## Evidence Base

The root packet treats 028 links as cross-packet evidence or telemetry inputs rather than internal 027 phase edges (`spec.md:64-80`). Phase 007 specifically soft-needs shadow-eval evidence from `028/004-code-graph-adoption-eval` before live-mode semantic trigger promotion (`spec.md:66-67`). Phase 008 soft-depends on `028/004-code-graph-adoption-eval` and consumes telemetry from `028/007-retrieval-rerank-clients` (`spec.md:66-67`).

Phase 002 is explicitly dependency-free in its metadata and is meant to ship before code_graph phases and before feedback reducers (`002-memory-write-safety/spec.md:63-65`). Phase 002 fixes three safety issues: auto-session causal edges must remain capped, reducer-created edges must not overwrite manual edges, and retention sweep must protect constitutional or critical rows from TTL-only deletion (`002-memory-write-safety/spec.md:41-45`).

Phase 003 is dependency-free in the root graph (`spec.md:57`) and supplies stable chunk identities, memo records, dependency edges, and chunk fingerprints (`003-incremental-index-foundation/spec.md:118-127`). Iteration 031 found file-level SHA-256 hashing and parent/chunk row shape already exist, while `memoization_records`, `dependency_edges`, `canonical-fingerprint.ts`, `memo.ts`, and chunk metadata columns are missing (`research/iterations/iteration-031.md:31-43`, `research/iterations/iteration-031.md:90-104`).

Phase 004 is blocked by Phase 003 in the root graph and in its own metadata (`spec.md:58`, `004-causal-edge-tombstones/spec.md:52-55`). Phase 004's implementation increases safety by routing memory delete, bulk delete, stale cleanup, manual unlink, and orphan sweep paths through a tombstone-producing helper (`004-causal-edge-tombstones/spec.md:120-128`). Iteration 032 confirmed current deletion paths still hard-delete causal edges without tombstones and that no causal-edge tombstone infrastructure exists (`research/iterations/iteration-032.md:21-36`, `research/iterations/iteration-032.md:40-52`).

Phase 005 is blocked by Phase 004 in the root graph and in its own metadata (`spec.md:59`, `005-metadata-edge-promoter/spec.md:53-56`). Its dependency is material because generated metadata edges need reliable cleanup when metadata is corrected or removed (`005-metadata-edge-promoter/spec.md:82-91`, `005-metadata-edge-promoter/spec.md:185-188`).

Phase 006 is blocked by Phase 003 and Phase 005 in the root graph (`spec.md:60`). Its own dependencies say stable chunk identities and fingerprints from Phase 003 are required as diff keys, and generated edge sets from Phase 005 can later use the same action model (`006-write-path-reconciliation/spec.md:85-88`). The risk register reinforces that chunk rows must not be used as diff keys until `chunk_id` and `chunk_fingerprint` are stable (`006-write-path-reconciliation/spec.md:201-208`).

Phase 007 can start now for default-off and shadow-mode implementation because it has no internal 027 dependency in the root graph (`spec.md:61`). Its own metadata reframes the 028 link as evidence required before live-mode promotion, not before initial implementation (`007-semantic-trigger-fallback/spec.md:69-77`). The feature is explicitly default-off, shadow-first, and lexical-preserving through `SPECKIT_SEMANTIC_TRIGGERS=false` and `SPECKIT_SEMANTIC_TRIGGERS_MODE=shadow|union` (`007-semantic-trigger-fallback/spec.md:123-131`). Iteration 035 identifies the lexical-first insertion point and shadow telemetry shape for a safe implementation path (`research/iterations/iteration-035.md:30-51`, `research/iterations/iteration-035.md:157-174`).

Phase 008 is hard-blocked on Phase 002 because the phase parent lists `002-memory-write-safety` as its hard dependency (`008-learning-feedback-reducers/spec.md:32-39`). The phase map then makes child `001-aggregator` depend on Phase 002, the three consumer children depend on the aggregator, and env/tests integration depends on all consumers (`008-learning-feedback-reducers/spec.md:55-64`). Iteration 036 confirms the five-child decomposition already implements the pt-04 split: P0 correctness lives in sibling Phase 002, while learning reducers are children of Phase 008 (`research/iterations/iteration-036.md:29-56`).

## Revised Dependency Graph

| Phase | Can start now? | Blocked by | 028 dependency | Recommended order |
|---|---|---|---|---|
| 002-memory-write-safety | Yes | None (`002-memory-write-safety/spec.md:63-65`) | None (`002-memory-write-safety/spec.md:129-137`) | 1 |
| 003-incremental-index-foundation | Yes | None (`spec.md:57`) | None stated (`003-incremental-index-foundation/spec.md:128-134`) | 2 |
| 007-semantic-trigger-fallback | Yes for default-off/shadow implementation; live union promotion is soft-blocked | None internally (`spec.md:61`) | Shadow-eval evidence from `028/004-code-graph-adoption-eval` before live-mode promotion (`spec.md:66-67`; `007-semantic-trigger-fallback/spec.md:69-77`) | 3 parallel with 002/003 |
| 004-causal-edge-tombstones | No | 003 (`spec.md:58`; `004-causal-edge-tombstones/spec.md:52-55`) | None stated (`004-causal-edge-tombstones/spec.md:130-137`) | 4 |
| 005-metadata-edge-promoter | No | 004 (`spec.md:59`; `005-metadata-edge-promoter/spec.md:82-85`) | None stated (`005-metadata-edge-promoter/spec.md:136-144`) | 5 |
| 006-write-path-reconciliation | No | 003 and 005 (`spec.md:60`; `006-write-path-reconciliation/spec.md:85-88`) | None for first pass; generated edge reconciliation benefits after 005 (`006-write-path-reconciliation/spec.md:85-88`) | 6 |
| 008-learning-feedback-reducers | No for parent/consumers; yes only for child-spec amendments | 002 (`008-learning-feedback-reducers/spec.md:32-39`, `008-learning-feedback-reducers/spec.md:57-64`) | Soft-depends on `028/004-code-graph-adoption-eval` and `028/006-coco-intent-steering`; consumes 028 telemetry for reducer tuning (`008-learning-feedback-reducers/spec.md:32-39`; `spec.md:66-67`) | 7 after 002; consumers after aggregator |

## Blocker Classification

Category A — can proceed independently now: Phase 002 can start because it declares no dependency and exists to unblock later reducer safety (`002-memory-write-safety/spec.md:63-65`). Phase 003 can start because the root table declares no dependency and current code lacks its memoization and DAG primitives (`spec.md:57`; `research/iterations/iteration-031.md:90-104`). Phase 007 can start in default-off or shadow mode because its hard dependency is none and the 028 link is live-promotion evidence, not implementation entry (`spec.md:61`; `007-semantic-trigger-fallback/spec.md:69-77`).

Category B — blocked on other 027 phases: Phase 004 is blocked on Phase 003 because it follows 003 in both the root graph and phase metadata (`spec.md:58`; `004-causal-edge-tombstones/spec.md:52-55`). Phase 005 is blocked on Phase 004 because generated edges need tombstone cleanup before write-mode promotion (`005-metadata-edge-promoter/spec.md:82-91`). Phase 006 is blocked on Phase 003 and Phase 005 because it needs stable diff keys and generated edge-set inputs (`006-write-path-reconciliation/spec.md:85-88`). Phase 008 is blocked on Phase 002 for reducer correctness and then internally orders aggregator before consumers (`008-learning-feedback-reducers/spec.md:32-39`, `008-learning-feedback-reducers/spec.md:55-64`).

Category C — soft-blocked on 028 evidence or telemetry: Phase 007's live semantic-trigger promotion is soft-blocked on 028 shadow-eval evidence (`spec.md:66-67`; `007-semantic-trigger-fallback/spec.md:206-212`). Phase 008 reducer live tuning is soft-blocked on 028 eval and retrieval/rerank telemetry (`spec.md:66-67`; `008-learning-feedback-reducers/spec.md:32-39`). Initial Phase 008 scaffolding and aggregator implementation remain blocked by Phase 002, not by 028 (`research/iterations/iteration-036.md:82-86`).

## Implementation-Order Optimisations

Land Phase 002 first because it reduces risk for Phase 008 and for any future auto-session causal reducer: Phase 002 owns auto-provenance cap broadening, manual-edge overwrite guard, and tier-aware retention protection (`002-memory-write-safety/spec.md:41-45`, `002-memory-write-safety/spec.md:97-127`). This also lets Phase 008's aggregator and reducers start without carrying defensive workaround code for unsafe causal and retention primitives (`008-learning-feedback-reducers/spec.md:47-49`, `research/iterations/iteration-036.md:54-56`).

Land Phase 003 before 006 because Phase 006 otherwise has to invent temporary diff keys; its own dependency states that stable chunk identities and fingerprints from Phase 003 are required as diff keys (`006-write-path-reconciliation/spec.md:85-88`). Iteration 031 shows those chunk fingerprint and line-span columns are still absent, so doing 006 first would create throwaway keying work (`research/iterations/iteration-031.md:90-104`).

Land Phase 004 before 005 because 005 creates generated causal edges and explicitly requires tombstone lifecycle so corrected metadata can clean up stale generated edges (`005-metadata-edge-promoter/spec.md:82-91`). Iteration 032 confirms tombstone infrastructure is absent, so landing 005 first would increase generated-edge volume before cleanup safety exists (`research/iterations/iteration-032.md:40-52`).

Start Phase 007 shadow mode in parallel with Phases 002 and 003 because it is default-off, lexical-preserving, and telemetry-oriented (`007-semantic-trigger-fallback/spec.md:123-131`; `research/iterations/iteration-035.md:157-174`). Do not promote Phase 007 to live union mode until 028 evidence exists (`spec.md:66-67`).

Within Phase 008, land child `001-aggregator` immediately after Phase 002, then run `002-coco-rerank-consumer`, `003-causal-reducer`, and `004-retention-reducer` independently, and finish with `005-env-tests-integration` (`008-learning-feedback-reducers/spec.md:68-76`). Iteration 036 adds two low-LOC risk reductions: reuse `relation-coverage.ts` in the causal reducer and `stage4-filter.ts` state limits in the retention reducer (`research/iterations/iteration-036.md:58-72`).

## Verdict

ADAPT. The dependency graph is mostly already encoded correctly in the root spec and phase specs, but the practical execution order should treat Phase 007 and Phase 008 as split-mode phases: implementation can start for default-off or scaffolded portions, while live promotion and reducer tuning remain soft-blocked on 028 evidence and telemetry (`spec.md:64-80`; `research/iterations/iteration-036.md:82-86`).
