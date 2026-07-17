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
- Topic: system-skill-advisor usefulness and routing integration
- Started: 2026-07-16T05:47:04.335Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-20260716-054704-skill-advisor-routing
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Map advisor_recommend end-to-end, five-lane fusion, ambiguity, compatibility thresholds, and confidence provenance. | - | 0.92 | 0 | complete |
| undefined | Q4: Does the advisor vocabulary remain aligned with hub-router and mode-registry vocabulary? | - | 0.79 | 0 | complete |
| undefined | Q2: Trace hook brief behavior and CLI fallback under unhealthy transport. | - | 0.88 | 0 | complete |
| 4 | Q3: Prove threshold and prompt-policy synchronization across environment and call-specific overrides. | routing-thresholds | 0.85 | 4 | complete |
| undefined | Strengthen the test inventory with one named end-to-end threshold parity suite. | - | 0.74 | 0 | complete |
| undefined | Rank the threshold surface parity suite against transport-budget reservation, output-contract reconciliation, vocabulary coverage, diagnostics, and calibration changes. | - | 0.68 | 0 | complete |
| undefined | Produce the fresh joined RRF calibration report and a bounded numeric calibration proposal. | - | 0.24 | 0 | error |
| undefined | Produce the fresh joined RRF calibration report and a bounded numeric calibration proposal. | - | 0.78 | 0 | complete |
| undefined | Why can result-level ambiguity remain true while the leading executor recommendation has no ambiguousWith attribution? | - | 0.66 | 0 | complete |
| undefined | Quantify injection versus existing-candidate paths across frozen executor-delegation cases and select the executor ambiguity contract. | - | 0.81 | 0 | complete |

- iterationsCompleted: 10
- keyFindings: 30
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Q1: How does the advisor_recommend MCP path (advisor-server.ts, tools/index.ts) work end-to-end, and is its 5-lane RRF fusion confidence (derived / explicit / graph-causal / lexical / semantic-shadow lanes in lib/scorer/fusion.ts) well-calibrated, or does lane fusion saturate/mislead against the 0.05 ambiguity margin (lib/scorer/ambiguity.ts) and compat-contract thresholds (lib/compat/contract.ts) backing Gate 2 (≥0.8) and Gate 1 (≥0.70 / ≤0.35)? [legacy-import]
- [ ] Q2: How does the Claude-side user-prompt-submit hook advisor brief (hooks/claude/user-prompt-submit.ts, lib/skill-advisor-brief.ts) work, and does its documented CLI fallback path hold up when the MCP/daemon transport is unhealthy? [legacy-import]
- [ ] Q3: Do the hook's shouldFireAdvisor gate (lib/prompt-policy.ts) and the MCP tool's threshold resolution stay provably in sync — two independent call paths converging on the same compat-contract thresholds — or is there drift? [legacy-import]
- [ ] Q4: How does routing-registry-drift-guard exercise parity against sk-doc's hub-router.json / mode-registry.json vocabulary, and does the advisor's vocabulary stay aligned with the hubs it routes to? [legacy-import]
- [ ] Q5: What prioritized, implementable improvements to advisor usefulness, confidence calibration, transport resilience, and routing integration follow from the evidence? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Q1: How does the advisor_recommend MCP path (advisor-server.ts, tools/index.ts) work end-to-end, and is its 5-lane RRF fusion confidence (derived / explicit / graph-causal / lexical / semantic-shadow lanes in lib/scorer/fusion.ts) well-calibrated, or does lane fusion saturate/mislead against the 0.05 ambiguity margin (lib/scorer/ambiguity.ts) and compat-contract thresholds (lib/compat/contract.ts) backing Gate 2 (≥0.8) and Gate 1 (≥0.70 / ≤0.35)?
- [ ] Q2: How does the Claude-side user-prompt-submit hook advisor brief (hooks/claude/user-prompt-submit.ts, lib/skill-advisor-brief.ts) work, and does its documented CLI fallback path hold up when the MCP/daemon transport is unhealthy?
- [ ] Q3: Do the hook's shouldFireAdvisor gate (lib/prompt-policy.ts) and the MCP tool's threshold resolution stay provably in sync — two independent call paths converging on the same compat-contract thresholds — or is there drift?
- [ ] Q4: How does routing-registry-drift-guard exercise parity against sk-doc's hub-router.json / mode-registry.json vocabulary, and does the advisor's vocabulary stay aligned with the hubs it routes to?
- [ ] Q5: What prioritized, implementable improvements to advisor usefulness, confidence calibration, transport resilience, and routing integration follow from the evidence?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▇▇▇▇▇▆▆▆▅▂▂▅▆▆▅▆▇
- score sparkline: █▇▇▇▇▇▇▇▆▆▆▅▂▂▅▆▆▅▆▇
- Last 3 ratios: 0.78 -> 0.66 -> 0.81
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.81
- coverageBySources: {"code":18,"other":16}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Spec Memory trigger lookup was cancelled/unavailable. It supplied no research evidence; repository sources remained sufficient for the iteration focus. (iteration 1)
- Treating the public confidence as the RRF score was ruled out: the scorer computes it through a separate calibrated policy function. (iteration 1)
- The first parent checker invocation used a repo-relative path even though the checker resolves from `.opencode/`; it was an invocation error, not a product failure. Re-running with `skills/sk-doc` passed with zero warnings. (iteration 2)
- Treating a green `routing-registry-drift-guard` result as sk-doc coverage was ruled out; its source path is hard-wired to system-deep-loop. (iteration 2)
- Treating exact graph-metadata alias coverage as routing recall was ruled out; the advisor uses multiple weighted fields and semantic/derived lanes, while the hub uses the richer alias vocabulary only after discovery. (iteration 2)
- Treating `shouldFireAdvisor` prompt eligibility as a duplicate or drifting copy of the confidence/uncertainty acceptance gate. The code separates these stages and their configuration domains. (iteration 4)
- A single matrix asserting call-specific threshold overrides through the Claude hook entrypoint. The hook does not expose that input, so such a test would encode a nonexistent contract rather than parity. (iteration 5)
- Treating the existing runtime-parity file as end-to-end coverage; it does not cross the MCP dispatcher or Claude hook entrypoint. (iteration 5)

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
Run the separate shadow `0.80` task-intent floor experiment with reliability bins in an authorized implementation packet.

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
- graphConvergenceScore: 0.18
- graphDecision: STOP_BLOCKED
- Blocker: unnamed-blocker (blocking): count=1, description=Source diversity (0.00) is below the blocking threshold (1.5). STOP is blocked until diverse sources cover key questions., type=source_diversity_guard
- Blocker: unnamed-blocker (blocking): count=1, description=Evidence depth (1.00) is below the blocking threshold (1.5). STOP is blocked until question->finding->source chains are deeper., type=evidence_depth_guard
- Blocker: unnamed-blocker (blocking): count=3, description=3 claim(s) remain unverified, type=unverified_claims

<!-- /ANCHOR:graph-convergence -->
