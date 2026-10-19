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
- Review Target: commit b6eef4ebbb (worktrees/126-drift-guard-tolerance): example-tolerant sk-code drift guards (files)
- Started: 2026-10-13T05:58:44.591Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-13T05:58:44.591Z
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 9 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/3 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/2 | complete |
| 5 | correctness | correctness | 1.00 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 9 |
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
- graphConvergenceScore: 0.65
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 9
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
- candidateCoverage: covered=9, ruledOut=17, deferred=6, blocked=0

### Search Debt
- iteration 1 checklist_evidence_gap (deferred): evidence fill is tasks.md T012 after this review; re-check at synthesis; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/acceptance-criteria.md:54
- iteration 2 uncaught_error_on_malformed_input (deferred): already tracked as open P2 R1-P2-001; the security lens adds no new remediation, re-check at synthesis; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:324
- iteration 4 stale_doc_upkeep (deferred): already tracked as open P2 R3-P2-002; the maintainability lens adds no new remediation; evidence=.skilled/skills/sk-code/sk-code-skilled/SKILL.md:175
- iteration 4 error_handling_inconsistency (deferred): already tracked as open P2 R1-P2-001; the maintainability lens adds no new remediation; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:357
- iteration 5 count_wording_spelling_gap (deferred): already tracked as open P2 R1-P2-002; the correctness lens broadens the spelling evidence with the same remedy; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:46, .skilled/skills/sk-code/sk-code-skilled/SKILL.md:175
- iteration 5 registry_shape_robustness (deferred): already tracked as open P2 R1-P2-001; adds the non-array modes variant with the same remedy; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:324, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:357

### Ruled-Out Candidates
- iteration 1 regex_anchor_regression (ruled_out): pristine start offset unchanged; no-map hubs fail closed via start<0; T3 covers the Webflow-map removal; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:129
- iteration 1 set_filter_false_pass (ruled_out): removal path fails closed; absence case covered by the new leg 2 test at :134-144; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:224
- iteration 1 overbroad_skip (ruled_out): frozen tradeoff per goal D2 and spec.md risk row; declared-mode mismatch still fails and T2's fail case covers it; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:457
- iteration 2 command_injection (ruled_out): array-form spawnSync, fixed -C root and stdin-only paths; no shell or eval anywhere in either guard; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:167, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:9
- iteration 2 path_traversal (ruled_out): lexical containment holds for .. traversal and --root is operator-controlled and validated; the residual symlink read-through is tracked inside R2-P2-001; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:167
- iteration 2 destructive_side_effects (ruled_out): both guards are read-only apart from a read-only git check-ignore subprocess; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:167
- iteration 2 temp_path_tampering (ruled_out): unique per-run temp dirs; the fixed path carries no content and is only asserted missing; evidence=.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs:122
- iteration 3 cross_runtime_divergence (ruled_out): diff shows the banner as the sole divergence; evidence=.hermes/skills/sk-code-skilled/SKILL.md:12
- iteration 3 playbook_drift (ruled_out): resources resolve and capability text matches; evidence=.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:144
- iteration 3 stale_version_reference (ruled_out): hits confined to the old changelog; evidence=.skilled/skills/sk-code/sk-code-skilled/changelog/v1.2.3.0.md:2
- iteration 3 commit_metadata_drift (ruled_out): trailer and identity checks pass; evidence=git show -s --format=%B b6eef4ebbb
- iteration 4 comment_hygiene_violation (ruled_out): sweep returned nothing; each changed comment explains its why; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:42
- iteration 4 magic_string_coupling (ruled_out): test-exercised and fail-closed; a rename fails the suite before it can regress the removal behavior; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:457, .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:146
- iteration 4 module_load_filter_readability (ruled_out): readable enough with its comment and exercised in both directions; no change warranted; evidence=.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:134
- iteration 5 example_surface_removal_edge (ruled_out): behavior is fail-closed on every partial-removal shape read; the removal fixture covers the intended state; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:31, .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:134
- iteration 5 orphan_skip_breadth (ruled_out): declared-mode drift still reports and a contract-code rename fails loudly; the tolerance is spec-accepted; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:258, .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:153

### Clean Search Proof
- iteration 1 regex_anchor_regression (ruled_out): pristine start offset unchanged; no-map hubs fail closed via start<0; T3 covers the Webflow-map removal; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:129
- iteration 1 set_filter_false_pass (ruled_out): removal path fails closed; absence case covered by the new leg 2 test at :134-144; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:224
- iteration 1 overbroad_skip (ruled_out): frozen tradeoff per goal D2 and spec.md risk row; declared-mode mismatch still fails and T2's fail case covers it; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:457
- iteration 2 command_injection (ruled_out): array-form spawnSync, fixed -C root and stdin-only paths; no shell or eval anywhere in either guard; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:167, .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:9
- iteration 2 path_traversal (ruled_out): lexical containment holds for .. traversal and --root is operator-controlled and validated; the residual symlink read-through is tracked inside R2-P2-001; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:167
- iteration 2 destructive_side_effects (ruled_out): both guards are read-only apart from a read-only git check-ignore subprocess; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:167
- iteration 2 temp_path_tampering (ruled_out): unique per-run temp dirs; the fixed path carries no content and is only asserted missing; evidence=.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs:122
- iteration 2 secrets_handling (not_applicable): neither guard handles secrets or credentials; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:122
- iteration 3 cross_runtime_divergence (ruled_out): diff shows the banner as the sole divergence; evidence=.hermes/skills/sk-code-skilled/SKILL.md:12
- iteration 3 catalog_mismatch (not_applicable): no feature catalog artifact exists for this surface; evidence=.skilled/skills/sk-code/sk-code-skilled/SKILL.md
- iteration 3 playbook_drift (ruled_out): resources resolve and capability text matches; evidence=.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:144
- iteration 3 stale_version_reference (ruled_out): hits confined to the old changelog; evidence=.skilled/skills/sk-code/sk-code-skilled/changelog/v1.2.3.0.md:2
- iteration 3 commit_metadata_drift (ruled_out): trailer and identity checks pass; evidence=git show -s --format=%B b6eef4ebbb
- iteration 4 comment_hygiene_violation (ruled_out): sweep returned nothing; each changed comment explains its why; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:42
- iteration 4 magic_string_coupling (ruled_out): test-exercised and fail-closed; a rename fails the suite before it can regress the removal behavior; evidence=.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:457, .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:146
- iteration 4 module_load_filter_readability (ruled_out): readable enough with its comment and exercised in both directions; no change warranted; evidence=.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:134
- iteration 5 example_surface_removal_edge (ruled_out): behavior is fail-closed on every partial-removal shape read; the removal fixture covers the intended state; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:31, .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:134
- iteration 5 orphan_skip_breadth (ruled_out): declared-mode drift still reports and a contract-code rename fails loudly; the tolerance is spec-accepted; evidence=.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:258, .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:153

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
