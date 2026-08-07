# Iteration 2: Validate Structural Layout And Runtime Nesting

## Focus

Check whether the proposed folder topology can preserve the public workflow hub while moving runtime code under the unified system-deep-loop surface.

## Findings

- The target topology nests the former backend under `system-deep-loop/runtime/` while keeping the workflow hub and mode packets as public surfaces [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:157].
- `runtime/` must remain infrastructure, not a new deep-loop workflow mode [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:163].
- Adding runtime to `mode-registry.json` would be a category error because the registry describes active user-facing workflow modes [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169].
- The layout is sound only if graph metadata stays on the public hub and runtime remains non-discoverable as a skill identity [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:157].

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`

## Assessment

- `newInfoRatio`: 0.82.
- Novelty justification: confirmed the target topology and found the important category-error guard around `runtime/`.
- Confidence: high, because the child 002 spec states the topology and mode-registry exclusion directly.

## Reflection

The structural merge is viable, but only if implementation does not let convenience turn the backend into a seventh workflow mode.

## Recommended Next Focus

Stress-test path-coupling repair rules, because the folder move changes both runtime-to-workflow and workflow-to-runtime references.
