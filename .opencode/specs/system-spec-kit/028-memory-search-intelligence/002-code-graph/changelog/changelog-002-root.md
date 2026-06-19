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

> Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem -->

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-determinism-walk-order` | In Progress | The Q4-C1 RRF-additive rank-time trust blend shipped in the flat Wave-0 packet (030) and is the prerequisite already in place: the code-graph impact/dependency ranker blends the already-plumbed confidence/evidenceClass edge metadata into ranking as an additive term. This pass implemented det-context-order-global: rankContextEdges now derives a stable content key from the related node content hash, related symbol id, file/fqName, edge type and endpoints, assigns baseline rank from that deterministic order, then uses the same key for equal-score ties. The fuseResultsMulti dual-channel adapter (Q8 / fuseResultsMulti-codegraph-promote) and Q4-C1 boost-magnitude benchmark tuning remain pending with explicit gates. |
| `002-edge-staleness-correctness` | Implemented default-off; benchmark gate pending | Nothing has been built yet. This is a planning-only spec folder for the single real correctness bug in the Code Graph subsystem. Both candidates are PENDING and neither shipped in the Wave-0 record (030 §14). The plan attacks the path-coupled-symbol-id failure mode from two angles: re-deriving a refactored dependency's reverse-dependents in the same scan (the bug), and preserving rename lineage with an additive edge. |
| `003-generation-watermark` | Q6-C2 DONE; Q6-C1 PENDING - DEFER-speculative | Q6-C2 is built. The code-graph subsystem now stores a monotonic generation counter in the existing code_graph_metadata KV table, advances it from the scan promotion finalize path, and surfaces it as an additive field on metadata.freshness from code_graph_context. |
| `004-code-edge-bitemporal` | Draft (gated — ships nothing this phase) | Nothing was built. This phase records a decision: the entire code_edges bi-temporal cluster is DEFER-speculative and ships no schema migration. The capability gap is real — the code-graph reindex destroys edges on every scan and carries no validity window, so it can never serve as-of-last-green-scan reads — but three findings across 200 research iterations make building it now the wrong call: no consumer wants as-of/time-travel reads, the safety story is already covered by the shipped readiness gate, and the cluster does not fix the one bug that actually bites (dependency-transitivity edge-staleness, owned by the sibling phase). What this phase delivers is the honest DEFER plus a gated, sequenced plan so the work is ready the moment a consumer appears. |
| `005-seeded-ppr-ranking` | Implemented mechanism default-off; benchmark/schema gates pending | This phase builds the mechanism the re-plan identified, default-off behind SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING. The impact path now has a bounded personalized-PageRank primitive, consumes the Memory MCP weighted-walk substrate through a code-graph edge adapter, gates expansion to impact/multi-hop classes, projects the PPR working graph undirected, and folds confidence/evidence reliability into transition weights. With the flag unset, the existing flat impact walk remains the served path; neighborhood and outline short-circuit before PPR even when the flag is enabled. |
| `006-edge-governance-vocab` | Draft | Nothing has been built yet. This is a planning-only spec folder governing how the Code Graph writes edges. All five candidates are PENDING and none shipped in the Wave-0 record (030 §14, where only Code-Graph Q4-C1 shipped, in a different sub-phase). The plan anchors on the one clean GO of the edge-governance cluster — a driver-level closed-vocabulary CHECK on edge_type — and layers three additive governance siblings that the research deferred onto the tombstone and edge-identity substrate. |
| `007-parser-resilience` | Implemented | Q2-C1 is implemented in the real Code Graph MCP subsystem. The parser skip-list now separates the existing crash cohort (B1 / B2 / OTHER) from a new retry policy axis (transient / fatal). A transient file remains eligible for a later parse until its durable attempt_count reaches max_retries; default is 5 via SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES. A fatal file is skipped immediately and remains manual-review-only. |
| `008-doc-symbol-lane` | Implemented | This sub-phase built two independent, additive capability adds against confirmed seams. The code graph's doc lane now stops being a write-only content-hash and starts answering questions: markdown headings become queryable heading nodes nested by level, and json/jsonc/yaml/yml/toml keys become key nodes, all with deterministic ids that stay stable across rescans, all from a local regex/key walk with no LLM and no network. Track B gives the launcher its first lease-churn classification: lease lifecycle transitions get names and counter payloads, routed through a no-op-default sink until a real metrics sink exists. |

### Added

- No new additions recorded.

### Changed

- > Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem -->

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
