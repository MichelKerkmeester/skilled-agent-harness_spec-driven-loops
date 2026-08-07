---
title: "Search and Routing Tuning Coordination Parent"
description: "Coordination parent for three shipped sub-tracks: search-fusion tuning, content-routing accuracy, and graph-metadata validation."
trigger_phrases:
  - "search and routing tuning"
  - "search fusion reranker tuning"
  - "content routing accuracy"
  - "graph metadata validation"
  - "phase changelog"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/001-memory-search-routing-tuning` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine`

### Summary

Three parallel sub-tracks shipped addressing all aspects of search-pipeline and routing accuracy. The 19 leaf sub-phases across all tracks are complete. See Sub-phase summaries below for per-track detail.

### Added

Cross-encoder length penalty neutralized to return 1.0 so scoring is now neutral. Process-wide cache telemetry added to getRerankerStatus(). Internal continuity adaptive-fusion weight profile added with separate semantic and keyword weights. Continuity profile validation added with a judged 12-query fixture confirming K=60 baseline. Tier 3 content router wired as an always-on save-path dependency with LLM classification. Document-wide prevalidation added for task-update merge safety. Checklist-aware status derivation added to graph-metadata parser. Key files sanitized against noise classes before storage. Entities deduplicated using canonical-path preference. Real path resolution added for key file candidates with cross-track fallback.

### Changed

Rerank minimum raised from 2 to 4 so small candidate sets skip unnecessary API work. Graph-metadata backfill scoped to active packets by default so archive folders are skipped unless explicitly opted in. Entity cap raised from 16 to 24 so real packet runs no longer hit the limit. Canonical entity scope check tightened to current folder so cross-spec entity leaks are prevented.

### Fixed

Tier 1 router delivery-versus-progress asymmetry corrected so delivery scores against sequencing gating rollout and verification mechanics. Hard drop detection split from soft operational cues so handover notes mentioning git diff or list memories are preserved. Path resolution now rejects obsolete paths so unresolvable candidates are dropped before the cap. No verification failures across any sub-phase.

### Verification

npx tsc --noEmit all sub-phases PASS
npx vitest run all sub-phase test files PASS
bash validate.sh strict PASS
graph-metadata-schema vitest 14/14 PASS
graph-metadata-backfill vitest 3/3 PASS
backfill-graph-metadata.js 541 packets refreshed PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| Packet docs | Created | spec plan tasks checklist implementation-summary at parent level |

### Follow-Ups

The continuity fixture is synthetic. Future retuning should use real-query evidence.
applyLengthPenalty remains a compatibility term. Future schema changes may allow clean removal.
