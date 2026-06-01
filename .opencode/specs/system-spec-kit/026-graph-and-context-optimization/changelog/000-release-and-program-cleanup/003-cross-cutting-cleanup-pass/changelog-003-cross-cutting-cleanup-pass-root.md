---
title: "Phase Parent Rollup: cross cutting cleanup pass"
description: "Rollup of 31 child phase changelogs under 003-cross-cutting-cleanup-pass. Each child shipped independently and is listed in the Included Phases table. Detail lives in the child changelogs."
trigger_phrases:
  - "003-cross-cutting-cleanup-pass rollup"
  - "003-cross-cutting-cleanup-pass phase parent"
  - "003-cross-cutting-cleanup-pass changelog index"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass` (Level 3, Phase Parent)

### Summary

This phase parent groups 31 child phases spanning 2026-04-28 to 2026-05-31. Each child phase shipped independently and carries its own changelog with full detail. The Included Phases table below is the authoritative child inventory. Read each child changelog for the per-phase summary, verification, and files changed.

### Included Phases

| Changelog | Date | Title |
|-----------|------|-------|
| [changelog-003-001-fix-memory-indexer-storage-boundary.md](./001-fix-memory-indexer-storage-boundary/changelog-003-001-fix-memory-indexer-storage-boundary.md) | 2026-04-28 | Memory-Indexer Storage-Boundary Remediation |
| [changelog-003-002-search-query-rag-optimization.md](./002-search-query-rag-optimization/changelog-003-002-search-query-rag-optimization.md) | 2026-04-28 | Cross-Cutting Cleanup 002: Search Query RAG Optimization |
| [changelog-003-003-vitest-baseline-recovery.md](./003-vitest-baseline-recovery/changelog-003-003-vitest-baseline-recovery.md) | 2026-05-08 | Vitest baseline recovery: 198-test triage and changelog correction |
| [changelog-003-004-search-rag-measurement-implementation.md](./004-search-rag-measurement-implementation/changelog-003-004-search-rag-measurement-implementation.md) | 2026-04-29 | Search RAG Measurement-Driven Implementation: W3-W7 Dispositions |
| [changelog-003-005-vestigial-embedding-readiness-gate-removal.md](./005-vestigial-embedding-readiness-gate-removal/changelog-003-005-vestigial-embedding-readiness-gate-removal.md) | 2026-04-29 | Cleanup: Delete Vestigial Embedding-Readiness Gate from memory-search.ts |
| [changelog-003-006-stale-documentation-readme-fixes.md](./006-stale-documentation-readme-fixes/changelog-003-006-stale-documentation-readme-fixes.md) | 2026-04-29 | Stale Doc + README Fixes (Tier 1+2) |
| [changelog-003-007-vitest-broad-suite-honesty.md](./007-vitest-broad-suite-honesty/changelog-003-007-vitest-broad-suite-honesty.md) | 2026-04-29 | Broad-Suite Vitest Honesty: Investigation and 026 Claim Correction |
| [changelog-003-008-remove-sk-doc-legacy-template-debt.md](./008-remove-sk-doc-legacy-template-debt/changelog-003-008-remove-sk-doc-legacy-template-debt.md) | 2026-04-29 | sk-doc Legacy Template Debt Cleanup |
| [changelog-003-010-half-auto-upgrade-doc-alignment.md](./010-half-auto-upgrade-doc-alignment/changelog-003-010-half-auto-upgrade-doc-alignment.md) | 2026-04-29 | Changelog: Half-Auto Upgrade Doc Alignment |
| [changelog-003-011-cli-matrix-adapter-runners.md](./011-cli-matrix-adapter-runners/changelog-003-011-cli-matrix-adapter-runners.md) | 2026-04-29 | CLI Matrix Adapter Runners: External CLI Adapter Layer for Packet 030 Matrix |
| [changelog-003-012-code-graph-catalog-and-playbook.md](./012-code-graph-catalog-and-playbook/changelog-003-012-code-graph-catalog-and-playbook.md) | 2026-04-29 | code_graph runtime feature catalog and manual testing playbook |
| [changelog-003-013-evergreen-doc-packet-id-removal.md](./013-evergreen-doc-packet-id-removal/changelog-003-013-evergreen-doc-packet-id-removal.md) | 2026-04-29 | Evergreen Doc Packet ID Removal |
| [changelog-003-014-resource-map-memory-finalization.md](./014-resource-map-memory-finalization/changelog-003-014-resource-map-memory-finalization.md) | 2026-04-29 | Resource Map and Memory Finalization Pass |
| [changelog-003-015-root-readme-refresh.md](./015-root-readme-refresh/changelog-003-015-root-readme-refresh.md) | 2026-04-29 | Changelog: Root README Refresh with Verified Counts and Evergreen Cleanup |
| [changelog-003-016-runtime-hook-plugin-testing.md](./016-runtime-hook-plugin-testing/changelog-003-016-runtime-hook-plugin-testing.md) | 2026-04-29 | Cleanup Pass Phase 016: Hook Plugin Per Runtime Testing |
| [changelog-003-017-hook-test-sandbox-fix.md](./017-hook-test-sandbox-fix/changelog-003-017-hook-test-sandbox-fix.md) | 2026-04-29 | Hook Test Sandbox Fix: Separate Direct Smokes from Live CLI Verdicts |
| [changelog-003-018-matrix-runner-snake-case-rename.md](./018-matrix-runner-snake-case-rename/changelog-003-018-matrix-runner-snake-case-rename.md) | 2026-04-29 | 047 matrix_runners Snake Case Rename |
| [changelog-003-019-feature-catalog-shape-realignment.md](./019-feature-catalog-shape-realignment/changelog-003-019-feature-catalog-shape-realignment.md) | 2026-04-30 | Feature Catalog Shape Realignment: Canonical Four-Section Snippet Enforcement |
| [changelog-003-020-cocoindex-feature-catalog.md](./020-cocoindex-feature-catalog/changelog-003-020-cocoindex-feature-catalog.md) | 2026-04-30 | CocoIndex Feature Catalog: 46-snippet inventory for the mcp-coco-index skill |
| [changelog-003-021-sk-doc-conformance-template-sweep.md](./021-sk-doc-conformance-template-sweep/changelog-003-021-sk-doc-conformance-template-sweep.md) | 2026-05-18 | sk-doc Conformance Sweep and Template Cleanup |
| [changelog-003-022-cli-skills-baseline-overlay-contract.md](./022-cli-skills-baseline-overlay-contract/changelog-003-022-cli-skills-baseline-overlay-contract.md) | 2026-05-31 | CLI Skills Baseline and Overlay Contract |
| [changelog-003-023-fix-baseline-test-failures.md](./023-fix-baseline-test-failures/changelog-003-023-fix-baseline-test-failures.md) | 2026-04-30 | Pre-Existing Test Failure Remediation |
| [changelog-003-024-daemon-concurrency-fixes.md](./024-daemon-concurrency-fixes/changelog-003-024-daemon-concurrency-fixes.md) | 2026-05-01 | Daemon Concurrency Fixes: Four Race Conditions Closed in the Skill-Advisor Daemon |
| [changelog-003-025-readme-architecture-diagrams-topology.md](./025-readme-architecture-diagrams-topology/changelog-003-025-readme-architecture-diagrams-topology.md) | 2026-05-02 | 025 README Architecture Diagrams and Topology |
| [changelog-003-026-readme-code-template-governance.md](./026-readme-code-template-governance/changelog-003-026-readme-code-template-governance.md) | 2026-05-02 | README Code Template Governance: Template Revisions, Diagram Styling, Batch README Remediation |
| [changelog-003-027-missing-code-readme-resource-map.md](./027-missing-code-readme-resource-map/changelog-003-027-missing-code-readme-resource-map.md) | 2026-05-02 | Missing Code READMEs Resource Map: 65-folder manifest and README creation |
| [changelog-003-028-documentation-alignment-readme-fill-in.md](./028-documentation-alignment-readme-fill-in/changelog-003-028-documentation-alignment-readme-fill-in.md) | 2026-05-07 | Phase 028: Documentation Alignment and Missing README Fill-in |
| [changelog-003-029-autoclean-orphan-file-removal.md](./029-autoclean-orphan-file-removal/changelog-003-029-autoclean-orphan-file-removal.md) | 2026-05-08 | 055 AutoClean Orphan Files: cleanFiles option for verify_integrity and memory_health |
| [changelog-003-030-test-fixture-singular-to-plural-sweep.md](./030-test-fixture-singular-to-plural-sweep/changelog-003-030-test-fixture-singular-to-plural-sweep.md) | 2026-05-09 | 026/000/003-030: Test Fixture Singular-to-Plural Path Sweep |
| [changelog-003-031-cocoindex-local-voyage-embeddings-gate.md](./031-cocoindex-local-voyage-embeddings-gate/changelog-003-031-cocoindex-local-voyage-embeddings-gate.md) | 2026-05-10 | CocoIndex Voyage-Only Switch and Disk Reclaim on Local Machine |
| [changelog-003-032-public-doc-internal-spec-reference-removal.md](./032-public-doc-internal-spec-reference-removal/changelog-003-032-public-doc-internal-spec-reference-removal.md) | 2026-05-18 | Cleanup Pass 032: Public Doc Internal Spec Reference Removal |

### Added

- None. Detail lives in the child phase changelogs.

### Changed

- None. Detail lives in the child phase changelogs.

### Fixed

- None. Detail lives in the child phase changelogs.

### Verification

- All 31 child phases were verified independently. See each child changelog for per-phase verification evidence.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/` (child phases) | n/a | Rollup of 31 child phase changelogs, no direct source changes at the parent level |

### Follow-Ups

- None.
