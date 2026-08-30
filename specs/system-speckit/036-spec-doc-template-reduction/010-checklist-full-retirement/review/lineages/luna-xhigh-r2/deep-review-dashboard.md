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
- Review Target: specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement (spec-folder)
- Started: 2026-08-30T08:02:00Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-luna-xhigh-r2-1788076902384-48eibe
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
| P1 (Required) | 6 |
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/0 | complete |
| 2 | security | security | 1.00 | 0/3/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/6/2 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/6/3 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 3 |
| traceability | covered | 4 |
| maintainability | covered | 1 |

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
- candidateCoverage: covered=14, ruledOut=8, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 retired_producer (ruled_out): No checklist creation branch remains.; evidence=.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744
- iteration 1 contract_boundary (ruled_out): No checklist entry appears in the current Level 2 bucket.; evidence=.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:545-585
- iteration 2 generation_skip (ruled_out): The future generation case remains a mismatch rather than a silent skip.; evidence=.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:170-181, .opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:72-78
- iteration 4 standalone_template_doc_drift (ruled_out): The remaining checklist wording refers to the merged tasks section.; evidence=.opencode/skills/system-spec-kit/templates/README.md:98-151, .opencode/skills/system-spec-kit/templates/examples/README.md:55-82
- iteration 4 normal_completion_cleanup (ruled_out): The cleanup gap requires early termination.; evidence=.opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:40, .opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:88-95

### Clean Search Proof
- iteration 1 retired_producer (ruled_out): No checklist creation branch remains.; evidence=.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744
- iteration 1 contract_boundary (ruled_out): No checklist entry appears in the current Level 2 bucket.; evidence=.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:545-585
- iteration 2 generation_skip (ruled_out): The future generation case remains a mismatch rather than a silent skip.; evidence=.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:170-181, .opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:72-78
- iteration 4 standalone_template_doc_drift (ruled_out): The remaining checklist wording refers to the merged tasks section.; evidence=.opencode/skills/system-spec-kit/templates/README.md:98-151, .opencode/skills/system-spec-kit/templates/examples/README.md:55-82
- iteration 4 normal_completion_cleanup (ruled_out): The cleanup gap requires early termination.; evidence=.opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:40, .opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:88-95

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: none — max-iterations reached - focus area: synthesis and full-history replay of correctness, security, traceability, and maintainability findings - reason: the hard ceiling of four iterations was reached; do not dispatch another review pass - rotation status: all configured dimensions complete - blocked/productive carry-forward: preserve F001-F009 as active; no convergence-based early synthesis was used - required evidence: iteration files, deltas, state records, adjudication events, registry, and dashboard - recovery note: maxIterationsReached is terminal for this lineage; code graph remains unavailable

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
