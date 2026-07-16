# Iteration 25: Cross-KQ Adversarial Re-check #1: KQ4 + KQ5

**Focus track:** adversarial | **Status:** insight

## Focus
Red-team the two structural recommendations (orchestrate->deep delegation, enforcement plugin) for holes, second-order effects, and ordering conflicts.

## Findings
- **KQ4 hole-test: if orchestrate delegates deep-dispatch to deep.md via "dispatch @deep and STOP", but the operator invokes /deep:research directly (bypassing orchestrate), the delegation path is never exercised — so KQ4 only helps the @orchestrate entry, not the /deep:* command entry. Both entries need the hardening (consistent with KQ8 paths #1 and #2-5).** [SOURCE: iter 12,13; commands/deep/research.md]
- **KQ5 hole-test: the enforcement plugin asserts route-proof at dispatch, but if GPT produces a schema-valid route-matched artifact while doing semantically wrong work (the ../001 §5 false-negative), the plugin's route-proof passes too. The plugin catches IDENTITY/route mismatch, NOT semantic correctness — so it does not obsolete the need for the smoke to check real leaf behavior.** [SOURCE: ../001/research.md §5; iter 14,15]
- **Ordering: KQ4 (prompt-layer) and KQ5 (detection-layer) are independent and parallelizable; neither blocks the other. KQ6 benchmark should run AFTER both to measure their joint effect. KQ1 smoke can run before (baseline) and after (regression).** [SOURCE: iter 5,12,14,16]
- **Second-order: making orchestrate deep-dispatch deterministic could reduce @orchestrate latency for deep requests (removes the inference + self-derivation) — a positive side effect on the "slow orchestrate" symptom (KQ2 latency).** [SOURCE: iter 6,12; ../001/research.md §3.1]
- **No recommendation collapses under red-team; both hold with the noted scoping (KQ4 helps the orchestrate entry specifically; KQ5 does not catch semantic wrong-mode). Order them parallel, benchmark after both.** [SOURCE: this iteration]

## Sources Consulted
- ../001-deep-agent-router-and-orchestration/research/research.md §5,§3.1
- iter 5,12,14,16
- commands/deep/research.md

## Assessment
- **newInfoRatio:** 0.35
- **Novelty justification:** Surfaces two real scoping limits (KQ4 entry-specificity, KQ5 semantic-not-caught) and a positive latency side-effect, strengthening the recommendations without overturning them.
- **Confidence:** 0.82
- **Key questions considered:** KQ3, KQ4, KQ5, KQ9
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Entry-specificity and semantic-limit hole-tests sharpen both recommendations.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
Cross-KQ adversarial re-check #2: red-team KQ3 (no-conversion) + KQ9 (wait).
