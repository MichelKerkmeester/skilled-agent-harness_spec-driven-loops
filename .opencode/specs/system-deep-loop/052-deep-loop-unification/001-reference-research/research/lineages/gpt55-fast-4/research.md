# Research Synthesis: gpt55-fast-4

## Verdict

The merge design is viable. `deep-loop-runtime` should be folded under the renamed hub as `system-deep-loop/runtime`, while `deep-research`, `deep-review`, `deep-ai-council`, and `deep-improvement` remain the only workflow modes. The structural merge should proceed with one correction: add `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` to the child 002 internal path-repair scope.

Fallback-router wiring should not block the structural merge. If the optional fallback phase proceeds, fallback policy should be owned by `fanout-run.cjs`, not hardcoded inside the generic pool primitive.

## Execution Summary

- Lineage: `gpt55-fast-4`
- Session: `fanout-gpt55-fast-4-1783486518892-2qss01`
- Executor: `cli-opencode` with `openai/gpt-5.5-fast`
- Iterations completed: 5
- Stop reason: converged
- newInfoRatio trend: 0.92, 0.78, 0.52, 0.34, 0.12
- Artifact root: `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-4`

## Key Findings

### 1. The Target Layout Is Sound

The target architecture should have a single visible skill identity, `system-deep-loop`, with runtime nested below it as infrastructure. The runtime should not become a workflow mode and should not have its own nested skill metadata.

Evidence:

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:156`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:100`

### 2. One Internal Path Repair Site Is Missing From The Plan

`deep-ai-council/scripts/replay-graph-from-artifacts.cjs` lives inside the workflow tree and references old runtime paths. It should be repaired during child 002, not deferred to broad external reference cleanup.

Evidence:

- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:26`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:56`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:65`

Recommendation:

- Add this script to child 002 Stage 3a or the equivalent implementation checklist.

### 3. Runtime Self-Containment Needs Precise Wording

The runtime owns its main runtime dependencies locally, including `better-sqlite3`, `tsx`, `zod`, and local `vitest`. It still borrows TypeScript execution and type roots from `system-spec-kit`.

Evidence:

- `.opencode/skills/deep-loop-runtime/package.json:11`
- `.opencode/skills/deep-loop-runtime/package.json:14`
- `.opencode/skills/deep-loop-runtime/package.json:20`
- `.opencode/skills/deep-loop-runtime/tsconfig.json:12`

Recommendation:

- Keep child 002 focused on relative path-depth repair.
- Do not bundle full TypeScript/tooling decoupling into the structural merge.

### 4. system-spec-kit Reverse Test Discovery Is A Real Closeout Gate

`system-spec-kit` still includes deep-loop runtime council tests through relative paths. After runtime nesting, those paths must be repaired and `test:council` or equivalent council validation must remain in the closeout gate.

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/package.json:31`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:20`

### 5. Advisor Migration Is The Highest-Risk External Reference Surface

The old merged skill identity is represented in both Python and TypeScript advisor code, and the routing drift guard embeds the old registry path plus projection identity. Generated projection and corpus rebaseline must happen after the constants move.

Evidence:

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2579`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:76`

Recommendation:

- Treat advisor migration as one unit: Python constants, TypeScript aliases, drift test, generated projection, corpus expectations, validation, and accuracy rebaseline.

### 6. Agent Mirrors Need Paired Migration

Both OpenCode and Claude agent mirrors contain old deep-loop paths. These should be updated together and validated through the mirror-sync gate.

Evidence:

- `.opencode/agents/orchestrate.md:185`
- `.claude/agents/orchestrate.md:174`
- `.opencode/agents/ai-council.md:398`
- `.claude/agents/ai-council.md:380`

### 7. fallback-router.ts Is Tested But Not Yet Operationally Wired

`fallback-router.ts` has typed routing behavior and tests, but the current fanout pool retries the same item/model and records retry exhaustion. It does not substitute GLM-5.2 with MiMo-v2.5-Pro today.

Evidence:

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:422`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:109`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650`

Recommendation:

- Do not make fallback-router wiring a blocker for the structural merge.
- If child 004 proceeds, keep model policy in `fanout-run.cjs` and expose or pass a retry-exhausted substitution seam through the pool.

## Verification Implications

Completion should not be claimed until the merged packet passes at least these gates:

1. Runtime tests.
2. Runtime typecheck, with repaired path depth.
3. `system-spec-kit` council tests or equivalent reverse test-discovery validation.
4. Live short deep-loop execution or equivalent command-level smoke.
5. Advisor routing drift guard.
6. Advisor generated projection freshness.
7. Advisor corpus accuracy rebaseline.
8. Agent mirror sync.
9. Residual grep for old `deep-loop-workflows` and `deep-loop-runtime` references outside explicit allowlists.
10. Deletion of temporary compatibility symlinks or shims before final success criteria are evaluated.

## Residual Risks

- This lineage did not recompute the authoritative old-reference inventory; child 003 Stage A still owns that baseline.
- Line-number citations reflect the live files read during this lineage and may shift after implementation begins.
- Fallback-router implementation details still require a small design pass if optional child 004 is activated.

## Final Recommendation

Proceed with the staged merge design. Apply one required correction to child 002 for `replay-graph-from-artifacts.cjs`, preserve child 003's advisor and mirror validation gates, and keep child 004 optional with model policy attached through `fanout-run.cjs` rather than the generic pool.
