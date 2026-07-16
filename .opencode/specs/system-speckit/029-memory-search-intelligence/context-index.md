# Context Index — Packet 028 Migration and Alias Bridge

> Current navigation, historical migration record and exact alias guidance for
> `029-memory-search-intelligence`. Root governance lives in `spec.md`; the
> complete machine mapping lives in `scratch/topology-migration-manifest.json`.

## 1. Current applied topology (2026-07-11)

The migration manifest is `applied`. Its post-apply gates confirm exactly six root parents (`001` through `006`), 173 governed phases, seven numbered support directories, 180 numbered directories overall, contiguous sibling groups, 18 moved former-root leaves, absent old machine-canonical paths and resolved canonical targets.

| Canonical root | Historical root alias | Direct children | Governed descendants | Maximum nested depth | Theme |
|----------------|-----------------------|----------------:|---------------------:|---------------------:|-------|
| `001-release-cleanup/` | `000-release-cleanup/` | 15 | 22 | 2 | Release documentation and readiness cleanup |
| `002-speckit-memory/` | `001-speckit-memory/` | 42 | 55 | 2 | Memory retrieval, indexing, reliability and evaluation |
| `003-spec-data-quality/` | `002-spec-data-quality/` | 20 | 66 | 2 | Data quality, metadata generation, validation and migration |
| `004-review-remediation/` | `003-review-remediation/` | 6 | 6 | 1 | Review-remediation scopes |
| `005-dark-flag-graduation/` | `004-dark-flag-graduation/` | 11 | 12 | 2 | Dark-flag graduation and flag governance |
| `006-speckit-surface-alignment/` | `005-speckit-surface-alignment/` | 6 | 6 | 1 | Surface alignment and presentation fixes |

“Governed descendants” excludes the root itself. The six roots plus 167 descendants equal the manifest’s 173 governed phases. All canonical paths above resolve; all six historical root paths are absent.

### Alias resolution rules

1. Treat the manifest `aliases` object as the complete authority. It contains one exact old-to-new mapping for every governed phase.
2. Use root aliases only as a first routing hint. Descendant ordinals changed in several groups, so prefix substitution alone is unsafe.
3. Former root leaves listed below moved under thematic parents and received new sibling ordinals.
4. Seven numbered support directories are classified separately in `support_directories`; do not count or route them as governed phases.
5. Dated records may retain historical paths as evidence. Active links, commands and recovery pointers use canonical targets.

### Former root leaves nested by theme

| Historical path | Canonical path |
|-----------------|----------------|
| `007-search-index-integrity-sweep/` | `002-speckit-memory/008-search-index-integrity-sweep/` |
| `010-query-channel-calibration/` | `002-speckit-memory/012-query-channel-calibration/` |
| `011-automatic-drift-self-healing/` | `002-speckit-memory/014-automatic-drift-self-healing/` |
| `012-orphan-sweep-scoped-scan-safety/` | `002-speckit-memory/016-orphan-sweep-scoped-scan-safety/` |
| `013-drift-marker-pipeline-resilience/` | `002-speckit-memory/018-drift-marker-pipeline-resilience/` |
| `014-self-healing-internals-hardening/` | `002-speckit-memory/020-self-healing-internals-hardening/` |
| `018-git-hooks-reinstall-and-guard/` | `002-speckit-memory/025-git-hooks-reinstall-and-guard/` |
| `020-query-time-filter-benchmark/` | `002-speckit-memory/028-query-time-filter-benchmark/` |
| `022-drift-marker-native-consolidation/` | `002-speckit-memory/031-drift-marker-native-consolidation/` |
| `023-self-healing-model-consolidation/` | `002-speckit-memory/033-self-healing-model-consolidation/` |
| `008-metadata-rename-reconciliation/` | `003-spec-data-quality/007-metadata-rename-reconciliation/` |
| `009-validation-integrity-hardening/` | `003-spec-data-quality/008-validation-integrity-hardening/` |
| `015-validation-hardening-fixes/` | `003-spec-data-quality/009-validation-hardening-fixes/` |
| `019-validation-enforce-graduation/` | `003-spec-data-quality/010-validation-enforce-graduation/` |
| `016-cross-package-flag-governance/` | `005-dark-flag-graduation/009-cross-package-flag-governance/` |
| `017-flag-vocabulary-consolidation/` | `005-dark-flag-graduation/010-flag-vocabulary-consolidation/` |
| `021-graph-preservation-quality-benchmark/` | `005-dark-flag-graduation/011-graph-preservation-quality-benchmark/` |
| `006-presentation-layer-fixes/` | `006-speckit-surface-alignment/006-presentation-layer-fixes/` |

### Thematic nesting guide

- `001-release-cleanup/` preserves 15 direct release-readiness children; its drift-remediation and manual-playbook branches account for seven deeper descendants.
- `002-speckit-memory/` has 42 direct children. The 13-child deep-dive remediation program remains nested at `041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`.
- `003-spec-data-quality/` has 20 direct children. Six thematic groups (`001` through `006`) contain 44 deeper descendants, while direct children `007` through `020` hold later integrity, validation and archive-alignment work.
- `004-review-remediation/` has six direct children and no deeper governed phase.
- `005-dark-flag-graduation/` has 11 direct children; `007-graduation-follow-ups/` contains one deeper governed phase.
- `006-speckit-surface-alignment/` has six direct children and no deeper governed phase; presentation-layer fixes are child `006`.

## 2. Historical subsystem extraction (2026-07-06)

This section is preserved history, not current navigation. Three subsystems that had accreted under 028 were extracted to their own sibling packets while keeping their internal phase numbering.

### Batch 1 — primary clusters

| From at the time | Destination | Notes |
|------------------|-------------|-------|
| `002-code-graph/` (parent + 11 children) | `system-code-graph/001-code-graph-core/` | Seeded the formerly empty subsystem packet |
| `004-deep-loop/` (parent + 6 children + `007` sub-parent + 4) | `system-deep-loop/038-deep-loop-runtime/` | Reconciled stale root child identities |
| `002-skill-advisor/` phases 001-008 | `system-skill-advisor/002-skill-advisor-runtime/` | The hard-rule follow-up was temporarily held in 028 |

### Batch 2 — scattered subsystem children

| Subsystem | Historical sources | Destination range |
|-----------|--------------------|-------------------|
| code-graph | Children from the cross-cutting 007/008 suites | `system-code-graph/002-006` |
| deep-loop | Finding-dedup, gauges and research-instrumentation children | `system-deep-loop/039-041` |
| skill-advisor | RRF-fusion and penalty-contract children | `system-skill-advisor/003-004` |

Rollup changelogs moved to the destination packets, current rollup docs were repointed and frozen benchmark evidence remained unchanged. The migration used subtree moves, self-reference rewrites and regenerated identity metadata. Remaining content debt was not represented as newly completed work.

## 3. Historical root snapshots (superseded)

- **2026-07-06 snapshot:** roots included release cleanup, memory, a temporarily held skill-advisor follow-up, data quality, review remediation, dark-flag graduation and surface alignment.
- **2026-07-07 snapshot:** the held skill-advisor follow-up moved to `system-skill-advisor/011-skill-advisor-phase-parent/`. Packet 028 then used roots `000` through `005`. That numbering is historical.
- **2026-07-10 snapshot:** eighteen follow-up leaves occupied roots `006` through `023`. That flat placement is historical even though the work records remain valid at their canonical nested destinations.
- **2026-07-11 current state:** six thematic parents occupy roots `001` through `006`; the 18 former root leaves are nested as listed in Section 1.

Do not use a historical snapshot for current-scope lookup. Resolve paths through the manifest.

## 4. Preserved implementation-history summary

Implementation statements below summarize existing records and remain historical evidence, not a fresh completion claim.

### Memory deep-dive remediation

The former `001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory` path is now `002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory`. Its existing record reports 13 shipped child phases and a 14-folder strict-validation pass at that time.

### Spec data-quality

The former `002-spec-data-quality/` root is now `003-spec-data-quality/`. Existing records cover on-write quality, retroactive automation, retrieval-gated tuning, novel research, shared-engine work, generated metadata, migration and later integrity phases. Its root `implementation-summary.md` contains explicit correction notes and historical contradictions, so phase-local summaries remain the authority for any present implementation claim.

### Deferred daemon-side item from the earlier session

The earlier record diagnosed missing vectors after retry-retention backpressure and described a restart-gated recovery sequence. This remains historical operational context. It is not evidence that the recovery was executed during the topology migration or this documentation alignment.

## 5. Recovery pointers

1. Start at root `spec.md` for the six-parent map.
2. If a prompt or record names an old path, look it up in `scratch/topology-migration-manifest.json` under `aliases`.
3. Open the canonical parent’s `spec.md`, then descend to its current child.
4. Read phase-local `implementation-summary.md` before relying on implementation status.
5. Use `handover.md` for current continuation and `scratch/topology-migration-log.md` for the applied transaction evidence.
