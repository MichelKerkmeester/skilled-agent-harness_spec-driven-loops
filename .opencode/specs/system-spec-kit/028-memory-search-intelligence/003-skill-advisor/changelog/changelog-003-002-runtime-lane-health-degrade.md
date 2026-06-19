---
title: "Changelog: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB) [003-skill-advisor/002-runtime-lane-health-degrade]"
description: "Chronological changelog for the Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/002-runtime-lane-health-degrade` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

This phase built the runtime lane-health degrade path in the Skill Advisor MCP scorer. The scorer now distinguishes a degraded-empty lane from a lane that ran and matched nothing, elides only degraded-empty lanes from the confidence denominator, and surfaces the degraded-lane condition through metrics, prompt-safe handler output, warnings, and abstention explanations.

### Added

- Build the runtime per-lane health signal classing each lane healthy / runtime_degraded / matched_nothing, call-scoped, from runtime score-presence plus handler-owned stale graph health state; not derived from disabled or registry-static liveness (mcp_server/lib/scorer/types.ts, mcp_server/lib/scorer/fusion.ts, mcp_server/handlers/advisor-recommend.ts) — REQ-002
- C5a: added per-call degraded-lane list and runtime-accurate metrics.liveLaneCount; handler emits prompt-safe runtimeLaneHealth only when degraded lanes exist (mcp_server/lib/scorer/fusion.ts, mcp_server/handlers/advisor-recommend.ts, mcp_server/schemas/advisor-tool-schemas.ts) — REQ-005
- [P] Add the all-lanes-healthy byte-identical regression assertion (mcp_server/tests/scorer/runtime-lane-health.vitest.ts) — REQ-004
- Add C5a/AMB legibility assertions: degraded-lane list + runtime live-lane count present; abstention surface reports degradation (mcp_server/tests/scorer/runtime-lane-health.vitest.ts, mcp_server/tests/handlers/advisor-recommend.vitest.ts, mcp_server/tests/schemas/advisor-tool-schemas.vitest.ts) — SC-003
- CHK-004 External aionforge reference is N/A in this workspace: local external/ tree is absent; implementation uses the packet's recorded degrade-to-remaining contract and does not depend on that doc
- CHK-011 No console errors or warnings in the advisor build/typecheck output

### Changed

- Capture the confidence baseline — representative prompt alpha routing surface nearby neutral words; baseline confidence 0.6060, degraded confidence 0.6189, delta +0.0129; liveNormalized 0.1600 -> 0.1839; pinned in mcp_server/tests/scorer/runtime-lane-health.vitest.ts — REQ-001
- C5: widened the liveTotal filter to also exclude runtime_degraded lanes; kept matched_nothing lanes in the denominator (mcp_server/lib/scorer/fusion.ts) — REQ-003
- Prove liveNormalized degrades-to-remaining for a degraded lane and is unchanged for a zero-match lane; mutation falsifier proved the test fails if degraded lanes remain in liveTotal (mcp_server/tests/scorer/runtime-lane-health.vitest.ts) — SC-001/SC-002
- AMB: report degraded-lane condition on the ambiguity/abstention surface without changing abstention thresholds (mcp_server/lib/scorer/fusion.ts, mcp_server/handlers/advisor-recommend.ts) — REQ-006
- tsc + targeted advisor suite green; mutation falsifier explicitly refuted the over-credit inversion by failing when degraded lanes remained in liveTotal — DoD
- All tasks marked [x]

### Fixed

- [P] Add degrade-vs-matched-nothing fixtures: degraded lane elided (confidence rises to degrade-to-remaining); zero-match lane retained (no over-credit) (mcp_server/tests/scorer/runtime-lane-health.vitest.ts) — SC-001/SC-002
- CHK-022 Degrade-to-remaining proven: survivor confidence rises to the measured corrected value when a lane is runtime-degraded (SC-001)
- CHK-023 Over-credit inversion explicitly refuted: zero-match lane fixture shows non-matching skills are NOT credited; mutation falsifier turned the denominator check red when the filter was removed (SC-002)
- CHK-FIX-001 Each candidate is classed: lane-health signal = algorithmic helper/types; C5 = normalization denominator; C5a = explanation/metrics; AMB = explanation surface.
- CHK-FIX-002 Same-class producer inventory done: rg -n 'liveTotal|liveNormalized|isLiveScorerLane|liveLaneCount' across system-skill-advisor/mcp_server.
- CHK-FIX-003 Consumer inventory done for changed surfaces: readers of metrics.liveLaneCount, confidence consumers (abstention/ambiguity/ranking ties), explanation consumers.

### Verification

- Tasks complete - 14 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- graph_causal-specific evidence. This phase wires handler-owned graph freshness into the scorer. The scorer option shape can represent other degraded lanes, but only graph_causal has production evidence here.
- External reference not locally readable. The packet cites the aionforge degrade-to-remaining pattern, but this workspace has no local external/ tree. The implementation does not depend on that file.
- Commit evidence N/A. The user explicitly forbade git commit; evidence is pinned to changed files and verification commands instead of SHAs.
- Adjacent candidates out of scope. C3 RRF, C4 Beta posterior + SA-two-gate chain, QCR query-class router, C1 split-conflict re-rank, and SA-asymmetric-deltas are explicitly out of scope here and tracked under sibling 028/003 sub-phases.
