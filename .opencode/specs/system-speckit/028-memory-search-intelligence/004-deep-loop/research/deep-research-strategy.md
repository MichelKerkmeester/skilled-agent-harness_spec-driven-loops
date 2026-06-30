---
title: Deep Research Strategy - Deep Loop Runtime External Mining
description: Session tracking for mining aionforge + galadriel for deep-loop runtime improvements.
trigger_phrases:
  - "deep research strategy"
  - "deep loop mining strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW
### Purpose
Persistent brain for the deep-loop runtime external-mining session.

---

## 2. TOPIC
Mine AIONFORGE (`external/aionforge-memory-development/docs/attestation-and-promotion.md` Beta posterior, `docs/consolidation.md` contradiction-edge quarantine + transient/fatal recovery + observability gauges, `docs/bi-temporal-model.md`) and GALADRIEL (threaded ambient reflection) for improvements to the deep-loop runtime under `.opencode/skills/deep-loop-runtime/` and `.opencode/skills/deep-loop-workflows/`. Targets: Bayesian convergence scorer, coverage-graph contradiction nodes, council adjudicator weighting, fan-out recovery, cost-guard enforcement.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Can a bounded reliability-weighted Beta posterior make convergence resistant to a flood of weak findings (vs vote-count)? Map to aionforge attestation. Where is the Bayesian convergence scorer (`bayesian-scorer.ts`)?
- [ ] Q2: Should contradictions be modeled as edges that quarantine the lower-trust finding rather than dropping either side? Map to aionforge CONTRADICTS-edge quarantine. Where are coverage-graph contradiction nodes + adjudicator verdict weighting?
- [ ] Q3: Can fan-out recovery classify branches transient vs fatal and retry from durable state instead of re-running the whole loop? Map to aionforge consolidation crash-safety. Where is the fan-out router + salvage?
- [ ] Q4: What is the minimal enforceable cost ceiling with observable backpressure (lag/pending/failed gauges)? Map to aionforge observability gauges. Where are cost guards (`cost-guards.cjs`)?
- [ ] Q5: Does galadriel threaded ambient reflection suggest cheaper cross-iteration question continuity? Where is prompt-pack context injection?
- [ ] Q6: CONFIRM the reducer-anchor gap: the shipped `deep_research_strategy.md` template lacks the `<!-- ANCHOR:* -->` markers (key-questions, answered-questions, what-worked, what-failed, exhausted-approaches, ruled-out-directions, next-focus) that `reduce-state.cjs` `replaceAnchorSection` requires, so the reducer hard-fails "Missing anchor section" on a freshly-copied strategy. Is this a real bug? Propose the fix.
- [ ] Q7: Which 001 determinism primitives reuse here — reproducible convergence/newInfoRatio folding, content-derived ordering, apply-once invariant?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any candidate. Modifying external systems. Touching sibling subsystems.

---

## 5. STOP CONDITIONS
- All key questions evidence-backed + code-mapped. 10 iterations. Genuine saturation after a broadening attempt.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: Can a bounded reliability-weighted Beta posterior make convergence resistant to a flood of weak findings (vs vote-count)? Map to aionforge attestation. Where is the Bayesian convergence scorer (`bayesian-scorer.ts`)?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
From 001 (memory): determinism spine reuses here — reproducible convergence/newInfoRatio folding, content-derived ordering. NOTE: this session's own driver hit the Q6 reducer-anchor gap firsthand (a freshly-copied strategy.md without ANCHOR markers makes `reduce-state.cjs` throw "Missing anchor section key-questions"), so Q6 is partly self-evidenced — verify against the template source.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 | Convergence threshold: 0.03 | Per-iteration: 12 tool calls, 10 min
- Progressive synthesis: true | research/research.md workflow-owned
- Machine-owned sections: reducer controls 3, 6, 7-11
- Current generation: 1 | Started: 2026-06-16T15:15:00Z
