# Iteration 4 — The build chain: how consumers resolve compiled shared output

Angle: read shared/package.json + tsconfig, runtime/tsconfig, runtime/cli/tsconfig, system-spec-kit/package.json workspaces, the install step in command-tree-parity.yml; state how a consumer resolves the compiled output and whether CI reproduces that.

Resolution chain observed: shared/package.json `"type": "module"` + exports `./*` -> `./dist/*.js`, explicit `./workspace/repo-root.mjs` -> source file. system-spec-kit root package.json workspaces ["shared","runtime","runtime/cli"]; npm ci at root links `node_modules/@spec-kit/shared` (verified symlink exists locally). runtime/cli/tsconfig paths map `@spec-kit/shared/*` -> `../../shared/*` (SOURCE) for typecheck. runtime/shared -> ../shared/dist symlink.

## Findings

1. **R3-I4-01 (P1) The command-tree-parity CI step builds shared to satisfy a checker that never imports a compiled file — while the real dist consumers in the same tree are never built by it.**
   Claim side: .github/workflows/command-tree-parity.yml:28-34 — comment: "The checkers require @spec-kit/shared, a workspace package that only resolves after an install links it, and its .js subpaths point at the compiled dist, so a bare checkout cannot find the module"; then `npm --prefix .../system-spec-kit ci` + `( cd .../shared && ../node_modules/.bin/tsc --build )`.
   Actual side: the only checker in this workflow (runtime/cli/validate-command-tree-parity.sh -> runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:32) requires `@spec-kit/shared/workspace/repo-root.mjs` — a checked-in, non-compiled source file exported verbatim by the exports map; no `.js` dist subpath is imported by any file the workflow runs (command-scope.cjs imports nothing from shared). Meanwhile the actual dist importers in the same package — spec-gate-core.mjs:54 `../../../../shared/dist/gate-3-classifier.js`, spec-gate-prebind.mjs:25, and the cross-package `system-skill-advisor/mcp-server/dist/mcp-server/lib/policy-plan.js` (spec-gate-core.mjs:32) — are built by neither this workflow's step nor any step it runs.
   Severity: P1 wrong (step builds the wrong artifact for the wrong reason; the true dist consumers are unprovisioned). Recommendation: fix the comment and either drop the shared build from this workflow (the parity checker needs only the install link) or build the artifacts the hooks actually import (shared/dist + advisor dist) where those hooks run.

2. **R3-I4-02 (P1) The mirrors job in spec-kit-check.yml runs the shared-requiring mirror checkers with no install step at all.**
   Claim side: .github/workflows/spec-kit-check.yml `mirrors` job (lines ~46-56) runs `node .../sync-runtime-mirrors.cjs --check`, `sync-agents.cjs --check`, `sync-prompts.cjs --check` after only actions/checkout + setup-node.
   Actual side: each of those does `require('@spec-kit/shared/workspace/repo-root.mjs')` (sync-agents.cjs:19, sync-prompts.cjs:19, sync-runtime-mirrors.cjs:32). Resolution of `@spec-kit/shared` depends on the `node_modules/@spec-kit/shared` symlink that only `npm ci` at `.opencode/skills/system-spec-kit` creates (verified: symlink exists in the local tree exactly there; nowhere else). The mirrors job never runs any npm command, so on a clean checkout the requires cannot resolve and the job can only fail or silently no-op.
   Severity: P1 wrong (CI step does not reproduce the local resolution path; the job cannot pass from a bare checkout). Recommendation: add the same `npm --prefix .opencode/skills/system-spec-kit ci` install to the mirrors job, or document how it is meant to resolve.

3. **R3-I4-03 (P2) CLI is typechecked against shared source but executes against shared dist — two export surfaces for one import.**
   Claim side: runtime/cli/tsconfig.json paths `"@spec-kit/shared/*": ["../../shared/*"]` (typecheck sees source with `verbatimModuleSyntax` shape), while the emitted runtime/cli/dist JS still requires `@spec-kit/shared/...` resolved through node_modules (exports map -> dist).
   Actual side: spec-gate-core.mjs:1049-1051 comments confirm the dist surface differs from source ("The dist build exports only validateSpecFolderBinding/classifyPrompt -- ... are internal to gate-3-classifier.ts and are never exported"). A path mapping to source thus typechecks CLIs against exports that the executed dist does not have, and vice versa. The runtime/tsconfig (no shared paths entry) plus vitest alias (runtime/vitest.config.ts:36-37, `@spec-kit/shared` -> `../shared` source) mean tests run against source while built CLI runs against dist.
   Severity: P2 (divergence seam, not a current break). Recommendation: one declaration — typecheck against the same surface that executes (dist .d.ts via exports), or document paths as a compile-only optimization.

4. **R3-I4-04 (P2) The cli vitest test for the Gate 3 classifier imports the classifier through the `runtime/shared -> ../shared/dist` symlink, so it tests the compiled dist, not the source.**
   Claim side: runtime/cli/tests/gate-3-classifier.vitest.ts:23 imports `'../../shared/gate-3-classifier'`; from runtime/cli/tests that resolves to `runtime/shared/gate-3-classifier` — the symlink (verified `runtime/shared -> ../shared/dist`) — i.e. `shared/dist/gate-3-classifier.js`.
   Actual side: the vitest alias in runtime/vitest.config.ts:36-37 maps the package specifier to source, but relative imports bypass aliases, so this test (the only test of the machine contract) exercises the stale/untracked compiled artifact while every other relative shared test (e.g. chunking-semantic.vitest.ts:10, `'../../shared/chunking'` from runtime/tests, which resolves to `shared/chunking` SOURCE) exercises source. Same module family, two surfaces, chosen by directory, not by intent.
   Severity: P2 wrong (test-harness surface mismatch; coupled to census L4's "stale dist" note — here it is not about freshness reporting but about which file the test loads). Recommendation: change the test import to a package specifier (honored by the source alias) or set it against dist deliberately and document.

## Verified correct (no finding)

- shared/tsconfig.json: composite, rootDir ".", outDir "./dist", excludes `**/*.test.ts` — tests compiled out (census L10 fix holds).
- runtime/tsconfig.json references ../shared; system-spec-kit root tsconfig references all three; `npm ci` at system-spec-kit root + `tsc --build` (spec-kit-check.yml check job lines 29-35) reproduces the dist chain for the check job, and that job does run the shared test glob and the vitest projects after building — the check job is a faithful reproduction.
- The `file:../shared` / `file:../../shared` workspace deps in runtime and runtime/cli package.json are consistent with the root workspaces list; links verified present.
- shared/build script (`tsc --build`) exists and matches the tsconfig; advisor build (mcp-server/package.json:8) correctly builds shared first as a dependency.
- repo-root.mjs (workspace/) is deliberately source-level in the exports map — a design choice matching its "writer anchor" role, not a broken path.

## Open questions

- O6: Which workflow actually provisions `shared/dist` and the advisor `mcp-server/dist` before anything runs the spec-gate hooks? The hooks run at commit/pre-commit time in the operator's checkout (census R6-02/03 recorded the root-resolution copies as boundaries); the dist imports in spec-gate-core.mjs suggest the hooks cannot run from a fresh clone at all without a manual build.
- O7: Is the spec-gate-core.policy-plan import from `system-skill-advisor/mcp-server/dist` (a sibling package's compiled output) covered by any build-order contract, or is it a latent cross-package dist fragility? (Not named in census L6/R2-01 — new surface.)
