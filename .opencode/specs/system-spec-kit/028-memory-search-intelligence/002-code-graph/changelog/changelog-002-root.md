---
title: "Changelog: Code Graph Phase Parent [002-code-graph/root]"
description: "Chronological changelog for the Code Graph Phase Parent spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph` (Level 2)

### Summary

The Code Graph phase parent rolls up eight child phases across deterministic ranking, edge correctness, freshness metadata, deferred schema work, default-off impact ranking, parser resilience and document-symbol extraction. Detailed planning and verification live in the child phase folders listed below.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-determinism-walk-order` | In Progress | Context-edge ranking now uses content-derived ordering for equal-trust walks, while fuser adapter work and boost tuning remain gated. |
| `002-edge-staleness-correctness` | Implemented default-off, benchmark gate pending | Incremental scans can force-parse changed dependencies' importers before persistence and tombstone-gated rename lineage is available through `SUPERSEDES` edges. |
| `003-generation-watermark` | Soft watermark implemented, hard gate deferred | Scan promotion now bumps a monotonic generation counter and exposes it in freshness metadata. |
| `004-code-edge-bitemporal` | Draft, ships nothing this phase | Bi-temporal `code_edges` work is deferred until a real as-of or time-travel consumer exists. |
| `005-seeded-ppr-ranking` | Implemented mechanism default-off, benchmark gates pending | Impact ranking can use a flagged bounded personalized PageRank mechanism over the weighted-walk substrate, with the existing flat walk preserved by default. |
| `006-edge-governance-vocab` | Draft | Edge-governance migration and audit work are planned only, pending live vocabulary evidence and migration safety checks. |
| `007-parser-resilience` | Implemented | Parser skip-list behavior now separates crash cohort from transient or fatal retry policy. |
| `008-doc-symbol-lane` | Implemented | The doc lane now indexes heading and key nodes and the launcher classifies lease transitions through a no-op-default metrics hook. |

### Added

- No root-level production additions. Child additions are recorded in the phase changelogs.

### Changed

- The root changelog now presents the child phase state as a rollup rather than repeating raw task-ledger prose.

### Fixed

- Corrected the stale child summary for edge-staleness correctness in the rollup.

### Verification

- Root rollup is documentation-only. Phase verification remains in the child changelogs.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Continue to resolve gated benchmark, schema and fuser work in the child phases that own those seams.
