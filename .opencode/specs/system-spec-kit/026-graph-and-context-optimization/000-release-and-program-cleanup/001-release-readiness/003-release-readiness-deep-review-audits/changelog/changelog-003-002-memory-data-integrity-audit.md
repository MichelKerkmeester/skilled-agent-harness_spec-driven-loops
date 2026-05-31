---
title: "Memory Data Integrity Release-Readiness Audit"
description: "Read-only deep-review of memory subsystem data integrity for release readiness. Found no P0 primary-index corruption in the audited delete paths. Produced three P1 gaps (health consistency, retention race coverage, embedding-cache invalidation) and one P2 derived-index drift finding."
trigger_phrases:
  - "memory data integrity audit"
  - "memory subsystem release readiness"
  - "retention sweep correctness"
  - "embedding cache invalidation audit"
  - "DB consistency audit memory"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/002-memory-data-integrity-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits`

### Summary

Before this audit, no severity-classified assessment existed for memory subsystem data integrity. Operators had no release-gating evidence on whether `memory_health` health reporting, retention sweep behavior or embedding cache behavior was trustworthy enough to claim release readiness.

The audit covered all major memory handlers (save, search, context, bulk delete, retention sweep, health, index scan) reading source code, schema, governance library, the embedding cache module, retention test fixtures. It found no P0 evidence of direct primary-index corruption: the retention sweep calls the shared delete path, which removes vector/projection/causal rows inside a transaction. FTS cleanup is trigger-backed.

Three P1 gaps block a clean release-readiness claim. First, `memory_health` can report `healthy` without a complete DB consistency verdict. Second, the retention/save race fixture is not a true concurrent-writer test. Third, governed retention deletes do not define an embedding-cache invalidation path. One P2 finding covers derived BM25 stale-result drift.

### Added

- None. Review-only phase.

### Changed

- None. Review-only phase.

### Fixed

- None. Review-only phase.

### Verification

- `review-report.md`: 9-section deep-review report with verdict CONDITIONAL. P0 count 0, P1 count 3, P2 count 1.
- P1-001: `memory_health` can overstate DB consistency. Evidence at `memory-crud-health.ts`.
- P1-002: Retention/save race coverage uses a single synchronous connection, not true concurrent writers. Evidence at `memory-retention-sweep.vitest.ts`.
- P1-003: Governed retention deletes remove primary rows but leave no defined embedding-cache invalidation path. Evidence at `embedding-cache.ts`.
- P2-001: BM25 derived index cleanup is best-effort. Stale unscoped BM25 hits can appear in search results after governed deletes.
- Packet scope: authored files are packet-local only. No audited memory subsystem source was modified.
- Strict validator: PASS. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/002-memory-data-integrity-audit --strict` exits 0.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `002-memory-data-integrity-audit/review-report.md` (NEW) | Created | Final 9-section release-readiness review report with verdict and P0/P1/P2 findings. |
| `002-memory-data-integrity-audit/spec.md` (NEW) | Created | Audit scope, constraints, acceptance criteria. |
| `002-memory-data-integrity-audit/plan.md` (NEW) | Created | Evidence-first audit plan and validation strategy. |
| `002-memory-data-integrity-audit/tasks.md` (NEW) | Created | Completed audit step ledger. |
| `002-memory-data-integrity-audit/checklist.md` (NEW) | Created | Verification checklist with evidence rows. |
| `002-memory-data-integrity-audit/implementation-summary.md` (NEW) | Created | Summary of delivered audit packet. |
| `002-memory-data-integrity-audit/description.json` (NEW) | Created | Memory metadata for the packet. |
| `002-memory-data-integrity-audit/graph-metadata.json` (NEW) | Created | Graph metadata and dependency pointers. |

### Follow-Ups

- Remediate P1-001: add a `db_consistency` field to `memory_health` responses that reflects the actual FTS and vector index check result, not a best-effort proxy.
- Remediate P1-002: replace the single-connection retention race fixture with a real multi-writer concurrent test to prove save/sweep interleaving safety.
- Remediate P1-003: define and enforce an embedding-cache invalidation step inside the governed retention delete path so cached embeddings for deleted rows are cleared.
- Remediate P2-001: add a BM25 index cleanup call to the memory delete path or document the accepted staleness window for operators.
