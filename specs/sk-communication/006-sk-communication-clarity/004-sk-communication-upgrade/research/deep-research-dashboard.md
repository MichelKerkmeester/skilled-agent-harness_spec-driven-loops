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
- Topic: How should the sk-communication projection engine own logic change in light of the three vendored communication sources under specs/sk-communication/006-sk-communication-clarity/context, and where must any wording knowledge live so the skill keeps exactly one home for it.
- Started: 2026-09-12T16:04:54.854Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: research-sk-communication-006-004-skill-logic
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | unknown | - | 0.83 | 0 | complete |
| 2 | unknown | - | 0.79 | 0 | complete |
| 3 | unknown | - | 0.75 | 0 | complete |
| 4 | unknown | - | 0.68 | 0 | complete |
| 5 | unknown | - | 0.67 | 0 | complete |

- iterationsCompleted: 5
- keyFindings: 77
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] What instruction does the engine actually send a rewriting provider, and does it match what the skill's own documentation says its wording standard is? [legacy-import]
- [ ] Should the engine gain a transform layer of detectors with deterministic repairs, and if so what is each transform in precise terms? [legacy-import]
- [ ] What quality post-condition could the fidelity validator check that it does not check today, and is that post-condition mechanically checkable rather than a judgment? [legacy-import]
- [ ] Is a re-render in plainer words still the right lane, given the clarity source's claim that smoothing is not rewriting and polishes away what is worth keeping? [legacy-import]
- [ ] Where may any new wording knowledge live without giving the standard a second home, and what does the skill's own one-home rule actually permit? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] What instruction does the engine actually send a rewriting provider, and does it match what the skill's own documentation says its wording standard is?
- [ ] Should the engine gain a transform layer of detectors with deterministic repairs, and if so what is each transform in precise terms?
- [ ] What quality post-condition could the fidelity validator check that it does not check today, and is that post-condition mechanically checkable rather than a judgment?
- [ ] Is a re-render in plainer words still the right lane, given the clarity source's claim that smoothing is not rewriting and polishes away what is worth keeping?
- [ ] Where may any new wording knowledge live without giving the standard a second home, and what does the skill's own one-home rule actually permit?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▆▆▅▅▅▄▄▃▂▂▁▁▁▁▁
- score sparkline: ██▇▇▇▆▆▅▅▅▄▄▃▂▂▁▁▁▁▁
- Last 3 ratios: 0.75 -> 0.68 -> 0.67
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.67
- coverageBySources: {"code":46,"other":12}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **"A rubric is carried somewhere else in the package and merged into the prompt."** Ruled out by (iteration 1)
- **Reading `.opencode/commands/rewrite/response*.md` in this iteration** to explain how the standard (iteration 1)
- None yet. This iteration opened the evidence base rather than exhausting a direction. (iteration 1)
- **Expecting an LLM-based quality judge behind `judgeMode: 'required'`.** Attempted by reading the (iteration 2)
- **Re-reading `validator.ts` to locate the judge call.** Avoided by reading the caller (iteration 2)
- **Reading the vendored `claude-style-patch` and `i-have-adhd` sources this iteration.** Deferred (iteration 2)
- None. The assigned focus produced evidence on every sub-question; nothing was exhausted. (iteration 2)
- Attempting to adjudicate "stacked compression" mechanically: the rule's own definition (`STYLE.md:41-43`) makes the third move depend on the first two, so a deterministic version is not expressible without solving metaphor and nominalization detection, which are judgment tasks. (iteration 3)
- Reading the phrase "the user message" as a plain contradiction of `copyEditingScope`: rejected on the evidence in finding 1 — the two phrases are true of two different referents in the same request, so no contradiction exists to resolve. (iteration 3)
- Searching for a context-text field in the prompt assembly path (`src/contracts/prompt.ts`, `src/providers/controls.ts`): no such field exists, so the question of whether the context text is transmitted cannot be answered from that surface. The remaining trace must go through the assembler that produces `document.encodedText`. Not a saturated direction — one specific check remains. (iteration 3)
- Treating the fidelity validator as the natural home for style post-conditions: rejected in finding 6, because every validator failure discards the rewrite back to the exact original. (iteration 3)
- Reading `.opencode/commands/rewrite/response*.md` to settle whether the *user-facing* command name (iteration 4)
- Searching `src/` for a semantic-difference module that might hold a prose-order test: the only (iteration 4)
- Treating `INVALID_INPUT` at the render layer as an order check: ruled out by finding 2 — it compares (iteration 4)
- Treating the render layer as the place a reorder would have to be caught: ruled out by finding 1 — (iteration 4)
- Attempting a mechanical definition of "stacked compression": still not expressible, ledger (iteration 5)
- Re-deriving rows R1-R4 from the source in this iteration: the touch points were already cited in (iteration 5)
- Reading the vendored `claude-style-patch` and `i-have-adhd` sources again: iteration 3 already (iteration 5)
- Searching for a prose-order detector to make the R4 observability field complete: it does not (iteration 5)
- Treating the validator as the host for any new quality signal: closed by construction (see 5.3). (iteration 5)

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
**Whether unguided-rewrite quality is a paid gate** (D3) — answerable only by the blind

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
