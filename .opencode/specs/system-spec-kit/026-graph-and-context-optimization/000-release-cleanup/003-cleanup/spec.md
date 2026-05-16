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
| 001 | memory-indexer-storage-boundary | Memory-indexer storage-boundary remediation |
| 006 | search-query-rag-optimization | Search query RAG optimization |
| 006 | vitest-baseline-recovery | Vitest baseline recovery (198 failures fixed) |
| 007 | search-rag-measurement-driven-implementation | Search RAG measurement-driven implementation |
| 010 | vestigial-embedding-readiness-gate-removal | Delete vestigial embedding-readiness gate |
| 011 | stale-doc-and-readme-fixes | Stale doc + README fixes (Tier 1+2) |
| 012 | broad-suite-vitest-honesty | Broad-suite vitest honesty |
| 013 | skdoc-legacy-template-debt-cleanup | sk-doc legacy template debt cleanup |
| 014 | phase-parent-documentation | Phase parent documentation |
| 021 | half-auto-upgrades | Half-auto upgrades |
| 023 | cli-matrix-adapter-runners | CLI matrix adapter runners |
| 026 | code-graph-catalog-and-playbook | Code-graph catalog and playbook |
| 027 | evergreen-doc-packet-id-removal | Evergreen doc packet ID removal |
| 028 | resource-maps-and-memory-finalization | Resource maps and memory finalization |
| 029 | root-readme-refresh | Root README refresh |
| 030 | hook-plugin-per-runtime-testing | Hook plugin per runtime testing |
| 031 | hook-test-sandbox-fix | Hook test sandbox fix |
| 034 | matrix-runners-snake-case-rename | Matrix runners snake case rename |
| 037 | feature-catalog-shape-realignment | Feature catalog shape realignment |
| 038 | coco-index-feature-catalog | CocoIndex feature catalog |
| 040 | sk-doc-conformance-sweep-and-template-cleanup | sk-doc conformance sweep and template cleanup |
| 041 | cli-skills-baseline-overlay-contract | CLI skills codebase-agnostic standards contract |
| 047 | pre-existing-test-failure-remediation | Pre-existing test failure remediation |
| 048 | iter-001-daemon-concurrency-fixes | Iteration-001 daemon concurrency fixes |
| 050 | architecture-diagrams-and-topology | Architecture diagrams and topology |
| 051 | readme-code-template | README code template governance |
| 052 | missing-code-readmes-resource-map | Missing code READMEs resource map |
| 053 | doc-alignment-and-readme-filling | Doc-alignment and missing-README fill-in |
| 055 | autoclean-orphan-files | AutoClean orphan files |
| 056 | test-fixture-singular-to-plural-sweep | Test fixture singular-to-plural sweep |
| 057 | cocoindex-voyage-only-this-machine | CocoIndex voyage-only on local machine |

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
