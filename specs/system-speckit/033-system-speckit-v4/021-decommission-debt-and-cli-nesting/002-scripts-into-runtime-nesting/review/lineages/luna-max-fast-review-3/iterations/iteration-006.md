# Iteration 006 — Maintainability: test boundary and generated output

## Focus

Audit the post-move test entrypoints, Vitest project roots, and generated
`dist/` assumptions for commands that cannot reproduce a clean checkout.

## Sources reviewed

- `runtime/cli/tests/README.md`
- `runtime/cli/package.json`
- root `package.json`
- `vitest.config.ts`
- `runtime/vitest.config.ts`
- `runtime/scripts/run-tests.mjs`
- `runtime/cli/tests/validation-engine-coherence.vitest.ts`

## Findings

### F011 — P1: Test README commands resolve test paths from the wrong cwd

- **Evidence:** `runtime/cli/tests/README.md:70-80` says to run from the
  repository root, then invokes `npx --prefix
  .opencode/skills/system-spec-kit/runtime/cli vitest run
  tests/test-integration.vitest.ts` without changing directory or passing an
  absolute/skill-root-relative test path.
- **Impact:** `--prefix` selects the npm installation prefix; it does not
  change the process working directory. From the stated repository-root cwd,
  `tests/test-integration.vitest.ts` is resolved outside `runtime/cli/tests`,
  so the documented targeted command cannot select the intended test file.
  This makes the prescribed regression path non-reproducible after the move.
- **Severity:** P1 because the packet's test instructions are an operational
  verification path and fail at test discovery.
- **Proof:** direct comparison of the README's stated cwd, command operands,
  and the live test path under `runtime/cli/tests/`.

### F012 — P1: CLI Vitest runs before the build that supplies its imported dist

- **Evidence:** `runtime/cli/package.json:18-20` runs the Vitest project first
  and only invokes `npm run build` in the subsequent `test:legacy` command.
  `runtime/cli/tests/validation-engine-coherence.vitest.ts:176-180` imports
  `../../dist/lib/validation/orchestrator.js` directly.
- **Impact:** A clean checkout with no generated `runtime/cli/dist/` cannot
  run the CLI Vitest lane, while a stale dist tree can make it test old
  behavior. The package's own test command therefore has no deterministic
  source-to-test build boundary.
- **Severity:** P1 because the standard workspace test entrypoint is
  incomplete or misleading on a fresh or source-updated checkout.
- **Proof:** package script ordering, the direct generated-output import, and
  the README's statement that `dist/` is generated and gitignored.

## Coverage

- Files reviewed: 7
- New findings: F011, F012
- Resolved findings: none
- Dimension: maintainability

## Next focus

Inspect generated-dist source alignment and wrapper/entrypoint ownership,
including freshness metadata, runtime wrappers, and source-only versus
compiled consumers.

Review verdict: FAIL
