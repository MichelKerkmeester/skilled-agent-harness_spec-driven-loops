# Iteration 2: system-spec-kit Tooling Borrow And Runtime Boundary

## Focus

Validate the plan's treatment of runtime dependency self-containment and the remaining TypeScript/test-tooling borrow from `system-spec-kit`.

## Findings

1. The runtime is now self-contained for main runtime dependencies: `package.json` has local dependencies on `better-sqlite3`, `tsx`, and `zod`, plus local `vitest` dev dependency. [SOURCE: .opencode/skills/deep-loop-runtime/package.json:14] [SOURCE: .opencode/skills/deep-loop-runtime/package.json:20]

2. The runtime still borrows TypeScript execution/tooling from `system-spec-kit`: the `typecheck` script calls `../system-spec-kit/node_modules/.bin/tsc`, and `tsconfig.json` resolves `typeRoots` from `../system-spec-kit/node_modules/@types`. [SOURCE: .opencode/skills/deep-loop-runtime/package.json:11] [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:12]

3. The reverse test-discovery half is real: `system-spec-kit/mcp_server` still includes runtime council tests through relative paths in `test:council` and the shared Vitest config. These two paths must move from `../../deep-loop-runtime/...` and `../deep-loop-runtime/...` to the nested runtime path after phase 002. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:31] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:20]

4. The phase plan's decision to repair path depth only, not decouple tooling, is the safest scope split. It explicitly states that bundling decoupling would make merge failure and decoupling failure indistinguishable during validation. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:99]

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/package.json`
- `.opencode/skills/deep-loop-runtime/tsconfig.json`
- `.opencode/skills/system-spec-kit/mcp_server/package.json`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md`

## Assessment

- newInfoRatio: 0.78
- Novelty justification: Confirmed the plan's path repairs are necessary, while refining wording around runtime self-containment versus TypeScript tool borrowing.
- Confidence: High. Evidence comes from active package and config files.

## Reflection

- What worked: Reading both runtime and system-spec-kit ends of the borrow caught the two-way dependency.
- What failed: Older research phrasing that described runtime as wholly dependency-self-contained is now too broad; dependency packages are local, but TS tooling is still borrowed.
- Ruled out: Fully decoupling TypeScript tooling during the structural merge.

## Recommended Next Focus

Audit external reference migration surfaces, especially advisor constants, generated projection hashes, agent mirrors, commands, hooks, and plugin paths.
