---
title: "Plan: Dark Flag Validation"
description: "Deep-review audit plan for the five graduate-ready dark-flag clusters before graduation."
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/004-dark-flag-graduation/006-dark-flag-validation"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "opencode"
---

# Plan: Dark Flag Validation

## 1. Approach

A single-pass deep review covering all five graduate-ready clusters from 005-dark-flag-graduation. Each cluster is audited for correctness, byte-identity when the flag is off, edge cases the labeled benchmarks did not cover, and spec-alignment with benchmark findings.

## 2. Review Steps

1. Read source code for all five clusters
2. Run existing test suites to establish baseline
3. Audit byte-identity of flag-off path for each cluster
4. Identify edge cases and uncovered scenario classes
5. Synthesize findings into review-report.md
6. Return verdict per cluster and unified graduation gate posture

## 3. Clusters

- 001: Multihop tail-appends (`SPECKIT_DETERMINISTIC_MULTIHOP`, `SPECKIT_LANE_CHAMPION_BACKFILL`)
- 002: Code-graph staleness repair + bitemporal reads (`SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE`, `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`)
- 003: Advisor RRF fusion + conflict-rerank (`SPECKIT_ADVISOR_RRF_FUSION`)
- 004: Deep-loop finding dedup + gauges (`SPECKIT_FANOUT_NEAR_DUP_DEDUP`)
- 005: True-citation ledger (`SPECKIT_TRUE_CITATION_EMITTER`)

## 4. Success Criteria

- All five clusters reviewed at source level
- Byte-identity verified for flag-off path
- Existing tests pass (baseline captured)
- review-report.md synthesized with verdict
- Validation passes (`validate.sh --strict`)
