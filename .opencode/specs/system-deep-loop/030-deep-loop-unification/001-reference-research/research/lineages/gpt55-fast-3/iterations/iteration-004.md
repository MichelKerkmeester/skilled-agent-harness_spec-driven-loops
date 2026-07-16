# Iteration 4: Synthesis-Readiness Convergence Pass

## Focus
Run a final contradiction check across the parent packet, child 001-005 specs/plans, and deep-research stop contract to decide whether this lineage can legally synthesize.

## Findings

1. Parent scope confirms the structural/identity framing and supports deferring fallback behavior. The parent explicitly includes physical merge, bidirectional path repair, external reference migration, and version/graph consolidation [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:73] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:77], while out-of-scope items include changing loop/fanout behavior and fully wiring `fallback-router.ts` [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:80] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:83]. This confirms iteration 3's recommendation: child 004 can remain optional unless the operator expands scope.

2. Child 002 is directionally sound but should be amended with the render-command-contract root-depth correction before implementation starts. Its plan already separates forward same-hop path deletion from reverse one-hop-shorter runtime references [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:68] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:78]. It also includes `render-command-contract.cjs`'s shared-rollout require and `compile-command-contracts.cjs`'s `WORKSPACE_ROOT` anchor [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:72] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:73]. Iteration 1 found that `render-command-contract.cjs` has its own `WORKSPACE_ROOT` constant at line 13, so Stage 3a should add that to the concrete site table before execution [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:13].

3. Child 003 is directionally sound but its residual-grep rule needs one allowlist refinement. The plan rejects blind one-shot replacement and stages code constants, codegen, generated contracts, agents, graph metadata, and advisor corpus in a safe order [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:66] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:75] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:89] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:101]. But it currently says anything executable, structured-data, or advisor-facing must update, with only `.opencode/specs/**` historical references safe to leave [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:67]. Iteration 2 found active `system-spec-kit` eval fixtures that intentionally contain historical old-name queries/decoys, so Stage J should include a reviewed allowlist for semantically historical active eval data [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:795] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:960].

4. Child 005's closeout dependency model is consistent with the research result. Its readiness gate requires 002 and 003, and 004 only if in scope [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/005-validation-and-closeout/plan.md:51] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/005-validation-and-closeout/plan.md:52]. That matches this lineage's recommendation to run 001 -> 002 -> 003 -> 005, with 004 optional/deferred.

5. Deep-research legal stop is satisfied. The stop contract says hard stops include all key questions answered [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md:49] and the live algorithm nominates STOP once all key questions have evidence-backed answers [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md:91] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md:92]. This lineage has completed 4 iterations, exceeding the minimum floor of 3 recorded in config, and all 5 key questions are answered in strategy and registry.

## Sources Consulted
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/{spec.md,plan.md,tasks.md}`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/005-validation-and-closeout/plan.md`
- `.opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md`
- Prior iteration artifacts in this lineage.

## Assessment
- newInfoRatio: 0.03
- Novelty justification: No new contradictions; only synthesis-level restatement of two concrete child-plan amendments already discovered in iterations 1 and 2.
- Confidence: High that this lineage can synthesize with `stopReason: converged`.

## Reflection
- What worked: Cross-checking parent scope against child 004 removed ambiguity about fallback behavior being optional.
- What failed: No additional gaps surfaced in the convergence pass.
- Ruled out: Continuing to a fifth iteration; all key questions are answered, minimum floor is met, and the last pass produced no new contradictions.

## Recommended Next Focus
Synthesize final `research.md`, emit artifact `resource-map.md`, mark config complete, and append `synthesis_complete`.
