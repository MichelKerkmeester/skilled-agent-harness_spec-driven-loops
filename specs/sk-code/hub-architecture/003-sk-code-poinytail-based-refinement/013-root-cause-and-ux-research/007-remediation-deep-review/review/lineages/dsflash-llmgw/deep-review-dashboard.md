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
- Review Target: specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/007-remediation-deep-review (spec-folder)
- Started: 2026-10-10T21:22:12.815Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-dsflash-llmgw-1791667148881-n911tj
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
| P1 (Required) | 3 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness + regression inventory | correctness | 1.00 | 0/2/0 | complete |
| 2 | security: Pi dispatch authorization trust boundary and wrapper bypass | security | 1.00 | 0/1/0 | complete |
| 3 | traceability: phase-doc claim fidelity, parent close-out, mirrors, derived-artifact checks, overlay surfaces | traceability | 0.20 | 0/0/1 | complete |
| 4 | maintainability: test quality, comment hygiene, prevent-overengineering, unverified surfaces | maintainability | 0.00 | 0/0/0 | complete |
| 5 | cross-cutting closure: adversarial re-read, coverage completeness, commit guard | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

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
- Last 3 ratios: 0.20 -> 0.00 -> 0.00
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
- candidateCoverage: covered=10, ruledOut=12, deferred=2, blocked=1

### Search Debt
- iteration 1 test_pin_drift (deferred): deferred to D4; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:266-283
- iteration 2 tokenizer_evasion (deferred): deferred to the maintainability pass for a combined recommendation; evidence=probe/wrapper-probe.ts
- iteration 3 derived_artifact_staleness (blocked): attribution blocked by uncommitted packet state; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/007-remediation-deep-review/spec.md

### Ruled-Out Candidates
- iteration 1 test_pin_drift (ruled_out): verified by direct read of the resolver set and its assertion; evidence=.skilled/bin/tests/compiled-route-manifest.test.cjs:1128
- iteration 1 regression (ruled_out): rerun evidence matches the commits' claims; evidence=.skilled/bin/compiled-route-sync.cjs:1020, .skilled/bin/tests/compiled-route-manifest.test.cjs:1, .skilled/bin/tests/compiled-route-admission.test.cjs:1, specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs:1
- iteration 2 secret_exposure (ruled_out): verified by direct read; no reviewed change touches it; evidence=.skilled/hooks/dispatch/lib/dispatch-audit.mjs:531-536
- iteration 2 injection (ruled_out): verified by direct read; evidence=.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:257
- iteration 3 claim_mismatch (ruled_out): reruns and commit diffs agree with the docs; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/goal.md:44-49, specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/spec.md:154-165
- iteration 3 mirror_drift (ruled_out): verified by generator --check exit 0; evidence=.hermes/skills/system-spec-kit/SKILL.md:1
- iteration 4 test_sensitivity (ruled_out): probe demonstrates the mutant fails the assertion; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:282
- iteration 4 comment_hygiene (ruled_out): verified by diff scan; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/007-remediation-deep-review/goal-file-manifest.txt:1-32
- iteration 4 overengineering (ruled_out): assessed against the declared rule; evidence=.skilled/repo-rules/prevent-overengineering.md:53-66, README.md:160
- iteration 4 timing_flake (ruled_out): assessed as pre-existing shared assumption; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:39
- iteration 5 active_finding_replay (ruled_out): authored fixture probe still throws GOLD_MISMATCH; evidence=specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json:70
- iteration 5 active_finding_replay (ruled_out): guard and wrapper probes behave exactly as recorded; evidence=.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:185
- iteration 5 unrun_named_check (ruled_out): command exit 0; evidence=.skilled/bin/compiled-route-guard.cjs

### Clean Search Proof
- iteration 1 test_pin_drift (ruled_out): verified by direct read of the resolver set and its assertion; evidence=.skilled/bin/tests/compiled-route-manifest.test.cjs:1128
- iteration 1 regression (ruled_out): rerun evidence matches the commits' claims; evidence=.skilled/bin/compiled-route-sync.cjs:1020, .skilled/bin/tests/compiled-route-manifest.test.cjs:1, .skilled/bin/tests/compiled-route-admission.test.cjs:1, specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs:1
- iteration 2 secret_exposure (ruled_out): verified by direct read; no reviewed change touches it; evidence=.skilled/hooks/dispatch/lib/dispatch-audit.mjs:531-536
- iteration 2 injection (ruled_out): verified by direct read; evidence=.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:257
- iteration 3 claim_mismatch (ruled_out): reruns and commit diffs agree with the docs; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/goal.md:44-49, specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/spec.md:154-165
- iteration 3 mirror_drift (ruled_out): verified by generator --check exit 0; evidence=.hermes/skills/system-spec-kit/SKILL.md:1
- iteration 4 test_sensitivity (ruled_out): probe demonstrates the mutant fails the assertion; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:282
- iteration 4 comment_hygiene (ruled_out): verified by diff scan; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/007-remediation-deep-review/goal-file-manifest.txt:1-32
- iteration 4 overengineering (ruled_out): assessed against the declared rule; evidence=.skilled/repo-rules/prevent-overengineering.md:53-66, README.md:160
- iteration 4 timing_flake (ruled_out): assessed as pre-existing shared assumption; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:39
- iteration 5 active_finding_replay (ruled_out): authored fixture probe still throws GOLD_MISMATCH; evidence=specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json:70
- iteration 5 active_finding_replay (ruled_out): guard and wrapper probes behave exactly as recorded; evidence=.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:185
- iteration 5 unrun_named_check (ruled_out): command exit 0; evidence=.skilled/bin/compiled-route-guard.cjs

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (review complete; synthesis next) - Focus area: synthesis inputs — findings registry, five iteration records, delta files, report assembly - Reason: all dimensions covered, all named checks run, five of five iterations dispatched - Rotation status: complete - Blocked/productive carry-forward: 004 vitest rerun and strict validation remain out of containment; both caveated in the report - Required evidence: registry counts, iteration files 1..5, delta files 1..5 - Recovery note: none Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 3 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
