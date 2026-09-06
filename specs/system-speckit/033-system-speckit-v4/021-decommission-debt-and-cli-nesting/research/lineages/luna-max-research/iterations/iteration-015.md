# Iteration 15: Trigger-index versus ripgrep corpus parity

## Focus

Compare the generator's source-level corpus walker with the documented free-text
ripgrep successor recipes. This pass intentionally excludes the committed
trigger-index artifact itself and focuses on the boundary rules that can make the
two replacement lanes disagree.

## Findings

1. **LUNA-053 — The trigger-index and ripgrep successors use different exclusion boundaries, so “retrieval” is not one reproducible corpus. P1. CONFIRMED parity drift; query-result impact is CONFIRMED for matching files and INFERRED for operator decisions.** `corpus.mjs` declares and enforces exclusions for `scratch`, `research/lineages`, `tests/fixtures`, fixture-like directories outside `specs`, `node_modules`, `z_archive`, and `.git`. The documented structured, context, and path-only ripgrep recipes pass `specs .opencode` with only `z_archive`, `node_modules`, and `.git` negative globs. Therefore the free-text lane can return lines from scratch/lineage/test-fixture Markdown that the trigger index deliberately omits, while the index lane can appear clean for a phrase polluted by those artifacts. The confirmed mismatch is at the recipe/code boundary; the inference is that callers comparing the lanes or using broad free-text retrieval can act on different candidate sets. Smallest fix: centralize the exclusion policy in a shared wrapper/constant and make both lanes emit and consume the same corpus manifest, then add a parity fixture containing one excluded and one included document. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:19-31,50-70,97-112,126-145,193-205] [SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:104-107,114-128,140-147,152-159,221-230]

## Ruled Out

- The omission of root-level README/AGENTS/install/mirror documents from the trigger-index corpus remains the separate LUNA-030 finding. This iteration is limited to disagreement between the two successor lanes over directories that both otherwise claim to search. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:19-31] [SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:140-147]
- Symlink handling inside the generator is explicit: broken links are reported as skipped and symlinked directories are not walked; this was not treated as a new dangling-link defect. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:169-188]
- The generator's own fail-closed malformed-frontmatter publication behavior is aligned with its comments and was not reclassified as a gate failure. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:13-17,301-345]

## Dead Ends

- No additional lookup normalization or path-scope defect was promoted from the bounded loader/lookup source; shape validation and folder-prefix matching are explicit. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:72-105,127-204]

## Edge Cases

- Free-text retrieval may intentionally include working artifacts for debugging, while the index avoids them for author-controlled routing. If so, the docs need to name the lanes as different scopes rather than calling them interchangeable successors.
- A fixture phrase can also exist in a real packet. The needed parity test must prove path exclusion, not merely phrase absence.

## Questions Remaining

- Q6 gains a confirmed successor corpus-boundary mismatch and needs a policy decision: shared exclusion or explicitly different lanes.
- Q7 gains a deterministic reproducibility risk at the retrieval interface, but no index artifact was read.
- Q1-Q5 remain open for live paths, registrations, dependencies, tests, and broader documentation.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:19-31,50-70,97-112,126-145,169-205]
- [SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:104-107,114-128,140-159,221-230]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:13-17,301-345]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:72-105,127-204]

## Assessment

- New information ratio: 0.81
- Questions addressed: Q6, Q7
- Questions answered: Q6 = partial (corpus policy diverges); Q7 = expanded (reproducibility risk confirmed at lane boundary)
- Confidence: high for the code/recipe exclusion mismatch; medium for operational impact because no retrieval command was run

## Reflection

- What worked and why: comparing source walker constants to the literal recipes exposed a cross-lane inconsistency that a generator-only review cannot see.
- What did not work and why: the committed index and live ripgrep result set were intentionally not read/executed under the stated budget, so the report does not quantify the current number of polluted hits.
- What I would do differently: next inspect the continuity writer's post-save and metadata contracts for freshness signals that could bridge or fail to bridge this corpus mismatch.

## Recommended Next Focus

Angle 6/7: audit continuity save metadata, resource-map/freshness handoff, and route/validation guards for claims that can pass without current successor evidence.

