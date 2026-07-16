# Iteration 4: Reference Migration Surface

## Focus

Enumerate the full reference-migration surface across commands, agents, READMEs, advisor corpus, feature_catalog, and manual_testing_playbooks, and assess the risk of incomplete migration.

## Findings

### F4.1 — Six migration tiers, ranked by breakage loudness

| Tier | Surface | Count | Breakage | Risk |
|---|---|---|---|---|
| 1 | Command entry points (`.opencode/commands/deep/*.md`) | 6 files (3 shell to runtime scripts) | LOUD (command fails on invoke) | Low — caught immediately |
| 2 | Agents (`.opencode/agents/` + `.claude/agents/` mirror) | 10 files (5 × 2 runtimes) | SILENT (stale path in prose) | MED — `.claude/agents/` easy to miss |
| 3 | Advisor corpus (scorer maps + graph-metadata) | `aliases.ts`, `explicit.ts` (~40 entries), `lexical.ts`, `fusion.ts`, 2× graph-metadata.json | SILENT then LOUD (drift-guard) | HIGH — routing identity, drift-guard gates |
| 4 | Hub/packet docs (SKILL.md, README.md ×N) | deep-loop-workflows/SKILL.md (8 refs), runtime README/SKILL | SILENT (prose) | Low — cosmetic |
| 5 | Feature_catalog / manual_testing_playbook | 46 refs in runtime MTP + cross-skill playbooks | SILENT (prose) | Low — cosmetic |
| 6 | Compiled contract assets (`commands/deep/assets/compiled/*.contract.md`) | 3 generated files | LOUD (regenerated stale if compiler not migrated) | Low — generator-driven |

### F4.2 — The advisor corpus is the highest-risk, drift-guard-gated tier

`system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109` hardcodes `MERGED_DEEP_SKILL_ID = 'deep-loop-workflows'`. This identity string propagates into:
- `explicit.ts`: ~40 routing entries (`'/deep:start-research-loop': [['deep-loop-workflows', 1.6], ...]`, `'deep research': [['deep-loop-workflows', 1]]`, etc.) — the resolved skill ID for every deep-loop recommendation.
- `lexical.ts:30`: the `'deep-loop-workflows'` keyword list (26 keywords).
- `fusion.ts:501,575,597`: 3 skill-id equality checks for fusion bonuses.

After the rename, `MERGED_DEEP_SKILL_ID` must change to `'system-deep-loop'` and every literal `'deep-loop-workflows'` in these maps must follow. `mode-registry.json` declares a drift-guard (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`) asserting the projection maps stay in sync with the registry — so the registry's `"skill": "deep-loop-workflows"` field AND the projection maps must update atomically or the drift-guard test fails. **This is the gating constraint: the registry and the advisor maps are a coupled pair that must migrate together.**

Note: `deep-loop-runtime` is NOT an advisor-routing target (it's a non-routable backend), so the advisor maps do not carry a `deep-loop-runtime` identity string to migrate. The runtime's advisor surface is only its `graph-metadata.json` (edges + entities that reference `deep-loop-runtime/...` paths), which must be folded into system-deep-loop's metadata.

[SOURCE: aliases.ts:95-109,159; explicit.ts:28-197; lexical.ts:30; fusion.ts:501-597; mode-registry.json:2,16]

### F4.3 — The `.claude/agents/` mirror is a silent-migration trap

Five agent files exist in BOTH `.opencode/agents/` and `.claude/agents/` (orchestrate, ai-council, deep-review, deep-improvement, deep-research). The merge's reference-migration plan (child 003, "external reference migration") must touch BOTH runtime directories. A migration that only updates `.opencode/` leaves the `.claude/agents/` copies with stale `deep-loop-runtime`/`deep-loop-workflows` prose references. These are prose-only (not executable paths in agent frontmatter), so they degrade silently — an agent reading its own description would cite a skill name that no longer exists.

[SOURCE: rg -l deep-loop-runtime|deep-loop-workflows in .opencode/agents + .claude/agents — 10 files]

### F4.4 — `deep-loop-runtime` references concentrate in self-referential docs

Outside specs, the `deep-loop-runtime` token appears most densely in the runtime's OWN docs (manual_testing_playbook: 46 refs, graph-metadata.json: 32, changelog: 22+13, references: 18, README: 11, SKILL.md: 7, feature_catalog: 7). These become internal-to-system-deep-loop after the merge and need a `deep-loop-runtime` → `system-deep-loop` (or intra-skill relative) token pass. The cross-skill references that EXTERNAL consumers maintain (system-code-graph feature_catalog: 11, system-spec-kit playbooks: 8+5, sk-prompt-models: several) are the ones that break OTHER skills' docs if missed.

### F4.5 — Risk-of-incomplete-migration verdict: manageable, gated by two automated guards

Two automated guards bound the risk:
1. **`routing-registry-drift-guard.vitest.ts`** — catches any advisor-map ↔ registry desync. Run after the registry + advisor map update.
2. **`check-contract-drift.cjs`** — catches stale command-contract path references. Run after compiling contracts.

The residual ungated risk is **prose in `.claude/agents/` mirror + cross-skill docs (system-code-graph, system-spec-kit, sk-prompt-models feature_catalog/playbooks)**. These contain the `deep-loop-runtime`/`deep-loop-workflows` token in narrative text that no automated guard checks. A grep-based completeness pass (`rg -l 'deep-loop-runtime|deep-loop-workflows' .opencode .claude` after migration, excluding specs/changelogs) is the manual mitigation.

## Sources Consulted

- `.opencode/commands/deep/*.md` (6 files), `.opencode/agents/` + `.claude/agents/` (10 files)
- `system-skill-advisor/mcp_server/lib/scorer/{aliases,explicit,lexical,fusion}.ts`
- `mode-registry.json:2,16` (drift-guard declaration)
- rg counts across `.opencode` (excluding specs + this lineage)

## Assessment

- **newInfoRatio:** 0.6
- **Novelty justification:** The 6-tier loudness classification and the `.claude/agents/` mirror trap are new; the advisor `MERGED_DEEP_SKILL_ID` identity-propagation finding is a genuine new risk (coupled-pair atomic-migration constraint). Refines Q4 with a concrete mitigation.
- **Confidence:** high (grep + map inspection)

## Reflection

- **What worked:** Ranking tiers by breakage loudness separated the gating constraints (advisor drift-guard) from cosmetic prose.
- **What failed:** Nothing.
- **Ruled out:** The hypothesis that the migration is uniform across all surfaces. It is tiered: 2 automated guards (advisor + contract drift) vs ungated prose (agents mirror + cross-skill docs).

## Recommended Next Focus

Iteration 5: fallback-router.ts — should it be wired for real GLM-5.2 → MiMo-v2.5-Pro fallback given it has zero callers today? Assess the wiring cost, the GLM-5.2 failure modes this fanout is actually exposing, and whether merging changes the calculus.
