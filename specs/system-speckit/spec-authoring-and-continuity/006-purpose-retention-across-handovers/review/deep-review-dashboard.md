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
- Review Target: The non-spec files changed by the purpose-carry work: git show --name-only --format= on commits eaba5ab89e 3d237cd97a f0d8c03036 0837fcd5a2 191ce39bad 43bff36f9d e102ba83be f9f96bdc39 e129af3719 fce8b5d81c, excluding specs/ (34 unique files) (files)
- Started: 2026-11-14T11:01:50.956Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-14T11:01:50.956Z
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
| P1 (Required) | 3 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/2/1 | complete |
| 2 | security | security | 0.15 | 0/0/2 | complete |
| 3 | traceability | traceability | 0.07 | 0/0/1 | complete |
| 4 | maintainability | maintainability | 0.07 | 0/0/1 | complete |
| 5 | correctness | correctness | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 8 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 1 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.72
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":18,"description":"Dimension coverage (50%) is below threshold (80%). 18 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.07 -> 0.07 -> 0.00
- convergenceScore: 1.00
- openFindings: 9
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
- candidateCoverage: covered=7, ruledOut=9, deferred=1, blocked=0

### Search Debt
- iteration 1 deferred_runtime_compaction (deferred): D6 defers a purpose after compaction on Devin and OpenCode to a later phase and out of this goal.; evidence=UNKNOWN

### Ruled-Out Candidates
- iteration 1 path_traversal (ruled_out): Containment checks run before any spec.md read in both hooks; the remaining symlink case has no named reach and is recorded as a hardening note.; evidence=session-prime.ts:236-238, session-compact-context.ts:80-83
- iteration 1 state_transition (ruled_out): The purpose is writer-owned and refreshed on every save; the payload value is ignored and the save test covers the copy and stale-value removal.; evidence=workflow.ts:614-615, thin-continuity-record.ts:759-767, save-continuity-write.vitest.ts:323-334
- iteration 2 sanitizer_bypass (ruled_out): The wrapper sanitizes internally; the local variable only feeds the sanitized-length log line.; evidence=shared-provenance.ts:88, shared-provenance.ts:109
- iteration 2 shell_injection (ruled_out): Shell quoting is present and the hostile-input test covers it; no new sink in the changed lines.; evidence=nudge.cjs:330, nudge.test.cjs:620
- iteration 2 secret_exposure (ruled_out): The value originates in repo-authored spec text and carries no secret-bearing path.; evidence=thin-continuity-record.ts:763, workflow.ts:466
- iteration 4 duplication (ruled_out): D1 requires each independently loaded hop surface to state the line; the reader itself is one module.; evidence=.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:172-180
- iteration 4 comment_hygiene (ruled_out): The grep hits are unrelated test fixture paths, not comments in the review target.; evidence=.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:1-185
- iteration 4 api_boundary (ruled_out): Duplicate of the active R3-P2-001 API-surface finding.; evidence=.skilled/skills/system-spec-kit/runtime/api/index.ts:126
- iteration 4 test_structure (ruled_out): Changed assertions inspected; no new instance, and execution is out of bounds.; evidence=.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts:47

### Clean Search Proof
- iteration 1 path_traversal (ruled_out): Containment checks run before any spec.md read in both hooks; the remaining symlink case has no named reach and is recorded as a hardening note.; evidence=session-prime.ts:236-238, session-compact-context.ts:80-83
- iteration 1 state_transition (ruled_out): The purpose is writer-owned and refreshed on every save; the payload value is ignored and the save test covers the copy and stale-value removal.; evidence=workflow.ts:614-615, thin-continuity-record.ts:759-767, save-continuity-write.vitest.ts:323-334
- iteration 2 sanitizer_bypass (ruled_out): The wrapper sanitizes internally; the local variable only feeds the sanitized-length log line.; evidence=shared-provenance.ts:88, shared-provenance.ts:109
- iteration 2 shell_injection (ruled_out): Shell quoting is present and the hostile-input test covers it; no new sink in the changed lines.; evidence=nudge.cjs:330, nudge.test.cjs:620
- iteration 2 secret_exposure (ruled_out): The value originates in repo-authored spec text and carries no secret-bearing path.; evidence=thin-continuity-record.ts:763, workflow.ts:466
- iteration 4 duplication (ruled_out): D1 requires each independently loaded hop surface to state the line; the reader itself is one module.; evidence=.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:172-180
- iteration 4 comment_hygiene (ruled_out): The grep hits are unrelated test fixture paths, not comments in the review target.; evidence=.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:1-185
- iteration 4 api_boundary (ruled_out): Duplicate of the active R3-P2-001 API-surface finding.; evidence=.skilled/skills/system-spec-kit/runtime/api/index.ts:126
- iteration 4 test_structure (ruled_out): Changed assertions inspected; no new instance, and execution is out of bounds.; evidence=.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts:47

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; the loop is complete at 5/5 max-iterations. - Focus area: synthesis and the reducer; no further review iteration. - Reason: `stopPolicy=max-iterations`, and the two P1s need an implementation phase rather than more review. - Rotation status: complete. - Blocked/productive carry-forward: `R1-P1-001` and `R1-P1-002` (fix before release), plus the five P2s. - Required evidence: after the parity fix, rerun `packet-purpose`, `hook-precompact`, `hook-session-start` and `history-locator-adapters`, and exercise the relaunch and Pi compaction hops; update the playbook/root README under `R2-P2-002` when that lands. - Recovery note: terminal iteration; the synthesis record should carry `stopReason: maxIterationsReached`.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
