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
- Topic: Generation 2 extension of the expansive-depth sub-mode research for system-deep-loop deep-research and deep-review. Generation 1 (7 iterations, archived at specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261117T103614Z/research.md) designed an opt-in --depth-mode=expansive frontier sub-mode and registered defects D1-D9. This generation verifies and deepens it: (a) adversarially verify the design and D1-D9 against the code, correcting anything wrong; (b) close the generation-1 open questions: review-side pivot adapter divergent-review-pivot.ts and fanout-merge.cjs internals, whether a divergent pivot after all_questions_answered buys only about one iteration, and who should produce coverage-graph quality_class with what closed vocabulary; (c) find further reasons loops stay narrow that generation 1 missed (deep-review reducer, prompt packs, agent definitions, skill-advisor scorer df-idf.ts for example target 2); (d) refine the implementation plan into concrete, testable change slices with risks.
- Started: 2026-11-17T10:36:36.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-11-17T10:36:36.000Z
- Parent Session: 2026-11-17T07:52:43.000Z
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: adversarially verify the generation-1 design and defects D1-D9 against current code; verified D1, D2, D3, D5, D6, D7 (the ship-first set); probed D7/D9 live via this record's own projection | verification | 0.63 | 8 | complete |
| 2 | Q3: trace divergent-pivot yield after all_questions_answered end to end (prepare/finalize/apply/next convergence check) + honest D1 fix (quality_class producer, closed vocabulary, enforcement point) | loop-mechanics | 0.80 | 5 | complete |
| 3 | Q2: review side — how divergent-review-pivot.ts, the deep-review reducer, the review prompt pack and fanout-merge.cjs internals keep review runs narrow, and what the frontier sub-mode must change that generation 1 did not map | review-loop-internals | 0.90 | 6 | complete |
| 4 | Q6: design completed-run extension for deep-research and deep-review — traced on_completed_session (halt vs synthesis asymmetry), step_apply_lifecycle_request, ledger stems, convergence cap/floor, max-duration clock; specified completed-continue/--extend design with config fields, run_extended event, reducer/segment/synthesis treatment, files and tests | - | 0.90 | 10 | complete |
| 5 | Q5: concrete independently-shippable change slices from gen-1 recommendations + iterations 1-4 findings (extension slice first per operator); scoped Q4 residual note | implementation-planning | 0.85 | 6 | complete |

- iterationsCompleted: 5
- keyFindings: 80
- openQuestions: 2
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/6
- [x] Q2: On the review side, how do divergent-review-pivot.ts, the deep-review reducer, the review prompt pack and fanout-merge.cjs internals keep review runs narrow, and what does the frontier sub-mode need to change there that generation 1 did not map?
- [x] Q3: How many extra iterations does a divergent pivot after all_questions_answered actually buy (trace the code path end to end), and what is the honest fix for D1: who should produce coverage-graph quality_class, from what closed vocabulary, enforced where?
- [x] Q5: Turn the generation-1 recommendations into concrete, independently shippable change slices: for each slice the files, the behavior change, the tests that prove it (existing and new), the default-path risk, and the ordering dependencies.
- [x] Q6: Design completed-run extension for deep-research and deep-review. Today a completed packet halts (step_classify_session on_completed_session) and the completed-continue lineage mode is deferred, so the only way to add iterations is --restart, which archives the registry, strategy and questions. How should an in-place extension work (completed-continue or an --extend=N flag): which config fields change, which ledger event records it, how the reducer, convergence floor and synthesis treat pre- and post-extension iterations, and which files and tests change?
- [ ] Q1: Adversarially verify the generation-1 design (§8, §10 of the archived research.md) and defects D1-D9 against the current code. Which claims hold, which are wrong or overstated, and what are the corrected statements with file:line evidence? [legacy-import]
- [ ] Q4: For example target 2 (skill-advisor auto-utilization while chatting), what do the scorer (df-idf.ts and its callers) and the prompt-policy gate actually do with casual chat prompts, and does the generation-1 frontier decomposition for that target survive contact with the code? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] Q1: Adversarially verify the generation-1 design (§8, §10 of the archived research.md) and defects D1-D9 against the current code. Which claims hold, which are wrong or overstated, and what are the corrected statements with file:line evidence?
- [ ] Q4: For example target 2 (skill-advisor auto-utilization while chatting), what do the scorer (df-idf.ts and its callers) and the prompt-policy gate actually do with casual chat prompts, and does the generation-1 frontier decomposition for that target survive contact with the code?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▁▂▃▄▅▆▆▇▇████████▇▇▇
- score sparkline: ▁▂▃▄▅▆▆▇▇████████▇▇▇
- Last 3 ratios: 0.90 -> 0.90 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":36,"other":54}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- "Pivot buys ~1 iteration" as a general claim — contradicted by the re-fire mechanics: `all_questions_answered` persists after a pivot (no new questions are added), every later stop re-enters the branch, and the lifetime cap is `maxPivots: 3`, not 1. The claim survives only at trigger iteration = `maxIterations − 1`. (iteration 2)
- `maxCouncilSeatOutputs: 9` is a shared lifetime cap — worth recording because a partial/resumed pivot consumes seat budget without completing, silently shrinking the effective pivot count below 3. (iteration 2)
- `minRemainingIterations` as a meaningful guard — `remainingIterations == 0` is unreachable because `maxIterationsReached` outranks the pivot branch. (iteration 2)
- Candidate exhaustion as the yield limiter — `keyFindings.slice(-3)` cross-check seeds regenerate whenever new findings land. (iteration 2)
- Admitting frontier nodes through `research/inbox.jsonl` on the review side — the review reducer has no question surface to project it into; nothing reads an inbox row (finding 2). (iteration 3)
- **`--extend=N` as a standalone flag divorced from the lineage mode**: needs identical machinery (classify branch, event, config mutation) while splitting the documented vocabulary — rejected in favor of `lineage_mode=completed-continue` with `--extend` as its spelling. (iteration 4)
- **Emitting the extension as a plain `resumed` event**: cheaper (no schema change) but makes a budget top-up indistinguishable from an ordinary resume in the ledger and dashboard — violates the provenance the ledger exists to carry. (iteration 4)
- **Re-stamping `createdAt` to reset the duration clock**: erases elapsed-time audit and breaks `elapsedMinutes` telemetry; raising `maxDurationMinutes` is the honest budget bump the confirm gate already prescribes. (iteration 4)
- A separate `--extend` implementation path that skips the ledger event — rejected in iteration 4 (plain `resumed` destroys provenance); reaffirmed here. (iteration 5)
- Shipping the frontier sub-mode as one large change — the defect layer is independently shippable and de-risks the surfaces frontier composes (focus precedence, pack contract, projection fields, diversity signal). (iteration 5)
- Treating Q4's gate as the df-idf scorer — the scorer never sees casual chat because `prompt-policy.ts` gates fire/skip upstream. (iteration 5)

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
Open sub-question: per-pivot vs lifetime `maxCouncilSeatOutputs` (Slice L decision point).

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
