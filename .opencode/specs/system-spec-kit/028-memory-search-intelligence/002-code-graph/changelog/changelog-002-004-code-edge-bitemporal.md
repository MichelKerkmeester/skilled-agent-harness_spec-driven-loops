---
title: "Changelog: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster) [002-code-graph/004-code-edge-bitemporal]"
description: "Chronological changelog for the Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/004-code-edge-bitemporal` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

Nothing was built. This phase records a decision: the entire code_edges bi-temporal cluster is DEFER-speculative and ships no schema migration. The capability gap is real — the code-graph reindex destroys edges on every scan and carries no validity window, so it can never serve as-of-last-green-scan reads — but three findings across 200 research iterations make building it now the wrong call: no consumer wants as-of/time-travel reads, the safety story is already covered by the shipped readiness gate, and the cluster does not fix the one bug that actually bites (dependency-transitivity edge-staleness, owned by the sibling phase). What this phase delivers is the honest DEFER plus a gated, sequenced plan so the work is ready the moment a consumer appears.

### Added

- No new additions recorded.

### Changed

- Nothing was built. This phase records a decision: the entire code_edges bi-temporal cluster is DEFER-speculative and ships no schema migration. The capability gap is real — the code-graph reindex destroys edges on every scan and carries no validity window, so it can never serve as-of-last-green-scan reads — but three findings across 200 research iterations make building it now the wrong call: no consumer wants as-of/time-travel reads, the safety story is already covered by the shipped readiness gate, and the cluster does not fix the one bug that actually bites (dependency-transitivity edge-staleness, owned by the sibling phase). What this phase delivers is the honest DEFER plus a gated, sequenced plan so the work is ready the moment a consumer appears.

### Fixed

- No fixes recorded.

### Verification

- DEFER-speculative decision recorded - PASS (decision-record ADR-001; spec §3; 030 §3/§14 cross-ref)
- Q1-C1 / Q1-C1-code-edge-bitemporal - PENDING (gated on Q6-C1 + named consumer; seam confirmed code-graph-db.ts:177-184,:941,:985,:1012,:1031)
- Q1-C1-views - PENDING (gated; keystone; co-ships atomically with Q1-C1; ref 002 iter-018)
- CG-edge-bitemporal-lifecycle - PENDING (standalone REFUTED 002 iter-013; layer on Q1-C1 only)
- CG-symbol-timeline-query - PENDING (no consumer; no separate seam beyond Q1-C1 read filter)
- validate.sh --strict on this folder - PASS (spec-doc structure)

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-001 Requirements documented in spec.md (REQ-001..008, all gated)
- CHK-002 DEFER-speculative decision recorded with evidence (no as-of consumer; redundant with readiness gate; does not fix the real bug) — decision-record.md ADR-001
- CHK-003 Sequencing defined in plan.md (Q6-C1 + closed-vocab first → Q1-C1 + views atomic → edge-lifecycle → timeline)
- CHK-010 No production code changed this phase (cluster deferred; ships nothing) — confirmed
- CHK-011 (IF un-deferred) Typecheck/build passes (tsc on the code-graph package)
- CHK-012 (IF un-deferred) Additive columns nullable + forward-compatible; views droppable
