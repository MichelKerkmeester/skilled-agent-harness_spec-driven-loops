---
title: "Changelog: 003-skill-feature-catalog"
description: "Added 15 missing current-state feature catalog entries for shipped 027 release features and reconciled the mutation count self-check."
trigger_phrases:
  - "000 003 feature catalog changelog"
  - "release cleanup feature catalog"
  - "feature catalog source traceability"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/003-skill-feature-catalog` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup`

### Summary

The system-spec-kit feature catalog gained 15 missing current-state entries for shipped 027 features. The pass kept the existing catalog shape, skipped a duplicate spec-memory CLI entry that was already covered, and reconciled the mutation count self-check from 12 to 13.

### Added

- Catalog entries for semantic trigger shadow matching, trigger embedding backfill, provenance guards, memory idempotency, tombstones, causal cleanup, learning reducers, retrieval observability, completion freshness, code-index and skill-advisor CLI front doors, stale-exclusion audit, two constitutional rules, and OpenLTM continuity resilience.

### Changed

- Updated `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` with the new rows and count self-check.
- Reconciled this phase's spec docs to complete.

### Fixed

- Corrected the mutation section documented count so it matches parsed root entries after additions.

### Verification

| Check | Result |
|-------|--------|
| SOURCE FILES path existence | PASS: every new entry path exists |
| Count self-check | PASS: documented mutation count and parsed count are both 13 |
| Strict validation | PASS: child phase `validate.sh --strict` exited 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/feature_catalog/**` | Modified/Created | 15 feature entries and root count update |
| `003-skill-feature-catalog/{spec.md,plan.md,tasks.md,implementation-summary.md}` | Updated | Phase completion evidence reconciled |

### Follow-Ups

- Unrelated root catalog drift outside the touched self-check remains documented as pre-existing scope.
