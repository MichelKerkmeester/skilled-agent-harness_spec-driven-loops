---
title: Deep Research Strategy - Luna Lineage
contextType: planning
---

# Deep Research Strategy - Session Tracking

## Research Topic
Improve, refine and expand the Jev fetched-text injection screen (cli-jev feature 035). Its scorer is .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs in cli-classifier, and it measures text agents fetch with WebFetch or WebSearch, which nothing screens today; the comparator is a four-pattern lexical screen. Measured result: verdict jev: keep K=90 M=90 A=81 B=56 W=30 L=5 TP=31 FP=5 F=0 p=0.00001118, brier 0.0652. 60 natural rows plus 30 planted injection sentences. The lexical screen caught 1 of 30 planted sentences. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.

## Known Context
Feature 035 measured a Jev screen over 60 natural rows and 30 planted injection sentences. The recorded result is Jev keep, K=90, M=90, A=81, B=56, W=30, L=5, TP=31, FP=5, F=0, p=0.00001118, Brier=0.0652. The four-pattern lexical comparator caught one planted sentence. Feature 035 measured an offline scorer and did not add a fetch hook.

## Key Questions
1. What drove the measured Jev result?
2. How can accuracy improve or cost fall?
3. How can the measurement become more trustworthy?
4. Where else in .skilled would the same judgment pay off?
5. What would default-on integration need, cost, and risk?

## Answered Questions
None yet.

## What Worked
- Source review located the scorer, labels, recorded result receipt, feature 035 scope, and runtime hook surfaces.

## What Failed
- No live fetched-text hook was located in the runtime hook configurations reviewed so far.

## Exhausted Approaches
None.

## Ruled-Out Directions
- Re-running the benchmark is outside this research-only request and would add no evidence unless the corpus, labels, or scorer changed.

## Next Focus
Iteration 1: explain the score from corpus composition, baseline behavior, labels, and scorer mechanics.
