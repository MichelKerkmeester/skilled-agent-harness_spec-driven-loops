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
- Review Target: .opencode/specs/sk-code/019-split-doc-template-alignment (spec-folder)
- Started: 2026-07-13T04:08:19.761Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-xhigh-c-1783915428096-y929h9
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
| P1 (Required) | 2 |
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | correctness | correctness | 1.00 | 0/1/1 | complete |
| run-002 | security | security | 0.50 | 0/1/1 | complete |
| run-003 | traceability | traceability | 0.00 | 0/0/0 | complete |
| run-004 | maintainability | maintainability | 0.08 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
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
- Last 3 ratios: 0.50 -> 0.00 -> 0.08
- convergenceScore: 0.92
- openFindings: 5
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
- candidateCoverage: covered=7, ruledOut=17, deferred=1, blocked=0

### Search Debt
- iteration 4 content_preservation (deferred): No authoritative all-target rename manifest or normalized 160-target diff audit was available within the final-pass budget.; evidence=git:dd9e700477384f2b4312f3236428e300b29e840e, git:1922cffed797c62b96e8cf862308232b3f6ba7a8, .opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:70

### Ruled-Out Candidates
- iteration 1 frontmatter_contract (ruled_out): All 163 files satisfied the frontmatter/version checks.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:49, .opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67
- iteration 1 filename_contract_and_link_integrity (ruled_out): No hyphenated scoped stem or broken scoped navigational link was found.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:50-52
- iteration 2 unsafe_secret_handling (ruled_out): No positively endorsed hardcoded-secret pattern was found.; evidence=.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:172-182
- iteration 2 client_side_authorization (ruled_out): No approved client-side-only authorization pattern was found.; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:201-233, .opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/owasp_prototype_and_safe_access.md:315-329
- iteration 2 unsafe_input_execution_and_destructive_commands (ruled_out): No positively endorsed instance was found.; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:140-168, .opencode/skills/sk-code/code-opencode/references/shell/quality_standards/validation_security_and_shellcheck.md:204
- iteration 3 markdown_inventory_count (ruled_out): All 163 lexical matches have .md suffixes; symlink handling, not non-Markdown assets, caused the prior undercount.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-verify/lineages/xhigh-c/deep-review-config.json:47-55, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:39-46
- iteration 3 spec_corpus_alignment (ruled_out): Full R3 conformance is disproved and remains represented by active I1-P1-001.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-72, .opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21
- iteration 3 checklist_claim_support (ruled_out): The current counterexample falsifies the evidence-completeness claim.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:49, .opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:90-95, .opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21
- iteration 4 unresolved_maintenance_markers (ruled_out): Every match is explanatory content, not pending document work.; evidence=.opencode/skills/sk-code/code-opencode/assets/checklists/python_checklist.md:232-241, .opencode/skills/sk-code/code-opencode/references/rust/style_guide/commenting_and_rustdoc.md:77
- iteration 4 active_finding_drift (ruled_out): No fix, downgrade trigger, or new affected class was observed; duplicate findings were suppressed.; evidence=.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21, .opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:89-98, .opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:247-258, .opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:34-55, .opencode/skills/sk-code/code-opencode/references/workflow_debug.md:14-20, .opencode/skills/sk-code/code-webflow/references/css/quality_standards/patterns_and_naming_enforcement.md:17-27

### Clean Search Proof
- iteration 1 frontmatter_contract (ruled_out): All 163 files satisfied the frontmatter/version checks.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:49, .opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67
- iteration 1 filename_contract_and_link_integrity (ruled_out): No hyphenated scoped stem or broken scoped navigational link was found.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:50-52
- iteration 2 unsafe_secret_handling (ruled_out): No positively endorsed hardcoded-secret pattern was found.; evidence=.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:172-182
- iteration 2 client_side_authorization (ruled_out): No approved client-side-only authorization pattern was found.; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:201-233, .opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/owasp_prototype_and_safe_access.md:315-329
- iteration 2 unsafe_input_execution_and_destructive_commands (ruled_out): No positively endorsed instance was found.; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:140-168, .opencode/skills/sk-code/code-opencode/references/shell/quality_standards/validation_security_and_shellcheck.md:204
- iteration 3 markdown_inventory_count (ruled_out): All 163 lexical matches have .md suffixes; symlink handling, not non-Markdown assets, caused the prior undercount.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-verify/lineages/xhigh-c/deep-review-config.json:47-55, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:39-46
- iteration 3 spec_corpus_alignment (ruled_out): Full R3 conformance is disproved and remains represented by active I1-P1-001.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-72, .opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21
- iteration 3 checklist_claim_support (ruled_out): The current counterexample falsifies the evidence-completeness claim.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:49, .opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:90-95, .opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21
- iteration 3 feature_catalog_applicability (not_applicable): The governing scope explicitly excludes feature_catalog files.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:55-60
- iteration 3 playbook_capability_applicability (not_applicable): The governing scope excludes manual-testing playbooks and declares no runtime change.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:55-60, .opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-28
- iteration 4 unresolved_maintenance_markers (ruled_out): Every match is explanatory content, not pending document work.; evidence=.opencode/skills/sk-code/code-opencode/assets/checklists/python_checklist.md:232-241, .opencode/skills/sk-code/code-opencode/references/rust/style_guide/commenting_and_rustdoc.md:77
- iteration 4 active_finding_drift (ruled_out): No fix, downgrade trigger, or new affected class was observed; duplicate findings were suppressed.; evidence=.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21, .opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:89-98, .opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:247-258, .opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:34-55, .opencode/skills/sk-code/code-opencode/references/workflow_debug.md:14-20, .opencode/skills/sk-code/code-webflow/references/css/quality_standards/patterns_and_naming_enforcement.md:17-27

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: `synthesis` - Focus area: consolidate the two active P1s, three active P2s, failed core traceability gates, and deferred content-preservation debt into the planning packet. - Reason: all four configured dimensions are complete and iteration 4 is the required final pass under `max-iterations`. - Rotation status: correctness, security, traceability, and maintainability complete; stop the iteration loop. - Blocked/productive carry-forward: preserve exact finding IDs and the 163-path/160-target distinction; carry the six-instance `When to Use` class once and do not duplicate reconfirmed findings. - Required evidence: reducer-registry reconciliation, exact file:line citations, and the final conditional verdict with `hasAdvisories=true`. - Recovery note: `content_preservation` remains deferred for the 158 resolved targets not covered by the two representative rename diffs. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
