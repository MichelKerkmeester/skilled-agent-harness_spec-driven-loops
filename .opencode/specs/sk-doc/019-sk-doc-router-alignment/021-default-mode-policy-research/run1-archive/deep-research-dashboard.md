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
- Topic: Should a parent hub routerPolicy.defaultMode point at a child mode, or default to null so the parent SKILL.md disambiguates or detects instead? Evaluate the five auto-defaulting hubs (sk-prompt to prompt-improve, cli-external-orchestration to cli-opencode, system-deep-loop to research, mcp-tooling to mcp-chrome-devtools, sk-design to interface) for whether each default is the genuine dominant case or a presumption, versus the two null models (sk-doc defers, sk-code detects). Propose a principled per-hub fleet policy and the exact create-skill canon plus route-gold benchmark encoding.
- Started: 2026-07-17T16:18:56Z
- Status: INITIALIZED
- Iteration: 3 of 5
- Session ID: rsr-2026-07-17T16-18-56Z
- Parent Session: rsr-2026-07-17T16-18-56Z
- Lifecycle Mode: resume
- Generation: 1
- continuedFromRun: 2

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Deterministic router-replay fallback semantics for child defaults versus null and constraints for later per-hub verdicts | architecture | 1.00 | 5 | complete |
| 2 | Falsifiable dominant-child rule applied to all five auto-defaulting hubs with provisional keep-versus-null verdicts and explicit mis-default costs | architecture | 1.00 | 6 | complete |
| 3 | Exact create-skill canon and route-gold encoding for named-child, null/defer, and null/detect-and-bundle zero-signal policies | architecture | 1.00 | 6 | complete |

- iterationsCompleted: 3
- keyFindings: 17
- openQuestions: 4
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/5
- [x] What evidence-backed decision rule distinguishes a genuine dominant child from a presumptive default?
- [ ] What does deterministic router replay actually do when no intent scores and `defaultMode` is a child versus `null`, including `sameSet` behavior? [legacy-import]
- [ ] Which of the five auto-defaulting hubs should keep its child default, and which should flip to `null`, based on mode mix and misroute cost? [legacy-import]
- [ ] How do the `sk-doc` defer model and `sk-code` detection model constrain the fleet policy? [legacy-import]
- [ ] What exact create-skill canon and route-gold benchmark changes encode default, defer, and detect outcomes deliberately? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] What does deterministic router replay actually do when no intent scores and `defaultMode` is a child versus `null`, including `sameSet` behavior?
- [ ] Which of the five auto-defaulting hubs should keep its child default, and which should flip to `null`, based on mode mix and misroute cost?
- [ ] How do the `sk-doc` defer model and `sk-code` detection model constrain the fleet policy?
- [ ] What exact create-skill canon and route-gold benchmark changes encode default, defer, and detect outcomes deliberately?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":62}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=3 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 1 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=3 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A dedicated `sameSet()` implementation in the skill-benchmark CJS directory was not found by the bounded source search. The exact-equality semantics are nevertheless explicit in the packet's benchmark documentation, so broadening the search would add little to this focus. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/routing-before-after.md:146-147] (iteration 1)
- Treating `routeTelemetry.defaultApplied: true` as evidence that the child was selected is ruled out by the simultaneous `workflowMode: null` assignment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-353] (iteration 1)
- **Existing `defaultMode` as proof of genuine dominance.** Multiple parent contracts explicitly defer on ambiguity even while their router metadata names a child, so the configuration is the hypothesis under test, not evidence for itself. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:56-64] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:51-68] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:59-65] (iteration 2)
- **Mode count alone as the policy.** `sk-doc` has many modes and nulls, but the decisive property is unresolved choice/cost; `sk-code` also nulls despite being able to detect and bundle a surface separately. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-34] [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] (iteration 2)
- **Tie-break or registry order as dominance evidence.** The peer modes in CLI, deep-loop, MCP, and design carry equal weights; ordering resolves ties but does not measure `P(mode|Z)`. [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:4-30] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-50] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-91] [SOURCE: .opencode/skills/sk-design/hub-router.json:4-91] (iteration 2)
- No consulted canonical hub artifact contains representative zero-signal traffic counts or adjudicated misroute-cost telemetry. Therefore all verdicts remain provisional; repeating policy prose cannot turn them into empirical dominance claims. The smallest decisive evidence is a labeled held-out corpus for each hub's zero-signal branch. [INFERENCE: based on the five mode registries, five hub routers, and five parent routing contracts consulted this iteration] (iteration 2)
- Reusing only `expected_intent: []` for zero-signal policy: exact-set success is identical for named-child and null under current replay. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-352] (iteration 3)
- Treating the first workflow placeholder or hub-identity vocabulary owner as an implicit dominance declaration: those are scaffold mechanics, not traffic or expected-loss evidence. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5-16] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:37] (iteration 3)

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
Which five provisional fleet verdicts survive representative zero-signal corpus validation?

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
- graphConvergenceScore: 0.58
- graphDecision: STOP_BLOCKED
- Blocker: unnamed-blocker (blocking): count=1, type=source_diversity_guard
- Blocker: unnamed-blocker (blocking): count=1, type=evidence_depth_guard

<!-- /ANCHOR:graph-convergence -->
