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

The Code Graph phase parent rolls up ten child phases across deterministic ranking, edge correctness, freshness metadata, default-off bi-temporal schema foundation, default-off impact ranking (cut, then reconfirmed cut on a 2026-07-01 edge-confidence revisit), parser resilience, document-symbol extraction, daemon-reclaim hardening and that edge-confidence and seeded-PPR revisit itself. Detailed planning and verification live in the child phase folders listed below.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-determinism-walk-order` | In Progress | Context-edge ranking now uses content-derived ordering for equal-trust walks, while fuser adapter work and boost tuning remain gated. |
| `002-edge-staleness-correctness` | Implemented default-off, benchmark gate pending | Incremental scans can force-parse changed dependencies' importers before persistence and tombstone-gated rename lineage is available through `SUPERSEDES` edges. |
| `003-generation-watermark` | Soft watermark implemented, hard gate deferred | Scan promotion now bumps a monotonic generation counter and exposes it in freshness metadata. |
| `004-code-edge-bitemporal` | Schema foundation shipped default-off | The `code_edges` table gained nullable `valid_at`/`invalid_at` columns with UP/BACKFILL/DOWN helpers behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`. Live views, lifecycle writes and the as-of read stay deferred until a named consumer exists. |
| `005-seeded-ppr-ranking` | CUT, benchmark confirmed twice | Bounded personalized PageRank tied the flat walk on the original benchmark, and a 2026-07-01 edge-confidence revisit that gave it a real gradient to differentiate on made it lose on every metric instead. |
| `006-edge-governance-vocab` | Implemented default-off | The closed-vocab `edge_type` CHECK migration shipped behind `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` with `SCHEMA_VERSION` 7 to 8, a pre-rebuild DISTINCT scan and focused tests. The churn cap, audit-subgraph and derived-clock siblings remain deferred. |
| `007-parser-resilience` | Implemented | Parser skip-list behavior now separates crash cohort from transient or fatal retry policy. |
| `008-doc-symbol-lane` | Implemented | The doc lane now indexes heading and key nodes and the launcher classifies lease transitions through a no-op-default metrics hook. |
| `009-daemon-reclaim-hardening` | Implemented (gated, default-on) | Tridimensional-liveness reclaim of a wedged code-index daemon (PID + socket-serving + heartbeat): compound socket-vetoed predicate, uid/PID-identity kill-guards, startup WAL hygiene, conditional CAS, crash-surviving PID registry. 31 tests, no regression; production soak + better-sqlite3 ABI realign pending. |
| `010-edge-confidence-and-ppr-revisit` | Implemented (gated, default-off) | Real per-edge CALLS confidence differentiation shipped behind a new flag, and the recovered seeded-PPR module re-run against it lost on every benchmark metric, confirming the cut stands. |

### Added

- No root-level production additions. Child additions are recorded in the phase changelogs.

### Changed

- The root changelog now presents the child phase state as a rollup rather than repeating raw task-ledger prose.

### Fixed

- Corrected the stale child summary for edge-staleness correctness in the rollup.
- Corrected the bi-temporal child row from ships-nothing to schema foundation shipped default-off, after git confirmed the columns, migration helpers and tests landed.

### Verification

- Root rollup is documentation-only. Phase verification remains in the child changelogs.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Continue to resolve gated benchmark, schema and fuser work in the child phases that own those seams.
