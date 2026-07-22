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
- Review Target: .opencode/specs/sk-design/012-style-database-and-interface-commands (spec-folder)
- Started: 2026-07-19T10:47:16.570Z
- Status: INITIALIZED
- Iteration: 5 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-sol-1784457701676-6nfth8
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
| P1 (Required) | 9 |
| P2 (Suggestions) | 1 |
| Resolved | 4 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness — published generation consistency, crash safety, hash freshness, eligibility-first RRF, vector degradation, adapter modes, and fail-closed paths | correctness | 1.00 | 0/2/1 | complete |
| 2 | security — SQLite/file trust boundaries, generation pointer validation, corpus and hydration containment, hostile query/vector inputs, exemplar trust, mutation boundaries, and alias recursion | security | 0.48 | 0/4/1 | complete |
| 3 | traceability — four-phase requirements/tasks/checklists to research, implementation, tests, registration, current verification, parent status, and immutable registry correction | traceability | 0.61 | 0/8/1 | complete |
| 4 | maintainability — DB/operator ownership, generation retention, vector operability, migration/cutover ergonomics, shared command authority, current-state documentation, and fixture realism | maintainability | 0.11 | 0/9/1 | complete |
| 5 | stabilization — replay all nine active P1s and one P2 against current anchors, consumers, negative tests, frozen specs, and operator surfaces without artificial novelty | correctness/security/traceability/maintainability | 0.00 | 0/9/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 0 |
| traceability | covered | 6 |
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
- Last 3 ratios: 0.61 -> 0.11 -> 0.00
- convergenceScore: 1.00
- openFindings: 10
- persistentSameSeverity: 10
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 10

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=29, ruledOut=7, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 transaction_atomicity|partial_publication (ruled_out): Direct code and failure-injection evidence agree.; evidence=styles/_db/indexer.mjs:805-998, styles/_db/__tests__/indexer.test.mjs:193-226
- iteration 1 eligibility|rrf|cursor|degradation (ruled_out): No contradictory path was found within the declared retrieval surface.; evidence=styles/_db/retrieval.mjs:99-265, styles/_db/retrieval.mjs:364-435, styles/_db/__tests__/retrieval.test.mjs:18-75
- iteration 2 corpus_symlink_containment|hydration_rights_and_hashes (ruled_out): No contradictory static path was found in the declared corpus/hydration surfaces.; evidence=styles/_engine/hydrate.mjs:66-122,225-370, styles/_engine/persistent-adapter.mjs:197-293, styles/_engine/__tests__/hydrate-guard.test.mjs:20-163
- iteration 3 phase004_registration_parity (ruled_out): Direct registration evidence and current tests agree with no contradictory route.; evidence=hub-router.json:25-40, interface-command-contract.test.mjs:10-145
- iteration 4 command_shared_contract_authority (ruled_out): Central authority and thin-router boundary are explicit.; evidence=shared/creation-contract.md:14-206, commands/interface/design.md:9-86
- iteration 4 current_supported_mode (ruled_out): Current-state language is consistent.; evidence=styles/_db/README.md:60-73, styles/_engine/persistent-adapter.mjs:98-111, 003/implementation-summary.md:73-99
- iteration 4 test_fixture_realism (ruled_out): A new finding would duplicate the active SLO evidence finding.; evidence=styles/_db/__tests__/fixtures.mjs:18-39, 003/implementation-summary.md:83-99

### Clean Search Proof
- iteration 1 transaction_atomicity|partial_publication (ruled_out): Direct code and failure-injection evidence agree.; evidence=styles/_db/indexer.mjs:805-998, styles/_db/__tests__/indexer.test.mjs:193-226
- iteration 1 eligibility|rrf|cursor|degradation (ruled_out): No contradictory path was found within the declared retrieval surface.; evidence=styles/_db/retrieval.mjs:99-265, styles/_db/retrieval.mjs:364-435, styles/_db/__tests__/retrieval.test.mjs:18-75
- iteration 2 corpus_symlink_containment|hydration_rights_and_hashes (ruled_out): No contradictory static path was found in the declared corpus/hydration surfaces.; evidence=styles/_engine/hydrate.mjs:66-122,225-370, styles/_engine/persistent-adapter.mjs:197-293, styles/_engine/__tests__/hydrate-guard.test.mjs:20-163
- iteration 3 phase004_registration_parity (ruled_out): Direct registration evidence and current tests agree with no contradictory route.; evidence=hub-router.json:25-40, interface-command-contract.test.mjs:10-145
- iteration 4 command_shared_contract_authority (ruled_out): Central authority and thin-router boundary are explicit.; evidence=shared/creation-contract.md:14-206, commands/interface/design.md:9-86
- iteration 4 current_supported_mode (ruled_out): Current-state language is consistent.; evidence=styles/_db/README.md:60-73, styles/_engine/persistent-adapter.mjs:98-111, 003/implementation-summary.md:73-99
- iteration 4 test_fixture_realism (ruled_out): A new finding would duplicate the active SLO evidence finding.; evidence=styles/_db/__tests__/fixtures.mjs:18-39, 003/implementation-summary.md:83-99

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: YAML-owned convergence evaluation and synthesis using the stabilized P0=0, P1=9, P2=1 active baseline - Reason: all four dimensions and the mandatory stabilization replay are complete with no artificial novelty - Rotation status: correctness, security, traceability, maintainability, and stabilization complete - Blocked/productive carry-forward: graphless direct evidence remains authoritative; preserve all ten active findings and prior ruled-out directions - Required evidence: reducer-confirmed registry/state consistency and synthesis verdict `CONDITIONAL` Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 9 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
