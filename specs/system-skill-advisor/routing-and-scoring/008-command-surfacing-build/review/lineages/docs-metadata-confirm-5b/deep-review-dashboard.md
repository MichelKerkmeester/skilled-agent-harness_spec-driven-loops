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
- Review Target: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build (spec-folder)
- Started: 2026-11-15T22:22:38.000Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-docs-metadata-confirm-5b-1794780590351-ezt1v0
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
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | traceability | traceability | 1.00 | 0/0/2 | complete |
| 2 | maintainability | maintainability/correctness | 0.50 | 0/0/2 | complete |
| 3 | security | security | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
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
- Last 3 ratios: 1.00 -> 0.50 -> 0.00
- convergenceScore: 1.00
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
- candidateCoverage: covered=4, ruledOut=11, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 missing_inventory_entry (ruled_out): all three files agree and the alias bytes equal the generator projection; evidence=leaf-aliases.json:239, leaf-manifest.json:52
- iteration 1 contradictory_statement (ruled_out): the corrected wording matches the implementation it names; evidence=.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:176, .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:251
- iteration 1 missing_inventory_entry (ruled_out): every listed entry exists and every disk entry is listed; evidence=.skilled/skills/system-skill-advisor/runtime/tests/README.md:95
- iteration 1 link_rot (ruled_out): no broken relative link in the scoped docs; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:103
- iteration 2 contradictory_statement (ruled_out): the three owning sources agree, and the legacy scenario row is outside this fix and predates it; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:30
- iteration 2 contradictory_statement (ruled_out): the placeholder labels its own gap and the heading enumerates validated scenarios; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:191
- iteration 2 stale_inventory_list (ruled_out): the table is explicitly curated; the finding named the tree; evidence=.skilled/skills/system-skill-advisor/runtime/tests/README.md:209
- iteration 3 holdout_leak (ruled_out): no reviewed doc names a corpus file or quotes a row; evidence=.skilled/skills/system-skill-advisor/README.md:135
- iteration 3 prompt_text_in_docs (ruled_out): no prompt text appears in the reviewed docs; evidence=.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:176
- iteration 3 secret_exposure (ruled_out): no credential shape appears in the reviewed set; evidence=.skilled/skills/system-skill-advisor/README.md:176
- iteration 3 trust_boundary_widening (ruled_out): documentation and metadata only; no runtime read was added; evidence=.skilled/skills/system-skill-advisor/leaf-scopes.json:7
- iteration 3 unfixed_active_finding (ruled_out): all four active P2 advisories remain accurate; evidence=.skilled/skills/system-skill-advisor/ROUTER.md:103

### Clean Search Proof
- iteration 1 missing_inventory_entry (ruled_out): all three files agree and the alias bytes equal the generator projection; evidence=leaf-aliases.json:239, leaf-manifest.json:52
- iteration 1 contradictory_statement (ruled_out): the corrected wording matches the implementation it names; evidence=.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:176, .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:251
- iteration 1 missing_inventory_entry (ruled_out): every listed entry exists and every disk entry is listed; evidence=.skilled/skills/system-skill-advisor/runtime/tests/README.md:95
- iteration 1 link_rot (ruled_out): no broken relative link in the scoped docs; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:103
- iteration 2 contradictory_statement (ruled_out): the three owning sources agree, and the legacy scenario row is outside this fix and predates it; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:30
- iteration 2 contradictory_statement (ruled_out): the placeholder labels its own gap and the heading enumerates validated scenarios; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:191
- iteration 2 stale_inventory_list (ruled_out): the table is explicitly curated; the finding named the tree; evidence=.skilled/skills/system-skill-advisor/runtime/tests/README.md:209
- iteration 3 holdout_leak (ruled_out): no reviewed doc names a corpus file or quotes a row; evidence=.skilled/skills/system-skill-advisor/README.md:135
- iteration 3 prompt_text_in_docs (ruled_out): no prompt text appears in the reviewed docs; evidence=.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:176
- iteration 3 secret_exposure (ruled_out): no credential shape appears in the reviewed set; evidence=.skilled/skills/system-skill-advisor/README.md:176
- iteration 3 trust_boundary_widening (ruled_out): documentation and metadata only; no runtime read was added; evidence=.skilled/skills/system-skill-advisor/leaf-scopes.json:7
- iteration 3 unfixed_active_finding (ruled_out): all four active P2 advisories remain accurate; evidence=.skilled/skills/system-skill-advisor/ROUTER.md:103

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. All four configured dimensions have at least one full iteration. - Focus area: synthesis. The report carries four active P2 advisories and no P0/P1, so the derived verdict is PASS with `hasAdvisories=true`. - Reason: the iteration cap is reached and no uncovered dimension or productive direction remains. - Rotation status: closed. - Blocked/productive carry-forward: productive direction was doc-inventory comparison; no blocked approach was recorded. - Required evidence: the reducer registry (4 open P2), the four iteration artifacts, and this iteration's clean security sweep. - Recovery note: none. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
