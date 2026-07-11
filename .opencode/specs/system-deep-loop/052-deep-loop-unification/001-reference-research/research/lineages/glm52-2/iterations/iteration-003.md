# Iteration 003 — system-spec-kit Tooling-Borrow

**Focus:** Verify the system-spec-kit ⇄ runtime tooling-borrow (Q3) — load-bearing test wiring that 002 §3b explicitly scopes INTO this phase (not 003).
**Status:** complete · **newInfoRatio:** 0.6 · **Lineage:** glm52-2

## Approach
Read `runtime/package.json` + `tsconfig.json` (forward borrow) and grepped `system-spec-kit/` for `deep-loop-runtime` (reverse borrow). Recomputed post-merge paths for each.

## Findings

### F3.1 — Forward borrow (runtime → system-spec-kit tooling) CONFIRMED, "one more .." correct [CONFIRM]
`runtime/package.json:11` script `typecheck`: `"../system-spec-kit/node_modules/.bin/tsc --noEmit …"`. `runtime/tsconfig.json:13` `typeRoots`: `["../system-spec-kit/node_modules/@types"]`. Both currently resolve from `…/skills/deep-loop-runtime/` → `…/skills/system-spec-kit` (one hop). Post-merge runtime is at `…/skills/system-deep-loop/runtime/`, so the target needs `../../system-spec-kit` (two hops). Spec 002 §3 "one more `..`" is exactly right. Both sites must change in lockstep with the `git mv`.
[SOURCE: deep-loop-runtime/package.json:11; tsconfig.json:13; 002/spec.md:90]

### F3.2 — Reverse borrow (system-spec-kit → runtime tests) CONFIRMED, glob expansion correct [CONFIRM]
`system-spec-kit/mcp_server/vitest.config.ts:20` include: `../deep-loop-runtime/tests/**/*.{vitest,test}.ts`. From `mcp_server/`, `../deep-loop-runtime` = `…/skills/deep-loop-runtime`. Post-merge runtime at `…/skills/system-deep-loop/runtime`, so from `mcp_server/` the new glob is `../../system-deep-loop/runtime/tests/**`. Spec 002 §3 "expand target path" is correct. Without this fix, system-spec-kit's single vitest run silently stops discovering ~21 runtime test files (a coverage hole, not a hard failure — vitest tolerates a non-matching glob).
[SOURCE: system-spec-kit/mcp_server/vitest.config.ts:20; 002/spec.md:91]

### F3.3 — CORRECTION: the borrow surface is ~6–8 sites, not "4" [CORRECTION]
Beyond the four the spec names (runtime package.json, runtime tsconfig.json, mcp_server package.json, mcp_server vitest.config.ts), the reverse half includes active code/string sites in system-spec-kit's own test tree:
- `mcp_server/tests/memory-runtime-retention.vitest.ts:9` — live `import … from '../../../deep-loop-runtime/lib/deep-loop/loop-lock.js'`
- `mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:12,28,30,64` — hardcoded regex literals `…/deep-loop-runtime/tests/…`
- `scripts/tests/deep-review-auto-restart-contract.vitest.ts:19` — reads `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` as a workspace string
- `manual_testing_playbook/tooling-and-scripts/graph-degraded-stress-cell-isolation.md:57` — a vitest `include:` glob string in prose

The spec's "4 more hardcoded relative paths" understates the test-file surface. None change the strategy, but the execution file-list must enumerate all of them.
[SOURCE: system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:9; council-playbook-anchor-integrity.vitest.ts:12,28,30,64; scripts/tests/deep-review-auto-restart-contract.vitest.ts:19]

### F3.4 — `memory-runtime-retention.vitest.ts` is an ACTIVE import, not a coverage hole [RISK, raises severity]
002 §6 frames the borrow slipping into the gap as a "silent coverage hole, not a build failure." That framing is accurate for the vitest *glob* (F3.2) but **wrong for the live import** at `memory-runtime-retention.vitest.ts:9`: that test does a static `import … from '../../../deep-loop-runtime/lib/…'`. After a bare `git mv` of runtime without updating this import, the module fails to resolve at *load* time → a hard `npm test` failure in system-spec-kit, not a silent gap. This reinforces that 002's decision to scope the borrow INTO this phase (not 003) is correct, and the fix must be atomic with the move. REQ-003 (`test:council` succeeds) is the right exit gate.
[SOURCE: system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:9; 002/spec.md:107,138]

### F3.5 — The borrow has two distinct natures (tooling vs code) [CLARIFICATION]
Runtime borrows system-spec-kit's *tooling* (tsc binary, @types typeRoots) but no code. system-spec-kit's tests borrow runtime's *code* (loop-lock.ts) but no tooling. The deferred "genuine TS-tooling decoupling" (002 §3 Out of Scope: give runtime its own `typescript`/`@types`) resolves only the tooling half; the test-import half persists until system-spec-kit stops reaching into runtime. Worth recording so a future decoupling packet doesn't assume one fix closes both.
[SOURCE: deep-loop-runtime/package.json:11; tsconfig.json:13; memory-runtime-retention.vitest.ts:9; 002/spec.md:79]

## Key Questions
- Considered: Q3 (tooling-borrow)
- Answered: Q3 — borrow confirmed both directions; correction (F3.3) the site count is ~6–8 not 4; risk (F3.4) raises the live-import severity above "silent hole."

## Ruled Out
- "Defer the borrow to child 003" — explicitly rejected by 002 §3 (load-bearing wiring). The live import in F3.4 makes deferral a hard-break risk, not just a coverage gap. Do NOT move it out of 002.

## Novelty Justification
Moderate novelty (0.6): the borrow specifics and the site-count correction are net-new, but the path-mechanics build on iteration 2's directional reasoning, so overlap is higher than the first two passes.

## Next Focus
Iteration 4: the external reference-migration surface (Q4), especially the highest-risk advisor corpus (constants + divergences ledger + parity tests).
