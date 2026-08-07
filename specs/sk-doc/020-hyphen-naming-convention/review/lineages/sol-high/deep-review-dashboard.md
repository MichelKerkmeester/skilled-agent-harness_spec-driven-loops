---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: .opencode/specs/sk-doc/020-hyphen-naming-convention (spec-folder)
- Started: 2026-07-17T17:09:03Z
- Status: COMPLETE
- Iteration: 20 of 20
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-sol-high-1784307871185-l34e0c
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:dimension-expansion -->
## 2A. DIMENSION EXPANSION
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:dimension-expansion -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 5 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: topology reproducibility and phase identity | correctness | 1.00 | 0/2/0 | complete |
| 2 | security: apply snapshot binding and unsafe operands | security | 0.50 | 0/2/0 | complete |
| 3 | traceability: packet identity and executable routing | traceability | 0.20 | 0/1/0 | complete |
| 4 | maintainability: metadata and standards-reference integrity | maintainability | 0.04 | 0/0/1 | complete |
| 5 | correctness stabilization: adversarial replay of topology and identity claims | correctness | 0.00 | 0/0/0 | complete |
| 6 | security stabilization: mutation-boundary replay and adjacent-variant scan | security | 0.00 | 0/0/0 | complete |
| 7 | correctness: frozen-map executable artifact contract | correctness | 0.00 | 0/0/0 | complete |
| 8 | traceability: root-name and transition-alias lifecycle | traceability | 0.00 | 0/0/0 | complete |
| 9 | maintainability: phase-parent maps and filesystem parity | maintainability | 0.00 | 0/0/0 | complete |
| 10 | correctness: whole-repository gate candidate identity | correctness | 0.00 | 0/0/0 | complete |
| 11 | security: symlink closure and repository containment | security | 0.00 | 0/0/0 | complete |
| 12 | traceability: cross-cutting closure to component migration handoffs | traceability | 0.00 | 0/0/0 | complete |
| 13 | maintainability: metadata, descriptions, and source-hash stability replay | maintainability | 0.00 | 0/0/0 | complete |
| 14 | correctness: post-rebase final integration identity | correctness | 0.00 | 0/0/0 | complete |
| 15 | security: rollback journals and fail-closed mutation recovery | security | 0.00 | 0/0/0 | complete |
| 16 | traceability: requirements, tasks, and blocking checklist semantics | traceability | 0.00 | 0/0/0 | complete |
| 17 | maintainability: standards-pointer and internal-link replay | maintainability | 0.00 | 0/0/0 | complete |
| 18 | correctness: authoritative phase-tree regeneration replay | correctness | 0.00 | 0/0/0 | complete |
| 19 | security: stale-plan and option-like pathname adversarial replay | security | 0.00 | 0/0/0 | complete |
| 20 | maintainability: terminal synthesis-readiness and artifact consistency | maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 6
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=24, ruledOut=76, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 5 adversarial_replay (ruled_out): No downgrade or new finding; active findings remain confirmed.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:149-153, .opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:168-197, .opencode/specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census/tasks.md:48-50
- iteration 6 adversarial_replay (ruled_out): No new finding; F003/F004 remain active and neighboring controls are adequate.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72-77, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77-103
- iteration 7 artifact_contract (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/spec.md:54-88, .opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:82-99
- iteration 8 lifecycle_handoff (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration/spec.md:55-97, .opencode/specs/sk-doc/020-hyphen-naming-convention/009-remove-transition-aliases/spec.md:55-94, .opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/spec.md:81-92
- iteration 9 topology_parity (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:138-165, .opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:104-145, .opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:134-167
- iteration 10 candidate_identity (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/decision-record.md:52-87, .opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/spec.md:78-98
- iteration 11 symlink_boundary (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure/checklist.md:35-74, .opencode/specs/sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure/spec.md:70-103
- iteration 12 dependency_handoff (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/spec.md:77-106, .opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/spec.md:78-109
- iteration 13 metadata_drift (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/graph-metadata.json, .opencode/specs/sk-doc/020-hyphen-naming-convention/description.json, .opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:1-30
- iteration 14 integration_identity (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/spec.md:56-99, .opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/decision-record.md:50-104
- iteration 15 rollback_integrity (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77-103, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor/spec.md:95-124, .opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:109-115
- iteration 16 requirement_evidence (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/spec.md:78-97, .opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/tasks.md:45-79, .opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/checklist.md:41-93
- iteration 17 broken_standard_pointer (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:34-37, .opencode/skills/sk-doc/shared/references/hvr_rules.md
- iteration 18 generator_replay (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:149-153, .opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:104-145, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor/spec.md:1-40
- iteration 19 mutation_boundary (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72-77, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77-103, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness/checklist.md:53-75
- iteration 20 terminal_consistency (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:134-197, .opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:1-30, .opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/decision-record.md:63-87, .opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/spec.md:81-99

### Clean Search Proof
- iteration 5 adversarial_replay (ruled_out): No downgrade or new finding; active findings remain confirmed.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:149-153, .opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:168-197, .opencode/specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census/tasks.md:48-50
- iteration 6 adversarial_replay (ruled_out): No new finding; F003/F004 remain active and neighboring controls are adequate.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72-77, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77-103
- iteration 7 artifact_contract (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/spec.md:54-88, .opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:82-99
- iteration 8 lifecycle_handoff (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration/spec.md:55-97, .opencode/specs/sk-doc/020-hyphen-naming-convention/009-remove-transition-aliases/spec.md:55-94, .opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/spec.md:81-92
- iteration 9 topology_parity (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:138-165, .opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:104-145, .opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:134-167
- iteration 10 candidate_identity (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/decision-record.md:52-87, .opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/spec.md:78-98
- iteration 11 symlink_boundary (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure/checklist.md:35-74, .opencode/specs/sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure/spec.md:70-103
- iteration 12 dependency_handoff (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/spec.md:77-106, .opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/spec.md:78-109
- iteration 13 metadata_drift (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/graph-metadata.json, .opencode/specs/sk-doc/020-hyphen-naming-convention/description.json, .opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:1-30
- iteration 14 integration_identity (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/spec.md:56-99, .opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/decision-record.md:50-104
- iteration 15 rollback_integrity (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77-103, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor/spec.md:95-124, .opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/plan.md:109-115
- iteration 16 requirement_evidence (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/spec.md:78-97, .opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/tasks.md:45-79, .opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/checklist.md:41-93
- iteration 17 broken_standard_pointer (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:34-37, .opencode/skills/sk-doc/shared/references/hvr_rules.md
- iteration 18 generator_replay (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/build-phase-tree.mjs:149-153, .opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:104-145, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor/spec.md:1-40
- iteration 19 mutation_boundary (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md:72-77, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine/decision-record.md:77-103, .opencode/specs/sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness/checklist.md:53-75
- iteration 20 terminal_consistency (ruled_out): No new finding; existing registry remains authoritative.; evidence=.opencode/specs/sk-doc/020-hyphen-naming-convention/spec.md:134-197, .opencode/specs/sk-doc/020-hyphen-naming-convention/manifest/phase-tree.json:1-30, .opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/decision-record.md:63-87, .opencode/specs/sk-doc/020-hyphen-naming-convention/011-integrate-and-closeout/spec.md:81-99

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
