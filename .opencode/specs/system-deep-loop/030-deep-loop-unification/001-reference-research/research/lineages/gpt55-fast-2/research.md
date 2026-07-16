# Research Synthesis - gpt55-fast-2

## 1. Executive Summary

This lineage validates the overall `system-deep-loop/` merge direction, but it recommends four corrections before child 002 starts:

1. Add a fan-out branch that skips or defers `spec.md` mutation when `config.fanout_lineage_artifact_dir` is present.
2. Add `runtime/lib/deep-loop/artifact-root.cjs` and its tests to the path-repair plan.
3. Expand the reverse-coupling inventory beyond the current table.
4. Treat GLM-5.2 to MiMo-v2.5-Pro fallback as useful but requiring explicit model-id, approval, and failure-class wiring.

The structural concept is still sound: `deep-loop-workflows` becomes `system-deep-loop`, `deep-loop-runtime` becomes nested `runtime/`, and public `/deep:*` command/agent names stay stable.

## 2. Research Scope

Scope covered structural layout, bidirectional path coupling, `system-spec-kit` tooling borrow, external reference migration, advisor-corpus migration, and fallback-router wiring feasibility.

Out of scope: executing the move, editing any source path, or writing outside this lineage directory.

## 3. Method

I ran five evidence iterations using direct source reads and scoped grep inventories. The loop stopped at legal convergence after all five key questions had evidence-backed answers.

## 4. Key Question Coverage

| Question | Status | Answer |
|---|---|---|
| Structural layout | Answered | Sound if `runtime/` remains infrastructure, not a workflow mode. |
| Path coupling | Answered | Directional rules are right, but inventory misses load-bearing seams. |
| External migration | Answered | Must be category-scoped with advisor re-baseline. |
| GLM to MiMo fallback | Answered | Worth wiring only with explicit safety preconditions. |
| Fan-out boundary | Answered | Current YAML conflicts with detached write boundary. |

## 5. Ranked Findings

### F-P0-001 - Detached Fan-Out Lineage Boundary Conflicts With `spec.md` Mutation

`fanout-run.cjs` builds a detached prompt that explicitly says to write all outputs to the lineage directory and not touch anything outside it. The research YAML still defines pre-init branches that create or edit `{spec_folder}/spec.md` and a post-synthesis writeback to `{spec_folder}/spec.md`. In fan-out, this is unsafe because N replicas would share the same target file and violate their own prompt boundary. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1004-1017] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:376-406] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1510-1532]

Recommendation: when `config.fanout_lineage_artifact_dir` is present, emit a local `spec_synthesis_deferred` event and skip both pre-init and post-synthesis `spec.md` mutation. Let the parent fan-out merge or a single authoritative synthesis write back once.

### F-P0-002 - `artifact-root.cjs` Is A Missed Path Seam

The child 002 tooling-borrow table covers `package.json`, `tsconfig.json`, and system-spec-kit test globs, but misses `runtime/lib/deep-loop/artifact-root.cjs`. Its relative require currently resolves from `.opencode/skills/deep-loop-runtime/lib/deep-loop` to `.opencode/skills/system-spec-kit`. After nesting under `.opencode/skills/system-deep-loop/runtime/lib/deep-loop`, the same path resolves inside `system-deep-loop`, so it needs one more `..`. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16-18]

The tests need the same correction. `artifact-root.vitest.ts` directly loads the original resolver with `../../../system-spec-kit/...`, and `dependency-seams.vitest.ts` computes `skillsRoot` as `runtimeRoot/..`, which will become `system-deep-loop` after nesting. [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts:10-25] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:16-18] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:46-52]

Recommendation: add `artifact-root.cjs`, `artifact-root.vitest.ts`, and `dependency-seams.vitest.ts` to child 002 Stage 3b.

### F-P1-003 - Reverse-Coupling Inventory Is Broader Than The Current Table

The plan's directional rule is right: workflow content importing runtime should lose one parent hop after runtime becomes a child of the hub. But the current table is incomplete. Confirmed additional or under-emphasized sites include `deep-review/scripts/reduce-state.cjs`, `deep-research/scripts/runtime-capabilities.cjs`, `deep-review/scripts/runtime-capabilities.cjs`, and `deep-ai-council/scripts/replay-graph-from-artifacts.cjs`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:11-15] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs:17-18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs:17-18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:51-65]

Recommendation: before edits, run an executable-surface inventory for `deep-loop-runtime` inside `deep-loop-workflows` excluding historical specs and prose-only docs. Use the result as the Stage 3a checklist.

### F-P1-004 - Advisor Migration Needs Drift Guard And Accuracy Re-Baseline

The migration plan correctly avoids blind find/replace. The advisor hot path hardcodes the old mode-registry path and merged skill id in Python. The TypeScript scorer also hardcodes `MERGED_DEEP_SKILL_ID`, and the drift guard pins the registry path and canonical projection skill. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83-90] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2568-2587] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:92-110] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:20-27]

Corpus and divergence-ledger rows already store `deep-loop-workflows` as expected output in structured fields. These must be field-scoped updates and then re-approved, not prompt-text rewrites. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:24-33] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:155-172]

Recommendation: preserve child 003's Stage A/I/J gates: pre-change accuracy baseline, field-scoped corpus rename, divergence ratchet update, and `score-routing-corpus.py --min-advisor-accuracy <baseline>`.

### F-P1-005 - GLM To MiMo Fallback Should Be Wired, But Not Naively

`fallback-router.ts` is ready to reuse: it validates graphs, rejects same-pool fallback, rejects unapproved substitutions, and returns typed route decisions. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:337-431] It has no non-test production caller today; fan-out only retries the same item until `maxRetries` and then marks failure. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:618-654]

The model profiles confirm GLM and MiMo are separate quota pools, but both currently have `fallback_target: null`; GLM explicitly says single executor path/no fallback. [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:190-214] [SOURCE: .opencode/skills/sk-prompt-models/assets/model_profiles.json:255-299]

The integration has two non-obvious requirements. First, fan-out dispatches provider slugs such as `zai-coding-plan/glm-5.2`, while the registry id is `glm-5.2`, so a canonical model-id adapter is required. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1343-1375] Second, `classifyLineageFailure()` only retries timeout and artifact-miss classes; non-timeout CLI exits are fatal, and `runLineageProcess()` drains stderr, so quota/auth failures may not reach a retry-exhausted fallback branch. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:169-199] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1206-1286]

Recommendation: wire fallback in child 004 or before large GLM fan-outs only after adding model-id normalization, explicit fallback approval, distinct substitute lineage labels, and failure-kind capture for quota/auth/timeout.

## 6. Structural Layout Assessment

The layout in child 002 is sound: `system-deep-loop/` should own public routing and mode packets, and `runtime/` should be nested infrastructure with no `graph-metadata.json` of its own. The mode registry's `workflowMode` / `runtimeLoopType` / `backendKind` split already models this cleanly. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:1-27] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29-101]

## 7. Path-Coupling Assessment

The child 002 repair rules are valid but need broader inventory:

| Class | Rule | Status |
|---|---|---|
| Runtime to workflow content | Same hop count; delete old `deep-loop-workflows` segment or rename absolute paths to `system-deep-loop` | Correct, inventory broad. |
| Workflow content to runtime | Runtime becomes nearer; remove one `..` and rename segment to `runtime` | Correct, inventory incomplete. |
| Runtime to system-spec-kit | Runtime moves one level deeper; add one `..` for relative reaches into sibling `system-spec-kit` | Missing from plan. |
| Repo-root absolute paths | Rename `.opencode/skills/deep-loop-runtime` to `.opencode/skills/system-deep-loop/runtime` | Must be explicit. |

## 8. Tooling-Borrow Assessment

The planned four-site tooling-borrow edits are necessary and should stay in child 002 rather than child 003 because they affect validation of the physical move. [SOURCE: .opencode/skills/deep-loop-runtime/package.json:10-13] [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:12-14] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:29-32] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18-21]

Add `artifact-root.cjs` to the same stage because it is also runtime-to-system-spec-kit pathing, not external prose migration.

## 9. External Migration Assessment

Child 003's category order is appropriate: hardcoded constants and codegen first, then structured identity fields, command contract regeneration, prose/agents/READMEs, graph metadata, grandfather examples, corpus, and exit gates. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:69-106]

Do not rename `/deep:*` commands or agent names. Child 003's own decision says the skill identity changes while public command and agent surfaces remain stable. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:143-149]

## 10. Advisor Corpus Assessment

The advisor migration is high risk because the runtime does not read `mode-registry.json` on the hot path; it uses generated and hardcoded projection maps plus corpus fixtures. That architecture is intentional, so migration must re-run the projection emitter and drift guard rather than pointing the hot path at the registry dynamically. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:10-17] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:74-86]

## 11. Fallback Router Assessment

Wiring GLM to MiMo fallback is worthwhile for operator experience, especially if the GLM pool fails during fan-out. It is not required for the structural merge itself. If included, it should land behind an explicit config gate and a forced-failure integration test as child 004 already proposes. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:65-94]

## 12. Fan-Out Boundary Assessment

This lineage treated `spec.md` mutation and memory save as deferred because the prompt's state boundary was stricter than the YAML's normal single-executor behavior. The safer architecture is parent-owned writeback after fan-out merge.

## 13. Validation Recommendations

Run these after child 002:

1. `package_skill.py --check` on the renamed hub and all mode packets.
2. `find .opencode/skills/system-deep-loop -iname graph-metadata.json | wc -l` equals 1.
3. Runtime `npm test` and `npm run typecheck` from nested `runtime/`.
4. `system-spec-kit/mcp_server` `npm run test:council`.
5. A short live `/deep:research` or `/deep:review` run to prove reducer imports and `artifact-root.cjs` resolve at runtime. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:124-131]

Run these after child 003:

1. Residual reference grep with explicit allowlist.
2. Parent skill doctor self-check.
3. Advisor projection regeneration and drift guard.
4. Routing accuracy re-baseline.
5. Agent mirror sync check.

## 14. Open Questions

No blocking open questions remain for this lineage. Two operator decisions remain downstream:

1. Whether to wire GLM to MiMo fallback before rerunning GLM fan-out replicas or accept manual re-dispatch for this research phase.
2. Whether fan-out parent synthesis should write the generated findings fence to `spec.md`, or whether child 001 should keep research output only in `research/research.md` until manual promotion.

## 15. Ruled-Out Directions

- Do not add `runtime` as a mode-registry entry.
- Do not let each detached replica edit shared `spec.md`.
- Do not blind-replace old names inside historical specs/worktrees.
- Do not wire fallback without approved target policy and model-id normalization.
- Do not rely on static grep alone for post-move reducer/runtime resolution.

## 16. References

- `.opencode/commands/deep/assets/deep_research_auto.yaml`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/{002,003,004}-*/{spec.md,plan.md}`

## 17. Convergence Report

- Stop reason: converged
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3 tooling/migration (0.44), run 4 fallback (0.36), run 5 consolidation (0.12)
- Convergence threshold: 0.05
- Legal-stop basis: all key questions answered with diverse cited evidence; final iteration produced primarily consolidation.
