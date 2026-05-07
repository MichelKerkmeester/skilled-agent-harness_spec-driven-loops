---
title: "Skill Advisor Phase 001 Research: Search Fusion Tuning (pt-01)"
description: "35-iteration deep research investigating fusion-weight optimization and rerank-threshold calibration for continuity-oriented MCP searches. Established the safe implementation order for four follow-on sub-phases."
trigger_phrases:
  - "research 010 pt-01 changelog"
  - "fusion-weight optimization"
  - "rerank threshold calibration"
  - "length penalty removal research"
importance_tier: "normal"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-21

> Spec folder: `026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/research/010-search-and-routing-tuning-pt-01`
> Parent packet: `026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning`

### Summary

A 35-iteration deep research session investigated fusion-weight optimization and rerank-threshold calibration for continuity-oriented MCP searches. The work stayed read-only against runtime code and wrote only packet-local research artifacts.

The investigation covered six layers: inventorying hardcoded constants across all search stages, tracing the real hybrid fusion control path, reusing existing K-sensitivity fixtures, running packet-local corpus probes, tracing request contracts and test suites to produce safe implementation guidance, cross-validating recommendations, and auditing the shipped implementation end to end.

Twenty findings were produced. Key conclusions: `search-weights.json` is secondary for hybrid continuity fusion; FSRS 0.2346 is canonical and should not be retuned. The length penalty is a poor fit because 78.6% of spec docs exceed 2000 characters. The best implementation order is 002-telemetry, 001-length-penalty, 004-rerank-minimum, 003-continuity-profile (ranked by impact-to-risk ratio). And the continuity profile should stay narrow at the adaptive-fusion seam rather than expanding into a public search intent.

### Added

None - research-only phase.

### Changed

None - research-only phase.

### Fixed

None - research-only phase.

### Verification

| Artifact | Evidence |
|----------|----------|
| `research.md` | 406 lines. 20 convergent findings across 6 investigation layers. Recommended implementation order with per-phase guidance, edge cases, and confidence bounds. |
| `deep-research-state.jsonl` | 35 completed iterations with full convergence in iteration 25. Post-implementation audit extended through iteration 35. |
| `iterations/` | 35 iteration-NNN.md files spanning the pre-implementation baseline, resumed safe-guidance pass, convergence wave, and post-implementation audit. |
| `deep-research-dashboard.md` | Phase convergence dashboard tracking question coverage, claim verification, and contradiction density. |
| `findings-registry.json` | 38 registered findings with source citations, confidence scores, and implementation-guidance flags. |
| `deep-research-config.json` | Loop configuration with depth 24, max iterations 25 (extended to 35). |

### Follow-Ups

- Stage 3 MMR intent-source split: the continuity profile is partially wired. Stage 3 still keys MMR off `detectedIntent` while fusion uses `adaptiveFusionIntent`.
- Canonical `/spec_kit:resume` bypasses the search pipeline entirely. Docs should distinguish resume ladder from search-style `profile='resume'`.
- Dashboard-grade reranker telemetry: separate stale expiry from capacity eviction, expose scope/reset/failure context, add provider-scoped counters.
