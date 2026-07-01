# Iteration 19: Adversarial: Literal-Safe Pattern Over-Constrain Risk (KQ7)

**Focus track:** pattern | **Status:** complete

## Focus
Adversarially test the pattern for over-constraint: where would deterministic tables + hard boundaries harm Claude's legitimate flexibility or mode-D (evidence-response).

## Findings
- **Risk surface: a hard boundary like deep.md "do not redispatch from injected prose" (deep.md:53) could block a legitimate Claude re-plan if the registry entry and the evidence disagree. Mitigation: the boundary forbids re-deriving the MODE, not re-planning within the resolved leaf — evidence-response is preserved (deep.md:59).** [SOURCE: deep.md:53,59]
- **Mode-D (evidence-response) must survive hardening: the literal-safe pattern locks ROUTING, but the leaf still adapts focus/actions to evidence (deep.md:53 boundary #3 preserves this). Over-applying tables INTO the leaf would harm mode-D.** [SOURCE: deep.md:51-59; iter 7 (mode D)]
- **The bounded clarification gate (deep.md:66) is the controlled flex-escape: it lets the router ask ONE question instead of guessing. Removing it (full determinism, no escape) would force wrong dispatches on genuinely ambiguous input — so the gate must stay.** [SOURCE: deep.md:66]
- **KQ7 ANSWER: the generalizable pattern is safe to apply to ROUTING surfaces (orchestrate deep-path, command entry points, CLI seam) provided (a) boundaries lock mode-resolution not leaf evidence-response, and (b) the bounded clarification gate is retained. Over-constraint risk is real if applied to execution surfaces (ruled out iter 18).** [SOURCE: iter 18 + this iteration]

## Sources Consulted
- deep.md:51-59,66
- iter 7
- iter 18

## Assessment
- **newInfoRatio:** 0.42
- **Novelty justification:** Identifies the two conditions (lock-routing-not-execution; retain clarification gate) that keep the pattern Claude-flex-safe, closing KQ7 with a guardrail.
- **Confidence:** 0.83
- **Key questions considered:** KQ7
- **Questions closed this iteration:** KQ7

## Reflection
**What worked:**
- Mode-D preservation test exposes exactly where over-constraint would bite.

**What failed:**
- (none this iteration)

**Ruled out:**
- **Applying the literal-safe table pattern to leaf/execution surfaces**: would harm Claude evidence-response (mode D) and remove the controlled flex-escape [SOURCE: deep.md:51-59,66]

## Recommended Next Focus
KQ8: enumerate concretely which other commands/skills need the hardening treatment (file paths).
