---
title: "Changelog: A9 Read-Time Content-Hash Integrity Verification [005-spec-data-quality/009-a9-content-hash-integrity]"
description: "Chronological changelog for the A9 Read-Time Content-Hash Integrity Verification phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/009-a9-content-hash-integrity` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Added

- No new additions recorded.

### Changed

- Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Fixed

- No fixes recorded.

### Verification

- A corrupted scratch row is reported in contentHashMismatches with its id - PLANNED, not yet run
- A clean corpus reports zero mismatches - PLANNED, not yet run
- A re-read of a mismatched row proves no body or hash mutation - PLANNED, not yet run
- The flag-off integrity summary keeps the current shape with no extra read - PLANNED, not yet run
- validate.sh --strict on the phase folder exits 0 - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Planned modify | Add the read-time recompute branch to verify_integrity and surface contentHashMismatches behind a default-off flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts` | Read-only reuse | Reuse hashContentBody for the recompute, no change to the helper |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | Read-only reference | Pin the exact body form against the save-side content_hash write so the read form matches the write form |

### Follow-Ups

- Build this on-write gate per plan.md. The A1, B1 and B2 surfaces share the safe-fix engine in `026-shared-safe-fix-engine`, so build that first.
- Land it default-off and warn first, then flip to error only after the corpus backfill reads zero, per the migration sequence in `028-governance-rollout`.
