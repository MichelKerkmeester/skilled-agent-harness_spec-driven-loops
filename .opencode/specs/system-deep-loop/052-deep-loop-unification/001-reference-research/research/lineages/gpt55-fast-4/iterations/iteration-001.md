# Iteration 1: Structural Layout And Identity Boundaries

## Focus

Stress-test the proposed physical layout for merging `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`, with special attention to whether `runtime/` should become a mode packet or remain infrastructure.

## Findings

1. The target layout is structurally sound: `runtime/` is nested under `system-deep-loop/`, while `deep-research`, `deep-review`, `deep-ai-council`, and `deep-improvement` remain mode packets. The phase spec explicitly states that `runtime/` has no `graph-metadata.json` and is infrastructure, not a `workflowMode`. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:156] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169]

2. The one-identity invariant is correct. The parent spec requires exactly one skill identity and no top-level `deep-loop-workflows/` or `deep-loop-runtime/` folders after the move. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:100]

3. The forward/reverse path-repair rule is the right core mechanical insight: runtime-to-workflows paths keep the same hop count and delete a path segment, while workflows-to-runtime paths remove one hop and rename the target segment. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:171] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:174]

4. Correction: add `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` to the internal path-repair table. It lives inside the workflows tree and hardcodes the old runtime script path in CLI text and path resolution, so it belongs in child 002 Stage 3a rather than only the broad child 003 reference migration. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:26] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:56] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:65]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md`
- `.opencode/skills/deep-loop-workflows/SKILL.md`
- `.opencode/skills/deep-loop-runtime/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs`

## Assessment

- newInfoRatio: 0.92
- Novelty justification: First pass established the target layout, one-identity invariant, and a missing internal path-repair site not listed in the staged table.
- Confidence: High. The correction is based on a live script path inside the tree being moved.

## Reflection

- What worked: Reading the phase specs before code made it easy to distinguish structural policy from executable path repair.
- What failed: Treating the Class B table as exhaustive missed a live script path outside the named `orchestrate-*` files.
- Ruled out: Adding `runtime/` as a mode-registry entry; the target layout explicitly rejects that category.

## Recommended Next Focus

Validate the `system-spec-kit` tooling-borrow and confirm whether the runtime is truly dependency-self-contained or only partially self-contained.
