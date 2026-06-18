---
title: Deep Research Strategy - Skill Advisor External Mining
description: Session tracking for mining aionforge + galadriel for Skill Advisor improvements.
trigger_phrases:
  - "deep research strategy"
  - "skill advisor mining strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW
### Purpose
Persistent brain for the Skill Advisor external-mining session.

---

## 2. TOPIC
Mine AIONFORGE (`external/aionforge-memory-development/docs/retrieval.md` query-class router + RRF, `docs/attestation-and-promotion.md` Beta posterior) and GALADRIEL (`galadriel-public-main 2/harness/palace.py` ambient mining) for improvements to the Skill Advisor 5-lane fusion scorer (explicit-author 0.42 / lexical 0.28 / graph-causal 0.13 / derived 0.12 / semantic-shadow 0.05) under `.opencode/skills/system-skill-advisor/`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Would a retrieval-shape query-class router improve lane weighting over the fixed 0.42/0.28/0.13/0.12/0.05 split? Map to aionforge query-class router. Where is lane fusion?
- [ ] Q2: Does deterministic RRF (fixed order, stable tiebreak, zero-weight elision) remove the comparable-score problem in the current weighted sum? Map to aionforge RRF k=60. Where is the advisor scorer?
- [ ] Q3: Can a bounded reliability-weighted Beta posterior auto-tune lane weights from outcomes without over-fitting? Map to aionforge attestation-and-promotion.md. Where are lane weights set (lane-registry)?
- [ ] Q4: Can the semantic-shadow lane (0.05) graduate via an exact-rerank pass? Map to aionforge dense+exact-rerank. Where is the semantic lane?
- [ ] Q5: Is an ambient off-budget trigger-harvest pass worth adding (doc-trigger harvest, currently flag-gated)? Map to galadriel ambient mining. Where is trigger indexing + the watcher?
- [ ] Q6: When the skill-graph is unavailable, does the graph-causal lane degrade gracefully (skip + reweight) or fail? Map to aionforge graceful degrade.
- [ ] Q7: Which 001 primitives reuse here — shared `fuseResultsMulti {bonusOverChannels}` option, deterministic RRF, query-class routing? (001 flagged skill-advisor as touched by determinism + routing spines.)

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
Q1: Would a retrieval-shape query-class router improve lane weighting over the fixed 0.42/0.28/0.13/0.12/0.05 split? Map to aionforge query-class router. Where is lane fusion?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
From 001 (memory): the same fusion machinery family — a shared `fuseResultsMulti` with `{bonusOverChannels: active|configured}` option and the apply-once invariant are reusable; deterministic RRF (k, fixed order, stable tiebreak, weight:0 elision) directly addresses the advisor's weighted-sum comparability. Query-class routing generalizes from memory recall to advisor lane weighting (additive, not a substitute for explicit-author lane).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 | Convergence threshold: 0.03 | Per-iteration: 12 tool calls, 10 min
- Progressive synthesis: true | research/research.md workflow-owned
- Machine-owned sections: reducer controls 3, 6, 7-11
- Current generation: 1 | Started: 2026-06-16T15:15:00Z
