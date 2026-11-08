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
- Review Target: specs/hooks/023-session-relaunch-loop (spec-folder)
- Started: 2026-10-19T14:54:42Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-luna-1792421295628-xsy88n
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
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness — shared relaunch state transitions and timeout handling | correctness | 0.00 | 0/0/0 | complete |
| 2 | security — path containment and shell/notification boundaries | security | 0.00 | 0/0/0 | complete |
| 3 | traceability — parent phase contract, acceptance evidence, and closure-state reconciliation | traceability | 1.00 | 0/1/2 | complete |
| 4 | maintainability — runtime-state exemption ownership, documentation, and OpenCode configuration | maintainability | 0.00 | 0/1/2 | complete |
| 5 | integration — parent goal, phase closure evidence, runtime-state policy, and final packet status | traceability/maintainability | 0.25 | 0/1/3 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 0 |
| traceability | covered | 4 |
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
- Last 3 ratios: 1.00 -> 0.00 -> 0.25
- convergenceScore: 0.75
- openFindings: 4
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
- candidateCoverage: covered=4, ruledOut=14, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): Both state transition functions check current record status before writing.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:319, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:348
- iteration 1 timeout_cleanup (ruled_out): Current state is checked before timeout disarm and the transition has expected-value guards.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:480, .skilled/hooks/session-relaunch/lib/killer.cjs:496
- iteration 1 process_target_identity (ruled_out): Ancestry is checked immediately before signaling; no actionable defect was established.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:579, .skilled/hooks/session-relaunch/lib/killer.cjs:582
- iteration 1 event_durability (ruled_out): Byte count is checked before fsync and return.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:598, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:604
- iteration 2 path_traversal (ruled_out): The reviewed existing-file and missing-file paths preserve containment beneath the canonical handoff directory.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:138, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:168
- iteration 2 filesystem_permissions (ruled_out): Ownership, directory type, and mode are checked before state use.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:49, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:56
- iteration 2 command_injection (ruled_out): No executable interpolation sink was found in the inspected construction.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:540, .skilled/hooks/session-relaunch/lib/killer.cjs:513
- iteration 2 gate_exemption_scope (ruled_out): Targeted test definitions cover lookalikes, traversal, and README boundaries.; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1555, .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1576
- iteration 4 policy_duplication (ruled_out): No second exemption implementation or untested state-root condition was found in the reviewed files.; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:71, .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1568, .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:896
- iteration 4 documentation_contract_drift (ruled_out): No conflicting state-path wording was found across the reviewed surfaces.; evidence=AGENTS.md:70, AGENTS.md:75, .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md:28
- iteration 4 configuration_inconsistency (ruled_out): No model or variant mismatch was found.; evidence=opencode.json:3, opencode.json:6, opencode.json:10, specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/spec.md
- iteration 4 evidence_link_drift (ruled_out): No stale or inconsistent run 10 pointer was found.; evidence=.skilled/skills/system-spec-kit/benchmark/reports/README.md:27, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:46, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:118, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md:94
- iteration 5 runtime_policy_integration (ruled_out): The implementation, boundary tests, guidance, and model configuration agree.; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1568, .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:896, AGENTS.md:70, AGENTS.md:75, opencode.json:3

### Clean Search Proof
- iteration 1 state_transition (ruled_out): Both state transition functions check current record status before writing.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:319, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:348
- iteration 1 timeout_cleanup (ruled_out): Current state is checked before timeout disarm and the transition has expected-value guards.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:480, .skilled/hooks/session-relaunch/lib/killer.cjs:496
- iteration 1 process_target_identity (ruled_out): Ancestry is checked immediately before signaling; no actionable defect was established.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:579, .skilled/hooks/session-relaunch/lib/killer.cjs:582
- iteration 1 event_durability (ruled_out): Byte count is checked before fsync and return.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:598, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:604
- iteration 2 path_traversal (ruled_out): The reviewed existing-file and missing-file paths preserve containment beneath the canonical handoff directory.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:138, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:168
- iteration 2 filesystem_permissions (ruled_out): Ownership, directory type, and mode are checked before state use.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:49, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:56
- iteration 2 command_injection (ruled_out): No executable interpolation sink was found in the inspected construction.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:540, .skilled/hooks/session-relaunch/lib/killer.cjs:513
- iteration 2 gate_exemption_scope (ruled_out): Targeted test definitions cover lookalikes, traversal, and README boundaries.; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1555, .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1576
- iteration 4 policy_duplication (ruled_out): No second exemption implementation or untested state-root condition was found in the reviewed files.; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:71, .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1568, .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:896
- iteration 4 documentation_contract_drift (ruled_out): No conflicting state-path wording was found across the reviewed surfaces.; evidence=AGENTS.md:70, AGENTS.md:75, .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md:28
- iteration 4 configuration_inconsistency (ruled_out): No model or variant mismatch was found.; evidence=opencode.json:3, opencode.json:6, opencode.json:10, specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/spec.md
- iteration 4 evidence_link_drift (ruled_out): No stale or inconsistent run 10 pointer was found.; evidence=.skilled/skills/system-spec-kit/benchmark/reports/README.md:27, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:46, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:118, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md:94
- iteration 5 runtime_policy_integration (ruled_out): The implementation, boundary tests, guidance, and model configuration agree.; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1568, .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:896, AGENTS.md:70, AGENTS.md:75, opencode.json:3

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
