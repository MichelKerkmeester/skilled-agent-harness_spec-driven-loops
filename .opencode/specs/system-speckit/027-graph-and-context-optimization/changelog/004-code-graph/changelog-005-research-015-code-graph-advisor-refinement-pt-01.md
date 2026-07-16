---
title: "Code Graph Phase 005/Research/015: Advisor Refinement Deep Research Pt-01"
description: "20-iteration deep-research investigation into code-graph and skill-advisor refinement gaps. Produced 35 findings across advisor daemon reliability, shim edge cases, confidence calibration, and cross-packet contract alignment. Stopped at max-iteration cap with SHIP_READY_CONFIRMED."
trigger_phrases:
  - "005 research 015 pt 01"
  - "advisor refinement deep research"
  - "F35 calibration research"
  - "advisor daemon research"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Research-only)
> Parent packet: `027-graph-and-context-optimization/004-code-graph`

### Summary

A 20-iteration deep-research investigation examined the intersection of the code-graph and the skill advisor. The investigation asked: after the Phase 001-004 code-graph upgrades and the skill-advisor self-contained package migration, what refinement work remains at the boundary between the two systems?

Thirty-five findings surfaced across the full sweep. The findings fell into five clusters: daemon reliability (advisors that refused to start on stale or missing skill graphs), shim edge cases (code-graph results silently dropped when the graph returned blocked or partial responses), confidence calibration (uncalibrated scores that did not reflect actual precision/recall), cross-packet contract drift (advisor response shapes changed by the migration but the code-graph integration was not updated), and documentation gaps (operator-facing docs that referenced pre-migration surface names).

The investigation ran for the full 20-iteration budget. The `newInfoRatio` trajectory (0.88 down to 0.25 and then back up to 0.55) never crossed the 0.05 convergence threshold, indicating the surface area was large enough that new findings continued to emerge through iteration 20. Status was SHIP_READY_CONFIRMED at iteration 20 with all 10 research questions resolved, 88 active findings, and 6 retractions.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- 20 iteration files (iteration-001.md through iteration-020.md) in the research directory.
- `findings-registry.json` with 88 findings entries across the full sweep.
- `deep-research-state.jsonl` externalized state across all 20 iterations.
- `deep-research-dashboard.md` tracking iteration-level metrics.
- `research.md` (566 lines) synthesis document with 17 sections.
- SHIP_READY_CONFIRMED status at iteration 20 with all 10 research questions resolved.

### Files Changed

| File | What changed |
|------|--------------|
| `research/015-*/research.md` (NEW) | Synthesis document, 566 lines |
| `research/015-*/iterations/iteration-001.md` through `iteration-020.md` (NEW) | Per-iteration pass narratives |
| `research/015-*/deltas/` (NEW) | 20 iteration delta records |
| `research/015-*/findings-registry.json` (NEW) | Structured findings registry, 88 entries |
| `research/015-*/deep-research-*.json|md` (NEW) | Config, state, dashboard, strategy |

### Follow-Ups

- **35 findings flow into Phase 005 implementation.** The 35 findings were clustered into 5 fix-up batches (B1-B5) plus the F35 calibration bench. All were addressed by the Phase 005 implementation.
- **Unconverged surface area.** The investigation stopped at the 20-iteration cap with `newInfoRatio` above 0.55. Additional surface area may remain at deeper integration layers.
