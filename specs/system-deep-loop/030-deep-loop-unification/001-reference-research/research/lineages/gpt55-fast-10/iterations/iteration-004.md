# Iteration 4: Verify System-Spec-Kit Tooling Borrow

## Focus

Confirm whether the coupling between deep-loop-runtime and system-spec-kit is documentation-only or load-bearing execution wiring.

## Findings

- Child 002 correctly includes the system-spec-kit tooling-borrow in structural scope [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:73].
- The runtime package typecheck script borrows `tsc` from `../system-spec-kit/node_modules/.bin/tsc`, so moving runtime changes executable script paths [SOURCE: .opencode/skills/deep-loop-runtime/package.json:11].
- The runtime TypeScript config borrows `@types` from `../system-spec-kit/node_modules/@types`, so type resolution is path-coupled [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:12].
- system-spec-kit vitest includes deep-loop-runtime tests by relative path, so the reverse side of the borrow also needs repair [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18].
- The coupled vitest include is part of the active system-spec-kit test config, not a stale note [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:20].

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/skills/deep-loop-runtime/package.json`
- `.opencode/skills/deep-loop-runtime/tsconfig.json`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts`

## Assessment

- `newInfoRatio`: 0.70.
- Novelty justification: connected the phase plan to live script, type-root, and test-runner paths that will break if not repaired.
- Confidence: high, because the evidence is in executable package and test configuration files.

## Reflection

This coupling belongs in child 002 rather than child 003 because it affects whether the moved runtime can typecheck and whether system-spec-kit can still run its cross-skill tests.

## Recommended Next Focus

Inventory command, doctor, and agent references because those are executable migration surfaces outside the moved folders.
