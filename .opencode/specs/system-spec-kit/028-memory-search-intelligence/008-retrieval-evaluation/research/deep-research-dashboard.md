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
- Topic: Research the retrieval-evaluation + post-027/002 angle space the shipped 015-019 search-intelligence work opened up: (A1) a memory-retrieval eval harness on the now-working cosine gate, (A2) closing 017/S4's flag-off isotonic calibration from real labels, (A3) A/B-ing the default-on levers 017 shipped (cosine-reorder/generic-query-escalation/top-dominant-verdict), (A4) gate/rank divergence as a signal, (A5) post-015 cold-tier surfacing re-measurement, (A6) a unified semantic-embedding substrate (triggers+edges+summaries), (A7) reindex-as-consolidation + maintenance-grace TTL, (A8) a shadow-eval promotion methodology. 20 iterations, Opus 4.8 via claude2 (acct#2). Read-only seats; orchestrator writes state. Every candidate novelty-diffed vs 016 (027/002 research) + the 028/007 roadmap.
- Started: 2026-06-17T14:00:00Z
- Status: IN_PROGRESS
- Iteration: 9 of 20
- Session ID: 2026-06-17-028-008-retrieval-evaluation
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | A1-eval-harness-keystone | - | 0.80 | 4 | insight |
| undefined | A4-gate-rank-divergence | - | 0.70 | 4 | insight |
| undefined | A6-unified-semantic-substrate | - | 0.70 | 5 | insight |
| undefined | A2-isotonic-calibration | - | 0.70 | 5 | insight |
| undefined | A3-ab-shipped-levers | - | 0.70 | 4 | insight |
| undefined | A5-cold-tier-remeasure | - | 0.60 | 4 | insight |
| undefined | A7-reindex-consolidation | - | 0.70 | 5 | insight |
| undefined | A8-shadow-eval-methodology | - | 0.70 | 5 | insight |
| undefined | A1-deepen-three-lanes | - | 0.60 | 4 | insight |

- iterationsCompleted: 9
- keyFindings: 0
- openQuestions: 10
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/10
- [ ] Q1 (A1, keystone): Eval harness — what golden-query set + relevance-label schema + label-bootstrap (from live traffic / existing specs) makes Memory MCP retrieval measurable on the now-working cosine gate? Cite the gate seam (`resolveAbsoluteRelevance`, `confidence-scoring.ts`).
- [ ] Q2 (A2): Isotonic calibration — how to collect real labels, fit, validate, and promote 017/S4's flag-off isotonic infra (replacing the proxy seed)? What live-evidence threshold justifies default-on?
- [ ] Q3 (A3): A/B methodology + expected result for the default-on levers 017 shipped unmeasured — cosine top-N reorder (S5), generic-query escalation (S3), top-dominant verdict (S2). Does reorder ever demote a correctly-fused hit?
- [ ] Q4 (A4): Gate/rank divergence — now the gate reads cosine while RRF ranks; characterize when they disagree and what the divergence signals (fusion miscalibration vs ambiguous query). Where to surface it?
- [ ] Q5 (A5): Re-measure cold-tier surfacing rate + precision POST-015 admission (016 found "~2 rows, inert" pre-admission). Does admission change the distribution?
- [ ] Q6 (A6): Unified semantic-embedding substrate — can 027's semantic-trigger fallback + the 028/007 semantic-edge-layer + the fused-summary-channel collapse into ONE embeddable-channel framework instead of three bolt-ons? Architecture + shadow-promotion economics.
- [ ] Q7 (A7): Reindex-as-consolidation — can async sleep-time reorganization (028/007 Initiative B) be hosted inside 018's now-responsive/cancellable scan? + maintenance-grace TTL tuning (019 open gap: avoid premature reap AND zombie pileup).
- [ ] Q8 (A8): Shadow-eval methodology — which shadow metrics (false-positive rate, recall delta, latency, cost) predict promotion-worthiness? Define one reusable promotion gate for all intelligence-class candidates.
- [ ] Q9 (NOVELTY GATE): vs 016 (027/002 research) + 028/007 roadmap + the live 015-019 code — refute re-discoveries; confirm each angle is genuinely un-covered.
- [ ] Q10 (GO/no-go): rank every surfaced candidate GO (additive/reversible) vs NEEDS-BENCHMARK vs NO-TRANSFER by leverage x effort; assign 027 doctrine-class (correctness-always-on vs intelligence-shadow-gated).

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 10
- [ ] Q1 (A1, keystone): Eval harness — what golden-query set + relevance-label schema + label-bootstrap (from live traffic / existing specs) makes Memory MCP retrieval measurable on the now-working cosine gate? Cite the gate seam (`resolveAbsoluteRelevance`, `confidence-scoring.ts`).
- [ ] Q2 (A2): Isotonic calibration — how to collect real labels, fit, validate, and promote 017/S4's flag-off isotonic infra (replacing the proxy seed)? What live-evidence threshold justifies default-on?
- [ ] Q3 (A3): A/B methodology + expected result for the default-on levers 017 shipped unmeasured — cosine top-N reorder (S5), generic-query escalation (S3), top-dominant verdict (S2). Does reorder ever demote a correctly-fused hit?
- [ ] Q4 (A4): Gate/rank divergence — now the gate reads cosine while RRF ranks; characterize when they disagree and what the divergence signals (fusion miscalibration vs ambiguous query). Where to surface it?
- [ ] Q5 (A5): Re-measure cold-tier surfacing rate + precision POST-015 admission (016 found "~2 rows, inert" pre-admission). Does admission change the distribution?
- [ ] Q6 (A6): Unified semantic-embedding substrate — can 027's semantic-trigger fallback + the 028/007 semantic-edge-layer + the fused-summary-channel collapse into ONE embeddable-channel framework instead of three bolt-ons? Architecture + shadow-promotion economics.
- [ ] Q7 (A7): Reindex-as-consolidation — can async sleep-time reorganization (028/007 Initiative B) be hosted inside 018's now-responsive/cancellable scan? + maintenance-grace TTL tuning (019 open gap: avoid premature reap AND zombie pileup).
- [ ] Q8 (A8): Shadow-eval methodology — which shadow metrics (false-positive rate, recall delta, latency, cost) predict promotion-worthiness? Define one reusable promotion gate for all intelligence-class candidates.
- [ ] Q9 (NOVELTY GATE): vs 016 (027/002 research) + 028/007 roadmap + the live 015-019 code — refute re-discoveries; confirm each angle is genuinely un-covered.
- [ ] Q10 (GO/no-go): rank every surfaced candidate GO (additive/reversible) vs NEEDS-BENCHMARK vs NO-TRANSFER by leverage x effort; assign 027 doctrine-class (correctness-always-on vs intelligence-shadow-gated).

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.70 -> 0.70 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1 (A1, keystone): Eval harness — what golden-query set + relevance-label schema + label-bootstrap (from live traffic / existing specs) makes Memory MCP retrieval measurable on the now-working cosine gate? Cite the gate seam (`resolveAbsoluteRelevance`, `confidence-scoring.ts`).

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
