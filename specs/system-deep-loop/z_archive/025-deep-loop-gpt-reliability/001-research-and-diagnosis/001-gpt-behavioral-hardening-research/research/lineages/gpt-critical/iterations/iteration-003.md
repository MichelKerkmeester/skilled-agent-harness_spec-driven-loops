# Iteration 3: ai-council Route-Proof False-Pass Risk

## Focus

Stress-test the prior "ai-council naming drift" conclusion.

## Findings

1. The registry canonical identity is `workflowMode=ai-council`, `runtimeLoopType=council`, and `agent=ai-council`. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66-72]
2. The council YAML emits a correct resolved route in `step_build_session_state`: `mode=ai-council` and `target_agent=@ai-council`. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-118]
3. The same YAML validates a different identity: `mode: council`, `target_agent: deep-ai-council`, and resolved route `mode=council target_agent=deep-ai-council`. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:132-136]
4. The runtime topic script writes the same noncanonical values that the validator expects. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:305-313]
5. The comparator checks strict equality for `mode`, `target_agent`, and `resolved_route`, so the validator can pass a record that disagrees with the registry and with the route header built earlier in the YAML. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:636-661]

## Sources Consulted

- `.opencode/skills/deep-loop-workflows/mode-registry.json:66-72`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-136`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:305-313`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:636-661`

## Assessment

- newInfoRatio: 0.80
- Novelty justification: The bug is stronger than drift: it is a deterministic false-pass risk against noncanonical route fields.
- Confidence: 0.94

## Reflection

- What worked: Tracing registry -> YAML emitter -> runtime writer -> validator comparator.
- What failed: Prior "align naming" language was underspecified.
- Ruled out: Running ai-council in a benchmark before canonicalizing route-proof fields.

## Recommended Next Focus

Correct the prior orchestrate-to-deep hardening recommendation against NDP.
