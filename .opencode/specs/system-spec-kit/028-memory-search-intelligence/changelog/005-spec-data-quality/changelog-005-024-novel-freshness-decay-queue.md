---
title: "Changelog: Novel Freshness Decay Auto-Refresh Queue [005-spec-data-quality/004-novel-research/024-novel-freshness-decay-queue]"
description: "Chronological changelog for the Novel Freshness Decay Auto-Refresh Queue phase."
trigger_phrases:
 - "phase changelog"
 - "nested changelog"
 - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-21

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/004-novel-research/024-novel-freshness-decay-queue` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Nothing is built in this phase yet. The folder is a PLANNED scaffold and the section below describes the intended build, not shipped work. No code, table or registry entry exists yet.

### Added

- No new additions recorded.

### Changed

- Nothing is built in this phase yet. The folder is a PLANNED scaffold and the section below describes the intended build, not shipped work. No code, table or registry entry exists yet.

### Fixed

- No fixes recorded.

### Verification

- validate.sh --strict on this folder - Doc structure PASS, feature not yet built
- vitest detector and queue tests - Not yet written, PLANNED
- Apply run over a decayed fixture leaves the git working tree clean - Not yet run, PLANNED

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/scripts/detectors/freshness-decay.ts` | Planned create | Read the shipped retrievability and emit report-only queue rows |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/refresh-queue.ts` | Planned create | The refresh_queue table and accessor mirrored on learned_feedback_audit |
| `.opencode/skills/system-spec-kit/scripts/detectors/detector-registry.ts` | Planned modify | Register freshness.decay with fixClass: none behind a default-off flag |

### Follow-Ups

- Build this capability per plan.md as a report-only or additive seam that never mutates an authored document body.
- It bypasses the 3-result truncation floor by construction, so it earns its keep on a non-retrieval metric of its own.
