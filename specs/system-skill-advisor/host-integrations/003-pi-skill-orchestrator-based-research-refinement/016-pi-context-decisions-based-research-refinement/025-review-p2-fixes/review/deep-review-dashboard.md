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
- Review Target: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes (spec-folder)
- Started: 2026-11-21T14:42:00.001Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: 2026-11-21T14:41:59Z
- Parent Session: none
- Lifecycle Mode: completed-continue
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 1 |
| Resolved | 7 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 0.33 | 0/0/1 | complete |
| 3 | traceability+maintainability | traceability/maintainability | 0.57 | 0/0/4 | complete |
| 4 | traceability: replay of the seven P2 findings at dfdaee3a064 and core protocol rerun | traceability | 0.13 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
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
- graphConvergenceScore: 0.97
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.33 -> 0.57 -> 0.13
- convergenceScore: 0.88
- openFindings: 1
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
- candidateCoverage: covered=7, ruledOut=11, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 fixture_realism (ruled_out): SL4-005 closed: real net.createServer socket at vitest :914-922, regular file at :936-955, fixed names type-agnostic at :1368-1370; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:914, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1371
- iteration 1 destructive_path (ruled_out): guard at :1371 plus vitest :936-955; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1371
- iteration 1 false_negative_status (ruled_out): verified by read and vitest :749-762; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1563, .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:749
- iteration 2 path_containment (ruled_out): verified by direct read and vitest:1197-1209; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1721
- iteration 2 toctou (ruled_out): no trust boundary crossed; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1371
- iteration 2 secret_exposure (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1546, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:846
- iteration 2 remote_destructive_call (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1852
- iteration 3 comment_hygiene (ruled_out): verified by grep and direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1368, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1561
- iteration 3 fixture_realism (ruled_out): real socket bound where behavior depends on a socket; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:914, .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:922
- iteration 4 input_parsing (ruled_out): fixed at HEAD; resolved; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:206, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1279, .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:901
- iteration 4 completion_metadata (ruled_out): fixed at HEAD; resolved; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/goal.md:57
- iteration 4 destructive_path (ruled_out): fixed at HEAD; resolved; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:1136, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:2011
- iteration 4 doc_drift (ruled_out): fixed at HEAD; resolved; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/tasks.md:64, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/implementation-summary.md:94, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/implementation-summary.md:156, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/spec.md:172

### Clean Search Proof
- iteration 1 fixture_realism (ruled_out): SL4-005 closed: real net.createServer socket at vitest :914-922, regular file at :936-955, fixed names type-agnostic at :1368-1370; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:914, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1371
- iteration 1 destructive_path (ruled_out): guard at :1371 plus vitest :936-955; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1371
- iteration 1 false_negative_status (ruled_out): verified by read and vitest :749-762; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1563, .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:749
- iteration 2 path_containment (ruled_out): verified by direct read and vitest:1197-1209; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1721
- iteration 2 toctou (ruled_out): no trust boundary crossed; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1371
- iteration 2 secret_exposure (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1546, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:846
- iteration 2 remote_destructive_call (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1852
- iteration 3 comment_hygiene (ruled_out): verified by grep and direct read; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1368, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1561
- iteration 3 fixture_realism (ruled_out): real socket bound where behavior depends on a socket; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:914, .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:922
- iteration 4 input_parsing (ruled_out): fixed at HEAD; resolved; evidence=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:206, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1279, .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:901
- iteration 4 completion_metadata (ruled_out): fixed at HEAD; resolved; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/goal.md:57
- iteration 4 destructive_path (ruled_out): fixed at HEAD; resolved; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:1136, .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:2011
- iteration 4 doc_drift (ruled_out): fixed at HEAD; resolved; evidence=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/tasks.md:64, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/implementation-summary.md:94, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/implementation-summary.md:156, specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes/spec.md:172

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none. The extended cap of 4 is reached, and all four dimensions are covered. - Focus area: synthesis. - Reason: last iteration. - Rotation status: correctness, security, traceability and maintainability are complete. - Blocked/productive carry-forward: replaying each finding against `git show <fix>` plus a probe of the current file was productive. `fixture_realism` stays exhausted. - Required evidence: synthesis should record all seven prior P2 findings as resolved at `dfdaee3a064`, carry R4-P2-001 as the one active P2, and state SL4-005 as ruled out for AC-024. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
