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
- Review Target: specs/system-speckit/054-weak-model-spec-authoring (spec-folder)
- Started: 2026-10-27T06:09:41Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-sol-1793081281038-z2aj1o
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

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
| P1 (Required) | 3 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/2/0 | complete |
| 2 | security | security | 0.33 | 0/1/0 | complete |
| 3 | traceability and maintainability | traceability/maintainability | 0.06 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 1 |
| traceability | covered | 1 |
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
- Last 3 ratios: 1.00 -> 0.33 -> 0.06
- convergenceScore: 0.94
- openFindings: 4
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
- candidateCoverage: covered=4, ruledOut=5, deferred=0, blocked=1

### Search Debt
- iteration 3 dynamic_routing_proof (blocked): Live advisor or test execution may write caches outside the assigned lineage; evidence=specs/system-speckit/054-weak-model-spec-authoring/022-advisor-routing-and-local-install/spec.md:139, .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:536

### Ruled-Out Candidates
- iteration 2 repair_symlink (ruled_out): realpath containment and per-input symlink refusal are present; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:653
- iteration 2 ci_annotation_injection (ruled_out): targeted output paths escape workflow syntax; evidence=.github/workflows/changed-packet-validation.yml:117
- iteration 2 private_command_link (ruled_out): existing destinations are skipped; evidence=.skilled/skills/sk-git/scripts/worktree-naming.sh:622
- iteration 3 missing_shipped_surface (ruled_out): selected required paths present; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:1, .skilled/skills/sk-git/scripts/worktree-naming.sh:1
- iteration 3 obsolete_addon_claim (ruled_out): source directory matches seven-template set; evidence=specs/system-speckit/054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements/acceptance-criteria.md:56

### Clean Search Proof
- iteration 2 repair_symlink (ruled_out): realpath containment and per-input symlink refusal are present; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:653
- iteration 2 ci_annotation_injection (ruled_out): targeted output paths escape workflow syntax; evidence=.github/workflows/changed-packet-validation.yml:117
- iteration 2 private_command_link (ruled_out): existing destinations are skipped; evidence=.skilled/skills/sk-git/scripts/worktree-naming.sh:622
- iteration 3 missing_shipped_surface (ruled_out): selected required paths present; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:1, .skilled/skills/sk-git/scripts/worktree-naming.sh:1
- iteration 3 obsolete_addon_claim (ruled_out): source directory matches seven-template set; evidence=specs/system-speckit/054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements/acceptance-criteria.md:56

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
