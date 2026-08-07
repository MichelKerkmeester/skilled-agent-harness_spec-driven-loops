# Iteration 6: Benchmark Redesign After Confirmed Symptoms

## Focus

Update KQ6 so it measures mechanisms and fix efficacy rather than proving the symptoms exist.

## Findings

1. The operator-confirmed symptoms change the benchmark's purpose: it should not decide whether GPT misbehaves; it should classify how and how often it misbehaves after each hardening layer. [SOURCE: research-prompt.md:91-108]
2. The GPT leg still needs an external non-OpenCode shell or equivalent because `cli-opencode` explicitly self-guards inside OpenCode except for explicit parallel-detached cases, and phase 005 already tripped those guards. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:319-322] [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:117-124]
3. The benchmark must include failure classes: `phase0_self_check`, `route_mismatch`, `noncanonical_route_false_pass`, `missing_artifact`, `semantic_wrong_mode`, `timeout_latency`, and `executor_env_blocked`.
4. Precondition: canonicalize ai-council route proof before running the ai-council leg, or both models can produce misleading results independent of behavior. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-136]

## Sources Consulted

- `research-prompt.md:91-108`
- `.opencode/skills/cli-opencode/SKILL.md:319-322`
- `005-gpt-verification-smoke/verification-smoke.md:53-68,117-124`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-136`

## Assessment

- newInfoRatio: 0.57
- Novelty justification: Adds failure-classification and precondition ordering to the prior 4-mode x 2-model benchmark.
- Confidence: 0.84

## Reflection

- What worked: Treating confirmed symptoms as the starting point.
- What failed: A simple pass/fail route-proof benchmark would conflate Phase-0 and council-harness bugs.
- Ruled out: Benchmarking without ai-council canonicalization and Mode-D buckets.

## Recommended Next Focus

Re-state FIX-5 unpark criteria without using "insufficient evidence" as an escape hatch.
