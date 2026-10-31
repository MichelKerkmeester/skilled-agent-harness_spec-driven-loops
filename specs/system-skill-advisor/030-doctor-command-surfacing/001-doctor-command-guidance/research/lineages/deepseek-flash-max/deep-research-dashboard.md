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
- Started: 2026-10-15T13:51:08Z
- Status: COMPLETE
- Iteration: 12 of 10
- Session ID: fanout-deepseek-flash-max-1792072037811-has9cy
- Parent Session: none
- Lifecycle Mode: detached
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Advisor architecture and routing pipeline today: CLI front door, hook brief, scorer lanes, and skill-vs-command surfacing | - | 0.92 | 12 | complete |
| 2 | Measured advisor baseline for 12 plain-word setup and health prompts | - | 0.95 | 10 | complete |
| 3 | Doctor family anatomy: _routes.yaml triggers, router input gates, route inventory, and advisor consumption status | - | 0.90 | 11 | complete |
| 4 | Command admission pipeline (metadata, allow-list, scoring compatibility) and harvester scope in both implementations | - | 0.85 | 10 | complete |
| 5 | Feed mechanism design: phrase specificity, author-signal scoring, render label, and four admission mechanisms compared | - | 0.75 | 10 | complete |
| 6 | Collision analysis: measured controls and candidate doctor phrases, ownership classification, and theft guards | - | 0.90 | 10 | complete |
| 7 | Onboarding entry-point design: fallback gap, single-route precedent, four options, and the two-layer relationship | - | 0.80 | 11 | complete |
| 8 | Routing-accuracy testing design on top of the existing corpus, baseline gate, reach probe and drift guard | - | 0.85 | 10 | complete |
| 9 | Consolidated reject list: twelve newly grounded rejections plus nine carried rulings | - | 0.60 | 12 | complete |
| 10 | Ranked recommendations R1-R7 and the four-phase implementation plan with gates and rollback | - | 0.65 | 10 | complete |
| 2 | Measured advisor baseline for 12 plain-word setup and health prompts | - | 0.95 | 10 | complete |
| 6 | Collision analysis: measured controls and candidate doctor phrases, ownership classification, and theft guards | - | 0.90 | 10 | complete |

- iterationsCompleted: 12
- keyFindings: 106
- openQuestions: 0
- resolvedQuestions: 10

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 10/10
- [x] How does the skill advisor resolve a prompt to a recommendation today, and which files own scoring, graph, and trigger data?
- [x] What does the advisor return today for the required plain-word setup and health prompts, measured live?
- [x] How is the doctor command family structured, and what trigger_phrases does .skilled/commands/doctor/_routes.yaml declare per route?
- [x] How are commands surfaced to the advisor relative to skills, and do doctor commands participate in that surface at all?
- [x] Should _routes.yaml trigger phrases feed the advisor, and through which mechanism would that work?
- [x] Should there be a dedicated onboarding or set up skilled entry point, and how should it relate to the /doctor:* family?
- [x] How can doctor routing avoid stealing prompts that legitimately belong to skills?
- [x] How should routing accuracy be tested, and which existing test seams should the harness reuse?
- [x] Which candidate ideas should be rejected, and for which measured reason?
- [x] What is the ranked recommendation set and the implementation phase plan?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇██▇▇▆▅▄▆▇▅▅▆▃▁▂▄▇█▇
- score sparkline: ▇██▇▇▆▅▄▆▇▅▅▆▃▁▂▄▇█▇
- Last 3 ratios: 0.65 -> 0.95 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"other":47}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Assuming commands and skills are surfaced by the same pipeline with no distinction: commands enter as `kind: 'command'` projections with per-bridge `routingEnabled` flags and a slash-presence rank adjustment. (iteration 1)
- None this iteration; all targeted reads resolved. (iteration 1)
- Treating `SKILL.md` frontmatter `trigger_phrases` as a routing input for doctor commands: the runtime does not read them; only `graph-metadata.json` and gated doc frontmatter feed routing. (iteration 1)
- Attributing the `sk-git` match to hooks awareness: the dominant lane is `explicit_author` and the only contributing vocabulary is the `git` token boost, not hook semantics. (iteration 2)
- None; the measurement surface delivered exactly what the topic asked for. (iteration 2)
- Treating the empty results as an advisor outage: every envelope is `freshness: live` with a current generation and exit 0. (iteration 2)
- Assuming `_routes.yaml` trigger_phrases already influence advisor routing: the manifest's own header documents them as inert, and iteration 1 found no doctor bridge in the projection. (iteration 3)
- None; the manifest answered the consumption question directly. (iteration 3)
- Treating `_routes.yaml` as the complete doctor family inventory: `/doctor:env` is absent from it. (iteration 3)
- A one-bridge-per-doctor-route design under the current id grammar: `/doctor:git` targets collide at `command-doctor-git` under the uniqueness assertion. (iteration 4)
- Feeding `_routes.yaml` to a harvester as a documentation change: both harvesters are scoped to skill roots and markdown frontmatter; a new file type and root would need new code in both implementations plus the opt-in gate. (iteration 4)
- None; every seam resolved to concrete code or data. (iteration 4)
- Mechanism A (harvester extension) — new root and file type in two implementations for a manifest whose header documents the boundary. (iteration 5)
- Mechanism B as primary (hand PHRASE_BOOSTS) — bypasses inventory, parity and drift guard; retain only for bounded negative disambiguation. (iteration 5)
- None; each mechanism has a concrete verdict. (iteration 5)
- One bridge per doctor command — target granularity is required for a runnable recommendation under the input gate. (iteration 5)
- Copying `_routes.yaml` trigger phrases verbatim into bridge signal lists: the measured incumbents show verbatim duplication lands as a tie/ambiguity, not a handoff. (iteration 6)
- None; all 24 measurements returned clean, parseable envelopes. (iteration 6)
- Relying on the command-kind demotion to prevent theft: too small and only applies without a slash. (iteration 6)
- A full routing table in the hook fallback: static prompt-injected text must stay minimal. (iteration 7)
- None; the design options have concrete verdicts. (iteration 7)
- Onboarding as a `/doctor:skill-advisor` target: owner mismatch and input-gate friction. (iteration 7)
- Per-route bridges alone as the onboarding answer: no single route exists for the generic phrases. (iteration 7)
- Building a new accuracy harness from scratch: the corpus, capture script, baseline gate and reach probe already exist. (iteration 8)
- None; the infrastructure answered the design question directly. (iteration 8)
- Reusing `ci-router-vocabulary-reach.cjs` unchanged: its hub filter excludes doctor commands. (iteration 8)
- None. (iteration 9)
- This iteration's rule-set is itself the reject list; no additional dead ends. (iteration 9)
- Deferring the harness to the end: it is the gate for every other phase. (iteration 10)
- Reordering the phases to ship the umbrella before the harness: without the slice, the umbrella's admission cannot be distinguished from theft or a tie. (iteration 10)

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
