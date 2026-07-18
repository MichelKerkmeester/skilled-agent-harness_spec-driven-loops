---
title: "GLM-OOB Lateral Lineage Dashboard"
description: "Auto-generated dashboard for the glm-oob lineage (5 iterations, stopPolicy=max-iterations, divergence charter)."
lineage: glm-oob
session_id: fanout-glm-oob-1784347200936-r7aos1
generated_at: 2026-07-18T06:50:00Z
---

# Deep Research Dashboard — GLM-OOB Lateral Lineage

## Iteration Table

| run | focus | newInfoRatio | findings count | status |
|-----|-------|--------------|----------------|--------|
| 1 | Abolish the hub-router layer entirely (agenda #1) | 1.00 | 4 | complete |
| 2 | Cross-domain analogies — load-balancer health-check transfer (agenda #3) | 0.80 | 5 | insight |
| 3 | No-wrong-door/handoff + routing as dialogue (agenda #4+#5) | 0.90 | 5 | complete |
| 4 | Confidence-first + learned/adaptive routing (agenda #2+#6) | 0.70 | 5 | insight |
| 5 | Contrarian frame-break + radical simplification (agenda #7+#8) | 0.60 | 5 | insight |

## Question Status

**5/5 answered.** All five key questions resolved.

| id | question | status | iteration |
|----|----------|--------|-----------|
| q1 | If Layer-1 routing were deleted entirely, what breaks vs improves? | answered | 1 |
| q2 | Which routing primitive transfers from a non-routing domain, and at what cost? | answered | 2 |
| q3 | Does no-wrong-door/handoff dissolve the keep-vs-null distinction? At what cost? | answered | 3 |
| q4 | Does confidence-first + learned routing make defaultMode meaningless? | answered | 4 |
| q5 | Is the INTENT_SIGNALS+RESOURCE_MAP scheme load-bearing or an accident? | answered | 5 |

## Convergence Trend

Last 5 newInfoRatio values: `1.00 → 0.80 → 0.90 → 0.70 → 0.60` — **descending overall**, as expected
for a divergence-charter lineage that broadens angles rather than converges. Stop policy was
`max-iterations`; convergence telemetry is informational only.

Average newInfoRatio: **0.80**. Note: the lineage was explicitly chartered NOT to converge
(`stopPolicy: max-iterations`, `convergenceMode: off`), so a low late-iteration ratio is a healthy
signal of the lineage exhausting its radical-angle budget, not a stuck signal.

## Dead Ends (consolidated ruled-out directions)

| Approach | Reason Eliminated | Iteration |
|----------|-------------------|-----------|
| Set every defaultMode to null as abolition | Run-1/run-2 answer wearing a wig; abolition only counts if 4 other routerPolicy fields also deleted | 1 |
| Generalise `_apply_deep_skill_routing_layer` verbatim | Distributed monolith in another shape | 1 |
| OS scheduler priority/preemption as routing primitive | Priority=today's weight; preemption incoherent for one-shot routing | 2 |
| IP longest-prefix match as routing primitive | `vocabularyClasses` already is this | 2 |
| Receptionist "ask, don't guess" as routing primitive | Already shipped as `defer` | 2 |
| Full health-score routing as immediate destination | Four structural costs (state-space, grader, cold-start, Goodhart) make it multi-release | 2 |
| Any-mode-accepts without typed handoff vocabulary | Collapses to today's re-prompt signal | 3 |
| NWD as replacement for `defaultMode: null` | NWD is orthogonal, not replacement | 3 |
| Open-ended `clarifying_question` as zero-signal outcome | Typed card dominates whenever N≤3 candidates | 3 |
| Confidence-first routing without handoff | Collapses to run-2 null-with-card | 4 |
| "Learn the weights" | Vestigial field (uniform 4); nothing to learn | 4 |
| Live in-path weight updates | Breaks router-replay reproducibility | 4 |
| Keep `defaultMode` alongside (T,R,P) | Worst of both worlds; conflation smell persists | 5 |
| Mechanical codemod for (T,R,P) migration | `defaultMode:X` ambiguous between two (T,R) corners | 5 |
| Shrink the vocabulary table too | Vocabulary IS the router's discrimination | 5 |

## Promoted Ideas

| ideaId | observationCount | firstObserved | lastObserved | summary |
|--------|------------------|---------------|--------------|---------|
| `idea-closed-loop-router` | 3 | iter 2 | iter 4 | Closed-loop routing with typed handoff as the substrate |
| `idea-minimal-router` | 1 (early-promoted) | iter 5 | iter 5 | Minimal router = (T,R,P) + vocabulary table |
| `idea-handoff-contract` | 1 | iter 3 | iter 3 | Five-field typed handoff record as new mode-contract return type |
| `idea-trp-decomposition` | 1 | iter 4 | iter 4 | Routing knob space is (Threshold, Recovery, Provenance) |
| `idea-defaultmode-was-bug` | 1 | iter 5 | iter 5 | defaultMode was a documented bug compensating for missing recovery primitive |

## Blocked Stops

None. `stopPolicy: max-iterations` ran the loop to completion; no `blocked_stop` events emitted.

## Graph Convergence

Coverage graph accumulated 15 nodes (5 questions + 9 findings/claims) and 11 edges across the 5
iterations. Cross-iteration edges:
- iter 3 F5 → iter 2 F4 (SUPPORTS) — handoff converges with feedback channel
- iter 5 F5-bug → iter 3 F1-handoff (DERIVED_FROM) — the contrarian claim rests on the typed-handoff primitive
- iter 5 F2-minimal → iter 4 F5-trp (DERIVED_FROM) — the minimal router applies the (T,R,P) decomposition

The graph shows **two load-bearing claims** (typed-handoff primitive + (T,R,P) decomposition) that
everything else hangs off; both are independently sourced and survive into synthesis.

## Active Risks

- **Medium — single-lineage claims.** The (T,R,P) decomposition and the "defaultMode was a bug"
  contrarian claim come from one model (GLM-5.2). Cross-lineage confirmation is required before
  they feed the combined-`021` synthesis as load-bearing (CF4).
- **Low — weights observation.** The "weight=4 uniform" observation is sourced across all 7 hubs
  and is not model-dependent; it survives cross-lineage.
- **Low — `_apply_deep_skill_routing_layer` precedent.** Sourced from skill_advisor.py; not
  model-dependent.

## Next Focus

Lineage complete. Synthesis proceeds.
