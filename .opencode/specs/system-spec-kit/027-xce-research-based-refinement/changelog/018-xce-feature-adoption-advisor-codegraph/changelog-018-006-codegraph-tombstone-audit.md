---
title: "Changelog: 006-codegraph-tombstone-audit"
description: "Code graph cleanup gained a default-off, count-bounded tombstone audit trail for file, node, and edge deletions."
trigger_phrases:
  - "018 006 codegraph tombstone changelog"
  - "code graph tombstone audit"
  - "SPECKIT_CODE_GRAPH_TOMBSTONES"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph`

### Summary

Code graph cleanup can now retain bounded deletion lineage when `SPECKIT_CODE_GRAPH_TOMBSTONES=true`. The default path stays unchanged: with the flag unset, no tombstone table is created and no tombstone rows are written.

### Added

- Flag-gated tombstone schema, deletion capture, retention pruning, and stats summary.
- Scan/status output fields for retained tombstone counts and recent entries.
- Tombstone tests for default-off behavior, enabled lineage, pruning, and query isolation.

### Changed

- Scan cleanup now passes explicit deletion reasons.

### Fixed

- Operators can inspect why retained code-graph nodes or edges disappeared when audit mode is enabled.

### Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS |
| Build | PASS |
| Tombstone/db/scan/status tests | PASS: 4 files, 55 tests |
| Comment hygiene | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/code-graph-db.ts` | Modified | Tombstone schema, capture, pruning, stats |
| `handlers/scan.ts` | Modified | Explicit cleanup reasons and tombstone summary |
| `handlers/status.ts` | Modified | Tombstone summary in status output |
| `tests/code-graph-tombstones.vitest.ts` | Created | Tombstone coverage |
| `tests/code-graph-scan.vitest.ts` | Modified | Cleanup reason assertions |

### Follow-Ups

- Tombstones are audit-only and bounded; they do not restore deleted nodes or edges.
