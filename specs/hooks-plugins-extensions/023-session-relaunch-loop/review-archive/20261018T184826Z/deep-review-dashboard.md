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
- Started: 2026-10-18T12:41:21.177Z
- Status: COMPLETE
- Iteration: 7 of 10
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: 2026-10-18T12:41:21.177Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

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
| P2 (Suggestions) | 12 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness (inventory pass) | correctness | 1.00 | 0/0/3 | complete |
| 2 | security: killer targeting and lock safety, path containment, seed/manual-command escaping, state-dir trust, adapter payload surface | security | 1.00 | 0/0/2 | complete |
| 3 | traceability | traceability | 0.29 | 0/0/2 | complete |
| 4 | maintainability: adapter duplication, comment hygiene, README accuracy | maintainability | 0.30 | 0/0/3 | complete |
| 5 | correctness second pass: runtime adapters and the wrapper per-runtime case and decline paths; re-confirm the ten open P2 findings | correctness | 0.09 | 0/0/1 | complete |
| 6 | adversarial re-verification of the 11 open P2 findings + residual registration and environment-switch surfaces | correctness/traceability | 0.00 | 0/0/0 | complete |
| 7 | search-debt discharge | traceability/maintainability | 0.08 | 0/0/12 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 10 |
| security | covered | 0 |
| traceability | covered | 2 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.09 -> 0.00 -> 0.08
- convergenceScore: 0.92
- openFindings: 12
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
- candidateCoverage: covered=22, ruledOut=18, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): Verified by direct read of relaunch-core.cjs, killer.cjs and the transition tests.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:554
- iteration 1 argument_forwarding (ruled_out): Contract 11.6-11.7 and wrapper test "second invocation uses only the seed and name" define the carry set.; evidence=.skilled/bin/skilled-loop:98
- iteration 2 command_injection (ruled_out): Escaping verified in both builders; no eval or shell interpolation of the seed.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:519, .skilled/bin/skilled-loop:42, .skilled/bin/skilled-loop:134
- iteration 2 path_traversal (ruled_out): Containment is enforced at the CLI boundary for prepare, claim and complete.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:71, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:96, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:123
- iteration 2 pid_reuse (ruled_out): Reuse window is one synchronous read, SIGTERM is permission-bounded to the same user, and portable Node has no pidfd identity check.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:322, .skilled/hooks/session-relaunch/lib/killer.cjs:336
- iteration 2 env_trust (ruled_out): Template is wrapper-produced and the seed is escaped before substitution.; evidence=.skilled/bin/skilled-loop:231, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:519
- iteration 2 notification_injection (ruled_out): argv-only spawn plus JSON quoting prevents AppleScript string termination.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:306
- iteration 3 runtime_parity (ruled_out): All six bindings match the registry by event, group and script, and no undeclared session-relaunch row exists.; evidence=.claude/settings.json:247, .claude/settings.json:126, .claude/settings.json:192, .codex/hooks.json:1
- iteration 3 command_mirror_parity (ruled_out): No surface is missing and none names a path other than the canonical command.; evidence=.skilled/commands/speckit/handoff.md:1, .codex/prompts/speckit-handoff.md:1, .hermes/prompts/speckit-handoff.md:1, .pi/prompts/speckit-handoff.md:1
- iteration 3 catalog_code_drift (ruled_out): All four sampled catalog claims match the code exactly.; evidence=.skilled/hooks/session-relaunch/lib/nudge.cjs:19, .skilled/hooks/session-relaunch/lib/nudge.cjs:21, .skilled/bin/skilled-loop:62
- iteration 3 playbook_code_drift (ruled_out): The four documented relaunch forms match the wrapper arms and the stub assertions.; evidence=.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:120, .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:424, .skilled/bin/skilled-loop:62
- iteration 4 comment_hygiene (ruled_out): negative grep over all named adapter, lib and wrapper files; evidence=.skilled/hooks/session-relaunch/claude/context-nudge.mjs:33, .skilled/hooks/session-relaunch/pi/session-relaunch.ts:226
- iteration 5 mirror_link_shape (ruled_out): Both handoff mirrors and the Pi extension are real symlinks; the README claim is accurate.; evidence=UNKNOWN
- iteration 5 adapter_payload_handling (ruled_out): All five spawn sites are argv-only; SL-108 closed.; evidence=UNKNOWN
- iteration 7 quantitative_doc_claim (ruled_out): Six quantitative claims checked against their constants; no drift.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:11, .skilled/hooks/session-relaunch/lib/killer.cjs:12, .skilled/hooks/session-relaunch/lib/killer.cjs:14, .skilled/hooks/session-relaunch/lib/killer.cjs:34, .skilled/hooks/session-relaunch/lib/killer.cjs:35, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:384, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:390, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:401, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:51, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:372, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:373, .skilled/hooks/session-relaunch/lib/context-usage.cjs:177
- iteration 7 stale_evidence_pointer (ruled_out): No new pointer finding; existing T3-P2-001 owns the T009 evidence-row defect.; evidence=specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:56, specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:58, .skilled/hooks/README.md:30, .skilled/hooks/README.md:186, .skilled/hooks/README.md:278, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md:40
- iteration 7 test_coverage_gap (ruled_out): No named adapter behavior is untested.; evidence=.opencode/plugins/tests/session-relaunch.test.cjs:143, .opencode/plugins/tests/session-relaunch.test.cjs:292, .opencode/plugins/tests/session-relaunch.test.cjs:731, .opencode/plugins/tests/session-relaunch.test.cjs:826
- iteration 7 duplicated_logic (ruled_out): Fold confirmed at remediation level; not a separate finding.; evidence=deep-review-findings-registry.json

### Clean Search Proof
- iteration 1 state_transition (ruled_out): Verified by direct read of relaunch-core.cjs, killer.cjs and the transition tests.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:554
- iteration 1 argument_forwarding (ruled_out): Contract 11.6-11.7 and wrapper test "second invocation uses only the seed and name" define the carry set.; evidence=.skilled/bin/skilled-loop:98
- iteration 2 command_injection (ruled_out): Escaping verified in both builders; no eval or shell interpolation of the seed.; evidence=.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:519, .skilled/bin/skilled-loop:42, .skilled/bin/skilled-loop:134
- iteration 2 path_traversal (ruled_out): Containment is enforced at the CLI boundary for prepare, claim and complete.; evidence=.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:71, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:96, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:123
- iteration 2 pid_reuse (ruled_out): Reuse window is one synchronous read, SIGTERM is permission-bounded to the same user, and portable Node has no pidfd identity check.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:322, .skilled/hooks/session-relaunch/lib/killer.cjs:336
- iteration 2 env_trust (ruled_out): Template is wrapper-produced and the seed is escaped before substitution.; evidence=.skilled/bin/skilled-loop:231, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:519
- iteration 2 notification_injection (ruled_out): argv-only spawn plus JSON quoting prevents AppleScript string termination.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:306
- iteration 3 runtime_parity (ruled_out): All six bindings match the registry by event, group and script, and no undeclared session-relaunch row exists.; evidence=.claude/settings.json:247, .claude/settings.json:126, .claude/settings.json:192, .codex/hooks.json:1
- iteration 3 command_mirror_parity (ruled_out): No surface is missing and none names a path other than the canonical command.; evidence=.skilled/commands/speckit/handoff.md:1, .codex/prompts/speckit-handoff.md:1, .hermes/prompts/speckit-handoff.md:1, .pi/prompts/speckit-handoff.md:1
- iteration 3 catalog_code_drift (ruled_out): All four sampled catalog claims match the code exactly.; evidence=.skilled/hooks/session-relaunch/lib/nudge.cjs:19, .skilled/hooks/session-relaunch/lib/nudge.cjs:21, .skilled/bin/skilled-loop:62
- iteration 3 playbook_code_drift (ruled_out): The four documented relaunch forms match the wrapper arms and the stub assertions.; evidence=.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:120, .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:424, .skilled/bin/skilled-loop:62
- iteration 4 comment_hygiene (ruled_out): negative grep over all named adapter, lib and wrapper files; evidence=.skilled/hooks/session-relaunch/claude/context-nudge.mjs:33, .skilled/hooks/session-relaunch/pi/session-relaunch.ts:226
- iteration 5 io_error_handling (not_applicable): Re-confirmation sweep of existing findings; nine confirmed and one carried, no new finding beyond M5-P2-001.; evidence=UNKNOWN
- iteration 5 mirror_link_shape (ruled_out): Both handoff mirrors and the Pi extension are real symlinks; the README claim is accurate.; evidence=UNKNOWN
- iteration 5 adapter_payload_handling (ruled_out): All five spawn sites are argv-only; SL-108 closed.; evidence=UNKNOWN
- iteration 7 quantitative_doc_claim (ruled_out): Six quantitative claims checked against their constants; no drift.; evidence=.skilled/hooks/session-relaunch/lib/killer.cjs:11, .skilled/hooks/session-relaunch/lib/killer.cjs:12, .skilled/hooks/session-relaunch/lib/killer.cjs:14, .skilled/hooks/session-relaunch/lib/killer.cjs:34, .skilled/hooks/session-relaunch/lib/killer.cjs:35, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:384, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:390, .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:401, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:51, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:372, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:373, .skilled/hooks/session-relaunch/lib/context-usage.cjs:177
- iteration 7 stale_evidence_pointer (ruled_out): No new pointer finding; existing T3-P2-001 owns the T009 evidence-row defect.; evidence=specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:56, specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:58, .skilled/hooks/README.md:30, .skilled/hooks/README.md:186, .skilled/hooks/README.md:278, .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md:40
- iteration 7 test_coverage_gap (ruled_out): No named adapter behavior is untested.; evidence=.opencode/plugins/tests/session-relaunch.test.cjs:143, .opencode/plugins/tests/session-relaunch.test.cjs:292, .opencode/plugins/tests/session-relaunch.test.cjs:731, .opencode/plugins/tests/session-relaunch.test.cjs:826
- iteration 7 duplicated_logic (ruled_out): Fold confirmed at remediation level; not a separate finding.; evidence=deep-review-findings-registry.json

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis / adjudication (all four dimensions are covered; this was the adversarial re-verification pass). - Focus area: reconcile strategy section 14, the findings registry and the dashboard; no new code direction remains. - Reason: zero new findings and zero severity changes give `newFindingsRatio` 0.0, below the 0.10 convergence threshold; no P0/P1 is active. - Rotation status: post-coverage; dimension rotation complete. - Blocked/productive carry-forward: T3-P2-001 and T3-P2-002 carried (packet docs re-read but not repaired); R2-P2-002 narrowed; SL-208 remains deferred. - Required evidence: reducer-refreshed registry and dashboard, plus the two carried packet-doc findings. - Recovery note: none; iteration state is coherent.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 12 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
