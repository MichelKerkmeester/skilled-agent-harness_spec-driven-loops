---
title: "Changelog: Dark Flag Graduation Phase Parent [007-dark-flag-graduation/root]"
description: "Chronological changelog for the Dark Flag Graduation Phase Parent spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation` (Level 2)

### Summary

The Dark Flag Graduation phase parent put the tail of built-but-default-off features through one earn-or-cut gauntlet on the real corpus and graph. Eight benchmark families measured their feature on the production path and returned a verdict, then a flag-name cleanup, a validation pass, a production-readiness follow-up and a closing deep review finished the program. Four families graduated, three were cut on a measured loss or tie and one was held at refine. The multi-hop tail appends graduated for deep-K readers, the code-graph edge-staleness repair and bitemporal reads graduated, the advisor RRF fusion spine graduated and the deep-loop finding dedup graduated with its gauges. The retrieval-class channel weights, the save reconsolidation and the code-graph seeded PageRank were cut, alongside the edge governance vocabulary and the advisor self-recommendation guard as sub-cuts. The true-citation ledger stays at refine pending live session traffic. No production default was flipped inside this program. The parent stays a rollup and implementation detail lives in the child phase folders.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| [`001-multihop-tail-appends`](./changelog-007-001-multihop-tail-appends.md) | GRADUATE (deep-K) | A structural rewire put the deterministic multi-hop and lane-champion appends back on the production path and completeRecall@20 rose from 0.5625 to 0.9375 with zero variance, a deep-K-only win. |
| [`002-retrieval-class-weights`](./changelog-007-002-retrieval-class-weights.md) | CUT | Suppressing the graph and degree channels for single-hop queries dropped precision@1 from 0.90 to 0.80 with no recall benefit, so the flag and its branch can be deleted. |
| [`003-true-citation-ledger`](./changelog-007-003-true-citation-ledger.md) | REFINE | The anchor-aware detector lifted real-transcript reference coverage from 7.24 percent to 15.79 percent, sound but still too sparse to clear the reranker bar until live session traffic accumulates. |
| [`004-save-reconsolidation`](./changelog-007-004-save-reconsolidation.md) | CUT | The cosine merge band scored merge precision 0.017 against a backup copy, wrong 56 times for every correct merge, so the destructive merge was declined. |
| [`005-codegraph-seeded-ppr`](./changelog-007-005-codegraph-seeded-ppr.md) | CUT | Seeded personalized PageRank tied the flat impact walk on every precision, recall and nDCG cell across 20 labeled change-impact queries, so it earns no place. |
| [`006-codegraph-edge-lifecycle`](./changelog-007-006-codegraph-edge-lifecycle.md) | GRADUATE / CUT | The fan-in rebind benchmark ran for the first time and the degree cap took a high-fan-in dependency from 30 forced reparses to 0, graduating the staleness repair and the bitemporal reads, while the governance vocabulary was cut as redundant. |
| [`007-advisor-rrf-fusion`](./changelog-007-007-advisor-rrf-fusion.md) | GRADUATE / CUT | RRF fusion plus the conflict-rerank seam lifted routing top-1 from 0.8810 to 0.9048 with zero regressions, graduating the spine, while the self-recommendation guard was cut as behaviorally redundant. |
| [`008-deeploop-finding-dedup`](./changelog-007-008-deeploop-finding-dedup.md) | GRADUATE | The near-duplicate dedup hit pooled precision 1.0 and distinct-finding recall 1.0 on the production merge path, graduating with the lag-ceiling and progress-heartbeat gauges, all byte-identical when off. |
| [`009-flag-name-cleanup`](./changelog-007-009-flag-name-cleanup.md) | Shipped | A hard clean rename dropped the `_V1` suffix from twelve live feature flags across fifty-two files with no alias, typechecks clean and 331 tests green. |
| [`010-dark-flag-validation`](./changelog-007-010-dark-flag-validation.md) | PASS | A four-iteration research pass plus a code-level review confirmed every graduate winner byte-identical when off and covered beyond the labeled benchmark, 69 of 69 tests green at 0 P0. |
| [`011-graduation-follow-ups`](./changelog-007-011-graduation-follow-ups.md) | Shipped | The four production-readiness follow-ups wired the bitemporal writer and set the degree cap, fixed the lag metric and title-aware dedup, added the append-exempt trim and citation probe and locked the advisor penalty contract. |
| [`012-followup-deep-review`](./changelog-007-012-followup-deep-review.md) | PASS (initial FAIL, then fixed) | A ten-iteration opus deep review of the graduation work returned 3 P0, 8 P1 and 4 P2, all in the bitemporal wiring, then the fixes closed every blocker and a re-review confirmed PASS at zero. |

### Added

- No root-level production additions. Each benchmark harness, verdict and follow-up build is recorded in the child phase changelogs.

### Changed

- The root changelog summarizes the twelve dark-flag phases and their real verdicts. Four families graduated, three were cut and one was held at refine. The cleanup, validation, follow-up and review phases then closed the program.

### Fixed

- No root-level fixes. The benchmark-driven verdicts and the follow-up wiring are recorded in the child changelogs.

### Verification

- Root rollup is documentation-only. Each phase carries its own production-path benchmark, byte-identity proof and validation evidence in its child changelog.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- The bitemporal edge writer must be wired into the `replaceEdges` reindex path behind its read flag before that flag can flip. The validation and review phases both recorded the wiring as the one honest remaining step. **Resolved in the 011 graduation follow-ups (`011-graduation-follow-ups/001-codegraph-defaults-bitemporal`): the writer was wired into `code-graph-db.ts` behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`, closing superseded edges with an open validity window on reindex.**
- The true-citation ledger stays at refine until live session-carrying traffic reaches the density floor the probe now reports.
- The unset production tunables for the deep-loop gauges and the degree cap need defined values, and flipping any graduated default on stays a separate evidence-gated decision outside this program.
