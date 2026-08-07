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
- Review Target: DIAGNOSTIC (read-only, do NOT implement/fix/complete phase 009's own /speckit:* integration work): audit the real current state of .opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/ across 4 custom dimensions -- D1 correctness of the metadata-generation tooling (is the malformed graph-metadata.json an isolated one-off or a systemic create.sh/scaffolding-tool defect), D2 traceability of the 'owned by a separate concurrent session' ownership claim (independently verify with lock files, git reflog, stash, cross-doc references), D3 completeness of the phase's own plan (spec.md/plan.md/tasks.md/implementation-summary.md/handover.md coherence, stale references), D4 blast radius of a metadata repair (would regenerating graph-metadata.json touch/lose any real authored content). (files)
- Started: 2026-07-01T18:47:48Z
- Status: complete
- Iteration: 10 of 10
- Provisional Verdict: FAIL (active P0; see review-report.md -- P0/P1 are repo-wide tooling defects surfaced via this folder, not defects in the folder's own docs)
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: rv-phase009-audit-20260701-184748
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 1 |
| P1 (Required) | 1 |
| P2 (Suggestions) | 10 |
| Resolved | 0 |

Note: this reducer-generated table under-counted findings due to a `findingsNew` schema mismatch between this run's iteration JSONL shape and the reducer's expected shape (see `deep-review-findings-registry.json.note`). The table above has been hand-corrected from the restored registry (12 total: P0×1, P1×1, P2×10); see `review-report.md` for the authoritative finding-by-finding breakdown.

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | D1-metadata-tooling-correctness | correctness | 1.00 | 0/0/3 | complete |
| run-001 | D2-ownership-traceability | traceability | 1.00 | 0/0/2 | complete |
| run-001 | D3-plan-completeness | maintainability | 1.00 | 0/0/2 | complete |
| undefined | D4-repair-blast-radius | - | 0.00 | 0/0/0 | complete |
| undefined | generality-sweep-and-adversarial-recheck | - | 0.00 | 0/0/0 | complete |
| undefined | D4-P0-consumer-blast-radius-and-patch-feasibility | - | 0.00 | 0/0/0 | complete |
| undefined | D2-deep-citation-and-observability-sweep | - | 0.00 | 0/0/0 | complete |
| undefined | D2-session-handle-uniqueness-sanity-check | - | 0.00 | 0/0/0 | complete |
| undefined | D4-validator-gap-and-consolidation | - | 0.00 | 0/0/0 | complete |
| undefined | final-claim-adjudication-and-closure | - | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | pending | 0 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 3
- persistentSameSeverity: 2
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 2

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- No search-depth state captured (legacy v1 record).
- graphCoverageMode: none

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**SYNTHESIS — handoff to orchestrator.** Produce `review/review-report.md` from the 12-finding registry (P0×1, P1×1, P2×11), both P0/P1 having PASSED the claim-adjudication gate this iteration. Synthesis-hygiene carry-forward (unchanged from iter-9): fold `D4-P0-001.blastRadiusAssessment.consumerMap.validatorBlind` into `D1-P1-001` evidenceRefs (no double-carry); cross-link D1-P2-001 (format) + D1-P1-001 (detection) + D4-P0-001 (producer) as one "metadata-status integrity chain" with distinct fix locations each. Patch-shape carry-forward: (a) producer gate `deriveStatus` on `completion_pct>=100 AND openTasks===0` with explicit null-handling for the 296 absent-pct case; (b) detector add a cross-field `--strict` rule so future regressions are caught. Do NOT re-probe D2 (exhausted iter-8) or D3 (settled iter-3).

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
