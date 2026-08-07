---
title: "Spec 028 Changelog Index"
description: "Historical index for the final six-parent topology of spec 028, with former IDs preserved as explicit aliases."
trigger_phrases:
  - "028 changelog index"
  - "028 topology migration changelog"
  - "memory search intelligence changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 028 Changelog Index

This index mirrors the final six root-parent identities applied on 2026-07-11. Historical changelog file names and dated entries retain the IDs they had when written. Use the alias tables below to resolve an old identity to its final packet location.

## Final parent topology

| Final parent | Direct phases | Governed descendants | Changelog support |
|---|---:|---:|---|
| `001-release-cleanup` | 15 | 22 | [`001-release-cleanup/changelog-001-root.md`](./001-release-cleanup/changelog-001-root.md) |
| `002-speckit-memory` | 42 | 55 | [`002-speckit-memory/changelog-002-root.md`](./002-speckit-memory/changelog-002-root.md) |
| `003-spec-data-quality` | 20 | 66 | [`003-spec-data-quality/changelog-003-root.md`](./003-spec-data-quality/changelog-003-root.md) |
| `004-review-remediation` | 6 | 6 | [`004-review-remediation/changelog-004-root.md`](./004-review-remediation/changelog-004-root.md) |
| `005-dark-flag-graduation` | 11 | 12 | [`005-dark-flag-graduation/changelog-005-root.md`](./005-dark-flag-graduation/changelog-005-root.md) |
| `006-speckit-surface-alignment` | 6 | 6 | [`006-speckit-surface-alignment/changelog-006-root.md`](./006-speckit-surface-alignment/changelog-006-root.md) |

## Root-parent aliases

| Former identity | Final identity | Guidance |
|---|---|---|
| `000-release-cleanup` | `001-release-cleanup` | Historical file names keep `000` where that was the ID at publication. The support directory now follows `001-release-cleanup`. |
| `001-speckit-memory` | `002-speckit-memory` | Historical file names keep `001` where that was the ID at publication. The support directory now follows `002-speckit-memory`. |
| `002-spec-data-quality` | `003-spec-data-quality` | Historical file names keep `002` where that was the ID at publication. The support directory now follows `003-spec-data-quality`. |
| `003-review-remediation` | `004-review-remediation` | Historical file names keep `003` where that was the ID at publication. The support directory now follows `004-review-remediation`. |
| `004-dark-flag-graduation` | `005-dark-flag-graduation` | Historical file names keep `004` where that was the ID at publication. The support directory now follows `005-dark-flag-graduation`. |
| `005-speckit-surface-alignment` | `006-speckit-surface-alignment` | Historical file names keep `005` where that was the ID at publication. The support directory now follows `006-speckit-surface-alignment`. |

The former top-level support directory `016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory` is preserved under `002-speckit-memory/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory`. Its historical `016` file names remain unchanged, while the final spec phase identity is `002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory`.

## Moved shipped phases

Every moved phase below has a packet-local phase-template entry. The entry reports an evidence gap instead of upgrading status when the allowed task evidence is incomplete.

| Former identity | Final identity | Changelog entry | Evidence |
|---|---|---|---|
| `007-search-index-integrity-sweep` | `002-speckit-memory/008-search-index-integrity-sweep` | [`changelog-002-008-search-index-integrity-sweep.md`](./002-speckit-memory/changelog-002-008-search-index-integrity-sweep.md) | evidence gap: 17/24 tasks checked |
| `010-query-channel-calibration` | `002-speckit-memory/012-query-channel-calibration` | [`changelog-002-012-query-channel-calibration.md`](./002-speckit-memory/changelog-002-012-query-channel-calibration.md) | allowed evidence present |
| `011-automatic-drift-self-healing` | `002-speckit-memory/014-automatic-drift-self-healing` | [`changelog-002-014-automatic-drift-self-healing.md`](./002-speckit-memory/changelog-002-014-automatic-drift-self-healing.md) | evidence gap: 42/43 tasks checked |
| `012-orphan-sweep-scoped-scan-safety` | `002-speckit-memory/016-orphan-sweep-scoped-scan-safety` | [`changelog-002-016-orphan-sweep-scoped-scan-safety.md`](./002-speckit-memory/changelog-002-016-orphan-sweep-scoped-scan-safety.md) | allowed evidence present |
| `013-drift-marker-pipeline-resilience` | `002-speckit-memory/018-drift-marker-pipeline-resilience` | [`changelog-002-018-drift-marker-pipeline-resilience.md`](./002-speckit-memory/changelog-002-018-drift-marker-pipeline-resilience.md) | allowed evidence present |
| `014-self-healing-internals-hardening` | `002-speckit-memory/020-self-healing-internals-hardening` | [`changelog-002-020-self-healing-internals-hardening.md`](./002-speckit-memory/changelog-002-020-self-healing-internals-hardening.md) | allowed evidence present |
| `018-git-hooks-reinstall-and-guard` | `002-speckit-memory/025-git-hooks-reinstall-and-guard` | [`changelog-002-025-git-hooks-reinstall-and-guard.md`](./002-speckit-memory/changelog-002-025-git-hooks-reinstall-and-guard.md) | allowed evidence present |
| `020-query-time-filter-benchmark` | `002-speckit-memory/028-query-time-filter-benchmark` | [`changelog-002-028-query-time-filter-benchmark.md`](./002-speckit-memory/changelog-002-028-query-time-filter-benchmark.md) | allowed evidence present |
| `022-drift-marker-native-consolidation` | `002-speckit-memory/031-drift-marker-native-consolidation` | [`changelog-002-031-drift-marker-native-consolidation.md`](./002-speckit-memory/changelog-002-031-drift-marker-native-consolidation.md) | allowed evidence present |
| `023-self-healing-model-consolidation` | `002-speckit-memory/033-self-healing-model-consolidation` | [`changelog-002-033-self-healing-model-consolidation.md`](./002-speckit-memory/changelog-002-033-self-healing-model-consolidation.md) | allowed evidence present |
| `008-metadata-rename-reconciliation` | `003-spec-data-quality/007-metadata-rename-reconciliation` | [`changelog-003-007-metadata-rename-reconciliation.md`](./003-spec-data-quality/changelog-003-007-metadata-rename-reconciliation.md) | allowed evidence present |
| `009-validation-integrity-hardening` | `003-spec-data-quality/008-validation-integrity-hardening` | [`changelog-003-008-validation-integrity-hardening.md`](./003-spec-data-quality/changelog-003-008-validation-integrity-hardening.md) | allowed evidence present |
| `015-validation-hardening-fixes` | `003-spec-data-quality/009-validation-hardening-fixes` | [`changelog-003-009-validation-hardening-fixes.md`](./003-spec-data-quality/changelog-003-009-validation-hardening-fixes.md) | evidence gap: 31/32 tasks checked |
| `019-validation-enforce-graduation` | `003-spec-data-quality/010-validation-enforce-graduation` | [`changelog-003-010-validation-enforce-graduation.md`](./003-spec-data-quality/changelog-003-010-validation-enforce-graduation.md) | allowed evidence present |
| `016-cross-package-flag-governance` | `005-dark-flag-graduation/009-cross-package-flag-governance` | [`changelog-005-009-cross-package-flag-governance.md`](./005-dark-flag-graduation/changelog-005-009-cross-package-flag-governance.md) | allowed evidence present |
| `017-flag-vocabulary-consolidation` | `005-dark-flag-graduation/010-flag-vocabulary-consolidation` | [`changelog-005-010-flag-vocabulary-consolidation.md`](./005-dark-flag-graduation/changelog-005-010-flag-vocabulary-consolidation.md) | allowed evidence present |
| `021-graph-preservation-quality-benchmark` | `005-dark-flag-graduation/011-graph-preservation-quality-benchmark` | [`changelog-005-011-graph-preservation-quality-benchmark.md`](./005-dark-flag-graduation/changelog-005-011-graph-preservation-quality-benchmark.md) | allowed evidence present |
| `006-presentation-layer-fixes` | `006-speckit-surface-alignment/006-presentation-layer-fixes` | [`changelog-006-006-presentation-layer-fixes.md`](./006-speckit-surface-alignment/changelog-006-006-presentation-layer-fixes.md) | allowed evidence present |

## Reading historical entries

- Dates, shipment evidence and verification wording in existing files are preserved verbatim.
- A historical numeric prefix is provenance, not a stale path to silently renumber.
- Final navigation starts with one of the six parent support directories above.
- The 2026-07-11 migration entry in [`changelog-028-root.md`](./changelog-028-root.md) is the authoritative old-to-new topology crosswalk.
