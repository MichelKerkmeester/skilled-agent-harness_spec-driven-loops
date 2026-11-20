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
- Review Target: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal (spec-folder)
- Started: 2026-11-20T10:07:53.884Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: 2026-11-20T10:07:53.884Z
- Parent Session: 2026-11-19T15:56:57.978Z
- Lifecycle Mode: restart
- Generation: 3
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
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: inventory of the v1-removal runtime surfaces and re-verification of the prior P1 fixes | correctness | 1.00 | 0/0/1 | complete |
| 2 | security: version trust seam (trustedExecutableFor, OPENCODE_BIN, probe spawn/timeouts/PATH), dispatch-guard bypass by launcher name or path, the setup helper's remove-v1 destructive mode, doctor-battery and CI secret surfaces, plugin hook mapping, session-reader SQL, fanout argv | security | 1.00 | 0/0/2 | complete |
| 3 | traceability: every 001/002/003 acceptance-criteria row against its cited evidence, the 003 ADR-001 replacement checks run live, tasks.md Verify lines, parent continuity, and the feature-catalog / playbook overlay against the code | traceability | 0.40 | 0/0/2 | complete |
| 4 | maintainability: test brittleness in the merge's suites, leftover dual/opencode2/v1 names, doc accuracy of the cli-opencode skill and v2.0.0.0 changelog, the opencode-v2-battery CI workflow and its README entry, and the duplicated version parser pair with its parity guard | maintainability | 0.38 | 0/0/3 | complete |
| 5 | correctness: fix-completeness replay of the three closed prior P1s, then re-adjudication of all eight open P2s against the merged tree | correctness | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
| security | covered | 2 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.87
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":8,"description":"Dimension coverage (67%) is below threshold (80%). 8 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.40 -> 0.38 -> 0.00
- convergenceScore: 1.00
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
- candidateCoverage: covered=14, ruledOut=15, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 2 trust-boundary (ruled_out): verified by direct read of both resolvers and the spawn helpers; evidence=.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:132, .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:96
- iteration 2 guard-availability (ruled_out): all four shipped rules declare appliesTo [v2] and both filters converge on applying every rule; evidence=.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1123
- iteration 2 destructive-operation-scope (ruled_out): same-authority window, rm on a symlink unlinks only the link; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:222, .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:431
- iteration 2 injection (ruled_out): direct read of both producers shows fixed statements and shell-free spawns; evidence=.skilled/hooks/shared/session-readers/opencode.mjs:68, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2426
- iteration 3 broken-replacement-check (ruled_out): all three replacement commands reproduce their recorded result on the merged tree; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:53, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:2
- iteration 3 justified-list-drift (ruled_out): sets are identical after the prefix difference, including both skilled-loop entries added by f6aa8dc052b; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:10
- iteration 3 overclaimed-acceptance-status (ruled_out): every Met row reproduces against the artifact it cites; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md:61, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/acceptance-criteria.md:54
- iteration 4 doc_code_mismatch (ruled_out): README row and workflow body agree on pin, install shape and test list; evidence=.github/workflows/README.md:41
- iteration 4 test_wiring_gap (ruled_out): assertions are identifier- and structure-based, and empty rule sets fail loudly; evidence=.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs:74
- iteration 5 regression_at_removed_api (ruled_out): verified by exact search plus the caller read; evidence=.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs:242, .vibe/plugins/repo-guards/session-cleanup.mjs:51
- iteration 5 error_swallowed_as_success (ruled_out): verified by direct read of the wrapper and its test; evidence=.vibe/plugins/repo-guards/lib/hook-io.mjs:112-124, .vibe/plugins/repo-guards/tests/session-cleanup.test.mjs:36-38
- iteration 5 doc_code_divergence (ruled_out): verified by direct read of both documents; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md:88, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:87-91
- iteration 5 stale_proof_command (ruled_out): line-by-line re-read of every cited location; evidence=.skilled/commands/doctor/scripts/opencode-version-battery.cjs:976, .opencode/plugins/lib/v2-bridge.js:429
- iteration 5 test_coverage_gap (ruled_out): verified by exact search and an existence sweep over all 32 rows; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:2, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:10

### Clean Search Proof
- iteration 2 trust-boundary (ruled_out): verified by direct read of both resolvers and the spawn helpers; evidence=.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:132, .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:96
- iteration 2 guard-availability (ruled_out): all four shipped rules declare appliesTo [v2] and both filters converge on applying every rule; evidence=.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1123
- iteration 2 destructive-operation-scope (ruled_out): same-authority window, rm on a symlink unlinks only the link; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:222, .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:431
- iteration 2 injection (ruled_out): direct read of both producers shows fixed statements and shell-free spawns; evidence=.skilled/hooks/shared/session-readers/opencode.mjs:68, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2426
- iteration 3 broken-replacement-check (ruled_out): all three replacement commands reproduce their recorded result on the merged tree; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:53, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:2
- iteration 3 justified-list-drift (ruled_out): sets are identical after the prefix difference, including both skilled-loop entries added by f6aa8dc052b; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:10
- iteration 3 overclaimed-acceptance-status (ruled_out): every Met row reproduces against the artifact it cites; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md:61, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/acceptance-criteria.md:54
- iteration 4 doc_code_mismatch (ruled_out): README row and workflow body agree on pin, install shape and test list; evidence=.github/workflows/README.md:41
- iteration 4 test_wiring_gap (ruled_out): assertions are identifier- and structure-based, and empty rule sets fail loudly; evidence=.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs:74
- iteration 5 regression_at_removed_api (ruled_out): verified by exact search plus the caller read; evidence=.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs:242, .vibe/plugins/repo-guards/session-cleanup.mjs:51
- iteration 5 error_swallowed_as_success (ruled_out): verified by direct read of the wrapper and its test; evidence=.vibe/plugins/repo-guards/lib/hook-io.mjs:112-124, .vibe/plugins/repo-guards/tests/session-cleanup.test.mjs:36-38
- iteration 5 doc_code_divergence (ruled_out): verified by direct read of both documents; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md:88, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:87-91
- iteration 5 stale_proof_command (ruled_out): line-by-line re-read of every cited location; evidence=.skilled/commands/doctor/scripts/opencode-version-battery.cjs:976, .opencode/plugins/lib/v2-bridge.js:429
- iteration 5 test_coverage_gap (ruled_out): verified by exact search and an existence sweep over all 32 rows; evidence=specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:2, specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:10

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none — iteration 5 of 5. Rotation complete, `dimensionCoverage` 4/4. - Focus area: synthesis. Carry the eight P2s and this replay table into the final verdict document. - Reason: the fix-completeness replay is clean (3/3 PASS) and no new direction is available inside the iteration budget. - Rotation status: complete. - Blocked/productive carry-forward: reuse "read the consumer together with the builder it calls" — it is what let this pass prove the `.server` removal from the caller side instead of from the builder's JSDoc. - Required evidence: none outstanding; synthesis owns the release-readiness decision. - Recovery note: not applicable — no stuck count, no failed check, no blocked tool. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 8 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
