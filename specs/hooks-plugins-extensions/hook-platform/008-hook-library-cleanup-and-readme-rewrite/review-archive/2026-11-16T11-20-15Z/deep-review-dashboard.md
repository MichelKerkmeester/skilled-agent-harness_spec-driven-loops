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
- Review Target: specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite (spec-folder)
- Started: 2026-11-16T10:21:46.673Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-11-16T10:21:46.673Z
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
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/3 | complete |
| 5 | traceability stabilization: re-verify five carried P2s, run spec_code and checklist_evidence, comment hygiene | traceability | 0.17 | 0/0/6 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 0 |
| traceability | covered | 3 |
| maintainability | covered | 3 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.85
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 1.00 -> 0.17
- convergenceScore: 0.83
- openFindings: 6
- persistentSameSeverity: 5
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 5

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=8, ruledOut=12, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): bypass is scoped to the non-writing check path; evidence=.skilled/bin/install-codex-hooks.mjs:324, .skilled/bin/install-codex-hooks.mjs:336-344
- iteration 1 error_handling (ruled_out): suppression is gated on success in both runtimes; evidence=.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:59, .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs:65-70
- iteration 1 path_resolution (ruled_out): no dead registration or mirror; evidence=.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:1, .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:1
- iteration 1 path_resolution (ruled_out): no dangling specifier; evidence=.skilled/hooks/completion-evidence/pi/completion-evidence.ts:12, .skilled/hooks/shared/hook-flags.mjs:1
- iteration 2 command_injection (ruled_out): all reached sinks pass argv arrays; no shell-string interpolation found; evidence=.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1208, .skilled/hooks/decision-capture/lib/capture-core.mjs:251, .skilled/hooks/goal/dsh/goal-manage.mjs:47, .skilled/hooks/cli-dispatch/cursor/dispatch-preflight-lint.mjs:80
- iteration 2 secret_exposure (ruled_out): permission claim verified against the guard library; evidence=.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs:111-112, .skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs:129, .skilled/hooks/env-secret-guard/README.md:220
- iteration 2 guard_bypass (ruled_out): check path writes nothing and drift still exits 1; evidence=.skilled/bin/install-codex-hooks.mjs:324, .skilled/bin/install-codex-hooks.mjs:336-344, .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:59, .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs:65-67
- iteration 2 unsafe_file_write (ruled_out): no trust boundary crosses the write path; evidence=.skilled/bin/install-codex-hooks.mjs:281-300, .skilled/bin/install-codex-hooks.mjs:367-378
- iteration 2 supply_chain_ci (ruled_out): pinned actions, explicit permissions, no run-step event interpolation; evidence=.github/workflows/opencode-plugin-tests.yml:66, .github/workflows/opencode-plugin-tests.yml:88, .github/workflows/dispatch-enforcement-guard.yml:10
- iteration 3 unsupported_completion_claim (ruled_out): no unchecked implementation tasks and no non-Met acceptance rows; the one deferral documents itself; evidence=specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal/tasks.md:165
- iteration 4 documentation_structure_drift (ruled_out): All four sampled READMEs use the same section order and the same five-column runtime table.; evidence=.skilled/hooks/cli-dispatch/README.md:123, .skilled/hooks/completion-evidence/README.md:94
- iteration 4 undocumented_convention (ruled_out): The convention is documented once at the canonical index and echoed in the affected concern README.; evidence=.skilled/hooks/README.md:79, .skilled/hooks/subagent-dispatch-guard/README.md:157
- iteration 5 comment_hygiene (ruled_out): No packet spec or phase id appears in the named code surfaces.; evidence=.skilled/hooks/goal/lib/goal-core.test.cjs:716

### Clean Search Proof
- iteration 1 state_transition (ruled_out): bypass is scoped to the non-writing check path; evidence=.skilled/bin/install-codex-hooks.mjs:324, .skilled/bin/install-codex-hooks.mjs:336-344
- iteration 1 error_handling (ruled_out): suppression is gated on success in both runtimes; evidence=.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:59, .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs:65-70
- iteration 1 path_resolution (ruled_out): no dead registration or mirror; evidence=.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:1, .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:1
- iteration 1 path_resolution (ruled_out): no dangling specifier; evidence=.skilled/hooks/completion-evidence/pi/completion-evidence.ts:12, .skilled/hooks/shared/hook-flags.mjs:1
- iteration 2 command_injection (ruled_out): all reached sinks pass argv arrays; no shell-string interpolation found; evidence=.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1208, .skilled/hooks/decision-capture/lib/capture-core.mjs:251, .skilled/hooks/goal/dsh/goal-manage.mjs:47, .skilled/hooks/cli-dispatch/cursor/dispatch-preflight-lint.mjs:80
- iteration 2 secret_exposure (ruled_out): permission claim verified against the guard library; evidence=.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs:111-112, .skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs:129, .skilled/hooks/env-secret-guard/README.md:220
- iteration 2 guard_bypass (ruled_out): check path writes nothing and drift still exits 1; evidence=.skilled/bin/install-codex-hooks.mjs:324, .skilled/bin/install-codex-hooks.mjs:336-344, .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:59, .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs:65-67
- iteration 2 unsafe_file_write (ruled_out): no trust boundary crosses the write path; evidence=.skilled/bin/install-codex-hooks.mjs:281-300, .skilled/bin/install-codex-hooks.mjs:367-378
- iteration 2 supply_chain_ci (ruled_out): pinned actions, explicit permissions, no run-step event interpolation; evidence=.github/workflows/opencode-plugin-tests.yml:66, .github/workflows/opencode-plugin-tests.yml:88, .github/workflows/dispatch-enforcement-guard.yml:10
- iteration 3 unsupported_completion_claim (ruled_out): no unchecked implementation tasks and no non-Met acceptance rows; the one deferral documents itself; evidence=specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/001-dead-hook-file-removal/tasks.md:165
- iteration 4 documentation_structure_drift (ruled_out): All four sampled READMEs use the same section order and the same five-column runtime table.; evidence=.skilled/hooks/cli-dispatch/README.md:123, .skilled/hooks/completion-evidence/README.md:94
- iteration 4 undocumented_convention (ruled_out): The convention is documented once at the canonical index and echoed in the affected concern README.; evidence=.skilled/hooks/README.md:79, .skilled/hooks/subagent-dispatch-guard/README.md:157
- iteration 5 comment_hygiene (ruled_out): No packet spec or phase id appears in the named code surfaces.; evidence=.skilled/hooks/goal/lib/goal-core.test.cjs:716

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remains; the final stabilization pass is complete. - Focus area: synthesis reads the registry -- six active P2s, zero P0/P1 -- and no further review iteration is scheduled. - Reason: the max-iterations stop policy is satisfied and no announcement direction remains open. - Rotation status: correctness 1, security 1, traceability 1 plus stabilization, maintainability 1. Complete. - Blocked/productive carry-forward: do not retry the exhausted old-name, registration, installer, secret-mode or phase-4 completion-claim directions. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
