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
- Review Target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/ (files)
- Started: 2026-10-02T10:37:12Z
- Status: RUNNING
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: dr-githooks-20261002T103712Z
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
| P0 (Blockers) | 2 |
| P1 (Required) | 10 |
| P2 (Suggestions) | 16 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/5/3 | complete |
| 2 | security | security | 0.50 | 1/5/4 | complete |
| 3 | traceability | traceability | 0.13 | 0/0/5 | complete |
| 4 | maintainability | maintainability | 0.14 | 0/0/6 | complete |
| 5 | correctness+security adversarial re-verification of active P0/P1 and new-defect hunt in post-commit, post-merge, post-rewrite, commit-msg, lib guards and validate-message.mjs | correctness/security | 0.02 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 28 |
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
- Last 3 ratios: 0.13 -> 0.14 -> 0.02
- convergenceScore: 0.98
- openFindings: 28
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
- candidateCoverage: covered=14, ruledOut=10, deferred=1, blocked=0

### Search Debt
- iteration 3 playbook_traceability (deferred): deferred to a follow-up iteration or maintainability pass; evidence=manual-testing-playbook/commit-formation/template-rules-block-commits.md

### Ruled-Out Candidates
- iteration 1 arithmetic_overflow (ruled_out): no coercible path found; every oddity fails open; evidence=mass-deletion-guard.sh:33-39
- iteration 1 path_traversal (ruled_out): resolution is bounded and read-only; evidence=message-contract.mjs:241-244
- iteration 1 gate_bypass (ruled_out): ownership check covers both install and uninstall paths; evidence=install-git-hooks.sh:83-94
- iteration 2 shell_injection (ruled_out): no shell sink at the JS layer; distinct from the swept stamped-trailer shell path; evidence=validate-message.mjs:77
- iteration 2 path_traversal (ruled_out): existence-only probe with no read or write sink; distinct from the swept contractDir path; evidence=message-contract.mjs:486-487
- iteration 2 secrets_exposure (ruled_out): no secret material is read or written; evidence=autostash-orphan-guard.sh:42-45
- iteration 3 cli_contract_parity (ruled_out): spec.md:92 flag list matches the parser exactly; evidence=validate-message.mjs:6-13,46
- iteration 4 dead_surface (ruled_out): test-exercised dead surface with no live behavioral impact; cleanup-only, not filed as a finding; evidence=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh:41-44
- iteration 5 record_separator_parsing (ruled_out): fallback reread at line 156 supplies the true message for any SHA missing from the map; evidence=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/validate-message.mjs:156
- iteration 5 stdin_consumption (ruled_out): stdin is deliberately unused and git ignores SIGPIPE around the write; evidence=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/post-rewrite:6-7
- iteration 5 directory_shadowing (ruled_out): requires an operator-created directory that does not exist in the target checkout; evidence=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/assets/commit-message-template.md

### Clean Search Proof
- iteration 1 arithmetic_overflow (ruled_out): no coercible path found; every oddity fails open; evidence=mass-deletion-guard.sh:33-39
- iteration 1 path_traversal (ruled_out): resolution is bounded and read-only; evidence=message-contract.mjs:241-244
- iteration 1 gate_bypass (ruled_out): ownership check covers both install and uninstall paths; evidence=install-git-hooks.sh:83-94
- iteration 2 shell_injection (ruled_out): no shell sink at the JS layer; distinct from the swept stamped-trailer shell path; evidence=validate-message.mjs:77
- iteration 2 path_traversal (ruled_out): existence-only probe with no read or write sink; distinct from the swept contractDir path; evidence=message-contract.mjs:486-487
- iteration 2 secrets_exposure (ruled_out): no secret material is read or written; evidence=autostash-orphan-guard.sh:42-45
- iteration 3 cli_contract_parity (ruled_out): spec.md:92 flag list matches the parser exactly; evidence=validate-message.mjs:6-13,46
- iteration 3 runtime_parity (not_applicable): native hook concern has no per-runtime adapters by design; evidence=hooks/git/README.md:52
- iteration 4 dead_surface (ruled_out): test-exercised dead surface with no live behavioral impact; cleanup-only, not filed as a finding; evidence=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh:41-44
- iteration 5 record_separator_parsing (ruled_out): fallback reread at line 156 supplies the true message for any SHA missing from the map; evidence=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/validate-message.mjs:156
- iteration 5 stdin_consumption (ruled_out): stdin is deliberately unused and git ignores SIGPIPE around the write; evidence=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/post-rewrite:6-7
- iteration 5 directory_shadowing (ruled_out): requires an operator-created directory that does not exist in the target checkout; evidence=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/assets/commit-message-template.md

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P0 finding(s) blocking release.
- 10 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
