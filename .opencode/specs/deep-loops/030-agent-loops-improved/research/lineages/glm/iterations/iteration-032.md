# Iteration 032 — NEW: Cross-Sibling Convergence Threshold Parity (Why Round 1 Erred)

**Focus:** Why did round 1 converge early, and is the threshold-parity invariant robust?
**Angle:** Meta-analysis of the tooling gap that necessitated round 2.

## Findings

**Why round 1 stopped at 18:** the glm research lineage used stopPolicy=convergence (default) with convergenceThreshold=0.01. The newInfoRatio signal dropped below 0.01 at iteration 18 because of denominator drag (iter 017). The convergence was LEGAL (the quality guards passed or were overridden), but the operator's intent was >=30 iterations. The gap: the operator had no first-class way to express "I want N iterations regardless of convergence" without reaching into internal fanout config to set stopPolicy=max-iterations.

**Threshold-parity invariant (deep-research SKILL.md:27-37):** the skill explicitly warns thresholds do NOT carry across siblings (research 0.05, review 0.10, ai-council 0.20). This invariant is GOOD (prevents cross-sibling confusion) but it means each sibling independently chooses a decaying signal. The invariant doesn't protect against the WITHIN-sibling early-stop problem.

**The real meta-finding:** convergence-mode is fundamentally a "stop when novelty fades" policy, which is correct for open-ended research but WRONG for depth-guaranteed audits. The packet's own 003/001-anti-convergence-floor rec (`minIterations` + `convergenceMode:"off"` guard) was designed to fix exactly this — but checking whether it shipped: the changelog shows `changelog-003-001-anti-convergence-floor.md` exists, suggesting it was implemented for the research YAML. Yet round 1 STILL converged early, meaning either (a) the floor wasn't set high enough, (b) it wasn't active for this run's config, or (c) max-iterations overrides it anyway.

**Recommendation:** the anti-convergence floor and stopPolicy=max-iterations should be complementary first-class surfaces: floor guarantees a minimum even in convergence mode; max-iterations guarantees a maximum/exact-depth. Both should be in command help, not just config.

## Evidence
[SOURCE: deep-research/SKILL.md:27-37 — threshold-parity invariant]
[SOURCE: changelog/003.../changelog-003-001-anti-convergence-floor.md — floor rec exists]
[SOURCE: round-1 research.md:7 — converged at 18 of 35]

## newInfoRatio: 0.8 (meta-diagnosis of why round 1 erred; floor + max-iter complementarity)
