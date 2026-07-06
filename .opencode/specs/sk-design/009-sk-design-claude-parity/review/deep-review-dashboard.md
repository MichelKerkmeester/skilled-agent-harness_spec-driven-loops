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
- Iteration: 2 of 10
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | inventory-pass | inventory-pass | 0.00 | 0/0/0 | complete |
| run-002 | correctness | correctness | 1.00 | 0/1/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | pending | 0 |
| traceability | pending | 0 |
| maintainability | pending | 0 |

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
- Last 3 ratios: 0.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 1
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
- candidateCoverage: covered=13, ruledOut=14, deferred=10, blocked=0

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

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
security

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 2 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
