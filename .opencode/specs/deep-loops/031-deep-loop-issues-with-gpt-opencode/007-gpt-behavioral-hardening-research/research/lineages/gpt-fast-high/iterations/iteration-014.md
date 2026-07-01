# Iteration 14: Benchmark Controls and Negative Controls

## Focus
KQ6 repeatability.

## Findings
- Raw slash-command text in `opencode run` is a negative control because it does not expand command templates [SOURCE: .opencode/skills/cli-opencode/SKILL.md:271].
- Positive control must use `--command deep/research`, `deep/review`, `deep/context`, and `deep/ai-council` with equivalent setup args.
- Benchmark should record first artifact time, completion time, route-proof pass/fail, and any self-invocation/general-agent failure.

## Sources Consulted
cli-opencode command dispatch contract.

## Assessment
newInfoRatio: 0.36. Controls prevent confusing command-loading failures with model behavior.

## Reflection
Ruled out comparing raw prompts to registered commands as if equivalent.

## Recommended Next Focus
Refine plugin enforcement scope.
