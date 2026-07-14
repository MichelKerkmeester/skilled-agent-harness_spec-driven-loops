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
- Started: 2026-07-13T05:42:21Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-confirm-a-1783921047347-ky9ry5
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
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.67 | 0/0/3 | complete |
| 4 | maintainability and stabilization | maintainability | 0.00 | 0/0/3 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 1 |
| traceability | covered | 2 |
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
- Last 3 ratios: 1.00 -> 0.67 -> 0.00
- convergenceScore: 1.00
- openFindings: 3
- persistentSameSeverity: 3
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 3

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=3, ruledOut=8, deferred=1, blocked=0

### Search Debt
- iteration 4 preservation_provenance (deferred): Requires the unavailable pre-change baseline and commit evidence; the strategy marks the approach exhausted.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71, .opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:61-64, .opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-61, .opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-97

### Ruled-Out Candidates
- iteration 2 trust_boundary_guidance (ruled_out): Current text explicitly separates non-sensitive client cookies from sensitive server-set session cookies.; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:91-100,230-262
- iteration 2 secrets_and_injection_guidance (ruled_out): Bad examples carry explicit negative labels and safer alternatives.; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:37-87,129-170, .opencode/skills/sk-code/code-opencode/references/shell/quality_standards/validation_security_and_shellcheck.md:200-229, .opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:172-182
- iteration 2 known_security_concern_regression (ruled_out): The current target contains the missing allowlist and integrity guidance.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:91-93, .opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:39-60
- iteration 2 documentation_only_security_claim (ruled_out): All in-scope deliverables are Markdown references/assets and packet documentation.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:54-60, .opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29, .opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:65-68
- iteration 3 requirement_surface_alignment (ruled_out): Current packet and surface evidence agree; historical R4 is tracked separately.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:64-82, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:37-48,71-79, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:41-46
- iteration 3 cross_dimension_duplicate (ruled_out): P2-001 remains unchanged and cross-dimensionally distinct.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/iterations/iteration-002.md:34-44, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:83-93
- iteration 4 missing_maintenance_mechanism (ruled_out): Template/package authority and deterministic verification mechanics are already named.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:33-38,43-72
- iteration 4 new_maintenance_p0_p1 (ruled_out): Documentation-only scope and explicit mechanics contain the observed follow-on cost to active P2 advisories.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29,33-38,61-72, .opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71
- iteration 4 cross_dimension_duplicate (ruled_out): Each finding has a distinct producer, impact, and fix surface.; evidence=.opencode/skills/sk-code/code-webflow/references/performance/resource_loading.md:21-38,303-325, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:83-93, .opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-25, .opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-25

### Clean Search Proof
- iteration 2 trust_boundary_guidance (ruled_out): Current text explicitly separates non-sensitive client cookies from sensitive server-set session cookies.; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:91-100,230-262
- iteration 2 secrets_and_injection_guidance (ruled_out): Bad examples carry explicit negative labels and safer alternatives.; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:37-87,129-170, .opencode/skills/sk-code/code-opencode/references/shell/quality_standards/validation_security_and_shellcheck.md:200-229, .opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:172-182
- iteration 2 known_security_concern_regression (ruled_out): The current target contains the missing allowlist and integrity guidance.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:91-93, .opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:39-60
- iteration 2 documentation_only_security_claim (ruled_out): All in-scope deliverables are Markdown references/assets and packet documentation.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:54-60, .opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29, .opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:65-68
- iteration 3 requirement_surface_alignment (ruled_out): Current packet and surface evidence agree; historical R4 is tracked separately.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:64-82, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:37-48,71-79, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:41-46
- iteration 3 cross_dimension_duplicate (ruled_out): P2-001 remains unchanged and cross-dimensionally distinct.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/iterations/iteration-002.md:34-44, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:83-93
- iteration 4 missing_maintenance_mechanism (ruled_out): Template/package authority and deterministic verification mechanics are already named.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:33-38,43-72
- iteration 4 new_maintenance_p0_p1 (ruled_out): Documentation-only scope and explicit mechanics contain the observed follow-on cost to active P2 advisories.; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29,33-38,61-72, .opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71
- iteration 4 cross_dimension_duplicate (ruled_out): Each finding has a distinct producer, impact, and fix surface.; evidence=.opencode/skills/sk-code/code-webflow/references/performance/resource_loading.md:21-38,303-325, .opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:83-93, .opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-25, .opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-25

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis/adversarial replay - Focus area: terminal synthesis of cumulative findings and adversarial replay of carried gate-relevant claims - Reason: all four configured dimensions are complete; the loop is at its max-iteration boundary with three active P2 advisories and no P0/P1 - Rotation status: 4 of 4 dimensions complete; no fifth review iteration - Blocked/productive carry-forward: historical baseline replay and the absent `code-quality/references` root remain exhausted; direct cited evidence and cumulative state remain productive for synthesis - Required evidence: reconcile P2-001/P2-002/P2-003 against the registry, replay release gates, preserve the R4 search debt, and verify state/delta identity before rendering the final report Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
