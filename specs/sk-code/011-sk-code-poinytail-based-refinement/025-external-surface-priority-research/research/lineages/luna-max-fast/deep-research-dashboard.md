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
- Topic: How should Skilled treat the sk-code surfaces for external repository users? The v4.0.0.4 release note entry "One Surface Order Everywhere" (.skilled/changelog/skilled/v4.0.0.4.md) says every sk-code file that ranks the code surfaces lists OpenCode, then Obsidian, then Webflow; a prompt matching two surfaces lists them in that order; on a keyword tie the session's current surface can lead via `compiled-route.cjs --surface-hint`. The operator says this is wrong for external users: sk-code-obsidian and sk-code-webflow are the operator's personal surfaces and serve only as examples, which an external user deletes and replaces with an sk-code surface for their own project, so the doctor and everything else in Skilled should assume they are gone. sk-code-opencode is the one native surface and, for users other than the operator, should have the LOWEST priority: a user's own non-native surface outranks it. sk-code-review, sk-code-quality and the shared/ layer are stack-agnostic and serve every user. Answer with path:line or command evidence: (1) every place that encodes the surface order or treats obsidian or webflow as installed: sk-code hub-router.json tieBreak, mode-registry.json, SKILL.md, ROUTER.md, shared/references (stack-detection.md), the compiled-routing manifest and runtime (.skilled/bin/compiled-route.cjs, .skilled/bin/lib/compiled-routing/), canary fixtures, the skill advisor (graph metadata, scorer boosts, batteries), the doctor commands and checks (.skilled/commands/doctor/), install guides, READMEs and the v4.0.0.4 note; (2) what breaks today when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy outside the worktree (doctor checks, compiled-route-guard, route sync, canaries, advisor, package and parent-skill checks), and what happens when they add their own surface packet; (3) how a user-added surface should outrank sk-code-opencode: a priority or rank field in mode-registry.json, a native or fallback flag on opencode, a tieBreak derived when the manifest is minted, the --surface-hint path, or something else, compared on cost and risk with one recommendation; (4) how the operator's own repository keeps its current order with obsidian and webflow present while the shipped default assumes they are gone: configuration versus data, example versus shipped; (5) doctor and documentation changes that tell external users obsidian and webflow are examples to delete or replace, and how to scaffold their own surface (sk-doc create-skill, parent-skill mode packets); (6) ideas to reject, with reasons. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the cheaper move and why it fails.
- Started: 2026-10-12T16:28:06.444Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-025-luna-max-fast-2026-10-12T16:28:06.444Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1 part 1: the sk-code hub's surface ordering, registration, and stack-agnostic layer | routing | 1.00 | 5 | complete |
| 2 | Q1 part 2: compiled routing order, surface hints, manifest freshness, route sync, and canary coverage | - | 1.00 | 5 | complete |
| 3 | Q1 part 3: advisor, doctor, docs and release note; throwaway-copy probes for Q2 | - | 0.93 | 7 | complete |
| 4 | Q2 part 1, observed breakage after removing sk-code-obsidian and sk-code-webflow and adding an unregistered local surface packet | - | 0.80 | 10 | complete |
| 5 | Q2 part 2: add and register a user-owned sk-code surface in a fresh copy with Obsidian and Webflow removed, refresh routing, and compare it with OpenCode. | routing | 0.80 | 6 | insight |
| 6 | Q3: compare persistent surface-order options and identify the cheapest supported policy. | routing | 0.90 | 5 | complete |
| 7 | Q4: operator configuration versus shipped external default; update units, authored versus generated files, and precedence derivation. | - | 0.90 | 5 | complete |
| 8 | Q5: doctor and documentation changes; replacement guidance and surface scaffolding | - | 0.85 | 2 | complete |
| 9 | Q6 synthesis: reject overbuilt surface-priority approaches and rank a minimal external-user path | - | 0.60 | 6 | complete |
| 10 | Adversarial re-verification of prior surface order, presence, breakage, docs, and recommendations | - | 0.40 | 7 | complete |

- iterationsCompleted: 10
- keyFindings: 0
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] Q1: Where is the surface order (opencode, obsidian, webflow) encoded, and where are sk-code-obsidian and sk-code-webflow treated as installed?
- [x] Q2: What breaks when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy, and what happens when they add their own surface?
- [x] Q3: How should a user-added surface outrank sk-code-opencode (registry priority field, native or fallback flag, tieBreak derived at mint time, --surface-hint, other), and which option is cheapest at acceptable risk?
- [x] Q4: How does the operator repository keep its current order while the shipped default assumes the examples are gone (configuration versus data, example versus shipped)?
- [x] Q5: Which doctor and documentation changes tell external users the two surfaces are examples, and how do they scaffold their own surface?
- [x] Q6: Which ideas should be rejected, and why?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████▇▇▆▆▆▆▇▇▇▇▆▆▅▃▂▁
- score sparkline: ████▇▇▆▆▆▆▇▇▇▇▆▆▅▃▂▁
- Last 3 ratios: 0.85 -> 0.60 -> 0.40
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.40
- coverageBySources: {"code":130,"other":52}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- No claim is made about deletion failures. The authorized throwaway-copy experiment is deferred to the Q2 focus. (iteration 2)
- No implementation or canary test execution was attempted. This pass read the canary fixtures and tests to identify their encoded expectations. (iteration 2)
- `compiled-route-sync.cjs --check` is an executable deletion probe under the required copy recipe: it stops before validation because `specs/` is absent. This limitation was seen previously and is not retried with a different copy shape. (iteration 4)
- Adding only a new directory is sufficient for routing: the custom prompt returned `action=defer` with no targets. (iteration 4)
- --surface-hint as the project default: it is conditional on each caller passing a matched surface hint. (iteration 6)
- A native/fallback sort flag: one flag cannot order multiple custom surfaces, while the list already can. (iteration 6)
- A priority/rank field: the existing ordered list expresses the requirement without another schema and ordering source. (iteration 6)
- Deriving order from registry-array position: the registry does not currently define that position as precedence. (iteration 6)
- A new surface-scaffolding command or separate installer guide: the existing parent-skill workflow already creates surface packets. A new entry point would duplicate its contract. (iteration 8)
- A README-only clarification: the hub SKILL.md is the canonical surface inventory and the doctor still needs actionable repair text. (iteration 8)

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
