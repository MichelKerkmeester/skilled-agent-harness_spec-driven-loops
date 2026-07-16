# Iteration 2: Bidirectional Path-Coupling Repair

## Focus

Enumerate every bidirectional cross-require and cross-reference between the two skills, classify each by depth-sensitivity, and identify which break silently vs loudly if not repaired during the rename to `system-deep-loop`.

## Findings

### F2.1 — Direction A (workflows → runtime): 14 relative requires, 7 files, 9 seam modules — break LOUDLY

All 14 are `require('(../)+deep-loop-runtime/lib/...')`. They break with `MODULE_NOT_FOUND` at load time — loud, immediate, caught by the first test or script invocation post-merge.

| Source file (workflows) | Seam modules | Depth |
|---|---|---|
| `deep-ai-council/scripts/orchestrate-session.cjs:16-18` | council/{round-state-jsonl, cost-guards, session-state-hierarchy} | `../../../` (3) |
| `deep-ai-council/scripts/orchestrate-topic.cjs:14-18` | council/{multi-seat-dispatch, round-state-jsonl, adjudicator-verdict-scoring, cost-guards, session-state-hierarchy} | `../../../` (3) |
| `deep-review/scripts/reduce-state.cjs:14` | deep-loop/artifact-root | `../../../` (3) |
| `deep-review/scripts/runtime-capabilities.cjs:18` | deep-loop/runtime-capabilities | `../../../` (3) |
| `deep-research/scripts/reduce-state.cjs:15,20` | deep-loop/{artifact-root, continuity-thread} | `../../../` (3) |
| `deep-research/scripts/runtime-capabilities.cjs:18` | deep-loop/runtime-capabilities | `../../../` (3) |
| `deep-improvement/scripts/shared/improvement-journal.cjs:24` | deep-loop/lifecycle-taxonomy | `../../../../` (4) |

Post-merge (runtime content nests at `system-deep-loop/lib/`), these become `../../lib/<pkg>/` (3→2 levels for the `scripts/` files) and `../../../lib/<pkg>/` (4→3 for the `scripts/shared/` file). The skill-name hop (`deep-loop-runtime/`) is removed. **Repair is mechanical: depth + skill-name.** The 4-deep one (`improvement-journal.cjs`) is the only non-uniform case and needs a distinct replacement.

[SOURCE: grep require(../)+deep-loop-runtime across deep-loop-workflows/*.cjs]

### F2.2 — Direction B (runtime → workflows): 1 relative require + ~45 hardcoded string paths — break SILENTLY

This is the dangerous direction. The runtime references workflows content in 3 scripts:

1. **`scripts/render-command-contract.cjs:11`** — `require('../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs')`. Relative require; breaks LOUDLY (`MODULE_NOT_FOUND`).
2. **`scripts/compile-command-contracts.cjs:15-288`** — ~45 hardcoded `.opencode/skills/deep-loop-workflows/...` string paths: `mode-registry.json`, `SKILL.md`, `resolve-injection-mode.cjs`, `progress-record.cjs`, and per-mode config/skill/prompt-pack/reference inventories for deep-ai-council (21 paths), deep-review (7 paths), deep-research (8 paths). These are **string literals**, not requires.
3. **`scripts/check-contract-drift.cjs:40-42`** — 3 hardcoded paths: `mode-registry.json`, hub `SKILL.md`, `resolve-injection-mode.cjs`.
4. **`scripts/fanout-run.cjs:942-943`** — 2 hardcoded paths: `deep-loop-workflows/deep-{review,research}/SKILL.md`.

**The 50 string-literal paths break SILENTLY.** They are only evaluated when a command (`/deep:research`, `/deep:review`, `/deep:ai-council`) fires `render-command-contract.cjs`, or when `fanout-run.cjs` resolves a lineage skill path, or when `check-contract-drift.cjs` runs its drift audit. A rename that updates only the `require()` paths (Direction A) but misses these string literals would leave commands emitting "file not found" errors at invocation time — not at load time. **This is the highest-risk coupling class.**

[SOURCE: grep deep-loop-workflows in deep-loop-runtime/scripts/*.cjs — 50 matches]

### F2.3 — The merge collapses Direction B's require but EXPANDS the string-literal migration

Post-merge, both skills live under `system-deep-loop`. Direction B's relative require (`render-command-contract.cjs:11`) becomes intra-skill (`../shared/rollout/resolve-injection-mode.cjs`), so it simplifies. But the 50 `.opencode/skills/deep-loop-workflows/...` string literals must ALL become `.opencode/skills/system-deep-loop/...` — a 1:1 token replacement, but across ~50 sites in 3 files. This is the bulk of the "reference migration" mechanical work and it concentrates in `compile-command-contracts.cjs`.

Critically, `compile-command-contracts.cjs` is the generator that produces the `deep/assets/compiled/*.contract.md` files consumed by the commands. If the contract compiler's path table is not updated, the compiled contracts regenerate with stale paths and the drift checker (`check-contract-drift.cjs`) will catch it — but only if someone runs it.

### F2.4 — Silent-breakage mitigation: check-contract-drift.cjs is a built-in guard

`check-contract-drift.cjs` already exists and references the very paths that need migration (`mode-registry.json`, hub `SKILL.md`, `resolve-injection-mode.cjs`, `auto_mode_contract.md`). If its own path table is migrated first, running it post-merge serves as a migration-completeness gate: any stale `deep-loop-workflows` literal remaining in `compile-command-contracts.cjs` would surface as a drift. **Recommend: migrate `check-contract-drift.cjs` first, then use it as the gate for the rest of Direction B.**

## Sources Consulted

- `deep-loop-workflows/**/*.cjs` — grep for `require(../)+deep-loop-runtime/`
- `deep-loop-runtime/scripts/*.cjs` — grep for `deep-loop-workflows`
- `fanout-run.cjs:942-943`, `render-command-contract.cjs:11`
- `compile-command-contracts.cjs:15-288`, `check-contract-drift.cjs:40-42`

## Assessment

- **newInfoRatio:** 0.85
- **Novelty justification:** The bidirectional enumeration is new; the silent-vs-loud breakage classification (string literals in compile-command-contracts.cjs) is a genuinely new risk signal not captured by the spec's prose. Refines F1-3 with concrete repair mapping.
- **Confidence:** high (grep + line-level evidence)

## Reflection

- **What worked:** Separating requires (loud) from string literals (silent) surfaced the real risk class.
- **What failed:** Nothing significant.
- **Ruled out:** The hypothesis that Direction A (14 requires) is the primary risk. It is loud and mechanical; Direction B's 50 silent string literals are the real exposure.

## Recommended Next Focus

Iteration 3: The system-spec-kit tooling-borrow residual — quantify what survives the merge (artifact-root re-export seam, tsc borrow, contract-reference inputs) and judge whether merging is net simplification or net risk transfer.
