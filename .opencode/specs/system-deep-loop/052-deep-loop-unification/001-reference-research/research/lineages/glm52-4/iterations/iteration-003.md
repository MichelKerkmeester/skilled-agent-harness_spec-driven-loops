# Iteration 003 - system-spec-kit Tooling-Borrow And The artifact-root.cjs Seam

## Focus

Validate the 002 Stage-3b tooling-borrow repair (package.json/tsconfig) and determine whether `artifact-root.cjs`'s OWN internal `path.join` — and its tests — survive the repair table.

## Findings

1. The 002 Stage-3b table's two listed repairs are correct and necessary: `runtime/package.json` typecheck `../system-spec-kit/node_modules/.bin/tsc` and `runtime/tsconfig.json` typeRoots `["../system-spec-kit/node_modules/@types"]` are both 1-hop relative. Nesting `runtime/` one level deeper under `system-deep-loop/` means both must become 2-hop (`../../system-spec-kit/...`). Keeping these in Stage 3b (not deferring to 003) is right because they gate the physical-move validation. [SOURCE: .opencode/skills/deep-loop-runtime/package.json:14] [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:13-15] [SOURCE: 002/plan.md Stage 3b]

2. NEW P0 — `artifact-root.cjs`'s OWN internal re-export is a missed load-bearing seam. Line 18 is `path.join(__dirname, '..', '..', '..', 'system-spec-kit', 'shared', 'review-research-paths.cjs')` (3 hops from `lib/deep-loop/`). 002 repairs the CONSUMERS of artifact-root.cjs (`reduce-state.cjs` requires it — Class B) but never the file itself. After nesting, `__dirname` becomes `system-deep-loop/runtime/lib/deep-loop`; 3 hops lands at `system-deep-loop/system-spec-kit/shared/...` which does NOT exist (system-spec-kit is a sibling, not a child). It needs a 4th `..`. This is production code on every graph-backed reducer's hot path, so a miss breaks `resolveArtifactRoot` at runtime. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:17-18] [SOURCE: rg artifact-root in 002/ — only the consumer line 82, never the file itself]

3. The artifact-root seam has TWO test-file companions, also absent from 002, that break for the same depth reason: `artifact-root.vitest.ts:11` `SPEC_KIT_ORIGINAL = '../../../system-spec-kit/shared/review-research-paths.cjs'` (needs 4 hops) and `dependency-seams.vitest.ts:17` `const skillsRoot = resolve(runtimeRoot, '..')` (currently lands at `skills/`; after nesting lands at `system-deep-loop/`, so the "never resolves through a sibling skill" assertion's setup path is wrong — it needs `resolve(runtimeRoot,'..','..')`). The runtime's self-containment property still holds (its own `node_modules/` travels inside `runtime/`), but these two tests' path setup breaks. [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts:11] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:16-17]

4. The runtime's other system-spec-kit references are ABSOLUTE repo-root paths (`.opencode/skills/system-spec-kit/...`) in `check-contract-drift.cjs:39`, `compile-command-contracts.cjs:14,491`. Because system-spec-kit does NOT move, these are correctly UNCHANGED — a useful contrast proving the seam class is specifically "relative path to a stationary sibling", which is exactly what deepens by one hop. [SOURCE: check-contract-drift.cjs:39] [SOURCE: compile-command-contracts.cjs:14]

## Ruled Out

- Decoupling runtime TS tooling from system-spec-kit in this phase — 002 explicitly defers it (a decoupling failure would be indistinguishable from a merge failure during validation). Correct call.
- Assuming the runtime's own `node_modules` self-containment breaks on the move — it travels inside `runtime/`, so `dependency-seams`'s self-containment assertion stays valid; only its `skillsRoot` setup path is wrong.

## Next Focus

Iteration 4: Quantify the full external reference-migration surface (commands/agents/READMEs/advisor-corpus) and the advisor's hardcoded-projection re-baseline risk.
