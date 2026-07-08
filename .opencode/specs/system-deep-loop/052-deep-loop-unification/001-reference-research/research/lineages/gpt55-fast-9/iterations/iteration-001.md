# Iteration 1: Structural Layout And Skill Identity

## Focus

This iteration tested whether the proposed `system-deep-loop/` layout with nested `runtime/` preserves the current hub/backend architecture without introducing a new routable mode, duplicate skill identity, or advisor ambiguity.

## Findings

1. The merge target is structurally sound if `system-deep-loop` becomes the single public advisor-routable hub and `runtime/` is kept as backend infrastructure, not a mode packet. The live hub already defines `deep-loop-workflows` as one public home over a frozen backend and says the hub holds no per-mode convergence, state, or synthesis logic [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:12]. The runtime contract says it is consumed by workflow YAML/script paths and is not invoked directly as a user-facing workflow [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:14-17].
2. The mode registry supports the design because it has explicit public `workflowMode` entries and separate backend fields; no registry concept exists for `runtime` as a public workflow mode [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:5-8] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29-53]. The `runtime-loop` extension is constrained to `research`, `review`, and `council`, while improvement lanes carry explicit `null` runtime loop types [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:19-25] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:103-126].
3. Fresh-authoring one unified `graph-metadata.json` is the right direction. The current hub requires exactly one graph metadata file for the skill identity [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:64-67], while the runtime still advertises a separate `skill_id` and repeated reciprocal edges back to `deep-loop-workflows` [SOURCE: .opencode/skills/deep-loop-runtime/graph-metadata.json:3-18] [SOURCE: .opencode/skills/deep-loop-runtime/graph-metadata.json:33-48]. Child 002 already plans to fresh-author one graph file and drop runtime-workflows edges as intra-skill structure [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:101-103].
4. Keeping `/deep:*` commands and agent names stable is supported. The hub explicitly says commands and native agent types are complementary surfaces over the same packets [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:18-27] and reiterates that `Skill(deep-loop-workflows)`, `/deep:*`, and agent types must stay complementary instead of forking per-mode logic [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:91-96].
5. The child 002 target should demote `runtime/SKILL.md` to a non-routable README, as already planned. Runtime has frontmatter and an allowed-tools surface today [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:1-6]; leaving that under the unified root would keep a second discoverable skill marker and contradict the one-identity invariant.

## Ruled Out

- Flattening all mode packets and runtime libraries into one directory: ruled out because the hub requires per-mode contracts to remain unflattened [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:64-67].
- Keeping a routable runtime skill after the merge: ruled out because runtime is explicitly not a user-facing workflow [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:37-44].

## Dead Ends

- Code graph structural queries were not trusted for this iteration because the graph status is stale and excludes commands/agents/specs from its active scope; direct Read/Grep evidence was used instead.

## Edge Cases

- Ambiguous input: The phrase `folding deep-loop-runtime into deep-loop-workflows` could mean flattening everything under the hub; evidence supports nesting runtime as backend infrastructure instead.
- Contradictory evidence: None; child 002's plan aligns with current contracts.
- Missing dependencies: No spec-folder resource-map was present at init; not needed for this structural question.
- Partial success: None.

## Sources Consulted

- `.opencode/skills/deep-loop-workflows/SKILL.md:12`
- `.opencode/skills/deep-loop-workflows/SKILL.md:18-27`
- `.opencode/skills/deep-loop-workflows/SKILL.md:64-67`
- `.opencode/skills/deep-loop-workflows/SKILL.md:91-96`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:5-8`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:19-25`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:29-53`
- `.opencode/skills/deep-loop-runtime/SKILL.md:1-17`
- `.opencode/skills/deep-loop-runtime/SKILL.md:37-44`
- `.opencode/skills/deep-loop-runtime/README.md:23-44`
- `.opencode/skills/deep-loop-runtime/graph-metadata.json:3-18`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:101-103`

## Assessment

- New information ratio: 0.86
- Novelty justification: First evidence iteration for this lineage; it confirms the layout and sharpens the necessary demotion of runtime's skill identity.
- Questions addressed: structural layout and skill identity.
- Questions answered: Is the proposed `system-deep-loop/` layout with nested `runtime/` structurally coherent without creating duplicate skill identity or mode ambiguity?
- Confidence: High for the structural direction; medium for exact naming inside the unified tree until child 002 implementation chooses final file paths.

## Reflection

- What worked and why: Reading the hub contract, registry, and both graph files together exposed the current public/backend split and duplicate graph identity.
- What did not work and why: Code graph could not be load-bearing because its readiness was stale and its scope excluded commands/agents/specs.
- What I would do differently: Use direct residual grep in later iterations for path-coupling and reference migration instead of graph traversal.

## Recommended Next Focus

Validate bidirectional path-coupling repair rules, especially files omitted from child 002's Class A/Class B tables.
