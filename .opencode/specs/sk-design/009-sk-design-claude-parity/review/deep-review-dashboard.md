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
- Review Target: .opencode/specs/sk-design/009-sk-design-claude-parity (spec-folder)
- Started: 2026-07-06T11:48:06.000Z
- Status: INITIALIZED
- Iteration: 5 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-07-06T11:48:06.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 4 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | inventory-pass | inventory-pass | 0.00 | 0/0/0 | complete |
| run-002 | correctness | correctness | 1.00 | 0/1/0 | complete |
| run-003 | security | security | 0.33 | 0/2/0 | complete |
| run-003 | traceability | traceability | 0.25 | 0/1/0 | complete |
| run-005 | maintainability | maintainability | 0.40 | 0/0/2 | complete |

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
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.33 -> 0.25 -> 0.40
- convergenceScore: 0.60
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
- candidateCoverage: covered=30, ruledOut=26, deferred=17, blocked=0

### Search Debt
- iteration 1 deep_correctness_security_traceability_maintainability (deferred): Review plan assigns deep dimension work to later iterations.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:100
- iteration 2 manual_playbook_capability_mismatch (deferred): Defer to traceability or maintainability iterations for full scenario validation.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-002.md:51

### Ruled-Out Candidates
- iteration 1 artifact_inventory (ruled_out): Directory and targeted glob evidence matched the declared structure.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity:1, .opencode/specs/sk-design/009-sk-design-claude-parity/008-smart-routing-optimization/benchmark-after-008/report.md:1
- iteration 1 checklist_evidence_drift (ruled_out): Accepted descope and P2 deferral evidence explains the unchecked rows.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:241, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:121, .opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/checklist.md:141
- iteration 1 mode_registry_surface_mismatch (ruled_out): Direct registry read matched the expected five-mode taxonomy.; evidence=.opencode/skills/sk-design/mode-registry.json:32, .opencode/skills/sk-design/mode-registry.json:37, .opencode/skills/sk-design/mode-registry.json:57, .opencode/skills/sk-design/mode-registry.json:77, .opencode/skills/sk-design/mode-registry.json:97, .opencode/skills/sk-design/mode-registry.json:117
- iteration 1 compiled_backend_output_presence (ruled_out): Direct directory read confirmed dist/cli.js exists.; evidence=.opencode/skills/sk-design/design-md-generator/backend/package.json:6, .opencode/skills/sk-design/design-md-generator/backend/dist:1, .opencode/skills/sk-design/design-md-generator/backend/tsconfig.build.json:1
- iteration 1 placeholder_or_stub_residue (ruled_out): Observed hits were semantically expected uses of the searched terms.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/plan.md:152, .opencode/skills/sk-design/design-md-generator/assets/design_md_prompt_template.md:30, .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:54
- iteration 2 mode_routing_surface_mismatch (ruled_out): Direct reads matched the declared routing contract.; evidence=.opencode/skills/sk-design/mode-registry.json:32, .opencode/skills/sk-design/hub-router.json:27, .opencode/skills/sk-design/design-md-generator/SKILL.md:1
- iteration 2 md_generator_entrypoint_contract (ruled_out): No confirmed contract failure in those sampled entrypoints.; evidence=.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:61, .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:97, .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:258, .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:279, .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:486
- iteration 2 phase010_remediation_residual (ruled_out): No residual correctness drift found in sampled Phase 010 records.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/spec.md:102, .opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/implementation-summary.md:44
- iteration 2 phase012_false_completion (ruled_out): The descope is explicit and not a silent false-pass claim.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:241, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:121
- iteration 3 shell_command_injection (ruled_out): No command-injection path was confirmed because execution uses argv arrays with default shell=false.; evidence=.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:120, .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:189
- iteration 3 crawler_side_effect_control (ruled_out): No crawler side-effect vulnerability was confirmed in the sampled URL/link/click path.; evidence=.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:410, .opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:650, .opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:671
- iteration 3 read_only_mode_escalation (ruled_out): No read-only mode escalation was confirmed in registry, mode frontmatter, or command frontmatter.; evidence=.opencode/skills/sk-design/mode-registry.json:37, .opencode/commands/design/interface.md:4, .opencode/commands/design/md-generator.md:4
- iteration 3 prior_component_gap_security (ruled_out): No separate current security finding for P1-001 was confirmed beyond the new broader prompt-data isolation finding.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-002.md:32, .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:93
- iteration 4 phase010_remediation_traceability (ruled_out): No residual false-completion gap found in sampled Phase 010 evidence.; evidence=.opencode/skills/sk-design/design-foundations/feature_catalog/01--token-system/oklch-color-and-token-system.md:26
- iteration 4 phase012_descope_traceability (ruled_out): No fabricated score or silent pass row found in sampled Phase 012 reconciliation evidence.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:241
- iteration 4 playbook_capability (ruled_out): No sampled scenario claimed a non-existent procedure-card capability.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/011-manual-testing-playbook-alignment/implementation-summary.md:52
- iteration 4 command_projection_parity (ruled_out): No command projection mismatch found in frontmatter or mode binding samples.; evidence=.opencode/commands/design/audit.md:51, .opencode/commands/design/md-generator.md:51
- iteration 5 feature_catalog_duplicate_drift (ruled_out): Root catalogs summarize capability areas and link leaf files rather than duplicating long-form source details.; evidence=.opencode/skills/sk-design/feature_catalog/feature_catalog.md:31, .opencode/skills/sk-design/design-interface/feature_catalog/feature_catalog.md:37, .opencode/skills/sk-design/design-md-generator/feature_catalog/feature_catalog.md:31
- iteration 5 phase012_handoff_clarity (ruled_out): ADR-003, plan/task/checklist reconciliation, and follow-up items repeatedly name the descoped expanded-battery work and the future pickup path.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:259, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/plan.md:40, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/tasks.md:37, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/checklist.md:155, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:141
- iteration 5 md_generator_remediation_coupling (ruled_out): No separate P1 is needed; the active P1s can be addressed through two shared remediation seams instead of unrelated patches.; evidence=.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53, .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:258, .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:138, .opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:627, .opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:249, .opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:301

### Clean Search Proof
- iteration 1 artifact_inventory (ruled_out): Directory and targeted glob evidence matched the declared structure.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity:1, .opencode/specs/sk-design/009-sk-design-claude-parity/008-smart-routing-optimization/benchmark-after-008/report.md:1
- iteration 1 checklist_evidence_drift (ruled_out): Accepted descope and P2 deferral evidence explains the unchecked rows.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:241, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:121, .opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/checklist.md:141
- iteration 1 mode_registry_surface_mismatch (ruled_out): Direct registry read matched the expected five-mode taxonomy.; evidence=.opencode/skills/sk-design/mode-registry.json:32, .opencode/skills/sk-design/mode-registry.json:37, .opencode/skills/sk-design/mode-registry.json:57, .opencode/skills/sk-design/mode-registry.json:77, .opencode/skills/sk-design/mode-registry.json:97, .opencode/skills/sk-design/mode-registry.json:117
- iteration 1 compiled_backend_output_presence (ruled_out): Direct directory read confirmed dist/cli.js exists.; evidence=.opencode/skills/sk-design/design-md-generator/backend/package.json:6, .opencode/skills/sk-design/design-md-generator/backend/dist:1, .opencode/skills/sk-design/design-md-generator/backend/tsconfig.build.json:1
- iteration 1 placeholder_or_stub_residue (ruled_out): Observed hits were semantically expected uses of the searched terms.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/plan.md:152, .opencode/skills/sk-design/design-md-generator/assets/design_md_prompt_template.md:30, .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:54
- iteration 2 mode_routing_surface_mismatch (ruled_out): Direct reads matched the declared routing contract.; evidence=.opencode/skills/sk-design/mode-registry.json:32, .opencode/skills/sk-design/hub-router.json:27, .opencode/skills/sk-design/design-md-generator/SKILL.md:1
- iteration 2 md_generator_entrypoint_contract (ruled_out): No confirmed contract failure in those sampled entrypoints.; evidence=.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:61, .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:97, .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:258, .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:279, .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:486
- iteration 2 phase010_remediation_residual (ruled_out): No residual correctness drift found in sampled Phase 010 records.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/spec.md:102, .opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/implementation-summary.md:44
- iteration 2 phase012_false_completion (ruled_out): The descope is explicit and not a silent false-pass claim.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:241, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:121
- iteration 3 shell_command_injection (ruled_out): No command-injection path was confirmed because execution uses argv arrays with default shell=false.; evidence=.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:120, .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:189
- iteration 3 crawler_side_effect_control (ruled_out): No crawler side-effect vulnerability was confirmed in the sampled URL/link/click path.; evidence=.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:410, .opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:650, .opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:671
- iteration 3 read_only_mode_escalation (ruled_out): No read-only mode escalation was confirmed in registry, mode frontmatter, or command frontmatter.; evidence=.opencode/skills/sk-design/mode-registry.json:37, .opencode/commands/design/interface.md:4, .opencode/commands/design/md-generator.md:4
- iteration 3 prior_component_gap_security (ruled_out): No separate current security finding for P1-001 was confirmed beyond the new broader prompt-data isolation finding.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-002.md:32, .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:93
- iteration 4 phase010_remediation_traceability (ruled_out): No residual false-completion gap found in sampled Phase 010 evidence.; evidence=.opencode/skills/sk-design/design-foundations/feature_catalog/01--token-system/oklch-color-and-token-system.md:26
- iteration 4 phase012_descope_traceability (ruled_out): No fabricated score or silent pass row found in sampled Phase 012 reconciliation evidence.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:241
- iteration 4 playbook_capability (ruled_out): No sampled scenario claimed a non-existent procedure-card capability.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/011-manual-testing-playbook-alignment/implementation-summary.md:52
- iteration 4 command_projection_parity (ruled_out): No command projection mismatch found in frontmatter or mode binding samples.; evidence=.opencode/commands/design/audit.md:51, .opencode/commands/design/md-generator.md:51
- iteration 5 feature_catalog_duplicate_drift (ruled_out): Root catalogs summarize capability areas and link leaf files rather than duplicating long-form source details.; evidence=.opencode/skills/sk-design/feature_catalog/feature_catalog.md:31, .opencode/skills/sk-design/design-interface/feature_catalog/feature_catalog.md:37, .opencode/skills/sk-design/design-md-generator/feature_catalog/feature_catalog.md:31
- iteration 5 phase012_handoff_clarity (ruled_out): ADR-003, plan/task/checklist reconciliation, and follow-up items repeatedly name the descoped expanded-battery work and the future pickup path.; evidence=.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:259, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/plan.md:40, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/tasks.md:37, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/checklist.md:155, .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:141
- iteration 5 md_generator_remediation_coupling (ruled_out): No separate P1 is needed; the active P1s can be addressed through two shared remediation seams instead of unrelated patches.; evidence=.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53, .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:258, .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:138, .opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:627, .opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:249, .opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:301

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 2 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
