# Iteration 1: Structural Layout — Where Does Each Component Land?

## Focus

Map the full structural layout of both skills, classify what folds where under `system-deep-loop`, and verify the merge is mechanically safe (no orphaned entry points, no path-depth assumptions that silently break).

## Findings

### F1.1 — Two skills today, one identity after merge

`deep-loop-workflows` (hub) and `deep-loop-runtime` (frozen MCP-free backend) are siblings under `.opencode/skills/`. The merge folds the runtime INTO the workflows skill and renames the combined result `system-deep-loop`.

**Runtime top-level** (16 entries): `SKILL.md`, `README.md`, `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, `lib/`, `scripts/`, `tests/`, `database/`, `references/`, `changelog/`, `feature_catalog/`, `manual_testing_playbook/`, `graph-metadata.json`, `node_modules/`.

**Runtime lib** has 3 sub-packages: `lib/council/` (council primitives), `lib/coverage-graph/` (graph storage/query/signals), `lib/deep-loop/` (executor, atomic-state, fallback-router, etc.).

[SOURCE: bash ls; .opencode/skills/deep-loop-runtime/]

### F1.2 — The node_modules "tooling-borrow" is MOSTLY ALREADY RESOLVED (CRITICAL CORRECTION to 117-research)

The spec.md and prior 117-improvement-research describe the runtime as "parasitic on system-spec-kit's internal node_modules" via "8 deep reach-ins." **That is now STALE.** The runtime ships its own `package.json` (`@deep-loop/runtime` v1.0.0) pinning `better-sqlite3@12.10.0`, `tsx@4.22.4`, `zod@4.4.3`, `vitest@4.1.9`. The lib now uses **bare specifiers** (`import { z } from 'zod'`, `import Database from 'better-sqlite3'`) — verified at `executor-config.ts:5`, `prompt-pack.ts:4`, `coverage-graph-db.ts:9`, `coverage-graph-signals.ts:3`, `council-graph-db.ts:6`.

[SOURCE: deep-loop-runtime/package.json:1-25; grep bare specifiers]

The ONLY remaining system-spec-kit node_modules dependency is the `tsc` binary borrowed via `../system-spec-kit/node_modules/.bin/tsc` in the `typecheck` npm script (`package.json:11`). This is a dev-time borrow, not a runtime require.

### F1.3 — The residual system-spec-kit coupling is path-based, not dependency-based

After the merge, 3 path-based couplings to system-spec-kit remain inside the runtime:

1. **`lib/deep-loop/artifact-root.cjs:18`** — re-exports `../../../system-spec-kit/shared/review-research-paths.cjs`. Single source of truth for `resolveArtifactRoot`/`allocateShortSubfolder`.
2. **`scripts/compile-command-contracts.cjs:14,491`** — references `system-spec-kit/references/workflows/auto_mode_contract.md` and `system-spec-kit/shared/gate-3-classifier.ts` (contract compilation inputs).
3. **`scripts/check-contract-drift.cjs:39`** — references the same `auto_mode_contract.md`.

These are sibling-skill content references, NOT node_modules reach-ins. Their path depth (`../../../system-spec-kit/` from `lib/deep-loop/`) is **depth-invariant** to the merge: whether the file lives at `deep-loop-runtime/lib/deep-loop/` or `system-deep-loop/lib/deep-loop/`, both are 3 levels below `.opencode/skills/`, so `../../../system-spec-kit/` resolves identically. **This coupling does NOT need repair for the rename.**

[SOURCE: artifact-root.cjs:17-18; compile-command-contracts.cjs:14; check-contract-drift.cjs:39]

### F1.4 — The merge IS mechanically safe IF nesting depth is preserved

The runtime's path couplings fall into two classes:
- **Depth-invariant** (to system-spec-kit): stable across rename because both old and new homes sit at the same `skills/<skill>/lib/deep-loop/` depth.
- **Depth-sensitive** (workflows → runtime cross-requires): MUST be repaired (see Iteration 2).

The runtime carries its own `node_modules/`, `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, and `database/` (SQLite). All of these move together as a unit. There are **no orphaned entry points** — every `scripts/*.cjs` is invoked either from a `deep/*` command (3 files) or from the `*_auto.yaml` workflows (4 coverage-graph scripts).

### F1.5 — mode-registry.json is the merge keystone

`deep-loop-workflows/mode-registry.json` declares 7 workflowModes across 3 `backendKind` values. After the rename to `system-deep-loop`, this registry's prose (`"consumed by deep-loop-runtime/scripts/convergence.cjs"` at line 7, 20) and the hub `SKILL.md` references all need the new skill name. The registry's `backendKind: runtime-loop-type` discriminator points at the runtime by *role*, not by path, so the routing logic itself is name-agnostic — but every prose reference and the 3 command entry points (`deep/{research,review,ai-council}.md`) shell out to `node .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs`, which is a HARDCODED path that MUST change.

[SOURCE: mode-registry.json:7,20; .opencode/commands/deep/research.md:9]

## Sources Consulted

- `deep-loop-runtime/` directory listing, `package.json`, `graph-metadata.json`
- `deep-loop-workflows/mode-registry.json`, `SKILL.md`
- `lib/deep-loop/artifact-root.cjs`, `executor-config.ts`, `prompt-pack.ts`
- `.opencode/commands/deep/{research,review,ai-council}.md`
- grep across both skills for `system-spec-kit` and `deep-loop-runtime` references

## Assessment

- **newInfoRatio:** 1.0
- **Novelty justification:** First broad pass; all structural findings are new to this packet. Most significant is the correction that the node_modules borrow is already resolved (117-research stale), which materially changes the merge risk profile.
- **Confidence:** high (file-system + grep evidence)

## Reflection

- **What worked:** Enumerating the actual import styles (bare specifiers vs reach-ins) corrected a stale assumption before it propagated into the synthesis.
- **What failed:** The ripgrep `-o` flag with a custom type-add produced help text instead of matches; recovered with the Grep tool.
- **Ruled out:** The hypothesis that the merge requires resolving 8 node_modules reach-ins. That work was already done.

## Recommended Next Focus

Iteration 2: Enumerate every bidirectional cross-require between the two skills, classify each by depth-sensitivity, and identify which break silently vs loudly if not repaired during the rename.
