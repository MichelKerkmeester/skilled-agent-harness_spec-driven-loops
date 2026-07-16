# Deep Research Synthesis: gpt55-fast-7

## 1. Executive Summary

The merge design is broadly sound. The structural rename/nesting plan is correct if it preserves the key distinction that `runtime/` is infrastructure, not a workflow mode, and if path repairs are applied directionally rather than by a naive depth rule.

The strongest new risk from this lineage is `mk-deep-loop-guard`: its stale mode-registry path can fail open and silently skip mismatch checks. Child 003 should explicitly update and verify this plugin path, not treat it as just another prose/reference replacement.

Fallback-router wiring should not block the structural merge. It is real and useful, but it changes fan-out retry behavior; keep it as optional phase 004 unless automatic GLM-5.2 to MiMo-v2.5-Pro remediation is required before a GLM-heavy rerun.

## 2. Research Scope

- Validate structural layout and target identity.
- Validate bidirectional path-coupling repair.
- Validate `system-spec-kit` tooling-borrow scope.
- Validate command/agent/README/advisor-corpus migration scope.
- Decide whether `fallback-router.ts` should be wired for GLM-5.2 fallback now.

## 3. Method

Four evidence-gathering iterations were run under detached lineage `fanout-gpt55-fast-7-1783486518892-2qss01`, writing only to this lineage artifact directory.

## 4. Key Findings

### Finding 1: Target Layout Is Coherent If Runtime Is Infrastructure-Only

The target layout in child 002 keeps `deep-research/`, `deep-review/`, `deep-ai-council/`, and `deep-improvement/` at hub level while nesting former runtime as `runtime/`. The same spec explicitly states `runtime/` is not a `workflowMode`; adding it to `mode-registry.json` would be a category error. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:154] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169]

Verdict: Confirmed.

### Finding 2: The Directional Path-Repair Rule Is Correct And Load-Bearing

Forward runtime-to-workflows paths keep hop count and delete the old `deep-loop-workflows` segment. `render-command-contract.cjs` currently imports `../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs`, which becomes hub-local shared content after nesting. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:11]

Reverse workflow-to-runtime paths remove one hop and target `runtime/`. `deep-research/scripts/reduce-state.cjs` and ai-council currently climb to sibling `deep-loop-runtime`; after nesting, runtime is a child of the hub. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:14]

Verdict: Confirmed. This should remain a table-driven edit, not a blanket search/replace.

### Finding 3: The `system-spec-kit` Tooling-Borrow Must Land In Phase 002

Runtime typecheck and type roots borrow TypeScript tooling from `system-spec-kit`, while `system-spec-kit` test:council and vitest include runtime integration tests. Missing these paths could silently drop council graph coverage, so these edits belong with the structural move. [SOURCE: file:.opencode/skills/deep-loop-runtime/package.json:11] [SOURCE: file:.opencode/skills/deep-loop-runtime/tsconfig.json:12] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:31] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18]

Verdict: Confirmed. Add a smoke check for `artifact-root.cjs` because it also delegates to `system-spec-kit/shared/review-research-paths.cjs`. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:18]

### Finding 4: Command Contracts Require Regeneration Discipline

The `/deep:*` command front doors call `deep-loop-runtime/scripts/render-command-contract.cjs`; the compiler and drift checker enumerate old `deep-loop-workflows` authority sources. After the move, the sources must be updated and compiled contracts regenerated, not hand-edited, because the command contract system carries source/body digest semantics. [SOURCE: file:.opencode/commands/deep/research.md:9] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/check-contract-drift.cjs:38] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:15]

Verdict: Confirmed.

### Finding 5: External Reference Migration Is Broad And Advisor-Sensitive

A live scoped count found 764 old-name matches across 77 files in non-spec/non-dist external surfaces. Advisor routing is especially sensitive: Python `skill_advisor.py`, TypeScript `aliases.ts`, explicit scorer boosts, and routing corpus labels all encode `deep-loop-workflows`. [SOURCE: command:rg-count:2026-07-08] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2579] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:105]

Verdict: Confirmed. Child 003's field-scoped corpus and accuracy rebaseline plan is necessary.

### Finding 6: `mk-deep-loop-guard` Is The Highest-Value Additive Risk

The guard plugin points at `.opencode/skills/deep-loop-workflows/mode-registry.json`. Its loader returns `null` on read/parse failure, and the hook skips mode-mismatch checks when registry is absent; the plugin explicitly documents missing/unreadable registry as fail-open. [SOURCE: file:.opencode/plugins/mk-deep-loop-guard.js:35] [SOURCE: file:.opencode/plugins/mk-deep-loop-guard.js:75] [SOURCE: file:.opencode/plugins/mk-deep-loop-guard.js:353]

Verdict: Revise child 003 to make plugin path verification an explicit item. A stale path here can degrade guard behavior silently.

### Finding 7: Fallback Router Is Ready But Should Stay Optional

`fallback-router.ts` validates configured fallback graphs and resolves model fallback/fail-fast routes. `fanout-pool.cjs` does not call it; same-model retry is the live behavior until retry exhaustion. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:357] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:628] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:650]

Verdict: Keep phase 004 optional. Run it before re-running GLM-heavy fanout only if automatic fallback is required.

## 5. Confirmed Design Points

- Rename skill identity to `system-deep-loop` while freezing `/deep:*` commands and agent names.
- Nest former runtime as `system-deep-loop/runtime/` without a nested `graph-metadata.json`.
- Fresh-author one hub-level `graph-metadata.json` and drop reciprocal runtime/workflows edges.
- Keep the staged split: phase 002 structural move, phase 003 external references/advisor, phase 004 optional behavior hardening.

## 6. Recommended Revisions

1. Add an explicit child-003 verification task for `mk-deep-loop-guard.js`: update `REGISTRY_RELATIVE_PATH`, run a missing-path/mismatch behavior check, and confirm route checks still fire after the move.
2. In child 002, add a smoke check for `runtime/lib/deep-loop/artifact-root.cjs` after adjusting depth, because it delegates to `system-spec-kit` shared resolver.
3. In child 003, keep advisor Python/TypeScript merged identity constants as a paired manual-verify item and consider adding a lightweight drift guard if none already covers them.
4. Keep fallback-router phase 004 out of the 002/003 blocking path unless the operator explicitly wants automatic GLM failure substitution before the fanout is repeated.

## 7. Open Questions

- Does the final full fanout synthesis from all 20 replicas agree that `mk-deep-loop-guard` fail-open behavior deserves a child-003 plan edit?
- Should a singleton `deep-loop` family remain in skill graph output after both old nodes collapse to `system-deep-loop`? This lineage did not inspect the skill graph rebuild behavior deeply enough to decide.

## 8. Ruled-Out Directions

- Renaming `/deep:*` commands or deep agents.
- Treating `.opencode/specs/**` historical mentions as migration targets.
- Deferring `system-spec-kit` test/typecheck path repairs to prose/reference migration.
- Making fallback-router wiring a hard requirement for the structural merge.

## 9. Convergence Report

- Stop reason: converged.
- Total iterations: 4.
- Questions answered: 5 / 5.
- Remaining questions: 0.
- Last 3 iteration summaries: run 2 tooling-borrow (0.68), run 3 reference/advisor/plugin (0.48), run 4 fallback/convergence (0.08).
- Convergence threshold: 0.05.
- Quality guards: source diversity passed; focus alignment passed; no single weak-source dominance; minIterations floor passed.

## 10. References

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/plugins/mk-deep-loop-guard.js`
