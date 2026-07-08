# Research: Deep-Loop Unification Merge Design Stress-Test

> **Lineage:** `glm52-1` (GLM-5.2, `reasoningEffort: max`) · **Iterations:** 5 · **Stop reason:** converged (5/5 questions answered) + maxIterationsReached (5/5) · **Loop type:** research · **Session:** `fanout-glm52-1-1783486518892-2qss01`

---

## 1. Executive Summary

This lineage validates and stress-tests the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`. The merge is **mechanically safe and a net simplification on the workflows↔runtime coupling axis**, while **neutral on the system-spec-kit axis**. The single highest-risk finding is that **50 string-literal content references (runtime→workflows) break silently** during the rename, concentrated in `compile-command-contracts.cjs`; these are the real exposure, not the 14 relative `require()` paths (which break loudly). The advisor corpus carries a **coupled-pair atomic-migration constraint** (`MERGED_DEEP_SKILL_ID` + registry, gated by a drift-guard test). `fallback-router.ts` should **not** be wired during the merge — it is dormant-but-valid, wiring is a 4-piece feature out of scope, and its approval-guard would reject unapproved MiMo swaps anyway.

A critical correction to prior 117-improvement-research: the runtime's "node_modules tooling-borrow" is **already resolved** (own `package.json`, bare specifiers); only `tsc` is borrowed at dev-time.

---

## 2. Structural Layout (Q1)

### Verdict: Mechanically safe, IF nesting depth is preserved.

The runtime is a self-contained unit: `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, `node_modules/`, `database/` (SQLite), `lib/{council,coverage-graph,deep-loop}/`, `scripts/`, `tests/`, `references/`, `feature_catalog/`, `manual_testing_playbook/`, `graph-metadata.json`, `SKILL.md`, `README.md`. All of these move together. There are **no orphaned entry points** — every `scripts/*.cjs` is invoked from a `deep/*` command (3 files) or a `*_auto.yaml` workflow (4 coverage-graph scripts).

`mode-registry.json` is the merge keystone: it declares 7 workflowModes across 3 `backendKind` values, and its `backendKind: runtime-loop-type` discriminator points at the runtime by *role* not path, so routing logic is name-agnostic — but the 3 command entry points (`deep/{research,review,ai-council}.md`) shell out to a **hardcoded** `node .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs` that MUST change.

**Confidence:** high · [SOURCE: directory listings; mode-registry.json; .opencode/commands/deep/*.md]

---

## 3. Bidirectional Path-Coupling Repair (Q2)

### Verdict: 14 loud requires + 50 silent string literals. The silent ones are the risk.

**Direction A (workflows → runtime): 14 relative `require()`, 7 files, 9 seam modules — break LOUDLY.**

| Source | Seam modules | Depth |
|---|---|---|
| `deep-ai-council/scripts/orchestrate-session.cjs` | council/{round-state-jsonl, cost-guards, session-state-hierarchy} | 3 |
| `deep-ai-council/scripts/orchestrate-topic.cjs` | council/{multi-seat-dispatch, round-state-jsonl, adjudicator-verdict-scoring, cost-guards, session-state-hierarchy} | 3 |
| `deep-review/scripts/reduce-state.cjs` | deep-loop/artifact-root | 3 |
| `deep-review/scripts/runtime-capabilities.cjs` | deep-loop/runtime-capabilities | 3 |
| `deep-research/scripts/reduce-state.cjs` | deep-loop/{artifact-root, continuity-thread} | 3 |
| `deep-research/scripts/runtime-capabilities.cjs` | deep-loop/runtime-capabilities | 3 |
| `deep-improvement/scripts/shared/improvement-journal.cjs` | deep-loop/lifecycle-taxonomy | 4 (only non-uniform case) |

Post-merge these become `../../lib/<pkg>/` (3→2 levels) and the 4-deep one becomes `../../../lib/<pkg>/` (4→3). Repair is mechanical: depth + skill-name. [SOURCE: grep require(../)+deep-loop-runtime across deep-loop-workflows/*.cjs]

**Direction B (runtime → workflows): 1 relative require + ~50 hardcoded string paths — break SILENTLY.**

This is the dangerous direction. `render-command-contract.cjs:11` is a loud relative require, but `compile-command-contracts.cjs` carries **~45 hardcoded `.opencode/skills/deep-loop-workflows/...` string literals** (per-mode config/skill/prompt-pack/reference inventories), `check-contract-drift.cjs` carries 3, and `fanout-run.cjs` carries 2. These are string literals evaluated only when a command fires or a drift check runs — they produce "file not found" at invocation time, not at load time.

**Mitigation:** migrate `check-contract-drift.cjs` first, then use it as the migration-completeness gate for the rest of Direction B. [SOURCE: grep deep-loop-workflows in deep-loop-runtime/scripts/*.cjs — 50 matches]

---

## 4. system-spec-kit Tooling-Borrow (Q3)

### Verdict: Neutral to the merge; net simplification is on the other axis. Do NOT inline the seam.

The 117-research P1 ("make runtime self-contained") is **already done** for dependencies: the runtime ships its own `package.json` (`@deep-loop/runtime`) with bare specifiers (`zod@4.4.3`, `better-sqlite3@12.10.0`, `tsx@4.22.4`). The "8 reach-ins" are stale.

Three system-spec-kit couplings survive the merge, all **depth-invariant and intentional**:
1. `artifact-root.cjs` re-export of `review-research-paths.cjs` (single-source-of-truth seam).
2. `tsc` binary borrow in the `typecheck` npm script (dev-time only).
3. Contract-reference inputs (`auto_mode_contract.md`, `gate-3-classifier.ts`).

The merge is **net simplification on the workflows↔runtime axis** (15 cross-skill requires + 50 string literals become intra-skill) and **neutral on the system-spec-kit axis** (the 3 seams are depth-stable by design). **Do NOT inline `review-research-paths.cjs`** — duplicating it reintroduces the drift the re-export was designed to prevent.

**Confidence:** high · [SOURCE: package.json:1-25; artifact-root.cjs:5-9; review-research-paths.cjs:1-53]

---

## 5. Reference Migration Surface (Q4)

### Verdict: 6 tiers by loudness; advisor corpus is highest-risk (coupled-pair); 2 automated guards bound risk.

| Tier | Surface | Breakage | Risk |
|---|---|---|---|
| Commands (3 shell-to-runtime) | 7 files | LOUD | Low |
| Agents (`.opencode` + `.claude` mirror) | 10 files | SILENT | **MED** (`.claude` easy to miss) |
| **Advisor corpus** | `aliases.ts` (`MERGED_DEEP_SKILL_ID`), `explicit.ts` (~40 entries), `lexical.ts`, `fusion.ts`, 2× graph-metadata | SILENT→LOUD (drift-guard) | **HIGH** |
| Hub/packet docs (SKILL.md, README) | several | SILENT (prose) | Low |
| Feature_catalog / MTP | 46+ refs | SILENT (prose) | Low |
| Compiled contract assets | 3 generated | LOUD (regen stale) | Low |

The advisor hardcodes `MERGED_DEEP_SKILL_ID = 'deep-loop-workflows'` (`aliases.ts:109`), propagating to ~40 routing entries. `mode-registry.json` declares a drift-guard (`routing-registry-drift-guard.vitest.ts`) — so the registry's `"skill"` field AND the projection maps must migrate **atomically** or the test fails. `deep-loop-runtime` is NOT an advisor-routing target (non-routable backend), so the advisor maps only need the `deep-loop-workflows` → `system-deep-loop` identity change; the runtime's advisor surface is its `graph-metadata.json` edges.

The `.claude/agents/` mirror (5 files × 2 runtimes) is a silent-migration trap — prose-only references that no guard checks.

**Mitigation:** (1) drift-guard test after registry+map update; (2) `check-contract-drift.cjs` after contract compile; (3) grep pass `rg -l 'deep-loop-runtime|deep-loop-workflows' .opencode .claude` (excluding specs/changelogs) for ungated prose.

**Confidence:** high · [SOURCE: aliases.ts:95-109; explicit.ts:28-197; mode-registry.json:2,16; rg across .opencode+.claude]

---

## 6. fallback-router.ts Wiring (Q5)

### Verdict: Do NOT wire during the merge. Preserve; track as post-merge follow-up.

`fallback-router.ts` has **zero callers** (confirmed across all `scripts/*.cjs`). The fan-out retry path (`fanout-pool.cjs`) does same-model retry-and-salvage within `maxRetries: 5`, never consulting a router — exactly the gap this fanout stress-tests.

Wiring is a **4-piece feature**, not a one-liner:
1. `ModelRegistry` data source (bridge from `model_profiles.json`).
2. Fan-out retry-exhaustion hook in `fanout-pool.cjs`.
3. Re-dispatch with swapped model + trace metadata.
4. An opt-in `fallback_targets` executors-payload field so the **approval-guard** (`resolveFallback` rejects targets outside `approvedModelIds`) can authorize a GLM-5.2 → MiMo swap.

This is out of scope (read-only phase). The merge does not change the calculus — it only mildens the import path (intra-skill post-merge) without creating a caller. The spec's accepted-risk posture ("operator-mediated manual re-dispatch") is correct. **Preserve the router and its tests; track wiring as a follow-up after child 002/003 stabilize.**

**Confidence:** high · [SOURCE: fallback-router.ts:299-431,411-420; executor-config.ts:272-282; spec.md:69-75,124]

---

## 7. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Resolve 8 system-spec-kit node_modules reach-ins as part of merge | Already resolved: bare specifiers + own package.json; only `tsc` borrowed at dev-time | `package.json:1-25`; `executor-config.ts:5` | 1 |
| Direction A (14 requires) as the primary merge risk | Loud `MODULE_NOT_FOUND` at load; the 50 silent string literals are the real exposure | `compile-command-contracts.cjs:15-288` | 2 |
| Inline `review-research-paths.cjs` into system-deep-loop during merge | Intentional single-source seam; duplicating reintroduces drift the re-export was designed to prevent | `artifact-root.cjs:5-9` | 3 |
| Migration is uniform across all surfaces | Tiered: 2 automated guards (advisor drift-guard + contract drift) gate routing/contract; prose in `.claude/agents` mirror + cross-skill docs is ungated | `mode-registry.json:16`; `aliases.ts:109` | 4 |
| Wire `fallback-router.ts` during the merge | Out of scope (read-only phase) + moving-target conflict surface + approval-guard rejects unapproved MiMo swaps anyway | `spec.md:69-75`; `fallback-router.ts:411-420` | 5 |

---

## 8. Recommendations

1. **Merge child 002 (hub-rename + runtime-nesting):** preserve nesting depth (`skills/system-deep-loop/lib/<pkg>/`); migrate `mode-registry.json` + the 3 command entry-point paths + the runtime's `graph-metadata.json` as the keystone set.
2. **Repair Direction B first via `check-contract-drift.cjs`:** migrate the drift-checker's path table first, then use it as the gate for the ~50 string literals in `compile-command-contracts.cjs`. This converts the silent class into a gated class.
3. **Atomic advisor migration:** update `mode-registry.json` `"skill"` field AND `aliases.ts` `MERGED_DEEP_SKILL_ID` + projection maps in one commit; run `routing-registry-drift-guard.vitest.ts` immediately after.
4. **Grep-completeness pass** for ungated prose: `rg -l 'deep-loop-runtime|deep-loop-workflows' .opencode .claude` excluding specs/changelogs. Pay special attention to `.claude/agents/` mirror.
5. **Do NOT inline `review-research-paths.cjs`** or wire `fallback-router.ts` — both are intentional/preserved through the merge.
6. **Track fallback-router wiring as a post-merge follow-up** (after child 002/003): registry bridge + retry hook + approval-payload field.

---

## 9. Open Questions

None remaining for this lineage. The 5 key questions (structural layout, coupling repair, tooling-borrow, reference migration, fallback-router wiring) are all answered with evidence. Cross-lineage synthesis (via `fanout-merge.cjs`) will reconcile this lineage's findings with the other 19 replicas.

---

## 10. Genuinely New Risks (beyond prior Plan-agent design)

- **SC-003 flag:** The 50 **silent** string-literal class in `compile-command-contracts.cjs` is a finer-grained risk than the spec's "reference migration" prose captures. The spec treats migration as a single surface; this lineage proves it is two breakage classes (loud requires + silent literals) with different mitigation strategies.
- The **coupled-pair atomic-migration constraint** (registry + advisor maps, gated by drift-guard) is an explicit ordering constraint not stated in child 002/003's plans — they should sequence the registry + advisor-map update as one atomic commit.
- The **approval-guard semantic** (router rejects unapproved MiMo swaps) means even a post-merge wiring effort needs a new executors-payload field, not just a router call — a detail absent from the spec's fallback risk row.

---

## 11. Convergence Report

```
CONVERGENCE REPORT
------------------
Stop reason: converged (5/5 questions answered) + maxIterationsReached (5/5)
Iterations completed: 5
Questions answered: 5/5
Average newInfoRatio trend: [1.0, 0.85, 0.55, 0.6, 0.45]
Composite stop score: 0.35 (entropy-driven hard stops override composite)
Signals:
  Rolling Avg (w=0.30): CONTINUE (0.533 > 0.05)
  MAD Noise (w=0.35): CONTINUE (latest 0.45 > floor 0.222)
  Entropy (w=0.35): STOP (5/5 = 1.0 >= 0.85)
Legal-stop gates: pass (key question coverage 5/5, convergence, evidence density)
Graph gates: not_applicable (no graphEvents consumed by graph convergence)
```

---

## 12. References

- `.opencode/skills/deep-loop-runtime/` — package.json, graph-metadata.json, lib/deep-loop/{executor-config,artifact-root,fallback-router}.ts, scripts/{compile-command-contracts,check-contract-drift,render-command-contract,fanout-run,fanout-pool}.cjs
- `.opencode/skills/deep-loop-workflows/` — mode-registry.json, SKILL.md, graph-metadata.json, deep-ai-council/scripts/orchestrate-{session,topic}.cjs, deep-{research,review}/scripts/{reduce-state,runtime-capabilities}.cjs, deep-improvement/scripts/shared/improvement-journal.cjs
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/{aliases,explicit,lexical,fusion}.ts`
- `.opencode/commands/deep/{research,review,ai-council}.md`
- `.opencode/agents/` + `.claude/agents/` (10 agent files)
- Iteration files: `iterations/iteration-001.md` … `iteration-005.md`

*Note: `resource-map.md` was not present at init; no coverage gate applied.*
