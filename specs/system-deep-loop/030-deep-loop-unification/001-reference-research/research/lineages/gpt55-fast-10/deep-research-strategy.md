# Deep Research Strategy - gpt55-fast-10

## Research Topic

Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`: structural layout, bidirectional path-coupling repair, the `system-spec-kit` tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether `fallback-router.ts` should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

## Known Context

- Artifact root was bound directly to `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-10` by operator instruction.
- `resource-map.md` was not present at the spec folder root during init; coverage-gate exclusion input was unavailable.
- Parent packet establishes read-only research scope and excludes merge implementation [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:69].
- Earlier lineage log captured useful context but no canonical config/state/strategy or iteration artifacts; this packet initializes fresh canonical state.

## Key Questions

- [x] Is the structural layout sound?
- [x] Are bidirectional path-coupling rules correct?
- [x] Is the `system-spec-kit` tooling-borrow accounted for?
- [x] Are all external references and advisor surfaces covered?
- [x] Should `fallback-router.ts` be wired for GLM-5.2 to MiMo-v2.5-Pro fallback?

## Answered Questions

- Structural layout is sound if `runtime/` remains infrastructure, not a seventh workflow mode.
- Bidirectional path repair is asymmetric: forward references keep hop count and delete the old segment; reverse references move one hop nearer and rename to `runtime`.
- The tooling-borrow is load-bearing and correctly belongs in 002, not 003.
- External reference migration is broader than docs: commands, doctor routes, agent mirrors, graph metadata, advisor codegen, lexical boosts, corpus, and divergence fixtures are all in scope.
- GLM-to-MiMo fallback is a valid optional hardening feature, but should not be silently bundled into 002/003.

## What Worked

- Phase 002/003 plans already contain the critical structural and migration staging.
- Reading live code confirmed `fanout-pool.cjs` retry behavior and `fallback-router.ts` semantics.
- Advisor-specific reads surfaced generated and hand-authored surfaces that need separate handling.

## What Failed

- Treating all old-path references as equivalent is unsafe; some are executable, some are historical spec evidence, and some are generated outputs.
- Treating fallback-router wiring as a rename side effect would blur optional feature scope with mandatory merge scope.

## Exhausted Approaches

- Naive global `deep-loop-workflows|deep-loop-runtime` replacement.
- Adding `runtime/` to `mode-registry.json` as a workflow mode.
- Automatic GLM-to-MiMo substitution without explicit configured `fallback_target` and approved-model guard.

## Ruled-Out Directions

| Approach | Reason | Evidence |
|----------|--------|----------|
| Naive global replacement | Forward and reverse couplings have different depth rules. | `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:173` |
| Runtime as workflowMode | The target spec classifies runtime as infrastructure. | `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169` |
| Silent GLM-to-MiMo feature inclusion | Optional feature work needs operator decision. | `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:115` |

## Active Risks

- Advisor migration is brittle because both generated projection/hash and hand-authored scorer constants need updates.
- Command-contract compiled outputs must be regenerated, not hand edited.
- Historical specs and manual testing logs contain intentional old-name references; residual grep needs an explicit allowlist.

## Next Focus

Synthesis complete. Recommended next action: execute 002 and 003 as staged, then decide separately whether 004 fallback-router wiring is in scope.

## Non-Goals

- Do not implement the merge in this lineage.
- Do not write outside the lineage artifact directory.
- Do not update parent spec generated fences or memory continuity from this detached lineage.

## Stop Conditions

- Stop after legal convergence once all five key questions have evidence-backed answers.
- Stop at `config.maxIterations` if convergence does not arrive earlier.
