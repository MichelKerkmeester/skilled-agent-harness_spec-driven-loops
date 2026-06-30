# Deep Research Strategy - gpt55fast lineage

## 1. Research Topic

Determine how to restructure the existing `sk-design-interface` skill into a parent skill named `sk-design` with multiple focused design sub-skills, grounded in the external design-skills corpus.

## 2. Key Questions (remaining)

- [x] What 4 to 7 child taxonomy best covers the corpus without over-fragmenting it?
- [x] Which corpus sources feed each child?
- [x] Should the parent be a single hub with nested mode packets or an umbrella router over sibling skills?
- [x] Where do shared design principles and runtime/tooling contracts belong?
- [x] How should `sk-design-interface` migrate?
- [x] How should `sk-design-md-generator` migrate?

## 3. Non-Goals

- Do not scaffold, edit, or migrate production skills in this lineage.
- Do not write outside the lineage artifact directory.
- Do not bind the final architecture decision; this research produces a recommendation.

## 4. Stop Conditions

- Stop when the taxonomy, structural model, and compatibility mapping are evidence-backed.
- Stop if additional iterations only add source examples without changing decisions.
- Stop at `config.maxIterations` if convergence does not happen first.

## 5. Answered Questions

- Taxonomy recommendation: six children under an umbrella `sk-design` router.
- Structural recommendation: parent router over sibling child skills, with shared core references, not a single monolithic hub.
- Compatibility recommendation: preserve aliases for `sk-design-interface` and `sk-design-md-generator` during migration.

## 6. What Worked

- Comparing root/router docs against narrow skills exposed the right parent-child boundary.
- Reading current `sk-design-interface` and `sk-design-md-generator` showed a strong existing split between invention and measured extraction.
- Mapping `designer-skills-main` plugins to candidate children prevented overfitting to the 41 standalone docs.

## 7. What Failed

- One-child-per-standalone-doc produced too many overlapping children and ignored routing guidance from `ui-skills-root`.
- A single nested hub model overloaded unrelated tool contracts and would make onboarding harder.

## 8. Exhausted Approaches

- Flat 41-child taxonomy: rejected because routing sources prefer the smallest useful context and max 1 to 3 loaded skills.
- Single monolithic hub: rejected because extraction, craft, critique, and delivery have distinct verification and tool needs.

## 9. Ruled-Out Directions

- Treat `sk-design-md-generator` as a mode packet under visual craft: rejected because it has a separate Playwright extraction pipeline and fidelity validation contract.
- Treat motion as only polish: rejected because motion and state are core interaction behavior in both standalone and designer-skills sources.

## 10. Next Focus

Converged. Hand off to the architecture-decision phase with the six-child taxonomy and umbrella-router recommendation.

## 11. Known Context

- `resource-map.md` was not present at init; skipping coverage gate.
- External corpus includes 41 standalone design-skill docs plus `designer-skills-main` and `apple-bento-grid-main`.
- Existing internal skills are `sk-design-interface` and `sk-design-md-generator`; both already define complementary boundaries.

## 12. Research Boundaries

- Max iterations: 20.
- Convergence threshold: 0.05.
- Executor: `cli-opencode model=openai/gpt-5.5-fast` as lineage metadata.
- Artifact directory bound directly to `config.fanout_lineage_artifact_dir`.
