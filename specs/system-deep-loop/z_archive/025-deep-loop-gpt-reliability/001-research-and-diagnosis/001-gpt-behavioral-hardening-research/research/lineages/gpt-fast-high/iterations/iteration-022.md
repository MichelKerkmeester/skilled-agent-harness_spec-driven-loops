# Iteration 22: Council Route-Proof Naming Correction

## Focus
KQ3/KQ8 council follow-up.

## Findings
- Registry public workflow mode is `ai-council`, runtime loop type is `council`, and agent is `ai-council` [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:65-72].
- YAML validator currently expects `mode: council` and `target_agent: deep-ai-council` [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:128-137].
- Recommendation: align emitted and expected fields explicitly as `(workflowMode, runtimeLoopType, targetAgent)` rather than overloading one `mode` string.

## Sources Consulted
Registry and council YAML.

## Assessment
newInfoRatio: 0.20. Concrete implementation detail for phase 010.

## Reflection
Council should not be converted to subagent-only to solve a naming mismatch.

## Recommended Next Focus
Set benchmark thresholds.
