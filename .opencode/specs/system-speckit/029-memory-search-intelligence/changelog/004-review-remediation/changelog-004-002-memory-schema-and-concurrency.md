---
title: "Changelog: Memory Schema and Concurrency Remediation [004-review-remediation/002-memory-schema-and-concurrency]"
description: "Chronological changelog for the memory schema and concurrency remediation phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-review-remediation/002-memory-schema-and-concurrency` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-review-remediation`

### Summary

This phase defines the remediation contract for three storage-layer findings and ships no code. The P1-2 derived-id split, the P1-4 in-lock embedding and the P1-5 retention spare-only stale snapshot all remain PENDING. The scaffold cites the exact source lines with quoted fix intent so a separate executing seat can land the fixes without re-deriving scope.

### Added
- No new additions recorded.

### Changed
- The phase docs were created from the spec-kit Level-2 structure and held in PENDING state. The three storage-layer fixes are deferred to a separate executing seat.

### Fixed
- No findings remediated yet. The scaffold groups three findings on the memory schema and storage concurrency surface that share a migration-safety risk profile. P1-2 cites `vector-index-schema.ts:1126` for the derived-id identity, P1-4 cites `consolidation.ts:701` for moving the embedding pass out of the write lock, and P1-5 cites `memory-retention-sweep.ts:612` for re-validating the retention spare axes inside the transaction.

### Verification
- Derived-id fix - PENDING.
- Consolidation lock fix - PENDING.
- Retention spare-axis fix - PENDING.
- Strict validation - run `validate.sh` on this child folder when the fixes land.

### Files Changed
- `spec.md`: created, defines scope, cited findings and acceptance criteria.
- `plan.md`: created, defines the fix approach and verification route.
- `tasks.md`: created, lists the pending remediation tasks.
- `checklist.md`: created, lists the pending verification checks.
- `implementation-summary.md`: created, records that this is scaffold only.

### Follow-Ups
- A later pass must confirm the cited facts and add migration-safety and concurrency tests before any completion claim.
- Two seat confidence caveats carry from the review and must be reconfirmed against the broader codebase during execution. The lineage stale-key re-root coverage gap and the `codeGraphEdgeBitemporalReadsEnabled` zero-callers claim were both scoped to `lib/` only.
