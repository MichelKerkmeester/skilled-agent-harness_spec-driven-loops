---
title: "Phase Parent Rollup: 007 Memclaw Derived Memory Hardening"
description: "Rollup of 5 child phase changelogs under 007-memclaw-derived-memory-hardening. Schema advanced from v34 to v37. Write-ingress provenance guard is always-on. Idempotency receipts and tombstone soft-deletes are default-off and flag-gated. Feedback safety posture is locked in with reserved-type rejection and shadow-only invariants. Stale-exclusion audit and tool-ownership lint add read-only governance. Detail lives in each child changelog."
trigger_phrases:
  - "007-memclaw-derived-memory-hardening rollup"
  - "007-memclaw-derived-memory-hardening phase parent"
  - "memclaw memory hardening changelog index"
  - "schema v37 memclaw rollup"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening` (Level 2, Phase Parent)

### Summary

This phase parent groups 5 child phases shipped on 2026-06-10. Each child shipped independently and carries its own changelog with full verification detail. The overarching theme is hardening derived memory writes on three dimensions: provenance integrity, idempotency safety, and lifecycle governance.

The schema advanced from v34 to v37 across three additive migrations. The write-ingress provenance guard (leaf 001) is always-on: every write now carries a server-derived `source_kind`, and automated writes that would overwrite protected manual or constitutional fields are blocked at pre-mutation time. The idempotency receipt table and near-duplicate advisory (leaf 002) ship at schema v36 behind `SPECKIT_MEMORY_IDEMPOTENCY` defaulting off. The tombstone partition and retention sweep gate (leaf 004) ship at schema v37 behind `SPECKIT_SOFT_DELETE_TOMBSTONES` defaulting off. Both flag-gated features require follow-up recall filtering before they are safe to enable.

Leaf 003 locks in the feedback safety posture: forged reserved feedback types are rejected at dispatch, feedback capture remains shadow-only, and three invariants any future reducer must honor are recorded as inert contract helpers. Leaf 005 adds two read-only governance surfaces: a stale-exclusion audit through `memory_health` and a blocking pre-commit tool-ownership drift gate derived from `TOOL_DEFINITIONS`.

### Included Phases

| Changelog | Date | Title |
|-----------|------|-------|
| [changelog-007-001-provenance-and-audit.md](./changelog-007-001-provenance-and-audit.md) | 2026-06-10 | Memclaw Derived Memory Hardening 001: Provenance and Audit |
| [changelog-007-002-idempotency-and-near-duplicate.md](./changelog-007-002-idempotency-and-near-duplicate.md) | 2026-06-10 | Memclaw Derived Memory Hardening 002: Idempotency and Near-Duplicate |
| [changelog-007-003-feedback-log-and-005-reframe.md](./changelog-007-003-feedback-log-and-005-reframe.md) | 2026-06-10 | Memclaw Derived Memory Hardening 003: Feedback Safety-Posture Lock-In |
| [changelog-007-004-tombstones-and-edge-promotion.md](./changelog-007-004-tombstones-and-edge-promotion.md) | 2026-06-10 | Memclaw Derived Memory Hardening 004: Tombstones and Edge Promotion |
| [changelog-007-005-stale-audit-and-tool-ownership.md](./changelog-007-005-stale-audit-and-tool-ownership.md) | 2026-06-10 | Memclaw Derived Memory Hardening 005: Stale-Exclusion Audit and Tool-Ownership Lint |

### Added

- None. Detail lives in the child phase changelogs.

### Changed

- None. Detail lives in the child phase changelogs.

### Fixed

- None. Detail lives in the child phase changelogs.

### Verification

- All 5 child phases were verified independently. See each child changelog for per-phase test counts, build results, and strict-validation evidence.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `007-memclaw-derived-memory-hardening/` (child phases) | n/a | Rollup of 5 child phase changelogs; no direct source changes at the parent level. |

### Follow-Ups

- `SPECKIT_MEMORY_IDEMPOTENCY` and `SPECKIT_SOFT_DELETE_TOMBSTONES` both require follow-up work before enabling. Idempotency requires near-duplicate embedding coverage. Tombstones require recall-surface `deleted_at IS NULL` filtering and cache invalidation across search, list, get, context, and triggers.
- Automated callers introduced in later phases must inject `__provenanceContext` to remain governed by the write-ingress provenance guard.
- Active feedback reducers (ranking, retention, FSRS mutation) remain deferred pending ledger quality measurement in the 005 diagnostics-first children.
