# Iteration 3: System-Spec-Kit Tooling Borrow And Hidden Seams

## Focus

Verify whether the child 002 plan's four `system-spec-kit` tooling-borrow repairs are complete enough for the post-move validation gates.

## Findings

1. **The four planned tooling-borrow edits are necessary and correctly scoped into phase 002.** `runtime/package.json` borrows `tsc` through `../system-spec-kit/node_modules/.bin/tsc`, `runtime/tsconfig.json` points `typeRoots` at `../system-spec-kit/node_modules/@types`, `system-spec-kit/mcp_server/package.json` runs two runtime council tests through `../../deep-loop-runtime/tests/...`, and `system-spec-kit/mcp_server/vitest.config.ts` includes `../deep-loop-runtime/tests/**/*`. After the runtime nests one level deeper, these paths must move exactly as the plan states. [SOURCE: file:.opencode/skills/deep-loop-runtime/package.json:10] [SOURCE: file:.opencode/skills/deep-loop-runtime/tsconfig.json:12] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:31] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18]
2. **Correction: `artifact-root.cjs` is a load-bearing hidden system-spec-kit seam omitted from the four-file list.** It re-exports `system-spec-kit/shared/review-research-paths.cjs` through a depth-sensitive relative path. After moving from `deep-loop-runtime/lib/deep-loop/` to `system-deep-loop/runtime/lib/deep-loop/`, the path needs one additional `..`; otherwise research/review reducers that import runtime's `artifact-root.cjs` fail at runtime. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:4] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:15]
3. **Correction: `artifact-root.vitest.ts` must move with the seam.** The test compares runtime's re-export with the original `system-spec-kit/shared/review-research-paths.cjs` through `../../../system-spec-kit/...`; after nesting it also needs one more hop. Without this, the runtime suite fails before it can validate the seam. [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts:10]
4. **Correction: `test:council`'s own included `council-playbook-anchor-integrity.vitest.ts` contains hardcoded deep-loop-runtime paths and regexes.** Because `test:council` explicitly includes this file, merely updating the package script's two runtime integration paths is not enough for the phase 002 `test:council` gate. The test's `DEEP_LOOP_RUNTIME_TEST_ROOT`, regexes, and resolver branch must recognize `system-deep-loop/runtime/tests`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:31] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:10] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:27] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:64]
5. **The plan's decision to fix paths without fully decoupling runtime from system-spec-kit remains reasonable.** The runtime has a self-containment guard that rejects production `lib/` and `scripts/` reach-ins to `system-spec-kit/**/node_modules`; it permits matching pinned dependency versions and does not require the package-level typecheck borrow to be removed now. Decoupling the compiler/typeRoots would be a separate behavior/tooling change. [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:1] [SOURCE: file:.opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:66]
6. **Additional system-spec-kit references belong in child 003 unless their tests are part of phase 002 gates.** `memory-runtime-retention.vitest.ts` imports `../../../deep-loop-runtime/lib/deep-loop/loop-lock.js`, and `scripts/tests/deep-review-auto-restart-contract.vitest.ts` reads the old `fanout-run.cjs` path. These are external reference migration work unless 002 chooses to run the full system-spec-kit suite before 003. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:9] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/deep-review-auto-restart-contract.vitest.ts:19]

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/package.json`
- `.opencode/skills/deep-loop-runtime/tsconfig.json`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs`
- `.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/package.json`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/deep-review-auto-restart-contract.vitest.ts`

## Assessment

- `newInfoRatio`: 0.80
- Novelty justification: This pass confirms the four listed borrow edits but adds two phase-002-blocking omissions: `artifact-root` and a `test:council`-included path-integrity test.
- Confidence: High that `artifact-root.cjs` and its test are required; high that `council-playbook-anchor-integrity` affects `test:council`; medium on whether `memory-runtime-retention` must be phase 002 or child 003 because that depends on the chosen verification gate breadth.

## Reflection

- Worked: Following the validation command itself exposed test files that are semantically part of the borrow gate even though they live outside the four-file table.
- Failed: The phrase "tooling-borrow" was too narrow; the actual seam includes both compiler/test wiring and runtime's artifact-root re-export of a system-spec-kit shared resolver.
- Ruled out: Fully decoupling `runtime/` from system-spec-kit TypeScript tooling in this merge; existing self-containment tests show production runtime dependencies are already local, and compiler decoupling is a separate hardening concern.

## Recommended Next Focus

Validate external reference migration completeness across commands, agents, READMEs, hooks, advisor corpus, generated contracts, and graph metadata edges.
