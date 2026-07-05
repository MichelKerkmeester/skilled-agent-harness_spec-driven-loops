# Iteration 8: Prompt And LEAF Contract

## Focus

Check whether fan-out prompt framing creates command-vs-agent ambiguity.

## Findings

- `buildLoopPrompt` labels the subprocess as a `deep-review` or `deep-research` agent and tells it to run `phase_init`, `phase_main_loop`, and `phase_synthesis`. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:767] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:827] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:837]
- The deep-research skill contract says the agent is LEAF-only and command YAML owns state, dispatch, convergence, and synthesis. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:13] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:23]

## Novelty

newInfoRatio: 0.62. The user prompt's explicit detached boundary works around this, but the generated wording remains risky.
