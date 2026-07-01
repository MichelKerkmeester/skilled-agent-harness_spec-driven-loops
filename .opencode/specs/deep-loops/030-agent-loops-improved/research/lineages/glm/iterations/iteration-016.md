# Iteration 016 — NEW: deep-review Anti-Convergence Gap (Sibling Parity Check)

**Focus:** Does the deep-review loop have the SAME early-stop gap that forced round 2, independent of stopPolicy?
**Angle:** Compare review vs research convergence handling in the YAML.

## Findings

**deep-review DOES have anti-convergence handling under max-iterations** — partially closing the gap round 1 hit in research:
- `deep_review_auto.yaml:557`: "if stop_policy == 'max-iterations' AND iteration_count < max_iterations: do not allow all-dimensions-clean or composite convergence to stop; treat convergence signals as telemetry, set decision = CONTINUE, broaden the next review angle."
- `deep_review_auto.yaml:579`: parallel rule for the weighted-stop path.

**BUT the gap is mode-conditional, not unconditional.** The anti-convergence override ONLY activates when `stop_policy == 'max-iterations'`. Under the DEFAULT `stop_policy: 'convergence'`, deep-review will stop early on the same question-coverage/entropy signal that stopped round-1 research — which is the original problem. The fix is operator-opt-in (you must know to set max-iterations), not a default-floor.

**Contrast with research:** deep-research's convergence default is 0.05 newInfoRatio; deep-review's is 0.10 weighted P0/P1/P2 severity ratio (per SKILL.md §Convergence Threshold Semantics). Round-1 research converged at iteration 18 of 35 on a 0.01-threshold question-coverage signal. A review loop under default convergence could similarly stop at, say, iteration 12 of 30 if severity ratios flatten — even if dimensions are under-explored.

**Net finding:** the early-stop gap is mitigated only when the operator explicitly passes max-iterations. The default-behavior gap (convergence stopping before intended depth) is NOT independently fixed for either sibling; it is entirely dependent on stopPolicy choice. Recommendation: add an unconditional `minIterations` floor (the 003/001-anti-convergence-floor rec) that applies regardless of stopPolicy, so even convergence-mode loops can't stop before a sane minimum.

## Evidence
[SOURCE: deep_review_auto.yaml:557,579 — max-iterations conditional override]
[SOURCE: deep-research/SKILL.md:27-37 — threshold semantics differ per sibling]

## newInfoRatio: 0.8 (new: gap is mode-conditional, not fixed; minIterations floor rec)
