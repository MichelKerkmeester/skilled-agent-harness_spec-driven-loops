# Iteration 24: FIX-5 Decision: Wait on KQ1, Not Now (KQ9)

**Focus track:** fix5 | **Status:** complete

## Focus
Render the actual FIX-5 decision — unpark now, wait on KQ1, or neither — weighting the real-world operator evidence against the architectural blast radius.

## Findings
- **Unpark-NOW case: operator symptoms corroborate mis-dispatch independently of the smoke (research-prompt.md:21); the agent-layer fix is unproven sufficient. But FIX-5/host-identity is architectural, crosses runtime/CLI/loops/mirrors, "not PR-sized" (../001 §8b) — high blast radius.** [SOURCE: research-prompt.md:21; ../001/research.md §8b]
- **Neither/unpark-never case: only viable IF the agent+detection layers prove sufficient — which is exactly what is UNPROVEN. So "never" is not yet defensible.** [SOURCE: ../001/research.md §9 (deferrals); 006/decision-record.md:29]
- **DECISION: WAIT on KQ1 (the external smoke) + the cheaper layers first. Unpark FIX-5 ONLY if the iter-23 negative gate fires (measured GPT<4/4 route-proof vs Claude=4/4 after KQ4+KQ5). Rationale: the operator evidence justifies RUNNING the decisive smoke now, not jumping to the architectural fix — the cheaper layers might suffice and FIX-5 is hard to roll back.** [SOURCE: iter 23; ../001/research.md §8b,§9]
- **KQ9 ANSWER: do NOT unpark now; do NOT close as sufficient. Sequence = run KQ1 external smoke + land KQ4/KQ5, then apply the iter-23 measured negative-gate. This is more decisive than 006 because it converts "parked on inconclusive" into "actively gated on a runnable, measured criterion with a clear escalation path."** [SOURCE: iter 23 + this iteration; 006/decision-record.md]
- **Risk-asymmetry note: waiting is reversible (run the smoke, decide from data); unparking-now is not easily reversible (architectural change). The asymmetry favors wait-on-KQ1.** [SOURCE: ../001/research.md §8b]

## Sources Consulted
- research-prompt.md:21
- ../001-deep-agent-router-and-orchestration/research/research.md §8b,§9
- 006-host-hard-identity-fix5/decision-record.md:29
- iter 23

## Assessment
- **newInfoRatio:** 0.50
- **Novelty justification:** Renders a defensible wait-on-KQ1 decision with a risk-asymmetry argument and a runnable escalation path, closing KQ9.
- **Confidence:** 0.85
- **Key questions considered:** KQ9
- **Questions closed this iteration:** KQ9

## Reflection
**What worked:**
- Risk-asymmetry (reversible wait vs irreversible architectural unpark) resolves the decision cleanly.

**What failed:**
- (none this iteration)

**Ruled out:**
- **Unparking FIX-5 immediately on operator evidence alone**: architectural blast radius; cheaper layers unproven-insufficient; wait is reversible [SOURCE: ../001/research.md §8b; iter 23]

## Recommended Next Focus
Cross-KQ adversarial re-check #1: red-team the KQ4 delegation + KQ5 plugin recommendations for holes.
