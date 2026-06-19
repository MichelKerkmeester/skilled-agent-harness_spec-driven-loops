---
title: "Changelog: Summary Fusion and World-Summary Grounding [001-speckit-memory/015-summary-fusion-grounding]"
description: "Chronological changelog for the Summary Fusion and World-Summary Grounding phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

Nothing is implemented yet. This sub-phase is a re-plan output: it scopes two paired retrieval-intelligence candidates over the already-built summary/community substrate, both PENDING (neither appears in the Wave-0 shipped record 030-memory-search-intelligence-impl/spec.md §14).

### Added

- Add summary/community to the ChannelName union (query-router.ts:36) [10m]
- Update all hardcoded channel-list sites to include the new channel (query-router.ts:68,:74,:106-107; routing-telemetry.ts:17; hybrid-search.ts:1310,:951) [25m]
- Add a default-off shadow flag for the fused lane (search-flags.ts) [10m]
- Add a per-channel weight slot for the lane in the adaptive-weight model (artifact-routing.ts) [25m]
- Add a prelude provider that selects the relevant hierarchy slice (memory-summaries.ts) [25m]
- Add a default-off shadow flag for the grounding prelude (search-flags.ts) [10m]

### Changed

- Read the five hardcoded channel-list sites (hybrid-search.ts:1310,:951; query-router.ts:36,:68,:74,:106-107; routing-telemetry.ts:17) [15m]
- Read the RRF lists.push fusion site (hybrid-search.ts:~1394-1495) and the adaptive-weight model (artifact-routing.ts) [15m]
- [P] Read both legacy inject paths: community fallback (memory-search.ts:1158-1228) + summary stage-1 inject (stage1-candidate-gen.ts:~1304-1326) [15m]
- [P] Read searchCommunities (community-search.ts:101), querySummaryEmbeddings (memory-summaries.ts:213), and the flat summaries index [15m]
- Adapt searchCommunities + querySummaryEmbeddings output into the fused ranked-list shape (community-search.ts, memory-summaries.ts) [30m]
- Push the fused lane into the RRF fusion site behind the shadow flag (hybrid-search.ts:~1394-1495) [30m]

### Fixed

- No fixes recorded.

### Verification

- Tasks complete - 27 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-001 Requirements documented in spec.md
- CHK-002 Technical approach defined in plan.md
- CHK-003 Scope exclusions documented
- CHK-010 Summary/community is a first-class weighted RRF lane
- CHK-011 No double-counting of summary/community evidence
- CHK-012 Adaptive-weight model carries a per-channel slot for the lane
