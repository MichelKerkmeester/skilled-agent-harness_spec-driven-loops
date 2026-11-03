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
- Review Target: specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner (spec-folder)
- Started: 2026-11-02T10:05:06Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-luna-xhigh-1793613625067-f04kmf
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
| P0 (Blockers) | 2 |
| P1 (Required) | 4 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 1/2/0 | complete |
| 2 | security | security | 0.44 | 2/3/1 | complete |
| 3 | traceability | traceability | 0.03 | 2/3/2 | complete |
| 4 | maintainability | maintainability | 0.12 | 2/4/2 | complete |
| 5 | security | security | 0.00 | 2/4/2 | complete |
| 6 | correctness | correctness | 0.00 | 2/4/2 | complete |
| 7 | traceability | traceability | 0.00 | 2/4/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 8 |
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
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 8
- persistentSameSeverity: 8
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 8

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=20, ruledOut=8, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 runtime_adapters (ruled_out): No distinct adapter-only correctness defect was established by static review.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 1 codex_hook_trust (ruled_out): Code and regression assertions align on restoring only run-owned project hook trust and preserving external config tables.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:349-540, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:609-686
- iteration 1 conversation_parser (ruled_out): The parser applies JSON parsing and findings to the shared first-block result; tests cover absent block and validation outcomes.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:189-219, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-549, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:558-565
- iteration 2 conversation_parser (ruled_out): Parsing is shared and validated before runtime script execution; no security gap was found in scope.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:189-219, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-549
- iteration 3 adapter_evidence (ruled_out): No additional adapter mapping inconsistency was visible in the declared sources.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112, specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:181, specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/acceptance-criteria.md:60
- iteration 3 parser_consistency (ruled_out): The shared parser and consumer checks agree on JSON and structural findings.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2588-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 4 adapter_maintenance (ruled_out): No duplicated adapter branch or orphaned adapter was found in the declared table.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 4 parser_maintenance (ruled_out): The shared parser keeps both consumers aligned.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2588-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 4 fixture_fidelity (ruled_out): No fake subject behavior mismatch exists; missing coverage is captured by separate findings.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-568, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:571-605
- iteration 5 adapter_maintenance (ruled_out): No distinct mapping or orphaned-adapter defect was established.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 5 parser_maintenance (ruled_out): No separate parser implementation or consumer discrepancy was found.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2578-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 5 fixture_fidelity (ruled_out): Fixture fidelity is not itself a new defect; separate findings retain the missing assertions.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-605
- iteration 6 adapter_maintenance (ruled_out): No distinct defect beyond the already recorded findings was established.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 6 parser_maintenance (ruled_out): No distinct defect beyond the already recorded findings was established.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2578-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 6 fixture_fidelity (ruled_out): No distinct defect beyond the already recorded findings was established.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-605
- iteration 7 adapter_maintenance (ruled_out): No additional defect was established during the recovery check.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 7 parser_maintenance (ruled_out): No additional defect was established during the recovery check.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2578-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 7 fixture_fidelity (ruled_out): No additional defect was established during the recovery check.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-605

### Clean Search Proof
- iteration 1 runtime_adapters (ruled_out): No distinct adapter-only correctness defect was established by static review.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 1 codex_hook_trust (ruled_out): Code and regression assertions align on restoring only run-owned project hook trust and preserving external config tables.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:349-540, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:609-686
- iteration 1 conversation_parser (ruled_out): The parser applies JSON parsing and findings to the shared first-block result; tests cover absent block and validation outcomes.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:189-219, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-549, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:558-565
- iteration 2 conversation_parser (ruled_out): Parsing is shared and validated before runtime script execution; no security gap was found in scope.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:189-219, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-549
- iteration 3 adapter_evidence (ruled_out): No additional adapter mapping inconsistency was visible in the declared sources.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112, specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md:181, specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/acceptance-criteria.md:60
- iteration 3 parser_consistency (ruled_out): The shared parser and consumer checks agree on JSON and structural findings.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2588-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 4 adapter_maintenance (ruled_out): No duplicated adapter branch or orphaned adapter was found in the declared table.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 4 parser_maintenance (ruled_out): The shared parser keeps both consumers aligned.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2588-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 4 fixture_fidelity (ruled_out): No fake subject behavior mismatch exists; missing coverage is captured by separate findings.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-568, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:571-605
- iteration 5 adapter_maintenance (ruled_out): No distinct mapping or orphaned-adapter defect was established.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 5 parser_maintenance (ruled_out): No separate parser implementation or consumer discrepancy was found.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2578-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 5 fixture_fidelity (ruled_out): Fixture fidelity is not itself a new defect; separate findings retain the missing assertions.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-605
- iteration 6 adapter_maintenance (ruled_out): No distinct defect beyond the already recorded findings was established.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 6 parser_maintenance (ruled_out): No distinct defect beyond the already recorded findings was established.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2578-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 6 fixture_fidelity (ruled_out): No distinct defect beyond the already recorded findings was established.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-605
- iteration 7 adapter_maintenance (ruled_out): No additional defect was established during the recovery check.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1008-1112
- iteration 7 parser_maintenance (ruled_out): No additional defect was established during the recovery check.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:2578-2607, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:518-569
- iteration 7 fixture_fidelity (ruled_out): No additional defect was established during the recovery check.; evidence=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/fake-subject.cjs:1-180, .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs:541-605

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P0 finding(s) blocking release.
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
