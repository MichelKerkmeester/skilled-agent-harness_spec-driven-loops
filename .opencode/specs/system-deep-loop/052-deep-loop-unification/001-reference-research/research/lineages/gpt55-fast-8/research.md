# Research Synthesis - gpt55-fast-8

## Verdict

Confirm the overall unification design. Proceed with child 002 and child 003 as staged, but keep `fallback-router.ts` wiring as child 004/operator-gated unless the operator explicitly expands scope. The strongest correction is procedural: detached lineage work must not run resolver-driven reducer paths unless those paths accept an explicit lineage artifact directory.

## Ranked Findings

### 1. Child 002's structural plan is correct, with runtime as infrastructure

The target `system-deep-loop/` layout should nest former `deep-loop-runtime` as `runtime/`, with no `graph-metadata.json` and no workflow-mode registry entry. Child 002 states this directly, and live `mode-registry.json` confirms the active modes are research, review, ai-council, and improvement lanes, not runtime. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:154] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169] [SOURCE: file:.opencode/skills/deep-loop-workflows/mode-registry.json:29]

### 2. Path repair has two classes and the plan's class split is valid

Forward coupling (`runtime` to workflows content) and reverse coupling (workflow packets to runtime) require different edits. Live examples confirm both sides: runtime command rendering imports workflows shared rollout code, while deep-research reducer imports runtime artifact-root/continuity helpers. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:8] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:68] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:78]

### 3. system-spec-kit tooling-borrow repair is mandatory, but decoupling is out of scope

The runtime still re-exports artifact-topology logic from `system-spec-kit`, and runtime typecheck plus system-spec-kit vitest include paths depend on the old sibling layout. Repairing those paths in child 002 is necessary. Full decoupling should remain a later hardening task. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16] [SOURCE: file:.opencode/skills/deep-loop-runtime/package.json:10] [SOURCE: file:.opencode/skills/deep-loop-runtime/tsconfig.json:12] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:90]

### 4. Child 003's staged external-reference migration is required

Advisor code hardcodes the old skill path and merged skill id in both Python and TypeScript. The drift guard embeds the old registry path and projection hash input. Command-contract generation also references old skill paths and must be regenerated. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2579] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:13]

### 5. The detached fanout artifact-root override is real and easy to violate

`fanout-run.cjs` explicitly tells detached lineage executors to bind `artifact_dir` directly from `config.fanout_lineage_artifact_dir` and not run the resolver. The stock research reducer currently derives `researchDir` through `resolveArtifactRoot(specFolder, 'research')`, so using it as-is for lineage output can target the parent research folder. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1010] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1015] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:2510] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:2516]

### 6. Fallback-router wiring is useful but should stay optional/operator-gated

`fanout-pool.cjs` retries the same item and marks retry exhaustion terminal; it does not call `resolveFallback()`. The router itself is a viable building block because it validates graph safety and rejects same-pool or unapproved targets. However, the current model profiles do not define GLM's fallback target, and CLI docs say model substitution must not happen silently. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:400] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:411] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/model_profiles.json:268] [SOURCE: file:.opencode/skills/cli-opencode/references/cli_reference.md:231]

## Recommendations

1. Execute child 002 before child 003, with no attempt to mix external reference edits into the structural move before the target path exists.
2. Keep the child 002 Stage 3b tooling-borrow repairs in scope and do not defer them to child 003.
3. Add an explicit check in child 002 verification that a short deep-research or deep-review run exercises a workflow-to-runtime reverse import after the move.
4. In child 003, keep the field-scoped advisor corpus replacement and routing accuracy rebaseline; do not do a blind string replacement.
5. For child 004, implement fallback only if the operator opts in. If implemented, use `fallback-router.ts` unchanged, provide a registry edge such as GLM to MiMo, pass an approved model set, and log the replacement lineage distinctly.
6. For detached lineage reducers, either avoid stock resolver-driven reducers or add a first-class `--artifact-dir`/override path before relying on them in fanout lineages.

## Negative Knowledge

- Do not add `runtime` to `mode-registry.json` as a mode.
- Do not decouple runtime TypeScript tooling from system-spec-kit during the merge.
- Do not hand-edit compiled command contracts.
- Do not silently substitute MiMo for GLM failures.
- Do not run `resolveArtifactRoot` for this detached lineage.

## Residual Risks

- This lineage did not recompute the full residual reference inventory; child 003 Stage A remains required.
- This lineage did not run runtime vitest or system-spec-kit council tests; child 002 owns those verification gates.
- Code graph readiness is stale, so graph-derived relationship answers were intentionally not used as proof.

## References

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
- `.opencode/skills/cli-opencode/references/cli_reference.md`
