---
title: "Code Graph Phase 004/Research/028: Hook Improvement Investigation Pt-01"
description: "10-iteration deep-research first wave. Converged on 7 findings (1 P0, 4 P1, 2 P2). The P0: subtree-root manual scans delete out-of-scope rows while status still reports healthy. The P1 chain: readiness cache invalidated by stale, context emits contradictory freshness, deadline contracts never wired."
trigger_phrases:
  - "004 research 028 pt 01"
  - "subtree root scan deletion"
  - "readiness cache stale"
  - "context deadline contract"
  - "startup payload dropped"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Research-only)
> Parent packet: `002-graph-and-context-optimization/004-code-graph`

### Summary

A 10-iteration deep-research first wave investigated code-graph and hook improvement gaps. Seven findings surfaced: 1 P0, 4 P1, and 2 P2.

The P0 finding (F-001) was the most impactful: running a manual scan scoped to a subtree root silently deleted all out-of-scope rows from the index while status and startup continued to report "healthy." No scope-completeness flag existed to warn operators that the index was now incomplete.

The P1 findings formed a chain of stale-state issues. F-002: the readiness debounce cache (5-second TTL) was not invalidated after manual scans, so status could report "ready" from a stale cache while the live index was degraded. F-003: `code_graph_context` emitted a second freshness story (via `metadata.freshness`) based only on `indexed_at`, which could contradict the operational freshness from the status handler. F-004: the context deadline contract was advertised in the type system but never wired from the handler.

The P2 findings covered observability gaps. F-005: scan-time detector and enrichment summaries were persisted but invisible to operators (no read path). F-006: `buildStartupBrief()` produced a structured payload, but all runtime adapters dropped it to text-only.

The investigation stopped at the 10-iteration cap. The `newInfoRatio` trajectory (0.88 down to 0.06) never crossed the 0.05 convergence threshold.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- 10 iteration files (iteration-001.md through iteration-010.md) in the research directory.
- `findings-registry.json` with 7 entries (1 P0, 4 P1, 2 P2).
- `deep-research-state.jsonl` externalized state across all 10 iterations.
- `research.md` (98 lines) synthesis document.

### Files Changed

| File | What changed |
|------|--------------|
| `research/001-subtree-scan-freshness-and-startup-research/research.md` (NEW) | Synthesis document |
| `research/001-subtree-scan-freshness-and-startup-research/iterations/iteration-01.md` through `iteration-10.md` (NEW) | Per-iteration pass narratives |
| `research/001-subtree-scan-freshness-and-startup-research/deltas/` (NEW) | Per-iteration delta records |
| `research/001-subtree-scan-freshness-and-startup-research/findings-registry.json` (NEW) | Structured findings registry |
| `research/001-subtree-scan-freshness-and-startup-research/deep-research-*.json|md` (NEW) | Config, state, dashboard, strategy |

### Follow-Ups

- **F-001 subtree-root scan deletion.** The primary P0 finding. The scan must either refuse subtree-root scope or mark the index as incomplete. Addressed by the scope-guard in Phase 012/005.
- **F-002 readiness cache invalidation.** Manual scans must invalidate or bypass the readiness debounce cache. A follow-up should wire scan-triggered cache busting.
- **F-003 contradictory freshness.** The two freshness sources (status handler and context metadata) must agree. A follow-up should unify on a single freshness computation.
- **F-005 detector summaries read path.** The write-only summaries need a query surface. A follow-up observability packet should add a read path.
- **F-006 startup payload transport.** Addressed by the Phase 004 implementation's startup payload parity stream.
