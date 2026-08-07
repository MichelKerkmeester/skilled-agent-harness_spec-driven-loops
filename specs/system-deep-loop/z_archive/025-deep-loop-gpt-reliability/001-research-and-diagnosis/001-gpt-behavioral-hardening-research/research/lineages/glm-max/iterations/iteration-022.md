# Iteration 22: Adversarial: Family Members That Must NOT Be Hardened (KQ8)

**Focus track:** propagation | **Status:** complete

## Focus
Identify which family members must NOT receive the hardening to avoid breaking non-broken flexibility, finalizing KQ8 scope.

## Findings
- **Must-NOT-harden #1: leaf execution agents (@context, @code, @review, @markdown, @debug) — their value is evidence-response/flexibility, not routing determinism. Hardening their internals would harm mode-D (iter 7). Only their DISPATCH routing is hardened (via orchestrate/deep), not their behavior.** [SOURCE: orchestrate.md:99-105,116; iter 7,19]
- **Must-NOT-harden #2: ai-council depth-0 parallel path — KQ3 already ruled out subagent-only conversion; the route-proof header is additive, the parallel value stays (iter 9-11).** [SOURCE: iter 9-11; ai-council.md:55-60]
- **Must-NOT-harden #3: the bounded clarification gate itself (deep.md:66) — removing it for "full determinism" would force wrong dispatches on ambiguous input. It is the controlled flex-escape.** [SOURCE: deep.md:66; iter 19]
- **KQ8 ANSWER: propagation scope = orchestrate.md (KQ4), 4 command entry seams, the CLI executor seam, system-skill-advisor enforcement (KQ5), + .claude mirrors. Explicitly NOT hardened: leaf execution agents, council depth-0 path, the clarification gate. Codex deferred. Improvement-family deferred (same pattern).** [SOURCE: iter 20,21 + this iteration]

## Sources Consulted
- orchestrate.md:99-105,116
- ai-council.md:55-60
- deep.md:66
- iter 7,9-11,19,20,21

## Assessment
- **newInfoRatio:** 0.38
- **Novelty justification:** Finalizes KQ8 with an explicit must-NOT-harden list that protects the three flex assets, closing the scope with guardrails.
- **Confidence:** 0.84
- **Key questions considered:** KQ8
- **Questions closed this iteration:** KQ8

## Reflection
**What worked:**
- A must-NOT list is as important as a must list for propagation scope.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ9: FIX-5 unpark decision criterion distinct from phase 006's inconclusive trigger.
