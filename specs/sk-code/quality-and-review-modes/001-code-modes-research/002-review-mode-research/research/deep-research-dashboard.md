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
- Topic: How to make sk-code-review more repo-agnostic, more useful and better integrated with sibling and user-authored modes
- Started: 2026-10-25T08:49:26Z
- Status: INITIALIZED
- Iteration: 15 of 15
- Session ID: 2026-10-25T08:49:26Z
- Parent Session: 2026-10-25T08:49:26Z
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Angle 1: Repo-bound inventory (Q1) | - | 1.00 | 0 | insight |
| 2 | Angle 2: UNKNOWN-surface path (Q2) | - | 0.75 | 0 | insight |
| 3 | Angle 3: Output contract (Q3). | - | 1.00 | 0 | insight |
| 4 | Angle 4: Usefulness evidence (Q4), what review catches, costs and misses across benchmark reports, playbook scenarios and changelog. | - | 1.00 | 0 | insight |
| 5 | Angle 5: PR-state efficiency gates (Q5) | - | 0.85 | 0 | insight |
| 6 | Angle 6: Review and quality boundary (Q6) | - | 1.00 | 0 | insight |
| 7 | Angle 7: Surface packets (Q7) | - | 1.00 | 0 | insight |
| 8 | Angle 8: Consumers and contracts (Q8). | - | 0.85 | 0 | insight |
| 9 | Angle 9: User-authored modes (Q9) | - | 1.00 | 3 | complete |
| 10 | Angle 10: Repo-local policy and floors (Q10). | - | 0.85 | 5 | insight |
| 11 | Second-model re-check 1 of 5: replay I-6 and rank 12 through compiled-route; verify I-5 anchors on current disk. | - | 0.30 | 4 | insight |
| 12 | Second-model re-check 2 of 5: ranks 1 and 3 and the RA-1, RA-2 and RA-11 facts they rest on | - | 0.25 | 0 | complete |
| 13 | Second-model re-check 3 of 5: I-3 and the rank 6 envelope-reader claim, U-9 unchecked finding fields, E-3 surface and review exchange | - | 0.20 | 4 | complete |
| 14 | Second-model re-check 4 of 5: ranks 2, 4 and 5 (I-8 floors, M-1 cache key, M-2 never-skip list) | - | 0.15 | 0 | complete |
| 15 | Second-model re-check 5 of 5: ranks 7, 8, 9, 10 and 11, plus an independent top-five ordering | - | 0.35 | 6 | complete |

- iterationsCompleted: 15
- keyFindings: 89
- openQuestions: 0
- resolvedQuestions: 10

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 10/10
- [x] Q1 Repo-bound inventory: which `.skilled/` markers, agent paths, cache locations and stack-specific path patterns does the sk-code-review packet hold, and is each portable, configurable or repo-bound?
- [x] Q2 UNKNOWN-surface path: what does a review do when the surface is UNKNOWN, how much of the baseline stays useful, and how could a repository declare its own surface evidence?
- [x] Q3 Output contract: which parts of the review output contract raise signal and which add ceremony or parse risk (Case line, finding class, scope proof, riskScore, Not checked line, final status line)?
- [x] Q4 Usefulness evidence: what does review catch, cost and miss in the repository's own benchmark reports, playbook scenarios and changelog?
- [x] Q5 PR-state efficiency gates: how portable and configurable are the content-hash dedup, the minimum-evidence gate and the depth alias for a repository with no remote, a monorepo or other file naming?
- [x] Q6 Review and quality boundary: does review read what the quality gate checked, who reports and who fixes, and how do the shared checklist name and the tie-break order divide the work?
- [x] Q7 Surface packets: how is surface evidence applied in review, does a workflow diff get the CI rules, and could a surface declare the evidence review should read?
- [x] Q8 Consumers and contracts: which consumers depend on the status line, the CODE-REVIEW prompt prefix and the shared doctrine, and what would a configurable review break?
- [x] Q9 User-authored modes: what does a user's workflow or surface mode (for example a security-only reviewer) need from review, what does review need from it, and which of the eleven integration rows carries it?
- [x] Q10 Repo-local policy and floors: where could a repository keep severity overrides, mandatory checks and ignore paths without forking the hub, which floors may no recommendation relax, and how would a later change be proven through both routing stages?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▆▇██▇▇██▇▇█▇▄▂▂▁▁▁▃
- score sparkline: █▆▇██▇▇██▇▇█▇▄▂▂▁▁▁▃
- Last 3 ratios: 0.20 -> 0.15 -> 0.35
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.35
- coverageBySources: {"code":32,"other":28}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Re-reading `research.md` to check the claims.** Rejected: the point of a second-model pass is to test the claim against disk, not against the prior model's prose. `research.md` was read once for claim text and not used as evidence. (iteration 13)
- **Reading `mode-registry.json` for E-3.** Deferred to stay inside the tool budget. The hub-router line covers the same question, so the deferred read costs confidence in a citation, not in the conclusion. (iteration 13)
- **Treating the grep's zero-match as proof of no reader.** Rejected as stated, kept as evidence with a caveat: a zero match proves no file *names* those tokens. A reader that consumes the envelope under a different name would not be caught. The conclusion is safe here only because the envelope's own token is distinctive and the producer's surrounding prose names no alias. (iteration 13)
- **Re-reading `research.md` as evidence.** Rejected per the strategy's blocked direction: the second-model pass tests claims against disk, not against the prior model's prose. (iteration 14)
- **Reading the whole 562-line `SKILL.md`.** Not attempted: it would have spent the remaining tool budget and left an artifact unwritten. Recorded as NOT TESTED instead of inferred from the section read. (iteration 14)
- **Treating the capped grep as evidence.** Rejected. The 80-match cap returned unrelated `extension` hits before the review anchors, so the grep neither confirms nor refutes rank 2's citations. (iteration 14)
- The `extension` alternation polluted the grep. In a hub with several extension tables, a token search cannot surface the absence of an extension rule. Negative claims need the section boundary, not a match count. (iteration 14)

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
