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
- Started: 2026-10-27T06:08:02Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-1793081281038-z2aj1o
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/3 | complete |
| 2 | security | security | 0.11 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.18 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 1 |
| traceability | covered | 2 |
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
- Last 3 ratios: 1.00 -> 0.11 -> 0.18
- convergenceScore: 0.82
- openFindings: 7
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
- candidateCoverage: covered=6, ruledOut=10, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 boundary_condition (ruled_out): stamp comparison includes every later version; evidence=.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:92
- iteration 1 boundary_condition (ruled_out): no match on the benchmark vocabulary; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:111
- iteration 1 gate_bypass (ruled_out): pattern cannot match a packet folder that merely contains scratch; evidence=.github/workflows/changed-packet-validation.yml:91
- iteration 2 symlink_escape (ruled_out): link refusal plus realpath containment; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:323
- iteration 2 path_traversal (ruled_out): candidate filter plus symlink-parent refusal; evidence=.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:157
- iteration 2 command_injection (ruled_out): argv array spawns with quoted variables; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:414
- iteration 2 command_injection (ruled_out): no attacker-controlled string reaches the script body; evidence=.github/workflows/changed-packet-validation.yml:74
- iteration 2 fail_open (ruled_out): fail-closed precondition check; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:40
- iteration 3 generated_artifact_drift (ruled_out): changed list empty and exit 0; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
- iteration 3 generated_artifact_drift (ruled_out): same counts and no drift as recorded; evidence=.skilled/commands/doctor/scripts/route-validate.sh
- iteration 3 stale_claim (ruled_out): block state machine treats an empty block as empty; evidence=.skilled/skills/system-spec-kit/runtime/cli/rules/check-measured-behavior.sh:64
- iteration 3 stale_claim (ruled_out): current text matches the registry; evidence=README.md:372

### Clean Search Proof
- iteration 1 boundary_condition (ruled_out): stamp comparison includes every later version; evidence=.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:92
- iteration 1 boundary_condition (ruled_out): no match on the benchmark vocabulary; evidence=.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:111
- iteration 1 gate_bypass (ruled_out): pattern cannot match a packet folder that merely contains scratch; evidence=.github/workflows/changed-packet-validation.yml:91
- iteration 2 symlink_escape (ruled_out): link refusal plus realpath containment; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:323
- iteration 2 path_traversal (ruled_out): candidate filter plus symlink-parent refusal; evidence=.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:157
- iteration 2 command_injection (ruled_out): argv array spawns with quoted variables; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:414
- iteration 2 command_injection (ruled_out): no attacker-controlled string reaches the script body; evidence=.github/workflows/changed-packet-validation.yml:74
- iteration 2 fail_open (ruled_out): fail-closed precondition check; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:40
- iteration 3 generated_artifact_drift (ruled_out): changed list empty and exit 0; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
- iteration 3 generated_artifact_drift (ruled_out): same counts and no drift as recorded; evidence=.skilled/commands/doctor/scripts/route-validate.sh
- iteration 3 stale_claim (ruled_out): block state machine treats an empty block as empty; evidence=.skilled/skills/system-spec-kit/runtime/cli/rules/check-measured-behavior.sh:64
- iteration 3 stale_claim (ruled_out): current text matches the registry; evidence=README.md:372

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
maintainability

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
