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
- Review Target: The three build commits 4b9bf840b0..HEAD on branch worktrees/127-surface-messages: compiled-route-sync.cjs names the authored folder to restore when specs/ or the router program packet is missing; compiled-route-guard.cjs names the runtime manifest, its authored twin and the copy on authored drift, and fails with authored-missing when the authored manifest is gone; the doctor 3c line points at the README.md block "What Adapting `sk-code` Looks Like"; the compiled_routes repair string adds the copy-back; and the tests T1 to T4 (files)
- Started: 2026-10-13T06:01:53.622Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-13T06:01:53.622Z
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.40 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 0.29 | 0/0/7 | complete |
| 5 | correctness | correctness | 0.13 | 0/0/8 | complete |

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
- Last 3 ratios: 0.40 -> 0.29 -> 0.13
- convergenceScore: 0.88
- openFindings: 8
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
- candidateCoverage: covered=6, ruledOut=18, deferred=2, blocked=0

### Search Debt
- iteration 2 read_failure_robustness (deferred): Fail-closed (non-zero), so not a security bypass; robustness and the --warn-only contract belong to the maintainability dimension.; evidence=.skilled/bin/compiled-route-guard.cjs:78, .skilled/bin/compiled-route-guard.cjs:194
- iteration 3 checklist_evidence_gap (deferred): scheduled closure task T012; copy-run rows P9-1..5 must be re-run and recorded there; evidence=tasks.md, implementation-summary.md, acceptance-criteria.md

### Ruled-Out Candidates
- iteration 1 false_pass (ruled_out): verified by direct read of authoredDrift and main; evidence=.skilled/bin/compiled-route-guard.cjs:76, .skilled/bin/compiled-route-guard.cjs:179
- iteration 1 wrong_remediation_path (ruled_out): observed in pre-commit source; evidence=.skilled/scripts/git-hooks/pre-commit:642, .skilled/scripts/git-hooks/pre-commit:676
- iteration 1 wrong_remediation_path (ruled_out): verified by grep and test read; evidence=README.md:1445, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:660
- iteration 1 raw_stack (ruled_out): verified by direct read; evidence=.skilled/bin/compiled-route-sync.cjs:42, .skilled/bin/compiled-route-sync.cjs:1115
- iteration 1 output_consumer_break (ruled_out): search found only exit-code/test consumers; evidence=.skilled/bin/tests/compiled-route-manifest.test.cjs:586
- iteration 2 command_injection (ruled_out): No exec/eval/shell sink; all path components originate from frozen constants.; evidence=.skilled/bin/compiled-route-guard.cjs:81
- iteration 2 path_traversal (ruled_out): No untrusted input reaches the parameters; production call sites derive the manifest under the root they pass.; evidence=.skilled/bin/compiled-route-guard.cjs:70
- iteration 2 symlink_bypass (ruled_out): Gate and rebuild read through the same link, so byte identity is preserved; the gate is anti-accident, not anti-tamper.; evidence=.skilled/bin/compiled-route-guard.cjs:78, .skilled/bin/compiled-route-sync.cjs:774
- iteration 2 toctou (ruled_out): Race outcome is fail-closed (non-zero exit or named failure); no bypass.; evidence=.skilled/bin/compiled-route-guard.cjs:75, .skilled/bin/compiled-route-sync.cjs:1114
- iteration 2 fail_open (ruled_out): No path from an absent manifest to ok:true; the change flips the previous fail-open to a named failure.; evidence=.skilled/bin/compiled-route-guard.cjs:124, .skilled/bin/compiled-route-guard.cjs:75
- iteration 2 exemption_abuse (ruled_out): authored-missing and authored-drift never match EXCUSABLE; an actor who can edit exemptions can edit the gate itself.; evidence=.skilled/bin/compiled-route-guard.cjs:90, .skilled/bin/compiled-route-guard.cjs:105
- iteration 3 spec_code_drift (ruled_out): full REQ-to-line mapping holds, including the closed set of guarded sync entry points; evidence=.skilled/bin/compiled-route-guard.cjs:76, .skilled/bin/compiled-route-sync.cjs:1061, .skilled/commands/doctor/scripts/parent-skill-check.cjs:496, .skilled/commands/doctor/assets/doctor-update-apply.yaml:160
- iteration 3 cross_runtime_drift (ruled_out): empty search across all seven runtime agent directories; evidence=.skilled/bin/compiled-route-guard.cjs:76
- iteration 3 skill_doc_drift (ruled_out): exact search found no skill documentation of the changed behavior; evidence=.skilled/commands/doctor/assets/doctor-update-apply.yaml:160
- iteration 3 playbook_gap (ruled_out): empty playbook search; evidence=.skilled/bin/README.md:25
- iteration 4 error_path_maintenance (ruled_out): mode contract verified: every authored-reading path carries the guard and the other modes do not read the authored closure; evidence=.skilled/bin/compiled-route-sync.cjs:1085, .skilled/bin/compiled-route-sync.cjs:1110
- iteration 4 source_duplication (ruled_out): cosmetic; the blocks differ in message and per-hub detail and have no shared failure mode; evidence=.skilled/bin/compiled-route-guard.cjs:174, .skilled/bin/compiled-route-guard.cjs:179
- iteration 4 single_source_of_truth (ruled_out): the two concrete instances are already recorded as open findings R1-P2-002 and R2-P2-001; no new instance this iteration; evidence=.skilled/bin/compiled-route-guard.cjs:70, .skilled/commands/doctor/assets/doctor-update-apply.yaml:160
- iteration 5 false_pass (ruled_out): direct read shows fail-closed for the new class; the spec's both-missing edge case reports the existing compile failure first; evidence=.skilled/bin/compiled-route-guard.cjs:66, .skilled/bin/compiled-route-guard.cjs:75, .skilled/bin/compiled-route-guard.cjs:126, .skilled/bin/compiled-route-guard.cjs:191
- iteration 5 spec_code_drift (ruled_out): full requirement-to-line mapping holds this iteration; the only drift is the repair referent, recorded as R5-P2-001; evidence=README.md:1445, .skilled/commands/doctor/scripts/parent-skill-check.cjs:496, .skilled/bin/compiled-route-guard.cjs:76, .skilled/bin/compiled-route-sync.cjs:1061
- iteration 5 output_test_gap (ruled_out): already tracked as open R3-P2-002 and R4-P2-002; no new test-surface instance this iteration; T3's copied sandbox was checked complete against the sync require chain (sync.cjs:27-36, manifest lib:10-14, layout lib:19-20); evidence=.skilled/bin/tests/compiled-route-manifest.test.cjs:586, .skilled/bin/tests/compiled-route-manifest.test.cjs:604, .skilled/bin/tests/compiled-route-manifest.test.cjs:558

### Clean Search Proof
- iteration 1 false_pass (ruled_out): verified by direct read of authoredDrift and main; evidence=.skilled/bin/compiled-route-guard.cjs:76, .skilled/bin/compiled-route-guard.cjs:179
- iteration 1 wrong_remediation_path (ruled_out): observed in pre-commit source; evidence=.skilled/scripts/git-hooks/pre-commit:642, .skilled/scripts/git-hooks/pre-commit:676
- iteration 1 wrong_remediation_path (ruled_out): verified by grep and test read; evidence=README.md:1445, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:660
- iteration 1 raw_stack (ruled_out): verified by direct read; evidence=.skilled/bin/compiled-route-sync.cjs:42, .skilled/bin/compiled-route-sync.cjs:1115
- iteration 1 output_consumer_break (ruled_out): search found only exit-code/test consumers; evidence=.skilled/bin/tests/compiled-route-manifest.test.cjs:586
- iteration 2 command_injection (ruled_out): No exec/eval/shell sink; all path components originate from frozen constants.; evidence=.skilled/bin/compiled-route-guard.cjs:81
- iteration 2 path_traversal (ruled_out): No untrusted input reaches the parameters; production call sites derive the manifest under the root they pass.; evidence=.skilled/bin/compiled-route-guard.cjs:70
- iteration 2 symlink_bypass (ruled_out): Gate and rebuild read through the same link, so byte identity is preserved; the gate is anti-accident, not anti-tamper.; evidence=.skilled/bin/compiled-route-guard.cjs:78, .skilled/bin/compiled-route-sync.cjs:774
- iteration 2 toctou (ruled_out): Race outcome is fail-closed (non-zero exit or named failure); no bypass.; evidence=.skilled/bin/compiled-route-guard.cjs:75, .skilled/bin/compiled-route-sync.cjs:1114
- iteration 2 fail_open (ruled_out): No path from an absent manifest to ok:true; the change flips the previous fail-open to a named failure.; evidence=.skilled/bin/compiled-route-guard.cjs:124, .skilled/bin/compiled-route-guard.cjs:75
- iteration 2 exemption_abuse (ruled_out): authored-missing and authored-drift never match EXCUSABLE; an actor who can edit exemptions can edit the gate itself.; evidence=.skilled/bin/compiled-route-guard.cjs:90, .skilled/bin/compiled-route-guard.cjs:105
- iteration 3 spec_code_drift (ruled_out): full REQ-to-line mapping holds, including the closed set of guarded sync entry points; evidence=.skilled/bin/compiled-route-guard.cjs:76, .skilled/bin/compiled-route-sync.cjs:1061, .skilled/commands/doctor/scripts/parent-skill-check.cjs:496, .skilled/commands/doctor/assets/doctor-update-apply.yaml:160
- iteration 3 cross_runtime_drift (ruled_out): empty search across all seven runtime agent directories; evidence=.skilled/bin/compiled-route-guard.cjs:76
- iteration 3 skill_doc_drift (ruled_out): exact search found no skill documentation of the changed behavior; evidence=.skilled/commands/doctor/assets/doctor-update-apply.yaml:160
- iteration 3 playbook_gap (ruled_out): empty playbook search; evidence=.skilled/bin/README.md:25
- iteration 4 error_path_maintenance (ruled_out): mode contract verified: every authored-reading path carries the guard and the other modes do not read the authored closure; evidence=.skilled/bin/compiled-route-sync.cjs:1085, .skilled/bin/compiled-route-sync.cjs:1110
- iteration 4 source_duplication (ruled_out): cosmetic; the blocks differ in message and per-hub detail and have no shared failure mode; evidence=.skilled/bin/compiled-route-guard.cjs:174, .skilled/bin/compiled-route-guard.cjs:179
- iteration 4 single_source_of_truth (ruled_out): the two concrete instances are already recorded as open findings R1-P2-002 and R2-P2-001; no new instance this iteration; evidence=.skilled/bin/compiled-route-guard.cjs:70, .skilled/commands/doctor/assets/doctor-update-apply.yaml:160
- iteration 5 false_pass (ruled_out): direct read shows fail-closed for the new class; the spec's both-missing edge case reports the existing compile failure first; evidence=.skilled/bin/compiled-route-guard.cjs:66, .skilled/bin/compiled-route-guard.cjs:75, .skilled/bin/compiled-route-guard.cjs:126, .skilled/bin/compiled-route-guard.cjs:191
- iteration 5 spec_code_drift (ruled_out): full requirement-to-line mapping holds this iteration; the only drift is the repair referent, recorded as R5-P2-001; evidence=README.md:1445, .skilled/commands/doctor/scripts/parent-skill-check.cjs:496, .skilled/bin/compiled-route-guard.cjs:76, .skilled/bin/compiled-route-sync.cjs:1061
- iteration 5 output_test_gap (ruled_out): already tracked as open R3-P2-002 and R4-P2-002; no new test-surface instance this iteration; T3's copied sandbox was checked complete against the sync require chain (sync.cjs:27-36, manifest lib:10-14, layout lib:19-20); evidence=.skilled/bin/tests/compiled-route-manifest.test.cjs:586, .skilled/bin/tests/compiled-route-manifest.test.cjs:604, .skilled/bin/tests/compiled-route-manifest.test.cjs:558

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
