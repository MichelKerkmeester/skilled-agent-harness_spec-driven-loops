# Iteration 3: system-spec-kit Tooling-Borrow Residual

## Focus

Quantify what survives the merge on the system-spec-kit axis (artifact-root re-export seam, tsc borrow, contract-reference inputs), and judge whether merging is net simplification or net risk transfer.

## Findings

### F3.1 — The 117-research "self-contained runtime" P1 is ALREADY DONE for dependencies

As established in F1-2, the runtime ships its own `package.json` with bare specifiers for `zod@4.4.3`, `better-sqlite3@12.10.0`, `tsx@4.22.4`. The "8 deep node_modules reach-ins" from 117-improvement-research no longer exist. The merge inherits an already-self-contained dependency story.

[SOURCE: deep-loop-runtime/package.json:14-21; grep bare specifiers in lib/]

### F3.2 — Three system-spec-kit couplings survive the merge, all depth-invariant and intentional

These are NOT eliminated by the merge because they are cross-skill *content* dependencies, not dependency-graph parasitism:

1. **`artifact-root.cjs` re-export seam** (`lib/deep-loop/artifact-root.cjs:17-18`): `require(../../../system-spec-kit/shared/review-research-paths.cjs)`. The header comment explicitly states this is intentional single-source-of-truth: *"The single implementation continues to live in system-spec-kit; the runtime owns the seam so deep-loop consumers depend on the backend rather than reaching across into another skill. Re-export keeps the resolver a single source of truth (no second copy to drift)."* This is a *deliberate* coupling. Depth-invariant: from `system-deep-loop/lib/deep-loop/` → `../../../system-spec-kit/` is still 3 levels up to `.opencode/skills/`.

2. **`tsc` binary borrow** (`package.json:11`): `typecheck` script uses `../system-spec-kit/node_modules/.bin/tsc`. Dev-time only; not a runtime require. Survives the merge unchanged (depth-stable).

3. **Contract-reference inputs** (`compile-command-contracts.cjs:14`, `check-contract-drift.cjs:39`): reference `system-spec-kit/references/workflows/auto_mode_contract.md` and `system-spec-kit/shared/gate-3-classifier.ts`. These are content inputs to contract compilation; depth-stable string paths.

**Verdict: the merge is NEUTRAL on the system-spec-kit axis.** It neither creates nor removes these three couplings. They are intentional seams designed to be depth-stable.

[SOURCE: artifact-root.cjs:5-9,17-18; package.json:11; compile-command-contracts.cjs:14; check-contract-drift.cjs:39]

### F3.3 — The merge IS net simplification on the workflows↔runtime coupling axis

This is where the merge pays off. Pre-merge:
- 14 cross-skill `require()` (workflows → runtime) + 1 cross-skill `require()` (runtime → workflows) = 15 cross-skill import edges.
- 50 cross-skill string-literal content references (runtime → workflows).

Post-merge (both under `system-deep-loop`):
- All 15 `require()` become intra-skill (the sibling-skill dependency edge disappears for the import layer).
- The 50 string literals still need the skill-name token replacement (`deep-loop-workflows` → `system-deep-loop`), but the *coupling class* downgrades from cross-skill to intra-skill.

**Net judgment: merging collapses the workflows↔runtime axis from cross-skill to intra-skill (a genuine simplification) while remaining neutral on the system-spec-kit axis.** It is not a risk transfer — the system-spec-kit seams were already designed to be depth-stable and intentional.

### F3.4 — The artifact-root seam has a subtle merge consideration: single-writer contract

`review-research-paths.cjs` lives in `system-spec-kit/shared/`. Both deep-loop-runtime AND deep-loop-workflows' own `reduce-state.cjs` scripts import it (via the runtime's artifact-root.cjs re-export). After the merge, `system-deep-loop` still depends on system-spec-kit for this contract. This is *correct*: the artifact-topology resolver is genuinely shared across research/review/context modes and should not be duplicated. The merge should NOT inline `review-research-paths.cjs` into system-deep-loop — doing so would create a drift-prone second copy. The seam stays.

[SOURCE: review-research-paths.cjs:1-53; artifact-root.cjs:5-9]

## Sources Consulted

- `system-spec-kit/shared/review-research-paths.cjs:1-53`
- `deep-loop-runtime/lib/deep-loop/artifact-root.cjs:1-19`
- `deep-loop-runtime/package.json:1-25`
- `deep-loop-runtime/scripts/{compile-command-contracts,check-contract-drift,render-command-contract}.cjs`

## Assessment

- **newInfoRatio:** 0.55
- **Novelty justification:** Mixed new + confirmation. The depth-invariance proof and the "net simplification on one axis, neutral on the other" verdict are new analysis; the bare-specifier finding is confirmation/refinement of F1-2. Adds the single-writer-contract insight (do NOT inline the seam).
- **Confidence:** high (code-level evidence)

## Reflection

- **What worked:** Treating the system-spec-kit coupling as a separate axis from the workflows↔runtime coupling produced a clear two-axis verdict.
- **What failed:** Nothing.
- **Ruled out:** Inlining `review-research-paths.cjs` into system-deep-loop during the merge. It is an intentional single-source-of-truth seam; duplicating it reintroduces the drift the re-export was designed to prevent.

## Recommended Next Focus

Iteration 4: The full reference-migration surface — commands (3 entry points), agents (.opencode/agents + .claude/agents), READMEs (skills/ + skills/README.md), advisor corpus (graph-metadata.json ×2 + advisor projection maps), feature_catalog, manual_testing_playbook — and the risk of incomplete migration.
