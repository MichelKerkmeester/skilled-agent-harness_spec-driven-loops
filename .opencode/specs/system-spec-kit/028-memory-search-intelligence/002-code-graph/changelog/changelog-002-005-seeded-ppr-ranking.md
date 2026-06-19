---
title: "Changelog: Code-Graph Seeded-PPR Impact Ranking (Structural Retrieval Intelligence) [002-code-graph/005-seeded-ppr-ranking]"
description: "Chronological changelog for the Code-Graph Seeded-PPR Impact Ranking (Structural Retrieval Intelligence) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

This phase builds the mechanism the re-plan identified, default-off behind SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING. The impact path now has a bounded personalized-PageRank primitive, consumes the Memory MCP weighted-walk substrate through a code-graph edge adapter, gates expansion to impact/multi-hop classes, projects the PPR working graph undirected, and folds confidence/evidence reliability into transition weights. With the flag unset, the existing flat impact walk remains the served path; neighborhood and outline short-circuit before PPR even when the flag is enabled.

### Added

- Confirm PPR is UNBUILT before building: rg -niE 'pagerank|personaliz|teleport|damping|\bppr\b|random.?walk' .opencode/skills/system-code-graph/mcp_server returns ZERO hits (spec §2; re-grepped at plan time) — establishes this is a net-new build, not a wiring of a dormant helper
- Confirm the out-of-cluster sibling: Q4-C1 RRF-additive trust blend SHIPPED in Wave-0 (commit e21caf5de6, code-graph-context.ts:350-356); Q4-C2 here REUSES its reliability factor as a transition weight, it does not re-implement the blend (spec §3 Out of Scope)
- Build the bounded PPR primitive: computeBoundedPersonalizedPageRank seeds subject symbols, uses weighted transitions, hard-caps iterations, and returns best-so-far scores under the cap
- Add a SingleHop/MultiHop/Entity/ambiguous query-class taxonomy to query-intent-classifier.ts
- [P] The single-hop path short-circuits before any PPR walk; regression test covers flag-enabled neighborhood behavior
- Record CG-lexical-vector-seed-union as CUT / NO-GO in decision-record.md: the vector half does not exist and adding it remains a scope violation, not deferred work

### Changed

- Confirm 027's reuse target EXISTS: collectWeightedWalk/collectCausalWeightedNeighbors present in system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts (the weighted-walk substrate PPR drives; plan.md §3, ADR-001)
- Reuse-confirmation gate: collectWeightedWalk accepts generic string/number nodes plus a caller-provided weighted edge reader; code-graph consumes the built Memory artifact with a code-graph edge adapter, no Memory source edits and no forked traversal helper
- Spread PPR mass over 027's REUSED collectWeightedWalk traversal via the Memory MCP built artifact — no second graph-walk engine authored
- Wire the impact path to PPR-score ordering when SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING=true; with the flag off, the flat path remains byte-identical
- Intersect the PPR-reached set with physically present code_edges; the invalid_at IS NULL upgrade remains PENDING because it requires the separate temporal-edge schema migration
- Gate PPR/expansion ON for impact/multi-hop modes, OFF for single-hop neighborhood/outline; ambiguous class fails PPR-OFF

### Fixed

- Correct the roadmap caveat: the "old PageRank helper never wired" line does NOT hold against the live tree — there is NO PageRank helper in either MCP (rg pagerank empty in both lib/graph/); the real reuse target is the weighted-walk substrate, not a dormant helper (spec §2 plan-time correction)
- Bound PPR inside the existing impact deadline using a fixed iteration cap plus deadline checks; budget cuts return already sorted PPR prefixes
- CHK-005 Roadmap caveat corrected: no old PageRank helper exists; the real reuse target is the weighted-walk substrate
- CHK-FIX-001 Each candidate has a finding class and status in spec.md/tasks.md; build candidates are DONE mechanism where implemented, with benchmark gates named
- CHK-FIX-002 Producer inventory run before implementation: rg -n 'expandAnchor|queryEdgesTo|blast_radius' .opencode/skills/system-code-graph/mcp_server --glob '*.ts'
- CHK-FIX-003 Reuse-target inventory read: Memory weighted-walk signatures are generic enough for a code-graph adapter

### Verification

- PPR-is-unbuilt confirmed (grep empty over the live tree) - PASS (spec §2; tasks T001)
- 027 reuse target confirmed to exist (collectWeightedWalk) - PASS (tasks T002; ADR-001)
- Roadmap "never-wired PageRank helper" caveat corrected (no helper exists) - PASS (spec §2/§12; tasks T003)
- Q4-C1 shipped out-of-cluster (e21caf5de6); Q4-C2 reuses its factor - PASS (spec §3 Out of Scope; tasks T004)
- Q3-C1 / Q3-C1-seeded-PPR - PASS mechanism; default-off; benchmark quality/tuning pending
- CG-class-gated-expansion - PASS
- CG-undirected-projection - PASS mechanism; benchmark quality pending
- Q4-C2 multi-hop reliability decay - PASS mechanism; calibration pending

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- PPR remains default-off. The mechanism is available only when SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING is truthy; this preserves byte-identical default behavior for ranking-sensitive paths.
- No code-graph retrieval benchmark exists campaign-wide. The PPR ranking-quality claim and tuned damping/cap/decay values are held behind a benchmark that must be built first.
- The current-set intersection degrades. Q3-C1 intersects with physically present edges today; invalid_at IS NULL semantics remain pending until the separate temporal-edge schema migration exists.
