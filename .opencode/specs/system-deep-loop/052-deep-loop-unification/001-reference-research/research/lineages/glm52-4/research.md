# Research Synthesis - glm52-4

> Lineage: `glm52-4` · Executor: `cli-opencode model=zai-coding-plan/glm-5.2` (reasoningEffort: max) · Session: `fanout-glm52-4-1783486518892-2qss01`
> Detached fan-out lineage — all writes confined to this lineage directory.

## 1. Executive Summary

This lineage **confirms the `system-deep-loop/` merge direction is sound** and recommends **four corrections before child 002 starts**, plus **two additions to the optional child 004**. The structural layout, directional path-repair rules, graph-metadata fresh-authoring, and public-surface stability are all correct as designed by the three Sonnet-5 Plan agents. The corrections are surgical, not architectural:

1. **Fan-out-guard the `spec.md` mutation steps** — the YAML overrides `artifact_dir` for fan-out but does NOT guard `step_detect_spec_present` / `step_writeback_spec_findings`, so N replicas would race on shared `{spec_folder}/spec.md`. (F-P0-001)
2. **Add `artifact-root.cjs` + 2 tests to Stage 3b** — its own internal `path.join` to `system-spec-kit` deepens by one hop and is load-bearing on every graph-backed reducer. (F-P0-002)
3. **Widen Class B to the full 11-file inventory + the absolute-path `replay-graph` form** — the table omits `orchestrate-session.cjs`, both `runtime-capabilities.cjs`, `deep-review/reduce-state.cjs`, and a non-`require()` absolute path. (F-P1-002/003)
4. **Preserve 003's projection-regen + divergence-ratchet discipline** — the advisor does not read `mode-registry.json` at runtime, so the rename needs projection-map regeneration + 3 hardcoded-constant updates + field-scoped (not prose) divergence-ledger updates. (F-P1-004/005/006)

Fallback wiring (004) is desirable operator insurance — and notably relevant to GLM fan-outs like this very research phase — but is correctly optional and independent of the structural merge. As a GLM-5.2 lineage, my own quota pool held without needing a MiMo swap, mild empirical evidence that fallback is insurance rather than daily necessity.

## 2. Research Scope

**In scope:** read-only validation of the merge design — structural layout (Q1), bidirectional path coupling (Q2), system-spec-kit tooling borrow + artifact-root seam (Q3), external reference migration across commands/agents/READMEs/advisor-corpus (Q4), and fallback-router wiring feasibility (Q5).

**Out of scope:** executing any part of the merge (delegated to 002-005), modifying any source path, or writing outside this lineage directory. The YAML `spec.md` pre-init and post-synthesis writeback were deferred to preserve the detached fan-out boundary (see §12).

## 3. Method

Five evidence iterations using direct source reads and scoped `rg` inventories over the two skills, the commands, the agents, the advisor, and the model registry. Each finding cites a concrete `file:line`. The loop stopped at legal convergence after all five key questions had evidence-backed answers and `maxIterations` (5) was reached; the final iteration was primarily consolidation with two targeted 004-gap notes.

## 4. Key Question Coverage

| Question | Status | Answer |
|---|---|---|
| Q1 Structural layout | Answered | Sound if `runtime/` stays infrastructure, not a workflow mode. |
| Q2 Path coupling | Answered | Directional rules correct; Class B inventory incomplete. |
| Q3 Tooling borrow | Answered | package.json/tsconfig right; `artifact-root.cjs` seam missed. |
| Q4 External migration | Answered | Bounded surface; advisor is highest-risk (no runtime registry read). |
| Q5 Fallback wiring | Answered | Worth wiring; 004 needs slug→id adapter + failure-class capture. |

## 5. Ranked Findings

### F-P0-001 — Detached Fan-Out Boundary Conflicts With `spec.md` Mutation (One-Sided Guard)

`fanout-run.cjs:1004-1017` emits a prompt forbidding each replica from touching any path outside its lineage dir. `step_resolve_artifact_root` (yaml:128-137) correctly `branch_on: config.fanout_lineage_artifact_dir` to rebind `artifact_dir`. But `step_detect_spec_present` (yaml:361) and `step_writeback_spec_findings` (yaml:1510) still target `{spec_folder}/spec.md` with NO fanout guard. The guard is therefore one-sided: `artifact_dir` is overridden, `spec.md` is not. In a fan-out of N replicas, the same shared `spec.md` is raced by every replica, violating each replica's own prompt boundary. [SOURCE: deep_research_auto.yaml:128-137] [SOURCE: deep_research_auto.yaml:361] [SOURCE: deep_research_auto.yaml:1510-1518] [SOURCE: fanout-run.cjs:1004-1017]

**Recommendation:** mirror the `branch_on: config.fanout_lineage_artifact_dir` guard onto the two `spec.md` mutation steps. When the flag is present, emit a local `spec_synthesis_deferred` event and skip both; let the parent fan-out merge write back once.

### F-P0-002 — `artifact-root.cjs` Internal Path Seam Missed By Stage 3b

`lib/deep-loop/artifact-root.cjs:18` is `path.join(__dirname, '..', '..', '..', 'system-spec-kit', 'shared', 'review-research-paths.cjs')` (3 hops from `lib/deep-loop/`). 002 repairs the CONSUMERS of artifact-root.cjs (`reduce-state.cjs`, Class B) but never the file itself. After nesting, `__dirname` becomes `system-deep-loop/runtime/lib/deep-loop`; 3 hops lands at `system-deep-loop/system-spec-kit/shared/...` which does NOT exist. It needs a 4th `..`. This is on every graph-backed reducer's hot path. Two test companions break for the same depth reason: `artifact-root.vitest.ts:11` (`SPEC_KIT_ORIGINAL` needs 4 hops) and `dependency-seams.vitest.ts:17` (`skillsRoot = resolve(runtimeRoot, '..')` needs `resolve(runtimeRoot,'..','..')`). The runtime's self-containment property is preserved (its own `node_modules/` travels inside `runtime/`), so only the path setup is wrong. [SOURCE: artifact-root.cjs:17-18] [SOURCE: artifact-root.vitest.ts:11] [SOURCE: dependency-seams.vitest.ts:16-17] [SOURCE: rg artifact-root in 002/ — only consumer line 82]

**Recommendation:** add `artifact-root.cjs`, `artifact-root.vitest.ts`, and `dependency-seams.vitest.ts` to 002 Stage 3b (+1 hop each).

### F-P1-002 — Class B Reverse-Coupling Inventory Incomplete

The full distinct-file reverse require inventory is **11 files**. The 002 Class B table names `orchestrate-topic.cjs` but omits its sibling **`orchestrate-session.cjs`** (3 parallel council-lib requires at lines 16-18), plus **`deep-review/scripts/reduce-state.cjs`**, **`deep-review/scripts/runtime-capabilities.cjs`**, and **`deep-research/scripts/runtime-capabilities.cjs`**. The table's "All 12 files follow this pattern" conflates requires with files. [SOURCE: orchestrate-session.cjs:16-18] [SOURCE: rg require deep-loop-runtime in deep-loop-workflows — 11 distinct files]

**Recommendation:** run an executable-surface inventory for `deep-loop-runtime` inside `deep-loop-workflows` (excluding historical specs/prose) and use it as the Stage-3a checklist rather than the curated table.

### F-P1-003 — `replay-graph-from-artifacts.cjs` Absolute-Path Form Invisible To Relative-Require Grep

`replay-graph-from-artifacts.cjs:56,65` resolves `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` via `path.join(repoRoot, '.opencode','skills','deep-loop-runtime',...)`. This is an ABSOLUTE repo-root path, not a relative require, so a relative-`require()` grep (the natural Stage-3a tool) will miss it. It must be renamed to `system-deep-loop/runtime/scripts/upsert.cjs`. [SOURCE: replay-graph-from-artifacts.cjs:56] [SOURCE: replay-graph-from-artifacts.cjs:65]

**Recommendation:** the Stage-3a checklist must include absolute-path references, not just relative requires.

### F-P1-004 — Advisor Does Not Read mode-registry.json At Runtime

The registry description states explicitly that the advisor keeps hardcoded projection maps (Python `DEEP_ROUTING_MODE_BY_KEY`, TypeScript `DEEP_MODE_BY_CANONICAL`) in sync via a CI drift guard, intentionally avoiding cross-skill import coupling on the hot path. So the rename is NOT a registry repoint — it requires regenerating the projection maps AND updating three hardcoded identity constants: `skill_advisor.py:83 MODE_REGISTRY_PATH`, `skill_advisor.py:2579 MERGED_DEEP_SKILL_ID`, `aliases.ts:109 MERGED_DEEP_SKILL_ID`. The drift guard catches a stale projection, but only if re-run after the rename. [SOURCE: mode-registry.json:10-17] [SOURCE: skill_advisor.py:83] [SOURCE: skill_advisor.py:2579] [SOURCE: aliases.ts:109]

**Recommendation:** preserve 003 Stage A (baseline), Stage I (divergence ratchet), Stage J (projection regen + drift guard + accuracy re-baseline) gates.

### F-P1-005 — Divergence Ledger Mixes Identity Fields With Historical Prose

`local-native-approved-divergences.json` stores `nativeTop: "deep-loop-workflows"` and `gold: "deep-loop-workflows"` as structured fields (lines 30, 158, 160) BUT also stores prose `reason` strings that narrate the deep-loop merge (line 31, 161). A blind find/replace would corrupt the `reason` narratives, which are historical record. [SOURCE: local-native-approved-divergences.json:30-31] [SOURCE: local-native-approved-divergences.json:158-161]

**Recommendation:** field-scope the identity updates (`nativeTop`/`gold`) through the divergence ratchet; leave `reason` prose untouched.

### F-P1-006 — Dual-Runtime Agent Mirror Is A Sync Hazard

5 opencode agents (`.opencode/agents/`) + 5 claude agents (`.claude/agents/`) reference the old identity. A rename applied to one tree but not the other leaves the runtimes disagreeing on the deep-loop path. [SOURCE: rg deep-loop in .opencode/agents and .claude/agents — 5 each]

**Recommendation:** 003's agent-mirror sync check is mandatory, not optional.

### F-P1-007 — 004 Plan Misses slug→registry-id Model Adapter

`fanout-run.cjs:1349-1350` dispatches the full provider slug (`--model zai-coding-plan/glm-5.2`), but the proposed `ModelRegistry` keys on bare id `glm-5.2` / `mimo-v2.5-pro`. `resolveFallback(sourceId)` takes a registry id, so a failed executor's slug must be normalized before lookup, or the router rejects every real-world failed model as unknown. [SOURCE: fanout-run.cjs:1349-1350] [SOURCE: model_profiles.json:190-299] [SOURCE: 004/plan.md registry entry]

**Recommendation:** precede the `resolveFallback()` call with an explicit slug→id normalizer.

### F-P1-008 — Retry-Exhausted-Only Fallback Misses Quota/Auth Failures

`classifyLineageFailure` (cli-guards.cjs:188-196) marks only TIMEOUT/SALVAGE_MISS/ARTIFACT_MISS retryable; a plain CLI `EXIT` is FATAL and terminal. Quota/auth failures that surface as non-timeout exits never reach a retry-exhausted branch, so a `resolveFallback` wired only at retry-exhaustion misses the exact classes that most motivate a model swap. The same-pool guard is satisfied for glm (zai-coding-plan) → mimo (xiaomi-token-plan). [SOURCE: cli-guards.cjs:188-196] [SOURCE: 004/plan.md Phase 2]

**Recommendation:** widen the failure classes eligible for fallback (independent of retryability), or explicitly capture quota/auth at the fatal-exit point.

## 6. Structural Layout Assessment (Q1)

Sound. `mode-registry.json`'s three-tier discriminator (`workflowMode` / `runtimeLoopType` / `backendKind`) already models runtime as infrastructure (`runtimeLoopType` for research/review/council; explicit null for improvement/external-adapter). Folding runtime in as nested `runtime/` — NOT as a seventh workflow mode — is the correct categorization. `graph-metadata.json` fresh-authoring (not N-way merge) is strictly simpler because the runtime graph repeats the hub's `depends_on`/`enhances`/`siblings` edges. [SOURCE: mode-registry.json:10-45] [SOURCE: 002/plan.md graph-metadata consolidation]

## 7. Path-Coupling Assessment (Q2)

The directional rules are correct; the inventory is incomplete.

| Class | Rule | Verdict |
|---|---|---|
| Forward (runtime → workflows content) | Same hop-count, delete `deep-loop-workflows` segment / rename to `system-deep-loop` | Correct. Verified: `render-command-contract.cjs:11` 2 hops resolves to `../../shared/...` |
| Reverse (workflows content → runtime) | Minus one hop + rename segment to `runtime` | Correct for both tiers (`scripts/` 3→2, `scripts/tests/` 4→3). Verified against orchestrate-topic + its test. |
| Runtime → system-spec-kit (relative) | Runtime moves one level deeper; +1 `..` | **Missed by 002** for `artifact-root.cjs` (F-P0-002). |
| Absolute repo-root paths | Rename `.opencode/skills/deep-loop-runtime` → `system-deep-loop/runtime` | Correct, but **missed** the `replay-graph` absolute form (F-P1-003). |

## 8. Tooling-Borrow Assessment (Q3)

The 002 Stage-3b two listed repairs (`package.json` typecheck, `tsconfig.json` typeRoots — both +1 hop) are correct and correctly placed in 002 (they gate physical-move validation). The omission is `artifact-root.cjs` + its 2 tests (F-P0-002). Useful contrast: the runtime's ABSOLUTE system-spec-kit references (`check-contract-drift.cjs:39`, `compile-command-contracts.cjs:14,491`) are correctly UNCHANGED because system-spec-kit does not move — proving the seam class is specifically "relative path to a stationary sibling", which deepens by exactly one hop. [SOURCE: package.json:14] [SOURCE: tsconfig.json:13-15] [SOURCE: check-contract-drift.cjs:39]

## 9. External Migration Assessment (Q4)

003's dependency-ordered category staging (codegen → structured identity → command contracts → prose/agents/READMEs → graph metadata → corpus → exit gates) is appropriate. The surface is bounded: 33 command files, 5+5 agents, 4 READMEs. The decision to keep `/deep:*` command names and agent names stable (skill identity changes, public surfaces do not) sharply reduces blast radius. [SOURCE: 003/spec.md:143-149] [SOURCE: rg counts: commands=33, opencode agents=5, claude agents=5]

## 10. Advisor Corpus Assessment (Q4)

Highest-risk surface. The architecture intentionally avoids runtime registry reads (it uses hardcoded projection maps + a CI drift guard). Migration must regenerate the projection maps and update three hardcoded constants, then re-run the drift guard and re-baseline routing accuracy — NOT point the hot path at the registry dynamically. The divergence ledger's identity fields must be field-scoped (ratchet), its `reason` prose left intact. [SOURCE: mode-registry.json:10-17] [SOURCE: skill_advisor.py:83,2579] [SOURCE: aliases.ts:109]

## 11. Fallback Router Assessment (Q5)

`fallback-router.ts` is reusable as-is: fully tested, and `validateFallbackGraph`/`resolveFallback` enforce missing-target, cross-scope, cycle, max-hop, same-pool, and unapproved-substitution rejection. It has zero production callers (`fanout-pool.cjs` does not import it). Wiring is worthwhile for operator experience but independent of the structural merge — correctly P2/optional in 004. The 004 plan needs two additions before it can safely land: a slug→id adapter (F-P1-007) and quota/auth failure-class capture (F-P1-008). [SOURCE: fallback-router.ts:290-415]

## 12. Fan-Out Boundary Assessment

This lineage treated `spec.md` mutation and memory save as deferred because the prompt's state boundary (`fanout-run.cjs:1004-1017`) is stricter than the YAML's single-executor behavior. The safer architecture is parent-owned writeback after fan-out merge, which requires the one-sided guard fix (F-P0-001).

## 13. Validation Recommendations

**After child 002 (structural):**
1. `package_skill.py --check` on the renamed hub and all 4 mode packets.
2. `find .opencode/skills/system-deep-loop -iname graph-metadata.json | wc -l` == 1.
3. `cd system-deep-loop/runtime && npm test` green (tolerate the known loop-lock flake).
4. `cd system-deep-loop/runtime && npm run typecheck` succeeds (validates the +1-hop tsconfig repair).
5. `cd system-spec-kit/mcp_server && npm run test:council` succeeds (validates the reverse test-discovery borrow).
6. A live short `/deep:research` or `/deep:review` run confirms reverse `require()`s AND `artifact-root.cjs` resolve at runtime.

**After child 003 (migration):**
1. Residual `rg` with an explicit allowlist (must include absolute-path forms).
2. Parent skill doctor self-check.
3. Advisor projection regeneration + drift guard.
4. Routing accuracy re-baseline (`score-routing-corpus.py --min-advisor-accuracy <baseline>`).
5. Agent mirror sync check (both runtimes).

## 14. Open Questions

No blocking open questions remain for this lineage. Two operator decisions are downstream:
1. Whether to land 004 (fallback wiring) as part of this packet or separately after — and if before large GLM fan-outs, whether to add the slug→id adapter + failure-class capture first.
2. Whether fan-out parent synthesis should write the generated findings fence to `spec.md`, or keep research output in `research/research.md` until manual promotion.

## 15. Ruled-Out Directions

- Do not add `runtime` as a mode-registry `workflowMode` (category error).
- Do not let detached replicas edit shared `spec.md`.
- Do not treat relative-require grep as a complete Stage-3a checklist (misses absolute-path forms).
- Do not blind-replace across the divergence ledger (corrupts reason prose).
- Do not point the advisor hot path at `mode-registry.json` dynamically.
- Do not wire fallback without a slug→id normalizer and quota/auth failure-class capture.

## 16. References

- `.opencode/commands/deep/assets/deep_research_auto.yaml`
- `.opencode/skills/deep-loop-runtime/scripts/{fanout-run.cjs,fanout-pool.cjs,lib/cli-guards.cjs,render-command-contract.cjs}`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/{artifact-root.cjs,fallback-router.ts}`
- `.opencode/skills/deep-loop-runtime/{package.json,tsconfig.json}`
- `.opencode/skills/deep-loop-runtime/tests/unit/{artifact-root.vitest.ts,dependency-seams.vitest.ts}`
- `.opencode/skills/deep-loop-workflows/{mode-registry.json}`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/{orchestrate-session.cjs,orchestrate-topic.cjs,replay-graph-from-artifacts.cjs}`
- `.opencode/skills/system-skill-advisor/mcp_server/{scripts/skill_advisor.py,lib/scorer/aliases.ts,tests/routing-registry-drift-guard.vitest.ts,tests/parity/fixtures/local-native-approved-divergences.json}`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/{002,003,004}-*/{spec.md,plan.md}`

## 17. Convergence Report

- Stop reason: `converged`
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio trend: 0.80 → 0.64 → 0.52 → 0.40 → 0.18 (avg 0.508)
- Convergence threshold: 0.05
- Legal-stop basis: all 5 key questions answered with diverse cited evidence; `maxIterations` (5) reached; final iteration primarily consolidation (+ two targeted 004-gap notes).
- Quality guards: source diversity passed (commands/agents/scripts/tests/advisor/config/model-registry all cited); focus alignment passed (one focus per iteration); no single weak-source dominance.
