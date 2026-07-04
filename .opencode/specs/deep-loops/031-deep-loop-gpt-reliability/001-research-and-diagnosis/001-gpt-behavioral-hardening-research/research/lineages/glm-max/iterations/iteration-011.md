# Iteration 11: Adversarial: Council Depth-0 Parallel Value Risk (KQ3)

**Focus track:** council | **Status:** complete

## Focus
Adversarially test the provisional no: what operator-relied-upon value does depth-0 parallel council provide that converting would silently remove.

## Findings
- **Depth-0 parallel council (ai-council.md:55-58) lets an operator fire 3+ distinct-strategy seats in parallel for a fast, diverse plan — this is a Claude/operator power feature with no equivalent if forced through a single-hop orchestrator + inline sequential thinking.** [SOURCE: ai-council.md:55-60]
- **No evidence the operator wants to give this up; the symptom report (research-prompt.md:21) is about orchestrate/research/review/context, NOT council. Converting would remove a non-broken feature to narrow a hypothetical mis-route.** [SOURCE: research-prompt.md:21]
- **Risk asymmetry: keeping mode:all + adding a route-proof header (iter 10) is additive and reversible; converting is subtractive and harder to roll back if depth-0 usage surfaces later.** [SOURCE: iter 10 finding; deep.md:69-75 additive pattern]
- **KQ3 ANSWER FIRMED: keep ai-council mode:all; do NOT convert to subagent-only; add a council route-proof header instead. Residual risk: a future council-specific mis-route would reopen this — gated on KQ1 smoke evidence.** [SOURCE: synthesis iters 9-11]

## Sources Consulted
- ai-council.md:55-60
- research-prompt.md:21
- deep.md:69-75

## Assessment
- **newInfoRatio:** 0.38
- **Novelty justification:** Locks the KQ3 answer with a risk-asymmetry argument and an additive fallback; closes KQ3 with a residual-risk statement.
- **Confidence:** 0.85
- **Key questions considered:** KQ3
- **Questions closed this iteration:** KQ3

## Reflection
**What worked:**
- Risk-asymmetry framing makes the no-conversion recommendation robust.

**What failed:**
- (none this iteration)

**Ruled out:**
- **Converting ai-council to subagent-only now**: removes a non-broken depth-0 parallel feature to narrow a hypothetical mis-route; symptoms do not involve council [SOURCE: ai-council.md:55-60; research-prompt.md:21]

## Recommended Next Focus
KQ4: orchestrate hardening v2 — delegate deep-dispatch to deep.md as single routing truth.
