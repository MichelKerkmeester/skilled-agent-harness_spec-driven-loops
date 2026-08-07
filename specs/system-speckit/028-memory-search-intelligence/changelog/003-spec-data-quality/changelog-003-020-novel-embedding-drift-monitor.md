---
title: "Changelog: Novel embedding-drift monitoring plus alerting [003-spec-data-quality/004-novel-research/020-novel-embedding-drift-monitor]"
description: "Chronological changelog for the Novel embedding-drift monitoring plus alerting phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/004-novel-research/020-novel-embedding-drift-monitor` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality`

### Summary

Nothing is built yet. This phase is a PLANNED scaffold with spec.md and plan.md and the Level 2 doc set in place and no code written. The sections below describe the planned capability so a builder can pick it up, not work that has shipped.

### Added

- No new additions recorded.

### Changed

- Nothing is built yet. This phase is a PLANNED scaffold with spec.md and plan.md and the Level 2 doc set in place and no code written. The sections below describe the planned capability so a builder can pick it up, not work that has shipped.

### Fixed

- No fixes recorded.

### Verification

- Strict doc validation (validate.sh --strict) - PASS for the doc set, this is the only check run at scaffold stage
- Same-regime byte-identity test - Not run (PLANNED scaffold)
- Two-regime scratch corpus alert - Not run (PLANNED scaffold)
- Backfill dry-run then apply census - Not run (PLANNED scaffold)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Planned modify | Add the regime fingerprint fields to the persistent vector record next to the existing PK |
| `.opencode/skills/system-spec-kit/shared/embeddings.ts` | Planned modify | Compute and surface the fingerprint at the embed seam so the stamp matches the cache identity |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/sweep/detect-embedding-drift.ts` | Planned create | The report-only detector that counts live regimes and alerts on a mixed corpus |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/sweep/backfill-embedding-regime.ts` | Planned create | The dry-run-then-apply backfill that stamps the existing corpus |

### Follow-Ups

- Build this capability per plan.md as a report-only or additive seam that never mutates an authored document body.
- It bypasses the 3-result truncation floor by construction, so it earns its keep on a non-retrieval metric of its own.
