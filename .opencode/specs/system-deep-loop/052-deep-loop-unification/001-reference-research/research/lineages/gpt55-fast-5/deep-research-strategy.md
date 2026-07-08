# Deep Research Strategy: gpt55-fast-5

## Research Topic

Validate the planned merge of `deep-loop-workflows` and `deep-loop-runtime` into `system-deep-loop`, with emphasis on structural layout, bidirectional path repair, system-spec-kit tooling-borrow, external reference migration, and GLM-to-MiMo fallback assumptions.

## Known Context

- The reference phase is read-only investigation; it may create research artifacts but must not execute the merge. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:68]
- Child 002 owns the irreversible move and runtime nesting after this research phase. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:14]
- Child 003 owns dependency-ordered external reference migration after child 002 lands. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:150]
- Child 004 tracks fallback-router wiring as optional and blocked on operator scope decision. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:51]
- `resource-map.md` was not present at init; this lineage emits its own coverage map after synthesis.

## Key Questions

- Does the structural merge plan cover both path-coupling directions and the system-spec-kit tooling-borrow?
- Is the external reference migration plan broad enough for generated routing projections, tests, command contracts, agents, docs, and examples?
- Is GLM-5.2 to MiMo-v2.5-Pro automatic fallback already live, and should it block the merge?
- What validation gates should be treated as non-negotiable before child 002/003 completion claims?

## Answered Questions

- The structural plan covers Class A forward coupling, Class B reverse coupling, tooling-borrow, graph-metadata consolidation, and live validation gates.
- The reference migration plan correctly treats advisor projections, command contracts, generated outputs, ledgers, system-spec-kit consumers, and sk-doc examples as migration-critical.
- Automatic GLM-to-MiMo fallback is not live: the fallback router exists, fanout-pool does not call it on retry exhaustion, and the model registry has null fallback targets for both models.
- The fallback wiring phase should remain optional unless the operator explicitly changes scope.

## What Worked

- Dependency-ordered reading of phase specs before code/data hotspots avoided a false assumption that command YAML was the whole migration surface.
- Direct `verify-iteration.cjs --artifact-dir` validation is compatible with the lineage-only write boundary.
- Grep-scoped evidence across advisor, command, system-spec-kit, sk-doc, workflow, and runtime folders exposed the broad reference blast radius.

## What Failed

- `reduce-state.cjs` was not used because it resolves canonical research roots rather than the requested detached lineage root.
- No live fallback dispatch was exercised; the relevant finding is static evidence only.

## Exhausted Approaches

- Using canonical reducers for this detached lineage: rejected because the user constrained writes to `artifact_dir` and asked not to run `resolveArtifactRoot`.
- Treating stale `deep-loop-workflows` and `deep-loop-runtime` references under specs as migration targets: rejected because child 003 marks `.opencode/specs/**` historical and untouched.

## Ruled-Out Directions

- Treat GLM-to-MiMo fallback as already active during fan-out. Evidence shows null registry fallback targets and no `resolveFallback` call in `fanout-pool.cjs`.
- Block the structural rename on fallback wiring. The fallback phase is optional and blocked on an operator scope decision.

## Next Focus

Stop. All key questions have source-backed answers and the fourth iteration passed the convergence, coverage, quality, and graph gates.
