# Iteration 8: Literal Instruction Pattern

## Focus
KQ7 why `deep.md` is more literal-model-safe.

## Findings
- `deep.md` uses explicit classification order, registry resolution, definition loading, route header emission, and pre-dispatch consistency verification [SOURCE: .opencode/agents/deep.md:65-79].
- `orchestrate.md` requires decomposition and agent selection across a broader priority table before dispatch [SOURCE: .opencode/agents/orchestrate.md:51-62].
- The generalizable pattern is: explicit mode discriminator, table lookup, single dispatch package, fail-closed consistency guard, and no route switching after resolution.

## Sources Consulted
Deep and orchestrate agents.

## Assessment
newInfoRatio: 0.64. The pattern is reusable beyond this one packet.

## Reflection
Ruled out treating longer instructions as harder instructions.

## Recommended Next Focus
Enumerate concrete propagation paths.
