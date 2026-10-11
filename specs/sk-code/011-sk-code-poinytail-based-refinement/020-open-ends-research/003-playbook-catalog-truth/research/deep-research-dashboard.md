---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Find the lightest way to make manual-testing playbook scenarios and feature catalog entries check themselves against the code, through the sk-create-manual-testing-playbook and sk-create-feature-catalog modes and their validators: where they drift from the code today and what catches it, the lightest self-check that tests a scenario options and expected answers and a catalog entry code anchors against the code, and which drift classes that check would still miss
- Started: 2026-10-11T16:24:27.869Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: 2026-10-11T16:24:27.869Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: Where do manual-testing playbook scenarios and feature catalog entries drift from the code today, and what, if anything, catches that drift? | - | 0.82 | 0 | insight |
| 2 | Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code? | - | 0.68 | 0 | insight |
| 3 | Q3 tested against the code (flag check calibration, expected-line anchoring, anchor content limits) plus Q4 miss inventory and catchers | - | 0.57 | 0 | insight |
| 4 | Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one? — with the expected-line wildcard-normalization calibration carried from iteration 3. | - | 0.56 | 0 | insight |
| 5 | Residue closure by widening: corpus-scale measurement of the prefix-rule surface, drift-case replay against the live tree, catalog anchor census, and the CI/test-discovery verdict for both validators | - | 0.55 | 0 | insight |
| 6 | Verify earlier claims against the tree; sample further skills' playbooks and catalogs; replay the proposed checks against real drift cases | - | 0.35 | 0 | insight |
| 7 | Widen: token-at-line tier replayed over the anchor corpus and adjudicated; existence tier replayed over all catalog citations with a self-corrected measurement; .pi extension playbooks and the archive mirror sampled; fleet root scope re-verified | - | 0.50 | 0 | insight |
| 8 | Playbook-side widening: 2,682-file citation census splitting gated links from unchecked inline citations; unresolved taxonomy with migrated-root fallback; canonical-case option check and live wrong-line anchor adjudication; expected-answer surface conformance | - | 0.50 | 0 | insight |
| 9 | Verification pass: census denominator corrected (exact 1,465 vs broad 2,682); link basis restated (relative, 1 deliberate fixture); inline resolution ladder measured (87.0% resolve, residual 1,678 instances in expected families); catalog anchors re-verified (34/36 resolve, 9 token-at-line fires incl. one new loose anchor; spec-folder-mutex.ts:10->22); prose line form corrected to 13 instances; extractor regression ledger | - | 0.60 | 0 | insight |
| 10 | Widening verification: corrected resolution ladder over 8 previously unsampled skills (96.5% resolve vs 58.2% with the published ladder), full catalog anchor census (2 of 29 packs carry line anchors), and live drift candidates found and adjudicated outside the known advisor cluster | - | 0.70 | 0 | insight |

- iterationsCompleted: 10
- keyFindings: 28
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Where do manual-testing playbook scenarios and feature catalog entries drift from the code today, and what, if anything, catches that drift?
- [x] Q2: What do the sk-create-manual-testing-playbook and sk-create-feature-catalog validators check today, and which of those checks touch the code rather than the document shape?
- [x] Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code?
- [x] Q4: Which drift classes would that lightest check still miss, and what would catch each one?
- [x] Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▄▄▄▄▄▃▂▁▃▃▃▃▄▅▆▆
- score sparkline: █▇▆▅▄▄▄▄▄▃▂▁▃▃▃▃▄▅▆▆
- Last 3 ratios: 0.50 -> 0.60 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
