---
title: "000-release-cleanup/003-cleanup Phase Parent: General Cleanup + Technical Debt"
description: "Phase parent for general cleanup and technical debt remediation across documentation, templates, test infrastructure, code graph, and resource management. 31 children address orphan files, template debt, README alignment, test fixture management, and daemon concurrency fixes."
trigger_phrases:
  - "000-release-cleanup/003-cleanup"
  - "cleanup-omnibus"
  - "general cleanup omnibus"
importance_tier: "important"
contextType: "general"
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-core | v1.0 -->
# Phase Parent: 000-release-cleanup/003-cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. ROOT PURPOSE

This sub-phase owns general cleanup and technical debt remediation across the system-spec-kit codebase. The 31 children bind together thematically through documentation fixes, template debt cleanup, orphan file management, test infrastructure remediation, and code graph resource finalization. Work ranges from removing vestigial embedding-readiness gates to fixing daemon concurrency races, with emphasis on bringing documentation and templates into conformance with current standards.

---

## 2. PHASE CHILDREN

| ID | Slug | Summary |
|----|------|---------|
| 001 | memory-indexer-storage-boundary | Memory-Indexer Storage-Boundary Remediation |
| 002 | search-query-rag-optimization | 006 Search Query RAG Optimization |
| 003 | vitest-baseline-recovery | Vitest baseline recovery |
| 004 | search-rag-measurement-driven-implementation | 007 Search RAG Measurement-Driven Implementation |
| 005 | vestigial-embedding-readiness-gate-removal | Delete Vestigial Embedding-Readiness Gate |
| 006 | stale-doc-and-readme-fixes | Stale Doc + README Fixes (Tier 1+2) |
| 007 | broad-suite-vitest-honesty | Broad-Suite Vitest Honesty |
| 008 | skdoc-legacy-template-debt-cleanup | Sk-doc Legacy Template Debt Cleanup |
| 009 | phase-parent-documentation | Phase Parent Documentation |
| 010 | half-auto-upgrades | Half-Auto Upgrades |
| 011 | cli-matrix-adapter-runners | CLI Matrix Adapter Runners |
| 012 | code-graph-catalog-and-playbook | 039 code-graph-catalog-and-playbook |
| 013 | evergreen-doc-packet-id-removal | Evergreen Doc Packet ID Removal |
| 014 | resource-maps-and-memory-finalization | 041 Resource Maps and Memory Finalization |
| 015 | root-readme-refresh | 042 Root README Refresh |
| 016 | hook-plugin-per-runtime-testing | Hook Plugin Per Runtime Testing |
| 017 | hook-test-sandbox-fix | Hook Test Sandbox Fix |
| 018 | matrix-runners-snake-case-rename | 047 matrix_runners Snake Case Rename |
| 019 | feature-catalog-shape-realignment | 050 Feature Catalog Shape Realignment |
| 020 | coco-index-feature-catalog | 051 CocoIndex Feature Catalog |
| 021 | sk-doc-conformance-sweep | sk-doc Conformance Sweep and Template Cleanup |
| 022 | cli-skills-baseline-overlay-contract | CLI Skills Codebase-Agnostic Standards Contract |
| 023 | pre-existing-test-failure-remediation | Pre-Existing Test Failure Remediation |
| 024 | iter-001-daemon-concurrency-fixes | Iteration-001 Daemon Concurrency Fixes |
| 025 | architecture-diagrams-and-topology | Architecture diagrams and topology trees |
| 026 | readme-code-template | README code template governance |
| 027 | missing-code-readmes-resource-map | Missing Code READMEs Resource Map |
| 028 | doc-alignment-and-readme-filling | Doc-alignment and missing-README fill-in |
| 029 | autoclean-orphan-files | 055 AutoClean Orphan Files |
| 030 | test-fixture-singular-to-plural-sweep | 056 Test Fixture Singular-to-Plural Sweep |
| 031 | cocoindex-voyage-only-this-machine | 057 CocoIndex Voyage-Only on Local Machine |

---

## 3. SUB-PHASE CONTROL FILE

- Active child: n/a - sub-phase children share equivalent priority
- Last completed child: n/a
- Resume entry: /spec_kit:resume honors graph-metadata.json derived.last_active_child_id; falls back to listing children.

---

## 4. WHAT NEEDS DONE (parent-level pointer)

The parent itself owns no implementation. All work lives in the children. Each child's spec.md is the source of truth for that child's scope.

**Thematic groupings:**
- Documentation and README alignment: 011, 014, 027, 029, 051, 052, 053
- Template debt cleanup and conformance: 013, 037, 038, 040, 041
- Test infrastructure and fixture management: 006-vitest, 012-vitest, 030, 031, 047, 056
- Code graph and resource management: 001, 026, 028
- CLI skills and matrix runners: 021, 023, 034
- Orphan file cleanup: 055
- Daemon concurrency fixes: 048
- Architecture and topology: 050

---

## 5. PROVENANCE

Sub-phase directory created by packet 109 Wave 2 per 998 iter-003 classification rules. Phase-parent base files authored by packet 111 Wave 3.A (cli-devin SWE-1.6).
