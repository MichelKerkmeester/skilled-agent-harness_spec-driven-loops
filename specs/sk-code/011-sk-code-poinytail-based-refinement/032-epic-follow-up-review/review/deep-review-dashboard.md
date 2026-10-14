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
- Review Target: Scoped follow-up to the 030 epic review, covering what it left unread: the sk-git Commit-Id hooks (prepare-commit-msg stamping, commit-msg and pre-push refusal, lib/commit-id-policy.sh enrollment and the shipped allocator fallback in an untrusted clone), the Pi Fast Mode extension (default-on, saved state, --fast flag and subagent handoff precedence) and a line-by-line audit of every claim in .skilled/changelog/skilled/v4.0.0.4.md against the tree. Scope: the 32 files in review/scope-files.txt; for the changelog audit you may open any path the changelog itself names. (files)
- Started: 2026-10-14T18:34:14.000Z
- Status: INITIALIZED
- Iteration: 4 of 5
- Provisional Verdict: FAIL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-14T18:34:14.000Z
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
| P0 (Blockers) | 1 |
| P1 (Required) | 1 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 2 | security | security | 1.00 | 1/0/0 | complete |
| 3 | correctness | correctness | 0.33 | 0/1/0 | complete |
| 4 | traceability | traceability | 0.33 | 0/0/1 | complete |
| 5 | maintainability | maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
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
- Last 3 ratios: 0.33 -> 0.33 -> 0.00
- convergenceScore: 1.00
- openFindings: 3
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
- candidateCoverage: covered=13, ruledOut=9, deferred=3, blocked=0

### Search Debt
- iteration 2 project_config_path_boundary (deferred): The path is fixed but the symlinked parent boundary was not verified; defer to a later security pass.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:235, .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:338
- iteration 4 non_target_changelog_claim_semantics (deferred): Carry the remaining release-note behavior audit forward; do not treat the path-token scan as semantic confirmation.; evidence=.skilled/changelog/skilled/v4.0.0.4.md:49, .skilled/changelog/skilled/v4.0.0.4.md:363, .skilled/changelog/skilled/v4.0.0.4.md:407, .skilled/changelog/skilled/v4.0.0.4.md:445, .skilled/changelog/skilled/v4.0.0.4.md:475
- iteration 5 release_note_claim_drift (deferred): The remaining claims span subsystems not semantically checked in this iteration; retain this as explicit audit debt rather than asserting coverage.; evidence=.skilled/changelog/skilled/v4.0.0.4.md:34, .skilled/changelog/skilled/v4.0.0.4.md:135, .skilled/changelog/skilled/v4.0.0.4.md:427, .skilled/changelog/skilled/v4.0.0.4.md:475

### Ruled-Out Candidates
- iteration 2 hook_policy_enrollment_spoofing (ruled_out): The examined decision path is local-config-only and does not execute repository code.; evidence=.skilled/scripts/git-hooks/lib/commit-id-policy.sh:23, .skilled/scripts/git-hooks/lib/commit-id-policy.sh:38, .skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh:452
- iteration 2 allocator_collision_or_race (ruled_out): Static lock and persistence paths align with the documented common-directory allocation contract; the test was inspected, not run.; evidence=.skilled/skills/sk-git/scripts/commit-id-naming.sh:95, .skilled/skills/sk-git/scripts/commit-id-naming.sh:171, .skilled/skills/sk-git/scripts/commit-id-naming.sh:190, .skilled/skills/sk-git/scripts/tests/commit-id-naming.test.sh:81
- iteration 2 Pi_state_and_handoff_precedence (ruled_out): Observed resolution order matches the README contract and the test source covers each precedence branch.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183, .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:185, .pi/extensions/pi-fast-mode-w-subagent-support/src/handoff.ts:20, .pi/extensions/pi-fast-mode-w-subagent-support/src/handoff.ts:35, .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts:98
- iteration 2 Pi_payload_scope_or_override (ruled_out): The request gate limits changes to configured exact targets and does not replace an explicit tier.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:83, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:94, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:103, .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:203
- iteration 3 Pi_state_and_handoff_precedence (ruled_out): No contradictory branch or parent-to-child handoff defect was found.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183, .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:192, .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts:98, .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts:129
- iteration 3 Pi_payload_scope_or_override (ruled_out): Source guards return without mutation for non-target or already-tiered payloads.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:53, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:83, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:93, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:103, .pi/extensions/pi-fast-mode-w-subagent-support/tests/payload-status.test.ts:199, .pi/extensions/pi-fast-mode-w-subagent-support/tests/payload-status.test.ts:206
- iteration 4 pi_fast_mode_cross_reference_drift (ruled_out): No mismatch was found in the requested Pi state and precedence claims.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/README.md:88, .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183, .pi/extensions/pi-fast-mode-w-subagent-support/src/handoff.ts:20, .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/subagent-handoff/child-inherits-preference.md:20
- iteration 4 playbook_capability_gap (ruled_out): No playbook claim contradicts the code, though fallback-specific capability coverage is absent.; evidence=.skilled/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md:28, .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/persistence-and-startup/fast-startup-flag.md:16, .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/persistence-and-startup/state-persists-across-restart.md:16, .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/subagent-handoff/child-inherits-preference.md:20
- iteration 5 state_ownership (ruled_out): Direct source reads show a single owner for each reviewed concern.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/README.md:11, .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:107, .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:332
- iteration 5 state_precedence (ruled_out): No precedence drift found in the inspected startup flow.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:178, .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts:98, .pi/extensions/pi-fast-mode-w-subagent-support/README.md:92

### Clean Search Proof
- iteration 2 hook_policy_enrollment_spoofing (ruled_out): The examined decision path is local-config-only and does not execute repository code.; evidence=.skilled/scripts/git-hooks/lib/commit-id-policy.sh:23, .skilled/scripts/git-hooks/lib/commit-id-policy.sh:38, .skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh:452
- iteration 2 allocator_collision_or_race (ruled_out): Static lock and persistence paths align with the documented common-directory allocation contract; the test was inspected, not run.; evidence=.skilled/skills/sk-git/scripts/commit-id-naming.sh:95, .skilled/skills/sk-git/scripts/commit-id-naming.sh:171, .skilled/skills/sk-git/scripts/commit-id-naming.sh:190, .skilled/skills/sk-git/scripts/tests/commit-id-naming.test.sh:81
- iteration 2 Pi_state_and_handoff_precedence (ruled_out): Observed resolution order matches the README contract and the test source covers each precedence branch.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183, .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:185, .pi/extensions/pi-fast-mode-w-subagent-support/src/handoff.ts:20, .pi/extensions/pi-fast-mode-w-subagent-support/src/handoff.ts:35, .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts:98
- iteration 2 Pi_payload_scope_or_override (ruled_out): The request gate limits changes to configured exact targets and does not replace an explicit tier.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:83, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:94, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:103, .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:203
- iteration 3 Pi_state_and_handoff_precedence (ruled_out): No contradictory branch or parent-to-child handoff defect was found.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183, .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:192, .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts:98, .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts:129
- iteration 3 Pi_payload_scope_or_override (ruled_out): Source guards return without mutation for non-target or already-tiered payloads.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:53, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:83, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:93, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:103, .pi/extensions/pi-fast-mode-w-subagent-support/tests/payload-status.test.ts:199, .pi/extensions/pi-fast-mode-w-subagent-support/tests/payload-status.test.ts:206
- iteration 3 changelog_claim_mismatch (not_applicable): Do not create a duplicate entry for R2-P0-001.; evidence=.skilled/changelog/skilled/v4.0.0.4.md:135, .skilled/scripts/git-hooks/prepare-commit-msg:78
- iteration 4 commit_id_changelog_mismatch (not_applicable): Do not duplicate R2-P0-001.; evidence=.skilled/changelog/skilled/v4.0.0.4.md:135, .skilled/scripts/git-hooks/prepare-commit-msg:78
- iteration 4 pi_fast_mode_cross_reference_drift (ruled_out): No mismatch was found in the requested Pi state and precedence claims.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/README.md:88, .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183, .pi/extensions/pi-fast-mode-w-subagent-support/src/handoff.ts:20, .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/subagent-handoff/child-inherits-preference.md:20
- iteration 4 feature_agent_cross_runtime_gap (not_applicable): No target-specific agent contract exists to compare.; evidence=.codex/agents/deep-review.toml:1, .opencode/agents/deep-review.md:1, .claude/agents/deep-review.md:1, .pi/agents/deep-review.md:1
- iteration 4 playbook_capability_gap (ruled_out): No playbook claim contradicts the code, though fallback-specific capability coverage is absent.; evidence=.skilled/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md:28, .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/persistence-and-startup/fast-startup-flag.md:16, .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/persistence-and-startup/state-persists-across-restart.md:16, .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/subagent-handoff/child-inherits-preference.md:20
- iteration 5 state_ownership (ruled_out): Direct source reads show a single owner for each reviewed concern.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/README.md:11, .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:107, .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:332
- iteration 5 state_precedence (ruled_out): No precedence drift found in the inspected startup flow.; evidence=.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:178, .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts:98, .pi/extensions/pi-fast-mode-w-subagent-support/README.md:92
- iteration 5 untrusted_allocator_execution (not_applicable): Already tracked as R2-P0-001; the iteration avoids creating a duplicate finding.; evidence=.skilled/scripts/git-hooks/prepare-commit-msg:76, .skilled/scripts/git-hooks/prepare-commit-msg:110, .skilled/scripts/git-hooks/prepare-commit-msg:308

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P0 finding(s) blocking release.
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 3 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
