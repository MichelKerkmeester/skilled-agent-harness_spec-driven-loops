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
- Topic: How can the skill advisor guide users to the right doctor command when they ask setup or health questions in plain words, such as 'help me set up skilled', 'is my repo set up right', 'check my git hooks' or 'why is this rule not enforced'? Study how the advisor routes today: .skilled/bin/skill-advisor.cjs, .skilled/skills/system-skill-advisor/ (its scorer, hooks/skill-advisor-hook.md, graph and trigger data), how commands are surfaced to the advisor versus skills, and the doctor family: .skilled/commands/doctor/*.md, .skilled/commands/doctor/_routes.yaml (its trigger_phrases per route), /doctor:sk-code setup, /doctor:git setup, /doctor:speckit, /doctor:env, /doctor:update, /doctor:mcp and /doctor:skill-advisor. Measure what the advisor returns today for at least ten such prompts (run node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"..."}' --format json). Then design how it should point to doctor commands: whether _routes.yaml trigger phrases should feed the advisor, a dedicated onboarding or 'set up skilled' entry point, how to avoid stealing prompts from skills, and how to test routing accuracy. Name ideas to reject with the reason. Cite path:line for every claim. End with ranked recommendations and proposed implementation phases.
- Started: 2026-10-15T13:50:20Z
- Status: COMPLETE
- Iteration: 5 of 10
- Session ID: fanout-swe-2-max-1792072037811-has9cy
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Advisor routing mechanics and command surfacing | - | 1.00 | 8 | complete |
| 2 | Measured baseline: advisor_recommend output on 17 setup/health/doctor prompts | - | 0.90 | 6 | complete |
| 3 | Doctor family inventory: _routes.yaml manifest, trigger_phrases, harvest boundary, owner tags | - | 0.90 | 8 | complete |
| 4 | Command surface mechanics: bridge projection shape, kind=command rendering, prompt gate, metadata ownership | - | 0.85 | 8 | complete |
| 5 | Design consolidation: _routes.yaml-fed bridges, onboarding entry, anti-steal, test plan, rejected ideas | - | 0.80 | 8 | complete |

- iterationsCompleted: 5
- keyFindings: 38
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] How does skill-advisor.cjs score and surface candidates today: scorer inputs, hook wiring, graph and trigger data sources?
- [x] How are commands surfaced to the advisor versus skills, and do doctor commands appear in advisor output at all today?
- [x] What does the advisor return today for at least ten plain-language setup/health prompts (measured baseline)?
- [x] What does the doctor command family cover: .skilled/commands/doctor/*.md routes and _routes.yaml trigger_phrases per route?
- [x] What design should point users at doctor commands (feed _routes.yaml triggers into the advisor, dedicated onboarding entry, anti-steal rules versus skills, routing-accuracy tests), and which ideas should be rejected and why?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▅▅▅▅▅▅▄▄▄▃▃▂▂▂▁▁
- score sparkline: █▇▇▆▅▅▅▅▅▅▄▄▄▃▃▂▂▂▁▁
- Last 3 ratios: 0.90 -> 0.85 -> 0.80
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.80
- coverageBySources: {"code":20,"other":35}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Looking for doctor commands in the sqlite graph: confirmed absent, no further probing needed there. (iteration 1)
- None yet; every probe produced evidence. (iteration 1)
- Hypothesis "the advisor might already surface doctor commands via some other surface": falsified by 17/17 probes. (iteration 2)
- None. (iteration 2)
- Hypothesis "_routes.yaml triggers are already machine-consumed": falsified by its own header plus both harvesters' scope. (iteration 3)
- Hypothesis "/doctor:env participates in the route manifest": falsified — standalone, no triggers. (iteration 3)
- "Prompt gate swallows setup questions": falsified — only exact-skip/short-casual prompts are declined. (iteration 4)
- "Renderer would need changes to show a command": falsified — `kind:'command'` is a first-class render path. (iteration 4)
- Constant-text brief injection, sqlite fake nodes, commands-dir doc harvest, per-skill trigger copies, umbrella router as fix, scorer logic changes — see finding 8. (iteration 5)

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
