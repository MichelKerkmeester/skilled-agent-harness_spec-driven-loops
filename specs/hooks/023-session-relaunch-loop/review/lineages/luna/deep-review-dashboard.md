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
- Started: 2026-10-20T16:53:01Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-luna-1792514860659-ivxs3k
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
| P0 (Blockers) | 1 |
| P1 (Required) | 4 |
| P2 (Suggestions) | 1 |
| Resolved | 1 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: shared usage and threshold-to-nudge path | correctness | 1.00 | 0/1/0 | complete |
| 2 | correctness: suppression guards, nudge reminders, and adapter delivery | correctness | 0.00 | 0/0/0 | complete |
| 3 | correctness: note metadata, prepare validation, and receiving seed continuity | correctness | 1.00 | 0/1/0 | complete |
| 4 | security: arm-event identity, killer spawn failure, and re-arm behavior across runtimes | security | 1.00 | 0/1/0 | complete |
| 5 | traceability: killer idle, signal, grace, timeout, and record-change behavior | traceability | 1.00 | 0/1/0 | complete |
| 6 | maintainability: wrapper exit/decision contract, cwd/model/flag carry, seed generation, and receiving-session claim | maintainability | 0.00 | 0/0/0 | complete |
| 7 | correctness: shell-shim wrapper discovery, interactive/pass-through classification, TTY behavior, and Hermes plugin environment | correctness | 0.00 | 0/0/0 | complete |
| 8 | correctness/traceability: linked .skilled root and state/config paths, plus automatic runtime hook registrations | correctness/traceability | 1.00 | 1/0/0 | complete |
| 9 | correctness/maintainability: Cursor and Devin command-only invocation plus handoff workflow contract | correctness/maintainability/traceability | 1.00 | 0/2/0 | complete |
| 10 | correctness/traceability: final adversarial re-check of all active findings, severity challenge, and checklist evidence | correctness/traceability | 0.00 | 1/4/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 6
- persistentSameSeverity: 5
- severityChanged: 1
- repeatedFindings (deprecated combined bucket): 6

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=32, ruledOut=31, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 2 suppression_order (ruled_out): No divergence found in the shared guard order.; evidence=.skilled/hooks/session-relaunch/lib/nudge.cjs:394-420, .skilled/hooks/session-relaunch/lib/nudge.cjs:438-458, .skilled/hooks/session-relaunch/tests/nudge.test.cjs:1012-1048
- iteration 2 held_nudge_delivery (ruled_out): No lost or prematurely emitted held nudge was found in the current path.; evidence=.skilled/hooks/session-relaunch/pi/session-relaunch.ts:347-352, .skilled/hooks/session-relaunch/pi/session-relaunch.ts:374-399
- iteration 2 re_nudge_boundary (ruled_out): No lost first reminder or incorrect +5% boundary was identified.; evidence=.skilled/hooks/session-relaunch/opencode/session-relaunch.js:123-152, .skilled/hooks/session-relaunch/opencode/session-relaunch.js:335-345, .skilled/hooks/session-relaunch/tests/nudge.test.cjs:655-658, .skilled/hooks/session-relaunch/tests/nudge.test.cjs:1051-1065
- iteration 2 armed_record_freshness (ruled_out): The reviewed condition is fixed in current shouldRelaunch.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:485-503, .skilled/hooks/session-relaunch/lib/nudge.cjs:363-390, specs/hooks/023-session-relaunch-loop/review-archive/20261020T164213Z/review-report.md:24, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:492-501
- iteration 3 path_containment_escape (ruled_out): No path escape was found in the reviewed branch.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:127-193
- iteration 3 runtime_flag_conflict (ruled_out): No runtime mismatch path remained.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:331-350
- iteration 4 arm_event_identity (ruled_out): No mismatched record was found in the reviewed event paths.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:403-415, .skilled/hooks/session-relaunch/codex/stop-arm.mjs:89-102, .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:54-62, .skilled/hooks/session-relaunch/pi/session-relaunch.ts:374-382, .skilled/hooks/session-relaunch/opencode/session-relaunch.js:274-284
- iteration 4 duplicate_live_killer (ruled_out): The current code rejects an already-armed record while a killer owns the lock.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:403-415, .skilled/hooks/session-relaunch/claude/stop-arm.mjs:93-102, specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/iterations/iteration-005.md:46-53
- iteration 4 stale_rearm_timestamp (ruled_out): The stale timestamp/cwd failure fixed in phase 011 does not remain in current arm logic.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:368-384, .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:469-493, .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:891-896
- iteration 5 idle_detection (ruled_out): No early-signal path was found in the reviewed branch.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:146-185
- iteration 5 kill_target_and_grace (ruled_out): No signal/grace ordering defect was found.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:547-634
- iteration 6 wrapper_exit_decision (ruled_out): The inspected decision, cwd, note-state, and exit-130 paths preserve a claim route.; evidence=.skilled/bin/skilled-loop:423-514
- iteration 6 runtime_argument_carry (ruled_out): No carry mismatch was found in the documented runtime matrix.; evidence=.skilled/bin/skilled-loop:169-239, .skilled/hooks/session-relaunch/README.md:23-33, .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:930-965,1049-1084,1251-1275,1596-1645
- iteration 6 receiving_seed_claim (ruled_out): The prior finding omitted the live note-to-consume-to-seed source and is retracted.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:536-575, .skilled/bin/skilled-loop:93-105,507-510, .skilled/hooks/session-relaunch/lib/nudge.cjs:191-235
- iteration 7 shell_wrapper_discovery (ruled_out): The inspected resolver and tests cover both link and nested-directory cases in Bash and zsh.; evidence=.skilled/bin/skilled-loop-shell.sh:166-179, .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:53-58,85-98
- iteration 7 runtime_invocation_classification (ruled_out): No classification mismatch was identified in the reviewed lists and cases.; evidence=.skilled/bin/skilled-loop-shell.sh:54-164, .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:24-51,85-107
- iteration 7 tty_gate (ruled_out): The checked gate matches the documented need for a terminal handoff.; evidence=.skilled/bin/skilled-loop-shell.sh:185-204, .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:147-187
- iteration 7 hermes_project_plugin_scope (ruled_out): The variable is scoped to the wrapped Hermes invocation in source and test evidence.; evidence=.skilled/bin/skilled-loop-shell.sh:187-203, .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:189-203
- iteration 8 linked_repo_root_resolution (ruled_out): The install-root behavior is documented and the loop record returns the project cwd for continuation.; evidence=.skilled/hooks/session-relaunch/lib/nudge.cjs:236-249, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:182-204, .skilled/bin/skilled-loop:282-298,423-436, .skilled/hooks/session-relaunch/README.md:184
- iteration 9 plain_workflow_contract (ruled_out): The plain-command structure and router-contract scope match the reviewed authoring guidance.; evidence=.skilled/commands/speckit/handoff.md:1-162, .skilled/skills/sk-doc/sk-create-command/SKILL.md:262-269, .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:47-75, .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:4-10
- iteration 9 devin_direct_file_entrypoint (ruled_out): The direct-file fallback is documented, though the shared matrix's slash-command shorthand is misleading.; evidence=.devin/SYNC.md:20, .skilled/hooks/session-relaunch/README.md:31,45
- iteration 9 duplicate_review_finding (ruled_out): No prior report records either current finding, and the adjacent old handoff issues were rechecked as fixed.; evidence=.skilled/commands/speckit/handoff.md:105-107,135

### Clean Search Proof
- iteration 2 suppression_order (ruled_out): No divergence found in the shared guard order.; evidence=.skilled/hooks/session-relaunch/lib/nudge.cjs:394-420, .skilled/hooks/session-relaunch/lib/nudge.cjs:438-458, .skilled/hooks/session-relaunch/tests/nudge.test.cjs:1012-1048
- iteration 2 held_nudge_delivery (ruled_out): No lost or prematurely emitted held nudge was found in the current path.; evidence=.skilled/hooks/session-relaunch/pi/session-relaunch.ts:347-352, .skilled/hooks/session-relaunch/pi/session-relaunch.ts:374-399
- iteration 2 re_nudge_boundary (ruled_out): No lost first reminder or incorrect +5% boundary was identified.; evidence=.skilled/hooks/session-relaunch/opencode/session-relaunch.js:123-152, .skilled/hooks/session-relaunch/opencode/session-relaunch.js:335-345, .skilled/hooks/session-relaunch/tests/nudge.test.cjs:655-658, .skilled/hooks/session-relaunch/tests/nudge.test.cjs:1051-1065
- iteration 2 armed_record_freshness (ruled_out): The reviewed condition is fixed in current shouldRelaunch.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:485-503, .skilled/hooks/session-relaunch/lib/nudge.cjs:363-390, specs/hooks/023-session-relaunch-loop/review-archive/20261020T164213Z/review-report.md:24, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:492-501
- iteration 3 path_containment_escape (ruled_out): No path escape was found in the reviewed branch.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:127-193
- iteration 3 runtime_flag_conflict (ruled_out): No runtime mismatch path remained.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:331-350
- iteration 4 arm_event_identity (ruled_out): No mismatched record was found in the reviewed event paths.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:403-415, .skilled/hooks/session-relaunch/codex/stop-arm.mjs:89-102, .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:54-62, .skilled/hooks/session-relaunch/pi/session-relaunch.ts:374-382, .skilled/hooks/session-relaunch/opencode/session-relaunch.js:274-284
- iteration 4 duplicate_live_killer (ruled_out): The current code rejects an already-armed record while a killer owns the lock.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:403-415, .skilled/hooks/session-relaunch/claude/stop-arm.mjs:93-102, specs/hooks/023-session-relaunch-loop/review-archive/20261018T184826Z/iterations/iteration-005.md:46-53
- iteration 4 stale_rearm_timestamp (ruled_out): The stale timestamp/cwd failure fixed in phase 011 does not remain in current arm logic.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:368-384, .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:469-493, .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:891-896
- iteration 5 idle_detection (ruled_out): No early-signal path was found in the reviewed branch.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:146-185
- iteration 5 kill_target_and_grace (ruled_out): No signal/grace ordering defect was found.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:547-634
- iteration 6 wrapper_exit_decision (ruled_out): The inspected decision, cwd, note-state, and exit-130 paths preserve a claim route.; evidence=.skilled/bin/skilled-loop:423-514
- iteration 6 runtime_argument_carry (ruled_out): No carry mismatch was found in the documented runtime matrix.; evidence=.skilled/bin/skilled-loop:169-239, .skilled/hooks/session-relaunch/README.md:23-33, .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:930-965,1049-1084,1251-1275,1596-1645
- iteration 6 receiving_seed_claim (ruled_out): The prior finding omitted the live note-to-consume-to-seed source and is retracted.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:536-575, .skilled/bin/skilled-loop:93-105,507-510, .skilled/hooks/session-relaunch/lib/nudge.cjs:191-235
- iteration 7 shell_wrapper_discovery (ruled_out): The inspected resolver and tests cover both link and nested-directory cases in Bash and zsh.; evidence=.skilled/bin/skilled-loop-shell.sh:166-179, .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:53-58,85-98
- iteration 7 runtime_invocation_classification (ruled_out): No classification mismatch was identified in the reviewed lists and cases.; evidence=.skilled/bin/skilled-loop-shell.sh:54-164, .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:24-51,85-107
- iteration 7 tty_gate (ruled_out): The checked gate matches the documented need for a terminal handoff.; evidence=.skilled/bin/skilled-loop-shell.sh:185-204, .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:147-187
- iteration 7 hermes_project_plugin_scope (ruled_out): The variable is scoped to the wrapped Hermes invocation in source and test evidence.; evidence=.skilled/bin/skilled-loop-shell.sh:187-203, .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:189-203
- iteration 8 linked_repo_root_resolution (ruled_out): The install-root behavior is documented and the loop record returns the project cwd for continuation.; evidence=.skilled/hooks/session-relaunch/lib/nudge.cjs:236-249, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:182-204, .skilled/bin/skilled-loop:282-298,423-436, .skilled/hooks/session-relaunch/README.md:184
- iteration 9 plain_workflow_contract (ruled_out): The plain-command structure and router-contract scope match the reviewed authoring guidance.; evidence=.skilled/commands/speckit/handoff.md:1-162, .skilled/skills/sk-doc/sk-create-command/SKILL.md:262-269, .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:47-75, .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:4-10
- iteration 9 devin_direct_file_entrypoint (ruled_out): The direct-file fallback is documented, though the shared matrix's slash-command shorthand is misleading.; evidence=.devin/SYNC.md:20, .skilled/hooks/session-relaunch/README.md:31,45
- iteration 9 duplicate_review_finding (ruled_out): No prior report records either current finding, and the adjacent old handoff issues were rechecked as fixed.; evidence=.skilled/commands/speckit/handoff.md:105-107,135

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: compile ten iterations, the active registry, checklist evidence, and the execution-mode limitation; emit the terminal max-iteration synthesis event. - Reason: the configured 10-iteration cap has been reached; only synthesis and final-state verification remain. - Rotation status: all four review dimensions were covered across the lineage. - Blocked/productive carry-forward: fix active findings and run provider-backed live hops in the owning implementation workflow. - Required evidence: reducer-owned registry/dashboard/strategy, all ten iteration and delta artifacts, final report, and gateway synthesis event. Review verdict: FAIL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P0 finding(s) blocking release.
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
