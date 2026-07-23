DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 5 Prompt Pack

Read `.opencode/agents/deep-research.md` first. Execute exactly one final LEAF iteration. The spec folder is pre-approved; only the three detached-lineage outputs below may be written.

## STATE

Iteration 5 of 5 | Reducer questions answered 4/5 | Ratios 1.00, 0.94, 1.00, 0.86 | Stuck 0
Hard stop after this iteration: `maxIterationsReached` under `stopPolicy=max-iterations`.

The remaining reducer question is exact-text reconciliation, not an unresearched area:
`Which imports, path literals, scripts, tests, documentation, configuration, and generated references must change, and in what safe sequence?`

Iterations 1 and 4 claim this is answered through a 46-file/140-reference closure, computed-path additions, mutable-vs-frozen classification, exact ordering, and command/rollback gates. Verify or correct that claim using an adversarial consistency pass.

## FOCUS

Challenge all prior conclusions for contradictions, omitted consumers, and unsafe assumptions:
- Recheck every rename target against direct imports, dynamic `import.meta.url`/`path.resolve`/`path.join` consumers, environment-selected adapter paths, generated outputs, operator commands, and external active consumers.
- Challenge the one-harness-writer `manifest.json` v2 design, including nullable slug, ID mapping, lifecycle transitions, semantic hash normalization, provenance fallback, and whether DB pointer manifests remain distinct without violating “single source of truth.”
- Test Checkpoint A and B rollback symmetry backward: identify states where old readers, stale caches, v1/v2 writers, or DB generation pointers could make rollback lossy.
- Verify exact package/test command evidence and flag every inferred command or missing executable fixture.
- Verify frozen-history classification does not hide an active consumer.
- Reconcile the remaining exact key question in `answeredQuestions` only if evidence supports it.

Report corrections and residual unknowns honestly. Do not synthesize `research.md`; the workflow does that after this iteration.

## STATE FILES

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json
- State: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md
- Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/findings-registry.json
- Prior narratives: lineage `iterations/iteration-001.md` through `iteration-004.md`
- Write narrative: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/iterations/iteration-005.md
- Write delta: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0093-sk-design-012-gap-research/.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deltas/iter-005.jsonl

## CONTRACT

- Perform 3-5 focused evidence actions, max 12 calls. Target source files remain read-only; run no mutating implementation.
- Write only narrative, one canonical iteration-5 state append, and delta.
- Required headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Ruled Out, Dead Ends, Sources Consulted, Assessment, Reflection, Recommended Next Focus.
- Cite every finding. Distinguish confirmed corrections, confirmed prior findings, and residual unknowns.
- Canonical record includes route proof, `iteration=5`, `run=5`, status, focus, findingsCount, honest newInfoRatio/justification, exact keyQuestions/answeredQuestions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs.
- If the reference-plan question is supported, include its exact text in `answeredQuestions` so reducer state closes correctly.
- Delta first line matches the canonical record. Verify exactly one append, all artifacts, citations, route proof, and lineage boundary.
- Recommended next focus should be implementation planning/proof prerequisites, not another research iteration.
