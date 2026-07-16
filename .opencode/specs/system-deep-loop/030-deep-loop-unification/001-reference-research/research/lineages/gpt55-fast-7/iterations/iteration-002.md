# Iteration 2: Tooling-Borrow and Command Contract Repair

## Focus

Validate whether the `system-spec-kit` tooling-borrow and command-contract generation paths are correctly scoped into the structural migration.

## Findings

1. The tooling-borrow is bidirectional and must be repaired with the physical move. Runtime typecheck calls `../system-spec-kit/node_modules/.bin/tsc`, and runtime `typeRoots` points at `../system-spec-kit/node_modules/@types`. [SOURCE: file:.opencode/skills/deep-loop-runtime/package.json:11] [SOURCE: file:.opencode/skills/deep-loop-runtime/tsconfig.json:12]
2. `system-spec-kit` also points back into `deep-loop-runtime` for council tests. `test:council` directly includes two runtime integration files, and the vitest config includes `../deep-loop-runtime/tests/**/*.{vitest,test}.ts`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:31] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18]
3. `artifact-root.cjs` is an additional seam: runtime delegates artifact-root resolution to `system-spec-kit/shared/review-research-paths.cjs`. The phase plan's tooling-borrow table is correct, but execution should also smoke this wrapper after the move. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:18]
4. Command contracts depend on old paths through both renderer and drift checker. `/deep:research` shells to `deep-loop-runtime/scripts/render-command-contract.cjs`, while the runtime compiler/drift checker enumerate `deep-loop-workflows` authority sources. [SOURCE: file:.opencode/commands/deep/research.md:9] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/check-contract-drift.cjs:38] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:15]
5. The plan's warning about `WORKSPACE_ROOT` depth repair is valid. Once `compile-command-contracts.cjs` moves under `system-deep-loop/runtime/scripts/`, `__dirname`-relative workspace anchoring changes even if the old string literals are renamed correctly. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:73]

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/package.json`
- `.opencode/skills/deep-loop-runtime/tsconfig.json`
- `.opencode/skills/system-spec-kit/mcp_server/package.json`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts`
- `.opencode/skills/deep-loop-runtime/scripts/check-contract-drift.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs`

## Assessment

- `newInfoRatio`: 0.68
- Novelty justification: confirmed tooling-borrow spans runtime and system-spec-kit and includes both typecheck and test discovery surfaces.
- Confidence: high that these repairs belong in phase 002.

## Reflection

- Worked: reading package/test config showed the silent-coverage failure mode.
- Failed: no command-contract compiled manifest was read in this iteration; regeneration determinism remains a phase-003 verification item.
- Ruled out: deferring the system-spec-kit edits to external reference migration.

## Recommended Next Focus

Validate external reference migration and advisor corpus handling, especially non-obvious surfaces like plugins and routing constants.
