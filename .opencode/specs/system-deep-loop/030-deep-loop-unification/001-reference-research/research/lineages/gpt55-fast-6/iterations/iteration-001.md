# Iteration 1: Structural Layout And Identity Model

## Focus

Validate whether the proposed target layout, `system-deep-loop/` with nested `runtime/`, preserves the current hub/mode/runtime architecture without creating a new routable mode or duplicate skill identity.

## Findings

1. **The merge is structurally coherent because the current public hub already claims one active deep-loop workflow identity over a consumed backend.** The hub says `deep-loop-workflows` is the public advisor-routable home, while `deep-loop-runtime` is a frozen MCP-free backend consumed by the hub. It also says the hub holds no per-mode logic and routes through `mode-registry.json`. [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:12] [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:37]
2. **`runtime/` should not become a mode packet.** The live registry only defines public workflow modes and backend kinds; `runtimeLoopType` is a graph-backed convergence key for `research|review|council`, while improvement lanes are explicitly non-runtime-loop modes. There is no registry category for a backend-infrastructure mode, and the hub rules prohibit adding packet-level graph metadata. [SOURCE: file:.opencode/skills/deep-loop-workflows/mode-registry.json:5] [SOURCE: file:.opencode/skills/deep-loop-workflows/mode-registry.json:19] [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:95]
3. **The plan's one-graph-metadata target matches the existing hub invariant and fixes the current duplicate-identity graph.** The hub already says exactly one `graph-metadata.json` should identify the whole workflow skill, but runtime currently has its own `skill_id` and reciprocal edges back to `deep-loop-workflows`. [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:66] [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:3] [SOURCE: file:.opencode/skills/deep-loop-runtime/graph-metadata.json:4] [SOURCE: file:.opencode/skills/deep-loop-runtime/graph-metadata.json:16]
4. **Preserving `/deep:*` commands and agent names is supported by the current design.** The hub explicitly treats `Skill(deep-loop-workflows)`, `/deep:*` commands, and agent types as complementary surfaces over the same packets, so a skill identity rename does not require command or agent renames. [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:96] [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:136]
5. **The target should fresh-author `system-deep-loop/graph-metadata.json` rather than merge both graph files.** Runtime graph metadata contains duplicate sibling/enhancement edges to the hub, while the parent spec calls for dropping old inter-skill edges as intra-skill structure. This supports the child 002 plan's fresh-author approach. [SOURCE: file:.opencode/skills/deep-loop-runtime/graph-metadata.json:16] [SOURCE: file:.opencode/skills/deep-loop-runtime/graph-metadata.json:33] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:101]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md`
- `.opencode/skills/deep-loop-workflows/SKILL.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/deep-loop-runtime/SKILL.md`
- `.opencode/skills/deep-loop-runtime/graph-metadata.json`

## Assessment

- `newInfoRatio`: 0.90
- Novelty justification: First evidence pass; most findings are new to this lineage and answer the structural identity question.
- Confidence: High for the layout recommendation; medium for exact graph metadata content because the fresh-authored file must still be reviewed after the physical move.

## Reflection

- Worked: Starting from hub and graph metadata exposed that the proposed merge removes an existing graph-level contradiction rather than inventing a new architecture.
- Failed: No hidden structural blocker found in this pass.
- Ruled out: Treating `runtime/` as a mode packet; evidence shows it is backend infrastructure, not an advisor-routable workflow.

## Recommended Next Focus

Validate the bidirectional path-coupling repair rules against live source files: runtime-to-workflows Class A and workflows-to-runtime Class B.
