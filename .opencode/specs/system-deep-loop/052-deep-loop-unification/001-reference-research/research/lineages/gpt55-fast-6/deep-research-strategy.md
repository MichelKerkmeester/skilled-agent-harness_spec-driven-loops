# Deep Research Strategy

## Research Topic

Validate and stress-test the merge design for folding deep-loop-runtime into deep-loop-workflows as system-deep-loop: structural layout, bidirectional path-coupling repair, the system-spec-kit tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether fallback-router.ts should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

## Known Context

- Target spec folder: `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research`.
- Artifact dir is explicitly bound by `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not run.
- `resource-map.md not present; skipping coverage gate`.
- This lineage is read-only with respect to source code and spec docs; writes are restricted to this lineage artifact dir.
- Parent phase says the merge should rename `deep-loop-workflows` to `system-deep-loop`, nest `deep-loop-runtime` as `runtime/`, preserve `/deep:*` commands and agent names, repair both relative-path directions, migrate advisor/doctor/agent/docs references, and leave fallback-router wiring optional.

## Key Questions

- [x] Is the proposed `system-deep-loop/runtime/` structural layout correct, or does it create mode/skill identity ambiguity?
- [x] Are the Class A and Class B path-repair rules complete and directionally correct for live source files and tests?
- [x] Is the `system-spec-kit` tooling-borrow repair correctly scoped to phase 002, and are there hidden borrow paths beyond the four planned files?
- [x] Is the external reference migration plan complete across commands, agents, READMEs, hooks, advisor corpus, skill graph, generated contracts, and examples?
- [x] Should `fallback-router.ts` be wired now for GLM-5.2 to MiMo-v2.5-Pro fallback, or remain optional/deferred?

## Answered Questions

- `system-deep-loop/runtime/` is structurally coherent if `runtime/` remains infrastructure, not a mode packet; fresh-authored unified graph metadata should replace the current two-skill graph identity.
- The Class A and Class B path-direction rules are correct, but phase 002 should add `deep-ai-council/scripts/replay-graph-from-artifacts.cjs`, explicit deep-review shims, and a classified runtime unit-test inventory.
- The four listed system-spec-kit borrow edits are necessary but incomplete for phase 002 gates; add `runtime/lib/deep-loop/artifact-root.cjs`, `runtime/tests/unit/artifact-root.vitest.ts`, and `system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts`.
- The external reference migration plan is directionally complete across the major live surfaces; keep its staged category model, synchronize advisor projection/codegen/drift guards, regenerate compiled command contracts, and explicitly dedupe duplicate graph edges such as `cli-opencode`.
- `fallback-router.ts` should remain optional/deferred for the core merge; if implemented, amend child 004 to wire model substitution in `fanout-run.cjs` or through an explicit pool hook, add a fallback registry/config surface, emit attribution events, and test GLM-to-MiMo re-dispatch.

## What Worked

- Initial packet read established the scoped design, phase sequence, and no-code-change requirement for this lineage.
- Hub, registry, and graph metadata reads confirmed the merge removes an existing duplicate identity while preserving stable `/deep:*` and agent surfaces.
- Paired before/after path reasoning on live imports confirmed the proposed hop-count asymmetry and found one unlisted internal executable path.
- Validation-gate tracing found hidden depth-sensitive files by following `test:council` and the artifact-root re-export, not just the plan's file table.
- Current-file verification prevented stale-gaps from being carried forward; the 003 plan already includes `sk-prompt`, pre-commit/GitHub Actions mirror paths, and advisor codegen staging.
- Separating `fanout-pool.cjs` from `fanout-run.cjs` clarified that generic retry mechanics and model-aware dispatch are different layers.

## What Failed

- No hidden structural blocker found; exact graph metadata content still needs review after the physical move.
- Raw grep is too noisy for migration ownership because it mixes live imports, fixture expectations, generated command-contract inputs, and historical prose.
- The phrase `tooling-borrow` under-described the artifact-root shared resolver seam; this is a runtime dependency seam, not only compiler/test wiring.
- External reference inventory alone does not prove plan gaps; generated outputs, live source assets, routing fixtures, and historical docs need category-specific decisions.
- Child 004's single-file pool edit is under-specified because it omits fan-out config parsing and the runner's model-aware command construction context.

## Exhausted Approaches

- All planned research focuses are exhausted: structural identity, path coupling, system-spec-kit seams, external reference migration, fallback-router scope, and convergence readiness.

## Ruled-Out Directions

- Implementing merge/fallback changes during this research lineage is out of scope.
- Treating `runtime/` as a workflow mode is ruled out because `mode-registry.json` only models public workflow modes and backend kinds.
- Blind replacement across all `deep-loop-workflows` or `deep-loop-runtime` hits is ruled out; executable paths, generated contracts, advisor labels, and history need separate handling.
- Decoupling runtime from system-spec-kit TypeScript tooling is ruled out for this merge; repair path depth now and leave full decoupling as hardening.
- Hand-editing compiled command contracts is ruled out; update source command assets/router files and rerun contract compilation.
- Treating fallback-router wiring as required for rename/unification closeout is ruled out; it is useful optional feature work.
- Wiring model substitution directly into the generic pool without an explicit hook is ruled out; the runner owns model/kind/session/artifact context.

## Non-Goals

- Do not modify source code, command assets, agents, specs outside this lineage, or routing corpus files.
- Do not rename `/deep:*` commands or agent names as part of the recommendation unless evidence shows a blocking contradiction.

## Stop Conditions

- Stop after legal convergence once all key questions have evidence-backed answers and at least three iterations have run, or at `maxIterations=10`.

## Next Focus

Complete: `research.md` and `resource-map.md` written after all-questions-answered convergence.
