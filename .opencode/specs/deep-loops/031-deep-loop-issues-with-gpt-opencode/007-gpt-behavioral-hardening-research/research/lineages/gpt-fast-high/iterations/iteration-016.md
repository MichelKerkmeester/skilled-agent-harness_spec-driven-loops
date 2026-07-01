# Iteration 16: Deep-Command Setup Gate Friction

## Focus
KQ2 and KQ8 command-flow friction.

## Findings
- `/deep:research` starts with a general-agent verification hard block before setup [SOURCE: .opencode/commands/deep/research.md:39-72].
- The command says all agent dispatching is handled by YAML after required setup values bind [SOURCE: .opencode/commands/deep/research.md:77-86].
- GPT stuck-flow symptoms can arise before leaf dispatch if it fails the command host role or setup binding.

## Sources Consulted
Deep research command.

## Assessment
newInfoRatio: 0.32. Misbehavior is not only leaf identity; command host preconditions also matter.

## Reflection
Ruled out a leaf-only fix for all symptoms.

## Recommended Next Focus
Compare deep router and orchestrate side-by-side.
