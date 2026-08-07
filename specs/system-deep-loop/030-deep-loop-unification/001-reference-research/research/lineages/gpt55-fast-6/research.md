# Deep Research Synthesis: gpt55-fast-6

## Verdict

The `system-deep-loop` merge design is sound with three required refinements and one optional feature decision:

- Keep `runtime/` as nested infrastructure, not a workflow mode.
- Expand phase 002's path-repair inventory to include hidden executable/test seams found by this lineage.
- Keep phase 003's category-driven external migration plan, with explicit graph-edge dedupe and generated-contract discipline.
- Defer fallback-router wiring from the core merge unless the operator explicitly chooses optional feature scope; if implemented, amend child 004 before coding.

Stop reason: `all_questions_answered_converged`. Six iterations ran, all five key questions were answered, and the final convergence validation had `newInfoRatio=0.02`.

## Key Answers

### Structural Layout

`system-deep-loop/runtime/` is coherent if `runtime/` remains backend infrastructure. The current hub already models one public workflow identity over a consumed runtime backend, and the mode registry models public workflow modes, not infrastructure packets. Fresh-authoring one unified `system-deep-loop/graph-metadata.json` is safer than merging the existing hub and runtime graph files because the old runtime graph contains now-internal sibling/enhancement edges. [SOURCE: file:.opencode/skills/deep-loop-workflows/SKILL.md:12] [SOURCE: file:.opencode/skills/deep-loop-workflows/mode-registry.json:5] [SOURCE: file:.opencode/skills/deep-loop-runtime/graph-metadata.json:16]

### Phase 002 Path Repair

The Class A and Class B path-direction rules are correct. Runtime-to-workflows paths should delete the old sibling segment while preserving hop count where appropriate, and workflow-to-runtime paths should lose one hop and target `runtime/`. Phase 002 should explicitly add `deep-ai-council/scripts/replay-graph-from-artifacts.cjs`, deep-review shims, and a classified runtime unit-test inventory. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:8] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:21]

### System-Spec-Kit Seams

The four planned system-spec-kit borrow edits are necessary but incomplete. Add `runtime/lib/deep-loop/artifact-root.cjs`, `runtime/tests/unit/artifact-root.vitest.ts`, and `system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts` to phase 002 because they affect the planned validation gates. Do not decouple runtime from system-spec-kit TypeScript tooling during this merge; path-depth repair is enough for the current scope. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16] [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts:10] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:27]

### External Reference Migration

The child 003 plan is directionally complete because it stages hardcoded constants, structured identity fields, codegen, command assets, docs/prose, graph metadata, examples, advisor corpus, and verification separately. Keep that category model. Add one explicit refinement: collapse literal duplicate graph edges such as the duplicated `deep-loop-workflows` entries in `cli-opencode` while preserving distinct contextual edges in `system-skill-advisor`. Compiled command contracts must be regenerated from source command assets, not hand-edited. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:75] [SOURCE: file:.opencode/skills/cli-opencode/graph-metadata.json:31] [SOURCE: file:.opencode/commands/deep/assets/compiled/deep_research.contract.md:6]

### Fallback-Router Scope

`fallback-router.ts` is real and tested, but GLM-5.2 to MiMo-v2.5-Pro wiring is optional feature work, not a merge prerequisite. The current child 004 plan should be amended before implementation: model-aware substitution belongs in `fanout-run.cjs` or an explicit `runCappedPool` hook, not as an unqualified direct edit in the generic pool primitive. A real implementation also needs a parsed fallback registry/config surface, attribution events, and a forced-failure fanout integration test. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1599] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:90]

## Required Follow-Ups

1. Amend phase 002 with the additional internal executable/test paths found here.
2. Amend phase 003 to explicitly dedupe graph edges and preserve generated-contract regeneration discipline.
3. Leave phase 004 optional. If chosen, amend it to target the runner/hook boundary plus config/schema/testing before implementation.
4. Run phase 005 closeout only after 002 and 003 land and their verification gates pass.

## Ruled Out

- Making `runtime/` a workflow mode.
- Blind repo-wide replacement of old deep-loop names.
- Full runtime/system-spec-kit compiler decoupling during this merge.
- Hand-editing compiled command contract markdown.
- Treating fallback-router wiring as required for rename/unification closeout.
- Wiring model substitution directly into the generic pool without an explicit hook.
- Continuing to max-10 after all questions were answered and convergence was reached.

## Iteration Summary

| Iteration | Focus | newInfoRatio | Result |
|---:|---|---:|---|
| 1 | Structural layout and identity model | 0.90 | Runtime should be nested infrastructure; graph metadata should be fresh-authored. |
| 2 | Bidirectional path-coupling repair | 0.85 | Direction rules are correct; add unlisted internal paths and classified tests. |
| 3 | System-spec-kit tooling borrow and hidden seams | 0.80 | Add artifact-root and council-playbook-anchor-integrity paths to phase 002. |
| 4 | External reference migration completeness | 0.70 | Phase 003 is broadly complete; add graph dedupe and generated-contract discipline. |
| 5 | Fallback-router real wiring decision | 0.75 | Keep optional/deferred; amend child 004 if implemented. |
| 6 | Convergence validation and synthesis readiness | 0.02 | Legal convergence reached. |

## References

- `iterations/iteration-001.md`
- `iterations/iteration-002.md`
- `iterations/iteration-003.md`
- `iterations/iteration-004.md`
- `iterations/iteration-005.md`
- `iterations/iteration-006.md`
- `deep-research-findings-registry.json`
- `deep-research-dashboard.md`
- `resource-map.md`
