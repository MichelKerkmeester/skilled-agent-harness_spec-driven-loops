# Deep Research Strategy

## Topic

Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`: structural layout, bidirectional path-coupling repair, the `system-spec-kit` tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether `fallback-router.ts` should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

## Key Questions

- [x] Q1. Is the target `system-deep-loop/` layout structurally sound, and should nested `runtime/` remain infrastructure rather than a mode?
- [x] Q2. Are both directions of path coupling fully captured, including the `system-spec-kit` borrow and tests that enforce it?
- [x] Q3. Is the external migration plan broad enough for commands, agents, READMEs, hooks, graph metadata, and the advisor corpus?
- [x] Q4. Should `fallback-router.ts` be wired for GLM-5.2 to MiMo-v2.5-Pro fallback, and what must be true before doing that safely?
- [x] Q5. Does detached fan-out lineage execution respect its own write boundary?

## Known Context

- `resource-map.md` was absent at init, so the coverage gate used direct source discovery and produced a local resource map at synthesis.
- The target spec explicitly scopes this phase to read-only investigation and names this lineage artifact directory as the only write target.
- The child 002/003/004 specs already contain a concrete execution design; this run validates and revises that design rather than starting from zero.

## Next Focus

Synthesis complete. Feed the ranked corrections into child 002 before any physical move: spec-writeback suppression for fan-out, artifact-root path repair, broadened reverse-coupling inventory, and fallback-router wiring preconditions.

## What Worked

- Comparing planned tables against actual `rg` inventories exposed missed executable seams quickly.
- Reading both workflow YAML and fanout prompt generation exposed a contract conflict that a normal code-path grep would miss.
- Checking model registry records against `fallback-router.ts` found the canonical-id and approved-substitution requirements before implementation.

## What Failed / Exhausted

- No parent `resource-map.md` existed for this phase; direct source inventory substituted for the coverage gate.
- A blind residual grep is too noisy because historical specs and worktrees intentionally retain old names; migration must be category-scoped.
- Wiring only the `retry_exhausted` branch is insufficient because the current classifier treats non-timeout CLI exits as fatal and may not expose quota/auth failures.

## Active Risks

- P0: detached fan-out prompts forbid writes outside the lineage directory, but the research YAML still has pre-init and post-synthesis `spec.md` mutation steps.
- P0: `artifact-root.cjs` and its tests need one more `..` after runtime is nested; this was not in the four-site tooling-borrow table.
- P1: advisor migration has duplicated hardcoded identity in Python and TypeScript plus corpus/divergence-ledger baselines.
- P1: GLM to MiMo fallback needs model-id normalization from provider slug to canonical profile id before dispatch.

## Non-Goals

- Do not execute the physical merge.
- Do not edit `spec.md` or any path outside this lineage directory.
- Do not wire `fallback-router.ts`; report the wiring requirements only.

## Stop Conditions

- Stop after at least three evidence iterations when all five key questions have evidence-backed answers and the final pass mainly consolidates.
- Stop at `config.maxIterations` if convergence does not occur earlier.
